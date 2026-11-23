import { GoogleGenAI, Type } from '@google/genai';

export const GEMINI_MODEL = 'gemini-4-hydrogen';

const MAX_SUBJECT_LENGTH = 1200;
const MAX_STYLE_LENGTH = 120;
const MAX_IDEA_LENGTH = 1500;
const MAX_META_LENGTH = 120;
const MAX_NOTES_LENGTH = 500;
const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6 MB decoded binary cap
const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Sliding-window in-memory rate limiter per client key (IP)
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 20;
const rateBuckets = new Map<string, number[]>();

export interface GeminiHandlerResult {
  status: number;
  payload: Record<string, unknown>;
  headers?: Record<string, string>;
}

export function resetGeminiRateLimiterForTests(): void {
  rateBuckets.clear();
}

export function checkGeminiRateLimit(
  clientKey: string,
  maxRequests = RATE_MAX_REQUESTS,
  windowMs = RATE_WINDOW_MS
): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const key = (clientKey || 'anon').slice(0, 128);
  const existing = rateBuckets.get(key) || [];
  const recent = existing.filter((ts) => now - ts < windowMs);

  if (recent.length >= maxRequests) {
    const oldest = recent[0];
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    rateBuckets.set(key, recent);
    return { allowed: false, retryAfterSec };
  }

  recent.push(now);
  rateBuckets.set(key, recent);

  // Periodic cleanup to prevent unbounded memory growth
  if (rateBuckets.size > 1000) {
    for (const [k, timestamps] of rateBuckets.entries()) {
      const valid = timestamps.filter((ts) => now - ts < windowMs);
      if (valid.length === 0) {
        rateBuckets.delete(k);
      } else {
        rateBuckets.set(k, valid);
      }
    }
  }

  return { allowed: true };
}

function getValidatedApiKey(): string | null {
  const raw = (process.env.GEMINI_API_KEY || '').trim();
  if (!raw || raw === 'MY_GEMINI_API_KEY') return null;
  return raw;
}

function createAiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function sanitizeShortText(value: unknown, fallback: string, maxLen: number): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLen) : fallback;
}

function parseJsonSafely(rawText: string | undefined): Record<string, unknown> | null {
  const cleaned = (rawText || '').trim();
  if (!cleaned) return null;
  try {
    const parsed = JSON.parse(cleaned);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function extractClientKey(headers: Record<string, unknown> | undefined, remoteAddress?: string): string {
  const forwarded = headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).split(',')[0].trim();
  }
  return remoteAddress || 'anon';
}

export async function handleGeminiEnrich(
  body: Record<string, unknown>,
  clientKey = 'anon'
): Promise<GeminiHandlerResult> {
  const limit = checkGeminiRateLimit(`enrich:${clientKey}`);
  if (!limit.allowed) {
    return {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfterSec || 60) },
      payload: {
        error: 'Demasiadas solicitudes consecutivas. Intenta nuevamente en unos segundos.',
        code: 'RATE_LIMITED',
      },
    };
  }

  const rawSubject = body?.subject;
  if (typeof rawSubject !== 'string' || rawSubject.trim().length === 0) {
    return {
      status: 400,
      payload: {
        error: 'Se requiere una descripción o sujeto inicial.',
        code: 'INVALID_SUBJECT',
      },
    };
  }
  if (rawSubject.trim().length > MAX_SUBJECT_LENGTH) {
    return {
      status: 400,
      payload: {
        error: `La descripción inicial no puede superar los ${MAX_SUBJECT_LENGTH} caracteres.`,
        code: 'SUBJECT_TOO_LONG',
      },
    };
  }

  const subject = rawSubject.trim();
  const mode = body?.mode === 'video' ? 'video' : 'photo';
  const style = sanitizeShortText(body?.style, 'Editorial Contemporáneo', MAX_STYLE_LENGTH);

  const apiKey = getValidatedApiKey();
  if (!apiKey) {
    return {
      status: 503,
      payload: {
        error: 'El servicio de asistencia creativa con Gemini no está habilitado en este entorno.',
        code: 'SERVICE_UNAVAILABLE',
      },
    };
  }

  const systemInstruction = `Eres un director de arte, cineasta y fotógrafo senior de Núcleo Colectivo.
Tu tarea es tomar una idea o sujeto fotográfico/audiovisual breve o genérico y enriquecerlo con detalles sensoriales, texturas físicas de materiales, atmósfera, matices de iluminación y contexto espacial coherente.
Evita clichés de IA (como "cyberpunk neon glow", piel plástica o descripciones vacías).
Produce una respuesta en español enriquecida con vocabulario de dirección de arte, óptica y cinematografía profesional.`;

  const promptText = `Enriquece este sujeto para un prompt de ${
    mode === 'video' ? 'video cinematográfico' : 'fotografía artística / publicitaria'
  }:
Sujeto original: "${subject}"
Estilo o tono deseado: "${style}"

Devuelve un JSON con:
1. "enrichedDescription": La descripción ampliada y precisa (2-3 oraciones densas con texturas, materiales, contexto y acción natural).
2. "visualCues": Lista de 3 a 5 palabras clave de texturas o detalles físicos que el modelo de IA debe respetar.
3. "lightingAdvice": Recomendación específica de dirección de luz para este sujeto.`;

  try {
    const response = await createAiClient(apiKey).models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enrichedDescription: {
              type: Type.STRING,
              description: 'Descripción enriquecida con texturas y dirección de arte.',
            },
            visualCues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Claves visuales y texturas recomendadas.',
            },
            lightingAdvice: {
              type: Type.STRING,
              description: 'Recomendación de luz para la escena.',
            },
          },
          required: ['enrichedDescription', 'visualCues', 'lightingAdvice'],
        },
      },
    });

    const parsed = parseJsonSafely(response.text);
    if (!parsed) {
      return {
        status: 502,
        payload: {
          error: 'No se recibió una respuesta estructurada válida del servicio de IA.',
          code: 'INVALID_UPSTREAM_RESPONSE',
        },
      };
    }

    return { status: 200, payload: parsed };
  } catch (error) {
    console.error('[gemini/enrich] Error procesando solicitud:', error);
    return {
      status: 502,
      payload: {
        error: 'No fue posible enriquecer la escena en este momento. Intenta de nuevo más tarde.',
        code: 'UPSTREAM_ERROR',
      },
    };
  }
}

