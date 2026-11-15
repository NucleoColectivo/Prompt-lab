import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  BrainCircuit,
  Clapperboard,
  ExternalLink,
  Film,
  HelpCircle,
  PlayCircle,
  Scale,
  Search,
  Sparkles,
  Ticket,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  DOCUMENTARY_CATEGORY_ORDER,
  DOCUMENTARY_VIDEOS,
  FICTION_MOVIES,
  MOVIES_IA_HEADER,
  SECTION_DESCRIPTIONS,
  type DocumentaryCategory,
  type DocumentaryVideoItem,
  type FictionMovieItem,
} from '../data/moviesIaData';
import { VISUAL_LIBRARY_PATHS } from '../data/visualLibraryRegistry';
import { ResilientImage } from './ResilientImage';
import type { PromptBuilderState } from './PromptBuilder';

interface MoviesIaViewProps {
  onSendToBuilder: (patch: Partial<PromptBuilderState>) => void;
  onOpenEticaIa: () => void;
  onOpenFilmDirector: () => void;
}

type FilterTab = 'Todos' | DocumentaryCategory | 'Filmoteca de Ficción';

export const MoviesIaView: React.FC<MoviesIaViewProps> = ({
  onSendToBuilder,
  onOpenEticaIa,
  onOpenFilmDirector,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<DocumentaryVideoItem | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<FictionMovieItem | null>(null);
  const [isCineClubOpen, setIsCineClubOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedVideo) setSelectedVideo(null);
        else if (selectedMovie) setSelectedMovie(null);
        else if (isCineClubOpen) setIsCineClubOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedVideo, selectedMovie, isCineClubOpen]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredVideos = useMemo(() => {
    return DOCUMENTARY_VIDEOS.filter((v) => {
      const matchesCat =
        activeFilter === 'Todos' ||
        (activeFilter !== 'Filmoteca de Ficción' && v.category === activeFilter);
      if (!matchesCat) return false;
      if (!normalizedQuery) return true;
      return (
        v.title.toLowerCase().includes(normalizedQuery) ||
        v.description.toLowerCase().includes(normalizedQuery) ||
        v.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeFilter, normalizedQuery]);

  const filteredMovies = useMemo(() => {
    if (activeFilter !== 'Todos' && activeFilter !== 'Filmoteca de Ficción') return [];
    if (!normalizedQuery) return FICTION_MOVIES;
    return FICTION_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(normalizedQuery) ||
        m.director.toLowerCase().includes(normalizedQuery) ||
        m.description.toLowerCase().includes(normalizedQuery) ||
        m.actors.some((a) => a.toLowerCase().includes(normalizedQuery)) ||
        String(m.year).includes(normalizedQuery)
    );
  }, [activeFilter, normalizedQuery]);

  const showDocumentariesSection = activeFilter !== 'Filmoteca de Ficción';
  const showFictionSection =
    activeFilter === 'Todos' || activeFilter === 'Filmoteca de Ficción';

  const scrollToTarget = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] transition-colors">
      {/* 1. HERO EDITORIAL DE CINE Y DOCUMENTALES IA */}
      <section className="relative overflow-hidden border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#101014] text-[#F4F2ED]">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <ResilientImage
            src={VISUAL_LIBRARY_PATHS.camCinemaRig}
            alt="Cámara cinematográfica y lenguaje audiovisual IA"
            containerClassName="w-full h-full"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/80 to-[#101014]/60 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#F8C300] font-bold flex items-center gap-2">
              <Clapperboard className="w-4 h-4 shrink-0" />
              <span>NÚCLEO COLECTIVO · FILMOTECA & DOCUMENTALES SOBRE IA</span>
            </div>

            {/* Ticket Cine Club Admit One */}
            <button
              type="button"
              onClick={() => setIsCineClubOpen(true)}
              className="inline-flex items-stretch rounded-lg overflow-hidden border border-[#F8C300] bg-[#18181F] hover:bg-[#F8C300] text-[#F8C300] hover:text-[#101014] transition-colors text-xs font-mono-code font-bold min-h-[40px]"
              title="Abrir función especial Cine Club"
            >
              <span className="px-3 py-2 flex items-center gap-1.5 border-r border-dashed border-[#F8C300]/70">
                <Ticket className="w-3.5 h-3.5" />
                <span>{MOVIES_IA_HEADER.ticketTitle}</span>
              </span>
              <span className="px-2.5 py-2 flex items-center bg-[#F8C300] text-[#101014]">
                {MOVIES_IA_HEADER.ticketStub}
              </span>
            </button>
          </div>

          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display-sans tracking-tight leading-[1.05] text-[#F4F2ED]">
              {MOVIES_IA_HEADER.title}
            </h1>
            <p className="text-sm sm:text-base font-mono-code text-[#D8D5CD] leading-relaxed max-w-3xl">
              {MOVIES_IA_HEADER.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setActiveFilter('Todos');
                scrollToTarget('documentales-ia');
              }}
              className="px-4 py-2.5 min-h-[44px] text-xs font-bold uppercase tracking-wider bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Documentales y Debates ({DOCUMENTARY_VIDEOS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('Filmoteca de Ficción');
                scrollToTarget('filmoteca-ficcion');
              }}
              className="px-4 py-2.5 min-h-[44px] text-xs font-semibold uppercase tracking-wider bg-[#1D1D24] hover:bg-[#2A2A34] text-[#F4F2ED] border border-[#343440] rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Film className="w-4 h-4 text-[#F8C300]" />
              <span>Filmoteca de Ficción ({FICTION_MOVIES.length})</span>
            </button>
            <button
              type="button"
              onClick={onOpenEticaIa}
              className="px-4 py-2.5 min-h-[44px] text-xs font-semibold uppercase tracking-wider bg-transparent hover:bg-white/10 text-[#D8D5CD] border border-[#343440] rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-[#7545D6]" />
              <span>Ir a Ética IA</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE FILTROS Y BUSCADOR */}
      <section className="sticky top-[57px] z-30 bg-[#F4F2ED]/95 dark:bg-[#101014]/95 backdrop-blur-md border-b border-[#DEDAD0] dark:border-[#26262E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                'Todos',
                ...DOCUMENTARY_CATEGORY_ORDER,
                'Filmoteca de Ficción',
              ] as FilterTab[]
            ).map((tab) => {
              const isSelected = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-2 min-h-[40px] text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                      : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#5B5B66] dark:text-[#A09E97] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar película, director o tema..."
              aria-label="Buscar documentales o películas sobre IA"
              className="w-full pl-9 pr-3 py-2 min-h-[40px] text-xs font-mono-code rounded-lg bg-white dark:bg-[#16161C] border border-[#D4D0C5] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] placeholder:text-[#6A6A76] focus:outline-none focus:border-[#326BFF]"
            />
          </div>
        </div>
      </section>

      {/* 3. SERIES DOCUMENTALES, DOCUMENTALES, ANÁLISIS Y PELÍCULA COMPLETA */}
      {showDocumentariesSection && (
        <section
          id="documentales-ia"
          className="py-12 sm:py-16 border-b border-[#DEDAD0] dark:border-[#26262E] scroll-mt-32"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
            {filteredVideos.length === 0 ? (
              <div className="p-8 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-center space-y-2">
                <p className="text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                  No se encontraron documentales o videos con "{searchQuery}".
                </p>
              </div>
            ) : (
              DOCUMENTARY_CATEGORY_ORDER.map((category) => {
                const items = filteredVideos.filter((v) => v.category === category);
                if (items.length === 0) return null;

                return (
                  <div key={category} className="space-y-6">
                    <div className="max-w-3xl space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300] shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                            {category}
                          </h2>
                          <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                            {items.length} {items.length === 1 ? 'pieza audiovisual' : 'piezas audiovisuales'}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                        {SECTION_DESCRIPTIONS[category]}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((video) => (
                        <article
                          key={video.id}
                          className="rounded-xl overflow-hidden bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-colors flex flex-col justify-between group"
                        >
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedVideo(video)}
                              className="relative w-full aspect-video overflow-hidden bg-[#101014] block text-left"
                              aria-label={`Reproducir: ${video.title}`}
                            >
                              <img
                                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                                alt={video.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors flex items-center justify-center">
                                <PlayCircle className="w-12 h-12 text-[#F8C300] drop-shadow" />
                              </div>
                            </button>

                            <div className="p-4 sm:p-5 space-y-2">
                              <h3 className="text-sm sm:text-base font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-snug">
                                {video.title}
                              </h3>
                              <p className="text-xs font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                                {video.description}
                              </p>
                            </div>
                          </div>

                          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                            <button
                              type="button"
                              onClick={() => setSelectedVideo(video)}
                              className="w-full py-2.5 px-4 min-h-[40px] text-xs font-mono-code font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] hover:bg-[#326BFF] dark:hover:bg-[#e5b400] text-[#F4F2ED] dark:text-[#101014] rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <PlayCircle className="w-4 h-4" />
                              <span>VER VIDEO</span>
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* 4. FILMOTEKA ESENCIAL DE FICCIÓN (20 PELÍCULAS) */}
      {showFictionSection && (
        <section
          id="filmoteca-ficcion"
          className="py-12 sm:py-16 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#16161C] scroll-mt-32"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="max-w-3xl space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#7545D6]/15 text-[#7545D6] dark:text-[#F8C300] shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                    Filmoteca Esencial de Ficción
                  </h2>
                  <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                    {filteredMovies.length} películas fundamentales · haz clic para ver reflexión
                    IA y pregunta ética
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                {SECTION_DESCRIPTIONS['Filmoteca Esencial de Ficción']}
              </p>
            </div>

            {filteredMovies.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-center">
                <p className="text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                  No se encontraron películas de ficción con "{searchQuery}".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredMovies.map((movie) => (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => setSelectedMovie(movie)}
                    className="text-left rounded-xl overflow-hidden bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-colors flex flex-col justify-between group"
                  >
                    <div className="w-full">
                      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#101014]">
                        <ResilientImage
                          src={movie.posterUrl}
                          alt={`Póster de ${movie.title} (${movie.year})`}
                          containerClassName="w-full h-full"
                          fallbackLabel={`${movie.title} (${movie.year}) · ${movie.director}`}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                          <span className="text-[11px] font-mono-code font-bold text-[#F8C300]">
                            VER ANÁLISIS IA
                          </span>
                          <PlayCircle className="w-5 h-5 text-[#F8C300]" />
                        </div>
                      </div>

                      <div className="p-3.5 space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-sm font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-tight group-hover:text-[#326BFF] dark:group-hover:text-[#F8C300]">
                            {movie.title}
                          </h3>
                          <span className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] shrink-0">
                            {movie.year}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold truncate">
                          {movie.director}
                        </div>
                        <p className="text-xs font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] line-clamp-3 leading-relaxed">
                          {movie.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. PUENTE CREATIVO CON PLANIFICADOR Y CONSTRUCTOR */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] font-bold">
                DEL ANÁLISIS CINEMATOGRÁFICO A LA CREACIÓN
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                Lleva estas referencias narrativas a tu propio proyecto audiovisual
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                Usa las preguntas éticas del cine de ciencia ficción como punto de partida en el
                Planificador Audiovisual de 8 Etapas o profundiza en nuestros simuladores de Ética IA.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onOpenEticaIa}
                className="px-4 py-2.5 min-h-[40px] text-xs font-semibold bg-[#F4F2ED] dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] rounded-lg"
              >
                Laboratorio de Ética IA
              </button>
              <button
                type="button"
                onClick={onOpenFilmDirector}
                className="px-4 py-2.5 min-h-[40px] text-xs font-bold uppercase tracking-wider bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg"
              >
                Planificador Audiovisual
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DETALLE DE PELÍCULA */}
      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="movie-detail-title"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#2C2C36] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Poster Column */}
              <div className="md:col-span-2 relative aspect-[2/3] md:aspect-auto md:min-h-[540px] bg-[#101014]">
                <ResilientImage
                  src={selectedMovie.posterUrl}
                  alt={selectedMovie.title}
                  containerClassName="w-full h-full"
                  fallbackLabel={`${selectedMovie.title} (${selectedMovie.year})`}
                />
                <button
                  type="button"
                  onClick={() => setSelectedMovie(null)}
                  className="md:hidden absolute top-3 right-3 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#101014]/90 text-[#F4F2ED] border border-[#343440]"
                  aria-label="Cerrar ficha de película"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Column */}
              <div className="md:col-span-3 p-5 sm:p-7 flex flex-col justify-between gap-6">
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        id="movie-detail-title"
                        className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] flex flex-wrap items-baseline gap-2"
                      >
                        <span>{selectedMovie.title}</span>
                        <span className="text-lg font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                          ({selectedMovie.year})
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm font-mono-code text-[#5B5B66] dark:text-[#A09E97] mt-1">
                        Dirigida por{' '}
                        <strong className="text-[#101014] dark:text-[#F4F2ED]">
                          {selectedMovie.director}
                        </strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedMovie(null)}
                      className="hidden md:flex p-2 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300] shrink-0"
                      aria-label="Cerrar ficha de película"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sinopsis */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                      <BookOpen className="w-4 h-4" />
                      <span>Sinopsis</span>
                    </div>
                    <p className="text-xs sm:text-sm font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                      {selectedMovie.description}
                    </p>
                  </div>

                  {/* Actores Principales */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                      <Users className="w-4 h-4" />
                      <span>Actores Principales</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.actors.map((actor) => (
                        <span
                          key={actor}
                          className="px-2.5 py-1 text-xs font-mono-code rounded-md bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED]"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reflexión IA */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                      <BrainCircuit className="w-4 h-4" />
                      <span>Reflexión IA</span>
                    </div>
                    <blockquote className="p-3.5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-xs sm:text-sm italic font-mono-code text-[#101014] dark:text-[#F4F2ED] leading-relaxed">
                      {selectedMovie.aiReflection}
                    </blockquote>
                  </div>

                  {/* Pregunta Ética Central */}
                  <div className="p-4 rounded-xl bg-[#F8C300]/15 border border-[#F8C300]/60 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F8C300]">
                      <HelpCircle className="w-4 h-4" />
                      <span>Pregunta Ética Central</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold font-mono-code text-[#101014] dark:text-[#F4F2ED] leading-snug">
                      {selectedMovie.ethicalQuestion}
                    </p>
                  </div>
                </div>

                {/* Creative Bridge Actions */}
                <div className="pt-4 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const chosen = selectedMovie;
                      setSelectedMovie(null);
                      onSendToBuilder({
                        mode: 'video',
                        subject: `Escena cinematográfica filosófica inspirada en "${chosen.title}" (${chosen.year}, dir. ${chosen.director}): ${chosen.ethicalQuestion}`,
                        visualStyle: `Ciencia Ficción Crítica · Referencia ${chosen.title}`,
                        lighting: 'Atmospheric architectural chiaroscuro, cool cyan fill and subtle warm key',
                        colorPalette: 'Atmospheric sci-fi film grade with controlled specular highlights',
                      });
                    }}
                    className="px-4 py-2.5 min-h-[40px] text-xs font-bold uppercase tracking-wider bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Crear Escena en Constructor</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPRODUCTOR DE VIDEO (YOUTUBE) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="movie-video-title"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl overflow-hidden bg-[#101014] border border-[#2C2C36] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-[#26262E]">
              <div className="min-w-0">
                <div className="text-[11px] font-mono-code font-bold text-[#F8C300]">
                  {selectedVideo.category}
                </div>
                <h3
                  id="movie-video-title"
                  className="text-sm sm:text-base font-bold text-[#F4F2ED] truncate"
                >
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#18181F] text-[#F4F2ED] border border-[#2C2C36] hover:border-[#F8C300] shrink-0"
                aria-label="Cerrar reproductor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="px-4 sm:px-5 py-3 bg-[#16161C] flex flex-wrap items-center justify-between gap-3 text-xs">
              <p className="text-[#B4B2AC] font-mono-code">{selectedVideo.description}</p>
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8C300] hover:underline font-mono-code font-bold inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Ver en YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CINE CLUB ADMIT ONE */}
      {isCineClubOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cineclub-modal-title"
          onClick={() => setIsCineClubOpen(false)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl overflow-hidden bg-[#101014] border border-[#2C2C36] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-[#26262E]">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#F8C300]" />
                <h3
                  id="cineclub-modal-title"
                  className="text-sm sm:text-base font-bold font-mono-code text-[#F4F2ED]"
                >
                  CINE CLUB · FUNCIÓN ESPECIAL IA
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCineClubOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#18181F] text-[#F4F2ED] border border-[#2C2C36] hover:border-[#F8C300] shrink-0"
                aria-label="Cerrar función Cine Club"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              <iframe
                src={MOVIES_IA_HEADER.cineClubEmbedUrl}
                title="Cine Club Función Especial"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="px-4 sm:px-5 py-3 bg-[#16161C] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#B4B2AC] font-mono-code">
                Proyección curada · Cine Club Núcleo Colectivo
              </span>
              <a
                href={MOVIES_IA_HEADER.cineClubExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8C300] hover:underline font-mono-code font-bold inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Abrir enlace externo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
