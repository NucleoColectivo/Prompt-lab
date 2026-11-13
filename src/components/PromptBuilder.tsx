import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Camera, 
  Video, 
  ShieldAlert,
  Film,
  Wand2,
  FileDown,
  Loader2,
  Star,
  AlertTriangle,
  Download,
  Sliders
} from 'lucide-react';
import { RECIPES } from '../data/promptData';

export interface PromptBuilderState {
  mode: 'photo' | 'video';
  subject: string;
  action?: string;
  setting?: string;
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
}

interface SavedFavoritePrompt {
  id: string;
  title: string;
  projectName?: string;
  createdAt?: string;
  mode: 'photo' | 'video';
  promptText: string;
  state: PromptBuilderState;
}

interface PromptBuilderProps {
  builderState: PromptBuilderState;
  setBuilderState: React.Dispatch<React.SetStateAction<PromptBuilderState>>;
  onOpenExporter: () => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  builderState,
  setBuilderState,
  onOpenExporter
}) => {
  const [copied, setCopied] = useState(false);
  const [outputMode, setOutputMode] = useState<'breve' | 'avanzado' | 'cinematografico'>('avanzado');
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
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

  useEffect(() => {
    try {
      localStorage.setItem('nc_fav_prompts_v1', JSON.stringify(savedPrompts));
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

  const GENRES_PHOTO = [
    { label: 'Editorial Publicitaria', cmd: '/editorial' },
    { label: 'Producto Premium', cmd: '/premiumshowcase' },
    { label: 'Retrato Cinematográfico', cmd: '/cinematicportrait' },
    { label: 'Documental Calle', cmd: '/documentary' },
    { label: 'Fotorrealista RAW', cmd: '/photorealistic' },
    { label: 'Macro Texturas', cmd: '/macro' },
    { label: 'Arquitectura Minimalista', cmd: '/architecture' },
    { label: 'Arte Conceptual', cmd: '/fineart' }
  ];

  const GENRES_VIDEO = [
    { label: 'Film Cinematográfico', cmd: '/cinematicvideo' },
    { label: 'Comercial de Marca', cmd: '/commercialfilm' },
    { label: 'Cine de Arte / Instalación', cmd: '/artfilm' },
    { label: 'Video Experimental', cmd: '/generativevideo' },
    { label: 'Loop Audiovisual Infinito', cmd: '/loopvideo' },
    { label: 'Fashion Film', cmd: '/fashionfilm' },
    { label: 'VFX & Simulación', cmd: '/particle-simulation' }
  ];

  const CAMERAS_PHOTO = [
    'Hasselblad X2D (Medio Formato)',
    'Sony A7R V (Full Frame)',
    'Leica M11 (Rangefinder 35mm)',
    'Phase One IQ4 (Cámara Técnica)',
    'Canon AE-1 (Película 35mm)',
    'Fujifilm GFX 100 II'
  ];

  const CAMERAS_VIDEO = [
    'ARRI Alexa 35 (Cine Referente)',
    'RED V-Raptor (8K High-Speed)',
    'Sony Venice 2 (Gran Formato)',
    'Blackmagic URSA 12K',
    'Cooke Cinema Rig',
    'DJI Ronin 4D (Gimbal)'
  ];

  const LENSES = [
    { label: '14mm Ultra Gran Angular', val: '14mm ultra-wide lens' },
    { label: '24mm Reportaje / Paisaje', val: '24mm wide angle lens' },
    { label: '35mm Documental Natural', val: '35mm prime lens' },
    { label: '50mm Perspectiva Ojo Humano', val: '50mm standard lens' },
    { label: '85mm Retrato & Bokeh', val: '85mm portrait prime lens' },
    { label: '100mm Macro Detalle', val: '100mm macro f/2.8 lens' },
    { label: 'Lente Anamórfico Cooke', val: 'Cooke 40mm anamorphic prime lens' }
  ];

  const APERTURES = [
    { label: 'f/1.4 (Desenfoque muy pronunciado)', val: 'f/1.4 shallow depth of field' },
    { label: 'f/1.8 (Bokeh suave)', val: 'f/1.8 creamy bokeh' },
    { label: 'f/2.8 (Separación nítida)', val: 'f/2.8 aperture' },
    { label: 'f/8 (Nitidez comercial amplia)', val: 'f/8 sharp commercial focus' },
    { label: 'f/11 (Paisaje y arquitectura)', val: 'f/11 deep focus' },
    { label: 'T2.3 (Cine Anamórfico)', val: 'T2.3 cinematic aperture' }
  ];

  const LIGHTINGS = [
    { label: 'Rembrandt (Triángulo en mejilla)', val: 'Rembrandt lighting, directional light with cheek triangle' },
    { label: 'Butterfly (Luz frontal superior de belleza)', val: 'Butterfly lighting, sculpted cheekbones' },
    { label: 'Split (Luz dividida 50/50 drama)', val: 'Split lighting, half in shadow half in light' },
    { label: 'Rim Light (Contorno brillante de silueta)', val: 'Crisp rim lighting separating subject from dark backdrop' },
    { label: 'Luz Volumétrica / Haces de luz', val: 'Volumetric light shafts cutting through soft atmospheric haze' },
    { label: 'Claroscuro Barroco', val: 'Chiaroscuro, dramatic contrast between light and deep shadow' },
    { label: 'Softbox de Estudio Publicitario', val: 'Large diffused studio softbox with silver bounce fill' },
    { label: 'Luz Natural de Ventana', val: 'Soft natural window light during golden hour' }
  ];

  const MOTIONS_VIDEO = [
    { label: 'Dolly In (Acercamiento físico lento)', val: 'Slow smooth dolly-in moving physically towards the subject' },
    { label: 'Orbit Shot (Giro orbital continuo 360°)', val: 'Continuous smooth 360-degree orbit shot around the subject' },
    { label: 'Crane Up (Elevación majestuosa en grúa)', val: 'Majestic crane-up movement revealing the expansive environment' },
    { label: 'FPV Flythrough (Vuelo dinámico inmersivo)', val: 'Dynamic FPV flythrough traversing through architectural space' },
    { label: 'Tracking Shot (Seguimiento estabilizado)', val: 'Steadicam tracking shot moving parallel to the movement' },
    { label: 'Seamless Loop (Continuidad sin corte)', val: 'Seamless loop where final frame matches first frame with constant inertia' }
  ];

  const COLOR_PALETTES = [
    { label: 'Teal & Orange (#007F86 / #E88943)', val: 'Teal and orange cinematic grading with warm skin and cool shadows' },
    { label: 'Kodak Portra 400 (Cálido y orgánico)', val: 'Kodak Portra 400 film emulation, natural skin tones and gentle grain' },
    { label: 'CineStill 800T (Halos rojos nocturnos)', val: 'CineStill 800T film look with distinct red halation around point lights' },
    { label: 'Kodak 2383 Print Film Look', val: 'Kodak 2383 cinematic print film stock, rich blacks and soft highlight roll-off' },
    { label: 'Cyberpunk Neón (#00F0FF / #FF00A8)', val: 'Cyberpunk neon palette with vivid cyan and electric magenta reflections' },
    { label: 'Desert & Earth Tones', val: 'Mineral earth tones, terracotta, warm sand and sun-baked ochre' },
    { label: 'Monochrome Silver (Blanco y negro puro)', val: 'Pure silver gelatin monochrome with deep contrast and rich midtones' },
    { label: 'Nordic Mist (Minimalismo sobrio)', val: 'Nordic minimalist palette, pale slate gray and platinum cool light' }
  ];

  const ASPECT_RATIOS = [
    { label: '1:1 Cuadrado', val: '1:1' },
    { label: '4:5 Vertical Instagram', val: '4:5' },
    { label: '3:2 Fotografía 35mm', val: '3:2' },
    { label: '16:9 Panorámico Pantallas', val: '16:9' },
    { label: '9:16 Vertical Reels / TikTok', val: '9:16' },
    { label: '2.39:1 Cinemascope Cine', val: '2.39:1' }
  ];

  const NEGATIVE_OPTIONS = [
    'Evitar piel plástica artificial (/noartificialskin)',
    'Evitar desenfoque falso de software (/nofakebokeh)',
    'Sin texto ni marcas inventadas (/notext)',
    'Sin sobreenfoque digital (/nooversharpening)',
    'Sin deformaciones anatómicas (/nodeformedhands)',
    'Sin cortes aleatorios ni morphing (en video)'
  ];

  const SHOT_SIZES = [
    'Gran Plano General (ELS)',
    'Plano General (LS)',
    'Plano Entero (Full Shot)',
    'Plano Americano (3/4)',
    'Plano Medio (MS)',
    'Primer Plano (CU)',
    'Primerísimo Primer Plano (ECU)',
    'Plano Detalle (Macro)',
  ];

  const CAMERA_ANGLES = [
    'Normal (Eye Level)',
    'Contrapicado (Low Angle)',
    'Picado (High Angle)',
    'Cenital / Overhead (90°)',
    'Nadir (Worm’s Eye)',
    'Plano Holandés (Dutch Angle)',
    'Over the Shoulder (OTS)',
    'POV (Primera Persona)',
  ];

  const TEMPERATURES = [
    'Neutra equilibrada (5500K)',
    'Cálida dorada (3200K–4200K)',
    'Fría nocturna / Hora azul (7200K)',
    'Mixta (Cálida 3200K / Fría 7200K)',
  ];

  const ATMOSPHERES = [
    'Aire limpio natural',
    'Neblina sutil y partículas de polvo iluminadas',
    'Lluvia ligera nocturna con reflejos en pavimento',
    'Ambiente de galería silenciosa',
    'Polvo dorado al atardecer',
  ];

  // Detect incompatible parameter combinations
  const incompatibilities = useMemo(() => {
    const warnings: { msg: string; fixLabel: string; applyFix: () => void }[] = [];
    const isMacroLens = builderState.lens.toLowerCase().includes('macro') || builderState.lens.includes('100mm');
    const isUltraWideShot =
      builderState.shotSize?.includes('Gran Plano General') ||
      builderState.shotSize?.includes('Plano General');
    if (isMacroLens && isUltraWideShot) {
      warnings.push({
        msg: 'Lente Macro 100mm es incompatible con Gran Plano General o Plano General.',
        fixLabel: 'Cambiar a 24mm Gran Angular',
        applyFix: () => setBuilderState((p) => ({ ...p, lens: '24mm wide angle lens' })),
      });
    }

    const isDeepFStop = builderState.aperture.includes('f/11') || builderState.aperture.includes('f/8');
    const isShallowLook = builderState.genre.includes('portrait') || builderState.shotSize?.includes('Primerísimo');
    if (isDeepFStop && isShallowLook) {
      warnings.push({
        msg: 'Apertura cerrada (f/8–f/11) reduce el bokeh suave habitual en primerísimo plano.',
        fixLabel: 'Abrir a f/1.8',
        applyFix: () => setBuilderState((p) => ({ ...p, aperture: 'f/1.8 creamy bokeh' })),
      });
    }

    if (
      builderState.lighting.toLowerCase().includes('butterfly') &&
      builderState.visualStyle.toLowerCase().includes('noir')
    ) {
      warnings.push({
        msg: 'Iluminación Butterfly (High Key luminosa) contradice la estética oscura Neo Noir.',
        fixLabel: 'Cambiar a Chiaroscuro',
        applyFix: () =>
          setBuilderState((p) => ({
            ...p,
            lighting: 'Chiaroscuro, dramatic contrast between light and deep shadow',
          })),
      });
    }

    if (
      builderState.mode === 'video' &&
      builderState.fps.includes('120') &&
      builderState.motion.toLowerCase().includes('time-lapse')
    ) {
      warnings.push({
        msg: 'Slow Motion (120fps) y Time-Lapse son temporalidades opuestas.',
        fixLabel: 'Ajustar a 24fps',
        applyFix: () => setBuilderState((p) => ({ ...p, fps: '24 fps' })),
      });
    }

    return warnings;
  }, [builderState, setBuilderState]);

  const generatePrompt = (): string => {
    const isVid = builderState.mode === 'video';
    const baseSubject =
      builderState.subject ||
      (isVid
        ? 'Cinematic sequence of an artwork in a contemporary gallery'
        : 'A sculptural luxury object on dark mineral stone');
    const actionStr = builderState.action ? `, ${builderState.action}` : '';
    const settingStr = builderState.setting ? `, set in ${builderState.setting}` : '';
    const shotStr = builderState.shotSize || 'Plano Medio (MS)';
    const angleStr = builderState.cameraAngle || 'Normal (Eye Level)';
    const tempStr = builderState.temperature || 'Neutra equilibrada (5500K)';
    const atmosStr = builderState.atmosphere || 'Aire limpio natural';
    const qualityStr = builderState.quality || 'RAW editorial authenticity, natural microtextures';

    if (outputMode === 'breve') {
      return isVid
        ? `${baseSubject}${actionStr}${settingStr}. ${shotStr}, ${angleStr}, ${builderState.motion}, shot on ${builderState.camera}, ${builderState.lens}, ${builderState.lighting}, ${builderState.colorPalette}, ${builderState.fps}, aspect ratio ${builderState.aspectRatio}. Avoid: ${builderState.negativeAvoid.join(', ')}.`
        : `${baseSubject}${actionStr}${settingStr}. ${shotStr}, ${angleStr}, ${builderState.genre}, aesthetic reference ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}, ${builderState.lighting}, ${builderState.colorPalette}, ${qualityStr}, aspect ratio ${builderState.aspectRatio}. Avoid: ${builderState.negativeAvoid.join(', ')}.`;
    }

    if (outputMode === 'cinematografico') {
      return isVid
        ? `CINEMATOGRAPHY MASTER SCRIPT — NÚCLEO COLECTIVO
[01] ESCENA Y ACCIÓN: ${baseSubject}${actionStr}${settingStr}.
[02] GÉNERO Y TONO: ${builderState.genre} · Estilo ${builderState.visualStyle}.
[03] ENCUADRE Y ÁNGULO: ${shotStr} · Ángulo ${angleStr}.
[04] CÁMARA Y ÓPTICA: Referencia ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.
[05] MOVIMIENTO Y TEMPORALIDAD: ${builderState.motion} · Cadencia ${builderState.fps} · Duración ${builderState.duration || '6–8 segundos continuos'}.
[06] ILUMINACIÓN Y ATMÓSFERA: ${builderState.lighting} · Temperatura ${tempStr} · ${atmosStr}.
[07] COLORIMETRÍA: ${builderState.colorPalette} (referencia estética).
[08] TEXTURA Y CALIDAD: ${builderState.texture}, ${qualityStr}.
[09] FORMATO: Aspect ratio ${builderState.aspectRatio}.
[10] CONTINUIDAD Y NEGATIVAS: Mantener identidad, geometría y luz estable. Avoid: ${builderState.negativeAvoid.join(', ')}.`
        : `ART DIRECTION MASTER SHEET — NÚCLEO COLECTIVO
[01] SUJETO Y ACCIÓN: ${baseSubject}${actionStr}.
[02] ESCENARIO Y CONTEXTO: ${builderState.setting || 'Entorno editorial coherente con luz natural'}.
[03] PLANO Y ÁNGULO: ${shotStr} · ${angleStr}.
[04] GÉNERO Y ESTILO: ${builderState.genre} · ${builderState.visualStyle}.
[05] CÁMARA DE REFERENCIA: ${builderState.camera} (referencia estética, no requisito obligatorio).
[06] ÓPTICA Y DIAFRAGMA: ${builderState.lens}, ${builderState.aperture}, caída óptica natural.
[07] ESQUEMA DE LUZ: ${builderState.lighting} · Temperatura ${tempStr}.
[08] ATMÓSFERA Y COLOR: ${atmosStr} · ${builderState.colorPalette}.
[09] TEXTURA Y ACABADO: ${builderState.texture}, ${qualityStr}.
[10] FORMATO Y NEGATIVAS: Aspect ratio ${builderState.aspectRatio}. Avoid: ${builderState.negativeAvoid.join(', ')}.`;
    }

    if (isVid) {
      return `MASTER VIDEO PROMPT — CINEMATOGRAPHY & MOTION
01. SCENE & SUBJECT:
${baseSubject}${actionStr}${settingStr}.

02. GENRE & FRAMING:
${builderState.genre || '/cinematicvideo'} · ${shotStr} · ${angleStr}.

03. CAMERA & OPTICS:
Shot on ${builderState.camera || 'ARRI Alexa 35'}, ${builderState.lens || 'Cooke 40mm anamorphic prime lens'}, ${builderState.aperture || 'T2.3 cinematic aperture'}.

04. CAMERA MOVEMENT:
${builderState.motion || 'Smooth continuous orbit shot around the subject'} (${builderState.fps}, ${builderState.duration || '6-8s'}).

05. LIGHTING & ATMOSPHERE:
${builderState.lighting || 'Volumetric light shafts cutting through soft atmospheric haze'}, ${tempStr}, ${atmosStr}.

06. COLOR SCIENCE:
${builderState.colorPalette || 'Kodak 2383 print film look with soft highlight roll-off'}.

07. STYLE & TEXTURE:
${builderState.visualStyle || 'Contemporary cinematic editorial'}, ${builderState.texture}, ${qualityStr}.

08. OUTPUT & SPECS:
Aspect ratio: ${builderState.aspectRatio || '16:9'}.

09. CONTINUITY & NEGATIVES:
Maintain subject identity, object geometry, and lighting consistency throughout the sequence.
Avoid: ${builderState.negativeAvoid.length > 0 ? builderState.negativeAvoid.join(', ') : 'plastic textures, morphing, jitter, warping, artificial motion, text, logos'}.`;
    }

    return `MASTER PROMPT — PHOTOGRAPHY & VISUAL ART
01. SUBJECT:
${baseSubject}${actionStr}${settingStr}.

02. GENRE & FRAMING:
${builderState.genre || '/editorial'} · ${shotStr} · ${angleStr}.

03. CAMERA & SENSOR (REFERENCIA ESTÉTICA):
Shot on ${builderState.camera || 'Hasselblad X2D'}.

04. OPTICS & APERTURE:
${builderState.lens || '85mm portrait prime lens'}, ${builderState.aperture || 'f/2.8 aperture'}, realistic optical fall-off.

05. LIGHTING SETUP & ATMOSPHERE:
${builderState.lighting || 'Rembrandt lighting, directional light with cheek triangle'}, ${tempStr}, ${atmosStr}.

06. COLOR GRADING:
${builderState.colorPalette || 'Teal and orange cinematic grading with warm skin and cool shadows'}.

07. STYLE & FINISH:
${builderState.visualStyle || 'Lujo Publicitario Contemporáneo'}, ${builderState.texture}, ${qualityStr}.

08. OUTPUT FORMAT:
Aspect ratio: ${builderState.aspectRatio || '4:5'}.

09. NEGATIVE INSTRUCTIONS:
Avoid: ${builderState.negativeAvoid.length > 0 ? builderState.negativeAvoid.join(', ') : 'plastic skin, artificial lighting, oversaturation, fake bokeh, distorted anatomy, text, watermarks'}.`;
  };

  const currentPrompt = generatePrompt();

  const handleSaveFavoritePrompt = () => {
    const title = builderState.subject.trim()
      ? builderState.subject.trim().slice(0, 42)
      : `${builderState.visualStyle} (${builderState.mode})`;
    const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSavedPrompts((prev) => [
      {
        id: `fp-${Date.now()}`,
        title,
        projectName: activeProject,
        createdAt: nowLabel,
        mode: builderState.mode,
        promptText: currentPrompt,
        state: builderState,
      },
      ...prev.slice(0, 23),
    ]);
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
    a.download = `nucleo_prompt_${builderState.mode}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const payload = {
      generator: 'Núcleo Colectivo · Visual & Motion Prompt Lab',
      outputMode,
      parameters: builderState,
      prompt: currentPrompt,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nucleo_prompt_${builderState.mode}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnrichWithGemini = async () => {
    if (!builderState.subject.trim()) {
      setEnrichError('Escribe primero una idea básica en el campo de sujeto (ej: "un reloj de titanio", "un artesano en su taller").');
      return;
    }

    setEnrichError(null);
    setIsEnriching(true);
    try {
      const response = await fetch('/api/gemini/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: builderState.subject,
          mode: builderState.mode,
          style: builderState.visualStyle
        })
      });

      if (!response.ok) {
        throw new Error(`Error en servidor: ${response.statusText}`);
      }

      const data = await response.json();
      setGeminiSuggestion(data);
    } catch (err: any) {
      console.error(err);
      setEnrichError('No se pudo conectar con Gemini. Verifica la clave API en Configuración.');
    } finally {
      setIsEnriching(false);
    }
  };

  const applyGeminiSuggestion = () => {
    if (!geminiSuggestion) return;
    setBuilderState((prev) => ({
      ...prev,
      subject: geminiSuggestion.enrichedDescription,
      texture: geminiSuggestion.visualCues.join(', ')
    }));
    setGeminiSuggestion(null);
  };

  const handleReset = () => {
    setBuilderState({
      mode: 'photo',
      subject: '',
      genre: '/editorial',
      camera: 'Hasselblad X2D (Medio Formato)',
      lens: '85mm portrait prime lens',
      aperture: 'f/1.8 creamy bokeh',
      lighting: 'Rembrandt lighting, directional light with cheek triangle',
      colorPalette: 'Teal and orange cinematic grading with warm skin and cool shadows',
      visualStyle: 'Neo Noir',
      motion: 'Slow smooth dolly-in moving physically towards the subject',
      fps: '24 fps',
      aspectRatio: '4:5',
      texture: 'natural texture, visible pores',
      negativeAvoid: ['Evitar piel plástica artificial (/noartificialskin)', 'Sin texto ni marcas inventadas (/notext)']
    });
    setGeminiSuggestion(null);
  };

  const handleLoadRecipe = (recipeId: string) => {
    const r = RECIPES.find((item) => item.id === recipeId);
    if (!r) return;

    const isVideoRecipe = r.type === 'video' || r.type === 'experimental';
    setBuilderState({
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
    });
  };

  const toggleNegative = (option: string) => {
    setBuilderState((prev) => {
      const exists = prev.negativeAvoid.includes(option);
      return {
        ...prev,
        negativeAvoid: exists
          ? prev.negativeAvoid.filter((item) => item !== option)
          : [...prev.negativeAvoid, option]
      };
    });
  };

  return (
    <section id="builder" className="py-16 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono-code mb-2">
              <span>MÓDULO INTERACTIVO</span>
              <span aria-hidden="true" className="text-stone-400">/</span>
              <span>CONSTRUCTOR MAESTRO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Prompt Builder
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              Configura tus parámetros fotográficos u ópticos y genera un prompt profesional estructurado listo para copiar en ChatGPT, Midjourney, Flux o Runway.
            </p>
          </div>

          {/* Quick Presets & Export Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenExporter}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded transition-colors flex items-center gap-1.5 shadow-xs"
              title="Exportar ficha técnica para talleres en PDF o PNG"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Exportar Ficha Taller</span>
            </button>

            <select
              onChange={(e) => handleLoadRecipe(e.target.value)}
              defaultValue=""
              aria-label="Cargar receta predefinida en el constructor"
              className="text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="" disabled>Cargar Receta...</option>
              {RECIPES.map((r) => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors"
              title="Restablecer valores"
              aria-label="Restablecer valores"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Segmented Control */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex p-1 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
            <button
              type="button"
              onClick={() => setBuilderState((p) => ({ ...p, mode: 'photo' }))}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all flex items-center gap-2 ${
                builderState.mode === 'photo'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Modo Fotografía & ADS</span>
            </button>

            <button
              type="button"
              onClick={() => setBuilderState((p) => ({ ...p, mode: 'video' }))}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all flex items-center gap-2 ${
                builderState.mode === 'video'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Modo Video & Cinematografía</span>
            </button>
          </div>
        </div>

        {/* Builder Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 bg-white dark:bg-stone-900/60 p-6 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
            
            {/* 1. Sujeto / Qué quieres crear + GEMINI ENRICHER BUTTON */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                  01. Sujeto o Escena Principal
                </label>

                {/* Gemini Enricher Trigger */}
                <button
                  type="button"
                  onClick={handleEnrichWithGemini}
                  disabled={isEnriching}
                  className="px-2.5 py-1 text-[11px] font-mono-code text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/40 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800/80 rounded transition-all flex items-center gap-1.5 disabled:opacity-50"
                  title="Enriquecer descripción con detalles ópticos, texturas y dirección de arte con Gemini"
                >
                  {isEnriching ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                      <span>Enriqueciendo con Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Enriquecer con Gemini</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                value={builderState.subject}
                onChange={(e) => setBuilderState((p) => ({ ...p, subject: e.target.value }))}
                placeholder={
                  builderState.mode === 'video'
                    ? "Ej: Una escultura contemporánea en galería mientras la luz entra por el vitral"
                    : "Ej: Retrato de un artesano trabajando arcilla / Frasco de perfume sobre mármol negro"
                }
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm px-4 py-2.5 rounded focus:outline-none focus:border-amber-500 placeholder:text-stone-400 dark:placeholder:text-stone-600 transition-colors"
              />

              {enrichError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">
                  {enrichError}
                </p>
              )}

              {/* Gemini Suggestion Panel */}
              {geminiSuggestion && (
                <div className="mt-3 p-4 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg text-stone-800 dark:text-stone-200 animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-code font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Propuesta de Dirección de Arte (Gemini)</span>
                    </span>
                    <button
                      type="button"
                      onClick={applyGeminiSuggestion}
                      className="px-3 py-1 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-stone-950" />
                      <span>Aplicar al Prompt</span>
                    </button>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mb-2 font-medium">
                    {geminiSuggestion.enrichedDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code text-stone-600 dark:text-stone-400">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Claves:</span>
                    {geminiSuggestion.visualCues.map((cue) => (
                      <span key={cue} className="px-1.5 py-0.5 bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-800 rounded">
                        {cue}
                      </span>
                    ))}
                    <span className="ml-2 text-stone-500">· Luz sugerida: {geminiSuggestion.lightingAdvice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Género / Intención */}
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                02. Género Visual / Comando Clave
              </label>
              <div className="flex flex-wrap gap-2">
                {(builderState.mode === 'photo' ? GENRES_PHOTO : GENRES_VIDEO).map((item) => (
                  <button
                    key={item.cmd}
                    type="button"
                    onClick={() => setBuilderState((p) => ({ ...p, genre: item.cmd }))}
                    className={`px-3 py-1.5 text-xs font-mono-code rounded transition-all ${
                      builderState.genre === item.cmd
                        ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/60 font-semibold'
                        : 'bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    {item.cmd} <span className="text-stone-500 font-sans font-normal">({item.label})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Cámara & Sensor */}
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                03. Cámara de Referencia & Sensor
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(builderState.mode === 'photo' ? CAMERAS_PHOTO : CAMERAS_VIDEO).map((cam) => (
                  <button
                    key={cam}
                    type="button"
                    onClick={() => setBuilderState((p) => ({ ...p, camera: cam }))}
                    className={`p-2.5 text-left text-xs rounded transition-all border ${
                      builderState.camera === cam
                        ? 'bg-amber-50 dark:bg-stone-850 text-amber-900 dark:text-amber-300 border-amber-400/60 font-medium'
                        : 'bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <span className="font-medium block truncate">{cam.split(' (')[0]}</span>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {cam.includes('(') ? cam.split('(')[1].replace(')', '') : 'Digital'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Óptica & Apertura */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                  04. Lente / Distancia Focal
                </label>
                <select
                  value={builderState.lens}
                  onChange={(e) => setBuilderState((p) => ({ ...p, lens: e.target.value }))}
                  aria-label="Seleccionar lente o distancia focal"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500"
                >
                  {LENSES.map((l) => (
                    <option key={l.val} value={l.val}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                  Apertura / Profundidad de Campo
                </label>
                <select
                  value={builderState.aperture}
                  onChange={(e) => setBuilderState((p) => ({ ...p, aperture: e.target.value }))}
                  aria-label="Seleccionar apertura y profundidad de campo"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500"
                >
                  {APERTURES.map((a) => (
                    <option key={a.val} value={a.val}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. Movimiento de Cámara (solo si es modo Video) */}
            {builderState.mode === 'video' && (
              <div>
                <label className="block text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5 font-bold">
                  <Film className="w-3.5 h-3.5" />
                  <span>05. Movimiento Cinematográfico de Cámara</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOTIONS_VIDEO.map((m) => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setBuilderState((p) => ({ ...p, motion: m.val }))}
                      className={`p-2.5 text-left text-xs rounded transition-all border ${
                        builderState.motion === m.val
                          ? 'bg-amber-100/60 dark:bg-amber-400/10 text-amber-900 dark:text-amber-300 border-amber-500/50 font-medium'
                          : 'bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <span className="font-mono-code block font-semibold text-stone-900 dark:text-stone-200">
                        {m.label.split(' (')[0]}
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate mt-0.5">
                        {m.label.split('(')[1]?.replace(')', '') || m.val}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Iluminación */}
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                {builderState.mode === 'video' ? '06' : '05'}. Esquema de Iluminación
              </label>
              <select
                value={builderState.lighting}
                onChange={(e) => setBuilderState((p) => ({ ...p, lighting: e.target.value }))}
                aria-label="Seleccionar esquema de iluminación"
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500"
              >
                {LIGHTINGS.map((l) => (
                  <option key={l.val} value={l.val}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* 7. Paleta de Color & Film Look */}
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                {builderState.mode === 'video' ? '07' : '06'}. Colorimetría & Emulsión
              </label>
              <select
                value={builderState.colorPalette}
                onChange={(e) => setBuilderState((p) => ({ ...p, colorPalette: e.target.value }))}
                aria-label="Seleccionar colorimetría y emulsión fotográfica"
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500"
              >
                {COLOR_PALETTES.map((c) => (
                  <option key={c.val} value={c.val}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* 8. Formato / Aspect Ratio */}
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                {builderState.mode === 'video' ? '08' : '07'}. Relación de Aspecto
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.val}
                    type="button"
                    onClick={() => setBuilderState((p) => ({ ...p, aspectRatio: ar.val }))}
                    className={`py-2 text-center text-xs font-mono-code rounded transition-all border ${
                      builderState.aspectRatio === ar.val
                        ? 'bg-amber-400 text-stone-950 font-bold border-amber-400 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    {ar.val}
                  </button>
                ))}
              </div>
            </div>

            {/* 8B. Parámetros Avanzados de Dirección (Acción, Escenario, Plano, Ángulo, Temperatura, Atmósfera, Calidad) */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowAdvancedFields((prev) => !prev)}
                className="w-full py-2 px-3 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-mono-code text-stone-800 dark:text-stone-200 flex items-center justify-between hover:border-amber-500 transition-colors"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  <span>Parámetros Extendidos (Acción, Escenario, Plano, Ángulo, Temperatura, Atmósfera)</span>
                </span>
                <span className="text-amber-700 dark:text-amber-400">
                  {showAdvancedFields ? 'Ocultar' : 'Desplegar'}
                </span>
              </button>

              {showAdvancedFields && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                      Acción o Gesto del Sujeto
                    </label>
                    <input
                      type="text"
                      value={builderState.action || ''}
                      onChange={(e) => setBuilderState((p) => ({ ...p, action: e.target.value }))}
                      placeholder="Ej: moldeando arcilla, caminando bajo lluvia ligera"
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                      Escenario / Contexto Espacial
                    </label>
                    <input
                      type="text"
                      value={builderState.setting || ''}
                      onChange={(e) => setBuilderState((p) => ({ ...p, setting: e.target.value }))}
                      placeholder="Ej: taller de carpintería con ventanal norte, galería brutalista"
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                      Tipo de Plano / Encuadre
                    </label>
                    <select
                      value={builderState.shotSize || 'Plano Medio (MS)'}
                      onChange={(e) => setBuilderState((p) => ({ ...p, shotSize: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-stone-900 dark:text-stone-100"
                    >
                      {SHOT_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                      Ángulo de Cámara
                    </label>
                    <select
                      value={builderState.cameraAngle || 'Normal (Eye Level)'}
                      onChange={(e) => setBuilderState((p) => ({ ...p, cameraAngle: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-stone-900 dark:text-stone-100"
                    >
                      {CAMERA_ANGLES.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                      Temperatura de Color
                    </label>
                    <select
                      value={builderState.temperature || 'Neutra equilibrada (5500K)'}
                      onChange={(e) => setBuilderState((p) => ({ ...p, temperature: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-stone-900 dark:text-stone-100"
                    >
                      {TEMPERATURES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                      Atmósfera / Clima
                    </label>
                    <select
                      value={builderState.atmosphere || 'Aire limpio natural'}
                      onChange={(e) => setBuilderState((p) => ({ ...p, atmosphere: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-stone-900 dark:text-stone-100"
                    >
                      {ATMOSPHERES.map((at) => (
                        <option key={at} value={at}>{at}</option>
                      ))}
                    </select>
                  </div>
                  {builderState.mode === 'video' && (
                    <>
                      <div>
                        <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                          Cadencia / Velocidad (FPS)
                        </label>
                        <select
                          value={builderState.fps}
                          onChange={(e) => setBuilderState((p) => ({ ...p, fps: e.target.value }))}
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-stone-900 dark:text-stone-100"
                        >
                          <option value="24 fps">24 fps (Cine Estándar)</option>
                          <option value="12 fps (Stop Motion)">12 fps (Stop Motion Artesanal)</option>
                          <option value="60 fps (Fluido)">60 fps (Movimiento Fluido)</option>
                          <option value="120 fps (Slow Motion)">120 fps (Slow Motion)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                          Duración del Clip
                        </label>
                        <select
                          value={builderState.duration || '6–8 segundos'}
                          onChange={(e) => setBuilderState((p) => ({ ...p, duration: e.target.value }))}
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-stone-900 dark:text-stone-100"
                        >
                          <option value="4 segundos">4 segundos (Plano corto)</option>
                          <option value="6–8 segundos">6–8 segundos (Estándar)</option>
                          <option value="10 segundos continuos">10 segundos (Secuencia)</option>
                          <option value="Loop infinito continuo">Loop infinito sin corte</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 9. Instrucciones Negativas */}
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
                <span>Instrucciones Negativas (Qué evitar)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NEGATIVE_OPTIONS.map((neg) => {
                  const isChecked = builderState.negativeAvoid.includes(neg);
                  return (
                    <button
                      key={neg}
                      type="button"
                      onClick={() => toggleNegative(neg)}
                      className={`text-left px-3 py-2 rounded text-xs transition-colors border flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-50 dark:bg-stone-850 text-stone-900 dark:text-stone-200 border-amber-400/50 font-medium'
                          : 'bg-stone-50 dark:bg-stone-950 text-stone-500 border-stone-200 dark:border-stone-850 hover:text-stone-700'
                      }`}
                    >
                      <span className="truncate">{neg}</span>
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] shrink-0 ml-2 ${
                        isChecked ? 'bg-amber-400 text-stone-950 font-bold' : 'border border-stone-300 dark:border-stone-700'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Live Prompt Preview Output Box (5 Cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-5 flex flex-col shadow-lg">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-mono-code uppercase tracking-wider text-stone-800 dark:text-stone-200 font-semibold">
                    Prompt Maestro Generado
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-stone-500">
                  {currentPrompt.length} carácteres · {currentPrompt.split(/\s+/).filter(Boolean).length} palabras
                </span>
              </div>

              {/* 3 Output Modes Selector: Breve / Avanzado / Cinematográfico */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {(
                  [
                    { id: 'breve', label: 'Breve' },
                    { id: 'avanzado', label: 'Avanzado' },
                    { id: 'cinematografico', label: 'Cinematográfico' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setOutputMode(m.id)}
                    className={`py-1.5 text-[11px] font-mono-code uppercase rounded border transition-colors ${
                      outputMode === m.id
                        ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-stone-900 dark:border-amber-400 font-bold'
                        : 'bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Incompatible Parameter Detector */}
              {incompatibilities.length > 0 && (
                <div className="mb-3 p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-2">
                  {incompatibilities.map((w) => (
                    <div key={w.msg} className="flex items-start justify-between gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{w.msg}</span>
                      </div>
                      <button
                        type="button"
                        onClick={w.applyFix}
                        className="px-2 py-0.5 bg-amber-400 text-stone-950 font-semibold rounded shrink-0 hover:bg-amber-300"
                      >
                        {w.fixLabel}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formatted Code Box */}
              <div className="relative bg-stone-950 rounded p-4 border border-stone-800/90 font-mono-code text-xs text-stone-200 leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre-wrap select-all">
                {currentPrompt}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-stone-950" />
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
                    className="py-2.5 px-3 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 border border-stone-300 dark:border-stone-700 rounded transition-colors flex items-center gap-1"
                    title="Guardar prompt en favoritos"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Guardar</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleExportTxt}
                    className="py-2 px-2 text-[11px] font-mono-code font-semibold text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-950 hover:border-amber-500 border border-stone-200 dark:border-stone-800 rounded flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>.TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="py-2 px-2 text-[11px] font-mono-code font-semibold text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-950 hover:border-amber-500 border border-stone-200 dark:border-stone-800 rounded flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>.JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenExporter}
                    className="py-2 px-2 text-[11px] font-mono-code font-semibold text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-950 hover:border-amber-500 border border-stone-200 dark:border-stone-800 rounded flex items-center justify-center gap-1"
                    title="Exportar ficha técnica PDF o tarjeta PNG para talleres"
                  >
                    <FileDown className="w-3.5 h-3.5 text-amber-600" />
                    <span>PDF / PNG</span>
                  </button>
                </div>
              </div>

              {/* Project Collections & Saved Experimentation History */}
              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono-code uppercase text-stone-500 font-semibold">
                    Colección / Historial ({savedPrompts.filter((sp) => (sp.projectName || 'Proyecto General') === activeProject).length})
                  </span>
                  <select
                    value={activeProject}
                    onChange={(e) => setActiveProject(e.target.value)}
                    aria-label="Seleccionar colección o proyecto"
                    className="text-[11px] bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-2 py-1 text-stone-800 dark:text-stone-200"
                  >
                    {projects.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newProjectInput}
                    onChange={(e) => setNewProjectInput(e.target.value)}
                    placeholder="Nueva colección / proyecto..."
                    className="flex-1 text-[11px] bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-2 py-1 text-stone-800 dark:text-stone-200"
                  />
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-2.5 py-1 text-[11px] font-mono-code font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-amber-400 hover:text-stone-950 rounded transition-colors"
                  >
                    + Crear
                  </button>
                </div>

                {savedPrompts.length > 0 && (
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {savedPrompts
                      .filter((sp) => (sp.projectName || 'Proyecto General') === activeProject)
                      .map((sp) => (
                        <div
                          key={sp.id}
                          className="flex items-center justify-between gap-2 text-xs px-2.5 py-1.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800"
                        >
                          <button
                            type="button"
                            onClick={() => setBuilderState(sp.state)}
                            className="text-left truncate font-medium text-stone-800 dark:text-stone-200 hover:text-amber-600 flex-1"
                          >
                            {sp.title}
                            {sp.createdAt && (
                              <span className="ml-1.5 text-[10px] font-mono-code text-stone-400">
                                ({sp.createdAt})
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSavedPrompts((prev) => prev.filter((item) => item.id !== sp.id))
                            }
                            className="text-[10px] font-mono-code text-stone-400 hover:text-rose-500"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Usage hint */}
              <div className="mt-3 text-[11px] text-stone-500 leading-normal flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Pega directamente este prompt en <strong>ChatGPT</strong> (con o sin fotografía adjunta), <strong>Midjourney v6</strong>, <strong>Flux.1</strong>, o en <strong>Runway Gen-3 / Kling</strong> para secuencias en movimiento.
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
