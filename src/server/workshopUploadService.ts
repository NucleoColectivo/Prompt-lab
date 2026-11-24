import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const UPLOAD_DIR = path.resolve(PROJECT_ROOT, 'public', 'workshop-uploads');
const FIREBASE_CONFIG_PATH = path.resolve(PROJECT_ROOT, 'firebase-applet-config.json');

const WORKSHOP_ADMIN_EMAIL = 'nucleo.colectivo.art@gmail.com';
const MAX_PDF_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_UPLOADS = 15;
const uploadRateMap = new Map<string, number[]>();

const ALLOWED_BINARY_MIMES: Record<
  string,
  { ext: 'pdf' | 'mp4' | 'webm' | 'mov'; maxBytes: number }
> = {
  'application/pdf': { ext: 'pdf', maxBytes: MAX_PDF_BYTES },
  'video/mp4': { ext: 'mp4', maxBytes: MAX_VIDEO_BYTES },
  'video/webm': { ext: 'webm', maxBytes: MAX_VIDEO_BYTES },
  'video/quicktime': { ext: 'mov', maxBytes: MAX_VIDEO_BYTES },
};

const SAFE_STORED_FILENAME_REGEX = /^[a-zA-Z0-9_\-]+\.(pdf|mp4|webm|mov)$/;
const SAFE_POST_ID_REGEX = /^[a-zA-Z0-9_\-]{4,80}$/;

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

let cachedFirebaseApiKey: string | null = null;

async function getFirebaseWebApiKey(): Promise<string> {
  if (cachedFirebaseApiKey) return cachedFirebaseApiKey;
  const raw = await fs.readFile(FIREBASE_CONFIG_PATH, 'utf-8');
  const parsed = JSON.parse(raw) as { apiKey?: string };
  if (!parsed.apiKey) {
    throw new Error('Configuración de Firebase no encontrada en el servidor.');
  }
  cachedFirebaseApiKey = parsed.apiKey;
  return parsed.apiKey;
}

export async function verifyFirebaseIdToken(
  authHeader: string | undefined
): Promise<VerifiedFirebaseUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const idToken = authHeader.slice(7).trim();
  if (!idToken || idToken.length > 8192) return null;

  try {
    const apiKey = await getFirebaseWebApiKey();
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      users?: Array<{ localId?: string; email?: string; emailVerified?: boolean }>;
    };
    const user = data.users?.[0];
    if (!user?.localId || !user.email) return null;
    return {
      uid: user.localId,
      email: user.email,
      emailVerified: Boolean(user.emailVerified),
    };
  } catch {
    return null;
  }
}

function isVercelServerless(): boolean {
  return process.env.VERCEL === '1' || process.env.VERCEL === 'true';
}

function checkRateLimit(uid: string): boolean {
  const now = Date.now();
  const key = (uid || 'anon').slice(0, 128);
  const timestamps = (uploadRateMap.get(key) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_MAX_UPLOADS) {
    uploadRateMap.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  uploadRateMap.set(key, timestamps);

  if (uploadRateMap.size > 1000) {
    for (const [k, list] of uploadRateMap.entries()) {
      const valid = list.filter((ts) => now - ts < RATE_WINDOW_MS);
      if (valid.length === 0) uploadRateMap.delete(k);
      else uploadRateMap.set(k, valid);
    }
  }
  return true;
}

function matchesMagicBytes(buf: Buffer, ext: 'pdf' | 'mp4' | 'webm' | 'mov'): boolean {
  if (buf.length < 12) return false;
  if (ext === 'pdf') {
    return (
      buf[0] === 0x25 &&
      buf[1] === 0x50 &&
      buf[2] === 0x44 &&
      buf[3] === 0x46 &&
      buf[4] === 0x2d
    ); // %PDF-
  }
  if (ext === 'webm') {
    return buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3;
  }
  if (ext === 'mp4' || ext === 'mov') {
    // ISO Base Media File Format: 'ftyp' at offset 4, or QuickTime 'moov'/'wide'/'mdat'
    const boxType = buf.subarray(4, 8).toString('ascii');
    return boxType === 'ftyp' || boxType === 'moov' || boxType === 'wide' || boxType === 'mdat';
  }
  return false;
}

function sanitizeUidPrefix(uid: string): string {
  return uid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 36);
}

