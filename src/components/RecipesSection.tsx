import React, { useMemo, useState } from 'react';
import { Sparkles, Copy, Check, Film, Search, Eye, EyeOff, X } from 'lucide-react';
import { RECIPES, RecipeItem } from '../data/promptData';

interface RecipesSectionProps {
  onLoadRecipeToBuilder: (recipeId: string) => void;
}

type RecipeFilter = 'all' | 'photo' | 'video' | 'ads' | 'experimental';

const TYPE_LABELS: Record<RecipeItem['type'], string> = {
  photo: 'Fotografía',
  video: 'Cine y Video',
  ads: 'Publicidad',
  experimental: 'Arte y Diseño',
};

export const RecipesSection: React.FC<RecipesSectionProps> = ({
  onLoadRecipeToBuilder,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<RecipeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: RECIPES.length,
      photo: RECIPES.filter((r) => r.type === 'photo').length,
      video: RECIPES.filter((r) => r.type === 'video').length,
      ads: RECIPES.filter((r) => r.type === 'ads').length,
      experimental: RECIPES.filter((r) => r.type === 'experimental').length,
    }),
    []
  );

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return RECIPES.filter((recipe) => {
      const matchesCategory = activeFilter === 'all' || recipe.type === activeFilter;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [
        recipe.title,
        recipe.subtitle,
        recipe.description,
        recipe.context,
        recipe.specs.camera,
        recipe.specs.lens,
        recipe.specs.lighting,
        recipe.specs.color,
        ...recipe.commands,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeFilter, searchQuery]);

  const handleCopyPrompt = (recipe: RecipeItem) => {
    navigator.clipboard.writeText(recipe.fullPrompt);
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="recetas"
      className="py-12 sm:py-16 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7545D6] dark:text-[#F8C300] font-mono-code font-bold mb-2">
              <span>COMBINACIONES PROFESIONALES</span>
              <span aria-hidden="true" className="text-[#8E8C85]">/</span>
              <span>{RECIPES.length} FÓRMULAS PROBADAS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-[#101014] dark:text-[#F4F2ED]">
              Recetas Maestras &amp; Fórmulas Visuales
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#A09E97] mt-2 max-w-2xl leading-relaxed">
              Combinaciones coherentes de cámara, óptica, luz, paleta y ritmo listas para copiar o cargar directo en el Constructor Maestro.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#5B5B66] dark:text-[#8E8C85] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar lente, luz, duotono, cine..."
              aria-label="Buscar recetas maestras"
              className="w-full min-h-[42px] pl-10 pr-9 py-2 text-xs bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg focus:outline-none focus:border-[#326BFF] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#5B5B66] hover:text-[#101014] dark:hover:text-[#F4F2ED]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {(
            [
              { id: 'all', label: `Todas (${counts.all})` },
              { id: 'photo', label: `Fotografía (${counts.photo})` },
              { id: 'video', label: `Cine y Video (${counts.video})` },
              { id: 'ads', label: `Publicidad (${counts.ads})` },
              { id: 'experimental', label: `Arte y Diseño (${counts.experimental})` },
            ] as { id: RecipeFilter; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                  : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl p-10 text-center">
            <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED] mb-2">
              No hay recetas que coincidan con &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-2 min-h-[40px] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#F8C300] text-[#101014]"
            >
              Ver las {RECIPES.length} recetas
            </button>
          </div>
        ) : (
          /* Recipes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredRecipes.map((recipe) => {
              const isPromptExpanded = expandedPromptId === recipe.id;
              return (
                <article
                  key={recipe.id}
                  className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#326BFF] dark:hover:border-[#F8C300] transition-all shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Visual Image / Container */}
                    {recipe.image ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161C]">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/70 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-3 right-3 text-[11px] font-mono-code uppercase tracking-wider bg-[#101014]/88 backdrop-blur-sm px-2.5 py-1 rounded text-[#F8C300] border border-[#26262E]">
                          {TYPE_LABELS[recipe.type]}
                        </div>
                        <div className="absolute bottom-3 left-3 text-[11px] font-mono-code text-[#F4F2ED]/90 bg-[#101014]/75 px-2 py-0.5 rounded">
                          {recipe.specs.aspectRatio}
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-[4/3] w-full bg-[#F4F2ED] dark:bg-[#101014] p-6 flex flex-col justify-between border-b border-[#DEDAD0] dark:border-[#26262E]">
                        <div className="flex items-center justify-between text-xs font-mono-code text-[#5B5B66]">
                          <span>FÓRMULA TÉCNICA</span>
                          <span className="text-[#7545D6] dark:text-[#F8C300] font-semibold">
                            {recipe.specs.camera}
                          </span>
                        </div>
                        <div className="my-auto text-center py-4">
                          <Film className="w-8 h-8 text-[#7545D6] dark:text-[#F8C300] mx-auto mb-2" />
                          <span className="text-xs text-[#4A4A55] dark:text-[#A09E97] font-mono-code">
                            {recipe.specs.lens} · {recipe.specs.aspectRatio}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5B5B66] font-mono-code">
                          {recipe.specs.lighting}
                        </div>
                      </div>
                    )}

                    {/* Content Body */}
                    <div className="p-5">
                      <div className="text-xs font-mono-code text-[#5B5B66] dark:text-[#8E8C85] mb-1">
                        {recipe.specs.camera}
                      </div>
                      <h3 className="text-lg font-bold text-[#101014] dark:text-[#F4F2ED] font-serif-title mb-1 leading-snug">
                        {recipe.title}
                      </h3>
                      <p className="text-xs text-[#7545D6] dark:text-[#F8C300] font-semibold mb-3">
                        {recipe.subtitle}
                      </p>

                      <p className="text-xs text-[#4A4A55] dark:text-[#A09E97] leading-relaxed mb-4">
                        {recipe.description}
                      </p>

                      {/* Commands Tokens */}
                      <div className="flex flex-wrap gap-1.5 mb-4 font-mono-code text-[11px]">
                        {recipe.commands.map((cmd) => (
                          <span
                            key={cmd}
                            className="px-2 py-0.5 bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#E5E3DC] border border-[#DEDAD0] dark:border-[#26262E] rounded"
                          >
                            {cmd}
                          </span>
                        ))}
                      </div>

                      {/* Technical Specs List */}
                      <div className="bg-[#F4F2ED] dark:bg-[#101014] p-3 rounded-lg border border-[#DEDAD0] dark:border-[#26262E] space-y-1.5 text-[11px] font-mono-code text-[#4A4A55] dark:text-[#A09E97] mb-3">
                        <div className="flex justify-between gap-2">
                          <span className="text-[#5B5B66] dark:text-[#8E8C85]">Óptica:</span>
                          <span className="text-[#101014] dark:text-[#F4F2ED] text-right">
                            {recipe.specs.lens}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#5B5B66] dark:text-[#8E8C85]">Luz:</span>
                          <span className="text-[#101014] dark:text-[#F4F2ED] text-right">
                            {recipe.specs.lighting}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#5B5B66] dark:text-[#8E8C85]">Color:</span>
                          <span className="text-[#101014] dark:text-[#F4F2ED] text-right truncate">
                            {recipe.specs.color}
                          </span>
                        </div>
                        {recipe.specs.motion && (
                          <div className="flex justify-between gap-2">
                            <span className="text-[#5B5B66] dark:text-[#8E8C85]">Movimiento:</span>
                            <span className="text-[#326BFF] dark:text-[#F8C300] text-right truncate font-semibold">
                              {recipe.specs.motion}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Optional Expandable Full Prompt */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPromptId(isPromptExpanded ? null : recipe.id)
                        }
                        className="text-[11px] font-mono-code uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300] hover:underline flex items-center gap-1.5 mb-2"
                      >
                        {isPromptExpanded ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Ocultar prompt completo</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver prompt completo</span>
                          </>
                        )}
                      </button>

                      {isPromptExpanded && (
                        <div className="mb-3 p-3 rounded-lg bg-[#101014] text-[#F4F2ED] font-mono-code text-[11px] leading-relaxed border border-[#26262E]">
                          {recipe.fullPrompt}
                        </div>
                      )}

                      {/* Context Note */}
                      <p className="text-[11px] text-[#5B5B66] dark:text-[#8E8C85] italic">
                        {recipe.context}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-5 pt-4 border-t border-[#DEDAD0] dark:border-[#26262E] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(recipe)}
                      className="flex-1 min-h-[40px] py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] active:scale-[0.98] rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      {copiedId === recipe.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#101014]" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Prompt</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onLoadRecipeToBuilder(recipe.id)}
                      className="min-h-[40px] py-2 px-3 text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] bg-[#F4F2ED] dark:bg-[#101014] hover:border-[#326BFF] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      title="Cargar parámetros en el constructor de prompts"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#326BFF] dark:text-[#F8C300]" />
                      <span>Cargar</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
