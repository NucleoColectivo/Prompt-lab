import React, { useMemo, useState } from 'react';
import {
  Check,
  Compass,
  Copy,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Sliders,
  Sparkles,
  Sun,
  Wand2,
} from 'lucide-react';
import { VISUAL_LIBRARY_PATHS } from '../../data/visualLibraryRegistry';
import { STUDIO_MEDIA_ASSETS } from '../../data/creativeStudiosData';
import type { PromptBuilderState } from '../PromptBuilder';
import { ThreePointLightingOverlay } from './ThreePointLightingOverlay';

interface LightingSimulatorLabProps {
  onApplyToBuilder: (patch: Partial<PromptBuilderState>) => void;
}

type GlobalIntensity = 'low-key' | 'mid-key' | 'high-key';
type ShadowQuality = 'suave' | 'media' | 'dura';
type DiffuserType =
  | 'directa'
  | 'softbox'
  | 'octabox'
  | 'paraguas'
  | 'scrim-bandera'
  | 'ventana-natural';

export interface LightingRigState {
  keyAngle: number; // -135 to 135 deg (0 = front, -45 = left 45°, 90 = right side)
  keyIntensity: number; // 0..100
  fillIntensity: number; // 0..100
  rimEnabled: boolean;
  rimIntensity: number; // 0..100
  sideEnabled: boolean;
  sideDirection: 'izquierda' | 'derecha';
  sideIntensity: number; // 0..100
  topEnabled: boolean;
  topIntensity: number; // 0..100
  kelvin: number; // 2700..8000
  globalIntensity: GlobalIntensity;
  shadowQuality: ShadowQuality;
  diffuser: DiffuserType;
}

export interface LightingPreset {
  name: string;
  tag: string;
  threePointNote: string;
  state: LightingRigState;
}

const SUBJECT_PRESETS = [
  {
    id: 'portrait',
    label: 'Retrato editorial',
    image: VISUAL_LIBRARY_PATHS.lightButterfly,
    subjectEs: 'retrato editorial en primer plano',
    subjectEn: 'editorial close-up portrait',
  },
  {
    id: 'product',
    label: 'Bodegón / Producto',
    image: STUDIO_MEDIA_ASSETS.productCommerceStudio,
    subjectEs: 'bodegón publicitario de producto de autor',
    subjectEn: 'artisanal studio product still life',
  },
  {
    id: 'cinema',
    label: 'Escena cinematográfica',
    image: VISUAL_LIBRARY_PATHS.colorTealOrange,
    subjectEs: 'escena narrativa cinematográfica',
    subjectEn: 'cinematic narrative film still',
  },
] as const;

const DIFFUSER_OPTIONS: { id: DiffuserType; label: string; en: string; blurFactor: number; tip: string }[] = [
  {
    id: 'directa',
    label: 'Sin difusor (directa)',
    en: 'bare direct hard light without diffusion',
    blurFactor: 0.25,
    tip: 'Sombras muy recortadas, microcontraste agresivo y brillos especulares marcados.',
  },
  {
    id: 'softbox',
    label: 'Softbox grande',
    en: 'large rectangular studio softbox',
    blurFactor: 0.78,
    tip: 'Transición gradual y controlada ideal para retrato editorial y producto.',
  },
  {
    id: 'octabox',
    label: 'Octabox envolvente',
    en: 'large wrap-around octabox with circular catchlight',
    blurFactor: 0.85,
    tip: 'Luz envolvente con reflejo redondo natural en los ojos (catchlight).',
  },
  {
    id: 'paraguas',
    label: 'Paraguas traslúcido',
    en: 'shoot-through translucent umbrella',
    blurFactor: 0.72,
    tip: 'Dispersión amplia que levanta también el ambiente del fondo.',
  },
  {
    id: 'scrim-bandera',
    label: 'Scrim + Bandera negra',
    en: 'silk scrim diffusion paired with negative fill black flags',
    blurFactor: 0.65,
    tip: 'Control cinematográfico: suaviza altas luces y profundiza el lado de sombra.',
  },
  {
    id: 'ventana-natural',
    label: 'Ventana natural difusa',
    en: 'soft north-facing diffused window daylight',
    blurFactor: 0.82,
    tip: 'Caída orgánica y dirección pictórica sin sensación de estudio artificial.',
  },
];

