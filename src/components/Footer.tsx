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
    <footer className="border-t border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#A09E97] py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-4 space-y-3">
            <a
              href="#inicio"
              onClick={(e) => handleLink(e, 'home')}
              className="text-base font-extrabold text-[#101014] dark:text-[#F4F2ED] tracking-tight inline-block hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
            >
              NÚCLEO COLECTIVO · VISUAL PROMPT LAB
            </a>
            <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed max-w-sm">
              Plataforma cultural, artística y tecnológica que integra arte, tecnología, inteligencia artificial, comunidad y experimentación creativa. Dirección de arte y diseño por Manuel.
            </p>
            <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#8E8C85]">
              8 Colecciones · 26 Módulos · 6 Labs + JSON · 31 Apps IA
            </div>
          </div>

          {/* Primary Sections */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#101014] dark:text-[#F4F2ED] mb-3 font-bold">
              Secciones del Laboratorio
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#inicio"
                  onClick={(e) => handleLink(e, 'home')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Inicio · Qué encuentras en la plataforma
                </a>
              </li>
              <li>
                <a
                  href="#galeria"
                  onClick={(e) => handleLink(e, 'galeria')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Galería Visual Experimental (8 Colecciones)
                </a>
              </li>
              <li>
                <a
                  href="#fundamentos"
                  onClick={(e) => handleLink(e, 'fundamentos')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Módulo 00 · ¿Qué es un Prompt? y Fundamentos
                </a>
              </li>
              <li>
                <a
                  href="#biblioteca"
                  onClick={(e) => handleLink(e, 'biblioteca')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Biblioteca Visual y Técnica (Módulos 01–26)
                </a>
              </li>
              <li>
                <a
                  href="#interactivo"
                  onClick={(e) => handleLink(e, 'laboratorios', 'interactivo')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Lab Interactivo · Tracking, Cámara, Micrófono & Videoarte
                </a>
              </li>
              <li>
                <a
                  href="#laboratorios"
                  onClick={(e) => handleLink(e, 'laboratorios', 'labs')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  5 Simuladores Creativos & Lab JSON Visual
                </a>
              </li>
              <li>
                <a
                  href="#experiencias"
                  onClick={(e) => handleLink(e, 'experiencias')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Nuevos Laboratorios (26), Retos Express & Experimentos
                </a>
              </li>
              <li>
                <a
                  href="#film-director"
                  onClick={(e) => handleLink(e, 'film-director')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Planificador Audiovisual (8 Etapas)
                </a>
              </li>
              <li>
                <a
                  href="#builder"
                  onClick={(e) => handleLink(e, 'builder')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Constructor de Prompts (12 Módulos) & Exportador PDF/PNG
                </a>
              </li>
              <li>
                <a
                  href="#etica-ia"
                  onClick={(e) => handleLink(e, 'etica-ia')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Ética IA · Laboratorio de Sesgos, Dilemas y Videoteca
                </a>
              </li>
              <li>
                <a
                  href="#movies-ia"
                  onClick={(e) => handleLink(e, 'movies-ia')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Documentales y Películas IA · Filmoteca Crítica
                </a>
              </li>
            </ul>
          </div>

          {/* Resources, Favorites & Practice */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#101014] dark:text-[#F4F2ED] mb-3 font-bold">
              Colecciones, Recursos y Práctica
            </h4>
            <ul className="space-y-2 text-xs mb-4">
              <li>
                <a
                  href="#favoritos"
                  onClick={(e) => handleLink(e, 'favoritos')}
                  className="hover:text-[#7545D6] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Favoritos y Colecciones Guardadas
                </a>
              </li>
              <li>
                <a
                  href="#herramientas-academia"
                  onClick={(e) => handleLink(e, 'academia')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Directorio de Apps IA (31), Retos & Glosario ES–EN
                </a>
              </li>
              <li>
                <a
                  href="#recetas"
                  onClick={(e) => handleLink(e, 'recursos', 'recetas')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Recetas Maestras &amp; Fórmulas Visuales (12)
                </a>
              </li>
              <li>
                <a
                  href="#diccionario"
                  onClick={(e) => handleLink(e, 'recursos', 'diccionario')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Diccionario de Comandos &amp; Paletas HEX
                </a>
              </li>
              <li>
                <a
                  href="#plantillas"
                  onClick={(e) => handleLink(e, 'recursos', 'plantillas')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Plantillas Maestras Rellenables (6 Disciplinas)
                </a>
              </li>
              <li>
                <a
                  href="#tutoriales"
                  onClick={(e) => handleLink(e, 'recursos', 'tutoriales')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Tutoriales Paso a Paso en Video (12 Guías IA)
                </a>
              </li>
              <li>
                <a
                  href="#ejercicios"
                  onClick={(e) => handleLink(e, 'recursos', 'ejercicios')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Ejercicios Prácticos &amp; Antes/Después de Prompts
                </a>
              </li>
              <li>
                <a
                  href="#errores"
                  onClick={(e) => handleLink(e, 'recursos', 'errores')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Clínica de Errores &amp; Constructor de Negative Prompts
                </a>
              </li>
              <li>
                <a
                  href="#guias"
                  onClick={(e) => handleLink(e, 'recursos', 'guias')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Guía de Aspect Ratios, Chuletas &amp; Checklist de Taller
                </a>
              </li>
            </ul>
            <p className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
              Optimizado para practicar en Google AI Studio, Gemini, Claude, ChatGPT, Midjourney, Flux, CapCut y Runway.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B5B66] dark:text-[#8E8C85]">
          <div>© 2026 Núcleo Colectivo · Visual Prompt Lab.</div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[#101014] dark:hover:text-[#F8C300] transition-colors"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
