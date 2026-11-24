import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { verifyFirebaseIdToken } from './workshopUploadService';

export type WorkshopContentType = 'image' | 'pdf' | 'video' | 'link';

export interface WorkshopBlogPost {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorEmailMasked: string;
  category: string;
  contentType: WorkshopContentType;
  mediaUrl?: string;
  githubFileUrl?: string;
  externalUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  promptUsed?: string;
  createdAt: string;
  storageMode: 'github' | 'local';
}

export interface WorkshopBlogSubmission {
  title?: unknown;
  description?: unknown;
  authorName?: unknown;
  authorEmail?: unknown;
  category?: unknown;
  contentType?: unknown;
  externalUrl?: unknown;
  promptUsed?: unknown;
  fileName?: unknown;
  mimeType?: unknown;
  fileBase64?: unknown;
}

export interface WorkshopBlogConfigStatus {
  githubConfigured: boolean;
  repoLabel: string;
  branch: string;
}

const ALLOWED_CATEGORIES = new Set([
  'Imagen IA',
  'Fotografía y Luz',
  'Video y Cine',
  'Documento / PDF',
  'Proyecto Web',
  'Diseño y Arte',
  'Experimento',
]);

const ALLOWED_CONTENT_TYPES = new Set<WorkshopContentType>([
  'image',
  'pdf',
  'video',
  'link',
]);

const ALLOWED_FILE_TYPES: Record<
  string,
  { ext: string; contentType: Exclude<WorkshopContentType, 'link'> }
> = {
  'image/jpeg': { ext: 'jpg', contentType: 'image' },
  'image/jpg': { ext: 'jpg', contentType: 'image' },
  'image/png': { ext: 'png', contentType: 'image' },
  'image/webp': { ext: 'webp', contentType: 'image' },
  'application/pdf': { ext: 'pdf', contentType: 'pdf' },
  'video/mp4': { ext: 'mp4', contentType: 'video' },
  'video/webm': { ext: 'webm', contentType: 'video' },
  'video/quicktime': { ext: 'mov', contentType: 'video' },
};

const MAX_BINARY_BYTES = 15 * 1024 * 1024; // 15 MB binary ceiling
const GITHUB_POSTS_PATH = 'workshop-uploads/posts.json';
const GITHUB_MEDIA_DIR = 'workshop-uploads/media';
const LOCAL_UPLOADS_ROOT = path.resolve(process.cwd(), 'public', 'workshop-uploads');
const LOCAL_MEDIA_DIR = path.resolve(LOCAL_UPLOADS_ROOT, 'media');
const LOCAL_POSTS_FILE = path.resolve(LOCAL_UPLOADS_ROOT, 'posts.json');

// Lightweight per-IP sliding window rate limiter (10 uploads / 15 min)
const uploadRateLog = new Map<string, number[]>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_UPLOADS = 10;

export function isVercelEphemeralEnv(): boolean {
  return process.env.VERCEL === '1' || process.env.VERCEL === 'true';
}

export function checkUploadRateLimit(clientKey: string): boolean {
  const now = Date.now();
  const key = (clientKey || 'anon').slice(0, 128);
  const prev = uploadRateLog.get(key) || [];
  const recent = prev.filter((ts) => now - ts < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_UPLOADS) {
    uploadRateLog.set(key, recent);
    return false;
  }
  recent.push(now);
  uploadRateLog.set(key, recent);

  if (uploadRateLog.size > 1000) {
    for (const [k, timestamps] of uploadRateLog.entries()) {
      const valid = timestamps.filter((ts) => now - ts < RATE_WINDOW_MS);
      if (valid.length === 0) uploadRateLog.delete(k);
      else uploadRateLog.set(k, valid);
    }
  }
  return true;
}

function getGitHubConfig() {
  const token = (process.env.GITHUB_TOKEN || '').trim();
  const owner = (process.env.GITHUB_OWNER || 'NucleoColectivo').trim();
  const repo = (process.env.GITHUB_REPO || 'Prompt-lab').trim();
  const branch = (process.env.GITHUB_BRANCH || 'main').trim();
  return {
    token,
    owner,
    repo,
    branch,
    configured: token.length > 0 && owner.length > 0 && repo.length > 0,
  };
}

