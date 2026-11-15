import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  Car,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  Film,
  Globe,
  MessageSquare,
  PlayCircle,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  BIAS_LAB_PRESETS,
  ETICA_IA_HEADER,
  ETHICS_SIMULATIONS,
  ETHICS_VIDEOS,
  ETHICS_VIDEOTECA_CATEGORIES,
  MORAL_DILEMMA_INSIGHTS,
  type EthicsSimulationCard,
  type EthicsSimulationId,
  type EthicsVideoCategory,
  type EthicsVideoItem,
} from '../data/eticaIaData';
import type { PromptBuilderState } from './PromptBuilder';
import type { ModuleId } from '../data/modulesData';

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

  // Bias Lab state (Laboratorio de Sesgos - 3 pasos)
  const [biasStep, setBiasStep] = useState<1 | 2 | 3>(1);
  const [selectedBiasPrompt, setSelectedBiasPrompt] = useState<string>(BIAS_LAB_PRESETS[0].prompt);
  const [hackedPrompt, setHackedPrompt] = useState<string>(BIAS_LAB_PRESETS[0].suggestedHack);
  const [showBiasComparison, setShowBiasComparison] = useState(false);

  // Moral Dilemma state (Dilemas Morales - Moral Machine MIT)
  const [dilemmaStage, setDilemmaStage] = useState<'dilemma' | 'consequence'>('dilemma');
  const [dilemmaChoice, setDilemmaChoice] = useState<'pedestrians' | 'passenger' | null>(null);

  const activePreset =
    BIAS_LAB_PRESETS.find((item) => item.prompt === selectedBiasPrompt) || BIAS_LAB_PRESETS[0];

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
      setShowBiasComparison(false);
    } else if (sim.id === 'dilemas') {
      setDilemmaStage('dilemma');
      setDilemmaChoice(null);
    }
    setActiveSimulation(sim);
  };

  const handleSelectBiasPrompt = (promptText: string) => {
    const matched = BIAS_LAB_PRESETS.find((item) => item.prompt === promptText);
    setSelectedBiasPrompt(promptText);
    if (matched) {
      setHackedPrompt(matched.suggestedHack);
    }
    setShowBiasComparison(false);
    setBiasStep(2);
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
                EXPERIENCIAS INTERACTIVAS
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {ETHICS_SIMULATIONS.map((sim) => {
              const isActive = sim.status === 'Activo';
              return (
                <article
                  key={sim.id}
                  className="rounded-xl bg-white dark:bg-[#16161C] border-2 border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-colors flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 p-5 border-b border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-extrabold font-display-sans uppercase tracking-wide text-[#101014] dark:text-[#F4F2ED]">
                          {sim.title}
                        </h3>
                        <div
                          className={`text-[11px] font-mono-code font-bold uppercase ${
                            isActive
                              ? 'text-[#326BFF] dark:text-[#F8C300]'
                              : 'text-[#6A6A76] dark:text-[#8E8C85]'
                          }`}
                        >
                          Estado: {sim.status}
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
                      <span>{isActive ? 'Abrir Simulador' : 'Ver Estado'}</span>
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
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                    {[
                      { step: 1 as const, label: '1. Genera' },
                      { step: 2 as const, label: '2. Analiza' },
                      { step: 3 as const, label: '3. Hackea el Sesgo' },
                    ].map((item) => (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => setBiasStep(item.step)}
                        className={`px-3 py-2 min-h-[40px] rounded-lg border font-bold transition-colors ${
                          biasStep === item.step
                            ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                            : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {biasStep === 1 && (
                    <div className="space-y-4">
                      <div className="text-center space-y-1.5">
                        <h4 className="text-xl font-bold font-display-sans">Paso 1: Genera</h4>
                        <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                          Elige un prompt para analizar qué patrones visuales tiende a reproducir la
                          IA cuando no especificamos contexto:
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {BIAS_LAB_PRESETS.map((preset) => (
                          <button
                            key={preset.prompt}
                            type="button"
                            onClick={() => handleSelectBiasPrompt(preset.prompt)}
                            className="p-4 min-h-[52px] rounded-xl border border-[#DEDAD0] dark:border-[#2C2C36] bg-[#F4F2ED] dark:bg-[#101014] hover:border-[#F8C300] text-left font-semibold text-sm flex items-center gap-3 transition-colors"
                          >
                            <Sparkles className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300] shrink-0" />
                            <span>{preset.prompt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {biasStep === 2 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold font-display-sans">Paso 2: Analiza</h4>
                        <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                          Observa los patrones estadísticos frecuentes para{' '}
                          <span className="font-bold text-[#7545D6] dark:text-[#F8C300]">
                            "{selectedBiasPrompt}"
                          </span>
                          . ¿Qué patrones ves?
                        </p>
                      </div>

                      {/* 6-slot Pattern Matrix Visualization */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['Muestra 01', 'Muestra 02', 'Muestra 03', 'Muestra 04', 'Muestra 05', 'Muestra 06'].map(
                          (slot, idx) => (
                            <div
                              key={slot}
                              className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-2"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                                <span>{slot}</span>
                                <span>Sesgo #{idx + 1}</span>
                              </div>
                              <div className="h-14 rounded-lg bg-[#101014]/5 dark:bg-white/5 flex items-center justify-center">
                                <Users className="w-6 h-6 text-[#5B5B66] dark:text-[#A09E97]" />
                              </div>
                              <div className="text-[11px] font-mono-code text-[#101014] dark:text-[#F4F2ED] leading-snug">
                                {idx % 2 === 0
                                  ? activePreset.dimensions.gender
                                  : activePreset.dimensions.context}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {/* Diagnostic Dimensions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                          <span className="font-bold block mb-0.5">Género predominante:</span>
                          <span className="text-[#4A4A55] dark:text-[#B4B2AC]">
                            {activePreset.dimensions.gender}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                          <span className="font-bold block mb-0.5">Tono de piel / estética:</span>
                          <span className="text-[#4A4A55] dark:text-[#B4B2AC]">
                            {activePreset.dimensions.skinTone}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                          <span className="font-bold block mb-0.5">Rango de edad:</span>
                          <span className="text-[#4A4A55] dark:text-[#B4B2AC]">
                            {activePreset.dimensions.age}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                          <span className="font-bold block mb-0.5">Contexto socioeconómico:</span>
                          <span className="text-[#4A4A55] dark:text-[#B4B2AC]">
                            {activePreset.dimensions.context}
                          </span>
                        </div>
                      </div>

                      {/* ¡Curioso! Alert */}
                      <div className="p-4 rounded-xl bg-[#F8C300]/15 border border-[#F8C300]/60 space-y-1">
                        <div className="text-sm font-bold text-[#101014] dark:text-[#F8C300]">
                          ¡Curioso!
                        </div>
                        <p className="text-xs sm:text-sm text-[#101014] dark:text-[#F4F2ED] leading-relaxed">
                          ¿La IA fue objetiva o heredó el mundo tal como está? Reflexiona sobre el
                          género, tono de piel, edad y contexto económico.{' '}
                          <span className="text-[#4A4A55] dark:text-[#B4B2AC]">
                            {activePreset.observedPattern}
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setBiasStep(3)}
                        className="w-full py-3 px-4 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg flex items-center justify-center gap-2"
                      >
                        <span>Paso 3: Hackea el Sesgo</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {biasStep === 3 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold font-display-sans">
                          Paso 3: Hackea el Sesgo
                        </h4>
                        <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                          Reescribe el prompt para romper el patrón que encontraste.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
                            PROMPT ORIGINAL
                          </label>
                          <p className="p-3 rounded-lg border border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] text-sm font-mono-code mt-1">
                            {selectedBiasPrompt}
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="hacked-prompt-input"
                            className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]"
                          >
                            NUEVO PROMPT (SÉ ESPECÍFICO)
                          </label>
                          <textarea
                            id="hacked-prompt-input"
                            rows={3}
                            value={hackedPrompt}
                            onChange={(e) => setHackedPrompt(e.target.value)}
                            className="w-full mt-1 p-3 rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] bg-white dark:bg-[#101014] text-sm font-mono-code text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setShowBiasComparison(true)}
                          className="py-3 px-4 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg flex items-center justify-center gap-2"
                        >
                          <Wand2 className="w-4 h-4" />
                          <span>Generar Comparación</span>
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
                          className="py-3 px-4 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#7545D6] hover:bg-[#6438c0] text-white rounded-lg flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Probar en Constructor</span>
                        </button>
                      </div>

                      {showBiasComparison && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-2">
                            <div className="text-xs font-mono-code font-bold text-center text-[#5B5B66] dark:text-[#A09E97]">
                              ANTES (PROMPT GENÉRICO)
                            </div>
                            <p className="text-xs font-mono-code text-[#101014] dark:text-[#F4F2ED]">
                              "{selectedBiasPrompt}"
                            </p>
                            <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                              {activePreset.observedPattern}
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-[#F8C300]/15 border border-[#F8C300] space-y-2">
                            <div className="text-xs font-mono-code font-bold text-center text-[#101014] dark:text-[#F8C300]">
                              DESPUÉS (CURADURÍA ESPECÍFICA)
                            </div>
                            <p className="text-xs font-mono-code text-[#101014] dark:text-[#F4F2ED]">
                              "{hackedPrompt}"
                            </p>
                            <p className="text-xs text-[#101014] dark:text-[#F4F2ED] leading-relaxed">
                              Rompe el promedio estadístico indicando edad real, contexto cultural,
                              sujeto específico, oficio y dignidad visual sin depender de estereotipos.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeSimulation.id === 'dilemas' && (
                <div className="space-y-6">
                  {dilemmaStage === 'dilemma' ? (
                    <div className="space-y-6 text-center">
                      <div className="space-y-2">
                        <h4 className="text-xl sm:text-2xl font-extrabold font-display-sans text-[#7545D6] dark:text-[#F8C300]">
                          EL DILEMA DEL VEHÍCULO AUTÓNOMO
                        </h4>
                        <p className="max-w-lg mx-auto text-xs sm:text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                          Un vehículo autónomo sufre una falla de frenos. Debe tomar una decisión
                          instantánea. No hay tiempo para evitar el impacto.
                        </p>
                      </div>

                      {/* Visual Dilemma Scenario */}
                      <div className="max-w-lg mx-auto p-5 sm:p-6 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border-2 border-dashed border-[#7545D6]/40 dark:border-[#F8C300]/40">
                        <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
                          <div className="flex flex-col items-center text-center text-[#DC2626] dark:text-[#F87171]">
                            <Users className="w-10 h-10 sm:w-12 sm:h-12" />
                            <p className="font-bold text-xs sm:text-sm mt-2">5 Peatones</p>
                            <p className="text-[11px] opacity-80">en la trayectoria</p>
                          </div>

                          <div className="flex flex-col items-center text-center text-[#5B5B66] dark:text-[#A09E97]">
                            <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 mb-1" />
                            <span className="text-[10px] sm:text-xs font-mono-code font-bold">
                              IMPACTO INMINENTE
                            </span>
                          </div>

                          <div className="flex flex-col items-center text-center text-[#326BFF] dark:text-[#60A5FA]">
                            <Car className="w-10 h-10 sm:w-12 sm:h-12" />
                            <p className="font-bold text-xs sm:text-sm mt-2">1 Pasajero</p>
                            <p className="text-[11px] opacity-80">dentro del vehículo</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-base sm:text-lg font-extrabold font-display-sans">
                          ¿QUÉ ACCIÓN DEBE TOMAR LA IA?
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              setDilemmaChoice('pedestrians');
                              setDilemmaStage('consequence');
                            }}
                            className="p-4 rounded-xl border-2 border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] bg-[#F4F2ED] dark:bg-[#101014] transition-colors flex flex-col gap-1.5"
                          >
                            <span className="font-bold text-base text-[#7545D6] dark:text-[#F8C300]">
                              Opción A: Desviarse
                            </span>
                            <span className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                              El vehículo se desvía y choca contra una barrera.
                            </span>
                            <span className="text-xs font-bold text-[#DC2626] dark:text-[#F87171] mt-1">
                              Consecuencia: El pasajero es sacrificado para salvar a los peatones.
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDilemmaChoice('passenger');
                              setDilemmaStage('consequence');
                            }}
                            className="p-4 rounded-xl border-2 border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] bg-[#F4F2ED] dark:bg-[#101014] transition-colors flex flex-col gap-1.5"
                          >
                            <span className="font-bold text-base text-[#7545D6] dark:text-[#F8C300]">
                              Opción B: Seguir Recto
                            </span>
                            <span className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                              El vehículo continúa su trayectoria programada.
                            </span>
                            <span className="text-xs font-bold text-[#DC2626] dark:text-[#F87171] mt-1">
                              Consecuencia: Los peatones son sacrificados para salvar al pasajero.
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 text-center">
                      <div className="space-y-2">
                        <h4 className="text-xl sm:text-2xl font-extrabold font-display-sans text-[#7545D6] dark:text-[#F8C300]">
                          CONSECUENCIA DE LA DECISIÓN
                        </h4>
                        <p className="max-w-lg mx-auto text-xs sm:text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                          Has programado el algoritmo para que siga la regla ética de priorizar{' '}
                          <strong className="text-[#101014] dark:text-[#F4F2ED]">
                            {dilemmaChoice === 'pedestrians' ? 'a los peatones' : 'al pasajero'}
                          </strong>{' '}
                          sobre{' '}
                          <strong className="text-[#101014] dark:text-[#F4F2ED]">
                            {dilemmaChoice === 'pedestrians' ? 'al pasajero' : 'a los peatones'}
                          </strong>
                          .
                        </p>
                      </div>

                      <div className="p-5 sm:p-6 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                        <p className="text-2xl sm:text-3xl font-extrabold font-display-sans">
                          Salvaste a{' '}
                          <span className="text-[#326BFF] dark:text-[#F8C300]">
                            {dilemmaChoice === 'pedestrians' ? 5 : 1}
                          </span>{' '}
                          vida{dilemmaChoice === 'pedestrians' ? 's' : ''} y sacrificaste{' '}
                          <span className="text-[#DC2626] dark:text-[#F87171]">
                            {dilemmaChoice === 'pedestrians' ? 1 : 5}
                          </span>
                          .
                        </p>
                        <p className="text-sm sm:text-base italic font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                          &ldquo;El código se ejecutó. La decisión es irreversible.&rdquo;
                        </p>
                      </div>

                      <div className="text-left p-5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-5 h-5 text-[#7545D6] dark:text-[#F8C300] shrink-0" />
                          <h5 className="text-base sm:text-lg font-bold font-display-sans">
                            Perspectiva Global
                          </h5>
                        </div>
                        <p className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                          Tu preferencia se compara con tendencias globales del estudio Moral
                          Machine del MIT.
                        </p>
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

                      <button
                        type="button"
                        onClick={() => {
                          setDilemmaChoice(null);
                          setDilemmaStage('dilemma');
                        }}
                        className="px-6 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Volver a Decidir</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeSimulation.status === 'Próximamente' && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300] flex items-center justify-center">
                    {SIM_ICONS[activeSimulation.id]}
                  </div>
                  <p className="text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] max-w-md mx-auto">
                    Este juego aún está en desarrollo. ¡Vuelve pronto!
                  </p>
                  <p className="text-xs text-[#5B5B66] dark:text-[#A09E97] max-w-md mx-auto">
                    Mientras tanto, puedes explorar los simuladores activos (Laboratorio de Sesgos
                    y Dilemas Morales) o consultar nuestras guías prácticas de procedencia y
                    accesibilidad.
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
