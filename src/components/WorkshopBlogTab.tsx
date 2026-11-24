import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Film,
  Globe,
  Image as ImageIcon,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  Plus,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  User,
  Wand2,
  X,
} from 'lucide-react';
import {
  browserPopupRedirectResolver,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  db,
  FIREBASE_APP_ID,
  FIREBASE_PROJECT_ID,
  googleProvider,
  handleFirestoreError,
  HAS_APP_CHECK_SITE_KEY,
  OperationType,
  WORKSHOP_ADMIN_EMAIL,
} from '../firebase';
import type { PromptBuilderState } from './PromptBuilder';

export type WorkshopContentType = 'image' | 'pdf' | 'video' | 'link';

export interface WorkshopBlogPost {
  id: string;
  authorUid: string;
  authorName: string;
  title: string;
  description?: string;
  promptUsed?: string;
  category: string;
  contentType: WorkshopContentType;
  mediaDataUrl?: string;
  uploadedFileUrl?: string;
  externalUrl?: string;
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  status: 'published' | 'archived';
  createdAtMs: number;
}

interface WorkshopContactRecord {
  id: string;
  postId: string;
  authorUid: string;
  authorName: string;
  authorEmail: string;
  postTitle: string;
  createdAtMs: number;
}

interface AuthErrorInfo {
  title: string;
  detail?: string;
  code?: string;
  consoleUrl?: string;
  consoleLabel?: string;
  suggestNewTab?: boolean;
}

function describeGoogleAuthError(err: unknown): AuthErrorInfo {
  const code = typeof (err as { code?: unknown })?.code === 'string'
    ? (err as { code: string }).code
    : '';
  const rawMessage = err instanceof Error ? err.message : String(err || '');
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isAppCheckError =
    code.includes('app-check') ||
    /app\s*check/i.test(rawMessage) ||
    /firebase-app-check/i.test(rawMessage);

  if (isAppCheckError) {
    return {
      title: 'Firebase App Check está bloqueando el inicio de sesión con Google.',
      detail: `El proyecto "${FIREBASE_PROJECT_ID}" exige verificación App Check para Authentication, pero esta app web (${FIREBASE_APP_ID}) no está registrada. Desactiva "Enforce" en Authentication dentro de Firebase App Check o registra la app con reCAPTCHA v3.`,
      code: code || 'auth/firebase-app-check-token-is-invalid',
      consoleUrl: `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/appcheck/products`,
      consoleLabel: 'Abrir Firebase App Check',
    };
  }

  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return {
      title: 'Cerraste la ventana de Google antes de completar el ingreso.',
      detail: 'Haz clic nuevamente en "Entrar con Google" y selecciona tu cuenta para continuar.',
      code,
    };
  }

  if (code === 'auth/popup-blocked') {
    return {
      title: 'Tu navegador bloqueó la ventana emergente de Google.',
      detail: 'Permite popups para este sitio o abre la aplicación en una pestaña independiente y vuelve a intentarlo.',
      code,
      suggestNewTab: true,
    };
  }

  if (code === 'auth/unauthorized-domain' || code === 'auth/unauthorized-continue-uri') {
    return {
      title: `El dominio "${hostname || 'actual'}" no está autorizado en Firebase Authentication.`,
      detail: 'Agrégalo en Firebase Console → Authentication → Settings → Authorized domains.',
      code,
      consoleUrl: `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/settings`,
      consoleLabel: 'Abrir dominios autorizados',
    };
  }

  if (code === 'auth/operation-not-allowed') {
    return {
      title: 'El acceso con Google no está habilitado en Firebase Authentication.',
      detail: 'Activa el proveedor Google en Firebase Console → Authentication → Sign-in method.',
      code,
      consoleUrl: `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/providers`,
      consoleLabel: 'Habilitar proveedor Google',
    };
  }

  if (code === 'auth/network-request-failed') {
    return {
      title: 'Error de red al conectar con Google y Firebase.',
      detail: 'Verifica tu conexión o desactiva temporalmente bloqueadores de scripts/cookies de terceros e intenta de nuevo.',
      code,
    };
  }

  if (code === 'auth/web-storage-unsupported' || code === 'auth/operation-not-supported-in-this-environment') {
    return {
      title: 'Tu navegador bloquea el almacenamiento necesario para iniciar sesión dentro de esta vista.',
      detail: 'Abre la plataforma en una pestaña nueva con cookies habilitadas para completar el ingreso con Google.',
      code,
      suggestNewTab: true,
    };
  }

  if (code === 'auth/internal-error') {
    return {
      title: 'Firebase devolvió un error interno al iniciar el flujo de Google.',
      detail: !HAS_APP_CHECK_SITE_KEY
        ? `Esto ocurre habitualmente cuando Firebase App Check está en modo "Enforce" para Authentication en "${FIREBASE_PROJECT_ID}" sin registrar esta app (${FIREBASE_APP_ID}), o cuando el navegador restringe popups en vista embebida.`
        : 'Prueba abrir la plataforma en una pestaña nueva o verifica la configuración de Authentication y App Check en Firebase Console.',
      code,
      consoleUrl: `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/appcheck/products`,
      consoleLabel: 'Revisar App Check en Firebase',
      suggestNewTab: true,
    };
  }

  return {
    title: 'No se pudo iniciar sesión con Google.',
    detail: code
      ? `Verifica la configuración de Firebase Authentication e intenta de nuevo.`
      : rawMessage || 'Intenta de nuevo o abre la aplicación en una pestaña independiente.',
    code: code || undefined,
    suggestNewTab: true,
  };
}

interface WorkshopBlogTabProps {
  initialComposerOpen?: boolean;
  onComposerOpened?: () => void;
  onPostCountChange?: (count: number) => void;
  onSendPromptToBuilder?: (patch: Partial<PromptBuilderState>) => void;
}

const CATEGORIES = [
  'Imagen IA',
  'Fotografía y Luz',
  'Video y Cine',
  'Documento / PDF',
  'Proyecto Web',
  'Diseño y Arte',
  'Experimento',
] as const;

const MAX_DATA_URL_CHARS = 340_000;
const MAX_RAW_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_PDF_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SAFE_UPLOADED_URL_REGEX = /^\/workshop-uploads\/[a-zA-Z0-9_-]+\.(pdf|mp4|webm|mov)$/;

