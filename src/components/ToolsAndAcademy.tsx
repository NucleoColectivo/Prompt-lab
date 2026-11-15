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
  BILINGUAL_GLOSSARY,
  AiToolEntry,
} from '../data/extendedModulesData';
import { FULL_CREATIVE_CHALLENGES } from '../data/creativeStudiosData';
import type { ModuleId } from '../data/modulesData';
import {
  FOUR_LIGHTS_CHALLENGE_SERIES,
} from '../data/visualLibraryRegistry';
import { ResilientImage } from './ResilientImage';
import { ToolBrandLogo } from './ToolBrandLogo';

interface ToolsAndAcademyProps {
  onJumpToSection: (sectionId: string, moduleId?: ModuleId) => void;
  defaultTab?: 'tools' | 'challenges' | 'glossary';
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
      'Diseñar un proyecto comunitario completo con Planificador Audiovisual (8 etapas).',
      'Revisar Módulo 25 (Accesibilidad) y Módulo 26 (Procedencia y Consentimiento).',
      'Exportar fichas técnicas PDF/PNG desde el Constructor para trabajo en aula.',
    ],
    targetSection: 'film-director',
    moduleId: 'mod-26' as ModuleId,
  },
];

const TOOL_AREAS: ('Todas' | AiToolEntry['area'])[] = [
  'Todas',
  'Asistentes & Investigación',
  'Desarrollo & Apps',
  'Imagen',
  'Video',
  'Edición',
  'Audio',
  '3D',
  'Diseño',
];

