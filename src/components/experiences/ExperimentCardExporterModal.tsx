import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  Check,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import type { CommunityExperimentEntry } from '../../data/creativeExperiencesData';
import {
  downloadCanvasAsPdf,
  downloadCanvasAsPng,
  getFormatMeta,
  renderExperimentCardCanvas,
  type ExportCardFormat,
  type ExportCardTheme,
} from '../../utils/experimentCardRenderer';

interface ExperimentCardExporterModalProps {
  entry: CommunityExperimentEntry;
  onClose: () => void;
}

const FORMAT_OPTIONS: { id: ExportCardFormat; label: string; hint: string }[] = [
  { id: 'workshop-3x4', label: 'Ficha Taller (3:4)', hint: '1200×1600 · Impresión y PDF' },
  { id: 'social-4x5', label: 'Redes (4:5)', hint: '1080×1350 · Instagram / LinkedIn' },
  { id: 'square-1x1', label: 'Cuadrado (1:1)', hint: '1080×1080 · Feed y portafolio' },
];

export const ExperimentCardExporterModal: React.FC<ExperimentCardExporterModalProps> = ({
  entry,
  onClose,
}) => {
  const [format, setFormat] = useState<ExportCardFormat>('workshop-3x4');
  const [theme, setTheme] = useState<ExportCardTheme>('editorial-light');
  const [workshopLabel, setWorkshopLabel] = useState<string>('Galería de Experimentos');
  const [includeNotes, setIncludeNotes] = useState<boolean>(true);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [exportStatus, setExportStatus] = useState<'idle' | 'png' | 'pdf'>('idle');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setIsRendering(true);
    renderExperimentCardCanvas(entry, {
      format,
      theme,
      workshopLabel,
      includeNotes,
    }).then((canvas) => {
      if (cancelled) return;
      try {
        setPreviewDataUrl(canvas.toDataURL('image/jpeg', 0.86));
      } catch {
        setPreviewDataUrl(null);
      }
      setIsRendering(false);
    });
    return () => {
      cancelled = true;
    };
  }, [entry, format, theme, workshopLabel, includeNotes]);

  const handleDownload = async (kind: 'png' | 'pdf') => {
    const canvas = await renderExperimentCardCanvas(entry, {
      format,
      theme,
      workshopLabel,
      includeNotes,
    });
    if (kind === 'png') {
      downloadCanvasAsPng(canvas, entry.title);
    } else {
      downloadCanvasAsPdf(canvas, entry.title);
    }
    setExportStatus(kind);
    setTimeout(() => setExportStatus('idle'), 2200);
  };

  const formatMeta = getFormatMeta(format);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exporter-modal-title"
      className="fixed inset-0 z-50 bg-[#101014]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2A2A35] shadow-2xl flex flex-col">
        {/* Header */}
        <header className="px-5 py-4 bg-white dark:bg-[#16161C] border-b border-[#DEDAD0] dark:border-[#26262E] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
              EXPORTAR TARJETA VISUAL · PNG Y PDF
            </div>
            <h3
              id="exporter-modal-title"
              className="text-lg font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] truncate"
            >
              {entry.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar exportador de tarjeta"
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] hover:border-[#F8C300]"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Body Split: Controls + Live Rendered Card Preview */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Format Picker */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]">
                Formato de salida
              </div>
              <div className="space-y-2">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormat(opt.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-colors ${
                      format === opt.id
                        ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                        : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div
                      className={`text-[11px] font-mono-code mt-0.5 ${
                        format === opt.id
                          ? 'text-[#D6D3CB] dark:text-[#2A2614]'
                          : 'text-[#5B5B66] dark:text-[#A09E97]'
                      }`}
                    >
                      {opt.hint}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Picker */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]">
                Estilo de tarjeta
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('editorial-light')}
                  className={`px-3 py-2.5 min-h-[40px] rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    theme === 'editorial-light'
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300] font-bold'
                      : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Papel Crema</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('gallery-dark')}
                  className={`px-3 py-2.5 min-h-[40px] rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    theme === 'gallery-dark'
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300] font-bold'
                      : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Galería Oscura</span>
                </button>
              </div>
            </div>

            {/* Workshop / Context Label */}
            <div className="space-y-1.5">
              <label
                htmlFor="card-workshop-label"
                className="block text-xs font-bold text-[#101014] dark:text-[#F4F2ED]"
              >
                Etiqueta de taller o sesión
              </label>
              <input
                id="card-workshop-label"
                type="text"
                value={workshopLabel}
                onChange={(e) => setWorkshopLabel(e.target.value)}
                placeholder="Ej. Taller Medellín · Cohorte 04"
                className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#2C2C36] text-xs text-[#101014] dark:text-[#F4F2ED]"
              />
            </div>

            {/* Include Notes Toggle */}
            <label className="flex items-center gap-2.5 text-xs text-[#2F2F38] dark:text-[#D5D2CA] cursor-pointer">
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="w-4 h-4 rounded accent-[#7545D6]"
              />
              <span>Incluir notas de proceso y aprendizaje</span>
            </label>

            {/* Export Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => handleDownload('png')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
              >
                {exportStatus === 'png' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tarjeta PNG descargada</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>Descargar Tarjeta PNG</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownload('pdf')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#101014] dark:bg-white text-[#F4F2ED] dark:text-[#101014] hover:opacity-90 text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-opacity"
              >
                {exportStatus === 'pdf' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ficha PDF descargada</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Descargar Ficha PDF</span>
                  </>
                )}
              </button>

              <p className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] text-center">
                Resolución final: {formatMeta.width}×{formatMeta.height}px · Descarga directa local
              </p>
            </div>
          </div>

          {/* Live Rendered Canvas Preview Column */}
          <div className="lg:col-span-7 rounded-2xl bg-[#E8E4DA] dark:bg-[#181820] border border-[#DEDAD0] dark:border-[#26262E] p-4 sm:p-5 flex flex-col items-center justify-center min-h-[380px]">
            {isRendering || !previewDataUrl ? (
              <div className="flex flex-col items-center gap-2 text-xs text-[#5B5B66] dark:text-[#A09E97]">
                <Sparkles className="w-5 h-5 text-[#7545D6] dark:text-[#F8C300]" />
                <span>Renderizando tarjeta editorial...</span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-3">
                <img
                  src={previewDataUrl}
                  alt={`Vista previa de tarjeta exportable: ${entry.title}`}
                  referrerPolicy="no-referrer"
                  className="max-h-[540px] w-auto rounded-xl shadow-lg border border-black/10"
                />
                <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] inline-flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Vista previa exacta de tu descarga PNG y PDF</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