export async function handleGeminiAnalyzeStyle(
  body: Record<string, unknown>,
  clientKey = 'anon'
): Promise<GeminiHandlerResult> {
  const limit = checkGeminiRateLimit(`analyze:${clientKey}`);
  if (!limit.allowed) {
    return {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfterSec || 60) },
      payload: {
        error: 'Demasiadas solicitudes consecutivas. Intenta nuevamente en unos segundos.',
        code: 'RATE_LIMITED',
      },
    };
  }

  const rawImage = body?.imageBase64;
  if (typeof rawImage !== 'string' || rawImage.trim().length === 0) {
    return {
      status: 400,
      payload: {
        error: 'Se requiere una imagen de referencia en formato base64.',
        code: 'MISSING_IMAGE',
      },
    };
  }

  const mimeType = sanitizeShortText(body?.mimeType, 'image/jpeg', 64).toLowerCase();
  if (!ALLOWED_IMAGE_MIMES.has(mimeType)) {
    return {
      status: 400,
      payload: {
        error: 'Formato de imagen no permitido. Usa únicamente JPEG, PNG o WebP.',
        code: 'UNSUPPORTED_MIME_TYPE',
      },
    };
  }

  const cleanBase64 = (rawImage.includes(',') ? rawImage.split(',')[1] : rawImage)
    .replace(/\s+/g, '');

  if (!cleanBase64 || !/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
    return {
      status: 400,
      payload: {
        error: 'La imagen enviada no contiene datos base64 válidos.',
        code: 'INVALID_BASE64',
      },
    };
  }

  const estimatedBytes = Math.floor((cleanBase64.length * 3) / 4);
  if (estimatedBytes > MAX_IMAGE_BYTES) {
    return {
      status: 413,
      payload: {
        error: 'La imagen supera el límite máximo permitido de 6 MB.',
        code: 'IMAGE_TOO_LARGE',
      },
    };
  }

  const notes = sanitizeShortText(body?.notes, '', MAX_NOTES_LENGTH);

  const apiKey = getValidatedApiKey();
  if (!apiKey) {
    return {
      status: 503,
      payload: {
        error: 'El análisis de estilo visual con Gemini no está habilitado en este entorno.',
        code: 'SERVICE_UNAVAILABLE',
      },
    };
  }

  const systemInstruction = `Eres un director de fotografía y analista de estética visual de Núcleo Colectivo.
Analiza ÚNICAMENTE la fotografía de referencia para extraer su estilo visual reutilizable en formato JSON técnico.
Reglas estrictas de honestidad técnica:
1. Describe lo que es observable en la imagen (dirección de luz, contraste, paleta cromática, encuadre, textura, nitidez y desenfoque aparente).
2. No inventes datos EXIF ocultos como hechos comprobados; expresa el equivalente óptico y de cámara como "apariencia estética equivalente" (por ejemplo: "focal equivalente estimada ~85mm por compresión de perspectiva").
3. Separa el ESTILO VISUAL de la IDENTIDAD del sujeto: nunca incluyas rasgos personales, género, edad o vestimenta específica de la persona retratada dentro de los parámetros de estilo, para que el JSON pueda aplicarse conservando la identidad de cualquier otra fotografía.
4. Responde siempre en español claro y técnico.`;

  const promptText = `Analiza esta imagen de referencia y devuelve un JSON estructurado con su perfil fotográfico y de dirección de arte.${
    notes ? ` Nota adicional del usuario: "${notes}".` : ''
  }`;

  try {
    const response = await createAiClient(apiKey).models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        { text: promptText },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            style_name: { type: Type.STRING },
            category: { type: Type.STRING },
            photography: { type: Type.STRING },
            camera: { type: Type.STRING },
            lens: { type: Type.STRING },
            aperture: { type: Type.STRING },
            lighting: { type: Type.STRING },
            composition: { type: Type.STRING },
            color: { type: Type.STRING },
            focus: { type: Type.STRING },
            depth_of_field: { type: Type.STRING },
            texture: { type: Type.STRING },
            atmosphere: { type: Type.STRING },
            background: { type: Type.STRING },
            post_processing: { type: Type.STRING },
            observable_notes: { type: Type.STRING },
            preservation: {
              type: Type.OBJECT,
              properties: {
                keep_subject_identity: { type: Type.BOOLEAN },
                keep_facial_features: { type: Type.BOOLEAN },
                keep_natural_pose: { type: Type.BOOLEAN },
              },
              required: ['keep_subject_identity', 'keep_facial_features', 'keep_natural_pose'],
            },
          },
          required: [
            'style_name',
            'category',
            'photography',
            'camera',
            'lens',
            'aperture',
            'lighting',
            'composition',
            'color',
            'focus',
            'depth_of_field',
            'texture',
            'atmosphere',
            'background',
            'post_processing',
            'observable_notes',
            'preservation',
          ],
        },
      },
    });

    const parsed = parseJsonSafely(response.text);
    if (!parsed) {
      return {
        status: 502,
        payload: {
          error: 'No se recibió un perfil de estilo JSON válido desde el servicio de IA.',
          code: 'INVALID_UPSTREAM_RESPONSE',
        },
      };
    }

    return { status: 200, payload: parsed };
  } catch (error) {
    console.error('[gemini/analyze-style] Error analizando imagen:', error);
    return {
      status: 502,
      payload: {
        error: 'No se pudo analizar la imagen en este momento. Verifica el archivo e intenta nuevamente.',
        code: 'UPSTREAM_ERROR',
      },
    };
  }
}

