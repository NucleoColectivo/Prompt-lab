import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Images,
  Layers,
  Palette,
  Sliders,
  Braces,
  Clapperboard,
  Copy,
  Check,
  Trash2,
  Download,
  FileText,
  FolderOpen,
  ArrowRight,
  Wand2,
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
import { CreativeJournalTab } from './CreativeJournalTab';
import {
  deleteMoodboard,
  readCreativeJournal,
  readMoodboards,
  type SavedMoodboard,
} from '../services/workspaceStore';

type VaultTab =
  | 'all'
  | 'journal'
  | 'moodboards'
  | 'gallery'
  | 'modules'
  | 'builder'
  | 'json'
  | 'storyboard';

interface FavoritesVaultViewProps {
  galleryFavorites: string[];
  onToggleGalleryFavorite: (id: string) => void;
  onOpenGallery: (collection?: string) => void;
  onApplyGalleryItemToBuilder: (item: GalleryVisualItem) => void;
  onApplyAssetToBuilder: (asset: VisualAssetRecord) => void;
  onOpenLibraryModule: (moduleId: ModuleId) => void;
  onApplyLibraryEntryToBuilder: (entry: LibraryEntry) => void;
  onLoadBuilderState: (state: PromptBuilderState) => void;
  onApplyPromptPatchToBuilder?: (patch: Partial<PromptBuilderState>) => void;
  onApplyJsonStyleToBuilder: (profile: JsonStyleProfile) => void;
  onOpenJsonLab: () => void;
  onOpenInteractiveLabs: () => void;
  onOpenMoodboard?: () => void;
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
  onApplyPromptPatchToBuilder,
  onApplyJsonStyleToBuilder,
  onOpenJsonLab,
  onOpenInteractiveLabs,
  onOpenMoodboard,
}) => {
  const [activeTab, setActiveTab] = useState<VaultTab>('all');
  const [selectedProject, setSelectedProject] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [moodboards, setMoodboards] = useState<SavedMoodboard[]>(() => readMoodboards());
  const [journalCount, setJournalCount] = useState<number>(() => readCreativeJournal().length);

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
    savedJsonProfiles.length +
    moodboards.length +
    journalCount;

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

  const handleRemoveMoodboard = (boardId: string) => {
    setMoodboards(deleteMoodboard(boardId));
  };

  const handleExportMoodboardTxt = (board: SavedMoodboard) => {
    const txt = [
      'NÚCLEO COLECTIVO · MOODBOARD',
      '=======================================',
      board.creativeSummary,
      '',
      'PROMPT GENERADO:',
      board.generatedPrompt,
    ].join('\n');
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodboard-${board.title.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMoodboardJson = (board: SavedMoodboard) => {
    const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodboard-${board.title.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportVaultJson = () => {
    const journalEntries = readCreativeJournal();
    const bundle = {
      exportedAt: new Date().toISOString(),
      platform: 'NÚCLEO COLECTIVO · Visual Prompt Lab 2.0',
      creativeJournal: journalEntries,
      moodboards,
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
    a.download = `nucleo_mis_proyectos_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportVaultTxt = () => {
    const journalEntries = readCreativeJournal();
    const lines = [
      '========================================================',
      'NÚCLEO COLECTIVO · MIS PROYECTOS Y BITÁCORA CREATIVA',
      `Exportado: ${new Date().toLocaleString('es-CO')}`,
      '========================================================',
      '',
      `1. BITÁCORA CREATIVA (${journalEntries.length})`,
      ...journalEntries.flatMap((j, i) => [
        `  [${i + 1}] ${j.projectName} (${j.discipline} · ${j.date})`,
        `      Objetivo: ${j.objective || '—'}`,
        `      Herramientas: ${j.tools.join(', ')}`,
        `      Prompt: ${j.originalPrompt}`,
        `      Aprendizajes: ${j.learnings || '—'}`,
        '',
      ]),
      `2. MOODBOARDS (${moodboards.length})`,
      ...moodboards.flatMap((m, i) => [
        `  [${i + 1}] ${m.title} (${m.discipline}) · Paleta: ${m.paletteName}`,
        `      Prompt: ${m.generatedPrompt}`,
        '',
      ]),
      `3. PROMPTS GUARDADOS (${savedPrompts.length})`,
      ...savedPrompts.flatMap((p, i) => [
        `  [${i + 1}] ${p.title} (${p.projectName || 'Proyecto General'})`,
        `      ${p.promptText}`,
        '',
      ]),
      `4. LÁMINAS DE GALERÍA FAVORITAS (${galleryItems.length})`,
      ...galleryItems.map((g, i) => `  [${i + 1}] ${g.code} · ${g.title} (${g.collection})`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nucleo_mis_proyectos_${Date.now()}.txt`;
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
            ESPACIO PERSONAL · BITÁCORA, MOODBOARDS Y COLECCIONES
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
            Mis Proyectos y Bitácora ({totalCount})
          </h1>
          <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] max-w-2xl">
            Documenta procesos completos en tu Bitácora Creativa, gestiona tus Moodboards y consulta todo lo guardado desde la Galería Visual, la Biblioteca de 26 Módulos, el Constructor Modular y el Laboratorio JSON.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportVaultJson}
            disabled={totalCount === 0 && storyboardScenes.length === 0}
            className="px-3.5 py-2 text-xs font-mono-code font-semibold bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] disabled:opacity-50 rounded-lg inline-flex items-center gap-1.5 text-[#101014] dark:text-[#F4F2ED] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#326BFF]" />
            <span>Exportar .JSON</span>
          </button>
          <button
            type="button"
            onClick={handleExportVaultTxt}
            disabled={totalCount === 0 && storyboardScenes.length === 0}
            className="px-3.5 py-2 text-xs font-mono-code font-semibold bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] disabled:opacity-50 rounded-lg inline-flex items-center gap-1.5 text-[#101014] dark:text-[#F4F2ED] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#7545D6]" />
            <span>Exportar .TXT</span>
          </button>
          {onOpenMoodboard && (
            <button
              type="button"
              onClick={onOpenMoodboard}
              className="px-3.5 py-2 text-xs font-mono-code font-semibold bg-[#101014] dark:bg-white/10 text-[#F4F2ED] rounded-lg inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#F8C300]" />
              <span>Nuevo Moodboard</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenGallery('Todas')}
            className="px-4 py-2 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
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
              { id: 'all', label: `Todo (${totalCount})` },
              {
                id: 'journal',
                label: `Bitácora Creativa (${journalCount})`,
              },
              {
                id: 'moodboards',
                label: `Moodboards (${moodboards.length})`,
              },
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
                label: `Prompts (${savedPrompts.length})`,
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
              className={`px-3.5 py-2 rounded-lg text-xs font-mono-code font-semibold border transition-colors cursor-pointer ${
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

      {/* Dedicated Bitácora Creativa Tab */}
      {activeTab === 'journal' ? (
        <CreativeJournalTab
          onSendPromptToBuilder={onApplyPromptPatchToBuilder}
          onChanged={() => setJournalCount(readCreativeJournal().length)}
        />
      ) : activeTab === 'moodboards' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>Tableros de Dirección de Arte ({moodboards.length})</span>
            </h2>
            {onOpenMoodboard && (
              <button
                type="button"
                onClick={onOpenMoodboard}
                className="px-3.5 py-2 text-xs font-bold bg-[#F8C300] text-[#101014] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Abrir Moodboard Builder</span>
              </button>
            )}
          </div>

          {moodboards.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white dark:bg-[#16161C] border border-dashed border-[#DEDAD0] dark:border-[#26262E] text-center space-y-3">
              <Palette className="w-8 h-8 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
              <p className="text-base font-bold text-[#101014] dark:text-[#F4F2ED]">
                Aún no has guardado ningún moodboard
              </p>
              <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] max-w-md mx-auto">
                Combina referencias de la galería o tus propias fotos con paletas cromáticas y palabras clave en el Moodboard Builder.
              </p>
              {onOpenMoodboard && (
                <button
                  type="button"
                  onClick={onOpenMoodboard}
                  className="px-4 py-2 text-xs font-bold bg-[#F8C300] text-[#101014] rounded-lg cursor-pointer"
                >
                  Crear mi primer Moodboard
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {moodboards.map((board) => (
                <article
                  key={board.id}
                  className="rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                          {board.discipline} · {board.paletteName}
                        </div>
                        <h3 className="text-lg font-bold text-[#101014] dark:text-[#F4F2ED] mt-0.5">
                          {board.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {board.colors.slice(0, 5).map((c) => (
                          <span
                            key={c}
                            className="w-4 h-4 rounded-sm border border-black/15"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>

                    {board.references.length > 0 && (
                      <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                        {board.references.slice(0, 3).map((ref) => (
                          <div key={ref.id} className="aspect-[3/2] bg-black/10 overflow-hidden">
                            <img src={ref.image} alt={ref.title} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {board.concept && (
                      <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] line-clamp-2">
                        {board.concept}
                      </p>
                    )}

                    <pre className="text-[11px] font-mono-code bg-[#F4F2ED] dark:bg-[#101014] p-2.5 rounded-lg text-[#4A4A55] dark:text-[#B4B2AC] whitespace-pre-wrap line-clamp-3">
                      {board.generatedPrompt}
                    </pre>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DEDAD0] dark:border-[#26262E]">
                    {onApplyPromptPatchToBuilder && (
                      <button
                        type="button"
                        onClick={() =>
                          onApplyPromptPatchToBuilder({
                            subject: board.concept || board.title,
                            visualStyle: board.styles.join(', '),
                            colorPalette: `${board.paletteName} (${board.colors.join(', ')})`,
                            atmosphere: board.keywords.join(', '),
                            customNotes: `Moodboard · ${board.title}`,
                          })
                        }
                        className="flex-1 py-2 px-3 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Enviar al Constructor</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopyText(board.id, board.generatedPrompt)}
                      className="py-2 px-2.5 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg cursor-pointer"
                      aria-label="Copiar prompt del moodboard"
                    >
                      {copiedId === board.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportMoodboardJson(board)}
                      className="py-2 px-2.5 text-[11px] font-mono-code border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg cursor-pointer"
                    >
                      .JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportMoodboardTxt(board)}
                      className="py-2 px-2.5 text-[11px] font-mono-code border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg cursor-pointer"
                    >
                      .TXT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMoodboard(board.id)}
                      className="py-2 px-2.5 text-xs border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-rose-500 hover:text-rose-600 rounded-lg cursor-pointer"
                      aria-label="Eliminar moodboard"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : totalCount === 0 && (activeTab !== 'storyboard' || storyboardScenes.length === 0) ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-center space-y-4">
          <Bookmark className="w-8 h-8 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#101014] dark:text-[#F4F2ED]">
              Tu espacio de proyectos está listo
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] max-w-xl mx-auto">
              Inicia tu primer registro en la Bitácora Creativa, crea un Moodboard de dirección de arte, guarda láminas de la Galería o archiva prompts desde el Constructor Modular.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('journal')}
              className="px-4 py-2 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Abrir Bitácora Creativa</span>
            </button>
            {onOpenMoodboard && (
              <button
                type="button"
                onClick={onOpenMoodboard}
                className="px-4 py-2 text-xs font-semibold border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg hover:border-[#326BFF] cursor-pointer"
              >
                Crear Moodboard
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenGallery('Todas')}
              className="px-4 py-2 text-xs font-semibold border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg hover:border-[#326BFF] cursor-pointer"
            >
              Explorar Galería Visual
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 0A. BITÁCORA CREATIVA EN VISTA "TODO" */}
          {activeTab === 'all' && (
            <CreativeJournalTab
              onSendPromptToBuilder={onApplyPromptPatchToBuilder}
              onChanged={() => setJournalCount(readCreativeJournal().length)}
            />
          )}

          {/* 0B. MOODBOARDS GUARDADOS EN VISTA "TODO" */}
          {activeTab === 'all' && moodboards.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>Moodboards Guardados ({moodboards.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('moodboards')}
                  className="text-xs font-mono-code text-[#326BFF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Gestionar Moodboards</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moodboards.slice(0, 3).map((board) => (
                  <article
                    key={board.id}
                    className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold">
                          {board.discipline}
                        </span>
                        <span className="inline-flex gap-0.5">
                          {board.colors.slice(0, 4).map((c) => (
                            <span
                              key={c}
                              className="w-3 h-3 rounded-sm border border-black/15"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#101014] dark:text-[#F4F2ED]">
                        {board.title}
                      </h3>
                      <p className="text-xs text-[#5B5B66] dark:text-[#A09E97] line-clamp-2">
                        {board.concept || board.generatedPrompt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-[#DEDAD0] dark:border-[#26262E]">
                      {onApplyPromptPatchToBuilder && (
                        <button
                          type="button"
                          onClick={() =>
                            onApplyPromptPatchToBuilder({
                              subject: board.concept || board.title,
                              visualStyle: board.styles.join(', '),
                              colorPalette: `${board.paletteName} (${board.colors.join(', ')})`,
                              customNotes: `Moodboard · ${board.title}`,
                            })
                          }
                          className="flex-1 py-1.5 px-2.5 text-xs font-bold bg-[#F8C300] text-[#101014] rounded-lg cursor-pointer"
                        >
                          Usar en Constructor
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleExportMoodboardTxt(board)}
                        className="py-1.5 px-2 text-[11px] font-mono-code border border-[#D4D0C5] dark:border-[#2C2C36] rounded-lg cursor-pointer"
                      >
                        .TXT
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
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
                          onClick={() => {
                            if (sp.state) {
                              onLoadBuilderState(sp.state);
                            } else if (onApplyPromptPatchToBuilder) {
                              onApplyPromptPatchToBuilder({
                                mode: sp.mode || 'photo',
                                subject: sp.promptText,
                                customNotes: `Guardado · ${sp.title}`,
                              });
                            }
                          }}
                          className="flex-1 py-2 px-3 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg cursor-pointer"
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
