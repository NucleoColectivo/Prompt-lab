import React from 'react';
import {
  BookOpen,
  Layers,
  Sliders,
  Clapperboard,
  Sparkles,
  Wrench,
  BookMarked,
  ArrowRight,
  Compass,
  FileDown,
  ExternalLink,
  Images,
  PencilRuler,
  History,
  ShoppingBag,
  Globe,
  Video,
  Scale,
  Film,
} from 'lucide-react';
import type { AppSectionId } from '../types/navigation';
import { AI_TOOLS_DIRECTORY } from '../data/extendedModulesData';
import { VISUAL_LIBRARY_PATHS } from '../data/visualLibraryRegistry';
import { STUDIO_MEDIA_ASSETS } from '../data/creativeStudiosData';
import { ResilientImage } from './ResilientImage';
import { ToolBrandLogo } from './ToolBrandLogo';

interface HomeViewProps {
  onNavigateSection: (section: AppSectionId, subTab?: string) => void;
  onOpenGalleryCollection?: (collectionTag: string) => void;
  onOpenWelcomeWizard?: () => void;
}

const CURATED_COLLECTIONS_PREVIEW: {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
}[] = [
  {
    id: 'Retrato',
    number: '01',
    title: 'Retrato',
    subtitle: 'Rembrandt, Split, High Key y textura real',
    image: VISUAL_LIBRARY_PATHS.lightRembrandt,
    accent: '#F8C300',
  },
  {
    id: 'Paisaje',
    number: '02',
    title: 'Paisaje',
    subtitle: 'Andes brumosos, arquitectura y escala territorial',
    image: VISUAL_LIBRARY_PATHS.compExtremeWide,
    accent: '#326BFF',
  },
  {
    id: 'Producto',
    number: '03',
    title: 'Producto',
    subtitle: 'Salpicaduras 1/4000s, bodegón y lujo mineral',
    image: VISUAL_LIBRARY_PATHS.adSplash,
    accent: '#F8C300',
  },
  {
    id: 'Arte Digital',
    number: '04',
    title: 'Arte Digital',
    subtitle: 'Botánica, hibridación y arte generativo',
    image: VISUAL_LIBRARY_PATHS.artHybridOrganism,
    accent: '#7545D6',
  },
  {
    id: 'Moda',
    number: '05',
    title: 'Moda',
    subtitle: 'Editorial brutalista, tejidos crudos y duotono',
    image: VISUAL_LIBRARY_PATHS.photoFashion,
    accent: '#7545D6',
  },
  {
    id: 'Cine',
    number: '06',
    title: 'Cine',
    subtitle: 'Teal & Orange, OTS, ángulo holandés y 35mm',
    image: VISUAL_LIBRARY_PATHS.colorTealOrange,
    accent: '#326BFF',
  },
  {
    id: 'Macro y Naturaleza',
    number: '07',
    title: 'Macro y Naturaleza',
    subtitle: 'Óptica 100mm 1:1, rocío y microtexturas',
    image: VISUAL_LIBRARY_PATHS.focal100mmMacro,
    accent: '#F8C300',
  },
  {
    id: 'Motion y Video',
    number: '08',
    title: 'Motion y Video',
    subtitle: 'Drone FPV, mapping, stop motion y VFX fluidos',
    image: VISUAL_LIBRARY_PATHS.videoDroneFpv,
    accent: '#326BFF',
  },
];

