import React, { useState } from 'react';
import {
  Clapperboard,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Download,
  Printer,
  Send,
  Volume2,
  Camera,
  Scissors,
  Layers,
} from 'lucide-react';
import type { StoryboardSceneItem } from './InteractiveCreativeLabs';
import type { PromptBuilderState } from './PromptBuilder';

export interface FilmProjectDossier {
  projectTitle: string;
  concept: {
    theme: string;
    intention: string;
    keyMessage: string;
    targetAudience: string;
  };
  script: {
    logline: string;
    narrativeArc: string;
    voiceoverOrDialogue: string;
  };
  cinematography: {
    cameraReference: string;
    lensStrategy: string;
    lightingScheme: string;
    colorPaletteHex: string[];
    colorDescription: string;
  };
  scenes: {
    sceneNumber: number;
    title: string;
    durationSec: number;
    shotSize: string;
    cameraAngle: string;
    cameraMovement: string;
    visualAction: string;
    imageKeyframePrompt: string;
    videoMotionPrompt: string;
    soundCue: string;
  }[];
  soundDesign: {
    musicDirection: string;
    ambience: string;
    foley: string;
    voiceDirection: string;
  };
  editingPlan: {
    rhythm: string;
    transitions: string;
    colorGradingNotes: string;
    exportSpecs: string;
  };
}

interface AiFilmDirectorProps {
  onLoadIntoStoryboard: (scenes: StoryboardSceneItem[]) => void;
  onApplyShotToBuilder: (patch: Partial<PromptBuilderState>) => void;
}

