import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Camera,
  Film,
  Braces,
  Layers,
  Clock,
  Sliders,
} from 'lucide-react';
import { ModuleId } from '../data/modulesData';
import { VISUAL_LIBRARY_PATHS } from '../data/visualLibraryRegistry';
import { ResilientImage } from './ResilientImage';

interface PromptFundamentalsProps {
  onJumpToSection: (sectionId: string, moduleId?: ModuleId) => void;
  onTryExampleInBuilder: (mode: 'photo' | 'video', promptText: string) => void;
}

const SEVEN_ELEMENTS = [
  {
    num: '01',
    name: 'Sujeto',
    question: '¿Qué queremos representar?',
    examples: 'Persona, animal, objeto, escultura, paisaje o escena comunitaria.',
  },
  {
    num: '02',
    name: 'Acción',
    question: '¿Qué está haciendo?',
    examples: 'Mirando a cámara, moldeando arcilla, caminando, flotando, girando.',
  },
  {
    num: '03',
    name: 'Escenario',
    question: '¿Dónde sucede?',
    examples: 'Taller de artista, calle en Medellín, estudio neutro, páramo con niebla.',
  },
  {
    num: '04',
    name: 'Tipo de imagen',
    question: '¿Qué formato visual buscamos?',
    examples: 'Fotografía editorial, ilustración botánica, grabado, cartel o video.',
  },
  {
    num: '05',
    name: 'Estilo visual',
    question: '¿Cómo queremos que se vea?',
    examples: 'Editorial contemporáneo, documental 35mm, Neo Noir, surrealismo.',
  },
  {
    num: '06',
    name: 'Iluminación y tono',
    question: '¿Qué atmósfera tendrá?',
    examples: 'Luz lateral suave de ventana, Rembrandt dramático, hora dorada cálida.',
  },
  {
    num: '07',
    name: 'Composición y calidad',
    question: '¿Cómo se organiza el cuadro?',
    examples: 'Plano medio, ángulo contrapicado, lente 85mm, textura real de piel, 4:5.',
  },
];

const PROMPT_BASIC = 'Hazme un retrato profesional.';

const PROMPT_IMPROVED =
  'Crea un retrato fotográfico profesional de una mujer adulta, mirando directamente a cámara, con iluminación lateral suave de ventana, fondo gris neutro, encuadre de primer plano, estilo editorial contemporáneo, textura natural de piel y alta definición.';

const VIDEO_EXAMPLE_PROMPT =
  'Video cinematográfico de una mujer caminando lentamente por una terraza urbana en Medellín al atardecer. La cámara realiza un travelling lateral suave acompañando su movimiento. El cabello se mueve con la brisa, luz dorada lateral, 24fps, duración de 6 segundos, formato 9:16.';

