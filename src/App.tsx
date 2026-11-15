import React, { useState, useEffect, useCallback } from 'react';
import { Sliders, Braces, BookOpen, Compass, FileText } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HomeView } from './components/HomeView';
import { PromptFundamentals } from './components/PromptFundamentals';
import { VisualLibraryExplorer } from './components/VisualLibraryExplorer';
import { InteractiveCreativeLabs, StoryboardSceneItem } from './components/InteractiveCreativeLabs';
import { AiFilmDirector } from './components/AiFilmDirector';
import { ToolsAndAcademy } from './components/ToolsAndAcademy';
import { JsonVisualLab } from './components/JsonVisualLab';
import { PromptBuilder, PromptBuilderState } from './components/PromptBuilder';
import { DictionaryBrowser } from './components/DictionaryBrowser';
import { RecipesSection } from './components/RecipesSection';
import { MasterTemplates } from './components/MasterTemplates';
import { Footer } from './components/Footer';
import { CommandDetailModal } from './components/CommandDetailModal';
import { WorkshopExporterModal } from './components/WorkshopExporterModal';
import { CommandItem, RECIPES } from './data/promptData';
import { LibraryEntry, ModuleId } from './data/modulesData';
import { JsonStyleProfile } from './data/videoAndJsonData';
import type { AppSectionId, LabSubSection, ResourceSubSection } from './types/navigation';

