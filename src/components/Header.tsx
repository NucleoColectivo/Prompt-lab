import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Search } from 'lucide-react';
import {
  getPrimaryAxisForSection,
  type AppSectionId,
  type PrimaryNavAxis,
  type ResourceSubSection,
} from '../types/navigation';
import { PLATFORM_METRICS } from '../data/platformMetrics';

interface HeaderProps {
  activeSection: AppSectionId;
  activeResourceSub?: ResourceSubSection;
  onNavigateSection: (section: AppSectionId, subTab?: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenGlobalSearch: () => void;
  favoritesCount: number;
}

const PRIMARY_NAV_ITEMS: {
  axis: PrimaryNavAxis;
  label: string;
  targetSection: AppSectionId;
  subTab?: string;
  href: string;
}[] = [
  { axis: 'home', label: 'Inicio', targetSection: 'home', href: '#inicio' },
  { axis: 'galeria', label: 'Galería', targetSection: 'galeria', href: '#galeria' },
  { axis: 'crear', label: 'Crear', targetSection: 'builder', href: '#builder' },
  { axis: 'biblioteca', label: 'Biblioteca', targetSection: 'biblioteca', href: '#biblioteca' },
  { axis: 'explorar', label: 'Explorar', targetSection: 'experiencias', href: '#experiencias' },
  { axis: 'etica-ia', label: 'Ética IA', targetSection: 'etica-ia', href: '#etica-ia' },
  { axis: 'movies-ia', label: 'Cine y Docs', targetSection: 'movies-ia', href: '#movies-ia' },
  { axis: 'favoritos', label: 'Mis proyectos', targetSection: 'favoritos', href: '#favoritos' },
];

const MOBILE_AXIS_GROUPS: {
  axis: PrimaryNavAxis;
  heading: string;
  items: { section: AppSectionId; subTab?: string; label: string; subtitle: string; href: string }[];
}[] = [
  {
    axis: 'home',
    heading: '01 · Portada e Inspiración',
    items: [
      {
        section: 'home',
        label: 'Inicio',
        subtitle: 'Tres caminos claros: Crear, Explorar y Aprender',
        href: '#inicio',
      },
      {
        section: 'galeria',
        label: `Galería Visual (${PLATFORM_METRICS.galleryPlates} láminas)`,
        subtitle: `${PLATFORM_METRICS.galleryCollections} colecciones, Recrear esta imagen y 5 caminos`,
        href: '#galeria',
      },
    ],
  },
  {
    axis: 'crear',
    heading: '02 · Crear',
    items: [
      {
        section: 'builder',
        label: `Constructor Modular (${PLATFORM_METRICS.disciplines} disciplinas)`,
        subtitle: 'Fotografía, cine, diseño gráfico, branding, ilustración, web y 3D',
        href: '#builder',
      },
      {
        section: 'laboratorios',
        subTab: 'moodboard',
        label: 'Moodboard Builder',
        subtitle: 'Tableros de dirección de arte, paletas cromáticas y prompt directo',
        href: '#moodboard',
      },
      {
        section: 'laboratorios',
        subTab: 'iluminacion',
        label: 'Simulador de Iluminación',
        subtitle: '9 parámetros de luz, diagrama cenital y prompt técnico',
        href: '#iluminacion',
      },
      {
        section: 'laboratorios',
        subTab: 'labs',
        label: `Laboratorios y Estudios (${PLATFORM_METRICS.labsCount})`,
        subtitle: 'Primera imagen, dibujo, restauración, producto, web, videoarte y JSON',
        href: '#laboratorios',
      },
      {
        section: 'film-director',
        label: 'Planificador Audiovisual',
        subtitle: 'Producción en 8 etapas y puente a Storyboard',
        href: '#film-director',
      },
    ],
  },
  {
    axis: 'etica-ia',
    heading: '03 · Cultura Crítica y Audiovisual',
    items: [
      {
        section: 'etica-ia',
        label: 'Ética IA · Sesgos, Dilemas y Videoteca',
        subtitle: `${PLATFORM_METRICS.ethicsSimulators} simuladores, detector de imágenes IA y ${PLATFORM_METRICS.ethicsTalks} charlas críticas`,
        href: '#etica-ia',
      },
      {
        section: 'movies-ia',
        label: 'Cine y Documentales IA · Cine Club',
        subtitle: `${PLATFORM_METRICS.documentaries} documentales y debates + ${PLATFORM_METRICS.fictionMovies} películas esenciales sobre IA`,
        href: '#movies-ia',
      },
    ],
  },
  {
    axis: 'biblioteca',
    heading: '04 · Biblioteca',
    items: [
      {
        section: 'biblioteca',
        label: `Biblioteca Visual (${PLATFORM_METRICS.modules} Módulos)`,
        subtitle: `${PLATFORM_METRICS.fichas} fichas técnicas con óptica, luz, narrativa y estilo`,
        href: '#biblioteca',
      },
      {
        section: 'recursos',
        subTab: 'recetas',
        label: 'Recursos, Recetas y Guías',
        subtitle: `${PLATFORM_METRICS.recipes} recetas maestras, diccionario, plantillas, ejercicios y negativos`,
        href: '#recetas',
      },
      {
        section: 'fundamentos',
        label: 'Fundamentos (Módulo 00)',
        subtitle: 'Qué es un prompt y fórmula de 7 elementos',
        href: '#fundamentos',
      },
    ],
  },
  {
    axis: 'explorar',
    heading: '05 · Explorar y Aprender',
    items: [
      {
        section: 'experiencias',
        label: `Experiencias Guiadas y Retos (${PLATFORM_METRICS.experiences})`,
        subtitle: `${PLATFORM_METRICS.experienceDisciplines} disciplinas A–F, ${PLATFORM_METRICS.expressChallenges} Retos Express y Reto Aleatorio`,
        href: '#experiencias',
      },
      {
        section: 'recursos',
        subTab: 'tutoriales',
        label: `Tutoriales Paso a Paso (${PLATFORM_METRICS.tutorials} videos)`,
        subtitle: 'Guías prácticas de Gemini, AI Studio, Midjourney, Runway y ChatGPT',
        href: '#tutoriales',
      },
      {
        section: 'academia',
        subTab: 'tools',
        label: 'Apps IA (48) y Glosario',
        subtitle: 'Apps gratis de imagen, video, audio, música, podcast y glosario ES–EN',
        href: '#herramientas-academia',
      },
    ],
  },
  {
    axis: 'favoritos',
    heading: '06 · Espacio Personal',
    items: [
      {
        section: 'favoritos',
        label: 'Mis proyectos y Bitácora Creativa',
        subtitle: 'Bitácora de procesos, moodboards, prompts, láminas y exportaciones',
        href: '#favoritos',
      },
    ],
  },
];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  activeResourceSub,
  onNavigateSection,
  isDarkMode,
  onToggleTheme,
  onOpenGlobalSearch,
  favoritesCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeAxis = getPrimaryAxisForSection(activeSection, activeResourceSub);

