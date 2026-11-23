import React from 'react';
import { Sparkles, Images, ArrowRight } from 'lucide-react';
import { PLATFORM_METRICS } from '../data/platformMetrics';

interface HeroProps {
  onOpenGallery: () => void;
  onScrollToBuilder: () => void;
  onScrollToDictionary: () => void;
  onExploreGuide?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenGallery,
  onScrollToBuilder,
  onExploreGuide,
}) => {
  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[78vh] flex items-end overflow-hidden bg-[#101014] border-b border-[#26262E]">
      {/* Full-Bleed Editorial Studio Backdrop */}
      <img
        src="/images/hero_cinematic_studio_1794436191894.jpg"
        alt="Estudio de dirección de arte, fotografía y cine experimental de Núcleo Colectivo"
        className="absolute inset-0 w-full h-full object-cover object-center"
        referrerPolicy="no-referrer"
      />

      {/* Measured Contrast Scrims (WCAG AA) */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/75 to-[#101014]/35 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#101014]/92 via-[#101014]/55 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-12 space-y-10">
        <div className="max-w-3xl space-y-5">
          {/* Clean Unboxed Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-[#F8C300]">
            <span>Núcleo Colectivo</span>
            <span aria-hidden="true" className="text-[#787670]">·</span>
            <span>Visual Prompt Lab</span>
            <span aria-hidden="true" className="text-[#787670]">·</span>
            <span className="text-[#D8D5CD]">Arte, diseño e inteligencia artificial</span>
          </div>

          {/* Editorial Manifesto Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F2ED] font-display-sans leading-[1.08] text-balance">
            Las ideas también tienen{' '}
            <span className="font-serif-title italic font-semibold text-[#F8C300]">
              un lenguaje visual
            </span>
          </h1>

          {/* Concise Explanatory Lead */}
          <p className="text-sm sm:text-lg text-[#D8D5CD] leading-relaxed max-w-2xl">
            Explora referentes visuales con prompts reales, construye escenas por disciplina y aprende haciendo en laboratorios de fotografía, cine, diseño gráfico y arte experimental.
          </p>

          {/* Focal Primary CTA + Single Secondary Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onOpenGallery}
              className="px-6 py-3 min-h-[44px] text-sm font-bold text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] active:scale-[0.98] rounded-lg transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Images className="w-4 h-4" />
              <span>Explorar Galería Visual</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onScrollToBuilder}
              className="px-6 py-3 min-h-[44px] text-sm font-semibold text-[#F4F2ED] bg-[#18181F]/80 hover:bg-white/15 border border-white/25 backdrop-blur-sm rounded-lg transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#F8C300]" />
              <span>Abrir Constructor Modular</span>
            </button>

            {onExploreGuide && (
              <button
                type="button"
                onClick={onExploreGuide}
                className="px-3 py-2.5 min-h-[44px] text-xs font-medium text-[#D8D5CD] hover:text-[#F8C300] transition-colors whitespace-nowrap shrink-0"
              >
                Ver los 3 caminos ↓
              </button>
            )}
          </div>
        </div>

        {/* Clean 4-Column Quantitative Strip */}
        <div className="pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-[#D8D5CD]">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F8C300] tabular-nums">
              {PLATFORM_METRICS.galleryPlates} láminas
            </div>
            <div className="text-xs text-[#F4F2ED] font-medium mt-0.5">
              Galería en {PLATFORM_METRICS.galleryCollections} colecciones
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F4F2ED] tabular-nums">
              {PLATFORM_METRICS.disciplines} disciplinas
            </div>
            <div className="text-xs text-[#F4F2ED] font-medium mt-0.5">
              Constructor y {PLATFORM_METRICS.labsCount} laboratorios
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F4F2ED] tabular-nums">
              {PLATFORM_METRICS.modules} módulos
            </div>
            <div className="text-xs text-[#F4F2ED] font-medium mt-0.5">
              {PLATFORM_METRICS.fichas} fichas + {PLATFORM_METRICS.tutorials} tutoriales
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F4F2ED] tabular-nums">
              {PLATFORM_METRICS.experiences} experiencias
            </div>
            <div className="text-xs text-[#F4F2ED] font-medium mt-0.5">
              Ejercicios guiados y retos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
