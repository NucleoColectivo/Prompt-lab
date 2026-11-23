import React, { useMemo, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Wand2,
  Wrench,
  AlertCircle,
  BookOpen,
  X,
} from 'lucide-react';
import type { CreativeLabExperience } from '../../data/creativeExperiencesData';

interface PromptAssistantPanelProps {
  lab: CreativeLabExperience;
  currentPrompt: string;
  onApplyImprovedPrompt: (improved: string) => void;
  onClose?: () => void;
}

interface DimensionCheck {
  id: string;
  label: string;
  present: boolean;
  suggestion: string;
}

function analyzePrompt(prompt: string, lab: CreativeLabExperience): {
  checks: DimensionCheck[];
  improvedPrompt: string;
  scoreSummary: string;
} {
  const lower = prompt.toLowerCase();

  const checks: DimensionCheck[] = [
    {
      id: 'light',
      label: 'Iluminación',
      present: /(luz|iluminaci|contraluz|rembrandt|sombra|claroscuro|foco|solar|atardecer|amanecer|light|lighting)/i.test(lower),
      suggestion: 'luz natural lateral suave con sombras limpias y profundidad real',
    },
    {
      id: 'composition',
      label: 'Composición / Plano',
      present: /(plano|encuadre|retícula|cenital|contrapicado|simetr|composición|perspectiva|diagonal|frame|shot|wide|close)/i.test(lower),
      suggestion: 'composición equilibrada con punto focal claro y espacio negativo respirable',
    },
    {
      id: 'texture',
      label: 'Materialidad y textura',
      present: /(textura|papel|piedra|madera|vidrio|cerámica|concreto|piel|tinta|grano|metal|lino|texture|grain|paper|matte)/i.test(lower),
      suggestion: 'texturas táctiles auténticas, grano fino orgánico y cero acabado plástico',
    },
    {
      id: 'color',
      label: 'Paleta de color',
      present: /(color|paleta|ocre|cobalto|índigo|terracota|ámbar|monocromo|duotono|cálid|frí|tonos|palette|grade)/i.test(lower),
      suggestion: 'paleta cromática contenida de máximo 3 tonos dominantes con contraste armónico',
    },
    {
      id: 'format',
      label: 'Óptica / Formato',
      present: /(mm|16:9|2:3|4:5|1:1|9:16|2\.39:1|lente|cámara|formato|24fps|12fps|lens|camera)/i.test(lower),
      suggestion: 'captura nítida con lente apropiado y proporción definida',
    },
  ];

  const missing = checks.filter((c) => !c.present);
  const baseClean = prompt.trim().replace(/\.$/, '');
  const additions = missing.slice(0, 3).map((m) => m.suggestion);

  const improvedPrompt =
    additions.length > 0
      ? `${baseClean || lab.starterPrompt.replace(/\.$/, '')}, ${additions.join(', ')}.`
      : `${baseClean}, dirección de arte refinada con contraste natural y detalle nítido sin clichés visuales.`;

  const presentCount = checks.length - missing.length;
  const scoreSummary =
    presentCount >= 4
      ? `Prompt sólido (${presentCount}/5 dimensiones visuales cubiertas). Puedes probar mutaciones de estilo o cámara.`
      : `Detectamos ${missing.length} dimensiones que puedes fortalecer para ganar precisión visual.`;

  return { checks, improvedPrompt, scoreSummary };
}

const QUICK_COACH_QUESTIONS = [
  {
    id: 'plastic',
    label: '¿Cómo evitar que se vea plástico o genérico?',
    answer:
      'Elimina palabras vacías como "hyperrealistic, 8k, masterpiece, flawless" y describe en su lugar materiales reales (papel algodón, porcelana mate, poros naturales, lino crudo), dirección concreta de la luz y una óptica real (ej. 50mm f/2.8 o 85mm).',
    snippet: 'textura material auténtica, imperfecciones orgánicas naturales, sin acabado plástico ni brillo artificial',
  },
  {
    id: 'cinema',
    label: '¿Cómo hacerlo más cinematográfico?',
    answer:
      'Especifica relación de aspecto panorámica (16:9 o 2.39:1), temperatura de color entre luces y sombras, una fuente de luz motivada (ventana, farola, atardecer) y un lente de cine (35mm, 40mm anamórfico o 85mm).',
    snippet: 'estética cinematográfica en 35mm, luz motivada lateral con atmósfera sutil, relación 16:9',
  },
  {
    id: 'layout',
    label: '¿Cómo dejar espacio para texto o diseño?',
    answer:
      'Pide explícitamente "espacio negativo limpio superior" o "sin texto incrustado" y coloca los títulos reales después en Figma, Canva o Illustrator para evitar letras deformadas.',
    snippet: 'amplio espacio negativo limpio para tipografía posterior, sin texto incrustado distorsionado',
  },
  {
    id: 'iterate',
    label: '¿Cómo iterar sin perder la idea?',
    answer:
      'Congela el sujeto principal y cambia solo una variable por iteración: primero ajusta composición, luego iluminación y por último paleta o técnica. Guarda cada versión en el paso 5 para comparar.',
    snippet: 'manteniendo exactamente el mismo sujeto central y encuadre base',
  },
];

