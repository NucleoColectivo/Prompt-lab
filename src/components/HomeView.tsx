import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Images,
  BookOpen,
  Shuffle,
  Compass,
  PencilRuler,
  History,
  ShoppingBag,
  Globe,
  Clapperboard,
  PlayCircle,
  Wrench,
  Scale,
  Film,
  Palette,
  Sun,
} from 'lucide-react';
import type { AppSectionId } from '../types/navigation';
import { VISUAL_LIBRARY_PATHS } from '../data/visualLibraryRegistry';
import { STUDIO_MEDIA_ASSETS } from '../data/creativeStudiosData';
import { PLATFORM_METRICS } from '../data/platformMetrics';
import ethicsCardSesgos from '../assets/images/ethics_card_sesgos_1795400896612.jpg';
import { ResilientImage } from './ResilientImage';
import type { PromptBuilderState } from './PromptBuilder';

const HOME_RANDOM_CHALLENGES = [
  {
    id: 'hc-1',
    title: 'Cartel tipográfico para festival cultural',
    level: 'Principiante',
    durationMinutes: 15,
    brief:
      'Diseña la imagen base de un afiche cultural con alto contraste cromático y espacio negativo limpio arriba para el título.',
    starterPrompt:
      'Editorial cultural festival poster artwork, bold cobalt blue and warm ochre duotone over textured cotton print paper, expressive sculptural light silhouette, generous clean upper negative space for typography, subtle risograph grain, 2:3',
  },
  {
    id: 'hc-2',
    title: 'Retrato editorial con luz de ventana',
    level: 'Principiante',
    durationMinutes: 15,
    brief:
      'Construye un retrato honesto y cinematográfico evitando piel plástica mediante luz lateral suave y lente de 85mm.',
    starterPrompt:
      'Editorial portrait of an independent ceramicist in her sunlit workshop, soft directional window sidelight, authentic skin pores and clay dust on hands, shot on 85mm f/2.0 lens, muted warm neutral color grade, 4:5',
  },
  {
    id: 'hc-3',
    title: 'Bodegón comercial sobre piedra volcánica',
    level: 'Intermedio',
    durationMinutes: 20,
    brief:
      'Presenta un objeto cotidiano como pieza de diseño de lujo usando luz rasante y control de reflejos sobre superficie mineral.',
    starterPrompt:
      'Minimalist commercial product photography of an amber glass artisan bottle resting on dark porous volcanic stone, crisp directional studio rim light, subtle water droplets, razor-sharp glass refraction, 4:5',
  },
  {
    id: 'hc-4',
    title: 'Escena de cine nocturno bajo lluvia',
    level: 'Intermedio',
    durationMinutes: 20,
    brief:
      'Crea un fotograma narrativo en 35mm con reflejos húmedos y contraste entre luces cálidas interiores y sombras frías.',
    starterPrompt:
      '35mm cinema film still of a lone traveler standing outside a quiet corner cafe during light night rain, warm tungsten interior glow contrasting with cool wet asphalt reflections, anamorphic 2.39:1 framing, organic film grain',
  },
  {
    id: 'hc-5',
    title: 'Arquitectura bioclimática en neblina andina',
    level: 'Intermedio',
    durationMinutes: 25,
    brief:
      'Imagina un pabellón cultural en madera y concreto integrado con un paisaje montañoso de altura al amanecer.',
    starterPrompt:
      'Architectural photography of a contemporary timber and raw concrete cultural pavilion nestled into misty Andean hillside at dawn, soft diffused morning fog, 24mm tilt-shift perspective, authentic material weathering, 16:9',
  },
  {
    id: 'hc-6',
    title: 'Secuencia en movimiento desde un objeto',
    level: 'Avanzado',
    durationMinutes: 20,
    brief:
      'Define un único movimiento de cámara limpio (dolly-in o órbita lenta) para animar una composición escultórica en 24fps.',
    starterPrompt:
      'Slow smooth 360-degree camera orbit around a translucent blown-glass and bronze sculpture inside a calm brutalist gallery, shafts of natural daylight revealing subtle floating dust motes, 24fps cinematic motion, 16:9',
  },
];

