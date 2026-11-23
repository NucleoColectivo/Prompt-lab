import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  BookmarkPlus,
  RefreshCw,
  Wand2,
  Sliders,
} from 'lucide-react';
import type { GalleryCollectionId, GalleryVisualItem } from '../data/galleryCollectionsData';
import type { PromptBuilderState } from './PromptBuilder';
import { ResilientImage } from './ResilientImage';
import { saveRecreatedPromptToVault } from '../services/workspaceStore';

interface RecreateImageModalProps {
  item: GalleryVisualItem | null;
  initialLang?: 'es' | 'en';
  onClose: () => void;
  onSendToBuilder: (patch: Partial<PromptBuilderState>) => void;
}

type TargetPlatform = 'universal' | 'midjourney' | 'gemini' | 'chatgpt' | 'runway';

const SUBJECT_PRESETS_BY_COLLECTION: Record<GalleryCollectionId, string[]> = {
  Retrato: [
    'Una ceramista de 50 años sosteniendo una vasija de barro crudo en su taller',
    'Un músico de jazz joven ajustando su trompeta antes de salir al escenario',
    'Una arquitecta con abrigo de lana mirando hacia la luz lateral de un ventanal',
    'Un relojero artesano examinando un mecanismo antiguo con lupa',
  ],
  Paisaje: [
    'Un pabellón cultural de concreto y madera sobre una ladera andina con niebla matinal',
    'Una carretera costera solitaria bordeada de palmas al atardecer dorado',
    'Un jardín botánico cubierto de bruma con pasarelas metálicas elevadas',
    'Un mirador minimalista frente a un lago volcánico inmóvil al amanecer',
  ],
  Producto: [
    'Un frasco de perfume artesanal en vidrio ámbar apoyado sobre piedra volcánica',
    'Una cafetera de cerámica mate negro vertiendo café recién hecho con vapor sutil',
    'Un par de audífonos metálicos de diseño industrial flotando sobre fondo mineral',
    'Una botella de aceite de oliva orgánico con gotas de agua fresca y rama de olivo',
  ],
  'Arte Digital': [
    'Una escultura biomórfica de vidrio soplado y bronce suspendida en una sala blanca',
    'Un instrumento musical especulativo hecho de porcelana translúcida y filamentos de cobre',
    'Un jardín flotante de estructuras botánicas cristalinas en escala monumental',
    'Una arquitectura textil cinética reaccionando al viento en una plaza contemporánea',
  ],
  Moda: [
    'Una silueta editorial con abrigo escultórico de lino crudo en terraza brutalista',
    'Un retrato beauty con maquillaje minimalista mineral y joyería geométrica en plata',
    'Un conjunto contemporáneo de lana tejida caminando bajo arquitectura de hormigón',
    'Un vestido plisado en tono terracota capturado en movimiento suave en estudio',
  ],
  Cine: [
    'Dos personajes conversando en una cafetería nocturna bajo lluvia detrás del vidrio',
    'Una protagonista solitaria esperando un tren nocturno en una estación vacía',
    'Un taller de cine analógico con proyectores encendidos y polvo flotando en el haz de luz',
    'Un motociclista detenido frente a un túnel urbano iluminado por lámparas de sodio',
  ],
  'Macro y Naturaleza': [
    'Gotas de rocío sobre una hoja de helecho capturando el reflejo del bosque',
    'Cristales de sal marina y arena volcánica negra en primerísimo plano táctil',
    'Pétalos translúcidos de orquídea silvestre atravesados por luz solar rasante',
    'Textura de corteza de árbol centenario con musgo húmedo en detalle extremo',
  ],
  'Motion y Video': [
    'Secuencia aérea siguiendo una ciclista por un puente arquitectónico al amanecer',
    'Plano orbital alrededor de una instalación luminosa interactiva en galería oscura',
    'Movimiento lento sobre una mesa de diseño donde cobran vida bocetos en papel',
    'Transición fluida desde el detalle de una taza de café hasta una terraza panorámica',
  ],
};

