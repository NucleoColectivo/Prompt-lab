import React from 'react';
import { ArrowUp, Camera, Video, Film, Sparkles, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-stone-600 dark:text-stone-400 py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-5">
            <div className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-none transform rotate-45 shrink-0 inline-block"></span>
              <span>NÚCLEO COLECTIVO</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mb-4">
              Plataforma cultural, artística y tecnológica que integra arte, tecnología, inteligencia artificial, comunidad y experimentación creativa. Dirección de arte y diseño por Manuel.
            </p>
            <div className="text-[11px] font-mono-code text-stone-500">
              Laboratorio de Prompts Visuales & Motion · 2026
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-3 font-semibold">
              Estructura del Lab
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#diccionario" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Diccionario Maestro (180+ parámetros)
                </a>
              </li>
              <li>
                <a href="#builder" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Constructor Interactivo de Prompts
                </a>
              </li>
              <li>
                <a href="#recetas" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Recetas Maestras & Fórmulas Visuales
                </a>
              </li>
              <li>
                <a href="#plantillas" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Plantillas Universales (Foto & Cine)
                </a>
              </li>
            </ul>
          </div>

          {/* Compatibility */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-3 font-semibold">
              Plataformas Compatibles
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
              Instrucciones y atajos optimizados para ChatGPT (DALL-E 3 / GPT-4o), Midjourney v6, Flux.1, Runway Gen-3 Alpha, Kling AI, Luma Dream Machine y Google Veo.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono-code text-amber-700 dark:text-amber-400/90 font-medium">
              <span>Producción Audiovisual & Dirección de Arte</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 Núcleo Colectivo · Todos los derechos reservados.
          </div>

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
