import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Search,
  Bookmark,
  Copy,
  Check,
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  Columns3,
  BookOpen,
  Wand2,
  Film,
  Camera,
  SlidersHorizontal,
  Braces,
  Sliders,
} from 'lucide-react';
import {
  GALLERY_COLLECTIONS,
  GALLERY_VISUAL_ITEMS,
  GalleryCollectionId,
  GalleryVisualItem,
  PromptVariationOption,
} from '../data/galleryCollectionsData';
import type { ModuleId } from '../data/modulesData';
import type { PromptBuilderState } from './PromptBuilder';
import { ResilientImage } from './ResilientImage';

export interface VisualGalleryViewProps {
  activeCollection: string;
  onChangeCollection: (collection: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onExperimentInBuilder: (patch: Partial<PromptBuilderState>) => void;
  onOpenTechnicalModule: (moduleId: ModuleId) => void;
  onAnalyzeInJsonLab?: (item: GalleryVisualItem) => void;
  onOpenLabs?: () => void;
}

type SortOption = 'curated' | 'az' | 'favorites';
type LayoutMode = 'masonry' | 'grid';

export const VisualGalleryView: React.FC<VisualGalleryViewProps> = ({
  activeCollection,
  onChangeCollection,
  favorites,
  onToggleFavorite,
  onExperimentInBuilder,
  onOpenTechnicalModule,
  onAnalyzeInJsonLab,
  onOpenLabs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Todos');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('Todas');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [activeTag, setActiveTag] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('curated');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('masonry');

  const [promptLang, setPromptLang] = useState<'es' | 'en'>('es');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryVisualItem | null>(null);
  const [lightboxDraftPrompt, setLightboxDraftPrompt] = useState('');
  const [appliedVariationPatch, setAppliedVariationPatch] =
    useState<PromptVariationOption['patch'] | null>(null);

  const uniqueStyles = useMemo(
    () => ['Todos', ...Array.from(new Set(GALLERY_VISUAL_ITEMS.map((i) => i.style)))],
    []
  );

  const uniqueTechniques = useMemo(
    () => ['Todas', ...Array.from(new Set(GALLERY_VISUAL_ITEMS.map((i) => i.technique)))],
    []
  );

  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = { Todas: GALLERY_VISUAL_ITEMS.length };
    for (const item of GALLERY_VISUAL_ITEMS) {
      counts[item.collection] = (counts[item.collection] || 0) + 1;
    }
    return counts;
  }, []);

