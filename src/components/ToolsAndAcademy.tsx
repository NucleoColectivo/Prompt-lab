import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  Trophy,
  Languages,
  ExternalLink,
  Search,
  Copy,
  Check,
  Download,
  ArrowRight,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  AI_TOOLS_DIRECTORY,
  CREATIVE_CHALLENGES,
  BILINGUAL_GLOSSARY,
  AiToolEntry,
} from '../data/extendedModulesData';
import type { ModuleId } from '../data/modulesData';

interface ToolsAndAcademyProps {
  onJumpToSection: (sectionId: string, moduleId?: ModuleId) => void;
}

const LEARNING_PATHS = [
  {
    level: 'Ruta 01 · Nivel Inicial',
    title: 'Primeros Prompts sin Complicaciones',
    duration: '45 min',
    steps: [
      'Leer Módulo 00: Qué es un Prompt y la fórmula de 7 elementos.',
      'Probar Módulo 01 (Ilustración y Fotografía) copiando 2 ejemplos.',
      'Completar el Reto 01 (Una persona, cuatro luces) en el Lab de Iluminación.',
    ],
    targetSection: 'fundamentos',
    moduleId: undefined as ModuleId | undefined,
  },
  {
    level: 'Ruta 02 · Nivel Intermedio',
    title: 'Óptica, Video Cinematográfico y JSON',
    duration: '90 min',
    steps: [
      'Explorar Módulo 02 (Óptica 8–400mm) y Módulo 05 (Planos y Composición).',
      'Combinar movimientos de cámara en Laboratorios D y armar Storyboard B.',
      'Extraer estilo visual de una fotografía en el Laboratorio JSON (Módulo 07).',
    ],
    targetSection: 'laboratorios',
    moduleId: undefined as ModuleId | undefined,
  },
  {
    level: 'Ruta 03 · Docentes y Talleres',
    title: 'Producción Colectiva, Ética y Material Impreso',
    duration: '120 min',
    steps: [
      'Diseñar un proyecto comunitario completo con AI Film Director (8 etapas).',
      'Revisar Módulo 25 (Accesibilidad) y Módulo 26 (Procedencia y Consentimiento).',
      'Exportar fichas técnicas PDF/PNG desde el Constructor para trabajo en aula.',
    ],
    targetSection: 'film-director',
    moduleId: 'mod-26' as ModuleId,
  },
];

