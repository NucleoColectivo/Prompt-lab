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

function countExtendedFingers(landmarks: LandmarkPoint[]): number {
  if (landmarks.length < 21) return 0;
  const wrist = landmarks[0];
  const dist = (a: LandmarkPoint, b: LandmarkPoint) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  let count = 0;
  // Index (8 vs 6), Middle (12 vs 10), Ring (16 vs 14), Pinky (20 vs 18)
  const pairs: [number, number][] = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18],
  ];
  pairs.forEach(([tipIdx, pipIdx]) => {
    if (dist(landmarks[tipIdx], wrist) > dist(landmarks[pipIdx], wrist) * 1.12) {
      count += 1;
    }
  });

  // Thumb check inspired by MuGeVI (comparing tip 4 distance to ring MCP 13)
  if (dist(landmarks[4], landmarks[13]) > dist(landmarks[2], landmarks[13]) * 1.18) {
    count += 1;
  }
  return count;
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
  const [sensitivity, setSensitivity] = useState<number>(38);
  const [feedbackAmount, setFeedbackAmount] = useState<number>(0.84);
  const [symmetry, setSymmetry] = useState<1 | 2 | 4 | 8>(4);
  const [rgbShift, setRgbShift] = useState<number>(5);
  const [showHudOverlay, setShowHudOverlay] = useState<boolean>(true);
  const [pinchValue, setPinchValue] = useState<number>(0.65);

  // Audio & Synth parameters
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDroneOn, setIsDroneOn] = useState<boolean>(false);
  const [wahResonance, setWahResonance] = useState<number>(4.5);
  const [masterVolume, setMasterVolume] = useState<number>(0.24);

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
  const latestMlRef = useRef<{
    hands: LandmarkPoint[][];
    face: LandmarkPoint[] | null;
    pinchClosed: boolean;
    fingers: number;
  }>({
    hands: [],
    face: null,
    pinchClosed: false,
    fingers: 0,
  });

  const lastNoteTriggerRef = useRef<{ time: number; idx: number }>({ time: 0, idx: -1 });
  const activeVisualNoteRef = useRef<{ idx: number; time: number }>({ idx: -1, time: 0 });

  const configRef = useRef({
    studioMode,
    gestureSubMode,
    artStyle,
    paletteChoice,
    sensitivity,
    feedbackAmount,
    symmetry,
    rgbShift,
    showHudOverlay,
    pinchValue,
    isCameraOn,
    isUploadedVideoOn,
    isMicOn,
    isDroneOn,
    isUploadedAudioOn,
    soundEnabled,
    wahResonance,
    masterVolume,
    enableMlTracking,
  });

  useEffect(() => {
    configRef.current = {
      studioMode,
      gestureSubMode,
      artStyle,
      paletteChoice,
      sensitivity,
      feedbackAmount,
      symmetry,
      rgbShift,
      showHudOverlay,
      pinchValue,
      isCameraOn,
      isUploadedVideoOn,
      isMicOn,
      isDroneOn,
      isUploadedAudioOn,
      soundEnabled,
      wahResonance,
      masterVolume,
      enableMlTracking,
    };
  }, [
    studioMode,
    gestureSubMode,
    artStyle,
    paletteChoice,
    sensitivity,
    feedbackAmount,
    symmetry,
    rgbShift,
    showHudOverlay,
    pinchValue,
    isCameraOn,
    isUploadedVideoOn,
    isMicOn,
    isDroneOn,
    isUploadedAudioOn,
    soundEnabled,
    wahResonance,
    masterVolume,
    enableMlTracking,
  ]);

  const refreshDeviceList = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const vids = list.filter((d) => d.kind === 'videoinput');
      const auds = list.filter((d) => d.kind === 'audioinput');
      setVideoDevices(vids);
      setAudioDevices(auds);
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
      analyser.smoothingTimeConstant = 0.78;
      analyserRef.current = analyser;
      freqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    return { ctx: audioCtxRef.current, analyser: analyserRef.current };
  }, []);

  const playAirPianoNote = useCallback(
    (noteIdx: number, yNorm: number) => {
      const clampedIdx = Math.max(0, Math.min(AIR_PIANO_NOTES.length - 1, noteIdx));
      const nowMs = performance.now();
      activeVisualNoteRef.current = { idx: clampedIdx, time: nowMs };

      if (!configRef.current.soundEnabled) return;
      const { ctx, analyser } = ensureAudioContext();
      const note = AIR_PIANO_NOTES[clampedIdx];
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(note.freq, now);
      osc2.frequency.setValueAtTime(note.freq * 2, now);

      // MuGeVI Audio Effects style: vertical axis sweeps Wah-Wah filter cutoff
      const cutoff = Math.round(280 + (1 - Math.max(0, Math.min(1, yNorm))) * 2500);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoff, now);
      filter.Q.setValueAtTime(configRef.current.wahResonance, now);

      const vol = Math.max(0.05, Math.min(0.45, configRef.current.masterVolume));
      env.gain.setValueAtTime(0.001, now);
      env.gain.exponentialRampToValueAtTime(vol, now + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(env);
      env.connect(analyser);
      env.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.58);
      osc2.stop(now + 0.58);
    },
    [ensureAudioContext]
  );

  // Lazy-load MediaPipe HandLandmarker & FaceLandmarker when video feed starts
  const initMediaPipeIfNeeded = useCallback(async () => {
    if (handLandmarkerRef.current && faceLandmarkerRef.current) {
      setMlStatus('ready');
      return;
    }
    if (mlStatus === 'loading') return;

    setMlStatus('loading');
    try {
      const visionPkg = await import('@mediapipe/tasks-vision');
      const wasmFileset = await visionPkg.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm'
      );

      if (!handLandmarkerRef.current) {
        handLandmarkerRef.current = await visionPkg.HandLandmarker.createFromOptions(wasmFileset, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        });
      }

      if (!faceLandmarkerRef.current) {
        faceLandmarkerRef.current = await visionPkg.FaceLandmarker.createFromOptions(wasmFileset, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
        });
      }

      setMlStatus('ready');
    } catch {
      // Fallback safely if CDN or WASM blocked offline
      setMlStatus('fallback');
    }
  }, [mlStatus]);

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
    latestMlRef.current = { hands: [], face: null, pinchClosed: false, fingers: 0 };
    setIsCameraOn(false);
  }, [isUploadedVideoOn]);

  const startCamera = useCallback(
    async (overrideDeviceId?: string) => {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          'Este navegador o iframe restringe navigator.mediaDevices. Prueba abrir en pestaña nueva o subir un video de prueba.'
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
          ? { deviceId: { exact: devId }, width: { ideal: 640 }, height: { ideal: 360 } }
          : { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 360 } };

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
        setIsCameraOn(true);
        void refreshDeviceList();
        if (configRef.current.enableMlTracking) {
          void initMediaPipeIfNeeded();
        }
      } catch (err: unknown) {
        const errName = (err as { name?: string })?.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errName === 'SecurityError') {
          setCameraError(
            'El navegador o el contenedor embebido bloqueó el permiso de cámara. Concede el permiso en la barra del navegador, abre la app en pestaña nueva o sube un video MP4 de prueba.'
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError(
            'No se detectó cámara física conectada. Puedes probar el tracking subiendo un video local o usando el lienzo táctil/cursor.'
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
          'El contexto actual no permite getUserMedia de audio. Enciende el "Sintetizador FFT" o sube un audio MP3/WAV.'
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
          ? { deviceId: { exact: devId }, echoCancellation: true, noiseSuppression: true }
          : { echoCancellation: true, noiseSuppression: true };

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraint,
          video: false,
        });
        micStreamRef.current = stream;

        const source = ctx.createMediaStreamSource(stream);
        // Connect ONLY to analyser so there is zero loudspeaker feedback loop
        source.connect(analyser);
        micSourceRef.current = source;

        setIsMicOn(true);
        void refreshDeviceList();
      } catch (err: unknown) {
        const errName = (err as { name?: string })?.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errName === 'SecurityError') {
          setMicError(
            'Permiso de micrófono bloqueado por navegador o iframe. Abre en pestaña nueva, sube un MP3/WAV o usa el Sintetizador Web Audio integrado.'
          );
        } else {
          setMicError(
            'No se detectó micrófono disponible. Puedes usar un archivo MP3/WAV o el Sintetizador integrado para experimentar con el FFT.'
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
            // If autoplay with audio was prevented, retry muted video playback
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

  // 60FPS Real-time Canvas, ML Landmarks & Audio FFT Engine
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

      const paletteColors =
        cfg.paletteChoice === 'nucleo-gold'
          ? ['#F8C300', '#F4F2ED', '#7545D6', '#326BFF']
          : cfg.paletteChoice === 'violet-electric'
          ? ['#7545D6', '#326BFF', '#F4F2ED', '#F8C300']
          : ['#F4F2ED', '#B4B2AC', '#71717A', '#F8C300'];

      // 1) Video Optical Motion + Optional MediaPipe 21-pt Hand & 478-pt Face ML
      let trackedX = pointerRef.current.x;
      let trackedY = pointerRef.current.y;
      let motionPct = pointerRef.current.active ? (pointerRef.current.down ? 74 : 36) : 16;

      const video = videoRef.current;
      const off = offscreenRef.current;
      if (hasVideoFeed && video && video.readyState >= 2 && off) {
        const octx = off.getContext('2d', { willReadFrequently: true });
        if (octx) {
          octx.save();
          if (cfg.isCameraOn) {
            octx.scale(-1, 1);
            octx.drawImage(video, -off.width, 0, off.width, off.height);
          } else {
            octx.drawImage(video, 0, 0, off.width, off.height);
          }
          octx.restore();
          const frame = octx.getImageData(0, 0, off.width, off.height).data;
          const prev = prevFrameRef.current;

          if (prev) {
            let sumX = 0;
            let sumY = 0;
            let count = 0;
            const threshold = Math.max(12, 75 - cfg.sensitivity);

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
            motionPct = Math.min(100, Math.round((count / sampledPixels) * 320));
            if (count > 8) {
              trackedX = sumX / count / off.width;
              trackedY = sumY / count / off.height;
              pointerRef.current.x = pointerRef.current.x * 0.72 + trackedX * 0.28;
              pointerRef.current.y = pointerRef.current.y * 0.72 + trackedY * 0.28;
            }
          }
          prevFrameRef.current = new Uint8ClampedArray(frame);
        }

        // Run MediaPipe inference every 2 frames when active & loaded
        if (cfg.enableMlTracking && tick % 2 === 0 && (handLandmarkerRef.current || faceLandmarkerRef.current)) {
          const ts = performance.now();
          try {
            const handRes = handLandmarkerRef.current?.detectForVideo(video, ts);
            const rawHands = handRes?.landmarks ?? [];
            const mirroredHands = rawHands.map((hand) =>
              hand.map((pt) => ({
                x: cfg.isCameraOn ? 1 - pt.x : pt.x,
                y: pt.y,
                z: pt.z,
              }))
            );

            let pinchClosed = false;
            let fingers = 0;
            if (mirroredHands.length > 0 && mirroredHands[0].length >= 21) {
              const primary = mirroredHands[0];
              const thumbTip = primary[4];
              const indexTip = primary[8];
              const d = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
              pinchClosed = d < 0.055;
              fingers = countExtendedFingers(primary);

              // Anchor stage pointer cleanly to Index fingertip (keypoint 8)
              pointerRef.current.x = pointerRef.current.x * 0.4 + indexTip.x * 0.6;
              pointerRef.current.y = pointerRef.current.y * 0.4 + indexTip.y * 0.6;

              // Trigger MuGeVI Air Piano note when pinch closes after cooldown
              if (
                cfg.studioMode === 'hand-face-hud' &&
                cfg.gestureSubMode === 'air-piano' &&
                pinchClosed &&
                ts - lastNoteTriggerRef.current.time > 260
              ) {
                const noteIdx = Math.floor(
                  Math.max(0, Math.min(0.999, indexTip.x)) * AIR_PIANO_NOTES.length
                );
                lastNoteTriggerRef.current = { time: ts, idx: noteIdx };
                playAirPianoNote(noteIdx, indexTip.y);
              }
            }

            const faceRes = faceLandmarkerRef.current?.detectForVideo(video, ts);
            const rawFace = faceRes?.faceLandmarks?.[0] ?? null;
            const mirroredFace = rawFace
              ? rawFace.map((pt) => ({
                  x: cfg.isCameraOn ? 1 - pt.x : pt.x,
                  y: pt.y,
                  z: pt.z,
                }))
              : null;

            latestMlRef.current = {
              hands: mirroredHands,
              face: mirroredFace,
              pinchClosed,
              fingers,
            };
          } catch {
            // ignore intermittent timestamp collisions
          }
        }
      } else if (!pointerRef.current.active) {
        trackedX = 0.5 + Math.cos(tick * 0.024) * 0.24;
        trackedY = 0.5 + Math.sin(tick * 0.031) * 0.18;
        pointerRef.current.x = trackedX;
        pointerRef.current.y = trackedY;
      }

      // 2) Analyze Web Audio FFT
      let bass = 18 + Math.sin(tick * 0.08) * 9;
      let mids = 22 + Math.cos(tick * 0.05) * 10;
      let treble = 14 + Math.sin(tick * 0.12) * 8;

      const hasAudioSource =
        cfg.isMicOn || cfg.isDroneOn || cfg.isUploadedAudioOn || cfg.isUploadedVideoOn ||
        performance.now() - activeVisualNoteRef.current.time < 900;

      if (hasAudioSource && analyserRef.current && freqDataRef.current) {
        analyserRef.current.getByteFrequencyData(freqDataRef.current);
        const data = freqDataRef.current;
        const avg = (start: number, end: number) => {
          let total = 0;
          for (let i = start; i < end; i += 1) total += data[i];
          return Math.round((total / Math.max(1, end - start) / 255) * 100);
        };
        bass = Math.max(8, avg(0, 12));
        mids = Math.max(8, avg(12, 42));
        treble = Math.max(6, avg(42, 96));

        // Modulate drone synth & Wah-Wah filter cutoff by pointer X/Y
        if (cfg.isDroneOn && droneNodesRef.current) {
          const baseFreq = 82 + pointerRef.current.x * 220;
          const harmonic = baseFreq * (1.25 + (1 - pointerRef.current.y) * 0.75);
          const filterHz = 260 + (1 - pointerRef.current.y) * 2400;
          droneNodesRef.current.osc1.frequency.setTargetAtTime(baseFreq, 0, 0.06);
          droneNodesRef.current.osc2.frequency.setTargetAtTime(harmonic, 0, 0.06);
          droneNodesRef.current.filter.frequency.setTargetAtTime(filterHz, 0, 0.05);
          droneNodesRef.current.filter.Q.setTargetAtTime(cfg.wahResonance, 0, 0.05);
        }
      }

      // 3) Background / Feedback Pass
      const fadeAlpha =
        cfg.studioMode === 'video-art' || cfg.artStyle === 'feedback'
          ? Math.max(0.03, 1 - cfg.feedbackAmount)
          : 0.24;
      ctx.fillStyle = `rgba(16, 16, 20, ${fadeAlpha})`;
      ctx.fillRect(0, 0, W, H);

      // Draw live video or camera feed (mirrored for webcam)
      if (hasVideoFeed && video && video.readyState >= 2) {
        ctx.save();
        ctx.globalAlpha = cfg.artStyle === 'duotone' ? 0.56 : 0.44;
        if (cfg.isCameraOn) {
          ctx.translate(W, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, W, H);
        ctx.restore();

        if (cfg.artStyle === 'duotone') {
          ctx.fillStyle =
            cfg.paletteChoice === 'violet-electric'
              ? 'rgba(117, 69, 214, 0.22)'
              : 'rgba(248, 195, 0, 0.14)';
          ctx.fillRect(0, 0, W, H);
        }
      }

      const cx = pointerRef.current.x * W;
      const cy = pointerRef.current.y * H;

      // 4) Mode-Specific Rendering
      if (cfg.studioMode === 'camera-motion') {
        // Rain Room + Optical Flow Particles
        const rainDropsCount = 4;
        for (let r = 0; r < rainDropsCount; r += 1) {
          particlesRef.current.push({
            x: Math.random() * W,
            y: -8,
            vx: (Math.random() - 0.5) * 0.8,
            vy: 3.4 + Math.random() * 2.5,
            life: 0,
            maxLife: 105,
            size: 2.2 + Math.random() * 2,
            hue: paletteColors[1],
          });
        }

        const spawnCount = Math.max(2, Math.round(motionPct / 15));
        for (let i = 0; i < spawnCount; i += 1) {
          particlesRef.current.push({
            x: cx + (Math.random() - 0.5) * 26,
            y: cy + (Math.random() - 0.5) * 26,
            vx: (Math.random() - 0.5) * (2.5 + motionPct * 0.06),
            vy: (Math.random() - 0.5) * (2.5 + motionPct * 0.06) - 0.6,
            life: 0,
            maxLife: 44 + Math.random() * 24,
            size: 2.8 + Math.random() * 4.5,
            hue: paletteColors[i % paletteColors.length],
          });
        }
        if (particlesRef.current.length > 320) {
          particlesRef.current = particlesRef.current.slice(-320);
        }

        particlesRef.current.forEach((p) => {
          // Rain Room repulsion halo around centroid
          const dx = p.x - cx;
          const dy = p.y - cy;
          const d = Math.hypot(dx, dy);
          if (d < 68 && d > 1) {
            p.vx += (dx / d) * 0.55;
            p.vy += (dy / d) * 0.35;
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
            ctx.arc(p.x, p.y, p.size * alpha + 1, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;
        particlesRef.current = particlesRef.current.filter(
          (p) => p.life < p.maxLife && p.y < H + 20
        );

        if (cfg.showHudOverlay) {
          ctx.strokeStyle = '#F8C300';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, 42 + motionPct * 0.35, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx - 28, cy);
          ctx.lineTo(cx + 28, cy);
          ctx.moveTo(cx, cy - 28);
          ctx.lineTo(cx, cy + 28);
          ctx.stroke();
        }
      } else if (cfg.studioMode === 'hand-face-hud') {
        const ml = latestMlRef.current;
        const effectivePinch =
          ml.hands.length > 0
            ? ml.pinchClosed
              ? 0.12
              : 0.8
            : pointerRef.current.down
            ? 0.16
            : cfg.pinchValue;

        if (cfg.gestureSubMode === 'air-piano') {
          // Draw MuGeVI 8 spatial note columns
          const colW = W / AIR_PIANO_NOTES.length;
          const hoverIdx = Math.floor(Math.max(0, Math.min(0.999, pointerRef.current.x)) * AIR_PIANO_NOTES.length);
          const recentHit = performance.now() - activeVisualNoteRef.current.time < 340;

          AIR_PIANO_NOTES.forEach((n, idx) => {
            const isHover = idx === hoverIdx;
            const isTriggered = recentHit && activeVisualNoteRef.current.idx === idx;
            const x0 = idx * colW;

            ctx.fillStyle = isTriggered
              ? 'rgba(248, 195, 0, 0.24)'
              : isHover
              ? 'rgba(50, 107, 255, 0.14)'
              : 'rgba(255, 255, 255, 0.02)';
            ctx.fillRect(x0 + 2, 16, colW - 4, H - 32);

            ctx.strokeStyle = isTriggered
              ? '#F8C300'
              : isHover
              ? '#326BFF'
              : 'rgba(244, 242, 237, 0.14)';
            ctx.lineWidth = isTriggered ? 2 : 1;
            ctx.strokeRect(x0 + 2, 16, colW - 4, H - 32);

            ctx.fillStyle = isTriggered ? '#F8C300' : isHover ? '#F4F2ED' : 'rgba(244, 242, 237, 0.55)';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(n.label, x0 + colW / 2 - 10, 36);
            ctx.font = '10px monospace';
            ctx.fillText(`[${n.key}]`, x0 + colW / 2 - 10, H - 24);
          });

          // Horizontal Wah-Wah Cutoff Frequency guide line
          ctx.strokeStyle = 'rgba(117, 69, 214, 0.7)';
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(0, cy);
          ctx.lineTo(W, cy);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (cfg.gestureSubMode === 'ipd-grid') {
          // IPD (Interactive Poster Design) Swiss parametric grid
          const cols = 10;
          const rows = 6;
          const cellW = W / cols;
          const cellH = H / rows;

          for (let r = 0; r < rows; r += 1) {
            for (let c = 0; c < cols; c += 1) {
              const gx = (c + 0.5) * cellW;
              const gy = (r + 0.5) * cellH;
              const dist = Math.hypot(gx - cx, gy - cy);
              const influence = Math.max(0, 1 - dist / 220);
              const isPinched = effectivePinch < 0.35;
              const sizeScale = isPinched
                ? Math.max(0.22, 0.85 - influence * 0.65)
                : 0.35 + influence * 0.72 + (bass / 100) * 0.2;

              ctx.save();
              ctx.translate(gx, gy);
              ctx.rotate(influence * (isPinched ? -0.9 : 0.8) + tick * 0.004);
              const boxW = cellW * 0.66 * sizeScale;
              const boxH = cellH * 0.66 * sizeScale;
              ctx.strokeStyle =
                influence > 0.45 ? (isPinched ? '#F8C300' : '#7545D6') : 'rgba(244, 242, 237, 0.25)';
              ctx.lineWidth = influence > 0.45 ? 2 : 1;
              ctx.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);
              if (influence > 0.55) {
                ctx.fillStyle = isPinched ? 'rgba(248, 195, 0, 0.22)' : 'rgba(50, 107, 255, 0.22)';
                ctx.fillRect(-boxW / 2, -boxH / 2, boxW, boxH);
              }
              ctx.restore();
            }
          }
        } else {
          // Sculpture & Face HUD
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tick * 0.015 + effectivePinch * 2.1);
          const sides = 6;
          const radius = 38 + effectivePinch * 58 + bass * 0.35;
          ctx.strokeStyle = paletteColors[0];
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i <= sides; i += 1) {
            const ang = (i / sides) * Math.PI * 2;
            const px = Math.cos(ang) * radius;
            const py = Math.sin(ang) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Render REAL MediaPipe 21-keypoint hand(s) if detected, else clean synthetic 21-point rig
        if (cfg.showHudOverlay) {
          if (ml.hands.length > 0) {
            ml.hands.forEach((hand) => {
              HAND_CONNECTIONS.forEach(([a, b]) => {
                const pA = hand[a];
                const pB = hand[b];
                if (!pA || !pB) return;
                ctx.strokeStyle = '#326BFF';
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.moveTo(pA.x * W, pA.y * H);
                ctx.lineTo(pB.x * W, pB.y * H);
                ctx.stroke();
              });
              hand.forEach((pt, idx) => {
                const isTip = idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20;
                ctx.fillStyle = idx === 4 || idx === 8 ? '#F8C300' : isTip ? '#7545D6' : '#F4F2ED';
                ctx.beginPath();
                ctx.arc(pt.x * W, pt.y * H, idx === 4 || idx === 8 ? 5 : 3, 0, Math.PI * 2);
                ctx.fill();
              });
              // Pinch line 4 <-> 8
              if (hand[4] && hand[8]) {
                ctx.strokeStyle = ml.pinchClosed ? '#F8C300' : '#7545D6';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(hand[4].x * W, hand[4].y * H);
                ctx.lineTo(hand[8].x * W, hand[8].y * H);
                ctx.stroke();
                ctx.setLineDash([]);
              }
            });
          } else {
            // Clean 21-keypoint hand rig anchored to cursor/centroid
            const scale = 0.74 + effectivePinch * 0.65;
            const wrist = { x: cx, y: cy + 52 * scale };
            const spread = 0.45 + effectivePinch * 0.62;
            const fingers = [
              { angle: -0.75 * spread, len: 50 * scale },
              { angle: -0.35 * spread, len: 72 * scale },
              { angle: 0, len: 80 * scale },
              { angle: 0.32 * spread, len: 72 * scale },
              { angle: 0.65 * spread, len: 58 * scale },
            ];
            const tips: { x: number; y: number }[] = [];
            fingers.forEach((f, idx) => {
              let prevPt = wrist;
              const joints = idx === 0 ? 3 : 4;
              for (let j = 1; j <= joints; j += 1) {
                const segLen = (f.len / joints) * (1 - j * 0.05);
                const curl = idx === 1 ? (1 - effectivePinch) * 0.36 : 0;
                const ang = -Math.PI / 2 + f.angle + curl * j;
                const nextPt = {
                  x: prevPt.x + Math.cos(ang) * segLen,
                  y: prevPt.y + Math.sin(ang) * segLen,
                };
                ctx.strokeStyle = '#326BFF';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(prevPt.x, prevPt.y);
                ctx.lineTo(nextPt.x, nextPt.y);
                ctx.stroke();

                ctx.fillStyle = j === joints ? '#F8C300' : '#F4F2ED';
                ctx.beginPath();
                ctx.arc(nextPt.x, nextPt.y, j === joints ? 4.2 : 2.8, 0, Math.PI * 2);
                ctx.fill();
                prevPt = nextPt;
              }
              tips.push(prevPt);
            });
            if (tips.length >= 2) {
              ctx.strokeStyle = effectivePinch < 0.35 ? '#F8C300' : '#7545D6';
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(tips[0].x, tips[0].y);
              ctx.lineTo(tips[1].x, tips[1].y);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }

          // Face tracking HUD (Real 478 landmarks sample or responsive vector rig top-right)
          if (ml.face && ml.face.length > 400) {
            ctx.fillStyle = 'rgba(248, 195, 0, 0.72)';
            for (let i = 0; i < ml.face.length; i += 6) {
              const pt = ml.face[i];
              ctx.fillRect(pt.x * W - 1, pt.y * H - 1, 2.2, 2.2);
            }
          } else {
            const fx = W - 76;
            const fy = 62;
            const yaw = (pointerRef.current.x - 0.5) * 16;
            const pitch = (pointerRef.current.y - 0.5) * 12;
            ctx.strokeStyle = 'rgba(244, 242, 237, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(fx + yaw * 0.3, fy + pitch * 0.3, 24, 31, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#F8C300';
            ctx.beginPath();
            ctx.arc(fx + yaw * 0.5 - 8, fy + pitch * 0.4 - 5, 2.3, 0, Math.PI * 2);
            ctx.arc(fx + yaw * 0.5 + 8, fy + pitch * 0.4 - 5, 2.3, 0, Math.PI * 2);
            ctx.fill();
            const mouthH = Math.max(2, (bass / 100) * 11);
            ctx.strokeStyle = '#7545D6';
            ctx.beginPath();
            ctx.ellipse(fx + yaw * 0.5, fy + pitch * 0.5 + 10, 8, mouthH, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      } else if (cfg.studioMode === 'audio-reactive') {
        // The Shy Machine 12-faced kinetic polyhedron + AURA 48 radial bars
        const centerX = W / 2;
        const centerY = H / 2;
        const bars = 48;
        const baseR = 54 + bass * 0.62;

        // Inner 12-sided kinetic shell (opening & closing like The Shy Machine)
        const facets = 12;
        const shellAperture = 22 + (mids / 100) * 44;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-tick * 0.008);
        for (let f = 0; f < facets; f += 1) {
          const a = (f / facets) * Math.PI * 2;
          ctx.save();
          ctx.rotate(a);
          ctx.strokeStyle = paletteColors[f % 2];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(14, 0);
          ctx.lineTo(shellAperture, -10 - treble * 0.14);
          ctx.lineTo(shellAperture + 12, 0);
          ctx.lineTo(shellAperture, 10 + treble * 0.14);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        // Outer radial harmonic rods (AURA style)
        for (let i = 0; i < bars; i += 1) {
          const angle = (i / bars) * Math.PI * 2 + tick * 0.01;
          let mag = 16 + Math.sin(tick * 0.1 + i * 0.4) * 12;
          if (hasAudioSource && freqDataRef.current) {
            mag = (freqDataRef.current[i % freqDataRef.current.length] / 255) * 96;
          } else {
            mag += pointerRef.current.x * 34;
          }

          const x1 = centerX + Math.cos(angle) * baseR;
          const y1 = centerY + Math.sin(angle) * baseR;
          const x2 = centerX + Math.cos(angle) * (baseR + mag);
          const y2 = centerY + Math.sin(angle) * (baseR + mag);

          ctx.strokeStyle = paletteColors[i % paletteColors.length];
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Bottom waveform trace
        ctx.strokeStyle = '#F8C300';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < W; x += 6) {
          const idx = Math.floor((x / W) * 64);
          const val =
            hasAudioSource && freqDataRef.current
              ? (freqDataRef.current[idx] / 255) * 62
              : Math.sin(x * 0.03 + tick * 0.12) * (12 + mids * 0.3);
          const py = H - 22 - val;
          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();
      } else if (cfg.studioMode === 'video-art') {
        const folds = cfg.symmetry;
        const shift = cfg.rgbShift;
        const radius = 34 + bass * 0.58 + motionPct * 0.4;

        ctx.save();
        ctx.translate(W / 2, H / 2);
        for (let f = 0; f < folds; f += 1) {
          ctx.save();
          ctx.rotate((f / folds) * Math.PI * 2 + tick * 0.012);
          const ox = (pointerRef.current.x - 0.5) * 175;
          const oy = (pointerRef.current.y - 0.5) * 108;

          const channels = [
            { dx: -shift, color: 'rgba(248, 195, 0, 0.72)' },
            { dx: 0, color: 'rgba(117, 69, 214, 0.76)' },
            { dx: shift, color: 'rgba(50, 107, 255, 0.72)' },
          ];
          channels.forEach((ch) => {
            ctx.strokeStyle = ch.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ox + ch.dx, oy, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeRect(ox + ch.dx - radius * 0.5, oy - radius * 0.5, radius, radius);
          });
          ctx.restore();
        }
        ctx.restore();
      }

      if (cfg.artStyle === 'scanline') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
        for (let sy = 0; sy < H; sy += 4) {
          ctx.fillRect(0, sy, W, 1);
        }
      }

      if (tick % 6 === 0) {
        const noteIdx = Math.floor(
          Math.max(0, Math.min(0.999, pointerRef.current.x)) * AIR_PIANO_NOTES.length
        );
        const fHz = Math.round(280 + (1 - Math.max(0, Math.min(1, pointerRef.current.y))) * 2500);
        setReadout({
          x: Math.round(pointerRef.current.x * 100),
          y: Math.round(pointerRef.current.y * 100),
          motionPct,
          bass: Math.min(100, Math.round(bass)),
          mids: Math.min(100, Math.round(mids)),
          treble: Math.min(100, Math.round(treble)),
          activeNote: AIR_PIANO_NOTES[noteIdx]?.label || 'C4',
          filterHz: fHz,
          fingersCount: latestMlRef.current.fingers,
          mlHandsDetected: latestMlRef.current.hands.length,
          mlFaceDetected: Boolean(latestMlRef.current.face),
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
        playAirPianoNote(idx, ny);
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
      playAirPianoNote(idx, ny);
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
    applyExperimentPreset(PLAYABLE_EXPERIMENTS[0]);
    particlesRef.current = [];
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
      `- PROCESAMIENTO: Suavizado exponencial de coordenadas (lerp), detección de gestos o bandas FFT y procesamiento 100% local en el navegador (sin enviar video ni audio a servidores externos).`,
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
            <strong>tracking gestual (21 puntos estilo MuGeVI)</strong>,{' '}
            <strong>cuadrícula reactiva (IPD)</strong>,{' '}
            <strong>esculturas audioreactivas FFT</strong> y{' '}
            <strong>referentes latinoamericanos y globales</strong>.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 1. MESA DE PRUEBAS SENSORIALES (2-ZONE SANDBOX)              */}
        {/* ============================================================ */}
        <section
          id="live-sensory-workbench"
          className="rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] overflow-hidden scroll-mt-24"
        >
          {/* Off-screen non-hidden media elements (prevents display:none decoder suspension) */}
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
                Procesamiento local en navegador. Si no conectas sensores físicos, toca el lienzo o
                usa teclas <span className="font-mono-code font-bold">A–K</span>.
              </p>
            </div>

            {/* Clean single-row wraps gracefully on mobile */}
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
                <span>
                  {uploadedMediaName ? 'Cambiar Video/Audio' : 'Subir Video / Audio'}
                </span>
              </button>
            </div>
          </div>

          {/* Device selector bar when permissions unlocked */}
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

          {/* Diagnostic & Recovery Banner on Permission Block */}
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

          {/* Primary Modes + 1-Click Presets */}
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

            {/* 5 Playable Experiment Presets Strip */}
            <div className="p-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97] mr-1">
                  Experimentos:
                </span>
                {PLAYABLE_EXPERIMENTS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyExperimentPreset(preset)}
                    className={`px-2.5 py-1.5 min-h-[34px] text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                      activePresetId === preset.id
                        ? 'bg-[#7545D6] text-white border-[#7545D6]'
                        : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]'
                    }`}
                  >
                    {preset.title.split('·')[0].trim()}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC] leading-snug lg:text-right max-w-xl">
                {activeExperiment.interactionHint}
              </p>
            </div>
          </div>

          {/* 2-Zone Sandbox: 16:9 Stage + Balanced Tabbed Dock */}
          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT: 16:9 Viewport + Playable Musical Strip + Telemetry */}
            <div className="lg:col-span-8 space-y-3">
              <div className="rounded-xl overflow-hidden bg-[#101014] border border-[#2C2C36]">
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={405}
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

                {/* Playable 8-key Air Piano Bar in Hand/Face Mode */}
                {studioMode === 'hand-face-hud' && gestureSubMode === 'air-piano' && (
                  <div className="px-3 py-2 bg-[#16161C] border-t border-[#26262E] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-[11px] font-mono-code text-[#B4B2AC] mr-1 whitespace-nowrap">
                        Tocar Notas:
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

                {/* Audio Spectrum Meter Bar */}
                <div className="px-3 py-2 bg-[#101014] border-t border-[#26262E] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code text-[#D8D5CD] tabular-nums">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      Video:{' '}
                      <strong className="text-[#F8C300]">
                        {isCameraOn
                          ? 'Webcam Real'
                          : isUploadedVideoOn
                          ? 'Archivo Video'
                          : 'Cursor / Touch'}
                      </strong>
                    </span>
                    <span>
                      Audio:{' '}
                      <strong className="text-[#F8C300]">
                        {isMicOn
                          ? 'Micrófono Real'
                          : isUploadedAudioOn
                          ? 'Audio MP3/WAV'
                          : isDroneOn
                          ? 'Dron FFT'
                          : soundEnabled
                          ? 'Air Piano Synth'
                          : 'Silenciado'}
                      </strong>
                    </span>
                    {(isCameraOn || isUploadedVideoOn) && (
                      <span>
                        MediaPipe:{' '}
                        <strong className="text-[#326BFF]">
                          {mlStatus === 'ready'
                            ? `${readout.mlHandsDetected} mano(s) · ${readout.fingersCount} dedos`
                            : mlStatus === 'loading'
                            ? 'Cargando...'
                            : 'Flujo Óptico'}
                        </strong>
                      </span>
                    )}
                  </div>
                  <div>
                    XY ({readout.x}%, {readout.y}%) · Mov {readout.motionPct}% · G/M/A{' '}
                    {readout.bass}/{readout.mids}/{readout.treble}%
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Tabbed Parameter Dock (Fits cleanly alongside canvas without vertical clipping) */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
              {/* Header + Quick Snapshot/Reset */}
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

              {/* 3 Compact Dock Tabs */}
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

              {/* TAB 1: INTERACCIÓN & TRACKING */}
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

                  {studioMode === 'hand-face-hud' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono-code tabular-nums">
                        <span>Apertura pinza (Pulgar–Índice)</span>
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

                  <div className="space-y-2 pt-1 border-t border-[#DEDAD0] dark:border-[#26262E]">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showHudOverlay}
                        onChange={(e) => setShowHudOverlay(e.target.checked)}
                        className="accent-[#F8C300] w-4 h-4"
                      />
                      <span>Mostrar malla 21 pts & rostro (HUD)</span>
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
                      <span>Motor IA MediaPipe (con cámara/video)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: AUDIO & SYNTH */}
              {dockTab === 'audio' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E]">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                      <span>Audio Air Piano (Web Audio)</span>
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

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => playAirPianoNote(Math.floor(Math.random() * 8), pointerRef.current.y)}
                      className="px-3 py-2 min-h-[38px] text-xs font-bold rounded-lg bg-[#7545D6] text-white inline-flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Disparar Nota</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleDroneSynth}
                      className="px-3 py-2 min-h-[38px] text-xs font-bold rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E]"
                    >
                      {isDroneOn ? 'Apagar Dron' : 'Encender Dron'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: ESTÉTICA & VIDEOARTE */}
              {dockTab === 'estetica' && (
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block">Tratamiento Visual</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(
                        [
                          { id: 'particles', label: 'Partículas' },
                          { id: 'feedback', label: 'Eco Feedback' },
                          { id: 'scanline', label: 'Scanline CRT' },
                          { id: 'duotone', label: 'Duotono' },
                        ] as const
                      ).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setArtStyle(st.id)}
                          className={`px-2.5 py-2 text-[11px] font-semibold rounded-lg border transition-colors ${
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
                      <span>Persistencia Feedback</span>
                      <span>{Math.round(feedbackAmount * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.74}
                      max={0.97}
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
