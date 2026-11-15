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
  Sliders,
  ExternalLink
} from 'lucide-react';
import { RECIPES } from '../data/promptData';

export interface PromptBuilderState {
  mode: 'photo' | 'video';
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
}

export interface SavedFavoritePrompt {
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
  const [builderDensity, setBuilderDensity] = useState<'all12' | 'essential'>('all12');
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

  const COMPOSITIONS = [
    'Regla de tercios equilibrada',
    'Simetría central arquitectónica',
    'Espacio negativo editorial',
    'Líneas guía en perspectiva',
    'Encuadre dentro del encuadre',
    'Diagonales dinámicas',
    'Flat-lay cenital 90°',
  ];

  const VISUAL_STYLE_PRESETS = [
    'Editorial Contemporáneo',
    'Neo Noir',
    'Minimalismo Escultórico',
    'Documental Analógico 35mm',
    'Lujo Publicitario',
    'Collage Experimental',
    'Cine de Ciencia Ficción Orgánico',
  ];

  const TEXTURE_PRESETS = [
    'natural texture, visible pores',
    'grano fino orgánico Kodak 35mm, sin suavizado plástico',
    'superficie mineral mate con pátina táctil real',
    'tejido natural con fibras visibles y desgaste sutil',
    'reflejo especular limpio en vidrio y metal cepillado',
  ];

