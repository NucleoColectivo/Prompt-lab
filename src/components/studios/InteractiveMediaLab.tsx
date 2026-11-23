import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Activity,
  Camera,
  CameraOff,
  Check,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Hand,
  Layers,
  Mic,
  MicOff,
  Music,
  Play,
  Radio,
  RotateCcw,
  ScanFace,
  Sliders,
  Sparkles,
  Upload,
  Volume2,
  VolumeX,
  Wand2,
} from 'lucide-react';
import {
  INTERACTIVE_AREAS_CATALOG,
  INTERACTIVE_ART_REFERENCES,
  PLAYABLE_EXPERIMENTS,
  PROMPT_BLUEPRINT_ENGINES,
  PROMPT_BLUEPRINT_SENSORS,
  PROMPT_BLUEPRINT_STACKS,
  SENSOR_CAPABILITIES,
  type InteractiveAreaId,
  type PlayableExperimentPreset,
} from '../../data/interactiveMediaLabData';
import type { PromptBuilderState } from '../PromptBuilder';

interface InteractiveMediaLabProps {
  onApplyToBuilder: (patch: Partial<PromptBuilderState>) => void;
  onOpenWebLab?: () => void;
}

type StudioMode = 'camera-motion' | 'hand-face-hud' | 'audio-reactive' | 'video-art';
type GestureSubMode = 'air-piano' | 'ipd-grid' | 'sculpture-wah';
type VideoArtStyle = 'particles' | 'feedback' | 'scanline' | 'duotone';
type PaletteChoice = 'nucleo-gold' | 'violet-electric' | 'mono-chrome';
type DockTab = 'interaccion' | 'audio' | 'estetica';
type MlStatus = 'idle' | 'loading' | 'ready' | 'fallback';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: string;
}

interface SoundRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  label: string;
}

interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
}

const AIR_PIANO_NOTES = [
  { label: 'C4', key: 'A', freq: 261.63 },
  { label: 'D4', key: 'S', freq: 293.66 },
  { label: 'E4', key: 'D', freq: 329.63 },
  { label: 'G4', key: 'F', freq: 392.0 },
  { label: 'A4', key: 'G', freq: 440.0 },
  { label: 'C5', key: 'H', freq: 523.25 },
  { label: 'D5', key: 'J', freq: 587.33 },
  { label: 'E5', key: 'K', freq: 659.25 },
];

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

// MediaPipe FaceMesh anatomical contours (clean vector mask instead of noisy dot cloud)
const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10,
];
const LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144, 33];
const RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380, 362];
const LEFT_BROW_INDICES = [70, 63, 105, 66, 107];
const RIGHT_BROW_INDICES = [300, 293, 334, 296, 336];
const OUTER_LIPS_INDICES = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61];
const NOSE_BRIDGE_INDICES = [168, 6, 197, 195, 5, 4];

const EXPERIMENT_SHORT_LABELS: Record<PlayableExperimentPreset['id'], string> = {
  'mugevi-air-piano': 'MuGeVI Air Piano',
  'ipd-grid': 'Grilla IPD',
  'shy-machine-fft': 'Shy Machine FFT',
  'rain-room-silhouette': 'Rain Room',
  'caosmosis-videoart': 'Caleidoscopio',
};

function countExtendedFingers(landmarks: LandmarkPoint[]): number {
  if (landmarks.length < 21) return 0;
  const wrist = landmarks[0];
  const dist = (a: LandmarkPoint, b: LandmarkPoint) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  let count = 0;
  const pairs: [number, number][] = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18],
  ];
  pairs.forEach(([tipIdx, pipIdx]) => {
    if (dist(landmarks[tipIdx], wrist) > dist(landmarks[pipIdx], wrist) * 1.1) {
      count += 1;
    }
  });
  if (dist(landmarks[4], landmarks[13]) > dist(landmarks[2], landmarks[13]) * 1.15) {
    count += 1;
  }
  return count;
}

