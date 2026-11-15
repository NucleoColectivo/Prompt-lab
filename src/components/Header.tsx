import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Menu, X, Search, Bookmark } from 'lucide-react';
import type { AppSectionId } from '../types/navigation';

interface HeaderProps {
  activeSection: AppSectionId;
  onNavigateSection: (section: AppSectionId, subTab?: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenGlobalSearch: () => void;
  favoritesCount: number;
}

const DESKTOP_NAV_ITEMS: { id: AppSectionId; label: string; href: string }[] = [
  { id: 'home', label: 'Inicio', href: '#inicio' },
  { id: 'galeria', label: 'Galería', href: '#galeria' },
  { id: 'biblioteca', label: 'Biblioteca', href: '#biblioteca' },
  { id: 'laboratorios', label: 'Laboratorios', href: '#laboratorios' },
  { id: 'film-director', label: 'Planificador', href: '#film-director' },
  { id: 'academia', label: 'Apps IA', href: '#herramientas-academia' },
  { id: 'etica-ia', label: 'Ética IA', href: '#etica-ia' },
  { id: 'movies-ia', label: 'Cine IA', href: '#movies-ia' },
  { id: 'recursos', label: 'Recursos', href: '#recetas' },
];

const MOBILE_NAV_ITEMS: { id: AppSectionId; label: string; subtitle: string; href: string }[] = [
  {
    id: 'home',
    label: 'Inicio · Qué encuentras en la plataforma',
    subtitle: 'Portada editorial, 8 colecciones y mapa general',
    href: '#inicio',
  },
  {
    id: 'galeria',
    label: 'Galería Visual Experimental (8 Colecciones)',
    subtitle: 'Retrato, Paisaje, Producto, Arte Digital, Moda, Cine, Macro y Video',
    href: '#galeria',
  },
  {
    id: 'fundamentos',
    label: '00 · Fundamentos & Qué es un Prompt',
    subtitle: 'Fórmula de 7 elementos, imagen vs video y reto 15 min',
    href: '#fundamentos',
  },
  {
    id: 'biblioteca',
    label: '01–26 · Biblioteca Visual y Técnica',
    subtitle: 'Fotografía, cine, óptica, narrativa, 3D y ética',
    href: '#biblioteca',
  },
  {
    id: 'laboratorios',
    label: 'Laboratorios Creativos (7 Estudios)',
    subtitle: 'Mi Primera Imagen, Dibujo a Imagen, Restauración, Producto, Web IA, Simuladores y JSON',
    href: '#laboratorios',
  },
  {
    id: 'film-director',
    label: 'Planificador Audiovisual (8 Etapas)',
    subtitle: 'Concepto, guion, escenas, sonido y montaje',
    href: '#film-director',
  },
  {
    id: 'builder',
    label: 'Constructor de Prompts (12 Módulos)',
    subtitle: 'Arma prompts, exporta PDF/PNG y practica en apps IA',
    href: '#builder',
  },
  {
    id: 'favoritos',
    label: 'Favoritos y Colecciones Guardadas',
    subtitle: 'Prompts, fichas y parámetros guardados localmente',
    href: '#favoritos',
  },
  {
    id: 'academia',
    label: 'Apps IA (31), Retos & Glosario ES–EN',
    subtitle: 'Google AI Studio, Gemini, Claude, CapCut, Lovable, Bolt...',
    href: '#herramientas-academia',
  },
  {
    id: 'etica-ia',
    label: 'Ética IA · Sesgos, Dilemas & Videoteca',
    subtitle: 'Laboratorio de sesgos, dilemas morales (MIT) y 20 charlas críticas',
    href: '#etica-ia',
  },
  {
    id: 'movies-ia',
    label: 'Documentales & Películas IA · Cine Club',
    subtitle: '31 documentales/debates + 20 películas esenciales de ciencia ficción IA',
    href: '#movies-ia',
  },
  {
    id: 'recursos',
    label: 'Recetas, Comandos & Plantillas',
    subtitle: 'Fórmulas rápidas y estructuras universales',
    href: '#recetas',
  },
];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigateSection,
  isDarkMode,
  onToggleTheme,
  onOpenGlobalSearch,
  favoritesCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelect = (id: AppSectionId) => {
    onNavigateSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F4F2ED]/95 dark:bg-[#101014]/95 border-b border-[#DEDAD0] dark:border-[#26262E] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 xl:gap-6 px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Zone 1: Single-line Brand Wordmark (compact on narrow mobile) */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('home');
          }}
          className="text-xs sm:text-base font-extrabold tracking-tight text-[#101014] dark:text-[#F4F2ED] hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors whitespace-nowrap shrink-0 min-w-0"
        >
          <span className="xl:hidden">NÚCLEO LAB</span>
          <span className="hidden xl:inline">NÚCLEO COLECTIVO · PROMPT LAB</span>
        </a>

        {/* Zone 2: Desktop Single-Line Navigation */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-2.5 xl:gap-4 text-[11px] uppercase tracking-wider font-semibold text-[#4A4A55] dark:text-[#B4B2AC]"
        >
          {DESKTOP_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#F8C300] text-[#101014] dark:text-[#F8C300] font-bold'
                    : 'border-transparent hover:text-[#101014] dark:hover:text-[#F4F2ED]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Global Search, Favorites, Theme Toggle & Builder CTA */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center gap-1.5 text-[#3F3F48] dark:text-[#C8C6BF] hover:text-[#101014] dark:hover:text-[#F8C300] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Buscar en galería, módulos y comandos"
            aria-label="Abrir buscador global"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline text-xs font-semibold">Buscar</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('favoritos')}
            className={`px-2 sm:px-2.5 py-2 min-h-[40px] min-w-[40px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'favoritos'
                ? 'bg-[#7545D6] text-white'
                : 'text-[#3F3F48] dark:text-[#C8C6BF] hover:text-[#7545D6] dark:hover:text-[#F8C300] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Ver prompts y colecciones guardadas"
            aria-label={`Favoritos (${favoritesCount} guardados)`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline font-mono-code tabular-nums">
              {favoritesCount}
            </span>
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
            onClick={() => handleSelect('builder')}
            className={`px-3 sm:px-4 py-2 min-h-[40px] text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeSection === 'builder'
                ? 'bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014]'
                : 'bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] active:scale-95'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Constructor</span>
            <span className="sm:hidden">Crear</span>
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

      {/* Responsive Mobile & Tablet Navigation Drawer */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Menú de secciones móvil"
          className="lg:hidden border-t border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] px-4 py-3 space-y-1.5 max-h-[80vh] overflow-y-auto shadow-lg"
        >
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`block w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-[#F8C300]/20 border-[#F8C300] text-[#101014] dark:text-[#F8C300]'
                    : 'bg-white dark:bg-[#18181F] border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF]'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider">{item.label}</div>
                <div className="text-[11px] text-[#5B5B66] dark:text-[#A09E97] mt-0.5">
                  {item.subtitle}
                </div>
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
};
