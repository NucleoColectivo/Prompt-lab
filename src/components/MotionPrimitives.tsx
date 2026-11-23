import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

export const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

export const VIEWPORT_CONFIG = {
  once: true,
  amount: 'some' as const,
};

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Editorial masked upward text reveal for headlines, kickers, and lead copy.
 */
export const RevealText: React.FC<RevealTextProps> = ({
  children,
  className = '',
  delay = 0,
  y = 18,
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={VIEWPORT_CONFIG}
    transition={{ duration: 0.55, delay, ease: EDITORIAL_EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Smooth scroll-triggered reveal for full sections, banners, and editorial blocks.
 */
export const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  className = '',
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={VIEWPORT_CONFIG}
    transition={{ duration: 0.6, delay, ease: EDITORIAL_EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}

/**
 * Coordinates staggered entrance choreography for grids of cards, metrics, or links.
 */
export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  className = '',
  stagger = 0.06,
  delayChildren = 0.04,
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={VIEWPORT_CONFIG}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
          delayChildren,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  lift?: boolean;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  lift = false,
  ...rest
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 18 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.48, ease: EDITORIAL_EASE },
      },
    }}
    whileHover={lift ? { y: -4, transition: { duration: 0.18, ease: EDITORIAL_EASE } } : undefined}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

interface SectionTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  className?: string;
}

/**
 * Clean GPU-composited entrance animation whenever switching main sections or sub-tabs.
 */
export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  transitionKey,
  className = '',
}) => (
  <motion.div
    key={transitionKey}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
    className={className}
  >
    {children}
  </motion.div>
);
