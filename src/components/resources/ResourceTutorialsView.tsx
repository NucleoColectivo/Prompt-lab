import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  CheckSquare,
  Copy,
  ExternalLink,
  Play,
  PlayCircle,
  Search,
  Sparkles,
  Square,
  Wand2,
  X,
} from 'lucide-react';
import {
  STEP_BY_STEP_TUTORIALS,
  StepByStepTutorial,
  TUTORIAL_LEARNING_PATHS,
  TutorialToolId,
} from '../../data/resourcesTutorialsData';
import type { PromptBuilderState } from '../PromptBuilder';

interface ResourceTutorialsViewProps {
  onSendToBuilder: (patch: Partial<PromptBuilderState>) => void;
}

const COMPLETED_TUTORIALS_KEY = 'nc_resources_tutorials_done_v1';
const CHECKED_STEPS_KEY = 'nc_resources_tutorial_steps_v1';

const TOOL_FILTERS: Array<'Todas' | TutorialToolId> = [
  'Todas',
  'Google AI Studio',
  'Gemini',
  'ChatGPT',
  'Midjourney',
  'Runway',
  'Ideogram',
  'FLUX.1',
];

export const ResourceTutorialsView: React.FC<ResourceTutorialsViewProps> = ({
  onSendToBuilder,
}) => {
  const [selectedTool, setSelectedTool] = useState<'Todas' | TutorialToolId>('Todas');
  const [selectedLevel, setSelectedLevel] = useState<
    'Todos' | StepByStepTutorial['level']
  >('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTutorialId, setActiveTutorialId] = useState<string>(
    STEP_BY_STEP_TUTORIALS[0].id
  );
  const [isPlayerLoaded, setIsPlayerLoaded] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePathId, setActivePathId] = useState<string | null>(null);

  const playerSectionRef = useRef<HTMLDivElement | null>(null);

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(COMPLETED_TUTORIALS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [checkedSteps, setCheckedSteps] = useState<Record<string, number[]>>(() => {
    try {
      const raw = localStorage.getItem(CHECKED_STEPS_KEY);
      return raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETED_TUTORIALS_KEY, JSON.stringify(completedIds));
    } catch {
      // Ignore storage quota issues
    }
  }, [completedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKED_STEPS_KEY, JSON.stringify(checkedSteps));
    } catch {
      // Ignore storage quota issues
    }
  }, [checkedSteps]);

  const activeTutorial =
    STEP_BY_STEP_TUTORIALS.find((t) => t.id === activeTutorialId) ||
    STEP_BY_STEP_TUTORIALS[0];

  const activePath = activePathId
    ? TUTORIAL_LEARNING_PATHS.find((p) => p.id === activePathId) || null
    : null;

  const filteredTutorials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return STEP_BY_STEP_TUTORIALS.filter((tut) => {
      if (activePath && !activePath.tutorialIds.includes(tut.id)) return false;
      if (selectedTool !== 'Todas' && tut.tool !== selectedTool) return false;
      if (selectedLevel !== 'Todos' && tut.level !== selectedLevel) return false;
      if (!q) return true;
      return [
        tut.title,
        tut.tool,
        tut.channel,
        tut.category,
        tut.summary,
        tut.practicalExercise.title,
        tut.practicalExercise.goal,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [activePath, searchQuery, selectedLevel, selectedTool]);

  const handleOpenTutorial = (tutorialId: string, autoplay = true) => {
    setActiveTutorialId(tutorialId);
    setIsPlayerLoaded(autoplay);
    if (playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectLearningPath = (pathId: string) => {
    if (activePathId === pathId) {
      setActivePathId(null);
      return;
    }
    const found = TUTORIAL_LEARNING_PATHS.find((p) => p.id === pathId);
    setActivePathId(pathId);
    setSelectedTool('Todas');
    setSelectedLevel('Todos');
    setSearchQuery('');
    if (found && found.tutorialIds[0]) {
      setActiveTutorialId(found.tutorialIds[0]);
      setIsPlayerLoaded(false);
    }
  };

  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleStep = (tutorialId: string, stepIdx: number) => {
    setCheckedSteps((prev) => {
      const current = prev[tutorialId] || [];
      const next = current.includes(stepIdx)
        ? current.filter((idx) => idx !== stepIdx)
        : [...current, stepIdx];
      return { ...prev, [tutorialId]: next };
    });
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const completionPct = Math.round(
    (completedIds.length / STEP_BY_STEP_TUTORIALS.length) * 100
  );
  const currentCheckedSteps = checkedSteps[activeTutorial.id] || [];
  const isCurrentDone = completedIds.includes(activeTutorial.id);

  return (
    <section
      id="tutoriales"
      className="py-12 sm:py-16 bg-[#F4F2ED] dark:bg-[#101014] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header + Progress */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7545D6] dark:text-[#F8C300] font-mono-code font-bold mb-2">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>VIDEOTUTORIALES INCRUSTADOS + PRÁCTICA GUIADA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
              Tutoriales Paso a Paso de Herramientas IA
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#A09E97] mt-2 max-w-2xl leading-relaxed">
              Aprende en video y practica de inmediato con Google AI Studio, Gemini, ChatGPT, Midjourney, Runway Gen-3, Ideogram y FLUX.1. Cada clase incluye lista de pasos y ejercicio con prompt listo.
            </p>
          </div>

          {/* Completion Tracker */}
          <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl px-4 py-3 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
              <span className="text-[#5B5B66] dark:text-[#A09E97]">Progreso en tutoriales</span>
              <span className="font-bold text-[#101014] dark:text-[#F8C300]">
                {completedIds.length}/{STEP_BY_STEP_TUTORIALS.length} ({completionPct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded bg-[#DEDAD0] dark:bg-[#26262E] overflow-hidden">
              <div
                className="h-full bg-[#326BFF] dark:bg-[#F8C300] transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3 Curated Learning Paths */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TUTORIAL_LEARNING_PATHS.map((path) => {
            const isSelected = activePathId === path.id;
            const doneInPath = path.tutorialIds.filter((id) =>
              completedIds.includes(id)
            ).length;
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => handleSelectLearningPath(path.id)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300]'
                    : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[11px] font-mono-code font-bold uppercase tracking-wider ${
                        isSelected
                          ? 'text-[#F8C300] dark:text-[#101014]'
                          : 'text-[#326BFF] dark:text-[#F8C300]'
                      }`}
                    >
                      {path.title}
                    </span>
                    <span className="text-[11px] font-mono-code opacity-80">
                      {doneInPath}/{path.tutorialIds.length}
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected
                        ? 'text-[#E5E3DC] dark:text-[#101014]/85'
                        : 'text-[#4A4A55] dark:text-[#A09E97]'
                    }`}
                  >
                    {path.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE EMBEDDED STUDIO PLAYER + STEP-BY-STEP WORKSPACE */}
        <div
          ref={playerSectionRef}
          className="scroll-mt-24 bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Workspace Top Bar */}
          <div className="px-5 py-4 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#FAF9F6] dark:bg-[#131318] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
              <span className="px-2.5 py-1 rounded bg-[#101014] text-[#F8C300] font-bold uppercase tracking-wider">
                {activeTutorial.tool}
              </span>
              <span className="text-[#4A4A55] dark:text-[#A09E97]">
                {activeTutorial.category}
              </span>
              <span className="text-[#8E8C85]">·</span>
              <span className="text-[#4A4A55] dark:text-[#A09E97]">
                Nivel {activeTutorial.level} · {activeTutorial.duration}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://www.youtube.com/watch?v=${activeTutorial.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver en YouTube</span>
              </a>
              <button
                type="button"
                onClick={() => toggleCompleted(activeTutorial.id)}
                className={`min-h-[36px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                  isCurrentDone
                    ? 'bg-[#326BFF] text-white border-[#326BFF]'
                    : 'bg-[#F8C300] text-[#101014] border-[#F8C300] hover:bg-[#e5b400]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCurrentDone ? 'Tutorial Completado' : 'Marcar Completado'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Embedded Video & Takeaways */}
            <div className="lg:col-span-7 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between">
              <div>
                {/* Responsive 16:9 Embedded Video */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#101014] border border-[#26262E] mb-5">
                  {isPlayerLoaded ? (
                    <iframe
                      key={activeTutorial.videoId}
                      src={`https://www.youtube.com/embed/${activeTutorial.videoId}?autoplay=1&rel=0`}
                      title={activeTutorial.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPlayerLoaded(true)}
                      aria-label={`Reproducir tutorial: ${activeTutorial.title}`}
                      className="group relative w-full h-full text-left focus:outline-none"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${activeTutorial.videoId}/hqdefault.jpg`}
                        alt={activeTutorial.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-85 group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/85 via-[#101014]/25 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-16 h-16 rounded-full bg-[#F8C300] text-[#101014] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                          <Play className="w-7 h-7 fill-current ml-0.5" />
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 text-xs font-mono-code text-[#F4F2ED]">
                        <span>Canal: {activeTutorial.channel}</span>
                        <span className="px-2.5 py-1 rounded bg-[#101014]/85 text-[#F8C300]">
                          Clic para reproducir aquí
                        </span>
                      </div>
                    </button>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED] mb-2 leading-snug">
                  {activeTutorial.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#A09E97] leading-relaxed mb-5">
                  {activeTutorial.summary}
                </p>

                {/* What you will learn */}
                <div className="p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] mb-2">
                    QUÉ APRENDERÁS EN ESTE VIDEO
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#101014] dark:text-[#E5E3DC]">
                    {activeTutorial.whatYouLearn.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300] mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Interactive Steps + Practical Exercise */}
            <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between gap-5">
              {/* Interactive Step-by-Step Checklist */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300]">
                    GUÍA PASO A PASO ({currentCheckedSteps.length}/{activeTutorial.steps.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {activeTutorial.steps.map((step, idx) => {
                    const checked = currentCheckedSteps.includes(idx);
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => toggleStep(activeTutorial.id, idx)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-2.5 ${
                          checked
                            ? 'bg-[#F4F2ED] dark:bg-[#101014] border-[#326BFF] dark:border-[#F8C300]'
                            : 'bg-white dark:bg-[#101014]/60 border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                        }`}
                      >
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-[#326BFF] dark:text-[#F8C300] mt-0.5 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-[#8E8C85] mt-0.5 shrink-0" />
                        )}
                        <span
                          className={`text-xs leading-relaxed ${
                            checked
                              ? 'line-through text-[#5B5B66] dark:text-[#8E8C85]'
                              : 'text-[#101014] dark:text-[#E5E3DC]'
                          }`}
                        >
                          <strong className="font-mono-code mr-1">0{idx + 1}.</strong>
                          {step}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Practical Exercise Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#26262E] space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#F8C300]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EJERCICIO PRÁCTICO ASOCIADO</span>
                </div>
                <h4 className="text-base font-bold font-serif-title text-white">
                  {activeTutorial.practicalExercise.title}
                </h4>
                <p className="text-xs text-[#C7C5BE] leading-relaxed">
                  {activeTutorial.practicalExercise.goal}
                </p>
                <div className="text-[11px] font-mono-code text-[#A09E97]">
                  <strong className="text-[#F8C300]">Entregable:</strong>{' '}
                  {activeTutorial.practicalExercise.deliverable}
                </div>

                <div className="p-3 rounded-lg bg-[#16161C] border border-[#26262E] font-mono-code text-[11px] text-[#E5E3DC] leading-relaxed select-all">
                  {activeTutorial.practicalExercise.starterPrompt}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `active-${activeTutorial.id}`,
                        activeTutorial.practicalExercise.starterPrompt
                      )
                    }
                    className="flex-1 min-h-[40px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014] hover:bg-[#e5b400] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    {copiedId === `active-${activeTutorial.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Prompt Copiado!</span>
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
                    onClick={() =>
                      onSendToBuilder(activeTutorial.practicalExercise.builderPatch)
                    }
                    className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#326BFF] text-white hover:bg-[#2558e0] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Probar en Constructor</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER & SEARCH BAR FOR FULL CATALOG */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {TOOL_FILTERS.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => {
                    setActivePathId(null);
                    setSelectedTool(tool);
                  }}
                  className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors whitespace-nowrap ${
                    selectedTool === tool && !activePathId
                      ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                      : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#5B5B66] dark:text-[#8E8C85] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar Midjourney, video, Gems..."
                  aria-label="Buscar tutoriales paso a paso"
                  className="w-full min-h-[38px] pl-9 pr-8 py-1.5 text-xs bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg focus:outline-none focus:border-[#326BFF]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#5B5B66]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={selectedLevel}
                onChange={(e) =>
                  setSelectedLevel(
                    e.target.value as 'Todos' | StepByStepTutorial['level']
                  )
                }
                aria-label="Filtrar por nivel"
                className="min-h-[38px] px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg focus:outline-none focus:border-[#326BFF]"
              >
                <option value="Todos">Nivel: Todos</option>
                <option value="Inicial">Nivel: Inicial</option>
                <option value="Intermedio">Nivel: Intermedio</option>
                <option value="Avanzado">Nivel: Avanzado</option>
              </select>
            </div>
          </div>

          {activePath && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-[#101014] text-[#F4F2ED] text-xs">
              <span>
                Mostrando <strong className="text-[#F8C300]">{activePath.title}</strong> ({filteredTutorials.length} tutoriales en secuencia).
              </span>
              <button
                type="button"
                onClick={() => setActivePathId(null)}
                className="text-xs font-mono-code uppercase font-bold text-[#F8C300] hover:underline whitespace-nowrap"
              >
                Ver los 12 tutoriales
              </button>
            </div>
          )}
        </div>

        {/* TUTORIALS CATALOG GRID */}
        {filteredTutorials.length === 0 ? (
          <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-10 text-center">
            <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED] mb-3">
              No encontramos tutoriales con ese filtro.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTool('Todas');
                setSelectedLevel('Todos');
                setSearchQuery('');
                setActivePathId(null);
              }}
              className="min-h-[40px] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014]"
            >
              Mostrar todos los tutoriales
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tut) => {
              const isSelected = tut.id === activeTutorial.id;
              const isDone = completedIds.includes(tut.id);

              return (
                <article
                  key={tut.id}
                  className={`bg-white dark:bg-[#16161C] border rounded-xl overflow-hidden flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[#326BFF] dark:border-[#F8C300] ring-1 ring-[#326BFF]/30 dark:ring-[#F8C300]/30'
                      : 'border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  <div>
                    {/* Video Thumbnail */}
                    <button
                      type="button"
                      onClick={() => handleOpenTutorial(tut.id, true)}
                      aria-label={`Abrir tutorial ${tut.title}`}
                      className="group relative aspect-video w-full overflow-hidden bg-[#101014] block text-left"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${tut.videoId}/hqdefault.jpg`}
                        alt={tut.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/80 via-transparent to-[#101014]/25" />

                      <div className="absolute top-3 left-3 text-[11px] font-mono-code font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#101014]/90 text-[#F8C300] border border-[#26262E]">
                        {tut.tool}
                      </div>

                      {isDone && (
                        <div className="absolute top-3 right-3 text-[10px] font-mono-code font-bold uppercase px-2 py-1 rounded bg-[#326BFF] text-white flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Hecho</span>
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-[#F8C300]/95 text-[#101014] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono-code text-[#F4F2ED]/90">
                        <span className="truncate">{tut.channel}</span>
                        <span className="shrink-0 ml-2">{tut.level}</span>
                      </div>
                    </button>

                    {/* Body */}
                    <div className="p-5">
                      <div className="text-[11px] font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold mb-1">
                        {tut.category} · {tut.steps.length} pasos
                      </div>
                      <h3 className="text-base font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED] mb-2 leading-snug">
                        {tut.title}
                      </h3>
                      <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed mb-4">
                        {tut.summary}
                      </p>

                      <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-[11px]">
                        <div className="font-mono-code font-bold uppercase text-[#326BFF] dark:text-[#F8C300] mb-0.5">
                          Ejercicio incluido
                        </div>
                        <div className="font-semibold text-[#101014] dark:text-[#F4F2ED]">
                          {tut.practicalExercise.title}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenTutorial(tut.id, true)}
                      className="flex-1 min-h-[40px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014] hover:bg-[#e5b400] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSelected ? 'Viendo ahora' : 'Ver y Practicar'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `card-${tut.id}`,
                          tut.practicalExercise.starterPrompt
                        )
                      }
                      title="Copiar prompt del ejercicio práctico"
                      className="min-h-[40px] px-3 py-2 text-xs font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {copiedId === `card-${tut.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#326BFF]" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
