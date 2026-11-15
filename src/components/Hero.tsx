import React from 'react';
import { Sparkles, Images, Layers, ArrowRight, Aperture, Compass } from 'lucide-react';

interface HeroProps {
  onOpenGallery: () => void;
  onScrollToBuilder: () => void;
  onScrollToDictionary: () => void;
  onExploreGuide?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenGallery,
  onScrollToBuilder,
  onScrollToDictionary,
  onExploreGuide,
}) => {
  return (
    <section className="relative w-full min-h-[84vh] sm:min-h-[88vh] flex items-end overflow-hidden bg-[#101014] border-b border-[#26262E]">
      {/* Full-Screen Background Studio Image */}
      <img
        src="/images/hero_cinematic_studio_1794436191894.jpg"
        alt="Plató cinematográfico y laboratorio de fotografía e inteligencia artificial Núcleo Colectivo"
        className="absolute inset-0 w-full h-full object-cover object-center scale-102"
        referrerPolicy="no-referrer"
      />

      {/* Atmospheric Multi-Stop Scrim for Crisp WCAG Contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/78 to-[#101014]/35 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#101014]/90 via-[#101014]/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10 sm:pb-12 space-y-10">
        <div className="max-w-3xl space-y-5">
          {/* Unboxed Architectural Eyebrow */}
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#F8C300] font-mono-code font-bold">
            <span>NÚCLEO COLECTIVO</span>
            <span aria-hidden="true" className="text-[#787670]">·</span>
            <span>VISUAL PROMPT LAB</span>
            <span aria-hidden="true" className="text-[#787670]">·</span>
            <span>ARTE + TECNOLOGÍA + IA</span>
          </div>

          {/* Editorial Manifesto Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F2ED] font-display-sans leading-[1.06] text-balance">
            Las ideas también tienen{' '}
            <span className="font-serif-title italic font-semibold text-[#F8C300]">
              un lenguaje visual
            </span>
          </h1>

          {/* Clear Explanatory Lead */}
          <p className="text-base sm:text-lg text-[#D8D5CD] leading-relaxed max-w-2xl font-normal">
            Descubre, comprende, construye y transforma prompts para fotografía, cinematografía y arte digital con inteligencia artificial. Explora la galería curada en 8 colecciones, experimenta en el constructor de 12 módulos y practica en 31 aplicaciones reales sin configurar claves API.
          </p>

          {/* Primary Actions (Focal Anchor: Galería Visual #1) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenGallery}
              className="px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] active:scale-95 rounded-lg transition-all flex items-center gap-2 shadow-md whitespace-nowrap shrink-0"
            >
              <Images className="w-4 h-4" />
              <span>Explorar Galería Visual</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onScrollToBuilder}
              className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#F4F2ED] bg-[#18181F]/85 hover:bg-[#326BFF] border border-white/25 hover:border-[#326BFF] backdrop-blur-sm rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#F8C300]" />
              <span>Constructor (12 Módulos)</span>
            </button>

            <button
              type="button"
              onClick={onScrollToDictionary}
              className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#D8D5CD] hover:text-[#F4F2ED] bg-[#101014]/70 hover:bg-[#18181F] border border-white/15 backdrop-blur-sm rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Layers className="w-4 h-4 text-[#7545D6]" />
              <span>Biblioteca (26 Módulos)</span>
            </button>

            {onExploreGuide && (
              <button
                type="button"
                onClick={onExploreGuide}
                className="px-3.5 py-3 text-xs font-mono-code uppercase tracking-wider text-[#F8C300] hover:text-[#F4F2ED] flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Compass className="w-4 h-4" />
                <span>Mapa del laboratorio</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Architectural Metrics & Studio Spec Bar */}
        <div className="pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-[#D8D5CD]">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-[#F8C300] tabular-nums">
              8 Colecciones
            </span>
            <span className="text-xs text-[#F4F2ED] uppercase tracking-wider mt-1 font-semibold">
              Galería Experimental
            </span>
            <span className="text-[11px] text-[#A09E97] mt-0.5">
              Retrato, paisaje, producto, cine, moda y video
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-[#F4F2ED] tabular-nums">
              26 Módulos
            </span>
            <span className="text-xs text-[#F4F2ED] uppercase tracking-wider mt-1 font-semibold">
              130 Fichas Técnicas
            </span>
            <span className="text-[11px] text-[#A09E97] mt-0.5">
              Óptica, luz, storytelling, 3D, sonido y ética
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-[#F4F2ED] tabular-nums">
              6 Labs + JSON
            </span>
            <span className="text-xs text-[#F4F2ED] uppercase tracking-wider mt-1 font-semibold">
              Simuladores & Constructor
            </span>
            <span className="text-[11px] text-[#A09E97] mt-0.5">
              Luz, cámara, color, storyboard y 12 módulos
            </span>
          </div>

          <div className="flex flex-col justify-between p-3.5 rounded-lg bg-[#101014]/80 backdrop-blur-md border border-white/15">
            <div className="flex items-center justify-between text-[10px] font-mono-code text-[#F8C300] font-bold">
              <span className="flex items-center gap-1">
                <Aperture className="w-3 h-3" />
                <span>REFERENCIA DE ESTUDIO</span>
              </span>
              <span className="text-[#A09E97]">31 APPS IA</span>
            </div>
            <p className="text-[11px] text-[#D8D5CD] font-mono-code mt-1 leading-snug">
              ARRI Alexa 35 · Cooke 40mm T2.3 · Luz Rembrandt · Kodak 2383
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