interface HomeViewProps {
  onNavigateSection: (section: AppSectionId, subTab?: string) => void;
  onOpenGalleryCollection?: (collectionTag: string) => void;
  onOpenWelcomeWizard?: () => void;
  onSendPromptToBuilder?: (patch: Partial<PromptBuilderState>) => void;
}

const THREE_PATHWAYS: {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryCta: string;
  primaryTarget: { section: AppSectionId; subTab?: string };
  quickLinks: { label: string; section: AppSectionId; subTab?: string }[];
}[] = [
  {
    number: '01',
    title: 'Crear',
    subtitle: `Constructor · ${PLATFORM_METRICS.labsCount} Laboratorios · Cine IA`,
    description:
      'Construye prompts por disciplina, arma Moodboards de dirección de arte, simula esquemas de iluminación, transforma bocetos o planifica secuencias audiovisuales.',
    image: VISUAL_LIBRARY_PATHS.adLuxury,
    imageAlt: 'Estudio de creación visual y dirección de arte para producto y cine',
    primaryCta: 'Abrir Constructor Modular',
    primaryTarget: { section: 'builder' },
    quickLinks: [
      { label: 'Moodboard Builder (Dirección de Arte)', section: 'laboratorios', subTab: 'moodboard' },
      { label: 'Simulador de Iluminación (9 parámetros)', section: 'laboratorios', subTab: 'iluminacion' },
      { label: `${PLATFORM_METRICS.labsCount} Laboratorios prácticos`, section: 'laboratorios', subTab: 'labs' },
    ],
  },
  {
    number: '02',
    title: 'Explorar',
    subtitle: `Galería (${PLATFORM_METRICS.galleryPlates}) · Recrear Imagen · Cultura IA`,
    description: `Descubre ${PLATFORM_METRICS.galleryPlates} láminas curadas en ${PLATFORM_METRICS.galleryCollections} colecciones, usa «Recrear esta imagen» para adaptar cualquier estilo a tu idea y explora Cine y Ética IA.`,
    image: VISUAL_LIBRARY_PATHS.photoNeoNoir,
    imageAlt: 'Fotografía editorial nocturna de la Galería Visual Experimental',
    primaryCta: 'Entrar a la Galería',
    primaryTarget: { section: 'galeria' },
    quickLinks: [
      { label: `Experiencias y Retos (${PLATFORM_METRICS.experiences})`, section: 'experiencias' },
      { label: 'Ética y Sesgos IA', section: 'etica-ia' },
      { label: 'Cine y Documentales IA', section: 'movies-ia' },
    ],
  },
  {
    number: '03',
    title: 'Aprender',
    subtitle: `${PLATFORM_METRICS.modules} Módulos · ${PLATFORM_METRICS.tutorials} Tutoriales · Bitácora`,
    description: `Domina iluminación, lentes, composición y narrativa visual con ${PLATFORM_METRICS.fichas} fichas técnicas, ${PLATFORM_METRICS.tutorials} tutoriales paso a paso en video y tu Bitácora Creativa.`,
    image: VISUAL_LIBRARY_PATHS.focalComparison,
    imageAlt: 'Comparativa técnica de lentes y composición de la Biblioteca Visual',
    primaryCta: 'Abrir Biblioteca Visual',
    primaryTarget: { section: 'biblioteca' },
    quickLinks: [
      { label: `${PLATFORM_METRICS.tutorials} Tutoriales en Video`, section: 'recursos', subTab: 'tutoriales' },
      { label: 'Recetas y Plantillas', section: 'recursos', subTab: 'recetas' },
      { label: 'Mis proyectos y Bitácora Creativa', section: 'favoritos' },
    ],
  },
];

