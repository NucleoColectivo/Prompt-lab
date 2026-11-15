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
} from 'lucide-react';
import type { AppSectionId } from '../types/navigation';
import { AI_TOOLS_DIRECTORY } from '../data/extendedModulesData';
import { ToolBrandLogo } from './ToolBrandLogo';

interface HomeViewProps {
  onNavigateSection: (section: AppSectionId, subTab?: string) => void;
}

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
    section: 'fundamentos',
    code: 'MÓDULO 00 · INICIO GUIADO',
    title: '¿Qué es un Prompt? y Fórmula de 7 Elementos',
    whatYouFind:
      'Explicación clara sin tecnicismos de cómo funciona un prompt, comparativa entre una instrucción ambigua y una dirección de arte completa, diferencias Imagen vs Video y reto práctico de 15 minutos.',
    idealFor: 'Personas que comienzan desde cero o docentes preparando su primera clase.',
    image: '/images/comp_lighting_rembrandt_highkey_1794593014446.jpg',
    icon: <BookOpen className="w-4 h-4 text-amber-600" />,
  },
  {
    section: 'biblioteca',
    code: 'MÓDULOS 01–26 · ENCICLOPEDIA VISUAL',
    title: 'Biblioteca Visual de Dirección de Arte y Cine',
    whatYouFind:
      '26 módulos ilustrados con ejemplos ES/EN, diagramas técnicos y fichas prácticas: óptica 8–400mm, cámaras, iluminación, color, storytelling, storyboard, worldbuilding, 3D, VFX, sonido y ética.',
    idealFor: 'Consultar referentes visuales, estudiar planos o copiar prompts probados.',
    image: '/images/comp_focal_35_85_1794593013583.jpg',
    icon: <Layers className="w-4 h-4 text-amber-600" />,
  },
  {
    section: 'laboratorios',
    subTab: 'labs',
    code: '5 SIMULADORES + JSON LOCAL',
    title: 'Laboratorios Interactivos y Extractor JSON',
    whatYouFind:
      'Simulador de iluminación, visor de cámara 3D y distancia focal, comparador A/B, editor de Storyboard, selector HEX y analizador local de fotografías para convertir cualquier estilo en JSON/YAML.',
    idealFor: 'Experimentar cómo cambian la luz, los lentes y el color antes de generar.',
    image: '/images/comp_json_style_transfer_1794593016651.jpg',
    icon: <Sliders className="w-4 h-4 text-amber-600" />,
  },
  {
    section: 'film-director',
    code: '8 ETAPAS DE PRODUCCIÓN',
    title: 'Planificador Audiovisual Completo',
    whatYouFind:
      'Transforma una idea breve en concepto creativo, logline, arco narrativo, dirección de fotografía, desglose de escenas con prompts de imagen/video por plano, diseño sonoro y plan de montaje.',
    idealFor: 'Cortometrajes, cápsulas culturales, documentales de barrio y videoarte.',
    image: '/images/mod_video_camera_rig_1794593015892.jpg',
    icon: <Clapperboard className="w-4 h-4 text-amber-600" />,
  },
  {
    section: 'builder',
    code: 'CONSTRUCTOR + PDF / PNG',
    title: 'Constructor Maestro de Prompts y Fichas Taller',
    whatYouFind:
      'Ensambla prompts de Fotografía o Video paso a paso con detector de incompatibilidades ópticas, colecciones por proyecto, exportador de fichas PDF/PNG para talleres y copia directa a apps IA.',
    idealFor: 'Armar prompts listos para pegar en ChatGPT, Midjourney, FLUX o Runway.',
    image: '/images/recipe_luxury_product_1794436192275.jpg',
    icon: <Sparkles className="w-4 h-4 text-amber-600" />,
  },
  {
    section: 'academia',
    code: `${AI_TOOLS_DIRECTORY.length} APPS + RETOS + GLOSARIO`,
    title: 'Directorio de Aplicaciones IA, Retos y Glosario ES–EN',
    whatYouFind:
      'Catálogo visual con logos y ejemplos de Google AI Studio, Gemini, Claude, NotebookLM, ChatGPT, CapCut, Lovable, Bolt, Runway y más; acompañado de rutas, retos interactivos y diccionario bilingüe.',
    idealFor: 'Elegir en qué app practicar cada tarea sin perder tiempo.',
    image: '/images/recipe_generative_art_1794436193380.jpg',
    icon: <Wrench className="w-4 h-4 text-amber-600" />,
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

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateSection }) => {
  const featuredApps = AI_TOOLS_DIRECTORY.filter((t) => FEATURED_APP_IDS.includes(t.id));

  return (
    <div className="bg-[#FAF8F5] dark:bg-stone-950 transition-colors">
      {/* 1. Qué es esta página + Cómo usarla en 3 pasos */}
      <section className="py-12 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>QUÉ ENCUENTRAS EN ESTA PÁGINA</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100 leading-tight">
                Una caja de herramientas abierta para dirigir imagen, cine, diseño y audio con IA
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                <strong>Núcleo Colectivo · Visual & Motion Prompt Lab</strong> reúne en un solo lugar teoría visual, simuladores interactivos, un constructor de prompts, un planificador audiovisual y un directorio con más de {AI_TOOLS_DIRECTORY.length} aplicaciones reales. No necesitas programar ni configurar claves API: aprendes el lenguaje visual aquí, copias tu prompt y lo practicas directamente en las apps externas.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              {[
                {
                  step: 'PASO 01 · COMPRENDER',
                  title: 'Aprende el lenguaje visual sin jerga',
                  desc: 'Empieza en Fundamentos (Módulo 00) o consulta los 26 módulos con fotografías, diagramas y ejemplos reales.',
                },
                {
                  step: 'PASO 02 · DISEÑAR Y SIMULAR',
                  title: 'Prueba luz, óptica, JSON o guion aquí mismo',
                  desc: 'Usa los Laboratorios, el Planificador de 8 Etapas o el Constructor Maestro con exportación a PDF/PNG.',
                },
                {
                  step: 'PASO 03 · PRACTICAR EN APPS REALES',
                  title: 'Lleva tu prompt a la herramienta ideal',
                  desc: 'Abre Google AI Studio, Gemini, Claude, NotebookLM, CapCut, Lovable, Bolt, Midjourney o Runway en un clic.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-3.5 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800"
                >
                  <div className="text-[11px] font-mono-code font-bold text-amber-700 dark:text-amber-400">
                    {item.step}
                  </div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {item.title}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mapa Visual de Todas las Secciones de la Plataforma */}
      <section className="py-14 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1">
                EXPLORAR POR SECCIÓN
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                ¿Qué hay dentro de cada área del laboratorio?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('recursos', 'diccionario')}
              className="px-4 py-2 text-xs font-mono-code font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:border-amber-500 rounded-lg text-stone-800 dark:text-stone-200 inline-flex items-center gap-2 shrink-0"
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-600" />
              <span>Ir a Recetas, Comandos (180+) y Plantillas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_SECTIONS.map((item) => (
              <article
                key={item.title}
                className="rounded-xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 transition-all flex flex-col justify-between shadow-xs group"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-stone-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono-code text-amber-300 font-bold">
                      <span>{item.code}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold font-serif-title text-stone-900 dark:text-stone-100 leading-snug">
                        {item.title}
                      </h3>
                      <span className="shrink-0 mt-1">{item.icon}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.whatYouFind}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <strong className="text-stone-700 dark:text-stone-300">Ideal para:</strong>{' '}
                      {item.idealFor}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => onNavigateSection(item.section, item.subTab)}
                    className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider bg-[#FAF8F5] dark:bg-stone-950 hover:bg-amber-400 hover:text-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 hover:border-amber-400 rounded-lg transition-colors flex items-center justify-center gap-2"
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

      {/* 3. Vitrina rápida de Apps IA externas para practicar */}
      <section className="py-12 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1">
                ECOSISTEMA DE PRÁCTICA DIRECTA
              </div>
              <h2 className="text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                Aplicaciones recomendadas para probar tus prompts
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                Construye aquí tus instrucciones y llévalas directo a asistentes multimodales, editores de video, prototipado web o generadores visuales.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('academia')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg inline-flex items-center gap-1.5 shrink-0"
            >
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
                className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500 transition-colors flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5">
                  <ToolBrandLogo
                    toolId={app.id}
                    brandColor={app.brandColor}
                    shortCode={app.shortCode}
                    name={app.name}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      {app.name}
                    </div>
                    <div className="text-[10px] font-mono-code text-stone-500 truncate">
                      {app.area}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono-code text-amber-700 dark:text-amber-400 font-semibold">
                  <span>{app.accessType.split('/')[0].trim()}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Recursos rápidos y Talleres */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase font-bold text-amber-700 dark:text-amber-400">
                <FileDown className="w-4 h-4" />
                <span>PARA DOCENTES, TALLERES Y PRODUCCIÓN</span>
              </div>
              <h3 className="text-xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                Exporta fichas técnicas en PDF / PNG y consulta 180+ comandos listos
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Cada parámetro del Constructor puede imprimirse en tarjetas visuales para sesiones presenciales o descargarse en JSON/TXT para documentar proyectos colectivos.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onNavigateSection('recursos', 'recetas')}
                className="px-4 py-2.5 text-xs font-semibold bg-[#FAF8F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 hover:border-amber-500 rounded-lg text-stone-800 dark:text-stone-200"
              >
                Recetas Maestras
              </button>
              <button
                type="button"
                onClick={() => onNavigateSection('recursos', 'plantillas')}
                className="px-4 py-2.5 text-xs font-semibold bg-[#FAF8F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 hover:border-amber-500 rounded-lg text-stone-800 dark:text-stone-200"
              >
                Plantillas Universales
              </button>
              <button
                type="button"
                onClick={() => onNavigateSection('builder')}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg"
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