const LIGHTING_PRESETS: LightingPreset[] = [
  {
    name: '3 Puntos Estándar',
    tag: 'Key 45° + Fill + Back',
    threePointNote:
      'Esquema base de cine y retrato: Key Light a -45° (85%) define el volumen, Fill opuesto al 42% suaviza las sombras con ratio equilibrado (~3:1) y Back Light al 60% recorta hombros y cabello del fondo.',
    state: {
      keyAngle: -45,
      keyIntensity: 85,
      fillIntensity: 42,
      rimEnabled: true,
      rimIntensity: 60,
      sideEnabled: false,
      sideDirection: 'derecha',
      sideIntensity: 0,
      topEnabled: false,
      topIntensity: 0,
      kelvin: 5200,
      globalIntensity: 'mid-key',
      shadowQuality: 'suave',
      diffuser: 'softbox',
    },
  },
  {
    name: 'Rembrandt Clásico',
    tag: '45° + triángulo facial',
    threePointNote:
      'Key Light oblicua a -45° (84%) con Fill reducido al 26% para crear un ratio dramático (~4.2:1) y el característico triángulo de luz en la mejilla sombreada, más un contraluz sutil al 45%.',
    state: {
      keyAngle: -45,
      keyIntensity: 84,
      fillIntensity: 26,
      rimEnabled: true,
      rimIntensity: 45,
      sideEnabled: false,
      sideDirection: 'derecha',
      sideIntensity: 0,
      topEnabled: false,
      topIntensity: 0,
      kelvin: 4600,
      globalIntensity: 'mid-key',
      shadowQuality: 'media',
      diffuser: 'softbox',
    },
  },
  {
    name: 'Butterfly Editorial',
    tag: 'Frontal elevada + relleno',
    threePointNote:
      'Key Light frontal sobre el eje de cámara (0°, 88%) apoyada por un Fill generoso (56%) y leve luz superior para una sombra simétrica bajo la nariz y piel editorial limpia.',
    state: {
      keyAngle: 0,
      keyIntensity: 88,
      fillIntensity: 56,
      rimEnabled: true,
      rimIntensity: 35,
      sideEnabled: false,
      sideDirection: 'derecha',
      sideIntensity: 0,
      topEnabled: true,
      topIntensity: 32,
      kelvin: 5500,
      globalIntensity: 'mid-key',
      shadowQuality: 'suave',
      diffuser: 'octabox',
    },
  },
  {
    name: 'Split Lateral 90°',
    tag: 'Mitad luz / mitad sombra',
    threePointNote:
      'Key Light desplazada a -90° lateral puro (92%) con Fill mínimo (10%) y contraluz apagado: divide el rostro en una mitad iluminada y otra en penumbra escultórica.',
    state: {
      keyAngle: -90,
      keyIntensity: 92,
      fillIntensity: 10,
      rimEnabled: false,
      rimIntensity: 0,
      sideEnabled: true,
      sideDirection: 'izquierda',
      sideIntensity: 82,
      topEnabled: false,
      topIntensity: 0,
      kelvin: 4200,
      globalIntensity: 'low-key',
      shadowQuality: 'dura',
      diffuser: 'scrim-bandera',
    },
  },
  {
    name: 'Contraluz Silueta',
    tag: 'Borde luminoso dramático',
    threePointNote:
      'Invierte la jerarquía clásica: el Back / Rim Light lidera al 96% recortando un halo brillante alrededor del sujeto, mientras Key (30%) y Fill (14%) mantienen el frente en clave baja.',
    state: {
      keyAngle: -30,
      keyIntensity: 30,
      fillIntensity: 14,
      rimEnabled: true,
      rimIntensity: 96,
      sideEnabled: true,
      sideDirection: 'derecha',
      sideIntensity: 48,
      topEnabled: false,
      topIntensity: 0,
      kelvin: 3400,
      globalIntensity: 'low-key',
      shadowQuality: 'dura',
      diffuser: 'directa',
    },
  },
  {
    name: 'High Key Moda',
    tag: 'Envolvente sin sombras duras',
    threePointNote:
      'Key Light potente (94%) casi igualada por un Fill muy alto (84%, ratio ~2.1:1) y Back Light al 55%: elimina sombras densas y genera una atmósfera brillante y comercial.',
    state: {
      keyAngle: 15,
      keyIntensity: 94,
      fillIntensity: 84,
      rimEnabled: true,
      rimIntensity: 55,
      sideEnabled: false,
      sideDirection: 'izquierda',
      sideIntensity: 0,
      topEnabled: true,
      topIntensity: 45,
      kelvin: 5800,
      globalIntensity: 'high-key',
      shadowQuality: 'suave',
      diffuser: 'paraguas',
    },
  },
  {
    name: 'Cenital Neo-Noir',
    tag: 'Luz superior + volumen frío',
    threePointNote:
      'Combina Key suave a +25° (48%) y Fill mínimo (12%) con luz cenital dominante (90%) y Back Light frío (62%, 6800K) para atmósferas nocturnas de alto contraste.',
    state: {
      keyAngle: 25,
      keyIntensity: 48,
      fillIntensity: 12,
      rimEnabled: true,
      rimIntensity: 62,
      sideEnabled: false,
      sideDirection: 'derecha',
      sideIntensity: 0,
      topEnabled: true,
      topIntensity: 90,
      kelvin: 6800,
      globalIntensity: 'low-key',
      shadowQuality: 'dura',
      diffuser: 'directa',
    },
  },
];

