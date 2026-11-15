import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sliders,
  ArrowLeftRight,
  LayoutGrid,
  Clapperboard,
  Sun,
  Video,
  Palette,
  Braces,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  Download,
  Upload,
  Send,
  Sparkles,
  Eye,
  Images,
  BookOpen,
} from 'lucide-react';
import { TechnicalDiagramSVG } from './VisualDiagrams';
import {
  COMPARATOR_TOPIC_SETS,
  VISUAL_LIBRARY_PATHS,
} from '../data/visualLibraryRegistry';
import { ResilientImage } from './ResilientImage';
import type { PromptBuilderState } from './PromptBuilder';
import type { DiagramConfig, ModuleId } from '../data/modulesData';

export interface StoryboardSceneItem {
  id: string;
  title: string;
  shotSize: string;
  angle: string;
  movement: string;
  durationSec: number;
  action: string;
  lightingNote: string;
}

interface InteractiveCreativeLabsProps {
  externalStoryboardScenes?: StoryboardSceneItem[];
  onApplyToBuilder: (patch: Partial<PromptBuilderState>, scrollToBuilder?: boolean) => void;
  onJumpToJsonLab: () => void;
  onOpenGallery?: (collection?: string) => void;
  onOpenDirector?: () => void;
  onOpenLibraryModule?: (moduleId: ModuleId) => void;
}

type LabTabId = 'comparator' | 'storyboard' | 'lighting' | 'camera' | 'color';

const DEFAULT_STORYBOARD: StoryboardSceneItem[] = [
  {
    id: 'sb-1',
    title: 'Apertura de contexto territorial',
    shotSize: 'Gran Plano General (ELS)',
    angle: 'Picado suave',
    movement: 'Crane Down lento',
    durationSec: 6,
    action: 'Niebla matinal disipándose sobre techos de teja y taller comunitario con luces cálidas encendidas.',
    lightingNote: 'Amanecer azul 6500K con contraste cálido interior 3200K',
  },
  {
    id: 'sb-2',
    title: 'Oficio en movimiento',
    shotSize: 'Plano Medio (MS)',
    angle: 'Normal (Eye Level)',
    movement: 'Tracking lateral suave',
    durationSec: 8,
    action: 'Artesana acomodando herramientas y piezas de cerámica húmeda sobre mesa de madera gastada.',
    lightingNote: 'Luz lateral natural de ventana 4800K, sombras suaves',
  },
  {
    id: 'sb-3',
    title: 'Detalle táctil de material',
    shotSize: 'Plano Detalle (Macro)',
    angle: 'Cenital 45°',
    movement: 'Dolly In sutil',
    durationSec: 5,
    action: 'Manos marcando textura mineral sobre arcilla fresca con polvo suspendido en el aire.',
    lightingNote: 'Luz rasante lateral con partículas iluminadas',
  },
];

// Color math helpers (pure client-side)
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 217, g: 119, b: 6 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const light = Math.max(0, Math.min(100, l)) / 100;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return rgbToHex(f(0), f(8), f(4));
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(hexA: string, hexB: string): string {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio.toFixed(2);
}

