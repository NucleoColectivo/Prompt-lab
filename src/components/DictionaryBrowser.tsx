import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  Plus, 
  Info, 
  Filter, 
  Camera, 
  Video, 
  Layers, 
  Palette, 
  Aperture,
  CheckCircle2
} from 'lucide-react';
import { MASTER_COMMANDS, CommandItem, COLOR_PALETTES } from '../data/promptData';
import { PromptBuilderState } from './PromptBuilder';

interface DictionaryBrowserProps {
  onSelectCommandForModal: (cmd: CommandItem) => void;
  onAddCommandToBuilder: (cmd: CommandItem) => void;
}

export const DictionaryBrowser: React.FC<DictionaryBrowserProps> = ({
  onSelectCommandForModal,
  onAddCommandToBuilder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Categories list derived from commands
  const categories = useMemo(() => {
    const set = new Set<string>();
    MASTER_COMMANDS.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, []);

  // Filtered commands
  const filteredCommands = useMemo(() => {
    return MASTER_COMMANDS.filter((cmd) => {
      // Section filter
      if (sectionFilter !== 'all') {
        if (cmd.section !== 'both' && cmd.section !== sectionFilter) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && cmd.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesCmd = cmd.command.toLowerCase().includes(query);
        const matchesLabel = cmd.label.toLowerCase().includes(query);
        const matchesDesc = cmd.description.toLowerCase().includes(query);
        const matchesEffect = cmd.effect.toLowerCase().includes(query);
        const matchesTags = cmd.tags.some((t) => t.toLowerCase().includes(query));
        return matchesCmd || matchesLabel || matchesDesc || matchesEffect || matchesTags;
      }

      return true;
    });
  }, [searchTerm, selectedCategory, sectionFilter]);

  const handleCopyCommand = (cmd: CommandItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd.command);
    setCopiedId(cmd.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyHex = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <section id="diccionario" className="py-16 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono-code mb-2">
              <span>EXPLORADOR TÉCNICO</span>
              <span aria-hidden="true" className="text-stone-400">/</span>
              <span>DICCIONARIO MAESTRO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Comandos y Parámetros Visuales
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Explora más de 180 directivas de dirección de arte, óptica, iluminación y cinematografía. Copia cualquier parámetro con un clic o inyéctalo en el constructor de prompts.
            </p>
          </div>

          {/* Section Filter Segmented Control */}
          <div className="inline-flex p-1 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shrink-0 shadow-xs">
            <button
              type="button"
              onClick={() => setSectionFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                sectionFilter === 'all'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Todos ({MASTER_COMMANDS.length})
            </button>
            <button
              type="button"
              onClick={() => setSectionFilter('photo')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                sectionFilter === 'photo'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Fotografía</span>
            </button>
            <button
              type="button"
              onClick={() => setSectionFilter('video')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                sectionFilter === 'video'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Video & Cine</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar comando, óptica (85mm), cámara (Hasselblad), iluminación (Rembrandt), movimiento (dolly)..."
              className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm pl-10 pr-4 py-2.5 rounded focus:outline-none focus:border-amber-500 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-colors shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filtrar por familia o categoría"
              className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-amber-500 shadow-xs"
            >
              <option value="all">Todas las Categorías ({MASTER_COMMANDS.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Results Count & Current Active Filters as clean unboxed text */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono-code mb-6 pb-2 border-b border-stone-200 dark:border-stone-800/60">
          <div className="flex items-center gap-2">
            <span>Mostrando {filteredCommands.length} resultados</span>
            {selectedCategory !== 'all' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold">{selectedCategory}</span>
              </>
            )}
          </div>
          {searchTerm && (
            <span>Búsqueda: &ldquo;{searchTerm}&rdquo;</span>
          )}
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {filteredCommands.map((cmd) => (
            <div
              key={cmd.id}
              onClick={() => onSelectCommandForModal(cmd)}
              className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-400/80 dark:hover:border-stone-700 rounded-lg transition-all flex flex-col justify-between cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div>
                {/* Header: Command badge + category text */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono-code font-bold text-amber-700 dark:text-amber-400 text-sm group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {cmd.command}
                  </span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono-code">
                    {cmd.category}
                  </span>
                </div>

                {/* Human Label */}
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-200 mb-2">
                  {cmd.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2 mb-3">
                  {cmd.description}
                </p>

                {/* Effect Preview */}
                <div className="text-[11px] text-stone-700 dark:text-stone-400 bg-stone-50 dark:bg-stone-950/60 p-2 rounded border border-stone-200 dark:border-stone-850/80 mb-3">
                  <strong className="text-stone-900 dark:text-stone-300 font-medium">Efecto visual: </strong>
                  {cmd.effect}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-850 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => handleCopyCommand(cmd, e)}
                  className="px-2.5 py-1 text-[11px] font-mono-code text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors flex items-center gap-1.5"
                  title="Copiar comando al portapapeles"
                >
                  {copiedId === cmd.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddCommandToBuilder(cmd);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono-code text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors flex items-center gap-1"
                    title="Inyectar en el constructor interactivo"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Al Builder</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCommandForModal(cmd);
                    }}
                    className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 rounded"
                    title="Ver detalles completos y ejemplo"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* 06. Colorimetría & Paletas Maestras */}
        <div className="mt-8 pt-12 border-t border-stone-200 dark:border-stone-800">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono-code mb-2">
              <span>COLOR SCIENCE & FILM LOOK</span>
              <span aria-hidden="true" className="text-stone-400">/</span>
              <span>SECCIÓN 06</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Paletas de Color & Códigos HEX
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              Paletas cinematográficas y de identidad visual para mantener coherencia en campañas y cortometrajes. Haz clic en cualquier código HEX para copiarlo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLOR_PALETTES.map((pal) => (
              <div
                key={pal.name}
                className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-200">
                      {pal.name}
                    </h4>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono-code">
                      {pal.vibe}
                    </span>
                  </div>

                  {/* Swatches Visual Bar */}
                  <div className="grid grid-cols-2 h-10 rounded overflow-hidden border border-stone-300 dark:border-stone-700/80 mb-3 shadow-inner">
                    {pal.hexCodes.map((hex, idx) => (
                      <div
                        key={hex}
                        style={{ backgroundColor: hex }}
                        className="flex items-center justify-center text-[10px] font-mono-code font-bold drop-shadow-md text-white"
                        title={`${pal.colors[idx] || hex}: ${hex}`}
                      >
                        {hex}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
                    {pal.description}
                  </p>
                </div>

                {/* Hex Copy Buttons */}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {pal.hexCodes.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={(e) => handleCopyHex(hex, e)}
                        className="text-[11px] font-mono-code px-2 py-0.5 bg-stone-100 dark:bg-stone-950 text-stone-800 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 border border-stone-300 dark:border-stone-800 rounded transition-colors"
                        title={`Copiar ${hex}`}
                      >
                        {copiedHex === hex ? '✓ Copiado' : hex}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${pal.name} color palette (${pal.hexCodes.join(' ')}), cinematic harmony`);
                      setCopiedHex(pal.name);
                      setTimeout(() => setCopiedHex(null), 1800);
                    }}
                    className="text-[11px] font-semibold text-stone-500 hover:text-amber-700 dark:hover:text-amber-300"
                  >
                    {copiedHex === pal.name ? '✓ Copiada' : 'Copiar todo'}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