function kelvinToColor(k: number): { hex: string; labelEs: string; labelEn: string } {
  if (k <= 3200) return { hex: '#FFAA4C', labelEs: 'Tungsteno cálido', labelEn: 'warm tungsten golden glow' };
  if (k <= 4300) return { hex: '#FFD08A', labelEs: 'Hora dorada / halógeno', labelEn: 'warm golden hour balance' };
  if (k <= 5800) return { hex: '#FFF6E8', labelEs: 'Luz día neutra', labelEn: 'neutral daylight balanced' };
  if (k <= 6800) return { hex: '#CFE4FF', labelEs: 'Sombra nublada fría', labelEn: 'cool overcast daylight' };
  return { hex: '#8CC0FF', labelEs: 'Azul ártico / nocturno', labelEn: 'deep cool arctic blue' };
}

function describeAngle(angle: number): { es: string; en: string } {
  const abs = Math.abs(angle);
  const sideEs = angle < -10 ? 'izquierda' : angle > 10 ? 'derecha' : 'frontal';
  const sideEn = angle < -10 ? 'camera-left' : angle > 10 ? 'camera-right' : 'frontal';
  if (abs <= 15) return { es: 'frontal centrada', en: 'centered frontal' };
  if (abs <= 55) return { es: `oblicua a ${abs}° (${sideEs})`, en: `45-degree ${sideEn} three-quarter` };
  if (abs <= 105) return { es: `lateral a ${abs}° (${sideEs})`, en: `90-degree ${sideEn} side` };
  return { es: `trasera lateral a ${abs}° (${sideEs})`, en: `${abs}-degree rear-${sideEn}` };
}