export const PromptAssistantPanel: React.FC<PromptAssistantPanelProps> = ({
  lab,
  currentPrompt,
  onApplyImprovedPrompt,
  onClose,
}) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string>('plastic');
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  const analysis = useMemo(
    () => analyzePrompt(currentPrompt, lab),
    [currentPrompt, lab]
  );

  const activeQuestion =
    QUICK_COACH_QUESTIONS.find((q) => q.id === activeQuestionId) ||
    QUICK_COACH_QUESTIONS[0];

  const handleApply = (text: string) => {
    onApplyImprovedPrompt(text);
    setAppliedFeedback(true);
    setTimeout(() => setAppliedFeedback(false), 2000);
  };

  return (
    <aside
      aria-label="Núcleobot · Asistente contextual de prompts"
      className="rounded-xl border border-[#7545D6]/40 dark:border-[#F8C300]/40 bg-[#F9F8F4] dark:bg-[#14131B] p-5 space-y-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
            <Bot className="w-4 h-4 shrink-0" />
            <span>NÚCLEOBOT · ASISTENTE CONTEXTUAL DE PROMPT</span>
          </div>
          <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
            Analiza tu borrador actual dentro de <strong>{lab.code} · {lab.title}</strong> y propone mejoras concretas de dirección visual.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar asistente Núcleobot"
            className="p-1.5 rounded-lg text-[#5B5B66] dark:text-[#A09E97] hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Diagnostic */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]">
          {analysis.scoreSummary}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {analysis.checks.map((check) => (
            <div
              key={check.id}
              className={`px-3 py-2 rounded-lg border text-xs flex items-center gap-1.5 ${
                check.present
                  ? 'bg-white dark:bg-[#181820] border-[#DEDAD0] dark:border-[#2B2B36] text-[#101014] dark:text-[#F4F2ED]'
                  : 'bg-[#FFF8E1] dark:bg-[#231F14] border-[#F8C300]/60 text-[#101014] dark:text-[#F8C300]'
              }`}
            >
              {check.present ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F8C300] shrink-0" />
              )}
              <span className="truncate font-medium">{check.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Upgraded Prompt */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A1A22] border border-[#DEDAD0] dark:border-[#2A2A35] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
            <span>Propuesta enriquecida de tu prompt</span>
          </span>
          <button
            type="button"
            onClick={() => handleApply(analysis.improvedPrompt)}
            className="px-3 py-1.5 min-h-[36px] rounded-lg bg-[#7545D6] hover:bg-[#5E32B8] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{appliedFeedback ? 'Prompt aplicado' : 'Aplicar mejora'}</span>
          </button>
        </div>
        <p className="text-xs font-mono-code leading-relaxed text-[#2F2F38] dark:text-[#DDDAD2]">
          {analysis.improvedPrompt}
        </p>
      </div>

      {/* Interactive Concept Questions */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300]" />
          <span>Consultas frecuentes para este laboratorio</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_COACH_QUESTIONS.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setActiveQuestionId(q.id)}
              className={`px-3 py-2 min-h-[38px] text-xs font-semibold rounded-lg border transition-colors text-left ${
                activeQuestionId === q.id
                  ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                  : 'bg-white dark:bg-[#1A1A22] text-[#3F3F48] dark:text-[#C8C6BF] border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF]'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#1A1A22] border border-[#DEDAD0] dark:border-[#2A2A35] space-y-2.5">
          <p className="text-xs leading-relaxed text-[#3F3F48] dark:text-[#D1CFC7]">
            {activeQuestion.answer}
          </p>
          <button
            type="button"
            onClick={() =>
              handleApply(
                `${currentPrompt.trim().replace(/\.$/, '')}, ${activeQuestion.snippet}.`
              )
            }
            className="text-xs font-semibold text-[#326BFF] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Sumar este ajuste a mi prompt actual</span>
          </button>
        </div>
      </div>

      {/* Recommended Tools & Ethics Reminder */}
      <div className="pt-3 border-t border-[#DEDAD0] dark:border-[#2A2A35] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#4A4A55] dark:text-[#B4B2AC]">
          <Wrench className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300] shrink-0" />
          <span>
            <strong className="text-[#101014] dark:text-[#F4F2ED]">Herramientas recomendadas:</strong>{' '}
            {lab.tools.join(' · ')}
          </span>
        </div>
      </div>
    </aside>
  );
};
