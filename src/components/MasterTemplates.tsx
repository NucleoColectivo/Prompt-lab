import React, { useMemo, useState } from 'react';
import {
  Copy,
  Check,
  Film,
  Camera,
  Layout,
  Package,
  Monitor,
  Sparkles,
  RotateCcw,
  Download,
  Wand2,
} from 'lucide-react';
import { EXTENDED_TEMPLATES, ExtendedMasterTemplate } from '../data/resourcesExtendedData';
import type { PromptBuilderState } from './PromptBuilder';

interface MasterTemplatesProps {
  onSendToBuilder?: (patch: Partial<PromptBuilderState>) => void;
}

const TEMPLATE_ICONS: Record<ExtendedMasterTemplate['id'], React.ReactNode> = {
  photo: <Camera className="w-3.5 h-3.5" />,
  video: <Film className="w-3.5 h-3.5" />,
  design: <Layout className="w-3.5 h-3.5" />,
  branding: <Package className="w-3.5 h-3.5" />,
  web: <Monitor className="w-3.5 h-3.5" />,
  art: <Sparkles className="w-3.5 h-3.5" />,
};

const PLATFORMS_GUIDE = [
  {
    name: 'Google AI Studio · Gemini & Imagen',
    role: 'Iteración Creativa, Dirección & Código',
    tip: 'Pega la estructura numerada completa y pídele 3 variaciones con diferente iluminación o temperatura de color antes de generar la imagen final.',
    format: 'Secciones numeradas + restricciones claras',
  },
  {
    name: 'ChatGPT · GPT Image / DALL-E',
    role: 'Dirección Conceptual & Referencias',
    tip: 'Adjunta un boceto o fotografía y añade: "Conserva proporciones, empaque y colores de la referencia adjunta, cambiando únicamente la escenografía e iluminación".',
    format: 'Lenguaje natural claro + viñetas',
  },
  {
    name: 'Midjourney v6 / FLUX.1',
    role: 'Fotografía Editorial & Dirección de Arte',
    tip: 'Convierte la plantilla en un párrafo denso con cámara y óptica ("Shot on Hasselblad X2D, 85mm f/1.8") y cierra con flags: --ar 4:5 --style raw.',
    format: 'Frases descriptivas por comas + flags',
  },
  {
    name: 'Ideogram & Recraft',
    role: 'Carteles, Tipografía & Vectores',
    tip: 'Cuando necesites texto real en un afiche, coloca las palabras exactas entre comillas dobles ("FESTIVAL SONORO 2026") y define la jerarquía tipográfica.',
    format: 'Concepto + texto entre comillas + estilo',
  },
  {
    name: 'Runway Gen-3 & Kling',
    role: 'Cinematografía & Movimiento Físico',
    tip: 'Describe la acción en tiempo presente y especifica una única trayectoria de cámara continua: "Slow stabilized orbit shot, 24fps, consistent lighting".',
    format: 'Cámara + Acción + Sujeto + Luz',
  },
  {
    name: 'Google Veo & Luma Dream Machine',
    role: 'Video Generativo & Audio-Visual',
    tip: 'Indica permanencia de objetos y ambiente sonoro diegético: "Maintain exact geometry and light direction throughout the sequence, subtle ambient soundscape".',
    format: 'Escena + Física + Sonido + Continuidad',
  },
];

