import React, { useMemo, useState } from 'react';
import {
  Shuffle,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  CREATIVE_DISCIPLINES,
  CREATIVE_LAB_EXPERIENCES,
  EXPRESS_CHALLENGES,
  OPEN_EXPERIMENTS,
  type CreativeDisciplineId,
  type CreativeLabExperience,
  type ExperienceLevel,
} from '../../data/creativeExperiencesData';
import { ResilientImage } from '../ResilientImage';

interface RandomPoolItem {
  id: string;
  kind: 'lab' | 'express' | 'open';
  kindLabel: string;
  title: string;
  brief: string;
  instructions: string;
  starterPrompt: string;
  disciplineId: CreativeDisciplineId;
  level: ExperienceLevel;
  durationMinutes: number;
  durationLabel: string;
  image: string;
  imageAlt: string;
  tools: string[];
  labRef?: CreativeLabExperience;
}

interface RandomChallengeGeneratorProps {
  onOpenLab: (lab: CreativeLabExperience) => void;
  onSendPromptToBuilder: (prompt: string, title: string) => void;
}

export const RandomChallengeGenerator: React.FC<RandomChallengeGeneratorProps> = ({
  onOpenLab,
  onSendPromptToBuilder,
}) => {
  const [levelFilter, setLevelFilter] = useState<'all' | ExperienceLevel>('all');
  const [disciplineFilter, setDisciplineFilter] = useState<'all' | CreativeDisciplineId>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | '15' | '20-30' | '60+'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fullPool: RandomPoolItem[] = useMemo(() => {
    const fromLabs: RandomPoolItem[] = CREATIVE_LAB_EXPERIENCES.map((lab) => ({
      id: `pool-${lab.id}`,
      kind: 'lab',
      kindLabel: `Laboratorio ${lab.code}`,
      title: lab.title,
      brief: lab.exercise,
      instructions: lab.objective,
      starterPrompt: lab.starterPrompt,
      disciplineId: lab.disciplineId,
      level: lab.level,
      durationMinutes: lab.durationMinutes,
      durationLabel: lab.duration,
      image: lab.image,
      imageAlt: lab.imageAlt,
      tools: lab.tools,
      labRef: lab,
    }));

    const fromExpress: RandomPoolItem[] = EXPRESS_CHALLENGES.map((ex) => ({
      id: `pool-${ex.id}`,
      kind: 'express',
      kindLabel: `Reto Express ${ex.number}`,
      title: ex.title,
      brief: ex.brief,
      instructions: ex.instructions.join(' '),
      starterPrompt: ex.starterPrompt,
      disciplineId: ex.disciplineId,
      level: ex.level,
      durationMinutes: ex.durationMinutes,
      durationLabel: `${ex.durationMinutes} min`,
      image: ex.image,
      imageAlt: ex.imageAlt,
      tools: ex.tools,
    }));

    const fromOpen: RandomPoolItem[] = OPEN_EXPERIMENTS.map((op) => ({
      id: `pool-${op.id}`,
      kind: 'open',
      kindLabel: `Experimento Abierto ${op.number}`,
      title: op.question,
      brief: op.provocation,
      instructions: op.startingHint,
      starterPrompt: op.suggestedPrompt,
      disciplineId: op.disciplineId,
      level: 'Intermedio',
      durationMinutes: 20,
      durationLabel: '20 min',
      image: op.image,
      imageAlt: op.imageAlt,
      tools: op.tools,
    }));

    return [...fromLabs, ...fromExpress, ...fromOpen];
  }, []);

  const filteredPool = useMemo(() => {
    return fullPool.filter((item) => {
      if (levelFilter !== 'all' && item.level !== levelFilter) return false;
      if (disciplineFilter !== 'all' && item.disciplineId !== disciplineFilter) return false;
      if (durationFilter === '15' && item.durationMinutes > 15) return false;
      if (
        durationFilter === '20-30' &&
        (item.durationMinutes < 20 || item.durationMinutes > 30)
      ) {
        return false;
      }
      if (durationFilter === '60+' && item.durationMinutes < 45) return false;
      return true;
    });
  }, [fullPool, levelFilter, disciplineFilter, durationFilter]);

  const activeItem = useMemo(() => {
    if (!selectedId) return null;
    return filteredPool.find((i) => i.id === selectedId) || filteredPool[0] || null;
  }, [selectedId, filteredPool]);

  const handleSurpriseMe = () => {
    if (filteredPool.length === 0) return;
    const candidates =
      filteredPool.length > 1 && activeItem
        ? filteredPool.filter((i) => i.id !== activeItem.id)
        : filteredPool;
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    setSelectedId(next.id);
    setCopied(false);
  };

  const handleCopyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored gracefully
    }
  };

  return (
    <section
      id="sorprendeme"
      className="rounded-2xl overflow-hidden bg-[#101014] text-[#F4F2ED] border border-[#2A2A35] p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-mono-code uppercase tracking-wider text-[#F8C300] font-bold">
            GENERADOR CREATIVO ALEATORIO · {filteredPool.length} POSIBILIDADES
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#F4F2ED] leading-tight text-balance">
            ¿No sabes qué crear hoy?
          </h3>
          <p className="text-sm text-[#C4C1BA] leading-relaxed">
            Ajusta tu nivel, disciplina o tiempo disponible y presiona <strong>Sorpréndeme</strong> para recibir un reto al azar con instrucciones y prompt inicial listo para experimentar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSurpriseMe}
          disabled={filteredPool.length === 0}
          className="px-6 py-3.5 min-h-[48px] rounded-xl bg-[#F8C300] hover:bg-[#e5b400] disabled:opacity-40 text-[#101014] text-sm font-extrabold uppercase tracking-wider transition-transform active:scale-95 inline-flex items-center justify-center gap-2.5 shrink-0 whitespace-nowrap"
        >
          <Shuffle className="w-4 h-4" />
          <span>{activeItem ? 'Otro reto' : 'Sorpréndeme'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#262630]">
        <label className="space-y-1.5 text-xs">
          <span className="font-mono-code text-[#A7A49D] uppercase block">Nivel</span>
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value as 'all' | ExperienceLevel);
              setSelectedId(null);
            }}
            className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-[#1A1A22] border border-[#2E2E3A] text-[#F4F2ED] text-xs focus:outline-none focus:border-[#F8C300]"
          >
            <option value="all">Cualquier nivel</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </label>

        <label className="space-y-1.5 text-xs">
          <span className="font-mono-code text-[#A7A49D] uppercase block">Disciplina</span>
          <select
            value={disciplineFilter}
            onChange={(e) => {
              setDisciplineFilter(e.target.value as 'all' | CreativeDisciplineId);
              setSelectedId(null);
            }}
            className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-[#1A1A22] border border-[#2E2E3A] text-[#F4F2ED] text-xs focus:outline-none focus:border-[#F8C300]"
          >
            <option value="all">Todas las disciplinas</option>
            {CREATIVE_DISCIPLINES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.letter}. {d.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5 text-xs">
          <span className="font-mono-code text-[#A7A49D] uppercase block">Tiempo disponible</span>
          <select
            value={durationFilter}
            onChange={(e) => {
              setDurationFilter(e.target.value as 'all' | '15' | '20-30' | '60+');
              setSelectedId(null);
            }}
            className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-[#1A1A22] border border-[#2E2E3A] text-[#F4F2ED] text-xs focus:outline-none focus:border-[#F8C300]"
          >
            <option value="all">Cualquier duración</option>
            <option value="15">Express (15 min)</option>
            <option value="20-30">Laboratorio (20–30 min)</option>
            <option value="60+">Proyecto (60+ min)</option>
          </select>
        </label>
      </div>

      {/* Empty Filter State */}
      {filteredPool.length === 0 && (
        <div className="p-4 rounded-xl bg-[#1A1A22] border border-[#2E2E3A] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#D4D1C9]">
            No hay retos con esa combinación exacta de filtros. Reinicia los filtros para ver todo el catálogo.
          </span>
          <button
            type="button"
            onClick={() => {
              setLevelFilter('all');
              setDisciplineFilter('all');
              setDurationFilter('all');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#F8C300] text-[#101014] font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar filtros</span>
          </button>
        </div>
      )}

      {/* Drawn Random Challenge Card */}
      {activeItem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-[#262630] items-stretch">
          <div className="lg:col-span-5 rounded-xl overflow-hidden bg-[#181820] border border-[#2D2D39] min-h-[200px]">
            <ResilientImage
              src={activeItem.image}
              alt={activeItem.imageAlt}
              aspectRatio="16:9"
              containerClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-code text-[#F8C300]">
                <span className="font-bold">{activeItem.kindLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{activeItem.level}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Clock className="w-3 h-3" />
                  <span>{activeItem.durationLabel}</span>
                </span>
              </div>

              <h4 className="text-xl font-bold font-display-sans text-[#F4F2ED]">
                {activeItem.title}
              </h4>

              <p className="text-sm text-[#DDDAD2] leading-relaxed">
                {activeItem.brief}
              </p>

              <p className="text-xs text-[#A7A49D] leading-relaxed">
                {activeItem.instructions}
              </p>

              <div className="p-3.5 rounded-xl bg-[#181820] border border-[#2D2D39] space-y-1.5">
                <div className="text-[11px] font-mono-code text-[#A7A49D] uppercase">
                  Prompt inicial sugerido
                </div>
                <p className="text-xs font-mono-code text-[#F4F2ED] leading-relaxed">
                  {activeItem.starterPrompt}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {activeItem.labRef ? (
                <button
                  type="button"
                  onClick={() => onOpenLab(activeItem.labRef!)}
                  className="px-4 py-2.5 min-h-[42px] rounded-lg bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Abrir ejercicio guiado (8 pasos)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSendPromptToBuilder(activeItem.starterPrompt, activeItem.title)}
                  className="px-4 py-2.5 min-h-[42px] rounded-lg bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Llevar al Constructor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleCopyPrompt(activeItem.starterPrompt)}
                className="px-4 py-2.5 min-h-[42px] rounded-lg bg-[#1E1E28] hover:bg-[#2A2A38] border border-[#343444] text-[#F4F2ED] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#34D399]" />
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
                onClick={handleSurpriseMe}
                className="px-4 py-2.5 min-h-[42px] rounded-lg bg-transparent hover:bg-white/10 border border-[#343444] text-[#D4D1C9] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Generar otro</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
