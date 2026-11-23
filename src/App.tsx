import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { MotionConfig } from 'motion/react';
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
  Palette,
  Sun,
} from 'lucide-react';
import { Header } from './components/Header';
import { SectionSubNav } from './components/SectionSubNav';
import { Hero } from './components/Hero';
import { HomeView } from './components/HomeView';
import { Footer } from './components/Footer';
import { SectionTransition } from './components/MotionPrimitives';
import { SectionPhotoBanner } from './components/SectionPhotoBanner';
import { WelcomeWizardModal } from './components/WelcomeWizardModal';
import type { StoryboardSceneItem } from './components/InteractiveCreativeLabs';
import type { PromptBuilderState } from './components/PromptBuilder';
import { CommandItem, RECIPES } from './data/promptData';
import type { LibraryEntry, ModuleId } from './data/modulesData';
import type { JsonStyleProfile } from './data/videoAndJsonData';
import { VISUAL_LIBRARY_PATHS, type VisualAssetRecord } from './data/visualLibraryRegistry';
import { STUDIO_MEDIA_ASSETS } from './data/creativeStudiosData';
import type { GalleryVisualItem } from './data/galleryCollectionsData';
import {
  getPrimaryAxisForSection,
  type AppSectionId,
  type LabSubSection,
  type ResourceSubSection,
} from './types/navigation';
import {
  getWorkspaceSummary,
  readGalleryFavorites,
  STORAGE_KEYS,
  writeGalleryFavorites,
} from './services/workspaceStore';

// Code-split heavy workspace sections & modals to reduce initial JS payload
const PromptFundamentals = lazy(() =>
  import('./components/PromptFundamentals').then((m) => ({ default: m.PromptFundamentals }))
);
const VisualLibraryExplorer = lazy(() =>
  import('./components/VisualLibraryExplorer').then((m) => ({ default: m.VisualLibraryExplorer }))
);
const InteractiveCreativeLabs = lazy(() =>
  import('./components/InteractiveCreativeLabs').then((m) => ({
    default: m.InteractiveCreativeLabs,
  }))
);
const AiFilmDirector = lazy(() =>
  import('./components/AiFilmDirector').then((m) => ({ default: m.AiFilmDirector }))
);
const ToolsAndAcademy = lazy(() =>
  import('./components/ToolsAndAcademy').then((m) => ({ default: m.ToolsAndAcademy }))
);
const JsonVisualLab = lazy(() =>
  import('./components/JsonVisualLab').then((m) => ({ default: m.JsonVisualLab }))
);
const WebDesignLab = lazy(() =>
  import('./components/studios/WebDesignLab').then((m) => ({ default: m.WebDesignLab }))
);
const PhotoRestorationLab = lazy(() =>
  import('./components/studios/PhotoRestorationLab').then((m) => ({
    default: m.PhotoRestorationLab,
  }))
);
const ProductCommerceLab = lazy(() =>
  import('./components/studios/ProductCommerceLab').then((m) => ({
    default: m.ProductCommerceLab,
  }))
);
const BeginnerFirstImageLab = lazy(() =>
  import('./components/studios/BeginnerFirstImageLab').then((m) => ({
    default: m.BeginnerFirstImageLab,
  }))
);
const DrawingToImageLab = lazy(() =>
  import('./components/studios/DrawingToImageLab').then((m) => ({
    default: m.DrawingToImageLab,
  }))
);
const InteractiveMediaLab = lazy(() =>
  import('./components/studios/InteractiveMediaLab').then((m) => ({
    default: m.InteractiveMediaLab,
  }))
);
const MoodboardBuilderLab = lazy(() =>
  import('./components/studios/MoodboardBuilderLab').then((m) => ({
    default: m.MoodboardBuilderLab,
  }))
);
const LightingSimulatorLab = lazy(() =>
  import('./components/studios/LightingSimulatorLab').then((m) => ({
    default: m.LightingSimulatorLab,
  }))
);
const PromptBuilder = lazy(() =>
  import('./components/PromptBuilder').then((m) => ({ default: m.PromptBuilder }))
);
const DictionaryBrowser = lazy(() =>
  import('./components/DictionaryBrowser').then((m) => ({ default: m.DictionaryBrowser }))
);
const RecipesSection = lazy(() =>
  import('./components/RecipesSection').then((m) => ({ default: m.RecipesSection }))
);
const MasterTemplates = lazy(() =>
  import('./components/MasterTemplates').then((m) => ({ default: m.MasterTemplates }))
);
const ResourceExercisesView = lazy(() =>
  import('./components/resources/ResourceExercisesView').then((m) => ({
    default: m.ResourceExercisesView,
  }))
);
const ResourceTroubleshootingView = lazy(() =>
  import('./components/resources/ResourceTroubleshootingView').then((m) => ({
    default: m.ResourceTroubleshootingView,
  }))
);
const ResourceGuidesView = lazy(() =>
  import('./components/resources/ResourceGuidesView').then((m) => ({
    default: m.ResourceGuidesView,
  }))
);
const ResourceTutorialsView = lazy(() =>
  import('./components/resources/ResourceTutorialsView').then((m) => ({
    default: m.ResourceTutorialsView,
  }))
);
const VisualGalleryView = lazy(() =>
  import('./components/VisualGalleryView').then((m) => ({ default: m.VisualGalleryView }))
);
const FavoritesVaultView = lazy(() =>
  import('./components/FavoritesVaultView').then((m) => ({ default: m.FavoritesVaultView }))
);
const EticaIaView = lazy(() =>
  import('./components/EticaIaView').then((m) => ({ default: m.EticaIaView }))
);
const MoviesIaView = lazy(() =>
  import('./components/MoviesIaView').then((m) => ({ default: m.MoviesIaView }))
);
const CreativeExperiencesHub = lazy(() =>
  import('./components/experiences/CreativeExperiencesHub').then((m) => ({
    default: m.CreativeExperiencesHub,
  }))
);
const GlobalSearchModal = lazy(() =>
  import('./components/GlobalSearchModal').then((m) => ({ default: m.GlobalSearchModal }))
);
const CommandDetailModal = lazy(() =>
  import('./components/CommandDetailModal').then((m) => ({ default: m.CommandDetailModal }))
);
const WorkshopExporterModal = lazy(() =>
  import('./components/WorkshopExporterModal').then((m) => ({ default: m.WorkshopExporterModal }))
);