  const activeCollectionMeta = useMemo(
    () => GALLERY_COLLECTIONS.find((c) => c.id === activeCollection) || null,
    [activeCollection]
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = GALLERY_VISUAL_ITEMS.filter((item) => {
      const matchCol = activeCollection === 'Todas' || item.collection === activeCollection;
      const matchStyle = selectedStyle === 'Todos' || item.style === selectedStyle;
      const matchTech = selectedTechnique === 'Todas' || item.technique === selectedTechnique;
      const matchMedia = mediaFilter === 'all' || item.mediaType === mediaFilter;
      const matchTag = !activeTag || item.tags.includes(activeTag);
      const matchFav = !onlyFavorites || favorites.includes(item.id);
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.technicalExplanation.toLowerCase().includes(q) ||
        item.promptEs.toLowerCase().includes(q) ||
        item.promptEn.toLowerCase().includes(q) ||
        item.specs.camera.toLowerCase().includes(q) ||
        item.specs.lens.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return (
        matchCol &&
        matchStyle &&
        matchTech &&
        matchMedia &&
        matchTag &&
        matchFav &&
        matchQuery
      );
    });

    if (sortBy === 'az') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title, 'es'));
    }
    if (sortBy === 'favorites') {
      return [...list].sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        return bFav - aFav;
      });
    }
    return list;
  }, [
    activeCollection,
    selectedStyle,
    selectedTechnique,
    mediaFilter,
    activeTag,
    onlyFavorites,
    favorites,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    activeCollection !== 'Todas' ||
    selectedStyle !== 'Todos' ||
    selectedTechnique !== 'Todas' ||
    mediaFilter !== 'all' ||
    activeTag !== '' ||
    onlyFavorites ||
    searchQuery.trim() !== '';

  const resetAllFilters = () => {
    onChangeCollection('Todas');
    setSelectedStyle('Todos');
    setSelectedTechnique('Todas');
    setMediaFilter('all');
    setActiveTag('');
    setOnlyFavorites(false);
    setSearchQuery('');
    setSortBy('curated');
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const openLightbox = useCallback(
    (item: GalleryVisualItem) => {
      setLightboxItem(item);
      setLightboxDraftPrompt(promptLang === 'es' ? item.promptEs : item.promptEn);
      setAppliedVariationPatch(null);
    },
    [promptLang]
  );

  // Sync draft prompt when switching ES/EN inside Lightbox
  const switchLightboxLanguage = (lang: 'es' | 'en') => {
    setPromptLang(lang);
    if (lightboxItem) {
      setLightboxDraftPrompt(lang === 'es' ? lightboxItem.promptEs : lightboxItem.promptEn);
      setAppliedVariationPatch(null);
    }
  };

  const applyVariationInLightbox = (variation: PromptVariationOption) => {
    if (!lightboxItem) return;
    const base = promptLang === 'es' ? lightboxItem.promptEs : lightboxItem.promptEn;
    const delta = promptLang === 'es' ? variation.deltaEs : variation.deltaEn;
    setLightboxDraftPrompt(`${base} — [Variación: ${delta}]`);
    setAppliedVariationPatch(variation.patch || null);
  };

  const navigateLightbox = useCallback(
    (dir: -1 | 1) => {
      if (!lightboxItem || filteredItems.length === 0) return;
      const currentIdx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
      if (currentIdx === -1) return;
      const nextIdx = (currentIdx + dir + filteredItems.length) % filteredItems.length;
      const nextItem = filteredItems[nextIdx];
      setLightboxItem(nextItem);
      setLightboxDraftPrompt(promptLang === 'es' ? nextItem.promptEs : nextItem.promptEn);
      setAppliedVariationPatch(null);
    },
    [lightboxItem, filteredItems, promptLang]
  );

  useEffect(() => {
    if (!lightboxItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxItem, navigateLightbox]);

  const sendItemToBuilder = (
    item: GalleryVisualItem,
    customPrompt?: string,
    variationPatch?: PromptVariationOption['patch'] | null
  ) => {
    const promptToLoad =
      customPrompt || (promptLang === 'es' ? item.promptEs : item.promptEn);

    const patch: Partial<PromptBuilderState> = {
      mode: item.mediaType === 'video' ? 'video' : 'photo',
      subject: promptToLoad,
      composition: item.specs.composition,
      camera: item.specs.camera,
      lens: variationPatch?.lens || item.specs.lens,
      aperture: item.specs.aperture,
      lighting: variationPatch?.lighting || item.specs.lighting,
      colorPalette: variationPatch?.colorPalette || item.specs.color,
      atmosphere: item.specs.atmosphere,
      texture: item.specs.texture,
      visualStyle: item.style,
      aspectRatio: variationPatch?.aspectRatio || item.aspectRatio,
      motion:
        variationPatch?.motion ||
        (item.mediaType === 'video'
          ? 'Smooth controlled cinematic camera movement at 24fps'
          : undefined),
      negativeAvoid: item.negativePrompt
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setLightboxItem(null);
    onExperimentInBuilder(patch);
  };

  return (
    <section
      id="galeria"
      className="py-12 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#DEDAD0] dark:border-[#26262E] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
              <span>PRIORIDAD 01</span>
              <span aria-hidden="true">·</span>
              <span>GALERÍA EXPERIMENTAL</span>
              <span aria-hidden="true">·</span>
              <span>{GALLERY_VISUAL_ITEMS.length} LÁMINAS CURADAS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-tight text-balance">
              Enciclopedia Visual de Prompts y Estéticas
            </h1>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] max-w-2xl leading-relaxed">
              Explora nuestras 8 colecciones curadas. Cada fotografía y fotograma desglosa su técnica, prompts bilingües ES/EN, negative prompt y variaciones listas para cargar en el Constructor.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono-code">
              <button
                type="button"
                onClick={() => onOpenTechnicalModule('mod-01')}
                className="text-[#326BFF] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explorar 26 Módulos</span>
              </button>
              {onOpenLabs && (
                <>
                  <span className="text-[#DEDAD0] dark:text-[#2C2C36]">·</span>
                  <button
                    type="button"
                    onClick={onOpenLabs}
                    className="text-[#7545D6] dark:text-[#B99BFF] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Practicar en Laboratorios</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* ES/EN Toggle */}
            <div className="inline-flex rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] overflow-hidden bg-white dark:bg-[#16161C] text-xs font-mono-code font-bold">
              <button
                type="button"
                onClick={() => setPromptLang('es')}
                className={`px-3 py-2 transition-colors ${
                  promptLang === 'es'
                    ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014]'
                    : 'text-[#4A4A55] dark:text-[#A09E97]'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setPromptLang('en')}
                className={`px-3 py-2 transition-colors ${
                  promptLang === 'en'
                    ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014]'
                    : 'text-[#4A4A55] dark:text-[#A09E97]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Layout Mode Switcher */}
            <div className="inline-flex rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] overflow-hidden bg-white dark:bg-[#16161C] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLayoutMode('masonry')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-colors ${
                  layoutMode === 'masonry'
                    ? 'bg-[#F8C300] text-[#101014] font-bold'
                    : 'text-[#4A4A55] dark:text-[#A09E97]'
                }`}
                title="Vista Masonry Editorial"
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Masonry</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-[#F8C300] text-[#101014] font-bold'
                    : 'text-[#4A4A55] dark:text-[#A09E97]'
                }`}
                title="Retícula Uniforme"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Retícula</span>
              </button>
            </div>
          </div>
        </div>

        {/* 8 Collection Selector Strip */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChangeCollection('Todas')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                activeCollection === 'Todas'
                  ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                  : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
              }`}
            >
              Todas ({collectionCounts.Todas})
            </button>
            {GALLERY_COLLECTIONS.map((col) => {
              const isActive = activeCollection === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => onChangeCollection(col.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300] font-bold'
                      : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {col.number}. {col.title} ({collectionCounts[col.id] || 0})
                </button>
              );
            })}
          </div>

          {activeCollectionMeta && (
            <div className="px-4 py-3 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300] mr-2">
                  COLECCIÓN {activeCollectionMeta.number} · {activeCollectionMeta.title.toUpperCase()}
                </span>
                <span className="text-[#4A4A55] dark:text-[#B4B2AC]">
                  {activeCollectionMeta.description}
                </span>
              </div>
              <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] shrink-0">
                {filteredItems.length} resultados
              </span>
            </div>
          )}
        </div>

        {/* Multi-Filter Toolbar */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-[#5B5B66] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por lente, luz, tag, ID o prompt..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
              />
            </div>

            {/* Style Select */}
            <div className="md:col-span-3">
              <select
                aria-label="Filtrar por estilo"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
              >
                {uniqueStyles.map((st) => (
                  <option key={st} value={st}>
                    Estilo: {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Technique Select */}
            <div className="md:col-span-3">
              <select
                aria-label="Filtrar por técnica"
                value={selectedTechnique}
                onChange={(e) => setSelectedTechnique(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
              >
                {uniqueTechniques.map((tech) => (
                  <option key={tech} value={tech}>
                    Técnica: {tech}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="md:col-span-2">
              <select
                aria-label="Ordenar galería"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
              >
                <option value="curated">Orden: Curado</option>
                <option value="az">Orden: A–Z</option>
                <option value="favorites">Orden: Favoritos</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] inline-flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Tipo:</span>
              </span>
              {[
                { id: 'all' as const, label: 'Todos', icon: null },
                { id: 'image' as const, label: 'Imagen / Foto', icon: <Camera className="w-3 h-3" /> },
                { id: 'video' as const, label: 'Motion / Video', icon: <Film className="w-3 h-3" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMediaFilter(m.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 ${
                    mediaFilter === m.id
                      ? 'bg-[#326BFF] text-white border-[#326BFF]'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 ${
                  onlyFavorites
                    ? 'bg-[#7545D6] text-white border-[#7545D6]'
                    : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]'
                }`}
              >
                <Bookmark className="w-3 h-3" />
                <span>Solo favoritas ({favorites.length})</span>
              </button>

              {activeTag && (
                <button
                  type="button"
                  onClick={() => setActiveTag('')}
                  className="px-2.5 py-1.5 text-xs font-mono-code font-bold rounded-lg bg-[#F8C300]/25 border border-[#F8C300] text-[#101014] dark:text-[#F8C300] inline-flex items-center gap-1"
                >
                  <span>Etiqueta: #{activeTag}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono-code">
              <span className="text-[#5B5B66] dark:text-[#A09E97]">
                {filteredItems.length} de {GALLERY_VISUAL_ITEMS.length} láminas
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[#326BFF] dark:text-[#F8C300] hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-center space-y-4">
            <h2 className="text-lg font-bold text-[#101014] dark:text-[#F4F2ED]">
              No hay láminas que coincidan con esta combinación de filtros
            </h2>
            <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] max-w-md mx-auto">
              Prueba ampliar la colección, quitar la etiqueta seleccionada o restablecer los filtros activos.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer todos los filtros</span>
            </button>
          </div>
        ) : (
          /* Masonry or Uniform Grid */
          <div
            className={
              layoutMode === 'masonry'
                ? 'columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6'
                : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            }
          >
            {filteredItems.map((item) => {
              const isFav = favorites.includes(item.id);
              const displayedPrompt = promptLang === 'es' ? item.promptEs : item.promptEn;

              return (
                <article
                  key={item.id}
                  className={`${
                    layoutMode === 'masonry' ? 'break-inside-avoid mb-6' : 'h-full flex flex-col justify-between'
                  } rounded-2xl overflow-hidden bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-colors group`}
                >
                  <div>
                    {/* Media Frame */}
                    <div
                      onClick={() => openLightbox(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightbox(item);
                        }
                      }}
                      aria-label={`Ampliar lámina ${item.title} en visor Lightbox`}
                      className="relative cursor-pointer overflow-hidden bg-[#101014]"
                    >
                      <ResilientImage
                        src={item.image}
                        alt={item.alt}
                        aspectRatio={layoutMode === 'masonry' ? item.aspectRatio : '3:2'}
                        objectPosition={item.objectPosition || 'center'}
                        className="group-hover:scale-103 transition-transform duration-500"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#101014]/85 to-transparent pointer-events-none" />

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLightbox(item);
                          }}
                          className="p-2 rounded-lg bg-[#101014]/75 hover:bg-[#326BFF] text-[#F4F2ED] border border-white/15 transition-colors"
                          aria-label="Abrir visor Lightbox"
                          title="Abrir en Lightbox"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id);
                          }}
                          className={`p-2 rounded-lg border transition-colors ${
                            isFav
                              ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                              : 'bg-[#101014]/75 hover:bg-[#101014] text-[#F4F2ED] border-white/15'
                          }`}
                          aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                          title={isFav ? 'Guardada en Favoritos' : 'Guardar en Favoritos'}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono-code text-[#F4F2ED]">
                        <span className="font-bold text-[#F8C300]">{item.code}</span>
                        <span>
                          {item.mediaType === 'video' ? 'VIDEO · 24FPS' : item.specs.aperture} · {item.aspectRatio}
                        </span>
                      </div>
                    </div>

                    {/* Editorial Body */}
                    <div className="p-5 space-y-3">
                      {/* Clean Unboxed Metadata */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                        <span className="font-bold text-[#7545D6] dark:text-[#F8C300]">
                          {item.collection}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.style}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.technique}</span>
                      </div>

                      <div>
                        <h2 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED] leading-snug">
                          {item.title}
                        </h2>
                        <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Technical Strip */}
                      <div className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC] pt-2 border-t border-[#DEDAD0] dark:border-[#26262E] space-y-1">
                        <div>
                          <strong className="text-[#101014] dark:text-[#F4F2ED]">Óptica:</strong>{' '}
                          {item.specs.lens} ({item.specs.aperture})
                        </div>
                        <div>
                          <strong className="text-[#101014] dark:text-[#F4F2ED]">Luz:</strong>{' '}
                          {item.specs.lighting}
                        </div>
                      </div>

                      {/* Prompt Snippet */}
                      <div className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono-code font-bold text-[#5B5B66] dark:text-[#A09E97]">
                          <span>PROMPT ({promptLang.toUpperCase()})</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(displayedPrompt, item.id)}
                            className="inline-flex items-center gap-1 text-[#326BFF] dark:text-[#F8C300] hover:underline"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] font-mono-code text-[#101014] dark:text-[#D8D5CD] line-clamp-3 leading-relaxed">
                          {displayedPrompt}
                        </p>
                      </div>

                      {/* Quiet Clickable Tags */}
                      <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                        {item.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                            className={`hover:text-[#326BFF] dark:hover:text-[#F8C300] transition-colors ${
                              activeTag === tag ? 'text-[#326BFF] dark:text-[#F8C300] font-bold underline' : ''
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => sendItemToBuilder(item)}
                      className="flex-1 py-2.5 px-3 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Experimentar con este prompt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openLightbox(item)}
                      className="py-2.5 px-3 text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] text-[#101014] dark:text-[#F4F2ED] transition-colors whitespace-nowrap"
                    >
                      Ficha y variaciones
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Inspection & Variation Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-[#101014]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Visor de referencia: ${lightboxItem.title}`}
        >
          <div className="w-full max-w-6xl bg-[#F4F2ED] dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-2xl overflow-hidden shadow-2xl my-auto">
            {/* Lightbox Top Bar */}
            <div className="px-5 py-3.5 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#101014] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                <span className="font-bold text-[#7545D6] dark:text-[#F8C300]">
                  {lightboxItem.code}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#101014] dark:text-[#F4F2ED]">
                  {lightboxItem.collection}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#5B5B66] dark:text-[#A09E97]">
                  {lightboxItem.provenance}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateLightbox(-1)}
                  className="p-2 rounded-lg border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300]"
                  aria-label="Lámina anterior"
                  title="Anterior (Flecha Izquierda)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateLightbox(1)}
                  className="p-2 rounded-lg border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300]"
                  aria-label="Siguiente lámina"
                  title="Siguiente (Flecha Derecha)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="p-2 rounded-lg bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014]"
                  aria-label="Cerrar visor"
                  title="Cerrar (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Two-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
              {/* Left Column: High-Res Image & Provenance Note */}
              <div className="lg:col-span-6 bg-[#101014] p-5 flex flex-col justify-between gap-4">
                <div className="flex-1 flex items-center justify-center">
                  <ResilientImage
                    src={lightboxItem.image}
                    alt={lightboxItem.alt}
                    aspectRatio={lightboxItem.aspectRatio}
                    objectPosition={lightboxItem.objectPosition || 'center'}
                    containerClassName="w-full max-h-[58vh] rounded-xl overflow-hidden"
                  />
                </div>
                <div className="text-[11px] font-mono-code text-[#A09E97] border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-2">
                  <span>{lightboxItem.toolReference}</span>
                  <span>Parámetros de estética equivalente · sin EXIF inventado</span>
                </div>
              </div>

              {/* Right Column: Editable Prompt, Variations, Specs & Actions */}
              <div className="lg:col-span-6 p-6 space-y-5 overflow-y-auto">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono-code font-bold uppercase text-[#326BFF] dark:text-[#F8C300]">
                      {lightboxItem.style} · {lightboxItem.technique}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(lightboxItem.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border inline-flex items-center gap-1.5 ${
                        favorites.includes(lightboxItem.id)
                          ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                          : 'border-[#D4D0C5] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED]'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>
                        {favorites.includes(lightboxItem.id) ? 'Guardada' : 'Guardar'}
                      </span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                    {lightboxItem.title}
                  </h2>
                  <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                    {lightboxItem.technicalExplanation}
                  </p>
                  <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">Aplicación:</strong>{' '}
                    {lightboxItem.applicationExample}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-[11px] p-3.5 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">Cámara equiv.</span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">{lightboxItem.specs.camera}</strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">Óptica</span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">{lightboxItem.specs.lens} ({lightboxItem.specs.aperture})</strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">Iluminación</span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">{lightboxItem.specs.lighting}</strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">Colorimetría</span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">{lightboxItem.specs.color}</strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">Composición</span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">{lightboxItem.specs.composition}</strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">Textura y atmósfera</span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">{lightboxItem.specs.texture}</strong>
                  </div>
                </div>

                {/* Editable Prompt + Language Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
                        Prompt editable
                      </span>
                      <div className="inline-flex rounded border border-[#D4D0C5] dark:border-[#2C2C36] overflow-hidden text-[11px] font-mono-code">
                        <button
                          type="button"
                          onClick={() => switchLightboxLanguage('es')}
                          className={`px-2 py-0.5 ${
                            promptLang === 'es'
                              ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] font-bold'
                              : 'bg-white dark:bg-[#101014]'
                          }`}
                        >
                          ES
                        </button>
                        <button
                          type="button"
                          onClick={() => switchLightboxLanguage('en')}
                          className={`px-2 py-0.5 ${
                            promptLang === 'en'
                              ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] font-bold'
                              : 'bg-white dark:bg-[#101014]'
                          }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(lightboxDraftPrompt, 'lightbox-prompt')}
                      className="text-xs font-semibold text-[#326BFF] dark:text-[#F8C300] inline-flex items-center gap-1 hover:underline"
                    >
                      {copiedId === 'lightbox-prompt' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Prompt copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={lightboxDraftPrompt}
                    onChange={(e) => setLightboxDraftPrompt(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#101014] border border-[#D4D0C5] dark:border-[#2C2C36] text-xs font-mono-code text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF] leading-relaxed"
                  />
                </div>

                {/* Negative Prompt */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                      NEGATIVE PROMPT (EVITAR)
                    </div>
                    <p className="text-[11px] font-mono-code text-[#4A4A55] dark:text-[#B4B2AC]">
                      {lightboxItem.negativePrompt}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(lightboxItem.negativePrompt, 'lightbox-neg')}
                    className="px-2.5 py-1.5 text-[11px] font-semibold rounded border border-[#D4D0C5] dark:border-[#2C2C36] shrink-0"
                  >
                    {copiedId === 'lightbox-neg' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>

                {/* 1-Click Prompt Variations */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97] flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-[#7545D6]" />
                    <span>Variaciones rápidas (clic para mezclar al prompt)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lightboxItem.variations.map((v) => (
                      <button
                        key={v.label}
                        type="button"
                        onClick={() => applyVariationInLightbox(v)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6] text-[#101014] dark:text-[#F4F2ED] transition-colors"
                      >
                        + {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Lightbox CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      sendItemToBuilder(
                        lightboxItem,
                        lightboxDraftPrompt,
                        appliedVariationPatch
                      )
                    }
                    className="flex-1 py-3 px-4 text-xs sm:text-sm font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Experimentar en Constructor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const mod = lightboxItem.relatedModuleId;
                      setLightboxItem(null);
                      onOpenTechnicalModule(mod);
                    }}
                    className="py-3 px-4 text-xs font-semibold rounded-xl border border-[#D4D0C5] dark:border-[#2C2C36] bg-white dark:bg-[#101014] hover:border-[#326BFF] inline-flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#326BFF]" />
                    <span>Ver Módulo Técnico</span>
                  </button>

                  {onAnalyzeInJsonLab && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = lightboxItem;
                        setLightboxItem(null);
                        onAnalyzeInJsonLab(target);
                      }}
                      className="py-3 px-4 text-xs font-semibold rounded-xl border border-[#D4D0C5] dark:border-[#2C2C36] bg-white dark:bg-[#101014] hover:border-[#7545D6] inline-flex items-center gap-1.5"
                    >
                      <Braces className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                      <span>Abrir en JSON Lab</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
