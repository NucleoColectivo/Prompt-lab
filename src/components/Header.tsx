import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Menu, X } from 'lucide-react';
import type { AppSectionId } from '../types/navigation';

interface HeaderProps {
  activeSection: AppSectionId;
  onNavigateSection: (section: AppSectionId) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const DESKTOP_NAV_ITEMS: { id: AppSectionId; label: string; href: string }[] = [
  { id: 'home', label: 'Inicio', href: '#inicio' },
  { id: 'fundamentos', label: 'Fundamentos', href: '#fundamentos' },
  { id: 'biblioteca', label: 'Biblioteca', href: '#biblioteca' },
  { id: 'laboratorios', label: 'Laboratorios', href: '#laboratorios' },
  { id: 'film-director', label: 'Planificador', href: '#film-director' },
  { id: 'academia', label: 'Apps IA', href: '#herramientas-academia' },
  { id: 'recursos', label: 'Recursos', href: '#recetas' },
];

const MOBILE_NAV_ITEMS: { id: AppSectionId; label: string; subtitle: string; href: string }[] = [
  {
    id: 'home',
    label: 'Inicio · Qué encuentras en la plataforma',
    subtitle: 'Portada, mapa general y guía rápida de uso',
    href: '#inicio',
  },
  {
    id: 'fundamentos',
    label: '00 · Fundamentos & Qué es un Prompt',
    subtitle: 'Fórmula de 7 elementos, imagen vs video y reto 15 min',
    href: '#fundamentos',
  },
  {
    id: 'biblioteca',
    label: '01–26 · Biblioteca Visual',
    subtitle: 'Fotografía, cine, óptica, narrativa, 3D y ética',
    href: '#biblioteca',
  },
  {
    id: 'laboratorios',
    label: 'Laboratorios & JSON Visual',
    subtitle: 'Simuladores de luz, cámara, color y JSON',
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
    label: 'Constructor Maestro de Prompts',
    subtitle: 'Arma prompts, exporta PDF/PNG y practica en apps IA',
    href: '#builder',
  },
  {
    id: 'academia',
    label: 'Apps IA (31), Retos & Glosario ES–EN',
    subtitle: 'Google AI Studio, Gemini, Claude, CapCut, Lovable, Bolt...',
    href: '#herramientas-academia',
  },
  {
    id: 'recursos',
    label: 'Recetas, Comandos (180+) & Plantillas',
    subtitle: 'Fórmulas rápidas y estructuras universales',
    href: '#recetas',
  },
];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigateSection,
  isDarkMode,
  onToggleTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelect = (id: AppSectionId) => {
    onNavigateSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF8F5]/95 dark:bg-stone-950/95 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-6 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('home');
          }}
          className="text-sm sm:text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-none transform rotate-45 shrink-0 inline-block" />
          <span>NÚCLEO COLECTIVO · PROMPT LAB</span>
        </a>

        {/* Zone 2: Desktop Single-Line Navigation */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-4 text-[11px] uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400"
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
                    ? 'border-amber-500 text-stone-950 dark:text-amber-300'
                    : 'border-transparent hover:text-stone-950 dark:hover:text-stone-100'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + Builder CTA + Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 rounded-md transition-colors"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('builder')}
            className={`px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs ${
              activeSection === 'builder'
                ? 'bg-stone-900 dark:bg-amber-300 text-white dark:text-stone-950'
                : 'bg-amber-400 hover:bg-amber-300 text-stone-950 active:scale-95'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Constructor</span>
            <span className="sm:hidden">Crear</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:border-amber-500 transition-colors"
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
          className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 px-4 py-3 space-y-1.5 max-h-[80vh] overflow-y-auto shadow-lg"
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
                    ? 'bg-amber-400/20 border-amber-500 text-stone-950 dark:text-amber-300'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-amber-400'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider">{item.label}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
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
