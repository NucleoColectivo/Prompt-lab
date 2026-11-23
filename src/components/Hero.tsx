import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Images, ArrowRight } from 'lucide-react';
import { PLATFORM_METRICS } from '../data/platformMetrics';
import { EDITORIAL_EASE } from './MotionPrimitives';

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
    <section className="relative w-full min-h-[76vh] flex flex-col justify-between overflow-hidden bg-[#101014] border-b border-[#26262E]">
      {/* Full-Bleed Editorial Studio Backdrop with gentle settling zoom */}
      <motion.img
        src="/images/hero_cinematic_studio_1794436191894.jpg"
        alt="Estudio de dirección de arte, fotografía y cine experimental de Núcleo Colectivo"
        className="absolute inset-0 w-full h-full object-cover object-center"
        referrerPolicy="no-referrer"
        initial={{ scale: 1.07, opacity: 0.72 }}
        animate={{ scale: 1.01, opacity: 1 }}
        transition={{ duration: 1.4, ease: EDITORIAL_EASE }}
      />

      {/* Measured Contrast Scrims (WCAG AA while preserving studio depth & camera silhouette) */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/72 to-[#101014]/45 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#101014]/92 via-[#101014]/60 to-[#101014]/35 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Architectural Masthead: Official Núcleo Colectivo Logo + Editorial Context */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-7 sm:pt-9">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5"
        >
          <a
            href="https://www.nucleocolectivo.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar sitio oficial de Núcleo Colectivo"
            title="www.nucleocolectivo.com"
            className="inline-block self-start opacity-95 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
          >
            <img
              src="/images/logo_nc.png"
              alt="Núcleo Colectivo"
              referrerPolicy="no-referrer"
              className="h-10 sm:h-12 w-auto object-contain object-left"
            />
          </a>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-[#D8D5CD] sm:text-right">
            <span>Arte</span>
            <span aria-hidden="true" className="text-[#F8C300]">·</span>
            <span>Diseño</span>
            <span aria-hidden="true" className="text-[#326BFF]">·</span>
            <span>Inteligencia Artificial</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.75, delay: 0.1, ease: EDITORIAL_EASE }}
          className="h-px w-full bg-white/15 origin-left"
          aria-hidden="true"
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: EDITORIAL_EASE }}
          className="pt-3.5 text-xs sm:text-sm font-mono-code text-[#D8D5CD] tracking-wide"
        >
          Laboratorio creativo de dirección de arte y narrativa generativa
        </motion.p>
      </div>

      {/* Main 12-Column Asymmetric Editorial Spread */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left Column (7 cols): Monumental Platform Title with masked line reveal */}
          <div className="lg:col-span-7 space-y-5">
            <h1 className="font-display-sans font-extrabold tracking-[-0.035em] leading-[0.94] text-[54px] sm:text-[72px] lg:text-[84px] xl:text-[94px] text-[#F4F2ED]">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.14, ease: EDITORIAL_EASE }}
                >
                  Visual
                </motion.span>
              </span>
              <span className="block overflow-hidden mt-1">
                <motion.span
                  className="block text-[#F8C300] sm:whitespace-nowrap"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.68, delay: 0.24, ease: EDITORIAL_EASE }}
                >
                  Prompt Lab
                </motion.span>
              </span>
            </h1>

            {/* Tri-Color Editorial Brand Signature Bar */}
            <div className="flex items-center gap-2 pt-1" aria-hidden="true">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.45, delay: 0.36, ease: EDITORIAL_EASE }}
                className="h-1 w-14 bg-[#F8C300] origin-left"
              />
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.45, delay: 0.44, ease: EDITORIAL_EASE }}
                className="h-1 w-14 bg-[#326BFF] origin-left"
              />
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.45, delay: 0.52, ease: EDITORIAL_EASE }}
                className="h-1 w-14 bg-[#7545D6] origin-left"
              />
            </div>
          </div>

          {/* Right Column (5 cols): Editorial Manifesto, Lead & Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: EDITORIAL_EASE }}
            className="lg:col-span-5 space-y-5 lg:pb-1"
          >
            <p className="font-serif-title italic text-2xl sm:text-[28px] leading-[1.22] text-[#F4F2ED] text-balance">
              Las ideas también tienen{' '}
              <span className="text-[#F8C300]">un lenguaje visual</span>.
            </p>

            <p className="text-sm sm:text-[15px] text-[#D8D5CD] leading-relaxed">
              Explora referentes curados con prompts reales, construye escenas por disciplina y practica en laboratorios de fotografía, cine, diseño gráfico, audio y arte experimental.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenGallery}
                className="group px-5 py-3 min-h-[44px] text-sm font-bold text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] hover:-translate-y-0.5 active:scale-[0.98] rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Images className="w-4 h-4" />
                <span>Explorar Galería</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={onScrollToBuilder}
                className="px-5 py-3 min-h-[44px] text-sm font-semibold text-[#F4F2ED] bg-[#101014]/75 hover:bg-white/15 hover:-translate-y-0.5 active:scale-[0.98] border border-white/25 backdrop-blur-sm rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F8C300]" />
                <span>Constructor Modular</span>
              </button>

              {onExploreGuide && (
                <button
                  type="button"
                  onClick={onExploreGuide}
                  className="px-2 py-2.5 min-h-[44px] text-xs font-mono-code text-[#D8D5CD] hover:text-[#F8C300] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Ver los 3 caminos ↓
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Catalog Quantitative Index Strip */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.36 },
            },
          }}
          className="pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-y-5 md:gap-y-0 md:divide-x md:divide-white/15 text-[#D8D5CD]"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EDITORIAL_EASE } },
            }}
            className="pr-4 md:pr-6"
          >
            <div className="text-[10px] font-mono-code text-[#A09E97] mb-1">01 · Galería</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F8C300] tabular-nums">
              {PLATFORM_METRICS.galleryPlates} láminas
            </div>
            <div className="text-xs text-[#D8D5CD] mt-0.5">
              Curadas en {PLATFORM_METRICS.galleryCollections} colecciones
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EDITORIAL_EASE } },
            }}
            className="pr-4 md:px-6"
          >
            <div className="text-[10px] font-mono-code text-[#A09E97] mb-1">02 · Creación</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F4F2ED] tabular-nums">
              {PLATFORM_METRICS.disciplines} disciplinas
            </div>
            <div className="text-xs text-[#D8D5CD] mt-0.5">
              Constructor y {PLATFORM_METRICS.labsCount} laboratorios
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EDITORIAL_EASE } },
            }}
            className="pr-4 md:px-6"
          >
            <div className="text-[10px] font-mono-code text-[#A09E97] mb-1">03 · Biblioteca</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F4F2ED] tabular-nums">
              {PLATFORM_METRICS.modules} módulos
            </div>
            <div className="text-xs text-[#D8D5CD] mt-0.5">
              {PLATFORM_METRICS.fichas} fichas y {PLATFORM_METRICS.tutorials} tutoriales
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EDITORIAL_EASE } },
            }}
            className="md:pl-6"
          >
            <div className="text-[10px] font-mono-code text-[#A09E97] mb-1">04 · Ecosistema</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F4F2ED] tabular-nums">
              {PLATFORM_METRICS.aiTools} apps IA
            </div>
            <div className="text-xs text-[#D8D5CD] mt-0.5">
              {PLATFORM_METRICS.experiences} experiencias y retos gratis
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
