import React from 'react';
import { Sparkles, Camera, Film, ArrowRight, Aperture, Compass } from 'lucide-react';

interface HeroProps {
  onScrollToBuilder: () => void;
  onScrollToDictionary: () => void;
  onScrollToVideo: () => void;
  onExploreGuide?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToBuilder,
  onScrollToDictionary,
  onScrollToVideo,
  onExploreGuide,
}) => {
  return (
    <section className="relative w-full min-h-[84vh] sm:min-h-[88vh] flex items-end overflow-hidden bg-stone-950 border-b border-stone-800">
      {/* Full-Screen Background Studio Image */}
      <img
        src="/images/hero_cinematic_studio_1794436191894.jpg"
        alt="Plató cinematográfico y laboratorio de fotografía e inteligencia artificial Núcleo Colectivo"
        className="absolute inset-0 w-full h-full object-cover object-center scale-102"
        referrerPolicy="no-referrer"
      />

      {/* Atmospheric Multi-Stop Scrim for Crisp WCAG Contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/30 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10 sm:pb-12 space-y-10">
        <div className="max-w-3xl space-y-5">
          {/* Unboxed Architectural Eyebrow */}
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-mono-code font-bold">
            <span>NÚCLEO COLECTIVO</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>ARTE + TECNOLOGÍA + IA</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>LABORATORIO VISUAL Y AUDIOVISUAL</span>
          </div>

          {/* Full-Screen Display Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif-title leading-[1.04] text-balance drop-shadow-sm">
            Visual & Motion <br />
            <span className="italic font-normal text-amber-300">Prompt Lab</span>
          </h1>

          {/* Clear Explanatory Lead */}
          <p className="text-base sm:text-xl text-stone-200 leading-relaxed max-w-2xl font-light">
            Plataforma integral de experimentación visual, dirección de fotografía, cine e inteligencia artificial. Aprende qué es un prompt, explora 26 módulos técnicos, simula luz y óptica en tiempo real y practica directo en 31 apps externas.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onScrollToBuilder}
              className="px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all flex items-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Constructor Maestro</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onScrollToDictionary}
              className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-stone-900/80 hover:bg-stone-800 border border-white/25 backdrop-blur-sm rounded-lg transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>Biblioteca (26 Módulos)</span>
            </button>

            <button
              type="button"
              onClick={onScrollToVideo}
              className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-200 hover:text-amber-300 bg-stone-950/60 hover:bg-stone-900/80 border border-white/15 backdrop-blur-sm rounded-lg transition-all flex items-center gap-2"
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>Video & Cine</span>
            </button>

            {onExploreGuide && (
              <button
                type="button"
                onClick={onExploreGuide}
                className="px-4 py-3 text-xs font-mono-code uppercase tracking-wider text-amber-300 hover:text-amber-200 flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>¿Qué hay en la página?</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Architectural Metrics & Studio Spec Bar */}
        <div className="pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-200">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-white tabular-nums">
              26 Módulos
            </span>
            <span className="text-xs text-stone-300 uppercase tracking-wider mt-1">
              Enciclopedia Visual
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              Óptica, luz, storytelling, 3D, sonido y ética
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-amber-300 tabular-nums">
              6 Labs + JSON
            </span>
            <span className="text-xs text-stone-300 uppercase tracking-wider mt-1">
              Simuladores en Vivo
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              Luz, cámara, color, storyboard y extractor local
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-white tabular-nums">
              31 Apps IA
            </span>
            <span className="text-xs text-stone-300 uppercase tracking-wider mt-1">
              Práctica Directa Sin API
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              Google AI Studio, Gemini, Claude, CapCut, Lovable...
            </span>
          </div>

          <div className="flex flex-col justify-between p-3 rounded-lg bg-stone-950/75 backdrop-blur-md border border-white/15">
            <div className="flex items-center justify-between text-[10px] font-mono-code text-amber-400 font-bold">
              <span className="flex items-center gap-1">
                <Aperture className="w-3 h-3" />
                <span>ESCENA DE REFERENCIA</span>
              </span>
              <span className="text-stone-400">RAW · 24FPS</span>
            </div>
            <p className="text-[11px] text-stone-300 font-mono-code mt-1 leading-snug">
              ARRI Alexa 35 · Cooke 40mm T2.3 · Luz Rembrandt · Kodak 2383
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
