import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Search,
  ShieldBan,
  Wand2,
  X,
} from 'lucide-react';
import {
  NEGATIVE_PROMPT_PACKS,
  PROMPT_TROUBLESHOOTING_CASES,
  TroubleshootingCase,
} from '../../data/resourcesExtendedData';
import type { PromptBuilderState } from '../PromptBuilder';

interface ResourceTroubleshootingViewProps {
  onSendToBuilder: (patch: Partial<PromptBuilderState>) => void;
}

type DiagnosticCategory = 'Todas' | TroubleshootingCase['category'];

export const ResourceTroubleshootingView: React.FC<
  ResourceTroubleshootingViewProps
> = ({ onSendToBuilder }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DiagnosticCategory>('Todas');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Interactive Negative Prompt Builder state
  const [selectedPackIds, setSelectedPackIds] = useState<string[]>([
    'neg-portrait',
    'neg-design',
  ]);
  const [formatStyle, setFormatStyle] = useState<'standard' | 'midjourney'>('standard');

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PROMPT_TROUBLESHOOTING_CASES.filter((item) => {
      const catOk = category === 'Todas' || item.category === category;
      if (!catOk) return false;
      if (!q) return true;
      return [
        item.symptom,
        item.cause,
        item.fixedExample,
        item.negativePrompt,
        ...item.addTokens,
        ...item.removeTokens,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [category, search]);

  const combinedNegativeTokens = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const pack of NEGATIVE_PROMPT_PACKS) {
      if (!selectedPackIds.includes(pack.id)) continue;
      for (const token of pack.tokens) {
        if (!seen.has(token)) {
          seen.add(token);
          list.push(token);
        }
      }
    }
    return list;
  }, [selectedPackIds]);

  const renderedNegativePrompt = useMemo(() => {
    if (combinedNegativeTokens.length === 0) {
      return 'Selecciona al menos una disciplina arriba para construir tu bloque negativo.';
    }
    if (formatStyle === 'midjourney') {
      return `--no ${combinedNegativeTokens.join(', ')}`;
    }
    return `Avoid: ${combinedNegativeTokens.join(', ')}.`;
  }, [combinedNegativeTokens, formatStyle]);

  const togglePack = (packId: string) => {
    setSelectedPackIds((prev) =>
      prev.includes(packId)
        ? prev.filter((id) => id !== packId)
        : [...prev, packId]
    );
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#F4F2ED] dark:bg-[#101014] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        {/* PART 1: DIAGNOSTIC TROUBLESHOOTER */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B4523A] dark:text-[#F8C300] font-mono-code font-bold mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>CLÍNICA DE PROMPTS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
                ¿Qué falló en tu imagen o video?
              </h2>
              <p className="text-sm text-[#4A4A55] dark:text-[#A09E97] mt-2 max-w-2xl leading-relaxed">
                Diagnóstico rápido de los 10 errores más frecuentes al crear con IA: qué palabra eliminar, qué instrucción técnica añadir y su negative prompt listo.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-[#5B5B66] dark:text-[#8E8C85] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej. piel, manos, texto, morphing..."
                aria-label="Buscar problema o error de prompt"
                className="w-full min-h-[42px] pl-10 pr-9 py-2 text-xs bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg focus:outline-none focus:border-[#326BFF]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#5B5B66]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(
              [
                'Todas',
                'Retrato y Anatomía',
                'Texto y Composición',
                'Luz y Color',
                'Video y Continuidad',
              ] as DiagnosticCategory[]
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors whitespace-nowrap ${
                  category === cat
                    ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                    : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredCases.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED] mb-2">
                    {item.symptom}
                  </h3>
                  <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed mb-4">
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">Causa habitual:</strong>{' '}
                    {item.cause}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="text-[10px] font-mono-code uppercase font-bold text-[#B4523A] dark:text-[#FF8A75] mb-1.5">
                        Evitar / Eliminar
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.removeTokens.map((tok) => (
                          <span
                            key={tok}
                            className="px-2 py-0.5 text-[11px] font-mono-code rounded bg-white dark:bg-[#16161C] text-[#4A4A55] dark:text-[#A09E97] line-through border border-[#DEDAD0] dark:border-[#26262E]"
                          >
                            {tok}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                      <div className="text-[10px] font-mono-code uppercase font-bold text-[#1D5B4C] dark:text-[#6EE7B7] mb-1.5">
                        Agregar en su lugar
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.addTokens.map((tok) => (
                          <span
                            key={tok}
                            className="px-2 py-0.5 text-[11px] font-mono-code rounded bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E]"
                          >
                            {tok}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fixed Example */}
                  <div className="p-3 rounded-lg bg-[#101014] text-[#E5E3DC] font-mono-code text-[11px] leading-relaxed mb-3 border border-[#26262E]">
                    <span className="text-[#F8C300] font-bold">Corrección: </span>
                    {item.fixedExample}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(`${item.id}-fix`, item.addTokens.join(', '))}
                    className="flex-1 min-h-[38px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014] hover:bg-[#e5b400] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    {copiedKey === `${item.id}-fix` ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Tokens copiados!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Solución</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(`${item.id}-neg`, `Avoid: ${item.negativePrompt}`)
                    }
                    className="min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {copiedKey === `${item.id}-neg` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#326BFF]" />
                        <span>Negativo copiado</span>
                      </>
                    ) : (
                      <>
                        <ShieldBan className="w-3.5 h-3.5 text-[#B4523A] dark:text-[#F8C300]" />
                        <span>Copiar Negative</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* PART 2: INTERACTIVE NEGATIVE PROMPT KIT BUILDER */}
        <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#326BFF] dark:text-[#F8C300] font-mono-code font-bold mb-1.5">
              <ShieldBan className="w-3.5 h-3.5" />
              <span>CONSTRUCTOR RÁPIDO DE NEGATIVE PROMPTS</span>
            </div>
            <h3 className="text-2xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
              Armador de Restricciones por Disciplina
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#A09E97] mt-1 max-w-2xl">
              Activa uno o varios paquetes para combinar las exclusiones exactas y copiarlas en formato estándar o Midjourney (`--no`).
            </p>
          </div>

          {/* Toggleable Packs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {NEGATIVE_PROMPT_PACKS.map((pack) => {
              const active = selectedPackIds.includes(pack.id);
              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => togglePack(pack.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300]'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {pack.title}
                    </span>
                    <span className="text-[11px] font-mono-code opacity-80">
                      {pack.tokens.length} reglas
                    </span>
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed ${
                      active
                        ? 'text-[#E5E3DC] dark:text-[#101014]/80'
                        : 'text-[#5B5B66] dark:text-[#A09E97]'
                    }`}
                  >
                    {pack.useCase}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Output Box */}
          <div className="bg-[#101014] rounded-xl p-5 border border-[#26262E]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormatStyle('standard')}
                  className={`min-h-[36px] px-3 py-1 text-[11px] font-mono-code uppercase font-bold rounded-lg border transition-colors ${
                    formatStyle === 'standard'
                      ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                      : 'bg-[#16161C] text-[#A09E97] border-[#26262E]'
                  }`}
                >
                  Formato Universal (Avoid:)
                </button>
                <button
                  type="button"
                  onClick={() => setFormatStyle('midjourney')}
                  className={`min-h-[36px] px-3 py-1 text-[11px] font-mono-code uppercase font-bold rounded-lg border transition-colors ${
                    formatStyle === 'midjourney'
                      ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                      : 'bg-[#16161C] text-[#A09E97] border-[#26262E]'
                  }`}
                >
                  Midjourney (--no)
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={combinedNegativeTokens.length === 0}
                  onClick={() =>
                    onSendToBuilder({
                      negativeAvoid: combinedNegativeTokens,
                    })
                  }
                  className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#326BFF] text-white hover:bg-[#2558e0] disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Cargar en Constructor</span>
                </button>
                <button
                  type="button"
                  disabled={combinedNegativeTokens.length === 0}
                  onClick={() => handleCopy('neg-kit', renderedNegativePrompt)}
                  className="min-h-[38px] px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014] hover:bg-[#e5b400] disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  {copiedKey === 'neg-kit' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Bloque ({combinedNegativeTokens.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <pre className="font-mono-code text-xs text-[#E5E3DC] leading-relaxed whitespace-pre-wrap select-all">
              {renderedNegativePrompt}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
