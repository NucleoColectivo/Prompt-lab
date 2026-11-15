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
    const { imageBase64, mimeType = 'image/jpeg', notes = '' } = req.body || {};

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Se requiere una imagen de referencia en base64.' });
    }

    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const systemInstruction = `Eres un director de fotografía y analista de estética visual de Núcleo Colectivo.
Analiza ÚNICAMENTE la fotografía de referencia para extraer su estilo visual reutilizable en formato JSON técnico.
Reglas estrictas de honestidad técnica:
1. Describe lo que es observable en la imagen (dirección de luz, contraste, paleta cromática, encuadre, textura, nitidez y desenfoque aparente).
2. No inventes datos EXIF ocultos como hechos comprobados; expresa el equivalente óptico y de cámara como "apariencia estética equivalente".
3. Separa el ESTILO VISUAL de la IDENTIDAD del sujeto: nunca incluyas rasgos personales, género, edad o vestimenta específica de la persona retratada dentro de los parámetros de estilo.
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
    return res.status(200).json(JSON.parse(jsonText));
  } catch (error: any) {
    return res.status(500).json({
      error: 'No se pudo analizar la imagen con Gemini.',
      details: error?.message || 'Error desconocido',
    });
  }
}