// Compute aspect-preserving cover crop so webcam video is never stretched
function getCoverRect(srcW: number, srcH: number, dstW: number, dstH: number) {
  const srcRatio = srcW / Math.max(1, srcH);
  const dstRatio = dstW / Math.max(1, dstH);
  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;
  if (srcRatio > dstRatio) {
    sw = srcH * dstRatio;
    sx = (srcW - sw) / 2;
  } else {
    sh = srcW / dstRatio;
    sy = (srcH - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

// Map normalized MediaPipe coordinate (0..1 in video space) into cropped 16:9 canvas space
function mapLandmarkToCanvas(
  pt: LandmarkPoint,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  mirror: boolean
) {
  const { sx, sy, sw, sh } = getCoverRect(srcW, srcH, dstW, dstH);
  const pxSrc = pt.x * srcW;
  const pySrc = pt.y * srcH;
  let nx = (pxSrc - sx) / sw;
  const ny = (pySrc - sy) / sh;
  if (mirror) nx = 1 - nx;
  return { x: nx * dstW, y: ny * dstH, nx, ny };
}

function drawContourPath(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[],
  indices: number[]
) {
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < indices.length; i += 1) {
    const p = pts[indices[i]];
    if (!p) continue;
    if (!started) {
      ctx.moveTo(p.x, p.y);
      started = true;
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
  ctx.stroke();
}

export const InteractiveMediaLab: React.FC<InteractiveMediaLabProps> = ({
  onApplyToBuilder,
  onOpenWebLab,
}) => {
  // Live Studio State
  const [studioMode, setStudioMode] = useState<StudioMode>('hand-face-hud');
  const [gestureSubMode, setGestureSubMode] = useState<GestureSubMode>('air-piano');
  const [activePresetId, setActivePresetId] = useState<PlayableExperimentPreset['id']>('mugevi-air-piano');
  const [dockTab, setDockTab] = useState<DockTab>('interaccion');

  const [artStyle, setArtStyle] = useState<VideoArtStyle>('particles');
  const [paletteChoice, setPaletteChoice] = useState<PaletteChoice>('nucleo-gold');
  const [sensitivity, setSensitivity] = useState<number>(42);
  const [cameraOpacity, setCameraOpacity] = useState<number>(0.78);
  const [feedbackAmount, setFeedbackAmount] = useState<number>(0.86);
  const [symmetry, setSymmetry] = useState<1 | 2 | 4 | 8>(4);
  const [rgbShift, setRgbShift] = useState<number>(6);
  const [showHudOverlay, setShowHudOverlay] = useState<boolean>(true);
  const [showFaceMesh, setShowFaceMesh] = useState<boolean>(true);
  const [pinchValue, setPinchValue] = useState<number>(0.65);

  // Audio & Synth parameters
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDroneOn, setIsDroneOn] = useState<boolean>(false);
  const [wahResonance, setWahResonance] = useState<number>(4.5);
  const [masterVolume, setMasterVolume] = useState<number>(0.24);
  const [audioGainBoost, setAudioGainBoost] = useState<number>(1.35);

  // Hardware & Media File state
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isUploadedVideoOn, setIsUploadedVideoOn] = useState(false);
  const [isUploadedAudioOn, setIsUploadedAudioOn] = useState(false);
  const [uploadedMediaName, setUploadedMediaName] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');

  // MediaPipe ML state
  const [enableMlTracking, setEnableMlTracking] = useState<boolean>(true);
  const [mlStatus, setMlStatus] = useState<MlStatus>('idle');

  // Live sensor readout
  const [readout, setReadout] = useState({
    x: 50,
    y: 50,
    motionPct: 0,
    bass: 0,
    mids: 0,
    treble: 0,
    activeNote: 'C4',
    filterHz: 1120,
    fingersCount: 0,
    mlHandsDetected: 0,
    mlFaceDetected: false,
    mouthOpenPct: 0,
    pinchActive: false,
  });

  // Catalog & References Filter State
  const [selectedRefFilter, setSelectedRefFilter] = useState<
    'todas' | 'LATAM & España' | 'Instalación Global' | 'Investigación NIME'
  >('todas');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<'todas' | InteractiveAreaId>(
    'todas'
  );
  const [bpArea, setBpArea] = useState<string>(INTERACTIVE_AREAS_CATALOG[0].area);
  const [bpSensor, setBpSensor] = useState<string>(PROMPT_BLUEPRINT_SENSORS[0]);
  const [bpEngine, setBpEngine] = useState<string>(PROMPT_BLUEPRINT_ENGINES[0]);
  const [bpStack, setBpStack] = useState<string>(PROMPT_BLUEPRINT_STACKS[0]);
  const [bpConcept, setBpConcept] = useState<string>(
    INTERACTIVE_AREAS_CATALOG[0].defaultPreset.concept
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Refs for Canvas, Video/Audio Elements & Audio Engine
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<SoundRipple[]>([]);
  const pointerRef = useRef<{ x: number; y: number; down: boolean; active: boolean }>({
    x: 0.5,
    y: 0.5,
    down: false,
    active: false,
  });

  const camStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const uploadedUrlRef = useRef<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const mediaElSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const videoElSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const droneNodesRef = useRef<{
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    filter: BiquadFilterNode;
    gain: GainNode;
  } | null>(null);

  // MediaPipe Worker Instances
  const handLandmarkerRef = useRef<{
    detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks?: LandmarkPoint[][] };
    close?: () => void;
  } | null>(null);
  const faceLandmarkerRef = useRef<{
    detectForVideo: (v: HTMLVideoElement, t: number) => { faceLandmarks?: LandmarkPoint[][] };
    close?: () => void;
  } | null>(null);
  const mlInitializingRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const lastMlTimestampRef = useRef(0);
  const handPinchLatchesRef = useRef<boolean[]>([false, false]);

  const latestMlRef = useRef<{
    hands: LandmarkPoint[][];
    face: LandmarkPoint[] | null;
    pinchStates: boolean[];
    fingersTotal: number;
    mouthOpenPct: number;
  }>({
    hands: [],
    face: null,
    pinchStates: [],
    fingersTotal: 0,
    mouthOpenPct: 0,
  });

  const smoothAudioRef = useRef({ bass: 12, mids: 14, treble: 10 });
  const lastNoteTriggerRef = useRef<{ time: number; idx: number }>({ time: 0, idx: -1 });
  const activeVisualNoteRef = useRef<{ idx: number; time: number }>({ idx: -1, time: 0 });

  const configRef = useRef({
    studioMode,
    gestureSubMode,
    artStyle,
    paletteChoice,
    sensitivity,
    cameraOpacity,
    feedbackAmount,
    symmetry,
    rgbShift,
    showHudOverlay,
    showFaceMesh,
    pinchValue,
    isCameraOn,
    isUploadedVideoOn,
    isMicOn,
    isDroneOn,
    isUploadedAudioOn,
    soundEnabled,
    wahResonance,
    masterVolume,
    audioGainBoost,
    enableMlTracking,
    mlStatus,
  });

  useEffect(() => {
    configRef.current = {
      studioMode,
      gestureSubMode,
      artStyle,
      paletteChoice,
      sensitivity,
      cameraOpacity,
      feedbackAmount,
      symmetry,
      rgbShift,
      showHudOverlay,
      showFaceMesh,
      pinchValue,
      isCameraOn,
      isUploadedVideoOn,
      isMicOn,
      isDroneOn,
      isUploadedAudioOn,
      soundEnabled,
      wahResonance,
      masterVolume,
      audioGainBoost,
      enableMlTracking,
      mlStatus,
    };
  }, [
    studioMode,
    gestureSubMode,
    artStyle,
    paletteChoice,
    sensitivity,
    cameraOpacity,
    feedbackAmount,
    symmetry,
    rgbShift,
    showHudOverlay,
    showFaceMesh,
    pinchValue,
    isCameraOn,
    isUploadedVideoOn,
    isMicOn,
    isDroneOn,
    isUploadedAudioOn,
    soundEnabled,
    wahResonance,
    masterVolume,
    audioGainBoost,
    enableMlTracking,
    mlStatus,
  ]);

  const refreshDeviceList = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      setVideoDevices(list.filter((d) => d.kind === 'videoinput'));
      setAudioDevices(list.filter((d) => d.kind === 'audioinput'));
    } catch {
      // ignore enumeration errors
    }
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    if (!analyserRef.current) {
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
      analyserRef.current = analyser;
      freqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    return { ctx: audioCtxRef.current, analyser: analyserRef.current };
  }, []);

  const playAirPianoNote = useCallback(
    (noteIdx: number, yNorm: number, rippleX?: number, rippleY?: number) => {
      const clampedIdx = Math.max(0, Math.min(AIR_PIANO_NOTES.length - 1, noteIdx));
      const note = AIR_PIANO_NOTES[clampedIdx];
      const nowMs = performance.now();
      activeVisualNoteRef.current = { idx: clampedIdx, time: nowMs };

      // Visual ripple feedback
      const canvas = canvasRef.current;
      if (canvas) {
        const rx = rippleX ?? ((clampedIdx + 0.5) / AIR_PIANO_NOTES.length) * canvas.width;
        const ry = rippleY ?? Math.max(0.15, Math.min(0.85, yNorm)) * canvas.height;
        ripplesRef.current.push({
          x: rx,
          y: ry,
          radius: 14,
          maxRadius: 110,
          alpha: 0.95,
          color: '#F8C300',
          label: note.label,
        });
      }

      if (!configRef.current.soundEnabled) return;
      const { ctx, analyser } = ensureAudioContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(note.freq, now);
      osc2.frequency.setValueAtTime(note.freq * 2, now);

      const cutoff = Math.round(320 + (1 - Math.max(0, Math.min(1, yNorm))) * 2500);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoff, now);
      filter.Q.setValueAtTime(configRef.current.wahResonance, now);

      const vol = Math.max(0.05, Math.min(0.45, configRef.current.masterVolume));
      env.gain.setValueAtTime(0.001, now);
      env.gain.exponentialRampToValueAtTime(vol, now + 0.018);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(env);
      env.connect(analyser);
      env.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.56);
      osc2.stop(now + 0.56);
    },
    [ensureAudioContext]
  );

  // Robust MediaPipe initialization: independent GPU -> CPU fallback & lower detection thresholds for faster tracking
  const initMediaPipeIfNeeded = useCallback(async () => {
    if (handLandmarkerRef.current || faceLandmarkerRef.current) {
      setMlStatus('ready');
      return;
    }
    if (mlInitializingRef.current) return;
    mlInitializingRef.current = true;
    setMlStatus('loading');

    try {
      const visionPkg = await import('@mediapipe/tasks-vision');
      const wasmFileset = await visionPkg.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm'
      );

      // 1) HandLandmarker (priority — try GPU then CPU fallback)
      if (!handLandmarkerRef.current) {
        for (const delegate of ['GPU', 'CPU'] as const) {
          try {
            handLandmarkerRef.current = await visionPkg.HandLandmarker.createFromOptions(
              wasmFileset,
              {
                baseOptions: {
                  modelAssetPath:
                    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                  delegate,
                },
                runningMode: 'VIDEO',
                numHands: 2,
                minHandDetectionConfidence: 0.35,
                minHandPresenceConfidence: 0.35,
                minTrackingConfidence: 0.35,
              }
            );
            break;
          } catch {
            // Try next delegate
          }
        }
      }

      // 2) FaceLandmarker (independent so failure never breaks hand tracking)
      if (!faceLandmarkerRef.current) {
        for (const delegate of ['GPU', 'CPU'] as const) {
          try {
            faceLandmarkerRef.current = await visionPkg.FaceLandmarker.createFromOptions(
              wasmFileset,
              {
                baseOptions: {
                  modelAssetPath:
                    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                  delegate,
                },
                runningMode: 'VIDEO',
                numFaces: 1,
                minFaceDetectionConfidence: 0.4,
                minFacePresenceConfidence: 0.4,
                minTrackingConfidence: 0.4,
              }
            );
            break;
          } catch {
            // Try next delegate
          }
        }
      }

      if (handLandmarkerRef.current || faceLandmarkerRef.current) {
        setMlStatus('ready');
      } else {
        setMlStatus('fallback');
      }
    } catch {
      setMlStatus('fallback');
    } finally {
      mlInitializingRef.current = false;
    }
  }, []);

  const stopUploadedMedia = useCallback(() => {
    if (videoRef.current && isUploadedVideoOn) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.removeAttribute('src');
      audioElRef.current.load();
    }
    if (uploadedUrlRef.current) {
      URL.revokeObjectURL(uploadedUrlRef.current);
      uploadedUrlRef.current = null;
    }
    lastVideoTimeRef.current = -1;
    setIsUploadedVideoOn(false);
    setIsUploadedAudioOn(false);
    setUploadedMediaName(null);
  }, [isUploadedVideoOn]);

  const stopCamera = useCallback(() => {
    if (camStreamRef.current) {
      camStreamRef.current.getTracks().forEach((t) => t.stop());
      camStreamRef.current = null;
    }
    if (videoRef.current && !isUploadedVideoOn) {
      videoRef.current.srcObject = null;
    }
    prevFrameRef.current = null;
    lastVideoTimeRef.current = -1;
    latestMlRef.current = { hands: [], face: null, pinchStates: [], fingersTotal: 0, mouthOpenPct: 0 };
    setIsCameraOn(false);
  }, [isUploadedVideoOn]);

  const startCamera = useCallback(
    async (overrideDeviceId?: string) => {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          'Este navegador o iframe restringe navigator.mediaDevices. Abre en pestaña nueva o sube un video de prueba.'
        );
        return;
      }

      try {
        stopUploadedMedia();
        if (camStreamRef.current) {
          camStreamRef.current.getTracks().forEach((t) => t.stop());
        }

        const devId = overrideDeviceId || selectedVideoId;
        const videoConstraint: MediaTrackConstraints = devId
          ? { deviceId: { exact: devId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } };

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraint,
          audio: false,
        });
        camStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
        lastVideoTimeRef.current = -1;
        setIsCameraOn(true);
        void refreshDeviceList();
        if (configRef.current.enableMlTracking) {
          void initMediaPipeIfNeeded();
        }
      } catch (err: unknown) {
        const errName = (err as { name?: string })?.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errName === 'SecurityError') {
          setCameraError(
            'El navegador o contenedor embebido bloqueó el permiso de cámara. Concede el permiso, abre en pestaña nueva o sube un video MP4.'
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError(
            'No se detectó cámara física conectada. Puedes probar subiendo un video local o usando el lienzo táctil/cursor.'
          );
        } else {
          setCameraError(
            'No fue posible iniciar la cámara en este dispositivo. Usa el simulador táctil/cursor o sube un archivo de video.'
          );
        }
        setIsCameraOn(false);
      }
    },
    [selectedVideoId, refreshDeviceList, initMediaPipeIfNeeded, stopUploadedMedia]
  );

  const stopMic = useCallback(() => {
    if (micSourceRef.current) {
      try {
        micSourceRef.current.disconnect();
      } catch {
        // ignore
      }
      micSourceRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setIsMicOn(false);
  }, []);

  const startMic = useCallback(
    async (overrideDeviceId?: string) => {
      setMicError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError(
          'El contexto actual no permite getUserMedia de audio. Enciende el "Dron Synth FFT" o sube un audio MP3/WAV.'
        );
        return;
      }

      try {
        const { ctx, analyser } = ensureAudioContext();
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((t) => t.stop());
        }

        const devId = overrideDeviceId || selectedAudioId;
        const audioConstraint: boolean | MediaTrackConstraints = devId
          ? { deviceId: { exact: devId }, echoCancellation: false, noiseSuppression: false, autoGainControl: true }
          : { echoCancellation: false, noiseSuppression: false, autoGainControl: true };

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraint,
          video: false,
        });
        micStreamRef.current = stream;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        micSourceRef.current = source;

        setIsMicOn(true);
        void refreshDeviceList();
      } catch (err: unknown) {
        const errName = (err as { name?: string })?.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errName === 'SecurityError') {
          setMicError(
            'Permiso de micrófono bloqueado por navegador o iframe. Abre en pestaña nueva, sube un MP3/WAV o usa el Dron Synth integrado.'
          );
        } else {
          setMicError(
            'No se detectó micrófono disponible. Puedes usar un archivo MP3/WAV o el Dron Synth integrado.'
          );
        }
        setIsMicOn(false);
      }
    },
    [ensureAudioContext, selectedAudioId, refreshDeviceList]
  );

  const toggleDroneSynth = useCallback(() => {
    if (isDroneOn) {
      if (droneNodesRef.current) {
        try {
          droneNodesRef.current.osc1.stop();
          droneNodesRef.current.osc2.stop();
          droneNodesRef.current.gain.disconnect();
        } catch {
          // ignore
        }
        droneNodesRef.current = null;
      }
      setIsDroneOn(false);
      return;
    }

    const { ctx, analyser } = ensureAudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.value = 110;
    osc2.frequency.value = 164.81;

    filter.type = 'lowpass';
    filter.frequency.value = 640;
    filter.Q.value = wahResonance;

    gain.gain.value = 0.08;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(analyser);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    droneNodesRef.current = { osc1, osc2, filter, gain };
    setIsDroneOn(true);
  }, [isDroneOn, ensureAudioContext, wahResonance]);

  const handleMediaFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      stopCamera();
      stopUploadedMedia();

      const url = URL.createObjectURL(file);
      uploadedUrlRef.current = url;
      setUploadedMediaName(file.name);
      setCameraError(null);
      setMicError(null);

      const { ctx, analyser } = ensureAudioContext();

      if (file.type.startsWith('video/')) {
        const videoEl = videoRef.current;
        if (videoEl) {
          videoEl.srcObject = null;
          videoEl.src = url;
          videoEl.muted = false;
          try {
            if (!videoElSourceRef.current) {
              const srcNode = ctx.createMediaElementSource(videoEl);
              srcNode.connect(analyser);
              srcNode.connect(ctx.destination);
              videoElSourceRef.current = srcNode;
            }
            await videoEl.play();
            setIsUploadedVideoOn(true);
            if (configRef.current.enableMlTracking) {
              void initMediaPipeIfNeeded();
            }
          } catch {
            videoEl.muted = true;
            await videoEl.play().catch(() => {});
            setIsUploadedVideoOn(true);
          }
        }
      } else if (file.type.startsWith('audio/')) {
        const audioEl = audioElRef.current;
        if (audioEl) {
          audioEl.src = url;
          if (!mediaElSourceRef.current) {
            const srcNode = ctx.createMediaElementSource(audioEl);
            srcNode.connect(analyser);
            srcNode.connect(ctx.destination);
            mediaElSourceRef.current = srcNode;
          }
          await audioEl.play().catch(() => {});
          setIsUploadedAudioOn(true);
          setStudioMode('audio-reactive');
        }
      }

      e.target.value = '';
    },
    [stopCamera, stopUploadedMedia, ensureAudioContext, initMediaPipeIfNeeded]
  );

  // Keyboard shortcuts for Air Piano (A S D F G H J K)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      const keyChar = e.key.toUpperCase();
      const idx = AIR_PIANO_NOTES.findIndex((n) => n.key === keyChar);
      if (idx !== -1 && !e.repeat) {
        pointerRef.current.x = (idx + 0.5) / AIR_PIANO_NOTES.length;
        pointerRef.current.active = true;
        playAirPianoNote(idx, pointerRef.current.y);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playAirPianoNote]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopMic();
      stopUploadedMedia();
      if (droneNodesRef.current) {
        try {
          droneNodesRef.current.osc1.stop();
          droneNodesRef.current.osc2.stop();
        } catch {
          // ignore
        }
      }
      handLandmarkerRef.current?.close?.();
      faceLandmarkerRef.current?.close?.();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        void audioCtxRef.current.close();
      }
    };
  }, [stopCamera, stopMic, stopUploadedMedia]);

  const applyExperimentPreset = (preset: PlayableExperimentPreset) => {
    setActivePresetId(preset.id);
    setStudioMode(preset.studioMode);
    setGestureSubMode(preset.gestureSubMode);
    setArtStyle(preset.artStyle);
    setPaletteChoice(preset.paletteChoice);
    setSymmetry(preset.symmetry);
    setFeedbackAmount(preset.feedbackAmount);
    setRgbShift(preset.rgbShift);

    if (preset.id === 'mugevi-air-piano') {
      setSoundEnabled(true);
      playAirPianoNote(0, 0.45);
    } else if (preset.id === 'shy-machine-fft' && !isMicOn && !isUploadedAudioOn && !isDroneOn) {
      toggleDroneSynth();
    }
  };

  // 60FPS Real-time Canvas, MediaPipe 2-Hand/Face & Web Audio FFT Engine
  useEffect(() => {
    let animId = 0;
    let tick = 0;

    if (!offscreenRef.current) {
      const off = document.createElement('canvas');
      off.width = 160;
      off.height = 90;
      offscreenRef.current = off;
    }

    const renderLoop = () => {
      tick += 1;
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(renderLoop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const cfg = configRef.current;
      const hasVideoFeed = cfg.isCameraOn || cfg.isUploadedVideoOn;
      const video = videoRef.current;
      const videoReady = Boolean(
        hasVideoFeed && video && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0
      );

      const paletteColors =
        cfg.paletteChoice === 'nucleo-gold'
          ? ['#F8C300', '#F4F2ED', '#7545D6', '#326BFF']
          : cfg.paletteChoice === 'violet-electric'
          ? ['#7545D6', '#326BFF', '#F4F2ED', '#F8C300']
          : ['#F4F2ED', '#B4B2AC', '#71717A', '#F8C300'];

      // 1) Optical Motion + Accurate MediaPipe Inference (only on new video frames)
      let motionPct = pointerRef.current.active ? (pointerRef.current.down ? 72 : 34) : 14;
      const off = offscreenRef.current;

      if (videoReady && video && off) {
        const { sx, sy, sw, sh } = getCoverRect(video.videoWidth, video.videoHeight, off.width, off.height);
        const octx = off.getContext('2d', { willReadFrequently: true });
        if (octx) {
          octx.save();
          if (cfg.isCameraOn) {
            octx.scale(-1, 1);
            octx.drawImage(video, sx, sy, sw, sh, -off.width, 0, off.width, off.height);
          } else {
            octx.drawImage(video, sx, sy, sw, sh, 0, 0, off.width, off.height);
          }
          octx.restore();
          const frame = octx.getImageData(0, 0, off.width, off.height).data;
          const prev = prevFrameRef.current;

          if (prev) {
            let sumX = 0;
            let sumY = 0;
            let count = 0;
            const threshold = Math.max(10, 72 - cfg.sensitivity);

            for (let y = 0; y < off.height; y += 2) {
              for (let x = 0; x < off.width; x += 2) {
                const idx = (y * off.width + x) * 4;
                const diff =
                  (Math.abs(frame[idx] - prev[idx]) +
                    Math.abs(frame[idx + 1] - prev[idx + 1]) +
                    Math.abs(frame[idx + 2] - prev[idx + 2])) /
                  3;
                if (diff > threshold) {
                  sumX += x;
                  sumY += y;
                  count += 1;
                }
              }
            }
            const sampledPixels = (off.width / 2) * (off.height / 2);
            motionPct = Math.min(100, Math.round((count / sampledPixels) * 380));
            // Only move pointer centroid via optical flow when NOT in ML hand-tracking mode with ML active
            const mlControlsPointer = cfg.studioMode === 'hand-face-hud' && cfg.enableMlTracking && cfg.mlStatus === 'ready';
            if (count > 10 && !mlControlsPointer && !pointerRef.current.down) {
              const ox = sumX / count / off.width;
              const oy = sumY / count / off.height;
              pointerRef.current.x = pointerRef.current.x * 0.7 + ox * 0.3;
              pointerRef.current.y = pointerRef.current.y * 0.7 + oy * 0.3;
            }
          }
          prevFrameRef.current = new Uint8ClampedArray(frame);
        }

        // Run MediaPipe strictly when video frame actually updated (prevents dropped frames / errors)
        if (
          cfg.enableMlTracking &&
          video.currentTime !== lastVideoTimeRef.current &&
          (handLandmarkerRef.current || faceLandmarkerRef.current)
        ) {
          lastVideoTimeRef.current = video.currentTime;
          const ts = Math.max(lastMlTimestampRef.current + 1, Math.round(performance.now()));
          lastMlTimestampRef.current = ts;

          let detectedHands: LandmarkPoint[][] = latestMlRef.current.hands;
          let detectedFace: LandmarkPoint[] | null = latestMlRef.current.face;

          // Hand tracking runs every new video frame
          if (handLandmarkerRef.current) {
            try {
              const handRes = handLandmarkerRef.current.detectForVideo(video, ts);
              detectedHands = handRes?.landmarks ?? [];
            } catch {
              // ignore transient inference hiccup
            }
          }

          // Face tracking runs every 2nd tick when enabled (keeps FPS smooth)
          if (faceLandmarkerRef.current && cfg.showFaceMesh && tick % 2 === 0) {
            try {
              const faceRes = faceLandmarkerRef.current.detectForVideo(video, ts + 1);
              detectedFace = faceRes?.faceLandmarks?.[0] ?? null;
              lastMlTimestampRef.current = ts + 1;
            } catch {
              // ignore
            }
          } else if (!cfg.showFaceMesh) {
            detectedFace = null;
          }

          // Compute real gestures (pinch with hysteresis + extended fingers) for each hand
          const pinchStates: boolean[] = [];
          let fingersTotal = 0;

          detectedHands.forEach((rawHand, hIdx) => {
            if (rawHand.length < 21) return;
            fingersTotal += countExtendedFingers(rawHand);

            // Normalize pinch distance by palm size (wrist 0 to middle MCP 9) so distance from camera doesn't break pinch!
            const palmSize = Math.max(
              0.04,
              Math.hypot(rawHand[0].x - rawHand[9].x, rawHand[0].y - rawHand[9].y)
            );
            const rawPinchDist = Math.hypot(
              rawHand[4].x - rawHand[8].x,
              rawHand[4].y - rawHand[8].y
            );
            const normalizedPinch = rawPinchDist / palmSize;
            const prevLatch = handPinchLatchesRef.current[hIdx] ?? false;
            const isPinched = prevLatch ? normalizedPinch < 0.44 : normalizedPinch < 0.34;
            pinchStates[hIdx] = isPinched;

            const mappedIdx = mapLandmarkToCanvas(
              rawHand[8],
              video.videoWidth,
              video.videoHeight,
              W,
              H,
              cfg.isCameraOn
            );

            // Primary hand updates pointer smoothly
            if (hIdx === 0) {
              pointerRef.current.x = pointerRef.current.x * 0.35 + mappedIdx.nx * 0.65;
              pointerRef.current.y = pointerRef.current.y * 0.35 + mappedIdx.ny * 0.65;
            }

            // Edge-trigger Air Piano note on rising edge of pinch!
            if (
              cfg.studioMode === 'hand-face-hud' &&
              cfg.gestureSubMode === 'air-piano' &&
              isPinched &&
              !prevLatch &&
              ts - lastNoteTriggerRef.current.time > 140
            ) {
              const noteIdx = Math.floor(
                Math.max(0, Math.min(0.999, mappedIdx.nx)) * AIR_PIANO_NOTES.length
              );
              lastNoteTriggerRef.current = { time: ts, idx: noteIdx };
              playAirPianoNote(noteIdx, mappedIdx.ny, mappedIdx.x, mappedIdx.y);
            }
            handPinchLatchesRef.current[hIdx] = isPinched;
          });

          if (detectedHands.length === 0) {
            handPinchLatchesRef.current = [false, false];
          }

          // Compute mouth openness from FaceLandmarker (upper lip 13 vs lower lip 14, normalized by face height 10..152)
          let mouthOpenPct = 0;
          if (detectedFace && detectedFace.length > 400) {
            const faceH = Math.max(
              0.05,
              Math.hypot(
                detectedFace[10].x - detectedFace[152].x,
                detectedFace[10].y - detectedFace[152].y
              )
            );
            const mouthGap = Math.hypot(
              detectedFace[13].x - detectedFace[14].x,
              detectedFace[13].y - detectedFace[14].y
            );
            mouthOpenPct = Math.min(100, Math.round((mouthGap / faceH) * 420));
          }

          latestMlRef.current = {
            hands: detectedHands,
            face: detectedFace,
            pinchStates,
            fingersTotal,
            mouthOpenPct,
          };
        }
      } else if (!pointerRef.current.active) {
        pointerRef.current.x = 0.5 + Math.cos(tick * 0.022) * 0.24;
        pointerRef.current.y = 0.5 + Math.sin(tick * 0.028) * 0.18;
      }

      // 2) Analyze Web Audio FFT with Gain Boost & Smooth Damping
      let targetBass = 14 + Math.sin(tick * 0.08) * 7;
      let targetMids = 16 + Math.cos(tick * 0.05) * 8;
      let targetTreble = 12 + Math.sin(tick * 0.12) * 6;

      const hasAudioSource =
        cfg.isMicOn ||
        cfg.isDroneOn ||
        cfg.isUploadedAudioOn ||
        cfg.isUploadedVideoOn ||
        performance.now() - activeVisualNoteRef.current.time < 950;

      if (hasAudioSource && analyserRef.current && freqDataRef.current) {
        analyserRef.current.getByteFrequencyData(freqDataRef.current);
        const data = freqDataRef.current;
        const avg = (start: number, end: number) => {
          let total = 0;
          for (let i = start; i < end; i += 1) total += data[i];
          return Math.min(
            100,
            Math.round(((total / Math.max(1, end - start)) / 255) * 100 * cfg.audioGainBoost)
          );
        };
        targetBass = avg(1, 10);
        targetMids = avg(10, 40);
        targetTreble = avg(40, 96);

        if (cfg.isDroneOn && droneNodesRef.current) {
          const baseFreq = 82 + pointerRef.current.x * 220;
          const harmonic = baseFreq * (1.25 + (1 - pointerRef.current.y) * 0.75);
          const filterHz = 280 + (1 - pointerRef.current.y) * 2400;
          droneNodesRef.current.osc1.frequency.setTargetAtTime(baseFreq, 0, 0.06);
          droneNodesRef.current.osc2.frequency.setTargetAtTime(harmonic, 0, 0.06);
          droneNodesRef.current.filter.frequency.setTargetAtTime(filterHz, 0, 0.05);
          droneNodesRef.current.filter.Q.setTargetAtTime(cfg.wahResonance, 0, 0.05);
        }
      }

      smoothAudioRef.current.bass += (targetBass - smoothAudioRef.current.bass) * 0.28;
      smoothAudioRef.current.mids += (targetMids - smoothAudioRef.current.mids) * 0.28;
      smoothAudioRef.current.treble += (targetTreble - smoothAudioRef.current.treble) * 0.28;
      const bass = smoothAudioRef.current.bass;
      const mids = smoothAudioRef.current.mids;
      const treble = smoothAudioRef.current.treble;

      // 3) Crisp Frame Clearing (NO muddy ghosting unless Eco Feedback or Videoarte!)
      const usePersistenceTrail = cfg.artStyle === 'feedback' || cfg.studioMode === 'video-art';
      if (usePersistenceTrail) {
        const fadeAlpha = Math.max(0.05, 1 - cfg.feedbackAmount);
        ctx.fillStyle = `rgba(13, 13, 18, ${fadeAlpha})`;
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.fillStyle = '#0D0D12';
        ctx.fillRect(0, 0, W, H);
      }

      // Draw crisp aspect-preserved webcam/video (except in video-art kaleidoscope which slices the video itself)
      if (videoReady && video && cfg.cameraOpacity > 0.01 && cfg.studioMode !== 'video-art') {
        const { sx, sy, sw, sh } = getCoverRect(video.videoWidth, video.videoHeight, W, H);
        ctx.save();
        ctx.globalAlpha = usePersistenceTrail
          ? Math.min(0.45, cfg.cameraOpacity * 0.55)
          : cfg.cameraOpacity;
        if (cfg.isCameraOn) {
          ctx.translate(W, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, W, H);
        ctx.restore();

        if (cfg.artStyle === 'duotone') {
          ctx.fillStyle =
            cfg.paletteChoice === 'violet-electric'
              ? 'rgba(117, 69, 214, 0.28)'
              : cfg.paletteChoice === 'nucleo-gold'
              ? 'rgba(248, 195, 0, 0.16)'
              : 'rgba(16, 16, 20, 0.35)';
          ctx.fillRect(0, 0, W, H);
        }
      }

      const cx = pointerRef.current.x * W;
      const cy = pointerRef.current.y * H;

      // 4) Mode-Specific Rendering
      if (cfg.studioMode === 'camera-motion') {
        // Rain Room + Optical Flow Repulsion Field
        for (let r = 0; r < 5; r += 1) {
          particlesRef.current.push({
            x: Math.random() * W,
            y: -6,
            vx: (Math.random() - 0.5) * 0.5,
            vy: 4.2 + Math.random() * 2.8,
            life: 0,
            maxLife: 115,
            size: 2 + Math.random() * 2,
            hue: paletteColors[1],
          });
        }

        const spawnCount = Math.max(2, Math.round(motionPct / 12));
        for (let i = 0; i < spawnCount; i += 1) {
          particlesRef.current.push({
            x: cx + (Math.random() - 0.5) * 34,
            y: cy + (Math.random() - 0.5) * 34,
            vx: (Math.random() - 0.5) * (2.6 + motionPct * 0.06),
            vy: (Math.random() - 0.5) * (2.6 + motionPct * 0.06) - 0.8,
            life: 0,
            maxLife: 42 + Math.random() * 24,
            size: 3 + Math.random() * 4.5,
            hue: paletteColors[i % paletteColors.length],
          });
        }
        if (particlesRef.current.length > 340) {
          particlesRef.current = particlesRef.current.slice(-340);
        }

        const repulsionRadius = 76 + bass * 0.55;
        particlesRef.current.forEach((p) => {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const d = Math.hypot(dx, dy);
          if (d < repulsionRadius && d > 1) {
            p.vx += (dx / d) * 0.7;
            p.vy += (dy / d) * 0.4;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.life += 1;
          const alpha = Math.max(0, 1 - p.life / p.maxLife);
          ctx.fillStyle = p.hue;
          ctx.globalAlpha = alpha;
          if (cfg.artStyle === 'scanline') {
            ctx.fillRect(p.x, p.y, p.size * 3.5, 2);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha + 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;
        particlesRef.current = particlesRef.current.filter(
          (p) => p.life < p.maxLife && p.y < H + 20
        );

        if (cfg.showHudOverlay) {
          ctx.strokeStyle = '#F8C300';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(cx, cy, repulsionRadius * 0.65, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx - 24, cy);
          ctx.lineTo(cx + 24, cy);
          ctx.moveTo(cx, cy - 24);
          ctx.lineTo(cx, cy + 24);
          ctx.stroke();
        }
      } else if (cfg.studioMode === 'hand-face-hud') {
        const ml = latestMlRef.current;
        const hasRealHands = videoReady && ml.hands.length > 0;

        // Collect active attractors: real hands (palm/index) if present, else cursor ONLY when camera off or dragging
        const attractors: { x: number; y: number; pinched: boolean }[] = [];
        if (hasRealHands && video) {
          ml.hands.forEach((hand, hIdx) => {
            const pt = mapLandmarkToCanvas(
              hand[9] || hand[8],
              video.videoWidth,
              video.videoHeight,
              W,
              H,
              cfg.isCameraOn
            );
            attractors.push({ x: pt.x, y: pt.y, pinched: Boolean(ml.pinchStates[hIdx]) });
          });
        } else if (!videoReady || pointerRef.current.down || pointerRef.current.active) {
          attractors.push({
            x: cx,
            y: cy,
            pinched: pointerRef.current.down || cfg.pinchValue < 0.35,
          });
        }

        if (cfg.gestureSubMode === 'air-piano') {
          const colW = W / AIR_PIANO_NOTES.length;
          const activeCols = new Set<number>();
          attractors.forEach((a) => {
            const idx = Math.floor(Math.max(0, Math.min(0.999, a.x / W)) * AIR_PIANO_NOTES.length);
            activeCols.add(idx);
          });
          const recentHit = performance.now() - activeVisualNoteRef.current.time < 340;

          AIR_PIANO_NOTES.forEach((n, idx) => {
            const isHover = activeCols.has(idx);
            const isTriggered = recentHit && activeVisualNoteRef.current.idx === idx;
            const x0 = idx * colW;

            ctx.fillStyle = isTriggered
              ? 'rgba(248, 195, 0, 0.28)'
              : isHover
              ? 'rgba(50, 107, 255, 0.16)'
              : 'rgba(13, 13, 18, 0.28)';
            ctx.fillRect(x0 + 3, 14, colW - 6, H - 28);

            ctx.strokeStyle = isTriggered
              ? '#F8C300'
              : isHover
              ? '#326BFF'
              : 'rgba(244, 242, 237, 0.22)';
            ctx.lineWidth = isTriggered ? 2.5 : 1;
            ctx.strokeRect(x0 + 3, 14, colW - 6, H - 28);

            ctx.fillStyle = isTriggered ? '#F8C300' : isHover ? '#FFFFFF' : 'rgba(244, 242, 237, 0.72)';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(n.label, x0 + colW / 2 - 11, 38);
            ctx.font = '11px monospace';
            ctx.fillText(`[${n.key}]`, x0 + colW / 2 - 11, H - 24);
          });

          // Horizontal Wah-Wah Cutoff Guide
          const filterY = attractors[0]?.y ?? cy;
          ctx.strokeStyle = 'rgba(248, 195, 0, 0.65)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 5]);
          ctx.beginPath();
          ctx.moveTo(0, filterY);
          ctx.lineTo(W, filterY);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (cfg.gestureSubMode === 'ipd-grid') {
          // Crisp Swiss IPD Interactive Poster Grid responding to 1 or 2 hands + mic bass
          const cols = 10;
          const rows = 6;
          const cellW = W / cols;
          const cellH = H / rows;
          const audioBoost = (bass / 100) * 0.26;

          for (let r = 0; r < rows; r += 1) {
            for (let c = 0; c < cols; c += 1) {
              const gx = (c + 0.5) * cellW;
              const gy = (r + 0.5) * cellH;

              let maxInf = 0;
              let pinchedHere = false;
              attractors.forEach((a) => {
                const dist = Math.hypot(gx - a.x, gy - a.y);
                const inf = Math.max(0, 1 - dist / 245);
                if (inf > maxInf) {
                  maxInf = inf;
                  pinchedHere = a.pinched;
                }
              });

              const scale = pinchedHere
                ? Math.max(0.24, 0.85 - maxInf * 0.62)
                : 0.34 + maxInf * 0.64 + audioBoost;

              ctx.save();
              ctx.translate(gx, gy);
              ctx.rotate(maxInf * (pinchedHere ? -0.95 : 0.72));
              const bw = cellW * 0.68 * scale;
              const bh = cellH * 0.68 * scale;

              if (maxInf > 0.38) {
                ctx.fillStyle = pinchedHere
                  ? 'rgba(248, 195, 0, 0.28)'
                  : cfg.paletteChoice === 'violet-electric'
                  ? 'rgba(117, 69, 214, 0.3)'
                  : 'rgba(50, 107, 255, 0.26)';
                ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
              }
              ctx.strokeStyle =
                maxInf > 0.32
                  ? pinchedHere
                    ? '#F8C300'
                    : paletteColors[0]
                  : 'rgba(244, 242, 237, 0.28)';
              ctx.lineWidth = maxInf > 0.32 ? 2.2 : 1;
              ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
              ctx.restore();
            }
          }
        } else {
          // Expressive Mask / Sculpture mode
          const primary = attractors[0] ?? { x: cx, y: cy, pinched: false };
          const radius = 56 + (primary.pinched ? 12 : 48) + bass * 0.45 + ml.mouthOpenPct * 0.45;
          ctx.save();
          ctx.translate(primary.x, primary.y);
          ctx.rotate(tick * 0.014);
          ctx.strokeStyle = paletteColors[0];
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          for (let i = 0; i <= 6; i += 1) {
            const ang = (i / 6) * Math.PI * 2;
            const px = Math.cos(ang) * radius;
            const py = Math.sin(ang) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Render sound ripples triggered by Air Piano / Pinch
        ripplesRef.current.forEach((rp) => {
          rp.radius += 3.8;
          rp.alpha *= 0.92;
          ctx.save();
          ctx.strokeStyle = rp.color;
          ctx.globalAlpha = rp.alpha;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = rp.color;
          ctx.font = 'bold 15px monospace';
          ctx.fillText(rp.label, rp.x - 10, rp.y - rp.radius * 0.35);
          ctx.restore();
        });
        ripplesRef.current = ripplesRef.current.filter((rp) => rp.alpha > 0.05 && rp.radius < rp.maxRadius);

        // HUD Overlays: Real 21-Point Hand(s) & Clean Anatomical Face Contour
        if (cfg.showHudOverlay) {
          // A) Clean Face Contour when real face detected
          if (videoReady && video && cfg.showFaceMesh && ml.face && ml.face.length > 400) {
            const mappedFace = ml.face.map((pt) =>
              mapLandmarkToCanvas(pt, video.videoWidth, video.videoHeight, W, H, cfg.isCameraOn)
            );
            ctx.save();
            ctx.strokeStyle = 'rgba(248, 195, 0, 0.72)';
            ctx.lineWidth = 1.6;
            drawContourPath(ctx, mappedFace, FACE_OVAL_INDICES);
            ctx.strokeStyle = 'rgba(244, 242, 237, 0.8)';
            drawContourPath(ctx, mappedFace, LEFT_BROW_INDICES);
            drawContourPath(ctx, mappedFace, RIGHT_BROW_INDICES);
            drawContourPath(ctx, mappedFace, NOSE_BRIDGE_INDICES);
            ctx.strokeStyle = '#326BFF';
            ctx.lineWidth = 1.8;
            drawContourPath(ctx, mappedFace, LEFT_EYE_INDICES);
            drawContourPath(ctx, mappedFace, RIGHT_EYE_INDICES);
            ctx.strokeStyle = ml.mouthOpenPct > 28 ? '#F8C300' : '#7545D6';
            ctx.lineWidth = 2;
            drawContourPath(ctx, mappedFace, OUTER_LIPS_INDICES);
            ctx.restore();
          }

          // B) Real MediaPipe Hand Skeleton(s)
          if (hasRealHands && video) {
            ml.hands.forEach((rawHand, hIdx) => {
              const pts = rawHand.map((pt) =>
                mapLandmarkToCanvas(pt, video.videoWidth, video.videoHeight, W, H, cfg.isCameraOn)
              );
              const isPinched = Boolean(ml.pinchStates[hIdx]);

              HAND_CONNECTIONS.forEach(([a, b]) => {
                const pA = pts[a];
                const pB = pts[b];
                if (!pA || !pB) return;
                ctx.strokeStyle = isPinched ? '#F8C300' : '#326BFF';
                ctx.lineWidth = 2.6;
                ctx.beginPath();
                ctx.moveTo(pA.x, pA.y);
                ctx.lineTo(pB.x, pB.y);
                ctx.stroke();
              });

              pts.forEach((pt, idx) => {
                const isPinchTip = idx === 4 || idx === 8;
                const isTip = idx === 12 || idx === 16 || idx === 20;
                ctx.fillStyle = isPinchTip ? '#F8C300' : isTip ? '#7545D6' : '#F4F2ED';
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, isPinchTip ? 5.5 : 3.2, 0, Math.PI * 2);
                ctx.fill();
              });

              if (pts[4] && pts[8]) {
                const midX = (pts[4].x + pts[8].x) / 2;
                const midY = (pts[4].y + pts[8].y) / 2;
                ctx.strokeStyle = isPinched ? '#F8C300' : 'rgba(117, 69, 214, 0.9)';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(pts[4].x, pts[4].y);
                ctx.lineTo(pts[8].x, pts[8].y);
                ctx.stroke();
                ctx.setLineDash([]);

                if (isPinched) {
                  ctx.strokeStyle = '#F8C300';
                  ctx.lineWidth = 2.5;
                  ctx.beginPath();
                  ctx.arc(midX, midY, 18, 0, Math.PI * 2);
                  ctx.stroke();
                }
              }
            });
          } else if (videoReady && cfg.enableMlTracking && cfg.mlStatus === 'ready') {
            // IMPORTANT: Do NOT paint a fake hand over the user's face when webcam + MediaPipe is active!
            ctx.save();
            ctx.fillStyle = 'rgba(13, 13, 18, 0.72)';
            ctx.fillRect(16, 16, 336, 32);
            ctx.strokeStyle = 'rgba(248, 195, 0, 0.65)';
            ctx.lineWidth = 1;
            ctx.strokeRect(16, 16, 336, 32);
            ctx.fillStyle = '#F8C300';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('Muestra 1 o 2 manos a la cámara (pinza 4–8)', 26, 36);
            ctx.restore();
          } else if (!videoReady) {
            // Simulator mode (only when NO webcam/video is active)
            const effPinch = pointerRef.current.down ? 0.16 : cfg.pinchValue;
            const scale = 0.75 + effPinch * 0.55;
            const wrist = { x: cx, y: cy + 54 * scale };
            const spread = 0.45 + effPinch * 0.6;
            const fingers = [
              { angle: -0.75 * spread, len: 50 * scale },
              { angle: -0.35 * spread, len: 74 * scale },
              { angle: 0, len: 82 * scale },
              { angle: 0.32 * spread, len: 74 * scale },
              { angle: 0.65 * spread, len: 58 * scale },
            ];
            const tips: { x: number; y: number }[] = [];
            fingers.forEach((f, idx) => {
              let prevPt = wrist;
              const joints = idx === 0 ? 3 : 4;
              for (let j = 1; j <= joints; j += 1) {
                const segLen = (f.len / joints) * (1 - j * 0.05);
                const curl = idx === 1 ? (1 - effPinch) * 0.35 : 0;
                const ang = -Math.PI / 2 + f.angle + curl * j;
                const nextPt = {
                  x: prevPt.x + Math.cos(ang) * segLen,
                  y: prevPt.y + Math.sin(ang) * segLen,
                };
                ctx.strokeStyle = '#326BFF';
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.moveTo(prevPt.x, prevPt.y);
                ctx.lineTo(nextPt.x, nextPt.y);
                ctx.stroke();

                ctx.fillStyle = j === joints ? '#F8C300' : '#F4F2ED';
                ctx.beginPath();
                ctx.arc(nextPt.x, nextPt.y, j === joints ? 4.5 : 3, 0, Math.PI * 2);
                ctx.fill();
                prevPt = nextPt;
              }
              tips.push(prevPt);
            });
            if (tips.length >= 2) {
              ctx.strokeStyle = effPinch < 0.35 ? '#F8C300' : '#7545D6';
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(tips[0].x, tips[0].y);
              ctx.lineTo(tips[1].x, tips[1].y);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        }
      } else if (cfg.studioMode === 'audio-reactive') {
        // The Shy Machine 12-faced Kinetic Polyhedron + AURA 48 Radial Bars
        const centerX = W / 2;
        const centerY = H / 2;
        const bars = 48;
        const baseR = 68 + bass * 0.85;

        const facets = 12;
        const shellAperture = 28 + (mids / 100) * 58 + (bass / 100) * 24;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-tick * 0.008);
        for (let f = 0; f < facets; f += 1) {
          const a = (f / facets) * Math.PI * 2;
          ctx.save();
          ctx.rotate(a);
          ctx.fillStyle = f % 2 === 0 ? 'rgba(248, 195, 0, 0.14)' : 'rgba(117, 69, 214, 0.14)';
          ctx.strokeStyle = paletteColors[f % 2];
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(16, 0);
          ctx.lineTo(shellAperture, -12 - treble * 0.22);
          ctx.lineTo(shellAperture + 16, 0);
          ctx.lineTo(shellAperture, 12 + treble * 0.22);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        for (let i = 0; i < bars; i += 1) {
          const angle = (i / bars) * Math.PI * 2 + tick * 0.01;
          let mag = 16 + Math.sin(tick * 0.1 + i * 0.4) * 10;
          if (hasAudioSource && freqDataRef.current) {
            mag = (freqDataRef.current[i % freqDataRef.current.length] / 255) * 115 * cfg.audioGainBoost;
          } else {
            mag += pointerRef.current.x * 36;
          }
          mag = Math.min(145, mag);

          const x1 = centerX + Math.cos(angle) * baseR;
          const y1 = centerY + Math.sin(angle) * baseR;
          const x2 = centerX + Math.cos(angle) * (baseR + mag);
          const y2 = centerY + Math.sin(angle) * (baseR + mag);

          ctx.strokeStyle = paletteColors[i % paletteColors.length];
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Bottom live waveform ribbon
        ctx.strokeStyle = '#F8C300';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8) {
          const idx = Math.floor((x / W) * 64);
          const val =
            hasAudioSource && freqDataRef.current
              ? Math.min(84, (freqDataRef.current[idx] / 255) * 74 * cfg.audioGainBoost)
              : Math.sin(x * 0.025 + tick * 0.12) * (14 + mids * 0.32);
          const py = H - 24 - val;
          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();
      } else if (cfg.studioMode === 'video-art') {
        // Real Video-Signal Kaleidoscope + Chromatic RGB Echoes
        const folds = Math.max(2, cfg.symmetry * 2);
        const shift = cfg.rgbShift;
        const wedgeAngle = (Math.PI * 2) / folds;
        const radius = Math.hypot(W, H) * 0.56;

        if (videoReady && video && cfg.cameraOpacity > 0.05) {
          const { sx, sy, sw, sh } = getCoverRect(video.videoWidth, video.videoHeight, W, H);
          const zoom = 1 + bass * 0.004;
          ctx.save();
          ctx.translate(W / 2, H / 2);
          ctx.rotate(tick * 0.004 + (pointerRef.current.x - 0.5) * 0.8);
          ctx.globalAlpha = Math.min(0.88, cfg.cameraOpacity);
          for (let i = 0; i < folds; i += 1) {
            ctx.save();
            ctx.rotate(i * wedgeAngle);
            if (i % 2 === 1) ctx.scale(1, -1);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, 0, wedgeAngle + 0.02);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(
              video,
              sx,
              sy,
              sw,
              sh,
              (-W / 2) * zoom,
              (-H / 2) * zoom,
              W * zoom,
              H * zoom
            );
            ctx.restore();
          }
          ctx.restore();
        }

        // RGB Split Generative Overlay Rings
        const ringR = 44 + bass * 0.7 + motionPct * 0.4;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        for (let f = 0; f < cfg.symmetry; f += 1) {
          ctx.save();
          ctx.rotate((f / cfg.symmetry) * Math.PI * 2 + tick * 0.014);
          const ox = (pointerRef.current.x - 0.5) * 185;
          const oy = (pointerRef.current.y - 0.5) * 115;

          const channels = [
            { dx: -shift, color: 'rgba(248, 195, 0, 0.78)' },
            { dx: 0, color: 'rgba(117, 69, 214, 0.78)' },
            { dx: shift, color: 'rgba(50, 107, 255, 0.78)' },
          ];
          channels.forEach((ch) => {
            ctx.strokeStyle = ch.color;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(ox + ch.dx, oy, ringR, 0, Math.PI * 2);
            ctx.stroke();
          });
          ctx.restore();
        }
        ctx.restore();
      }

      if (cfg.artStyle === 'scanline') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        for (let sy = 0; sy < H; sy += 4) {
          ctx.fillRect(0, sy, W, 1);
        }
      }

      if (tick % 5 === 0) {
        const noteIdx = Math.floor(
          Math.max(0, Math.min(0.999, pointerRef.current.x)) * AIR_PIANO_NOTES.length
        );
        const fHz = Math.round(320 + (1 - Math.max(0, Math.min(1, pointerRef.current.y))) * 2500);
        setReadout({
          x: Math.round(pointerRef.current.x * 100),
          y: Math.round(pointerRef.current.y * 100),
          motionPct,
          bass: Math.min(100, Math.round(bass)),
          mids: Math.min(100, Math.round(mids)),
          treble: Math.min(100, Math.round(treble)),
          activeNote: AIR_PIANO_NOTES[noteIdx]?.label || 'C4',
          filterHz: fHz,
          fingersCount: latestMlRef.current.fingersTotal,
          mlHandsDetected: latestMlRef.current.hands.length,
          mlFaceDetected: Boolean(latestMlRef.current.face),
          mouthOpenPct: latestMlRef.current.mouthOpenPct,
          pinchActive: latestMlRef.current.pinchStates.some(Boolean) || pointerRef.current.down,
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [playAirPianoNote]);

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    pointerRef.current.x = nx;
    pointerRef.current.y = ny;
    pointerRef.current.active = true;

    if (
      pointerRef.current.down &&
      studioMode === 'hand-face-hud' &&
      gestureSubMode === 'air-piano'
    ) {
      const idx = Math.floor(Math.max(0, Math.min(0.999, nx)) * AIR_PIANO_NOTES.length);
      if (idx !== lastNoteTriggerRef.current.idx) {
        lastNoteTriggerRef.current = { time: performance.now(), idx };
        const canvas = canvasRef.current;
        playAirPianoNote(idx, ny, canvas ? nx * canvas.width : undefined, canvas ? ny * canvas.height : undefined);
      }
    }
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    pointerRef.current = { x: nx, y: ny, down: true, active: true };

    if (studioMode === 'hand-face-hud' && gestureSubMode === 'air-piano') {
      const idx = Math.floor(Math.max(0, Math.min(0.999, nx)) * AIR_PIANO_NOTES.length);
      lastNoteTriggerRef.current = { time: performance.now(), idx };
      const canvas = canvasRef.current;
      playAirPianoNote(idx, ny, canvas ? nx * canvas.width : undefined, canvas ? ny * canvas.height : undefined);
    }
  };

  const capturePngFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nucleo-interactivo-${studioMode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const resetLabDefaults = () => {
    setCameraOpacity(0.78);
    setAudioGainBoost(1.35);
    applyExperimentPreset(PLAYABLE_EXPERIMENTS[0]);
    particlesRef.current = [];
    ripplesRef.current = [];
  };

  const activeExperiment =
    PLAYABLE_EXPERIMENTS.find((p) => p.id === activePresetId) ?? PLAYABLE_EXPERIMENTS[0];

  const generatedInteractivePrompt = useMemo(() => {
    return [
      `BLUEPRINT DE APLICACIÓN INTERACTIVA, XR & VIDEOARTE`,
      `==================================================`,
      `Actúa como desarrollador creativo senior (Creative Coding + Computer Vision + Web Audio + UX Accesible).`,
      ``,
      `1. CONTEXTO Y ÁREA DE APLICACIÓN`,
      `- Área: ${bpArea}`,
      `- Concepto central: ${bpConcept}`,
      ``,
      `2. ARQUITECTURA ENTRADA → PROCESAMIENTO → SALIDA`,
      `- ENTRADA (Sensor): ${bpSensor}`,
      `- PROCESAMIENTO: Suavizado exponencial de coordenadas (lerp), detección gestual normalizada por tamaño de palma o bandas FFT y procesamiento 100% local en navegador.`,
      `- TRANSFORMACIÓN Y SALIDA VISUAL: ${bpEngine}`,
      ``,
      `3. TECNOLOGÍA E INTERFAZ`,
      `- Stack objetivo: ${bpStack}`,
      `- Controles obligatorios en UI: barra unificada para activar/detener cámara, micrófono o archivo multimedia de prueba, simulador táctil/cursor automático si no hay hardware disponible, sliders en vivo con unidades claras y botón de captura PNG.`,
      `- Responsividad y accesibilidad: adaptable de móvil (320px) a pantallas de proyección 16:9, soporte teclado y alto contraste WCAG AA.`,
    ].join('\n');
  }, [bpArea, bpConcept, bpSensor, bpEngine, bpStack]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const visibleReferences =
    selectedRefFilter === 'todas'
      ? INTERACTIVE_ART_REFERENCES
      : INTERACTIVE_ART_REFERENCES.filter((r) => r.category === selectedRefFilter);

  const visibleAreas =
    selectedAreaFilter === 'todas'
      ? INTERACTIVE_AREAS_CATALOG
      : INTERACTIVE_AREAS_CATALOG.filter((a) => a.id === selectedAreaFilter);

  const loadReferenceIntoPrompt = (title: string, summary: string, sensor: string) => {
    setBpConcept(`${title}: ${summary}`);
    setBpSensor(sensor);
    const el = document.getElementById('interactive-blueprint-generator');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="py-10 sm:py-14 bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        {/* Encabezado */}
        <div className="space-y-3 max-w-4xl">
          <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 shrink-0" />
            <span>LABORATORIO INTERACTIVO · TRACKING 21 PTS, AUDIO FFT, WEBXR & VIDEOARTE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display-sans tracking-tight leading-tight text-balance">
            Manos, Cara, Cámara, Micrófono & Videoarte en Vivo
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
            Activa tu cámara, micrófono o sube un video/audio de prueba para experimentar con{' '}
            <strong>tracking real de 2 manos (21 pts · MuGeVI)</strong>,{' '}
            <strong>malla facial anatómica (478 pts)</strong>,{' '}
            <strong>cuadrícula reactiva (IPD)</strong> y{' '}
            <strong>caleidoscopio de video en vivo</strong>.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 1. MESA DE PRUEBAS SENSORIALES (2-ZONE SANDBOX)              */}
        {/* ============================================================ */}
        <section
          id="live-sensory-workbench"
          className="rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] overflow-hidden scroll-mt-24"
        >
          {/* Off-screen non-hidden media elements */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            loop
            className="pointer-events-none fixed -top-[9999px] -left-[9999px] w-px h-px opacity-0"
          />
          <audio
            ref={audioElRef}
            loop
            className="pointer-events-none fixed -top-[9999px] -left-[9999px] w-px h-px opacity-0"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*"
            onChange={handleMediaFileUpload}
            className="hidden"
          />

          {/* Top Hardware & Source Control Bar */}
          <div className="p-4 sm:p-5 border-b border-[#DEDAD0] dark:border-[#26262E] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold font-display-sans">
                1. Mesa de Pruebas Sensoriales en Tiempo Real
              </h2>
              <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                Procesamiento 100% local en navegador. También puedes tocar el lienzo o usar teclas{' '}
                <span className="font-mono-code font-bold">A–K</span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={isCameraOn ? stopCamera : () => startCamera()}
                className={`px-3.5 py-2 min-h-[40px] text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isCameraOn
                    ? 'bg-[#326BFF] text-white border-[#326BFF]'
                    : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF]'
                }`}
              >
                {isCameraOn ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                <span>{isCameraOn ? 'Apagar Cámara' : 'Activar Cámara'}</span>
              </button>

              <button
                type="button"
                onClick={isMicOn ? stopMic : () => startMic()}
                className={`px-3.5 py-2 min-h-[40px] text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isMicOn
                    ? 'bg-[#7545D6] text-white border-[#7545D6]'
                    : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#7545D6]'
                }`}
              >
                {isMicOn ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMicOn ? 'Apagar Mic' : 'Activar Micrófono'}</span>
              </button>

              <button
                type="button"
                onClick={toggleDroneSynth}
                className={`px-3.5 py-2 min-h-[40px] text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isDroneOn
                    ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                    : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#F8C300]'
                }`}
              >
                {isDroneOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isDroneOn ? 'Detener Dron FFT' : 'Dron Synth FFT'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-3.5 py-2 min-h-[40px] text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isUploadedVideoOn || isUploadedAudioOn
                    ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                    : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF]'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{uploadedMediaName ? 'Cambiar Video/Audio' : 'Subir Video / Audio'}</span>
              </button>
            </div>
          </div>

          {/* Device selector bar when unlocked */}
          {(videoDevices.length > 1 || audioDevices.length > 1 || isUploadedVideoOn || isUploadedAudioOn) && (
            <div className="px-4 sm:px-5 py-2.5 bg-[#F4F2ED]/70 dark:bg-[#101014]/70 border-b border-[#DEDAD0] dark:border-[#26262E] flex flex-wrap items-center gap-3 text-xs">
              {videoDevices.length > 1 && (
                <label className="flex items-center gap-2 font-mono-code">
                  <span>Cámara:</span>
                  <select
                    value={selectedVideoId}
                    onChange={(e) => {
                      setSelectedVideoId(e.target.value);
                      if (isCameraOn) void startCamera(e.target.value);
                    }}
                    className="px-2 py-1 rounded bg-white dark:bg-[#16161C] border border-[#D4D0C5] dark:border-[#2C2C36]"
                  >
                    {videoDevices.map((d, idx) => (
                      <option key={d.deviceId || idx} value={d.deviceId}>
                        {d.label || `Cámara ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {audioDevices.length > 1 && (
                <label className="flex items-center gap-2 font-mono-code">
                  <span>Micrófono:</span>
                  <select
                    value={selectedAudioId}
                    onChange={(e) => {
                      setSelectedAudioId(e.target.value);
                      if (isMicOn) void startMic(e.target.value);
                    }}
                    className="px-2 py-1 rounded bg-white dark:bg-[#16161C] border border-[#D4D0C5] dark:border-[#2C2C36]"
                  >
                    {audioDevices.map((d, idx) => (
                      <option key={d.deviceId || idx} value={d.deviceId}>
                        {d.label || `Micrófono ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {(isUploadedVideoOn || isUploadedAudioOn) && uploadedMediaName && (
                <div className="flex items-center gap-2 font-mono-code">
                  <span>Archivo activo: {uploadedMediaName}</span>
                  <button
                    type="button"
                    onClick={stopUploadedMedia}
                    className="px-2 py-0.5 rounded bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014] font-bold"
                  >
                    Detener
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Diagnostic & Recovery Banner */}
          {(cameraError || micError) && (
            <div className="px-4 sm:px-5 py-3 bg-[#F8C300]/15 border-b border-[#F8C300]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <p className="font-mono-code text-[#101014] dark:text-[#F8C300]">
                {cameraError || micError}
              </p>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 min-h-[34px] rounded-md bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir en pestaña nueva</span>
                </a>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 min-h-[34px] rounded-md border border-[#101014]/30 dark:border-[#F8C300]/40 font-semibold whitespace-nowrap"
                >
                  Subir MP4 / MP3
                </button>
              </div>
            </div>
          )}

          {/* Primary Modes + Clean Single-Row Experiments Strip */}
          <div className="px-4 sm:px-5 pt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  id: 'hand-face-hud' as StudioMode,
                  label: 'Manos (21 pts) & Cara',
                  icon: <Hand className="w-3.5 h-3.5" />,
                },
                {
                  id: 'audio-reactive' as StudioMode,
                  label: 'Micrófono FFT & Escultura',
                  icon: <Radio className="w-3.5 h-3.5" />,
                },
                {
                  id: 'camera-motion' as StudioMode,
                  label: 'Cámara & Silueta / Flujo',
                  icon: <Camera className="w-3.5 h-3.5" />,
                },
                {
                  id: 'video-art' as StudioMode,
                  label: 'Videoarte & Caleidoscopio',
                  icon: <Sparkles className="w-3.5 h-3.5" />,
                },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setStudioMode(mode.id)}
                  className={`px-3.5 py-2 min-h-[40px] text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    studioMode === mode.id
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <span className="text-[11px] font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97] mr-1 whitespace-nowrap shrink-0">
                  Presets:
                </span>
                {PLAYABLE_EXPERIMENTS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyExperimentPreset(preset)}
                    className={`px-3 py-1.5 min-h-[34px] text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                      activePresetId === preset.id
                        ? 'bg-[#7545D6] text-white border-[#7545D6]'
                        : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]'
                    }`}
                  >
                    {EXPERIMENT_SHORT_LABELS[preset.id]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-snug">
                {activeExperiment.interactionHint}
              </p>
            </div>
          </div>

          {/* 2-Zone Sandbox: 16:9 Stage + Balanced Tabbed Dock */}
          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT: 16:9 Crisp Viewport + Playable Bar + Telemetry */}
            <div className="lg:col-span-8 space-y-3">
              <div className="rounded-xl overflow-hidden bg-[#0D0D12] border border-[#2C2C36]">
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={540}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerUp={() => {
                    pointerRef.current.down = false;
                  }}
                  onPointerLeave={() => {
                    pointerRef.current.down = false;
                  }}
                  className="w-full aspect-video h-auto block cursor-crosshair touch-none"
                />

                {/* Playable 8-key Air Piano Bar */}
                {studioMode === 'hand-face-hud' && gestureSubMode === 'air-piano' && (
                  <div className="px-3 py-2 bg-[#16161C] border-t border-[#26262E] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-[11px] font-mono-code text-[#B4B2AC] mr-1 whitespace-nowrap">
                        Notas:
                      </span>
                      {AIR_PIANO_NOTES.map((note, idx) => (
                        <button
                          key={note.label}
                          type="button"
                          onClick={() => playAirPianoNote(idx, pointerRef.current.y)}
                          className={`px-2.5 py-1 min-h-[34px] rounded text-xs font-mono-code font-bold transition-colors whitespace-nowrap shrink-0 ${
                            readout.activeNote === note.label
                              ? 'bg-[#F8C300] text-[#101014]'
                              : 'bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] hover:border-[#F8C300]'
                          }`}
                        >
                          {note.label} <span className="opacity-60">({note.key})</span>
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] font-mono-code text-[#F8C300] tabular-nums whitespace-nowrap">
                      Filtro Wah-Wah: {readout.filterHz} Hz
                    </span>
                  </div>
                )}

                {/* Crisp Telemetry Footer */}
                <div className="px-3 py-2 bg-[#101014] border-t border-[#26262E] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code text-[#D8D5CD] tabular-nums">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      Video:{' '}
                      <strong className="text-[#F8C300]">
                        {isCameraOn
                          ? 'Webcam Real'
                          : isUploadedVideoOn
                          ? 'Archivo Video'
                          : 'Simulador'}
                      </strong>
                    </span>
                    <span>
                      Audio:{' '}
                      <strong className="text-[#F8C300]">
                        {isMicOn
                          ? 'Micrófono Real'
                          : isUploadedAudioOn
                          ? 'Audio Local'
                          : isDroneOn
                          ? 'Dron FFT'
                          : soundEnabled
                          ? 'Air Piano'
                          : 'Silencio'}
                      </strong>
                    </span>
                    {(isCameraOn || isUploadedVideoOn) && (
                      <span>
                        Tracking:{' '}
                        <strong className="text-[#326BFF]">
                          {mlStatus === 'ready'
                            ? `${readout.mlHandsDetected} mano(s) · ${readout.fingersCount} dedos${
                                readout.mlFaceDetected ? ' · Rostro OK' : ''
                              }`
                            : mlStatus === 'loading'
                            ? 'Cargando MediaPipe...'
                            : 'Flujo Óptico'}
                        </strong>
                      </span>
                    )}
                  </div>
                  <div>
                    Mov {readout.motionPct}% · G/M/A {readout.bass}/{readout.mids}/{readout.treble}%
                    {readout.pinchActive ? ' · PINZA' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Tabbed Parameter Dock */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Panel de Control</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={resetLabDefaults}
                    title="Restablecer valores"
                    className="p-2 min-h-[36px] min-w-[36px] rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] flex items-center justify-center"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={capturePngFrame}
                    className="px-3 py-1.5 min-h-[36px] text-[11px] font-mono-code font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Capturar PNG</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E]">
                {(
                  [
                    { id: 'interaccion', label: 'Tracking' },
                    { id: 'audio', label: 'Audio' },
                    { id: 'estetica', label: 'Estética' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDockTab(t.id)}
                    className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                      dockTab === t.id
                        ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014]'
                        : 'text-[#5B5B66] dark:text-[#A09E97] hover:text-[#101014] dark:hover:text-[#F4F2ED]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: TRACKING */}
              {dockTab === 'interaccion' && (
                <div className="space-y-3.5">
                  {studioMode === 'hand-face-hud' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold block">Dinámica Gestual</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(
                          [
                            { id: 'air-piano', label: 'Air Piano' },
                            { id: 'ipd-grid', label: 'Grilla IPD' },
                            { id: 'sculpture-wah', label: 'Escultura' },
                          ] as const
                        ).map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setGestureSubMode(sub.id)}
                            className={`px-2 py-2 text-[11px] font-semibold rounded-lg border transition-colors ${
                              gestureSubMode === sub.id
                                ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                                : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E]'
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono-code tabular-nums">
                      <span>Sensibilidad de movimiento</span>
                      <span>{sensitivity}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={65}
                      value={sensitivity}
                      onChange={(e) => setSensitivity(Number(e.target.value))}
                      className="w-full accent-[#F8C300]"
                    />
                  </div>

                  {studioMode === 'hand-face-hud' && !isCameraOn && !isUploadedVideoOn && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono-code tabular-nums">
                        <span>Apertura pinza (Simulador)</span>
                        <span>{Math.round(pinchValue * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={pinchValue}
                        onChange={(e) => setPinchValue(Number(e.target.value))}
                        className="w-full accent-[#326BFF]"
                      />
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-[#DEDAD0] dark:border-[#26262E]">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showHudOverlay}
                        onChange={(e) => setShowHudOverlay(e.target.checked)}
                        className="accent-[#F8C300] w-4 h-4"
                      />
                      <span>Mostrar esqueleto 21 pts (HUD)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showFaceMesh}
                        onChange={(e) => setShowFaceMesh(e.target.checked)}
                        className="accent-[#7545D6] w-4 h-4"
                      />
                      <span>Contorno facial anatómico (478 pts)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableMlTracking}
                        onChange={(e) => {
                          setEnableMlTracking(e.target.checked);
                          if (e.target.checked && (isCameraOn || isUploadedVideoOn)) {
                            void initMediaPipeIfNeeded();
                          }
                        }}
                        className="accent-[#326BFF] w-4 h-4"
                      />
                      <span>Motor IA MediaPipe (Manos + Cara)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: AUDIO */}
              {dockTab === 'audio' && (
                <div className="space-y-3.5">
                  {/* Live 3-Band EQ Signal Bars */}
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2">
                    <div className="text-[11px] font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
                      Nivel Espectral en Vivo (FFT)
                    </div>
                    {[
                      { label: 'Graves', val: readout.bass, color: 'bg-[#F8C300]' },
                      { label: 'Medios', val: readout.mids, color: 'bg-[#7545D6]' },
                      { label: 'Agudos', val: readout.treble, color: 'bg-[#326BFF]' },
                    ].map((band) => (
                      <div key={band.label} className="space-y-0.5">
                        <div className="flex justify-between text-[11px] font-mono-code tabular-nums">
                          <span>{band.label}</span>
                          <span>{band.val}%</span>
                        </div>
                        <div className="h-1.5 rounded bg-[#E6E2D8] dark:bg-[#26262E] overflow-hidden">
                          <div
                            className={`h-full ${band.color} transition-all duration-75`}
                            style={{ width: `${Math.min(100, band.val)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E]">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                      <span>Audio Air Piano</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled((v) => !v)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                        soundEnabled
                          ? 'bg-[#F8C300] text-[#101014]'
                          : 'bg-[#E6E2D8] dark:bg-[#26262E] text-[#4A4A55] dark:text-[#B4B2AC]'
                      }`}
                    >
                      {soundEnabled ? 'Activo' : 'Silencio'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono-code tabular-nums">
                      <span>Ganancia Mic / FFT</span>
                      <span>{audioGainBoost.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.6}
                      max={2.4}
                      step={0.05}
                      value={audioGainBoost}
                      onChange={(e) => setAudioGainBoost(Number(e.target.value))}
                      className="w-full accent-[#326BFF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono-code tabular-nums">
                      <span>Resonancia Wah-Wah (Q)</span>
                      <span>{wahResonance.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={14}
                      step={0.5}
                      value={wahResonance}
                      onChange={(e) => setWahResonance(Number(e.target.value))}
                      className="w-full accent-[#7545D6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono-code tabular-nums">
                      <span>Volumen Sintetizador</span>
                      <span>{Math.round(masterVolume * 200)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.45}
                      step={0.02}
                      value={masterVolume}
                      onChange={(e) => setMasterVolume(Number(e.target.value))}
                      className="w-full accent-[#F8C300]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: ESTÉTICA */}
              {dockTab === 'estetica' && (
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block">Tratamiento Visual</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(
                        [
                          { id: 'particles', label: 'Nítido / Partículas' },
                          { id: 'feedback', label: 'Eco Feedback' },
                          { id: 'scanline', label: 'Scanline CRT' },
                          { id: 'duotone', label: 'Duotono' },
                        ] as const
                      ).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setArtStyle(st.id)}
                          className={`px-2 py-2 text-[11px] font-semibold rounded-lg border transition-colors ${
                            artStyle === st.id
                              ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                              : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E]'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block">Paleta Generativa</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        [
                          { id: 'nucleo-gold', label: 'Núcleo' },
                          { id: 'violet-electric', label: 'Violeta' },
                          { id: 'mono-chrome', label: 'Cromo' },
                        ] as const
                      ).map((pal) => (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => setPaletteChoice(pal.id)}
                          className={`px-2 py-2 text-[11px] font-semibold rounded-lg border transition-colors ${
                            paletteChoice === pal.id
                              ? 'bg-[#7545D6] text-white border-[#7545D6]'
                              : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E]'
                          }`}
                        >
                          {pal.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono-code tabular-nums">
                      <span>Visibilidad Cámara (0% Proyección)</span>
                      <span>{Math.round(cameraOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={cameraOpacity}
                      onChange={(e) => setCameraOpacity(Number(e.target.value))}
                      className="w-full accent-[#326BFF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono-code tabular-nums">
                      <span>Persistencia Feedback</span>
                      <span>{Math.round(feedbackAmount * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.72}
                      max={0.96}
                      step={0.01}
                      value={feedbackAmount}
                      onChange={(e) => setFeedbackAmount(Number(e.target.value))}
                      className="w-full accent-[#F8C300]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono-code block">
                        Simetría: {symmetry}x
                      </span>
                      <div className="grid grid-cols-4 gap-1">
                        {([1, 2, 4, 8] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSymmetry(s)}
                            className={`py-1 text-[11px] font-mono-code font-bold rounded border ${
                              symmetry === s
                                ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                                : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E]'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-mono-code block tabular-nums">
                        RGB Shift: {rgbShift}px
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={18}
                        value={rgbShift}
                        onChange={(e) => setRgbShift(Number(e.target.value))}
                        className="w-full accent-[#7545D6]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. SENSORES Y CAPACIDADES DE TRACKING                        */}
        {/* ============================================================ */}
        <section className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] font-bold">
              ENTRADA → PROCESAMIENTO → TRANSFORMACIÓN → SALIDA
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans">
              Sensores, Tracking, WebXR y Privacidad Local
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SENSOR_CAPABILITIES.map((sensor) => (
              <article
                key={sensor.id}
                className="p-5 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold font-display-sans">{sensor.name}</h3>
                  <span className="text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300] shrink-0 tabular-nums">
                    {sensor.latency}
                  </span>
                </div>
                <div className="text-xs font-mono-code text-[#326BFF] dark:text-[#F8C300] font-semibold">
                  {sensor.landmarksOrMetric}
                </div>
                <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                  {sensor.bestFor}
                </p>
                <div className="pt-2 border-t border-[#DEDAD0] dark:border-[#26262E] space-y-1 text-[11px] font-mono-code">
                  <div>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">API / Lib:</strong>{' '}
                    <span className="text-[#5B5B66] dark:text-[#A09E97]">{sensor.apiOrLib}</span>
                  </div>
                  <div>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">Privacidad:</strong>{' '}
                    <span className="text-[#5B5B66] dark:text-[#A09E97]">{sensor.privacyNote}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. REFERENTES DE ARTE INTERACTIVO Y EXPERIMIENTO SONORO      */}
        {/* ============================================================ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>INVESTIGACIÓN Y OBRAS CLAVE (GLOBAL & LATINOAMÉRICA)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans">
                Referentes de Arte Interactivo con Gestos y Sonido Reactivo
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                ['todas', 'LATAM & España', 'Instalación Global', 'Investigación NIME'] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedRefFilter(cat)}
                  className={`px-3 py-2 min-h-[38px] text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    selectedRefFilter === cat
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                      : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]'
                  }`}
                >
                  {cat === 'todas' ? `Todas (${INTERACTIVE_ART_REFERENCES.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleReferences.map((refItem) => {
              const linkedPreset =
                PLAYABLE_EXPERIMENTS.find((p) => p.id === refItem.presetId) ??
                PLAYABLE_EXPERIMENTS[0];
              return (
                <article
                  key={refItem.id}
                  className="p-5 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-bold">
                      {refItem.category} · {refItem.originYear}
                    </div>
                    <h3 className="text-lg font-bold font-display-sans leading-snug">
                      {refItem.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#326BFF] dark:text-[#B4B2AC]">
                      {refItem.artistOrGroup}
                    </div>
                    <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                      {refItem.summary}
                    </p>
                    <div className="p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-[11px] font-mono-code space-y-1">
                      <div>
                        <strong>Sensores:</strong> {refItem.sensorAndStack}
                      </div>
                      <div className="text-[#4A4A55] dark:text-[#B4B2AC]">
                        <strong>Flujo:</strong> {refItem.pipelineFormula}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        applyExperimentPreset(linkedPreset);
                        const el = document.getElementById('live-sensory-workbench');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="px-3 py-2 min-h-[38px] text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Probar Dinámica</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          loadReferenceIntoPrompt(
                            refItem.title,
                            refItem.summary,
                            refItem.sensorAndStack
                          )
                        }
                        className="px-2.5 py-2 min-h-[38px] text-[11px] font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]"
                      >
                        Prompt
                      </button>
                      <a
                        href={refItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 min-h-[38px] min-w-[38px] rounded-lg border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] inline-flex items-center justify-center"
                        title="Abrir documentación de referencia"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. APLICACIONES POR ÁREAS Y WEBXR / VIDEOARTE                */}
        {/* ============================================================ */}
        <section className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
              ECOSISTEMA APLICADO · {INTERACTIVE_AREAS_CATALOG.length} ÁREAS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans">
              Aplicaciones Interactivas por Disciplina, WebXR y Videoarte
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedAreaFilter('todas')}
              className={`px-3 py-2 min-h-[40px] text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors whitespace-nowrap ${
                selectedAreaFilter === 'todas'
                  ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                  : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
              }`}
            >
              Todas las áreas ({INTERACTIVE_AREAS_CATALOG.length})
            </button>
            {INTERACTIVE_AREAS_CATALOG.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => setSelectedAreaFilter(area.id)}
                className={`px-3 py-2 min-h-[40px] text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                  selectedAreaFilter === area.id
                    ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                    : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                {area.area.split(',')[0]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visibleAreas.map((item) => (
              <article
                key={item.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                    {item.code}
                  </div>
                  <h3 className="text-xl font-bold font-display-sans">{item.area}</h3>
                  <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                    <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="font-mono-code font-bold text-[10px] uppercase text-[#326BFF] dark:text-[#F8C300] mb-1">
                        Entradas
                      </div>
                      <ul className="space-y-0.5 text-[#4A4A55] dark:text-[#B4B2AC]">
                        {item.inputs.map((inp) => (
                          <li key={inp}>• {inp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="font-mono-code font-bold text-[10px] uppercase text-[#7545D6] dark:text-[#F8C300] mb-1">
                        Procesamiento
                      </div>
                      <ul className="space-y-0.5 text-[#4A4A55] dark:text-[#B4B2AC]">
                        {item.processing.map((proc) => (
                          <li key={proc}>• {proc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="font-mono-code font-bold text-[10px] uppercase text-[#101014] dark:text-[#F8C300] mb-1">
                        Salidas
                      </div>
                      <ul className="space-y-0.5 text-[#4A4A55] dark:text-[#B4B2AC]">
                        {item.outputs.map((out) => (
                          <li key={out}>• {out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
                      Ejemplos reales de aplicación:
                    </div>
                    <ul className="space-y-1 text-xs text-[#4A4A55] dark:text-[#B4B2AC] list-disc list-inside">
                      {item.sampleUseCases.map((uc) => (
                        <li key={uc}>{uc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                    Herramientas: {item.recommendedTools.join(' · ')}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBpArea(item.area);
                      setBpSensor(item.defaultPreset.sensor);
                      setBpEngine(item.defaultPreset.engine);
                      setBpStack(item.defaultPreset.stack);
                      setBpConcept(item.defaultPreset.concept);
                      const el = document.getElementById('interactive-blueprint-generator');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="px-4 py-2.5 min-h-[40px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-2"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Cargar en Generador de Prompt</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. GENERADOR DE PROMPTS PARA APPS INTERACTIVAS & VIDEOARTE   */}
        {/* ============================================================ */}
        <section
          id="interactive-blueprint-generator"
          className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-6 scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] font-bold flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>DE LA IDEA AL PROTOTIPO FUNCIONAL</span>
              </div>
              <h2 className="text-2xl font-extrabold font-display-sans">
                Generador de Prompts de Apps Interactivas, XR & Videoarte
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Configura sensor, motor visual y stack para obtener un prompt técnico listo para
                Google AI Studio, Bolt, Replit, p5.js, Three.js / WebXR o TouchDesigner.
              </p>
            </div>
            {onOpenWebLab && (
              <button
                type="button"
                onClick={onOpenWebLab}
                className="px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] inline-flex items-center gap-1.5 shrink-0"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ir a Diseño Web IA</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="text-xs font-mono-code font-bold uppercase block mb-1">
                  1. Área de aplicación
                </label>
                <select
                  value={bpArea}
                  onChange={(e) => setBpArea(e.target.value)}
                  className="w-full p-2.5 min-h-[40px] text-xs sm:text-sm rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36]"
                >
                  {INTERACTIVE_AREAS_CATALOG.map((a) => (
                    <option key={a.id} value={a.area}>
                      {a.area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono-code font-bold uppercase block mb-1">
                  2. Sensor / Entrada principal
                </label>
                <select
                  value={bpSensor}
                  onChange={(e) => setBpSensor(e.target.value)}
                  className="w-full p-2.5 min-h-[40px] text-xs sm:text-sm rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36]"
                >
                  {PROMPT_BLUEPRINT_SENSORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono-code font-bold uppercase block mb-1">
                  3. Motor visual / Salida
                </label>
                <select
                  value={bpEngine}
                  onChange={(e) => setBpEngine(e.target.value)}
                  className="w-full p-2.5 min-h-[40px] text-xs sm:text-sm rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36]"
                >
                  {PROMPT_BLUEPRINT_ENGINES.map((eng) => (
                    <option key={eng} value={eng}>
                      {eng}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono-code font-bold uppercase block mb-1">
                  4. Stack o herramienta objetivo
                </label>
                <select
                  value={bpStack}
                  onChange={(e) => setBpStack(e.target.value)}
                  className="w-full p-2.5 min-h-[40px] text-xs sm:text-sm rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36]"
                >
                  {PROMPT_BLUEPRINT_STACKS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="interactive-concept-input"
                  className="text-xs font-mono-code font-bold uppercase block mb-1"
                >
                  5. Describe tu idea o experiencia interactiva
                </label>
                <textarea
                  id="interactive-concept-input"
                  rows={3}
                  value={bpConcept}
                  onChange={(e) => setBpConcept(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between gap-4">
              <div className="flex-1 p-4 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] font-mono-code text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {generatedInteractivePrompt}
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleCopy(generatedInteractivePrompt, 'bp-prompt')}
                  className="px-4 py-2.5 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-2"
                >
                  {copiedId === 'bp-prompt' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Prompt Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Prompt Técnico</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onApplyToBuilder({
                      mode: 'video',
                      subject: `Visuales generativos y videoarte interactivo para "${bpArea}": ${bpConcept}`,
                      visualStyle: 'Videoarte Experimental & Arte Generativo',
                      lighting: 'High contrast projection mapping light in dark gallery space',
                      colorPalette: 'Deep graphite dark room with electric violet and warm gold projections',
                      motion: 'Fluid audio-reactive generative motion trails responding to human movement',
                    })
                  }
                  className="px-4 py-2.5 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#7545D6] hover:bg-[#6438c0] text-white rounded-lg inline-flex items-center gap-2"
                >
                  <ScanFace className="w-4 h-4" />
                  <span>Generar Estética en Constructor</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
