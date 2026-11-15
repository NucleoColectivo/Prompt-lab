import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Images,
  Layers,
  Terminal,
  BookOpen,
  Sliders,
} from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import {
  CommandItem,
  MASTER_COMMANDS,
  RECIPES,
  RecipeItem,
} from '../data/promptData';
import {
  GALLERY_VISUAL_ITEMS,
  GalleryVisualItem,
} from '../data/galleryCollectionsData';
import {
  LibraryEntry,
  MODULES_01_TO_05_ENTRIES,
  MODULES_META,
  ModuleId,
} from '../data/modulesData';
import { MODULE_06_VIDEO_ENTRIES } from '../data/videoAndJsonData';
import {
  EXTENDED_LIBRARY_ENTRIES,
  EXTENDED_MODULES_META,
} from '../data/extendedModulesData';

type SearchTab = 'all' | 'gallery' | 'modules' | 'commands' | 'recipes';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGalleryToBuilder: (item: GalleryVisualItem) => void;
  onOpenGalleryCollection: (collection: string) => void;
  onOpenLibraryModule: (moduleId: ModuleId) => void;
  onApplyLibraryEntryToBuilder: (entry: LibraryEntry) => void;
  onAddCommandToBuilder: (cmd: CommandItem) => void;
  onSelectCommandForModal: (cmd: CommandItem) => void;
  onLoadRecipeToBuilder: (recipeId: string) => void;
}

const ALL_MODULES_META = [
  ...MODULES_META,
  ...EXTENDED_MODULES_META,
];

