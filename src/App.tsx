import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
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

export default function App() {
  // Prioritize Light Mode (default false)
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      'Sin texto ni marcas inventadas (/notext)'
    ]
  });

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const scrollToBuilder = () => {
    const el = document.getElementById('builder');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDictionary = () => {
    const el = document.getElementById('biblioteca');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToVideoLab = () => {
    setActiveLibraryModule('mod-06');
    setBuilderState((prev) => ({ ...prev, mode: 'video' }));
    const el = document.getElementById('video-lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJumpToSection = (sectionId: string, moduleId?: ModuleId) => {
    if (moduleId) {
      setActiveLibraryModule(moduleId);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTryExampleInBuilder = (mode: 'photo' | 'video', promptText: string) => {
    setBuilderState((prev) => ({
      ...prev,
      mode,
      subject: promptText,
      aspectRatio: mode === 'video' ? '9:16' : '4:5',
    }));
    scrollToBuilder();
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
    scrollToBuilder();
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
    scrollToBuilder();
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
        subject: prev.subject ? `${prev.subject}, ${cmd.command}` : cmd.command
      }));
    }

    scrollToBuilder();
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
      aspectRatio: r.specs.aspectRatio.includes('16:9') ? '16:9' : r.specs.aspectRatio.includes('4:5') ? '4:5' : '3:2',
      texture: 'organic film grain, realistic physics',
      negativeAvoid: ['Evitar piel plástica artificial (/noartificialskin)', 'Sin texto ni marcas inventadas (/notext)']
    }));

    scrollToBuilder();
  };

  // Generate current prompt string for exporter
  const currentPromptText = builderState.mode === 'video'
    ? `MASTER VIDEO PROMPT — CINEMATOGRAPHY & MOTION\n01. SCENE & SUBJECT: ${builderState.subject || 'Cinematic sequence of an artwork in a contemporary gallery'}.\n02. GENRE: ${builderState.genre}.\n03. CAMERA: Shot on ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.\n04. CAMERA MOVEMENT: ${builderState.motion}.\n05. LIGHTING: ${builderState.lighting}.\n06. COLOR SCIENCE: ${builderState.colorPalette}.\n07. OUTPUT: Aspect ratio ${builderState.aspectRatio}.\n08. AVOID: ${builderState.negativeAvoid.join(', ')}.`
    : `MASTER PROMPT — PHOTOGRAPHY & VISUAL ART\n01. SUBJECT: ${builderState.subject || 'A sculptural luxury object on dark mineral stone'}.\n02. GENRE: ${builderState.genre}.\n03. CAMERA: Shot on ${builderState.camera}.\n04. OPTICS: ${builderState.lens}, ${builderState.aperture}.\n05. LIGHTING: ${builderState.lighting}.\n06. COLOR: ${builderState.colorPalette}.\n07. OUTPUT: Aspect ratio ${builderState.aspectRatio}.\n08. AVOID: ${builderState.negativeAvoid.join(', ')}.`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      
      {/* Top Bar Navigation */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenBuilder={scrollToBuilder}
        onOpenVideoLab={scrollToVideoLab}
      />

      {/* Main Content Area — Orden Pedagógico Progresivo */}
      <main className="flex-1">
        
        {/* 1. Portada */}
        <Hero
          onScrollToBuilder={scrollToBuilder}
          onScrollToDictionary={scrollToDictionary}
          onScrollToVideo={scrollToVideoLab}
        />

        {/* 2. Módulo 00: ¿Qué es un Prompt? Fundamentos y Mapa de la Plataforma */}
        <PromptFundamentals
          onJumpToSection={handleJumpToSection}
          onTryExampleInBuilder={handleTryExampleInBuilder}
        />

        {/* 3. Módulos 01–26: Biblioteca Visual Interactiva (Imagen, Cine, Narrativa, 3D, Sonido y Ética) */}
        <VisualLibraryExplorer
          activeModule={activeLibraryModule}
          onChangeModule={setActiveLibraryModule}
          onApplyEntryToBuilder={handleApplyLibraryEntryToBuilder}
        />

        {/* 4. 5 Laboratorios Creativos Interactivos (Comparador, Storyboard, Luz, Cámara, Color) */}
        <InteractiveCreativeLabs
          externalStoryboardScenes={externalStoryboardScenes}
          onApplyToBuilder={(patch, scroll = true) => {
            setBuilderState((prev) => ({ ...prev, ...patch }));
            if (scroll) scrollToBuilder();
          }}
          onJumpToJsonLab={() => handleJumpToSection('json-lab')}
        />

        {/* 5. AI Film Director (8 Etapas completas de Producción Audiovisual con Gemini) */}
        <AiFilmDirector
          onLoadIntoStoryboard={(scenes) => {
            setExternalStoryboardScenes(scenes);
            handleJumpToSection('laboratorios');
          }}
          onApplyShotToBuilder={(patch) => {
            setBuilderState((prev) => ({ ...prev, ...patch }));
            scrollToBuilder();
          }}
        />

        {/* 6. Constructor Visual de Prompts + Colecciones por Proyecto */}
        <PromptBuilder
          builderState={builderState}
          setBuilderState={setBuilderState}
          onOpenExporter={() => setIsExporterOpen(true)}
        />

        {/* 7. Laboratorio JSON Visual (Análisis Multimodal Gemini + Transferencia de Estilo) */}
        <JsonVisualLab
          onApplyStyleToBuilder={handleApplyJsonStyleToBuilder}
        />

        {/* 8. Directorio de Herramientas IA, Retos Creativos, Rutas y Diccionario ES–EN */}
        <ToolsAndAcademy
          onJumpToSection={handleJumpToSection}
        />

        {/* 9. Recetas Maestras Visuales & de Movimiento */}
        <RecipesSection
          onLoadRecipeToBuilder={handleLoadRecipeToBuilder}
        />

        {/* 10. Diccionario Maestro de Comandos & Paletas HEX */}
        <DictionaryBrowser
          onSelectCommandForModal={(cmd) => setSelectedCommandForModal(cmd)}
          onAddCommandToBuilder={handleAddCommandToBuilder}
        />

        {/* 11. Plantillas Maestras Universales & Guía por Plataforma */}
        <MasterTemplates />

      </main>

      {/* Footer */}
      <Footer />

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