export const MasterTemplates: React.FC<MasterTemplatesProps> = ({
  onSendToBuilder,
}) => {
  const [activeId, setActiveId] = useState<ExtendedMasterTemplate['id']>('photo');
  const [useBlankSkeleton, setUseBlankSkeleton] = useState(false);
  const [copied, setCopied] = useState(false);

  const [valuesByTemplate, setValuesByTemplate] = useState<
    Record<string, Record<string, string>>
  >(() => {
    const initial: Record<string, Record<string, string>> = {};
    for (const tpl of EXTENDED_TEMPLATES) {
      initial[tpl.id] = {};
      for (const v of tpl.variables) {
        initial[tpl.id][v.key] = v.defaultValue;
      }
    }
    return initial;
  });

  const activeTemplate =
    EXTENDED_TEMPLATES.find((t) => t.id === activeId) || EXTENDED_TEMPLATES[0];

  const currentValues = valuesByTemplate[activeTemplate.id] || {};

  const renderedTemplate = useMemo(() => {
    let output = activeTemplate.templateBody;
    for (const variable of activeTemplate.variables) {
      const value = useBlankSkeleton
        ? `[${variable.label.toUpperCase()}]`
        : currentValues[variable.key]?.trim() || `[${variable.label.toUpperCase()}]`;
      output = output.split(`{{${variable.key}}}`).join(value);
    }
    return output;
  }, [activeTemplate, currentValues, useBlankSkeleton]);

  const handleFieldChange = (key: string, nextValue: string) => {
    setUseBlankSkeleton(false);
    setValuesByTemplate((prev) => ({
      ...prev,
      [activeTemplate.id]: {
        ...(prev[activeTemplate.id] || {}),
        [key]: nextValue,
      },
    }));
  };

  const handleResetDefaults = () => {
    setUseBlankSkeleton(false);
    const resetMap: Record<string, string> = {};
    for (const v of activeTemplate.variables) {
      resetMap[v.key] = v.defaultValue;
    }
    setValuesByTemplate((prev) => ({
      ...prev,
      [activeTemplate.id]: resetMap,
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([renderedTemplate], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plantilla-${activeTemplate.id}-nucleo-lab.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendToBuilder = () => {
    if (!onSendToBuilder) return;
    const firstVarKey = activeTemplate.variables[0]?.key;
    const ratioVar = currentValues['RATIO'] || activeTemplate.defaultAspectRatio;
    const subjectSeed =
      (firstVarKey && currentValues[firstVarKey]) || activeTemplate.description;

    onSendToBuilder({
      mode: activeTemplate.mode,
      subject: subjectSeed,
      lighting: currentValues['LUZ'] || currentValues['ATMOSFERA'] || 'Directional editorial light',
      colorPalette: currentValues['PALETA'] || 'Editorial natural color science',
      visualStyle: activeTemplate.label,
      aspectRatio: ratioVar,
    });
  };

  return (
    <section
      id="plantillas"
      className="py-12 sm:py-16 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7545D6] dark:text-[#F8C300] font-mono-code font-bold mb-2">
            <span>ARQUITECTURA DE PROMPT INTERACTIVA</span>
            <span aria-hidden="true" className="text-[#8E8C85]">/</span>
            <span>6 DISCIPLINAS CREATIVAS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
            Plantillas Maestras Rellenables
          </h2>
          <p className="text-sm text-[#4A4A55] dark:text-[#A09E97] mt-2 max-w-2xl leading-relaxed">
            Elige una disciplina, completa las variables clave en vivo y copia el prompt estructurado o envíalo directo al Constructor Maestro.
          </p>
        </div>

        {/* 6 Discipline Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {EXTENDED_TEMPLATES.map((tpl) => {
            const isActive = tpl.id === activeTemplate.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setActiveId(tpl.id)}
                className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                    : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                {TEMPLATE_ICONS[tpl.id]}
                <span>{tpl.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Split Workspace: Left Variables | Right Live Prompt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
          {/* Left: Variable Customizer */}
          <div className="lg:col-span-5 bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300]">
                  {activeTemplate.badge} · VARIABLES EDITABLES
                </span>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] hover:text-[#101014] dark:hover:text-[#F4F2ED] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Ejemplo</span>
                </button>
              </div>
              <h3 className="text-lg font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED] mb-1">
                {activeTemplate.label}
              </h3>
              <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] mb-5 leading-relaxed">
                {activeTemplate.description}
              </p>

              <div className="space-y-3.5">
                {activeTemplate.variables.map((variable) => (
                  <div key={variable.key}>
                    <label
                      htmlFor={`tpl-${activeTemplate.id}-${variable.key}`}
                      className="block text-[11px] font-mono-code uppercase tracking-wider font-bold text-[#4A4A55] dark:text-[#A09E97] mb-1"
                    >
                      {variable.label}
                    </label>
                    <input
                      id={`tpl-${activeTemplate.id}-${variable.key}`}
                      type="text"
                      value={useBlankSkeleton ? '' : currentValues[variable.key] || ''}
                      onChange={(e) => handleFieldChange(variable.key, e.target.value)}
                      placeholder={variable.placeholder}
                      className="w-full min-h-[40px] px-3 py-2 text-xs bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg focus:outline-none focus:border-[#326BFF] transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#DEDAD0] dark:border-[#26262E] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setUseBlankSkeleton((prev) => !prev)}
                className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97] hover:text-[#326BFF] dark:hover:text-[#F8C300] underline"
              >
                {useBlankSkeleton
                  ? 'Mostrar con ejemplo rellenado'
                  : 'Ver esqueleto vacío con [CORCHETES]'}
              </button>
            </div>
          </div>

          {/* Right: Live Rendered Prompt Output */}
          <div className="lg:col-span-7 bg-[#101014] rounded-xl p-5 sm:p-6 border border-[#26262E] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#26262E]">
                <div className="text-xs font-mono-code uppercase tracking-wider text-[#F8C300] font-bold">
                  VISTA EN VIVO · {activeTemplate.shortLabel.toUpperCase()}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-[#F4F2ED] bg-[#1C1C24] hover:bg-[#26262E] border border-[#343440] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.TXT</span>
                  </button>
                  {onSendToBuilder && (
                    <button
                      type="button"
                      onClick={handleSendToBuilder}
                      className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-[#F4F2ED] bg-[#326BFF] hover:bg-[#2558e0] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Abrir en Constructor</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="min-h-[38px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <pre className="font-mono-code text-xs text-[#E5E3DC] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                {renderedTemplate}
              </pre>
            </div>

            <div className="mt-5 pt-3 border-t border-[#26262E] text-[11px] font-mono-code text-[#8E8C85]">
              Consejo: edita cualquier campo a la izquierda para actualizar el prompt al instante.
            </div>
          </div>
        </div>

        {/* Guide for AI Platforms */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7545D6] dark:text-[#F8C300] font-mono-code font-bold mb-1">
              <span>GUÍA DE COMPATIBILIDAD</span>
              <span aria-hidden="true" className="text-[#8E8C85]">/</span>
              <span>6 ECOSISTEMAS IA</span>
            </div>
            <h3 className="text-2xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
              Cómo adaptar tus plantillas a cada herramienta
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLATFORMS_GUIDE.map((plat) => (
              <div
                key={plat.name}
                className="p-5 bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] text-[#7545D6] dark:text-[#F8C300] uppercase tracking-wider font-mono-code font-bold mb-1">
                    {plat.role}
                  </div>
                  <h4 className="text-sm font-bold text-[#101014] dark:text-[#F4F2ED] mb-2">
                    {plat.name}
                  </h4>
                  <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed mb-4">
                    {plat.tip}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex items-center justify-between gap-2 text-[11px] font-mono-code">
                  <span className="text-[#5B5B66] dark:text-[#8E8C85]">Formato:</span>
                  <span className="text-[#101014] dark:text-[#F4F2ED] font-semibold text-right">
                    {plat.format}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
