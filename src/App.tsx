import React, { useState, useEffect, useCallback } from 'react';
import {
  Sliders,
  Braces,
  BookOpen,
  Compass,
  FileText,
  Sparkles,
  PencilRuler,
  History,
  ShoppingBag,
  Globe,
  Activity,
  Dumbbell,
  Wrench,
  SlidersHorizontal,
  PlayCircle,
} from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HomeView } from './components/HomeView';
import { PromptFundamentals } from './components/PromptFundamentals';
import { VisualLibraryExplorer } from './components/VisualLibraryExplorer';
import { InteractiveCreativeLabs, StoryboardSceneItem } from './components/InteractiveCreativeLabs';
import { AiFilmDirector } from './components/AiFilmDirector';
import { ToolsAndAcademy } from './components/ToolsAndAcademy';
import { JsonVisualLab } from './components/JsonVisualLab';
import { WebDesignLab } from './components/studios/WebDesignLab';
import { PhotoRestorationLab } from './components/studios/PhotoRestorationLab';
import { ProductCommerceLab } from './components/studios/ProductCommerceLab';
import { BeginnerFirstImageLab } from './components/studios/BeginnerFirstImageLab';
import { DrawingToImageLab } from './components/studios/DrawingToImageLab';
import { InteractiveMediaLab } from './components/studios/InteractiveMediaLab';
import { PromptBuilder, PromptBuilderState } from './components/PromptBuilder';
import { DictionaryBrowser } from './components/DictionaryBrowser';
import { RecipesSection } from './components/RecipesSection';
import { MasterTemplates } from './components/MasterTemplates';
import { ResourceExercisesView } from './components/resources/ResourceExercisesView';
import { ResourceTroubleshootingView } from './components/resources/ResourceTroubleshootingView';
import { ResourceGuidesView } from './components/resources/ResourceGuidesView';
import { ResourceTutorialsView } from './components/resources/ResourceTutorialsView';
import { Footer } from './components/Footer';
import { CommandDetailModal } from './components/CommandDetailModal';
import { WorkshopExporterModal } from './components/WorkshopExporterModal';
import { WelcomeWizardModal } from './components/WelcomeWizardModal';
import { VisualGalleryView } from './components/VisualGalleryView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { FavoritesVaultView } from './components/FavoritesVaultView';
import { EticaIaView } from './components/EticaIaView';
import { MoviesIaView } from './components/MoviesIaView';
import { CreativeExperiencesHub } from './components/experiences/CreativeExperiencesHub';
import { CommandItem, RECIPES } from './data/promptData';
import { LibraryEntry, ModuleId } from './data/modulesData';
import { JsonStyleProfile } from './data/videoAndJsonData';
import { VisualAssetRecord } from './data/visualLibraryRegistry';
import { GalleryVisualItem } from './data/galleryCollectionsData';
import type { AppSectionId, LabSubSection, ResourceSubSection } from './types/navigation';

