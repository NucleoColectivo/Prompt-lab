import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  Camera,
  Check,
  CheckCircle2,
  Columns2,
  Cpu,
  Database,
  Eye,
  Film,
  Globe,
  Lightbulb,
  MessageSquare,
  PlayCircle,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wand2,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
  ExternalLink,
} from 'lucide-react';
import {
  BIAS_LAB_PRESETS,
  ETICA_IA_HEADER,
  ETHICAL_PROFILES,
  ETHICS_SIMULATIONS,
  ETHICS_VIDEOS,
  ETHICS_VIDEOTECA_CATEGORIES,
  FORENSIC_VERIFICATION_PROTOCOL,
  IMPOSTOR_CASES,
  MORAL_DILEMMA_INSIGHTS,
  MORAL_DILEMMAS,
  type BiasDimensionKey,
  type EthicalFramework,
  type EthicalProfileKey,
  type EthicsSimulationCard,
  type EthicsSimulationId,
  type EthicsVideoCategory,
  type EthicsVideoItem,
  type ImpostorVerdict,
} from '../data/eticaIaData';
import type { PromptBuilderState } from './PromptBuilder';
import type { ModuleId } from '../data/modulesData';
import { DataEchoSimulator, TransparentBoxSimulator } from './ethics/EthicsXaiAndDataLabs';
import { CityAiSimulator } from './ethics/CityAiSimulator';

const ETHICS_PROGRESS_STORAGE_KEY = 'nucleo_etica_sim_progress_v1';

interface EticaIaViewProps {
  onSendPromptToBuilder: (patch: Partial<PromptBuilderState>) => void;
  onOpenLibraryModule: (modId: ModuleId) => void;
  onOpenRestorationLab: () => void;
}

const SIM_ICONS: Record<EthicsSimulationId, React.ReactNode> = {
  sesgos: <Eye className="w-5 h-5" />,
  dilemas: <Scale className="w-5 h-5" />,
  real_falso: <ShieldCheck className="w-5 h-5" />,
  caja_transparente: <BrainCircuit className="w-5 h-5" />,
  eco_datos: <Database className="w-5 h-5" />,
  impacto_social: <Cpu className="w-5 h-5" />,
};

const CATEGORY_ICONS: Record<EthicsVideoCategory, React.ReactNode> = {
  Fundamentos: <Database className="w-5 h-5" />,
  'Sesgos y Datos': <Eye className="w-5 h-5" />,
  'Derechos y Futuro': <ShieldCheck className="w-5 h-5" />,
  'Diseño Responsable': <Users className="w-5 h-5" />,
  Debates: <MessageSquare className="w-5 h-5" />,
};

const BIAS_DIMENSION_META: { key: BiasDimensionKey; label: string }[] = [
  { key: 'gender', label: 'Género predominante' },
  { key: 'skinTone', label: 'Tono de piel / estética' },
  { key: 'age', label: 'Rango de edad' },
  { key: 'context', label: 'Contexto socioeconómico' },
];

const FRAMEWORK_LABELS: Record<EthicalFramework, string> = {
  utilitarista: 'Utilitarismo',
  deontologico: 'Deontología',
  justicia: 'Justicia Distributiva',
};

