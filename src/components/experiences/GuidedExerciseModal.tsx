import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Check,
  Copy,
  Sparkles,
  Upload,
  ChevronLeft,
  ChevronRight,
  Bot,
  BookmarkPlus,
  Download,
  Share2,
  CheckCircle2,
  Trash2,
  Wand2,
  Scale,
  Wrench,
  Layers,
  FileDown,
} from 'lucide-react';
import {
  assemblePromptFromFields,
  type CommunityExperimentEntry,
  type CreativeLabExperience,
} from '../../data/creativeExperiencesData';
import type { PromptBuilderState } from '../PromptBuilder';
import { ResilientImage } from '../ResilientImage';
import { PromptAssistantPanel } from './PromptAssistantPanel';
import { ExperimentCardExporterModal } from './ExperimentCardExporterModal';

interface SavedPromptVersion {
  id: string;
  label: string;
  prompt: string;
  variationLabel: string;
  createdAt: string;
}

interface GuidedExerciseModalProps {
  lab: CreativeLabExperience;
  isCompleted: boolean;
  onClose: () => void;
  onMarkCompleted: (labId: string) => void;
  onPublishToGallery: (entry: CommunityExperimentEntry) => void;
  onSendToBuilder: (patch: Partial<PromptBuilderState>) => void;
}

const STEPS = [
  { id: 1, short: '1. Objetivo', title: 'Paso 1 · Objetivo del laboratorio' },
  { id: 2, short: '2. Inspiración', title: 'Paso 2 · Referencias e inspiración' },
  { id: 3, short: '3. Material', title: 'Paso 3 · Material inicial' },
  { id: 4, short: '4. Prompt', title: 'Paso 4 · Construcción del prompt' },
  { id: 5, short: '5. Variaciones', title: 'Paso 5 · Experimentación y Núcleobot' },
  { id: 6, short: '6. Resultado', title: 'Paso 6 · Vista previa del resultado' },
  { id: 7, short: '7. Aprendizaje', title: 'Paso 7 · Reflexión creativa' },
  { id: 8, short: '8. Compartir', title: 'Paso 8 · Guardar y publicar en Galería' },
];