export const ToolsAndAcademy: React.FC<ToolsAndAcademyProps> = ({ onJumpToSection }) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'challenges' | 'glossary'>('tools');
  const [areaFilter, setAreaFilter] = useState<'Todas' | AiToolEntry['area']>('Todas');
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('nc_challenges_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nc_challenges_v1', JSON.stringify(completedSteps));
    } catch {
      // ignore
    }
  }, [completedSteps]);

  const toggleStep = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const filteredTools = useMemo(() => {
    if (areaFilter === 'Todas') return AI_TOOLS_DIRECTORY;
    return AI_TOOLS_DIRECTORY.filter((t) => t.area === areaFilter);
  }, [areaFilter]);

  const filteredGlossary = useMemo(() => {
    const q = glossaryQuery.trim().toLowerCase();
    if (!q) return BILINGUAL_GLOSSARY;
    return BILINGUAL_GLOSSARY.filter(
      (item) =>
        item.es.toLowerCase().includes(q) ||
        item.en.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [glossaryQuery]);

  const downloadChallengesGuide = () => {
    const txt = CREATIVE_CHALLENGES.map(
      (c) =>
        `${c.code} · ${c.title} (${c.level} · ${c.duration})\nObjetivo: ${c.objective}\nPasos:\n${c.steps
          .map((s, i) => `  ${i + 1}. ${s}`)
          .join('\n')}\nResultado esperado: ${c.outcome}\n`
    ).join('\n--------------------------------------------\n');
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nucleo_colectivo_retos_taller.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="herramientas-academia"
      className="py-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/30 transition-colors scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1.5">
              <span>ECOSISTEMA Y FORMACIÓN</span>
              <span aria-hidden="true" className="text-stone-400">/</span>
              <span>HERRAMIENTAS, RETOS Y GLOSARIO BILINGÜE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Directorio de Herramientas IA y Academia Visual
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Elige la plataforma adecuada para cada etapa (imagen, video, audio, edición, 3D o diseño), practica con retos guiados paso a paso y traduce términos técnicos español–inglés.
            </p>
          </div>
          <span className="text-xs font-mono-code text-stone-500 dark:text-stone-400">
            Revisión de herramientas · 2026-11
          </span>
        </div>

        {/* 3 Main Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
          {(
            [
              { id: 'tools', label: `Directorio IA (${AI_TOOLS_DIRECTORY.length})`, icon: Wrench },
              { id: 'challenges', label: 'Retos Creativos & Rutas', icon: Trophy },
              { id: 'glossary', label: `Diccionario Bilingüe ES–EN (${BILINGUAL_GLOSSARY.length})`, icon: Languages },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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

        {/* TAB 1: DIRECTORIO DE HERRAMIENTAS */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {(['Todas', 'Imagen', 'Video', 'Audio', 'Edición', '3D', 'Diseño'] as const).map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setAreaFilter(area)}
                  className={`px-3 py-1.5 text-xs font-mono-code rounded border transition-colors ${
                    areaFilter === area
                      ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-stone-900 dark:border-amber-400 font-bold'
                      : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-amber-400'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <article
                  key={tool.id}
                  className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono-code text-stone-500">
                      <span className="text-amber-700 dark:text-amber-400 font-bold uppercase">
                        {tool.area} · {tool.accessType}
                      </span>
                      <span>Rev. {tool.lastReviewed}</span>
                    </div>

                    <h3 className="text-base font-bold font-serif-title text-stone-900 dark:text-stone-100">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="text-xs text-stone-700 dark:text-stone-300">
                      <strong className="font-semibold">Fortaleza:</strong> {tool.specialty}
                    </div>

                    <div className="text-[11px] font-mono-code text-stone-500 dark:text-stone-400">
                      {tool.capabilities.join(' · ')}
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-700 dark:text-stone-300">
                      <strong className="block font-mono-code text-[10px] uppercase text-stone-500 mb-0.5">
                        Ejemplo de uso
                      </strong>
                      {tool.usageExample}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] font-mono-code">
                    <span className="text-stone-500 truncate pr-2">{tool.compatibleFormats}</span>
                    <a
                      href={tool.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1 shrink-0"
                    >
                      <span>Sitio oficial</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: RETOS CREATIVOS & RUTAS DE APRENDIZAJE */}
        {activeTab === 'challenges' && (
          <div className="space-y-10">
            {/* Learning Paths */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                  Rutas de Aprendizaje Recomendadas
                </h3>
                <button
                  type="button"
                  onClick={downloadChallengesGuide}
                  className="px-3 py-1.5 text-xs font-mono-code font-semibold bg-[#FAF8F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded flex items-center gap-1.5 hover:border-amber-500 shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Descargar Guía de Retos (.TXT)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LEARNING_PATHS.map((path) => (
                  <div
                    key={path.level}
                    className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono-code text-amber-700 dark:text-amber-400 font-bold">
                        <span>{path.level}</span>
                        <span className="text-stone-500">{path.duration}</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">{path.title}</h4>
                      <ol className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 list-decimal pl-4">
                        {path.steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                    </div>
                    <button
                      type="button"
                      onClick={() => onJumpToSection(path.targetSection, path.moduleId)}
                      className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Comenzar ruta</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Challenges Checklist */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                Retos Creativos de Taller (Marca tu progreso)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {CREATIVE_CHALLENGES.map((ch) => {
                  const doneCount = ch.steps.filter((_, idx) => completedSteps[`${ch.id}-${idx}`]).length;
                  return (
                    <div
                      key={ch.id}
                      className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono-code">
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          {ch.code} · {ch.level} · {ch.duration}
                        </span>
                        <span className="text-stone-500">
                          {doneCount}/{ch.steps.length} completados
                        </span>
                      </div>

                      <h4 className="text-lg font-bold font-serif-title text-stone-900 dark:text-stone-100">
                        {ch.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400">{ch.objective}</p>

                      <div className="space-y-2 pt-1">
                        {ch.steps.map((step, idx) => {
                          const key = `${ch.id}-${idx}`;
                          const checked = Boolean(completedSteps[key]);
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => toggleStep(key)}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${
                                checked
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-stone-700 dark:text-stone-300 line-through'
                                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-amber-400'
                              }`}
                            >
                              {checked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                              )}
                              <span>{step}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                        <strong className="text-stone-800 dark:text-stone-200">Resultado esperado:</strong> {ch.outcome}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DICCIONARIO BILINGÜE ES–EN */}
        {activeTab === 'glossary' && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={glossaryQuery}
                onChange={(e) => setGlossaryQuery(e.target.value)}
                placeholder="Buscar término en español, inglés o categoría (ej. Dolly, Luz, Plano)..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredGlossary.map((item) => (
                <div
                  key={item.es}
                  className="p-3.5 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-[10px] font-mono-code uppercase text-amber-700 dark:text-amber-400 font-bold">
                      {item.category}
                    </div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      {item.es}
                    </div>
                    <div className="text-xs font-mono-code text-stone-600 dark:text-stone-400">
                      {item.en}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.en, item.es)}
                    className="p-2 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-stone-600 dark:text-stone-300 shrink-0"
                    title="Copiar término en inglés para usar en prompts"
                  >
                    {copiedId === item.es ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
