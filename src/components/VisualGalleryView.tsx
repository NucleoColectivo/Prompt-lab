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
  Sun,
  Aperture,
  MapPin,
  Download,
  Clapperboard,
  FlaskConical,
  FileText,
  Award,
  Flame,
  Repeat2,
  Palette,
} from 'lucide-react';
import { RecreateImageModal } from './RecreateImageModal';
import {
  GALLERY_COLLECTIONS,
  GALLERY_VISUAL_ITEMS,
  GalleryVisualItem,
  PromptVariationOption,
} from '../data/galleryCollectionsData';
import type { ModuleId } from '../data/modulesData';
import type { JsonStyleProfile } from '../data/videoAndJsonData';
import type { PromptBuilderState } from './PromptBuilder';
import type { StoryboardSceneItem } from './InteractiveCreativeLabs';
import { ResilientImage } from './ResilientImage';
import { SectionPhotoBanner } from './SectionPhotoBanner';
import { VISUAL_LIBRARY_PATHS } from '../data/visualLibraryRegistry';
import { motion } from 'motion/react';
import {
  EDITORIAL_EASE,
  StaggerGroup,
  StaggerItem,
  VIEWPORT_CONFIG,
} from './MotionPrimitives';
import {
  ResearchPathId,
  ResearchHypothesisOption,
  VideoMovementPreset,
  LIGHTING_HYPOTHESES,
  LENS_HYPOTHESES,
  CONTEXT_HYPOTHESES,
  VIDEO_MOVEMENT_PRESETS,
  buildCombinedExperimentPrompt,
  buildCombinedBuilderPatch,
  buildPlateJsonProfile,
  buildStoryboardSceneFromPlate,
  exportPlateResearchSheetText,
} from '../utils/galleryResearchEngine';