export const ToolsAndAcademy: React.FC<ToolsAndAcademyProps> = ({
  onJumpToSection,
  defaultTab = 'tools',
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'challenges' | 'glossary'>(defaultTab);
  const [areaFilter, setAreaFilter] = useState<'Todas' | AiToolEntry['area']>('Todas');
  const [toolQuery, setToolQuery] = useState('');
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

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
    const q = toolQuery.trim().toLowerCase();
    return AI_TOOLS_DIRECTORY.filter((t) => {
      const matchArea = areaFilter === 'Todas' || t.area === areaFilter;
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        t.capabilities.some((c) => c.toLowerCase().includes(q));
      return matchArea && matchSearch;
    });
  }, [areaFilter, toolQuery]);

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
    const txt = FULL_CREATIVE_CHALLENGES.map(
      (c) =>
        `${c.code} · ${c.title} (${c.level} · ${c.duration})\nMateriales: ${c.materials.join(', ')}\nObjetivo: ${c.objective}\nPasos:\n${c.steps
          .map((s, i) => `  ${i + 1}. ${s}`)
          .join('\n')}\nPrompt modelo:\n  ${c.promptTemplate}\nResultado esperado: ${c.outcome}\n`
    ).join('\n--------------------------------------------\n');
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nucleo_colectivo_6_retos_taller.txt';
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
              <span>APPS IA, RETOS Y GLOSARIO BILINGÜE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Directorio de Aplicaciones IA y Academia Visual
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Explora {AI_TOOLS_DIRECTORY.length} aplicaciones clave —desde Google AI Studio, Gemini, Claude y NotebookLM hasta CapCut, Lovable, Bolt, Runway y Blender— para practicar tus prompts directamente en herramientas reales.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs font-mono-code">
            <button
              type="button"
              onClick={() => onJumpToSection('galeria')}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 font-semibold"
            >
              Galería Visual
            </button>
            <button
              type="button"
              onClick={() => onJumpToSection('laboratorios')}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 font-semibold"
            >
              Laboratorios
            </button>
            <button
              type="button"
              onClick={() => onJumpToSection('film-director')}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 font-semibold"
            >
              Director 8 Etapas
            </button>
            <button
              type="button"
              onClick={() => onJumpToSection('builder')}
              className="px-3 py-1.5 rounded-lg bg-[#F8C300] text-[#101014] font-bold"
            >
              Constructor
            </button>
          </div>
        </div>

        {/* 3 Main Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
          {(
            [
              { id: 'tools', label: `Apps IA (${AI_TOOLS_DIRECTORY.length})`, icon: Wrench },
              { id: 'challenges', label: `6 Retos Creativos & Rutas`, icon: Trophy },
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
            {/* Search & Area Filter Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {TOOL_AREAS.map((area) => {
                  const count =
                    area === 'Todas'
                      ? AI_TOOLS_DIRECTORY.length
                      : AI_TOOLS_DIRECTORY.filter((t) => t.area === area).length;
                  return (
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
                      {area} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-72 shrink-0">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={toolQuery}
                  onChange={(e) => setToolQuery(e.target.value)}
                  placeholder="Buscar app (Claude, CapCut, Lovable...)"
                  aria-label="Buscar aplicación IA"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {filteredTools.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-center space-y-2">
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  No encontramos aplicaciones con «{toolQuery}» en esta categoría.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAreaFilter('Todas');
                    setToolQuery('');
                  }}
                  className="text-xs font-mono-code text-amber-700 dark:text-amber-400 underline"
                >
                  Mostrar todas las aplicaciones ({AI_TOOLS_DIRECTORY.length})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTools.map((tool) => {
                  const cleanDomain = tool.officialUrl
                    .replace(/^https?:\/\//, '')
                    .replace(/\/.*$/, '');
                  return (
                    <article
                      key={tool.id}
                      className="rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:border-amber-400 transition-colors shadow-xs group"
                    >
                      <div>
                        {/* Visual Reference Header Banner */}
                        <div className="relative h-32 w-full overflow-hidden bg-stone-900">
                          <ResilientImage
                            src={tool.previewImage}
                            alt={`Referencia visual de uso creativo en ${tool.name}`}
                            objectPosition="top"
                            containerClassName="w-full h-full"
                            className="group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />
                          <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono-code text-stone-200">
                            <span className="px-2 py-0.5 rounded bg-stone-950/80 border border-white/15 uppercase tracking-wider font-semibold">
                              {tool.area}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-stone-950/80 border border-white/15">
                              {tool.accessType}
                            </span>
                          </div>
                        </div>

                        {/* Body with Brand Logo + Title */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-start gap-3">
                            <ToolBrandLogo
                              toolId={tool.id}
                              brandColor={tool.brandColor}
                              shortCode={tool.shortCode}
                              name={tool.name}
                            />
                            <div className="min-w-0">
                              <h3 className="text-base font-bold font-serif-title text-stone-900 dark:text-stone-100 leading-tight">
                                {tool.name}
                              </h3>
                              <span className="text-[11px] font-mono-code text-stone-500 dark:text-stone-400 block truncate mt-0.5">
                                {cleanDomain}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                            {tool.description}
                          </p>

                          <div className="text-xs text-stone-700 dark:text-stone-300">
                            <strong className="font-semibold">Fortaleza:</strong> {tool.specialty}
                          </div>

                          <div className="text-[11px] font-mono-code text-amber-800 dark:text-amber-300">
                            {tool.capabilities.join(' · ')}
                          </div>

                          <div className="p-2.5 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-700 dark:text-stone-300">
                            <strong className="block font-mono-code text-[10px] uppercase text-stone-500 mb-0.5">
                              Ejemplo práctico en taller
                            </strong>
                            {tool.usageExample}
                          </div>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 border-t border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 flex items-center justify-between gap-2 text-[11px] font-mono-code">
                        <span className="text-stone-500 truncate">{tool.compatibleFormats}</span>
                        <a
                          href={tool.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          <span>Abrir App</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
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

            {/* Interactive Challenges Checklist (6 Full Retos) */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                Retos Creativos de Taller (01–06 · Marca tu progreso)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {FULL_CREATIVE_CHALLENGES.map((ch) => {
                  const doneCount = ch.steps.filter((_, idx) => completedSteps[`${ch.id}-${idx}`]).length;
                  const targetHash =
                    ch.labTarget === 'restauracion'
                      ? 'restauracion'
                      : ch.labTarget === 'producto'
                      ? 'producto-lab'
                      : ch.labTarget === 'dibujo'
                      ? 'dibujo-a-imagen'
                      : ch.labTarget === 'web'
                      ? 'web-lab'
                      : ch.labTarget === 'principiante'
                      ? 'mi-primera-imagen'
                      : 'laboratorios';
                  return (
                    <div
                      key={ch.id}
                      className="rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 bg-[#101014] overflow-hidden">
                          <ResilientImage
                            src={ch.coverImage}
                            alt={`Portada de ${ch.code}: ${ch.title}`}
                            aspectRatio="16:9"
                            objectPosition="top"
                            containerClassName="w-full h-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/85 via-[#101014]/20 to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono-code">
                            <span className="font-bold text-[#F8C300]">
                              {ch.code} · {ch.level} · {ch.duration}
                            </span>
                            <span className="text-[#F4F2ED] tabular-nums">
                              {doneCount}/{ch.steps.length} completados
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <h4 className="text-lg font-bold font-serif-title text-stone-900 dark:text-stone-100">
                            {ch.title}
                          </h4>
                          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                            {ch.objective}
                          </p>
                          <div className="text-[11px] font-mono-code text-stone-500 dark:text-stone-400">
                            <strong>Materiales:</strong> {ch.materials.join(' · ')}
                          </div>

                          {ch.id === 'reto-01' && (
                            <div className="pt-1 space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                                <span>Referencia controlada · Misma persona, 4 luces</span>
                                <span className="text-stone-500 font-normal">Clic para copiar luz</span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {FOUR_LIGHTS_CHALLENGE_SERIES.map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleCopy(item.promptSnippet, `reto1-${item.id}`)}
                                    className="group text-left rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-500 transition-colors"
                                  >
                                    <ResilientImage
                                      src={item.image}
                                      alt={item.alt}
                                      aspectRatio="3:4"
                                      objectPosition="top"
                                      className="group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="p-1.5">
                                      <div className="text-[10px] font-mono-code font-bold text-stone-900 dark:text-stone-100 truncate">
                                        {copiedId === `reto1-${item.id}` ? 'Copiado ✓' : item.code}
                                      </div>
                                      <div className="text-[10px] text-stone-500 truncate">{item.label.split(' ')[0]}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-1.5 pt-1">
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

                          <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono-code font-bold text-amber-700 dark:text-amber-400">
                              <span>PROMPT BASE DEL RETO</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(ch.promptTemplate, `ch-pr-${ch.id}`)}
                                className="inline-flex items-center gap-1 text-[#326BFF] dark:text-[#F8C300] hover:underline"
                              >
                                {copiedId === `ch-pr-${ch.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedId === `ch-pr-${ch.id}` ? 'Copiado' : 'Copiar'}</span>
                              </button>
                            </div>
                            <p className="text-[11px] font-mono-code text-stone-700 dark:text-stone-300 leading-relaxed">
                              {ch.promptTemplate}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                        <span className="max-w-sm">
                          <strong className="text-stone-800 dark:text-stone-200">Resultado:</strong> {ch.outcome}
                        </span>
                        <button
                          type="button"
                          onClick={() => onJumpToSection(targetHash)}
                          className="px-3 py-1.5 rounded-lg bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] font-mono-code font-bold shrink-0 whitespace-nowrap"
                        >
                          {ch.labLabel} →
                        </button>
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
