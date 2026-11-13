import React, { useState } from 'react';
import { X, Copy, Check, Plus, Aperture, BookOpen } from 'lucide-react';
import { CommandItem } from '../data/promptData';

interface CommandDetailModalProps {
  command: CommandItem | null;
  onClose: () => void;
  onAddToBuilder: (cmd: CommandItem) => void;
}

export const CommandDetailModal: React.FC<CommandDetailModalProps> = ({
  command,
  onClose,
  onAddToBuilder
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!command) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 rounded transition-colors"
          title="Cerrar modal (Esc)"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 font-bold">
            <span>{command.family}</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>{command.category}</span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="text-2xl font-bold font-mono-code text-amber-700 dark:text-amber-400">
              {command.command}
            </h3>
            <span className="text-lg text-stone-900 dark:text-stone-200 font-semibold">
              {command.label}
            </span>
          </div>
        </div>

        {/* Description & Visual Effect */}
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-mono-code text-stone-500 mb-1">
              Definición y Propósito
            </h4>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {command.description}
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded border border-stone-200 dark:border-stone-850">
            <h4 className="text-xs uppercase tracking-wider font-mono-code text-amber-700 dark:text-amber-400 mb-1 font-bold">
              Efecto Visual en la Generación
            </h4>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              {command.effect}
            </p>
          </div>

          {command.technicalDetails && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-mono-code text-stone-500 mb-1">
                Detalles Técnicos y Ópticos
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-mono-code">
                {command.technicalDetails}
              </p>
            </div>
          )}
        </div>

        {/* Sample Prompts in Spanish and English */}
        <div className="space-y-4 mb-6 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-wider font-mono-code text-stone-600 dark:text-stone-400 font-semibold">
                Ejemplo de Prompt (Español)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(command.samplePromptEs, 'es')}
                className="text-[11px] font-mono-code text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
              >
                {copiedType === 'es' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'es' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded border border-stone-200 dark:border-stone-850 font-mono-code text-xs text-stone-800 dark:text-stone-300 leading-relaxed select-all">
              {command.samplePromptEs}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-wider font-mono-code text-stone-600 dark:text-stone-400 font-semibold">
                Ejemplo de Prompt (Inglés / Optimizado para IA)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(command.samplePromptEn, 'en')}
                className="text-[11px] font-mono-code text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
              >
                {copiedType === 'en' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'en' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded border border-stone-200 dark:border-stone-850 font-mono-code text-xs text-stone-800 dark:text-stone-300 leading-relaxed select-all">
              {command.samplePromptEn}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleCopy(command.command, 'cmd')}
            className="py-2.5 px-4 text-xs font-mono-code text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 border border-stone-300 dark:border-stone-700 rounded transition-colors flex items-center gap-1.5"
          >
            {copiedType === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'cmd' ? 'Comando Copiado' : `Copiar "${command.command}"`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onAddToBuilder(command);
              onClose();
            }}
            className="py-2.5 px-5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir al Constructor</span>
          </button>
        </div>

      </div>
    </div>
  );
};