export async function handleGeminiDirectFilm(
  body: Record<string, unknown>,
  clientKey = 'anon'
): Promise<GeminiHandlerResult> {
  const limit = checkGeminiRateLimit(`direct:${clientKey}`);
  if (!limit.allowed) {
    return {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfterSec || 60) },
      payload: {
        error: 'Demasiadas solicitudes consecutivas. Intenta nuevamente en unos segundos.',
        code: 'RATE_LIMITED',
      },
    };
  }

  const rawIdea = body?.idea;
  if (typeof rawIdea !== 'string' || rawIdea.trim().length === 0) {
    return {
      status: 400,
      payload: {
        error: 'Describe la idea del proyecto audiovisual.',
        code: 'INVALID_IDEA',
      },
    };
  }
  if (rawIdea.trim().length > MAX_IDEA_LENGTH) {
    return {
      status: 400,
      payload: {
        error: `La idea audiovisual no puede superar los ${MAX_IDEA_LENGTH} caracteres.`,
        code: 'IDEA_TOO_LONG',
      },
    };
  }

  const idea = rawIdea.trim();
  const format = sanitizeShortText(body?.format, 'Cortometraje / Video 30s', MAX_META_LENGTH);
  const tone = sanitizeShortText(body?.tone, 'Documental Poético y Contemporáneo', MAX_META_LENGTH);
  const rawDur = Number(body?.durationSeconds ?? 30);
  const durationSeconds = Number.isFinite(rawDur)
    ? Math.max(5, Math.min(300, Math.round(rawDur)))
    : 30;

  const apiKey = getValidatedApiKey();
  if (!apiKey) {
    return {
      status: 503,
      payload: {
        error: 'El servicio de dirección audiovisual con Gemini no está habilitado en este entorno.',
        code: 'SERVICE_UNAVAILABLE',
      },
    };
  }

  const systemInstruction = `Eres un Director Cinematográfico, Director de Fotografía, Diseñador Sonoro y Productor Creativo senior de Núcleo Colectivo.
A partir de una idea breve del usuario, diseñas un proyecto audiovisual completo de 8 etapas listo para producir con herramientas de IA de imagen, video, voz y sonido.
Reglas:
1. Evita clichés vacíos y estereotipos. Prioriza autenticidad cultural, textura física y claridad narrativa.
2. Genera entre 4 y 6 escenas coherentes cuya suma de duraciones coincida aproximadamente con la duración total solicitada.
3. Cada escena debe incluir un prompt de imagen base (para generar el fotograma clave) y un prompt de video específico con un único movimiento de cámara claro.
4. Responde estrictamente en español, salvo los términos técnicos de cámara estándar.`;

  const promptText = `Genera un paquete de producción audiovisual completo para:
Idea: "${idea}"
Formato: "${format}"
Duración objetivo: ${durationSeconds} segundos
Tono estético: "${tone}"`;

  try {
    const response = await createAiClient(apiKey).models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectTitle: { type: Type.STRING },
            concept: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                intention: { type: Type.STRING },
                keyMessage: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
              },
              required: ['theme', 'intention', 'keyMessage', 'targetAudience'],
            },
            script: {
              type: Type.OBJECT,
              properties: {
                logline: { type: Type.STRING },
                narrativeArc: { type: Type.STRING },
                voiceoverOrDialogue: { type: Type.STRING },
              },
              required: ['logline', 'narrativeArc', 'voiceoverOrDialogue'],
            },
            cinematography: {
              type: Type.OBJECT,
              properties: {
                cameraReference: { type: Type.STRING },
                lensStrategy: { type: Type.STRING },
                lightingScheme: { type: Type.STRING },
                colorPaletteHex: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                colorDescription: { type: Type.STRING },
              },
              required: [
                'cameraReference',
                'lensStrategy',
                'lightingScheme',
                'colorPaletteHex',
                'colorDescription',
              ],
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  durationSec: { type: Type.NUMBER },
                  shotSize: { type: Type.STRING },
                  cameraAngle: { type: Type.STRING },
                  cameraMovement: { type: Type.STRING },
                  visualAction: { type: Type.STRING },
                  imageKeyframePrompt: { type: Type.STRING },
                  videoMotionPrompt: { type: Type.STRING },
                  soundCue: { type: Type.STRING },
                },
                required: [
                  'sceneNumber',
                  'title',
                  'durationSec',
                  'shotSize',
                  'cameraAngle',
                  'cameraMovement',
                  'visualAction',
                  'imageKeyframePrompt',
                  'videoMotionPrompt',
                  'soundCue',
                ],
              },
            },
            soundDesign: {
              type: Type.OBJECT,
              properties: {
                musicDirection: { type: Type.STRING },
                ambience: { type: Type.STRING },
                foley: { type: Type.STRING },
                voiceDirection: { type: Type.STRING },
              },
              required: ['musicDirection', 'ambience', 'foley', 'voiceDirection'],
            },
            editingPlan: {
              type: Type.OBJECT,
              properties: {
                rhythm: { type: Type.STRING },
                transitions: { type: Type.STRING },
                colorGradingNotes: { type: Type.STRING },
                exportSpecs: { type: Type.STRING },
              },
              required: ['rhythm', 'transitions', 'colorGradingNotes', 'exportSpecs'],
            },
          },
          required: [
            'projectTitle',
            'concept',
            'script',
            'cinematography',
            'scenes',
            'soundDesign',
            'editingPlan',
          ],
        },
      },
    });

    const parsed = parseJsonSafely(response.text);
    if (!parsed) {
      return {
        status: 502,
        payload: {
          error: 'No se recibió un dossier audiovisual válido del servicio de IA.',
          code: 'INVALID_UPSTREAM_RESPONSE',
        },
      };
    }

    return { status: 200, payload: parsed };
  } catch (error) {
    console.error('[gemini/direct-film] Error generando dossier:', error);
    return {
      status: 502,
      payload: {
        error: 'No se pudo generar el proyecto audiovisual en este momento. Intenta nuevamente.',
        code: 'UPSTREAM_ERROR',
      },
    };
  }
}