export const PromptFundamentals: React.FC<PromptFundamentalsProps> = ({
  onJumpToSection,
  onTryExampleInBuilder,
}) => {
  const [activeTab, setActiveTab] = useState<'que-es' | 'anatomia' | 'imagen-video' | 'ejercicio'>('que-es');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const ROUTE_STEPS: {
    step: string;
    title: string;
    summary: string;
    targetId: string;
    moduleId?: ModuleId;
    icon: React.ReactNode;
  }[] = [
    {
      step: '01 · Entender',
      title: 'Qué es un Prompt',
      summary: 'Aprende la fórmula de 7 elementos y la diferencia entre imagen y video.',
      targetId: 'fundamentos',
      icon: <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    },
    {
      step: '02 · Explorar',
      title: 'Biblioteca Visual (26 Módulos)',
      summary: 'Imagen, óptica, luz, narrativa, storyboard, worldbuilding, 3D, sonido y ética.',
      targetId: 'biblioteca',
      moduleId: 'mod-01',
      icon: <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    },
    {
      step: '03 · Experimentar',
      title: 'Laboratorios & Film Director',
      summary: 'Simulador de luz, cámara 3D, storyboard, color HEX y proyecto IA en 8 etapas.',
      targetId: 'laboratorios',
      icon: <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    },
    {
      step: '04 · Producir',
      title: 'Constructor, JSON & Academia',
      summary: 'Arma prompts listos, extrae estilo JSON local y practica directo en apps IA.',
      targetId: 'builder',
      icon: <Braces className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    },
  ];

  return (
    <section
      id="fundamentos"
      className="py-14 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 transition-colors scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Top Row: Section Header + Mapa de la Plataforma */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1.5">
                <span>MÓDULO 00</span>
                <span aria-hidden="true" className="text-stone-400">/</span>
                <span>FUNDAMENTOS DE PROMPTS E IA VISUAL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                ¿Qué es un Prompt y cómo funciona esta guía?
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1.5 max-w-2xl leading-relaxed">
                Un <strong>prompt</strong> es la instrucción escrita o visual con la que comunicamos nuestra intención creativa a una inteligencia artificial. No requiere programar ni memorizar código: requiere claridad visual.
              </p>
            </div>

            <div className="text-xs font-mono-code text-stone-500 dark:text-stone-400 shrink-0">
              Guía Núcleo Colectivo · 26 Módulos + 6 Labs
            </div>
          </div>

          {/* 4-Stage Navigation Roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ROUTE_STEPS.map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => onJumpToSection(item.targetId, item.moduleId)}
                className="p-4 text-left rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono-code uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
                      {item.step}
                    </span>
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-mono-code font-semibold text-stone-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center gap-1">
                  <span>Ir a sección</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>

          {/* Quick Directory Links to All Sections */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono-code text-stone-600 dark:text-stone-400 pt-1">
            <span className="font-bold uppercase text-stone-500">Acceso rápido:</span>
            {[
              { label: 'Laboratorio JSON', target: 'json-lab' },
              { label: 'Directorio Herramientas IA', target: 'herramientas-academia' },
              { label: 'AI Film Director (8 Etapas)', target: 'film-director' },
              { label: 'Recetas Maestras', target: 'recetas' },
              { label: 'Diccionario Comandos', target: 'diccionario' },
              { label: 'Plantillas Universales', target: 'plantillas' },
            ].map((lnk) => (
              <button
                key={lnk.target}
                type="button"
                onClick={() => onJumpToSection(lnk.target)}
                className="hover:text-amber-700 dark:hover:text-amber-400 underline underline-offset-2"
              >
                {lnk.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Educational Tabs */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden shadow-xs">
          {/* Tab Bar */}
          <div
            role="tablist"
            aria-label="Fundamentos de qué es un prompt"
            className="flex flex-wrap border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 pt-3 gap-1.5"
          >
            {[
              { id: 'que-es', label: '1. ¿Qué es un Prompt? (Básico vs Pro)' },
              { id: 'anatomia', label: '2. Los 7 Elementos y Fórmula' },
              { id: 'imagen-video', label: '3. Imagen vs Video' },
              { id: 'ejercicio', label: '4. Ejercicio Práctico (15 min)' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
                    active
                      ? 'border-amber-500 text-stone-950 dark:text-amber-300 bg-[#FAF8F5] dark:bg-stone-950'
                      : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Panel Content */}
          <div className="p-6">
            {/* TAB 1: QUÉ ES UN PROMPT */}
            {activeTab === 'que-es' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <h3 className="text-xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                      La diferencia entre pedir a ciegas y dirigir una escena
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                      Cuando escribimos un prompt corto y ambiguo, la IA rellena los vacíos con clichés genéricos. Al describir intención, luz, encuadre y materialidad, pasamos de usuarios pasivos a <strong>directores de arte</strong>.
                    </p>
                  </div>

                  {/* Comparison: Basic vs Improved */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-[11px] font-mono-code uppercase tracking-wider text-stone-500 font-bold">
                        Prompt Básico (Ambiguo)
                      </span>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-200 italic">
                        «{PROMPT_BASIC}»
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                        Resultado frecuente: rostro genérico, piel plástica, luz plana y fondo aleatorio.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border-2 border-amber-400/80 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                          Prompt Bien Construido
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(PROMPT_IMPROVED, 'improved')}
                          className="text-[11px] font-mono-code text-stone-600 dark:text-stone-300 hover:text-amber-600 flex items-center gap-1"
                        >
                          {copiedKey === 'improved' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                        «{PROMPT_IMPROVED}»
                      </p>
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                          Sujeto + luz + fondo + textura definidos
                        </span>
                        <button
                          type="button"
                          onClick={() => onTryExampleInBuilder('photo', PROMPT_IMPROVED)}
                          className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <span>Probar en Constructor</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Qué podemos crear con IA */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {[
                      { label: 'Imágenes', desc: 'Fotografía, ilustración y afiches' },
                      { label: 'Videos', desc: 'Escenas, cámara y secuencias' },
                      { label: 'Arte y Diseño', desc: 'Conceptos y prototipos gráficos' },
                      { label: 'JSON Reutilizable', desc: 'Estilos consistentes en serie' },
                    ].map((cap) => (
                      <div
                        key={cap.label}
                        className="p-3 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                      >
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {cap.label}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          {cap.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Visual Reference */}
                <div className="lg:col-span-5">
                  <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 shadow-sm">
                    <ResilientImage
                      src={VISUAL_LIBRARY_PATHS.lightComparison}
                      alt="Comparación visual mostrando cómo cambia un retrato según las instrucciones del prompt"
                      objectPosition="top"
                      containerClassName="w-full h-64"
                    />
                    <div className="p-3.5 bg-stone-950 text-stone-200 text-xs space-y-1">
                      <div className="font-mono-code text-[11px] text-amber-400 uppercase font-bold">
                        Misma idea · Dos prompts distintos
                      </div>
                      <p className="text-stone-300 leading-relaxed">
                        Describir dirección de luz, encuadre y fondo transforma por completo la lectura emocional sin escribir una sola línea de código.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LOS 7 ELEMENTOS FUNDAMENTALES */}
            {activeTab === 'anatomia' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                      Los 7 Elementos Fundamentales de un Buen Prompt
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      No siempre necesitas usar los siete a la vez; selecciona los que son clave para comunicar tu idea con precisión.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        '[SUJETO] + [ACCIÓN] + [ESCENARIO] + [TIPO DE IMAGEN] + [ESTILO VISUAL] + [ILUMINACIÓN Y TONO] + [COMPOSICIÓN Y CALIDAD]',
                        'formula'
                      )
                    }
                    className="px-3.5 py-2 text-xs font-mono-code font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1.5 shrink-0"
                  >
                    {copiedKey === 'formula' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'formula' ? 'Fórmula Copiada' : 'Copiar Fórmula Rápida'}</span>
                  </button>
                </div>

                {/* Formula Bar */}
                <div className="p-3.5 rounded-lg bg-stone-950 text-amber-300 font-mono-code text-xs whitespace-normal break-words leading-relaxed">
                  FÓRMULA RÁPIDA: SUJETO + ACCIÓN + ESCENARIO + TIPO DE IMAGEN + ESTILO + ILUMINACIÓN/TONO + COMPOSICIÓN/CALIDAD
                </div>

                {/* 7 Elements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SEVEN_ELEMENTS.map((el) => (
                    <div
                      key={el.num}
                      className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono-code font-bold text-amber-700 dark:text-amber-400">
                          {el.num} · {el.name}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {el.question}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {el.examples}
                      </p>
                    </div>
                  ))}
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono-code font-bold text-amber-800 dark:text-amber-400">
                        + LÍMITES CLAROS
                      </span>
                      <p className="text-xs text-stone-700 dark:text-stone-300 mt-1.5 leading-relaxed">
                        Indica también qué evitar: piel plástica, textos inventados, deformaciones o saturación exagerada.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onJumpToSection('builder')}
                      className="mt-3 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <span>Usar en Constructor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: IMAGEN VS VIDEO */}
            {activeTab === 'imagen-video' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <h3 className="text-xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                      Diferencias clave al escribir prompts de Imagen vs Video
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                      Una imagen describe un instante congelado. Un video describe qué ocurre a lo largo del tiempo: requiere definir <strong>Sujeto + Acción + Movimiento de Cámara + Evolución temporal</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-stone-900 dark:text-stone-100 uppercase">
                        <Camera className="w-4 h-4 text-amber-600" />
                        <span>Prompt de Imagen</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                        <li>• Describe una escena y composición única.</li>
                        <li>• Fija la iluminación de un instante preciso.</li>
                        <li>• Prioriza texturas, lente y encuadre.</li>
                        <li>• Formato final: 1:1, 4:5, 3:2 o 16:9.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-amber-400/70 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-amber-700 dark:text-amber-400 uppercase">
                        <Film className="w-4 h-4" />
                        <span>Prompt de Video</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                        <li>• Describe una secuencia con inicio y evolución.</li>
                        <li>• Define un movimiento claro de cámara (travelling, dolly, órbita).</li>
                        <li>• Indica física ambiental (viento, luz cambiante, lluvia).</li>
                        <li>• Especifica ritmo (24fps, cámara lenta, 6–8 segundos).</li>
                      </ul>
                    </div>
                  </div>

                  {/* Video Example Ready to Try */}
                  <div className="p-4 rounded-lg bg-stone-950 text-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono-code uppercase font-bold text-amber-400">
                        Ejemplo de Prompt Audiovisual (Guía Parte 1)
                      </span>
                      <button
                        type="button"
                        onClick={() => onTryExampleInBuilder('video', VIDEO_EXAMPLE_PROMPT)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-amber-400 text-stone-950 rounded hover:bg-amber-300 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Cargar en Modo Video</span>
                      </button>
                    </div>
                    <p className="text-xs font-mono-code leading-relaxed text-stone-300">
                      «{VIDEO_EXAMPLE_PROMPT}»
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 shadow-sm">
                    <ResilientImage
                      src={VISUAL_LIBRARY_PATHS.camCinemaRig}
                      alt="Cámara de cine sobre estabilizador Steadicam y rieles de movimiento orbital"
                      containerClassName="w-full h-64"
                    />
                    <div className="p-3.5 bg-stone-950 text-stone-200 text-xs">
                      <span className="font-mono-code text-[11px] text-amber-400 uppercase font-bold block mb-1">
                        Regla de Oro en Video IA
                      </span>
                      <span className="text-stone-300">
                        Pide un solo movimiento de cámara coherente por clip (ej. Travelling lateral o Dolly-In lento) para evitar deformaciones o cortes bruscos.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: EJERCICIO PRÁCTICO DE 15 MINUTOS */}
            {activeTab === 'ejercicio' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-amber-700 dark:text-amber-400 uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Reto de Laboratorio · 15 Minutos</span>
                    </div>
                    <h3 className="text-xl font-bold font-serif-title text-stone-900 dark:text-stone-100 mt-0.5">
                      De una idea sencilla a una imagen y un video
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onTryExampleInBuilder(
                        'photo',
                        'Una persona caminando bajo la lluvia nocturna en una calle empedrada, reflejos cálidos de farolas sobre el pavimento húmedo, plano medio, lente 35mm f/2.0'
                      )
                    }
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1.5 shrink-0"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Iniciar Reto en Constructor</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    {
                      step: 'Paso 01',
                      time: '2 min',
                      title: 'Idea sencilla',
                      desc: 'Escribe una escena base, ej. «una persona caminando bajo la lluvia».',
                    },
                    {
                      step: 'Paso 02',
                      time: '4 min',
                      title: 'Aplica los 7 elementos',
                      desc: 'Añade lugar, estilo editorial, tipo de plano, luz y textura real.',
                    },
                    {
                      step: 'Paso 03',
                      time: '4 min',
                      title: 'Genera y revisa',
                      desc: 'Evalúa si la luz, la composición y el gesto responden a tu intención.',
                    },
                    {
                      step: 'Paso 04',
                      time: '3 min',
                      title: 'Pasa a video',
                      desc: 'Usa tu imagen como referencia y describe solo movimiento de cámara y ambiente.',
                    },
                    {
                      step: 'Paso 05',
                      time: '2 min',
                      title: 'Itera 1 variable',
                      desc: 'Compara resultados cambiando solo el lente (35mm vs 85mm) o la luz.',
                    },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono-code">
                        <span className="font-bold text-amber-700 dark:text-amber-400">{s.step}</span>
                        <span className="text-stone-400">{s.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{s.title}</h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