const CONTEXT_OVERRIDES: { id: string; label: string; es: string; en: string }[] = [
  { id: 'keep', label: 'Mantener atmósfera original', es: '', en: '' },
  {
    id: 'studio',
    label: 'Estudio minimalista',
    es: 'en un estudio minimalista de fondo neutro con luz controlada',
    en: 'inside a minimalist neutral studio with sculpted directional light',
  },
  {
    id: 'golden',
    label: 'Hora dorada exterior',
    es: 'en exterior durante la hora dorada con contraluz cálido natural',
    en: 'outdoors during warm golden hour with natural directional backlight',
  },
  {
    id: 'rain',
    label: 'Noche urbana con lluvia',
    es: 'en una calle nocturna húmeda con reflejos sutiles de lluvia sobre el asfalto',
    en: 'on a rain-slicked nocturnal urban street with subtle wet reflections',
  },
  {
    id: 'editorial',
    label: 'Arquitectura brutalista',
    es: 'en un espacio de arquitectura brutalista en concreto crudo y sombras geométricas',
    en: 'within a raw concrete brutalist architectural space with geometric shadows',
  },
];

const PLATFORMS: { id: TargetPlatform; label: string }[] = [
  { id: 'universal', label: 'Universal' },
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'gemini', label: 'Gemini / Imagen' },
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'runway', label: 'Runway Video' },
];

