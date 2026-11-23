import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Coins,
  HeartHandshake,
  Newspaper,
  RotateCcw,
  Shield,
  Users,
} from 'lucide-react';
import {
  CITY_HEADER_IMAGE,
  CITY_INITIAL_METRICS,
  CITY_TURNS,
  type CityMetricKey,
  type CityMetrics,
  type CityPolicyOption,
} from '../../data/eticaIaData';

interface CityAiSimulatorProps {
  onComplete?: () => void;
}

const METRIC_META: {
  key: CityMetricKey;
  label: string;
  short: string;
  icon: React.ReactNode;
}[] = [
  {
    key: 'wellbeing',
    label: 'Bienestar Urbano',
    short: 'Bienestar',
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    key: 'privacy',
    label: 'Privacidad y Derechos',
    short: 'Privacidad',
    icon: <Shield className="w-4 h-4" />,
  },
  {
    key: 'budget',
    label: 'Presupuesto',
    short: 'Presupuesto',
    icon: <Coins className="w-4 h-4" />,
  },
  {
    key: 'trust',
    label: 'Confianza Ciudadana',
    short: 'Confianza',
    icon: <HeartHandshake className="w-4 h-4" />,
  },
];

const clampMetric = (value: number) => Math.max(0, Math.min(100, value));