const PLATFORM_SECTIONS: {
  section: AppSectionId;
  subTab?: string;
  code: string;
  title: string;
  whatYouFind: string;
  idealFor: string;
  image: string;
  icon: React.ReactNode;
}[] = [
  {
    section: 'galeria',
    code: 'PRIORIDAD 01 · 8 COLECCIONES',
    title: 'Galería Visual Experimental e Interactiva',
    whatYouFind:
      'Explora fotografías y fotogramas organizados en 8 colecciones curadas con prompts ES/EN, negative prompt, cámara/lente, filtro combinado, visor Lightbox y envío directo al Constructor.',
    idealFor: 'Encontrar referentes reales y experimentar variaciones en un clic.',
    image: VISUAL_LIBRARY_PATHS.photoNeoNoir,
    icon: <Images className="w-4 h-4 text-[#7545D6]" />,
  },
  {
    section: 'fundamentos',
    code: 'MÓDULO 00 · INICIO GUIADO',
    title: '¿Qué es un Prompt? y Fórmula de 7 Elementos',
    whatYouFind:
      'Explicación clara sin tecnicismos de cómo funciona un prompt, comparativa entre una instrucción ambigua y una dirección de arte completa, diferencias Imagen vs Video y reto práctico de 15 minutos.',
    idealFor: 'Personas que comienzan desde cero o docentes preparando su primera clase.',
    image: VISUAL_LIBRARY_PATHS.lightComparison,
    icon: <BookOpen className="w-4 h-4 text-[#326BFF]" />,
  },
  {
    section: 'biblioteca',
    code: 'MÓDULOS 01–26 · 130 FICHAS',
    title: 'Biblioteca Visual de Dirección de Arte y Cine',
    whatYouFind:
      '26 módulos ilustrados con ejemplos ES/EN, diagramas técnicos y fichas prácticas: óptica 8–400mm, cámaras, iluminación, color, storytelling, storyboard, worldbuilding, 3D, VFX, sonido y ética.',
    idealFor: 'Consultar referentes visuales, estudiar planos o copiar prompts probados.',
    image: VISUAL_LIBRARY_PATHS.focalComparison,
    icon: <Layers className="w-4 h-4 text-[#326BFF]" />,
  },
  {
    section: 'laboratorios',
    subTab: 'labs',
    code: '5 SIMULADORES + JSON LOCAL',
    title: 'Laboratorios Interactivos y Extractor JSON',
    whatYouFind:
      'Simulador de iluminación, visor de cámara 3D y distancia focal, comparador A/B, editor de Storyboard, selector HEX y analizador local de fotografías para convertir cualquier estilo en JSON/YAML.',
    idealFor: 'Experimentar cómo cambian la luz, los lentes y el color antes de generar.',
    image: VISUAL_LIBRARY_PATHS.colorJsonTransfer,
    icon: <Sliders className="w-4 h-4 text-[#7545D6]" />,
  },
  {
    section: 'film-director',
    code: '8 ETAPAS DE PRODUCCIÓN',
    title: 'Planificador Audiovisual Completo',
    whatYouFind:
      'Transforma una idea breve en concepto creativo, logline, arco narrativo, dirección de fotografía, desglose de escenas con prompts de imagen/video por plano, diseño sonoro y plan de montaje.',
    idealFor: 'Cortometrajes, cápsulas culturales, documentales de barrio y videoarte.',
    image: VISUAL_LIBRARY_PATHS.camCinemaRig,
    icon: <Clapperboard className="w-4 h-4 text-[#326BFF]" />,
  },
  {
    section: 'builder',
    code: '12 MÓDULOS + PDF / PNG',
    title: 'Constructor Maestro de Prompts y Fichas Taller',
    whatYouFind:
      'Ensambla prompts de Fotografía o Video paso a paso con detector de incompatibilidades ópticas, colecciones por proyecto, exportador de fichas PDF/PNG para talleres y copia directa a apps IA.',
    idealFor: 'Armar prompts listos para pegar en ChatGPT, Midjourney, FLUX o Runway.',
    image: VISUAL_LIBRARY_PATHS.adLuxury,
    icon: <Sparkles className="w-4 h-4 text-[#F8C300]" />,
  },
];