export function getWorkshopBlogConfigStatus(): WorkshopBlogConfigStatus {
  const cfg = getGitHubConfig();
  return {
    githubConfigured: cfg.configured,
    repoLabel: `${cfg.owner}/${cfg.repo}`,
    branch: cfg.branch,
  };
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return 'participante';
  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}***@${domain}`;
}

function isPrivateOrLocalHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    lower === 'localhost' ||
    lower === '::1' ||
    lower === '::' ||
    lower === '0.0.0.0' ||
    lower === 'metadata.google.internal' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower.endsWith('.localhost')
  ) {
    return true;
  }
  // Block numeric-only, hex, or octal IP obfuscations (e.g. 2130706433, 0x7f000001, 0177.0.0.1)
  if (/^\d+$/.test(lower) || /^0x[0-9a-f]+$/i.test(lower) || /^0\d+\./.test(lower)) {
    return true;
  }
  // Block IPv6 private (ULA fc00::/7), link-local (fe80::/10), and IPv4-mapped loopback/private
  if (
    lower.startsWith('fc') ||
    lower.startsWith('fd') ||
    lower.startsWith('fe8') ||
    lower.startsWith('fe9') ||
    lower.startsWith('fea') ||
    lower.startsWith('feb') ||
    lower.startsWith('::ffff:')
  ) {
    return true;
  }
  if (/^127\./.test(lower)) return true;
  if (/^10\./.test(lower)) return true;
  if (/^192\.168\./.test(lower)) return true;
  if (/^169\.254\./.test(lower)) return true;
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(lower)) return true;
  const match172 = lower.match(/^172\.(\d+)\./);
  if (match172) {
    const secondOctet = Number(match172[1]);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }
  return false;
}

function validateExternalUrl(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: 'El enlace web no puede estar vacío.' };
  if (trimmed.length > 1000) return { ok: false, error: 'El enlace web es demasiado largo.' };
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: 'Ingresa un enlace web válido que comience con https:// o http://.' };
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, error: 'Solo se permiten enlaces web con protocolo https:// o http://.' };
  }
  if (isPrivateOrLocalHostname(parsed.hostname)) {
    return { ok: false, error: 'El enlace debe apuntar a un sitio web público.' };
  }
  return { ok: true, url: parsed.toString() };
}

function verifyMagicBytes(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 8) return false;
  switch (mime) {
    case 'image/jpeg':
    case 'image/jpg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    case 'image/webp':
      return (
        buffer.length >= 12 &&
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    case 'application/pdf':
      return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
    case 'video/mp4':
    case 'video/quicktime': {
      const boxType = buffer.subarray(4, 8).toString('ascii');
      return boxType === 'ftyp' || boxType === 'moov' || boxType === 'wide' || boxType === 'mdat';
    }
    case 'video/webm':
      return (
        buffer[0] === 0x1a &&
        buffer[1] === 0x45 &&
        buffer[2] === 0xdf &&
        buffer[3] === 0xa3
      );
    default:
      return false;
  }
}

function sanitizeDisplayFileName(raw: string, fallbackExt: string): string {
  const base = path.basename(raw || `archivo.${fallbackExt}`);
  const cleaned = base.replace(/[^a-zA-Z0-9._-\s]/g, '').trim().slice(0, 80);
  return cleaned || `archivo.${fallbackExt}`;
}

function sanitizeCommitSegment(value: string, maxLen = 70): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLen);
}

async function githubFetch(url: string, token: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'nucleo-colectivo-prompt-lab',
      ...(init.headers || {}),
    },
  });
}

async function readPostsFromGitHub(): Promise<{ posts: WorkshopBlogPost[]; sha?: string }> {
  const cfg = getGitHubConfig();
  if (cfg.configured) {
    const apiUrl = `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${GITHUB_POSTS_PATH}?ref=${encodeURIComponent(cfg.branch)}`;
    const res = await githubFetch(apiUrl, cfg.token);
    if (res.status === 404) {
      return { posts: [] };
    }
    if (!res.ok) {
      throw new Error(`GitHub respondió con estado ${res.status} al leer publicaciones.`);
    }
    const payload = (await res.json()) as { content?: string; sha?: string };
    const decoded = payload.content
      ? Buffer.from(payload.content.replace(/\n/g, ''), 'base64').toString('utf-8')
      : '[]';
    const parsed = JSON.parse(decoded);
    return {
      posts: Array.isArray(parsed) ? (parsed as WorkshopBlogPost[]) : [],
      sha: payload.sha,
    };
  }

  // Public raw read fallback when token is not yet configured
  try {
    const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/${encodeURIComponent(cfg.branch)}/${GITHUB_POSTS_PATH}`;
    const res = await fetch(rawUrl, {
      headers: { 'User-Agent': 'nucleo-colectivo-prompt-lab' },
    });
    if (!res.ok) return { posts: [] };
    const parsed = await res.json();
    return { posts: Array.isArray(parsed) ? (parsed as WorkshopBlogPost[]) : [] };
  } catch {
    return { posts: [] };
  }
}

