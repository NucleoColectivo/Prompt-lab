import { extractClientKey, handleGeminiEnrich } from '../../src/server/geminiHandlers';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.', code: 'METHOD_NOT_ALLOWED' });
  }

  const clientKey = extractClientKey(req.headers, req.socket?.remoteAddress);
  const result = await handleGeminiEnrich((req.body || {}) as Record<string, unknown>, clientKey);
  if (result.headers) {
    Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
  }
  return res.status(result.status).json(result.payload);
}