function createSafePostId(): string {
  const rand =
    typeof crypto !== 'undefined' && crypto.getRandomValues
      ? Array.from(crypto.getRandomValues(new Uint8Array(6)))
          .map((b) => b.toString(36).padStart(2, '0'))
          .join('')
          .slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
  return `post_${Date.now()}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

function getSafeHref(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function getSafeUploadedFileUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  return SAFE_UPLOADED_URL_REGEX.test(trimmed) ? trimmed : null;
}

function getSafeDataImage(url?: string): string | null {
  if (!url) return null;
  if (
    url.startsWith('data:image/jpeg;base64,') ||
    url.startsWith('data:image/png;base64,') ||
    url.startsWith('data:image/webp;base64,')
  ) {
    return url;
  }
  return null;
}

function getSafeHostname(url?: string): string {
  const safe = getSafeHref(url);
  if (!safe) return '';
  try {
    return new URL(safe).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function getVideoEmbedUrl(url?: string): string | null {
  const safe = getSafeHref(url);
  if (!safe) return null;
  try {
    const parsed = new URL(safe);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    let ytId: string | null = null;
    if (host === 'youtu.be') {
      ytId = parsed.pathname.slice(1).split('/')[0] || null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        ytId = parsed.searchParams.get('v');
      } else if (parsed.pathname.startsWith('/shorts/')) {
        ytId = parsed.pathname.split('/')[2] || null;
      } else if (parsed.pathname.startsWith('/embed/')) {
        ytId = parsed.pathname.split('/')[2] || null;
      }
    }
    if (ytId && /^[a-zA-Z0-9_-]{11}$/.test(ytId)) {
      return `https://www.youtube-nocookie.com/embed/${ytId}`;
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const match = parsed.pathname.match(/\/(?:video\/)?(\d{6,12})/);
      if (match?.[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatBlogDate(ms: number): string {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(ms));
  } catch {
    return '';
  }
}

function contentTypeLabel(type: WorkshopContentType): string {
  switch (type) {
    case 'image':
      return 'Imagen';
    case 'pdf':
      return 'Documento PDF';
    case 'video':
      return 'Video';
    case 'link':
      return 'Enlace Web';
  }
}

function extractTimestampMs(val: unknown): number {
  if (val instanceof Timestamp) return val.toMillis();
  if (
    val &&
    typeof val === 'object' &&
    'seconds' in val &&
    typeof (val as { seconds: number }).seconds === 'number'
  ) {
    return (val as { seconds: number }).seconds * 1000;
  }
  return Date.now();
}

async function compressImageForFirestore(
  file: File
): Promise<{ dataUrl: string; mimeType: string; approxBytes: number }> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('No se pudo decodificar la imagen seleccionada.'));
      el.src = objectUrl;
    });

    const attempts: Array<{ maxDim: number; quality: number; mime: string }> = [
      { maxDim: 1280, quality: 0.82, mime: 'image/webp' },
      { maxDim: 1280, quality: 0.78, mime: 'image/jpeg' },
      { maxDim: 1024, quality: 0.72, mime: 'image/jpeg' },
      { maxDim: 840, quality: 0.65, mime: 'image/jpeg' },
      { maxDim: 680, quality: 0.58, mime: 'image/jpeg' },
    ];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Tu navegador no permite optimizar la imagen.');
    }

    for (const step of attempts) {
      const ratio = Math.min(1, step.maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const targetW = Math.max(1, Math.round(img.naturalWidth * ratio));
      const targetH = Math.max(1, Math.round(img.naturalHeight * ratio));
      canvas.width = targetW;
      canvas.height = targetH;
      ctx.clearRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const dataUrl = canvas.toDataURL(step.mime, step.quality);
      if (
        dataUrl.length <= MAX_DATA_URL_CHARS &&
        (dataUrl.startsWith('data:image/jpeg;base64,') ||
          dataUrl.startsWith('data:image/webp;base64,') ||
          dataUrl.startsWith('data:image/png;base64,'))
      ) {
        const mimeMatch = dataUrl.match(/^data:(image\/[a-z]+);base64,/);
        const finalMime = mimeMatch?.[1] || 'image/jpeg';
        const approxBytes = Math.round(((dataUrl.length - dataUrl.indexOf(',') - 1) * 3) / 4);
        return { dataUrl, mimeType: finalMime, approxBytes };
      }
    }

    throw new Error('La imagen es demasiado compleja; intenta con una captura o JPG más liviano.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function uploadBinaryWithProgress(params: {
  file: File;
  idToken: string;
  postId: string;
  onProgress: (percent: number) => void;
}): Promise<{
  uploadedFileUrl: string;
  storedFileName: string;
  mimeType: string;
  fileSizeBytes: number;
}> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/workshop-blog/upload', true);
    xhr.setRequestHeader('Authorization', `Bearer ${params.idToken}`);
    xhr.setRequestHeader('Content-Type', params.file.type || 'application/octet-stream');
    xhr.setRequestHeader('X-Post-Id', params.postId);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && ev.total > 0) {
        params.onProgress(Math.min(99, Math.round((ev.loaded / ev.total) * 100)));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && data.uploadedFileUrl) {
          params.onProgress(100);
          resolve(data);
        } else {
          reject(new Error(data.error || 'No se pudo subir el archivo al servidor.'));
        }
      } catch {
        reject(new Error('Respuesta inesperada al subir el archivo.'));
      }
    };

    xhr.onerror = () => reject(new Error('Error de red durante la subida del archivo.'));
    xhr.send(params.file);
  });
}

