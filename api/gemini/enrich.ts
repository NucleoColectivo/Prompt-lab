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
    const { subject, mode = 'photo', style = 'Editorial Contemporáneo' } = req.body || {};

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return res.status(400).json({ error: 'Se requiere una descripción o sujeto inicial.' });
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
            enrichedDescription: { type: Type.STRING },
            visualCues: { type: Type.ARRAY, items: { type: Type.STRING } },
            lightingAdvice: { type: Type.STRING },
          },
          required: ['enrichedDescription', 'visualCues', 'lightingAdvice'],
        },
      },
    });

    const jsonText = (response.text ?? '{}').trim();
    return res.status(200).json(JSON.parse(jsonText));
  } catch (error: any) {
    return res.status(500).json({
      error: 'Error al procesar la solicitud con Gemini.',
      details: error?.message || 'Error desconocido',
    });
  }
}
