import React from 'react';
import { Sparkles, Sun, Moon, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenBuilder: () => void;
  onOpenVideoLab: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenBuilder,
  onOpenVideoLab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF8F5]/90 dark:bg-stone-950/90 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-none transform rotate-45 shrink-0 inline-block"></span>
          <span>NÚCLEO COLECTIVO · PROMPT LAB</span>
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400">
          <a 
            href="#fundamentos" 
            className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Fundamentos
          </a>
          <a 
            href="#biblioteca" 
            className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Biblioteca (26)
          </a>
          <a 
            href="#laboratorios" 
            className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Laboratorios
          </a>
          <a 
            href="#film-director" 
            className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Film Director
          </a>
          <a 
            href="#builder" 
            onClick={(e) => {
              e.preventDefault();
              onOpenBuilder();
            }}
            className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Constructor
          </a>
        </nav>

        {/* Zone 3: 1 primary action button + Theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 rounded-md transition-colors"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Cambiar tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>
          
          <button
            type="button"
            onClick={onOpenBuilder}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crear Prompt</span>
          </button>
        </div>

      </div>
    </header>
  );
};