const SAMPLE_DOSSIER: FilmProjectDossier = {
  projectTitle: 'Hilos del Taller en la Ladera',
  concept: {
    theme: 'Memoria viva de los oficios artesanales y encuentro intergeneracional en el barrio.',
    intention: 'Evocar cercanía táctil sin romantizar ni caer en clichés turísticos.',
    keyMessage: 'El barrio persiste en los gestos cotidianos que se enseñan de mano en mano.',
    targetAudience: 'Comunidad local, circuitos culturales, festivales de cine comunitario y redes.',
  },
  script: {
    logline: 'En 30 segundos, un taller familiar despierta al amanecer hasta abrir sus puertas al encuentro vecinal.',
    narrativeArc: '01 Apertura territorial (0–6s) → 02 Ritmo del oficio (6–19s) → 03 Encuentro y cierre luminoso (19–30s).',
    voiceoverOrDialogue: 'Voz en off íntima: "Las casas cambian de color, pero las manos recuerdan exactamente cómo empezar el día."',
  },
  cinematography: {
    cameraReference: 'ARRI Alexa 35 (referencia de rango dinámico orgánico)',
    lensStrategy: '35mm documental para entorno + 85mm macro para detalle de manos',
    lightingScheme: 'Transición natural del azul del alba (6200K) a luz lateral cálida de ventana (3800K)',
    colorPaletteHex: ['#1C1917', '#8C5A3C', '#D97706', '#FAF8F5'],
    colorDescription: 'Tonos tierra minerales, arcilla húmeda y ámbar matinal con negros suaves tipo Kodak 2383.',
  },
  scenes: [
    {
      sceneNumber: 1,
      title: 'Despertar de la ladera',
      durationSec: 6,
      shotSize: 'Gran Plano General (ELS)',
      cameraAngle: 'Picado suave',
      cameraMovement: 'Crane Down lento',
      visualAction: 'Niebla ligera sobre las calles inclinadas del barrio mientras se enciende la lámpara cálida de un taller.',
      imageKeyframePrompt: 'Gran plano general documental de calle en ladera latinoamericana al amanecer con neblina suave y luz cálida encendiéndose en ventana de taller de ladrillo, lente 24mm, tono natural.',
      videoMotionPrompt: 'Slow gentle crane-down descending over misty brick rooftops toward the warm glowing workshop window, 24fps, 6 seconds.',
      soundCue: 'Viento suave de montaña, gallo lejano y persiana metálica abriéndose.',
    },
    {
      sceneNumber: 2,
      title: 'Preparación del oficio',
      durationSec: 8,
      shotSize: 'Plano Medio (MS)',
      cameraAngle: 'Normal (Eye Level)',
      cameraMovement: 'Tracking lateral fluido',
      visualAction: 'Una artesana adulta acomoda pinceles, tazas de cerámica y pigmentos naturales sobre mesa de madera.',
      imageKeyframePrompt: 'Retrato documental plano medio de artesana adulta organizando pinceles y cerámica cruda en taller iluminado por luz lateral natural de ventana, lente 35mm f/2.0, textura orgánica.',
      videoMotionPrompt: 'Smooth stabilized lateral tracking shot gliding parallel to the timber workbench as the artisan arranges tools, soft morning sunbeams, 24fps.',
      soundCue: 'Roce de cerámica sobre madera y respiración tranquila.',
    },
    {
      sceneNumber: 3,
      title: 'Huella táctil',
      durationSec: 7,
      shotSize: 'Primerísimo Primer Plano (ECU)',
      cameraAngle: 'Cenital 45°',
      cameraMovement: 'Dolly In lento',
      visualAction: 'Detalle macro de manos trazando surcos húmedos sobre barro fresco con polvo iluminado a contraluz.',
      imageKeyframePrompt: 'Macro documental de manos marcadas por la arcilla moldeando barro húmedo bajo luz rasante cálida con polvo fino en suspensión, lente 85mm f/2.8.',
      videoMotionPrompt: 'Very slow macro dolly-in toward hands shaping wet clay with sunlit dust particles floating gently in warm sidelight, 24fps.',
      soundCue: 'Sonido táctil húmedo del torno y guitarra acústica entrando suave.',
    },
    {
      sceneNumber: 4,
      title: 'Puerta abierta al barrio',
      durationSec: 9,
      shotSize: 'Plano General (LS)',
      cameraAngle: 'Normal (Eye Level)',
      cameraMovement: 'Dolly Out revelando espacio',
      visualAction: 'Jóvenes y mayores ingresan al taller para compartir café y observar las piezas terminadas.',
      imageKeyframePrompt: 'Escena comunitaria cálida en taller cultural abierto a la calle, vecinos de distintas edades conversando frente a mesa con piezas terminadas, luz dorada natural.',
      videoMotionPrompt: 'Gentle dolly-out pulling back through the open workshop doorway as neighbors gather warmly in golden morning light, 24fps.',
      soundCue: 'Murmullo cálido de conversación, acordes finales de guitarra y tazas.',
    },
  ],
  soundDesign: {
    musicDirection: 'Guitarra acústica minimalista con cuerdas de nylon a 72 BPM y violonchelo sutil desde el segundo 12.',
    ambience: 'Paisaje sonoro real de barrio: brisa matinal, pájaros locales y eco suave de patio interior.',
    foley: 'Persiana, roce de madera, barro húmedo y pasos en cemento.',
    voiceDirection: 'Locución cercana (close-mic) en tono conversacional pausado, sin grandilocuencia publicitaria.',
  },
  editingPlan: {
    rhythm: 'Ritmo respirado: planos de 6 a 9 segundos permitiendo leer gestos y atmósferas.',
    transitions: 'Corte directo limpio en movimiento y J-cut sonoro anticipando cada escena por 0.5s.',
    colorGradingNotes: 'Igualar balance de blancos entre tomas en DaVinci Resolve y añadir grano fino de 35mm al 12%.',
    exportSpecs: 'Master 16:9 4K ProRes + versión 9:16 1080x1920 H.264 con subtítulos quemados accesibles.',
  },
};

const QUICK_IDEAS = [
  'Quiero hacer un video de 30 segundos sobre la memoria de un barrio y sus oficios',
  'Cortometraje experimental sobre agua, arquitectura de hormigón y sonido urbano',
  'Pieza documental breve sobre jóvenes creando arte interactivo en un laboratorio cultural',
];

