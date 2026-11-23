import React from 'react';
import { ArrowUp, ArrowUpRight, MessageCircle } from 'lucide-react';
import type { AppSectionId } from '../types/navigation';
import { PLATFORM_METRICS } from '../data/platformMetrics';
import { StaggerGroup, StaggerItem } from './MotionPrimitives';

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
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12" stagger={0.08}>
          {/* Brand, Manifesto & Bottom-Left Logo */}
          <StaggerItem className="md:col-span-4 flex flex-col justify-between gap-8">
            <div className="space-y-3">
              <a
                href="#inicio"
                onClick={(e) => handleLink(e, 'home')}
                className="text-base font-extrabold text-[#101014] dark:text-[#F4F2ED] tracking-tight inline-block hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
              >
                NÚCLEO COLECTIVO · VISUAL PROMPT LAB
              </a>
              <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed max-w-sm">
                Plataforma cultural, artística y tecnológica que integra arte, tecnología, inteligencia artificial, comunidad y experimentación creativa. Dirección de arte y diseño por Manuel Palacio.
              </p>
              <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#8E8C85]">
                {PLATFORM_METRICS.galleryPlates} Láminas · {PLATFORM_METRICS.modules} Módulos · {PLATFORM_METRICS.labsCount} Laboratorios · {PLATFORM_METRICS.aiTools} Apps IA
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/573006101221"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar a Manuel Palacio por WhatsApp al +57 300 610 1221"
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-[#0B1D12] hover:-translate-y-0.5 active:scale-[0.98] shadow-xs hover:shadow-md transition-all duration-200 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#0B1D12] shrink-0" />
                  <span className="text-xs font-bold">Contacto · Manuel Palacio</span>
                  <span className="text-[11px] font-mono-code font-semibold opacity-90 tabular-nums">
                    +57 300 610 1221
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                </a>
              </div>
            </div>

            <a
              href="https://www.nucleocolectivo.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar sitio oficial de Núcleo Colectivo"
              title="www.nucleocolectivo.com"
              className="inline-block self-start pt-2 opacity-90 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
            >
              <img
                src="/images/logo_nc_negro.png"
                alt="Núcleo Colectivo"
                referrerPolicy="no-referrer"
                className="h-14 sm:h-16 w-auto object-contain object-left block dark:hidden"
              />
              <img
                src="/images/logo_nc.png"
                alt="Núcleo Colectivo"
                referrerPolicy="no-referrer"
                className="h-14 sm:h-16 w-auto object-contain object-left hidden dark:block"
              />
            </a>
          </StaggerItem>

          {/* Primary Sections */}
          <StaggerItem className="md:col-span-4">
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
                  href="#moodboard"
                  onClick={(e) => handleLink(e, 'laboratorios', 'moodboard')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Moodboard Builder · Dirección de Arte
                </a>
              </li>
              <li>
                <a
                  href="#iluminacion"
                  onClick={(e) => handleLink(e, 'laboratorios', 'iluminacion')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Simulador de Iluminación (9 Parámetros)
                </a>
              </li>
              <li>
                <a
                  href="#laboratorios"
                  onClick={(e) => handleLink(e, 'laboratorios', 'labs')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  {PLATFORM_METRICS.labsCount} Laboratorios Creativos &amp; Lab JSON Visual
                </a>
              </li>
              <li>
                <a
                  href="#experiencias"
                  onClick={(e) => handleLink(e, 'experiencias')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors font-semibold text-[#101014] dark:text-[#F4F2ED]"
                >
                  Experiencias Guiadas ({PLATFORM_METRICS.experiences}), Retos Express &amp; Experimentos
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
                  Constructor Modular ({PLATFORM_METRICS.disciplines} Disciplinas) &amp; Exportador
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
          </StaggerItem>

          {/* Resources, Favorites & Practice */}
          <StaggerItem className="md:col-span-4">
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
                  Mis Proyectos, Bitácora Creativa y Moodboards
                </a>
              </li>
              <li>
                <a
                  href="#herramientas-academia"
                  onClick={(e) => handleLink(e, 'academia')}
                  className="hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors"
                >
                  Directorio de Apps IA ({PLATFORM_METRICS.aiTools}), Retos &amp; Glosario ES–EN
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
            <p className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold leading-relaxed">
              Optimizado para practicar en Google AI Studio, Gemini, Flow, DeepSeek, Kimi.ai, Claude, ChatGPT, Midjourney, Flux, Canva, CapCut, Runway, ElevenLabs, Adobe Podcast, Suno y Audacity.
            </p>
          </StaggerItem>
        </StaggerGroup>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B5B66] dark:text-[#8E8C85]">
          <div>© 2026 Núcleo Colectivo · Visual Prompt Lab.</div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-1.5 hover:text-[#101014] dark:hover:text-[#F8C300] transition-colors cursor-pointer"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