const ALL_LIBRARY_ENTRIES: LibraryEntry[] = [
  ...MODULES_01_TO_05_ENTRIES,
  ...MODULE_06_VIDEO_ENTRIES,
  ...EXTENDED_LIBRARY_ENTRIES,
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectGalleryToBuilder,
  onOpenGalleryCollection,
  onOpenLibraryModule,
  onApplyLibraryEntryToBuilder,
  onAddCommandToBuilder,
  onSelectCommandForModal,
  onLoadRecipeToBuilder,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        gallery: GALLERY_VISUAL_ITEMS.slice(0, 4),
        modules: ALL_LIBRARY_ENTRIES.slice(0, 4),
        commands: MASTER_COMMANDS.slice(0, 6),
        recipes: RECIPES.slice(0, 4),
      };
    }

    const gallery = GALLERY_VISUAL_ITEMS.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.collection.toLowerCase().includes(q) ||
        g.style.toLowerCase().includes(q) ||
        g.technique.toLowerCase().includes(q) ||
        g.specs.camera.toLowerCase().includes(q) ||
        g.specs.lens.toLowerCase().includes(q) ||
        g.specs.lighting.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)) ||
        g.promptEs.toLowerCase().includes(q) ||
        g.promptEn.toLowerCase().includes(q)
    );

    const modules = ALL_LIBRARY_ENTRIES.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.subcategory.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.explanation.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q)) ||
        entry.prompt_examples.es.toLowerCase().includes(q)
    );

    const commands = MASTER_COMMANDS.filter(
      (c) =>
        c.command.toLowerCase().includes(q) ||
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );

    const recipes = RECIPES.filter(
      (r: RecipeItem) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.specs.camera.toLowerCase().includes(q) ||
        r.specs.lighting.toLowerCase().includes(q) ||
        r.commands.some((c) => c.toLowerCase().includes(q))
    );

    return { gallery, modules, commands, recipes };
  }, [query]);

  if (!isOpen) return null;

  const limit = activeTab === 'all' ? 4 : 18;
  const totalCount =
    results.gallery.length +
    results.modules.length +
    results.commands.length +
    results.recipes.length;

  const moduleTitleMap = new Map(ALL_MODULES_META.map((m) => [m.id, `${m.number}. ${m.title}`]));

  return (
    <div
      className="fixed inset-0 z-50 bg-[#101014]/75 backdrop-blur-sm flex items-start justify-center p-4 pt-12 sm:pt-20"
      role="dialog"
      aria-modal="true"
      aria-label="Buscador global del laboratorio"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#F4F2ED] dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-[#DEDAD0] dark:border-[#26262E] flex items-center gap-3 bg-white dark:bg-[#101014]">
          <Search className="w-5 h-5 text-[#326BFF] shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en 40 láminas, 130 fichas de 26 módulos, 47 comandos y 8 recetas..."
            className="flex-1 bg-transparent text-sm text-[#101014] dark:text-[#F4F2ED] placeholder:text-[#787670] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[11px] font-mono-code text-[#5B5B66] hover:text-[#101014] dark:text-[#A09E97] dark:hover:text-[#F4F2ED] px-2 py-1"
            >
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#4A4A55] dark:text-[#B4B2AC]"
            aria-label="Cerrar buscador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2.5 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F9F8F5] dark:bg-[#14141A] flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { id: 'all', label: `Todos (${totalCount})` },
              { id: 'gallery', label: `Galería (${results.gallery.length})` },
              { id: 'modules', label: `26 Módulos (${results.modules.length})` },
              { id: 'commands', label: `Comandos (${results.commands.length})` },
              { id: 'recipes', label: `Recetas (${results.recipes.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono-code font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#101014] text-[#F4F2ED] dark:bg-[#F8C300] dark:text-[#101014]'
                  : 'text-[#4A4A55] dark:text-[#B4B2AC] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1">
          {totalCount === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED]">
                No encontramos coincidencias para “{query}”.
              </p>
              <p className="text-xs text-[#5B5B66] dark:text-[#A09E97]">
                Prueba con términos como <span className="font-mono-code">Rembrandt</span>,{' '}
                <span className="font-mono-code">85mm</span>,{' '}
                <span className="font-mono-code">anamorphic</span>,{' '}
                <span className="font-mono-code">storyboard</span> o{' '}
                <span className="font-mono-code">Kodak</span>.
              </p>
            </div>
          ) : (
            <>
              {/* 1. Galería Visual */}
              {(activeTab === 'all' || activeTab === 'gallery') && results.gallery.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5" />
                      <span>Galería Visual ({results.gallery.length})</span>
                    </div>
                    {activeTab === 'all' && results.gallery.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('gallery')}
                        className="text-[11px] font-mono-code text-[#326BFF] hover:underline"
                      >
                        Ver todas →
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.gallery.slice(0, limit).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] transition-colors"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#101014]">
                          <ResilientImage
                            src={item.image}
                            alt={item.alt}
                            objectPosition={item.objectPosition || 'center'}
                            containerClassName="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#5B5B66] dark:text-[#A09E97] truncate">
                            {item.collection} · {item.style}
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onSelectGalleryToBuilder(item);
                              }}
                              className="text-[10px] font-mono-code font-bold text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] px-2 py-0.5 rounded inline-flex items-center gap-1"
                            >
                              <Sliders className="w-2.5 h-2.5" />
                              <span>Constructor</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenGalleryCollection(item.collection);
                              }}
                              className="text-[10px] font-mono-code text-[#326BFF] hover:underline"
                            >
                              Ver colección
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Fichas de la Biblioteca (26 Módulos) */}
              {(activeTab === 'all' || activeTab === 'modules') && results.modules.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Biblioteca de 26 Módulos ({results.modules.length})</span>
                    </div>
                    {activeTab === 'all' && results.modules.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('modules')}
                        className="text-[11px] font-mono-code text-[#326BFF] hover:underline"
                      >
                        Ver todas →
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.modules.slice(0, limit).map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] transition-colors flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="text-[10px] font-mono-code text-[#7545D6] dark:text-[#F8C300] font-semibold truncate">
                            {moduleTitleMap.get(entry.moduleId) || entry.moduleId} · {entry.subcategory}
                          </div>
                          <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] mt-0.5 truncate">
                            {entry.title}
                          </div>
                          <p className="text-[11px] text-[#5B5B66] dark:text-[#A09E97] line-clamp-2 mt-1">
                            {entry.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenLibraryModule(entry.moduleId);
                            }}
                            className="text-[10px] font-mono-code font-semibold text-[#326BFF] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Abrir módulo</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-[#DEDAD0] dark:text-[#2C2C36]">·</span>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onApplyLibraryEntryToBuilder(entry);
                            }}
                            className="text-[10px] font-mono-code font-bold text-[#101014] dark:text-[#F8C300] hover:underline"
                          >
                            Aplicar al Constructor
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Comandos Maestros */}
              {(activeTab === 'all' || activeTab === 'commands') && results.commands.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#101014] dark:text-[#F4F2ED] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#7545D6]" />
                      <span>Comandos del Diccionario ({results.commands.length})</span>
                    </div>
                    {activeTab === 'all' && results.commands.length > 6 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('commands')}
                        className="text-[11px] font-mono-code text-[#326BFF] hover:underline"
                      >
                        Ver todos →
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.commands.slice(0, activeTab === 'all' ? 6 : 24).map((cmd) => (
                      <div
                        key={cmd.id}
                        className="inline-flex items-center rounded-lg bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectCommandForModal(cmd);
                          }}
                          className="px-2.5 py-1.5 text-xs font-mono-code text-[#101014] dark:text-[#F4F2ED] hover:bg-black/5 dark:hover:bg-white/5"
                          title="Ver detalle del comando"
                        >
                          <span className="font-bold text-[#7545D6] dark:text-[#F8C300]">
                            {cmd.command}
                          </span>{' '}
                          <span className="text-[#5B5B66] dark:text-[#A09E97]">· {cmd.label}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onAddCommandToBuilder(cmd);
                          }}
                          className="px-2 py-1.5 text-[10px] font-mono-code font-bold bg-[#F8C300] text-[#101014] hover:bg-[#e5b400]"
                          title="Añadir al Constructor"
                        >
                          + Usar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Recetas Maestras */}
              {(activeTab === 'all' || activeTab === 'recipes') && results.recipes.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#326BFF]" />
                    <span>Recetas Maestras ({results.recipes.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.recipes.slice(0, limit).map((recipe) => (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          onLoadRecipeToBuilder(recipe.id);
                        }}
                        className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] text-left transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] truncate">
                            {recipe.title}
                          </div>
                          <div className="text-[11px] text-[#5B5B66] dark:text-[#A09E97] truncate">
                            {recipe.specs.camera} · {recipe.specs.lighting}
                          </div>
                        </div>
                        <span className="text-[11px] font-mono-code font-bold text-[#326BFF] shrink-0">
                          Cargar en Constructor →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2.5 border-t border-[#DEDAD0] dark:border-[#26262E] bg-white dark:bg-[#101014] flex items-center justify-between text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
          <span>Esc para cerrar</span>
          <span>Búsqueda local instantánea sin API</span>
        </div>
      </div>
    </div>
  );
};