export const InteractiveCreativeLabs: React.FC<InteractiveCreativeLabsProps> = ({
  externalStoryboardScenes,
  onApplyToBuilder,
  onJumpToJsonLab,
  onOpenGallery,
  onOpenDirector,
  onOpenLibraryModule,
}) => {
  const [activeLab, setActiveLab] = useState<LabTabId>('comparator');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // ============================================================================
  // A. COMPARADOR VISUAL (Individual + Slider 2 capas + Grilla 2x2)
  // ============================================================================
  const [selectedCompIdx, setSelectedCompIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [compViewMode, setCompViewMode] = useState<'slider' | 'grid2x2' | 'individual'>('slider');
  const [activeIndividualIdx, setActiveIndividualIdx] = useState(0);
  const activeComp = COMPARATOR_TOPIC_SETS[selectedCompIdx] || COMPARATOR_TOPIC_SETS[0];
  const activeIndividualItem = activeComp.gridItems[activeIndividualIdx] || activeComp.gridItems[0];

  // ============================================================================
  // B. STORYBOARD & SHOT LIST
  // ============================================================================
  const [scenes, setScenes] = useState<StoryboardSceneItem[]>(() => {
    try {
      const saved = localStorage.getItem('nc_storyboard_v1');
      return saved ? JSON.parse(saved) : DEFAULT_STORYBOARD;
    } catch {
      return DEFAULT_STORYBOARD;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nc_storyboard_v1', JSON.stringify(scenes));
    } catch {
      // ignore storage errors
    }
  }, [scenes]);

  useEffect(() => {
    if (externalStoryboardScenes && externalStoryboardScenes.length > 0) {
      setScenes(externalStoryboardScenes);
      setActiveLab('storyboard');
    }
  }, [externalStoryboardScenes]);

  const totalDuration = useMemo(
    () => scenes.reduce((acc, s) => acc + (Number(s.durationSec) || 0), 0),
    [scenes]
  );

  const addScene = () => {
    setScenes((prev) => [
      ...prev,
      {
        id: `sb-${Date.now()}`,
        title: `Escena ${prev.length + 1}`,
        shotSize: 'Plano Medio (MS)',
        angle: 'Normal (Eye Level)',
        movement: 'Dolly In lento',
        durationSec: 5,
        action: 'Describe qué sucede en esta toma y cómo evoluciona el gesto o el espacio.',
        lightingNote: 'Luz lateral suave 4500K',
      },
    ]);
  };

  const updateScene = (id: string, patch: Partial<StoryboardSceneItem>) => {
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const moveScene = (idx: number, dir: -1 | 1) => {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= scenes.length) return;
    setScenes((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(nextIdx, 0, item);
      return copy;
    });
  };

  const removeScene = (id: string) => {
    setScenes((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  };

  const buildScenePrompt = (s: StoryboardSceneItem, idx: number) =>
    `Escena ${idx + 1} (${s.durationSec}s) — ${s.title}: ${s.action} Encuadre ${s.shotSize}, ángulo ${s.angle}, movimiento de cámara ${s.movement}, iluminación ${s.lightingNote}, 24fps cinematográfico.`;

  const exportStoryboard = (format: 'json' | 'txt') => {
    const content =
      format === 'json'
        ? JSON.stringify({ generator: 'Núcleo Colectivo · Storyboard Lab', totalDuration, scenes }, null, 2)
        : scenes
            .map(
              (s, i) =>
                `ESCENA ${i + 1}: ${s.title} (${s.durationSec}s)\nPlano: ${s.shotSize} | Ángulo: ${s.angle} | Movimiento: ${s.movement}\nLuz: ${s.lightingNote}\nPrompt: ${buildScenePrompt(s, i)}\n`
            )
            .join('\n---\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nucleo_storyboard_${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // C. LABORATORIO DE ILUMINACIÓN EN VIVO
  // ============================================================================
  const [lightSource, setLightSource] = useState<'Softbox difuso' | 'Fresnel duro' | 'Ventana natural' | 'Contraluz recorte'>('Softbox difuso');
  const [keyAngle, setKeyAngle] = useState(-45);
  const [kelvinTemp, setKelvinTemp] = useState(4400);
  const [fillIntensity, setFillIntensity] = useState(35);
  const [keyMood, setKeyMood] = useState<'Low Key' | 'Mid Key' | 'High Key'>('Mid Key');
  const [rimLight, setRimLight] = useState(true);

  const lightingFillLevel: DiagramConfig['fillLevel'] =
    fillIntensity < 15 ? 'none' : fillIntensity < 40 ? 'low' : fillIntensity < 75 ? 'medium' : 'high';

  const generatedLightingPrompt = useMemo(() => {
    const pos =
      Math.abs(keyAngle) <= 20
        ? 'frontal centrada'
        : keyAngle < -100 || keyAngle > 100
          ? 'trasera / contraluz'
          : keyAngle < 0
            ? `lateral izquierda a ${Math.abs(keyAngle)}°`
            : `lateral derecha a ${keyAngle}°`;
    const kelvinDesc =
      kelvinTemp <= 3600
        ? `cálida tungsteno (${kelvinTemp}K)`
        : kelvinTemp <= 5800
          ? `neutra calibrada (${kelvinTemp}K)`
          : `fría azulada (${kelvinTemp}K)`;
    return `Iluminación ${keyMood} con fuente principal tipo ${lightSource} ubicada en posición ${pos}, temperatura de color ${kelvinDesc}, relleno al ${fillIntensity}%${rimLight ? ' y luz de recorte trasera (rim light) separando la silueta del fondo' : ''}.`;
  }, [lightSource, keyAngle, kelvinTemp, fillIntensity, keyMood, rimLight]);

  const lightingOverlayStyle = useMemo(() => {
    // Visual shadow & warmth approximation for preview portrait
    const horizPct = 50 + (keyAngle / 135) * 42;
    const warmOpacity = kelvinTemp < 5000 ? ((5000 - kelvinTemp) / 2200) * 0.28 : 0;
    const coolOpacity = kelvinTemp > 5600 ? ((kelvinTemp - 5600) / 1900) * 0.28 : 0;
    const shadowDarkness = keyMood === 'Low Key' ? 0.72 : keyMood === 'Mid Key' ? 0.45 : 0.16;
    const effectiveShadow = Math.max(0.05, shadowDarkness * (1 - fillIntensity / 120));
    const softness = lightSource === 'Fresnel duro' ? '45%' : '80%';

    return {
      gradient: `radial-gradient(circle at ${horizPct}% 38%, rgba(255,245,220,0.14) 0%, rgba(12,10,9,${effectiveShadow.toFixed(2)}) ${softness})`,
      tint:
        warmOpacity > 0
          ? `rgba(245, 158, 11, ${warmOpacity.toFixed(2)})`
          : coolOpacity > 0
            ? `rgba(56, 189, 248, ${coolOpacity.toFixed(2)})`
            : 'transparent',
    };
  }, [keyAngle, kelvinTemp, fillIntensity, keyMood, lightSource]);

  // ============================================================================
  // D. CONSTRUCTOR DE MOVIMIENTOS DE CÁMARA (VIDEO)
  // ============================================================================
  const [motionCombo, setMotionCombo] = useState<'dolly-orbit' | 'tracking-rack' | 'crane-reveal' | 'static-subject' | 'steadicam-parallax'>('dolly-orbit');
  const [motionSpeed, setMotionSpeed] = useState<'Lento contemplativo' | 'Fluido natural' | 'Dinámico energético'>('Lento contemplativo');
  const [cameraFocal, setCameraFocal] = useState<number>(35);
  const [cameraShot, setCameraShot] = useState('Plano Medio (MS)');

  const motionMap: Record<string, { label: string; diagram: DiagramConfig['motionType']; promptText: string }> = {
    'dolly-orbit': {
      label: 'Dolly In + Orbit sutil',
      diagram: 'orbit',
      promptText: 'Smooth physical Dolly-In combined with a subtle orbital arc around the subject',
    },
    'tracking-rack': {
      label: 'Tracking lateral + Rack Focus',
      diagram: 'tracking',
      promptText: 'Stabilized lateral tracking shot with smooth rack focus shifting from foreground to subject',
    },
    'crane-reveal': {
      label: 'Drone / Crane Up + Reveal',
      diagram: 'crane-up',
      promptText: 'Majestic rising crane-up tilt movement revealing the surrounding architecture and landscape',
    },
    'static-subject': {
      label: 'Cámara fija en trípode + Sujeto en movimiento',
      diagram: 'static',
      promptText: 'Locked-off tripod camera keeping horizon perfectly still while subject and breeze move naturally',
    },
    'steadicam-parallax': {
      label: 'Steadicam + Parallax de profundidad',
      diagram: 'steadicam',
      promptText: 'Steadicam gliding past foreground pillars creating strong cinematic depth parallax',
    },
  };

  const generatedCameraPrompt = `${motionMap[motionCombo].promptText}. Cadence: ${motionSpeed}, shot size ${cameraShot}, focal length ${cameraFocal}mm cinema prime, 24fps, consistent geometry and natural physical inertia.`;

  // ============================================================================
  // E. EXPLORADOR DE PALETAS CROMÁTICAS & EXTRACTOR DE IMAGEN
  // ============================================================================
  const [baseHex, setBaseHex] = useState('#D97706');
  const [harmonyMode, setHarmonyMode] = useState<'complementarios' | 'analogos' | 'triada' | 'split'>('complementarios');
  const [extractedSwatches, setExtractedSwatches] = useState<string[]>([]);
  const [extractPreview, setExtractPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const computedPalette = useMemo(() => {
    const { r, g, b } = hexToRgb(baseHex);
    const { h, s, l } = rgbToHsl(r, g, b);
    if (harmonyMode === 'complementarios') {
      return [baseHex.toUpperCase(), hslToHex(h, Math.max(15, s - 25), Math.min(90, l + 28)), hslToHex(h + 180, s, l), hslToHex(h + 180, Math.max(15, s - 20), Math.max(15, l - 24))];
    }
    if (harmonyMode === 'analogos') {
      return [hslToHex(h - 30, s, l), baseHex.toUpperCase(), hslToHex(h + 30, s, l), hslToHex(h + 15, Math.max(15, s - 30), Math.max(18, l - 25))];
    }
    if (harmonyMode === 'triada') {
      return [baseHex.toUpperCase(), hslToHex(h + 120, s, l), hslToHex(h + 240, s, l), hslToHex(h, Math.max(10, s - 45), 18)];
    }
    return [baseHex.toUpperCase(), hslToHex(h + 150, s, l), hslToHex(h + 210, s, l), hslToHex(h, Math.max(10, s - 40), 92)];
  }, [baseHex, harmonyMode]);

  const activeSwatches = extractedSwatches.length > 0 ? extractedSwatches : computedPalette;

  const handleExtractColorsFromPhoto = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setExtractPreview(dataUrl);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Quantize to 32-step buckets to find 5 distinct dominant colors
        const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const qr = Math.round(r / 36) * 36;
          const qg = Math.round(g / 36) * 36;
          const qb = Math.round(b / 36) * 36;
          const key = `${qr},${qg},${qb}`;
          const prev = buckets.get(key);
          if (prev) {
            prev.r += r;
            prev.g += g;
            prev.b += b;
            prev.count += 1;
          } else {
            buckets.set(key, { r, g, b, count: 1 });
          }
        }
        const sorted = Array.from(buckets.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((item) => rgbToHex(item.r / item.count, item.g / item.count, item.b / item.count));

        if (sorted.length > 0) {
          setExtractedSwatches(sorted);
          setBaseHex(sorted[0]);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const colorPromptText = `Color grading palette based on ${activeSwatches.join(', ')} (${harmonyMode} harmony), balanced highlights, rich midtones, consistent filmic tone.`;

  return (
    <section
      id="laboratorios"
      className="py-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/30 transition-colors scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1.5">
              <span>SECCIÓN INTERACTIVA</span>
              <span aria-hidden="true" className="text-stone-400">/</span>
              <span>5 LABORATORIOS CREATIVOS + JSON</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Laboratorios de Experimentación Visual
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Practica en vivo antes de generar: compara parámetros lado a lado, diseña tu storyboard secuencial, simula ángulos de luz, combina movimientos de cámara y extrae paletas HEX reales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenGallery && (
              <button
                type="button"
                onClick={() => onOpenGallery('Todas')}
                className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <Images className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                <span>Galería</span>
              </button>
            )}
            {onOpenDirector && (
              <button
                type="button"
                onClick={onOpenDirector}
                className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <Clapperboard className="w-3.5 h-3.5 text-[#326BFF]" />
                <span>Director (8 Etapas)</span>
              </button>
            )}
            {onOpenLibraryModule && (
              <button
                type="button"
                onClick={() =>
                  onOpenLibraryModule(
                    activeLab === 'lighting'
                      ? 'mod-03'
                      : activeLab === 'camera'
                      ? 'mod-02'
                      : activeLab === 'color'
                      ? 'mod-04'
                      : activeLab === 'storyboard'
                      ? 'mod-08'
                      : 'mod-01'
                  )
                }
                className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Módulo Teórico</span>
              </button>
            )}
            <button
              type="button"
              onClick={onJumpToJsonLab}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 dark:bg-stone-800 text-amber-300 hover:bg-stone-800 rounded flex items-center gap-1.5 transition-colors"
            >
              <Braces className="w-3.5 h-3.5" />
              <span>Lab F · JSON Visual</span>
            </button>
          </div>
        </div>

        {/* 5 Sub-Lab Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
          {(
            [
              { id: 'comparator', label: 'A. Comparador Visual', icon: ArrowLeftRight },
              { id: 'storyboard', label: 'B. Storyboard & Shot List', icon: Clapperboard },
              { id: 'lighting', label: 'C. Lab. de Iluminación', icon: Sun },
              { id: 'camera', label: 'D. Cámara & Movimiento', icon: Video },
              { id: 'color', label: 'E. Paletas & Extractor Color', icon: Palette },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeLab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveLab(tab.id)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* SUB-LAB A: COMPARADOR VISUAL (SLIDER + GRILLA 2x2 + INDIVIDUAL)  */}
        {/* ================================================================ */}
        {activeLab === 'comparator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold font-serif-title text-stone-900 dark:text-stone-100">
                  Comparador Visual Interactivo
                </h3>
                <div className="inline-flex rounded border border-stone-200 dark:border-stone-800 overflow-hidden text-[11px] font-mono-code">
                  <button
                    type="button"
                    onClick={() => setCompViewMode('individual')}
                    className={`px-2.5 py-1 flex items-center gap-1 ${compViewMode === 'individual' ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-600 dark:text-stone-300'}`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Individual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompViewMode('slider')}
                    className={`px-2.5 py-1 flex items-center gap-1 border-x border-stone-200 dark:border-stone-800 ${compViewMode === 'slider' ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-600 dark:text-stone-300'}`}
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Antes/Después</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompViewMode('grid2x2')}
                    className={`px-2.5 py-1 flex items-center gap-1 ${compViewMode === 'grid2x2' ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-600 dark:text-stone-300'}`}
                  >
                    <LayoutGrid className="w-3 h-3" />
                    <span>Grilla 2×2</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {COMPARATOR_TOPIC_SETS.map((comp, idx) => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => {
                      setSelectedCompIdx(idx);
                      setActiveIndividualIdx(0);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedCompIdx === idx
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-400'
                        : 'bg-[#FAF8F5] dark:bg-stone-950 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono-code text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                      {comp.categoryLabel}
                    </div>
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 leading-snug">
                      {comp.title}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                      {comp.lesson}
                    </p>
                  </button>
                ))}
              </div>

              {/* Parameter Breakdown */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="text-[11px] font-mono-code uppercase font-bold text-stone-500">
                  Parámetros en Comparación ({activeComp.relatedModule})
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">{activeComp.leftItem.label}</span>
                    <span className="text-stone-600 dark:text-stone-400">{activeComp.leftItem.specs}</span>
                  </div>
                  <div>
                    <span className="font-bold text-amber-700 dark:text-amber-400 block">{activeComp.rightItem.label}</span>
                    <span className="text-stone-600 dark:text-stone-400">{activeComp.rightItem.specs}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {compViewMode === 'slider' && (
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-950 overflow-hidden shadow-sm">
                  <div className="relative h-80 sm:h-[430px] select-none overflow-hidden bg-stone-900">
                    {/* Right/Base Layer */}
                    <ResilientImage
                      src={activeComp.rightItem.image}
                      alt={activeComp.rightItem.alt}
                      objectPosition="top"
                      containerClassName="absolute inset-0 w-full h-full"
                      style={activeComp.rightItem.cssFilter ? { filter: activeComp.rightItem.cssFilter } : undefined}
                    />
                    {/* Left Clipped Layer */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                      <ResilientImage
                        src={activeComp.leftItem.image}
                        alt={activeComp.leftItem.alt}
                        objectPosition="top"
                        containerClassName="w-full h-full"
                        style={activeComp.leftItem.cssFilter ? { filter: activeComp.leftItem.cssFilter } : undefined}
                      />
                    </div>
                    <div
                      className="absolute inset-y-0 w-0.5 bg-amber-400 shadow-lg pointer-events-none"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-md font-bold text-xs">
                        ↔
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-stone-950/85 text-stone-100 text-[11px] font-mono-code">
                      {activeComp.leftItem.label}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-stone-950/85 text-amber-300 text-[11px] font-mono-code">
                      {activeComp.rightItem.label}
                    </div>
                  </div>
                  <div className="p-4 bg-stone-950 text-stone-200 flex items-center gap-4">
                    <span className="text-[11px] font-mono-code text-stone-400 shrink-0">Deslizar eje:</span>
                    <input
                      type="range"
                      min={5}
                      max={95}
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      aria-label="Control deslizante de comparación visual"
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <span className="text-xs font-mono-code text-amber-300 shrink-0">{sliderPos}%</span>
                  </div>
                </div>
              )}

              {compViewMode === 'grid2x2' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeComp.gridItems.map((cell) => (
                    <div
                      key={cell.code}
                      className="rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden"
                    >
                      <ResilientImage
                        src={cell.image}
                        alt={cell.alt}
                        aspectRatio={
                          activeComp.id === 'comp-four-lights' || activeComp.id === 'comp-ads-directions'
                            ? '3:4'
                            : '3:2'
                        }
                        objectPosition={cell.objectPosition || 'center'}
                        style={cell.cssFilter ? { filter: cell.cssFilter } : undefined}
                      />
                      <div className="p-3">
                        <div className="text-[10px] font-mono-code font-bold text-amber-700 dark:text-amber-400">
                          {cell.code}
                        </div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                          {cell.label}
                        </div>
                        <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                          {cell.specs}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {compViewMode === 'individual' && activeIndividualItem && (
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden shadow-sm">
                  <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex flex-wrap gap-1.5 bg-white dark:bg-stone-900">
                    {activeComp.gridItems.map((item, idx) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setActiveIndividualIdx(idx)}
                        className={`px-2.5 py-1.5 text-[11px] font-mono-code rounded border transition-colors ${
                          activeIndividualIdx === idx
                            ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                            : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-400'
                        }`}
                      >
                        {item.code}
                      </button>
                    ))}
                  </div>
                  <div className="bg-stone-900">
                    <ResilientImage
                      src={activeIndividualItem.image}
                      alt={activeIndividualItem.alt}
                      aspectRatio={
                        activeComp.id === 'comp-four-lights' || activeComp.id === 'comp-ads-directions'
                          ? '3:4'
                          : '3:2'
                      }
                      objectPosition={activeIndividualItem.objectPosition || 'center'}
                      containerClassName="max-h-[430px] mx-auto"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="text-[11px] font-mono-code uppercase font-bold text-amber-700 dark:text-amber-400">
                      {activeIndividualItem.code} · {activeComp.categoryLabel}
                    </div>
                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {activeIndividualItem.label}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {activeIndividualItem.specs} — {activeComp.lesson}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SUB-LAB B: GENERADOR DE STORYBOARD & SHOT LIST                   */}
        {/* ================================================================ */}
        {activeLab === 'storyboard' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold font-serif-title text-stone-900 dark:text-stone-100">
                  Constructor de Storyboard & Shot List
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {scenes.length} escenas planificadas · Duración total estimada: <strong>{totalDuration} segundos</strong>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={addScene}
                  className="px-3 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Escena</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportStoryboard('txt')}
                  className="px-3 py-1.5 text-xs font-mono-code font-semibold bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded flex items-center gap-1 hover:border-amber-500"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>.TXT</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportStoryboard('json')}
                  className="px-3 py-1.5 text-xs font-mono-code font-semibold bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded flex items-center gap-1 hover:border-amber-500"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>.JSON</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenes.map((scene, idx) => {
                const promptStr = buildScenePrompt(scene, idx);
                return (
                  <div
                    key={scene.id}
                    className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono-code font-bold text-amber-700 dark:text-amber-400">
                          ESCENA {String(idx + 1).padStart(2, '0')} · {scene.durationSec}s
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveScene(idx, -1)}
                            disabled={idx === 0}
                            aria-label="Mover escena arriba"
                            className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveScene(idx, 1)}
                            disabled={idx === scenes.length - 1}
                            aria-label="Mover escena abajo"
                            className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeScene(scene.id)}
                            disabled={scenes.length <= 1}
                            aria-label="Eliminar escena"
                            className="p-1 text-stone-400 hover:text-rose-600 disabled:opacity-30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={scene.title}
                        onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                        className="w-full text-sm font-bold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <select
                          value={scene.shotSize}
                          onChange={(e) => updateScene(scene.id, { shotSize: e.target.value })}
                          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2 py-1.5 text-stone-800 dark:text-stone-200"
                        >
                          <option>Gran Plano General (ELS)</option>
                          <option>Plano General (LS)</option>
                          <option>Plano Americano (3/4)</option>
                          <option>Plano Medio (MS)</option>
                          <option>Primer Plano (CU)</option>
                          <option>Plano Detalle (Macro)</option>
                        </select>
                        <select
                          value={scene.angle}
                          onChange={(e) => updateScene(scene.id, { angle: e.target.value })}
                          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2 py-1.5 text-stone-800 dark:text-stone-200"
                        >
                          <option>Normal (Eye Level)</option>
                          <option>Contrapicado (Low Angle)</option>
                          <option>Picado suave</option>
                          <option>Cenital 45°</option>
                          <option>Over the Shoulder (OTS)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <input
                          type="text"
                          value={scene.movement}
                          onChange={(e) => updateScene(scene.id, { movement: e.target.value })}
                          placeholder="Movimiento"
                          className="col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2 py-1.5 text-stone-800 dark:text-stone-200"
                        />
                        <input
                          type="number"
                          min={2}
                          max={30}
                          value={scene.durationSec}
                          onChange={(e) => updateScene(scene.id, { durationSec: Number(e.target.value) || 4 })}
                          aria-label="Duración en segundos"
                          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2 py-1.5 text-stone-800 dark:text-stone-200 font-mono-code"
                        />
                      </div>

                      <textarea
                        rows={3}
                        value={scene.action}
                        onChange={(e) => updateScene(scene.id, { action: e.target.value })}
                        className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded p-2 text-stone-700 dark:text-stone-300"
                      />

                      <input
                        type="text"
                        value={scene.lightingNote}
                        onChange={(e) => updateScene(scene.id, { lightingNote: e.target.value })}
                        placeholder="Nota de luz"
                        className="w-full text-[11px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2 py-1 text-stone-600 dark:text-stone-400"
                      />
                    </div>

                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(promptStr, scene.id)}
                        className="text-[11px] font-mono-code text-stone-700 dark:text-stone-300 hover:text-amber-600 flex items-center gap-1"
                      >
                        {copiedId === scene.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === scene.id ? 'Copiado' : 'Copiar Toma'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onApplyToBuilder(
                            {
                              mode: 'video',
                              subject: scene.action,
                              shotSize: scene.shotSize,
                              cameraAngle: scene.angle,
                              motion: scene.movement,
                              lighting: scene.lightingNote,
                              duration: `${scene.durationSec} segundos`,
                            },
                            true
                          )
                        }
                        className="px-2.5 py-1 text-[11px] font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Al Constructor</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SUB-LAB C: LABORATORIO DE ILUMINACIÓN EN VIVO                    */}
        {/* ================================================================ */}
        {activeLab === 'lighting' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4 p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              <h3 className="text-lg font-bold font-serif-title text-stone-900 dark:text-stone-100">
                Simulador Interactivo de Esquema de Luz
              </h3>

              <div>
                <label className="block text-[11px] font-mono-code uppercase text-stone-500 mb-1.5">
                  Modificador / Fuente Principal (Key Light)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Softbox difuso', 'Fresnel duro', 'Ventana natural', 'Contraluz recorte'] as const).map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setLightSource(src)}
                      className={`px-3 py-2 text-xs rounded border text-left transition-colors ${
                        lightSource === src
                          ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[11px] font-mono-code text-stone-600 dark:text-stone-400 mb-1">
                    <span>Ángulo Key Light</span>
                    <strong className="text-amber-700 dark:text-amber-400">{keyAngle}°</strong>
                  </div>
                  <input
                    type="range"
                    min={-135}
                    max={135}
                    step={5}
                    value={keyAngle}
                    onChange={(e) => setKeyAngle(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono-code text-stone-600 dark:text-stone-400 mb-1">
                    <span>Temperatura Kelvin</span>
                    <strong className="text-amber-700 dark:text-amber-400">{kelvinTemp}K</strong>
                  </div>
                  <input
                    type="range"
                    min={2800}
                    max={7500}
                    step={100}
                    value={kelvinTemp}
                    onChange={(e) => setKelvinTemp(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="flex justify-between text-[11px] font-mono-code text-stone-600 dark:text-stone-400 mb-1">
                    <span>Intensidad de Relleno (Fill)</span>
                    <strong className="text-amber-700 dark:text-amber-400">{fillIntensity}%</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={fillIntensity}
                    onChange={(e) => setFillIntensity(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1">
                    {(['Low Key', 'Mid Key', 'High Key'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setKeyMood(m)}
                        className={`px-2 py-1 text-[11px] font-mono-code rounded border ${
                          keyMood === m
                            ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 font-bold'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-mono-code text-stone-700 dark:text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rimLight}
                      onChange={(e) => setRimLight(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>Rim</span>
                  </label>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-950 text-stone-200 space-y-2">
                <div className="text-[11px] font-mono-code text-amber-400 uppercase font-bold">
                  Instrucción de Iluminación Resultante
                </div>
                <p className="text-xs leading-relaxed text-stone-300">{generatedLightingPrompt}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedLightingPrompt, 'light-prompt')}
                    className="px-3 py-1.5 text-xs font-mono-code bg-stone-800 hover:bg-stone-700 rounded flex items-center gap-1"
                  >
                    {copiedId === 'light-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Luz</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onApplyToBuilder(
                        {
                          lighting: generatedLightingPrompt,
                          temperature: `${kelvinTemp}K`,
                        },
                        true
                      )
                    }
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Aplicar al Constructor</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-950 min-h-[300px]">
                <ResilientImage
                  src={VISUAL_LIBRARY_PATHS.lightButterfly}
                  alt="Retrato de estudio para simular dirección e intensidad de iluminación"
                  objectPosition="top"
                  containerClassName="w-full h-full min-h-[300px]"
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-200"
                  style={{ background: lightingOverlayStyle.gradient }}
                />
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-color transition-colors duration-200"
                  style={{ backgroundColor: lightingOverlayStyle.tint }}
                />
                {rimLight && (
                  <div className="absolute inset-y-4 right-2 w-1.5 rounded-full bg-sky-300/60 blur-xs pointer-events-none" />
                )}
                <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-stone-950/85 text-[11px] font-mono-code text-stone-100 flex justify-between">
                  <span>{keyMood}</span>
                  <span className="text-amber-300">{keyAngle}° · {kelvinTemp}K</span>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3">
                <TechnicalDiagramSVG
                  type="lighting"
                  config={{ keyAngle, fillLevel: lightingFillLevel, rimActive: rimLight }}
                />
                <div className="p-3.5 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
                  <strong className="text-stone-900 dark:text-stone-100 block mb-1">Lectura de Taller:</strong>
                  Un ángulo de <strong>-45° con relleno bajo (&lt;35%)</strong> produce volumen clásico tipo Rembrandt; elevar el relleno a <strong>80%</strong> suaviza sombras hacia estética editorial limpia.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SUB-LAB D: CONSTRUCTOR DE MOVIMIENTOS DE CÁMARA (VIDEO)          */}
        {/* ================================================================ */}
        {activeLab === 'camera' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4 p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              <h3 className="text-lg font-bold font-serif-title text-stone-900 dark:text-stone-100">
                Combinador de Movimientos de Cámara y Óptica
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(motionMap).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMotionCombo(key as any)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      motionCombo === key
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{val.label}</div>
                    <div className={`text-[11px] mt-0.5 ${motionCombo === key ? 'text-stone-800' : 'text-stone-500'}`}>
                      {val.promptText.slice(0, 62)}...
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-mono-code text-stone-500 mb-1">Velocidad</label>
                  <select
                    value={motionSpeed}
                    onChange={(e) => setMotionSpeed(e.target.value as any)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2.5 py-2"
                  >
                    <option>Lento contemplativo</option>
                    <option>Fluido natural</option>
                    <option>Dinámico energético</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                    Focal ({cameraFocal}mm)
                  </label>
                  <input
                    type="range"
                    min={14}
                    max={135}
                    step={5}
                    value={cameraFocal}
                    onChange={(e) => setCameraFocal(Number(e.target.value))}
                    className="w-full accent-amber-500 mt-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-code text-stone-500 mb-1">Plano</label>
                  <select
                    value={cameraShot}
                    onChange={(e) => setCameraShot(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2.5 py-2"
                  >
                    <option>Gran Plano General (ELS)</option>
                    <option>Plano General (LS)</option>
                    <option>Plano Medio (MS)</option>
                    <option>Primer Plano (CU)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-950 text-stone-200 space-y-2">
                <div className="text-[11px] font-mono-code text-amber-400 uppercase font-bold">
                  Prompt de Dirección de Cámara
                </div>
                <p className="text-xs font-mono-code text-stone-300 leading-relaxed">{generatedCameraPrompt}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedCameraPrompt, 'cam-prompt')}
                    className="px-3 py-1.5 text-xs font-mono-code bg-stone-800 hover:bg-stone-700 rounded flex items-center gap-1"
                  >
                    {copiedId === 'cam-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onApplyToBuilder(
                        {
                          mode: 'video',
                          motion: motionMap[motionCombo].promptText,
                          lens: `${cameraFocal}mm cinema prime lens`,
                          shotSize: cameraShot,
                        },
                        true
                      )
                    }
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar al Constructor (Video)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <TechnicalDiagramSVG type="camera-motion" config={{ motionType: motionMap[motionCombo].diagram }} />
              <TechnicalDiagramSVG type="lens-fov" config={{ focalMm: cameraFocal }} />
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SUB-LAB E: EXPLORADOR DE PALETAS Y EXTRACTOR DESDE FOTO          */}
        {/* ================================================================ */}
        {activeLab === 'color' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4 p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              <h3 className="text-lg font-bold font-serif-title text-stone-900 dark:text-stone-100">
                Armonías Cromáticas, Contraste y Extractor desde Foto
              </h3>

              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-[11px] font-mono-code text-stone-500 mb-1">Color Base (HEX)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={baseHex}
                      onChange={(e) => {
                        setExtractedSwatches([]);
                        setBaseHex(e.target.value);
                      }}
                      className="w-10 h-10 rounded border border-stone-300 cursor-pointer"
                    />
                    <span className="text-xs font-mono-code font-bold text-stone-800 dark:text-stone-200">
                      {baseHex.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[11px] font-mono-code text-stone-500 mb-1">Regla de Armonía</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        { id: 'complementarios', label: 'Complementarios' },
                        { id: 'analogos', label: 'Análogos' },
                        { id: 'triada', label: 'Tríada' },
                        { id: 'split', label: 'Split' },
                      ] as const
                    ).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          setExtractedSwatches([]);
                          setHarmonyMode(h.id);
                        }}
                        className={`px-2.5 py-1.5 text-xs rounded border ${
                          harmonyMode === h.id && extractedSwatches.length === 0
                            ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Upload Color Extractor */}
              <div className="p-3.5 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {extractPreview && (
                    <img src={extractPreview} alt="Referencia cromática" className="w-12 h-12 rounded object-cover border border-stone-200" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Extraer paleta dominante desde tu fotografía
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Procesamiento local inmediato en Canvas sin subir a la nube
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleExtractColorsFromPhoto(e.target.files[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 rounded flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Imagen</span>
                </button>
              </div>

              {/* WCAG Contrast Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] font-mono-code text-stone-500 block">Contraste vs Blanco (#FAF8F5)</span>
                  <strong className="text-sm text-stone-900 dark:text-stone-100">{contrastRatio(baseHex, '#FAF8F5')}:1</strong>
                </div>
                <div className="p-3 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] font-mono-code text-stone-500 block">Contraste vs Negro (#1C1917)</span>
                  <strong className="text-sm text-stone-900 dark:text-stone-100">{contrastRatio(baseHex, '#1C1917')}:1</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {activeSwatches.map((hex) => {
                  const rgb = hexToRgb(hex);
                  return (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => handleCopy(hex, hex)}
                      className="rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden text-left hover:border-amber-500 transition-colors"
                      title="Clic para copiar HEX"
                    >
                      <div className="h-24 w-full" style={{ backgroundColor: hex }} />
                      <div className="p-2">
                        <div className="text-xs font-mono-code font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                          <span>{hex}</span>
                          {copiedId === hex && <Check className="w-3 h-3 text-emerald-600" />}
                        </div>
                        <div className="text-[10px] font-mono-code text-stone-500">
                          {rgb.r}, {rgb.g}, {rgb.b}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-stone-950 text-stone-200 space-y-2.5">
                <div className="text-[11px] font-mono-code text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prompt de Colorimetría Aplicable</span>
                </div>
                <p className="text-xs font-mono-code text-stone-300 leading-relaxed">{colorPromptText}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(colorPromptText, 'color-prompt')}
                    className="px-3 py-1.5 text-xs font-mono-code bg-stone-800 hover:bg-stone-700 rounded flex items-center gap-1"
                  >
                    {copiedId === 'color-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Paleta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onApplyToBuilder({ colorPalette: colorPromptText }, true)}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Aplicar al Constructor</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