export const LightingSimulatorLab: React.FC<LightingSimulatorLabProps> = ({
  onApplyToBuilder,
}) => {
  const [rig, setRig] = useState<LightingRigState>(LIGHTING_PRESETS[0].state);
  const [activePresetName, setActivePresetName] = useState<string | null>(LIGHTING_PRESETS[0].name);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [autoOpenOverlay, setAutoOpenOverlay] = useState(true);
  const [subjectId, setSubjectId] = useState<(typeof SUBJECT_PRESETS)[number]['id']>('portrait');
  const [promptLang, setPromptLang] = useState<'es' | 'en'>('es');
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (preset: LightingPreset, shouldOpenOverlay = autoOpenOverlay) => {
    setRig(preset.state);
    setActivePresetName(preset.name);
    if (shouldOpenOverlay) {
      setIsOverlayOpen(true);
    }
  };

  const activeSubject = SUBJECT_PRESETS.find((s) => s.id === subjectId) || SUBJECT_PRESETS[0];
  const activeDiffuser = DIFFUSER_OPTIONS.find((d) => d.id === rig.diffuser) || DIFFUSER_OPTIONS[1];
  const kelvinInfo = useMemo(() => kelvinToColor(rig.kelvin), [rig.kelvin]);
  const angleInfo = useMemo(() => describeAngle(rig.keyAngle), [rig.keyAngle]);

  const contrastRatio = useMemo(() => {
    const key = Math.max(10, rig.keyIntensity);
    const fill = Math.max(8, rig.fillIntensity);
    const ratio = Math.max(1, Number(((key + fill) / fill).toFixed(1)));
    return `${ratio}:1`;
  }, [rig.keyIntensity, rig.fillIntensity]);

  // Overhead SVG coordinates for key light (center = 120, 110; radius = 78; camera at bottom 120, 198)
  const keyCoords = useMemo(() => {
    // 0 deg = bottom (camera direction, +90 deg in math), -90 = left (180 deg), +90 = right (0 deg)
    const rad = ((90 - rig.keyAngle) * Math.PI) / 180;
    const x = 120 + Math.cos(rad) * 76;
    const y = 110 + Math.sin(rad) * 76;
    return { x, y };
  }, [rig.keyAngle]);

  // Visual preview overlay math
  const previewStyles = useMemo(() => {
    const xPct = Math.max(5, Math.min(95, 50 + (rig.keyAngle / 110) * 44));
    const yPct = rig.topEnabled ? 18 : 34;
    const keyAlpha = (rig.keyIntensity / 100) * 0.58;
    const shadowAlpha =
      rig.shadowQuality === 'dura'
        ? Math.max(0.18, 0.72 - (rig.fillIntensity / 100) * 0.52)
        : rig.shadowQuality === 'media'
        ? Math.max(0.12, 0.55 - (rig.fillIntensity / 100) * 0.42)
        : Math.max(0.06, 0.34 - (rig.fillIntensity / 100) * 0.28);

    const baseBrightness =
      rig.globalIntensity === 'high-key' ? 1.14 : rig.globalIntensity === 'low-key' ? 0.76 : 0.98;
    const baseContrast =
      rig.shadowQuality === 'dura' ? 1.2 : rig.shadowQuality === 'media' ? 1.07 : 0.96;

    const shadowSideX = rig.keyAngle <= 0 ? '92%' : '8%';
    const spread = Math.round(45 + activeDiffuser.blurFactor * 36);

    return {
      filter: `brightness(${baseBrightness}) contrast(${baseContrast})`,
      keyGradient: `radial-gradient(circle at ${xPct}% ${yPct}%, ${kelvinInfo.hex}${Math.round(
        keyAlpha * 255
      )
        .toString(16)
        .padStart(2, '0')} 0%, transparent ${spread}%)`,
      shadowGradient: `linear-gradient(${
        rig.keyAngle <= 0 ? '90deg' : '270deg'
      }, transparent 25%, rgba(8, 10, 16, ${shadowAlpha.toFixed(2)}) 100%)`,
      rimShadow: rig.rimEnabled
        ? `inset 0 18px 42px -12px rgba(255, 245, 220, ${(rig.rimIntensity / 100) * 0.85})`
        : 'none',
      sideGradient: rig.sideEnabled
        ? `linear-gradient(${
            rig.sideDirection === 'izquierda' ? '90deg' : '270deg'
          }, rgba(130, 185, 255, ${((rig.sideIntensity / 100) * 0.48).toFixed(2)}) 0%, transparent 48%)`
        : 'none',
      topGradient: rig.topEnabled
        ? `radial-gradient(ellipse at 50% 0%, rgba(255, 250, 238, ${((rig.topIntensity / 100) * 0.56).toFixed(
            2
          )}) 0%, transparent 62%)`
        : 'none',
      shadowSideX,
    };
  }, [rig, activeDiffuser.blurFactor, kelvinInfo.hex]);

  const generatedPrompts = useMemo(() => {
    const keyDescEs = `luz principal ${angleInfo.es} al ${rig.keyIntensity}% con ${activeDiffuser.label.toLowerCase()}`;
    const fillDescEs = `luz de relleno al ${rig.fillIntensity}% (ratio ${contrastRatio})`;
    const extrasEs: string[] = [];
    if (rig.rimEnabled && rig.rimIntensity > 0) extrasEs.push(`contraluz de recorte al ${rig.rimIntensity}%`);
    if (rig.sideEnabled && rig.sideIntensity > 0)
      extrasEs.push(`luz lateral ${rig.sideDirection} al ${rig.sideIntensity}%`);
    if (rig.topEnabled && rig.topIntensity > 0) extrasEs.push(`luz cenital superior al ${rig.topIntensity}%`);

    const intensityEs =
      rig.globalIntensity === 'low-key'
        ? 'exposición en clave baja (Low Key) con sombras profundas'
        : rig.globalIntensity === 'high-key'
        ? 'exposición en clave alta (High Key) luminosa y limpia'
        : 'exposición en clave media equilibrada';

    const shadowEs =
      rig.shadowQuality === 'suave'
        ? 'sombras suaves de transición larga'
        : rig.shadowQuality === 'dura'
        ? 'sombras duras y recortadas de alto contraste'
        : 'sombras medias bien modeladas';

    const es = `Esquema de iluminación de estudio para ${activeSubject.subjectEs}: ${keyDescEs}, ${fillDescEs}${
      extrasEs.length > 0 ? `, ${extrasEs.join(', ')}` : ''
    }. Temperatura de color ${rig.kelvin}K (${kelvinInfo.labelEs}), ${intensityEs}, ${shadowEs}.`;

    const extrasEn: string[] = [];
    if (rig.rimEnabled && rig.rimIntensity > 0) extrasEn.push(`rim backlight separation at ${rig.rimIntensity}%`);
    if (rig.sideEnabled && rig.sideIntensity > 0)
      extrasEn.push(`${rig.sideDirection === 'izquierda' ? 'left' : 'right'} side kicker light at ${rig.sideIntensity}%`);
    if (rig.topEnabled && rig.topIntensity > 0) extrasEn.push(`overhead top light at ${rig.topIntensity}%`);

    const intensityEn =
      rig.globalIntensity === 'low-key'
        ? 'low-key chiaroscuro exposure'
        : rig.globalIntensity === 'high-key'
        ? 'high-key airy luminous exposure'
        : 'balanced mid-key editorial exposure';

    const shadowEn =
      rig.shadowQuality === 'suave'
        ? 'soft gradual shadow roll-off'
        : rig.shadowQuality === 'dura'
        ? 'crisp hard-edged dramatic shadows'
        : 'sculpted medium-contrast shadows';

    const en = `Studio lighting setup for ${activeSubject.subjectEn}: ${angleInfo.en} key light (${rig.keyIntensity}%) modified with ${activeDiffuser.en}, fill light at ${rig.fillIntensity}% (${contrastRatio} contrast ratio)${
      extrasEn.length > 0 ? `, ${extrasEn.join(', ')}` : ''
    }, ${rig.kelvin}K ${kelvinInfo.labelEn}, ${intensityEn}, ${shadowEn}.`;

    return { es, en };
  }, [rig, angleInfo, activeDiffuser, contrastRatio, activeSubject, kelvinInfo]);

  const activePrompt = promptLang === 'es' ? generatedPrompts.es : generatedPrompts.en;

  const handleCopy = () => {
    navigator.clipboard.writeText(activePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleApplyToBuilder = () => {
    onApplyToBuilder({
      lighting: generatedPrompts.en,
      temperature: `${rig.kelvin}K · ${kelvinInfo.labelEs}`,
      atmosphere:
        rig.globalIntensity === 'low-key'
          ? 'Atmósfera dramática en clave baja con volumen escultórico'
          : rig.globalIntensity === 'high-key'
          ? 'Atmósfera luminosa en clave alta y limpia'
          : 'Atmósfera editorial equilibrada con modelado natural',
      customNotes: `Simulador de Iluminación · ${rig.kelvin}K · Ratio ${contrastRatio}`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#326BFF] dark:text-[#8FB0FF] font-semibold mb-2">
              <Sun className="w-3.5 h-3.5" />
              <span>Laboratorio Educativo · Simulador de Iluminación</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#101014] dark:text-[#F4F2ED] tracking-tight leading-tight">
              Comprende cómo cada fuente de luz transforma la imagen y el prompt.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-black/65 dark:text-white/65 leading-relaxed">
              Ajusta luz principal, relleno, contraluz, lateral, cenital, temperatura Kelvin, intensidad, sombras y difusores. Observa el esquema cenital de estudio y transfiere la fórmula exacta al Constructor Modular.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setIsOverlayOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] text-xs font-mono uppercase tracking-wider font-bold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5" />
              Overlay 3 Puntos
            </button>
            <button
              type="button"
              onClick={() => {
                setRig(LIGHTING_PRESETS[0].state);
                setActivePresetName(LIGHTING_PRESETS[0].name);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#F4F2ED] dark:bg-white/5 text-xs font-mono uppercase tracking-wider font-semibold text-[#101014] dark:text-[#F4F2ED] hover:border-black/35 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer esquema
            </button>
          </div>
        </div>

        {/* Classic Presets */}
        <div className="mt-6 pt-5 border-t border-black/10 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
              Esquemas clásicos de estudio (1 clic abre diagrama 3 puntos y sliders)
            </div>
            <label className="inline-flex items-center gap-2 text-[11px] font-mono text-black/65 dark:text-white/65 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoOpenOverlay}
                onChange={(e) => setAutoOpenOverlay(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#326BFF]"
              />
              Abrir overlay 3 puntos al elegir esquema
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {LIGHTING_PRESETS.map((preset) => {
              const isSelected = activePresetName === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#F8C300] bg-[#F8C300]/15 dark:bg-[#F8C300]/20'
                      : 'border-black/10 dark:border-white/10 bg-[#F4F2ED]/70 dark:bg-white/[0.03] hover:border-[#F8C300] hover:bg-[#F8C300]/10'
                  }`}
                >
                  <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] truncate">
                    {preset.name}
                  </div>
                  <div className="font-mono text-[10px] text-black/55 dark:text-white/55 truncate mt-0.5">
                    {preset.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Split: Preview + Diagram (Left 6) / 9 Parameters Controls (Right 6) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Visual Simulator + Overhead SVG + Prompt Output */}
        <div className="xl:col-span-6 space-y-6 xl:sticky xl:top-24">
          <div className="rounded-3xl bg-[#101014] text-[#F4F2ED] border border-white/10 p-5 space-y-4 shadow-lg">
            {/* Subject Switcher + Live Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10">
                {SUBJECT_PRESETS.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSubjectId(sub.id)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                      subjectId === sub.id
                        ? 'bg-[#F8C300] text-[#101014] font-bold'
                        : 'text-white/65 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-white/75">
                <span>Ratio {contrastRatio}</span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: kelvinInfo.hex }}
                  />
                  {rig.kelvin}K
                </span>
              </div>
            </div>

            {/* Visual Preview + Overhead Diagram side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
              {/* Interactive Photo Simulation */}
              <div className="sm:col-span-7 relative rounded-2xl overflow-hidden border border-white/15 bg-black aspect-[4/5] sm:aspect-auto sm:min-h-[300px]">
                <img
                  src={activeSubject.image}
                  alt={activeSubject.label}
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: previewStyles.filter }}
                />
                {/* Directional Shadow Falloff */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300"
                  style={{ background: previewStyles.shadowGradient }}
                />
                {/* Key Light Cast */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-300"
                  style={{ background: previewStyles.keyGradient }}
                />
                {/* Side Light Overlay */}
                {rig.sideEnabled && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-300"
                    style={{ background: previewStyles.sideGradient }}
                  />
                )}
                {/* Top Light Overlay */}
                {rig.topEnabled && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-300"
                    style={{ background: previewStyles.topGradient }}
                  />
                )}
                {/* Rim Backlight Edge Glow */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300"
                  style={{ boxShadow: previewStyles.rimShadow }}
                />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm font-mono text-[10px] text-white/85">
                  <span>{activeDiffuser.label}</span>
                  <span className="uppercase text-[#F8C300]">{rig.globalIntensity}</span>
                </div>
              </div>

              {/* Clean Overhead Studio Diagram (SVG) */}
              <div className="sm:col-span-5 rounded-2xl bg-[#09090D] border border-white/10 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
                    Planta cenital
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOverlayOpen(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#F8C300] hover:text-[#101014] font-mono text-[9px] uppercase tracking-wider text-white/85 transition-colors cursor-pointer whitespace-nowrap"
                    title="Abrir diagrama interactivo de 3 puntos"
                  >
                    <Maximize2 className="w-2.5 h-2.5" />
                    3 Puntos
                  </button>
                </div>
                <svg viewBox="0 0 240 230" className="w-full h-auto max-h-[250px]" role="img" aria-label="Diagrama cenital de luces de estudio">
                  {/* Studio guide circles */}
                  <circle cx="120" cy="110" r="76" fill="none" stroke="rgba(255,255,255,0.10)" strokeDasharray="4 4" />
                  <circle cx="120" cy="110" r="42" fill="none" stroke="rgba(255,255,255,0.07)" />

                  {/* Rim / Backlight (top behind subject) */}
                  {rig.rimEnabled && (
                    <g>
                      <line
                        x1="120"
                        y1="30"
                        x2="120"
                        y2="92"
                        stroke="#F8C300"
                        strokeWidth="2"
                        strokeOpacity={Math.max(0.25, rig.rimIntensity / 100)}
                        strokeDasharray="3 3"
                      />
                      <circle cx="120" cy="26" r="10" fill="#F8C300" fillOpacity={Math.max(0.3, rig.rimIntensity / 100)} />
                      <text x="120" y="13" textAnchor="middle" fill="#F8C300" fontSize="8" fontFamily="monospace">
                        CONTRALUZ {rig.rimIntensity}%
                      </text>
                    </g>
                  )}

                  {/* Side Light */}
                  {rig.sideEnabled && (
                    <g>
                      <line
                        x1={rig.sideDirection === 'izquierda' ? 32 : 208}
                        y1="110"
                        x2={rig.sideDirection === 'izquierda' ? 102 : 138}
                        y2="110"
                        stroke="#58A6FF"
                        strokeWidth="2"
                        strokeOpacity={Math.max(0.25, rig.sideIntensity / 100)}
                        strokeDasharray="3 3"
                      />
                      <rect
                        x={rig.sideDirection === 'izquierda' ? 20 : 204}
                        y="100"
                        width="16"
                        height="20"
                        rx="3"
                        fill="#58A6FF"
                        fillOpacity={Math.max(0.35, rig.sideIntensity / 100)}
                      />
                      <text
                        x={rig.sideDirection === 'izquierda' ? 28 : 212}
                        y="94"
                        textAnchor="middle"
                        fill="#58A6FF"
                        fontSize="7.5"
                        fontFamily="monospace"
                      >
                        LATERAL
                      </text>
                    </g>
                  )}

                  {/* Fill Light (opposite subtle reflector on right-front) */}
                  <g>
                    <line
                      x1={rig.keyAngle <= 0 ? 182 : 58}
                      y1="158"
                      x2="128"
                      y2="120"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeOpacity={Math.max(0.15, (rig.fillIntensity / 100) * 0.65)}
                      strokeDasharray="2 3"
                    />
                    <circle
                      cx={rig.keyAngle <= 0 ? 184 : 56}
                      cy="160"
                      r="8"
                      fill="#FFFFFF"
                      fillOpacity={Math.max(0.15, (rig.fillIntensity / 100) * 0.7)}
                    />
                    <text
                      x={rig.keyAngle <= 0 ? 184 : 56}
                      y="177"
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.65)"
                      fontSize="7.5"
                      fontFamily="monospace"
                    >
                      RELLENO {rig.fillIntensity}%
                    </text>
                  </g>

                  {/* Key Light (rotatable) */}
                  <g>
                    <line
                      x1={keyCoords.x}
                      y1={keyCoords.y}
                      x2="120"
                      y2="110"
                      stroke={kelvinInfo.hex}
                      strokeWidth="2.5"
                      strokeOpacity={Math.max(0.35, rig.keyIntensity / 100)}
                    />
                    <circle
                      cx={keyCoords.x}
                      cy={keyCoords.y}
                      r="12"
                      fill={kelvinInfo.hex}
                      fillOpacity={Math.max(0.4, rig.keyIntensity / 100)}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <text
                      x={keyCoords.x}
                      y={keyCoords.y + 3}
                      textAnchor="middle"
                      fill="#101014"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      KEY
                    </text>
                  </g>

                  {/* Top Light Overhead Ring */}
                  {rig.topEnabled && (
                    <circle
                      cx="120"
                      cy="110"
                      r="25"
                      fill="none"
                      stroke="#FFF6D6"
                      strokeWidth="2.5"
                      strokeOpacity={Math.max(0.3, rig.topIntensity / 100)}
                      strokeDasharray="5 3"
                    />
                  )}

                  {/* Subject Center */}
                  <circle cx="120" cy="110" r="14" fill="#23232C" stroke="#F4F2ED" strokeWidth="2" />
                  <text x="120" y="113" textAnchor="middle" fill="#F4F2ED" fontSize="7.5" fontFamily="monospace">
                    SUJETO
                  </text>

                  {/* Camera Bottom */}
                  <rect x="106" y="196" width="28" height="16" rx="3" fill="#326BFF" />
                  <text x="120" y="223" textAnchor="middle" fill="#8FB0FF" fontSize="8" fontFamily="monospace">
                    CÁMARA
                  </text>
                </svg>
                <p className="text-[11px] text-white/60 text-center leading-snug">
                  {activeDiffuser.tip}
                </p>
              </div>
            </div>

            {/* Generated Prompt Box */}
            <div className="rounded-2xl bg-black/45 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F8C300]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prompt de iluminación resultante
                </span>
                <div className="inline-flex rounded-lg border border-white/15 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPromptLang('es')}
                    className={`px-2 py-0.5 font-mono text-[10px] uppercase cursor-pointer ${
                      promptLang === 'es' ? 'bg-[#F8C300] text-[#101014] font-bold' : 'text-white/70'
                    }`}
                  >
                    ES
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromptLang('en')}
                    className={`px-2 py-0.5 font-mono text-[10px] uppercase cursor-pointer ${
                      promptLang === 'en' ? 'bg-[#F8C300] text-[#101014] font-bold' : 'text-white/70'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
              <p className="font-mono text-xs text-white/90 leading-relaxed select-all">
                {activePrompt}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F8C300] text-[#101014] font-mono text-xs uppercase tracking-wider font-bold hover:brightness-95 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado' : 'Copiar prompt de luz'}
                </button>
                <button
                  type="button"
                  onClick={handleApplyToBuilder}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#326BFF] text-white font-mono text-xs uppercase tracking-wider font-bold hover:brightness-110 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Aplicar al Constructor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 cols: All 9 Educational Lighting Controls */}
        <div className="xl:col-span-6 space-y-4">
          {/* 1 & 2. Key Light & Fill Light */}
          <div className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 space-y-5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
              <Lightbulb className="w-4 h-4 text-[#F8C300]" />
              <span>01–02. Luz principal (Key) y Luz de relleno (Fill)</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#101014] dark:text-[#F4F2ED]">
                    Ángulo de luz principal
                  </span>
                  <span className="font-mono text-black/60 dark:text-white/60">
                    {rig.keyAngle}° · {angleInfo.es}
                  </span>
                </div>
                <input
                  type="range"
                  min={-135}
                  max={135}
                  step={5}
                  value={rig.keyAngle}
                  onChange={(e) => setRig((prev) => ({ ...prev, keyAngle: Number(e.target.value) }))}
                  className="w-full accent-[#326BFF]"
                />
                <div className="flex justify-between font-mono text-[10px] text-black/45 dark:text-white/45 mt-1">
                  <span>-135° Izq. trasera</span>
                  <span>0° Frontal</span>
                  <span>+135° Der. trasera</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#101014] dark:text-[#F4F2ED]">
                      Intensidad luz principal
                    </span>
                    <span className="font-mono text-black/60 dark:text-white/60">{rig.keyIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={rig.keyIntensity}
                    onChange={(e) => setRig((prev) => ({ ...prev, keyIntensity: Number(e.target.value) }))}
                    className="w-full accent-[#F8C300]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#101014] dark:text-[#F4F2ED]">
                      Luz de relleno (Fill)
                    </span>
                    <span className="font-mono text-black/60 dark:text-white/60">{rig.fillIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={rig.fillIntensity}
                    onChange={(e) => setRig((prev) => ({ ...prev, fillIntensity: Number(e.target.value) }))}
                    className="w-full accent-[#326BFF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3, 4, 5. Contraluz, Lateral, Cenital */}
          <div className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
              <Sliders className="w-4 h-4 text-[#7545D6] dark:text-[#C5B0FF]" />
              <span>03–05. Contraluz, Luz lateral y Luz cenital</span>
            </div>

            {/* Contraluz */}
            <div className="p-4 rounded-2xl bg-[#F4F2ED]/70 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[#101014] dark:text-[#F4F2ED] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rig.rimEnabled}
                    onChange={(e) => setRig((prev) => ({ ...prev, rimEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-[#326BFF]"
                  />
                  03. Contraluz (Rim / separación del fondo)
                </label>
                <span className="font-mono text-xs text-black/55 dark:text-white/55">
                  {rig.rimEnabled ? `${rig.rimIntensity}%` : 'Apagada'}
                </span>
              </div>
              {rig.rimEnabled && (
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={rig.rimIntensity}
                  onChange={(e) => setRig((prev) => ({ ...prev, rimIntensity: Number(e.target.value) }))}
                  className="w-full accent-[#F8C300]"
                />
              )}
            </div>

            {/* Luz lateral */}
            <div className="p-4 rounded-2xl bg-[#F4F2ED]/70 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[#101014] dark:text-[#F4F2ED] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rig.sideEnabled}
                    onChange={(e) => setRig((prev) => ({ ...prev, sideEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-[#326BFF]"
                  />
                  04. Luz lateral (volumen y textura rasante)
                </label>
                {rig.sideEnabled && (
                  <div className="inline-flex rounded-lg border border-black/15 dark:border-white/15 overflow-hidden">
                    {(['izquierda', 'derecha'] as const).map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setRig((prev) => ({ ...prev, sideDirection: dir }))}
                        className={`px-2 py-0.5 font-mono text-[10px] uppercase cursor-pointer ${
                          rig.sideDirection === dir
                            ? 'bg-[#101014] dark:bg-[#F8C300] text-white dark:text-[#101014] font-bold'
                            : 'text-black/60 dark:text-white/60'
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {rig.sideEnabled && (
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={rig.sideIntensity}
                  onChange={(e) => setRig((prev) => ({ ...prev, sideIntensity: Number(e.target.value) }))}
                  className="w-full accent-[#326BFF]"
                />
              )}
            </div>

            {/* Luz cenital */}
            <div className="p-4 rounded-2xl bg-[#F4F2ED]/70 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[#101014] dark:text-[#F4F2ED] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rig.topEnabled}
                    onChange={(e) => setRig((prev) => ({ ...prev, topEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-[#326BFF]"
                  />
                  05. Luz cenital (superior / atmósfera teatral)
                </label>
                <span className="font-mono text-xs text-black/55 dark:text-white/55">
                  {rig.topEnabled ? `${rig.topIntensity}%` : 'Apagada'}
                </span>
              </div>
              {rig.topEnabled && (
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={rig.topIntensity}
                  onChange={(e) => setRig((prev) => ({ ...prev, topIntensity: Number(e.target.value) }))}
                  className="w-full accent-[#7545D6]"
                />
              )}
            </div>
          </div>

          {/* 6, 7, 8, 9. Temperatura, Intensidad global, Sombras y Difusores */}
          <div className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 space-y-5">
            <div className="font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
              06–09. Temperatura de color, intensidad, sombras y difusores
            </div>

            {/* 06. Temperatura */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#101014] dark:text-[#F4F2ED]">
                  06. Temperatura de color (Kelvin)
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-black/65 dark:text-white/65">
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: kelvinInfo.hex }}
                  />
                  {rig.kelvin}K · {kelvinInfo.labelEs}
                </span>
              </div>
              <input
                type="range"
                min={2700}
                max={8000}
                step={100}
                value={rig.kelvin}
                onChange={(e) => setRig((prev) => ({ ...prev, kelvin: Number(e.target.value) }))}
                className="w-full accent-[#F8C300]"
              />
              <div
                className="h-2 rounded-full mt-1.5 border border-black/10"
                style={{
                  background: 'linear-gradient(90deg, #FF9E3D 0%, #FFF4E0 52%, #7EB8FF 100%)',
                }}
              />
            </div>

            {/* 07. Intensidad global & 08. Sombras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] mb-2">
                  07. Intensidad global (Clave tonal)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'low-key', label: 'Low Key' },
                      { id: 'mid-key', label: 'Mid Key' },
                      { id: 'high-key', label: 'High Key' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRig((prev) => ({ ...prev, globalIntensity: item.id }))}
                      className={`py-2 rounded-xl font-mono text-[11px] border transition-colors cursor-pointer ${
                        rig.globalIntensity === item.id
                          ? 'bg-[#101014] dark:bg-[#F8C300] text-white dark:text-[#101014] border-transparent font-bold'
                          : 'bg-[#F4F2ED] dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] mb-2">
                  08. Calidad de sombras
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'suave', label: 'Suave' },
                      { id: 'media', label: 'Media' },
                      { id: 'dura', label: 'Dura' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRig((prev) => ({ ...prev, shadowQuality: item.id }))}
                      className={`py-2 rounded-xl font-mono text-[11px] border transition-colors cursor-pointer ${
                        rig.shadowQuality === item.id
                          ? 'bg-[#101014] dark:bg-[#F8C300] text-white dark:text-[#101014] border-transparent font-bold'
                          : 'bg-[#F4F2ED] dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 09. Difusores */}
            <div>
              <div className="text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] mb-2">
                09. Difusores y modificadores de luz
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DIFFUSER_OPTIONS.map((opt) => {
                  const active = rig.diffuser === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRig((prev) => ({ ...prev, diffuser: opt.id }))}
                      className={`text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                        active
                          ? 'border-[#326BFF] bg-[#326BFF]/10 dark:bg-[#326BFF]/20'
                          : 'border-black/10 dark:border-white/10 bg-[#F4F2ED]/60 dark:bg-white/[0.03] hover:border-black/25'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]">
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-black/55 dark:text-white/55 mt-0.5 leading-snug">
                        {opt.tip}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3-Point Lighting Diagram & Intensity Sliders Overlay */}
      <ThreePointLightingOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        presets={LIGHTING_PRESETS}
        activePresetName={activePresetName}
        onSelectPreset={(preset) => handleSelectPreset(preset, true)}
        rig={rig}
        onChangeRig={setRig}
        activeSubject={activeSubject}
        previewStyles={previewStyles}
        kelvinInfo={kelvinInfo}
        angleInfo={angleInfo}
        contrastRatio={contrastRatio}
        diffuserLabel={activeDiffuser.label}
        diffuserBlurFactor={activeDiffuser.blurFactor}
        activePrompt={activePrompt}
        promptLang={promptLang}
        onChangePromptLang={setPromptLang}
        onCopyPrompt={handleCopy}
        copied={copied}
        onApplyToBuilder={handleApplyToBuilder}
      />
    </div>
  );
};
