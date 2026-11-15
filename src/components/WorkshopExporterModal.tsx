import React, { useRef, useState } from 'react';
import { X, Printer, Download, Sparkles, Check, FileText, Image as ImageIcon } from 'lucide-react';
import { PromptBuilderState } from './PromptBuilder';
import { RECIPES } from '../data/promptData';

interface WorkshopExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  builderState: PromptBuilderState;
  generatedPrompt: string;
}

export const WorkshopExporterModal: React.FC<WorkshopExporterModalProps> = ({
  isOpen,
  onClose,
  builderState,
  generatedPrompt
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'current' | string>('current');
  const [participantName, setParticipantName] = useState('Taller Núcleo Colectivo');
  const [provenanceAuthor, setProvenanceAuthor] = useState('Colectivo / Estudiante');
  const [provenanceLicense, setProvenanceLicense] = useState('CC BY-NC-SA 4.0 (Uso Educativo / Cultural)');
  const [provenanceSource, setProvenanceSource] = useState('Asistida con IA · Consentimiento verificado');
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [pngSuccess, setPngSuccess] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Active content based on format selection
  const isCustom = selectedFormat === 'current';
  const selectedRecipe = !isCustom ? RECIPES.find((r) => r.id === selectedFormat) : null;

  const activeTitle = isCustom 
    ? (builderState.subject || 'Ficha de Producción Visual')
    : selectedRecipe?.title || 'Receta Maestra';

  const activePrompt = isCustom ? generatedPrompt : selectedRecipe?.fullPrompt || '';

  const activeSpecs = isCustom ? {
    camera: builderState.camera,
    lens: builderState.lens,
    lighting: builderState.lighting,
    color: builderState.colorPalette,
    aspectRatio: builderState.aspectRatio,
    motion: builderState.mode === 'video' ? builderState.motion : undefined
  } : {
    camera: selectedRecipe?.specs.camera || '',
    lens: selectedRecipe?.specs.lens || '',
    lighting: selectedRecipe?.specs.lighting || '',
    color: selectedRecipe?.specs.color || '',
    aspectRatio: selectedRecipe?.specs.aspectRatio || '',
    motion: selectedRecipe?.specs.motion
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = () => {
    setIsDownloadingPng(true);

    // Canvas rendering for crisp PNG export
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 1400;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsDownloadingPng(false);
      return;
    }

    // Background - Warm Paper Alabaster aesthetic
    ctx.fillStyle = '#F8F6F0';
    ctx.fillRect(0, 0, width, height);

    // Header border
    ctx.strokeStyle = '#D6CEBE';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Top Brand Badge
    ctx.fillStyle = '#D97706';
    ctx.fillRect(80, 80, 16, 16);

    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1C1917';
    ctx.fillText('NÚCLEO COLECTIVO · TALLER DE DIRECCIÓN DE ARTE & IA', 110, 95);

    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#78716C';
    ctx.fillText(`FICHA TÉCNICA · ${new Date().toLocaleDateString('es-ES')} · ${participantName}`, 110, 125);

    // Divider
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 150);
    ctx.lineTo(width - 80, 150);
    ctx.stroke();

    // Main Title
    ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#1C1917';
    ctx.fillText(activeTitle.length > 40 ? activeTitle.substring(0, 40) + '...' : activeTitle, 80, 205);

    // Subtitle
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#57534E';
    ctx.fillText('Estructura de prompt profesional y parámetros ópticos para generación de imagen/video.', 80, 240);

    // Specs Box
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1;
    ctx.fillRect(80, 270, width - 160, 220);
    ctx.strokeRect(80, 270, width - 160, 220);

    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#B45309';
    ctx.fillText('PARÁMETROS TÉCNICOS CONFIGURADOS:', 110, 310);

    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#1C1917';
    ctx.fillText(`• Cámara & Sensor: ${activeSpecs.camera}`, 110, 345);
    ctx.fillText(`• Óptica & Lente: ${activeSpecs.lens}`, 110, 380);
    ctx.fillText(`• Iluminación: ${activeSpecs.lighting.substring(0, 60)}...`, 110, 415);
    ctx.fillText(`• Colorimetría: ${activeSpecs.color.substring(0, 60)}...`, 110, 450);

    // Prompt Box
    ctx.fillStyle = '#1C1917';
    ctx.fillRect(80, 520, width - 160, 680);

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('PROMPT MAESTRO (LISTO PARA PEGAR EN CHATGPT / MIDJOURNEY / RUNWAY):', 110, 560);

    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E7E5E4';

    // Word wrap prompt lines
    const words = activePrompt.split(' ');
    let line = '';
    let y = 600;
    const maxWidth = width - 220;
    const lineHeight = 24;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 110, y);
        line = words[i] + ' ';
        y += lineHeight;
        if (y > 1160) break; // prevent overflow
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 110, y);

    // Footer & Provenance note
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#57534E';
    ctx.fillText(`PROCEDENCIA · Autor: ${provenanceAuthor} | Licencia: ${provenanceLicense}`, 80, 1245);
    ctx.fillText(`ESTADO IA: ${provenanceSource}`, 80, 1268);
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#78716C';
    ctx.fillText('Documento pedagógico emitido por Núcleo Colectivo — Laboratorio de Arte, Tecnología e IA.', 80, 1298);

    // Download trigger
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `ficha-tecnica-${activeTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloadingPng(false);
      setPngSuccess(true);
      setTimeout(() => setPngSuccess(false), 2500);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-2xl p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors"
          title="Cerrar modal"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-8 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
            <span>TALLERES PRESENCIALES</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>EXPORTADOR DE FICHAS TÉCNICAS</span>
          </div>
          <h3 className="text-2xl font-bold font-serif-title">
            Exportar Ficha Técnica para Taller
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Genera hojas de trabajo imprimibles en PDF o tarjetas de alta resolución en PNG para dinámicas presenciales de dirección de arte con IA.
          </p>
        </div>

        {/* Source Selector & Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Contenido de la Ficha:
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500"
            >
              <option value="current">Prompt Actual del Constructor</option>
              {RECIPES.map((r) => (
                <option key={r.id} value={r.id}>Receta: {r.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Nombre de Taller o Participante:
            </label>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Ej: Taller Núcleo Colectivo / Tu Nombre"
              className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Ficha de Procedencia & Ética */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-3.5 rounded-lg bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs">
          <div>
            <label className="block text-[10px] font-mono-code uppercase text-stone-500 mb-1">
              Autoría / Colectivo (Procedencia)
            </label>
            <input
              type="text"
              value={provenanceAuthor}
              onChange={(e) => setProvenanceAuthor(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2.5 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono-code uppercase text-stone-500 mb-1">
              Licencia
            </label>
            <input
              type="text"
              value={provenanceLicense}
              onChange={(e) => setProvenanceLicense(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2.5 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono-code uppercase text-stone-500 mb-1">
              Referencia / Consentimiento IA
            </label>
            <input
              type="text"
              value={provenanceSource}
              onChange={(e) => setProvenanceSource(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-2.5 py-1.5 text-xs"
            />
          </div>
        </div>

        {/* Printable Worksheet Preview Container */}
        <div 
          ref={printableRef}
          className="print-section bg-white border border-stone-200 rounded p-6 sm:p-8 text-stone-900 shadow-sm mb-6"
        >
          {/* Header of Worksheet */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-200 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 font-bold">
                <span className="w-2.5 h-2.5 bg-amber-600 inline-block transform rotate-45"></span>
                <span>NÚCLEO COLECTIVO · ART & AI LAB</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-serif-title mt-1 text-stone-900">
                {activeTitle}
              </h4>
            </div>
            <div className="sm:text-right text-[11px] font-mono-code text-stone-500">
              <div>{new Date().toLocaleDateString('es-ES')}</div>
              <div className="font-semibold text-stone-700">{participantName}</div>
            </div>
          </div>

          {/* Technical Specs Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded border border-stone-200 text-xs font-mono-code mb-4">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase">Cámara:</span>
              <span className="font-semibold text-stone-800">{activeSpecs.camera}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase">Óptica:</span>
              <span className="font-semibold text-stone-800">{activeSpecs.lens}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase">Iluminación:</span>
              <span className="font-semibold text-stone-800">{activeSpecs.lighting}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase">Color / Emulsión:</span>
              <span className="font-semibold text-stone-800">{activeSpecs.color}</span>
            </div>
            {activeSpecs.motion && (
              <div className="col-span-2">
                <span className="text-stone-500 block text-[10px] uppercase">Movimiento:</span>
                <span className="font-semibold text-stone-800">{activeSpecs.motion}</span>
              </div>
            )}
          </div>

          {/* Prompt Box */}
          <div className="mb-4">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-stone-500 block mb-1">
              Prompt Maestro Estructurado:
            </span>
            <div className="bg-stone-950 text-stone-100 p-4 rounded font-mono-code text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
              {activePrompt}
            </div>
          </div>

          {/* Pedagogical checklist + Provenance for in-person students */}
          <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-600 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <strong className="block text-stone-800">1. Óptica Coherente</strong>
              Verificar relación entre focal y distancia al sujeto.
            </div>
            <div>
              <strong className="block text-stone-800">2. Dirección de Luz</strong>
              Comprobar sombras motivadas y contraste.
            </div>
            <div>
              <strong className="block text-stone-800">3. Procedencia & Ética</strong>
              {provenanceAuthor} · {provenanceLicense} ({provenanceSource}).
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500">
            Formato A4 optimizado para impresión y tarjeta PNG 1200x1400px.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-300 dark:border-stone-700 rounded transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isDownloadingPng}
              className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {pngSuccess ? (
                <>
                  <Check className="w-4 h-4 text-stone-950" />
                  <span>¡Tarjeta PNG Guardada!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isDownloadingPng ? 'Generando PNG...' : 'Descargar Tarjeta PNG'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
