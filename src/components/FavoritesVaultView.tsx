import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Images,
  Layers,
  Sliders,
  Braces,
  Clapperboard,
  Copy,
  Check,
  Trash2,
  Download,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import {
  GALLERY_VISUAL_ITEMS,
  GalleryVisualItem,
} from '../data/galleryCollectionsData';
import {
  VISUAL_ASSET_REGISTRY,
  VisualAssetRecord,
} from '../data/visualLibraryRegistry';
import {
  LibraryEntry,
  MODULES_01_TO_05_ENTRIES,
  MODULES_META,
  ModuleId,
} from '../data/modulesData';
import {
  JsonStyleProfile,
  MODULE_06_VIDEO_ENTRIES,
} from '../data/videoAndJsonData';
import {
  EXTENDED_LIBRARY_ENTRIES,
  EXTENDED_MODULES_META,
} from '../data/extendedModulesData';
import type { SavedFavoritePrompt, PromptBuilderState } from './PromptBuilder';
import type { StoryboardSceneItem } from './InteractiveCreativeLabs';

type VaultTab = 'all' | 'gallery' | 'modules' | 'builder' | 'json' | 'storyboard';

interface FavoritesVaultViewProps {
  galleryFavorites: string[];
  onToggleGalleryFavorite: (id: string) => void;
  onOpenGallery: (collection?: string) => void;
  onApplyGalleryItemToBuilder: (item: GalleryVisualItem) => void;
  onApplyAssetToBuilder: (asset: VisualAssetRecord) => void;
  onOpenLibraryModule: (moduleId: ModuleId) => void;
  onApplyLibraryEntryToBuilder: (entry: LibraryEntry) => void;
  onLoadBuilderState: (state: PromptBuilderState) => void;
  onApplyJsonStyleToBuilder: (profile: JsonStyleProfile) => void;
  onOpenJsonLab: () => void;
  onOpenInteractiveLabs: () => void;
}

const ALL_MODULES_META = [...MODULES_META, ...EXTENDED_MODULES_META];
const ALL_LIBRARY_ENTRIES: LibraryEntry[] = [
  ...MODULES_01_TO_05_ENTRIES,
  ...MODULE_06_VIDEO_ENTRIES,
  ...EXTENDED_LIBRARY_ENTRIES,
];

function safeParseArray<T>(key: string, fallback: T[] = []): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function notifyFavoritesChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nc-favorites-updated'));
  }
}

