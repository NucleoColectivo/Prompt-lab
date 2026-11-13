import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Aperture, Camera, Video, Film } from 'lucide-react';
import { RECIPES, RecipeItem } from '../data/promptData';

interface RecipesSectionProps {
  onLoadRecipeToBuilder: (recipeId: string) => void;
}

export const RecipesSection: React.FC<RecipesSectionProps> = ({
  onLoadRecipeToBuilder
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (recipe: RecipeItem) => {
    navigator.clipboard.writeText(recipe.fullPrompt);
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="recetas" className="py-16 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono-code mb-2">
            <span>COMBINACIONES PROFESIONALES</span>
            <span aria-hidden="true" className="text-stone-400">/</span>
            <span>SECCIONES 15 Y 23</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
            Recetas Maestras & Fórmulas Visuales
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-2xl">
            La verdadera potencia de la dirección de arte con IA se alcanza combinando cámara, óptica, iluminación, colorimetría y física de movimiento en fórmulas coherentes.
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-amber-400/80 dark:hover:border-stone-700 transition-all shadow-xs hover:shadow-lg"
            >
              <div>
                
                {/* Visual Image / Container */}
                {recipe.image ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-950">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Unboxed Metadata Tag on top right */}
                    <div className="absolute top-3 right-3 text-[11px] font-mono-code uppercase tracking-wider bg-stone-950/85 backdrop-blur-sm px-2.5 py-1 rounded text-amber-300 border border-stone-700 shadow-xs">
                      {recipe.type === 'photo' ? 'Fotografía' : recipe.type === 'video' ? 'Cine' : recipe.type === 'ads' ? 'Publicidad' : 'Arte Digital'}
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-950 p-6 flex flex-col justify-between border-b border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between text-xs font-mono-code text-stone-500">
                      <span>FÓRMULA TÉCNICA</span>
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">{recipe.specs.camera}</span>
                    </div>
                    <div className="my-auto text-center py-4">
                      <Film className="w-8 h-8 text-amber-600/70 dark:text-amber-400/60 mx-auto mb-2" />
                      <span className="text-xs text-stone-600 dark:text-stone-400 font-mono-code">
                        {recipe.specs.lens} · {recipe.specs.aspectRatio}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono-code">
                      {recipe.specs.lighting}
                    </div>
                  </div>
                )}

                {/* Content Body */}
                <div className="p-5">
                  <div className="text-xs font-mono-code text-stone-500 mb-1">
                    {recipe.specs.camera}
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-title mb-1">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-3">
                    {recipe.subtitle}
                  </p>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {recipe.description}
                  </p>

                  {/* Commands Pills Stack (Clean unboxed tokens) */}
                  <div className="flex flex-wrap gap-1.5 mb-4 font-mono-code text-[11px]">
                    {recipe.commands.map((cmd) => (
                      <span
                        key={cmd}
                        className="px-2 py-0.5 bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 rounded"
                      >
                        {cmd}
                      </span>
                    ))}
                  </div>

                  {/* Technical Specs List */}
                  <div className="bg-stone-50 dark:bg-stone-950/70 p-3 rounded border border-stone-200 dark:border-stone-850/80 space-y-1.5 text-[11px] font-mono-code text-stone-600 dark:text-stone-400 mb-4">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Óptica:</span>
                      <span className="text-stone-800 dark:text-stone-300 text-right">{recipe.specs.lens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Luz:</span>
                      <span className="text-stone-800 dark:text-stone-300 text-right">{recipe.specs.lighting}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Color:</span>
                      <span className="text-stone-800 dark:text-stone-300 text-right truncate ml-2">{recipe.specs.color}</span>
                    </div>
                    {recipe.specs.motion && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Movimiento:</span>
                        <span className="text-amber-700 dark:text-amber-300 text-right truncate ml-2 font-medium">{recipe.specs.motion}</span>
                      </div>
                    )}
                  </div>

                  {/* Context Note */}
                  <p className="text-[11px] text-stone-500 italic mb-2">
                    {recipe.context}
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-stone-200 dark:border-stone-800/60 mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(recipe)}
                  className="flex-1 py-2 px-3 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {copiedId === recipe.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-stone-950" />
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
                  className="py-2 px-3 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 border border-stone-300 dark:border-stone-700 rounded transition-colors flex items-center gap-1"
                  title="Cargar parámetros en el constructor de prompts"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Cargar</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