  const QUALITY_PRESETS = [
    'RAW editorial authenticity, natural microtextures',
    'acabado cinematográfico sin sobreenfoque digital',
    'rango dinámico amplio con transición suave en luces altas',
    'fidelidad óptica real de estudio sin HDR artificial',
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
    const compStr = builderState.composition || 'Regla de tercios equilibrada';
    const shotStr = builderState.shotSize || 'Plano Medio (MS)';
    const angleStr = builderState.cameraAngle || 'Normal (Eye Level)';
    const tempStr = builderState.temperature || 'Neutra equilibrada (5500K)';
    const atmosStr = builderState.atmosphere || 'Aire limpio natural';
    const qualityStr = builderState.quality || 'RAW editorial authenticity, natural microtextures';

    if (outputMode === 'breve') {
      return isVid
        ? `${baseSubject}${actionStr}${settingStr}. ${compStr}, ${shotStr}, ${angleStr}, ${builderState.motion}, aesthetic reference ${builderState.camera}, ${builderState.lens}, ${builderState.lighting}, ${builderState.colorPalette}, ${atmosStr}, ${builderState.fps}, aspect ratio ${builderState.aspectRatio}. Avoid: ${builderState.negativeAvoid.join(', ')}.`
        : `${baseSubject}${actionStr}${settingStr}. ${compStr}, ${shotStr}, ${angleStr}, ${builderState.genre}, ${builderState.visualStyle}, aesthetic reference ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}, ${builderState.lighting}, ${builderState.colorPalette}, ${qualityStr}, aspect ratio ${builderState.aspectRatio}. Avoid: ${builderState.negativeAvoid.join(', ')}.`;
    }

    if (outputMode === 'cinematografico') {
      return isVid
        ? `CINEMATOGRAPHY MASTER SCRIPT — NÚCLEO COLECTIVO
[01] SUJETO Y ACCIÓN: ${baseSubject}${actionStr}.
[02] ESCENARIO Y CONTEXTO: ${builderState.setting || 'Espacio arquitectónico coherente con profundidad tonal'}.
[03] COMPOSICIÓN Y PLANO: ${compStr} · ${shotStr} · Ángulo ${angleStr}.
[04] CÁMARA Y ÓPTICA: Referencia ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.
[05] MOVIMIENTO Y TEMPORALIDAD: ${builderState.motion} · Cadencia ${builderState.fps} · Duración ${builderState.duration || '6–8 segundos continuos'}.
[06] ILUMINACIÓN: ${builderState.lighting}.
[07] COLOR Y TEMPERATURA: ${builderState.colorPalette} · ${tempStr}.
[08] GÉNERO Y ESTILO: ${builderState.genre} · ${builderState.visualStyle}.
[09] TEXTURA Y CALIDAD: ${builderState.texture}, ${qualityStr}.
[10] ATMÓSFERA Y FORMATO: ${atmosStr} · Aspect ratio ${builderState.aspectRatio}.
[11] CONTINUIDAD Y NEGATIVAS: Mantener identidad, geometría y luz estable. Avoid: ${builderState.negativeAvoid.join(', ')}.`
        : `ART DIRECTION MASTER SHEET — NÚCLEO COLECTIVO
[01] SUJETO: ${baseSubject}.
[02] ACCIÓN: ${builderState.action || 'Presencia serena y postura natural'}.
[03] ESCENARIO: ${builderState.setting || 'Entorno editorial coherente con luz natural'}.
[04] COMPOSICIÓN Y ENCUADRE: ${compStr} · ${shotStr} · ${angleStr}.
[05] CÁMARA Y ÓPTICA (REFERENCIA): ${builderState.camera}, ${builderState.lens}, ${builderState.aperture}.
[06] ILUMINACIÓN: ${builderState.lighting}.
[07] COLOR Y TEMPERATURA: ${builderState.colorPalette} · ${tempStr}.
[08] GÉNERO Y ESTILO: ${builderState.genre} · ${builderState.visualStyle}.
[09] TEXTURA Y CALIDAD: ${builderState.texture}, ${qualityStr}.
[10] ATMÓSFERA: ${atmosStr}.
[11] FORMATO: Aspect ratio ${builderState.aspectRatio}.
[12] NEGATIVAS: Avoid: ${builderState.negativeAvoid.join(', ')}.`;
    }

    if (isVid) {
      return `MASTER VIDEO PROMPT — 12 MÓDULOS DE DIRECCIÓN
01. SUJETO: ${baseSubject}.
02. ACCIÓN: ${builderState.action || 'Movimiento contenido y natural acorde a la escena'}.
03. ESCENARIO: ${builderState.setting || 'Espacio arquitectónico o natural con profundidad real'}.
04. COMPOSICIÓN Y ENCUADRE: ${compStr}, ${shotStr}, ${angleStr}.
05. CÁMARA Y ÓPTICA (REFERENCIA): Shot on ${builderState.camera || 'ARRI Alexa 35'}, ${builderState.lens || 'Cooke 40mm anamorphic prime lens'}, ${builderState.aperture || 'T2.3 cinematic aperture'}.
06. ILUMINACIÓN: ${builderState.lighting || 'Volumetric light shafts cutting through soft atmospheric haze'}.
07. COLOR Y TEMPERATURA: ${builderState.colorPalette || 'Kodak 2383 print film look'}, ${tempStr}.
08. GÉNERO Y ESTILO: ${builderState.genre || '/cinematicvideo'}, ${builderState.visualStyle || 'Contemporary cinematic editorial'}.
09. TEXTURA Y CALIDAD: ${builderState.texture}, ${qualityStr}.
10. ATMÓSFERA: ${atmosStr}.
11. FORMATO: Aspect ratio ${builderState.aspectRatio || '16:9'}.
12. MOVIMIENTO Y NEGATIVAS: ${builderState.motion || 'Smooth continuous orbit shot'} (${builderState.fps}, ${builderState.duration || '6-8s'}). Avoid: ${builderState.negativeAvoid.length > 0 ? builderState.negativeAvoid.join(', ') : 'plastic textures, morphing, jitter, warping, text, logos'}.`;
    }

    return `MASTER PHOTO PROMPT — 12 MÓDULOS DE DIRECCIÓN
01. SUJETO: ${baseSubject}.
02. ACCIÓN: ${builderState.action || 'Presencia serena con gesto auténtico'}.
03. ESCENARIO: ${builderState.setting || 'Entorno coherente con luz direccional real'}.
04. COMPOSICIÓN Y ENCUADRE: ${compStr}, ${shotStr}, ${angleStr}.
05. CÁMARA Y ÓPTICA (REFERENCIA): Aesthetic reference ${builderState.camera || 'Hasselblad X2D'}, ${builderState.lens || '85mm portrait prime lens'}, ${builderState.aperture || 'f/2.8 aperture'}.
06. ILUMINACIÓN: ${builderState.lighting || 'Rembrandt lighting, directional light with cheek triangle'}.
07. COLOR Y TEMPERATURA: ${builderState.colorPalette || 'Teal and orange cinematic grading'}, ${tempStr}.
08. GÉNERO Y ESTILO: ${builderState.genre || '/editorial'}, ${builderState.visualStyle || 'Editorial Contemporáneo'}.
09. TEXTURA Y CALIDAD: ${builderState.texture}, ${qualityStr}.
10. ATMÓSFERA: ${atmosStr}.
11. FORMATO: Aspect ratio ${builderState.aspectRatio || '4:5'}.
12. NEGATIVAS: Avoid: ${builderState.negativeAvoid.length > 0 ? builderState.negativeAvoid.join(', ') : 'plastic skin, artificial lighting, oversaturation, fake bokeh, distorted anatomy, text, watermarks'}.`;
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

  const handleEnrichWithGemini = () => {
    if (!builderState.subject.trim()) {
      setEnrichError('Escribe primero una idea básica en el campo de sujeto (ej: "un reloj de titanio", "un artesano en su taller").');
      return;
    }

    setEnrichError(null);
    setIsEnriching(true);

    const rawSubject = builderState.subject.trim();
    const lower = rawSubject.toLowerCase();
    const isVideo = builderState.mode === 'video';
    const isPortrait = /(persona|mujer|hombre|retrato|artesano|artista|joven|rostro|manos)/.test(lower);
    const isObject = /(reloj|frasco|perfume|cerámica|producto|botella|objeto|escultura)/.test(lower);
    const isSpace = /(calle|barrio|arquitectura|taller|galería|paisaje|bosque|montaña|ciudad)/.test(lower);

    const enrichedDescription = isVideo
      ? `${rawSubject}, capturado con continuidad física creíble en ${builderState.visualStyle || 'lenguaje cinematográfico contemporáneo'}, resaltando interacción real entre luz, atmósfera y movimiento sutil del entorno.`
      : isPortrait
      ? `${rawSubject}, con expresión genuina, postura relajada, piel natural con textura real sin suavizado artificial y presencia física equilibrada dentro de una composición ${builderState.visualStyle || 'editorial contemporánea'}.`
      : isObject
      ? `${rawSubject}, fotografiado destacando peso físico, reflejos controlados en los materiales, imperfecciones táctiles auténticas y separación limpia respecto al fondo.`
      : isSpace
      ? `${rawSubject}, con profundidad espacial en planos claro-oscuros, materiales arquitectónicos con pátina real y atmósfera envolvente sin saturación exagerada.`
      : `${rawSubject}, desarrollado bajo dirección de arte ${builderState.visualStyle || 'editorial'} con atención precisa a materiales, luz direccional y encuadre equilibrado.`;

    const visualCues = isPortrait
      ? ['poros y textura real de piel', 'brillo natural en ojos (catchlight)', 'tejido orgánico en vestuario', 'caída suave de sombras']
      : isObject
      ? ['reflejo especular controlado', 'microtextura mineral/metálica', 'transición nítida de bordes', 'grano fino fotográfico']
      : ['atmósfera con profundidad tonal', 'textura arquitectónica táctil', 'equilibrio de luces altas', 'colorimetría orgánica'];

    const lightingAdvice = isVideo
      ? 'Luz direccional lateral estable con partículas suaves en contraluz para dar relieve al movimiento de cámara.'
      : isPortrait
      ? 'Luz natural lateral de ventana o esquema Rembrandt suave a 45° para esculpir volumen sin endurecer sombras.'
      : 'Luz principal rasante que revele relieve del material + rebote sutil en sombras.';

    setGeminiSuggestion({
      enrichedDescription,
      visualCues,
      lightingAdvice,
    });
    setIsEnriching(false);
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
      action: '',
      setting: '',
      composition: 'Regla de tercios equilibrada',
      genre: r.commands[0] || (isVideoRecipe ? '/cinematicvideo' : '/editorial'),
      camera: r.specs.camera,
      lens: r.specs.lens,
      aperture: isVideoRecipe ? 'T2.3 cinematic aperture' : 'f/1.8 creamy bokeh',
      shotSize: 'Plano Medio (MS)',
      cameraAngle: 'Normal (Eye Level)',
      lighting: r.specs.lighting,
      colorPalette: r.specs.color,
      temperature: 'Neutra equilibrada (5500K)',
      atmosphere: 'Aire limpio natural',
      visualStyle: r.title,
      motion: r.specs.motion || 'Continuous smooth 360-degree orbit shot',
      fps: '24 fps',
      duration: '6–8 segundos',
      aspectRatio: r.specs.aspectRatio.includes('16:9') ? '16:9' : r.specs.aspectRatio.includes('4:5') ? '4:5' : '3:2',
      texture: 'organic film grain, realistic physics',
      quality: 'RAW editorial authenticity, natural microtextures',
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
    <section id="builder" className="py-14 border-b border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7545D6] dark:text-[#F8C300] font-mono-code font-bold mb-2">
              <span>LABORATORIO DE COMPOSICIÓN</span>
              <span aria-hidden="true" className="text-[#9E9B93]">·</span>
              <span>12 MÓDULOS PROGRESIVOS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              Constructor Maestro de Prompts
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] mt-1 max-w-2xl">
              Estructura tu escena paso a paso en 12 módulos —desde sujeto, acción y composición hasta cámara, luz, atmósfera y control negativo— y cópiala lista para usar en tus herramientas de IA.
            </p>
          </div>

          {/* Quick Presets & Export Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenExporter}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#101014] dark:text-[#F4F2ED] bg-white dark:bg-[#16161C] hover:border-[#326BFF] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg transition-colors flex items-center gap-1.5"
              title="Exportar ficha técnica para talleres en PDF o PNG"
            >
              <FileDown className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
              <span>Exportar Ficha Taller</span>
            </button>

            <select
              onChange={(e) => handleLoadRecipe(e.target.value)}
              defaultValue=""
              aria-label="Cargar receta predefinida en el constructor"
              className="text-xs bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] text-[#101014] dark:text-[#F4F2ED] px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#F8C300] font-medium"
            >
              <option value="" disabled>Cargar Receta...</option>
              {RECIPES.map((r) => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-[#4A4A55] hover:text-[#101014] dark:text-[#B4B2AC] dark:hover:text-[#F4F2ED] bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-lg transition-colors"
              title="Restablecer los 12 módulos"
              aria-label="Restablecer los 12 módulos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector & Progressive View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-7">
          <div className="inline-flex p-1 bg-white dark:bg-[#16161C] rounded-xl border border-[#DEDAD0] dark:border-[#26262E]">
            <button
              type="button"
              onClick={() => setBuilderState((p) => ({ ...p, mode: 'photo' }))}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
                builderState.mode === 'photo'
                  ? 'bg-[#F8C300] text-[#101014] font-bold'
                  : 'text-[#4A4A55] dark:text-[#B4B2AC] hover:text-[#101014] dark:hover:text-[#F4F2ED]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Fotografía & Arte Visual</span>
            </button>

            <button
              type="button"
              onClick={() => setBuilderState((p) => ({ ...p, mode: 'video' }))}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
                builderState.mode === 'video'
                  ? 'bg-[#F8C300] text-[#101014] font-bold'
                  : 'text-[#4A4A55] dark:text-[#B4B2AC] hover:text-[#101014] dark:hover:text-[#F4F2ED]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video & Cinematografía</span>
            </button>
          </div>

          <div className="inline-flex p-1 bg-white dark:bg-[#16161C] rounded-xl border border-[#DEDAD0] dark:border-[#26262E]">
            <button
              type="button"
              onClick={() => setBuilderDensity('all12')}
              className={`px-3 py-1.5 text-[11px] font-mono-code font-semibold rounded-lg transition-colors ${
                builderDensity === 'all12'
                  ? 'bg-[#101014] text-[#F4F2ED] dark:bg-[#7545D6] dark:text-white'
                  : 'text-[#4A4A55] dark:text-[#B4B2AC]'
              }`}
            >
              12 Módulos Completos
            </button>
            <button
              type="button"
              onClick={() => setBuilderDensity('essential')}
              className={`px-3 py-1.5 text-[11px] font-mono-code font-semibold rounded-lg transition-colors ${
                builderDensity === 'essential'
                  ? 'bg-[#101014] text-[#F4F2ED] dark:bg-[#7545D6] dark:text-white'
                  : 'text-[#4A4A55] dark:text-[#B4B2AC]'
              }`}
            >
              Modo Rápido (6 Clave)
            </button>
          </div>
        </div>

        {/* Builder Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 Cols) — 12 Progressive Modules */}
          <div className="lg:col-span-7 space-y-5 bg-white dark:bg-[#16161C] p-5 sm:p-6 rounded-2xl border border-[#DEDAD0] dark:border-[#26262E]">
            
            {/* MÓDULO 01. Sujeto o Escena Principal + Local Enricher */}
            <div className="pb-5 border-b border-[#EFECE4] dark:border-[#26262E]">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
                  01. Sujeto o Escena Principal
                </label>

                <button
                  type="button"
                  onClick={handleEnrichWithGemini}
                  disabled={isEnriching}
                  className="px-2.5 py-1 text-[11px] font-mono-code text-[#101014] bg-[#F8C300]/25 hover:bg-[#F8C300]/45 dark:text-[#F8C300] dark:bg-[#F8C300]/15 border border-[#F8C300]/60 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 font-semibold"
                  title="Ampliar tu idea básica con texturas, luz y dirección de arte"
                >
                  {isEnriching ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Ampliando...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3" />
                      <span>Enriquecer Escena</span>
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
                    : "Ej: Retrato de una ceramista en su taller / Frasco de vidrio sobre piedra volcánica"
                }
                className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#326BFF] placeholder:text-[#787670] transition-colors"
              />

              {enrichError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">
                  {enrichError}
                </p>
              )}

