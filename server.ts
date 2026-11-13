import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Enrich Subject Description with Creative Direction
app.post('/api/gemini/enrich', async (req: Request, res: Response) => {
  try {
    const { subject, mode = 'photo', style = 'Editorial Contemporáneo' } = req.body;

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      res.status(400).json({ error: 'Se requiere una descripción o sujeto inicial.' });
      return;
    }

    const systemInstruction = `Eres un director de arte, cineasta y fotógrafo senior de Núcleo Colectivo.
Tu tarea es tomar una idea o sujeto fotográfico/audiovisual breve o genérico y enriquecerlo con detalles sensoriales, texturas físicas de materiales, atmósfera, matices de iluminación y contexto espacial coherente.
Evita clichés de IA (como "cyberpunk neon glow", piel plástica o descripciones vacías).
Produce una respuesta en español enriquecida con vocabulario de dirección de arte, óptica y cinematografía profesional.`;

    const promptText = `Enriquece este sujeto para un prompt de ${mode === 'video' ? 'video cinematográfico' : 'fotografía artística / publicitaria'}:
Sujeto original: "${subject}"
Estilo o tono deseado: "${style}"

Devuelve un JSON con:
1. "enrichedDescription": La descripción ampliada y precisa (2-3 oraciones densas con texturas, materiales, contexto y acción natural).
2. "visualCues": Lista de 3 a 5 palabras clave de texturas o detalles físicos que el modelo de IA debe respetar.
3. "lightingAdvice": Recomendación específica de dirección de luz para este sujeto.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
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

    const jsonText = (response.text ?? '{}').trim();
    const result = JSON.parse(jsonText);

    res.json(result);
  } catch (error: any) {
    console.error('Error enriqueciendo sujeto con Gemini:', error);
    res.status(500).json({
      error: 'Error al procesar la solicitud con Gemini.',
      details: error?.message || 'Error desconocido',
    });
  }
});

// Endpoint: Analyze Reference Image and Extract Visual Style JSON (Módulo 07)
app.post('/api/gemini/analyze-style', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', notes = '' } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: 'Se requiere una imagen de referencia en base64.' });
      return;
    }

    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

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

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
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

    const jsonText = (response.text ?? '{}').trim();
    const result = JSON.parse(jsonText);

    res.json(result);
  } catch (error: any) {
    console.error('Error analizando estilo visual con Gemini:', error);
    res.status(500).json({
      error: 'No se pudo analizar la imagen con Gemini.',
      details: error?.message || 'Error desconocido',
    });
  }
});

// Endpoint: AI Film Director — Full 8-Stage Audiovisual Production Dossier
app.post('/api/gemini/direct-film', async (req: Request, res: Response) => {
  try {
    const {
      idea,
      format = 'Cortometraje / Video 30s',
      durationSeconds = 30,
      tone = 'Documental Poético y Contemporáneo',
    } = req.body;

    if (!idea || typeof idea !== 'string' || idea.trim() === '') {
      res.status(400).json({ error: 'Describe la idea del proyecto audiovisual.' });
      return;
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

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
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

    const jsonText = (response.text ?? '{}').trim();
    const result = JSON.parse(jsonText);
    res.json(result);
  } catch (error: any) {
    console.error('Error en AI Film Director:', error);
    res.status(500).json({
      error: 'No se pudo generar el proyecto audiovisual con Gemini.',
      details: error?.message || 'Error desconocido',
    });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