export const RecreateImageModal: React.FC<RecreateImageModalProps> = ({
  item,
  initialLang = 'es',
  onClose,
  onSendToBuilder,
}) => {
  const [customSubject, setCustomSubject] = useState('');
  const [contextId, setContextId] = useState('keep');
  const [selectedVariationIdx, setSelectedVariationIdx] = useState<number | null>(null);
  const [lang, setLang] = useState<'es' | 'en'>(initialLang);
  const [platform, setPlatform] = useState<TargetPlatform>('universal');
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (!item) return;
    const presets = SUBJECT_PRESETS_BY_COLLECTION[item.collection] || [];
    setCustomSubject(presets[0] || '');
    setContextId('keep');
    setSelectedVariationIdx(null);
    setLang(initialLang);
    setPlatform(item.mediaType === 'video' ? 'runway' : 'universal');
    setCopied(false);
    setSavedNotice(false);
  }, [item, initialLang]);

  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  const subjectPresets = useMemo(
    () => (item ? SUBJECT_PRESETS_BY_COLLECTION[item.collection] || [] : []),
    [item]
  );

  const recreatedPrompt = useMemo(() => {
    if (!item) return '';
    const subjectClean =
      customSubject.trim() ||
      (lang === 'es' ? item.title : `${item.title} (${item.style})`);
    const ctx = CONTEXT_OVERRIDES.find((c) => c.id === contextId);
    const variation =
      selectedVariationIdx !== null ? item.variations[selectedVariationIdx] : null;

    const contextSegment = ctx && ctx.id !== 'keep' ? (lang === 'es' ? ctx.es : ctx.en) : '';
    const variationSegment = variation
      ? lang === 'es'
        ? variation.deltaEs
        : variation.deltaEn
      : '';

    const coreEs = [
      `${subjectClean}${contextSegment ? `, ${contextSegment}` : ''}`,
      `Estilo visual: ${item.style} (${item.technique})`,
      `Composición: ${item.specs.composition}`,
      `Óptica y cámara de referencia: ${item.specs.camera}, ${item.specs.lens}, ${item.specs.aperture}`,
      `Iluminación: ${item.specs.lighting}`,
      `Colorimetría y atmósfera: ${item.specs.color}; ${item.specs.atmosphere}`,
      `Textura: ${item.specs.texture}`,
      variationSegment ? `Variación aplicada: ${variationSegment}` : '',
      `Evitar: ${item.negativePrompt}`,
    ]
      .filter(Boolean)
      .join('. ');

    const coreEn = [
      `${subjectClean}${contextSegment ? `, ${contextSegment}` : ''}`,
      `${item.style} aesthetic, ${item.technique}`,
      `Composition: ${item.specs.composition}`,
      `Camera reference: ${item.specs.camera}, ${item.specs.lens}, ${item.specs.aperture}`,
      `Lighting: ${item.specs.lighting}`,
      `Color & atmosphere: ${item.specs.color}, ${item.specs.atmosphere}`,
      `Material texture: ${item.specs.texture}`,
      variationSegment ? `Applied variation: ${variationSegment}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    const base = lang === 'es' ? coreEs : `${coreEn}. Avoid: ${item.negativePrompt}.`;

    if (platform === 'midjourney') {
      const mjRatio = item.aspectRatio.includes(':') ? item.aspectRatio : '4:5';
      return `${lang === 'es' ? coreEs : coreEn} --ar ${mjRatio} --style raw --v 6.1 --no ${item.negativePrompt}`;
    }
    if (platform === 'runway') {
      const motionText =
        lang === 'es'
          ? 'Movimiento de cámara lento y fluido (dolly-in controlado, 24fps, continuidad física natural)'
          : 'Slow controlled dolly-in camera movement, 24fps cinematic motion, natural physical continuity';
      return `${base} ${motionText}.`;
    }
    if (platform === 'gemini') {
      return `${base} ${
        lang === 'es'
          ? `Formato ${item.aspectRatio}. Mantener iluminación físicamente coherente y textura real sin aspecto plástico.`
          : `Aspect ratio ${item.aspectRatio}. Physically coherent lighting and authentic surface texture without plastic smoothing.`
      }`;
    }
    if (platform === 'chatgpt') {
      return `${
        lang === 'es' ? 'Genera una imagen con dirección de arte precisa:' : 'Generate a high-craft image with precise art direction:'
      } ${base} (${lang === 'es' ? 'Proporción' : 'Aspect ratio'} ${item.aspectRatio}).`;
    }
    return `${base} (${item.aspectRatio})`;
  }, [item, customSubject, contextId, selectedVariationIdx, lang, platform]);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(recreatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSaveToProjects = () => {
    const ok = saveRecreatedPromptToVault({
      title: `Recreación: ${customSubject.trim().slice(0, 48) || item.title}`,
      prompt: recreatedPrompt,
      sourceCode: item.code,
      platform: PLATFORMS.find((p) => p.id === platform)?.label || 'Universal',
      project: `Galería · ${item.collection}`,
    });
    if (ok) {
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2200);
    }
  };

  const handleOpenInBuilder = () => {
    const variation =
      selectedVariationIdx !== null ? item.variations[selectedVariationIdx] : null;
    const ctx = CONTEXT_OVERRIDES.find((c) => c.id === contextId);
    const isVideo = platform === 'runway' || item.mediaType === 'video';
    const categoryMap: Record<GalleryCollectionId, NonNullable<PromptBuilderState['category']>> = {
      Retrato: 'photo',
      Paisaje: 'architecture',
      Producto: 'branding',
      'Arte Digital': 'experimental',
      Moda: 'photo',
      Cine: 'photo',
      'Macro y Naturaleza': 'photo',
      'Motion y Video': 'video',
    };
    onSendToBuilder({
      mode: isVideo ? 'video' : 'photo',
      category: isVideo ? 'video' : categoryMap[item.collection] || 'photo',
      subject: customSubject.trim() || item.title,
      setting: ctx && ctx.id !== 'keep' ? ctx.es : item.description,
      composition: item.specs.composition,
      camera: item.specs.camera,
      lens: variation?.patch?.lens || item.specs.lens,
      aperture: item.specs.aperture,
      lighting: variation?.patch?.lighting || item.specs.lighting,
      colorPalette: variation?.patch?.colorPalette || item.specs.color,
      atmosphere: item.specs.atmosphere,
      texture: item.specs.texture,
      materials: item.specs.texture,
      visualStyle: item.style,
      aspectRatio: variation?.patch?.aspectRatio || item.aspectRatio,
      negativeAvoid: item.negativePrompt
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      customNotes: `Galería · Recreación de ${item.code} (${item.title})`,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#101014]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Recrear estructura visual de ${item.title}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-[#F4F2ED] dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-2xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#101014] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
              Recrear esta imagen · {item.code} · {item.collection}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] truncate">
              Conserva la dirección de arte de “{item.title}” con tu propio sujeto
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-[#F4F2ED] dark:bg-[#18181F] hover:bg-[#101014] hover:text-[#F4F2ED] dark:hover:bg-[#F8C300] dark:hover:text-[#101014] transition-colors shrink-0"
            aria-label="Cerrar recreador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto lg:overflow-hidden">
          {/* Left: Reference DNA */}
          <div className="lg:col-span-5 bg-[#101014] text-[#F4F2ED] p-5 space-y-4 lg:overflow-y-auto">
            <ResilientImage
              src={item.image}
              alt={item.alt}
              aspectRatio="3:2"
              objectPosition={item.objectPosition || 'center'}
              containerClassName="w-full rounded-xl overflow-hidden"
            />
            <div className="space-y-2.5 text-xs">
              <div className="text-[11px] font-mono-code text-[#F8C300] font-semibold">
                ADN visual heredado automáticamente
              </div>
              <dl className="grid grid-cols-1 gap-2 text-[11px] border-t border-white/10 pt-3">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#A09E97]">Estilo</dt>
                  <dd className="text-right font-semibold text-[#F4F2ED]">{item.style}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#A09E97]">Óptica</dt>
                  <dd className="text-right text-[#D8D5CD]">
                    {item.specs.lens} · {item.specs.aperture}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#A09E97]">Iluminación</dt>
                  <dd className="text-right text-[#D8D5CD]">{item.specs.lighting}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#A09E97]">Herramienta ref.</dt>
                  <dd className="text-right text-[#F8C300] font-mono-code">{item.toolReference}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: Interactive Recreation Controls */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-5 lg:max-h-[80vh] lg:overflow-y-auto">
            {/* Step 1: New Subject */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="recreate-subject-input"
                  className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                >
                  1. ¿Qué nuevo sujeto o escena quieres poner en este estilo?
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (subjectPresets.length === 0) return;
                    const idx = subjectPresets.indexOf(customSubject);
                    const next = subjectPresets[(idx + 1) % subjectPresets.length];
                    setCustomSubject(next);
                  }}
                  className="text-[11px] font-semibold text-[#326BFF] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Sugerir idea</span>
                </button>
              </div>
              <textarea
                id="recreate-subject-input"
                rows={2}
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Describe el protagonista, objeto o arquitectura que reemplazará al original..."
                className="w-full p-3 rounded-xl bg-white dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
              />
              <div className="flex flex-wrap gap-1.5">
                {subjectPresets.slice(0, 3).map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCustomSubject(preset)}
                    className={`px-2.5 py-1 text-[11px] rounded-md border text-left transition-colors ${
                      customSubject === preset
                        ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-transparent font-semibold'
                        : 'bg-white dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                    }`}
                  >
                    {preset.length > 44 ? `${preset.slice(0, 44)}…` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Context & Variation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="recreate-context-select"
                  className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] block"
                >
                  2. Escenario y atmósfera
                </label>
                <select
                  id="recreate-context-select"
                  value={contextId}
                  onChange={(e) => setContextId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-lg bg-white dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                >
                  {CONTEXT_OVERRIDES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] block">
                  3. Variación rápida de la lámina
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedVariationIdx(null)}
                    className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                      selectedVariationIdx === null
                        ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                        : 'bg-white dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E]'
                    }`}
                  >
                    Fiel al original
                  </button>
                  {item.variations.slice(0, 3).map((v, idx) => (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => setSelectedVariationIdx(idx)}
                      className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                        selectedVariationIdx === idx
                          ? 'bg-[#7545D6] text-white border-[#7545D6]'
                          : 'bg-white dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Output Platform & Language */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                        platform === p.id
                          ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-transparent font-bold'
                          : 'bg-white dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="inline-flex rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] overflow-hidden text-[11px] font-mono-code font-bold">
                  <button
                    type="button"
                    onClick={() => setLang('es')}
                    className={`px-2.5 py-1 ${
                      lang === 'es'
                        ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014]'
                        : 'bg-white dark:bg-[#101014] text-[#5B5B66]'
                    }`}
                  >
                    ES
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`px-2.5 py-1 ${
                      lang === 'en'
                        ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014]'
                        : 'bg-white dark:bg-[#101014] text-[#5B5B66]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Generated Prompt Preview */}
              <div className="p-4 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#26262E] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#A09E97]">
                  <span className="inline-flex items-center gap-1.5 text-[#F8C300] font-semibold">
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Prompt recreado listo para pegar</span>
                  </span>
                  <span className="tabular-nums">{recreatedPrompt.length} car.</span>
                </div>
                <p className="text-xs font-mono-code text-[#EAE7DF] leading-relaxed whitespace-pre-wrap">
                  {recreatedPrompt}
                </p>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-2.5 px-4 min-h-[44px] text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Prompt copiado' : 'Copiar prompt recreado'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenInBuilder}
                className="py-2.5 px-4 min-h-[44px] text-xs font-bold bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014] hover:opacity-90 rounded-lg transition-opacity inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Sliders className="w-4 h-4" />
                <span>Refinar en Constructor</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToProjects}
                className="py-2.5 px-3.5 min-h-[44px] text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] bg-white dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] hover:border-[#7545D6] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                {savedNotice ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                    <span>Guardado</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Guardar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
