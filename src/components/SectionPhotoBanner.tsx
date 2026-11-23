import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ResilientImage } from './ResilientImage';
import { EDITORIAL_EASE } from './MotionPrimitives';

export interface SectionPhotoBannerProps {
  image: string;
  imageAlt: string;
  imagePosition?: 'center' | 'top' | 'bottom';
  kicker: React.ReactNode;
  topRight?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  extraContent?: React.ReactNode;
  accentTint?: 'obsidian' | 'navy' | 'violet' | 'emerald';
  compact?: boolean;
}

const SCRIM_TINTS: Record<NonNullable<SectionPhotoBannerProps['accentTint']>, string> = {
  obsidian: 'from-[#101014] via-[#101014]/78 to-[#101014]/52',
  navy: 'from-[#0D1120] via-[#0F1426]/80 to-[#111524]/52',
  violet: 'from-[#120E1E] via-[#161126]/80 to-[#18132B]/52',
  emerald: 'from-[#0D1716] via-[#101E1C]/80 to-[#112220]/52',
};

const BG_FALLBACKS: Record<NonNullable<SectionPhotoBannerProps['accentTint']>, string> = {
  obsidian: 'bg-[#101014]',
  navy: 'bg-[#111524]',
  violet: 'bg-[#151124]',
  emerald: 'bg-[#0F1B1A]',
};

/**
 * Full-bleed photographic section hero banner matching the signature
 * Núcleo Colectivo "Cine y Documentales" editorial banner pattern.
 * Crossfades cleanly whenever `image` changes (e.g. per module, discipline, or collection).
 */
export const SectionPhotoBanner: React.FC<SectionPhotoBannerProps> = ({
  image,
  imageAlt,
  imagePosition = 'center',
  kicker,
  topRight,
  title,
  subtitle,
  actions,
  extraContent,
  accentTint = 'obsidian',
  compact = false,
}) => {
  return (
    <div
      className={`relative overflow-hidden border-b border-white/10 ${BG_FALLBACKS[accentTint]} text-[#F4F2ED]`}
    >
      {/* Animated Full-Bleed Background Photo */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={image}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 0.42, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
          className="absolute inset-0 pointer-events-none"
        >
          <ResilientImage
            src={image}
            alt={imageAlt}
            objectPosition={imagePosition}
            containerClassName="w-full h-full"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Directional Editorial Scrim for guaranteed WCAG AA contrast */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${SCRIM_TINTS[accentTint]} pointer-events-none`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C10]/80 via-[#0C0C10]/35 to-transparent pointer-events-none" />

      {/* Content Container */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 ${
          compact ? 'py-7 sm:py-10 space-y-4' : 'py-9 sm:py-13 space-y-5'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono-code uppercase tracking-wider text-[#F8C300] font-bold flex flex-wrap items-center gap-2">
            {kicker}
          </div>
          {topRight && <div className="shrink-0">{topRight}</div>}
        </div>

        <div className="space-y-2.5 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display-sans tracking-tight leading-[1.06] text-[#F4F2ED] text-balance">
            {title}
          </h1>
          {subtitle && (
            <div className="text-sm sm:text-base text-[#D8D5CD] leading-relaxed max-w-3xl">
              {subtitle}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {actions}
          </div>
        )}

        {extraContent}
      </div>
    </div>
  );
};