export interface VisualGalleryViewProps {
  activeCollection: string;
  onChangeCollection: (collection: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onExperimentInBuilder: (patch: Partial<PromptBuilderState>) => void;
  onOpenTechnicalModule: (moduleId: ModuleId) => void;
  onAnalyzeInJsonLab?: (item: GalleryVisualItem, customProfile?: JsonStyleProfile) => void;
  onAddToStoryboard?: (scene: StoryboardSceneItem) => void;
  onSendToMoodboard?: (item: GalleryVisualItem) => void;
  onOpenLabs?: () => void;
}

type SortOption = 'curated' | 'az' | 'favorites';
type LayoutMode = 'masonry' | 'grid';

const GALLERY_NOTES_KEY = 'nc_gallery_notes_v1';

function getGalleryBannerVisual(collection: string): {
  image: string;
  alt: string;
  position?: 'center' | 'top' | 'bottom';
} {
  switch (collection) {
    case 'Retrato':
      return {
        image: VISUAL_LIBRARY_PATHS.lightRembrandt,
        alt: 'Colección Retrato — Fotografía de retrato e iluminación editorial',
        position: 'top',
      };
    case 'Paisaje':
      return {
        image: VISUAL_LIBRARY_PATHS.compExtremeWide,
        alt: 'Colección Paisaje — Gran plano general y atmósfera natural',
        position: 'center',
      };
    case 'Producto':
      return {
        image: VISUAL_LIBRARY_PATHS.adSplash,
        alt: 'Colección Producto — Fotografía comercial de producto y dirección de arte',
        position: 'center',
      };
    case 'Arte Digital':
      return {
        image: VISUAL_LIBRARY_PATHS.artHybridOrganism,
        alt: 'Colección Arte Digital — Experimentación visual y arte híbrido',
        position: 'center',
      };
    case 'Moda':
      return {
        image: VISUAL_LIBRARY_PATHS.photoFashion,
        alt: 'Colección Moda — Dirección editorial de moda y vestuario',
        position: 'top',
      };
    case 'Cine':
      return {
        image: VISUAL_LIBRARY_PATHS.colorTealOrange,
        alt: 'Colección Cine — Cinematografía, encuadre y etalonaje de color',
        position: 'center',
      };
    case 'Macro y Naturaleza':
      return {
        image: VISUAL_LIBRARY_PATHS.focal100mmMacro,
        alt: 'Colección Macro y Naturaleza — Óptica macro y detalle orgánico',
        position: 'center',
      };
    case 'Motion y Video':
      return {
        image: VISUAL_LIBRARY_PATHS.videoDroneFpv,
        alt: 'Colección Motion y Video — Movimiento de cámara y secuencias IA',
        position: 'center',
      };
    default:
      return {
        image: VISUAL_LIBRARY_PATHS.videoGalleryTour,
        alt: 'Galería de Investigación Visual y Construcción de Imágenes',
        position: 'center',
      };
  }
}

export const VisualGalleryView: React.FC<VisualGalleryViewProps> = ({
  activeCollection,
  onChangeCollection,
  favorites,
  onToggleFavorite,
  onExperimentInBuilder,
  onOpenTechnicalModule,
  onAnalyzeInJsonLab,
  onAddToStoryboard,
  onSendToMoodboard,
  onOpenLabs,
}) => {
  const normalizedActiveCollection = useMemo(
    () => (activeCollection === 'Todas' ? 'Todas' : activeCollection.replace(/^\d+\.\s*/, '')),
    [activeCollection]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Todos');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('Todas');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [activeTag, setActiveTag] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [curationFilter, setCurationFilter] = useState<'all' | 'editorial' | 'trending'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('curated');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('masonry');

  const [promptLang, setPromptLang] = useState<'es' | 'en'>('es');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryVisualItem | null>(null);
  const [recreateTarget, setRecreateTarget] = useState<GalleryVisualItem | null>(null);
  const [lightboxDraftPrompt, setLightboxDraftPrompt] = useState('');
  const [appliedVariationPatch, setAppliedVariationPatch] =
    useState<PromptVariationOption['patch'] | null>(null);

  // 5-Path Visual Research Lab state inside Lightbox
  const [activeResearchPath, setActiveResearchPath] = useState<ResearchPathId>('lighting');
  const [selectedLighting, setSelectedLighting] = useState<ResearchHypothesisOption | null>(null);
  const [selectedLens, setSelectedLens] = useState<ResearchHypothesisOption | null>(null);
  const [selectedContext, setSelectedContext] = useState<ResearchHypothesisOption | null>(null);
  const [selectedVideoPreset, setSelectedVideoPreset] = useState<VideoMovementPreset>(
    VIDEO_MOVEMENT_PRESETS[0]
  );
  const [researchNotes, setResearchNotes] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem(GALLERY_NOTES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(GALLERY_NOTES_KEY, JSON.stringify(researchNotes));
    } catch {
      // ignore storage quota errors
    }
  }, [researchNotes]);

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
    () => GALLERY_COLLECTIONS.find((c) => c.id === normalizedActiveCollection) || null,
    [normalizedActiveCollection]
  );

  const editorialPickIds = useMemo(() => {
    const picked = new Set<string>();
    const perCollection: Record<string, number> = {};
    for (const item of GALLERY_VISUAL_ITEMS) {
      const count = perCollection[item.collection] || 0;
      if (count < 2) {
        picked.add(item.id);
        perCollection[item.collection] = count + 1;
      }
    }
    return picked;
  }, []);

  const trendingIds = useMemo(() => {
    const trends = new Set<string>();
    for (const item of GALLERY_VISUAL_ITEMS) {
      const text = `${item.style} ${item.technique} ${item.tags.join(' ')}`.toLowerCase();
      if (
        item.mediaType === 'video' ||
        /brutalist|3d|generativ|anamorph|noir|híbrid|splash|macro|json|editorial/.test(text)
      ) {
        trends.add(item.id);
      }
    }
    return trends;
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = GALLERY_VISUAL_ITEMS.filter((item) => {
      const matchCol =
        normalizedActiveCollection === 'Todas' || item.collection === normalizedActiveCollection;
      const matchStyle = selectedStyle === 'Todos' || item.style === selectedStyle;
      const matchTech = selectedTechnique === 'Todas' || item.technique === selectedTechnique;
      const matchMedia = mediaFilter === 'all' || item.mediaType === mediaFilter;
      const matchTag = !activeTag || item.tags.includes(activeTag);
      const matchFav = !onlyFavorites || favorites.includes(item.id);
      const matchCuration =
        curationFilter === 'all' ||
        (curationFilter === 'editorial' && editorialPickIds.has(item.id)) ||
        (curationFilter === 'trending' && trendingIds.has(item.id));
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.technicalExplanation.toLowerCase().includes(q) ||
        item.toolReference.toLowerCase().includes(q) ||
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
        matchCuration &&
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
    normalizedActiveCollection,
    selectedStyle,
    selectedTechnique,
    mediaFilter,
    activeTag,
    onlyFavorites,
    curationFilter,
    editorialPickIds,
    trendingIds,
    favorites,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    normalizedActiveCollection !== 'Todas' ||
    selectedStyle !== 'Todos' ||
    selectedTechnique !== 'Todas' ||
    mediaFilter !== 'all' ||
    activeTag !== '' ||
    onlyFavorites ||
    curationFilter !== 'all' ||
    searchQuery.trim() !== '';

  const resetAllFilters = () => {
    onChangeCollection('Todas');
    setSelectedStyle('Todos');
    setSelectedTechnique('Todas');
    setMediaFilter('all');
    setActiveTag('');
    setOnlyFavorites(false);
    setCurationFilter('all');
    setSearchQuery('');
    setSortBy('curated');
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const openLightbox = useCallback(
    (item: GalleryVisualItem, initialPath: ResearchPathId = 'lighting') => {
      setLightboxItem(item);
      setLightboxDraftPrompt(promptLang === 'es' ? item.promptEs : item.promptEn);
      setAppliedVariationPatch(null);
      setActiveResearchPath(initialPath);
      setSelectedLighting(null);
      setSelectedLens(null);
      setSelectedContext(null);
      setSelectedVideoPreset(VIDEO_MOVEMENT_PRESETS[0]);
    },
    [promptLang]
  );

  // Sync draft prompt when switching ES/EN inside Lightbox
  const switchLightboxLanguage = (lang: 'es' | 'en') => {
    setPromptLang(lang);
    if (lightboxItem) {
      const combined = buildCombinedExperimentPrompt(
        lightboxItem,
        lang,
        selectedLighting,
        selectedLens,
        selectedContext
      );
      setLightboxDraftPrompt(combined);
      setAppliedVariationPatch(null);
    }
  };

  // Sync draft prompt whenever the researcher toggles Lighting / Lens / Context hypotheses
  const updateResearchHypothesis = (
    kind: 'lighting' | 'lens' | 'context',
    option: ResearchHypothesisOption
  ) => {
    if (!lightboxItem) return;
    const nextLight =
      kind === 'lighting'
        ? selectedLighting?.id === option.id
          ? null
          : option
        : selectedLighting;
    const nextLens =
      kind === 'lens'
        ? selectedLens?.id === option.id
          ? null
          : option
        : selectedLens;
    const nextCtx =
      kind === 'context'
        ? selectedContext?.id === option.id
          ? null
          : option
        : selectedContext;

    setSelectedLighting(nextLight);
    setSelectedLens(nextLens);
    setSelectedContext(nextCtx);
    setAppliedVariationPatch(null);
    setLightboxDraftPrompt(
      buildCombinedExperimentPrompt(lightboxItem, promptLang, nextLight, nextLens, nextCtx)
    );
  };

  const resetLightboxExperiments = () => {
    if (!lightboxItem) return;
    setSelectedLighting(null);
    setSelectedLens(null);
    setSelectedContext(null);
    setAppliedVariationPatch(null);
    setLightboxDraftPrompt(promptLang === 'es' ? lightboxItem.promptEs : lightboxItem.promptEn);
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
      setSelectedLighting(null);
      setSelectedLens(null);
      setSelectedContext(null);
    },
    [lightboxItem, filteredItems, promptLang]
  );

  useEffect(() => {
    if (!lightboxItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'TEXTAREA' || targetTag === 'INPUT') {
        if (e.key === 'Escape') setLightboxItem(null);
        return;
      }
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
    variationPatch?: PromptVariationOption['patch'] | null,
    asVideoExperiment?: boolean
  ) => {
    const combinedPatch = buildCombinedBuilderPatch(
      item,
      promptLang,
      selectedLighting,
      selectedLens,
      selectedContext,
      asVideoExperiment ? selectedVideoPreset : null
    );

    const promptToLoad =
      customPrompt || (promptLang === 'es' ? item.promptEs : item.promptEn);

    const patch: Partial<PromptBuilderState> = {
      ...combinedPatch,
      subject: asVideoExperiment
        ? combinedPatch.subject
        : promptToLoad,
      lens: variationPatch?.lens || combinedPatch.lens || item.specs.lens,
      lighting: variationPatch?.lighting || combinedPatch.lighting || item.specs.lighting,
      colorPalette: variationPatch?.colorPalette || combinedPatch.colorPalette || item.specs.color,
      aspectRatio: variationPatch?.aspectRatio || item.aspectRatio,
      motion:
        variationPatch?.motion ||
        combinedPatch.motion ||
        (item.mediaType === 'video'
          ? 'Smooth controlled cinematic camera movement at 24fps'
          : undefined),
    };

    setLightboxItem(null);
    onExperimentInBuilder(patch);
  };

  const liveJsonProfile = useMemo(() => {
    if (!lightboxItem) return null;
    return buildPlateJsonProfile(
      lightboxItem,
      selectedLighting,
      selectedLens,
      selectedContext
    );
  }, [lightboxItem, selectedLighting, selectedLens, selectedContext]);

  const liveVideoSequencePrompt = useMemo(() => {
    if (!lightboxItem) return '';
    const base = buildCombinedExperimentPrompt(
      lightboxItem,
      promptLang,
      selectedLighting,
      selectedLens,
      selectedContext
    );
    const suffix =
      promptLang === 'es'
        ? selectedVideoPreset.promptSuffixEs
        : selectedVideoPreset.promptSuffixEn;
    return `${base} — [${suffix}]`;
  }, [
    lightboxItem,
    promptLang,
    selectedLighting,
    selectedLens,
    selectedContext,
    selectedVideoPreset,
  ]);

  const handleDownloadResearchDossier = () => {
    if (!lightboxItem || !liveJsonProfile) return;
    const promptEs = buildCombinedExperimentPrompt(
      lightboxItem,
      'es',
      selectedLighting,
      selectedLens,
      selectedContext
    );
    const promptEn = buildCombinedExperimentPrompt(
      lightboxItem,
      'en',
      selectedLighting,
      selectedLens,
      selectedContext
    );
    const content = exportPlateResearchSheetText(
      lightboxItem,
      promptEs,
      promptEn,
      liveVideoSequencePrompt,
      liveJsonProfile,
      researchNotes[lightboxItem.id] || ''
    );
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lightboxItem.code.toLowerCase()}-investigacion-visual.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const galleryBanner = useMemo(
    () => getGalleryBannerVisual(normalizedActiveCollection),
    [normalizedActiveCollection]
  );

  return (
    <section
      id="galeria"
      className="pb-12 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] transition-colors"
    >
      {/* Full-bleed Photographic Hero Banner — Dynamically changes per selected collection */}
      <SectionPhotoBanner
        image={galleryBanner.image}
        imageAlt={galleryBanner.alt}
        imagePosition={galleryBanner.position}
        accentTint="obsidian"
        kicker={
          <>
            <span>INVESTIGACIÓN VISUAL COLECTIVA</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-[#93B4FF]">{GALLERY_VISUAL_ITEMS.length} LÁMINAS CURADAS</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-[#C4A5FF]">
              {normalizedActiveCollection === 'Todas'
                ? '5 CAMINOS DE EXPERIMENTACIÓN'
                : `COLECCIÓN ${normalizedActiveCollection.toUpperCase()}`}
            </span>
          </>
        }
        topRight={
          <div className="flex flex-wrap items-center gap-2">
            {/* ES/EN Toggle */}
            <div className="inline-flex rounded-lg border border-white/20 overflow-hidden bg-[#101014]/70 backdrop-blur-xs text-xs font-mono-code font-bold">
              <button
                type="button"
                onClick={() => setPromptLang('es')}
                className={`px-3 py-2 transition-colors cursor-pointer ${
                  promptLang === 'es'
                    ? 'bg-[#F8C300] text-[#101014]'
                    : 'text-[#D8D5CD] hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setPromptLang('en')}
                className={`px-3 py-2 transition-colors cursor-pointer ${
                  promptLang === 'en'
                    ? 'bg-[#F8C300] text-[#101014]'
                    : 'text-[#D8D5CD] hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Layout Mode Switcher */}
            <div className="inline-flex rounded-lg border border-white/20 overflow-hidden bg-[#101014]/70 backdrop-blur-xs text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLayoutMode('masonry')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  layoutMode === 'masonry'
                    ? 'bg-[#326BFF] text-white font-bold'
                    : 'text-[#D8D5CD] hover:text-white'
                }`}
                title="Vista Masonry Editorial"
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Masonry</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-[#326BFF] text-white font-bold'
                    : 'text-[#D8D5CD] hover:text-white'
                }`}
                title="Retícula Uniforme"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Retícula</span>
              </button>
            </div>
          </div>
        }
        title={
          normalizedActiveCollection === 'Todas'
            ? 'Galería de Investigación Visual y Construcción de Imágenes'
            : `Galería Visual · ${normalizedActiveCollection}`
        }
        subtitle={`Más que un catálogo: cada una de las ${GALLERY_VISUAL_ITEMS.length} láminas curadas desglosa cómo se construye y abre cinco rutas experimentales para probar variaciones de luz, óptica, contexto, secuencia de video y JSON reutilizable.`}
        actions={
          <>
            <button
              type="button"
              onClick={() => onOpenTechnicalModule('mod-01')}
              className="px-4 py-2 rounded-lg bg-[#326BFF] hover:bg-[#2358E6] text-white text-xs font-mono-code inline-flex items-center gap-1.5 font-bold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explorar 26 Módulos</span>
            </button>
            {onOpenLabs && (
              <button
                type="button"
                onClick={onOpenLabs}
                className="px-4 py-2 rounded-lg bg-[#7545D6] hover:bg-[#6134BF] text-white text-xs font-mono-code inline-flex items-center gap-1.5 font-bold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Practicar en Laboratorios</span>
              </button>
            )}
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* 5-Path Collective Visual Research Strip — Violet Studio Frame */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#ECE8F7] dark:bg-[#191628] border border-[#D4C9EE] dark:border-[#302A4B] space-y-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase tracking-wider text-[#3F2082] dark:text-[#E5D7FF]">
              <FlaskConical className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300]" />
              <span>Una misma imagen puede abrir 5 caminos de investigación</span>
            </div>
            <span className="text-[11px] font-mono-code text-[#564B73] dark:text-[#B5AED0]">
              Haz clic en cualquier camino para probarlo sobre la lámina activa
            </span>
          </div>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5" stagger={0.045}>
            {[
              {
                id: 'lighting' as ResearchPathId,
                num: '01',
                question: '¿Si cambiamos la iluminación?',
                detail: 'Rembrandt, Rim Light, High Key, Split o ventana',
                topBar: 'bg-[#F8C300]',
                numColor: 'text-[#A67000] dark:text-[#F8C300]',
                hoverBorder: 'hover:border-[#D4A600] dark:hover:border-[#F8C300]',
              },
              {
                id: 'lens' as ResearchPathId,
                num: '02',
                question: '¿Si cambiamos el lente?',
                detail: '24mm angular, 35mm, 50mm, 85mm o 100mm macro',
                topBar: 'bg-[#326BFF]',
                numColor: 'text-[#2354D1] dark:text-[#8FB0FF]',
                hoverBorder: 'hover:border-[#326BFF] dark:hover:border-[#8FB0FF]',
              },
              {
                id: 'context' as ResearchPathId,
                num: '03',
                question: '¿Si cambiamos de contexto?',
                detail: 'Taller, galería brutalista, lluvia nocturna o páramo',
                topBar: 'bg-[#059669]',
                numColor: 'text-[#047857] dark:text-[#34D399]',
                hoverBorder: 'hover:border-[#059669] dark:hover:border-[#34D399]',
              },
              {
                id: 'video' as ResearchPathId,
                num: '04',
                question: '¿Si la volvemos video?',
                detail: 'Dolly In, Tracking, Orbit o Crane al Constructor / Storyboard',
                topBar: 'bg-[#7545D6]',
                numColor: 'text-[#6134BF] dark:text-[#C4A5FF]',
                hoverBorder: 'hover:border-[#7545D6] dark:hover:border-[#C4A5FF]',
              },
              {
                id: 'json' as ResearchPathId,
                num: '05',
                question: '¿Si la pasamos a JSON?',
                detail: 'Esquema reutilizable para preservar estética exacta',
                topBar: 'bg-[#E11D48]',
                numColor: 'text-[#BE123C] dark:text-[#FB7185]',
                hoverBorder: 'hover:border-[#E11D48] dark:hover:border-[#FB7185]',
              },
            ].map((path) => (
              <StaggerItem key={path.id} lift>
                <button
                  type="button"
                  onClick={() => {
                    const seedItem = filteredItems[0] || GALLERY_VISUAL_ITEMS[0];
                    openLightbox(seedItem, path.id);
                  }}
                  className={`w-full h-full text-left rounded-xl bg-white dark:bg-[#12111B] border border-[#DDD5EF] dark:border-[#2C2744] overflow-hidden transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col ${path.hoverBorder}`}
                >
                  <div className={`h-1 w-full ${path.topBar}`} />
                  <div className="p-3 space-y-1 flex-1">
                    <div className={`text-[10px] font-mono-code font-bold tabular-nums ${path.numColor}`}>
                      CAMINO {path.num}
                    </div>
                    <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] leading-snug">
                      {path.question}
                    </div>
                    <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC] leading-snug">
                      {path.detail}
                    </p>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* 8 Collection Selector Strip */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChangeCollection('Todas')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                normalizedActiveCollection === 'Todas'
                  ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] shadow-xs'
                  : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#D4A600]'
              }`}
            >
              Todas ({collectionCounts.Todas})
            </button>
            {GALLERY_COLLECTIONS.map((col, idx) => {
              const isActive = normalizedActiveCollection === col.id;
              const collectionPalettes = [
                { active: 'bg-[#101014] text-[#F8C300] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014]', dot: 'bg-[#D97706]' },
                { active: 'bg-[#059669] text-white border-[#059669]', dot: 'bg-[#059669]' },
                { active: 'bg-[#EA580C] text-white border-[#EA580C]', dot: 'bg-[#EA580C]' },
                { active: 'bg-[#7545D6] text-white border-[#7545D6]', dot: 'bg-[#7545D6]' },
                { active: 'bg-[#E11D48] text-white border-[#E11D48]', dot: 'bg-[#E11D48]' },
                { active: 'bg-[#326BFF] text-white border-[#326BFF]', dot: 'bg-[#326BFF]' },
                { active: 'bg-[#0D9488] text-white border-[#0D9488]', dot: 'bg-[#0D9488]' },
                { active: 'bg-[#4F46E5] text-white border-[#4F46E5]', dot: 'bg-[#4F46E5]' },
              ];
              const palette = collectionPalettes[idx % collectionPalettes.length];
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => onChangeCollection(col.id)}
                  className={`px-3.5 py-2 text-xs rounded-lg border transition-all whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? `${palette.active} font-bold shadow-xs`
                      : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] font-semibold hover:border-[#101014] dark:hover:border-white/30'
                  }`}
                >
                  {!isActive && (
                    <span aria-hidden="true" className={`w-2 h-2 rounded-xs shrink-0 ${palette.dot}`} />
                  )}
                  <span>
                    {col.number}. {col.title} ({collectionCounts[col.id] || 0})
                  </span>
                </button>
              );
            })}
          </div>

          {activeCollectionMeta && (
            <div className="px-4 py-3 rounded-xl bg-[#101014] text-[#F4F2ED] border border-[#26262E] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
              <div>
                <span className="font-mono-code font-bold text-[#F8C300] mr-2">
                  COLECCIÓN {activeCollectionMeta.number} · {activeCollectionMeta.title.toUpperCase()}
                </span>
                <span className="text-[#D8D5CD]">
                  {activeCollectionMeta.description}
                </span>
              </div>
              <span className="font-mono-code text-[#93B4FF] font-semibold shrink-0 tabular-nums">
                {filteredItems.length} resultados
              </span>
            </div>
          )}
        </div>

        {/* Multi-Filter Toolbar — Warm Architectural Stone Surface */}
        <div className="p-4 rounded-xl bg-[#EAE6DC] dark:bg-[#16161E] border border-[#D4CFC2] dark:border-[#282834] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-[#5B5B66] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por lente, luz, tag, ID o prompt..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-[#101014] border border-[#D4CFC2] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
              />
            </div>

            {/* Style Select */}
            <div className="md:col-span-3">
              <select
                aria-label="Filtrar por estilo"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-[#101014] border border-[#D4CFC2] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
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
                className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-[#101014] border border-[#D4CFC2] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
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
                className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-[#101014] border border-[#D4CFC2] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
              >
                <option value="curated">Orden: Curado</option>
                <option value="az">Orden: A–Z</option>
                <option value="favorites">Orden: Favoritos</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono-code font-bold text-[#4A4A55] dark:text-[#A09E97] inline-flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Tipo:</span>
              </span>
              {[
                {
                  id: 'all' as const,
                  label: 'Todos',
                  icon: null,
                  activeClass: 'bg-[#326BFF] text-white border-[#326BFF]',
                },
                {
                  id: 'image' as const,
                  label: 'Imagen / Foto',
                  icon: <Camera className="w-3 h-3" />,
                  activeClass: 'bg-[#059669] text-white border-[#059669]',
                },
                {
                  id: 'video' as const,
                  label: 'Motion / Video',
                  icon: <Film className="w-3 h-3" />,
                  activeClass: 'bg-[#7545D6] text-white border-[#7545D6]',
                },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMediaFilter(m.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                    mediaFilter === m.id
                      ? `${m.activeClass} font-bold shadow-xs`
                      : 'bg-white dark:bg-[#101014] text-[#3A3A46] dark:text-[#B4B2AC] border-[#D4CFC2] dark:border-[#2C2C36] hover:border-[#326BFF]'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurationFilter((prev) => (prev === 'editorial' ? 'all' : 'editorial'))
                }
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                  curationFilter === 'editorial'
                    ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F8C300] dark:text-[#101014] border-transparent font-bold'
                    : 'bg-white dark:bg-[#101014] text-[#3A3A46] dark:text-[#B4B2AC] border-[#D4CFC2] dark:border-[#2C2C36] hover:border-[#101014]'
                }`}
              >
                <Award className="w-3 h-3 text-[#B47B00] dark:text-[#F8C300]" />
                <span>Selección Editorial ({editorialPickIds.size})</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurationFilter((prev) => (prev === 'trending' ? 'all' : 'trending'))
                }
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                  curationFilter === 'trending'
                    ? 'bg-[#EA580C] text-white border-[#EA580C] font-bold'
                    : 'bg-white dark:bg-[#101014] text-[#3A3A46] dark:text-[#B4B2AC] border-[#D4CFC2] dark:border-[#2C2C36] hover:border-[#EA580C]'
                }`}
              >
                <Flame className="w-3 h-3 text-[#EA580C]" />
                <span>Tendencias ({trendingIds.size})</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                  onlyFavorites
                    ? 'bg-[#7545D6] text-white border-[#7545D6] font-bold'
                    : 'bg-white dark:bg-[#101014] text-[#3A3A46] dark:text-[#B4B2AC] border-[#D4CFC2] dark:border-[#2C2C36] hover:border-[#7545D6]'
                }`}
              >
                <Bookmark className="w-3 h-3 text-[#7545D6] dark:text-[#C4A5FF]" />
                <span>Solo favoritas ({favorites.length})</span>
              </button>

              {activeTag && (
                <button
                  type="button"
                  onClick={() => setActiveTag('')}
                  className="px-2.5 py-1.5 text-xs font-mono-code font-bold rounded-lg bg-[#F8C300] border border-[#D4A600] text-[#101014] inline-flex items-center gap-1 cursor-pointer"
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
            {filteredItems.map((item, idx) => {
              const isFav = favorites.includes(item.id);
              const displayedPrompt = promptLang === 'es' ? item.promptEs : item.promptEn;

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_CONFIG}
                  transition={{
                    duration: 0.44,
                    delay: Math.min((idx % 3) * 0.06, 0.14),
                    ease: EDITORIAL_EASE,
                  }}
                  className={`${
                    layoutMode === 'masonry' ? 'break-inside-avoid mb-6' : 'h-full flex flex-col justify-between'
                  } rounded-2xl overflow-hidden bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] nc-card-lift group`}
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
                        <div>
                          <strong className="text-[#101014] dark:text-[#F4F2ED]">Herramienta:</strong>{' '}
                          <span className="font-mono-code text-[#326BFF] dark:text-[#F8C300]">
                            {item.toolReference}
                          </span>
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
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
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
                        {researchNotes[item.id]?.trim() && (
                          <span className="text-[#7545D6] dark:text-[#F8C300] font-semibold">
                            · Nota guardada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-[#DEDAD0] dark:border-[#26262E] flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRecreateTarget(item)}
                      className="flex-1 py-2.5 px-3 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Repeat2 className="w-3.5 h-3.5" />
                      <span>Recrear imagen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => sendItemToBuilder(item)}
                      className="py-2.5 px-3 text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] text-[#101014] dark:text-[#F4F2ED] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                      title="Abrir parámetros en el Constructor Modular"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300]" />
                      <span>Constructor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openLightbox(item, 'lighting')}
                      className="py-2.5 px-3 text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#7545D6] text-[#101014] dark:text-[#F4F2ED] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                      title="Abrir ficha e investigación de 5 caminos"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                      <span>5 caminos</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Inspection & Variation Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-[#101014]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto nc-animate-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Visor de referencia: ${lightboxItem.title}`}
        >
          <div className="w-full max-w-6xl bg-[#F4F2ED] dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-2xl overflow-hidden shadow-2xl my-auto nc-animate-panel">
            {/* Lightbox Top Bar */}
            <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#101014] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code min-w-0">
                <span className="font-bold text-[#7545D6] dark:text-[#F8C300]">
                  {lightboxItem.code}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#101014] dark:text-[#F4F2ED]">
                  {lightboxItem.collection}
                </span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="hidden sm:inline text-[#5B5B66] dark:text-[#A09E97]">
                  {lightboxItem.provenance}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigateLightbox(-1)}
                  className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300]"
                  aria-label="Lámina anterior"
                  title="Anterior (Flecha Izquierda)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateLightbox(1)}
                  className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300]"
                  aria-label="Siguiente lámina"
                  title="Siguiente (Flecha Derecha)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014]"
                  aria-label="Cerrar visor"
                  title="Cerrar (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Two-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto lg:overflow-hidden">
              {/* Left Column: High-Res Image & Provenance Note */}
              <div className="lg:col-span-6 bg-[#101014] p-4 sm:p-5 flex flex-col justify-between gap-4">
                <div className="flex-1 flex items-center justify-center">
                  <ResilientImage
                    src={lightboxItem.image}
                    alt={lightboxItem.alt}
                    aspectRatio={lightboxItem.aspectRatio}
                    objectPosition={lightboxItem.objectPosition || 'center'}
                    containerClassName="w-full max-h-[48vh] lg:max-h-[58vh] rounded-xl overflow-hidden"
                  />
                </div>
                <div className="text-[11px] font-mono-code text-[#A09E97] border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-2">
                  <span>{lightboxItem.toolReference}</span>
                  <span>Parámetros de estética equivalente · sin EXIF inventado</span>
                </div>
              </div>

              {/* Right Column: Editable Prompt, Variations, Specs & Actions */}
              <div className="lg:col-span-6 p-4 sm:p-6 space-y-5 lg:max-h-[82vh] lg:overflow-y-auto">
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

                {/* Live Specs Grid (reflects active Light/Lens/Context hypothesis) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] p-3.5 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">Cámara equiv.</span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">{lightboxItem.specs.camera}</strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">
                      Óptica {selectedLens ? '· modificada' : ''}
                    </span>
                    <strong className={selectedLens ? 'text-[#326BFF] dark:text-[#F8C300]' : 'text-[#101014] dark:text-[#F4F2ED]'}>
                      {selectedLens?.patch.lens || lightboxItem.specs.lens} ({selectedLens?.patch.aperture || lightboxItem.specs.aperture})
                    </strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">
                      Iluminación {selectedLighting ? '· modificada' : ''}
                    </span>
                    <strong className={selectedLighting ? 'text-[#326BFF] dark:text-[#F8C300]' : 'text-[#101014] dark:text-[#F4F2ED]'}>
                      {selectedLighting?.patch.lighting || lightboxItem.specs.lighting}
                    </strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">
                      Colorimetría {selectedContext?.patch.colorPalette ? '· modificada' : ''}
                    </span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">
                      {selectedContext?.patch.colorPalette || lightboxItem.specs.color}
                    </strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">Composición</span>
                    <strong className="text-[#101014] dark:text-[#F4F2ED]">
                      {selectedLens?.patch.composition || lightboxItem.specs.composition}
                    </strong>
                  </div>
                  <div>
                    <span className="font-mono-code text-[#5B5B66] dark:text-[#A09E97] block">
                      Escenario / Atmósfera {selectedContext ? '· modificado' : ''}
                    </span>
                    <strong className={selectedContext ? 'text-[#326BFF] dark:text-[#F8C300]' : 'text-[#101014] dark:text-[#F4F2ED]'}>
                      {selectedContext ? selectedContext.shortSpec : lightboxItem.specs.atmosphere}
                    </strong>
                  </div>
                </div>

                {/* 5-Path Visual Research Workbench */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Espacio de Experimentación (5 Caminos)</span>
                    </div>
                    {(selectedLighting || selectedLens || selectedContext) && (
                      <button
                        type="button"
                        onClick={resetLightboxExperiments}
                        className="text-[11px] font-mono-code font-semibold text-[#326BFF] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restablecer variables</span>
                      </button>
                    )}
                  </div>

                  {/* 5 Path Segmented Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 p-1.5 rounded-lg bg-[#F4F2ED] dark:bg-[#16161C]">
                    {[
                      { id: 'lighting' as ResearchPathId, label: '1. Luz', icon: <Sun className="w-3 h-3 shrink-0" />, active: !!selectedLighting },
                      { id: 'lens' as ResearchPathId, label: '2. Lente', icon: <Aperture className="w-3 h-3 shrink-0" />, active: !!selectedLens },
                      { id: 'context' as ResearchPathId, label: '3. Contexto', icon: <MapPin className="w-3 h-3 shrink-0" />, active: !!selectedContext },
                      { id: 'video' as ResearchPathId, label: '4. Video', icon: <Film className="w-3 h-3 shrink-0" />, active: false },
                      { id: 'json' as ResearchPathId, label: '5. JSON', icon: <Braces className="w-3 h-3 shrink-0" />, active: false },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveResearchPath(tab.id)}
                        className={`px-2.5 py-2 min-h-[38px] text-[11px] font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                          activeResearchPath === tab.id
                            ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] font-bold'
                            : tab.active
                            ? 'text-[#7545D6] dark:text-[#F8C300] font-bold'
                            : 'text-[#4A4A55] dark:text-[#B4B2AC] hover:text-[#101014] dark:hover:text-[#F4F2ED]'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Camino 1: Lighting */}
                  {activeResearchPath === 'lighting' && (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC]">
                        <strong>¿Qué sucede si cambiamos la iluminación?</strong> Elige una hipótesis lumínica para transformar el volumen y el tono emocional (puedes combinarla con Lente y Contexto):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {LIGHTING_HYPOTHESES.map((opt) => {
                          const isChosen = selectedLighting?.id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => updateResearchHypothesis('lighting', opt)}
                              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                                isChosen
                                  ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                                  : 'bg-[#F4F2ED] dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      {selectedLighting && (
                        <div className="p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#16161C] text-[11px] text-[#101014] dark:text-[#D8D5CD] leading-relaxed">
                          <strong className="text-[#7545D6] dark:text-[#F8C300]">
                            Efecto óptico/narrativo ({selectedLighting.shortSpec}):
                          </strong>{' '}
                          {selectedLighting.effectExplanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Camino 2: Lens */}
                  {activeResearchPath === 'lens' && (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC]">
                        <strong>¿Qué sucede si cambiamos el lente?</strong> Compara cómo varía la compresión espacial, profundidad de campo y lectura del sujeto:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {LENS_HYPOTHESES.map((opt) => {
                          const isChosen = selectedLens?.id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => updateResearchHypothesis('lens', opt)}
                              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                                isChosen
                                  ? 'bg-[#326BFF] text-white border-[#326BFF] font-bold'
                                  : 'bg-[#F4F2ED] dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      {selectedLens && (
                        <div className="p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#16161C] text-[11px] text-[#101014] dark:text-[#D8D5CD] leading-relaxed">
                          <strong className="text-[#326BFF] dark:text-[#F8C300]">
                            Efecto óptico ({selectedLens.shortSpec}):
                          </strong>{' '}
                          {selectedLens.effectExplanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Camino 3: Context */}
                  {activeResearchPath === 'context' && (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC]">
                        <strong>¿Qué sucede si trasladamos la escena a otro contexto?</strong> Reubica el mismo sujeto o gesto visual en otro territorio o espacio físico:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {CONTEXT_HYPOTHESES.map((opt) => {
                          const isChosen = selectedContext?.id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => updateResearchHypothesis('context', opt)}
                              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                                isChosen
                                  ? 'bg-[#7545D6] text-white border-[#7545D6] font-bold'
                                  : 'bg-[#F4F2ED] dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      {selectedContext && (
                        <div className="p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#16161C] text-[11px] text-[#101014] dark:text-[#D8D5CD] leading-relaxed">
                          <strong className="text-[#7545D6] dark:text-[#F8C300]">
                            Cambio narrativo ({selectedContext.shortSpec}):
                          </strong>{' '}
                          {selectedContext.effectExplanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Camino 4: Video Sequence */}
                  {activeResearchPath === 'video' && (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC]">
                        <strong>¿Qué sucede si transformamos esta fotografía en una secuencia de video?</strong> Selecciona un movimiento de cámara real para convertir el fotograma en toma audiovisual:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {VIDEO_MOVEMENT_PRESETS.map((preset) => {
                          const isChosen = selectedVideoPreset.id === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setSelectedVideoPreset(preset)}
                              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                                isChosen
                                  ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                                  : 'bg-[#F4F2ED] dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                              }`}
                            >
                              {preset.label} · {preset.duration}
                            </button>
                          );
                        })}
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#16161C] space-y-2">
                        <div className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC]">
                          <strong className="text-[#101014] dark:text-[#F4F2ED]">Por qué funciona:</strong>{' '}
                          {selectedVideoPreset.effectExplanation}
                        </div>
                        <p className="text-[11px] font-mono-code text-[#101014] dark:text-[#D8D5CD] leading-relaxed">
                          {liveVideoSequencePrompt}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleCopy(liveVideoSequencePrompt, 'lightbox-video')}
                            className="px-2.5 py-1.5 text-[11px] font-semibold rounded border border-[#D4D0C5] dark:border-[#2C2C36] inline-flex items-center gap-1"
                          >
                            {copiedId === 'lightbox-video' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === 'lightbox-video' ? 'Copiado' : 'Copiar prompt de video'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => sendItemToBuilder(lightboxItem, liveVideoSequencePrompt, null, true)}
                            className="px-3 py-1.5 text-[11px] font-bold rounded bg-[#326BFF] hover:bg-[#2555d6] text-white inline-flex items-center gap-1"
                          >
                            <Film className="w-3 h-3" />
                            <span>Abrir en Constructor (Video)</span>
                          </button>
                          {onAddToStoryboard && (
                            <button
                              type="button"
                              onClick={() => {
                                const scene = buildStoryboardSceneFromPlate(
                                  lightboxItem,
                                  selectedVideoPreset,
                                  selectedLighting,
                                  selectedContext
                                );
                                setLightboxItem(null);
                                onAddToStoryboard(scene);
                              }}
                              className="px-3 py-1.5 text-[11px] font-bold rounded bg-[#7545D6] hover:bg-[#5e34b5] text-white inline-flex items-center gap-1"
                            >
                              <Clapperboard className="w-3 h-3" />
                              <span>Añadir al Storyboard</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Camino 5: Reusable JSON */}
                  {activeResearchPath === 'json' && liveJsonProfile && (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC]">
                        <strong>¿Qué sucede si convertimos su lenguaje visual en un JSON reutilizable?</strong> Este bloque preserva óptica, iluminación y colorimetría (incluyendo tus hipótesis activas) para replicar la estética en otras escenas:
                      </p>
                      <pre className="p-2.5 rounded-lg bg-[#101014] text-[#F4F2ED] text-[10px] font-mono-code overflow-x-auto max-h-40 leading-relaxed">
                        {JSON.stringify(liveJsonProfile, null, 2)}
                      </pre>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(JSON.stringify(liveJsonProfile, null, 2), 'lightbox-json')
                          }
                          className="px-2.5 py-1.5 text-[11px] font-semibold rounded border border-[#D4D0C5] dark:border-[#2C2C36] inline-flex items-center gap-1"
                        >
                          {copiedId === 'lightbox-json' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === 'lightbox-json' ? 'JSON copiado' : 'Copiar JSON'}</span>
                        </button>
                        {onAnalyzeInJsonLab && (
                          <button
                            type="button"
                            onClick={() => {
                              const target = lightboxItem;
                              const customProf = liveJsonProfile;
                              setLightboxItem(null);
                              onAnalyzeInJsonLab(target, customProf);
                            }}
                            className="px-3 py-1.5 text-[11px] font-bold rounded bg-[#7545D6] hover:bg-[#5e34b5] text-white inline-flex items-center gap-1"
                          >
                            <Braces className="w-3 h-3" />
                            <span>Editar en JSON Lab</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Editable Prompt + Language Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
                        Prompt experimental editable
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

                {/* Curated Plate-Specific Quick Variations */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono-code font-bold uppercase text-[#5B5B66] dark:text-[#A09E97] flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-[#7545D6]" />
                    <span>Variaciones específicas de esta lámina</span>
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

                {/* Researcher Local Bitácora / Hypothesis Note */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={`note-${lightboxItem.id}`}
                      className="text-[11px] font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300]" />
                      <span>Bitácora de Investigación (guardado local)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDownloadResearchDossier}
                      className="text-[11px] font-mono-code font-semibold text-[#326BFF] dark:text-[#F8C300] hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar ficha (.TXT)</span>
                    </button>
                  </div>
                  <textarea
                    id={`note-${lightboxItem.id}`}
                    rows={2}
                    value={researchNotes[lightboxItem.id] || ''}
                    onChange={(e) =>
                      setResearchNotes((prev) => ({
                        ...prev,
                        [lightboxItem.id]: e.target.value,
                      }))
                    }
                    placeholder="Anota tu hipótesis, qué cambio de luz o lente funcionó mejor, o hallazgos para tu taller..."
                    className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>

                {/* Primary Lightbox CTAs */}
                <div className="pt-1 grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const target = lightboxItem;
                      setLightboxItem(null);
                      setRecreateTarget(target);
                    }}
                    className="sm:flex-1 py-3 px-4 min-h-[44px] text-xs sm:text-sm font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Repeat2 className="w-4 h-4 shrink-0" />
                    <span>Recrear esta imagen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      sendItemToBuilder(
                        lightboxItem,
                        lightboxDraftPrompt,
                        appliedVariationPatch,
                        false
                      )
                    }
                    className="py-3 px-4 min-h-[44px] text-xs font-bold bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014] hover:opacity-90 rounded-xl transition-opacity inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Constructor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const mod = lightboxItem.relatedModuleId;
                      setLightboxItem(null);
                      onOpenTechnicalModule(mod);
                    }}
                    className="py-3 px-3.5 min-h-[44px] text-xs font-semibold rounded-xl border border-[#D4D0C5] dark:border-[#2C2C36] bg-white dark:bg-[#101014] hover:border-[#326BFF] inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#326BFF]" />
                    <span>Módulo</span>
                  </button>

                  {onAnalyzeInJsonLab && liveJsonProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = lightboxItem;
                        const prof = liveJsonProfile;
                        setLightboxItem(null);
                        onAnalyzeInJsonLab(target, prof);
                      }}
                      className="py-3 px-3.5 min-h-[44px] text-xs font-semibold rounded-xl border border-[#D4D0C5] dark:border-[#2C2C36] bg-white dark:bg-[#101014] hover:border-[#7545D6] inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Braces className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                      <span>JSON Lab</span>
                    </button>
                  )}

                  {onSendToMoodboard && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = lightboxItem;
                        setLightboxItem(null);
                        onSendToMoodboard(target);
                      }}
                      className="py-3 px-3.5 min-h-[44px] text-xs font-semibold rounded-xl border border-[#D4D0C5] dark:border-[#2C2C36] bg-white dark:bg-[#101014] hover:border-[#F8C300] inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Palette className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                      <span>Moodboard</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recreate This Image Workflow Modal */}
      <RecreateImageModal
        item={recreateTarget}
        initialLang={promptLang}
        onClose={() => setRecreateTarget(null)}
        onSendToBuilder={onExperimentInBuilder}
      />
    </section>
  );
};
