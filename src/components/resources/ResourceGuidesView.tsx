import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckSquare,
  Copy,
  Download,
  Frame,
  Palette,
  SlidersHorizontal,
  Square,
  Wand2,
} from 'lucide-react';
import { COLOR_PALETTES } from '../../data/promptData';
import {
  ASPECT_RATIO_SPECS,
  EXTRA_CURATED_PALETTES,
  QUICK_CHEATSHEETS,
  WORKSHOP_PREFLIGHT_CHECKLIST,
} from '../../data/resourcesExtendedData';
import type { PromptBuilderState } from '../PromptBuilder';

interface ResourceGuidesViewProps {
  onSendToBuilder: (patch: Partial<PromptBuilderState>) => void;
}

const CHECKLIST_STORAGE_KEY = 'nc_workshop_preflight_v1';

export const ResourceGuidesView: React.FC<ResourceGuidesViewProps> = ({
  onSendToBuilder,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCheatTab, setActiveCheatTab] =
    useState<keyof typeof QUICK_CHEATSHEETS>('optica');
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Ignore storage quota issues
    }
  }, [checkedIds]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const toggleChecklist = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportWorkshopGuide = () => {
    const lines = [
      'NÚCLEO COLECTIVO · VISUAL PROMPT LAB',
      'CHECKLIST PRE-ENTREGA PARA TALLERES Y PROYECTOS CREATIVOS CON IA',
      '================================================================',
      '',
      ...WORKSHOP_PREFLIGHT_CHECKLIST.map((item) => {
        const mark = checkedIds.includes(item.id) ? '[x]' : '[ ]';
        return `${mark} (${item.group}) ${item.label}\n    ${item.detail}`;
      }),
      '',
      'FÓRMULA DE 7 CAPAS DEL PROMPT:',
      '01. Sujeto y acción | 02. Medio y género | 03. Entorno y escala | 04. Composición y lente | 05. Iluminación | 06. Paleta y textura | 07. Formato y negativos.',
    ];
    const blob = new Blob([lines.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guia-checklist-taller-nucleo-lab.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const allPalettes = [
    ...EXTRA_CURATED_PALETTES,
    ...COLOR_PALETTES.map((p) => ({
      ...p,
      promptSnippet: `${p.name} color palette (${p.colors.join(', ')}: ${p.hexCodes.join(', ')})`,
    })),
  ];

  const activeCheatSheet = QUICK_CHEATSHEETS[activeCheatTab];

  return (
    <section className="py-12 sm:py-16 bg-[#F4F2ED] dark:bg-[#101014] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* BLOCK 1: VISUAL ASPECT RATIO GUIDE */}
        <div>
          <div className="mb-7">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#326BFF] dark:text-[#F8C300] font-mono-code font-bold mb-2">
              <Frame className="w-3.5 h-3.5" />
              <span>PROPORCIONES Y ENCUADRE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
              Guía Visual de Aspect Ratios
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#A09E97] mt-2 max-w-2xl">
              Define el formato desde el primer prompt para evitar recortes forzados al llevar tus piezas a redes, impresión o cine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ASPECT_RATIO_SPECS.map((spec) => {
              const maxDim = Math.max(spec.widthUnits, spec.heightUnits);
              const boxWidth = Math.round((spec.widthUnits / maxDim) * 72);
              const boxHeight = Math.round((spec.heightUnits / maxDim) * 72);

              return (
                <div
                  key={spec.ratio}
                  className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-24 flex items-center justify-center bg-[#F4F2ED] dark:bg-[#101014] rounded-lg border border-[#DEDAD0] dark:border-[#26262E] mb-4">
                      <div
                        className="border-2 border-[#326BFF] dark:border-[#F8C300] bg-[#326BFF]/10 dark:bg-[#F8C300]/15 rounded flex items-center justify-center font-mono-code text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                        style={{ width: `${boxWidth}px`, height: `${boxHeight}px` }}
                      >
                        {spec.ratio}
                      </div>
                    </div>

                    <div className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300] mb-0.5">
                      {spec.midjourneyFlag}
                    </div>
                    <h3 className="text-base font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED] mb-1.5">
                      {spec.name}
                    </h3>
                    <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed mb-2">
                      {spec.platforms}
                    </p>
                    <p className="text-[11px] text-[#5B5B66] dark:text-[#8E8C85] leading-relaxed mb-4">
                      <strong>Tip:</strong> {spec.framingTip}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(`ar-${spec.ratio}`, spec.midjourneyFlag)}
                      className="flex-1 min-h-[36px] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014] hover:bg-[#e5b400] transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                    >
                      {copiedId === `ar-${spec.ratio}` ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{spec.midjourneyFlag}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendToBuilder({ aspectRatio: spec.ratio })}
                      title="Usar esta proporción en el Constructor"
                      className="min-h-[36px] px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3 text-[#326BFF] dark:text-[#F8C300]" />
                      <span>Usar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLOCK 2: QUICK TECHNICAL CHEAT SHEETS */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7545D6] dark:text-[#F8C300] font-mono-code font-bold mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>HOJAS DE REFERENCIA RÁPIDA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
              Chuletas Técnicas para Taller y Rodaje
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {(
              [
                { id: 'optica', label: 'Óptica (14–135mm)' },
                { id: 'luz', label: 'Esquemas de Luz' },
                { id: 'video', label: 'Movimientos de Video' },
                { id: 'estructura', label: 'Fórmula de 7 Capas' },
              ] as { id: keyof typeof QUICK_CHEATSHEETS; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCheatTab(tab.id)}
                className={`min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors whitespace-nowrap ${
                  activeCheatTab === tab.id
                    ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                    : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#DEDAD0] dark:border-[#26262E]">
              <h3 className="text-lg font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
                {activeCheatSheet.title}
              </h3>
              <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] mt-1">
                {activeCheatSheet.subtitle}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F4F2ED] dark:bg-[#101014] text-[11px] font-mono-code uppercase tracking-wider text-[#5B5B66] dark:text-[#8E8C85]">
                    <th className="py-3 px-4 font-bold">Parámetro</th>
                    <th className="py-3 px-4 font-bold">Efecto Visual</th>
                    <th className="py-3 px-4 font-bold">Uso Recomendado</th>
                    <th className="py-3 px-4 font-bold text-right">Token Copiable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEDAD0] dark:divide-[#26262E] text-xs">
                  {activeCheatSheet.rows.map((row) => (
                    <tr
                      key={row.term}
                      className="hover:bg-[#F4F2ED]/60 dark:hover:bg-[#101014]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] whitespace-nowrap">
                        {row.term}
                      </td>
                      <td className="py-3.5 px-4 text-[#4A4A55] dark:text-[#A09E97] leading-relaxed">
                        {row.effect}
                      </td>
                      <td className="py-3.5 px-4 text-[#5B5B66] dark:text-[#A09E97]">
                        {row.idealUse}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopy(`cs-${row.term}`, row.promptToken)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] font-mono-code text-[11px] text-[#101014] dark:text-[#F8C300]"
                        >
                          {copiedId === `cs-${row.term}` ? (
                            <>
                              <Check className="w-3 h-3 text-[#326BFF]" />
                              <span>¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="max-w-[200px] truncate">
                                {row.promptToken}
                              </span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BLOCK 3: CURATED COLOR PALETTES + CLICK TO COPY HEX */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#326BFF] dark:text-[#F8C300] font-mono-code font-bold mb-2">
              <Palette className="w-3.5 h-3.5" />
              <span>DIRECCIÓN CROMÁTICA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
              Paletas Cromáticas Listas para Prompt &amp; Diseño
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#A09E97] mt-1.5 max-w-2xl">
              Haz clic en cualquier color para copiar su código HEX o copia la descripción cromática completa para mantener coherencia en toda tu serie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allPalettes.map((pal) => (
              <div
                key={pal.name}
                className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Interactive Swatches */}
                  <div className="flex gap-2 mb-4">
                    {pal.hexCodes.map((hex, i) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => handleCopy(`hex-${pal.name}-${hex}`, hex)}
                        title={`Copiar ${hex}`}
                        className="flex-1 group text-left"
                      >
                        <div
                          className="h-14 rounded-lg border border-black/10 dark:border-white/10 mb-1.5 transition-transform group-hover:scale-[1.03]"
                          style={{ backgroundColor: hex }}
                        />
                        <div className="text-[10px] font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] truncate">
                          {copiedId === `hex-${pal.name}-${hex}` ? '¡Copiado!' : hex}
                        </div>
                        <div className="text-[10px] text-[#5B5B66] dark:text-[#8E8C85] truncate">
                          {pal.colors[i] || ''}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold mb-1">
                    {pal.vibe}
                  </div>
                  <h3 className="text-base font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED] mb-1.5">
                    {pal.name}
                  </h3>
                  <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed mb-4">
                    {pal.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(`pal-${pal.name}`, pal.promptSnippet)}
                    className="flex-1 min-h-[36px] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014] hover:bg-[#e5b400] transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedId === `pal-${pal.name}` ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Paleta</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onSendToBuilder({ colorPalette: pal.promptSnippet })
                    }
                    className="min-h-[36px] px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3 text-[#326BFF] dark:text-[#F8C300]" />
                    <span>Aplicar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 4: INTERACTIVE WORKSHOP & ETHICS PREFLIGHT CHECKLIST */}
        <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] mb-1.5">
                CALIDAD, PRODUCCIÓN &amp; ÉTICA
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
                Checklist Pre-Entrega para Proyectos y Talleres
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#A09E97] mt-1 max-w-2xl">
                Verifica cada punto antes de publicar una pieza, entregar a un cliente o facilitar una sesión educativa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs font-mono-code font-bold text-[#101014] dark:text-[#F8C300]">
                {checkedIds.length}/{WORKSHOP_PREFLIGHT_CHECKLIST.length} verificados
              </div>
              <button
                type="button"
                onClick={handleExportWorkshopGuide}
                className="min-h-[40px] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#101014] text-[#F4F2ED] dark:bg-[#F8C300] dark:text-[#101014] hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Guía (.TXT)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {WORKSHOP_PREFLIGHT_CHECKLIST.map((item) => {
              const checked = checkedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklist(item.id)}
                  className={`text-left p-4 rounded-xl border transition-colors flex items-start gap-3 ${
                    checked
                      ? 'bg-[#F4F2ED] dark:bg-[#101014] border-[#326BFF] dark:border-[#F8C300]'
                      : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-[#326BFF] dark:text-[#F8C300] mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#8E8C85] mt-0.5 shrink-0" />
                  )}
                  <div>
                    <div className="text-[10px] font-mono-code uppercase font-bold text-[#7545D6] dark:text-[#F8C300] mb-0.5">
                      {item.group}
                    </div>
                    <div
                      className={`text-xs font-bold mb-1 ${
                        checked
                          ? 'text-[#326BFF] dark:text-[#F8C300]'
                          : 'text-[#101014] dark:text-[#F4F2ED]'
                      }`}
                    >
                      {item.label}
                    </div>
                    <p className="text-[11px] text-[#4A4A55] dark:text-[#A09E97] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