async function deleteServerUploadedFile(uploadedFileUrl: string, idToken: string): Promise<void> {
  const safe = getSafeUploadedFileUrl(uploadedFileUrl);
  if (!safe) return;
  const fileName = safe.replace('/workshop-uploads/', '');
  try {
    await fetch(`/api/workshop-blog/upload/${encodeURIComponent(fileName)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } catch {
    // Best-effort cleanup
  }
}

export const WorkshopBlogTab: React.FC<WorkshopBlogTabProps> = ({
  initialComposerOpen = false,
  onComposerOpened,
  onPostCountChange,
  onSendPromptToBuilder,
}) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);

  // Real-time posts state
  const [posts, setPosts] = useState<WorkshopBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<Error | null>(null);

  // Admin private contacts drawer
  const [showAdminContacts, setShowAdminContacts] = useState(false);
  const [contacts, setContacts] = useState<WorkshopContactRecord[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Filters, reader modal & inline delete confirm
  const [filterType, setFilterType] = useState<'all' | WorkshopContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<WorkshopBlogPost | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Composer state
  const [isComposerOpen, setIsComposerOpen] = useState(initialComposerOpen);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Imagen IA');
  const [contentType, setContentType] = useState<WorkshopContentType>('image');
  const [description, setDescription] = useState('');
  const [promptUsed, setPromptUsed] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  // Image state (direct image or optional cover)
  const [selectedImageName, setSelectedImageName] = useState('');
  const [selectedImageMime, setSelectedImageMime] = useState('');
  const [selectedImageOriginalSize, setSelectedImageOriginalSize] = useState<number>(0);
  const [selectedImageOptimizedSize, setSelectedImageOptimizedSize] = useState<number>(0);
  const [compressedDataUrl, setCompressedDataUrl] = useState('');
  const [compressingImage, setCompressingImage] = useState(false);

  // Direct PDF / Video binary file state
  const [binaryFile, setBinaryFile] = useState<File | null>(null);
  const [binaryPreviewUrl, setBinaryPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingBinary, setIsDraggingBinary] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const binaryInputRef = useRef<HTMLInputElement | null>(null);

  const isAdmin = Boolean(
    currentUser &&
      currentUser.emailVerified &&
      currentUser.email?.toLowerCase() === WORKSHOP_ADMIN_EMAIL.toLowerCase()
  );

  if (fatalError) {
    throw fatalError;
  }

  useEffect(() => {
    if (initialComposerOpen) {
      setIsComposerOpen(true);
      onComposerOpened?.();
    }
  }, [initialComposerOpen, onComposerOpened]);

  useEffect(() => {
    return () => {
      if (binaryPreviewUrl && binaryPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(binaryPreviewUrl);
      }
    };
  }, [binaryPreviewUrl]);

  // 1. Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
      if (user) {
        setAuthorName((prev) => prev || user.displayName || '');
        setAuthorEmail((prev) => prev || user.email || '');
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore subscription to published workshop posts
  useEffect(() => {
    if (!authReady) return;
    setLoading(true);
    const postsQuery = query(
      collection(db, 'workshop_posts'),
      where('status', '==', 'published'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const loaded: WorkshopBlogPost[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            authorUid: typeof d.authorUid === 'string' ? d.authorUid : '',
            authorName: typeof d.authorName === 'string' ? d.authorName : 'Asistente',
            title: typeof d.title === 'string' ? d.title : 'Sin título',
            description: typeof d.description === 'string' ? d.description : undefined,
            promptUsed: typeof d.promptUsed === 'string' ? d.promptUsed : undefined,
            category: typeof d.category === 'string' ? d.category : 'Imagen IA',
            contentType:
              d.contentType === 'image' ||
              d.contentType === 'pdf' ||
              d.contentType === 'video' ||
              d.contentType === 'link'
                ? d.contentType
                : 'link',
            mediaDataUrl: typeof d.mediaDataUrl === 'string' ? d.mediaDataUrl : undefined,
            uploadedFileUrl: typeof d.uploadedFileUrl === 'string' ? d.uploadedFileUrl : undefined,
            externalUrl: typeof d.externalUrl === 'string' ? d.externalUrl : undefined,
            fileName: typeof d.fileName === 'string' ? d.fileName : undefined,
            mimeType: typeof d.mimeType === 'string' ? d.mimeType : undefined,
            fileSizeBytes: typeof d.fileSizeBytes === 'number' ? d.fileSizeBytes : undefined,
            status: d.status === 'archived' ? 'archived' : 'published',
            createdAtMs: extractTimestampMs(d.createdAt),
          };
        });

        loaded.sort((a, b) => b.createdAtMs - a.createdAtMs);
        setPosts(loaded);
        onPostCountChange?.(loaded.length);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        try {
          handleFirestoreError(err, OperationType.LIST, 'workshop_posts');
        } catch (wrapped) {
          setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
        }
      }
    );

    return () => unsubscribe();
  }, [authReady, onPostCountChange]);

  // 3. Admin-only real-time listener for isolated attendee contacts
  useEffect(() => {
    if (!authReady || !isAdmin || !showAdminContacts) return;
    setLoadingContacts(true);
    const contactsQuery = query(collection(db, 'workshop_contacts'), limit(200));

    const unsubscribe = onSnapshot(
      contactsQuery,
      (snapshot) => {
        const list: WorkshopContactRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            postId: typeof d.postId === 'string' ? d.postId : docSnap.id,
            authorUid: typeof d.authorUid === 'string' ? d.authorUid : '',
            authorName: typeof d.authorName === 'string' ? d.authorName : '',
            authorEmail: typeof d.authorEmail === 'string' ? d.authorEmail : '',
            postTitle: typeof d.postTitle === 'string' ? d.postTitle : '',
            createdAtMs: extractTimestampMs(d.createdAt),
          };
        });
        list.sort((a, b) => b.createdAtMs - a.createdAtMs);
        setContacts(list);
        setLoadingContacts(false);
      },
      (err) => {
        setLoadingContacts(false);
        try {
          handleFirestoreError(err, OperationType.LIST, 'workshop_contacts');
        } catch (wrapped) {
          setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
        }
      }
    );

    return () => unsubscribe();
  }, [authReady, isAdmin, showAdminContacts]);

  const handleGoogleSignIn = async () => {
    if (signingIn) return;
    setAuthError(null);
    setSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      if (result.user) {
        setAuthorName((prev) => prev || result.user.displayName || '');
        setAuthorEmail((prev) => prev || result.user.email || '');
      }
    } catch (err: unknown) {
      console.error('Google Sign-In error:', err);
      setAuthError(describeGoogleAuthError(err));
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setShowAdminContacts(false);
    setContacts([]);
  };

  const clearSelectedImage = () => {
    setSelectedImageName('');
    setSelectedImageMime('');
    setSelectedImageOriginalSize(0);
    setSelectedImageOptimizedSize(0);
    setCompressedDataUrl('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const clearBinaryFile = () => {
    if (binaryPreviewUrl && binaryPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(binaryPreviewUrl);
    }
    setBinaryFile(null);
    setBinaryPreviewUrl(null);
    setUploadProgress(0);
    if (binaryInputRef.current) binaryInputRef.current.value = '';
  };

  const processImageFile = async (file: File) => {
    setSubmitError(null);
    const mime = file.type.toLowerCase();
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mime)) {
      setSubmitError('Selecciona una imagen JPG, PNG o WebP.');
      return;
    }
    if (file.size > MAX_RAW_IMAGE_BYTES) {
      setSubmitError('La imagen supera 20 MB. Elige un archivo más liviano.');
      return;
    }

    setCompressingImage(true);
    try {
      const optimized = await compressImageForFirestore(file);
      setCompressedDataUrl(optimized.dataUrl);
      setSelectedImageName(file.name.slice(0, 180));
      setSelectedImageMime(optimized.mimeType);
      setSelectedImageOriginalSize(file.size);
      setSelectedImageOptimizedSize(optimized.approxBytes);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'No se pudo procesar la imagen seleccionada.'
      );
    } finally {
      setCompressingImage(false);
    }
  };

  const processBinaryFile = (file: File) => {
    setSubmitError(null);
    const mime = file.type.toLowerCase();
    const isPdf = mime === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isVideo =
      ['video/mp4', 'video/webm', 'video/quicktime'].includes(mime) ||
      /\.(mp4|webm|mov)$/i.test(file.name);

    if (contentType === 'pdf' && !isPdf) {
      setSubmitError('Selecciona un archivo PDF válido (.pdf).');
      return;
    }
    if (contentType === 'video' && !isVideo) {
      setSubmitError('Selecciona un video en formato MP4, WebM o MOV.');
      return;
    }
    if (!isPdf && !isVideo) {
      setSubmitError('Formato no soportado. Usa PDF o video MP4, WebM o MOV.');
      return;
    }

    const limitBytes = isPdf ? MAX_PDF_BYTES : MAX_VIDEO_BYTES;
    if (file.size > limitBytes) {
      const maxMb = Math.round(limitBytes / (1024 * 1024));
      setSubmitError(
        `El archivo pesa ${formatFileSize(file.size)} y supera el máximo directo de ${maxMb} MB. Si es más pesado, pega un enlace de Google Drive, YouTube o Vimeo abajo.`
      );
      return;
    }

    if (binaryPreviewUrl && binaryPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(binaryPreviewUrl);
    }

    setBinaryFile(file);
    setUploadProgress(0);
    if (isVideo) {
      setBinaryPreviewUrl(URL.createObjectURL(file));
    } else {
      setBinaryPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!currentUser) {
      setSubmitError('Inicia sesión con tu cuenta de Google para publicar en el blog del taller.');
      return;
    }
    if (!currentUser.emailVerified) {
      setSubmitError('Tu cuenta de Google debe tener el correo verificado para publicar.');
      return;
    }

    const cleanName = authorName.trim();
    const cleanEmail = authorEmail.trim();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanPrompt = promptUsed.trim();
    const cleanUrl = externalUrl.trim();

    if (cleanName.length < 2 || cleanName.length > 80) {
      setSubmitError('Escribe tu nombre (entre 2 y 80 caracteres).');
      return;
    }
    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 120) {
      setSubmitError('Escribe un correo electrónico válido.');
      return;
    }
    if (cleanTitle.length < 3 || cleanTitle.length > 140) {
      setSubmitError('Escribe un título claro (entre 3 y 140 caracteres).');
      return;
    }
    if (cleanUrl && !getSafeHref(cleanUrl)) {
      setSubmitError('El enlace debe comenzar por https:// o http://.');
      return;
    }
    if (contentType === 'image' && !compressedDataUrl && !cleanUrl) {
      setSubmitError('Sube una imagen (JPG, PNG o WebP) o agrega un enlace web.');
      return;
    }
    if ((contentType === 'pdf' || contentType === 'video') && !binaryFile && !cleanUrl) {
      setSubmitError(
        contentType === 'pdf'
          ? 'Sube tu archivo PDF desde el equipo o pega un enlace (Google Drive, Canva o web).'
          : 'Sube tu video MP4/WebM/MOV desde el equipo o pega un enlace (YouTube, Vimeo o Drive).'
      );
      return;
    }
    if (contentType === 'link' && !cleanUrl) {
      setSubmitError('Pega el enlace web del proyecto que deseas compartir.');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);
    const postId = createSafePostId();
    let uploadedBinaryResult: {
      uploadedFileUrl: string;
      storedFileName: string;
      mimeType: string;
      fileSizeBytes: number;
    } | null = null;
    let idToken = '';

    try {
      // Step 1: If a direct PDF/Video binary was selected, upload it securely first
      if ((contentType === 'pdf' || contentType === 'video') && binaryFile) {
        idToken = await currentUser.getIdToken();
        uploadedBinaryResult = await uploadBinaryWithProgress({
          file: binaryFile,
          idToken,
          postId,
          onProgress: setUploadProgress,
        });
      }

      // Step 2: Build strict Firestore payload matching firebase-blueprint.json & firestore.rules
      const postPayload: Record<string, unknown> = {
        authorUid: currentUser.uid,
        authorName: cleanName,
        title: cleanTitle,
        category,
        contentType,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (cleanDescription) postPayload.description = cleanDescription.slice(0, 2000);
      if (cleanPrompt) postPayload.promptUsed = cleanPrompt.slice(0, 1500);

      if (uploadedBinaryResult) {
        postPayload.uploadedFileUrl = uploadedBinaryResult.uploadedFileUrl;
        postPayload.fileName = (binaryFile?.name || uploadedBinaryResult.storedFileName).slice(
          0,
          180
        );
        postPayload.mimeType = uploadedBinaryResult.mimeType.slice(0, 80);
        postPayload.fileSizeBytes = uploadedBinaryResult.fileSizeBytes;
      }

      if (compressedDataUrl) {
        postPayload.mediaDataUrl = compressedDataUrl;
        if (!uploadedBinaryResult) {
          if (selectedImageName) postPayload.fileName = selectedImageName.slice(0, 180);
          if (selectedImageMime) postPayload.mimeType = selectedImageMime.slice(0, 80);
          if (selectedImageOptimizedSize > 0) postPayload.fileSizeBytes = selectedImageOptimizedSize;
        }
      }

      if (cleanUrl) {
        postPayload.externalUrl = cleanUrl.slice(0, 1000);
      }

      const contactPayload = {
        postId,
        authorUid: currentUser.uid,
        authorName: cleanName,
        authorEmail: cleanEmail,
        postTitle: cleanTitle,
        createdAt: serverTimestamp(),
      };

      // Step 3: Atomic batch write to Firestore
      const batch = writeBatch(db);
      batch.set(doc(db, 'workshop_posts', postId), postPayload);
      batch.set(doc(db, 'workshop_contacts', postId), contactPayload);
      await batch.commit();

      setSubmitSuccess('¡Publicado en tiempo real en el Blog del Taller!');
      setTitle('');
      setDescription('');
      setPromptUsed('');
      setExternalUrl('');
      clearSelectedImage();
      clearBinaryFile();
    } catch (err: unknown) {
      // Clean up orphaned server upload if Firestore write failed
      if (uploadedBinaryResult && idToken) {
        await deleteServerUploadedFile(uploadedBinaryResult.uploadedFileUrl, idToken);
      }
      if (err instanceof Error && !err.message.toLowerCase().includes('permission')) {
        setSubmitError(err.message);
      } else {
        try {
          handleFirestoreError(err, OperationType.WRITE, `workshop_posts/${postId}`);
        } catch {
          setSubmitError(
            'No se pudo guardar la publicación. Revisa tu conexión o los campos ingresados e intenta nuevamente.'
          );
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (post: WorkshopBlogPost) => {
    if (!currentUser) return;
    setDeletingId(post.id);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'workshop_posts', post.id));
      batch.delete(doc(db, 'workshop_contacts', post.id));
      await batch.commit();

      if (post.uploadedFileUrl) {
        const idToken = await currentUser.getIdToken();
        await deleteServerUploadedFile(post.uploadedFileUrl, idToken);
      }

      if (selectedPost?.id === post.id) setSelectedPost(null);
      setConfirmDeleteId(null);
    } catch (err: unknown) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `workshop_posts/${post.id}`);
      } catch (wrapped) {
        setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportContactsCsv = () => {
    const header = ['Fecha', 'Nombre', 'Correo', 'Publicación'];
    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const rows = contacts.map((c) =>
      [formatBlogDate(c.createdAtMs), c.authorName, c.authorEmail, c.postTitle]
        .map(escapeCsv)
        .join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asistentes_taller_nucleo_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      if (filterType !== 'all' && post.contentType !== filterType) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q) ||
        (post.description || '').toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      );
    });
  }, [posts, filterType, searchQuery]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      image: posts.filter((p) => p.contentType === 'image').length,
      pdf: posts.filter((p) => p.contentType === 'pdf').length,
      video: posts.filter((p) => p.contentType === 'video').length,
      link: posts.filter((p) => p.contentType === 'link').length,
    }),
    [posts]
  );

  return (
    <div className="space-y-8">
      {/* Top Editorial Header + Auth & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#DEDAD0] dark:border-[#26262E] pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300]">
            Blog Colectivo del Taller · Sincronización en tiempo real
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans tracking-tight text-[#101014] dark:text-[#F4F2ED] text-balance">
            Publicaciones de asistentes y memoria visual
          </h2>
          <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
            Sube directamente desde tu dispositivo imágenes (JPG/PNG), documentos PDF (hasta 15 MB) y videos MP4/WebM (hasta 25 MB), o comparte enlaces de YouTube, Vimeo, Drive y proyectos web.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-xs text-[#101014] dark:text-[#F4F2ED]">
              <User className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
              <span className="font-semibold max-w-[140px] truncate">
                {currentUser.displayName || currentUser.email}
              </span>
              {isAdmin && (
                <span className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300]">
                  · Admin
                </span>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="ml-1 text-[#5B5B66] dark:text-[#A09E97] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              {signingIn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogIn className="w-3.5 h-3.5 text-[#326BFF]" />
              )}
              <span>Entrar con Google</span>
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowAdminContacts((prev) => !prev)}
              className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                showAdminContacts
                  ? 'bg-[#7545D6] text-white border-[#7545D6]'
                  : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Directorio privado</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsComposerOpen((prev) => !prev);
              setSubmitError(null);
              setSubmitSuccess(null);
              setAuthError(null);
            }}
            className="min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            {isComposerOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isComposerOpen ? 'Cerrar formulario' : 'Publicar contenido'}</span>
          </button>
        </div>
      </div>

      {authError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/35 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-100 space-y-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="font-bold text-red-900 dark:text-red-100">{authError.title}</p>
              {authError.detail && (
                <p className="text-red-800/90 dark:text-red-200/90 leading-relaxed">
                  {authError.detail}
                </p>
              )}
              {authError.code && (
                <p className="font-mono-code text-[11px] text-red-700/80 dark:text-red-300/80">
                  Código: {authError.code}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="p-1 rounded-md text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer shrink-0"
              aria-label="Cerrar aviso de inicio de sesión"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {(authError.consoleUrl || authError.suggestNewTab) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {authError.consoleUrl && (
                <a
                  href={authError.consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-700 hover:bg-red-800 text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{authError.consoleLabel || 'Abrir Firebase Console'}</span>
                </a>
              )}
              {authError.suggestNewTab && typeof window !== 'undefined' && (
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#16161C] border border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 hover:bg-red-100/60 dark:hover:bg-red-950/60 inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir en pestaña nueva</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Admin-Only Private Attendee Directory */}
      {isAdmin && showAdminContacts && (
        <div className="rounded-2xl bg-white dark:bg-[#16161C] border border-[#7545D6]/40 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE6DC] dark:border-[#26262E] pb-4">
            <div>
              <p className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300]">
                Solo visible para administración · Correos protegidos
              </p>
              <h3 className="text-base font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] mt-0.5">
                Directorio de asistentes ({contacts.length})
              </h3>
              <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                Los correos nunca se muestran en las tarjetas públicas del blog; se guardan aislados aquí para seguimiento del taller.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportContactsCsv}
              disabled={contacts.length === 0}
              className="min-h-[38px] px-3.5 py-2 rounded-lg text-xs font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>

          {loadingContacts ? (
            <div className="py-6 text-center text-xs text-[#5B5B66] dark:text-[#A09E97] inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando registros privados...</span>
            </div>
          ) : contacts.length === 0 ? (
            <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
              Todavía no hay registros de contacto de asistentes.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#EAE6DC] dark:border-[#26262E] text-[11px] font-mono-code uppercase text-[#5B5B66] dark:text-[#A09E97]">
                    <th className="py-2 pr-4">Asistente</th>
                    <th className="py-2 pr-4">Correo</th>
                    <th className="py-2 pr-4">Publicación</th>
                    <th className="py-2">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DC] dark:divide-[#26262E]">
                  {contacts.map((c) => (
                    <tr key={c.id} className="text-[#101014] dark:text-[#F4F2ED]">
                      <td className="py-2.5 pr-4 font-semibold whitespace-nowrap">{c.authorName}</td>
                      <td className="py-2.5 pr-4 font-mono-code text-[#326BFF] dark:text-[#93B4FF] whitespace-nowrap">
                        <a
                          href={`mailto:${c.authorEmail}`}
                          className="hover:underline inline-flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{c.authorEmail}</span>
                        </a>
                      </td>
                      <td className="py-2.5 pr-4 max-w-[260px] truncate">{c.postTitle}</td>
                      <td className="py-2.5 font-mono-code text-[#5B5B66] dark:text-[#A09E97] whitespace-nowrap">
                        {formatBlogDate(c.createdAtMs)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Simple Real-Time Composer */}
      {isComposerOpen && (
        <div className="rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] p-5 sm:p-7">
          {!currentUser ? (
            <div className="py-6 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-xl bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300] mx-auto flex items-center justify-center">
                <LogIn className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                  Inicia sesión con Google para publicar
                </h3>
                <p className="text-sm text-[#5B5B66] dark:text-[#A09E97]">
                  Así acreditamos tu autoría, protegemos tu correo electrónico y podrás subir imágenes, PDFs, videos o enlaces y gestionar tus publicaciones.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] hover:opacity-90 inline-flex items-center gap-2 transition-opacity cursor-pointer"
              >
                {signingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>Continuar con Google</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EAE6DC] dark:border-[#26262E]">
                <div>
                  <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                    Publicar proyecto en el Blog del Taller
                  </h3>
                  <p className="text-xs text-[#5B5B66] dark:text-[#A09E97] mt-0.5">
                    Sube archivos directamente desde tu dispositivo o pega un enlace. Tu correo se guarda privado para la coordinación del taller.
                  </p>
                </div>
                <span className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97] shrink-0">
                  PDF ≤ 15 MB · Video ≤ 25 MB
                </span>
              </div>

              {/* 1. Content Type Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]">
                  1. ¿Qué deseas compartir?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'image', label: 'Imagen (JPG / PNG)', icon: ImageIcon },
                      { id: 'pdf', label: 'Documento (PDF)', icon: FileText },
                      { id: 'video', label: 'Video (MP4 / WebM)', icon: Film },
                      { id: 'link', label: 'Enlace Web', icon: Globe },
                    ] as const
                  ).map((item) => {
                    const Icon = item.icon;
                    const active = contentType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setContentType(item.id);
                          clearBinaryFile();
                          if (item.id === 'pdf') setCategory('Documento / PDF');
                          if (item.id === 'video') setCategory('Video y Cine');
                          if (item.id === 'link') setCategory('Proyecto Web');
                        }}
                        className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                            : 'bg-[#FAF8F5] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Attendee Name & Private Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="wb-author-name"
                    className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]"
                  >
                    Nombre del asistente *
                  </label>
                  <input
                    id="wb-author-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ej. Camila Restrepo"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="wb-author-email"
                    className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]"
                  >
                    Correo electrónico *{' '}
                    <span className="font-normal text-[#5B5B66] dark:text-[#A09E97]">
                      (privado, no se publica en tarjetas)
                    </span>
                  </label>
                  <input
                    id="wb-author-email"
                    type="email"
                    required
                    maxLength={120}
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="camila@ejemplo.com"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>
              </div>

              {/* 3. Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label
                    htmlFor="wb-title"
                    className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]"
                  >
                    Título de la publicación *
                  </label>
                  <input
                    id="wb-title"
                    type="text"
                    required
                    minLength={3}
                    maxLength={140}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Serie botánica en luz Rembrandt · Taller Medellín"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="wb-category"
                    className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]"
                  >
                    Categoría
                  </label>
                  <select
                    id="wb-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4A. Direct Binary File Dropzone for PDF & Video */}
              {(contentType === 'pdf' || contentType === 'video') && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]">
                    {contentType === 'pdf'
                      ? 'Subir archivo PDF directamente desde tu dispositivo (hasta 15 MB)'
                      : 'Subir video MP4, WebM o MOV directamente desde tu dispositivo (hasta 25 MB)'}
                  </label>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingBinary(true);
                    }}
                    onDragLeave={() => setIsDraggingBinary(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingBinary(false);
                      const f = e.dataTransfer.files?.[0];
                      if (f) processBinaryFile(f);
                    }}
                    className={`rounded-xl border-2 border-dashed p-5 transition-colors ${
                      isDraggingBinary
                        ? 'border-[#7545D6] bg-[#7545D6]/5'
                        : 'border-[#D4CFC2] dark:border-[#343442] bg-[#FAF8F5] dark:bg-[#101014]'
                    }`}
                  >
                    <input
                      ref={binaryInputRef}
                      type="file"
                      accept={
                        contentType === 'pdf'
                          ? 'application/pdf,.pdf'
                          : 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov'
                      }
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) processBinaryFile(f);
                      }}
                      className="hidden"
                    />

                    {binaryFile ? (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-14 h-14 rounded-lg bg-[#101014] text-[#F8C300] flex items-center justify-center shrink-0">
                              {contentType === 'pdf' ? (
                                <FileText className="w-6 h-6" />
                              ) : (
                                <Film className="w-6 h-6" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED] truncate">
                                {binaryFile.name}
                              </p>
                              <p className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                                {binaryFile.type || contentType.toUpperCase()} ·{' '}
                                {formatFileSize(binaryFile.size)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => binaryInputRef.current?.click()}
                              className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF] cursor-pointer whitespace-nowrap"
                            >
                              Cambiar archivo
                            </button>
                            <button
                              type="button"
                              onClick={clearBinaryFile}
                              className="px-2.5 py-2 text-xs font-semibold rounded-lg border border-red-300 dark:border-red-900/60 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                              aria-label="Quitar archivo seleccionado"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {binaryPreviewUrl && contentType === 'video' && (
                          <video
                            src={binaryPreviewUrl}
                            controls
                            preload="metadata"
                            className="w-full max-h-56 rounded-lg bg-black object-contain"
                          />
                        )}

                        {submitting && uploadProgress > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                              <span>Subiendo archivo...</span>
                              <span className="tabular-nums">{uploadProgress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-[#DEDAD0] dark:bg-[#26262E] overflow-hidden">
                              <div
                                className="h-full bg-[#326BFF] transition-all duration-150"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-3 space-y-2">
                        {contentType === 'pdf' ? (
                          <FileText className="w-6 h-6 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
                        ) : (
                          <Film className="w-6 h-6 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
                        )}
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[#101014] dark:text-[#F4F2ED]">
                            Arrastra tu {contentType === 'pdf' ? 'PDF' : 'video'} aquí o{' '}
                            <button
                              type="button"
                              onClick={() => binaryInputRef.current?.click()}
                              className="text-[#326BFF] dark:text-[#F8C300] font-bold underline underline-offset-2 cursor-pointer"
                            >
                              selecciónalo desde tu equipo
                            </button>
                          </p>
                          <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                            {contentType === 'pdf'
                              ? 'PDF directo hasta 15 MB · También puedes pegar un enlace abajo si lo prefieres'
                              : 'MP4, WebM o MOV hasta 25 MB · Para videos más largos pega el enlace de YouTube/Vimeo abajo'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4B. External URL (Required for link, optional if binary/image provided) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="wb-external-url"
                  className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  {contentType === 'link'
                    ? 'Enlace web del proyecto *'
                    : contentType === 'pdf'
                    ? 'O pega el enlace al PDF (Google Drive, Canva, Dropbox) — opcional si subes archivo'
                    : contentType === 'video'
                    ? 'O pega el enlace del video (YouTube, Vimeo, Google Drive) — opcional si subes archivo'
                    : 'Enlace relacionado (portafolio, demo o repositorio) — opcional'}
                </label>
                <input
                  id="wb-external-url"
                  type="url"
                  required={contentType === 'link'}
                  maxLength={1000}
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder={
                    contentType === 'video'
                      ? 'https://youtu.be/... o https://vimeo.com/...'
                      : contentType === 'pdf'
                      ? 'https://drive.google.com/file/d/...'
                      : 'https://...'
                  }
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                />
              </div>

              {/* 5. Direct Image Upload (Primary for Image, Optional Cover for PDF/Link/Video) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]">
                  {contentType === 'image'
                    ? 'Imagen del proyecto (JPG, PNG o WebP) *'
                    : 'Imagen de portada o captura del proyecto (opcional)'}
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) void processImageFile(f);
                  }}
                  className={`rounded-xl border-2 border-dashed p-5 transition-colors ${
                    isDraggingImage
                      ? 'border-[#326BFF] bg-[#326BFF]/5'
                      : 'border-[#D4CFC2] dark:border-[#343442] bg-[#FAF8F5] dark:bg-[#101014]'
                  }`}
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void processImageFile(f);
                    }}
                    className="hidden"
                  />

                  {compressingImage ? (
                    <div className="py-4 text-center space-y-2">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin text-[#7545D6] dark:text-[#F8C300]" />
                      <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                        Optimizando imagen para carga rápida...
                      </p>
                    </div>
                  ) : compressedDataUrl ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={compressedDataUrl}
                          alt={selectedImageName || 'Vista previa'}
                          className="w-16 h-16 rounded-lg object-cover border border-[#DEDAD0] dark:border-[#2C2C36] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED] truncate">
                            {selectedImageName}
                          </p>
                          <p className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                            {formatFileSize(selectedImageOriginalSize)} →{' '}
                            {formatFileSize(selectedImageOptimizedSize)} optimizada
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF] cursor-pointer whitespace-nowrap"
                        >
                          Cambiar imagen
                        </button>
                        <button
                          type="button"
                          onClick={clearSelectedImage}
                          className="px-2.5 py-2 text-xs font-semibold rounded-lg border border-red-300 dark:border-red-900/60 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                          aria-label="Quitar imagen seleccionada"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3 space-y-2">
                      <Upload className="w-6 h-6 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#101014] dark:text-[#F4F2ED]">
                          Arrastra una imagen aquí o{' '}
                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="text-[#326BFF] dark:text-[#F8C300] font-bold underline underline-offset-2 cursor-pointer"
                          >
                            selecciónala desde tu equipo
                          </button>
                        </p>
                        <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                          JPG, PNG o WebP · Se optimiza automáticamente al subir
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Description & Optional Prompt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="wb-description"
                    className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]"
                  >
                    Descripción o reflexión del proceso
                  </label>
                  <textarea
                    id="wb-description"
                    rows={3}
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Cuenta brevemente la idea, las herramientas usadas o qué descubriste en el taller..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="wb-prompt"
                    className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]"
                  >
                    Prompt utilizado (opcional)
                  </label>
                  <textarea
                    id="wb-prompt"
                    rows={3}
                    maxLength={1500}
                    value={promptUsed}
                    onChange={(e) => setPromptUsed(e.target.value)}
                    placeholder="Si usaste un prompt, compártelo para que otros asistentes puedan probarlo..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs font-mono-code text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>
              </div>

              {/* Feedback Banners */}
              {submitError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-xs font-medium text-red-800 dark:text-red-200"
                >
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {/* Submit Row */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="min-h-[42px] px-4 py-2 rounded-lg text-xs font-semibold text-[#4A4A55] dark:text-[#B4B2AC] hover:text-[#101014] dark:hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || compressingImage}
                  className="min-h-[42px] px-5 py-2.5 rounded-lg text-xs font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] hover:opacity-90 disabled:opacity-60 inline-flex items-center gap-2 transition-opacity cursor-pointer whitespace-nowrap shadow-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {uploadProgress > 0 && uploadProgress < 100
                          ? `Subiendo (${uploadProgress}%)...`
                          : 'Publicando...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Publicar en el Blog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all', label: `Todas (${counts.all})` },
              { id: 'image', label: `Imágenes (${counts.image})` },
              { id: 'pdf', label: `PDFs (${counts.pdf})` },
              { id: 'video', label: `Videos (${counts.video})` },
              { id: 'link', label: `Enlaces Web (${counts.link})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                filterType === tab.id
                  ? 'bg-[#326BFF] text-white border-[#326BFF] font-bold'
                  : 'bg-white dark:bg-[#16161C] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#5B5B66] dark:text-[#A09E97] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por autor, título o tema..."
            aria-label="Buscar publicaciones del blog del taller"
            className="w-full min-h-[38px] pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
          />
        </div>
      </div>

      {/* Blog Feed States */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-6 h-6 mx-auto animate-spin text-[#7545D6] dark:text-[#F8C300]" />
          <p className="text-sm text-[#5B5B66] dark:text-[#A09E97]">
            Conectando con el blog del taller...
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-10 sm:p-14 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-center space-y-4">
          <BookOpen className="w-8 h-8 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              {posts.length === 0
                ? 'Aún no hay publicaciones en el blog del taller'
                : 'No encontramos publicaciones con ese filtro'}
            </h3>
            <p className="text-sm text-[#5B5B66] dark:text-[#A09E97]">
              {posts.length === 0
                ? 'Sé la primera persona en subir una imagen, PDF, video o enlace web de tu proceso creativo.'
                : 'Prueba limpiando la búsqueda o seleccionando otra categoría.'}
            </p>
          </div>
          {posts.length === 0 && (
            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar primer proyecto</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const safeImage = getSafeDataImage(post.mediaDataUrl);
            const safeUploadedUrl = getSafeUploadedFileUrl(post.uploadedFileUrl);
            const safeExternalUrl = getSafeHref(post.externalUrl);
            const safeEmbed = getVideoEmbedUrl(post.externalUrl);
            const hostLabel = getSafeHostname(post.externalUrl);
            const primaryResourceUrl = safeUploadedUrl || safeExternalUrl;
            const isUploadedVideo = Boolean(
              safeUploadedUrl && /\.(mp4|webm|mov)$/i.test(safeUploadedUrl)
            );
            const isUploadedPdf = Boolean(safeUploadedUrl && /\.pdf$/i.test(safeUploadedUrl));
            const canDelete = Boolean(
              currentUser && (currentUser.uid === post.authorUid || isAdmin)
            );

            return (
              <article
                key={post.id}
                className="rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] overflow-hidden flex flex-col justify-between transition-colors hover:border-[#326BFF]/60"
              >
                <div>
                  {/* Media Lead */}
                  {post.contentType === 'video' && isUploadedVideo && safeUploadedUrl ? (
                    <div className="w-full aspect-[16/10] bg-[#101014]">
                      <video
                        src={safeUploadedUrl}
                        poster={safeImage || undefined}
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : post.contentType === 'video' && safeEmbed ? (
                    <div className="w-full aspect-[16/10] bg-[#101014]">
                      <iframe
                        src={safeEmbed}
                        title={post.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : safeImage ? (
                    <button
                      type="button"
                      onClick={() => setSelectedPost(post)}
                      className="block w-full aspect-[16/10] overflow-hidden bg-[#101014] cursor-pointer group"
                      aria-label={`Ver vista ampliada de ${post.title}`}
                    >
                      <img
                        src={safeImage}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>
                  ) : post.contentType === 'pdf' ? (
                    <div className="w-full aspect-[16/10] bg-[#ECE8F7] dark:bg-[#1A1728] p-6 flex flex-col justify-between border-b border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="flex items-center justify-between text-xs font-mono-code font-bold uppercase tracking-wider text-[#4C2699] dark:text-[#C4A5FF]">
                        <span>{isUploadedPdf ? 'PDF Directo' : 'Documento PDF'}</span>
                        {post.fileSizeBytes ? (
                          <span className="tabular-nums font-normal">
                            {formatFileSize(post.fileSizeBytes)}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#7545D6] text-white flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED] line-clamp-2">
                          {post.fileName || post.title}
                        </p>
                      </div>
                      {primaryResourceUrl && (
                        <a
                          href={primaryResourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#326BFF] dark:text-[#F8C300] inline-flex items-center gap-1.5 hover:underline"
                        >
                          <span>Abrir o descargar PDF</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ) : post.contentType === 'video' ? (
                    <div className="w-full aspect-[16/10] bg-[#16141F] p-6 flex flex-col justify-between border-b border-[#26262E]">
                      <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#F8C300]">
                        Video del Taller
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#F8C300] text-[#101014] flex items-center justify-center shrink-0">
                          <Film className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-[#F4F2ED] truncate">
                          {hostLabel || 'Enlace de video'}
                        </p>
                      </div>
                      {primaryResourceUrl && (
                        <a
                          href={primaryResourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#F8C300] inline-flex items-center gap-1.5 hover:underline"
                        >
                          <span>Reproducir video</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/10] bg-[#E8EFFB] dark:bg-[#141A29] p-6 flex flex-col justify-between border-b border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#1E4BB8] dark:text-[#93B4FF]">
                        Enlace Web
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#326BFF] text-white flex items-center justify-center shrink-0">
                          <Globe className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED] truncate">
                          {hostLabel || 'Recurso externo'}
                        </p>
                      </div>
                      {primaryResourceUrl && (
                        <a
                          href={primaryResourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#1E4BB8] dark:text-[#F8C300] inline-flex items-center gap-1.5 hover:underline"
                        >
                          <span>Visitar sitio web</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Editorial Card Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="text-[11px] font-mono-code font-semibold text-[#7545D6] dark:text-[#F8C300]">
                      {contentTypeLabel(post.contentType)} · {post.category} ·{' '}
                      {formatBlogDate(post.createdAtMs)}
                    </div>

                    <h3 className="text-base font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-snug">
                      {post.title}
                    </h3>

                    {post.description && (
                      <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    )}

                    <div className="pt-1 flex items-center gap-2 text-xs text-[#5B5B66] dark:text-[#A09E97]">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-semibold text-[#101014] dark:text-[#F4F2ED] truncate">
                        {post.authorName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 border-t border-[#EAE6DC] dark:border-[#26262E] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors cursor-pointer"
                  >
                    Leer ficha completa
                  </button>

                  <div className="flex items-center gap-2">
                    {post.promptUsed && (
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(post.promptUsed!, post.id)}
                        className="p-1.5 rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] text-[#4A4A55] dark:text-[#B4B2AC] hover:border-[#326BFF] cursor-pointer"
                        aria-label="Copiar prompt utilizado"
                        title="Copiar prompt"
                      >
                        {copiedId === post.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    {primaryResourceUrl && (
                      <a
                        href={primaryResourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] text-[#326BFF] dark:text-[#F8C300] hover:border-[#326BFF]"
                        aria-label="Abrir archivo o enlace"
                        title="Abrir archivo o enlace"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {canDelete &&
                      (confirmDeleteId === post.id ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            disabled={deletingId === post.id}
                            onClick={() => void handleDeletePost(post)}
                            className="px-2 py-1 rounded-md text-[11px] font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                          >
                            {deletingId === post.id ? '...' : 'Borrar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-1 rounded-md text-[11px] font-semibold text-[#5B5B66] dark:text-[#A09E97] cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(post.id)}
                          className="p-1.5 rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] text-[#5B5B66] dark:text-[#A09E97] hover:border-red-500 hover:text-red-600 cursor-pointer"
                          aria-label="Eliminar publicación"
                          title="Eliminar publicación"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Editorial Reader & Lightbox Modal */}
      {selectedPost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wb-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-white/95 dark:bg-[#16161C]/95 backdrop-blur-xs border-b border-[#EAE6DC] dark:border-[#26262E]">
              <div className="text-xs font-mono-code font-semibold text-[#7545D6] dark:text-[#F8C300] truncate">
                {contentTypeLabel(selectedPost.contentType)} · {selectedPost.category} ·{' '}
                {formatBlogDate(selectedPost.createdAtMs)}
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF] cursor-pointer"
                aria-label="Cerrar detalle de publicación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Full Preview */}
              {(() => {
                const modalImage = getSafeDataImage(selectedPost.mediaDataUrl);
                const modalUploaded = getSafeUploadedFileUrl(selectedPost.uploadedFileUrl);
                const modalEmbed = getVideoEmbedUrl(selectedPost.externalUrl);
                const isUploadedVid = Boolean(
                  modalUploaded && /\.(mp4|webm|mov)$/i.test(modalUploaded)
                );
                const isUploadedPdf = Boolean(modalUploaded && /\.pdf$/i.test(modalUploaded));

                if (isUploadedVid && modalUploaded) {
                  return (
                    <div className="w-full rounded-xl overflow-hidden bg-[#101014]">
                      <video
                        src={modalUploaded}
                        poster={modalImage || undefined}
                        controls
                        className="w-full max-h-[60vh] mx-auto"
                      />
                    </div>
                  );
                }
                if (selectedPost.contentType === 'video' && modalEmbed) {
                  return (
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#101014]">
                      <iframe
                        src={modalEmbed}
                        title={selectedPost.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  );
                }
                if (isUploadedPdf && modalUploaded) {
                  return (
                    <div className="w-full h-[55vh] rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                      <iframe
                        src={modalUploaded}
                        title={selectedPost.fileName || selectedPost.title}
                        className="w-full h-full border-0"
                      />
                    </div>
                  );
                }
                if (modalImage) {
                  return (
                    <div className="rounded-xl overflow-hidden bg-[#101014] border border-[#EAE6DC] dark:border-[#26262E]">
                      <img
                        src={modalImage}
                        alt={selectedPost.title}
                        className="w-full max-h-[60vh] object-contain mx-auto"
                      />
                    </div>
                  );
                }
                return null;
              })()}

              {/* Title & Author */}
              <div className="space-y-2">
                <h3
                  id="wb-modal-title"
                  className="text-2xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]"
                >
                  {selectedPost.title}
                </h3>
                <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                  Por{' '}
                  <strong className="text-[#101014] dark:text-[#F4F2ED]">
                    {selectedPost.authorName}
                  </strong>
                  {selectedPost.fileSizeBytes
                    ? ` · ${formatFileSize(selectedPost.fileSizeBytes)}`
                    : ''}
                </p>
              </div>

              {selectedPost.description && (
                <p className="text-sm text-[#353540] dark:text-[#D1CFC8] leading-relaxed whitespace-pre-line">
                  {selectedPost.description}
                </p>
              )}

              {selectedPost.promptUsed && (
                <div className="rounded-xl bg-[#FAF8F5] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Prompt compartido</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(selectedPost.promptUsed!, selectedPost.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#DEDAD0] dark:border-[#2C2C36] bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId === selectedPost.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                      {onSendPromptToBuilder && (
                        <button
                          type="button"
                          onClick={() => {
                            onSendPromptToBuilder({
                              subject: selectedPost.promptUsed || selectedPost.title,
                              customNotes: `Inspirado en ${selectedPost.title} (${selectedPost.authorName})`,
                            });
                            setSelectedPost(null);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F8C300] text-[#101014] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Probar en Constructor</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <pre className="text-xs font-mono-code text-[#2D2D36] dark:text-[#D4D2CC] whitespace-pre-wrap leading-relaxed">
                    {selectedPost.promptUsed}
                  </pre>
                </div>
              )}

              {/* Direct File / External Link Actions */}
              {(() => {
                const modalUploaded = getSafeUploadedFileUrl(selectedPost.uploadedFileUrl);
                const modalExternal = getSafeHref(selectedPost.externalUrl);
                if (!modalUploaded && !modalExternal) return null;
                return (
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#EAE6DC] dark:border-[#26262E]">
                    {modalUploaded && (
                      <>
                        <a
                          href={modalUploaded}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] inline-flex items-center gap-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Abrir archivo en nueva pestaña</span>
                        </a>
                        <a
                          href={modalUploaded}
                          download={selectedPost.fileName || true}
                          className="min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar</span>
                        </a>
                      </>
                    )}
                    {modalExternal && (
                      <a
                        href={modalExternal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold bg-[#326BFF] hover:bg-[#2358E6] text-white inline-flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>
                          {selectedPost.contentType === 'pdf'
                            ? 'Abrir enlace PDF'
                            : selectedPost.contentType === 'video'
                            ? 'Abrir enlace de video'
                            : 'Abrir enlace externo'}
                        </span>
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
