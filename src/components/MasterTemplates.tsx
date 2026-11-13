import React, { useState } from 'react';
import { Copy, Check, FileText, Film, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { MASTER_TEMPLATES } from '../data/promptData';

export const MasterTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
  const [copied, setCopied] = useState(false);

  const currentTemplate = activeTab === 'photo' ? MASTER_TEMPLATES.photo : MASTER_TEMPLATES.video;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PLATFORMS_GUIDE = [
    {
      name: 'ChatGPT & DALL-E 3',
      role: 'Generación y Dirección Conceptual',
      tip: 'Puedes subir una foto existente y escribir: "/premiumshowcase Utiliza la foto adjunta como referencia principal conservando el empaque, colores y proporciones..."',
      format: 'Párrafo estructurado con viñetas'
    },
    {
      name: 'Midjourney v6 / Flux.1',
      role: 'Fotografía Hiperrealista & Editorial',
      tip: 'Añade parámetros al final: --ar 4:5 --v 6.1 --style raw. Funciona excelente especificando cámara ("Shot on Hasselblad X2D, 85mm f/1.8") y emulsión.',
      format: 'Comas y tokens descriptivos'
    },
    {
      name: 'Runway Gen-3 Alpha & Kling',
      role: 'Cinematografía & Movimiento Físico',
      tip: 'Describe la acción en presente y especifica la trayectoria exacta de la cámara: "Slow continuous orbit shot around the subject, 24fps, organic physics, seamless motion".',
      format: 'Cámara + Acción + Sujeto + Iluminación'
    },
    {
      name: 'Google Veo & Luma Dream Machine',
      role: 'Video Generativo & Simulación 3D',
      tip: 'Indica la consistencia temporal: "Maintain character identity, lighting coherence and realistic physical inertia throughout the sequence, no morphing".',
      format: 'Narrativa temporal Inicio -> Desarrollo -> Fin'
    }
  ];

  return (
    <section id="plantillas" className="py-16 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono-code mb-2">
            <span>ARQUITECTURA DE PROMPT</span>
            <span aria-hidden="true" className="text-stone-400">/</span>
            <span>SECCIONES 16 Y 22</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
            Plantillas Maestras Universales
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-2xl">
            Estructuras profesionales para redactar prompts exhaustivos de dirección de arte. Copia el esqueleto base y sustituye los corchetes con los detalles de tu producción.
          </p>
        </div>

        {/* Master Templates Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('photo')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-2 ${
                activeTab === 'photo'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Plantilla Maestra · Fotografía (Sec. 16)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-2 ${
                activeTab === 'video'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Plantilla Maestra · Video & Cine (Sec. 22)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="py-2 px-4 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded transition-all flex items-center gap-1.5 shadow-xs shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-stone-950" />
                <span>¡Plantilla Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Plantilla</span>
              </>
            )}
          </button>
        </div>

        {/* Template Code Container */}
        <div className="relative bg-stone-950 rounded-lg p-6 mb-16 shadow-xl border border-stone-800">
          <pre className="font-mono-code text-xs text-stone-200 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
            {currentTemplate}
          </pre>
        </div>

        {/* Guide for AI Platforms */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono-code mb-1">
              <span>GUÍA DE COMPATIBILIDAD</span>
              <span aria-hidden="true" className="text-stone-400">/</span>
              <span>SECCIÓN 25</span>
            </div>
            <h3 className="text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Cómo aplicar estos prompts en cada plataforma
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLATFORMS_GUIDE.map((plat) => (
              <div
                key={plat.name}
                className="p-5 bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-lg flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-200">
                      {plat.name}
                    </h4>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider font-mono-code font-semibold">
                      {plat.role}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {plat.tip}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between text-[11px] font-mono-code text-stone-500">
                  <span>Estructura óptima:</span>
                  <span className="text-stone-800 dark:text-stone-300 font-semibold">{plat.format}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
