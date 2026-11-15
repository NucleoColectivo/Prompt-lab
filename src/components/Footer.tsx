import React from 'react';
import { ArrowUp } from 'lucide-react';
import type { AppSectionId } from '../types/navigation';

interface FooterProps {
  onNavigateSection: (section: AppSectionId, subTab?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    section: AppSectionId,
    subTab?: string
  ) => {
    e.preventDefault();
    onNavigateSection(section, subTab);
  };

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-stone-600 dark:text-stone-400 py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-4 space-y-3">
            <a
              href="#inicio"
              onClick={(e) => handleLink(e, 'home')}
              className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight inline-flex items-center gap-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-none transform rotate-45 shrink-0 inline-block" />
              <span>NÚCLEO COLECTIVO</span>
            </a>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm">
              Plataforma cultural, artística y tecnológica que integra arte, tecnología, inteligencia artificial, comunidad y experimentación creativa. Dirección de arte y diseño por Manuel.
            </p>
            <div className="text-[11px] font-mono-code text-stone-500">
              Visual & Motion Prompt Lab · 26 Módulos + 6 Labs + 31 Apps IA
            </div>
          </div>

          {/* Primary Sections */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-3 font-semibold">
              Secciones de Trabajo
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#inicio"
                  onClick={(e) => handleLink(e, 'home')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Inicio · Qué encuentras en la plataforma
                </a>
              </li>
              <li>
                <a
                  href="#fundamentos"
                  onClick={(e) => handleLink(e, 'fundamentos')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Módulo 00 · ¿Qué es un Prompt? y Fundamentos
                </a>
              </li>
              <li>
                <a
                  href="#biblioteca"
                  onClick={(e) => handleLink(e, 'biblioteca')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Biblioteca Visual (Módulos 01–26)
                </a>
              </li>
              <li>
                <a
                  href="#laboratorios"
                  onClick={(e) => handleLink(e, 'laboratorios', 'labs')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  5 Laboratorios Creativos (Luz, Cámara, Color, Storyboard)
                </a>
              </li>
              <li>
                <a
                  href="#json-lab"
                  onClick={(e) => handleLink(e, 'laboratorios', 'json')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Laboratorio JSON Visual (Módulo 07)
                </a>
              </li>
              <li>
                <a
                  href="#film-director"
                  onClick={(e) => handleLink(e, 'film-director')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Planificador Audiovisual (8 Etapas)
                </a>
              </li>
              <li>
                <a
                  href="#builder"
                  onClick={(e) => handleLink(e, 'builder')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Constructor Maestro de Prompts & Exportador PDF/PNG
                </a>
              </li>
            </ul>
          </div>

          {/* Resources, Academy & Practice */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-3 font-semibold">
              Recursos, Retos y Práctica Externa
            </h4>
            <ul className="space-y-2 text-xs mb-4">
              <li>
                <a
                  href="#herramientas-academia"
                  onClick={(e) => handleLink(e, 'academia')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Directorio de Apps IA, Retos Creativos & Glosario ES–EN
                </a>
              </li>
              <li>
                <a
                  href="#recetas"
                  onClick={(e) => handleLink(e, 'recursos', 'recetas')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Recetas Maestras & Fórmulas Visuales
                </a>
              </li>
              <li>
                <a
                  href="#diccionario"
                  onClick={(e) => handleLink(e, 'recursos', 'diccionario')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Diccionario de Comandos & Paletas HEX (180+)
                </a>
              </li>
              <li>
                <a
                  href="#plantillas"
                  onClick={(e) => handleLink(e, 'recursos', 'plantillas')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Plantillas Universales (Foto, Cine & Talleres)
                </a>
              </li>
            </ul>
            <p className="text-[11px] font-mono-code text-amber-700 dark:text-amber-400/90 font-medium">
              Optimizado para practicar en ChatGPT, Midjourney, Flux, Firefly, Runway, Kling AI y Veo.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>© 2026 Núcleo Colectivo · Todos los derechos reservados.</div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