const CURATED_COLLECTIONS = [
  {
    id: 'Retrato',
    number: '01',
    title: 'Retrato',
    meta: 'Luz facial · textura real',
    image: VISUAL_LIBRARY_PATHS.lightRembrandt,
  },
  {
    id: 'Paisaje',
    number: '02',
    title: 'Paisaje',
    meta: 'Territorio · arquitectura',
    image: VISUAL_LIBRARY_PATHS.compExtremeWide,
  },
  {
    id: 'Producto',
    number: '03',
    title: 'Producto',
    meta: 'Bodegón · publicidad',
    image: VISUAL_LIBRARY_PATHS.adSplash,
  },
  {
    id: 'Arte Digital',
    number: '04',
    title: 'Arte Digital',
    meta: '3D · botánica · generativo',
    image: VISUAL_LIBRARY_PATHS.artHybridOrganism,
  },
  {
    id: 'Moda',
    number: '05',
    title: 'Moda',
    meta: 'Editorial · tejidos crudos',
    image: VISUAL_LIBRARY_PATHS.photoFashion,
  },
  {
    id: 'Cine',
    number: '06',
    title: 'Cine',
    meta: '35mm · atmósfera · color',
    image: VISUAL_LIBRARY_PATHS.colorTealOrange,
  },
  {
    id: 'Macro y Naturaleza',
    number: '07',
    title: 'Macro',
    meta: '100mm · microtexturas',
    image: VISUAL_LIBRARY_PATHS.focal100mmMacro,
  },
  {
    id: 'Motion y Video',
    number: '08',
    title: 'Motion & Video',
    meta: 'Cámara en movimiento · VFX',
    image: VISUAL_LIBRARY_PATHS.videoDroneFpv,
  },
];

