import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  Star,
  Copy,
  Check,
  ArrowUpRight,
  ChevronRight,
  X,
  BookOpen,
  SlidersHorizontal,
  ArrowLeftRight,
  Info,
  Compass,
  Sparkles,
  Images,
  Layers,
  Braces,
  Sliders,
} from 'lucide-react';
import {
  MODULES_META,
  MODULES_01_TO_05_ENTRIES,
  WORKSHOP_ROUTE,
  IMAGE_REVIEW_CRITERIA,
  LibraryEntry,
  ModuleId,
  ModuleMeta,
} from '../data/modulesData';
import { MODULE_06_VIDEO_ENTRIES } from '../data/videoAndJsonData';
import { EXTENDED_MODULES_META, EXTENDED_LIBRARY_ENTRIES } from '../data/extendedModulesData';
import {
  VISUAL_ASSET_REGISTRY,
  VISUAL_ASSETS_MAP,
  VISUAL_LIBRARY_PATHS,
  VisualAssetCategory,
  VisualAssetRecord,
} from '../data/visualLibraryRegistry';
import ethicsCardSesgos from '../assets/images/ethics_card_sesgos_1795400896612.jpg';
import { ResilientImage } from './ResilientImage';
import { TechnicalDiagramSVG, VisualComparisonStrip } from './VisualDiagrams';
import { SectionPhotoBanner } from './SectionPhotoBanner';

export interface VisualLibraryExplorerProps {
  activeModule: ModuleId;
  onChangeModule: (modId: ModuleId) => void;
  onApplyEntryToBuilder: (entry: LibraryEntry) => void;
  onOpenGalleryCollection?: (collection: string) => void;
  onOpenJsonLab?: () => void;
  onOpenLabs?: () => void;
}

function getGalleryCollectionForModule(modId: ModuleId): string {
  switch (modId) {
    case 'mod-01':
    case 'mod-03':
    case 'mod-20':
      return 'Retrato';
    case 'mod-11':
    case 'mod-16':
      return 'Paisaje';
    case 'mod-15':
    case 'mod-19':
      return 'Producto';
    case 'mod-04':
    case 'mod-14':
    case 'mod-18':
      return 'Arte Digital';
    case 'mod-02':
    case 'mod-05':
    case 'mod-06':
    case 'mod-09':
    case 'mod-10':
    case 'mod-12':
      return 'Cine';
    case 'mod-17':
      return 'Macro y Naturaleza';
    case 'mod-08':
    case 'mod-13':
    case 'mod-22':
      return 'Motion y Video';
    default:
      return 'Todas';
  }
}