function resolveRouteFromHash(hashValue: string): {
  section: AppSectionId;
  labSub?: LabSubSection;
  resourceSub?: ResourceSubSection;
} {
  const clean = hashValue.replace(/^#/, '').toLowerCase();
  switch (clean) {
    case 'fundamentos':
      return { section: 'fundamentos' };
    case 'biblioteca':
    case 'video-lab':
      return { section: 'biblioteca' };
    case 'laboratorios':
      return { section: 'laboratorios', labSub: 'labs' };
    case 'json-lab':
      return { section: 'laboratorios', labSub: 'json' };
    case 'film-director':
      return { section: 'film-director' };
    case 'builder':
      return { section: 'builder' };
    case 'herramientas-academia':
    case 'academia':
      return { section: 'academia' };
    case 'recetas':
    case 'recursos':
      return { section: 'recursos', resourceSub: 'recetas' };
    case 'diccionario':
      return { section: 'recursos', resourceSub: 'diccionario' };
    case 'plantillas':
      return { section: 'recursos', resourceSub: 'plantillas' };
    case 'inicio':
    case 'home':
    case '':
    default:
      return { section: 'home' };
  }
}

export default function App() {
  // Prioritize Light Mode (default false)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<AppSectionId>(() =>
    resolveRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '').section
  );
  const [activeLabSub, setActiveLabSub] = useState<LabSubSection>(() =>
    resolveRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '').labSub || 'labs'
  );
  const [activeResourceSub, setActiveResourceSub] = useState<ResourceSubSection>(() =>
    resolveRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '').resourceSub || 'recetas'
  );

  const [activeLibraryModule, setActiveLibraryModule] = useState<ModuleId>('mod-01');
  const [selectedCommandForModal, setSelectedCommandForModal] = useState<CommandItem | null>(null);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [externalStoryboardScenes, setExternalStoryboardScenes] = useState<StoryboardSceneItem[]>([]);

  // Builder State
  const [builderState, setBuilderState] = useState<PromptBuilderState>({
    mode: 'photo',
    subject: '',
    action: '',
    setting: '',
    genre: '/editorial',
    camera: 'Hasselblad X2D (Medio Formato)',
    lens: '85mm portrait prime lens',
    aperture: 'f/1.8 creamy bokeh',
    shotSize: 'Plano Medio (MS)',
    cameraAngle: 'Normal (Eye Level)',
    lighting: 'Rembrandt lighting, directional light with cheek triangle',
    colorPalette: 'Teal and orange cinematic grading with warm skin and cool shadows',
    temperature: 'Neutra equilibrada (5500K)',
    atmosphere: 'Aire limpio natural',
    visualStyle: 'Neo Noir',
    motion: 'Slow smooth dolly-in moving physically towards the subject',
    fps: '24 fps',
    duration: '6–8 segundos',
    aspectRatio: '4:5',
    texture: 'natural texture, visible pores',
    quality: 'RAW editorial authenticity, natural microtextures',
    negativeAvoid: [
      'Evitar piel plástica artificial (/noartificialskin)',
      'Sin texto ni marcas inventadas (/notext)',
    ],
  });

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen to browser hash changes (Back/Forward support)
  useEffect(() => {
    const onHashChange = () => {
      const resolved = resolveRouteFromHash(window.location.hash);
      setActiveSection(resolved.section);
      if (resolved.labSub) setActiveLabSub(resolved.labSub);
      if (resolved.resourceSub) setActiveResourceSub(resolved.resourceSub);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const navigateToSection = useCallback(
    (section: AppSectionId, subTab?: string) => {
      setActiveSection(section);
      let hashTarget: string = section === 'home' ? 'inicio' : section;

      if (section === 'laboratorios') {
        const nextSub = subTab === 'json' ? 'json' : 'labs';
        setActiveLabSub(nextSub);
        hashTarget = nextSub === 'json' ? 'json-lab' : 'laboratorios';
      } else if (section === 'recursos') {
        const nextRes: ResourceSubSection =
          subTab === 'diccionario'
            ? 'diccionario'
            : subTab === 'plantillas'
            ? 'plantillas'
            : 'recetas';
        setActiveResourceSub(nextRes);
        hashTarget = nextRes;
      } else if (section === 'academia') {
        hashTarget = 'herramientas-academia';
      }

      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${hashTarget}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  const scrollToBuilder = () => navigateToSection('builder');
  const scrollToDictionary = () => navigateToSection('biblioteca');

  const scrollToVideoLab = () => {
    setActiveLibraryModule('mod-06');
    setBuilderState((prev) => ({ ...prev, mode: 'video' }));
    navigateToSection('biblioteca');
  };

  const handleJumpToSection = (sectionId: string, moduleId?: ModuleId) => {
    if (moduleId) {
      setActiveLibraryModule(moduleId);
    }
    const resolved = resolveRouteFromHash(sectionId);
    navigateToSection(resolved.section, resolved.labSub || resolved.resourceSub);
  };

  const handleTryExampleInBuilder = (mode: 'photo' | 'video', promptText: string) => {
    setBuilderState((prev) => ({
      ...prev,
      mode,
      subject: promptText,
      aspectRatio: mode === 'video' ? '9:16' : '4:5',
    }));
    navigateToSection('builder');
  };

  const handleApplyLibraryEntryToBuilder = (entry: LibraryEntry) => {
    if (entry.builderPatch) {
      setBuilderState((prev) => ({
        ...prev,
        ...entry.builderPatch,
        mode: entry.builderPatch?.mode || (entry.moduleId === 'mod-06' ? 'video' : prev.mode),
        subject: prev.subject || entry.prompt_examples.es,
      }));
    } else {
      setBuilderState((prev) => ({
        ...prev,
        mode: entry.moduleId === 'mod-06' ? 'video' : prev.mode,
        subject: entry.prompt_examples.es,
        visualStyle: entry.title,
      }));
    }
    navigateToSection('builder');
  };

  const handleApplyJsonStyleToBuilder = (profile: JsonStyleProfile) => {
    setBuilderState((prev) => ({
      ...prev,
      mode: 'photo',
      camera: profile.camera,
      lens: profile.lens,
      aperture: profile.aperture,
      lighting: profile.lighting,
      colorPalette: profile.color,
      atmosphere: profile.atmosphere,
      texture: profile.texture,
      visualStyle: profile.style_name,
      setting: profile.background,
    }));
    navigateToSection('builder');
  };

  const handleAddCommandToBuilder = (cmd: CommandItem) => {
    if (cmd.section === 'video') {
      setBuilderState((prev) => ({ ...prev, mode: 'video' }));
    }

    if (cmd.category.includes('Géneros')) {
      setBuilderState((prev) => ({ ...prev, genre: cmd.command }));
    } else if (cmd.category.includes('Cámaras')) {
      setBuilderState((prev) => ({ ...prev, camera: cmd.command }));
    } else if (cmd.category.includes('Óptica') || cmd.category.includes('Lentes')) {
      setBuilderState((prev) => ({ ...prev, lens: cmd.command }));
    } else if (cmd.category.includes('Iluminación')) {
      setBuilderState((prev) => ({ ...prev, lighting: cmd.command }));
    } else if (cmd.category.includes('Movimientos')) {
      setBuilderState((prev) => ({ ...prev, motion: cmd.command, mode: 'video' }));
    } else if (cmd.category.includes('Negativas')) {
      setBuilderState((prev) => {
        if (!prev.negativeAvoid.includes(cmd.command)) {
          return { ...prev, negativeAvoid: [...prev.negativeAvoid, cmd.command] };
        }
        return prev;
      });
    } else {
      setBuilderState((prev) => ({
        ...prev,
        subject: prev.subject ? `${prev.subject}, ${cmd.command}` : cmd.command,
      }));
    }

    navigateToSection('builder');
  };

  const handleLoadRecipeToBuilder = (recipeId: string) => {
    const r = RECIPES.find((item) => item.id === recipeId);
    if (!r) return;

    const isVideoRecipe = r.type === 'video' || r.type === 'experimental';
    setBuilderState((prev) => ({
      ...prev,
      mode: isVideoRecipe ? 'video' : 'photo',
      subject: r.description,
      genre: r.commands[0] || (isVideoRecipe ? '/cinematicvideo' : '/editorial'),
      camera: r.specs.camera,
      lens: r.specs.lens,
      aperture: isVideoRecipe ? 'T2.3 cinematic aperture' : 'f/1.8 creamy bokeh',
      lighting: r.specs.lighting,
      colorPalette: r.specs.color,
      visualStyle: r.title,
      motion: r.specs.motion || 'Continuous smooth 360-degree orbit shot',
      fps: '24 fps',
      aspectRatio: r.specs.aspectRatio.includes('16:9')
        ? '16:9'
        : r.specs.aspectRatio.includes('4:5')
        ? '4:5'
        : '3:2',
      texture: 'organic film grain, realistic physics',
      negativeAvoid: [
        'Evitar piel plástica artificial (/noartificialskin)',
        'Sin texto ni marcas inventadas (/notext)',
      ],
    }));

    navigateToSection('builder');
  };

  // Generate current prompt string for exporter
  const currentPromptText =
    builderState.mode === 'video'
      ? `MASTER VIDEO PROMPT — CINEMATOGRAPHY & MOTION\n01. SCENE & SUBJECT: ${builderState.subject || 'Cinematic sequence of an artwork in a contemporary gallery'}.\n02. GENRE: ${builderState.genre}.\n03. CAMERA: Shot on ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.\n04. CAMERA MOVEMENT: ${builderState.motion}.\n05. LIGHTING: ${builderState.lighting}.\n06. COLOR SCIENCE: ${builderState.colorPalette}.\n07. OUTPUT: Aspect ratio ${builderState.aspectRatio}.\n08. AVOID: ${builderState.negativeAvoid.join(', ')}.`
      : `MASTER PROMPT — PHOTOGRAPHY & VISUAL ART\n01. SUBJECT: ${builderState.subject || 'A sculptural luxury object on dark mineral stone'}.\n02. GENRE: ${builderState.genre}.\n03. CAMERA: Shot on ${builderState.camera}.\n04. OPTICS: ${builderState.lens}, ${builderState.aperture}.\n05. LIGHTING: ${builderState.lighting}.\n06. COLOR: ${builderState.colorPalette}.\n07. OUTPUT: Aspect ratio ${builderState.aspectRatio}.\n08. AVOID: ${builderState.negativeAvoid.join(', ')}.`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      {/* Top Bar Navigation */}
      <Header
        activeSection={activeSection}
        onNavigateSection={(sec) => navigateToSection(sec)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Active Workspace Section View */}
      <main className="flex-1">
        {/* 0. HOME CLARO (Portada + Explicación completa de lo que se encuentra en la página) */}
        {activeSection === 'home' && (
          <>
            <Hero
              onScrollToBuilder={scrollToBuilder}
              onScrollToDictionary={scrollToDictionary}
              onScrollToVideo={scrollToVideoLab}
            />
            <HomeView onNavigateSection={navigateToSection} />
          </>
        )}

        {/* 1. SECCIÓN FUNDAMENTOS (Módulo 00: ¿Qué es un Prompt?) */}
        {activeSection === 'fundamentos' && (
          <PromptFundamentals
            onJumpToSection={handleJumpToSection}
            onTryExampleInBuilder={handleTryExampleInBuilder}
          />
        )}

        {/* 2. SECCIÓN BIBLIOTECA VISUAL (Módulos 01–26) */}
        {activeSection === 'biblioteca' && (
          <VisualLibraryExplorer
            activeModule={activeLibraryModule}
            onChangeModule={setActiveLibraryModule}
            onApplyEntryToBuilder={handleApplyLibraryEntryToBuilder}
          />
        )}

        {/* 3. SECCIÓN LABORATORIOS (5 Laboratorios Creativos + Laboratorio JSON Visual) */}
        {activeSection === 'laboratorios' && (
          <div>
            <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 font-bold">
                  <span>ESTACIÓN DE LABORATORIOS</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigateToSection('laboratorios', 'labs')}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-2 ${
                      activeLabSub === 'labs'
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                        : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-500'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>5 Laboratorios Creativos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToSection('laboratorios', 'json')}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-2 ${
                      activeLabSub === 'json'
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                        : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-500'
                    }`}
                  >
                    <Braces className="w-3.5 h-3.5" />
                    <span>Laboratorio JSON Visual (Módulo 07)</span>
                  </button>
                </div>
              </div>
            </div>

            {activeLabSub === 'labs' ? (
              <InteractiveCreativeLabs
                externalStoryboardScenes={externalStoryboardScenes}
                onApplyToBuilder={(patch, shouldSwitch = true) => {
                  setBuilderState((prev) => ({ ...prev, ...patch }));
                  if (shouldSwitch) navigateToSection('builder');
                }}
                onJumpToJsonLab={() => navigateToSection('laboratorios', 'json')}
              />
            ) : (
              <JsonVisualLab onApplyStyleToBuilder={handleApplyJsonStyleToBuilder} />
            )}
          </div>
        )}

        {/* 4. SECCIÓN PLANIFICADOR AUDIOVISUAL (8 ETAPAS) */}
        {activeSection === 'film-director' && (
          <AiFilmDirector
            onLoadIntoStoryboard={(scenes) => {
              setExternalStoryboardScenes(scenes);
              navigateToSection('laboratorios', 'labs');
            }}
            onApplyShotToBuilder={(patch) => {
              setBuilderState((prev) => ({ ...prev, ...patch }));
              navigateToSection('builder');
            }}
          />
        )}

        {/* 5. SECCIÓN CONSTRUCTOR MAESTRO DE PROMPTS */}
        {activeSection === 'builder' && (
          <PromptBuilder
            builderState={builderState}
            setBuilderState={setBuilderState}
            onOpenExporter={() => setIsExporterOpen(true)}
          />
        )}

        {/* 6. SECCIÓN ACADEMIA, APPS EXTERNAS (31) Y RETOS */}
        {activeSection === 'academia' && (
          <ToolsAndAcademy onJumpToSection={handleJumpToSection} />
        )}

        {/* 7. SECCIÓN RECURSOS (Recetas Maestras, Diccionario 180+, Plantillas Universales) */}
        {activeSection === 'recursos' && (
          <div>
            <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 font-bold">
                  ARCHIVO Y RECURSOS PRÁCTICOS
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      id: 'recetas' as ResourceSubSection,
                      label: 'Recetas Maestras',
                      icon: <BookOpen className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'diccionario' as ResourceSubSection,
                      label: 'Diccionario de Comandos (180+)',
                      icon: <Compass className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'plantillas' as ResourceSubSection,
                      label: 'Plantillas Universales',
                      icon: <FileText className="w-3.5 h-3.5" />,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => navigateToSection('recursos', tab.id)}
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-2 ${
                        activeResourceSub === tab.id
                          ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                          : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-500'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeResourceSub === 'recetas' && (
              <RecipesSection onLoadRecipeToBuilder={handleLoadRecipeToBuilder} />
            )}
            {activeResourceSub === 'diccionario' && (
              <DictionaryBrowser
                onSelectCommandForModal={(cmd) => setSelectedCommandForModal(cmd)}
                onAddCommandToBuilder={handleAddCommandToBuilder}
              />
            )}
            {activeResourceSub === 'plantillas' && <MasterTemplates />}
          </div>
        )}
      </main>

      {/* Footer with Full Section Navigation */}
      <Footer onNavigateSection={navigateToSection} />

      {/* Command Details Modal */}
      <CommandDetailModal
        command={selectedCommandForModal}
        onClose={() => setSelectedCommandForModal(null)}
        onAddToBuilder={handleAddCommandToBuilder}
      />

      {/* Workshop PDF / PNG Exporter Modal */}
      <WorkshopExporterModal
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
        builderState={builderState}
        generatedPrompt={currentPromptText}
      />
    </div>
  );
}