const PRACTICAL_STUDIOS: {
  title: string;
  detail: string;
  image: string;
  icon: React.ReactNode;
  section: AppSectionId;
  subTab?: string;
}[] = [
  {
    title: 'Moodboard Builder',
    detail: 'Tableros de dirección de arte, paletas y prompt directo',
    image: VISUAL_LIBRARY_PATHS.colorDuotone,
    icon: <Palette className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300]" />,
    section: 'laboratorios',
    subTab: 'moodboard',
  },
  {
    title: 'Simulador de iluminación',
    detail: '9 parámetros de luz + diagrama cenital de estudio',
    image: VISUAL_LIBRARY_PATHS.lightRembrandt,
    icon: <Sun className="w-4 h-4 text-[#F8C300]" />,
    section: 'laboratorios',
    subTab: 'iluminacion',
  },
  {
    title: 'Mi primera imagen',
    detail: '6 pasos guiados sin tecnicismos',
    image: STUDIO_MEDIA_ASSETS.botanicalArt,
    icon: <Sparkles className="w-4 h-4 text-[#F8C300]" />,
    section: 'laboratorios',
    subTab: 'principiante',
  },
  {
    title: 'Dibujo a imagen',
    detail: 'Limpia tu boceto y llévalo a render o foto',
    image: STUDIO_MEDIA_ASSETS.drawingTo3dRender,
    icon: <PencilRuler className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300]" />,
    section: 'laboratorios',
    subTab: 'dibujo',
  },
  {
    title: 'Restauración fotográfica',
    detail: 'Recupera archivo histórico preservando identidad',
    image: STUDIO_MEDIA_ASSETS.restorationBeforeAfter,
    icon: <History className="w-4 h-4 text-[#326BFF] dark:text-[#F8C300]" />,
    section: 'laboratorios',
    subTab: 'restauracion',
  },
  {
    title: 'Producto y publicidad',
    detail: 'Bodegones, packshot y piezas comerciales',
    image: STUDIO_MEDIA_ASSETS.productCommerceStudio,
    icon: <ShoppingBag className="w-4 h-4 text-[#F8C300]" />,
    section: 'laboratorios',
    subTab: 'producto',
  },
  {
    title: 'Diseño web con IA',
    detail: 'Arquitectura, prompts y especificación UI/UX',
    image: STUDIO_MEDIA_ASSETS.webDesignShowcase,
    icon: <Globe className="w-4 h-4 text-[#326BFF] dark:text-[#F8C300]" />,
    section: 'laboratorios',
    subTab: 'web',
  },
  {
    title: 'Video y secuencias',
    detail: 'Planificador en 8 etapas + Storyboard',
    image: VISUAL_LIBRARY_PATHS.camCinemaRig,
    icon: <Clapperboard className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300]" />,
    section: 'film-director',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateSection,
  onOpenGalleryCollection,
  onOpenWelcomeWizard,
  onSendPromptToBuilder,
}) => {
  const [challengeIdx, setChallengeIdx] = useState(0);

  const activeChallenge = useMemo(
    () => HOME_RANDOM_CHALLENGES[challengeIdx % HOME_RANDOM_CHALLENGES.length],
    [challengeIdx]
  );

  const handleNextChallenge = () => {
    setChallengeIdx((prev) => (prev + 1) % HOME_RANDOM_CHALLENGES.length);
  };

  return (
    <div className="bg-[#F4F2ED] dark:bg-[#101014] transition-colors">
      {/* 1. TRES CAMINOS CLAROS: 01 CREAR · 02 EXPLORAR · 03 APRENDER */}
      <section
        id="que-encuentras"
        className="py-16 sm:py-20 border-b border-[#DEDAD0] dark:border-[#26262E]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                Por dónde empezar
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-tight text-balance">
                Tres caminos para crear, explorar y aprender con IA
              </h2>
            </div>

            {onOpenWelcomeWizard && (
              <button
                type="button"
                onClick={onOpenWelcomeWizard}
                className="text-xs font-semibold text-[#326BFF] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1.5 self-start md:self-auto whitespace-nowrap"
              >
                <Compass className="w-4 h-4" />
                <span>Recorrido rápido (3 pasos)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {THREE_PATHWAYS.map((path) => (
              <article
                key={path.number}
                className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-2xl overflow-hidden flex flex-col justify-between transition-colors hover:border-[#101014] dark:hover:border-[#F8C300]"
              >
                <div>
                  <div className="relative overflow-hidden bg-[#101014]">
                    <ResilientImage
                      src={path.image}
                      alt={path.imageAlt}
                      aspectRatio="16:9"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-4 text-xs font-mono-code font-bold text-[#F8C300] tabular-nums">
                      {path.number}. {path.title}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                      {path.subtitle}
                    </div>
                    <h3 className="text-2xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                      {path.title}
                    </h3>
                    <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                      {path.description}
                    </p>

                    <ul className="pt-3 border-t border-[#EAE7DF] dark:border-[#26262E] space-y-2">
                      {path.quickLinks.map((link) => (
                        <li key={link.label}>
                          <button
                            type="button"
                            onClick={() => onNavigateSection(link.section, link.subTab)}
                            className="w-full flex items-center justify-between text-xs font-semibold text-[#101014] dark:text-[#D8D5CD] hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors py-1"
                          >
                            <span>{link.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateSection(path.primaryTarget.section, path.primaryTarget.subTab)
                    }
                    className="w-full py-2.5 px-4 min-h-[42px] text-xs font-bold rounded-lg bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                  >
                    <span>{path.primaryCta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2. GALERÍA VISUAL CURADA (8 COLECCIONES) */}
      <section className="py-16 sm:py-20 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#14141A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-mono-code text-[#326BFF] dark:text-[#F8C300] font-semibold">
                Inspiración y prompts reutilizables
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] text-balance">
                Galería Visual en 8 colecciones curadas
              </h2>
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Cada lámina incluye prompt completo en español e inglés, óptica, iluminación y la herramienta «Recrear esta imagen» para adaptarla a tu proyecto.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onOpenGalleryCollection
                  ? onOpenGalleryCollection('Todas')
                  : onNavigateSection('galeria')
              }
              className="px-4 py-2.5 min-h-[42px] text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg transition-colors inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap shrink-0"
            >
              <Images className="w-4 h-4" />
              <span>Abrir Galería ({PLATFORM_METRICS.galleryPlates} láminas)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CURATED_COLLECTIONS.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() =>
                  onOpenGalleryCollection
                    ? onOpenGalleryCollection(col.id)
                    : onNavigateSection('galeria')
                }
                className="group relative rounded-xl overflow-hidden text-left bg-[#101014] aspect-[4/3] focus-visible:outline-2 focus-visible:outline-[#F8C300]"
              >
                <ResilientImage
                  src={col.image}
                  alt={`Colección ${col.title} de Núcleo Colectivo`}
                  aspectRatio="3:2"
                  containerClassName="w-full h-full"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/90 via-[#101014]/25 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3.5 right-3.5">
                  <div className="text-[11px] font-mono-code text-[#F8C300] tabular-nums">
                    {col.number} · {col.meta}
                  </div>
                  <div className="text-base font-bold text-[#F4F2ED] mt-0.5 flex items-center justify-between">
                    <span>{col.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2B. CULTURA CRÍTICA Y AUDIOVISUAL: ÉTICA IA + CINE Y DOCUMENTALES */}
      <section className="py-16 sm:py-20 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
              Pensamiento crítico y cultura visual
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] text-balance">
              Ética de la IA y Cine Documental
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
              Más allá de las herramientas: laboratorios interactivos para cuestionar sesgos algorítmicos y una filmoteca curada sobre el impacto cultural de la inteligencia artificial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tarjeta Ética IA */}
            <article className="group bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6] dark:hover:border-[#F8C300] rounded-2xl overflow-hidden flex flex-col justify-between transition-colors">
              <div>
                <div className="relative overflow-hidden bg-[#101014]">
                  <ResilientImage
                    src={ethicsCardSesgos}
                    alt="Laboratorio de Ética IA, sesgos visuales y dilemas algorítmicos"
                    aspectRatio="16:9"
                    className="group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/80 via-[#101014]/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono-code text-[#F8C300]">
                    <span>6 simuladores · 20 charlas críticas</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                    <Scale className="w-4 h-4" />
                    <span>Ética IA · Laboratorio Crítico</span>
                  </div>
                  <h3 className="text-2xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                    Sesgos, dilemas morales y alfabetización visual
                  </h3>
                  <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                    Experimenta cómo los prompts reproducen estereotipos, pon a prueba tu ojo en el detector de imágenes sintéticas, explora dilemas éticos y consulta 20 charlas críticas seleccionadas.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => onNavigateSection('etica-ia')}
                  className="w-full py-3 px-4 min-h-[44px] text-xs font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] hover:opacity-90 rounded-lg transition-opacity inline-flex items-center justify-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  <span>Abrir Laboratorio de Ética IA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>

            {/* Tarjeta Cine y Documentales IA */}
            <article className="group bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] dark:hover:border-[#F8C300] rounded-2xl overflow-hidden flex flex-col justify-between transition-colors">
              <div>
                <div className="relative overflow-hidden bg-[#101014]">
                  <ResilientImage
                    src={VISUAL_LIBRARY_PATHS.colorTealOrange}
                    alt="Cine Club y Filmoteca de Documentales y Películas sobre Inteligencia Artificial"
                    aspectRatio="16:9"
                    className="group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/80 via-[#101014]/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono-code text-[#F8C300]">
                    <span>31 documentales y debates · 20 películas esenciales</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-[#326BFF] dark:text-[#F8C300] font-semibold">
                    <Film className="w-4 h-4" />
                    <span>Cine y Documentales IA · Cine Club</span>
                  </div>
                  <h3 className="text-2xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                    Filmoteca curada sobre IA, sociedad y futuro
                  </h3>
                  <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                    Explora documentales completos, series de investigación, debates y 20 películas clave de ciencia ficción con preguntas críticas y fichas listas para cineforos y talleres.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => onNavigateSection('movies-ia')}
                  className="w-full py-3 px-4 min-h-[44px] text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Film className="w-4 h-4" />
                  <span>Abrir Cine y Documentales IA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. ACCESO DIRECTO A ESTUDIOS PRÁCTICOS */}
      <section className="py-16 sm:py-20 border-b border-[#DEDAD0] dark:border-[#26262E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                Laboratorios especializados
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                ¿Qué quieres producir hoy?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('experiencias')}
              className="text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] hover:text-[#326BFF] dark:hover:text-[#F8C300] inline-flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap"
            >
              <span>Ver las {PLATFORM_METRICS.experiences} experiencias guiadas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRACTICAL_STUDIOS.map((studio) => (
              <button
                key={studio.title}
                type="button"
                onClick={() => onNavigateSection(studio.section, studio.subTab)}
                className="group flex items-center gap-4 p-3.5 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] dark:hover:border-[#F8C300] text-left transition-colors"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#101014]">
                  <ResilientImage
                    src={studio.image}
                    alt={studio.title}
                    aspectRatio="1:1"
                    containerClassName="w-full h-full"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#101014] dark:text-[#F4F2ED]">
                    {studio.icon}
                    <span className="truncate">{studio.title}</span>
                  </div>
                  <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] line-clamp-2 leading-snug">
                    {studio.detail}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5B5B66] group-hover:text-[#326BFF] dark:group-hover:text-[#F8C300] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RETO CREATIVO ALEATORIO + RECURSOS CLAVE */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="rounded-2xl bg-[#101014] text-[#F4F2ED] border border-[#26262E] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-[#F8C300]">
                <span>Reto creativo aleatorio</span>
                <span aria-hidden="true" className="text-[#787670]">·</span>
                <span className="text-[#D8D5CD]">{activeChallenge.level}</span>
                <span aria-hidden="true" className="text-[#787670]">·</span>
                <span className="text-[#D8D5CD]">{activeChallenge.durationMinutes} min</span>
              </div>
              <h3 className="text-2xl font-extrabold font-display-sans text-[#F4F2ED]">
                {activeChallenge.title}
              </h3>
              <p className="text-sm text-[#D8D5CD] leading-relaxed max-w-2xl">
                {activeChallenge.brief}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (onSendPromptToBuilder) {
                    onSendPromptToBuilder({
                      mode: 'photo',
                      subject: activeChallenge.starterPrompt,
                      visualStyle: activeChallenge.title,
                    });
                  } else {
                    onNavigateSection('builder');
                  }
                }}
                className="py-2.5 px-4 min-h-[42px] text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Practicar en Constructor</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="py-2.5 px-3 min-h-[42px] text-xs font-semibold bg-white/10 hover:bg-white/15 text-[#F4F2ED] rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Shuffle className="w-3.5 h-3.5 text-[#F8C300]" />
                  <span>Otro reto</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateSection('experiencias')}
                  className="py-2.5 px-3 min-h-[42px] text-xs font-semibold border border-white/20 hover:border-[#F8C300] text-[#F4F2ED] rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <span>Más retos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quiet Footer Utility Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={() => onNavigateSection('recursos', 'tutoriales')}
                className="inline-flex items-center gap-1.5 font-semibold hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                <span>12 Tutoriales en video</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateSection('academia', 'tools')}
                className="inline-flex items-center gap-1.5 font-semibold hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
              >
                <Wrench className="w-4 h-4" />
                <span>Directorio de 31 Apps IA</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateSection('recursos', 'recetas')}
                className="inline-flex items-center gap-1.5 font-semibold hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Recetas, Plantillas y Guías</span>
              </button>
            </div>
            <span className="font-mono-code text-[11px] text-[#5B5B66] dark:text-[#A09E97]">
              Pulsa ⌘K / Ctrl+K para buscar en toda la plataforma
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