export const AiFilmDirector: React.FC<AiFilmDirectorProps> = ({
  onLoadIntoStoryboard,
  onApplyShotToBuilder,
}) => {
  const [idea, setIdea] = useState('Quiero hacer un video de 30 segundos sobre la memoria de un barrio y sus oficios');
  const [format, setFormat] = useState('Cortometraje / Video 30s');
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [tone, setTone] = useState('Documental Poético y Contemporáneo');
  const [dossier, setDossier] = useState<FilmProjectDossier>(SAMPLE_DOSSIER);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setErrorMsg('Describe brevemente la idea de tu película, video o pieza visual.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/direct-film', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, format, durationSeconds, tone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo generar el proyecto con Gemini.');
      }

      setDossier(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al conectar con el Director IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDossier = (ext: 'json' | 'txt') => {
    const content =
      ext === 'json'
        ? JSON.stringify(dossier, null, 2)
        : `${dossier.projectTitle.toUpperCase()} — DOSSIER DE PRODUCCIÓN (NÚCLEO COLECTIVO)\n\n` +
          `1. CONCEPTO\nTema: ${dossier.concept.theme}\nIntención: ${dossier.concept.intention}\nMensaje: ${dossier.concept.keyMessage}\n\n` +
          `2. GUION\nLogline: ${dossier.script.logline}\nArco: ${dossier.script.narrativeArc}\nVoz/Diálogo: ${dossier.script.voiceoverOrDialogue}\n\n` +
          `3. FOTOGRAFÍA\nCámara: ${dossier.cinematography.cameraReference}\nÓptica: ${dossier.cinematography.lensStrategy}\nLuz: ${dossier.cinematography.lightingScheme}\nPaleta: ${dossier.cinematography.colorPaletteHex.join(', ')}\n\n` +
          `4. ESCENAS Y PROMPTS\n` +
          dossier.scenes
            .map(
              (s) =>
                `Escena ${s.sceneNumber}: ${s.title} (${s.durationSec}s) | ${s.shotSize} | ${s.cameraMovement}\nAcción: ${s.visualAction}\nPrompt Imagen: ${s.imageKeyframePrompt}\nPrompt Video: ${s.videoMotionPrompt}\nSonido: ${s.soundCue}\n`
            )
            .join('\n') +
          `\n5. DISEÑO SONORO\nMúsica: ${dossier.soundDesign.musicDirection}\nAmbiente: ${dossier.soundDesign.ambience}\nFoley: ${dossier.soundDesign.foley}\n\n` +
          `6. MONTAJE Y EXPORTACIÓN\nRitmo: ${dossier.editingPlan.rhythm}\nEtalonaje: ${dossier.editingPlan.colorGradingNotes}\nSalida: ${dossier.editingPlan.exportSpecs}\n`;

    const blob = new Blob([content], { type: ext === 'json' ? 'application/json' : 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `film_dossier_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendToStoryboardCreator = () => {
    const mapped: StoryboardSceneItem[] = dossier.scenes.map((s) => ({
      id: `fd-${s.sceneNumber}-${Date.now()}`,
      title: s.title,
      shotSize: s.shotSize,
      angle: s.cameraAngle,
      movement: s.cameraMovement,
      durationSec: s.durationSec,
      action: s.visualAction,
      lightingNote: dossier.cinematography.lightingScheme,
    }));
    onLoadIntoStoryboard(mapped);
  };

  return (
    <section
      id="film-director"
      className="py-16 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 transition-colors scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1.5">
              <Clapperboard className="w-4 h-4" />
              <span>AI FILM DIRECTOR · 8 ETAPAS DE PRODUCCIÓN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              De una idea a un proyecto audiovisual completo
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Describe lo que quieres filmar o crear. Gemini organiza el paquete completo: concepto, guion, storyboard por escenas, fotografía, prompts de imagen y video por toma, sonido y montaje.
            </p>
          </div>
          <div className="text-xs font-mono-code text-stone-500 dark:text-stone-400">
            Flujo integral Núcleo Colectivo · Gemini Multimodal
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleGenerate}
          className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
        >
          <div className="space-y-2">
            <label className="block text-xs font-mono-code uppercase tracking-wider text-stone-600 dark:text-stone-400 font-bold">
              ¿Qué historia, video o proyecto visual quieres dirigir?
            </label>
            <textarea
              rows={2}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ej: Quiero hacer un video de 30 segundos sobre la memoria de un barrio..."
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
            />
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="font-mono-code text-stone-500">Ideas rápidas:</span>
              {QUICK_IDEAS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setIdea(q)}
                  className="px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-950 hover:bg-amber-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors text-left"
                >
                  {q.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-mono-code text-stone-500 mb-1">Formato</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-xs text-stone-900 dark:text-stone-100"
              >
                <option>Cortometraje / Video 30s</option>
                <option>Documental Comunitario</option>
                <option>Pieza Experimental / Instalación</option>
                <option>Campaña Cultural 9:16</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono-code text-stone-500 mb-1">Duración objetivo</label>
              <select
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-xs text-stone-900 dark:text-stone-100"
              >
                <option value={15}>15 segundos (Reel / Cápsula)</option>
                <option value={30}>30 segundos (Estándar)</option>
                <option value={60}>60 segundos (Cortometraje breve)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono-code text-stone-500 mb-1">Tono estético</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-xs text-stone-900 dark:text-stone-100"
              >
                <option>Documental Poético y Contemporáneo</option>
                <option>Cinematográfico Dramático / Neo Noir</option>
                <option>Editorial Luminoso y Calmo</option>
                <option>Experimental Arte & Tecnología</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dirigiendo con Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Proyecto 8 Etapas</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errorMsg}</p>
          )}
        </form>

        {/* 8-Stage Dossier Display */}
        <div className="rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
          {/* Dossier Top Toolbar (Stage 8 Export) */}
          <div className="p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-950 text-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-amber-400 font-bold">
                DOSSIER DE PRODUCCIÓN · {dossier.scenes.length} ESCENAS
              </span>
              <h3 className="text-2xl font-bold font-serif-title text-white mt-0.5">
                {dossier.projectTitle}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSendToStoryboardCreator}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Cargar en Storyboard Creator</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportDossier('txt')}
                className="px-3 py-1.5 text-xs font-mono-code bg-stone-800 hover:bg-stone-700 text-stone-100 rounded flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Guion .TXT</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportDossier('json')}
                className="px-3 py-1.5 text-xs font-mono-code bg-stone-800 hover:bg-stone-700 text-stone-100 rounded flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Dossier .JSON</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-mono-code bg-stone-800 hover:bg-stone-700 text-stone-100 rounded flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Stages 1, 2, 4 Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Stage 1: Concepto */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="text-[11px] font-mono-code uppercase font-bold text-amber-700 dark:text-amber-400">
                  01. Concepto Creativo
                </div>
                <p><strong className="text-stone-900 dark:text-stone-100">Tema:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.concept.theme}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Intención:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.concept.intention}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Mensaje clave:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.concept.keyMessage}</span></p>
              </div>

              {/* Stage 2: Guion */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="text-[11px] font-mono-code uppercase font-bold text-amber-700 dark:text-amber-400">
                  02. Guion & Narración
                </div>
                <p><strong className="text-stone-900 dark:text-stone-100">Logline:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.script.logline}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Arco:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.script.narrativeArc}</span></p>
                <p className="italic text-stone-800 dark:text-stone-200 border-l-2 border-amber-400 pl-2.5">
                  {dossier.script.voiceoverOrDialogue}
                </p>
              </div>

              {/* Stage 4: Dirección de Fotografía */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="text-[11px] font-mono-code uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>04. Dirección de Fotografía</span>
                </div>
                <p><strong className="text-stone-900 dark:text-stone-100">Cámara:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.cinematography.cameraReference}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Óptica:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.cinematography.lensStrategy}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Luz:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.cinematography.lightingScheme}</span></p>
                <div className="flex items-center gap-1.5 pt-1">
                  {dossier.cinematography.colorPaletteHex.map((hex) => (
                    <div key={hex} className="flex items-center gap-1 text-[10px] font-mono-code text-stone-600 dark:text-stone-400">
                      <span className="w-4 h-4 rounded-sm border border-stone-300" style={{ backgroundColor: hex }} />
                      <span>{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stages 3 & 5: Storyboard Secuencial + Prompts Individuales */}
            <div className="space-y-3">
              <div className="text-xs font-mono-code uppercase font-bold text-stone-800 dark:text-stone-200">
                03 & 05 · Desglose de Escenas y Prompts por Toma (Imagen Keyframe + Video)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dossier.scenes.map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-mono-code text-amber-700 dark:text-amber-400 font-bold">
                          ESCENA {String(scene.sceneNumber).padStart(2, '0')} · {scene.durationSec}s · {scene.shotSize} · {scene.cameraMovement}
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                          {scene.title}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onApplyShotToBuilder({
                            mode: 'video',
                            subject: scene.visualAction,
                            shotSize: scene.shotSize,
                            cameraAngle: scene.cameraAngle,
                            motion: scene.cameraMovement,
                            duration: `${scene.durationSec} segundos`,
                          })
                        }
                        className="px-2.5 py-1 text-[11px] font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center gap-1 shrink-0"
                      >
                        <Send className="w-3 h-3" />
                        <span>Constructor</span>
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {scene.visualAction}
                    </p>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px]">
                        <div className="flex items-center justify-between font-mono-code font-bold text-stone-700 dark:text-stone-300 mb-1">
                          <span>Prompt Imagen Base (Keyframe)</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(scene.imageKeyframePrompt, `img-${scene.sceneNumber}`)}
                            className="text-amber-700 dark:text-amber-400 flex items-center gap-1"
                          >
                            {copiedKey === `img-${scene.sceneNumber}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>Copiar</span>
                          </button>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 font-mono-code leading-relaxed">
                          {scene.imageKeyframePrompt}
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-stone-950 text-stone-200 text-[11px]">
                        <div className="flex items-center justify-between font-mono-code font-bold text-amber-400 mb-1">
                          <span>Prompt Video / Cámara</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(scene.videoMotionPrompt, `vid-${scene.sceneNumber}`)}
                            className="text-stone-300 hover:text-amber-300 flex items-center gap-1"
                          >
                            {copiedKey === `vid-${scene.sceneNumber}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>Copiar</span>
                          </button>
                        </div>
                        <p className="text-stone-300 font-mono-code leading-relaxed">
                          {scene.videoMotionPrompt}
                        </p>
                      </div>

                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span><strong>Sonido:</strong> {scene.soundCue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stages 6 & 7: Sonido + Montaje */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="text-[11px] font-mono-code uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>06. Diseño Sonoro y Música</span>
                </div>
                <p><strong className="text-stone-900 dark:text-stone-100">Música:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.soundDesign.musicDirection}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Ambiente:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.soundDesign.ambience}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Foley:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.soundDesign.foley}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Voz:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.soundDesign.voiceDirection}</span></p>
              </div>

              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="text-[11px] font-mono-code uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>07. Plan de Montaje, Etalonaje y Salida</span>
                </div>
                <p><strong className="text-stone-900 dark:text-stone-100">Ritmo:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.editingPlan.rhythm}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Transiciones:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.editingPlan.transitions}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Etalonaje:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.editingPlan.colorGradingNotes}</span></p>
                <p><strong className="text-stone-900 dark:text-stone-100">Exportación:</strong> <span className="text-stone-600 dark:text-stone-400">{dossier.editingPlan.exportSpecs}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
