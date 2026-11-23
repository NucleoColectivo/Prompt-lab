import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Dumbbell,
  ExternalLink,
  Square,
  Wand2,
} from 'lucide-react';
import {
  PRACTICE_DRILLS,
  PROMPT_BEFORE_AFTER_CASES,
  PracticeDrill,
} from '../../data/resourcesExtendedData';
import type { PromptBuilderState } from '../PromptBuilder';

interface ResourceExercisesViewProps {
  onSendToBuilder: (patch: Partial<PromptBuilderState>) => void;
}

const STORAGE_KEY = 'nc_resources_drills_completed_v1';

export const ResourceExercisesView: React.FC<ResourceExercisesViewProps> = ({
  onSendToBuilder,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState(PROMPT_BEFORE_AFTER_CASES[0].id);
  const [levelFilter, setLevelFilter] = useState<'Todos' | PracticeDrill['level']>('Todos');
  const [expandedDrillId, setExpandedDrillId] = useState<string | null>(PRACTICE_DRILLS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [completedDrills, setCompletedDrills] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedDrills));
    } catch {
      // Ignore storage quota errors
    }
  }, [completedDrills]);

  const activeCase =
    PROMPT_BEFORE_AFTER_CASES.find((c) => c.id === selectedCaseId) ||
    PROMPT_BEFORE_AFTER_CASES[0];

  const filteredDrills = PRACTICE_DRILLS.filter(
    (d) => levelFilter === 'Todos' || d.level === levelFilter
  );

  const toggleDrillCompleted = (id: string) => {
    setCompletedDrills((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const progressPct = Math.round(
    (completedDrills.length / PRACTICE_DRILLS.length) * 100
  );

  return (
    <section className="py-12 sm:py-16 bg-[#F4F2ED] dark:bg-[#101014] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        {/* PART 1: BEFORE VS AFTER PROMPT LAB */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7545D6] dark:text-[#F8C300] font-mono-code font-bold mb-2">
              <span>APRENDER COMPARANDO</span>
              <span aria-hidden="true" className="text-[#8E8C85]">/</span>
              <span>ANTES VS. DESPUÉS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
              De Prompt Genérico a Dirección de Arte
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#A09E97] mt-2 max-w-2xl leading-relaxed">
              Analiza cinco transformaciones reales para ver exactamente qué sobra, qué falta y cómo estructurar instrucciones precisas.
            </p>
          </div>

          {/* Discipline Switcher */}
          <div className="flex flex-wrap gap-2 mb-5">
            {PROMPT_BEFORE_AFTER_CASES.map((item) => {
              const isSelected = item.id === activeCase.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                      : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {item.discipline}
                </button>
              );
            })}
          </div>

          {/* Comparison Card */}
          <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-5 sm:p-7">
            <h3 className="text-xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED] mb-5">
              {activeCase.title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              {/* Weak Prompt */}
              <div className="p-5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#B4523A] dark:text-[#FF8A75] mb-2">
                    ANTES · PROMPT COMÚN (DÉBIL)
                  </div>
                  <p className="font-mono-code text-xs text-[#101014] dark:text-[#E5E3DC] bg-white dark:bg-[#16161C] p-3.5 rounded-lg border border-[#DEDAD0] dark:border-[#26262E] leading-relaxed mb-3">
                    &ldquo;{activeCase.weakPrompt}&rdquo;
                  </p>
                </div>
                <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed">
                  <strong className="text-[#101014] dark:text-[#F4F2ED]">Por qué falla:</strong>{' '}
                  {activeCase.diagnosis}
                </p>
              </div>

              {/* Strong Prompt */}
              <div className="p-5 rounded-xl bg-[#101014] border border-[#26262E] text-[#F4F2ED] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#F8C300]">
                      DESPUÉS · PROMPT DE DIRECCIÓN DE ARTE
                    </span>
                  </div>
                  <p className="font-mono-code text-xs text-[#E5E3DC] bg-[#16161C] p-3.5 rounded-lg border border-[#26262E] leading-relaxed mb-4">
                    {activeCase.strongPrompt}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(activeCase.id, activeCase.strongPrompt)}
                    className="min-h-[40px] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014] hover:bg-[#e5b400] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {copiedId === activeCase.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Prompt Mejorado</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendToBuilder(activeCase.builderPatch)}
                    className="min-h-[40px] px-4 py-2 text-xs font-semibold rounded-lg bg-[#326BFF] text-white hover:bg-[#2558e0] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Probar en Constructor</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="pt-4 border-t border-[#DEDAD0] dark:border-[#26262E]">
              <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] mb-2.5">
                3 CLAVES QUE MARCARON LA DIFERENCIA
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeCase.improvements.map((point, idx) => (
                  <div
                    key={point}
                    className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-xs text-[#101014] dark:text-[#E5E3DC] flex items-start gap-2.5"
                  >
                    <span className="font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                      0{idx + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: 8 GUIDED PRACTICE DRILLS */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#326BFF] dark:text-[#F8C300] font-mono-code font-bold mb-2">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>ENTRENAMIENTO POR COMPETENCIAS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
                {PRACTICE_DRILLS.length} Ejercicios Prácticos Guiados
              </h2>
              <p className="text-sm text-[#4A4A55] dark:text-[#A09E97] mt-1.5 max-w-2xl">
                Prácticas de 15 a 30 minutos (imagen, video, cartel, ética, audio, música, FX y podcast) con apps gratuitas recomendadas para cada necesidad.
              </p>
            </div>

            {/* Progress Counter */}
            <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl px-4 py-3 min-w-[230px]">
              <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
                <span className="text-[#5B5B66] dark:text-[#A09E97]">Progreso de práctica</span>
                <span className="font-bold text-[#101014] dark:text-[#F8C300]">
                  {completedDrills.length}/{PRACTICE_DRILLS.length} ({progressPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded bg-[#DEDAD0] dark:bg-[#26262E] overflow-hidden">
                <div
                  className="h-full bg-[#326BFF] dark:bg-[#F8C300] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['Todos', 'Inicial', 'Intermedio', 'Avanzado'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors whitespace-nowrap ${
                  levelFilter === lvl
                    ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                    : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Drills List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDrills.map((drill) => {
              const isDone = completedDrills.includes(drill.id);
              const isOpen = expandedDrillId === drill.id;

              return (
                <article
                  key={drill.id}
                  className={`bg-white dark:bg-[#16161C] border rounded-xl p-5 transition-colors flex flex-col justify-between ${
                    isDone
                      ? 'border-[#326BFF] dark:border-[#F8C300]'
                      : 'border-[#DEDAD0] dark:border-[#26262E]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-code">
                        <span className="font-bold text-[#7545D6] dark:text-[#F8C300]">
                          {drill.code}
                        </span>
                        <span className="text-[#8E8C85]">·</span>
                        <span className="text-[#4A4A55] dark:text-[#A09E97]">
                          {drill.skill}
                        </span>
                        <span className="text-[#8E8C85]">·</span>
                        <span className="text-[#4A4A55] dark:text-[#A09E97]">
                          {drill.level} · {drill.duration}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDrillCompleted(drill.id)}
                        aria-label={
                          isDone
                            ? `Marcar ${drill.title} como pendiente`
                            : `Marcar ${drill.title} como completado`
                        }
                        className="flex items-center gap-1 text-[11px] font-mono-code font-bold text-[#326BFF] dark:text-[#F8C300] shrink-0"
                      >
                        {isDone ? (
                          <>
                            <CheckSquare className="w-4 h-4" />
                            <span>Hecho</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-4 h-4 text-[#8E8C85]" />
                            <span className="text-[#5B5B66] dark:text-[#A09E97]">Pendiente</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="text-lg font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED] mb-1.5">
                      {drill.title}
                    </h3>
                    <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed mb-3">
                      {drill.objective}
                    </p>

                    {/* Recommended Free Tools for this Drill */}
                    {drill.freeTools && drill.freeTools.length > 0 && (
                      <div className="mb-3.5 p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                        <div className="text-[10px] font-mono-code uppercase tracking-wider font-bold text-[#5B5B66] dark:text-[#A09E97] mb-1.5">
                          Apps gratis recomendadas para este ejercicio
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {drill.freeTools.map((tool) => (
                            <a
                              key={tool.name}
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={tool.role}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] dark:hover:border-[#F8C300] text-[11px] font-medium text-[#101014] dark:text-[#F4F2ED] transition-colors"
                            >
                              <span className="font-semibold">{tool.name}</span>
                              <span className="text-[10px] text-[#5B5B66] dark:text-[#8E8C85] hidden sm:inline">
                                · {tool.role}
                              </span>
                              <ExternalLink className="w-2.5 h-2.5 text-[#326BFF] dark:text-[#F8C300] shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedDrillId(isOpen ? null : drill.id)}
                      className="text-xs font-mono-code uppercase tracking-wider font-bold text-[#326BFF] dark:text-[#F8C300] flex items-center gap-1.5 mb-3"
                    >
                      {isOpen ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Ocultar pasos y prompt base</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>Ver pasos, prompt base y autoevaluación</span>
                        </>
                      )}
                    </button>

                    {isOpen && (
                      <div className="space-y-4 mb-4 pt-3 border-t border-[#DEDAD0] dark:border-[#26262E]">
                        <div>
                          <div className="text-[11px] font-mono-code uppercase font-bold text-[#5B5B66] dark:text-[#8E8C85] mb-1.5">
                            Paso a paso
                          </div>
                          <ol className="space-y-1.5 text-xs text-[#101014] dark:text-[#E5E3DC] list-decimal list-inside leading-relaxed">
                            {drill.steps.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono-code uppercase font-bold text-[#5B5B66] dark:text-[#8E8C85] mb-1.5">
                            Prompt inicial de práctica
                          </div>
                          <div className="p-3 rounded-lg bg-[#101014] text-[#E5E3DC] font-mono-code text-[11px] leading-relaxed border border-[#26262E]">
                            {drill.starterPrompt}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono-code uppercase font-bold text-[#5B5B66] dark:text-[#8E8C85] mb-1.5">
                            Criterio de logro
                          </div>
                          <ul className="space-y-1 text-xs text-[#4A4A55] dark:text-[#A09E97]">
                            {drill.evaluationChecklist.map((check) => (
                              <li key={check} className="flex items-start gap-2">
                                <ArrowRight className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300] mt-0.5 shrink-0" />
                                <span>{check}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(drill.id, drill.starterPrompt)}
                      className="flex-1 min-h-[40px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014] hover:bg-[#e5b400] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      {copiedId === drill.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Prompt</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendToBuilder(drill.builderPatch)}
                      className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300]" />
                      <span>Practicar</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
