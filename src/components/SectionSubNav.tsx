import React from 'react';
import {
  Sparkles,
  Sliders,
  Clapperboard,
  Layers,
  BookOpen,
  Compass,
  PlayCircle,
  Wrench,
  Scale,
  Film,
  FlaskConical,
  Palette,
  Sun,
} from 'lucide-react';
import type {
  AppSectionId,
  LabSubSection,
  PrimaryNavAxis,
  ResourceSubSection,
} from '../types/navigation';
import { PLATFORM_METRICS } from '../data/platformMetrics';

interface SectionSubNavProps {
  axis: PrimaryNavAxis;
  activeSection: AppSectionId;
  activeLabSub?: LabSubSection;
  activeResourceSub: ResourceSubSection;
  onNavigateSection: (section: AppSectionId, subTab?: string) => void;
}

interface SubNavItem {
  id: string;
  label: string;
  section: AppSectionId;
  subTab?: string;
  icon: React.ReactNode;
  isActive: (sec: AppSectionId, resSub: ResourceSubSection, labSub?: LabSubSection) => boolean;
}

const SUBNAV_CONFIG: Partial<Record<PrimaryNavAxis, { axisLabel: string; items: SubNavItem[] }>> = {
  crear: {
    axisLabel: 'Estudio de creación',
    items: [
      {
        id: 'builder',
        label: 'Constructor Modular',
        section: 'builder',
        icon: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'builder',
      },
      {
        id: 'moodboard',
        label: 'Moodboard Builder',
        section: 'laboratorios',
        subTab: 'moodboard',
        icon: <Palette className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec, _res, lab) => sec === 'laboratorios' && lab === 'moodboard',
      },
      {
        id: 'iluminacion',
        label: 'Simulador de Luz',
        section: 'laboratorios',
        subTab: 'iluminacion',
        icon: <Sun className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec, _res, lab) => sec === 'laboratorios' && lab === 'iluminacion',
      },
      {
        id: 'laboratorios',
        label: `Laboratorios (${PLATFORM_METRICS.labsCount})`,
        section: 'laboratorios',
        subTab: 'labs',
        icon: <Sliders className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec, _res, lab) =>
          sec === 'laboratorios' && lab !== 'moodboard' && lab !== 'iluminacion',
      },
      {
        id: 'film-director',
        label: 'Planificador Audiovisual',
        section: 'film-director',
        icon: <Clapperboard className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'film-director',
      },
    ],
  },
  biblioteca: {
    axisLabel: 'Biblioteca y archivo',
    items: [
      {
        id: 'biblioteca',
        label: '26 Módulos Visuales',
        section: 'biblioteca',
        icon: <Layers className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'biblioteca',
      },
      {
        id: 'recursos',
        label: 'Recursos, Recetas y Guías',
        section: 'recursos',
        subTab: 'recetas',
        icon: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec, resSub) => sec === 'recursos' && resSub !== 'tutoriales',
      },
      {
        id: 'fundamentos',
        label: 'Fundamentos (Módulo 00)',
        section: 'fundamentos',
        icon: <Compass className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'fundamentos',
      },
    ],
  },
  explorar: {
    axisLabel: 'Aprendizaje y cultura IA',
    items: [
      {
        id: 'experiencias',
        label: 'Experiencias y Retos (26)',
        section: 'experiencias',
        icon: <FlaskConical className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'experiencias',
      },
      {
        id: 'tutoriales',
        label: 'Tutoriales en Video (12)',
        section: 'recursos',
        subTab: 'tutoriales',
        icon: <PlayCircle className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec, resSub) => sec === 'recursos' && resSub === 'tutoriales',
      },
      {
        id: 'academia',
        label: 'Apps IA y Glosario',
        section: 'academia',
        subTab: 'tools',
        icon: <Wrench className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'academia',
      },
      {
        id: 'etica-ia',
        label: 'Ética IA',
        section: 'etica-ia',
        icon: <Scale className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'etica-ia',
      },
      {
        id: 'movies-ia',
        label: 'Cine y Documentales IA',
        section: 'movies-ia',
        icon: <Film className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'movies-ia',
      },
    ],
  },
  'etica-ia': {
    axisLabel: 'Cultura crítica y audiovisual',
    items: [
      {
        id: 'etica-ia',
        label: 'Ética IA · Sesgos y Dilemas',
        section: 'etica-ia',
        icon: <Scale className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'etica-ia',
      },
      {
        id: 'movies-ia',
        label: 'Cine y Documentales IA',
        section: 'movies-ia',
        icon: <Film className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'movies-ia',
      },
      {
        id: 'experiencias',
        label: 'Experiencias y Retos (26)',
        section: 'experiencias',
        icon: <FlaskConical className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'experiencias',
      },
    ],
  },
  'movies-ia': {
    axisLabel: 'Cultura crítica y audiovisual',
    items: [
      {
        id: 'movies-ia',
        label: 'Cine y Documentales IA',
        section: 'movies-ia',
        icon: <Film className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'movies-ia',
      },
      {
        id: 'etica-ia',
        label: 'Ética IA · Sesgos y Dilemas',
        section: 'etica-ia',
        icon: <Scale className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'etica-ia',
      },
      {
        id: 'film-director',
        label: 'Planificador Audiovisual',
        section: 'film-director',
        icon: <Clapperboard className="w-3.5 h-3.5 shrink-0" />,
        isActive: (sec) => sec === 'film-director',
      },
    ],
  },
};

export const SectionSubNav: React.FC<SectionSubNavProps> = ({
  axis,
  activeSection,
  activeLabSub,
  activeResourceSub,
  onNavigateSection,
}) => {
  const config = SUBNAV_CONFIG[axis];
  if (!config) return null;

  return (
    <div className="bg-[#EFECE5] dark:bg-[#14141A] border-b border-[#DEDAD0] dark:border-[#26262E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <span className="text-xs font-medium text-[#5B5B66] dark:text-[#A09E97] whitespace-nowrap shrink-0">
          {config.axisLabel}
        </span>

        <nav
          aria-label={`Subsecciones de ${config.axisLabel}`}
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0"
        >
          {config.items.map((item) => {
            const active = item.isActive(activeSection, activeResourceSub, activeLabSub);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateSection(item.section, item.subTab)}
                aria-current={active ? 'page' : undefined}
                className={`px-3 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] font-bold shadow-xs'
                    : 'text-[#4A4A55] dark:text-[#B4B2AC] hover:text-[#101014] dark:hover:text-[#F4F2ED] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
