import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  Sparkles,
  Clapperboard,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
} from 'lucide-react';
import type { AppSectionId } from '../types/navigation';
import { VISUAL_LIBRARY_PATHS } from '../data/visualLibraryRegistry';

interface WelcomeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAndClose: (section: AppSectionId) => void;
}

interface WizardStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  actionLabel: string;
  targetSection: AppSectionId;
  icon: React.ReactNode;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    number: '01',
    title: 'Explorar Biblioteca Visual',
    subtitle: '26 Módulos técnicos de fotografía, cine y dirección de arte',
    description:
      'Empieza consultando referencias reales antes de escribir. Encuentra lentes (8–400mm), esquemas de luz, paletas cromáticas, movimientos de cámara, storytelling, worldbuilding, diseño sonoro y ética creativa.',
    highlights: [
      'Ejemplos visuales comparados en español e inglés',
      'Diagramas técnicos de iluminación y encuadre',
      'Copia prompts probados o envíalos directo al Constructor',
    ],
    image: VISUAL_LIBRARY_PATHS.focalComparison,
    imageAlt: 'Referencia visual comparando distancias focales en la Biblioteca Visual',
    actionLabel: 'Ir a la Biblioteca ahora',
    targetSection: 'biblioteca',
    icon: <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  },
  {
    number: '02',
    title: 'Construir Prompt Maestro',
    subtitle: 'Ensambla instrucciones precisas sin errores técnicos ni API',
    description:
      'Configura cámara, lente, apertura, iluminación y movimiento de video desde cero. El Constructor detecta incompatibilidades ópticas, ofrece variaciones en un clic, exporta fichas PDF/PNG y abre tus prompts directo en 31 apps IA.',
    highlights: [
      'Modo Fotografía / Publicidad y Modo Video / Cinematografía',
      'Variaciones rápidas de 1 parámetro a la vez y colecciones',
      'Práctica directa en ChatGPT, Gemini, Midjourney, FLUX, CapCut y Runway',
    ],
    image: VISUAL_LIBRARY_PATHS.adLuxury,
    imageAlt: 'Ejemplo de dirección de arte construida en el Prompt Builder',
    actionLabel: 'Abrir Constructor Maestro',
    targetSection: 'builder',
    icon: <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  },
  {
    number: '03',
    title: 'Usar el Director de IA (8 Etapas)',
    subtitle: 'De una idea corta a un dossier audiovisual completo',
    description:
      'Describe qué quieres filmar (por ejemplo, «un video de 30 segundos sobre la memoria de un barrio») y obtén concepto creativo, guion, desglose por escenas, prompts por toma, diseño sonoro y plan de montaje.',
    highlights: [
      'Desglose automático por duración (15s, 30s o 60s)',
      'Prompts separados de Imagen Keyframe + Movimiento de Video por escena',
      'Envía tus escenas directo al Storyboard Creator o descárgalo en .TXT/.JSON',
    ],
    image: VISUAL_LIBRARY_PATHS.camCinemaRig,
    imageAlt: 'Planificación cinematográfica por escenas en el Director Audiovisual',
    actionLabel: 'Probar Director Audiovisual',
    targetSection: 'film-director',
    icon: <Clapperboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  },
];

export const WelcomeWizardModal: React.FC<WelcomeWizardModalProps> = ({
  isOpen,
  onClose,
  onNavigateAndClose,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setStepIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setStepIndex((prev) => Math.min(WIZARD_STEPS.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setStepIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStep = WIZARD_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === WIZARD_STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-wizard-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl text-stone-900 dark:text-stone-100 max-h-[92vh] flex flex-col">
        {/* Top Bar with Brand & Stepper */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
            <Compass className="w-4 h-4 shrink-0" />
            <span>BIENVENIDO A NÚCLEO COLECTIVO · GUÍA EN 3 PASOS</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded transition-colors"
            aria-label="Cerrar guía de bienvenida"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Stepper Indicator */}
        <div className="px-5 pt-4 bg-[#FAF8F5] dark:bg-stone-900">
          <div className="grid grid-cols-3 gap-2">
            {WIZARD_STEPS.map((step, idx) => {
              const active = idx === stepIndex;
              const completed = idx < stepIndex;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setStepIndex(idx)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    active
                      ? 'bg-amber-400/20 border-amber-500 text-stone-950 dark:text-amber-300'
                      : completed
                      ? 'bg-white dark:bg-stone-950 border-emerald-400/60 text-stone-700 dark:text-stone-300'
                      : 'bg-white/60 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-code font-bold">
                    <span>PASO {step.number}</span>
                    {completed && <Check className="w-3 h-3 text-emerald-600" />}
                  </div>
                  <div className="text-[11px] font-semibold truncate mt-0.5">{step.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Step Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Visual Banner */}
          <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-950">
            <img
              src={currentStep.image}
              alt={currentStep.imageAlt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-stone-200">
              <span className="font-mono-code font-bold text-amber-300 uppercase">
                Función {currentStep.number} de 03
              </span>
              <span className="text-[11px] font-mono-code text-stone-300">
                100% gratuito · Sin clave API
              </span>
            </div>
          </div>

          {/* Step Heading + Copy */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-code font-semibold text-amber-700 dark:text-amber-400">
              {currentStep.icon}
              <span>{currentStep.subtitle}</span>
            </div>
            <h2
              id="welcome-wizard-title"
              className="text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100"
            >
              {currentStep.title}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Highlights List */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
            {currentStep.highlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300"
              >
                <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-5 py-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono-code text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline underline-offset-2"
            >
              Saltar guía
            </button>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <button
              type="button"
              onClick={() => onNavigateAndClose(currentStep.targetSection)}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>{currentStep.actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAF8F5] dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:border-amber-500 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            {!isLast ? (
              <button
                type="button"
                onClick={() => setStepIndex((prev) => Math.min(WIZARD_STEPS.length - 1, prev + 1))}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center gap-1.5 shadow-xs"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-white dark:text-stone-950 flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>¡Empezar a Explorar!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