export const GuidedExerciseModal: React.FC<GuidedExerciseModalProps> = ({
  lab,
  isCompleted,
  onClose,
  onMarkCompleted,
  onPublishToGallery,
  onSendToBuilder,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedInspirationIdx, setSelectedInspirationIdx] = useState<number>(0);

  // Step 3: Material inicial
  const [materialMode, setMaterialMode] = useState<'blank' | 'idea' | 'upload'>('idea');
  const [ideaText, setIdeaText] = useState<string>('');
  const [uploadedInputPreview, setUploadedInputPreview] = useState<string | null>(null);
  const [uploadedInputName, setUploadedInputName] = useState<string>('');

  // Step 4: Configurable prompt fields
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of lab.promptFields) {
      initial[f.key] = f.defaultValue;
    }
    return initial;
  });

  // Step 5: Experimentación & Núcleobot
  const [activeVariationId, setActiveVariationId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>(lab.starterPrompt);
  const [hasManualPromptEdit, setHasManualPromptEdit] = useState<boolean>(false);
  const [versions, setVersions] = useState<SavedPromptVersion[]>([
    {
      id: 'v-init',
      label: 'Versión 1 (Base)',
      prompt: lab.starterPrompt,
      variationLabel: 'Prompt inicial',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [showNucleobot, setShowNucleobot] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Step 6: Result upload
  const [resultImagePreview, setResultImagePreview] = useState<string | null>(null);
  const [toolUsed, setToolUsed] = useState<string>(lab.tools[0] || 'Midjourney / FLUX');

  // Step 7: Reflection
  const [reflectionWorked, setReflectionWorked] = useState<string>('');
  const [reflectionChange, setReflectionChange] = useState<string>('');
  const [reflectionLearned, setReflectionLearned] = useState<string>('');
  const [reflectionSurprised, setReflectionSurprised] = useState<string>('');

  // Step 8: Share
  const [publishTitle, setPublishTitle] = useState<string>(`${lab.title} — Experimento`);
  const [publishAuthor, setPublishAuthor] = useState<string>('Creador/a Núcleo Lab');
  const [publishedSuccess, setPublishedSuccess] = useState<boolean>(false);
  const [showCardExporter, setShowCardExporter] = useState<boolean>(false);

  const activeVariation = useMemo(
    () => lab.styleVariations.find((v) => v.id === activeVariationId) || null,
    [lab.styleVariations, activeVariationId]
  );

  const assembledPrompt = useMemo(
    () =>
      assemblePromptFromFields(
        fieldValues,
        lab.promptFields,
        materialMode === 'idea' ? ideaText : undefined,
        activeVariation?.modifier
      ),
    [fieldValues, lab.promptFields, materialMode, ideaText, activeVariation]
  );

  useEffect(() => {
    if (!hasManualPromptEdit) {
      setCustomPrompt(assembledPrompt || lab.starterPrompt);
    }
  }, [assembledPrompt, hasManualPromptEdit, lab.starterPrompt]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleFieldChange = (key: string, value: string) => {
    setHasManualPromptEdit(false);
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectVariation = (variationId: string | null) => {
    setHasManualPromptEdit(false);
    setActiveVariationId(variationId);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'input' | 'result'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!dataUrl) return;
      if (target === 'input') {
        setUploadedInputPreview(dataUrl);
        setUploadedInputName(file.name);
        setMaterialMode('upload');
      } else {
        setResultImagePreview(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveVersion = () => {
    const trimmed = customPrompt.trim();
    if (!trimmed) return;
    const nextNum = versions.length + 1;
    setVersions((prev) => [
      {
        id: `v-${Date.now()}`,
        label: `Versión ${nextNum}`,
        prompt: trimmed,
        variationLabel: activeVariation ? activeVariation.label : 'Personalizada',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  const handleCopyPrompt = async (text = customPrompt) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleExportRecordTxt = () => {
    const lines = [
      `NÚCLEO COLECTIVO · VISUAL PROMPT LAB`,
      `Laboratorio: ${lab.code} — ${lab.title}`,
      `Categoría: ${lab.category} | Nivel: ${lab.level} | Tiempo: ${lab.duration}`,
      `Fecha: ${new Date().toISOString().slice(0, 10)}`,
      `Herramienta usada: ${toolUsed}`,
      ``,
      `OBJETIVO:`,
      lab.objective,
      ``,
      `PROMPT FINAL:`,
      customPrompt,
      ``,
      `VERSIONES GUARDADAS (${versions.length}):`,
      ...versions.map((v) => `- [${v.label} · ${v.variationLabel}]: ${v.prompt}`),
      ``,
      `REFLEXIÓN Y APRENDIZAJE:`,
      `- ¿Qué funcionó?: ${reflectionWorked || '(sin anotar)'}`,
      `- ¿Qué cambiarías?: ${reflectionChange || '(sin anotar)'}`,
      `- ¿Qué aprendiste?: ${reflectionLearned || '(sin anotar)'}`,
      `- ¿Qué te sorprendió?: ${reflectionSurprised || '(sin anotar)'}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lab.id}-registro.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const buildCurrentEntry = (): CommunityExperimentEntry => {
    const notesParts = [
      reflectionWorked && `Funcionó: ${reflectionWorked}`,
      reflectionLearned && `Aprendizaje: ${reflectionLearned}`,
      reflectionSurprised && `Sorpresa: ${reflectionSurprised}`,
    ].filter(Boolean);

    return {
      id: `comm-user-${Date.now()}`,
      author: publishAuthor.trim() || 'Creador/a Núcleo Lab',
      title: publishTitle.trim() || lab.title,
      category: lab.category,
      disciplineId: lab.disciplineId,
      exerciseId: lab.id,
      prompt: customPrompt.trim() || lab.starterPrompt,
      toolUsed: toolUsed.trim() || lab.tools[0] || 'IA Creativa',
      notes:
        notesParts.join(' · ') ||
        `Ejercicio completado en ${lab.code} (${lab.title}).`,
      image: resultImagePreview || uploadedInputPreview || lab.image,
      imageAlt: `Resultado de ${publishTitle || lab.title}`,
      createdAt: new Date().toISOString().slice(0, 10),
      isUserCreated: true,
    };
  };

  const handlePublish = () => {
    onPublishToGallery(buildCurrentEntry());
    onMarkCompleted(lab.id);
    setPublishedSuccess(true);
  };

  const handleOpenInBuilder = () => {
    onSendToBuilder({
      mode: lab.disciplineId === 'video-narrativas' ? 'video' : 'photo',
      subject: customPrompt.trim() || lab.starterPrompt,
      visualStyle: fieldValues.estilo || lab.category,
      lighting: fieldValues.iluminacion || '',
      composition: fieldValues.composicion || '',
      colorPalette: fieldValues.color || '',
      texture: fieldValues.texturas || fieldValues.materiales || '',
      lens: fieldValues.camara || '',
    });
    onClose();
  };

  const currentStepMeta = STEPS[step - 1];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guided-lab-title"
      className="fixed inset-0 z-50 bg-[#101014]/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-5xl max-h-[92vh] rounded-2xl overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2A2A35] shadow-2xl flex flex-col">
        {/* Top Modal Header */}
        <header className="px-5 py-4 bg-white dark:bg-[#16161C] border-b border-[#DEDAD0] dark:border-[#26262E] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-mono-code text-[#7545D6] dark:text-[#F8C300] font-bold">
              <span>{lab.code}</span>
              <span aria-hidden="true">·</span>
              <span>{lab.category}</span>
              <span aria-hidden="true">·</span>
              <span>{lab.level}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{lab.duration}</span>
              {isCompleted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#059669] dark:text-[#34D399]">Completado</span>
                </>
              )}
            </div>
            <h2
              id="guided-lab-title"
              className="text-lg sm:text-xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] truncate"
            >
              {lab.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ejercicio guiado"
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] hover:border-[#F8C300] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* 8-Step Interactive Progress Stepper */}
        <nav
          aria-label="Pasos del ejercicio guiado"
          className="px-4 sm:px-5 py-2.5 bg-[#ECE8DF] dark:bg-[#14141A] border-b border-[#DEDAD0] dark:border-[#26262E] overflow-x-auto shrink-0"
        >
          <div className="flex items-center gap-1.5 min-w-max">
            {STEPS.map((s) => {
              const isActive = step === s.id;
              const isPast = step > s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] font-bold'
                      : isPast
                      ? 'bg-white dark:bg-[#1D1D26] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#2E2E3A]'
                      : 'text-[#5B5B66] dark:text-[#A09E97] hover:text-[#101014] dark:hover:text-[#F4F2ED]'
                  }`}
                >
                  {isPast && <Check className="w-3 h-3 text-[#059669] dark:text-[#34D399]" />}
                  <span>{s.short}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Scrollable Step Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              {currentStepMeta.title}
            </h3>
            <span className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97] tabular-nums">
              Paso {step} de 8
            </span>
          </div>

          {/* ================= STEP 1: OBJETIVO ================= */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5 rounded-xl overflow-hidden bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                <ResilientImage
                  src={lab.image}
                  alt={lab.imageAlt}
                  aspectRatio="16:9"
                  containerClassName="w-full h-full min-h-[200px]"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2">
                  <div className="text-xs font-mono-code uppercase font-bold text-[#326BFF] dark:text-[#F8C300]">
                    Reto práctico
                  </div>
                  <p className="text-base font-bold text-[#101014] dark:text-[#F4F2ED]">
                    {lab.exercise}
                  </p>
                  <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                    {lab.objective}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-1.5">
                    <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300]" />
                      <span>Herramientas sugeridas</span>
                    </div>
                    <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
                      {lab.tools.join(' · ')}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-1.5">
                    <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                      <span>Criterio ético</span>
                    </div>
                    <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                      {lab.ethicsTip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: INSPIRACIÓN ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Observa estas referencias visuales seleccionadas antes de escribir tu prompt. Fíjate en la luz, la composición, la paleta y el espacio negativo.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lab.inspirations.map((ref, idx) => {
                  const active = selectedInspirationIdx === idx;
                  return (
                    <button
                      key={ref.title}
                      type="button"
                      onClick={() => setSelectedInspirationIdx(idx)}
                      className={`text-left rounded-xl overflow-hidden border transition-all flex flex-col ${
                        active
                          ? 'bg-white dark:bg-[#181822] border-[#326BFF] dark:border-[#F8C300] ring-2 ring-[#326BFF]/25 dark:ring-[#F8C300]/25'
                          : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                      }`}
                    >
                      <div className="aspect-video overflow-hidden bg-[#101014]">
                        <ResilientImage
                          src={ref.image}
                          alt={ref.alt}
                          aspectRatio="16:9"
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-1.5">
                        <div className="text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                          Referencia 0{idx + 1} {active ? '· Seleccionada' : ''}
                        </div>
                        <div className="text-sm font-bold text-[#101014] dark:text-[#F4F2ED]">
                          {ref.title}
                        </div>
                        <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                          {ref.note}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 3: MATERIAL INICIAL ================= */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Elige cómo quieres arrancar este laboratorio. Tu archivo se procesa únicamente en tu navegador para referencia local.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'idea' as const,
                    title: 'Escribir una idea base',
                    desc: 'Parte de un concepto, tema, historia o frase propia.',
                  },
                  {
                    id: 'upload' as const,
                    title: 'Subir foto o boceto',
                    desc: 'Carga una imagen local para tenerla a la vista mientras diseñas el prompt.',
                  },
                  {
                    id: 'blank' as const,
                    title: 'Empezar desde cero',
                    desc: 'Usa directamente los parámetros guiados del siguiente paso.',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMaterialMode(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-colors ${
                      materialMode === opt.id
                        ? 'bg-white dark:bg-[#1A1A22] border-[#326BFF] dark:border-[#F8C300]'
                        : 'bg-white/70 dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                    }`}
                  >
                    <div className="text-sm font-bold text-[#101014] dark:text-[#F4F2ED]">
                      {opt.title}
                    </div>
                    <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] mt-1">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>

              {materialMode === 'idea' && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2">
                  <label
                    htmlFor="lab-initial-idea"
                    className="block text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                  >
                    Tu idea, tema o frase de partida (se integrará automáticamente al prompt)
                  </label>
                  <textarea
                    id="lab-initial-idea"
                    rows={3}
                    value={ideaText}
                    onChange={(e) => {
                      setHasManualPromptEdit(false);
                      setIdeaText(e.target.value);
                    }}
                    placeholder={`Ejemplo para ${lab.code}: describe tu contexto local, emoción o proyecto personal...`}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>
              )}

              {materialMode === 'upload' && (
                <div className="p-5 rounded-xl bg-white dark:bg-[#16161C] border border-dashed border-[#B8B4AA] dark:border-[#383846] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#101014] dark:text-[#F4F2ED]">
                        Cargar imagen, fotografía o boceto de referencia
                      </div>
                      <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                        Compatible con PNG, JPG o WEBP. Vista previa local inmediata.
                      </p>
                    </div>
                    <label className="px-4 py-2.5 min-h-[40px] rounded-lg bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] text-xs font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-2 whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Elegir archivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'input')}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {uploadedInputPreview && (
                    <div className="flex flex-col sm:flex-row gap-4 items-start pt-3 border-t border-[#ECE8DF] dark:border-[#26262E]">
                      <img
                        src={uploadedInputPreview}
                        alt={`Referencia subida: ${uploadedInputName}`}
                        referrerPolicy="no-referrer"
                        className="w-full sm:w-56 aspect-video object-cover rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36]"
                      />
                      <div className="space-y-2 text-xs">
                        <div className="font-bold text-[#101014] dark:text-[#F4F2ED]">
                          {uploadedInputName}
                        </div>
                        <p className="text-[#4A4A55] dark:text-[#B4B2AC]">
                          Tu referencia quedará disponible como guía visual durante la construcción del prompt.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedInputPreview(null);
                            setUploadedInputName('');
                          }}
                          className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Quitar archivo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {materialMode === 'blank' && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
                  Listo para empezar desde cero. Avanza al Paso 4 para ensamblar cada parámetro de tu prompt guiado.
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 4: CONSTRUCCIÓN DEL PROMPT ================= */}
          {step === 4 && (
            <div className="space-y-5">
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Configura los bloques clave de <strong>{lab.category}</strong>. Puedes elegir opciones rápidas o escribir tus propios detalles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lab.promptFields.map((field) => (
                  <div
                    key={field.key}
                    className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2.5"
                  >
                    <label
                      htmlFor={`field-${field.key}`}
                      className="block text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                    >
                      {field.label}
                    </label>
                    <textarea
                      id={`field-${field.key}`}
                      rows={2}
                      value={fieldValues[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {field.options.map((opt, idx) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleFieldChange(field.key, opt)}
                          className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors text-left ${
                            fieldValues[field.key] === opt
                              ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300] font-semibold'
                              : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF]'
                          }`}
                        >
                          Opción {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Assembled Prompt Preview */}
              <div className="p-4 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#2A2A35] space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs font-mono-code text-[#F8C300]">
                  <span>PROMPT ENSAMBLADO EN VIVO</span>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(assembledPrompt)}
                    className="inline-flex items-center gap-1 text-[#F4F2ED] hover:text-[#F8C300]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-xs font-mono-code leading-relaxed text-[#E5E3DC]">
                  {assembledPrompt}
                </p>
              </div>
            </div>
          )}

          {/* ================= STEP 5: EXPERIMENTACIÓN & NÚCLEOBOT ================= */}
          {step === 5 && (
            <div className="space-y-5">
              {/* Style Variations */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                  <span>Probar variaciones de estilo</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {lab.styleVariations.map((v) => {
                    const isSelected = activeVariationId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectVariation(isSelected ? null : v.id)}
                        className={`p-3.5 rounded-xl border text-left transition-colors ${
                          isSelected
                            ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                            : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]'
                        }`}
                      >
                        <div className="text-xs font-bold">{v.label}</div>
                        <p
                          className={`text-[11px] mt-1 ${
                            isSelected
                              ? 'text-[#D6D3CB] dark:text-[#2A2614]'
                              : 'text-[#5B5B66] dark:text-[#A09E97]'
                          }`}
                        >
                          {v.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editable Prompt + Action Bar */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="experiment-prompt-editor"
                    className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                  >
                    Editor libre de prompt
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNucleobot((prev) => !prev)}
                    className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      showNucleobot
                        ? 'bg-[#7545D6] text-white'
                        : 'bg-[#7545D6]/15 dark:bg-[#7545D6]/30 text-[#5B2EC0] dark:text-[#E2D6FF] hover:bg-[#7545D6] hover:text-white'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Necesito ayuda con mi prompt (Núcleobot)</span>
                  </button>
                </div>

                <textarea
                  id="experiment-prompt-editor"
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => {
                    setHasManualPromptEdit(true);
                    setCustomPrompt(e.target.value);
                  }}
                  className="w-full px-3.5 py-3 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs font-mono-code leading-relaxed text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(customPrompt)}
                    className="px-4 py-2 min-h-[40px] rounded-lg bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Prompt copiado' : 'Copiar prompt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveVersion}
                    className="px-4 py-2 min-h-[40px] rounded-lg bg-[#F4F2ED] dark:bg-[#1D1D26] border border-[#DEDAD0] dark:border-[#2E2E3A] hover:border-[#326BFF] text-[#101014] dark:text-[#F4F2ED] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Guardar versión ({versions.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenInBuilder}
                    className="px-4 py-2 min-h-[40px] rounded-lg bg-[#326BFF] hover:bg-[#2354D6] text-white text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Enviar al Constructor Maestro</span>
                  </button>
                </div>
              </div>

              {/* Contextual Núcleobot Assistant */}
              {showNucleobot && (
                <PromptAssistantPanel
                  lab={lab}
                  currentPrompt={customPrompt}
                  onApplyImprovedPrompt={(improved) => {
                    setHasManualPromptEdit(true);
                    setCustomPrompt(improved);
                  }}
                  onClose={() => setShowNucleobot(false)}
                />
              )}

              {/* Saved Versions Comparison */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]">
                  Historial de versiones guardadas ({versions.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {versions.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono-code">
                        <span className="font-bold text-[#7545D6] dark:text-[#F8C300]">
                          {v.label} · {v.variationLabel}
                        </span>
                        <span className="text-[#5B5B66] dark:text-[#A09E97] tabular-nums">
                          {v.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-[#3F3F48] dark:text-[#D1CFC7] line-clamp-3 font-mono-code">
                        {v.prompt}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setHasManualPromptEdit(true);
                            setCustomPrompt(v.prompt);
                          }}
                          className="text-xs font-semibold text-[#326BFF] dark:text-[#F8C300] hover:underline"
                        >
                          Restaurar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(v.prompt)}
                          className="text-xs font-semibold text-[#5B5B66] dark:text-[#A09E97] hover:text-[#101014] dark:hover:text-[#F4F2ED]"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 6: RESULTADO ================= */}
          {step === 6 && (
            <div className="space-y-5">
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Prueba tu prompt en una de las herramientas sugeridas y sube aquí tu resultado para compararlo con la referencia y documentar tu proceso.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                  <div className="text-xs font-mono-code font-bold text-[#5B5B66] dark:text-[#A09E97] uppercase">
                    Referencia del laboratorio
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-[#101014]">
                    <ResilientImage
                      src={lab.image}
                      alt={lab.imageAlt}
                      aspectRatio="16:9"
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300] uppercase">
                      Tu resultado generado
                    </span>
                    <label className="px-3 py-1.5 rounded-lg bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] text-xs font-bold cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir resultado</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'result')}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {resultImagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={resultImagePreview}
                        alt="Resultado generado por el usuario"
                        referrerPolicy="no-referrer"
                        className="w-full aspect-video object-cover rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36]"
                      />
                      <button
                        type="button"
                        onClick={() => setResultImagePreview(null)}
                        className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                      >
                        Quitar imagen
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg border border-dashed border-[#C7C3B8] dark:border-[#343442] bg-[#F4F2ED] dark:bg-[#101014] flex flex-col items-center justify-center p-4 text-center space-y-1.5">
                      <Sparkles className="w-5 h-5 text-[#7545D6] dark:text-[#F8C300]" />
                      <div className="text-xs font-semibold text-[#101014] dark:text-[#F4F2ED]">
                        Aún no has cargado tu imagen generada
                      </div>
                      <p className="text-[11px] text-[#5B5B66] dark:text-[#A09E97] max-w-xs">
                        También puedes continuar y guardar tu experimento usando tu prompt y la referencia del laboratorio.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2">
                <label
                  htmlFor="lab-tool-used"
                  className="block text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                >
                  ¿Qué herramienta utilizaste para generar o editar tu resultado?
                </label>
                <div className="flex flex-wrap gap-2">
                  {lab.tools.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => setToolUsed(tool)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        toolUsed === tool
                          ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300] font-bold'
                          : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36]'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
                <input
                  id="lab-tool-used"
                  type="text"
                  value={toolUsed}
                  onChange={(e) => setToolUsed(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED]"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 7: APRENDIZAJE ================= */}
          {step === 7 && (
            <div className="space-y-4">
              <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC]">
                Registrar lo que observaste convierte una prueba suelta en criterio artístico replicable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'ref-worked',
                    label: '1. ¿Qué funcionó mejor en tu resultado?',
                    value: reflectionWorked,
                    setter: setReflectionWorked,
                    placeholder: 'Ej. La iluminación lateral y especificar el material real evitaron el look artificial...',
                  },
                  {
                    id: 'ref-change',
                    label: '2. ¿Qué cambiarías en una siguiente iteración?',
                    value: reflectionChange,
                    setter: setReflectionChange,
                    placeholder: 'Ej. Probaría un encuadre más abierto y reduciría la saturación...',
                  },
                  {
                    id: 'ref-learned',
                    label: '3. ¿Qué aprendiste sobre dirección visual o prompts?',
                    value: reflectionLearned,
                    setter: setReflectionLearned,
                    placeholder: 'Ej. Nombrar el lente y el tipo de papel cambia por completo el tono emocional...',
                  },
                  {
                    id: 'ref-surprised',
                    label: '4. ¿Qué resultado o detalle te sorprendió?',
                    value: reflectionSurprised,
                    setter: setReflectionSurprised,
                    placeholder: 'Ej. La forma en que el modelo resolvió las sombras y el reflejo...',
                  },
                ].map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2"
                  >
                    <label
                      htmlFor={q.id}
                      className="block text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                    >
                      {q.label}
                    </label>
                    <textarea
                      id={q.id}
                      rows={3}
                      value={q.value}
                      onChange={(e) => q.setter(e.target.value)}
                      placeholder={q.placeholder}
                      className="w-full px-3 py-2 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 8: COMPARTIR Y GUARDAR ================= */}
          {step === 8 && (
            <div className="space-y-5">
              {publishedSuccess ? (
                <div className="p-6 rounded-xl bg-white dark:bg-[#16161C] border border-[#059669] space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#059669] dark:text-[#34D399]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Experimento guardado y publicado en la Galería de Experimentos</span>
                  </div>
                  <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                    Tu laboratorio <strong>{lab.code} · {lab.title}</strong> quedó marcado como completado en tu progreso local y ya es visible en la sección de Galería de Experimentos Comunitarios.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowCardExporter(true)}
                      className="px-4 py-2.5 min-h-[40px] rounded-lg bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Exportar tarjeta PNG / PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportRecordTxt}
                      className="px-4 py-2.5 min-h-[40px] rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar registro (.txt)</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 min-h-[40px] rounded-lg bg-[#101014] dark:bg-white text-[#F4F2ED] dark:text-[#101014] text-xs font-bold"
                    >
                      Volver a los laboratorios
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-7 p-5 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="pub-title"
                        className="block text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                      >
                        Título de tu experimento
                      </label>
                      <input
                        id="pub-title"
                        type="text"
                        value={publishTitle}
                        onChange={(e) => setPublishTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="pub-author"
                        className="block text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
                      >
                        Autor/a o colectivo
                      </label>
                      <input
                        id="pub-author"
                        type="text"
                        value={publishAuthor}
                        onChange={(e) => setPublishAuthor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-sm text-[#101014] dark:text-[#F4F2ED]"
                      />
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-1 text-xs">
                      <div className="font-mono-code text-[11px] font-bold text-[#7545D6] dark:text-[#F8C300]">
                        PROMPT QUE SE GUARDARÁ
                      </div>
                      <p className="font-mono-code text-[#2F2F38] dark:text-[#D5D2CA] leading-relaxed">
                        {customPrompt}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={handlePublish}
                        className="px-5 py-2.5 min-h-[42px] rounded-lg bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 whitespace-nowrap"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Guardar y publicar en Galería</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCardExporter(true)}
                        className="px-4 py-2.5 min-h-[42px] rounded-lg bg-[#101014] dark:bg-[#242430] text-[#F4F2ED] text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Exportar tarjeta PNG / PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onMarkCompleted(lab.id);
                          handleExportRecordTxt();
                        }}
                        className="px-4 py-2.5 min-h-[42px] rounded-lg bg-white dark:bg-[#1D1D26] border border-[#DEDAD0] dark:border-[#2E2E3A] text-[#101014] dark:text-[#F4F2ED] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar ficha (.txt)</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                    <div className="text-xs font-mono-code font-bold text-[#5B5B66] dark:text-[#A09E97]">
                      VISTA PREVIA EN GALERÍA
                    </div>
                    <div className="aspect-video rounded-lg overflow-hidden bg-[#101014]">
                      <img
                        src={resultImagePreview || uploadedInputPreview || lab.image}
                        alt={publishTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-[#101014] dark:text-[#F4F2ED]">
                        {publishTitle || lab.title}
                      </div>
                      <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                        {publishAuthor} · {lab.category} · {toolUsed}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Bottom Navigation Bar */}
        <footer className="px-5 py-3.5 bg-white dark:bg-[#16161C] border-t border-[#DEDAD0] dark:border-[#26262E] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2 min-h-[40px] rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] disabled:opacity-40 text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF] inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#5B5B66] dark:text-[#A09E97]">
            <button
              type="button"
              onClick={() => {
                setStep(5);
                setShowNucleobot(true);
              }}
              className="text-xs font-semibold text-[#7545D6] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Abrir Núcleobot</span>
            </button>
          </div>

          {step < 8 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(8, s + 1))}
              className="px-4 py-2 min-h-[40px] rounded-lg bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Siguiente paso</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 min-h-[40px] rounded-lg bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] text-xs font-bold uppercase tracking-wider whitespace-nowrap"
            >
              Finalizar
            </button>
          )}
        </footer>
      </div>

      {showCardExporter && (
        <ExperimentCardExporterModal
          entry={buildCurrentEntry()}
          onClose={() => setShowCardExporter(false)}
        />
      )}
    </div>
  );
};
