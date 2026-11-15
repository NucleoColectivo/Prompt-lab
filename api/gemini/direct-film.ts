import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta configurar GEMINI_API_KEY en las variables de entorno.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const {
      idea,
      format = 'Cortometraje / Video 30s',
      durationSeconds = 30,
      tone = 'Documental Poético y Contemporáneo',
    } = req.body || {};

    if (!idea || typeof idea !== 'string' || idea.trim() === '') {
      return res.status(400).json({ error: 'Describe la idea del proyecto audiovisual.' });
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
                colorPaletteHex: { type: Type.ARRAY, items: { type: Type.STRING } },
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
    return res.status(200).json(JSON.parse(jsonText));
  } catch (error: any) {
    return res.status(500).json({
      error: 'No se pudo generar el proyecto audiovisual con Gemini.',
      details: error?.message || 'Error desconocido',
    });
  }
}