function getModuleBannerVisual(
  modId: ModuleId,
  explorerMode: 'modules' | 'atlas'
): { image: string; alt: string; position?: 'center' | 'top' | 'bottom' } {
  if (explorerMode === 'atlas') {
    return {
      image: VISUAL_LIBRARY_PATHS.focalComparison,
      alt: 'Atlas Visual — Comparación técnica de óptica, iluminación y encuadres',
      position: 'center',
    };
  }
  switch (modId) {
    case 'mod-01':
      return {
        image: VISUAL_LIBRARY_PATHS.photoFashion,
        alt: 'Módulo 01 — Generación de Imágenes y Fotografía Editorial',
        position: 'top',
      };
    case 'mod-02':
      return {
        image: VISUAL_LIBRARY_PATHS.camRangefinder,
        alt: 'Módulo 02 — Óptica, Cámaras y Distancias Focales',
        position: 'center',
      };
    case 'mod-03':
      return {
        image: VISUAL_LIBRARY_PATHS.lightRembrandt,
        alt: 'Módulo 03 — Iluminación de Estudio y Esquemas de Luz',
        position: 'top',
      };
    case 'mod-04':
      return {
        image: VISUAL_LIBRARY_PATHS.colorDuotone,
        alt: 'Módulo 04 — Color, Emulsiones y Dirección de Arte',
        position: 'center',
      };
    case 'mod-05':
      return {
        image: VISUAL_LIBRARY_PATHS.compCinematography,
        alt: 'Módulo 05 — Composición, Planos y Lenguaje de Cámara',
        position: 'center',
      };
    case 'mod-06':
      return {
        image: VISUAL_LIBRARY_PATHS.videoStudio,
        alt: 'Módulo 06 — Video Lab y Dirección Cinematográfica',
        position: 'center',
      };
    case 'mod-07':
      return {
        image: VISUAL_LIBRARY_PATHS.colorJsonTransfer,
        alt: 'Módulo 07 — Transferencia de Estilo y Prompts JSON',
        position: 'center',
      };
    case 'mod-08':
      return {
        image: VISUAL_LIBRARY_PATHS.photoNeoNoir,
        alt: 'Módulo 08 — Narrativa Visual y Storytelling',
        position: 'top',
      };
    case 'mod-09':
      return {
        image: VISUAL_LIBRARY_PATHS.storySheet,
        alt: 'Módulo 09 — Storyboard y Secuencia Visual',
        position: 'center',
      };
    case 'mod-10':
      return {
        image: VISUAL_LIBRARY_PATHS.storyCharacterSheet,
        alt: 'Módulo 10 — Diseño y Consistencia de Personajes',
        position: 'top',
      };
    case 'mod-11':
      return {
        image: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
        alt: 'Módulo 11 — Worldbuilding y Construcción de Mundos',
        position: 'center',
      };
    case 'mod-12':
      return {
        image: VISUAL_LIBRARY_PATHS.storySoundFoley,
        alt: 'Módulo 12 — Diseño Sonoro, Voz y Música IA',
        position: 'center',
      };
    case 'mod-13':
      return {
        image: VISUAL_LIBRARY_PATHS.adBillboard,
        alt: 'Módulo 13 — Diseño Gráfico, Tipografía y Cartel',
        position: 'center',
      };
    case 'mod-14':
      return {
        image: VISUAL_LIBRARY_PATHS.adLuxury,
        alt: 'Módulo 14 — Branding, Identidad y Dirección Publicitaria',
        position: 'center',
      };
    case 'mod-15':
      return {
        image: VISUAL_LIBRARY_PATHS.anim3dSculpture,
        alt: 'Módulo 15 — Arte 3D, Escultura Digital y Materiales PBR',
        position: 'center',
      };
    case 'mod-16':
      return {
        image: VISUAL_LIBRARY_PATHS.photoArchitecture,
        alt: 'Módulo 16 — Arquitectura, Espacio y Fotogrametría',
        position: 'center',
      };
    case 'mod-17':
      return {
        image: VISUAL_LIBRARY_PATHS.vfxFluidSmoke,
        alt: 'Módulo 17 — VFX, Simulaciones y Efectos Visuales',
        position: 'center',
      };
    case 'mod-18':
      return {
        image: VISUAL_LIBRARY_PATHS.animStopMotion,
        alt: 'Módulo 18 — Animación, Stop Motion y Motion Design',
        position: 'center',
      };
    case 'mod-19':
      return {
        image: VISUAL_LIBRARY_PATHS.animGenerativeParticles,
        alt: 'Módulo 19 — Arte Generativo y Sistemas Algorítmicos',
        position: 'center',
      };
    case 'mod-20':
      return {
        image: VISUAL_LIBRARY_PATHS.vfxProjectionMapping,
        alt: 'Módulo 20 — Instalaciones Interactivas y Mapping',
        position: 'center',
      };
    case 'mod-21':
      return {
        image: VISUAL_LIBRARY_PATHS.artBotanical,
        alt: 'Módulo 21 — Ilustración Científica y Botánica',
        position: 'center',
      };
    case 'mod-22':
      return {
        image: VISUAL_LIBRARY_PATHS.artHybridOrganism,
        alt: 'Módulo 22 — Bioarte y Especulación Visual',
        position: 'center',
      };
    case 'mod-23':
      return {
        image: VISUAL_LIBRARY_PATHS.photoTerritory,
        alt: 'Módulo 23 — Memoria, Territorio y Archivo Visual',
        position: 'center',
      };
    case 'mod-24':
      return {
        image: VISUAL_LIBRARY_PATHS.photoDocumentaryStreet,
        alt: 'Módulo 24 — Documental Comunitario y Participativo',
        position: 'center',
      };
    case 'mod-25':
      return {
        image: VISUAL_LIBRARY_PATHS.compExtremeWide,
        alt: 'Módulo 25 — Accesibilidad Visual y Lenguaje Claro',
        position: 'center',
      };
    case 'mod-26':
      return {
        image: ethicsCardSesgos,
        alt: 'Módulo 26 — Ética, Procedencia y Derechos de Autor IA',
        position: 'center',
      };
    default:
      return {
        image: VISUAL_LIBRARY_PATHS.photoFashion,
        alt: 'Biblioteca Visual & Técnica',
        position: 'center',
      };
  }
}

const ALL_MODULES_META: ModuleMeta[] = [
  ...MODULES_META.map((m) => ({ ...m, group: 'imagen-cine' as const })),
  ...EXTENDED_MODULES_META,
];

const ALL_ENTRIES: LibraryEntry[] = [
  ...MODULES_01_TO_05_ENTRIES,
  ...MODULE_06_VIDEO_ENTRIES,
  ...EXTENDED_LIBRARY_ENTRIES,
];

const FAV_STORAGE_KEY = 'nc_fav_fichas_v1';

