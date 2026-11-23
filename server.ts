import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  extractClientKey,
  handleGeminiAnalyzeStyle,
  handleGeminiDirectFilm,
  handleGeminiEnrich,
} from './src/server/geminiHandlers';
import {
  createWorkshopBlogPost,
  listWorkshopBlogPosts,
} from './src/server/workshopBlogService';
import {
  handleWorkshopBinaryDelete,
  handleWorkshopBinaryUpload,
} from './src/server/workshopUploadService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function resolvePort(): number {
  const portFlagIdx = process.argv.indexOf('--port');
  if (portFlagIdx !== -1 && process.argv[portFlagIdx + 1]) {
    const parsed = Number(process.argv[portFlagIdx + 1]);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  if (process.env.NODE_ENV !== 'production') {
    return 3000;
  }
  return Number(process.env.PORT) || 3000;
}

const port = resolvePort();

app.use(express.json({ limit: '24mb' }));
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self)');
  next();
});

// Serve local preview uploads safely (used only when GITHUB_TOKEN is not yet configured)
app.use(
  '/workshop-uploads',
  express.static(path.join(__dirname, 'public', 'workshop-uploads'), {
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; img-src 'self'; media-src 'self'; object-src 'self'; frame-ancestors 'self'; base-uri 'none'; script-src 'none'"
      );
    },
  })
);

// Hardened Gemini API endpoints (single source of truth shared with Vercel /api/gemini/*)
app.post('/api/gemini/enrich', async (req: Request, res: Response) => {
  const clientKey = extractClientKey(req.headers as Record<string, unknown>, req.socket.remoteAddress);
  const result = await handleGeminiEnrich((req.body || {}) as Record<string, unknown>, clientKey);
  if (result.headers) {
    Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
  }
  res.status(result.status).json(result.payload);
});

app.post('/api/gemini/analyze-style', async (req: Request, res: Response) => {
  const clientKey = extractClientKey(req.headers as Record<string, unknown>, req.socket.remoteAddress);
  const result = await handleGeminiAnalyzeStyle(
    (req.body || {}) as Record<string, unknown>,
    clientKey
  );
  if (result.headers) {
    Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
  }
  res.status(result.status).json(result.payload);
});

app.post('/api/gemini/direct-film', async (req: Request, res: Response) => {
  const clientKey = extractClientKey(req.headers as Record<string, unknown>, req.socket.remoteAddress);
  const result = await handleGeminiDirectFilm(
    (req.body || {}) as Record<string, unknown>,
    clientKey
  );
  if (result.headers) {
    Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
  }
  res.status(result.status).json(result.payload);
});

// Endpoint: Workshop Community Blog — List & Publish Attendee Creations (GitHub-backed)
app.get('/api/workshop-blog/posts', async (_req: Request, res: Response) => {
  try {
    const data = await listWorkshopBlogPosts();
    res.json(data);
  } catch (error: any) {
    console.error('Error leyendo blog del taller:', error);
    res.status(500).json({
      error: error?.message || 'No se pudieron cargar las publicaciones del taller.',
    });
  }
});

app.post('/api/workshop-blog/posts', async (req: Request, res: Response) => {
  try {
    const clientKey = (
      (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anon')
        .toString()
        .split(',')[0]
        .trim()
    );
    const result = await createWorkshopBlogPost(req.body || {}, clientKey);
    res.status(result.status).json(result.payload);
  } catch (error: any) {
    console.error('Error publicando en blog del taller:', error);
    res.status(500).json({
      error: error?.message || 'No se pudo publicar el contenido en el blog del taller.',
    });
  }
});

// Endpoint: Authenticated Direct Binary Upload for Workshop PDFs & Videos (MP4/WebM/MOV)
app.post(
  '/api/workshop-blog/upload',
  express.raw({
    type: ['application/pdf', 'video/mp4', 'video/webm', 'video/quicktime'],
    limit: '26mb',
  }),
  async (req: Request, res: Response) => {
    try {
      const result = await handleWorkshopBinaryUpload({
        authHeader: req.headers.authorization,
        contentTypeHeader: req.headers['content-type'],
        postIdHeader:
          typeof req.headers['x-post-id'] === 'string' ? req.headers['x-post-id'] : undefined,
        body: req.body as Buffer,
      });
      res.status(result.status).json(result.payload);
    } catch (error: any) {
      console.error('Error subiendo archivo binario del taller:', error);
      res.status(500).json({
        error: 'No se pudo guardar el archivo en el servidor.',
      });
    }
  }
);

app.delete('/api/workshop-blog/upload/:fileName', async (req: Request, res: Response) => {
  try {
    const result = await handleWorkshopBinaryDelete({
      authHeader: req.headers.authorization,
      fileName: req.params.fileName,
    });
    res.status(result.status).json(result.payload);
  } catch (error: any) {
    console.error('Error eliminando archivo binario del taller:', error);
    res.status(500).json({
      error: 'No se pudo eliminar el archivo del servidor.',
    });
  }
});

const DEFAULT_OG_ORIGIN = 'https://prompt-lab-eight-sigma.vercel.app';

function resolvePublicOrigin(req: Request): string {
  const rawHost = (req.headers['x-forwarded-host'] || req.headers.host || '')
    .toString()
    .split(',')[0]
    .trim();
  const isLocalHost = !rawHost || /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(rawHost);
  if (!isLocalHost) {
    const rawProto = (req.headers['x-forwarded-proto'] || 'https')
      .toString()
      .split(',')[0]
      .trim();
    return `${rawProto || 'https'}://${rawHost}`;
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  return DEFAULT_OG_ORIGIN;
}

function injectAbsoluteOgMeta(html: string, req: Request): string {
  const origin = resolvePublicOrigin(req);
  if (origin === DEFAULT_OG_ORIGIN) return html;
  return html.split(DEFAULT_OG_ORIGIN).join(origin);
}

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const templatePath = path.join(__dirname, 'index.html');
        const rawTemplate = await fs.readFile(templatePath, 'utf-8');
        const transformed = await vite.transformIndexHtml(req.originalUrl, rawTemplate);
        const html = injectAbsoluteOgMeta(transformed, req);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    const prodTemplate = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
    app.get('*', (req, res) => {
      const html = injectAbsoluteOgMeta(prodTemplate, req);
      res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(html);
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