async function readLocalPreviewPosts(): Promise<WorkshopBlogPost[]> {
  if (isVercelEphemeralEnv()) return [];
  try {
    const raw = await fs.readFile(LOCAL_POSTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WorkshopBlogPost[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalPreviewFile(safeFileName: string, buffer: Buffer): Promise<string> {
  await fs.mkdir(LOCAL_MEDIA_DIR, { recursive: true });
  const targetPath = path.resolve(LOCAL_MEDIA_DIR, safeFileName);
  if (!targetPath.startsWith(LOCAL_MEDIA_DIR + path.sep)) {
    throw new Error('Ruta de archivo inválida.');
  }
  await fs.writeFile(targetPath, buffer);
  return `/workshop-uploads/media/${encodeURIComponent(safeFileName)}`;
}

async function appendLocalPreviewPost(post: WorkshopBlogPost): Promise<void> {
  await fs.mkdir(LOCAL_UPLOADS_ROOT, { recursive: true });
  const targetPath = path.resolve(LOCAL_UPLOADS_ROOT, 'posts.json');
  if (!targetPath.startsWith(LOCAL_UPLOADS_ROOT + path.sep)) {
    throw new Error('Ruta de índice inválida.');
  }
  const existing = await readLocalPreviewPosts();
  const next = [post, ...existing.filter((p) => p.id !== post.id)].slice(0, 200);
  await fs.writeFile(targetPath, JSON.stringify(next, null, 2), 'utf-8');
}

async function uploadFileToGitHub(
  safeFileName: string,
  buffer: Buffer,
  commitMessage: string
): Promise<{ mediaUrl: string; githubFileUrl: string }> {
  const cfg = getGitHubConfig();
  const repoFilePath = `${GITHUB_MEDIA_DIR}/${safeFileName}`;
  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${repoFilePath}`;

  const res = await githubFetch(apiUrl, cfg.token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMessage,
      content: buffer.toString('base64'),
      branch: cfg.branch,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error(`[workshopBlog/github-upload] HTTP ${res.status}:`, errText.slice(0, 300));
    throw new Error('No se pudo guardar el archivo en el repositorio configurado.');
  }

  const data = (await res.json()) as {
    content?: { download_url?: string; html_url?: string };
  };

  const rawFallback = `https://raw.githubusercontent.com/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/${encodeURIComponent(cfg.branch)}/${repoFilePath}`;
  const htmlFallback = `https://github.com/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/blob/${encodeURIComponent(cfg.branch)}/${repoFilePath}`;

  return {
    mediaUrl: data.content?.download_url || rawFallback,
    githubFileUrl: data.content?.html_url || htmlFallback,
  };
}

async function appendPostToGitHubIndex(
  post: WorkshopBlogPost,
  commitMessage: string,
  attempt = 0
): Promise<void> {
  const cfg = getGitHubConfig();
  const { posts, sha } = await readPostsFromGitHub();
  const updated = [post, ...posts.filter((p) => p.id !== post.id)].slice(0, 300);

  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${GITHUB_POSTS_PATH}`;
  const res = await githubFetch(apiUrl, cfg.token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(JSON.stringify(updated, null, 2), 'utf-8').toString('base64'),
      branch: cfg.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (res.status === 409 && attempt < 2) {
    return appendPostToGitHubIndex(post, commitMessage, attempt + 1);
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error(`[workshopBlog/github-index] HTTP ${res.status}:`, errText.slice(0, 300));
    throw new Error('No se pudo actualizar el índice de publicaciones en el repositorio.');
  }
}

export async function listWorkshopBlogPosts(): Promise<{
  posts: WorkshopBlogPost[];
  config: WorkshopBlogConfigStatus;
}> {
  const config = getWorkshopBlogConfigStatus();
  let githubPosts: WorkshopBlogPost[] = [];
  try {
    const gh = await readPostsFromGitHub();
    githubPosts = gh.posts;
  } catch {
    githubPosts = [];
  }

  const localPosts = await readLocalPreviewPosts();

  // Merge deduplicating by id, newest first
  const byId = new Map<string, WorkshopBlogPost>();
  for (const p of [...githubPosts, ...localPosts]) {
    if (p && typeof p.id === 'string' && !byId.has(p.id)) {
      byId.set(p.id, p);
    }
  }

  const merged = Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return { posts: merged, config };
}

export async function createWorkshopBlogPost(
  body: WorkshopBlogSubmission,
  clientKey: string,
  authHeader?: string
): Promise<{ status: number; payload: Record<string, unknown> }> {
  const verifiedUser = await verifyFirebaseIdToken(authHeader);
  if (!verifiedUser || !verifiedUser.emailVerified) {
    return {
      status: 401,
      payload: {
        error: 'Se requiere una sesión verificada con Google para publicar contenido.',
      },
    };
  }

  if (!checkUploadRateLimit(`${verifiedUser.uid}:${clientKey}`)) {
    return {
      status: 429,
      payload: {
        error: 'Has realizado demasiadas publicaciones en pocos minutos. Intenta nuevamente en unos instantes.',
      },
    };
  }

  const authorName = typeof body.authorName === 'string' ? body.authorName.trim() : '';
  const authorEmail = typeof body.authorEmail === 'string' ? body.authorEmail.trim().toLowerCase() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const promptUsed = typeof body.promptUsed === 'string' ? body.promptUsed.trim() : '';
  const rawCategory = typeof body.category === 'string' ? body.category.trim() : 'Imagen IA';
  const rawType = typeof body.contentType === 'string' ? body.contentType.trim() : 'image';
  const rawExternalUrl = typeof body.externalUrl === 'string' ? body.externalUrl.trim() : '';
  const rawFileBase64 = typeof body.fileBase64 === 'string' ? body.fileBase64.trim() : '';
  const rawMimeType = typeof body.mimeType === 'string' ? body.mimeType.trim().toLowerCase() : '';
  const rawFileName = typeof body.fileName === 'string' ? body.fileName.trim() : '';

  if (authorName.length < 2 || authorName.length > 80) {
    return { status: 400, payload: { error: 'Ingresa tu nombre (entre 2 y 80 caracteres).' } };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(authorEmail) || authorEmail.length > 120) {
    return { status: 400, payload: { error: 'Ingresa un correo electrónico válido.' } };
  }

  if (title.length < 3 || title.length > 140) {
    return { status: 400, payload: { error: 'Ingresa un título para tu publicación (3 a 140 caracteres).' } };
  }

  if (description.length > 2000) {
    return { status: 400, payload: { error: 'La descripción no puede superar los 2000 caracteres.' } };
  }

  if (promptUsed.length > 1500) {
    return { status: 400, payload: { error: 'El prompt no puede superar los 1500 caracteres.' } };
  }

  const category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : 'Imagen IA';
  if (!ALLOWED_CONTENT_TYPES.has(rawType as WorkshopContentType)) {
    return { status: 400, payload: { error: 'Tipo de contenido no soportado.' } };
  }
  let contentType = rawType as WorkshopContentType;

  // Validate optional/required external URL
  let validatedExternalUrl: string | undefined;
  if (rawExternalUrl) {
    const urlCheck = validateExternalUrl(rawExternalUrl);
    if (!urlCheck.ok) {
      return { status: 400, payload: { error: urlCheck.error } };
    }
    validatedExternalUrl = urlCheck.url;
  }

  if (contentType === 'link' && !validatedExternalUrl) {
    return { status: 400, payload: { error: 'Agrega el enlace web que deseas publicar.' } };
  }

  // Validate file upload when provided (or required)
  let fileBuffer: Buffer | null = null;
  let safeGeneratedName: string | undefined;
  let displayFileName: string | undefined;
  let validatedMime: string | undefined;

  if (rawFileBase64) {
    const fileRule = ALLOWED_FILE_TYPES[rawMimeType];
    if (!fileRule) {
      return {
        status: 400,
        payload: {
          error: 'Formato no permitido. Sube archivos JPG, PNG, WebP, PDF o video MP4 / WebM / MOV.',
        },
      };
    }

    const base64Body = (
      rawFileBase64.includes(',') ? rawFileBase64.split(',')[1] : rawFileBase64
    ).replace(/\s+/g, '');
    if (!base64Body || !/^[A-Za-z0-9+/=]+$/.test(base64Body)) {
      return { status: 400, payload: { error: 'El archivo codificado no tiene un formato base64 válido.' } };
    }
    const buffer = Buffer.from(base64Body, 'base64');

    if (buffer.length === 0) {
      return { status: 400, payload: { error: 'El archivo cargado está vacío.' } };
    }
    if (buffer.length > MAX_BINARY_BYTES) {
      return {
        status: 400,
        payload: { error: 'El archivo supera el límite de 15 MB. Comprímelo o comparte un enlace externo.' },
      };
    }

    if (!verifyMagicBytes(buffer, rawMimeType)) {
      return {
        status: 400,
        payload: { error: 'El contenido del archivo no coincide con el formato declarado.' },
      };
    }

    fileBuffer = buffer;
    validatedMime = rawMimeType;
    contentType = fileRule.contentType;
    const randomToken = crypto.randomBytes(6).toString('hex');
    safeGeneratedName = `${Date.now()}-${randomToken}.${fileRule.ext}`;
    displayFileName = sanitizeDisplayFileName(rawFileName, fileRule.ext);
  } else if (contentType !== 'link' && !validatedExternalUrl) {
    return {
      status: 400,
      payload: { error: 'Selecciona un archivo (JPG, PNG, PDF o video) o incluye un enlace web.' },
    };
  }

  const cfg = getGitHubConfig();
  const postId = `wb-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const maskedEmail = maskEmail(authorEmail);
  // Privacy guard: never expose raw attendee emails in public Git commit messages
  const commitAuthorSummary = `${sanitizeCommitSegment(authorName, 50)} (${sanitizeCommitSegment(maskedEmail, 50)})`;
  const commitTitleSummary = sanitizeCommitSegment(title, 70);

  let mediaUrl: string | undefined;
  let githubFileUrl: string | undefined;
  let storageMode: 'github' | 'local' = 'local';

  if (cfg.configured) {
    storageMode = 'github';
    if (fileBuffer && safeGeneratedName) {
      const uploaded = await uploadFileToGitHub(
        safeGeneratedName,
        fileBuffer,
        `Taller: archivo "${commitTitleSummary}" por ${commitAuthorSummary}`
      );
      mediaUrl = uploaded.mediaUrl;
      githubFileUrl = uploaded.githubFileUrl;
    }

    const newPost: WorkshopBlogPost = {
      id: postId,
      title,
      description,
      authorName,
      authorEmailMasked: maskedEmail,
      category,
      contentType,
      ...(mediaUrl ? { mediaUrl } : {}),
      ...(githubFileUrl ? { githubFileUrl } : {}),
      ...(validatedExternalUrl ? { externalUrl: validatedExternalUrl } : {}),
      ...(displayFileName ? { fileName: displayFileName } : {}),
      ...(fileBuffer ? { fileSizeBytes: fileBuffer.length } : {}),
      ...(validatedMime ? { mimeType: validatedMime } : {}),
      ...(promptUsed ? { promptUsed } : {}),
      createdAt: new Date().toISOString(),
      storageMode: 'github',
    };

    await appendPostToGitHubIndex(
      newPost,
      `Taller Blog: "${commitTitleSummary}" por ${commitAuthorSummary}`
    );

    return {
      status: 201,
      payload: {
        post: newPost,
        config: getWorkshopBlogConfigStatus(),
      },
    };
  }

  // Vercel serverless filesystems are read-only/ephemeral and must not be used for permanent storage
  if (isVercelEphemeralEnv()) {
    return {
      status: 503,
      payload: {
        error:
          'El almacenamiento persistente en GitHub no está configurado en este entorno serverless. Usa el Blog en tiempo real con Firebase o configura GITHUB_TOKEN.',
      },
    };
  }

  // Local dev/preview fallback mode (when GITHUB_TOKEN is not yet configured in environment secrets)
  if (fileBuffer && safeGeneratedName) {
    mediaUrl = await writeLocalPreviewFile(safeGeneratedName, fileBuffer);
  }

  const localPost: WorkshopBlogPost = {
    id: postId,
    title,
    description,
    authorName,
    authorEmailMasked: maskEmail(authorEmail),
    category,
    contentType,
    ...(mediaUrl ? { mediaUrl } : {}),
    ...(validatedExternalUrl ? { externalUrl: validatedExternalUrl } : {}),
    ...(displayFileName ? { fileName: displayFileName } : {}),
    ...(fileBuffer ? { fileSizeBytes: fileBuffer.length } : {}),
    ...(validatedMime ? { mimeType: validatedMime } : {}),
    ...(promptUsed ? { promptUsed } : {}),
    createdAt: new Date().toISOString(),
    storageMode,
  };

  await appendLocalPreviewPost(localPost);

  return {
    status: 201,
    payload: {
      post: localPost,
      config: getWorkshopBlogConfigStatus(),
    },
  };
}