export const VisualLibraryExplorer: React.FC<VisualLibraryExplorerProps> = ({
  activeModule,
  onChangeModule,
  onApplyEntryToBuilder,
  onOpenGalleryCollection,
  onOpenJsonLab,
  onOpenLabs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todas');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('Todas');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showComparisons, setShowComparisons] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(FAV_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [selectedEntry, setSelectedEntry] = useState<LibraryEntry | null>(null);
  const [selectedAtlasAsset, setSelectedAtlasAsset] = useState<VisualAssetRecord | null>(null);
  const [explorerMode, setExplorerMode] = useState<'modules' | 'atlas'>('modules');
  const [atlasCategory, setAtlasCategory] = useState<'Todas' | VisualAssetCategory>('Todas');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLang, setCopiedLang] = useState<'es' | 'en'>('es');

  const [activeGroup, setActiveGroup] = useState<'imagen-cine' | 'narrativa-diseno' | 'especialidades-etica'>('imagen-cine');

  useEffect(() => {
    try {
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nc-favorites-updated'));
      }
    } catch {
      // ignore storage quota issues
    }
  }, [favorites]);

  // Reset subcategory and sync group pillar when activeModule changes
  useEffect(() => {
    setSelectedSubcategory('Todas');
    const found = ALL_MODULES_META.find((m) => m.id === activeModule);
    if (found?.group) {
      setActiveGroup(found.group);
    }
  }, [activeModule]);

  const activeModuleMeta = useMemo(
    () => ALL_MODULES_META.find((m) => m.id === activeModule) || ALL_MODULES_META[0],
    [activeModule]
  );

  const groupModules = useMemo(
    () => ALL_MODULES_META.filter((m) => m.group === activeGroup),
    [activeGroup]
  );

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyPrompt = (text: string, id: string, lang: 'es' | 'en' = 'es') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedLang(lang);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_ENTRIES.filter((entry) => {
      // When global search is active, search across ALL modules; otherwise scope to activeModule
      const matchesModule = q.length > 0 ? true : entry.moduleId === activeModule;
      const matchesSub =
        q.length > 0 || selectedSubcategory === 'Todas'
          ? true
          : entry.subcategory === selectedSubcategory;
      const matchesDifficulty =
        difficultyFilter === 'Todas' || entry.difficulty === difficultyFilter;
      const matchesFav = !onlyFavorites || favorites.includes(entry.id);

      const matchesSearch =
        q.length === 0 ||
        entry.title.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.technical_terms.some((t) => t.toLowerCase().includes(q)) ||
        entry.tags.some((t) => t.toLowerCase().includes(q));

      return matchesModule && matchesSub && matchesDifficulty && matchesFav && matchesSearch;
    });
  }, [activeModule, selectedSubcategory, difficultyFilter, onlyFavorites, favorites, searchQuery]);

  const atlasCategories = useMemo<('Todas' | VisualAssetCategory)[]>(() => {
    const unique = Array.from(new Set(VISUAL_ASSET_REGISTRY.map((a) => a.category)));
    return ['Todas', ...unique];
  }, []);

  const filteredAtlasAssets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VISUAL_ASSET_REGISTRY.filter((asset) => {
      const matchCat = atlasCategory === 'Todas' || asset.category === atlasCategory;
      const matchSearch =
        !q ||
        asset.title.toLowerCase().includes(q) ||
        asset.description.toLowerCase().includes(q) ||
        asset.technicalExplanation.toLowerCase().includes(q) ||
        asset.category.toLowerCase().includes(q) ||
        asset.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [atlasCategory, searchQuery]);

  const openRelatedTopic = (topicId: string) => {
    const target = ALL_ENTRIES.find((item) => item.id === topicId);
    if (target) {
      onChangeModule(target.moduleId);
      setSelectedEntry(target);
    }
  };

  const bannerVisual = useMemo(
    () => getModuleBannerVisual(activeModule, explorerMode),
    [activeModule, explorerMode]
  );

  return (
    <section
      id="biblioteca"
      className="pb-16 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 transition-colors"
    >
      {/* Hidden/semantic anchor for #video-lab navigation link */}
      <div id="video-lab" className="scroll-mt-24" />

      {/* Full-bleed Photographic Hero Banner — Dynamically switches photo per active module / Atlas */}
      <SectionPhotoBanner
        image={bannerVisual.image}
        imageAlt={bannerVisual.alt}
        imagePosition={bannerVisual.position}
        accentTint="navy"
        kicker={
          <nav
            aria-label="Ruta de navegación"
            className="flex flex-wrap items-center gap-1.5"
          >
            <span className="text-[#C7CCE0]">Inicio</span>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-[#F8C300] font-bold">
              {explorerMode === 'atlas'
                ? `Atlas Visual · ${VISUAL_ASSET_REGISTRY.length} Referencias Curadas`
                : `Módulo ${activeModuleMeta.number} · ${activeModuleMeta.title}`}
            </span>
            {explorerMode === 'modules' && selectedSubcategory !== 'Todas' && !searchQuery && (
              <>
                <ChevronRight className="w-3 h-3 text-white/40" />
                <span className="text-[#93B4FF]">{selectedSubcategory}</span>
              </>
            )}
          </nav>
        }
        topRight={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#F4F2ED] backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#F8C300]" />
            <span>
              {explorerMode === 'atlas'
                ? 'Modo Atlas Visual'
                : `Mód. ${activeModuleMeta.number} · ${activeModuleMeta.shortTitle}`}
            </span>
          </span>
        }
        title={
          explorerMode === 'atlas'
            ? 'Atlas Visual de Referencias Técnicas'
            : `Biblioteca Visual · ${activeModuleMeta.shortTitle}`
        }
        subtitle={
          explorerMode === 'atlas'
            ? `Explora ${VISUAL_ASSET_REGISTRY.length} láminas técnicas de iluminación, óptica, planos, color, publicidad y cinematografía con explicación visual y prompt listo para copiar.`
            : activeModuleMeta.description
        }
        actions={
          <>
            <div className="inline-flex rounded-lg border border-white/20 overflow-hidden bg-[#101014]/70 backdrop-blur-xs text-xs font-semibold">
              <button
                type="button"
                onClick={() => setExplorerMode('modules')}
                className={`px-3.5 py-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  explorerMode === 'modules'
                    ? 'bg-[#F8C300] text-[#101014] font-bold'
                    : 'text-[#E4E6F0] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>26 Módulos</span>
              </button>
              <button
                type="button"
                onClick={() => setExplorerMode('atlas')}
                className={`px-3.5 py-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  explorerMode === 'atlas'
                    ? 'bg-[#F8C300] text-[#101014] font-bold'
                    : 'text-[#E4E6F0] hover:text-white'
                }`}
              >
                <Images className="w-3.5 h-3.5" />
                <span>Atlas Visual ({VISUAL_ASSET_REGISTRY.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowComparisons((prev) => !prev)}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap backdrop-blur-xs ${
                showComparisons
                  ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                  : 'bg-[#101014]/70 text-[#F4F2ED] border-white/20 hover:border-[#F8C300]'
              }`}
            >
              <ArrowLeftRight className={`w-3.5 h-3.5 ${showComparisons ? 'text-[#101014]' : 'text-[#F8C300]'}`} />
              <span>{showComparisons ? 'Ocultar Comparaciones' : 'Comparaciones'}</span>
            </button>

            {explorerMode === 'modules' && (
              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap backdrop-blur-xs ${
                  onlyFavorites
                    ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                    : 'bg-[#101014]/70 text-[#F4F2ED] border-white/20 hover:border-[#F8C300]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : 'text-[#F8C300]'}`} />
                <span>Favoritos ({favorites.length})</span>
              </button>
            )}

            {onOpenGalleryCollection && (
              <button
                type="button"
                onClick={() => onOpenGalleryCollection(getGalleryCollectionForModule(activeModule))}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#7545D6] hover:bg-[#6134BF] text-white transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Images className="w-3.5 h-3.5" />
                <span>Ver en Galería</span>
              </button>
            )}

            {onOpenJsonLab && activeModule === 'mod-07' && (
              <button
                type="button"
                onClick={onOpenJsonLab}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#059669] hover:bg-[#047857] text-white transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Braces className="w-3.5 h-3.5" />
                <span>Abrir Lab JSON</span>
              </button>
            )}

            {onOpenLabs && activeModule !== 'mod-07' && (
              <button
                type="button"
                onClick={onOpenLabs}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#326BFF] hover:bg-[#2358E6] text-white transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Practicar en Labs</span>
              </button>
            )}
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* 3 Thematic Pillars Switcher across all 26 Modules (modules mode) */}
        {explorerMode === 'modules' && (
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  {
                    id: 'imagen-cine',
                    label: 'Bloque I · Imagen, Óptica, Luz, Color & Cine (Mód. 01–06)',
                    activeCls: 'bg-[#F8C300] text-[#101014] border-[#D4A600] shadow-xs font-bold',
                    idleCls: 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#E5E3DC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#D4A600]',
                    dot: 'bg-[#F8C300]',
                  },
                  {
                    id: 'narrativa-diseno',
                    label: 'Bloque II · Storytelling, Storyboard, Personajes, Sonido & Diseño (Mód. 07–14)',
                    activeCls: 'bg-[#326BFF] text-white border-[#326BFF] shadow-xs font-bold',
                    idleCls: 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#E5E3DC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]',
                    dot: 'bg-[#326BFF]',
                  },
                  {
                    id: 'especialidades-etica',
                    label: 'Bloque III · 3D, Fotogrametría, Ciencia, Accesibilidad & Ética (Mód. 15–26)',
                    activeCls: 'bg-[#7545D6] text-white border-[#7545D6] shadow-xs font-bold',
                    idleCls: 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#E5E3DC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#7545D6]',
                    dot: 'bg-[#7545D6]',
                  },
                ] as const
              ).map((grp) => {
                const isGrpActive = activeGroup === grp.id && !searchQuery;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveGroup(grp.id);
                      const firstInGrp = ALL_MODULES_META.find((m) => m.group === grp.id);
                      if (firstInGrp) onChangeModule(firstInGrp.id);
                    }}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-2 cursor-pointer ${
                      isGrpActive ? grp.activeCls : grp.idleCls
                    }`}
                  >
                    {!isGrpActive && (
                      <span aria-hidden="true" className={`w-2 h-2 rounded-xs shrink-0 ${grp.dot}`} />
                    )}
                    <span>{grp.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Module Switcher for active pillar */}
            <div
              role="tablist"
              aria-label="Módulos de la biblioteca visual"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
            >
              {groupModules.map((mod) => {
                const isActive = mod.id === activeModule && !searchQuery;
                const count = ALL_ENTRIES.filter((e) => e.moduleId === mod.id).length;
                const activeMetaAccent =
                  activeGroup === 'narrativa-diseno'
                    ? 'text-[#93B4FF]'
                    : activeGroup === 'especialidades-etica'
                    ? 'text-[#C4A5FF]'
                    : 'text-[#F8C300]';
                const activeTopBar =
                  activeGroup === 'narrativa-diseno'
                    ? 'bg-[#326BFF]'
                    : activeGroup === 'especialidades-etica'
                    ? 'bg-[#7545D6]'
                    : 'bg-[#F8C300]';
                const idleHoverBorder =
                  activeGroup === 'narrativa-diseno'
                    ? 'hover:border-[#326BFF]'
                    : activeGroup === 'especialidades-etica'
                    ? 'hover:border-[#7545D6]'
                    : 'hover:border-[#D4A600]';
                return (
                  <button
                    key={mod.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setSearchQuery('');
                      onChangeModule(mod.id);
                    }}
                    className={`text-left rounded-xl border overflow-hidden transition-all flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:border-[#3A3A48] shadow-md'
                        : `bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] ${idleHoverBorder}`
                    }`}
                  >
                    <div className={`h-1 w-full ${isActive ? activeTopBar : 'bg-transparent'}`} />
                    <div className="p-3 flex flex-col justify-between gap-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono-code uppercase tracking-wider">
                        <span className={`font-bold shrink-0 tabular-nums ${isActive ? activeMetaAccent : 'text-[#5B5B66] dark:text-[#A09E97]'}`}>
                          Mód. {mod.number}
                        </span>
                        <span className={`shrink-0 tabular-nums ${isActive ? 'text-[#C8C5BD]' : 'text-[#76746E] dark:text-[#8E8C85]'}`}>
                          {count} fichas
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold leading-snug">{mod.shortTitle}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual Comparison Strip (expandable or toggled) */}
        {showComparisons && (
          <div className="p-6 rounded-xl bg-[#EAE6DC] dark:bg-[#16161E] border border-[#D4CFC2] dark:border-[#282834]">
            <VisualComparisonStrip />
          </div>
        )}

        {/* Search & Filters Toolbar — Tinted Architectural Surface */}
        <div className="bg-[#EAE6DC] dark:bg-[#16161E] border border-[#D4CFC2] dark:border-[#282834] rounded-xl p-4 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5B5B66] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en los 26 módulos: ej. '85mm', 'Rembrandt', 'dolly', 'botánica', 'chiaroscuro', 'f/1.8'..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-white dark:bg-[#101014] border border-[#D4CFC2] dark:border-[#2C2C36] rounded-lg text-[#101014] dark:text-[#F4F2ED] placeholder:text-[#76746E] focus:outline-none focus:border-[#326BFF]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Difficulty Filter (only in modules mode) */}
            {explorerMode === 'modules' && (
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B5B66]" />
                <label htmlFor="difficulty-select" className="text-xs font-mono-code font-semibold text-[#4A4A55] dark:text-[#A09E97]">
                  Nivel:
                </label>
                <select
                  id="difficulty-select"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="text-xs bg-white dark:bg-[#101014] border border-[#D4CFC2] dark:border-[#2C2C36] rounded-lg px-2.5 py-2 text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                >
                  <option value="Todas">Todos los niveles</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            )}
          </div>

          {/* Subcategory Tabs or Atlas Category Filter */}
          {explorerMode === 'modules' && !searchQuery && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#D6D1C5] dark:border-[#262632]">
              {(() => {
                const subActiveCls =
                  activeGroup === 'narrativa-diseno'
                    ? 'bg-[#326BFF] text-white font-bold shadow-xs'
                    : activeGroup === 'especialidades-etica'
                    ? 'bg-[#7545D6] text-white font-bold shadow-xs'
                    : 'bg-[#F8C300] text-[#101014] font-bold shadow-xs';
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategory('Todas')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        selectedSubcategory === 'Todas'
                          ? subActiveCls
                          : 'bg-white dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border border-[#D8D3C8] dark:border-[#26262E] hover:text-[#101014] dark:hover:text-white'
                      }`}
                    >
                      Todas ({ALL_ENTRIES.filter((e) => e.moduleId === activeModule).length})
                    </button>
                    {activeModuleMeta.subcategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                          selectedSubcategory === sub
                            ? subActiveCls
                            : 'bg-white dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border border-[#D8D3C8] dark:border-[#26262E] hover:text-[#101014] dark:hover:text-white'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </>
                );
              })()}
            </div>
          )}

          {explorerMode === 'atlas' && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#D6D1C5] dark:border-[#262632]">
              {atlasCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAtlasCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    atlasCategory === cat
                      ? 'bg-[#326BFF] text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border border-[#D8D3C8] dark:border-[#26262E] hover:text-[#101014] dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pedagogical honesty callout for Module 02 & Module 04 */}
        {(activeModule === 'mod-02' || activeModule === 'mod-04') && !searchQuery && (
          <div className="p-3.5 rounded-xl bg-[#EEF3FF] dark:bg-[#141B2D] border border-[#C7D7FF] dark:border-[#25365C] text-xs text-[#25304A] dark:text-[#D0DCF8] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#326BFF] dark:text-[#8FB0FF] shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold text-[#101014] dark:text-white">
                Nota metodológica sobre marcas y emulsiones:
              </strong>{' '}
              Las menciones a fabricantes de cámaras (Sony, Canon, ARRI, Leica, Hasselblad) o películas fotográficas (Kodak Portra, CineStill, Ilford) funcionan como referencias de{' '}
              <em>inspiración estética</em> en el modelo de IA, no como simulación óptica o química garantizada ni requisito obligatorio.
            </p>
          </div>
        )}

        {/* Situated Workshop Pedagogy inside Module 01 — Dark Obsidian Methodology Centerpiece */}
        {activeModule === 'mod-01' &&
          !searchQuery &&
          (selectedSubcategory === 'Todas' || selectedSubcategory === 'E. Talleres y creación situada') && (
            <div className="rounded-2xl border border-[#262836] bg-[#13141C] text-[#F4F2ED] p-5 sm:p-6 space-y-5 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-wider text-[#F8C300] font-bold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Metodología Núcleo Colectivo · Ruta de Creación Situada</span>
                  </div>
                  <h3 className="text-xl font-bold font-serif-title text-[#F4F2ED] mt-1">
                    5 pasos para talleres participativos con IA
                  </h3>
                </div>
                <span className="text-xs font-mono-code text-[#93B4FF] font-semibold">
                  Sentido cultural · Territorio · Revisión crítica
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {WORKSHOP_ROUTE.map((item, idx) => {
                  const stepPalette = [
                    { bar: 'bg-[#F8C300]', text: 'text-[#F8C300]' },
                    { bar: 'bg-[#326BFF]', text: 'text-[#8FB0FF]' },
                    { bar: 'bg-[#7545D6]', text: 'text-[#C4A5FF]' },
                    { bar: 'bg-[#059669]', text: 'text-[#34D399]' },
                    { bar: 'bg-[#E11D48]', text: 'text-[#FB7185]' },
                  ][idx % 5];
                  return (
                    <div
                      key={item.step}
                      className="rounded-xl bg-[#1B1D29] border border-white/10 overflow-hidden flex flex-col"
                    >
                      <div className={`h-1 w-full ${stepPalette.bar}`} />
                      <div className="p-3.5 flex-1">
                        <div className={`text-xs font-mono-code font-bold tabular-nums ${stepPalette.text}`}>
                          {item.step} · {item.name}
                        </div>
                        <p className="text-xs font-semibold text-[#F4F2ED] mt-1.5 leading-snug">
                          {item.question}
                        </p>
                        <p className="text-[11px] text-[#B8BCCC] mt-1.5 leading-relaxed">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3.5 border-t border-white/10">
                <p className="text-xs font-mono-code uppercase tracking-wider text-[#C4A5FF] mb-2 font-bold">
                  Criterios curatoriales para revisar una imagen generada:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-[#D8D5CD]">
                  {IMAGE_REVIEW_CRITERIA.map((crit) => (
                    <div key={crit} className="flex items-start gap-2">
                      <span className="text-[#F8C300] font-bold">•</span>
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Entries Visual Grid OR Visual Encyclopedia Atlas */}
        {explorerMode === 'atlas' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAtlasAssets.map((asset) => {
              const isCopied = copiedId === asset.id;
              return (
                <article
                  key={asset.id}
                  onClick={() => setSelectedAtlasAsset(asset)}
                  className="group cursor-pointer rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-400/70 transition-all flex flex-col"
                >
                  <div className="relative h-52 bg-stone-900 overflow-hidden">
                    <ResilientImage
                      src={asset.image}
                      alt={asset.alt}
                      objectPosition={asset.objectPosition || 'center'}
                      containerClassName="w-full h-full"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono-code text-stone-100">
                      <span className="truncate text-amber-300 font-semibold">{asset.category}</span>
                      <span className="shrink-0 ml-2 text-stone-300">{asset.aspectRatio}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-mono-code uppercase tracking-wider text-stone-500">
                        {asset.subcategory}
                      </div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors leading-snug mt-0.5">
                        {asset.title}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {asset.description}
                      </p>
                      <div className="mt-2.5 text-[11px] font-mono-code text-stone-500 dark:text-stone-400 truncate">
                        {asset.tags.slice(0, 4).join(' · ')}
                      </div>
                    </div>
                    <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(asset.prompt, asset.id, 'en');
                        }}
                        className="px-2.5 py-1.5 text-[11px] font-mono-code font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 bg-stone-100 dark:bg-stone-950 rounded flex items-center gap-1.5 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Prompt</span>
                          </>
                        )}
                      </button>
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                        <span>Ver Lámina</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              No se encontraron fichas con esos criterios.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubcategory('Todas');
                setDifficultyFilter('Todas');
                setOnlyFavorites(false);
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 text-stone-950 rounded"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => {
              const isFav = favorites.includes(entry.id);
              const isCopied = copiedId === entry.id;
              return (
                <article
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="group cursor-pointer rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-400/70 transition-all flex flex-col"
                >
                  {/* Visual Reference Image */}
                  <div className="relative h-48 bg-stone-900 overflow-hidden">
                    <ResilientImage
                      src={entry.image}
                      alt={entry.alt || entry.title}
                      objectPosition={entry.objectPosition || 'center'}
                      containerClassName="w-full h-full"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent pointer-events-none" />

                    {/* Top-right favorite button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(entry.id, e)}
                      aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded bg-stone-950/70 text-stone-100 hover:text-amber-300 transition-colors"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Bottom overlay metadata (clean unboxed text) */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono-code text-stone-100">
                      <span className="truncate text-amber-300 font-semibold">{entry.category}</span>
                      <span className="shrink-0 ml-2 text-stone-300">{entry.difficulty}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors leading-snug">
                        {entry.title}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {entry.description}
                      </p>

                      {/* Inline technical terms (zero-pill rule) */}
                      <div className="mt-2.5 text-[11px] font-mono-code text-stone-500 dark:text-stone-400 truncate">
                        {entry.technical_terms.slice(0, 3).join(' · ')}
                      </div>
                    </div>

                    {/* Compact SVG Diagram Preview when relevant */}
                    {entry.diagramType !== 'none' && (
                      <TechnicalDiagramSVG
                        type={entry.diagramType}
                        config={entry.diagramConfig}
                        compact
                      />
                    )}

                    {/* Card Footer Actions */}
                    <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(entry.prompt_examples.es, entry.id, 'es');
                        }}
                        className="px-2.5 py-1.5 text-[11px] font-mono-code font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 bg-stone-100 dark:bg-stone-950 rounded flex items-center gap-1.5 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Prompt</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {entry.builderPatch && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApplyEntryToBuilder(entry);
                            }}
                            className="px-2.5 py-1.5 text-[11px] font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded flex items-center gap-1 transition-colors"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Usar</span>
                          </button>
                        )}
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                          <span>Ficha</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* FICHA TÉCNICA DETAIL MODAL                                           */}
      {/* ==================================================================== */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#FAF8F5] dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="text-[11px] font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                  {selectedEntry.subcategory} · {selectedEntry.difficulty}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                  {selectedEntry.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedEntry.id)}
                  className="p-2 rounded border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-stone-600 dark:text-stone-300"
                  title="Guardar en favoritos"
                >
                  <Star
                    className={`w-4 h-4 ${
                      favorites.includes(selectedEntry.id)
                        ? 'fill-amber-400 text-amber-400'
                        : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                  aria-label="Cerrar ficha técnica"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Image + SVG Diagram */}
                <div className="md:col-span-5 space-y-4">
                  <div className="rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900">
                    <ResilientImage
                      src={selectedEntry.image}
                      alt={selectedEntry.alt || selectedEntry.title}
                      aspectRatio={selectedEntry.aspectRatio || '3:2'}
                      objectPosition={selectedEntry.objectPosition || 'center'}
                      containerClassName="w-full"
                    />
                  </div>
                  <TechnicalDiagramSVG
                    type={selectedEntry.diagramType}
                    config={selectedEntry.diagramConfig}
                  />
                </div>

                {/* Technical Explanation & Visual Examples */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1">
                      Descripción y Aplicación Visual
                    </h4>
                    <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                      {selectedEntry.explanation}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-500 font-bold mb-1.5">
                      Ejemplos y Escenarios Recomendados
                    </h4>
                    <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                      {selectedEntry.visual_examples.map((ex) => (
                        <li key={ex} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">→</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-500 font-bold mb-1">
                      Términos Técnicos Clave
                    </h4>
                    <p className="text-xs font-mono-code text-stone-700 dark:text-stone-300">
                      {selectedEntry.technical_terms.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prompts Ready to Copy (ES & EN) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="p-4 rounded-lg bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono-code uppercase font-bold text-amber-700 dark:text-amber-400">
                        Prompt Listo (Español)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyPrompt(selectedEntry.prompt_examples.es, selectedEntry.id, 'es')
                        }
                        className="text-xs font-mono-code text-stone-600 dark:text-stone-300 hover:text-amber-600 flex items-center gap-1"
                      >
                        {copiedId === selectedEntry.id && copiedLang === 'es' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-mono-code">
                      {selectedEntry.prompt_examples.es}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono-code uppercase font-bold text-amber-400">
                        Prompt Ready (English)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyPrompt(selectedEntry.prompt_examples.en, selectedEntry.id, 'en')
                        }
                        className="text-xs font-mono-code text-stone-300 hover:text-amber-300 flex items-center gap-1"
                      >
                        {copiedId === selectedEntry.id && copiedLang === 'en' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed font-mono-code">
                      {selectedEntry.prompt_examples.en}
                    </p>
                  </div>
                </div>
              </div>

              {/* Provenance & Transparency Strip */}
              <div className="p-3 rounded-lg bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-[11px] font-mono-code text-stone-600 dark:text-stone-400 flex flex-wrap items-center justify-between gap-2">
                <span>
                  <strong className="text-stone-800 dark:text-stone-200">Procedencia:</strong>{' '}
                  {selectedEntry.provenance?.author || selectedEntry.source} ·{' '}
                  {selectedEntry.provenance?.aiStatus || 'Generada con IA (referencia educativa)'}
                </span>
                <span>
                  <strong className="text-stone-800 dark:text-stone-200">Licencia / Consentimiento:</strong>{' '}
                  {selectedEntry.license} · {selectedEntry.provenance?.consent || 'Uso educativo abierto'}
                </span>
              </div>

              {/* Related Topics + Attribution */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono-code text-stone-500 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Relacionados:</span>
                  </span>
                  {selectedEntry.related_topics.map((relId) => {
                    const rel = ALL_ENTRIES.find((item) => item.id === relId);
                    if (!rel) return null;
                    return (
                      <button
                        key={relId}
                        type="button"
                        onClick={() => openRelatedTopic(relId)}
                        className="text-xs font-medium text-amber-700 dark:text-amber-400 underline underline-offset-2 hover:text-amber-600"
                      >
                        {rel.title}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {onOpenGalleryCollection && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetCol = getGalleryCollectionForModule(selectedEntry.moduleId);
                        setSelectedEntry(null);
                        onOpenGalleryCollection(targetCol);
                      }}
                      className="px-3 py-2 text-xs font-semibold border border-stone-300 dark:border-stone-700 hover:border-amber-500 rounded flex items-center gap-1.5"
                    >
                      <Images className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Láminas en Galería</span>
                    </button>
                  )}
                  {selectedEntry.builderPatch && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = selectedEntry;
                        setSelectedEntry(null);
                        onApplyEntryToBuilder(target);
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Enviar al Constructor</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ==================================================================== */}
      {/* ATLAS VISUAL PLATE DETAIL MODAL                                      */}
      {/* ==================================================================== */}
      {selectedAtlasAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto"
          onClick={() => setSelectedAtlasAsset(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#FAF8F5] dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="text-[11px] font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                  {selectedAtlasAsset.category} · {selectedAtlasAsset.subcategory}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                  {selectedAtlasAsset.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAtlasAsset(null)}
                className="p-2 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                aria-label="Cerrar lámina visual"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5">
                  <div className="rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900">
                    <ResilientImage
                      src={selectedAtlasAsset.image}
                      alt={selectedAtlasAsset.alt}
                      aspectRatio={selectedAtlasAsset.aspectRatio}
                      objectPosition={selectedAtlasAsset.objectPosition || 'center'}
                    />
                  </div>
                </div>
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1">
                      Descripción Visual
                    </h4>
                    <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                      {selectedAtlasAsset.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-500 font-bold mb-1">
                      Explicación Técnica
                    </h4>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {selectedAtlasAsset.technicalExplanation}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-500 font-bold mb-1">
                      Ejemplo de Aplicación
                    </h4>
                    <p className="text-xs text-stone-700 dark:text-stone-300">
                      {selectedAtlasAsset.applicationExample}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-stone-500 font-bold mb-1">
                      Etiquetas · Formato
                    </h4>
                    <p className="text-xs font-mono-code text-stone-600 dark:text-stone-400">
                      {selectedAtlasAsset.tags.join(' · ')} · {selectedAtlasAsset.aspectRatio}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-code uppercase font-bold text-amber-400">
                    Prompt de Referencia Asociado
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(selectedAtlasAsset.prompt, selectedAtlasAsset.id, 'en')}
                    className="text-xs font-mono-code text-stone-300 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedId === selectedAtlasAsset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-stone-200 font-mono-code leading-relaxed">
                  {selectedAtlasAsset.prompt}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-[11px] font-mono-code text-stone-600 dark:text-stone-400 flex flex-wrap items-center justify-between gap-2">
                <span>
                  <strong className="text-stone-800 dark:text-stone-200">Fuente:</strong>{' '}
                  {selectedAtlasAsset.source}
                </span>
                <span>
                  <strong className="text-stone-800 dark:text-stone-200">Licencia:</strong>{' '}
                  {selectedAtlasAsset.license}
                </span>
              </div>

              {selectedAtlasAsset.relatedIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
                  <span className="font-mono-code text-stone-500 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Láminas relacionadas:</span>
                  </span>
                  {selectedAtlasAsset.relatedIds.map((relId) => {
                    const rel = VISUAL_ASSETS_MAP[relId];
                    if (!rel) return null;
                    return (
                      <button
                        key={relId}
                        type="button"
                        onClick={() => setSelectedAtlasAsset(rel)}
                        className="text-xs font-medium text-amber-700 dark:text-amber-400 underline underline-offset-2 hover:text-amber-600"
                      >
                        {rel.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