export const EticaIaView: React.FC<EticaIaViewProps> = ({
  onSendPromptToBuilder,
  onOpenLibraryModule,
  onOpenRestorationLab,
}) => {
  const [activeSimulation, setActiveSimulation] = useState<EthicsSimulationCard | null>(null);
  const [activeVideoCategory, setActiveVideoCategory] = useState<'Todas' | EthicsVideoCategory>(
    'Todas'
  );
  const [selectedVideo, setSelectedVideo] = useState<EthicsVideoItem | null>(null);
  const [completedSims, setCompletedSims] = useState<EthicsSimulationId[]>(() => {
    try {
      const saved = window.localStorage.getItem(ETHICS_PROGRESS_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Bias Lab state (Laboratorio de Sesgos - 3 pasos con comparador real)
  const [biasStep, setBiasStep] = useState<1 | 2 | 3>(1);
  const [selectedBiasPrompt, setSelectedBiasPrompt] = useState<string>(BIAS_LAB_PRESETS[0].prompt);
  const [hackedPrompt, setHackedPrompt] = useState<string>(BIAS_LAB_PRESETS[0].suggestedHack);
  const [auditedDimensions, setAuditedDimensions] = useState<BiasDimensionKey[]>([]);
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Moral Dilemma state (4 escenarios + perfil ético final)
  const [dilemmaIndex, setDilemmaIndex] = useState<number>(0);
  const [dilemmaStage, setDilemmaStage] = useState<'dilemma' | 'consequence' | 'summary'>(
    'dilemma'
  );
  const [dilemmaChoices, setDilemmaChoices] = useState<Record<string, 'A' | 'B'>>({});

  // Detector de Impostores state (6 rondas con lupa forense 2x y pistas)
  const [impostorIndex, setImpostorIndex] = useState<number>(0);
  const [impostorStage, setImpostorStage] = useState<'inspect' | 'reveal' | 'summary'>('inspect');
  const [impostorAnswers, setImpostorAnswers] = useState<Record<string, ImpostorVerdict>>({});
  const [impostorHintsUsed, setImpostorHintsUsed] = useState<string[]>([]);
  const [zoomActive, setZoomActive] = useState<boolean>(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [activeClueId, setActiveClueId] = useState<number>(1);

  const activePreset =
    BIAS_LAB_PRESETS.find((item) => item.prompt === selectedBiasPrompt) || BIAS_LAB_PRESETS[0];

  const currentDilemma = MORAL_DILEMMAS[dilemmaIndex] || MORAL_DILEMMAS[0];
  const currentChoiceKey = dilemmaChoices[currentDilemma.id];
  const currentChosenOption =
    currentChoiceKey === 'A'
      ? currentDilemma.optionA
      : currentChoiceKey === 'B'
        ? currentDilemma.optionB
        : null;

  const currentImpostorCase = IMPOSTOR_CASES[impostorIndex] || IMPOSTOR_CASES[0];
  const currentImpostorAnswer = impostorAnswers[currentImpostorCase.id];
  const impostorScore = IMPOSTOR_CASES.reduce(
    (acc, item) => acc + (impostorAnswers[item.id] === item.verdict ? 1 : 0),
    0
  );
  const impostorAnsweredCount = Object.keys(impostorAnswers).length;

  useEffect(() => {
    try {
      window.localStorage.setItem(ETHICS_PROGRESS_STORAGE_KEY, JSON.stringify(completedSims));
    } catch {
      // ignore storage restrictions in private iframes
    }
  }, [completedSims]);

  const markCompleted = (simId: EthicsSimulationId) => {
    setCompletedSims((prev) => (prev.includes(simId) ? prev : [...prev, simId]));
  };

  const handleResetProgress = () => {
    setCompletedSims([]);
  };

  useEffect(() => {
    if (activeSimulation?.id === 'sesgos' && biasStep === 3) {
      markCompleted('sesgos');
    }
  }, [activeSimulation, biasStep]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedVideo) setSelectedVideo(null);
        else if (activeSimulation) setActiveSimulation(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedVideo, activeSimulation]);

  const openSimulation = (sim: EthicsSimulationCard) => {
    if (sim.id === 'sesgos') {
      setBiasStep(1);
      setAuditedDimensions([]);
      setCompareMode('side-by-side');
      setSliderPosition(50);
    } else if (sim.id === 'dilemas') {
      setDilemmaIndex(0);
      setDilemmaStage('dilemma');
      setDilemmaChoices({});
    } else if (sim.id === 'real_falso') {
      setImpostorIndex(0);
      setImpostorStage('inspect');
      setImpostorAnswers({});
      setImpostorHintsUsed([]);
      setZoomActive(false);
      setZoomOrigin({ x: 50, y: 50 });
      setActiveClueId(1);
    }
    setActiveSimulation(sim);
  };

  const handleSelectBiasPrompt = (promptText: string) => {
    const matched = BIAS_LAB_PRESETS.find((item) => item.prompt === promptText);
    setSelectedBiasPrompt(promptText);
    if (matched) {
      setHackedPrompt(matched.suggestedHack);
    }
    setAuditedDimensions([]);
    setSliderPosition(50);
    setBiasStep(2);
  };

  const toggleBiasDimension = (key: BiasDimensionKey) => {
    setAuditedDimensions((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleChooseDilemmaOption = (optionId: 'A' | 'B') => {
    setDilemmaChoices((prev) => ({
      ...prev,
      [currentDilemma.id]: optionId,
    }));
    setDilemmaStage('consequence');
  };

  const handleAdvanceDilemma = () => {
    if (dilemmaIndex < MORAL_DILEMMAS.length - 1) {
      setDilemmaIndex((prev) => prev + 1);
      setDilemmaStage('dilemma');
    } else {
      setDilemmaStage('summary');
      markCompleted('dilemas');
    }
  };

  const handleResetDilemmas = () => {
    setDilemmaIndex(0);
    setDilemmaStage('dilemma');
    setDilemmaChoices({});
  };

  const handleImpostorGuess = (guess: ImpostorVerdict) => {
    setImpostorAnswers((prev) => ({
      ...prev,
      [currentImpostorCase.id]: guess,
    }));
    setActiveClueId(currentImpostorCase.clues[0]?.id ?? 1);
    setZoomActive(false);
    setImpostorStage('reveal');
  };

  const handleAdvanceImpostor = () => {
    if (impostorIndex < IMPOSTOR_CASES.length - 1) {
      setImpostorIndex((prev) => prev + 1);
      setImpostorStage('inspect');
      setZoomActive(false);
      setZoomOrigin({ x: 50, y: 50 });
      setActiveClueId(1);
    } else {
      setImpostorStage('summary');
      setZoomActive(false);
      markCompleted('real_falso');
    }
  };

  const handleResetImpostor = () => {
    setImpostorIndex(0);
    setImpostorStage('inspect');
    setImpostorAnswers({});
    setImpostorHintsUsed([]);
    setZoomActive(false);
    setZoomOrigin({ x: 50, y: 50 });
    setActiveClueId(1);
  };

  const handleUpdateZoomPoint = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x: Math.round(x), y: Math.round(y) });
  };

  const handleFocusClue = (clueId: number, x: number, y: number) => {
    setActiveClueId(clueId);
    setZoomOrigin({ x, y });
  };

  const computeEthicalProfile = () => {
    const counts: Record<EthicalFramework, number> = {
      utilitarista: 0,
      deontologico: 0,
      justicia: 0,
    };
    MORAL_DILEMMAS.forEach((scenario) => {
      const pick = dilemmaChoices[scenario.id];
      if (!pick) return;
      const opt = pick === 'A' ? scenario.optionA : scenario.optionB;
      counts[opt.framework] += 1;
    });

    const entries = Object.entries(counts) as [EthicalFramework, number][];
    entries.sort((a, b) => b[1] - a[1]);

    let profileKey: EthicalProfileKey = 'hibrido';
    if (entries[0][1] >= 3) {
      profileKey = entries[0][0];
    } else if (entries[0][1] === 2 && entries[1][1] <= 1) {
      profileKey = entries[0][0];
    }

    return {
      profile: ETHICAL_PROFILES[profileKey],
      counts,
    };
  };

  const scrollToTarget = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const visibleCategories =
    activeVideoCategory === 'Todas'
      ? ETHICS_VIDEOTECA_CATEGORIES
      : ETHICS_VIDEOTECA_CATEGORIES.filter((c) => c === activeVideoCategory);

  return (
    <div className="bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] transition-colors">
      {/* 1. UMBRAL PROVOCADOR + ENCABEZADO DEL LABORATORIO */}
      <section className="border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#16161C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
          <div className="p-6 sm:p-10 rounded-2xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] space-y-6">
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#F8C300] font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>NÚCLEO COLECTIVO · ÉTICA Y PENSAMIENTO CRÍTICO EN IA</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display-sans tracking-tight leading-[1.05] text-[#F4F2ED] max-w-4xl text-balance">
              {ETICA_IA_HEADER.provocation}
            </h1>

            <p className="text-xs sm:text-sm font-mono-code text-[#F8C300]/90 font-semibold">
              {ETICA_IA_HEADER.warning}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToTarget('etica-simulaciones')}
                className="px-5 py-3 min-h-[44px] text-xs sm:text-sm font-mono-code font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span>{ETICA_IA_HEADER.enterCta}</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToTarget('videoteca')}
                className="px-4 py-3 min-h-[44px] text-xs font-semibold uppercase tracking-wider bg-[#1D1D24] hover:bg-[#2A2A34] text-[#F4F2ED] border border-[#343440] rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Film className="w-4 h-4 text-[#F8C300]" />
                <span>Explorar Videoteca ({ETHICS_VIDEOS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenLibraryModule('mod-26')}
                className="px-4 py-3 min-h-[44px] text-xs font-semibold uppercase tracking-wider bg-transparent hover:bg-white/10 text-[#D8D5CD] border border-[#343440] rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#7545D6]" />
                <span>Módulo 26 · Procedencia</span>
              </button>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              {ETICA_IA_HEADER.title}
            </h2>
            <p className="text-sm sm:text-base font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
              {ETICA_IA_HEADER.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* 2. JUEGOS Y SIMULACIONES ÉTICAS */}
      <section
        id="etica-simulaciones"
        className="py-12 sm:py-16 border-b border-[#DEDAD0] dark:border-[#26262E] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
                EXPERIENCIAS INTERACTIVAS · 6/6 SIMULADORES ACTIVOS
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                Juegos y Simulaciones Éticas
              </h2>
            </div>
            <button
              type="button"
              onClick={() => scrollToTarget('videoteca')}
              className="px-4 py-2.5 min-h-[40px] text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#16161C] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] rounded-lg inline-flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Explorar Videoteca</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Persistent Laboratory Progress Strip */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
                  Progreso del Laboratorio
                </span>
                <span className="text-[#7545D6] dark:text-[#F8C300] font-bold">
                  {completedSims.length} / {ETHICS_SIMULATIONS.length} completados
                </span>
              </div>
              {completedSims.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] hover:text-[#DC2626] dark:hover:text-[#F87171] inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reiniciar progreso</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-6 gap-1.5" aria-hidden="true">
              {ETHICS_SIMULATIONS.map((sim) => {
                const done = completedSims.includes(sim.id);
                return (
                  <div
                    key={sim.id}
                    className={`h-2 rounded-sm transition-colors ${
                      done
                        ? 'bg-[#16A34A] dark:bg-[#4ADE80]'
                        : 'bg-[#DEDAD0] dark:bg-[#26262E]'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
              {completedSims.length === ETHICS_SIMULATIONS.length
                ? 'Recorrido completo: exploraste los 6 laboratorios interactivos de pensamiento crítico en IA.'
                : 'Completa cada simulador para registrar tu recorrido ético (guardado localmente en este navegador).'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {ETHICS_SIMULATIONS.map((sim) => {
              const isActive = sim.status === 'Activo';
              const isCompleted = completedSims.includes(sim.id);
              return (
                <article
                  key={sim.id}
                  className="group rounded-xl bg-white dark:bg-[#16161C] border-2 border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-colors flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => openSimulation(sim)}
                      className="relative w-full aspect-video bg-[#101014] overflow-hidden block text-left border-b border-[#DEDAD0] dark:border-[#26262E]"
                      aria-label={`Abrir ${sim.title}`}
                    >
                      <img
                        src={sim.coverImage}
                        alt={sim.coverAlt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          isActive ? 'opacity-100' : 'opacity-80 grayscale-[20%]'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/65 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-mono-code text-[#F4F2ED]">
                        <span className="font-semibold drop-shadow">{sim.metaLabel}</span>
                      </div>
                    </button>

                    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-extrabold font-display-sans uppercase tracking-wide text-[#101014] dark:text-[#F4F2ED]">
                          {sim.title}
                        </h3>
                        <div
                          className={`text-[11px] font-mono-code font-bold uppercase flex items-center gap-1.5 ${
                            isCompleted
                              ? 'text-[#16A34A] dark:text-[#4ADE80]'
                              : isActive
                                ? 'text-[#326BFF] dark:text-[#F8C300]'
                                : 'text-[#6A6A76] dark:text-[#8E8C85]'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                          <span>{isCompleted ? 'Completado' : `Estado: ${sim.status}`}</span>
                        </div>
                      </div>
                      <div
                        className={`p-2.5 rounded-lg shrink-0 ${
                          isActive
                            ? 'bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300]'
                            : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#5B5B66] dark:text-[#A09E97]'
                        }`}
                      >
                        {SIM_ICONS[sim.id]}
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-xs sm:text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                        {sim.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED]/60 dark:bg-[#101014]/60">
                    <button
                      type="button"
                      onClick={() => openSimulation(sim)}
                      className={`w-full py-2.5 px-4 min-h-[40px] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        isActive
                          ? 'bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014]'
                          : 'bg-white dark:bg-[#18181F] text-[#4A4A55] dark:text-[#C8C6BF] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF]'
                      }`}
                    >
                      <span>{isActive ? 'Abrir Simulador' : 'Ver Vista Previa'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VIDEOTECA CRÍTICA */}
      <section
        id="videoteca"
        className="py-12 sm:py-16 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#16161C] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="space-y-4">
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] font-bold">
              ARCHIVO AUDIOVISUAL · {ETHICS_VIDEOS.length} CHARLAS Y PANELES
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              Videoteca Crítica
            </h2>
            <p className="max-w-3xl text-sm sm:text-base font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
              Conferencias, paneles y debates sobre los desafíos éticos, sociales y culturales de
              la inteligencia artificial.
            </p>

            {/* Category Filter Controls */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(['Todas', ...ETHICS_VIDEOTECA_CATEGORIES] as const).map((category) => {
                const isSelected = activeVideoCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveVideoCategory(category)}
                    className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-14">
            {visibleCategories.map((category) => {
              const items = ETHICS_VIDEOS.filter((video) => video.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#DEDAD0] dark:border-[#26262E]">
                    <div className="p-2.5 rounded-lg bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300]">
                      {CATEGORY_ICONS[category]}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                        {category}
                      </h3>
                      <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                        {items.length} videos seleccionados
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((video) => (
                      <article
                        key={video.id}
                        className="rounded-xl overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-colors flex flex-col justify-between group"
                      >
                        <div>
                          <button
                            type="button"
                            onClick={() => setSelectedVideo(video)}
                            className="relative w-full aspect-video overflow-hidden bg-[#101014] block text-left"
                            aria-label={`Reproducir video: ${video.title}`}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                              alt={video.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors flex items-center justify-center">
                              <PlayCircle className="w-12 h-12 text-[#F8C300] drop-shadow" />
                            </div>
                          </button>

                          <div className="p-4 sm:p-5 space-y-2">
                            <h4 className="text-sm sm:text-base font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-snug">
                              {video.title}
                            </h4>
                            <p className="text-xs font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                              {video.description}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                          <button
                            type="button"
                            onClick={() => setSelectedVideo(video)}
                            className="w-full py-2.5 px-4 min-h-[40px] text-xs font-mono-code font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>VER VIDEO</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PUENTES CON EL LABORATORIO VISUAL DE NÚCLEO COLECTIVO */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
                PRÁCTICA EN EL ECOSISTEMA VISUAL
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                Aplica estos principios en tus prompts, archivos y diseños
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                Conecta la reflexión ética con la práctica diaria: revisa estándares WCAG, audita
                consentimiento y procedencia en proyectos comunitarios y protege la identidad en
                restauración patrimonial.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onOpenLibraryModule('mod-25')}
                className="px-4 py-2.5 min-h-[40px] text-xs font-semibold bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] rounded-lg"
              >
                Módulo 25 · Accesibilidad
              </button>
              <button
                type="button"
                onClick={() => onOpenLibraryModule('mod-26')}
                className="px-4 py-2.5 min-h-[40px] text-xs font-semibold bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] rounded-lg"
              >
                Módulo 26 · Procedencia
              </button>
              <button
                type="button"
                onClick={onOpenRestorationLab}
                className="px-4 py-2.5 min-h-[40px] text-xs font-bold uppercase tracking-wider bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg"
              >
                Restauración Ética
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE SIMULACIONES ÉTICAS */}
      {activeSimulation && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sim-modal-title"
          onClick={() => setActiveSimulation(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#2C2C36] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-white/95 dark:bg-[#16161C]/95 backdrop-blur-md border-b border-[#DEDAD0] dark:border-[#26262E]">
              <div className="min-w-0">
                <div className="text-[11px] font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                  LABORATORIO DE ÉTICA IA · SIMULADOR
                </div>
                <h3
                  id="sim-modal-title"
                  className="text-lg sm:text-xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] truncate"
                >
                  {activeSimulation.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSimulation(null)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] shrink-0"
                aria-label="Cerrar simulador"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-6">
              {activeSimulation.id === 'sesgos' && (
                <div className="space-y-6">
                  {/* Step indicator */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { step: 1 as const, label: '1. Elige Prompt' },
                        { step: 2 as const, label: '2. Audita el Sesgo' },
                        { step: 3 as const, label: '3. Hackea y Compara' },
                      ].map((item) => (
                        <button
                          key={item.step}
                          type="button"
                          onClick={() => setBiasStep(item.step)}
                          className={`px-3 py-2 min-h-[40px] rounded-lg border font-bold transition-colors ${
                            biasStep === item.step
                              ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                              : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#5B5B66] dark:text-[#A09E97]">
                      Caso activo: &ldquo;{activePreset.prompt}&rdquo;
                    </span>
                  </div>

                  {biasStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <h4 className="text-xl font-bold font-display-sans">
                          Paso 1: Elige un prompt genérico
                        </h4>
                        <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                          Cuando pedimos una imagen sin especificar contexto, los modelos reproducen
                          el promedio estadístico de sus datos de entrenamiento. Selecciona un caso
                          para inspeccionar el estereotipo visual:
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        {BIAS_LAB_PRESETS.map((preset) => {
                          const isCurrent = preset.prompt === selectedBiasPrompt;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSelectBiasPrompt(preset.prompt)}
                              className={`group rounded-xl border-2 overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] text-left transition-colors ${
                                isCurrent
                                  ? 'border-[#F8C300]'
                                  : 'border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300]'
                              }`}
                            >
                              <div className="aspect-[4/3] w-full bg-[#101014] overflow-hidden relative">
                                <img
                                  src={preset.beforeImage}
                                  alt={preset.beforeAlt}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/75 via-transparent to-transparent" />
                                <div className="absolute bottom-2.5 left-3 right-3 text-[11px] font-mono-code text-[#F8C300] font-semibold">
                                  Prompt sin contexto
                                </div>
                              </div>
                              <div className="p-3.5 space-y-1">
                                <div className="font-bold font-display-sans text-sm sm:text-base text-[#101014] dark:text-[#F4F2ED] flex items-center justify-between gap-2">
                                  <span>&ldquo;{preset.prompt}&rdquo;</span>
                                  <ArrowRight className="w-4 h-4 shrink-0 text-[#7545D6] dark:text-[#F8C300]" />
                                </div>
                                <p className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                                  {preset.homogeneityNote}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {biasStep === 2 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold font-display-sans">
                          Paso 2: Audita el estereotipo visual
                        </h4>
                        <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                          Salida típica generada para{' '}
                          <span className="font-bold text-[#7545D6] dark:text-[#F8C300]">
                            &ldquo;{activePreset.prompt}&rdquo;
                          </span>
                          . Haz clic en cada dimensión que identifiques en la imagen:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        {/* Real Stereotype Image */}
                        <div className="md:col-span-6 space-y-2">
                          <div className="rounded-xl overflow-hidden border border-[#DEDAD0] dark:border-[#2C2C36] bg-[#101014]">
                            <div className="px-3 py-2 border-b border-[#26262E] flex items-center justify-between text-[11px] font-mono-code text-[#D8D5CD]">
                              <span>SALIDA SIN CONTEXTO</span>
                              <span className="text-[#F8C300]">ANTES</span>
                            </div>
                            <div className="aspect-[4/3] w-full bg-[#101014]">
                              <img
                                src={activePreset.beforeImage}
                                alt={activePreset.beforeAlt}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <p className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                            {activePreset.homogeneityNote}
                          </p>
                        </div>

                        {/* Interactive 4-Dimension Audit */}
                        <div className="md:col-span-6 space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono-code">
                            <span className="font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
                              Checklist de sesgos
                            </span>
                            <span className="text-[#7545D6] dark:text-[#F8C300] font-bold">
                              {auditedDimensions.length}/4 auditadas
                            </span>
                          </div>

                          {BIAS_DIMENSION_META.map((dim) => {
                            const checked = auditedDimensions.includes(dim.key);
                            return (
                              <button
                                key={dim.key}
                                type="button"
                                onClick={() => toggleBiasDimension(dim.key)}
                                aria-pressed={checked}
                                className={`w-full p-3 rounded-lg border text-left transition-colors flex items-start gap-3 ${
                                  checked
                                    ? 'bg-[#F8C300]/15 border-[#F8C300] text-[#101014] dark:text-[#F4F2ED]'
                                    : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                                }`}
                              >
                                <span
                                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                                    checked
                                      ? 'bg-[#101014] dark:bg-[#F8C300] border-[#101014] dark:border-[#F8C300] text-[#F4F2ED] dark:text-[#101014]'
                                      : 'border-[#9A9890] dark:border-[#444452]'
                                  }`}
                                >
                                  {checked && <Check className="w-3.5 h-3.5" />}
                                </span>
                                <span className="text-xs leading-snug">
                                  <strong className="block mb-0.5">{dim.label}</strong>
                                  <span className="text-[#4A4A55] dark:text-[#B4B2AC]">
                                    {activePreset.dimensions[dim.key]}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* ¡Curioso! Alert */}
                      <div className="p-4 rounded-xl bg-[#F8C300]/15 border border-[#F8C300]/60 space-y-1">
                        <div className="text-sm font-bold text-[#101014] dark:text-[#F8C300]">
                          ¡Curioso! ¿Neutralidad o herencia estadística?
                        </div>
                        <p className="text-xs sm:text-sm text-[#101014] dark:text-[#F4F2ED] leading-relaxed">
                          {activePreset.observedPattern}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setBiasStep(3)}
                        className="w-full py-3 px-4 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>Paso 3: Hackear el Sesgo y Comparar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {biasStep === 3 && (
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold font-display-sans">
                            Paso 3: Hackea el Sesgo
                          </h4>
                          <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                            Compara el estereotipo genérico con una dirección visual específica y
                            ajusta el prompt para llevarlo al Constructor.
                          </p>
                        </div>

                        {/* Comparison Mode Toggle */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setCompareMode('side-by-side')}
                            className={`px-3 py-2 min-h-[40px] text-xs font-mono-code font-bold rounded-lg border inline-flex items-center gap-1.5 transition-colors ${
                              compareMode === 'side-by-side'
                                ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E]'
                            }`}
                          >
                            <Columns2 className="w-3.5 h-3.5" />
                            <span>Lado a lado</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCompareMode('slider')}
                            className={`px-3 py-2 min-h-[40px] text-xs font-mono-code font-bold rounded-lg border inline-flex items-center gap-1.5 transition-colors ${
                              compareMode === 'slider'
                                ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E]'
                            }`}
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Deslizador</span>
                          </button>
                        </div>
                      </div>

                      {/* Real Before vs After Visual Comparator */}
                      {compareMode === 'side-by-side' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-xl overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                            <div className="px-3.5 py-2 border-b border-[#DEDAD0] dark:border-[#26262E] flex items-center justify-between text-[11px] font-mono-code font-bold text-[#5B5B66] dark:text-[#A09E97]">
                              <span>ANTES · PROMPT GENÉRICO</span>
                              <span>SESGO</span>
                            </div>
                            <div className="aspect-[4/3] bg-[#101014]">
                              <img
                                src={activePreset.beforeImage}
                                alt={activePreset.beforeAlt}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3.5 space-y-1">
                              <p className="text-xs font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED]">
                                &ldquo;{activePreset.prompt}&rdquo;
                              </p>
                              <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                                {activePreset.homogeneityNote}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-xl overflow-hidden bg-[#F8C300]/10 border-2 border-[#F8C300]">
                            <div className="px-3.5 py-2 border-b border-[#F8C300]/40 flex items-center justify-between text-[11px] font-mono-code font-bold text-[#101014] dark:text-[#F8C300]">
                              <span>DESPUÉS · PROMPT SITUADO</span>
                              <span>CURADO</span>
                            </div>
                            <div className="aspect-[4/3] bg-[#101014]">
                              <img
                                src={activePreset.afterImage}
                                alt={activePreset.afterAlt}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3.5 space-y-1">
                              <p className="text-xs font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] line-clamp-2">
                                &ldquo;{hackedPrompt}&rdquo;
                              </p>
                              <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                                {activePreset.hackSummary}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="relative aspect-[4/3] w-full max-w-xl mx-auto rounded-xl overflow-hidden bg-[#101014] border-2 border-[#DEDAD0] dark:border-[#2C2C36] select-none">
                            {/* Base: AFTER image */}
                            <img
                              src={activePreset.afterImage}
                              alt={activePreset.afterAlt}
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Overlay: BEFORE image clipped */}
                            <img
                              src={activePreset.beforeImage}
                              alt={activePreset.beforeAlt}
                              referrerPolicy="no-referrer"
                              style={{
                                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                              }}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Divider Line */}
                            <div
                              style={{ left: `${sliderPosition}%` }}
                              className="absolute top-0 bottom-0 w-0.5 bg-[#F8C300] shadow"
                              aria-hidden="true"
                            />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#101014]/85 text-[#F4F2ED] text-[11px] font-mono-code font-bold">
                              ANTES (GENÉRICO)
                            </div>
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#F8C300] text-[#101014] text-[11px] font-mono-code font-bold">
                              DESPUÉS (HACKEADO)
                            </div>
                          </div>

                          <div className="max-w-xl mx-auto space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                              <label htmlFor="bias-compare-slider">
                                Desliza para comparar estereotipo vs. curaduría
                              </label>
                              <span className="font-bold text-[#101014] dark:text-[#F8C300]">
                                {sliderPosition}%
                              </span>
                            </div>
                            <input
                              id="bias-compare-slider"
                              type="range"
                              min={5}
                              max={95}
                              value={sliderPosition}
                              onChange={(e) => setSliderPosition(Number(e.target.value))}
                              className="w-full accent-[#F8C300] cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {/* Prompt Rewrite Box */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between gap-2">
                          <label
                            htmlFor="hacked-prompt-input"
                            className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]"
                          >
                            EDITA TU PROMPT DE INTERVENCIÓN
                          </label>
                          <button
                            type="button"
                            onClick={() => setHackedPrompt(activePreset.suggestedHack)}
                            className="text-[11px] font-mono-code text-[#326BFF] dark:text-[#F8C300] hover:underline"
                          >
                            Restaurar sugerencia
                          </button>
                        </div>
                        <textarea
                          id="hacked-prompt-input"
                          rows={3}
                          value={hackedPrompt}
                          onChange={(e) => setHackedPrompt(e.target.value)}
                          className="w-full p-3 rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] bg-white dark:bg-[#101014] text-sm font-mono-code text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setBiasStep(1)}
                          className="py-3 px-4 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF] text-[#101014] dark:text-[#F4F2ED] rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Wand2 className="w-4 h-4" />
                          <span>Probar Otro Caso</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSimulation(null);
                            onSendPromptToBuilder({
                              mode: 'photo',
                              subject: hackedPrompt,
                              lighting: 'Natural daylight honest documentary light',
                              texture: 'natural skin texture, real microdetails',
                              visualStyle: 'Editorial Documental Inclusivo',
                            });
                          }}
                          className="py-3 px-4 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#7545D6] hover:bg-[#6438c0] text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Enviar al Constructor</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSimulation.id === 'dilemas' && (
                <div className="space-y-6">
                  {/* Segmented 4-Scenario Progress Header */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
                      <span className="font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                        {dilemmaStage === 'summary'
                          ? 'SÍNTESIS FINAL · PERFIL ÉTICO'
                          : `${currentDilemma.code} DE 0${MORAL_DILEMMAS.length} · ${currentDilemma.domain}`}
                      </span>
                      <span className="text-[#5B5B66] dark:text-[#A09E97]">
                        {Object.keys(dilemmaChoices).length}/{MORAL_DILEMMAS.length} decisiones
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                      {MORAL_DILEMMAS.map((scenario, idx) => {
                        const isDone = Boolean(dilemmaChoices[scenario.id]);
                        const isCurrent = dilemmaStage !== 'summary' && idx === dilemmaIndex;
                        return (
                          <div
                            key={scenario.id}
                            className={`h-1.5 rounded-sm transition-colors ${
                              isCurrent
                                ? 'bg-[#7545D6] dark:bg-[#F8C300]'
                                : isDone
                                  ? 'bg-[#101014] dark:bg-[#F4F2ED]'
                                  : 'bg-[#DEDAD0] dark:bg-[#26262E]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {dilemmaStage === 'dilemma' && (
                    <div className="space-y-5">
                      {/* Editorial Scene Visual */}
                      <div className="rounded-xl overflow-hidden border border-[#DEDAD0] dark:border-[#2C2C36] bg-[#101014]">
                        <div className="aspect-video w-full bg-[#101014] relative">
                          <img
                            src={currentDilemma.image}
                            alt={currentDilemma.imageAlt}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/80 via-[#101014]/20 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4 space-y-0.5">
                            <div className="text-[11px] font-mono-code font-bold uppercase text-[#F8C300]">
                              {currentDilemma.domain}
                            </div>
                            <h4 className="text-lg sm:text-2xl font-extrabold font-display-sans text-[#F4F2ED]">
                              {currentDilemma.title}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                        {currentDilemma.context}
                      </p>

                      {/* Core Ethical Tension */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3 p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                        <div className="text-center sm:text-left">
                          <div className="text-sm font-extrabold font-display-sans text-[#DC2626] dark:text-[#F87171]">
                            {currentDilemma.tensionLeft.label}
                          </div>
                          <div className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                            {currentDilemma.tensionLeft.detail}
                          </div>
                        </div>
                        <div className="text-center text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#5B5B66] dark:text-[#A09E97]">
                          TENSIÓN ÉTICA
                        </div>
                        <div className="text-center sm:text-right">
                          <div className="text-sm font-extrabold font-display-sans text-[#326BFF] dark:text-[#60A5FA]">
                            {currentDilemma.tensionRight.label}
                          </div>
                          <div className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                            {currentDilemma.tensionRight.detail}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm sm:text-base font-extrabold font-display-sans uppercase tracking-wide">
                          ¿Qué regla programas en el sistema?
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[currentDilemma.optionA, currentDilemma.optionB].map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleChooseDilemmaOption(option.id)}
                              className="p-4 rounded-xl border-2 border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] bg-[#F4F2ED] dark:bg-[#101014] transition-colors flex flex-col justify-between text-left gap-2"
                            >
                              <div className="space-y-1.5">
                                <span className="block font-bold text-base text-[#7545D6] dark:text-[#F8C300]">
                                  {option.title}
                                </span>
                                <span className="block text-xs sm:text-sm text-[#101014] dark:text-[#F4F2ED] leading-relaxed">
                                  {option.actionSummary}
                                </span>
                              </div>
                              <span className="block text-xs font-mono-code font-semibold text-[#B45309] dark:text-[#F8C300]/90 pt-2 border-t border-[#DEDAD0] dark:border-[#26262E]">
                                Costo ético: {option.tradeoff}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {dilemmaStage === 'consequence' && currentChosenOption && (
                    <div className="space-y-5">
                      <div className="p-5 sm:p-6 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] space-y-3">
                        <div className="text-xs font-mono-code font-bold uppercase text-[#F8C300]">
                          CÓDIGO EJECUTADO · {currentChosenOption.frameworkLabel}
                        </div>
                        <h4 className="text-xl sm:text-2xl font-extrabold font-display-sans text-[#F4F2ED]">
                          {currentChosenOption.consequenceHeadline}
                        </h4>
                        <p className="text-xs sm:text-sm font-mono-code text-[#D8D5CD] leading-relaxed">
                          {currentChosenOption.consequenceDetail}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F8C300]/15 border border-[#F8C300]/60 space-y-1">
                        <div className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F8C300]">
                          PREGUNTA CRÍTICA PARA TU PROYECTO
                        </div>
                        <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED]">
                          {currentChosenOption.reflectionQuestion}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setDilemmaStage('dilemma')}
                          className="px-4 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF] rounded-lg inline-flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Cambiar decisión</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleAdvanceDilemma}
                          className="px-6 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-2 transition-colors"
                        >
                          <span>
                            {dilemmaIndex < MORAL_DILEMMAS.length - 1
                              ? `Siguiente dilema (${dilemmaIndex + 2}/${MORAL_DILEMMAS.length})`
                              : 'Ver mi Perfil Ético'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {dilemmaStage === 'summary' &&
                    (() => {
                      const { profile, counts } = computeEthicalProfile();
                      const frameworks: EthicalFramework[] = [
                        'utilitarista',
                        'deontologico',
                        'justicia',
                      ];
                      return (
                        <div className="space-y-6">
                          {/* Profile Headline */}
                          <div className="p-5 sm:p-6 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] space-y-2.5">
                            <div className="text-xs font-mono-code font-bold uppercase text-[#F8C300]">
                              TU TENDENCIA EN LOS 4 ESCENARIOS
                            </div>
                            <h4 className="text-2xl sm:text-3xl font-extrabold font-display-sans">
                              {profile.title}
                            </h4>
                            <p className="text-sm font-semibold text-[#F8C300]/95">
                              {profile.subtitle}
                            </p>
                            <p className="text-xs sm:text-sm font-mono-code text-[#D8D5CD] leading-relaxed">
                              {profile.description}
                            </p>
                          </div>

                          {/* Framework Distribution Bars */}
                          <div className="p-4 sm:p-5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                            <div className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
                              DISTRIBUCIÓN DE CRITERIOS APLICADOS
                            </div>
                            <div className="space-y-2.5">
                              {frameworks.map((fw) => {
                                const value = counts[fw];
                                const pct = Math.round((value / MORAL_DILEMMAS.length) * 100);
                                return (
                                  <div key={fw} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs font-mono-code">
                                      <span className="font-bold text-[#101014] dark:text-[#F4F2ED]">
                                        {FRAMEWORK_LABELS[fw]}
                                      </span>
                                      <span className="text-[#5B5B66] dark:text-[#A09E97]">
                                        {value}/{MORAL_DILEMMAS.length} ({pct}%)
                                      </span>
                                    </div>
                                    <div className="h-2 w-full rounded bg-[#DEDAD0] dark:bg-[#26262E] overflow-hidden">
                                      <div
                                        style={{ width: `${pct}%` }}
                                        className="h-full bg-[#7545D6] dark:bg-[#F8C300] transition-all duration-300"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Blind Spot & Governance Lesson */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-[#F8C300]/15 border border-[#F8C300]/60 space-y-1">
                              <div className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F8C300]">
                                PUNTO CIEGO A VIGILAR
                              </div>
                              <p className="text-xs sm:text-sm text-[#101014] dark:text-[#F4F2ED] leading-relaxed">
                                {profile.blindSpot}
                              </p>
                            </div>
                            <div className="p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-1">
                              <div className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                                APLICACIÓN EN GOBERNANZA IA
                              </div>
                              <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                                {profile.governanceLesson}
                              </p>
                            </div>
                          </div>

                          {/* 4 Decisions Recap */}
                          <div className="space-y-2">
                            <div className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
                              RESUMEN DE TUS 4 DECISIONES
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {MORAL_DILEMMAS.map((scenario) => {
                                const choice = dilemmaChoices[scenario.id];
                                const picked =
                                  choice === 'A' ? scenario.optionA : scenario.optionB;
                                return (
                                  <div
                                    key={scenario.id}
                                    className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-xs space-y-1"
                                  >
                                    <div className="font-mono-code text-[10px] font-bold text-[#7545D6] dark:text-[#F8C300]">
                                      {scenario.code} · {scenario.title}
                                    </div>
                                    <div className="font-semibold text-[#101014] dark:text-[#F4F2ED]">
                                      {picked.title}
                                    </div>
                                    <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                                      {FRAMEWORK_LABELS[picked.framework]}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* MIT Moral Machine Global Context */}
                          <div className="text-left p-5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                            <div className="flex items-center gap-2.5">
                              <Globe className="w-5 h-5 text-[#7545D6] dark:text-[#F8C300] shrink-0" />
                              <h5 className="text-base sm:text-lg font-bold font-display-sans">
                                Perspectiva Global · MIT Moral Machine
                              </h5>
                            </div>
                            <ul className="space-y-2 text-xs sm:text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] list-disc list-inside">
                              {MORAL_DILEMMA_INSIGHTS.map((insight) => (
                                <li key={insight.label}>
                                  <strong className="text-[#101014] dark:text-[#F4F2ED]">
                                    {insight.label}
                                  </strong>{' '}
                                  {insight.detail}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={handleResetDilemmas}
                              className="px-6 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-2 transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Repetir los 4 Dilemas</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              )}

              {activeSimulation.id === 'real_falso' && (
                <div className="space-y-6">
                  {/* Segmented 6-Case Progress Header */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
                      <span className="font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                        {impostorStage === 'summary'
                          ? 'REPORTE FORENSE FINAL'
                          : `${currentImpostorCase.code} DE 0${IMPOSTOR_CASES.length} · ${currentImpostorCase.category}`}
                      </span>
                      <span className="text-[#5B5B66] dark:text-[#A09E97]">
                        Aciertos:{' '}
                        <strong className="text-[#101014] dark:text-[#F4F2ED]">
                          {impostorScore}/{impostorAnsweredCount}
                        </strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5" aria-hidden="true">
                      {IMPOSTOR_CASES.map((item, idx) => {
                        const ans = impostorAnswers[item.id];
                        const isCorrect = ans === item.verdict;
                        const isCurrent = impostorStage !== 'summary' && idx === impostorIndex;
                        return (
                          <div
                            key={item.id}
                            className={`h-1.5 rounded-sm transition-colors ${
                              isCurrent
                                ? 'bg-[#7545D6] dark:bg-[#F8C300]'
                                : ans
                                  ? isCorrect
                                    ? 'bg-[#16A34A] dark:bg-[#4ADE80]'
                                    : 'bg-[#DC2626] dark:bg-[#F87171]'
                                  : 'bg-[#DEDAD0] dark:bg-[#26262E]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {impostorStage !== 'summary' && (
                    <div className="space-y-5">
                      {/* Pedagogical Framing & Forensic Toolbar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <h4 className="text-lg sm:text-xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                            {currentImpostorCase.title}
                          </h4>
                          <p className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                            Entrenamiento forense: analiza luz, texto, reflejos y anatomía antes de
                            decidir.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setZoomActive((prev) => !prev)}
                            aria-pressed={zoomActive}
                            className={`px-3 py-2 min-h-[40px] text-xs font-mono-code font-bold rounded-lg border inline-flex items-center gap-1.5 transition-colors ${
                              zoomActive
                                ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF]'
                            }`}
                          >
                            {zoomActive ? (
                              <ZoomOut className="w-3.5 h-3.5" />
                            ) : (
                              <ZoomIn className="w-3.5 h-3.5" />
                            )}
                            <span>{zoomActive ? 'Salir de Lupa' : 'Lupa 2×'}</span>
                          </button>

                          {impostorStage === 'inspect' && (
                            <button
                              type="button"
                              onClick={() => {
                                if (!impostorHintsUsed.includes(currentImpostorCase.id)) {
                                  setImpostorHintsUsed((prev) => [...prev, currentImpostorCase.id]);
                                }
                              }}
                              className="px-3 py-2 min-h-[40px] text-xs font-mono-code font-bold rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] bg-[#F4F2ED] dark:bg-[#101014] hover:border-[#7545D6] text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                              <span>Ver Pista</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Forensic Image Inspection Stage */}
                      <div className="rounded-xl overflow-hidden border-2 border-[#DEDAD0] dark:border-[#2C2C36] bg-[#101014]">
                        <div className="px-3.5 py-2 border-b border-[#26262E] flex items-center justify-between gap-2 text-[11px] font-mono-code text-[#D8D5CD]">
                          <span>
                            {zoomActive
                              ? `MODO LUPA 2× · COORD (${zoomOrigin.x}%, ${zoomOrigin.y}%) — Mueve el cursor o toca la zona`
                              : impostorStage === 'reveal'
                                ? 'INSPECCIÓN REVELADA · HAZ CLIC EN LOS MARCADORES 1–3'
                                : 'EXPEDIENTE VISUAL · ACTIVA LUPA 2× PARA INSPECCIONAR DETALLES'}
                          </span>
                        </div>

                        <div
                          onMouseMove={(e) => {
                            if (!zoomActive) return;
                            handleUpdateZoomPoint(
                              e.clientX,
                              e.clientY,
                              e.currentTarget.getBoundingClientRect()
                            );
                          }}
                          onClick={(e) => {
                            if (!zoomActive) return;
                            handleUpdateZoomPoint(
                              e.clientX,
                              e.clientY,
                              e.currentTarget.getBoundingClientRect()
                            );
                          }}
                          onTouchMove={(e) => {
                            if (!zoomActive || e.touches.length === 0) return;
                            const t = e.touches[0];
                            handleUpdateZoomPoint(
                              t.clientX,
                              t.clientY,
                              e.currentTarget.getBoundingClientRect()
                            );
                          }}
                          className={`relative aspect-[4/3] w-full overflow-hidden bg-[#101014] ${
                            zoomActive ? 'cursor-zoom-out' : 'cursor-default'
                          }`}
                        >
                          <img
                            src={currentImpostorCase.image}
                            alt={currentImpostorCase.imageAlt}
                            referrerPolicy="no-referrer"
                            style={
                              zoomActive
                                ? {
                                    transform: 'scale(2.15)',
                                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                                  }
                                : undefined
                            }
                            className="w-full h-full object-cover transition-transform duration-150 ease-out select-none"
                          />

                          {/* Numbered Forensic Hotspots (visible once revealed and not zoomed) */}
                          {impostorStage === 'reveal' &&
                            !zoomActive &&
                            currentImpostorCase.clues.map((clue) => {
                              const isSelected = activeClueId === clue.id;
                              return (
                                <button
                                  key={clue.id}
                                  type="button"
                                  onClick={() => handleFocusClue(clue.id, clue.x, clue.y)}
                                  style={{ left: `${clue.x}%`, top: `${clue.y}%` }}
                                  aria-label={`Pista ${clue.id}: ${clue.label}`}
                                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg font-mono-code text-xs font-extrabold border-2 shadow-lg transition-transform flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-[#F8C300] text-[#101014] border-[#101014] scale-110 z-20'
                                      : 'bg-[#101014]/90 text-[#F8C300] border-[#F8C300] hover:scale-110 z-10'
                                  }`}
                                >
                                  {clue.id}
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Optional Hint Callout before answering */}
                      {impostorStage === 'inspect' &&
                        impostorHintsUsed.includes(currentImpostorCase.id) && (
                          <div className="p-3.5 rounded-xl bg-[#F8C300]/15 border border-[#F8C300]/60 text-xs sm:text-sm text-[#101014] dark:text-[#F4F2ED] flex items-start gap-2.5">
                            <Lightbulb className="w-4 h-4 text-[#B45309] dark:text-[#F8C300] shrink-0 mt-0.5" />
                            <span>
                              <strong>Pista de inspección:</strong> {currentImpostorCase.hint}
                            </span>
                          </div>
                        )}

                      {/* Decision Controls (Inspect Stage) */}
                      {impostorStage === 'inspect' && (
                        <div className="space-y-2.5">
                          <p className="text-sm font-extrabold font-display-sans uppercase tracking-wide text-[#101014] dark:text-[#F4F2ED]">
                            ¿Cuál es tu veredicto forense?
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <button
                              type="button"
                              onClick={() => handleImpostorGuess('documental')}
                              className="p-4 min-h-[64px] rounded-xl border-2 border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF] bg-[#F4F2ED] dark:bg-[#101014] text-left transition-colors flex items-center gap-3.5"
                            >
                              <div className="p-2.5 rounded-lg bg-[#326BFF]/15 text-[#326BFF] dark:text-[#60A5FA] shrink-0">
                                <Camera className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-bold text-sm sm:text-base text-[#101014] dark:text-[#F4F2ED]">
                                  Patrón Documental
                                </div>
                                <div className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                                  Coherencia óptica, luz y texturas orgánicas
                                </div>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleImpostorGuess('sintetico')}
                              className="p-4 min-h-[64px] rounded-xl border-2 border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] bg-[#F4F2ED] dark:bg-[#101014] text-left transition-colors flex items-center gap-3.5"
                            >
                              <div className="p-2.5 rounded-lg bg-[#7545D6]/15 text-[#7545D6] dark:text-[#F8C300] shrink-0">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-bold text-sm sm:text-base text-[#101014] dark:text-[#F4F2ED]">
                                  Generada por IA
                                </div>
                                <div className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                                  Artefactos en reflejos, texto, piel o geometría
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Reveal & Forensic Analysis Stage */}
                      {impostorStage === 'reveal' && currentImpostorAnswer && (
                        <div className="space-y-4">
                          {(() => {
                            const isCorrect =
                              currentImpostorAnswer === currentImpostorCase.verdict;
                            return (
                              <div
                                className={`p-4 sm:p-5 rounded-xl border-2 space-y-2 ${
                                  isCorrect
                                    ? 'bg-[#16A34A]/10 border-[#16A34A] dark:border-[#4ADE80]'
                                    : 'bg-[#DC2626]/10 border-[#DC2626] dark:border-[#F87171]'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 font-extrabold font-display-sans text-base sm:text-lg text-[#101014] dark:text-[#F4F2ED]">
                                    {isCorrect ? (
                                      <CheckCircle2 className="w-5 h-5 text-[#16A34A] dark:text-[#4ADE80] shrink-0" />
                                    ) : (
                                      <XCircle className="w-5 h-5 text-[#DC2626] dark:text-[#F87171] shrink-0" />
                                    )}
                                    <span>
                                      {isCorrect
                                        ? '¡Diagnóstico acertado!'
                                        : 'Casi — revisa los hallazgos forenses'}
                                    </span>
                                  </div>
                                  <span className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F8C300]">
                                    Clave: {currentImpostorCase.verdictLabel}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm font-mono-code text-[#101014] dark:text-[#E5E3DC] leading-relaxed">
                                  {currentImpostorCase.summary}
                                </p>
                              </div>
                            );
                          })()}

                          {/* 3 Synchronized Forensic Clues */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2 text-xs font-mono-code">
                              <span className="font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
                                3 PUNTOS DE INSPECCIÓN (TOCA PARA ENFOCAR)
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const selected =
                                    currentImpostorCase.clues.find((c) => c.id === activeClueId) ||
                                    currentImpostorCase.clues[0];
                                  if (selected) {
                                    setZoomOrigin({ x: selected.x, y: selected.y });
                                    setZoomActive(true);
                                  }
                                }}
                                className="text-[#326BFF] dark:text-[#F8C300] font-bold hover:underline inline-flex items-center gap-1"
                              >
                                <ZoomIn className="w-3.5 h-3.5" />
                                <span>Acercar punto #{activeClueId}</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                              {currentImpostorCase.clues.map((clue) => {
                                const isSelected = activeClueId === clue.id;
                                return (
                                  <button
                                    key={clue.id}
                                    type="button"
                                    onClick={() => handleFocusClue(clue.id, clue.x, clue.y)}
                                    className={`p-3 rounded-lg border text-left transition-colors space-y-1 ${
                                      isSelected
                                        ? 'bg-[#F8C300]/15 border-[#F8C300] text-[#101014] dark:text-[#F4F2ED]'
                                        : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] font-mono-code text-[11px] font-bold flex items-center justify-center shrink-0">
                                        {clue.id}
                                      </span>
                                      <span className="font-bold text-xs leading-snug">
                                        {clue.label}
                                      </span>
                                    </div>
                                    <p className="text-[11px] font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                                      {clue.detail}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="p-3.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-xs font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                            <strong className="text-[#101014] dark:text-[#F8C300]">
                              Nota de procedencia:
                            </strong>{' '}
                            {currentImpostorCase.provenanceNote}
                          </div>

                          <button
                            type="button"
                            onClick={handleAdvanceImpostor}
                            className="w-full py-3 px-5 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
                          >
                            <span>
                              {impostorIndex < IMPOSTOR_CASES.length - 1
                                ? `Siguiente caso (${impostorIndex + 2}/${IMPOSTOR_CASES.length})`
                                : 'Ver Reporte Forense Final'}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {impostorStage === 'summary' &&
                    (() => {
                      const pct = Math.round((impostorScore / IMPOSTOR_CASES.length) * 100);
                      const rank =
                        impostorScore >= 5
                          ? {
                              title: 'Ojo Forense Crítico',
                              detail:
                                'Detectaste la gran mayoría de inconsistencias ópticas, tipográficas y geométricas. El siguiente nivel es complementar el ojo clínico con verificación de fuente y metadatos C2PA.',
                            }
                          : impostorScore >= 3
                            ? {
                                title: 'Analista en Entrenamiento',
                                detail:
                                  'Reconoces señales evidentes, pero los generadores modernos ya engañan a primera vista. Acostúmbrate a hacer zoom en reflejos, textos secundarios y fondos.',
                              }
                            : {
                                title: 'Alerta ante el Espejismo Visual',
                                detail:
                                  'Las imágenes sintéticas actuales están diseñadas para pasar pruebas rápidas. Nunca tomes una fotografía viral como prueba documental sin contrastar origen y contexto.',
                              };

                      return (
                        <div className="space-y-6">
                          <div className="p-5 sm:p-6 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code font-bold uppercase text-[#F8C300]">
                              <span>RESULTADO DEL ENTRENAMIENTO FORENSE</span>
                              <span>
                                {impostorScore}/{IMPOSTOR_CASES.length} ACIERTOS ({pct}%) ·{' '}
                                {impostorHintsUsed.length} pistas usadas
                              </span>
                            </div>
                            <h4 className="text-2xl sm:text-3xl font-extrabold font-display-sans">
                              {rank.title}
                            </h4>
                            <p className="text-xs sm:text-sm font-mono-code text-[#D8D5CD] leading-relaxed">
                              {rank.detail}
                            </p>
                          </div>

                          {/* 6-Case Breakdown Grid */}
                          <div className="space-y-2">
                            <div className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
                              EXPEDIENTE DE LOS 6 CASOS
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {IMPOSTOR_CASES.map((item) => {
                                const correct = impostorAnswers[item.id] === item.verdict;
                                return (
                                  <div
                                    key={item.id}
                                    className="rounded-lg overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
                                  >
                                    <div className="aspect-[4/3] bg-[#101014]">
                                      <img
                                        src={item.image}
                                        alt={item.imageAlt}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="p-2.5 space-y-1 text-xs">
                                      <div className="flex items-center justify-between gap-1.5 font-mono-code text-[10px] font-bold">
                                        <span className="text-[#5B5B66] dark:text-[#A09E97]">
                                          {item.code}
                                        </span>
                                        <span
                                          className={
                                            correct
                                              ? 'text-[#16A34A] dark:text-[#4ADE80]'
                                              : 'text-[#DC2626] dark:text-[#F87171]'
                                          }
                                        >
                                          {correct ? 'ACIERTO' : 'FALLO'}
                                        </span>
                                      </div>
                                      <div className="font-bold text-[#101014] dark:text-[#F4F2ED] truncate">
                                        {item.title}
                                      </div>
                                      <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                                        {item.verdictLabel}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3-Step Real-World Verification Protocol */}
                          <div className="p-4 sm:p-5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                            <div className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                              PROTOCOLO DE VERIFICACIÓN EN LA VIDA REAL
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {FORENSIC_VERIFICATION_PROTOCOL.map((step) => (
                                <div
                                  key={step.step}
                                  className="p-3 rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-1"
                                >
                                  <div className="text-xs font-mono-code font-bold text-[#326BFF] dark:text-[#F8C300]">
                                    PASO {step.step}
                                  </div>
                                  <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]">
                                    {step.title}
                                  </div>
                                  <p className="text-[11px] font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                                    {step.detail}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={handleResetImpostor}
                              className="px-5 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-2 transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Jugar de Nuevo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSimulation(null);
                                onOpenLibraryModule('mod-26');
                              }}
                              className="px-5 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF] text-[#101014] dark:text-[#F4F2ED] rounded-lg inline-flex items-center gap-2 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300]" />
                              <span>Módulo 26 · Procedencia C2PA</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              )}

              {activeSimulation.id === 'caja_transparente' && (
                <TransparentBoxSimulator onComplete={() => markCompleted('caja_transparente')} />
              )}

              {activeSimulation.id === 'eco_datos' && (
                <DataEchoSimulator onComplete={() => markCompleted('eco_datos')} />
              )}

              {activeSimulation.id === 'impacto_social' && (
                <CityAiSimulator onComplete={() => markCompleted('impacto_social')} />
              )}

              {activeSimulation.status === 'Próximamente' && (
                <div className="space-y-5">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36]">
                    <img
                      src={activeSimulation.coverImage}
                      alt={activeSimulation.coverAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center space-y-3">
                    <div className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                      {activeSimulation.metaLabel}
                    </div>
                    <p className="text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] max-w-lg mx-auto leading-relaxed">
                      {activeSimulation.description}
                    </p>
                    <p className="text-xs text-[#5B5B66] dark:text-[#A09E97] max-w-md mx-auto">
                      Este último simulador se activa en el Paso 4. Ya puedes explorar los 5
                      simuladores activos del laboratorio o consultar nuestras guías de procedencia.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSimulation(null);
                          onOpenLibraryModule('mod-26');
                        }}
                        className="px-4 py-2.5 min-h-[40px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ir al Módulo 26 · Procedencia</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPRODUCTOR DE VIDEO (YOUTUBE) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ethics-video-title"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl overflow-hidden bg-[#101014] border border-[#2C2C36] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-[#26262E]">
              <div className="min-w-0">
                <div className="text-[11px] font-mono-code font-bold text-[#F8C300]">
                  {selectedVideo.category}
                </div>
                <h3
                  id="ethics-video-title"
                  className="text-sm sm:text-base font-bold text-[#F4F2ED] truncate"
                >
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#18181F] text-[#F4F2ED] border border-[#2C2C36] hover:border-[#F8C300] shrink-0"
                aria-label="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="px-4 sm:px-5 py-3 bg-[#16161C] flex flex-wrap items-center justify-between gap-3 text-xs">
              <p className="text-[#B4B2AC] font-mono-code">{selectedVideo.description}</p>
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8C300] hover:underline font-mono-code font-bold inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Ver en YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