function resolveRouteFromHash(hashValue: string): {
  section: AppSectionId;
  labSub?: LabSubSection;
  resourceSub?: ResourceSubSection;
  academySub?: 'tools' | 'challenges' | 'glossary';
} {
  const clean = hashValue.replace(/^#/, '').toLowerCase();
  switch (clean) {
    case 'galeria':
      return { section: 'galeria' };
    case 'favoritos':
      return { section: 'favoritos' };
    case 'fundamentos':
      return { section: 'fundamentos' };
    case 'biblioteca':
    case 'video-lab':
      return { section: 'biblioteca' };
    case 'mi-primera-imagen':
    case 'principiante':
      return { section: 'laboratorios', labSub: 'principiante' };
    case 'dibujo-a-imagen':
    case 'dibujo':
      return { section: 'laboratorios', labSub: 'dibujo' };
    case 'restauracion':
      return { section: 'laboratorios', labSub: 'restauracion' };
    case 'producto-lab':
    case 'producto':
      return { section: 'laboratorios', labSub: 'producto' };
    case 'web-lab':
    case 'web':
      return { section: 'laboratorios', labSub: 'web' };
    case 'interactivo':
    case 'videoarte':
    case 'tracking':
    case 'sensores':
      return { section: 'laboratorios', labSub: 'interactivo' };
    case 'laboratorios':
      return { section: 'laboratorios', labSub: 'labs' };
    case 'json-lab':
      return { section: 'laboratorios', labSub: 'json' };
    case 'experiencias':
    case 'nuevos-laboratorios':
    case 'retos-express':
    case 'desafios-creativos':
    case 'experimentos':
    case 'experimentos-abiertos':
      return { section: 'experiencias' };
    case 'film-director':
      return { section: 'film-director' };
    case 'builder':
      return { section: 'builder' };
    case 'retos':
      return { section: 'academia', academySub: 'challenges' };
    case 'glosario':
      return { section: 'academia', academySub: 'glossary' };
    case 'herramientas-academia':
    case 'academia':
      return { section: 'academia', academySub: 'tools' };
    case 'etica-ia':
    case 'etica':
      return { section: 'etica-ia' };
    case 'movies-ia':
    case 'documentales':
    case 'peliculas':
    case 'cine-ia':
      return { section: 'movies-ia' };
    case 'recetas':
    case 'recursos':
      return { section: 'recursos', resourceSub: 'recetas' };
    case 'diccionario':
      return { section: 'recursos', resourceSub: 'diccionario' };
    case 'plantillas':
      return { section: 'recursos', resourceSub: 'plantillas' };
    case 'tutoriales':
    case 'tutoriales-ia':
    case 'tutoriales-paso-a-paso':
      return { section: 'recursos', resourceSub: 'tutoriales' };
    case 'ejercicios':
    case 'ejercicios-recursos':
      return { section: 'recursos', resourceSub: 'ejercicios' };
    case 'errores':
    case 'diagnostico':
    case 'negativos':
      return { section: 'recursos', resourceSub: 'errores' };
    case 'guias':
    case 'ratios':
    case 'paletas':
      return { section: 'recursos', resourceSub: 'guias' };
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
  const [academyTab, setAcademyTab] = useState<'tools' | 'challenges' | 'glossary'>(() =>
    resolveRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '').academySub || 'tools'
  );
  const [productSeedSubject, setProductSeedSubject] = useState<string>('');

  const [activeLibraryModule, setActiveLibraryModule] = useState<ModuleId>('mod-01');
  const [activeGalleryCollection, setActiveGalleryCollection] = useState<string>('Todas');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [favoritesRevision, setFavoritesRevision] = useState(0);
  const [galleryFavorites, setGalleryFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('nc_fav_gallery_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [selectedCommandForModal, setSelectedCommandForModal] = useState<CommandItem | null>(null);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [isWelcomeWizardOpen, setIsWelcomeWizardOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nc_welcome_wizard_seen_v1') !== 'true';
    } catch {
      return true;
    }
  });
  const [externalStoryboardScenes, setExternalStoryboardScenes] = useState<StoryboardSceneItem[]>([]);
  const [externalJsonProfile, setExternalJsonProfile] = useState<JsonStyleProfile | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('nc_fav_gallery_v1', JSON.stringify(galleryFavorites));
    } catch {
      // Ignore storage errors inside restricted contexts
    }
  }, [galleryFavorites]);

  useEffect(() => {
    const handleSync = () => setFavoritesRevision((r) => r + 1);
    window.addEventListener('nc-favorites-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('nc-favorites-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const toggleGalleryFavorite = useCallback((assetId: string) => {
    setGalleryFavorites((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  }, []);

  const computeFavoritesCount = () => {
    void favoritesRevision;
    let total = galleryFavorites.length;
    try {
      const rawFichas = localStorage.getItem('nc_fav_fichas_v1');
      const rawPrompts = localStorage.getItem('nc_fav_prompts_v1');
      const rawJsonStyles =
        localStorage.getItem('nc_fav_json_styles_v1') || localStorage.getItem('nc_fav_json_v1');
      if (rawFichas) total += JSON.parse(rawFichas).length;
      if (rawPrompts) total += JSON.parse(rawPrompts).length;
      if (rawJsonStyles) total += JSON.parse(rawJsonStyles).length;
    } catch {
      // ignore parse errors
    }
    return total;
  };
  const favoritesCount = computeFavoritesCount();

  // Builder State (12 Progressive Modules)
  const [builderState, setBuilderState] = useState<PromptBuilderState>({
    mode: 'photo',
    subject: '',
    action: '',
    setting: '',
    composition: 'Regla de tercios equilibrada',
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
    visualStyle: 'Editorial Contemporáneo',
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
      if (resolved.academySub) setAcademyTab(resolved.academySub);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const closeWelcomeWizard = useCallback(() => {
    setIsWelcomeWizardOpen(false);
    try {
      localStorage.setItem('nc_welcome_wizard_seen_v1', 'true');
    } catch {
      // Ignore storage failures inside restricted iframes
    }
  }, []);

  const navigateToSection = useCallback(
    (section: AppSectionId, subTab?: string) => {
      setActiveSection(section);
      let hashTarget: string = section === 'home' ? 'inicio' : section;

      if (section === 'laboratorios') {
        const validLabs: LabSubSection[] = [
          'principiante',
          'dibujo',
          'restauracion',
          'producto',
          'web',
          'interactivo',
          'labs',
          'json',
        ];
        const nextSub: LabSubSection = validLabs.includes(subTab as LabSubSection)
          ? (subTab as LabSubSection)
          : 'labs';
        setActiveLabSub(nextSub);
        const hashByLab: Record<LabSubSection, string> = {
          principiante: 'mi-primera-imagen',
          dibujo: 'dibujo-a-imagen',
          restauracion: 'restauracion',
          producto: 'producto-lab',
          web: 'web-lab',
          interactivo: 'interactivo',
          labs: 'laboratorios',
          json: 'json-lab',
        };
        hashTarget = hashByLab[nextSub];
      } else if (section === 'recursos') {
        const validResources: ResourceSubSection[] = [
          'recetas',
          'diccionario',
          'plantillas',
          'tutoriales',
          'ejercicios',
          'errores',
          'guias',
        ];
        const nextRes: ResourceSubSection = validResources.includes(
          subTab as ResourceSubSection
        )
          ? (subTab as ResourceSubSection)
          : 'recetas';
        setActiveResourceSub(nextRes);
        hashTarget = nextRes;
      } else if (section === 'academia') {
        const nextAcademy =
          subTab === 'challenges'
            ? 'challenges'
            : subTab === 'glossary'
            ? 'glossary'
            : 'tools';
        setAcademyTab(nextAcademy);
        hashTarget =
          nextAcademy === 'challenges'
            ? 'retos'
            : nextAcademy === 'glossary'
            ? 'glosario'
            : 'herramientas-academia';
      }

      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${hashTarget}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  const openGallery = (collection = 'Todas') => {
    setActiveGalleryCollection(collection);
    navigateToSection('galeria');
  };

  const scrollToBuilder = () => navigateToSection('builder');
  const scrollToDictionary = () => navigateToSection('biblioteca');

  const handleApplyGalleryItemToBuilder = (item: GalleryVisualItem) => {
    setBuilderState((prev) => ({
      ...prev,
      mode: item.mediaType === 'video' ? 'video' : 'photo',
      subject: item.promptEs,
      composition: item.specs.composition,
      camera: item.specs.camera,
      lens: item.specs.lens,
      aperture: item.specs.aperture,
      lighting: item.specs.lighting,
      colorPalette: item.specs.color,
      atmosphere: item.specs.atmosphere,
      texture: item.specs.texture,
      visualStyle: item.style,
      aspectRatio: item.aspectRatio,
      negativeAvoid: item.negativePrompt
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }));
    navigateToSection('builder');
  };

  const handleSendGalleryItemToJsonLab = (
    item: GalleryVisualItem,
    customProfile?: JsonStyleProfile
  ) => {
    const profile: JsonStyleProfile = customProfile || {
      id: `gal-${item.id}`,
      style_name: `${item.title} (${item.style})`,
      category: item.collection,
      photography: `${item.technique} — referencia estética sin EXIF inventado`,
      camera: item.specs.camera,
      lens: item.specs.lens,
      aperture: item.specs.aperture,
      lighting: item.specs.lighting,
      composition: item.specs.composition,
      color: item.specs.color,
      focus: 'Nítido sobre sujeto principal con transición óptica orgánica',
      depth_of_field:
        item.specs.aperture.includes('1.4') || item.specs.aperture.includes('1.8')
          ? 'Baja (separación suave del fondo)'
          : 'Media equilibrada con contexto visible',
      texture: item.specs.texture,
      atmosphere: item.specs.atmosphere,
      background: item.description,
      post_processing: 'Gradación tonal coherente sin saturación artificial ni piel plástica',
      observable_notes: item.technicalExplanation,
      preservation: {
        keep_subject_identity: true,
        keep_facial_features: true,
        keep_natural_pose: true,
      },
    };
    setExternalJsonProfile(profile);
    navigateToSection('laboratorios', 'json');
  };

  const handleAddGalleryShotToStoryboard = (scene: StoryboardSceneItem) => {
    let existing: StoryboardSceneItem[] = [];
    try {
      const saved = localStorage.getItem('nc_storyboard_v1');
      if (saved) existing = JSON.parse(saved);
    } catch {
      existing = [];
    }
    const nextList = Array.isArray(existing) ? [...existing, scene] : [scene];
    try {
      localStorage.setItem('nc_storyboard_v1', JSON.stringify(nextList));
    } catch {
      // ignore storage errors
    }
    setExternalStoryboardScenes(nextList);
    navigateToSection('laboratorios', 'labs');
  };

  const handleApplyAssetToBuilder = (asset: VisualAssetRecord) => {
    setBuilderState((prev) => ({
      ...prev,
      mode: asset.category === 'Cinematografía y Video' ? 'video' : 'photo',
      subject: asset.prompt,
      visualStyle: asset.title,
    }));
    navigateToSection('builder');
  };

  const handleJumpToSection = (sectionId: string, moduleId?: ModuleId) => {
    if (moduleId) {
      setActiveLibraryModule(moduleId);
    }
    const resolved = resolveRouteFromHash(sectionId);
    navigateToSection(
      resolved.section,
      resolved.labSub || resolved.resourceSub || resolved.academySub
    );
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

  const handlePatchBuilderFromResources = (patch: Partial<PromptBuilderState>) => {
    setBuilderState((prev) => ({
      ...prev,
      ...patch,
    }));
    navigateToSection('builder');
  };

  // Generate current prompt string for exporter
  const currentPromptText =
    builderState.mode === 'video'
      ? `MASTER VIDEO PROMPT — 12 MÓDULOS\n01. SUJETO: ${builderState.subject || 'Cinematic sequence of an artwork in a contemporary gallery'}.\n02. COMPOSICIÓN: ${builderState.composition || 'Regla de tercios equilibrada'} · ${builderState.shotSize || 'Plano Medio (MS)'}.\n03. GÉNERO: ${builderState.genre}.\n04. CÁMARA: Shot on ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.\n05. MOVIMIENTO: ${builderState.motion}.\n06. ILUMINACIÓN: ${builderState.lighting}.\n07. COLOR: ${builderState.colorPalette}.\n08. FORMATO: Aspect ratio ${builderState.aspectRatio}.\n09. NEGATIVAS: ${builderState.negativeAvoid.join(', ')}.`
      : `MASTER PROMPT — 12 MÓDULOS\n01. SUJETO: ${builderState.subject || 'A sculptural luxury object on dark mineral stone'}.\n02. COMPOSICIÓN: ${builderState.composition || 'Regla de tercios equilibrada'} · ${builderState.shotSize || 'Plano Medio (MS)'}.\n03. GÉNERO: ${builderState.genre}.\n04. CÁMARA: Shot on ${builderState.camera}.\n05. ÓPTICA: ${builderState.lens}, ${builderState.aperture}.\n06. ILUMINACIÓN: ${builderState.lighting}.\n07. COLOR: ${builderState.colorPalette}.\n08. FORMATO: Aspect ratio ${builderState.aspectRatio}.\n09. NEGATIVAS: ${builderState.negativeAvoid.join(', ')}.`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2ED] text-[#101014] dark:bg-[#101014] dark:text-[#F4F2ED] transition-colors">
      {/* Top Bar Navigation */}
      <Header
        activeSection={activeSection}
        onNavigateSection={(sec, sub) => navigateToSection(sec, sub)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        favoritesCount={favoritesCount}
      />

      {/* Active Workspace Section View */}
      <main className="flex-1">
        {/* 0. HOME EDITORIAL */}
        {activeSection === 'home' && (
          <>
            <Hero
              onOpenGallery={() => openGallery('Todas')}
              onScrollToBuilder={scrollToBuilder}
              onScrollToDictionary={scrollToDictionary}
              onExploreGuide={() => {
                const el = document.getElementById('que-encuentras');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <HomeView
              onNavigateSection={navigateToSection}
              onOpenGalleryCollection={(col) => openGallery(col)}
              onOpenWelcomeWizard={() => setIsWelcomeWizardOpen(true)}
              onSendPromptToBuilder={(patch) => {
                setBuilderState((prev) => ({ ...prev, ...patch }));
                navigateToSection('builder');
              }}
            />
          </>
        )}

        {/* 1. GALERÍA VISUAL EXPERIMENTAL (Prioridad #1 — Masonry / Asimétrica + 8 Colecciones + Lightbox) */}
        {activeSection === 'galeria' && (
          <VisualGalleryView
            activeCollection={activeGalleryCollection}
            onChangeCollection={setActiveGalleryCollection}
            favorites={galleryFavorites}
            onToggleFavorite={toggleGalleryFavorite}
            onExperimentInBuilder={(patch) => {
              setBuilderState((prev) => ({ ...prev, ...patch }));
              navigateToSection('builder');
            }}
            onOpenTechnicalModule={(modId) => {
              setActiveLibraryModule(modId);
              navigateToSection('biblioteca');
            }}
            onAnalyzeInJsonLab={handleSendGalleryItemToJsonLab}
            onAddToStoryboard={handleAddGalleryShotToStoryboard}
            onOpenLabs={() => navigateToSection('laboratorios', 'labs')}
          />
        )}

        {/* 2. SECCIÓN FUNDAMENTOS (Módulo 00: ¿Qué es un Prompt?) */}
        {activeSection === 'fundamentos' && (
          <PromptFundamentals
            onJumpToSection={handleJumpToSection}
            onTryExampleInBuilder={handleTryExampleInBuilder}
          />
        )}

        {/* 3. SECCIÓN BIBLIOTECA VISUAL (Módulos 01–26) */}
        {activeSection === 'biblioteca' && (
          <VisualLibraryExplorer
            activeModule={activeLibraryModule}
            onChangeModule={setActiveLibraryModule}
            onApplyEntryToBuilder={handleApplyLibraryEntryToBuilder}
            onOpenGalleryCollection={(col) => openGallery(col)}
            onOpenJsonLab={() => navigateToSection('laboratorios', 'json')}
            onOpenLabs={() => navigateToSection('laboratorios', 'labs')}
          />
        )}

        {/* 4. SECCIÓN LABORATORIOS (Nivel Inicial, 4 Estudios Especializados, 5 Simuladores y JSON Visual) */}
        {activeSection === 'laboratorios' && (
          <div>
            <div className="bg-white dark:bg-[#16161C] border-b border-[#DEDAD0] dark:border-[#26262E]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold">
                  <span>ESTACIÓN DE LABORATORIOS Y ESTUDIOS CREATIVOS</span>
                </div>
                <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {[
                    {
                      id: 'principiante' as LabSubSection,
                      label: 'Mi Primera Imagen',
                      icon: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'dibujo' as LabSubSection,
                      label: 'Dibujo a Imagen',
                      icon: <PencilRuler className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'restauracion' as LabSubSection,
                      label: 'Restauración',
                      icon: <History className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'producto' as LabSubSection,
                      label: 'Producto',
                      icon: <ShoppingBag className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'web' as LabSubSection,
                      label: 'Diseño Web IA',
                      icon: <Globe className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'interactivo' as LabSubSection,
                      label: 'Interactivo & Videoarte',
                      icon: <Activity className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'labs' as LabSubSection,
                      label: '5 Simuladores',
                      icon: <Sliders className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'json' as LabSubSection,
                      label: 'JSON Visual',
                      icon: <Braces className="w-3.5 h-3.5 shrink-0" />,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => navigateToSection('laboratorios', tab.id)}
                      className={`px-3 py-2.5 min-h-[40px] text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap ${
                        activeLabSub === tab.id
                          ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                          : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                      }`}
                    >
                      {tab.icon}
                      <span className="truncate">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeLabSub === 'principiante' && (
              <BeginnerFirstImageLab
                onApplyToBuilder={(patch) => {
                  setBuilderState((prev) => ({ ...prev, ...patch }));
                  navigateToSection('builder');
                }}
                onOpenFundamentals={() => navigateToSection('fundamentos')}
              />
            )}

            {activeLabSub === 'dibujo' && (
              <DrawingToImageLab
                onApplyToBuilder={(patch) => {
                  setBuilderState((prev) => ({ ...prev, ...patch }));
                  navigateToSection('builder');
                }}
                onSendToProductLab={(subject) => {
                  setProductSeedSubject(subject);
                  navigateToSection('laboratorios', 'producto');
                }}
              />
            )}

            {activeLabSub === 'restauracion' && (
              <PhotoRestorationLab
                onApplyToBuilder={(patch) => {
                  setBuilderState((prev) => ({ ...prev, ...patch }));
                  navigateToSection('builder');
                }}
              />
            )}

            {activeLabSub === 'producto' && (
              <ProductCommerceLab
                externalSeedSubject={productSeedSubject}
                onApplyToBuilder={(patch) => {
                  setBuilderState((prev) => ({ ...prev, ...patch }));
                  navigateToSection('builder');
                }}
              />
            )}

            {activeLabSub === 'web' && (
              <WebDesignLab
                onOpenChallenges={() => navigateToSection('academia', 'challenges')}
              />
            )}

            {activeLabSub === 'interactivo' && (
              <InteractiveMediaLab
                onApplyToBuilder={(patch) => {
                  setBuilderState((prev) => ({ ...prev, ...patch }));
                  navigateToSection('builder');
                }}
                onOpenWebLab={() => navigateToSection('laboratorios', 'web')}
              />
            )}

            {activeLabSub === 'labs' && (
              <InteractiveCreativeLabs
                externalStoryboardScenes={externalStoryboardScenes}
                onApplyToBuilder={(patch, shouldSwitch = true) => {
                  setBuilderState((prev) => ({ ...prev, ...patch }));
                  if (shouldSwitch) navigateToSection('builder');
                }}
                onJumpToJsonLab={() => navigateToSection('laboratorios', 'json')}
                onOpenGallery={(col = 'Todas') => openGallery(col)}
                onOpenDirector={() => navigateToSection('film-director')}
                onOpenLibraryModule={(modId) => {
                  setActiveLibraryModule(modId);
                  navigateToSection('biblioteca');
                }}
              />
            )}

            {activeLabSub === 'json' && (
              <JsonVisualLab
                externalProfile={externalJsonProfile}
                onApplyStyleToBuilder={handleApplyJsonStyleToBuilder}
                onOpenGallery={() => openGallery('Todas')}
                onOpenLibraryModule={(modId) => {
                  setActiveLibraryModule(modId);
                  navigateToSection('biblioteca');
                }}
                onOpenLabs={() => navigateToSection('laboratorios', 'labs')}
              />
            )}
          </div>
        )}

        {/* 4B. SECCIÓN NUEVOS LABORATORIOS, RETOS EXPRESS Y EXPERIMENTOS CREATIVOS */}
        {activeSection === 'experiencias' && (
          <CreativeExperiencesHub
            mode="full"
            onSendPromptToBuilder={(patch) => {
              setBuilderState((prev) => ({ ...prev, ...patch }));
              navigateToSection('builder');
            }}
          />
        )}

        {/* 5. SECCIÓN PLANIFICADOR AUDIOVISUAL (8 ETAPAS) */}
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
            onOpenGalleryCine={() => openGallery('Cine')}
            onOpenVideoModule={() => {
              setActiveLibraryModule('mod-06');
              navigateToSection('biblioteca');
            }}
            onOpenJsonLab={() => navigateToSection('laboratorios', 'json')}
          />
        )}

        {/* 6. SECCIÓN CONSTRUCTOR MAESTRO DE PROMPTS */}
        {activeSection === 'builder' && (
          <PromptBuilder
            builderState={builderState}
            setBuilderState={setBuilderState}
            onOpenExporter={() => setIsExporterOpen(true)}
          />
        )}

        {/* 7. SECCIÓN FAVORITOS Y COLECCIONES GUARDADAS (Centro Unificado) */}
        {activeSection === 'favoritos' && (
          <FavoritesVaultView
            galleryFavorites={galleryFavorites}
            onToggleGalleryFavorite={toggleGalleryFavorite}
            onOpenGallery={(col = 'Todas') => openGallery(col)}
            onApplyGalleryItemToBuilder={handleApplyGalleryItemToBuilder}
            onApplyAssetToBuilder={handleApplyAssetToBuilder}
            onOpenLibraryModule={(modId) => {
              setActiveLibraryModule(modId);
              navigateToSection('biblioteca');
            }}
            onApplyLibraryEntryToBuilder={handleApplyLibraryEntryToBuilder}
            onLoadBuilderState={(state) => {
              setBuilderState(state);
              navigateToSection('builder');
            }}
            onApplyJsonStyleToBuilder={handleApplyJsonStyleToBuilder}
            onOpenJsonLab={() => navigateToSection('laboratorios', 'json')}
            onOpenInteractiveLabs={() => navigateToSection('laboratorios', 'labs')}
          />
        )}

        {/* 8. SECCIÓN ACADEMIA, APPS EXTERNAS (31) Y RETOS */}
        {activeSection === 'academia' && (
          <ToolsAndAcademy
            defaultTab={academyTab}
            onJumpToSection={handleJumpToSection}
          />
        )}

        {/* 8B. SECCIÓN ÉTICA IA (Sesgos, Dilemas Morales y Videoteca Crítica) */}
        {activeSection === 'etica-ia' && (
          <EticaIaView
            onSendPromptToBuilder={(patch) => {
              setBuilderState((prev) => ({ ...prev, ...patch }));
              navigateToSection('builder');
            }}
            onOpenLibraryModule={(modId) => {
              setActiveLibraryModule(modId);
              navigateToSection('biblioteca');
            }}
            onOpenRestorationLab={() => navigateToSection('laboratorios', 'restauracion')}
          />
        )}

        {/* 8C. SECCIÓN DOCUMENTALES Y PELÍCULAS IA (Filmoteca Crítica & Cine Club) */}
        {activeSection === 'movies-ia' && (
          <MoviesIaView
            onSendToBuilder={(patch) => {
              setBuilderState((prev) => ({ ...prev, ...patch }));
              navigateToSection('builder');
            }}
            onOpenEticaIa={() => navigateToSection('etica-ia')}
            onOpenFilmDirector={() => navigateToSection('film-director')}
          />
        )}

        {/* 9. SECCIÓN RECURSOS (Recetas, Diccionario, Plantillas, Ejercicios, Diagnóstico, Guías) */}
        {activeSection === 'recursos' && (
          <div>
            <div className="bg-white dark:bg-[#16161C] border-b border-[#DEDAD0] dark:border-[#26262E]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                <div className="text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold shrink-0">
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
                      label: 'Diccionario',
                      icon: <Compass className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'plantillas' as ResourceSubSection,
                      label: 'Plantillas',
                      icon: <FileText className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'tutoriales' as ResourceSubSection,
                      label: 'Tutoriales Paso a Paso',
                      icon: <PlayCircle className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'ejercicios' as ResourceSubSection,
                      label: 'Ejercicios y Práctica',
                      icon: <Dumbbell className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'errores' as ResourceSubSection,
                      label: 'Soluciones y Negativos',
                      icon: <Wrench className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'guias' as ResourceSubSection,
                      label: 'Guías, Ratios y Paletas',
                      icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => navigateToSection('recursos', tab.id)}
                      className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeResourceSub === tab.id
                          ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                          : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
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
            {activeResourceSub === 'plantillas' && (
              <MasterTemplates onSendToBuilder={handlePatchBuilderFromResources} />
            )}
            {activeResourceSub === 'tutoriales' && (
              <ResourceTutorialsView
                onSendToBuilder={handlePatchBuilderFromResources}
              />
            )}
            {activeResourceSub === 'ejercicios' && (
              <ResourceExercisesView
                onSendToBuilder={handlePatchBuilderFromResources}
              />
            )}
            {activeResourceSub === 'errores' && (
              <ResourceTroubleshootingView
                onSendToBuilder={handlePatchBuilderFromResources}
              />
            )}
            {activeResourceSub === 'guias' && (
              <ResourceGuidesView
                onSendToBuilder={handlePatchBuilderFromResources}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer with Full Section Navigation */}
      <Footer onNavigateSection={navigateToSection} />

      {/* Buscador Global Modal (Galería + 26 Módulos + Comandos + Recetas) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectGalleryToBuilder={handleApplyGalleryItemToBuilder}
        onOpenGalleryCollection={(col) => openGallery(col)}
        onOpenLibraryModule={(modId) => {
          setActiveLibraryModule(modId);
          navigateToSection('biblioteca');
        }}
        onApplyLibraryEntryToBuilder={handleApplyLibraryEntryToBuilder}
        onAddCommandToBuilder={handleAddCommandToBuilder}
        onSelectCommandForModal={(cmd) => setSelectedCommandForModal(cmd)}
        onLoadRecipeToBuilder={handleLoadRecipeToBuilder}
      />

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

      {/* 3-Step First-Visit Welcome Wizard Modal */}
      <WelcomeWizardModal
        isOpen={isWelcomeWizardOpen}
        onClose={closeWelcomeWizard}
        onNavigateAndClose={(section) => {
          closeWelcomeWizard();
          navigateToSection(section);
        }}
      />
    </div>
  );
}