export const CityAiSimulator: React.FC<CityAiSimulatorProps> = ({ onComplete }) => {
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [stage, setStage] = useState<'decide' | 'chronicle' | 'summary'>('decide');
  const [metrics, setMetrics] = useState<CityMetrics>(CITY_INITIAL_METRICS);
  const [lastOption, setLastOption] = useState<CityPolicyOption | null>(null);
  const [history, setHistory] = useState<{ turnTitle: string; sector: string; option: CityPolicyOption }[]>([]);

  const currentTurn = CITY_TURNS[turnIndex] || CITY_TURNS[0];

  const handleSelectPolicy = (option: CityPolicyOption) => {
    const nextMetrics: CityMetrics = {
      wellbeing: clampMetric(metrics.wellbeing + option.deltas.wellbeing),
      privacy: clampMetric(metrics.privacy + option.deltas.privacy),
      budget: clampMetric(metrics.budget + option.deltas.budget),
      trust: clampMetric(metrics.trust + option.deltas.trust),
    };
    setMetrics(nextMetrics);
    setLastOption(option);
    setHistory((prev) => [
      ...prev,
      { turnTitle: currentTurn.title, sector: currentTurn.sector, option },
    ]);
    setStage('chronicle');
  };

  const handleNextTurn = () => {
    if (turnIndex < CITY_TURNS.length - 1) {
      setTurnIndex((prev) => prev + 1);
      setLastOption(null);
      setStage('decide');
    } else {
      setStage('summary');
      onComplete?.();
    }
  };

  const handleReset = () => {
    setTurnIndex(0);
    setStage('decide');
    setMetrics(CITY_INITIAL_METRICS);
    setLastOption(null);
    setHistory([]);
  };

  const evaluateCityOutcome = () => {
    const minVal = Math.min(metrics.wellbeing, metrics.privacy, metrics.budget, metrics.trust);
    const avg = Math.round(
      (metrics.wellbeing + metrics.privacy + metrics.budget + metrics.trust) / 4
    );

    if (minVal <= 25) {
      return {
        title: 'Metrópolis en Crisis de Equilibrio',
        subtitle: `Promedio general: ${avg}/100 · Un pilar cívico cayó por debajo del límite crítico.`,
        description:
          'Aunque resolviste urgencias puntuales, descuidar gravemente un indicador (presupuesto, derechos, bienestar o confianza) generó fractura institucional. La gobernanza ética requiere sostener pisos mínimos en todos los frentes.',
        lesson:
          'En política pública de IA, optimizar una sola métrica a costa de derechos o sostenibilidad termina colapsando la legitimidad del proyecto entero.',
      };
    }

    if (metrics.privacy < 45 && metrics.trust < 50) {
      return {
        title: 'Tecnópolis Vigilada',
        subtitle: `Promedio general: ${avg}/100 · Eficiencia a costa de privacidad y confianza pública.`,
        description:
          'La ciudad adoptó sistemas opacos y vigilancia automatizada para ganar velocidad y caja, pero debilitó las libertades civiles y la confianza democrática.',
        lesson:
          'Sin transparencia ni consentimiento ciudadano, la tecnología urbana deja de servir al bien común y se convierte en infraestructura de control.',
      };
    }

    if (metrics.wellbeing >= 70 && metrics.privacy >= 70 && metrics.trust >= 70) {
      return {
        title: 'Ciudad Democrática y Resiliente',
        subtitle: `Promedio general: ${avg}/100 · Tecnología pública con derechos y legitimidad.`,
        description:
          'Lograste integrar IA auditable al servicio del transporte, la salud, la educación y la cultura, sosteniendo alta privacidad y confianza ciudadana con presupuesto responsable.',
        lesson:
          'La innovación más duradera ocurre cuando las comunidades co-diseñan las reglas y cada algoritmo público es explicable y apelable.',
      };
    }

    return {
      title: 'Ciudad en Transición Cautelosa',
      subtitle: `Promedio general: ${avg}/100 · Equilibrio moderado con tensiones abiertas.`,
      description:
        'Evitaste los peores abusos algorítmicos y mantuviste estabilidad general, aunque aún existen brechas entre ambición tecnológica, capacidad fiscal y bienestar cotidiano.',
      lesson:
        'Gobernar la IA no es una decisión única: exige presupuesto sostenido, formación pública y ajustes transparentes en cada ciclo.',
    };
  };

  return (
    <div className="space-y-6">
      {/* Editorial Banner */}
      <div className="rounded-xl overflow-hidden border border-[#DEDAD0] dark:border-[#2C2C36] bg-[#101014]">
        <div className="aspect-[16/7] sm:aspect-[16/6] w-full relative bg-[#101014]">
          <img
            src={CITY_HEADER_IMAGE.src}
            alt={CITY_HEADER_IMAGE.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/85 via-[#101014]/35 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="text-[11px] font-mono-code font-bold uppercase text-[#F8C300]">
                {stage === 'summary'
                  ? 'BALANCE DE MANDATO · 5 TURNOS COMPLETADOS'
                  : `TURNO 0${currentTurn.turnNumber} DE 0${CITY_TURNS.length} · ${currentTurn.sector}`}
              </div>
              <h4 className="text-base sm:text-xl font-extrabold font-display-sans text-[#F4F2ED]">
                {stage === 'summary' ? 'Retrato Final de tu Ciudad IA' : currentTurn.title}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Turn Progress Bar */}
      <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
        {CITY_TURNS.map((t, idx) => {
          const isCompleted = idx < history.length;
          const isCurrent = stage !== 'summary' && idx === turnIndex;
          return (
            <div
              key={t.id}
              className={`h-1.5 rounded-sm transition-colors ${
                isCurrent
                  ? 'bg-[#7545D6] dark:bg-[#F8C300]'
                  : isCompleted
                    ? 'bg-[#101014] dark:bg-[#F4F2ED]'
                    : 'bg-[#DEDAD0] dark:bg-[#26262E]'
              }`}
            />
          );
        })}
      </div>

      {/* 4 Live Civic Indicators HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {METRIC_META.map((m) => {
          const value = metrics[m.key];
          const delta = stage === 'chronicle' && lastOption ? lastOption.deltas[m.key] : 0;
          const tone =
            value <= 30
              ? 'text-[#DC2626] dark:text-[#F87171]'
              : value >= 70
                ? 'text-[#16A34A] dark:text-[#4ADE80]'
                : 'text-[#101014] dark:text-[#F4F2ED]';
          const barColor =
            value <= 30
              ? 'bg-[#DC2626] dark:bg-[#F87171]'
              : value >= 70
                ? 'bg-[#16A34A] dark:bg-[#4ADE80]'
                : 'bg-[#326BFF] dark:bg-[#F8C300]';

          return (
            <div
              key={m.key}
              className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-2"
            >
              <div className="flex items-center justify-between gap-1 text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                <span className="inline-flex items-center gap-1.5 font-bold">
                  {m.icon}
                  <span>{m.short}</span>
                </span>
                {delta !== 0 && (
                  <span
                    className={`font-extrabold ${
                      delta > 0
                        ? 'text-[#16A34A] dark:text-[#4ADE80]'
                        : 'text-[#DC2626] dark:text-[#F87171]'
                    }`}
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </div>
              <div className={`text-xl font-extrabold font-display-sans ${tone}`}>
                {value}
                <span className="text-[11px] font-mono-code font-normal text-[#5B5B66] dark:text-[#A09E97]">
                  /100
                </span>
              </div>
              <div className="h-1.5 w-full rounded bg-[#DEDAD0] dark:bg-[#26262E] overflow-hidden">
                <div
                  style={{ width: `${value}%` }}
                  className={`h-full transition-all duration-300 ${barColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage 1: Policy Decision */}
      {stage === 'decide' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-xs sm:text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
            {currentTurn.briefing}
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
              ELIGE UNA POLÍTICA MUNICIPAL PARA ESTE TURNO
            </div>
            <div className="space-y-3">
              {currentTurn.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectPolicy(option)}
                  className="w-full p-4 rounded-xl border-2 border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] bg-[#F4F2ED] dark:bg-[#101014] text-left transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-bold text-sm sm:text-base text-[#101014] dark:text-[#F4F2ED]">
                      <span className="text-[#7545D6] dark:text-[#F8C300] font-mono-code mr-2">
                        [{option.id}]
                      </span>
                      {option.title}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300] shrink-0 mt-1" />
                  </div>
                  <p className="text-xs font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                    {option.summary}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Immediate Civic Press Chronicle */}
      {stage === 'chronicle' && lastOption && (
        <div className="space-y-5">
          <div className="p-5 sm:p-6 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#F8C300]">
              <Newspaper className="w-4 h-4 shrink-0" />
              <span>DIARIO CÍVICO · IMPACTO DE TU DECISIÓN</span>
            </div>
            <h5 className="text-lg sm:text-xl font-extrabold font-display-sans">
              {lastOption.headline}
            </h5>
            <p className="text-xs sm:text-sm font-mono-code text-[#D8D5CD] leading-relaxed">
              {lastOption.chronicle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextTurn}
            className="w-full py-3 px-5 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
          >
            <span>
              {turnIndex < CITY_TURNS.length - 1
                ? `Avanzar al Turno ${turnIndex + 2} de ${CITY_TURNS.length}`
                : 'Ver Balance Final de tu Ciudad'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stage 3: Final Governance Summary */}
      {stage === 'summary' &&
        (() => {
          const outcome = evaluateCityOutcome();
          return (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] space-y-2.5">
                <div className="text-xs font-mono-code font-bold uppercase text-[#F8C300]">
                  ARQUETIPO DE GOBERNANZA ALCANZADO
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold font-display-sans">
                  {outcome.title}
                </h4>
                <p className="text-xs sm:text-sm font-mono-code text-[#F8C300]/95 font-semibold">
                  {outcome.subtitle}
                </p>
                <p className="text-xs sm:text-sm font-mono-code text-[#D8D5CD] leading-relaxed">
                  {outcome.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8C300]/15 border border-[#F8C300]/60 space-y-1">
                <div className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F8C300] flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>LECCIÓN DE GOBERNANZA PÚBLICA DE IA</span>
                </div>
                <p className="text-xs sm:text-sm text-[#101014] dark:text-[#F4F2ED] leading-relaxed">
                  {outcome.lesson}
                </p>
              </div>

              {/* 5-Turn Policy Timeline */}
              <div className="space-y-2">
                <div className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
                  HISTORIAL DE TUS 5 DECISIONES
                </div>
                <div className="space-y-2">
                  {history.map((entry, idx) => (
                    <div
                      key={`${entry.sector}-${idx}`}
                      className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="font-mono-code text-[10px] font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                          Turno 0{idx + 1} · {entry.sector}
                        </div>
                        <div className="font-bold text-[#101014] dark:text-[#F4F2ED]">
                          {entry.option.title}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 font-mono-code text-[11px] shrink-0">
                        {METRIC_META.map((m) => {
                          const d = entry.option.deltas[m.key];
                          if (d === 0) return null;
                          return (
                            <span
                              key={m.key}
                              className={
                                d > 0
                                  ? 'text-[#16A34A] dark:text-[#4ADE80] font-bold'
                                  : 'text-[#DC2626] dark:text-[#F87171] font-bold'
                              }
                            >
                              {m.short} {d > 0 ? `+${d}` : d}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Gobernar la Ciudad de Nuevo</span>
                </button>
              </div>
            </div>
          );
        })()}
    </div>
  );
};