  const handleSelect = (id: AppSectionId, subTab?: string) => {
    onNavigateSection(id, subTab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F4F2ED]/95 dark:bg-[#101014]/95 border-b border-[#DEDAD0] dark:border-[#26262E] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 lg:gap-5 px-4 sm:px-6 py-3">
        {/* Zone 1: Clean single-line Brand Wordmark */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('home');
          }}
          className="text-sm sm:text-base font-extrabold tracking-tight text-[#101014] dark:text-[#F4F2ED] hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors whitespace-nowrap shrink-0"
        >
          <span className="xl:hidden">Núcleo Lab</span>
          <span className="hidden xl:inline">Núcleo Colectivo</span>
        </a>

        {/* Zone 2: Clean Single-Line Editorial Navigation (with Direct Ética IA & Cine y Docs) */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] font-medium text-[#4A4A55] dark:text-[#B4B2AC]"
        >
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = activeAxis === item.axis;
            return (
              <a
                key={item.axis}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.targetSection, item.subTab);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'border-[#F8C300] text-[#101014] dark:text-[#F4F2ED] font-semibold'
                    : 'border-transparent hover:text-[#101014] dark:hover:text-[#F4F2ED]'
                }`}
              >
                <span>{item.label}</span>
                {item.axis === 'favoritos' && favoritesCount > 0 && (
                  <span className="text-[11px] font-mono-code tabular-nums text-[#7545D6] dark:text-[#F8C300]">
                    ({favoritesCount})
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Focused Utility Controls (Search + Theme + Mobile Drawer Trigger) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            className="px-3 py-2 min-h-[40px] flex items-center justify-center gap-2 text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] bg-white dark:bg-[#18181F] hover:border-[#326BFF] dark:hover:border-[#F8C300] border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Buscar en toda la plataforma (Ctrl+K / ⌘K)"
            aria-label="Abrir buscador global"
          >
            <Search className="w-3.5 h-3.5 text-[#5B5B66] dark:text-[#A09E97]" />
            <span className="hidden sm:inline">Buscar</span>
            <kbd className="hidden xl:inline text-[10px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#3F3F48] dark:text-[#C8C6BF] hover:text-[#101014] dark:hover:text-[#F8C300] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#F8C300]" />
            ) : (
              <Moon className="w-4 h-4 text-[#101014]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] bg-white dark:bg-[#18181F] text-[#101014] dark:text-[#F4F2ED] hover:border-[#F8C300] transition-colors shrink-0"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isMobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Drawer (Grouped by the 6 Axes) */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Menú de secciones móvil"
          className="lg:hidden border-t border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] px-4 py-4 space-y-5 max-h-[82vh] overflow-y-auto shadow-lg"
        >
          {MOBILE_AXIS_GROUPS.map((group) => (
            <div key={group.axis} className="space-y-1.5">
              <div className="px-1 text-[11px] font-mono-code font-semibold text-[#5B5B66] dark:text-[#A09E97]">
                {group.heading}
              </div>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive =
                    activeSection === item.section &&
                    (!item.subTab ||
                      item.section !== 'recursos' ||
                      activeResourceSub === item.subTab);
                  return (
                    <a
                      key={`${item.section}-${item.subTab || 'default'}`}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(item.section, item.subTab);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border transition-colors ${
                        isActive
                          ? 'bg-[#F8C300]/20 border-[#F8C300] text-[#101014] dark:text-[#F8C300]'
                          : 'bg-white dark:bg-[#18181F] border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-bold">
                        <span>{item.label}</span>
                        {item.section === 'favoritos' && favoritesCount > 0 && (
                          <span className="font-mono-code tabular-nums text-[#7545D6] dark:text-[#F8C300]">
                            {favoritesCount}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#5B5B66] dark:text-[#A09E97] mt-0.5">
                        {item.subtitle}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      )}
    </header>
  );
};
