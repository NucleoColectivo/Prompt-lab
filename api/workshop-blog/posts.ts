import {
  createWorkshopBlogPost,
  listWorkshopBlogPosts,
} from '../../src/server/workshopBlogService';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '24mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const data = await listWorkshopBlogPosts();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const clientKey =
        (req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'anon')
          .toString()
          .split(',')[0]
          .trim();
      const result = await createWorkshopBlogPost(
        req.body || {},
        clientKey,
        typeof req.headers?.authorization === 'string' ? req.headers.authorization : undefined
      );
      return res.status(result.status).json(result.payload);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error: unknown) {
    console.error('Error en /api/workshop-blog/posts:', error);
    return res.status(500).json({
      error: 'Error al procesar las publicaciones del blog del taller.',
    });
  }
}