const FEATURED_APP_IDS = [
  'tool-google-aistudio',
  'tool-gemini',
  'tool-claude',
  'tool-notebooklm',
  'tool-chatgpt',
  'tool-capcut',
  'tool-lovable',
  'tool-bolt',
  'tool-midjourney',
  'tool-runway',
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateSection,
  onOpenGalleryCollection,
  onOpenWelcomeWizard,
}) => {
  const featuredApps = AI_TOOLS_DIRECTORY.filter((t) => FEATURED_APP_IDS.includes(t.id));

  return (
    <div className="bg-[#F4F2ED] dark:bg-[#101014] transition-colors">
      {/* 0. ¿QUÉ QUIERES HACER HOY? — Entrada dual por Objetivos y Disciplinas */}
      <section className="py-14 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
                ENTRADA DIRECTA POR OBJETIVO · SIN BARRERAS TÉCNICAS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-tight text-balance">
                ¿Qué quieres hacer hoy?
              </h2>
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] max-w-2xl">
                Elige tu objetivo actual —desde crear tu primera imagen hasta transformar un boceto en papel, restaurar una fotografía antigua, lanzar productos o construir una página web— o navega por disciplinas técnicas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('academia', 'challenges')}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ver 6 Retos Prácticos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Crear mi primera imagen',
                subtitle: 'Empieza desde cero con 6 pasos claros y glosario amigable, sin tecnicismos.',
                badge: 'NIVEL INICIAL · RETO 06',
                image: STUDIO_MEDIA_ASSETS.botanicalArt,
                icon: <Sparkles className="w-4 h-4 text-[#F8C300]" />,
                onClick: () => onNavigateSection('laboratorios', 'principiante'),
              },
              {
                title: 'Transformar un dibujo',
                subtitle: 'Sube un boceto o croquis en papel, limpia sombras y llévalo a 3D, ilustración o foto.',
                badge: 'DRAWING TO IMAGE · RETO 04',
                image: STUDIO_MEDIA_ASSETS.drawingTo3dRender,
                icon: <PencilRuler className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300]" />,
                onClick: () => onNavigateSection('laboratorios', 'dibujo'),
              },
              {
                title: 'Restaurar una fotografía',
                subtitle: 'Recupera retratos antiguos rayados o descoloridos conservando identidad y grano.',
                badge: 'PHOTO RESTORATION · RETO 02',
                image: STUDIO_MEDIA_ASSETS.restorationBeforeAfter,
                icon: <History className="w-4 h-4 text-[#326BFF] dark:text-[#F8C300]" />,
                onClick: () => onNavigateSection('laboratorios', 'restauracion'),
              },
              {
                title: 'Crear publicidad y productos',
                subtitle: 'Convierte objetos cotidianos en Packshots, Lifestyle, Hero Shots y Social Commerce.',
                badge: 'PRODUCT & COMMERCE · RETO 03',
                image: STUDIO_MEDIA_ASSETS.productCommerceStudio,
                icon: <ShoppingBag className="w-4 h-4 text-[#F8C300]" />,
                onClick: () => onNavigateSection('laboratorios', 'producto'),
              },
              {
                title: 'Diseñar una página web',
                subtitle: 'Construye prompts técnicos de UI/UX, responsive y WCAG para AI Studio, Bolt o Replit.',
                badge: 'WEB DESIGN BUILDER · RETO 05',
                image: STUDIO_MEDIA_ASSETS.webDesignShowcase,
                icon: <Globe className="w-4 h-4 text-[#326BFF] dark:text-[#F8C300]" />,
                onClick: () => onNavigateSection('laboratorios', 'web'),
              },
              {
                title: 'Crear un video o secuencia',
                subtitle: 'Planifica escenas en 8 etapas con movimientos de cámara, sonido y storyboard.',
                badge: 'CINE & MOTION · 8 ETAPAS',
                image: STUDIO_MEDIA_ASSETS.cinemaStudio,
                icon: <Video className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300]" />,
                onClick: () => onNavigateSection('film-director'),
              },
            ].map((goal) => (
              <button
                key={goal.title}
                type="button"
                onClick={goal.onClick}
                className="text-left rounded-2xl overflow-hidden bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-colors group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-[#101014]">
                    <ResilientImage
                      src={goal.image}
                      alt={goal.title}
                      aspectRatio="16:9"
                      containerClassName="w-full h-full"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/85 via-[#101014]/25 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 text-[10px] font-mono-code font-bold text-[#F8C300]">
                      {goal.badge}
                    </div>
                  </div>
                  <div className="p-5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] group-hover:text-[#326BFF] dark:group-hover:text-[#F8C300] transition-colors">
                        {goal.title}
                      </h3>
                      {goal.icon}
                    </div>
                    <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                      {goal.subtitle}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-4 text-xs font-mono-code font-bold text-[#326BFF] dark:text-[#F8C300] inline-flex items-center gap-1">
                  <span>Abrir laboratorio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          {/* Explorar por Disciplinas (navegación paralela) */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97] shrink-0">
              O EXPLORA POR DISCIPLINA:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Fotografía y Retrato', action: () => onOpenGalleryCollection ? onOpenGalleryCollection('Retrato') : onNavigateSection('galeria') },
                { label: 'Video y Cine', action: () => onNavigateSection('film-director') },
                { label: 'Diseño Web', action: () => onNavigateSection('laboratorios', 'web') },
                { label: 'Restauración', action: () => onNavigateSection('laboratorios', 'restauracion') },
                { label: 'Publicidad y Producto', action: () => onNavigateSection('laboratorios', 'producto') },
                { label: 'Arte Digital y Dibujo', action: () => onNavigateSection('laboratorios', 'dibujo') },
                { label: 'Interactivo, Tracking & Videoarte', action: () => onNavigateSection('laboratorios', 'interactivo') },
                { label: 'Ética IA y Sesgos', action: () => onNavigateSection('etica-ia') },
                { label: 'Documentales y Películas IA', action: () => onNavigateSection('movies-ia') },
              ].map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={d.action}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] transition-colors whitespace-nowrap"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1. Qué es esta página + Cómo usarla en 3 pasos */}
      <section
        id="que-encuentras"
        className="py-14 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#16161C] scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] font-bold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>QUÉ ENCUENTRAS EN ESTA PÁGINA</span>
                </div>
                {onOpenWelcomeWizard && (
                  <button
                    type="button"
                    onClick={onOpenWelcomeWizard}
                    className="px-3 py-1.5 text-[11px] font-mono-code font-bold uppercase tracking-wider bg-[#F8C300]/20 hover:bg-[#F8C300] text-[#101014] dark:text-[#F8C300] dark:hover:text-[#101014] border border-[#F8C300]/60 rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ver Tour 3 Pasos</span>
                  </button>
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-tight text-balance">
                Una plataforma híbrida para descubrir, comprender y dirigir imagen y video con IA
              </h2>
              <p className="text-sm sm:text-base text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                <strong>Núcleo Colectivo · Visual Prompt Lab</strong> integra en un solo ecosistema una galería curada de referencias visuales, enciclopedia técnica de 26 módulos, simuladores interactivos, constructor modular de 12 bloques, planificador audiovisual y directorio con {AI_TOOLS_DIRECTORY.length} aplicaciones reales. Aprendes aquí, copias tu prompt y lo practicas directamente en las apps externas.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              {[
                {
                  step: '01 · DESCUBRIR',
                  title: 'Explora la Galería Visual y 26 Módulos',
                  desc: 'Observa iluminación, lentes, color y encuadre con prompts bilingües reales y sin clichés.',
                },
                {
                  step: '02 · CONSTRUIR Y VARIAR',
                  title: 'Experimenta en el Constructor de 12 Módulos',
                  desc: 'Carga cualquier imagen de la galería al constructor, ajusta luz o lente y exporta PDF/PNG.',
                },
                {
                  step: '03 · PRACTICAR EN APPS REALES',
                  title: 'Lleva tu prompt a la herramienta ideal',
                  desc: 'Abre Google AI Studio, Gemini, Claude, NotebookLM, CapCut, Lovable, Bolt, Midjourney o Runway en un clic.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
                >
                  <div className="text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                    {item.step}
                  </div>
                  <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] mt-0.5">
                    {item.title}
                  </div>
                  <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Acceso Directo a las 8 Colecciones de la Galería Visual (Prioridad #1) */}
      <section className="py-14 border-b border-[#DEDAD0] dark:border-[#26262E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold mb-1">
                PRIORIDAD 01 · GALERÍA EXPERIMENTAL
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                8 Colecciones Curadas para Inspirar y Experimentar
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC] mt-1">
                Cada lámina incluye prompt en español e inglés, negative prompt, especificaciones técnicas y botón directo al Constructor.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('galeria')}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5 shrink-0"
            >
              <Images className="w-3.5 h-3.5" />
              <span>Abrir Galería Completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CURATED_COLLECTIONS_PREVIEW.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() =>
                  onOpenGalleryCollection
                    ? onOpenGalleryCollection(col.id)
                    : onNavigateSection('galeria')
                }
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] text-left transition-all"
              >
                <ResilientImage
                  src={col.image}
                  alt={`Colección ${col.title}`}
                  objectPosition="top"
                  containerClassName="w-full h-full"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/45 to-transparent" />
                <div className="absolute bottom-3 left-3.5 right-3.5 space-y-0.5">
                  <div className="text-[10px] font-mono-code font-bold text-[#F8C300]">
                    {col.number} · COLECCIÓN
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#F4F2ED] group-hover:text-[#F8C300] transition-colors">
                    {col.title}
                  </div>
                  <div className="text-[11px] text-[#D8D5CD] line-clamp-1">
                    {col.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Mapa Visual de Todas las Secciones de la Plataforma */}
      <section className="py-14 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#16161C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] font-bold mb-1">
                EXPLORAR POR SECCIÓN
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                ¿Qué hay dentro de cada área del laboratorio?
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigateSection('etica-ia')}
                className="px-4 py-2 text-xs font-mono-code font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] hover:opacity-90 rounded-lg inline-flex items-center gap-2"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Laboratorio de Ética IA</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateSection('movies-ia')}
                className="px-4 py-2 text-xs font-mono-code font-bold bg-[#7545D6] text-white hover:opacity-90 rounded-lg inline-flex items-center gap-2"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Documentales y Cine IA</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateSection('recursos', 'diccionario')}
                className="px-4 py-2 text-xs font-mono-code font-semibold bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] rounded-lg text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-2"
              >
                <BookMarked className="w-3.5 h-3.5 text-[#7545D6]" />
                <span>Ir a Recetas, Comandos y Plantillas</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_SECTIONS.map((item) => (
              <article
                key={item.title}
                className="rounded-xl overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-[#101014]">
                    <ResilientImage
                      src={item.image}
                      alt={item.title}
                      objectPosition="top"
                      containerClassName="w-full h-full"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/85 via-[#101014]/25 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono-code text-[#F8C300] font-bold">
                      <span>{item.code}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-snug">
                        {item.title}
                      </h3>
                      <span className="shrink-0 mt-1">{item.icon}</span>
                    </div>
                    <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                      {item.whatYouFind}
                    </p>
                    <p className="text-[11px] text-[#5B5B66] dark:text-[#A09E97] pt-2 border-t border-[#DEDAD0] dark:border-[#26262E]">
                      <strong className="text-[#101014] dark:text-[#F4F2ED]">Ideal para:</strong>{' '}
                      {item.idealFor}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => onNavigateSection(item.section, item.subTab)}
                    className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#18181F] hover:bg-[#F8C300] hover:text-[#101014] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Explorar esta sección</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Vitrina rápida de Apps IA externas para practicar */}
      <section className="py-12 border-b border-[#DEDAD0] dark:border-[#26262E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] font-bold mb-1">
                ECOSISTEMA DE PRÁCTICA DIRECTA
              </div>
              <h2 className="text-2xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                Aplicaciones recomendadas para probar tus prompts
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC] mt-1">
                Construye aquí tus instrucciones y llévalas directo a asistentes multimodales, editores de video, prototipado web o generadores visuales.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('academia')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Ver las {AI_TOOLS_DIRECTORY.length} Apps con Logos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {featuredApps.map((app) => (
              <a
                key={app.id}
                href={app.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] transition-colors flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5">
                  <ToolBrandLogo
                    toolId={app.id}
                    brandColor={app.brandColor}
                    shortCode={app.shortCode}
                    name={app.name}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] truncate group-hover:text-[#326BFF] dark:group-hover:text-[#F8C300]">
                      {app.name}
                    </div>
                    <div className="text-[10px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] truncate">
                      {app.area}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono-code text-[#326BFF] dark:text-[#F8C300] font-semibold">
                  <span>{app.accessType.split('/')[0].trim()}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recursos rápidos y Talleres */}
      <section className="py-10 bg-white dark:bg-[#16161C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase font-bold text-[#7545D6] dark:text-[#F8C300]">
                <FileDown className="w-4 h-4" />
                <span>PARA DOCENTES, TALLERES Y PRODUCCIÓN</span>
              </div>
              <h3 className="text-xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                Exporta fichas técnicas en PDF / PNG y consulta recetas y comandos listos
              </h3>
              <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                Cada parámetro del Constructor puede imprimirse en tarjetas visuales para sesiones presenciales o descargarse en JSON/TXT para documentar proyectos colectivos.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onNavigateSection('recursos', 'recetas')}
                className="px-4 py-2.5 text-xs font-semibold bg-white dark:bg-[#18181F] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] rounded-lg text-[#101014] dark:text-[#F4F2ED]"
              >
                Recetas Maestras
              </button>
              <button
                type="button"
                onClick={() => onNavigateSection('recursos', 'plantillas')}
                className="px-4 py-2.5 text-xs font-semibold bg-white dark:bg-[#18181F] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] rounded-lg text-[#101014] dark:text-[#F4F2ED]"
              >
                Plantillas Universales
              </button>
              <button
                type="button"
                onClick={() => onNavigateSection('builder')}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg"
              >
                Abrir Constructor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