export const FavoritesVaultView: React.FC<FavoritesVaultViewProps> = ({
  galleryFavorites,
  onToggleGalleryFavorite,
  onOpenGallery,
  onApplyGalleryItemToBuilder,
  onApplyAssetToBuilder,
  onOpenLibraryModule,
  onApplyLibraryEntryToBuilder,
  onLoadBuilderState,
  onApplyJsonStyleToBuilder,
  onOpenJsonLab,
  onOpenInteractiveLabs,
}) => {
  const [activeTab, setActiveTab] = useState<VaultTab>('all');
  const [selectedProject, setSelectedProject] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [fichaIds, setFichaIds] = useState<string[]>(() =>
    safeParseArray<string>('nc_fav_fichas_v1')
  );
  const [savedPrompts, setSavedPrompts] = useState<SavedFavoritePrompt[]>(() =>
    safeParseArray<SavedFavoritePrompt>('nc_fav_prompts_v1')
  );
  const [projects] = useState<string[]>(() =>
    safeParseArray<string>('nc_prompt_projects_v1', [
      'Proyecto General',
      'Taller Núcleo Colectivo',
      'Serie Retratos',
    ])
  );
  const [savedJsonProfiles, setSavedJsonProfiles] = useState<JsonStyleProfile[]>(() => {
    const primary = safeParseArray<JsonStyleProfile>('nc_fav_json_styles_v1');
    if (primary.length > 0) return primary;
    return safeParseArray<JsonStyleProfile>('nc_fav_json_v1');
  });
  const [storyboardScenes] = useState<StoryboardSceneItem[]>(() =>
    safeParseArray<StoryboardSceneItem>('nc_storyboard_v1')
  );

  const moduleTitleMap = useMemo(
    () => new Map(ALL_MODULES_META.map((m) => [m.id, `${m.number}. ${m.title}`])),
    []
  );

  const galleryItems = useMemo(
    () => GALLERY_VISUAL_ITEMS.filter((g) => galleryFavorites.includes(g.id)),
    [galleryFavorites]
  );
  const assetItems = useMemo(
    () => VISUAL_ASSET_REGISTRY.filter((a) => galleryFavorites.includes(a.id)),
    [galleryFavorites]
  );
  const savedLibraryEntries = useMemo(
    () => ALL_LIBRARY_ENTRIES.filter((entry) => fichaIds.includes(entry.id)),
    [fichaIds]
  );

  const filteredSavedPrompts = useMemo(() => {
    if (selectedProject === 'Todos') return savedPrompts;
    return savedPrompts.filter(
      (sp) => (sp.projectName || 'Proyecto General') === selectedProject
    );
  }, [savedPrompts, selectedProject]);

  const totalCount =
    galleryItems.length +
    assetItems.length +
    savedLibraryEntries.length +
    savedPrompts.length +
    savedJsonProfiles.length;

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleRemoveFicha = (entryId: string) => {
    const next = fichaIds.filter((id) => id !== entryId);
    setFichaIds(next);
    try {
      localStorage.setItem('nc_fav_fichas_v1', JSON.stringify(next));
      notifyFavoritesChanged();
    } catch {
      // ignore storage errors
    }
  };

  const handleRemoveSavedPrompt = (promptId: string) => {
    const next = savedPrompts.filter((p) => p.id !== promptId);
    setSavedPrompts(next);
    try {
      localStorage.setItem('nc_fav_prompts_v1', JSON.stringify(next));
      notifyFavoritesChanged();
    } catch {
      // ignore storage errors
    }
  };

  const handleRemoveJsonProfile = (profileId: string) => {
    const next = savedJsonProfiles.filter((j) => j.id !== profileId);
    setSavedJsonProfiles(next);
    try {
      localStorage.setItem('nc_fav_json_styles_v1', JSON.stringify(next));
      localStorage.removeItem('nc_fav_json_v1');
      notifyFavoritesChanged();
    } catch {
      // ignore storage errors
    }
  };

  const handleExportVaultJson = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      platform: 'NÚCLEO COLECTIVO · Visual Prompt Lab 2.0',
      gallery: galleryItems.map((g) => ({
        id: g.id,
        code: g.code,
        title: g.title,
        collection: g.collection,
        promptEs: g.promptEs,
      })),
      libraryModules: savedLibraryEntries.map((e) => ({
        id: e.id,
        moduleId: e.moduleId,
        title: e.title,
        promptEs: e.prompt_examples.es,
      })),
      builderPrompts: savedPrompts,
      jsonProfiles: savedJsonProfiles,
      storyboardScenes,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nucleo_colecciones_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="favoritos"
      className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#DEDAD0] dark:border-[#26262E] pb-6">
        <div className="space-y-1.5">
          <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
            CENTRO UNIFICADO DE COLECCIONES · PERSISTENCIA LOCAL
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
            Favoritos y Colecciones ({totalCount})
          </h1>
          <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] max-w-2xl">
            Todo lo que guardas desde la Galería Visual, la Biblioteca de 26 Módulos, el Constructor de 12 Módulos y el Laboratorio JSON reunido en un solo archivo personal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportVaultJson}
            disabled={totalCount === 0 && storyboardScenes.length === 0}
            className="px-4 py-2 text-xs font-mono-code font-semibold bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] disabled:opacity-50 rounded-lg inline-flex items-center gap-1.5 text-[#101014] dark:text-[#F4F2ED]"
          >
            <Download className="w-3.5 h-3.5 text-[#326BFF]" />
            <span>Exportar Todo (.JSON)</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenGallery('Todas')}
            className="px-4 py-2 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5"
          >
            <Images className="w-3.5 h-3.5" />
            <span>Explorar Galería</span>
          </button>
        </div>
      </div>

      {/* Summary Counts & Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'all', label: `Todas (${totalCount})` },
              {
                id: 'gallery',
                label: `Galería (${galleryItems.length + assetItems.length})`,
              },
              {
                id: 'modules',
                label: `Biblioteca (${savedLibraryEntries.length})`,
              },
              {
                id: 'builder',
                label: `Prompts & Proyectos (${savedPrompts.length})`,
              },
              {
                id: 'json',
                label: `Perfiles JSON (${savedJsonProfiles.length})`,
              },
              {
                id: 'storyboard',
                label: `Storyboard (${storyboardScenes.length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono-code font-semibold border transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300]'
                  : 'bg-white dark:bg-[#16161C] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {(activeTab === 'all' || activeTab === 'builder') && savedPrompts.length > 0 && (
          <div className="flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              aria-label="Filtrar prompts guardados por proyecto"
              className="text-xs font-mono-code bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg px-3 py-1.5 text-[#101014] dark:text-[#F4F2ED]"
            >
              <option value="Todos">Todos los proyectos ({savedPrompts.length})</option>
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Empty State */}
      {totalCount === 0 && (activeTab !== 'storyboard' || storyboardScenes.length === 0) ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-center space-y-4">
          <Bookmark className="w-8 h-8 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#101014] dark:text-[#F4F2ED]">
              Tu bóveda de colecciones está lista
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] max-w-xl mx-auto">
              Guarda láminas desde la Galería Visual, marca fichas técnicas en los 26 Módulos, archiva prompts por proyecto en el Constructor o guarda perfiles en el Laboratorio JSON.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onOpenGallery('Todas')}
              className="px-4 py-2 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg"
            >
              Explorar Galería Visual
            </button>
            <button
              type="button"
              onClick={() => onOpenLibraryModule('mod-01')}
              className="px-4 py-2 text-xs font-semibold border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg hover:border-[#326BFF]"
            >
              Explorar 26 Módulos
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 1. GALERÍA VISUAL Y ATLAS */}
          {(activeTab === 'all' || activeTab === 'gallery') &&
            (galleryItems.length > 0 || assetItems.length > 0) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] flex items-center gap-2">
                    <Images className="w-4 h-4" />
                    <span>
                      Láminas de Galería y Atlas ({galleryItems.length + assetItems.length})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryItems.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-xl overflow-hidden bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[4/3] bg-[#101014] overflow-hidden">
                          <ResilientImage
                            src={item.image}
                            alt={item.alt}
                            objectPosition={item.objectPosition || 'center'}
                            containerClassName="w-full h-full"
                          />
                        </div>
                        <div className="p-4 space-y-1.5">
                          <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                            {item.code} · {item.collection} · {item.style}
                          </div>
                          <h3 className="text-base font-bold text-[#101014] dark:text-[#F4F2ED]">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#5B5B66] dark:text-[#A09E97] line-clamp-2">
                            {item.promptEs}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 pb-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onApplyGalleryItemToBuilder(item)}
                          className="flex-1 py-2 px-3 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg"
                        >
                          Abrir en Constructor
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyText(item.id, item.promptEs)}
                          className="py-2 px-2.5 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg"
                          aria-label="Copiar prompt"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleGalleryFavorite(item.id)}
                          className="py-2 px-2.5 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-rose-500 hover:text-rose-600 rounded-lg"
                          aria-label="Quitar de favoritos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}

                  {assetItems.map((asset) => (
                    <article
                      key={asset.id}
                      className="rounded-xl overflow-hidden bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[4/3] bg-[#101014] overflow-hidden">
                          <ResilientImage
                            src={asset.image}
                            alt={asset.alt}
                            objectPosition={asset.objectPosition || 'center'}
                            containerClassName="w-full h-full"
                          />
                        </div>
                        <div className="p-4 space-y-1.5">
                          <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                            {asset.category}
                          </div>
                          <h3 className="text-base font-bold text-[#101014] dark:text-[#F4F2ED]">
                            {asset.title}
                          </h3>
                        </div>
                      </div>
                      <div className="px-4 pb-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onApplyAssetToBuilder(asset)}
                          className="flex-1 py-2 px-3 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg"
                        >
                          Abrir en Constructor
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleGalleryFavorite(asset.id)}
                          className="py-2 px-2.5 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-rose-500 hover:text-rose-600 rounded-lg"
                          aria-label="Quitar de favoritos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

          {/* 2. FICHAS DE BIBLIOTECA (26 MÓDULOS) */}
          {(activeTab === 'all' || activeTab === 'modules') &&
            savedLibraryEntries.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Fichas de la Biblioteca ({savedLibraryEntries.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedLibraryEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                          {moduleTitleMap.get(entry.moduleId) || entry.moduleId} · {entry.subcategory}
                        </div>
                        <h3 className="text-sm font-bold text-[#101014] dark:text-[#F4F2ED]">
                          {entry.title}
                        </h3>
                        <p className="text-xs text-[#5B5B66] dark:text-[#A09E97] line-clamp-2">
                          {entry.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-[#DEDAD0] dark:border-[#26262E]">
                        <button
                          type="button"
                          onClick={() => onApplyLibraryEntryToBuilder(entry)}
                          className="flex-1 py-1.5 px-2.5 text-xs font-bold bg-[#F8C300] text-[#101014] rounded-lg"
                        >
                          Usar en Constructor
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenLibraryModule(entry.moduleId)}
                          className="py-1.5 px-2.5 text-xs font-mono-code border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg hover:border-[#326BFF]"
                        >
                          Módulo
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFicha(entry.id)}
                          className="py-1.5 px-2 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-rose-500 hover:text-rose-600 rounded-lg"
                          aria-label="Quitar ficha"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

          {/* 3. PROMPTS GUARDADOS EN CONSTRUCTOR POR PROYECTO */}
          {(activeTab === 'all' || activeTab === 'builder') &&
            filteredSavedPrompts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-mono-code font-bold uppercase tracking-wider text-[#101014] dark:text-[#F4F2ED] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#7545D6]" />
                  <span>Prompts Guardados del Constructor ({filteredSavedPrompts.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSavedPrompts.map((sp) => (
                    <article
                      key={sp.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                          {sp.projectName || 'Proyecto General'} · {sp.mode === 'video' ? 'Video' : 'Foto'}
                          {sp.createdAt ? ` · ${sp.createdAt}` : ''}
                        </div>
                        <h3 className="text-sm font-bold text-[#101014] dark:text-[#F4F2ED]">
                          {sp.title}
                        </h3>
                        <pre className="text-[11px] font-mono-code bg-[#F4F2ED] dark:bg-[#101014] p-2.5 rounded-lg text-[#4A4A55] dark:text-[#B4B2AC] whitespace-pre-wrap line-clamp-4">
                          {sp.promptText}
                        </pre>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onLoadBuilderState(sp.state)}
                          className="flex-1 py-2 px-3 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg"
                        >
                          Reabrir en Constructor
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyText(sp.id, sp.promptText)}
                          className="py-2 px-2.5 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg"
                          aria-label="Copiar prompt guardado"
                        >
                          {copiedId === sp.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSavedPrompt(sp.id)}
                          className="py-2 px-2.5 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-rose-500 hover:text-rose-600 rounded-lg"
                          aria-label="Eliminar prompt guardado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

          {/* 4. PERFILES JSON VISUAL */}
          {(activeTab === 'all' || activeTab === 'json') &&
            savedJsonProfiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] flex items-center gap-2">
                    <Braces className="w-4 h-4" />
                    <span>Perfiles JSON Visual ({savedJsonProfiles.length})</span>
                  </h2>
                  <button
                    type="button"
                    onClick={onOpenJsonLab}
                    className="text-xs font-mono-code text-[#326BFF] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Ir al Lab JSON</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedJsonProfiles.map((profile) => (
                    <article
                      key={profile.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                          JSON Profile · {profile.camera}
                        </div>
                        <h3 className="text-sm font-bold text-[#101014] dark:text-[#F4F2ED]">
                          {profile.style_name}
                        </h3>
                        <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                          {profile.lighting} · {profile.color}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-[#DEDAD0] dark:border-[#26262E]">
                        <button
                          type="button"
                          onClick={() => onApplyJsonStyleToBuilder(profile)}
                          className="flex-1 py-1.5 px-2.5 text-xs font-bold bg-[#F8C300] text-[#101014] rounded-lg"
                        >
                          Aplicar al Constructor
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(profile.id, JSON.stringify(profile, null, 2))
                          }
                          className="py-1.5 px-2.5 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg"
                          aria-label="Copiar perfil JSON"
                        >
                          {copiedId === profile.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveJsonProfile(profile.id)}
                          className="py-1.5 px-2 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-rose-500 hover:text-rose-600 rounded-lg"
                          aria-label="Quitar perfil JSON"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

          {/* 5. ESCENAS DE STORYBOARD */}
          {(activeTab === 'all' || activeTab === 'storyboard') &&
            storyboardScenes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-mono-code font-bold uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] flex items-center gap-2">
                    <Clapperboard className="w-4 h-4 text-[#F8C300]" />
                    <span>Storyboard Activo ({storyboardScenes.length} planos)</span>
                  </h2>
                  <button
                    type="button"
                    onClick={onOpenInteractiveLabs}
                    className="text-xs font-mono-code text-[#326BFF] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Editar en Laboratorios</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {storyboardScenes.map((scene, idx) => (
                    <div
                      key={scene.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-1"
                    >
                      <div className="text-[10px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                        PLANO {String(idx + 1).padStart(2, '0')} · {scene.durationSec}s · {scene.shotSize}
                      </div>
                      <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]">
                        {scene.title}
                      </div>
                      <p className="text-[11px] text-[#5B5B66] dark:text-[#A09E97] line-clamp-2">
                        {scene.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </section>
  );
};