function SectionLoadingFallback() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center gap-3 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-8 h-8 rounded-full border-2 border-[#DEDAD0] dark:border-[#26262E] border-t-[#F8C300] animate-spin" />
      <p className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
        Cargando módulo del laboratorio...
      </p>
    </div>
  );
}

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
    case 'mis-proyectos':
    case 'proyectos':
    case 'bitacora':
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
    case 'moodboard':
    case 'tablero':
      return { section: 'laboratorios', labSub: 'moodboard' };
    case 'iluminacion':
    case 'simulador-luz':
    case 'simulador-iluminacion':
      return { section: 'laboratorios', labSub: 'iluminacion' };
    case 'laboratorios':
      return { section: 'laboratorios', labSub: 'labs' };
    case 'json-lab':
      return { section: 'laboratorios', labSub: 'json' };
    case 'experiencias':
    case 'explorar':
    case 'nuevos-laboratorios':
    case 'retos-express':
    case 'desafios-creativos':
    case 'experimentos':
    case 'experimentos-abiertos':
      return { section: 'experiencias' };
    case 'film-director':
      return { section: 'film-director' };
    case 'builder':
    case 'crear':
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<AppSectionId>(() =>
    resolveRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '').section
  );
  const [activeLabSub, setActiveLabSub] = useState<LabSubSection>(() =>
    resolveRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '').labSub || 'labs'
  );
  const [activeResourceSub, setActiveResourceSub] = useState<ResourceSubSection>(() =>
    resolveRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '').resourceSub ||
    'recetas'
  );
  const [academyTab, setAcademyTab] = useState<'tools' | 'challenges' | 'glossary'>(() =>
    resolveRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '').academySub ||
    'tools'
  );
  const [productSeedSubject, setProductSeedSubject] = useState<string>('');

  const [activeLibraryModule, setActiveLibraryModule] = useState<ModuleId>('mod-01');
  const [activeGalleryCollection, setActiveGalleryCollection] = useState<string>('Todas');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [favoritesRevision, setFavoritesRevision] = useState(0);
  const [galleryFavorites, setGalleryFavorites] = useState<string[]>(() => readGalleryFavorites());
  const [selectedCommandForModal, setSelectedCommandForModal] = useState<CommandItem | null>(null);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [isWelcomeWizardOpen, setIsWelcomeWizardOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.welcomeWizardSeen) !== 'true';
    } catch {
      return false;
    }
  });
  const [externalStoryboardScenes, setExternalStoryboardScenes] = useState<StoryboardSceneItem[]>(
    []
  );
  const [externalJsonProfile, setExternalJsonProfile] = useState<JsonStyleProfile | null>(null);

  useEffect(() => {
    writeGalleryFavorites(galleryFavorites);
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

  // Global Cmd/Ctrl + K shortcut for unified search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleGalleryFavorite = useCallback((assetId: string) => {
    setGalleryFavorites((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  }, []);

  void favoritesRevision;
  const favoritesCount = getWorkspaceSummary(galleryFavorites).favoritesTotal;

  // Builder State (8 Disciplines + 12 Progressive Modules)
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
      localStorage.setItem(STORAGE_KEYS.welcomeWizardSeen, 'true');
    } catch {
      // Ignore storage failures inside restricted iframes
    }
  }, []);

  const navigateToSection = useCallback((section: AppSectionId, subTab?: string) => {
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
        'moodboard',
        'iluminacion',
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
        moodboard: 'moodboard',
        iluminacion: 'iluminacion',
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
      const nextRes: ResourceSubSection = validResources.includes(subTab as ResourceSubSection)
        ? (subTab as ResourceSubSection)
        : 'recetas';
      setActiveResourceSub(nextRes);
      hashTarget = nextRes;
    } else if (section === 'academia') {
      const nextAcademy =
        subTab === 'challenges' ? 'challenges' : subTab === 'glossary' ? 'glossary' : 'tools';
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
  }, []);

  const openGallery = (collection = 'Todas') => {
    setActiveGalleryCollection(collection);
    navigateToSection('galeria');
  };

  const scrollToBuilder = () => navigateToSection('builder');
  const scrollToDictionary = () => navigateToSection('biblioteca');

  const handleApplyGalleryItemToBuilder = (item: GalleryVisualItem) => {
    const isVideo = item.mediaType === 'video' || item.collection === 'Motion y Video';
    const mappedCategory = isVideo
      ? 'video'
      : item.collection === 'Producto'
      ? 'branding'
      : item.collection === 'Arte Digital'
      ? 'experimental'
      : item.collection === 'Paisaje'
      ? 'architecture'
      : 'photo';

    setBuilderState((prev) => ({
      ...prev,
      mode: isVideo ? 'video' : 'photo',
      category: mappedCategory,
      subject: item.promptEs,
      setting: item.description,
      composition: item.specs.composition,
      camera: item.specs.camera,
      lens: item.specs.lens,
      aperture: item.specs.aperture,
      lighting: item.specs.lighting,
      colorPalette: item.specs.color,
      atmosphere: item.specs.atmosphere,
      texture: item.specs.texture,
      materials: item.specs.texture,
      visualStyle: item.style,
      aspectRatio: item.aspectRatio,
      negativeAvoid: item.negativePrompt
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      customNotes: `Galería · ${item.code} (${item.title})`,
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
      const saved = localStorage.getItem(STORAGE_KEYS.storyboard);
      if (saved) existing = JSON.parse(saved);
    } catch {
      existing = [];
    }
    const nextList = Array.isArray(existing) ? [...existing, scene] : [scene];
    try {
      localStorage.setItem(STORAGE_KEYS.storyboard, JSON.stringify(nextList));
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

  const currentPromptText =
    builderState.mode === 'video'
      ? `MASTER VIDEO PROMPT — 12 MÓDULOS\n01. SUJETO: ${builderState.subject || 'Cinematic sequence of an artwork in a contemporary gallery'}.\n02. COMPOSICIÓN: ${builderState.composition || 'Regla de tercios equilibrada'} · ${builderState.shotSize || 'Plano Medio (MS)'}.\n03. GÉNERO: ${builderState.genre}.\n04. CÁMARA: Shot on ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.\n05. MOVIMIENTO: ${builderState.motion}.\n06. ILUMINACIÓN: ${builderState.lighting}.\n07. COLOR: ${builderState.colorPalette}.\n08. FORMATO: Aspect ratio ${builderState.aspectRatio}.\n09. NEGATIVAS: ${builderState.negativeAvoid.join(', ')}.`
      : `MASTER PROMPT — 12 MÓDULOS\n01. SUJETO: ${builderState.subject || 'A sculptural luxury object on dark mineral stone'}.\n02. COMPOSICIÓN: ${builderState.composition || 'Regla de tercios equilibrada'} · ${builderState.shotSize || 'Plano Medio (MS)'}.\n03. GÉNERO: ${builderState.genre}.\n04. CÁMARA: Shot on ${builderState.camera}.\n05. ÓPTICA: ${builderState.lens}, ${builderState.aperture}.\n06. ILUMINACIÓN: ${builderState.lighting}.\n07. COLOR: ${builderState.colorPalette}.\n08. FORMATO: Aspect ratio ${builderState.aspectRatio}.\n09. NEGATIVAS: ${builderState.negativeAvoid.join(', ')}.`;

  const currentAxis = getPrimaryAxisForSection(activeSection, activeResourceSub);
  const viewTransitionKey =
    activeSection === 'laboratorios'
      ? `laboratorios-${activeLabSub}`
      : activeSection === 'recursos'
      ? `recursos-${activeResourceSub}`
      : activeSection === 'academia'
      ? `academia-${academyTab}`
      : activeSection;

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen flex flex-col bg-[#F4F2ED] text-[#101014] dark:bg-[#101014] dark:text-[#F4F2ED] transition-colors">
      {/* Top Bar Navigation (6 Clean Axes) */}
      <Header
        activeSection={activeSection}
        activeResourceSub={activeResourceSub}
        onNavigateSection={(sec, sub) => navigateToSection(sec, sub)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        favoritesCount={favoritesCount}
      />

      {/* Contextual Axis Sub-Navigation for Crear, Biblioteca & Explorar */}
      <SectionSubNav
        axis={currentAxis}
        activeSection={activeSection}
        activeLabSub={activeLabSub}
        activeResourceSub={activeResourceSub}
        onNavigateSection={(sec, sub) => navigateToSection(sec, sub)}
      />

      {/* Active Workspace Section View */}
      <main className="flex-1">
        <SectionTransition transitionKey={viewTransitionKey}>
        {/* 0. HOME EDITORIAL (Eager loaded for instant FCP) */}
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

        <Suspense fallback={<SectionLoadingFallback />}>
          {/* 1. GALERÍA VISUAL EXPERIMENTAL */}
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

          {/* 2. SECCIÓN FUNDAMENTOS */}
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

          {/* 4. SECCIÓN LABORATORIOS (10 Estudios Especializados) */}
          {activeSection === 'laboratorios' && (() => {
            const LAB_BANNERS: Record<
              LabSubSection,
              { image: string; position?: 'center' | 'top' | 'bottom'; title: string; subtitle: string; kicker: string }
            > = {
              moodboard: {
                image: VISUAL_LIBRARY_PATHS.colorDuotone,
                title: 'Moodboard Builder · Dirección de Arte',
                subtitle: 'Construye tableros visuales curados con paleta HEX, referencias de estilo, atmósfera y exportación directa al Constructor.',
                kicker: 'LABORATORIO 01 · DIRECCIÓN DE ARTE',
              },
              iluminacion: {
                image: VISUAL_LIBRARY_PATHS.lightRembrandt,
                position: 'top',
                title: 'Simulador de Iluminación · 3 Puntos y 9 Parámetros',
                subtitle: 'Experimenta en tiempo real con Rembrandt, Butterfly, Split y Rim Light, diagrama técnico interactivo e intensidades Key, Fill y Rim.',
                kicker: 'LABORATORIO 02 · ILUMINACIÓN DE ESTUDIO',
              },
              principiante: {
                image: VISUAL_LIBRARY_PATHS.artBotanical,
                title: 'Mi Primera Imagen con IA',
                subtitle: 'Laboratorio guiado paso a paso para crear tu primera imagen con intención visual clara sin tecnicismos innecesarios.',
                kicker: 'LABORATORIO 03 · INICIACIÓN CREATIVA',
              },
              dibujo: {
                image: STUDIO_MEDIA_ASSETS.drawingTo3dRender,
                title: 'De Boceto o Dibujo a Imagen Final',
                subtitle: 'Traduce trazos a mano, ilustraciones o bocetos arquitectónicos en renders fotográficos, editoriales o 3D.',
                kicker: 'LABORATORIO 04 · BOCETO A RENDER',
              },
              restauracion: {
                image: STUDIO_MEDIA_ASSETS.restorationBeforeAfter,
                title: 'Restauración Fotográfica y Archivo',
                subtitle: 'Recupera memoria visual, repara texturas y preserva fidelidad histórica con prompts éticos de restauración.',
                kicker: 'LABORATORIO 05 · MEMORIA Y RESTAURACIÓN',
              },
              producto: {
                image: VISUAL_LIBRARY_PATHS.adLuxury,
                title: 'Estudio de Fotografía de Producto',
                subtitle: 'Dirige campañas publicitarias, splash shots, empaques de lujo e iluminación comercial de alto impacto.',
                kicker: 'LABORATORIO 06 · PUBLICIDAD Y PRODUCTO',
              },
              web: {
                image: STUDIO_MEDIA_ASSETS.webDesignShowcase,
                title: 'Diseño Web e Interfaces con IA',
                subtitle: 'Arquitectura de información, sistemas de diseño y prompts estructurados para sitios web y aplicaciones contemporáneas.',
                kicker: 'LABORATORIO 07 · DISEÑO WEB Y UI/UX',
              },
              interactivo: {
                image: VISUAL_LIBRARY_PATHS.vfxProjectionMapping,
                title: 'Laboratorio Interactivo & Videoarte',
                subtitle: 'Experimentación en vivo con cámara, micrófono, tracking visual y sistemas generativos en tiempo real.',
                kicker: 'LABORATORIO 08 · PROGRAMACIÓN CREATIVA',
              },
              labs: {
                image: VISUAL_LIBRARY_PATHS.camRigStudio,
                title: '5 Simuladores Visuales y Storyboard',
                subtitle: 'Combina focales, encuadres, movimientos de cámara, paletas cromáticas y secuencias de storyboard interactivo.',
                kicker: 'LABORATORIO 09 · SIMULADORES VISUALES',
              },
              json: {
                image: VISUAL_LIBRARY_PATHS.colorJsonTransfer,
                title: 'Laboratorio JSON Visual y Transferencia de Estilo',
                subtitle: 'Estructura estilos fotográficos, paletas y cámaras en esquemas JSON reutilizables para máxima consistencia.',
                kicker: 'LABORATORIO 10 · CONSISTENCIA JSON',
              },
            };
            const currentLabBanner = LAB_BANNERS[activeLabSub] || LAB_BANNERS.moodboard;
            return (
            <div>
              <SectionPhotoBanner
                image={currentLabBanner.image}
                imageAlt={currentLabBanner.title}
                imagePosition={currentLabBanner.position}
                accentTint="navy"
                compact
                kicker={currentLabBanner.kicker}
                topRight={
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#F4F2ED] backdrop-blur-xs">
                    10 Estudios Especializados
                  </span>
                }
                title={currentLabBanner.title}
                subtitle={currentLabBanner.subtitle}
              />

              <div className="bg-white dark:bg-[#16161C] border-b border-[#DEDAD0] dark:border-[#26262E]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold">
                    <span>ESTACIÓN DE LABORATORIOS Y ESTUDIOS CREATIVOS (10)</span>
                  </div>
                  <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    {[
                      {
                        id: 'moodboard' as LabSubSection,
                        label: 'Moodboard Builder',
                        icon: <Palette className="w-3.5 h-3.5 shrink-0" />,
                      },
                      {
                        id: 'iluminacion' as LabSubSection,
                        label: 'Simulador de Luz',
                        icon: <Sun className="w-3.5 h-3.5 shrink-0" />,
                      },
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
                        className={`px-3 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap ${
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

              {activeLabSub === 'moodboard' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                  <MoodboardBuilderLab
                    onApplyToBuilder={(patch) => {
                      setBuilderState((prev) => ({ ...prev, ...patch }));
                      navigateToSection('builder');
                    }}
                    onOpenProjects={() => navigateToSection('favoritos')}
                  />
                </div>
              )}

              {activeLabSub === 'iluminacion' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                  <LightingSimulatorLab
                    onApplyToBuilder={(patch) => {
                      setBuilderState((prev) => ({ ...prev, ...patch }));
                      navigateToSection('builder');
                    }}
                  />
                </div>
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
            );
          })()}

          {/* 4B. EXPERIENCIAS Y RETOS CREATIVOS */}
          {activeSection === 'experiencias' && (
            <CreativeExperiencesHub
              mode="full"
              onSendPromptToBuilder={(patch) => {
                setBuilderState((prev) => ({ ...prev, ...patch }));
                navigateToSection('builder');
              }}
            />
          )}

          {/* 5. PLANIFICADOR AUDIOVISUAL (8 ETAPAS) */}
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

          {/* 6. CONSTRUCTOR MODULAR DE PROMPTS */}
          {activeSection === 'builder' && (
            <PromptBuilder
              builderState={builderState}
              setBuilderState={setBuilderState}
              onOpenExporter={() => setIsExporterOpen(true)}
            />
          )}

          {/* 7. MIS PROYECTOS Y COLECCIONES GUARDADAS */}
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
              onApplyPromptPatchToBuilder={(patch) => {
                setBuilderState((prev) => ({ ...prev, ...patch }));
                navigateToSection('builder');
              }}
              onApplyJsonStyleToBuilder={handleApplyJsonStyleToBuilder}
              onOpenJsonLab={() => navigateToSection('laboratorios', 'json')}
              onOpenInteractiveLabs={() => navigateToSection('laboratorios', 'labs')}
              onOpenMoodboard={() => navigateToSection('laboratorios', 'moodboard')}
            />
          )}

          {/* 8. ACADEMIA, APPS IA Y GLOSARIO */}
          {activeSection === 'academia' && (
            <ToolsAndAcademy defaultTab={academyTab} onJumpToSection={handleJumpToSection} />
          )}

          {/* 8B. ÉTICA IA */}
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

          {/* 8C. CINE Y DOCUMENTALES IA */}
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

          {/* 9. RECURSOS PRÁCTICOS (7 Sub-pestañas) */}
          {activeSection === 'recursos' && (() => {
            const RESOURCE_BANNERS: Record<
              ResourceSubSection,
              { image: string; title: string; subtitle: string; kicker: string }
            > = {
              recetas: {
                image: VISUAL_LIBRARY_PATHS.adFloating,
                title: 'Recetas Maestras y Fórmulas Visuales',
                subtitle: 'Combinaciones probadas de cámara, óptica, luz y dirección de arte listas para cargar en el Constructor.',
                kicker: 'RECURSOS PRÁCTICOS · 12 RECETAS MAESTRAS',
              },
              diccionario: {
                image: VISUAL_LIBRARY_PATHS.colorKodakPortra,
                title: 'Diccionario Visual de Comandos y Paletas',
                subtitle: 'Vocabulario técnico de fotografía, cine, texturas y color listo para sumar con un clic a tus prompts.',
                kicker: 'RECURSOS PRÁCTICOS · DICCIONARIO TÉCNICO',
              },
              plantillas: {
                image: VISUAL_LIBRARY_PATHS.storySheet,
                title: 'Plantillas Maestras Rellenables',
                subtitle: 'Estructuras modulares para 6 disciplinas creativas diseñadas para talleres y producción rápida.',
                kicker: 'RECURSOS PRÁCTICOS · 6 DISCIPLINAS',
              },
              tutoriales: {
                image: VISUAL_LIBRARY_PATHS.camCinemaRig,
                title: 'Tutoriales Paso a Paso en Video',
                subtitle: '12 guías prácticas para dominar herramientas generativas de imagen, video, audio y dirección de arte.',
                kicker: 'RECURSOS PRÁCTICOS · 12 GUÍAS IA',
              },
              ejercicios: {
                image: VISUAL_LIBRARY_PATHS.lightComparison,
                title: 'Ejercicios Prácticos y Antes / Después',
                subtitle: 'Compara prompts genéricos frente a direcciones visuales precisas y entrena tu mirada en taller.',
                kicker: 'RECURSOS PRÁCTICOS · ENTRENAMIENTO',
              },
              errores: {
                image: VISUAL_LIBRARY_PATHS.focalComparison,
                title: 'Clínica de Errores y Negative Prompts',
                subtitle: 'Diagnostica fallos frecuentes de composición, anatomía o iluminación y construye negativos precisos.',
                kicker: 'RECURSOS PRÁCTICOS · DIAGNÓSTICO VISUAL',
              },
              guias: {
                image: VISUAL_LIBRARY_PATHS.compLeadingLines,
                title: 'Guías, Aspect Ratios y Paletas HEX',
                subtitle: 'Referencias rápidas de proporciones cinematográficas, formatos editoriales y checklists de producción.',
                kicker: 'RECURSOS PRÁCTICOS · CHULETAS DE TALLER',
              },
            };
            const currentResBanner = RESOURCE_BANNERS[activeResourceSub] || RESOURCE_BANNERS.recetas;
            return (
            <div>
              <SectionPhotoBanner
                image={currentResBanner.image}
                imageAlt={currentResBanner.title}
                accentTint="obsidian"
                compact
                kicker={currentResBanner.kicker}
                topRight={
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#F4F2ED] backdrop-blur-xs">
                    Archivo & Recursos (7)
                  </span>
                }
                title={currentResBanner.title}
                subtitle={currentResBanner.subtitle}
              />

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
                        className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-2 whitespace-nowrap ${
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
                <ResourceTutorialsView onSendToBuilder={handlePatchBuilderFromResources} />
              )}
              {activeResourceSub === 'ejercicios' && (
                <ResourceExercisesView onSendToBuilder={handlePatchBuilderFromResources} />
              )}
              {activeResourceSub === 'errores' && (
                <ResourceTroubleshootingView onSendToBuilder={handlePatchBuilderFromResources} />
              )}
              {activeResourceSub === 'guias' && (
                <ResourceGuidesView onSendToBuilder={handlePatchBuilderFromResources} />
              )}
            </div>
            );
          })()}
        </Suspense>
        </SectionTransition>
      </main>

      {/* Footer with Full Section Navigation */}
      <Footer onNavigateSection={navigateToSection} />

      {/* Lazy-Loaded Global Modals */}
      {isGlobalSearchOpen && (
        <Suspense fallback={null}>
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
            onOpenExperiences={() => navigateToSection('experiencias')}
            onOpenTutorials={() => navigateToSection('recursos', 'tutoriales')}
            onSendStarterPromptToBuilder={(prompt, styleTitle) => {
              setBuilderState((prev) => ({
                ...prev,
                mode: 'photo',
                subject: prompt,
                visualStyle: styleTitle,
              }));
              navigateToSection('builder');
            }}
          />
        </Suspense>
      )}

      {selectedCommandForModal && (
        <Suspense fallback={null}>
          <CommandDetailModal
            command={selectedCommandForModal}
            onClose={() => setSelectedCommandForModal(null)}
            onAddToBuilder={handleAddCommandToBuilder}
          />
        </Suspense>
      )}

      {isExporterOpen && (
        <Suspense fallback={null}>
          <WorkshopExporterModal
            isOpen={isExporterOpen}
            onClose={() => setIsExporterOpen(false)}
            builderState={builderState}
            generatedPrompt={currentPromptText}
          />
        </Suspense>
      )}

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
    </MotionConfig>
  );
}
