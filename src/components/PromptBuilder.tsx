import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Camera,
  Video,
  Wand2,
  FileDown,
  Loader2,
  Star,
  AlertTriangle,
  Download,
  Sliders,
  ExternalLink,
  Layout,
  Package,
  Palette,
  Building2,
  Monitor,
  Box,
  Shuffle,
  ChevronRight,
  ChevronLeft,
  Layers,
  ListChecks,
  Plus,
  X,
  BookOpen,
} from 'lucide-react';
import { RECIPES } from '../data/promptData';
import {
  appendPromptVersionToProject,
  readUnifiedProjects,
  saveJournalEntry,
  saveUnifiedProject,
} from '../services/workspaceStore';
import {
  BUILDER_ANGLES,
  BUILDER_APERTURES,
  BUILDER_ASPECT_RATIOS,
  BUILDER_ATMOSPHERES,
  BUILDER_CAMERAS_PHOTO,
  BUILDER_CAMERAS_VIDEO,
  BUILDER_CATEGORIES,
  BUILDER_COMPOSITIONS,
  BUILDER_LENSES,
  BUILDER_LIGHTINGS,
  BUILDER_MOTIONS,
  BUILDER_NEGATIVES,
  BUILDER_PALETTES,
  BUILDER_QUALITIES,
  BUILDER_SHOT_SIZES,
  BUILDER_TEMPERATURES,
  BUILDER_TEXTURES,
  BuilderCategoryId,
  BuilderPlatformTarget,
} from '../data/promptBuilderConfig';
import { VISUAL_LIBRARY_PATHS } from '../data/visualLibraryRegistry';
import { STUDIO_MEDIA_ASSETS } from '../data/creativeStudiosData';
import { SectionPhotoBanner } from './SectionPhotoBanner';

function getBuilderBannerVisual(categoryId: BuilderCategoryId): {
  image: string;
  alt: string;
  position?: 'center' | 'top' | 'bottom';
} {
  switch (categoryId) {
    case 'photo':
      return {
        image: VISUAL_LIBRARY_PATHS.photoAnalogDocumentary,
        alt: 'Constructor de Prompts — Fotografía y Retrato Editorial',
        position: 'top',
      };
    case 'video':
      return {
        image: VISUAL_LIBRARY_PATHS.videoStudio,
        alt: 'Constructor de Prompts — Video y Cinematografía IA',
        position: 'center',
      };
    case 'graphic':
      return {
        image: VISUAL_LIBRARY_PATHS.colorDuotone,
        alt: 'Constructor de Prompts — Diseño Gráfico y Dirección Editorial',
        position: 'center',
      };
    case 'branding':
      return {
        image: VISUAL_LIBRARY_PATHS.adLuxury,
        alt: 'Constructor de Prompts — Branding, Empaque y Producto',
        position: 'center',
      };
    case 'illustration':
      return {
        image: VISUAL_LIBRARY_PATHS.artBotanical,
        alt: 'Constructor de Prompts — Ilustración Artística y Científica',
        position: 'center',
      };
    case 'architecture':
      return {
        image: VISUAL_LIBRARY_PATHS.photoArchitecture,
        alt: 'Constructor de Prompts — Arquitectura, Interiorismo y Espacio',
        position: 'center',
      };
    case 'web-ui':
      return {
        image: STUDIO_MEDIA_ASSETS.webDesignShowcase,
        alt: 'Constructor de Prompts — Diseño Web e Interfaces UI/UX',
        position: 'center',
      };
    case 'experimental':
      return {
        image: VISUAL_LIBRARY_PATHS.animGenerativeParticles,
        alt: 'Constructor de Prompts — Arte Experimental, 3D y Generativo',
        position: 'center',
      };
    default:
      return {
        image: VISUAL_LIBRARY_PATHS.photoAnalogDocumentary,
        alt: 'Constructor Maestro de Prompts',
        position: 'center',
      };
  }
}

export interface PromptBuilderState {
  mode: 'photo' | 'video';
  category?: BuilderCategoryId;
  subject: string;
  action?: string;
  setting?: string;
  composition?: string;
  genre: string;
  camera: string;
  lens: string;
  aperture: string;
  shotSize?: string;
  cameraAngle?: string;
  lighting: string;
  colorPalette: string;
  temperature?: string;
  atmosphere?: string;
  visualStyle: string;
  motion: string;
  fps: string;
  duration?: string;
  aspectRatio: string;
  texture: string;
  quality?: string;
  negativeAvoid: string[];
  // Extended multi-discipline variables (optional for 100% backward compatibility)
  medium?: string;
  typography?: string;
  layoutGrid?: string;
  materials?: string;
  architectureStyle?: string;
  characterDetails?: string;
  soundDesign?: string;
  uiFramework?: string;
  customNotes?: string;
}

export interface SavedFavoritePrompt {
  id: string;
  title: string;
  projectName?: string;
  createdAt?: string;
  mode: 'photo' | 'video';
  category?: BuilderCategoryId;
  promptText: string;
  state: PromptBuilderState;
}

interface PromptBuilderProps {
  builderState: PromptBuilderState;
  setBuilderState: React.Dispatch<React.SetStateAction<PromptBuilderState>>;
  onOpenExporter: () => void;
}

type BuilderStepId = 1 | 2 | 3 | 4;

const CATEGORY_ICONS: Record<BuilderCategoryId, React.ReactNode> = {
  photo: <Camera className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  graphic: <Layout className="w-4 h-4" />,
  branding: <Package className="w-4 h-4" />,
  illustration: <Palette className="w-4 h-4" />,
  architecture: <Building2 className="w-4 h-4" />,
  'web-ui': <Monitor className="w-4 h-4" />,
  experimental: <Box className="w-4 h-4" />,
};