export async function handleWorkshopBinaryUpload(params: {
  authHeader: string | undefined;
  contentTypeHeader: string | undefined;
  postIdHeader: string | undefined;
  body: Buffer;
}): Promise<{ status: number; payload: Record<string, unknown> }> {
  const user = await verifyFirebaseIdToken(params.authHeader);
  if (!user || !user.emailVerified) {
    return {
      status: 401,
      payload: { error: 'Inicia sesión con una cuenta de Google verificada para subir archivos.' },
    };
  }

  if (!checkRateLimit(user.uid)) {
    return {
      status: 429,
      payload: { error: 'Has realizado varias subidas recientes. Espera unos minutos e intenta de nuevo.' },
    };
  }

  const normalizedMime = (params.contentTypeHeader || '').split(';')[0].trim().toLowerCase();
  const mimeRule = ALLOWED_BINARY_MIMES[normalizedMime];
  if (!mimeRule) {
    return {
      status: 400,
      payload: { error: 'Tipo de archivo no permitido. Usa PDF, MP4, WebM o MOV.' },
    };
  }

  if (!Buffer.isBuffer(params.body) || params.body.length === 0) {
    return { status: 400, payload: { error: 'No se recibió contenido binario del archivo.' } };
  }

  if (params.body.length > mimeRule.maxBytes) {
    const maxMb = Math.round(mimeRule.maxBytes / (1024 * 1024));
    return {
      status: 413,
      payload: { error: `El archivo supera el límite permitido de ${maxMb} MB.` },
    };
  }

  if (!matchesMagicBytes(params.body, mimeRule.ext)) {
    return {
      status: 400,
      payload: {
        error: 'El contenido del archivo no coincide con un documento PDF o video MP4/WebM/MOV válido.',
      },
    };
  }

  const rawPostId = (params.postIdHeader || '').trim();
  const safePostId = SAFE_POST_ID_REGEX.test(rawPostId)
    ? rawPostId.slice(0, 48)
    : `file_${Date.now()}`;
  const uidPrefix = sanitizeUidPrefix(user.uid);
  const randHex = crypto.randomBytes(4).toString('hex');
  const storedFileName = `${uidPrefix}_${safePostId}_${randHex}.${mimeRule.ext}`;

  if (!SAFE_STORED_FILENAME_REGEX.test(storedFileName)) {
    return { status: 400, payload: { error: 'Nombre de archivo inválido.' } };
  }

  if (isVercelServerless()) {
    return {
      status: 503,
      payload: {
        error:
          'La carga directa de PDF/video al disco local no está disponible en Vercel (sistema de archivos efímero). Comparte un enlace de Google Drive, YouTube o Vimeo.',
      },
    };
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const targetPath = path.resolve(UPLOAD_DIR, storedFileName);
  if (!targetPath.startsWith(UPLOAD_DIR + path.sep)) {
    return { status: 400, payload: { error: 'Ruta de destino inválida.' } };
  }

  await fs.writeFile(targetPath, params.body);

  return {
    status: 201,
    payload: {
      uploadedFileUrl: `/workshop-uploads/${storedFileName}`,
      storedFileName,
      mimeType: normalizedMime,
      fileSizeBytes: params.body.length,
    },
  };
}

export async function handleWorkshopBinaryDelete(params: {
  authHeader: string | undefined;
  fileName: string;
}): Promise<{ status: number; payload: Record<string, unknown> }> {
  const user = await verifyFirebaseIdToken(params.authHeader);
  if (!user || !user.emailVerified) {
    return { status: 401, payload: { error: 'No autorizado.' } };
  }

  const fileName = (params.fileName || '').trim();
  if (!SAFE_STORED_FILENAME_REGEX.test(fileName)) {
    return { status: 400, payload: { error: 'Nombre de archivo inválido.' } };
  }

  const uidPrefix = sanitizeUidPrefix(user.uid);
  const isOwner = fileName.startsWith(`${uidPrefix}_`);
  const isAdmin = user.email.toLowerCase() === WORKSHOP_ADMIN_EMAIL.toLowerCase();

  if (!isOwner && !isAdmin) {
    return { status: 403, payload: { error: 'No tienes permiso para eliminar este archivo.' } };
  }

  if (isVercelServerless()) {
    return {
      status: 503,
      payload: { error: 'Operación no disponible en almacenamiento efímero serverless.' },
    };
  }

  const targetPath = path.resolve(UPLOAD_DIR, fileName);
  if (!targetPath.startsWith(UPLOAD_DIR + path.sep)) {
    return { status: 400, payload: { error: 'Ruta inválida.' } };
  }

  try {
    await fs.unlink(targetPath);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code !== 'ENOENT') {
      throw err;
    }
  }

  return { status: 200, payload: { deleted: true } };
}