              {geminiSuggestion && (
                <div className="mt-3 p-4 bg-[#F4F2ED] dark:bg-[#101014] border border-[#F8C300]/60 rounded-xl text-[#101014] dark:text-[#F4F2ED]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Propuesta de Dirección de Arte</span>
                    </span>
                    <button
                      type="button"
                      onClick={applyGeminiSuggestion}
                      className="px-3 py-1 text-xs font-bold text-[#101014] bg-[#F8C300] hover:bg-[#e5b400] rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Aplicar al Prompt</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed mb-2">
                    {geminiSuggestion.enrichedDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                    <span className="font-semibold text-[#7545D6] dark:text-[#F8C300]">Claves:</span>
                    <span>{geminiSuggestion.visualCues.join(' · ')}</span>
                    <span>· {geminiSuggestion.lightingAdvice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* MÓDULO 02 & MÓDULO 03: Acción y Escenario */}
            {builderDensity === 'all12' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-[#EFECE4] dark:border-[#26262E]">
                <div>
                  <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold mb-1.5">
                    02. Acción o Gesto
                  </label>
                  <input
                    type="text"
                    value={builderState.action || ''}
                    onChange={(e) => setBuilderState((p) => ({ ...p, action: e.target.value }))}
                    placeholder="Ej: moldeando arcilla, mirando hacia la ventana"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-xl px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED] placeholder:text-[#787670] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold mb-1.5">
                    03. Escenario y Contexto
                  </label>
                  <input
                    type="text"
                    value={builderState.setting || ''}
                    onChange={(e) => setBuilderState((p) => ({ ...p, setting: e.target.value }))}
                    placeholder="Ej: taller brutalista con ventanal norte"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-xl px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED] placeholder:text-[#787670] focus:outline-none focus:border-[#326BFF]"
                  />
                </div>
              </div>
            )}

            {/* MÓDULO 04: Composición, Plano y Ángulo */}
            <div className="pb-5 border-b border-[#EFECE4] dark:border-[#26262E] space-y-3">
              <label className="block text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold">
                04. Composición, Plano y Ángulo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                    Regla compositiva
                  </span>
                  <select
                    value={builderState.composition || COMPOSITIONS[0]}
                    onChange={(e) => setBuilderState((p) => ({ ...p, composition: e.target.value }))}
                    aria-label="Seleccionar regla de composición"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#326BFF]"
                  >
                    {builderState.composition && !COMPOSITIONS.includes(builderState.composition) && (
                      <option value={builderState.composition}>{builderState.composition}</option>
                    )}
                    {COMPOSITIONS.map((comp) => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                    Tipo de plano
                  </span>
                  <select
                    value={builderState.shotSize || 'Plano Medio (MS)'}
                    onChange={(e) => setBuilderState((p) => ({ ...p, shotSize: e.target.value }))}
                    aria-label="Seleccionar tipo de plano"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#326BFF]"
                  >
                    {SHOT_SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                    Ángulo de cámara
                  </span>
                  <select
                    value={builderState.cameraAngle || 'Normal (Eye Level)'}
                    onChange={(e) => setBuilderState((p) => ({ ...p, cameraAngle: e.target.value }))}
                    aria-label="Seleccionar ángulo de cámara"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#326BFF]"
                  >
                    {CAMERA_ANGLES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* MÓDULO 05: Cámara de Referencia, Lente y Apertura */}
            <div className="pb-5 border-b border-[#EFECE4] dark:border-[#26262E] space-y-3">
              <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold">
                05. Cámara de Referencia, Lente y Apertura
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(builderState.mode === 'photo' ? CAMERAS_PHOTO : CAMERAS_VIDEO).map((cam) => (
                  <button
                    key={cam}
                    type="button"
                    onClick={() => setBuilderState((p) => ({ ...p, camera: cam }))}
                    className={`p-2.5 text-left text-xs rounded-xl transition-all border ${
                      builderState.camera === cam
                        ? 'bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300] border-[#F8C300] font-semibold'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF]'
                    }`}
                  >
                    <span className="font-semibold block truncate">{cam.split(' (')[0]}</span>
                    <span className="text-[10px] text-[#6B6B76] dark:text-[#A09E97] block truncate">
                      {cam.includes('(') ? cam.split('(')[1].replace(')', '') : 'Referencia estética'}
                    </span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                    Lente / Distancia focal
                  </span>
                  <select
                    value={builderState.lens}
                    onChange={(e) => setBuilderState((p) => ({ ...p, lens: e.target.value }))}
                    aria-label="Seleccionar lente o distancia focal"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#326BFF]"
                  >
                    {builderState.lens && !LENSES.some((l) => l.val === builderState.lens) && (
                      <option value={builderState.lens}>{builderState.lens}</option>
                    )}
                    {LENSES.map((l) => (
                      <option key={l.val} value={l.val}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                    Apertura / Profundidad de campo
                  </span>
                  <select
                    value={builderState.aperture}
                    onChange={(e) => setBuilderState((p) => ({ ...p, aperture: e.target.value }))}
                    aria-label="Seleccionar apertura y profundidad de campo"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#326BFF]"
                  >
                    {builderState.aperture && !APERTURES.some((a) => a.val === builderState.aperture) && (
                      <option value={builderState.aperture}>{builderState.aperture}</option>
                    )}
                    {APERTURES.map((a) => (
                      <option key={a.val} value={a.val}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* MÓDULO 06: Iluminación */}
            <div className="pb-5 border-b border-[#EFECE4] dark:border-[#26262E]">
              <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold mb-2">
                06. Esquema de Iluminación
              </label>
              <select
                value={builderState.lighting}
                onChange={(e) => setBuilderState((p) => ({ ...p, lighting: e.target.value }))}
                aria-label="Seleccionar esquema de iluminación"
                className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#326BFF]"
              >
                {builderState.lighting && !LIGHTINGS.some((l) => l.val === builderState.lighting) && (
                  <option value={builderState.lighting}>{builderState.lighting}</option>
                )}
                {LIGHTINGS.map((l) => (
                  <option key={l.val} value={l.val}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* MÓDULO 07: Color y Temperatura */}
            {builderDensity === 'all12' && (
              <div className="pb-5 border-b border-[#EFECE4] dark:border-[#26262E] space-y-3">
                <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold">
                  07. Colorimetría y Temperatura
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                      Paleta / Emulsión de color
                    </span>
                    <select
                      value={builderState.colorPalette}
                      onChange={(e) => setBuilderState((p) => ({ ...p, colorPalette: e.target.value }))}
                      aria-label="Seleccionar colorimetría y emulsión fotográfica"
                      className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#326BFF]"
                    >
                      {builderState.colorPalette && !COLOR_PALETTES.some((c) => c.val === builderState.colorPalette) && (
                        <option value={builderState.colorPalette}>{builderState.colorPalette}</option>
                      )}
                      {COLOR_PALETTES.map((c) => (
                        <option key={c.val} value={c.val}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                      Temperatura Kelvin
                    </span>
                    <select
                      value={builderState.temperature || 'Neutra equilibrada (5500K)'}
                      onChange={(e) => setBuilderState((p) => ({ ...p, temperature: e.target.value }))}
                      aria-label="Seleccionar temperatura de color"
                      className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] text-[#101014] dark:text-[#F4F2ED] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#326BFF]"
                    >
                      {TEMPERATURES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* MÓDULO 08: Género y Estilo Visual */}
            {builderDensity === 'all12' && (
              <div className="pb-5 border-b border-[#EFECE4] dark:border-[#26262E] space-y-3">
                <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold">
                  08. Género y Estilo Visual
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(builderState.mode === 'photo' ? GENRES_PHOTO : GENRES_VIDEO).map((item) => (
                    <button
                      key={item.cmd}
                      type="button"
                      onClick={() => setBuilderState((p) => ({ ...p, genre: item.cmd }))}
                      className={`px-2.5 py-1.5 text-xs font-mono-code rounded-lg transition-all border ${
                        builderState.genre === item.cmd
                          ? 'bg-[#7545D6]/15 text-[#7545D6] dark:bg-[#F8C300]/20 dark:text-[#F8C300] border-[#7545D6]/50 dark:border-[#F8C300] font-bold'
                          : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF]'
                      }`}
                    >
                      {item.cmd} <span className="font-sans font-normal opacity-80">({item.label})</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                      Dirección de arte / Estilo
                    </span>
                    <input
                      type="text"
                      value={builderState.visualStyle}
                      onChange={(e) => setBuilderState((p) => ({ ...p, visualStyle: e.target.value }))}
                      placeholder="Ej: Editorial Contemporáneo, Neo Noir"
                      className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-xl px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED]"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                      Atajos de estilo
                    </span>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) setBuilderState((p) => ({ ...p, visualStyle: e.target.value }));
                      }}
                      aria-label="Elegir estilo visual rápido"
                      className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-xl px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED]"
                    >
                      <option value="">Elegir preset de estilo...</option>
                      {VISUAL_STYLE_PRESETS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* MÓDULO 09 & 10: Textura, Calidad y Atmósfera */}
            {builderDensity === 'all12' && (
              <div className="pb-5 border-b border-[#EFECE4] dark:border-[#26262E] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold">
                    09. Textura y Calidad
                  </label>
                  <select
                    value={builderState.texture}
                    onChange={(e) => setBuilderState((p) => ({ ...p, texture: e.target.value }))}
                    aria-label="Seleccionar textura superficial"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-xl px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED]"
                  >
                    {builderState.texture && !TEXTURE_PRESETS.includes(builderState.texture) && (
                      <option value={builderState.texture}>{builderState.texture}</option>
                    )}
                    {TEXTURE_PRESETS.map((tx) => (
                      <option key={tx} value={tx}>{tx}</option>
                    ))}
                  </select>
                  <select
                    value={builderState.quality || QUALITY_PRESETS[0]}
                    onChange={(e) => setBuilderState((p) => ({ ...p, quality: e.target.value }))}
                    aria-label="Seleccionar nivel de acabado"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-xl px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED]"
                  >
                    {builderState.quality && !QUALITY_PRESETS.includes(builderState.quality) && (
                      <option value={builderState.quality}>{builderState.quality}</option>
                    )}
                    {QUALITY_PRESETS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold">
                    10. Atmósfera y Clima
                  </label>
                  <select
                    value={builderState.atmosphere || 'Aire limpio natural'}
                    onChange={(e) => setBuilderState((p) => ({ ...p, atmosphere: e.target.value }))}
                    aria-label="Seleccionar atmósfera ambiental"
                    className="w-full bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-xl px-3 py-2 text-xs text-[#101014] dark:text-[#F4F2ED]"
                  >
                    {builderState.atmosphere && !ATMOSPHERES.includes(builderState.atmosphere) && (
                      <option value={builderState.atmosphere}>{builderState.atmosphere}</option>
                    )}
                    {ATMOSPHERES.map((at) => (
                      <option key={at} value={at}>{at}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#5B5B66] dark:text-[#A09E97]">
                    Define densidad del aire, bruma, partículas en contraluz o clima exterior.
                  </p>
                </div>
              </div>
            )}

            {/* MÓDULO 11: Relación de Aspecto */}
            <div className="pb-5 border-b border-[#EFECE4] dark:border-[#26262E]">
              <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4A4A55] dark:text-[#B4B2AC] font-bold mb-2">
                11. Relación de Aspecto y Formato
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.val}
                    type="button"
                    onClick={() => setBuilderState((p) => ({ ...p, aspectRatio: ar.val }))}
                    className={`py-2 text-center text-xs font-mono-code rounded-xl transition-all border ${
                      builderState.aspectRatio === ar.val
                        ? 'bg-[#F8C300] text-[#101014] font-bold border-[#F8C300]'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF]'
                    }`}
                  >
                    {ar.val}
                  </button>
                ))}
              </div>
            </div>

            {/* MÓDULO 12: Movimiento / Video e Instrucciones Negativas */}
            <div className="space-y-4">
              <label className="block text-xs font-mono-code uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300] font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>
                  12. {builderState.mode === 'video' ? 'Movimiento de Cámara, FPS e Instrucciones Negativas' : 'Control Negativo (Qué evitar en la imagen)'}
                </span>
              </label>

              {builderState.mode === 'video' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                    <Film className="w-3.5 h-3.5" />
                    <span>Trayectoria de cámara</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MOTIONS_VIDEO.map((m) => (
                      <button
                        key={m.val}
                        type="button"
                        onClick={() => setBuilderState((p) => ({ ...p, motion: m.val }))}
                        className={`p-2 text-left text-xs rounded-lg transition-all border ${
                          builderState.motion === m.val
                            ? 'bg-[#F8C300]/20 text-[#101014] dark:text-[#F8C300] border-[#F8C300] font-semibold'
                            : 'bg-white dark:bg-[#16161C] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#2C2C36]'
                        }`}
                      >
                        <span className="font-mono-code block font-semibold">
                          {m.label.split(' (')[0]}
                        </span>
                        <span className="text-[11px] opacity-80 block truncate">
                          {m.label.split('(')[1]?.replace(')', '') || m.val}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                        Cadencia (FPS)
                      </span>
                      <select
                        value={builderState.fps}
                        onChange={(e) => setBuilderState((p) => ({ ...p, fps: e.target.value }))}
                        className="w-full bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-lg px-3 py-1.5 text-xs text-[#101014] dark:text-[#F4F2ED]"
                      >
                        <option value="24 fps">24 fps (Cine Estándar)</option>
                        <option value="12 fps (Stop Motion)">12 fps (Stop Motion Artesanal)</option>
                        <option value="60 fps (Fluido)">60 fps (Movimiento Fluido)</option>
                        <option value="120 fps (Slow Motion)">120 fps (Slow Motion)</option>
                      </select>
                    </div>
                    <div>
                      <span className="block text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97] mb-1">
                        Duración del clip
                      </span>
                      <select
                        value={builderState.duration || '6–8 segundos'}
                        onChange={(e) => setBuilderState((p) => ({ ...p, duration: e.target.value }))}
                        className="w-full bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#2C2C36] rounded-lg px-3 py-1.5 text-xs text-[#101014] dark:text-[#F4F2ED]"
                      >
                        <option value="4 segundos">4 segundos (Plano corto)</option>
                        <option value="6–8 segundos">6–8 segundos (Estándar)</option>
                        <option value="10 segundos continuos">10 segundos (Secuencia)</option>
                        <option value="Loop infinito continuo">Loop infinito sin corte</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NEGATIVE_OPTIONS.map((neg) => {
                  const isChecked = builderState.negativeAvoid.includes(neg);
                  return (
                    <button
                      key={neg}
                      type="button"
                      onClick={() => toggleNegative(neg)}
                      className={`text-left px-3 py-2 rounded-xl text-xs transition-colors border flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#F8C300]/15 text-[#101014] dark:text-[#F4F2ED] border-[#F8C300]/70 font-medium'
                          : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#5B5B66] dark:text-[#A09E97] border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#326BFF]'
                      }`}
                    >
                      <span className="truncate">{neg}</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0 ml-2 ${
                        isChecked ? 'bg-[#F8C300] text-[#101014] font-bold' : 'border border-[#C9C4B8] dark:border-[#3A3A46]'
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
            <div className="bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] rounded-2xl p-5 flex flex-col shadow-lg">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#EFECE4] dark:border-[#26262E] mb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                  <span className="text-xs font-mono-code uppercase tracking-wider text-[#101014] dark:text-[#F4F2ED] font-bold">
                    Prompt Maestro · 12 Módulos
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
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

              {/* Rapid Single-Variable Variations Bar */}
              <div className="mb-3 p-2.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1.5">
                <div className="text-[10px] font-mono-code uppercase font-bold text-stone-500">
                  Variaciones rápidas (cambia 1 parámetro sin rehacer todo):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setBuilderState((p) => ({
                        ...p,
                        lens: p.lens.includes('85mm')
                          ? '24mm wide angle lens'
                          : p.lens.includes('24mm')
                          ? '35mm prime lens'
                          : '85mm portrait prime lens',
                      }))
                    }
                    className="px-2 py-1 text-[10px] font-mono-code rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-stone-700 dark:text-stone-300"
                  >
                    Variar Lente
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBuilderState((p) => ({
                        ...p,
                        lighting: p.lighting.includes('Rembrandt')
                          ? 'Soft natural window light during golden hour'
                          : p.lighting.includes('window')
                          ? 'Chiaroscuro, dramatic contrast between light and deep shadow'
                          : 'Rembrandt lighting, directional light with cheek triangle',
                      }))
                    }
                    className="px-2 py-1 text-[10px] font-mono-code rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-stone-700 dark:text-stone-300"
                  >
                    Variar Luz
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
                            ? '9:16'
                            : '4:5',
                      }))
                    }
                    className="px-2 py-1 text-[10px] font-mono-code rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-stone-700 dark:text-stone-300"
                  >
                    Rotar Formato ({builderState.aspectRatio})
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBuilderState((p) => ({
                        ...p,
                        temperature: p.temperature?.includes('Cálida')
                          ? 'Fría nocturna / Hora azul (7200K)'
                          : 'Cálida dorada (3200K–4200K)',
                      }))
                    }
                    className="px-2 py-1 text-[10px] font-mono-code rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-stone-700 dark:text-stone-300"
                  >
                    Cálida ↔ Fría
                  </button>
                </div>
              </div>

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

              {/* Direct Practice Launchers in External AI Apps */}
              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-code uppercase text-stone-600 dark:text-stone-400 font-bold">
                  <span>Practicar ahora en aplicaciones IA (copia y abre):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(builderState.mode === 'photo'
                    ? [
                        { name: 'ChatGPT', url: 'https://chatgpt.com/' },
                        { name: 'Gemini', url: 'https://gemini.google.com/' },
                        { name: 'Midjourney', url: 'https://www.midjourney.com/' },
                        { name: 'FLUX / Freepik', url: 'https://www.freepik.com/ai/image-generator' },
                        { name: 'Adobe Firefly', url: 'https://firefly.adobe.com/' },
                      ]
                    : [
                        { name: 'Runway Gen-3', url: 'https://app.runwayml.com/' },
                        { name: 'Kling AI', url: 'https://klingai.com/' },
                        { name: 'Google Flow / Veo', url: 'https://labs.google/fx/tools/flow' },
                        { name: 'Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine' },
                        { name: 'ChatGPT', url: 'https://chatgpt.com/' },
                      ]
                  ).map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleCopy}
                      className="px-2.5 py-1.5 text-[11px] font-mono-code font-semibold bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-stone-800 dark:text-stone-200 rounded inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{app.name}</span>
                      <ExternalLink className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    </a>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 leading-normal flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Al pulsar cualquiera de los enlaces se copia automáticamente tu prompt al portapapeles para pegarlo y practicar directamente en la plataforma elegida.
                  </span>
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
