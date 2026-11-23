import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Clock,
  ArrowRight,
  Trash2,
  RotateCcw,
  FlaskConical,
  Zap,
  FolderKanban,
  Compass,
  Images,
  Wand2,
  Square,
  CheckSquare,
  FileDown,
} from 'lucide-react';
import {
  CREATIVE_DISCIPLINES,
  CREATIVE_LAB_EXPERIENCES,
  CREATIVE_PROJECT_CHALLENGES,
  EXPERIENCES_STORAGE_KEYS,
  EXPRESS_CHALLENGES,
  INITIAL_COMMUNITY_EXPERIMENTS,
  OPEN_EXPERIMENTS,
  type CommunityExperimentEntry,
  type CreativeDisciplineId,
  type CreativeLabExperience,
  type ExperienceLevel,
} from '../../data/creativeExperiencesData';
import type { PromptBuilderState } from '../PromptBuilder';
import { ResilientImage } from '../ResilientImage';
import { SectionPhotoBanner } from '../SectionPhotoBanner';
import { VISUAL_LIBRARY_PATHS } from '../../data/visualLibraryRegistry';
import { LabCard } from './LabCard';
import { GuidedExerciseModal } from './GuidedExerciseModal';
import { RandomChallengeGenerator } from './RandomChallengeGenerator';
import { ExperimentCardExporterModal } from './ExperimentCardExporterModal';

type ExerciseTypeFilter = 'all' | 'labs' | 'express' | 'projects' | 'open';

function getExperienceBannerVisual(typeFilter: ExerciseTypeFilter): {
  image: string;
  alt: string;
} {
  switch (typeFilter) {
    case 'labs':
      return {
        image: VISUAL_LIBRARY_PATHS.videoStudio,
        alt: 'Disciplinas Creativas — 26 laboratorios guiados paso a paso',
      };
    case 'express':
      return {
        image: VISUAL_LIBRARY_PATHS.adSplash,
        alt: 'Retos Express — 10 ejercicios creativos de 15 minutos',
      };
    case 'projects':
      return {
        image: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
        alt: 'Desafíos Creativos — 8 proyectos completos multietapa',
      };
    case 'open':
      return {
        image: VISUAL_LIBRARY_PATHS.animGenerativeParticles,
        alt: 'Experimentos Abiertos — 8 provocaciones artísticas y generativas',
      };
    default:
      return {
        image: VISUAL_LIBRARY_PATHS.vfxProjectionMapping,
        alt: 'Experiencias, laboratorios y retos creativos con IA',
      };
  }
}

interface CreativeExperiencesHubProps {
  mode?: 'full' | 'home';
  onSendPromptToBuilder: (patch: Partial<PromptBuilderState>) => void;
  onNavigateToFullSection?: () => void;
}

function readJsonStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const CreativeExperiencesHub: React.FC<CreativeExperiencesHubProps> = ({
  mode = 'full',
  onSendPromptToBuilder,
  onNavigateToFullSection,
}) => {
  // Active Guided Modal & Card Exporter Modal
  const [activeLab, setActiveLab] = useState<CreativeLabExperience | null>(null);
  const [exportingEntry, setExportingEntry] = useState<CommunityExperimentEntry | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [disciplineFilter, setDisciplineFilter] = useState<'all' | CreativeDisciplineId>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | ExperienceLevel>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | '15' | '20-30' | '60+'>('all');
  const [typeFilter, setTypeFilter] = useState<ExerciseTypeFilter>('all');
  const [toolFilter, setToolFilter] = useState<string>('all');

  // Persistent progress & creations
  const [completedLabs, setCompletedLabs] = useState<string[]>(() =>
    readJsonStorage<string[]>(EXPERIENCES_STORAGE_KEYS.completedLabs, [])
  );
  const [completedExpress, setCompletedExpress] = useState<string[]>(() =>
    readJsonStorage<string[]>(EXPERIENCES_STORAGE_KEYS.completedExpress, [])
  );
  const [projectStageProgress, setProjectStageProgress] = useState<Record<string, number[]>>(() =>
    readJsonStorage<Record<string, number[]>>(EXPERIENCES_STORAGE_KEYS.projectStages, {})
  );
  const [openResponses, setOpenResponses] = useState<Record<string, string>>(() =>
    readJsonStorage<Record<string, string>>(EXPERIENCES_STORAGE_KEYS.openResponses, {})
  );
  const [userGalleryEntries, setUserGalleryEntries] = useState<CommunityExperimentEntry[]>(() =>
    readJsonStorage<CommunityExperimentEntry[]>(EXPERIENCES_STORAGE_KEYS.communityGallery, [])
  );

  // Express prompt edits & copy feedback
  const [expressPrompts, setExpressPrompts] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const item of EXPRESS_CHALLENGES) {
      map[item.id] = item.starterPrompt;
    }
    return map;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('Todas');

  useEffect(() => {
    try {
      localStorage.setItem(EXPERIENCES_STORAGE_KEYS.completedLabs, JSON.stringify(completedLabs));
    } catch {
      // ignore
    }
  }, [completedLabs]);

  useEffect(() => {
    try {
      localStorage.setItem(EXPERIENCES_STORAGE_KEYS.completedExpress, JSON.stringify(completedExpress));
    } catch {
      // ignore
    }
  }, [completedExpress]);

  useEffect(() => {
    try {
      localStorage.setItem(
        EXPERIENCES_STORAGE_KEYS.projectStages,
        JSON.stringify(projectStageProgress)
      );
    } catch {
      // ignore
    }
  }, [projectStageProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(EXPERIENCES_STORAGE_KEYS.openResponses, JSON.stringify(openResponses));
    } catch {
      // ignore
    }
  }, [openResponses]);

  useEffect(() => {
    try {
      localStorage.setItem(
        EXPERIENCES_STORAGE_KEYS.communityGallery,
        JSON.stringify(userGalleryEntries)
      );
    } catch {
      // ignore
    }
  }, [userGalleryEntries]);

  const allTools = useMemo(() => {
    const set = new Set<string>();
    CREATIVE_LAB_EXPERIENCES.forEach((l) => l.tools.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const queryLower = searchQuery.trim().toLowerCase();

  const matchesCommonFilters = (item: {
    title: string;
    text: string;
    disciplineId: CreativeDisciplineId;
    level: ExperienceLevel;
    durationMinutes: number;
    tools: string[];
  }): boolean => {
    if (disciplineFilter !== 'all' && item.disciplineId !== disciplineFilter) return false;
    if (levelFilter !== 'all' && item.level !== levelFilter) return false;
    if (durationFilter === '15' && item.durationMinutes > 15) return false;
    if (
      durationFilter === '20-30' &&
      (item.durationMinutes < 20 || item.durationMinutes > 30)
    ) {
      return false;
    }
    if (durationFilter === '60+' && item.durationMinutes < 45) return false;
    if (toolFilter !== 'all' && !item.tools.includes(toolFilter)) return false;
    if (queryLower) {
      const hay = `${item.title} ${item.text} ${item.tools.join(' ')}`.toLowerCase();
      if (!hay.includes(queryLower)) return false;
    }
    return true;
  };

  const filteredLabs = useMemo(
    () =>
      CREATIVE_LAB_EXPERIENCES.filter((lab) =>
        matchesCommonFilters({
          title: lab.title,
          text: `${lab.code} ${lab.description} ${lab.exercise} ${lab.category} ${lab.tags.join(' ')}`,
          disciplineId: lab.disciplineId,
          level: lab.level,
          durationMinutes: lab.durationMinutes,
          tools: lab.tools,
        })
      ),
    [disciplineFilter, levelFilter, durationFilter, toolFilter, queryLower]
  );

  const filteredExpress = useMemo(
    () =>
      EXPRESS_CHALLENGES.filter((ex) =>
        matchesCommonFilters({
          title: ex.title,
          text: `${ex.brief} ${ex.category} ${ex.starterPrompt}`,
          disciplineId: ex.disciplineId,
          level: ex.level,
          durationMinutes: ex.durationMinutes,
          tools: ex.tools,
        })
      ),
    [disciplineFilter, levelFilter, durationFilter, toolFilter, queryLower]
  );

  const filteredProjects = useMemo(
    () =>
      CREATIVE_PROJECT_CHALLENGES.filter((proj) =>
        matchesCommonFilters({
          title: proj.title,
          text: `${proj.summary} ${proj.category} ${proj.deliverable}`,
          disciplineId: proj.disciplineId,
          level: proj.level,
          durationMinutes: proj.durationMinutes,
          tools: proj.tools,
        })
      ),
    [disciplineFilter, levelFilter, durationFilter, toolFilter, queryLower]
  );

  const filteredOpen = useMemo(
    () =>
      OPEN_EXPERIMENTS.filter((op) =>
        matchesCommonFilters({
          title: op.question,
          text: `${op.provocation} ${op.startingHint} ${op.suggestedPrompt}`,
          disciplineId: op.disciplineId,
          level: 'Intermedio',
          durationMinutes: 20,
          tools: op.tools,
        })
      ),
    [disciplineFilter, levelFilter, durationFilter, toolFilter, queryLower]
  );

  const allGalleryEntries = useMemo(
    () => [...userGalleryEntries, ...INITIAL_COMMUNITY_EXPERIMENTS],
    [userGalleryEntries]
  );

  const galleryCategories = useMemo(() => {
    const cats = new Set<string>(['Todas']);
    allGalleryEntries.forEach((e) => cats.add(e.category));
    return Array.from(cats);
  }, [allGalleryEntries]);

  const visibleGalleryEntries = useMemo(() => {
    if (galleryCategoryFilter === 'Todas') return allGalleryEntries;
    return allGalleryEntries.filter((e) => e.category === galleryCategoryFilter);
  }, [allGalleryEntries, galleryCategoryFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    disciplineFilter !== 'all' ||
    levelFilter !== 'all' ||
    durationFilter !== 'all' ||
    typeFilter !== 'all' ||
    toolFilter !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setDisciplineFilter('all');
    setLevelFilter('all');
    setDurationFilter('all');
    setTypeFilter('all');
    setToolFilter('all');
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore
    }
  };

  const toggleLabCompleted = (labId: string) => {
    setCompletedLabs((prev) => (prev.includes(labId) ? prev : [...prev, labId]));
  };

  const toggleExpressCompleted = (id: string) => {
    setCompletedExpress((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleProjectStage = (projectId: string, stageIdx: number) => {
    setProjectStageProgress((prev) => {
      const current = prev[projectId] || [];
      const next = current.includes(stageIdx)
        ? current.filter((i) => i !== stageIdx)
        : [...current, stageIdx];
      return { ...prev, [projectId]: next };
    });
  };

  const handlePublishEntry = (entry: CommunityExperimentEntry) => {
    setUserGalleryEntries((prev) => [entry, ...prev]);
  };

  const handleDeleteUserEntry = (id: string) => {
    setUserGalleryEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSendSimplePromptToBuilder = (prompt: string, title: string) => {
    onSendPromptToBuilder({
      mode: 'photo',
      subject: prompt,
      visualStyle: title,
    });
  };

  const showLabsSection = typeFilter === 'all' || typeFilter === 'labs';
  const showExpressSection = typeFilter === 'all' || typeFilter === 'express';
  const showProjectsSection = typeFilter === 'all' || typeFilter === 'projects';
  const showOpenSection = typeFilter === 'all' || typeFilter === 'open';

  const experienceBanner = useMemo(
    () => getExperienceBannerVisual(typeFilter),
    [typeFilter]
  );

  return (
    <div className="bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] transition-colors">
      {/* =====================================================================
          ENCABEZADO FOTOGRÁFICO + FILTROS + PROGRESO
         ===================================================================== */}
      <section
        id="nuevos-laboratorios"
        className="pb-10 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#16161C]"
      >
        <SectionPhotoBanner
          image={experienceBanner.image}
          imageAlt={experienceBanner.alt}
          accentTint="violet"
          kicker="APRENDER HACIENDO · 26 LABORATORIOS · 10 RETOS EXPRESS · 8 DESAFÍOS · 8 EXPERIMENTOS"
          topRight={
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-lg bg-[#101014]/75 border border-white/15 text-xs font-mono-code tabular-nums text-[#D8D5CD] backdrop-blur-xs">
                <span>Progreso: </span>
                <strong className="text-[#F8C300]">
                  {completedLabs.length}/26
                </strong>{' '}
                labs ·{' '}
                <strong className="text-[#F8C300]">
                  {completedExpress.length}/10
                </strong>{' '}
                express
              </div>

              {mode === 'home' && onNavigateToFullSection && (
                <button
                  type="button"
                  onClick={onNavigateToFullSection}
                  className="px-4 py-2 min-h-[38px] rounded-lg bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
                >
                  <span>Abrir vista dedicada</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          }
          title="Nuevos laboratorios, ejercicios y experiencias creativas"
          subtitle="Explora 6 disciplinas visuales con ejercicios guiados paso a paso (8 etapas), retos rápidos de 15 minutos, proyectos completos, preguntas abiertas y galería comunitaria de experimentos."
          actions={
            <>
              {[
                { id: 'all' as const, label: 'Todo el ecosistema', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: 'labs' as const, label: `Disciplinas (${filteredLabs.length})`, icon: <FlaskConical className="w-3.5 h-3.5" /> },
                { id: 'express' as const, label: `Retos Express (${filteredExpress.length})`, icon: <Zap className="w-3.5 h-3.5" /> },
                { id: 'projects' as const, label: `Desafíos (${filteredProjects.length})`, icon: <FolderKanban className="w-3.5 h-3.5" /> },
                { id: 'open' as const, label: `Experimentos Abiertos (${filteredOpen.length})`, icon: <Compass className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTypeFilter(tab.id)}
                  className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer backdrop-blur-xs ${
                    typeFilter === tab.id
                      ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold shadow-xs'
                      : 'bg-[#101014]/70 text-[#F4F2ED] border-white/20 hover:border-[#F8C300]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-7 space-y-5">
          {/* Multi-Dimensional Filter & Search Bar */}
          <div className="p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-[#5B5B66] dark:text-[#A09E97] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por tema, técnica, palabra clave..."
                aria-label="Buscar experiencias creativas"
                className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#181820] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
              />
            </div>

            <select
              aria-label="Filtrar por disciplina"
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value as 'all' | CreativeDisciplineId)}
              className="lg:col-span-3 min-h-[40px] px-3 py-2 rounded-lg bg-white dark:bg-[#181820] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED]"
            >
              <option value="all">Todas las disciplinas (A–F)</option>
              {CREATIVE_DISCIPLINES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.letter}. {d.title}
                </option>
              ))}
            </select>

            <select
              aria-label="Filtrar por nivel"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as 'all' | ExperienceLevel)}
              className="lg:col-span-2 min-h-[40px] px-3 py-2 rounded-lg bg-white dark:bg-[#181820] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED]"
            >
              <option value="all">Todos los niveles</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>

            <select
              aria-label="Filtrar por duración"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as 'all' | '15' | '20-30' | '60+')}
              className="lg:col-span-1 min-h-[40px] px-2.5 py-2 rounded-lg bg-white dark:bg-[#181820] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED]"
            >
              <option value="all">Tiempo</option>
              <option value="15">15 min</option>
              <option value="20-30">20–30m</option>
              <option value="60+">60+ min</option>
            </select>

            <select
              aria-label="Filtrar por herramienta"
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="lg:col-span-2 min-h-[40px] px-3 py-2 rounded-lg bg-white dark:bg-[#181820] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED]"
            >
              <option value="all">Todas las herramientas</option>
              {allTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[#5B5B66] dark:text-[#A09E97]">
                Mostrando {filteredLabs.length} laboratorios, {filteredExpress.length} retos express, {filteredProjects.length} desafíos y {filteredOpen.length} experimentos abiertos.
              </span>
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#326BFF] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar filtros</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          BLOQUE 2: EXPLORAR POR DISCIPLINAS (A–F · 26 LABORATORIOS)
         ===================================================================== */}
      {showLabsSection && (
        <div className="divide-y divide-[#DEDAD0] dark:divide-[#26262E]">
          {CREATIVE_DISCIPLINES.map((discipline) => {
            const labsInDiscipline = filteredLabs.filter(
              (l) => l.disciplineId === discipline.id
            );
            if (labsInDiscipline.length === 0) return null;

            const isExp = Boolean(discipline.isExperimental);

            return (
              <section
                key={discipline.id}
                id={`disciplina-${discipline.id}`}
                className={`py-14 ${
                  isExp
                    ? 'bg-[#0D0C12] text-[#F4F2ED]'
                    : 'bg-[#F4F2ED] dark:bg-[#101014]'
                }`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-7">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1.5 max-w-3xl">
                      <div
                        className="text-xs font-mono-code uppercase tracking-wider font-bold"
                        style={{ color: isExp ? '#F8C300' : discipline.accentColor }}
                      >
                        {isExp
                          ? `BLOQUE ${discipline.letter} · IDENTIDAD EXPERIMENTAL NÚCLEO COLECTIVO`
                          : `DISCIPLINA ${discipline.letter} · ${labsInDiscipline.length} LABORATORIOS GUIADOS`}
                      </div>
                      <h3
                        className={`text-2xl sm:text-3xl font-extrabold font-display-sans leading-tight ${
                          isExp ? 'text-[#F4F2ED]' : 'text-[#101014] dark:text-[#F4F2ED]'
                        }`}
                      >
                        {discipline.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          isExp ? 'text-[#C6C1D4]' : 'text-[#4A4A55] dark:text-[#B4B2AC]'
                        }`}
                      >
                        {discipline.description}
                      </p>
                    </div>

                    <div
                      className={`text-xs font-mono-code tabular-nums shrink-0 ${
                        isExp ? 'text-[#B9B3CC]' : 'text-[#5B5B66] dark:text-[#A09E97]'
                      }`}
                    >
                      {
                        labsInDiscipline.filter((l) => completedLabs.includes(l.id)).length
                      }
                      /{labsInDiscipline.length} completados
                    </div>
                  </div>

                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${
                      labsInDiscipline.length === 4
                        ? 'lg:grid-cols-4'
                        : 'lg:grid-cols-3'
                    }`}
                  >
                    {labsInDiscipline.map((lab) => (
                      <LabCard
                        key={lab.id}
                        lab={lab}
                        isExperimental={isExp}
                        isCompleted={completedLabs.includes(lab.id)}
                        onOpenLab={setActiveLab}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          BLOQUE 3: RETOS EXPRESS · 15 MINUTOS PARA CREAR (10 RETOS)
         ===================================================================== */}
      {showExpressSection && filteredExpress.length > 0 && (
        <section
          id="retos-express"
          className="py-14 border-t border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#16161C]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] font-bold">
                  RETOS EXPRESS · 15 MINUTOS PARA CREAR
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                  10 ejercicios rápidos para romper el bloqueo creativo
                </h3>
                <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                  Sin barreras técnicas: edita el prompt directamente en la tarjeta, cópialo o llévalo al Constructor y marca el reto como completado.
                </p>
              </div>
              <div className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97] tabular-nums shrink-0">
                {completedExpress.length}/{EXPRESS_CHALLENGES.length} completados
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredExpress.map((challenge) => {
                const isDone = completedExpress.includes(challenge.id);
                const currentPrompt = expressPrompts[challenge.id] ?? challenge.starterPrompt;
                return (
                  <article
                    key={challenge.id}
                    className={`rounded-2xl border overflow-hidden transition-colors flex flex-col justify-between ${
                      isDone
                        ? 'bg-[#F9FAF6] dark:bg-[#141A18] border-[#059669]/50'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E]'
                    }`}
                  >
                    <div className="p-5 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-20 rounded-xl overflow-hidden bg-[#101014] shrink-0">
                          <ResilientImage
                            src={challenge.image}
                            alt={challenge.imageAlt}
                            aspectRatio="3:2"
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-bold">
                            <span>RETO {challenge.number}</span>
                            <span aria-hidden="true">·</span>
                            <span>{challenge.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 tabular-nums">
                              <Clock className="w-3 h-3" />
                              <span>{challenge.durationMinutes} min</span>
                            </span>
                          </div>
                          <h4 className="text-base font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-snug">
                            {challenge.title}
                          </h4>
                          <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
                            {challenge.brief}
                          </p>
                        </div>
                      </div>

                      <ol className="space-y-1 text-xs text-[#3F3F48] dark:text-[#C8C6BF] list-decimal list-inside">
                        {challenge.instructions.map((ins) => (
                          <li key={ins}>{ins}</li>
                        ))}
                      </ol>

                      <div className="space-y-1.5">
                        <label
                          htmlFor={`express-prompt-${challenge.id}`}
                          className="text-[11px] font-mono-code font-bold text-[#5B5B66] dark:text-[#A09E97] uppercase block"
                        >
                          Prompt inicial (editable)
                        </label>
                        <textarea
                          id={`express-prompt-${challenge.id}`}
                          rows={3}
                          value={currentPrompt}
                          onChange={(e) =>
                            setExpressPrompts((prev) => ({
                              ...prev,
                              [challenge.id]: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#181820] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs font-mono-code leading-relaxed text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                        />
                        <p className="text-[11px] text-[#5B5B66] dark:text-[#A09E97]">
                          Nota de referencia: {challenge.referenceNote}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(challenge.id, currentPrompt)}
                          className="px-3.5 py-2 min-h-[38px] rounded-lg bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          {copiedId === challenge.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar prompt</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleSendSimplePromptToBuilder(currentPrompt, challenge.title)
                          }
                          className="px-3.5 py-2 min-h-[38px] rounded-lg bg-white dark:bg-[#1A1A22] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF] text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Wand2 className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300]" />
                          <span>Al Constructor</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpressCompleted(challenge.id)}
                        className={`px-3 py-2 min-h-[38px] rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                          isDone
                            ? 'bg-[#059669] text-white'
                            : 'bg-white dark:bg-[#1A1A22] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#4A4A55] dark:text-[#B4B2AC] hover:border-[#059669]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Completado' : 'Marcar completado'}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          BLOQUE 4: DESAFÍOS CREATIVOS · DE LA IDEA AL PROYECTO (8 PROYECTOS)
         ===================================================================== */}
      {showProjectsSection && filteredProjects.length > 0 && (
        <section
          id="desafios-creativos"
          className="py-14 border-t border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
                DESAFÍOS CREATIVOS · DE LA IDEA AL PROYECTO
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                8 proyectos integrales por etapas
              </h3>
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Marca cada etapa completada para llevar registro real de tus entregas. Tu progreso se guarda automáticamente en este dispositivo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((proj) => {
                const doneStages = projectStageProgress[proj.id] || [];
                const pct = Math.round((doneStages.length / proj.stages.length) * 100);

                return (
                  <article
                    key={proj.id}
                    className="rounded-2xl overflow-hidden bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between"
                  >
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-[#ECE8DF] dark:border-[#24242C]">
                        <div className="sm:col-span-5 bg-[#101014] min-h-[160px]">
                          <ResilientImage
                            src={proj.image}
                            alt={proj.imageAlt}
                            aspectRatio="16:9"
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="sm:col-span-7 p-5 space-y-2">
                          <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono-code text-[#326BFF] dark:text-[#F8C300] font-bold">
                            <span>PROYECTO {proj.number}</span>
                            <span aria-hidden="true">·</span>
                            <span>{proj.level}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{proj.duration}</span>
                          </div>
                          <h4 className="text-base font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                            {proj.title}
                          </h4>
                          <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                            {proj.summary}
                          </p>
                          <div className="text-[11px] text-[#5B5B66] dark:text-[#A09E97]">
                            <strong>Entregable:</strong> {proj.deliverable}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono-code">
                          <span className="text-[#5B5B66] dark:text-[#A09E97]">
                            Etapas del proyecto
                          </span>
                          <span className="font-bold text-[#101014] dark:text-[#F8C300] tabular-nums">
                            {doneStages.length}/{proj.stages.length} ({pct}%)
                          </span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-[#ECE8DF] dark:bg-[#24242E] overflow-hidden">
                          <div
                            className="h-full bg-[#F8C300] transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <ul className="space-y-2 pt-1">
                          {proj.stages.map((stage, idx) => {
                            const checked = doneStages.includes(idx);
                            return (
                              <li key={stage}>
                                <button
                                  type="button"
                                  onClick={() => toggleProjectStage(proj.id, idx)}
                                  className="w-full text-left flex items-start gap-2.5 text-xs group"
                                >
                                  {checked ? (
                                    <CheckSquare className="w-4 h-4 text-[#059669] dark:text-[#34D399] shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="w-4 h-4 text-[#8A877F] group-hover:text-[#326BFF] shrink-0 mt-0.5" />
                                  )}
                                  <span
                                    className={
                                      checked
                                        ? 'line-through text-[#7A7770] dark:text-[#7E7D78]'
                                        : 'text-[#2F2F38] dark:text-[#DCD9D0]'
                                    }
                                  >
                                    {stage}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    <div className="px-5 pb-5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ECE8DF] dark:border-[#24242C]">
                      <span className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                        {proj.tools.join(' · ')}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(proj.id, proj.starterPrompt)}
                          className="px-3 py-1.5 min-h-[36px] rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          {copiedId === proj.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#059669]" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Prompt base</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleSendSimplePromptToBuilder(proj.starterPrompt, proj.title)
                          }
                          className="px-3 py-1.5 min-h-[36px] rounded-lg bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Iniciar en Constructor</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          BLOQUE 5: EXPERIMENTOS ABIERTOS · EXPLORAR SIN LÍMITES (8 PREGUNTAS)
         ===================================================================== */}
      {showOpenSection && filteredOpen.length > 0 && (
        <section
          id="experimentos-abiertos"
          className="py-14 border-t border-[#262436] bg-[#12111A] text-[#F4F2ED]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#F8C300] font-bold">
                EXPERIMENTOS ABIERTOS · EXPLORAR SIN LÍMITES
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#F4F2ED] text-balance">
                8 preguntas sin una sola respuesta correcta
              </h3>
              <p className="text-sm text-[#C4C0D2] leading-relaxed">
                Aquí no hay resultados esperados ni fórmulas cerradas. Escribe tu propia interpretación visual, experimenta con el prompt semilla y guarda tus hallazgos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOpen.map((exp) => {
                const userNote = openResponses[exp.id] || '';
                return (
                  <article
                    key={exp.id}
                    className="rounded-2xl overflow-hidden bg-[#1A1826] border border-[#2F2B45] hover:border-[#F8C300] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-[#0E0D14] overflow-hidden">
                        <ResilientImage
                          src={exp.image}
                          alt={exp.imageAlt}
                          aspectRatio="16:9"
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1826] via-[#1A1826]/45 to-transparent" />
                        <div className="absolute bottom-3 left-5 right-5 space-y-1">
                          <div className="text-[11px] font-mono-code font-bold text-[#F8C300]">
                            PREGUNTA ABIERTA {exp.number}
                          </div>
                          <h4 className="text-lg font-extrabold font-display-sans text-[#F4F2ED] leading-snug">
                            {exp.question}
                          </h4>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <p className="text-xs text-[#DAD6E8] leading-relaxed">
                          {exp.provocation}
                        </p>
                        <p className="text-xs text-[#A9A3BF] leading-relaxed">
                          Pista: {exp.startingHint}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <label
                            htmlFor={`open-note-${exp.id}`}
                            className="text-[11px] font-mono-code text-[#F8C300] block uppercase"
                          >
                            Tu hipótesis o prompt personal (guardado local)
                          </label>
                          <textarea
                            id={`open-note-${exp.id}`}
                            rows={2}
                            value={userNote}
                            onChange={(e) =>
                              setOpenResponses((prev) => ({
                                ...prev,
                                [exp.id]: e.target.value,
                              }))
                            }
                            placeholder={exp.suggestedPrompt}
                            className="w-full px-3 py-2 rounded-lg bg-[#111019] border border-[#322E4A] text-xs text-[#F4F2ED] placeholder:text-[#787290] focus:outline-none focus:border-[#F8C300]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(exp.id, userNote.trim() || exp.suggestedPrompt)
                        }
                        className="px-3.5 py-2 min-h-[38px] rounded-lg bg-[#27243A] hover:bg-[#353052] text-[#F4F2ED] text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        {copiedId === exp.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#34D399]" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar semilla</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSendSimplePromptToBuilder(
                            userNote.trim() || exp.suggestedPrompt,
                            exp.question
                          )
                        }
                        className="px-3.5 py-2 min-h-[38px] rounded-lg bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Explorar en Constructor</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          BLOQUE 6: ¿NO SABES QUÉ CREAR? (GENERADOR ALEATORIO)
         ===================================================================== */}
      <section className="py-14 border-t border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RandomChallengeGenerator
            onOpenLab={setActiveLab}
            onSendPromptToBuilder={handleSendSimplePromptToBuilder}
          />
        </div>
      </section>

      {/* =====================================================================
          BLOQUE 7: GALERÍA DE EXPERIMENTOS COMUNITARIOS
         ===================================================================== */}
      <section
        id="galeria-experimentos"
        className="py-14 border-t border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#16161C]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold inline-flex items-center gap-1.5">
                <Images className="w-3.5 h-3.5" />
                <span>GALERÍA DE EXPERIMENTOS · ARCHIVO DE PROCESOS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                Resultados compartidos y prompts abiertos
              </h3>
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Cada ejercicio que publiques en el Paso 8 aparece aquí con su imagen, prompt, herramienta y notas de aprendizaje para inspirar a otros creadores.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGalleryCategoryFilter(cat)}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                    galleryCategoryFilter === cat
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleGalleryEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-[#101014] overflow-hidden">
                    <img
                      src={entry.image}
                      alt={entry.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-bold">
                      {entry.category} · {entry.createdAt}
                    </div>
                    <h4 className="text-sm font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-snug">
                      {entry.title}
                    </h4>
                    <div className="text-[11px] text-[#5B5B66] dark:text-[#A09E97]">
                      {entry.author} · {entry.toolUsed}
                    </div>
                    <p className="text-xs text-[#3F3F48] dark:text-[#C8C6BF] line-clamp-3 leading-relaxed">
                      {entry.notes}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-[#E6E2D8] dark:border-[#22222B] space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(entry.id, entry.prompt)}
                      className="text-xs font-semibold text-[#326BFF] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1"
                    >
                      {copiedId === entry.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Prompt copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar prompt</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendSimplePromptToBuilder(entry.prompt, entry.title)}
                        className="text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] hover:text-[#326BFF] dark:hover:text-[#F8C300]"
                      >
                        Probar
                      </button>
                      {entry.isUserCreated && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUserEntry(entry.id)}
                          aria-label={`Eliminar experimento ${entry.title}`}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExportingEntry(entry)}
                    className="w-full min-h-[38px] px-3 py-2 rounded-lg bg-white dark:bg-[#181820] hover:bg-[#F8C300] text-[#101014] dark:text-[#F4F2ED] hover:text-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Exportar PNG / PDF</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Active 8-Step Guided Exercise Modal */}
      {activeLab && (
        <GuidedExerciseModal
          lab={activeLab}
          isCompleted={completedLabs.includes(activeLab.id)}
          onClose={() => setActiveLab(null)}
          onMarkCompleted={toggleLabCompleted}
          onPublishToGallery={handlePublishEntry}
          onSendToBuilder={onSendPromptToBuilder}
        />
      )}

      {/* Visual Card PNG / PDF Exporter Modal */}
      {exportingEntry && (
        <ExperimentCardExporterModal
          entry={exportingEntry}
          onClose={() => setExportingEntry(null)}
        />
      )}
    </div>
  );
};