const PLATFORM_TARGETS: { id: BuilderPlatformTarget; label: string }[] = [
  { id: 'universal', label: 'Universal' },
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'gemini', label: 'Google AI / Gemini' },
  { id: 'chatgpt', label: 'ChatGPT / Ideogram' },
  { id: 'runway', label: 'Runway / Veo' },
  { id: 'json', label: 'JSON' },
];

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  builderState,
  setBuilderState,
  onOpenExporter,
}) => {
  const [copied, setCopied] = useState(false);
  const [outputMode, setOutputMode] = useState<'breve' | 'avanzado' | 'cinematografico'>('avanzado');
  const [platformTarget, setPlatformTarget] = useState<BuilderPlatformTarget>('universal');
  const [viewMode, setViewMode] = useState<'stepped' | 'all'>('stepped');
  const [activeStep, setActiveStep] = useState<BuilderStepId>(1);
  const [customNegativeInput, setCustomNegativeInput] = useState('');

  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichError, setEnrichError] = useState<string | null>(null);
  const [geminiSuggestion, setGeminiSuggestion] = useState<{
    enrichedDescription: string;
    visualCues: string[];
    lightingAdvice: string;
  } | null>(null);

  const [savedPrompts, setSavedPrompts] = useState<SavedFavoritePrompt[]>(() => {
    try {
      const raw = localStorage.getItem('nc_fav_prompts_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [projects, setProjects] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('nc_prompt_projects_v1');
      return raw ? JSON.parse(raw) : ['Proyecto General', 'Taller Núcleo Colectivo', 'Serie Retratos'];
    } catch {
      return ['Proyecto General', 'Taller Núcleo Colectivo', 'Serie Retratos'];
    }
  });
  const [activeProject, setActiveProject] = useState<string>('Proyecto General');
  const [newProjectInput, setNewProjectInput] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // Derive active category gracefully from state
  const activeCategoryId: BuilderCategoryId =
    builderState.category || (builderState.mode === 'video' ? 'video' : 'photo');

  const activeCategory = useMemo(
    () =>
      BUILDER_CATEGORIES.find((c) => c.id === activeCategoryId) ||
      BUILDER_CATEGORIES[0],
    [activeCategoryId]
  );

  useEffect(() => {
    try {
      localStorage.setItem('nc_fav_prompts_v1', JSON.stringify(savedPrompts));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nc-favorites-updated'));
      }
    } catch {
      // ignore storage quota errors
    }
  }, [savedPrompts]);

  useEffect(() => {
    try {
      localStorage.setItem('nc_prompt_projects_v1', JSON.stringify(projects));
    } catch {
      // ignore storage quota errors
    }
  }, [projects]);

  const handleSelectCategory = (catId: BuilderCategoryId) => {
    const cat = BUILDER_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;

    setBuilderState((prev) => ({
      ...prev,
      category: cat.id,
      mode: cat.baseMode,
      genre: cat.defaultGenre,
      visualStyle: cat.defaultVisualStyle,
      aspectRatio: cat.defaultAspectRatio,
      [cat.extraField1.key]: prev[cat.extraField1.key] || cat.extraField1.options[0],
    }));

    if (cat.id === 'video' && platformTarget === 'midjourney') {
      setPlatformTarget('runway');
    } else if (cat.id !== 'video' && platformTarget === 'runway') {
      setPlatformTarget('universal');
    }
  };

  const handleApplyCategorySample = () => {
    const s = activeCategory.quickSample;
    setBuilderState((prev) => ({
      ...prev,
      category: activeCategory.id,
      mode: activeCategory.baseMode,
      subject: s.subject,
      action: s.action,
      setting: s.setting,
      lighting: s.lighting,
      colorPalette: s.colorPalette,
      aspectRatio: s.aspectRatio,
      genre: activeCategory.defaultGenre,
      visualStyle: activeCategory.defaultVisualStyle,
      [activeCategory.extraField1.key]: activeCategory.extraField1.options[0],
    }));
    setEnrichError(null);
  };

  const handleRandomCreativeMix = () => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const cat = activeCategory;
    const pal = pick(BUILDER_PALETTES);
    const lens = pick(BUILDER_LENSES);
    const light = pick(BUILDER_LIGHTINGS);
    const comp = pick(BUILDER_COMPOSITIONS);
    const style = pick(cat.styles);
    const extra1 = pick(cat.extraField1.options);

    setBuilderState((prev) => ({
      ...prev,
      subject: prev.subject || cat.quickSample.subject,
      action: prev.action || cat.quickSample.action,
      setting: prev.setting || cat.quickSample.setting,
      composition: comp,
      lens: lens.val,
      lighting: light.val,
      colorPalette: pal.val,
      visualStyle: style,
      [cat.extraField1.key]: extra1,
    }));
  };

  // Detect incompatible parameter combinations
  const incompatibilities = useMemo(() => {
    const warnings: { msg: string; fixLabel: string; applyFix: () => void }[] = [];
    const isMacroLens =
      builderState.lens.toLowerCase().includes('macro') ||
      builderState.lens.includes('100mm');
    const isUltraWideShot =
      builderState.shotSize?.includes('Gran Plano General') ||
      builderState.shotSize?.includes('Plano General');
    if (isMacroLens && isUltraWideShot && activeCategory.id === 'photo') {
      warnings.push({
        msg: 'Lente Macro 100mm no suele encajar con Gran Plano General.',
        fixLabel: 'Cambiar a 24mm',
        applyFix: () =>
          setBuilderState((p) => ({ ...p, lens: '24mm wide-angle tilt-shift lens' })),
      });
    }

    const isDeepFStop =
      builderState.aperture.includes('f/11') || builderState.aperture.includes('f/8');
    const isShallowLook =
      builderState.genre.includes('portrait') ||
      builderState.shotSize?.includes('Primerísimo');
    if (isDeepFStop && isShallowLook && activeCategory.id === 'photo') {
      warnings.push({
        msg: 'Apertura cerrada (f/8–f/11) reduce el bokeh suave en retratos cerrados.',
        fixLabel: 'Abrir a f/1.8',
        applyFix: () =>
          setBuilderState((p) => ({ ...p, aperture: 'f/1.8 creamy bokeh' })),
      });
    }

    if (
      builderState.lighting.toLowerCase().includes('butterfly') &&
      builderState.visualStyle.toLowerCase().includes('noir')
    ) {
      warnings.push({
        msg: 'Luz Butterfly (luminosa) contradice la estética Neo Noir.',
        fixLabel: 'Cambiar a Split 90°',
        applyFix: () =>
          setBuilderState((p) => ({
            ...p,
            lighting: '90-degree Split lighting, half illuminated half deep shadow',
          })),
      });
    }

    return warnings;
  }, [activeCategory.id, builderState, setBuilderState]);

  // Live Prompt Readiness / Quality Score (0–100)
  const promptScore = useMemo(() => {
    let score = 20; // base structure
    if (builderState.subject.trim().length > 12) score += 25;
    else if (builderState.subject.trim().length > 0) score += 12;
    if (builderState.action?.trim()) score += 10;
    if (builderState.setting?.trim()) score += 10;
    if (builderState[activeCategory.extraField1.key]) score += 10;
    if (builderState[activeCategory.extraField2.key]) score += 10;
    if (builderState.lighting) score += 5;
    if (builderState.negativeAvoid.length >= 2) score += 10;
    return Math.min(100, score);
  }, [activeCategory, builderState]);

  const extra1Value =
    (builderState[activeCategory.extraField1.key] as string | undefined) ||
    activeCategory.extraField1.options[0];
  const extra2Value =
    (builderState[activeCategory.extraField2.key] as string | undefined) || '';

  const generatePrompt = (): string => {
    const isVid = activeCategory.baseMode === 'video';
    const baseSubject =
      builderState.subject.trim() || activeCategory.quickSample.subject;
    const actionStr = builderState.action?.trim() ? `, ${builderState.action.trim()}` : '';
    const settingStr = builderState.setting?.trim() ? `, en ${builderState.setting.trim()}` : '';
    const compStr = builderState.composition || BUILDER_COMPOSITIONS[0];
    const shotStr = builderState.shotSize || 'Plano Medio (MS)';
    const angleStr = builderState.cameraAngle || 'Normal (Eye Level)';
    const tempStr = builderState.temperature || BUILDER_TEMPERATURES[0];
    const atmosStr = builderState.atmosphere || BUILDER_ATMOSPHERES[0];
    const qualityStr = builderState.quality || BUILDER_QUALITIES[0];
    const negClean =
      builderState.negativeAvoid.length > 0
        ? builderState.negativeAvoid.join(', ')
        : 'plastic skin, gibberish text, watermarks, low contrast';

    // Target: JSON structured output
    if (platformTarget === 'json') {
      return JSON.stringify(
        {
          category: activeCategory.label,
          mode: activeCategory.baseMode,
          subject: baseSubject,
          action: builderState.action || undefined,
          setting: builderState.setting || undefined,
          discipline_specific: {
            [activeCategory.extraField1.label]: extra1Value,
            ...(extra2Value ? { [activeCategory.extraField2.label]: extra2Value } : {}),
          },
          composition: {
            rule: compStr,
            shot: shotStr,
            angle: angleStr,
          },
          technical: isVid
            ? {
                camera: builderState.camera,
                lens: builderState.lens,
                motion: builderState.motion,
                fps: builderState.fps,
                duration: builderState.duration || '6–8 segundos',
              }
            : {
                camera_reference: builderState.camera,
                lens: builderState.lens,
                aperture: builderState.aperture,
              },
          lighting: builderState.lighting,
          color_palette: builderState.colorPalette,
          temperature: tempStr,
          style: builderState.visualStyle,
          texture: builderState.texture,
          aspect_ratio: builderState.aspectRatio,
          avoid: builderState.negativeAvoid,
        },
        null,
        2
      );
    }

    // Target: Midjourney v6/v7 dense syntax + flags
    if (platformTarget === 'midjourney') {
      const mjRatio = builderState.aspectRatio === '2.39:1' ? '21:9' : builderState.aspectRatio;
      const parts = [
        `${baseSubject}${actionStr}${settingStr}`,
        `${activeCategory.label} — ${builderState.visualStyle}`,
        extra1Value,
        extra2Value,
        `${compStr}, ${shotStr}, ${angleStr}`,
        `${builderState.camera}, ${builderState.lens}, ${builderState.aperture}`,
        builderState.lighting,
        builderState.colorPalette,
        `${builderState.texture}, ${qualityStr}`,
      ].filter(Boolean);
      const shortNeg = builderState.negativeAvoid
        .map((n) => n.replace(/\s*\(\/[^)]+\)/g, '').replace(/^Evitar\s+/i, '').replace(/^Sin\s+/i, ''))
        .join(', ');
      return `${parts.join(', ')} --ar ${mjRatio} --style raw${shortNeg ? ` --no ${shortNeg}` : ''}`;
    }

    // Target: Runway / Veo motion-first cinema syntax
    if (platformTarget === 'runway') {
      return [
        `CAMERA MOTION: ${builderState.motion} (${builderState.fps}, ${builderState.duration || '6–8s'}).`,
        `SCENE & SUBJECT: ${baseSubject}${actionStr}${settingStr}.`,
        `OPTICS & FRAMING: ${shotStr}, ${angleStr}, ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.`,
        `LIGHT & COLOR: ${builderState.lighting}. ${builderState.colorPalette}, ${tempStr}, ${atmosStr}.`,
        `SOUND & CONTINUITY: ${extra1Value}. ${extra2Value || 'Maintain consistent subject geometry, physical inertia and stable lighting from start to end.'}`,
        `ASPECT RATIO: ${builderState.aspectRatio}. AVOID: ${negClean}.`,
      ].join('\n');
    }

    // Target: ChatGPT / Ideogram natural art-direction prose
    if (platformTarget === 'chatgpt') {
      return [
        `Crea una pieza de ${activeCategory.label.toLowerCase()} (${builderState.visualStyle}): ${baseSubject}${actionStr}${settingStr}.`,
        `Dirección específica: ${extra1Value}${extra2Value ? `. ${extra2Value}` : ''}.`,
        `Composición y técnica: ${compStr}, ${shotStr}, ángulo ${angleStr}, referencia óptica ${builderState.lens} (${builderState.aperture}).`,
        `Luz y color: ${builderState.lighting}; paleta ${builderState.colorPalette} (${tempStr}); atmósfera ${atmosStr}; textura ${builderState.texture}.`,
        `Formato final: relación de aspecto ${builderState.aspectRatio}. Evitar estrictamente: ${negClean}.`,
      ].join('\n\n');
    }

    // Target: Google AI Studio / Gemini structured brief
    if (platformTarget === 'gemini') {
      return [
        `# BRIEF CREATIVO · ${activeCategory.label.toUpperCase()}`,
        `- Sujeto principal: ${baseSubject}${actionStr}`,
        `- Entorno y contexto: ${builderState.setting || activeCategory.quickSample.setting}`,
        `- ${activeCategory.extraField1.label}: ${extra1Value}`,
        ...(extra2Value ? [`- ${activeCategory.extraField2.label}: ${extra2Value}`] : []),
        `- Composición: ${compStr} · ${shotStr} · ${angleStr}`,
        `- Referencia técnica: ${builderState.camera} · ${builderState.lens} · ${builderState.aperture}${isVid ? ` · Movimiento: ${builderState.motion} (${builderState.fps})` : ''}`,
        `- Iluminación y atmósfera: ${builderState.lighting} · ${atmosStr}`,
        `- Color y textura: ${builderState.colorPalette} · ${tempStr} · ${builderState.texture}`,
        `- Formato: ${builderState.aspectRatio}`,
        `- Restricciones negativas: ${negClean}`,
      ].join('\n');
    }

    // Target: Universal (Breve / Avanzado / Cinematográfico)
    if (outputMode === 'breve') {
      return [
        `${baseSubject}${actionStr}${settingStr}.`,
        `${activeCategory.label}, ${builderState.visualStyle}, ${extra1Value}${extra2Value ? `, ${extra2Value}` : ''}.`,
        `${compStr}, ${shotStr}, ${angleStr}, ${builderState.lens}, ${builderState.lighting}, ${builderState.colorPalette}${isVid ? `, ${builderState.motion}, ${builderState.fps}` : ''}, aspect ratio ${builderState.aspectRatio}.`,
        `Avoid: ${negClean}.`,
      ].join(' ');
    }

    if (outputMode === 'cinematografico') {
      return [
        `HOJA DE DIRECCIÓN DE ARTE — ${activeCategory.label.toUpperCase()}`,
        `[01] SUJETO Y ACCIÓN: ${baseSubject}${actionStr}.`,
        `[02] ESCENARIO Y CONTEXTO: ${builderState.setting || activeCategory.quickSample.setting}.`,
        `[03] VARIABLE DE DISCIPLINA: ${activeCategory.extraField1.label} → ${extra1Value}.`,
        ...(extra2Value
          ? [`[04] DETALLE / TIPOGRAFÍA / NOTA: ${extra2Value}.`]
          : []),
        `[05] COMPOSICIÓN Y PLANO: ${compStr} · ${shotStr} · ${angleStr}.`,
        `[06] ÓPTICA Y SOPORTE: ${builderState.camera} · ${builderState.lens} · ${builderState.aperture}.`,
        ...(isVid
          ? [`[07] MOVIMIENTO Y CADENCIA: ${builderState.motion} · ${builderState.fps} · ${builderState.duration || '6–8 segundos'}.`]
          : []),
        `[08] ILUMINACIÓN Y ATMÓSFERA: ${builderState.lighting} · ${atmosStr}.`,
        `[09] COLOR Y ESTILO: ${builderState.colorPalette} · ${tempStr} · ${builderState.visualStyle}.`,
        `[10] TEXTURA Y FORMATO: ${builderState.texture}, ${qualityStr} · Aspect ratio ${builderState.aspectRatio}.`,
        `[11] CONTROL NEGATIVO: Avoid: ${negClean}.`,
      ].join('\n');
    }

    // Default Universal Avanzado
    return [
      `MASTER PROMPT — ${activeCategory.label.toUpperCase()}`,
      `01. SUJETO: ${baseSubject}.`,
      `02. ACCIÓN: ${builderState.action || activeCategory.quickSample.action}.`,
      `03. ESCENARIO: ${builderState.setting || activeCategory.quickSample.setting}.`,
      `04. ${activeCategory.extraField1.label.toUpperCase()}: ${extra1Value}.`,
      ...(extra2Value
        ? [`05. ${activeCategory.extraField2.label.toUpperCase()}: ${extra2Value}.`]
        : []),
      `06. COMPOSICIÓN Y ENCUADRE: ${compStr}, ${shotStr}, ${angleStr}.`,
      `07. CÁMARA Y ÓPTICA: ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.`,
      `08. ILUMINACIÓN: ${builderState.lighting}.`,
      `09. COLOR Y TEMPERATURA: ${builderState.colorPalette}, ${tempStr}.`,
      `10. ESTILO Y TEXTURA: ${builderState.genre}, ${builderState.visualStyle}, ${builderState.texture}.`,
      `11. ATMÓSFERA Y FORMATO: ${atmosStr} · Aspect ratio ${builderState.aspectRatio}.`,
      isVid
        ? `12. MOVIMIENTO Y NEGATIVAS: ${builderState.motion} (${builderState.fps}, ${builderState.duration || '6–8s'}). Avoid: ${negClean}.`
        : `12. CONTROL NEGATIVO: Avoid: ${negClean}.`,
    ].join('\n');
  };

  const currentPrompt = generatePrompt();

  const handleSaveFavoritePrompt = () => {
    const title = builderState.subject.trim()
      ? builderState.subject.trim().slice(0, 44)
      : `${activeCategory.shortLabel} · ${builderState.visualStyle}`;
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const snapshot: PromptBuilderState = { ...builderState, category: activeCategory.id };
    setSavedPrompts((prev) => [
      {
        id: `fp-${Date.now()}`,
        title,
        projectName: activeProject,
        createdAt: nowLabel,
        mode: activeCategory.baseMode,
        category: activeCategory.id,
        promptText: currentPrompt,
        state: snapshot,
      },
      ...prev.slice(0, 23),
    ]);

    // Non-destructive sync into UnifiedCreativeProject (versioned by activeProject)
    const existingUnified = readUnifiedProjects().find(
      (p) => p.title.toLowerCase() === activeProject.toLowerCase()
    );
    if (existingUnified) {
      appendPromptVersionToProject(existingUnified.id, {
        promptEs: currentPrompt,
        source: 'builder',
        builderSnapshot: snapshot,
      });
    } else {
      const nowIso = new Date().toISOString();
      saveUnifiedProject({
        id: `proj-builder-${Date.now()}`,
        title: activeProject,
        discipline: activeCategory.label,
        category: activeCategory.id,
        sourceModules: ['builder'],
        initialData: {
          concept: builderState.subject.trim() || title,
          objective: `Prompt modular (${platformTarget} · ${outputMode})`,
          format: builderState.aspectRatio,
          notes: builderState.customNotes || undefined,
        },
        prompts: [
          {
            id: `pv-${Date.now()}`,
            versionLabel: 'v1',
            promptEs: currentPrompt,
            source: 'builder',
            createdAt: nowIso,
            builderSnapshot: snapshot,
          },
        ],
        references: [],
        results: '',
        tools: ['Constructor Modular', platformTarget],
        observations: builderState.customNotes || '',
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    }
  };

  const handleSaveToJournal = () => {
    const title =
      builderState.subject.trim().slice(0, 60) ||
      `${activeCategory.label} · ${activeProject}`;
    const disciplineMap: Record<BuilderCategoryId, string> = {
      photo: 'Fotografía & Retrato',
      video: 'Cine & Video',
      graphic: 'Diseño Gráfico & Cartel',
      branding: 'Publicidad & Producto',
      illustration: 'Ilustración & Concept Art',
      architecture: 'Arquitectura & Espacios',
      'web-ui': 'Diseño Web & UI',
      experimental: 'Arte Digital & Experimental',
    };
    const nowIso = new Date().toISOString();
    saveJournalEntry({
      id: `journal-builder-${Date.now()}`,
      projectName: `${activeProject} · ${title}`,
      objective:
        (builderState.setting || '').trim() ||
        `Prompt modular (${platformTarget} · ${outputMode} · AR ${builderState.aspectRatio})`,
      discipline: disciplineMap[activeCategory.id] || 'Fotografía & Retrato',
      originalPrompt: currentPrompt,
      variations: [],
      results: '',
      tools: ['Constructor Modular', platformTarget],
      date: nowIso.slice(0, 10),
      observations: [
        builderState.camera ? `Cámara: ${builderState.camera}` : '',
        builderState.lens ? `Óptica: ${builderState.lens}` : '',
        builderState.lighting ? `Luz: ${builderState.lighting}` : '',
        builderState.customNotes || '',
      ]
        .filter(Boolean)
        .join(' · '),
      learnings: '',
      updatedAt: nowIso,
    });
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2400);
  };

  const handleAddProject = () => {
    const clean = newProjectInput.trim();
    if (!clean || projects.includes(clean)) return;
    setProjects((prev) => [...prev, clean]);
    setActiveProject(clean);
    setNewProjectInput('');
  };

  const handleExportTxt = () => {
    const blob = new Blob([currentPrompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nucleo_prompt_${activeCategory.id}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const payload = {
      generator: 'Núcleo Colectivo · Visual Prompt Lab',
      category: activeCategory.label,
      platformTarget,
      outputMode,
      parameters: builderState,
      prompt: currentPrompt,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nucleo_prompt_${activeCategory.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnrichWithGemini = () => {
    if (!builderState.subject.trim()) {
      setEnrichError(
        `Escribe primero una idea básica (ej: "${activeCategory.quickSample.subject.slice(0, 52)}...").`
      );
      return;
    }

    setEnrichError(null);
    setIsEnriching(true);

    const rawSubject = builderState.subject.trim();
    const cat = activeCategory;

    const enrichedByCat: Record<BuilderCategoryId, string> = {
      photo: `${rawSubject}, capturado con expresión auténtica, texturas físicas reales sin suavizado artificial y dirección editorial ${builderState.visualStyle}.`,
      video: `${rawSubject}, filmado en plano continuo con física creíble, ritmo pausado a 24fps e interacción natural entre movimiento, luz y atmósfera.`,
      graphic: `${rawSubject}, resuelto con jerarquía gráfica suiza, paleta acotada de tintas reales, textura de papel algodón y espacio negativo limpio para tipografía.`,
      branding: `${rawSubject}, fotografiado como pieza de diseño industrial con materiales táctiles honestos, reflejos limpios y sombra de contacto física sobre piedra mineral.`,
      illustration: `${rawSubject}, ilustrado con trazo autoral consistente, paleta cromática curada, texturas visibles de papel y claridad narrativa en primer y segundo plano.`,
      architecture: `${rawSubject}, fotografiado con verticales estrictamente paralelas (tilt-shift), materiales constructivos reales, luz solar oblicua y escala humana discreta.`,
      'web-ui': `${rawSubject}, presentado como interfaz contemporánea limpia con tipografía jerárquica de alto contraste WCAG AA, grilla modular y aire visual generoso.`,
      experimental: `${rawSubject}, documentado como obra real en espacio expositivo de bienal con interacción física de luz, reflejos reales y público en silueta dando escala.`,
    };

    const cuesByCat: Record<BuilderCategoryId, string[]> = {
      photo: ['textura real de piel y tejidos', 'reflejo natural en ojos', 'grano fino 35mm'],
      video: ['continuidad temporal estable', 'movimiento de cámara constante', 'sonido diegético coherente'],
      graphic: ['registro real de tinta', 'retícula modular limpia', 'aire superior despejado'],
      branding: ['bajo relieve táctil', 'bordes nítidos f/8', 'cero texto inventado'],
      illustration: ['pincelada gouache visible', 'silueta reconocible', 'paleta acotada de 3 tonos'],
      architecture: ['verticales rectas', 'concreto y madera real', 'sombras geométricas de tarde'],
      'web-ui': ['alineación de píxeles limpia', 'contraste accesible', 'sin ruido decorativo'],
      experimental: ['haces volumétricos reales', 'escala humana real', 'fotografía documental de galería'],
    };

    setGeminiSuggestion({
      enrichedDescription: enrichedByCat[cat.id],
      visualCues: cuesByCat[cat.id],
      lightingAdvice: cat.quickSample.lighting,
    });
    setIsEnriching(false);
  };

  const applyGeminiSuggestion = () => {
    if (!geminiSuggestion) return;
    setBuilderState((prev) => ({
      ...prev,
      subject: geminiSuggestion.enrichedDescription,
      texture: geminiSuggestion.visualCues.join(', '),
      lighting: geminiSuggestion.lightingAdvice,
    }));
    setGeminiSuggestion(null);
  };

  const handleReset = () => {
    const cat = activeCategory;
    setBuilderState({
      mode: cat.baseMode,
      category: cat.id,
      subject: '',
      action: '',
      setting: '',
      composition: BUILDER_COMPOSITIONS[0],
      genre: cat.defaultGenre,
      camera:
        cat.baseMode === 'video'
          ? BUILDER_CAMERAS_VIDEO[0]
          : BUILDER_CAMERAS_PHOTO[0],
      lens: BUILDER_LENSES[4].val,
      aperture: cat.baseMode === 'video' ? 'T2.3 cinematic aperture' : 'f/1.8 creamy bokeh',
      shotSize: 'Plano Medio (MS)',
      cameraAngle: 'Normal (Eye Level)',
      lighting: BUILDER_LIGHTINGS[0].val,
      colorPalette: BUILDER_PALETTES[0].val,
      temperature: BUILDER_TEMPERATURES[0],
      atmosphere: BUILDER_ATMOSPHERES[0],
      visualStyle: cat.defaultVisualStyle,
      motion: BUILDER_MOTIONS[1].val,
      fps: '24 fps',
      duration: '6–8 segundos',
      aspectRatio: cat.defaultAspectRatio,
      texture: BUILDER_TEXTURES[0],
      quality: BUILDER_QUALITIES[0],
      negativeAvoid: [BUILDER_NEGATIVES[0], BUILDER_NEGATIVES[1]],
      medium: undefined,
      typography: '',
      layoutGrid: undefined,
      materials: undefined,
      architectureStyle: undefined,
      characterDetails: undefined,
      soundDesign: undefined,
      uiFramework: undefined,
      customNotes: '',
    });
    setGeminiSuggestion(null);
    setEnrichError(null);
  };

  const handleLoadRecipe = (recipeId: string) => {
    const r = RECIPES.find((item) => item.id === recipeId);
    if (!r) return;

    const mappedCategory: BuilderCategoryId =
      r.type === 'video'
        ? 'video'
        : r.type === 'ads'
        ? 'branding'
        : r.id.includes('poster')
        ? 'graphic'
        : r.id.includes('character')
        ? 'illustration'
        : r.id.includes('architectural')
        ? 'architecture'
        : r.type === 'experimental'
        ? 'experimental'
        : 'photo';

    const isVideoRecipe = mappedCategory === 'video';
    setBuilderState((prev) => ({
      ...prev,
      mode: isVideoRecipe ? 'video' : 'photo',
      category: mappedCategory,
      subject: r.description,
      action: '',
      setting: r.context,
      genre: r.commands[0] || (isVideoRecipe ? '/cinematicvideo' : '/editorial'),
      camera: r.specs.camera,
      lens: r.specs.lens,
      aperture: isVideoRecipe ? 'T2.3 cinematic aperture' : 'f/2.8 aperture',
      lighting: r.specs.lighting,
      colorPalette: r.specs.color,
      visualStyle: r.title,
      motion: r.specs.motion || BUILDER_MOTIONS[2].val,
      aspectRatio: r.specs.aspectRatio.includes('16:9')
        ? '16:9'
        : r.specs.aspectRatio.includes('4:5')
        ? '4:5'
        : r.specs.aspectRatio.includes('2:3')
        ? '2:3'
        : '3:2',
    }));
  };

  const toggleNegative = (option: string) => {
    setBuilderState((prev) => {
      const exists = prev.negativeAvoid.includes(option);
      return {
        ...prev,
        negativeAvoid: exists
          ? prev.negativeAvoid.filter((item) => item !== option)
          : [...prev.negativeAvoid, option],
      };
    });
  };

  const handleAddCustomNegative = () => {
    const clean = customNegativeInput.trim();
    if (!clean) return;
    if (!builderState.negativeAvoid.includes(clean)) {
      setBuilderState((prev) => ({
        ...prev,
        negativeAvoid: [...prev.negativeAvoid, clean],
      }));
    }
    setCustomNegativeInput('');
  };

  const showStep = (step: BuilderStepId) => viewMode === 'all' || activeStep === step;
  const builderBanner = useMemo(
    () => getBuilderBannerVisual(activeCategory.id),
    [activeCategory.id]
  );

  return (
    <section
      id="builder"
      className="pb-12 sm:pb-14 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] transition-colors"
    >
      {/* Full-bleed Photographic Hero Banner — Dynamically changes per creative category */}
      <SectionPhotoBanner
        image={builderBanner.image}
        imageAlt={builderBanner.alt}
        imagePosition={builderBanner.position}
        accentTint="obsidian"
        kicker={
          <>
            <span>ESTUDIO DE DIRECCIÓN DE PROMPTS</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-[#93B4FF]">8 CATEGORÍAS CREATIVAS</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-[#C4A5FF]">{activeCategory.label.toUpperCase()}</span>
          </>
        }
        topRight={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#F4F2ED] backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F8C300]" />
            <span>{activeCategory.shortLabel}</span>
          </span>
        }
        title="Constructor Maestro de Prompts"
        subtitle="Elige tu disciplina creativa, ajusta variables especializadas paso a paso y adapta la sintaxis final al ecosistema de IA que vas a usar."
        actions={
          <>
            <select
              onChange={(e) => {
                if (e.target.value) handleLoadRecipe(e.target.value);
              }}
              defaultValue=""
              aria-label="Cargar receta predefinida en el constructor"
              className="min-h-[40px] max-w-[230px] text-xs bg-[#101014]/75 backdrop-blur-xs border border-white/20 text-[#F4F2ED] px-3 py-2 rounded-lg focus:outline-none focus:border-[#F8C300] font-medium cursor-pointer"
            >
              <option value="" disabled>
                Cargar Receta ({RECIPES.length})...
              </option>
              {RECIPES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleRandomCreativeMix}
              className="min-h-[40px] px-3.5 py-2 text-xs font-bold text-white bg-[#326BFF] hover:bg-[#2358E6] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
              title="Combinar parámetros creativos aleatorios para esta categoría"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Combinar</span>
            </button>

            <button
              type="button"
              onClick={onOpenExporter}
              className="min-h-[40px] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#7545D6] hover:bg-[#6134BF] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
              title="Exportar ficha técnica para talleres en PDF o PNG"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Ficha Taller</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[40px] px-3 py-2 text-xs font-semibold text-[#E4E2DB] hover:text-white bg-[#101014]/70 hover:bg-[#101014] border border-white/20 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer backdrop-blur-xs"
              title="Restablecer variables del constructor"
              aria-label="Restablecer variables del constructor"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          </>
        }
        extraContent={
          builderState.customNotes &&
          /^(Galería|Moodboard|Simulador de Iluminación|Bitácora|Guardado)\s·/.test(
            builderState.customNotes
          ) ? (
            <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#326BFF]/25 border border-[#326BFF]/60 text-xs text-[#F4F2ED] backdrop-blur-xs">
              <span className="font-mono-code font-bold text-[#93B4FF]">
                Referencia conectada:
              </span>
              <span className="font-medium">{builderState.customNotes}</span>
              <span className="text-white/70 hidden sm:inline">
                — modifica sujeto, escenario, luz, óptica o formato abajo.
              </span>
              <button
                type="button"
                onClick={() => setBuilderState((prev) => ({ ...prev, customNotes: '' }))}
                className="ml-1 p-0.5 rounded hover:bg-white/15 text-white/80 cursor-pointer"
                aria-label="Ocultar aviso de referencia conectada"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-7 space-y-6">

        {/* 8 CREATIVE CATEGORIES SELECTOR — DISTINCT DISCIPLINE PALETTE */}
        <div className="bg-[#EAE6DC] dark:bg-[#16161E] border border-[#D4CFC2] dark:border-[#282834] rounded-2xl p-3.5 sm:p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="text-[11px] font-mono-code uppercase tracking-wider font-bold text-[#3A3A46] dark:text-[#C5C3BC]">
              1. ELIGE TU CATEGORÍA CREATIVA
            </span>
            <button
              type="button"
              onClick={handleApplyCategorySample}
              className="px-3 py-1.5 rounded-lg bg-[#326BFF] hover:bg-[#2358E6] text-white text-xs font-mono-code font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F8C300]" />
              <span>Rellenar ejemplo de {activeCategory.shortLabel}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {BUILDER_CATEGORIES.map((cat) => {
              const isSelected = cat.id === activeCategory.id;
              const disciplineStyles: Record<
                string,
                { active: string; activeIcon: string; idleIcon: string; idleIconBg: string; hoverBorder: string }
              > = {
                photo: {
                  active: 'bg-[#F8C300] text-[#101014] border-[#D4A600] shadow-sm',
                  activeIcon: 'text-[#101014]',
                  idleIcon: 'text-[#B47B00] dark:text-[#F8C300]',
                  idleIconBg: 'bg-[#F8C300]/18',
                  hoverBorder: 'hover:border-[#D4A600]',
                },
                video: {
                  active: 'bg-[#7545D6] text-white border-[#7545D6] shadow-sm',
                  activeIcon: 'text-[#F8C300]',
                  idleIcon: 'text-[#7545D6] dark:text-[#C4A5FF]',
                  idleIconBg: 'bg-[#7545D6]/14',
                  hoverBorder: 'hover:border-[#7545D6]',
                },
                graphic: {
                  active: 'bg-[#326BFF] text-white border-[#326BFF] shadow-sm',
                  activeIcon: 'text-white',
                  idleIcon: 'text-[#326BFF] dark:text-[#8FB0FF]',
                  idleIconBg: 'bg-[#326BFF]/14',
                  hoverBorder: 'hover:border-[#326BFF]',
                },
                branding: {
                  active: 'bg-[#059669] text-white border-[#059669] shadow-sm',
                  activeIcon: 'text-white',
                  idleIcon: 'text-[#059669] dark:text-[#34D399]',
                  idleIconBg: 'bg-[#059669]/14',
                  hoverBorder: 'hover:border-[#059669]',
                },
                illustration: {
                  active: 'bg-[#E11D48] text-white border-[#E11D48] shadow-sm',
                  activeIcon: 'text-white',
                  idleIcon: 'text-[#E11D48] dark:text-[#FB7185]',
                  idleIconBg: 'bg-[#E11D48]/14',
                  hoverBorder: 'hover:border-[#E11D48]',
                },
                architecture: {
                  active: 'bg-[#0D9488] text-white border-[#0D9488] shadow-sm',
                  activeIcon: 'text-white',
                  idleIcon: 'text-[#0D9488] dark:text-[#5EEAD4]',
                  idleIconBg: 'bg-[#0D9488]/14',
                  hoverBorder: 'hover:border-[#0D9488]',
                },
                'web-ui': {
                  active: 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm',
                  activeIcon: 'text-white',
                  idleIcon: 'text-[#4F46E5] dark:text-[#A5B4FC]',
                  idleIconBg: 'bg-[#4F46E5]/14',
                  hoverBorder: 'hover:border-[#4F46E5]',
                },
                experimental: {
                  active: 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm',
                  activeIcon: 'text-white',
                  idleIcon: 'text-[#EA580C] dark:text-[#FB923C]',
                  idleIconBg: 'bg-[#EA580C]/14',
                  hoverBorder: 'hover:border-[#EA580C]',
                },
              };
              const st = disciplineStyles[cat.id] || disciplineStyles.photo;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`min-h-[54px] px-2.5 py-2.5 rounded-xl border text-left transition-all flex flex-col items-start justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? `${st.active} font-bold`
                      : `bg-white dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#D8D3C8] dark:border-[#26262E] ${st.hoverBorder}`
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center rounded-md ${
                      isSelected ? st.activeIcon : `p-1 ${st.idleIconBg} ${st.idleIcon}`
                    }`}
                  >
                    {CATEGORY_ICONS[cat.id]}
                  </span>
                  <span className="text-[11px] leading-tight font-semibold whitespace-nowrap truncate w-full">
                    {cat.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="px-2 py-1.5 rounded-lg bg-white/75 dark:bg-[#101014]/70 border border-[#DBD6CA] dark:border-[#24242E] flex flex-wrap items-center justify-between gap-2 text-xs text-[#3C3C47] dark:text-[#C5C3BC]">
            <span>
              <strong className="text-[#101014] dark:text-[#F8C300]">
                {activeCategory.label}:
              </strong>{' '}
              {activeCategory.tagline}
            </span>
          </div>
        </div>

        {/* MAIN SPLIT WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* LEFT WORKSPACE (7 COLS): STEPPED OR ALL-AT-ONCE CONTROLS */}
          <div className="lg:col-span-7 bg-white dark:bg-[#16161C] border border-[#D4CFC2] dark:border-[#26262E] rounded-2xl overflow-hidden shadow-xs">
            {/* Step Tabs Bar + Density Switcher — Tinted Studio Header */}
            <div className="p-4 border-b border-[#D5CDE8] dark:border-[#2A263C] bg-[#ECE8F6] dark:bg-[#181625] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 1 as BuilderStepId, label: '01. Concepto', activeCls: 'bg-[#7545D6] text-white border-[#7545D6]' },
                    { id: 2 as BuilderStepId, label: '02. Técnica', activeCls: 'bg-[#326BFF] text-white border-[#326BFF]' },
                    { id: 3 as BuilderStepId, label: '03. Luz y Color', activeCls: 'bg-[#F8C300] text-[#101014] border-[#D4A600]' },
                    { id: 4 as BuilderStepId, label: '04. Formato', activeCls: 'bg-[#059669] text-white border-[#059669]' },
                  ]
                ).map((step) => {
                  const isCurrent = viewMode === 'stepped' && activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        setViewMode('stepped');
                        setActiveStep(step.id);
                      }}
                      className={`min-h-[38px] px-3 py-1.5 text-xs font-mono-code font-bold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        isCurrent
                          ? `${step.activeCls} shadow-xs`
                          : 'bg-white dark:bg-[#11101A] text-[#3A364A] dark:text-[#C4BED6] border-[#D4CAE8] dark:border-[#2D2842] hover:border-[#7545D6]'
                      }`}
                    >
                      {step.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewMode((prev) => (prev === 'stepped' ? 'all' : 'stepped'))
                }
                className={`min-h-[36px] px-3 py-1.5 text-[11px] font-mono-code font-bold rounded-lg border inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-[#101014] text-[#F8C300] border-[#101014]'
                    : 'bg-white dark:bg-[#11101A] text-[#5A2EB5] dark:text-[#C4A5FF] border-[#C9BCE8] dark:border-[#342E50] hover:bg-[#7545D6] hover:text-white'
                }`}
              >
                {viewMode === 'all' ? (
                  <>
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>Por Pasos</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    <span>Ver Todo</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-7">
              {/* ===================================================== */}
              {/* STEP 1: CONCEPTO + VARIABLES PROPIAS DE LA CATEGORÍA  */}
              {/* ===================================================== */}
              {showStep(1) && (
                <div className="space-y-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <label
                        htmlFor="pb-subject"
                        className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold"
                      >
                        Sujeto o Idea Principal · {activeCategory.shortLabel}
                      </label>
                      <button
                        type="button"
                        onClick={handleEnrichWithGemini}
                        disabled={isEnriching}
                        className="min-h-[34px] px-3 py-1 text-[11px] font-mono-code font-bold text-[#101014] bg-[#F8C300]/30 hover:bg-[#F8C300]/55 dark:text-[#F8C300] dark:bg-[#F8C300]/15 border border-[#F8C300]/70 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        {isEnriching ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Wand2 className="w-3.5 h-3.5" />
                        )}
                        <span>Enriquecer Escena</span>
                      </button>
                    </div>

                    <textarea
                      id="pb-subject"
                      rows={2}
                      value={builderState.subject}
                      onChange={(e) =>
                        setBuilderState((p) => ({ ...p, subject: e.target.value }))
                      }
                      placeholder={activeCategory.subjectPlaceholder}
                      className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-sm px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#326BFF] placeholder:text-[#787670] leading-relaxed"
                    />

                    {enrichError && (
                      <p className="text-xs text-[#B4523A] dark:text-[#FF8A75] mt-1.5 font-medium">
                        {enrichError}
                      </p>
                    )}

                    {geminiSuggestion && (
                      <div className="mt-3 p-4 bg-[#F4F2ED] dark:bg-[#101014] border border-[#F8C300] rounded-xl space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Propuesta Enriquecida</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setGeminiSuggestion(null)}
                              className="text-xs text-[#5B5B66] hover:text-[#101014] dark:hover:text-[#F4F2ED]"
                            >
                              Descartar
                            </button>
                            <button
                              type="button"
                              onClick={applyGeminiSuggestion}
                              className="min-h-[32px] px-3 py-1 text-xs font-bold text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] rounded-lg inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aplicar</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#101014] dark:text-[#E5E3DC] leading-relaxed">
                          {geminiSuggestion.enrichedDescription}
                        </p>
                        <div className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                          <strong>Claves:</strong> {geminiSuggestion.visualCues.join(' · ')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action & Setting */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="pb-action"
                        className="block text-[11px] font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold mb-1.5"
                      >
                        Acción, Gesto o Dinámica
                      </label>
                      <input
                        id="pb-action"
                        type="text"
                        value={builderState.action || ''}
                        onChange={(e) =>
                          setBuilderState((p) => ({ ...p, action: e.target.value }))
                        }
                        placeholder={activeCategory.actionPlaceholder}
                        className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-lg px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pb-setting"
                        className="block text-[11px] font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold mb-1.5"
                      >
                        Escenario, Contexto o Soporte
                      </label>
                      <input
                        id="pb-setting"
                        type="text"
                        value={builderState.setting || ''}
                        onChange={(e) =>
                          setBuilderState((p) => ({ ...p, setting: e.target.value }))
                        }
                        placeholder={activeCategory.settingPlaceholder}
                        className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-lg px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                      />
                    </div>
                  </div>

                  {/* Genre chips tailored to category */}
                  <div>
                    <span className="block text-[11px] font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold mb-2">
                      Subgénero / Enfoque de {activeCategory.shortLabel}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory.genres.map((item) => {
                        const active = builderState.genre === item.cmd;
                        return (
                          <button
                            key={item.cmd}
                            type="button"
                            onClick={() =>
                              setBuilderState((p) => ({ ...p, genre: item.cmd }))
                            }
                            className={`min-h-[36px] px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                              active
                                ? 'bg-[#101014] text-[#F8C300] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specialized Category Variables Panel */}
                  <div className="p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
                    <div className="text-[11px] font-mono-code uppercase tracking-wider font-bold text-[#326BFF] dark:text-[#F8C300]">
                      VARIABLES ESPECIALIZADAS · {activeCategory.label.toUpperCase()}
                    </div>

                    <div>
                      <label
                        htmlFor="pb-extra-1"
                        className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] mb-1.5"
                      >
                        {activeCategory.extraField1.label}
                      </label>
                      <select
                        id="pb-extra-1"
                        value={extra1Value}
                        onChange={(e) =>
                          setBuilderState((p) => ({
                            ...p,
                            [activeCategory.extraField1.key]: e.target.value,
                          }))
                        }
                        className="w-full min-h-[40px] bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#326BFF]"
                      >
                        {activeCategory.extraField1.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="pb-extra-2"
                        className="block text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] mb-1.5"
                      >
                        {activeCategory.extraField2.label}
                      </label>
                      <input
                        id="pb-extra-2"
                        type="text"
                        value={extra2Value}
                        onChange={(e) =>
                          setBuilderState((p) => ({
                            ...p,
                            [activeCategory.extraField2.key]: e.target.value,
                          }))
                        }
                        placeholder={activeCategory.extraField2.placeholder}
                        className="w-full min-h-[40px] bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#326BFF] mb-2"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {activeCategory.extraField2.suggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() =>
                              setBuilderState((p) => ({
                                ...p,
                                [activeCategory.extraField2.key]: sug,
                              }))
                            }
                            className="px-2.5 py-1 text-[11px] bg-white dark:bg-[#16161C] text-[#4A4A55] dark:text-[#A09E97] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] hover:text-[#101014] dark:hover:text-[#F4F2ED] rounded transition-colors text-left"
                          >
                            + {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* STEP 2: ENCUADRE, CÁMARA, ÓPTICA Y MOVIMIENTO         */}
              {/* ===================================================== */}
              {showStep(2) && (
                <div
                  className={`space-y-5 ${
                    viewMode === 'all' ? 'pt-6 border-t border-[#DEDAD0] dark:border-[#26262E]' : ''
                  }`}
                >
                  <div>
                    <div className="text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold mb-3">
                      Composición, Plano y Ángulo
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label
                          htmlFor="pb-comp"
                          className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                        >
                          Regla compositiva
                        </label>
                        <select
                          id="pb-comp"
                          value={builderState.composition || BUILDER_COMPOSITIONS[0]}
                          onChange={(e) =>
                            setBuilderState((p) => ({ ...p, composition: e.target.value }))
                          }
                          className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#326BFF]"
                        >
                          {builderState.composition &&
                            !BUILDER_COMPOSITIONS.includes(builderState.composition) && (
                              <option value={builderState.composition}>
                                {builderState.composition}
                              </option>
                            )}
                          {BUILDER_COMPOSITIONS.map((comp) => (
                            <option key={comp} value={comp}>
                              {comp}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="pb-shot"
                          className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                        >
                          Escala de plano
                        </label>
                        <select
                          id="pb-shot"
                          value={builderState.shotSize || 'Plano Medio (MS)'}
                          onChange={(e) =>
                            setBuilderState((p) => ({ ...p, shotSize: e.target.value }))
                          }
                          className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#326BFF]"
                        >
                          {BUILDER_SHOT_SIZES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="pb-angle"
                          className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                        >
                          Ángulo de cámara
                        </label>
                        <select
                          id="pb-angle"
                          value={builderState.cameraAngle || 'Normal (Eye Level)'}
                          onChange={(e) =>
                            setBuilderState((p) => ({ ...p, cameraAngle: e.target.value }))
                          }
                          className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#326BFF]"
                        >
                          {BUILDER_ANGLES.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Camera Reference Grid */}
                  <div>
                    <span className="block text-[11px] font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold mb-2">
                      Cámara / Referencia Óptica
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(activeCategory.baseMode === 'video'
                        ? BUILDER_CAMERAS_VIDEO
                        : BUILDER_CAMERAS_PHOTO
                      ).map((cam) => {
                        const [name, subtitle] = cam.split(' (');
                        const active = builderState.camera === cam;
                        return (
                          <button
                            key={cam}
                            type="button"
                            onClick={() => setBuilderState((p) => ({ ...p, camera: cam }))}
                            className={`p-2.5 text-left rounded-lg border transition-colors ${
                              active
                                ? 'bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300] border-[#F8C300] font-bold'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                            }`}
                          >
                            <div className="text-xs font-semibold truncate">{name}</div>
                            {subtitle && (
                              <div className="text-[10px] text-[#5B5B66] dark:text-[#8E8C85] truncate">
                                {subtitle.replace(')', '')}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lens & Aperture */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="pb-lens"
                        className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                      >
                        Distancia focal / Lente
                      </label>
                      <select
                        id="pb-lens"
                        value={builderState.lens}
                        onChange={(e) =>
                          setBuilderState((p) => ({ ...p, lens: e.target.value }))
                        }
                        className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#326BFF]"
                      >
                        {!BUILDER_LENSES.some((l) => l.val === builderState.lens) && (
                          <option value={builderState.lens}>{builderState.lens}</option>
                        )}
                        {BUILDER_LENSES.map((l) => (
                          <option key={l.val} value={l.val}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="pb-aperture"
                        className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                      >
                        Apertura / Profundidad de campo
                      </label>
                      <select
                        id="pb-aperture"
                        value={builderState.aperture}
                        onChange={(e) =>
                          setBuilderState((p) => ({ ...p, aperture: e.target.value }))
                        }
                        className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#326BFF]"
                      >
                        {!BUILDER_APERTURES.some((a) => a.val === builderState.aperture) && (
                          <option value={builderState.aperture}>{builderState.aperture}</option>
                        )}
                        {BUILDER_APERTURES.map((a) => (
                          <option key={a.val} value={a.val}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Motion, FPS & Duration (for Video) */}
                  {activeCategory.baseMode === 'video' && (
                    <div className="p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
                      <div className="text-[11px] font-mono-code uppercase font-bold text-[#326BFF] dark:text-[#F8C300]">
                        MOVIMIENTO DE CÁMARA Y CADENCIA TEMPORAL
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {BUILDER_MOTIONS.map((m) => (
                          <button
                            key={m.val}
                            type="button"
                            onClick={() => setBuilderState((p) => ({ ...p, motion: m.val }))}
                            className={`p-2.5 text-left text-xs rounded-lg border transition-colors ${
                              builderState.motion === m.val
                                ? 'bg-[#101014] text-[#F8C300] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                                : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label
                            htmlFor="pb-fps"
                            className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                          >
                            Cadencia (FPS)
                          </label>
                          <select
                            id="pb-fps"
                            value={builderState.fps}
                            onChange={(e) =>
                              setBuilderState((p) => ({ ...p, fps: e.target.value }))
                            }
                            className="w-full min-h-[38px] bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-xs px-3 py-1.5 rounded-lg text-[#101014] dark:text-[#F4F2ED]"
                          >
                            <option value="12 fps">12 fps (Stop Motion)</option>
                            <option value="24 fps">24 fps (Cine Clásico)</option>
                            <option value="30 fps">30 fps (Editorial / Web)</option>
                            <option value="60 fps">60 fps (Fluido Suave)</option>
                            <option value="120 fps">120 fps (Cámara Lenta)</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="pb-dur"
                            className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                          >
                            Duración objetivo
                          </label>
                          <select
                            id="pb-dur"
                            value={builderState.duration || '6–8 segundos'}
                            onChange={(e) =>
                              setBuilderState((p) => ({ ...p, duration: e.target.value }))
                            }
                            className="w-full min-h-[38px] bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-xs px-3 py-1.5 rounded-lg text-[#101014] dark:text-[#F4F2ED]"
                          >
                            <option value="4–5 segundos">4–5 segundos (Clip corto)</option>
                            <option value="6–8 segundos">6–8 segundos (Plano narrativo)</option>
                            <option value="10 segundos">10 segundos (Secuencia lenta)</option>
                            <option value="Loop continuo infinito">Loop continuo infinito</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===================================================== */}
              {/* STEP 3: LUZ, PALETA VISUAL, ESTILO Y TEXTURA          */}
              {/* ===================================================== */}
              {showStep(3) && (
                <div
                  className={`space-y-5 ${
                    viewMode === 'all' ? 'pt-6 border-t border-[#DEDAD0] dark:border-[#26262E]' : ''
                  }`}
                >
                  {/* Lighting */}
                  <div>
                    <label
                      htmlFor="pb-light"
                      className="block text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold mb-2"
                    >
                      Esquema de Iluminación
                    </label>
                    <select
                      id="pb-light"
                      value={builderState.lighting}
                      onChange={(e) =>
                        setBuilderState((p) => ({ ...p, lighting: e.target.value }))
                      }
                      className="w-full min-h-[42px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#326BFF]"
                    >
                      {!BUILDER_LIGHTINGS.some((l) => l.val === builderState.lighting) && (
                        <option value={builderState.lighting}>{builderState.lighting}</option>
                      )}
                      {BUILDER_LIGHTINGS.map((l) => (
                        <option key={l.val} value={l.val}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visual Color Palette Swatches Grid */}
                  <div>
                    <span className="block text-[11px] font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold mb-2">
                      Paleta Cromática (con muestras visuales)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BUILDER_PALETTES.map((pal) => {
                        const active = builderState.colorPalette === pal.val;
                        return (
                          <button
                            key={pal.label}
                            type="button"
                            onClick={() =>
                              setBuilderState((p) => ({ ...p, colorPalette: pal.val }))
                            }
                            className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between gap-2 ${
                              active
                                ? 'bg-[#F8C300]/20 border-[#F8C300] text-[#101014] dark:text-[#F8C300] font-bold'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF]'
                            }`}
                          >
                            <span className="text-xs truncate">{pal.label}</span>
                            <span className="flex items-center gap-1 shrink-0">
                              {pal.swatches.map((hex) => (
                                <span
                                  key={hex}
                                  className="w-3.5 h-3.5 rounded-sm border border-black/15"
                                  style={{ backgroundColor: hex }}
                                />
                              ))}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Temperature & Atmosphere */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="pb-temp"
                        className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                      >
                        Temperatura de color
                      </label>
                      <select
                        id="pb-temp"
                        value={builderState.temperature || BUILDER_TEMPERATURES[0]}
                        onChange={(e) =>
                          setBuilderState((p) => ({ ...p, temperature: e.target.value }))
                        }
                        className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg"
                      >
                        {BUILDER_TEMPERATURES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="pb-atmos"
                        className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                      >
                        Atmósfera ambiental
                      </label>
                      <select
                        id="pb-atmos"
                        value={builderState.atmosphere || BUILDER_ATMOSPHERES[0]}
                        onChange={(e) =>
                          setBuilderState((p) => ({ ...p, atmosphere: e.target.value }))
                        }
                        className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg"
                      >
                        {BUILDER_ATMOSPHERES.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Visual Style tailored to active category */}
                  <div>
                    <span className="block text-[11px] font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#A09E97] font-bold mb-2">
                      Dirección Estética ({activeCategory.shortLabel})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory.styles.map((style) => {
                        const active = builderState.visualStyle === style;
                        return (
                          <button
                            key={style}
                            type="button"
                            onClick={() =>
                              setBuilderState((p) => ({ ...p, visualStyle: style }))
                            }
                            className={`min-h-[36px] px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                              active
                                ? 'bg-[#101014] text-[#F8C300] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300] font-bold'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                            }`}
                          >
                            {style}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Texture & Quality */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="pb-texture"
                        className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                      >
                        Textura y soporte
                      </label>
                      <select
                        id="pb-texture"
                        value={builderState.texture}
                        onChange={(e) =>
                          setBuilderState((p) => ({ ...p, texture: e.target.value }))
                        }
                        className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg"
                      >
                        {!BUILDER_TEXTURES.includes(builderState.texture) && (
                          <option value={builderState.texture}>{builderState.texture}</option>
                        )}
                        {BUILDER_TEXTURES.map((tx) => (
                          <option key={tx} value={tx}>
                            {tx}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="pb-quality"
                        className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1"
                      >
                        Acabado técnico
                      </label>
                      <select
                        id="pb-quality"
                        value={builderState.quality || BUILDER_QUALITIES[0]}
                        onChange={(e) =>
                          setBuilderState((p) => ({ ...p, quality: e.target.value }))
                        }
                        className="w-full min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-lg"
                      >
                        {!BUILDER_QUALITIES.includes(builderState.quality || '') &&
                          builderState.quality && (
                            <option value={builderState.quality}>
                              {builderState.quality}
                            </option>
                          )}
                        {BUILDER_QUALITIES.map((q) => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* STEP 4: ASPECT RATIO VISUAL Y CONTROL NEGATIVO        */}
              {/* ===================================================== */}
              {showStep(4) && (
                <div
                  className={`space-y-6 ${
                    viewMode === 'all' ? 'pt-6 border-t border-[#DEDAD0] dark:border-[#26262E]' : ''
                  }`}
                >
                  {/* Visual Aspect Ratios */}
                  <div>
                    <span className="block text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold mb-3">
                      Proporción / Aspect Ratio
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {BUILDER_ASPECT_RATIOS.map((ar) => {
                        const active = builderState.aspectRatio === ar.val;
                        return (
                          <button
                            key={ar.val}
                            type="button"
                            onClick={() =>
                              setBuilderState((p) => ({ ...p, aspectRatio: ar.val }))
                            }
                            className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                              active
                                ? 'bg-[#101014] text-[#F4F2ED] border-[#101014] dark:bg-[#F8C300] dark:text-[#101014] dark:border-[#F8C300]'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                            }`}
                          >
                            <div className="h-8 flex items-center justify-center">
                              <span
                                className={`block rounded-xs border-2 ${
                                  active
                                    ? 'border-[#F8C300] dark:border-[#101014]'
                                    : 'border-[#326BFF] dark:border-[#F8C300]'
                                }`}
                                style={{ width: `${ar.w}px`, height: `${ar.h}px` }}
                              />
                            </div>
                            <span className="text-xs font-mono-code font-bold">{ar.label}</span>
                            <span className="text-[10px] opacity-75">{ar.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Negative Controls + Custom Tag Input */}
                  <div>
                    <span className="block text-xs font-mono-code uppercase tracking-wider text-[#B4523A] dark:text-[#F8C300] font-bold mb-2.5">
                      Control Negativo (Qué bloquear antes de generar)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {BUILDER_NEGATIVES.map((neg) => {
                        const isChecked = builderState.negativeAvoid.includes(neg);
                        return (
                          <button
                            key={neg}
                            type="button"
                            onClick={() => toggleNegative(neg)}
                            className={`text-left min-h-[40px] px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-between gap-2 ${
                              isChecked
                                ? 'bg-[#F8C300]/20 text-[#101014] dark:text-[#F4F2ED] border-[#F8C300] font-semibold'
                                : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#A09E97] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                            }`}
                          >
                            <span className="truncate">{neg}</span>
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0 ${
                                isChecked
                                  ? 'bg-[#F8C300] text-[#101014] font-bold'
                                  : 'border border-[#C9C4B8] dark:border-[#3A3A46]'
                              }`}
                            >
                              {isChecked && '✓'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Negative Entry */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customNegativeInput}
                        onChange={(e) => setCustomNegativeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomNegative();
                          }
                        }}
                        placeholder="Agregar restricción propia (ej: sin fondo blanco, sin neón)..."
                        className="flex-1 min-h-[40px] bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:border-[#326BFF]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomNegative}
                        className="min-h-[40px] px-3.5 py-2 text-xs font-bold rounded-lg bg-[#101014] text-[#F4F2ED] dark:bg-[#F8C300] dark:text-[#101014] inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar</span>
                      </button>
                    </div>

                    {/* Extra active custom negatives */}
                    {builderState.negativeAvoid.filter((n) => !BUILDER_NEGATIVES.includes(n))
                      .length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {builderState.negativeAvoid
                          .filter((n) => !BUILDER_NEGATIVES.includes(n))
                          .map((customNeg) => (
                            <button
                              key={customNeg}
                              type="button"
                              onClick={() => toggleNegative(customNeg)}
                              className="px-2.5 py-1 text-[11px] font-mono-code rounded bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300] border border-[#F8C300]/60 inline-flex items-center gap-1"
                            >
                              <span>{customNeg}</span>
                              <X className="w-3 h-3" />
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step Footer Navigation (when in stepped mode) */}
              {viewMode === 'stepped' && (
                <div className="pt-4 border-t border-[#DEDAD0] dark:border-[#26262E] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={activeStep === 1}
                    onClick={() =>
                      setActiveStep((s) => (s > 1 ? ((s - 1) as BuilderStepId) : s))
                    }
                    className="min-h-[40px] px-4 py-2 text-xs font-semibold rounded-lg border border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] text-[#101014] dark:text-[#F4F2ED] disabled:opacity-40 inline-flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Paso anterior</span>
                  </button>

                  <span className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#8E8C85]">
                    Paso {activeStep} de 4
                  </span>

                  <button
                    type="button"
                    disabled={activeStep === 4}
                    onClick={() =>
                      setActiveStep((s) => (s < 4 ? ((s + 1) as BuilderStepId) : s))
                    }
                    className="min-h-[40px] px-4 py-2 text-xs font-bold rounded-lg bg-[#101014] text-[#F4F2ED] dark:bg-[#F8C300] dark:text-[#101014] disabled:opacity-40 inline-flex items-center gap-1.5"
                  >
                    <span>Siguiente paso</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT WORKSPACE (5 COLS): DARK CHARCOAL STUDIO OUTPUT CONSOLE */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <div className="bg-[#101014] text-[#F4F2ED] border border-[#26262E] rounded-2xl p-5 shadow-xl space-y-4">
              {/* Top Title + Completeness Score */}
              <div className="space-y-2 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#F8C300]" />
                    <span className="text-xs font-mono-code uppercase tracking-wider text-[#F4F2ED] font-bold">
                      Prompt Listo · {activeCategory.shortLabel}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-code font-bold text-[#F8C300] tabular-nums">
                    Nivel {promptScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#326BFF] via-[#7545D6] to-[#F8C300] transition-all duration-300"
                    style={{ width: `${promptScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#A6A49D]">
                  <span className="tabular-nums">
                    {currentPrompt.split(/\s+/).filter(Boolean).length} palabras ·{' '}
                    {currentPrompt.length} car.
                  </span>
                  <span className={builderState.subject.trim() ? 'text-[#34D399]' : 'text-[#A6A49D]'}>
                    {builderState.subject.trim()
                      ? 'Sujeto definido ✓'
                      : 'Escribe tu sujeto en Paso 01'}
                  </span>
                </div>
              </div>

              {/* Target AI Platform Selector */}
              <div>
                <div className="text-[10px] font-mono-code uppercase font-bold text-[#93B4FF] mb-1.5">
                  FORMATO SEGÚN PLATAFORMA IA
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_TARGETS.map((plat) => (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setPlatformTarget(plat.id)}
                      className={`min-h-[32px] px-2.5 py-1 text-[11px] font-mono-code rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        platformTarget === plat.id
                          ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                          : 'bg-[#1A1A22] text-[#D2CFC7] border-white/10 hover:border-[#F8C300]/60 hover:text-white'
                      }`}
                    >
                      {plat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Universal Output Density Toggle */}
              {platformTarget === 'universal' && (
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'breve', label: 'Conciso' },
                      { id: 'avanzado', label: 'Estructurado' },
                      { id: 'cinematografico', label: 'Dirección Arte' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setOutputMode(m.id)}
                      className={`min-h-[34px] py-1.5 px-2 text-[11px] font-mono-code uppercase rounded-lg border transition-colors truncate cursor-pointer ${
                        outputMode === m.id
                          ? 'bg-[#326BFF] text-white border-[#326BFF] font-bold'
                          : 'bg-[#1A1A22] text-[#C8C5BD] border-white/10 hover:border-[#326BFF]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Incompatibilities Alert */}
              {incompatibilities.length > 0 && (
                <div className="p-3 rounded-lg bg-[#F8C300]/15 border border-[#F8C300]/60 space-y-2">
                  {incompatibilities.map((w) => (
                    <div
                      key={w.msg}
                      className="flex items-start justify-between gap-2 text-[11px] text-[#F4F2ED]"
                    >
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F8C300] shrink-0 mt-0.5" />
                        <span>{w.msg}</span>
                      </div>
                      <button
                        type="button"
                        onClick={w.applyFix}
                        className="px-2 py-0.5 bg-[#F8C300] text-[#101014] font-bold rounded shrink-0 cursor-pointer"
                      >
                        {w.fixLabel}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Parameters Quick Jump Strip */}
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono-code">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('stepped');
                    setActiveStep(4);
                  }}
                  className="px-2 py-1 rounded bg-[#1B1B24] border border-white/12 text-[#E5E3DC] hover:border-[#F8C300] cursor-pointer"
                >
                  AR {builderState.aspectRatio}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('stepped');
                    setActiveStep(2);
                  }}
                  className="px-2 py-1 rounded bg-[#1B1B24] border border-white/12 text-[#E5E3DC] hover:border-[#326BFF] max-w-[140px] truncate cursor-pointer"
                >
                  {builderState.lens}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('stepped');
                    setActiveStep(3);
                  }}
                  className="px-2 py-1 rounded bg-[#1B1B24] border border-white/12 text-[#E5E3DC] hover:border-[#7545D6] max-w-[150px] truncate cursor-pointer"
                >
                  {builderState.visualStyle}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setBuilderState((p) => ({
                      ...p,
                      aspectRatio:
                        p.aspectRatio === '4:5'
                          ? '16:9'
                          : p.aspectRatio === '16:9'
                          ? '2:3'
                          : p.aspectRatio === '2:3'
                          ? '9:16'
                          : '4:5',
                    }))
                  }
                  className="px-2 py-1 rounded bg-[#326BFF]/25 text-[#93B4FF] font-bold hover:bg-[#326BFF]/40 cursor-pointer transition-colors"
                >
                  ↻ Rotar ratio
                </button>
              </div>

              {/* Prompt Code Preview */}
              <div className="relative bg-[#09090D] rounded-xl p-4 border border-white/10 font-mono-code text-xs text-[#EBE8DF] leading-relaxed max-h-[340px] overflow-y-auto whitespace-pre-wrap select-all">
                {currentPrompt}
              </div>

              {/* Primary Copy + Save + Export Actions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 min-h-[42px] py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Prompt Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Prompt</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveFavoritePrompt}
                    className="min-h-[42px] py-2.5 px-3.5 text-xs font-bold text-white bg-[#7545D6] hover:bg-[#6134BF] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    title="Guardar prompt en tu colección"
                  >
                    <Star className="w-3.5 h-3.5 text-[#F8C300]" />
                    <span>Guardar</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={handleSaveToJournal}
                    className="min-h-[36px] py-1.5 px-2 text-[11px] font-mono-code font-semibold text-[#E5E3DC] bg-[#1A1A24] hover:bg-[#232332] border border-white/12 hover:border-[#F8C300] rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Enviar prompt actual a tu Bitácora Creativa"
                  >
                    {journalSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#34D399]" />
                        <span className="text-[#34D399]">Bitácora</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5 text-[#F8C300]" />
                        <span>Bitácora</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleExportTxt}
                    className="min-h-[36px] py-1.5 px-2 text-[11px] font-mono-code font-semibold text-[#E5E3DC] bg-[#1A1A24] hover:bg-[#232332] border border-white/12 hover:border-[#326BFF] rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8FB0FF]" />
                    <span>.TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="min-h-[36px] py-1.5 px-2 text-[11px] font-mono-code font-semibold text-[#E5E3DC] bg-[#1A1A24] hover:bg-[#232332] border border-white/12 hover:border-[#34D399] rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>.JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenExporter}
                    className="min-h-[36px] py-1.5 px-2 text-[11px] font-mono-code font-semibold text-[#E5E3DC] bg-[#1A1A24] hover:bg-[#232332] border border-white/12 hover:border-[#C4A5FF] rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#C4A5FF]" />
                    <span>PDF / PNG</span>
                  </button>
                </div>
              </div>

              {/* Project Collections & Saved History */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono-code uppercase text-[#C8C5BD] font-bold">
                    Colección (
                    {
                      savedPrompts.filter(
                        (sp) => (sp.projectName || 'Proyecto General') === activeProject
                      ).length
                    }
                    )
                  </span>
                  <select
                    value={activeProject}
                    onChange={(e) => setActiveProject(e.target.value)}
                    aria-label="Seleccionar colección o proyecto"
                    className="text-[11px] bg-[#1A1A24] border border-white/15 rounded-lg px-2 py-1 text-[#F4F2ED]"
                  >
                    {projects.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newProjectInput}
                    onChange={(e) => setNewProjectInput(e.target.value)}
                    placeholder="Nueva colección..."
                    className="flex-1 text-[11px] bg-[#1A1A24] border border-white/15 rounded-lg px-2.5 py-1.5 text-[#F4F2ED] placeholder:text-white/40 focus:outline-none focus:border-[#F8C300]"
                  />
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-2.5 py-1.5 text-[11px] font-mono-code font-bold bg-[#326BFF] hover:bg-[#2358E6] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    + Crear
                  </button>
                </div>

                {savedPrompts.filter(
                  (sp) => (sp.projectName || 'Proyecto General') === activeProject
                ).length > 0 && (
                  <div className="max-h-28 overflow-y-auto space-y-1">
                    {savedPrompts
                      .filter(
                        (sp) => (sp.projectName || 'Proyecto General') === activeProject
                      )
                      .map((sp) => (
                        <div
                          key={sp.id}
                          className="flex items-center justify-between gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-[#1A1A24] border border-white/10"
                        >
                          <button
                            type="button"
                            onClick={() => setBuilderState(sp.state)}
                            className="text-left truncate font-medium text-[#F4F2ED] hover:text-[#F8C300] flex-1 cursor-pointer"
                          >
                            {sp.title}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSavedPrompts((prev) =>
                                prev.filter((item) => item.id !== sp.id)
                              )
                            }
                            className="text-[10px] font-mono-code text-[#A6A49D] hover:text-[#FB7185] cursor-pointer"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Category-Specific External AI Apps Launchers */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-[10px] font-mono-code uppercase text-[#C4A5FF] font-bold">
                  COPIAR Y PRACTICAR EN APPS RECOMENDADAS ({activeCategory.shortLabel.toUpperCase()})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeCategory.recommendedApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleCopy}
                      className="px-2.5 py-1.5 text-[11px] font-mono-code font-semibold bg-[#1A1A24] border border-white/12 hover:border-[#F8C300] hover:bg-[#242434] text-[#F4F2ED] rounded-lg inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{app.name}</span>
                      <ExternalLink className="w-3 h-3 text-[#F8C300]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
