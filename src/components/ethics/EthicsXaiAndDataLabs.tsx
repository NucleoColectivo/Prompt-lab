import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Lock,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Unlock,
} from 'lucide-react';
import {
  DATA_ECHO_ACTIONS,
  DATA_ECHO_HEADER_IMAGE,
  DATA_ECHO_INFERENCES,
  DATA_PRIVACY_DEFENSES,
  XAI_CASES,
  XAI_HEADER_IMAGE,
} from '../../data/eticaIaData';

interface SimulatorCompletionProps {
  onComplete?: () => void;
}

export const TransparentBoxSimulator: React.FC<SimulatorCompletionProps> = ({ onComplete }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(XAI_CASES[0].id);
  const [viewMode, setViewMode] = useState<'blackbox' | 'xai'>('blackbox');
  const [disabledFeatures, setDisabledFeatures] = useState<Record<string, boolean>>({});
  const [customPoints, setCustomPoints] = useState<Record<string, number>>({});

  const activeCase = XAI_CASES.find((c) => c.id === selectedCaseId) || XAI_CASES[0];

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setDisabledFeatures({});
    setCustomPoints({});
  };

  const originalScore = useMemo(() => {
    const raw =
      activeCase.baseScore +
      activeCase.features.reduce((sum, feat) => sum + feat.defaultPoints, 0);
    return Math.max(0, Math.min(100, raw));
  }, [activeCase]);

  const currentScore = useMemo(() => {
    const raw =
      activeCase.baseScore +
      activeCase.features.reduce((sum, feat) => {
        if (disabledFeatures[feat.id]) return sum;
        const val = customPoints[feat.id] ?? feat.defaultPoints;
        return sum + val;
      }, 0);
    return Math.max(0, Math.min(100, raw));
  }, [activeCase, disabledFeatures, customPoints]);

  const isApproved = currentScore >= activeCase.threshold;
  const scoreDelta = currentScore - originalScore;

  const activeProxyCount = activeCase.features.filter(
    (f) => f.isProxy && !disabledFeatures[f.id]
  ).length;

  const toggleFeatureDisabled = (featureId: string) => {
    setDisabledFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
    onComplete?.();
  };

  const handleRemoveAllProxies = () => {
    const next: Record<string, boolean> = {};
    activeCase.features.forEach((f) => {
      if (f.isProxy) next[f.id] = true;
    });
    setDisabledFeatures(next);
    onComplete?.();
  };

  const handleResetWeights = () => {
    setDisabledFeatures({});
    setCustomPoints({});
  };

  const topPositiveFeature = useMemo(() => {
    const positives = activeCase.features
      .filter((f) => !disabledFeatures[f.id])
      .map((f) => ({ feature: f, pts: customPoints[f.id] ?? f.defaultPoints }))
      .filter((item) => item.pts > 0)
      .sort((a, b) => b.pts - a.pts);
    return positives[0] || null;
  }, [activeCase, disabledFeatures, customPoints]);

  const topNegativeFeature = useMemo(() => {
    const negatives = activeCase.features
      .filter((f) => !disabledFeatures[f.id])
      .map((f) => ({ feature: f, pts: customPoints[f.id] ?? f.defaultPoints }))
      .filter((item) => item.pts < 0)
      .sort((a, b) => a.pts - b.pts);
    return negatives[0] || null;
  }, [activeCase, disabledFeatures, customPoints]);

  return (
    <div className="space-y-6">
      {/* Editorial Banner */}
      <div className="rounded-xl overflow-hidden border border-[#DEDAD0] dark:border-[#2C2C36] bg-[#101014]">
        <div className="aspect-[16/7] sm:aspect-[16/6] w-full relative bg-[#101014]">
          <img
            src={XAI_HEADER_IMAGE.src}
            alt={XAI_HEADER_IMAGE.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/85 via-[#101014]/35 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 space-y-0.5">
            <div className="text-[11px] font-mono-code font-bold uppercase text-[#F8C300]">
              EXPLICABILIDAD ALGORÍTMICA (XAI) · AUDITORÍA EN VIVO
            </div>
            <p className="text-xs sm:text-sm font-mono-code text-[#F4F2ED] max-w-2xl">
              Contrasta una decisión automatizada opaca con un modelo auditable donde puedes detectar
              variables proxy sesgadas y probar contrafactuales.
            </p>
          </div>
        </div>
      </div>

      {/* Case Selector */}
      <div className="space-y-2">
        <div className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
          1. ELIGE UN EXPEDIENTE REALISTA
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {XAI_CASES.map((item) => {
            const isSelected = item.id === activeCase.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectCase(item.id)}
                className={`p-3 rounded-xl border-2 text-left transition-colors ${
                  isSelected
                    ? 'bg-[#F8C300]/15 border-[#F8C300] text-[#101014] dark:text-[#F4F2ED]'
                    : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                <div className="text-[10px] font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                  {item.domain}
                </div>
                <div className="font-bold text-xs sm:text-sm leading-snug mt-0.5">{item.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applicant Context Card */}
      <div className="p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
            POSTULANTE · {activeCase.applicantName}
          </div>
          <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
            {activeCase.applicantSummary}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('blackbox')}
            className={`px-3 py-2 min-h-[40px] text-xs font-mono-code font-bold rounded-lg border inline-flex items-center gap-1.5 transition-colors ${
              viewMode === 'blackbox'
                ? 'bg-[#101014] text-[#F8C300] border-[#101014] dark:border-[#F8C300]'
                : 'bg-white dark:bg-[#16161C] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Caja Negra</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('xai')}
            className={`px-3 py-2 min-h-[40px] text-xs font-mono-code font-bold rounded-lg border inline-flex items-center gap-1.5 transition-colors ${
              viewMode === 'xai'
                ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                : 'bg-white dark:bg-[#16161C] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36]'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Caja Transparente</span>
          </button>
        </div>
      </div>

      {viewMode === 'blackbox' ? (
        <div className="p-5 sm:p-6 rounded-xl bg-[#101014] text-[#F4F2ED] border-2 border-[#2C2C36] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#26262E]">
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#F87171] font-bold">
              <EyeOff className="w-4 h-4 shrink-0" />
              <span>SISTEMA PROPIETARIO OPACO · SIN EXPLICABILIDAD</span>
            </div>
            <span className="text-xs font-mono-code font-bold text-[#F87171]">
              {activeCase.blackBoxCode}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#F87171]">
              SOLICITUD RECHAZADA ({originalScore}/100)
            </div>
            <p className="text-xs sm:text-sm font-mono-code text-[#B4B2AC] leading-relaxed">
              {activeCase.blackBoxNotice}
            </p>
          </div>

          {/* Redacted Hidden Feature Rows */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((slot) => (
              <div
                key={slot}
                className="px-3.5 py-2.5 rounded-lg bg-[#18181F] border border-[#26262E] flex items-center justify-between text-xs font-mono-code text-[#6A6A76]"
              >
                <span>VARIABLE #{slot} · [OCULTA POR SECRETO COMERCIAL]</span>
                <span>PESO: ███</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg bg-[#F8C300]/10 border border-[#F8C300]/40 text-xs font-mono-code text-[#F4F2ED]">
            Sin transparencia, la persona afectada no puede detectar errores, comprobar si hubo
            discriminación indirecta ni impugnar la decisión con argumentos concretos.
          </div>

          <button
            type="button"
            onClick={() => setViewMode('xai')}
            className="w-full py-3 px-5 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Abrir la Caja Transparente (Auditar Variables)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Live Scoreboard & Audit Controls */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <div className="text-[11px] font-mono-code text-[#A09E97]">PUNTAJE AUDITADO</div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-extrabold font-display-sans ${
                      isApproved ? 'text-[#4ADE80]' : 'text-[#F87171]'
                    }`}
                  >
                    {currentScore}
                  </span>
                  <span className="text-xs font-mono-code text-[#A09E97]">
                    / 100 (umbral {activeCase.threshold})
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono-code text-[#A09E97]">VEREDICTO EN VIVO</div>
                <div
                  className={`text-lg font-extrabold font-display-sans ${
                    isApproved ? 'text-[#4ADE80]' : 'text-[#F87171]'
                  }`}
                >
                  {isApproved ? 'APROBADA' : 'RECHAZADA'}
                </div>
                <div className="text-[11px] font-mono-code text-[#F8C300]">
                  {scoreDelta === 0
                    ? 'Sin cambios sobre el modelo original'
                    : `${scoreDelta > 0 ? '+' : ''}${scoreDelta} pts frente a la caja negra (${originalScore})`}
                </div>
              </div>

              <div className="flex flex-wrap sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={handleRemoveAllProxies}
                  disabled={activeProxyCount === 0}
                  className="px-3 py-2 min-h-[40px] text-xs font-mono-code font-bold bg-[#F8C300] hover:bg-[#e5b400] disabled:opacity-45 text-[#101014] rounded-lg transition-colors"
                >
                  Neutralizar Proxies ({activeProxyCount})
                </button>
                <button
                  type="button"
                  onClick={handleResetWeights}
                  className="px-3 py-2 min-h-[40px] text-xs font-mono-code font-bold bg-[#18181F] hover:bg-[#26262E] text-[#F4F2ED] border border-[#343440] rounded-lg inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Score Bar with Threshold Marker */}
            <div className="relative h-3 w-full rounded bg-[#26262E] overflow-hidden">
              <div
                style={{ width: `${currentScore}%` }}
                className={`h-full transition-all duration-300 ${
                  isApproved ? 'bg-[#4ADE80]' : 'bg-[#F87171]'
                }`}
              />
              <div
                style={{ left: `${activeCase.threshold}%` }}
                title={`Umbral mínimo: ${activeCase.threshold}`}
                className="absolute top-0 bottom-0 w-0.5 bg-[#F8C300]"
              />
            </div>
          </div>

          {/* Interactive Feature Weights List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs font-mono-code">
              <span className="font-bold uppercase text-[#5B5B66] dark:text-[#A09E97] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>VARIABLES INTERNAS DEL MODELO (BASE: {activeCase.baseScore} PTS)</span>
              </span>
              <span className="text-[#7545D6] dark:text-[#F8C300] font-bold">
                Ajusta o desactiva variables
              </span>
            </div>

            {activeCase.features.map((feat) => {
              const isDisabled = Boolean(disabledFeatures[feat.id]);
              const pts = isDisabled ? 0 : (customPoints[feat.id] ?? feat.defaultPoints);
              const barPct = Math.min(100, Math.round((Math.abs(pts) / 25) * 100));

              return (
                <div
                  key={feat.id}
                  className={`p-4 rounded-xl border transition-colors space-y-2.5 ${
                    isDisabled
                      ? 'bg-[#F4F2ED]/50 dark:bg-[#101014]/40 border-[#DEDAD0] dark:border-[#26262E] opacity-70'
                      : feat.isProxy
                        ? 'bg-[#DC2626]/5 dark:bg-[#DC2626]/10 border-[#DC2626]/50'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#101014] dark:text-[#F4F2ED]">
                          {feat.label}
                        </span>
                        {feat.isProxy && (
                          <span className="text-[10px] font-mono-code font-bold uppercase text-[#DC2626] dark:text-[#F87171]">
                            · VARIABLE PROXY SESGADA
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                        Dato detectado: {feat.observedValue}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className={`text-sm font-mono-code font-extrabold ${
                          isDisabled
                            ? 'text-[#6A6A76]'
                            : pts >= 0
                              ? 'text-[#16A34A] dark:text-[#4ADE80]'
                              : 'text-[#DC2626] dark:text-[#F87171]'
                        }`}
                      >
                        {isDisabled ? '0 pts' : `${pts > 0 ? '+' : ''}${pts} pts`}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFeatureDisabled(feat.id)}
                        className={`px-2.5 py-1.5 min-h-[36px] text-[11px] font-mono-code font-bold rounded-lg border transition-colors ${
                          isDisabled
                            ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-transparent'
                            : feat.isProxy
                              ? 'bg-white dark:bg-[#16161C] text-[#DC2626] dark:text-[#F87171] border-[#DC2626]/50 hover:bg-[#DC2626] hover:text-white'
                              : 'bg-white dark:bg-[#16161C] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36]'
                        }`}
                      >
                        {isDisabled ? 'Reactivar' : feat.isProxy ? 'Eliminar Proxy' : 'Desactivar'}
                      </button>
                    </div>
                  </div>

                  {/* Contribution Bar + Live Slider */}
                  {!isDisabled && (
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full rounded bg-[#DEDAD0] dark:bg-[#26262E] overflow-hidden">
                        <div
                          style={{ width: `${barPct}%` }}
                          className={`h-full transition-all ${
                            pts >= 0
                              ? 'bg-[#16A34A] dark:bg-[#4ADE80]'
                              : 'bg-[#DC2626] dark:bg-[#F87171]'
                          }`}
                        />
                      </div>
                      <input
                        type="range"
                        aria-label={`Ajustar peso de ${feat.label}`}
                        min={feat.minPoints}
                        max={feat.maxPoints}
                        value={pts}
                        onChange={(e) =>
                          setCustomPoints((prev) => ({
                            ...prev,
                            [feat.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full accent-[#7545D6] dark:accent-[#F8C300] cursor-pointer"
                      />
                    </div>
                  )}

                  <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                    {feat.explanation}
                  </p>
                  {feat.isProxy && feat.proxyWarning && !isDisabled && (
                    <div className="text-xs font-mono-code text-[#B91C1C] dark:text-[#FCA5A5] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{feat.proxyWarning}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dynamic Citizen Right-to-Explanation Report */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F8C300]/15 border border-[#F8C300]/70 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F8C300]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>CARTA DE EXPLICACIÓN CIUDADANA (GENERADA EN VIVO)</span>
            </div>
            <p className="text-xs sm:text-sm text-[#101014] dark:text-[#F4F2ED] leading-relaxed">
              Resultado actual: <strong>{isApproved ? 'Aprobada' : 'Rechazada'}</strong> con{' '}
              <strong>
                {currentScore}/{activeCase.threshold} puntos
              </strong>
              .{' '}
              {topPositiveFeature && (
                <>
                  Tu principal fortaleza fue{' '}
                  <strong>
                    {topPositiveFeature.feature.label} (+{topPositiveFeature.pts} pts)
                  </strong>
                  .{' '}
                </>
              )}
              {topNegativeFeature ? (
                <>
                  El mayor factor penalizador activo es{' '}
                  <strong>
                    {topNegativeFeature.feature.label} ({topNegativeFeature.pts} pts)
                  </strong>
                  {topNegativeFeature.feature.isProxy
                    ? ', una variable proxy auditable e impugnable por posible sesgo indirecto.'
                    : '.'}
                </>
              ) : (
                'No existen variables proxy penalizando este expediente; la evaluación refleja exclusivamente criterios sustantivos verificables.'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const DataEchoSimulator: React.FC<SimulatorCompletionProps> = ({ onComplete }) => {
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([
    'act-podcast',
    'act-salud',
    'act-ubicacion',
    'act-cookies',
  ]);
  const [activeDefenseIds, setActiveDefenseIds] = useState<string[]>([]);

  const toggleAction = (actionId: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId]
    );
  };

  const toggleDefense = (defenseId: string) => {
    setActiveDefenseIds((prev) => {
      const next = prev.includes(defenseId)
        ? prev.filter((id) => id !== defenseId)
        : [...prev, defenseId];
      if (next.length > 0) onComplete?.();
      return next;
    });
  };

  const activeActions = useMemo(
    () => DATA_ECHO_ACTIONS.filter((a) => selectedActionIds.includes(a.id)),
    [selectedActionIds]
  );

  const uniqueBrokers = useMemo(() => {
    const set = new Set<string>();
    activeActions.forEach((act) => {
      const mitigated =
        act.mitigatedByDefenseId && activeDefenseIds.includes(act.mitigatedByDefenseId);
      if (!mitigated) {
        act.brokersReceiving.forEach((b) => set.add(b));
      } else {
        set.add(act.brokersReceiving[0]);
      }
    });
    return Array.from(set);
  }, [activeActions, activeDefenseIds]);

  const evaluatedInferences = useMemo(() => {
    return DATA_ECHO_INFERENCES.map((inf) => {
      const matches = inf.requiredActionIds.filter((id) => selectedActionIds.includes(id));
      const triggered = matches.length >= inf.minMatches;
      const neutralized = triggered && activeDefenseIds.includes(inf.neutralizedByDefenseId);
      return {
        ...inf,
        matchedCount: matches.length,
        triggered,
        neutralized,
      };
    }).filter((inf) => inf.triggered);
  }, [selectedActionIds, activeDefenseIds]);

  const activeUnmitigatedInferences = evaluatedInferences.filter((inf) => !inf.neutralized);

  const exposureScore = useMemo(() => {
    const rawExposure = activeActions.reduce((sum, act) => sum + act.exposureWeight, 0);
    const defenseReduction = DATA_PRIVACY_DEFENSES.reduce((sum, def) => {
      if (!activeDefenseIds.includes(def.id)) return sum;
      return sum + def.exposureReduction;
    }, 0);
    if (rawExposure === 0) return 0;
    return Math.max(6, Math.min(100, rawExposure - Math.round(defenseReduction * 0.72)));
  }, [activeActions, activeDefenseIds]);

  const exposureTone =
    exposureScore >= 70
      ? { label: 'Exposición Crítica', color: 'text-[#DC2626] dark:text-[#F87171]', bar: 'bg-[#DC2626] dark:bg-[#F87171]' }
      : exposureScore >= 38
        ? { label: 'Exposición Media', color: 'text-[#B45309] dark:text-[#F8C300]', bar: 'bg-[#F8C300]' }
        : { label: 'Exposición Contenida', color: 'text-[#16A34A] dark:text-[#4ADE80]', bar: 'bg-[#16A34A] dark:bg-[#4ADE80]' };

  return (
    <div className="space-y-6">
      {/* Editorial Header Visual */}
      <div className="rounded-xl overflow-hidden border border-[#DEDAD0] dark:border-[#2C2C36] bg-[#101014]">
        <div className="aspect-[16/7] sm:aspect-[16/6] w-full relative bg-[#101014]">
          <img
            src={DATA_ECHO_HEADER_IMAGE.src}
            alt={DATA_ECHO_HEADER_IMAGE.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/85 via-[#101014]/35 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 space-y-0.5">
            <div className="text-[11px] font-mono-code font-bold uppercase text-[#F8C300]">
              RASTRO DIGITAL · CRUCE DE INTERMEDIARIOS E INFERENCIAS
            </div>
            <p className="text-xs sm:text-sm font-mono-code text-[#F4F2ED] max-w-2xl">
              Activa o desactiva gestos cotidianos para ver qué perfil íntimo deducen los algoritmos
              sin que jamás lo hayas escrito — y prueba defensas reales.
            </p>
          </div>
        </div>
      </div>

      {/* Live Exposure Telemetry Strip */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2C2C36] space-y-3.5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <div className="text-[10px] font-mono-code uppercase text-[#A09E97]">
              EXPOSICIÓN ALGORÍTMICA
            </div>
            <div className={`text-2xl font-extrabold font-display-sans ${exposureTone.color}`}>
              {exposureScore}%
            </div>
            <div className="text-[11px] font-mono-code text-[#D8D5CD]">{exposureTone.label}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono-code uppercase text-[#A09E97]">
              RASTROS ACTIVOS
            </div>
            <div className="text-2xl font-extrabold font-display-sans text-[#F4F2ED]">
              {activeActions.length}/{DATA_ECHO_ACTIONS.length}
            </div>
            <div className="text-[11px] font-mono-code text-[#A09E97]">en 24 horas</div>
          </div>
          <div>
            <div className="text-[10px] font-mono-code uppercase text-[#A09E97]">
              INTERMEDIARIOS
            </div>
            <div className="text-2xl font-extrabold font-display-sans text-[#F8C300]">
              {uniqueBrokers.length}
            </div>
            <div className="text-[11px] font-mono-code text-[#A09E97]">actores recibiendo ecos</div>
          </div>
          <div>
            <div className="text-[10px] font-mono-code uppercase text-[#A09E97]">
              INFERENCIAS ACTIVAS
            </div>
            <div className="text-2xl font-extrabold font-display-sans text-[#F87171]">
              {activeUnmitigatedInferences.length}
            </div>
            <div className="text-[11px] font-mono-code text-[#A09E97]">
              {evaluatedInferences.length - activeUnmitigatedInferences.length} neutralizadas
            </div>
          </div>
        </div>

        <div className="h-2 w-full rounded bg-[#26262E] overflow-hidden">
          <div
            style={{ width: `${exposureScore}%` }}
            className={`h-full transition-all duration-300 ${exposureTone.bar}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() =>
              setSelectedActionIds(['act-podcast', 'act-salud', 'act-ubicacion', 'act-cookies'])
            }
            className="px-3 py-1.5 min-h-[36px] text-[11px] font-mono-code font-bold bg-[#18181F] hover:bg-[#26262E] border border-[#343440] text-[#F4F2ED] rounded-lg"
          >
            Día típico (4)
          </button>
          <button
            type="button"
            onClick={() => setSelectedActionIds(DATA_ECHO_ACTIONS.map((a) => a.id))}
            className="px-3 py-1.5 min-h-[36px] text-[11px] font-mono-code font-bold bg-[#18181F] hover:bg-[#26262E] border border-[#343440] text-[#F8C300] rounded-lg"
          >
            Día hiperconectado (8)
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedActionIds([]);
              setActiveDefenseIds([]);
            }}
            className="px-3 py-1.5 min-h-[36px] text-[11px] font-mono-code font-bold bg-[#18181F] hover:bg-[#26262E] border border-[#343440] text-[#B4B2AC] rounded-lg inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar todo</span>
          </button>
        </div>
      </div>

      {/* Step 1: Everyday Actions Selector */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97]">
          1. SELECCIONA TUS ACCIONES COTIDIANAS (LO QUE HACES)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DATA_ECHO_ACTIONS.map((act) => {
            const isSelected = selectedActionIds.includes(act.id);
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => toggleAction(act.id)}
                aria-pressed={isSelected}
                className={`p-3.5 rounded-xl border-2 text-left transition-colors flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#F8C300]/15 border-[#F8C300] text-[#101014] dark:text-[#F4F2ED]'
                    : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                <span
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-[#101014] dark:bg-[#F8C300] border-[#101014] dark:border-[#F8C300] text-[#F4F2ED] dark:text-[#101014]'
                      : 'border-[#9A9890] dark:border-[#444452]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </span>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                    <span>{act.time}</span>
                    <span>·</span>
                    <span>{act.category}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold leading-snug">{act.title}</div>
                  {isSelected && (
                    <div className="text-[11px] font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                      Señal emitida: {act.rawSignal}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Crossed Data Brokers & Hidden Inferences */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
          <span className="font-bold uppercase text-[#5B5B66] dark:text-[#A09E97] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            <span>2. EL ECO: LO QUE LOS ALGORITMOS INFIEREN AL CRUZAR TUS DATOS</span>
          </span>
        </div>

        {evaluatedInferences.length === 0 ? (
          <div className="p-5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-center text-xs sm:text-sm font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
            Selecciona al menos 2 acciones cotidianas arriba para observar cómo el cruce de señales
            construye inferencias sensibles sobre ti.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {evaluatedInferences.map((inf) => (
              <div
                key={inf.id}
                className={`p-4 rounded-xl border-2 space-y-2 transition-colors ${
                  inf.neutralized
                    ? 'bg-[#16A34A]/10 border-[#16A34A]/60 dark:border-[#4ADE80]/60'
                    : inf.severity === 'Crítica'
                      ? 'bg-[#DC2626]/5 dark:bg-[#DC2626]/10 border-[#DC2626]/60'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#2C2C36]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-[#101014] dark:text-[#F4F2ED] flex items-start gap-2">
                    {inf.neutralized ? (
                      <ShieldCheck className="w-4 h-4 text-[#16A34A] dark:text-[#4ADE80] shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-[#DC2626] dark:text-[#F87171] shrink-0 mt-0.5" />
                    )}
                    <span>{inf.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono-code font-bold uppercase shrink-0 ${
                      inf.neutralized
                        ? 'text-[#16A34A] dark:text-[#4ADE80]'
                        : inf.severity === 'Crítica'
                          ? 'text-[#DC2626] dark:text-[#F87171]'
                          : 'text-[#B45309] dark:text-[#F8C300]'
                    }`}
                  >
                    {inf.neutralized ? 'MITIGADA' : `RIESGO ${inf.severity}`}
                  </span>
                </div>

                <p className="text-xs text-[#101014] dark:text-[#E5E3DC] leading-relaxed">
                  <strong>Perfil deducido:</strong> {inf.inferredProfile}
                </p>
                <p className="text-[11px] font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                  <strong>Uso probable:</strong> {inf.realWorldImpact}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 3: Actionable Privacy Countermeasures */}
      <div className="space-y-3 pt-1">
        <div className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300] flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>3. ACTIVA CONTRAMEDIDAS REALES Y OBSERVA CÓMO BAJA TU EXPOSICIÓN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DATA_PRIVACY_DEFENSES.map((def) => {
            const active = activeDefenseIds.includes(def.id);
            return (
              <button
                key={def.id}
                type="button"
                onClick={() => toggleDefense(def.id)}
                aria-pressed={active}
                className={`p-3.5 rounded-xl border-2 text-left transition-colors flex items-start gap-3 ${
                  active
                    ? 'bg-[#16A34A]/10 border-[#16A34A] dark:border-[#4ADE80] text-[#101014] dark:text-[#F4F2ED]'
                    : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF]'
                }`}
              >
                <span
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                    active
                      ? 'bg-[#16A34A] dark:bg-[#4ADE80] border-transparent text-white dark:text-[#101014]'
                      : 'border-[#9A9890] dark:border-[#444452]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold">{def.title}</div>
                  <div className="text-[11px] font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                    {def.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
