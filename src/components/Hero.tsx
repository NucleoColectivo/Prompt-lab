import React from 'react';
import { Sparkles, Camera, Film, ArrowRight, Aperture, Video, Layers } from 'lucide-react';

interface HeroProps {
  onScrollToBuilder: () => void;
  onScrollToDictionary: () => void;
  onScrollToVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToBuilder,
  onScrollToDictionary,
  onScrollToVideo
}) => {
  return (
    <section className="relative pt-8 pb-14 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean Unboxed Kicker */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono-code mb-4 font-bold">
              <span>NÚCLEO COLECTIVO</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>ARTE + TECNOLOGÍA + IA</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>EST. 2026</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-serif-title leading-[1.1] mb-6 text-balance">
              Visual & Motion <br />
              <span className="italic font-normal text-amber-600 dark:text-amber-300">Prompt Lab</span>
            </h1>

            {/* Lead Copy */}
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl mb-8 font-light">
              Diccionario maestro y laboratorio interactivo de dirección de arte, óptica, iluminación fotográfica, 
              cámaras de cine y movimientos de cámara para producción de imagen y video con inteligencia artificial 
              (ChatGPT, Midjourney, Flux, Runway Gen-3, Kling y Google Veo).
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button
                type="button"
                onClick={onScrollToBuilder}
                className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded transition-all flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Constructor Interactivo</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={onScrollToDictionary}
                className="px-5 py-3 text-xs sm:text-sm font-medium uppercase tracking-wider text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-850 hover:text-stone-950 dark:hover:text-white border border-stone-300 dark:border-stone-700 rounded transition-all flex items-center gap-2 shadow-xs"
              >
                <Camera className="w-4 h-4 text-stone-500" />
                <span>Explorar Diccionario</span>
              </button>

              <button
                type="button"
                onClick={onScrollToVideo}
                className="px-5 py-3 text-xs sm:text-sm font-medium uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-stone-200/50 dark:hover:bg-stone-900/50 rounded transition-all flex items-center gap-2"
              >
                <Film className="w-4 h-4 text-amber-500" />
                <span>Video & Cinematografía</span>
              </button>
            </div>

            {/* Direct advice from Manuel & Núcleo Colectivo */}
            <div className="text-xs text-stone-600 dark:text-stone-400 border-l-2 border-amber-500/70 pl-3 py-1">
              <p>
                <strong className="text-stone-800 dark:text-stone-300 font-medium">Nota de dirección:</strong> Los códigos con barra (<code className="text-amber-700 dark:text-amber-300 font-mono-code font-bold">/premiumshowcase</code>, <code className="text-amber-700 dark:text-amber-300 font-mono-code font-bold">/dolly-in</code>) funcionan como atajos mnemotécnicos en ChatGPT y modelos de lenguaje, traduciéndose en parámetros físicos precisos de cámara y luz.
              </p>
            </div>

          </div>

          {/* Right Column: Visual Showcase Container */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-full min-h-[380px] lg:min-h-[460px] rounded-lg overflow-hidden border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 shadow-md group">
              
              {/* High-Fidelity Studio Image */}
              <img
                src="/images/hero_cinematic_studio_1794436191894.jpg"
                alt="Plató cinematográfico y laboratorio de fotografía Núcleo Colectivo"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent pointer-events-none" />

              {/* Technical Readout Overlay Box */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-stone-950/85 backdrop-blur-md rounded border border-stone-800 text-stone-200">
                <div className="flex items-center justify-between text-xs font-mono-code text-amber-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Aperture className="w-3.5 h-3.5" />
                    <span>REFERENCIA TÉCNICA · ESTUDIO</span>
                  </span>
                  <span className="text-stone-400">RAW · 8K</span>
                </div>
                <p className="text-xs text-stone-300 font-mono-code leading-relaxed">
                  ARRI Alexa 35 · Cooke Anamorphic 40mm T2.3 · Rembrandt Light · Tungsten & Teal 3200K/5500K · Kodak 2383 Print Look
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Full-width KPI / Metrics Strip below the split */}
        <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-700 dark:text-stone-300">
          
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-stone-900 dark:text-stone-100 tabular-nums">
              180+
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">
              Parámetros y Comandos
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              Óptica, cámaras, sensores y luz
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-amber-600 dark:text-amber-400 tabular-nums">
              20+
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">
              Familias Visuales
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              Desde retrato hasta cine y VFX
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-stone-900 dark:text-stone-100 tabular-nums">
              50+
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">
              Movimientos de Video
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              Dolly, órbita, grúa, FPV y loops
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-emerald-600 dark:text-emerald-400 tabular-nums">
              100%
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">
              Multi-Plataforma
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              ChatGPT, Midjourney, Flux, Runway
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
