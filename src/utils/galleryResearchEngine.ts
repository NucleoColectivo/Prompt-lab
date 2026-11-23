import type { GalleryVisualItem } from '../data/galleryCollectionsData';
import type { JsonStyleProfile } from '../data/videoAndJsonData';
import type { PromptBuilderState } from '../components/PromptBuilder';
import type { StoryboardSceneItem } from '../components/InteractiveCreativeLabs';

export type ResearchPathId = 'lighting' | 'lens' | 'context' | 'video' | 'json';

export interface ResearchHypothesisOption {
  id: string;
  label: string;
  shortSpec: string;
  effectExplanation: string;
  deltaEs: string;
  deltaEn: string;
  patch: Partial<PromptBuilderState>;
}

export interface VideoMovementPreset {
  id: string;
  label: string;
  movementSpec: string;
  fps: string;
  duration: string;
  effectExplanation: string;
  promptSuffixEs: string;
  promptSuffixEn: string;
}

export const LIGHTING_HYPOTHESES: ResearchHypothesisOption[] = [
  {
    id: 'light-rembrandt',
    label: 'Rembrandt 45°',
    shortSpec: 'Luz lateral 45° + triángulo en mejilla',
    effectExplanation:
      'Concentra el volumen en un lado del sujeto y preserva un punto de luz clave en sombra para profundidad psicológica y relieve escultórico.',
    deltaEs:
      'reiluminar con esquema Rembrandt lateral a 45 grados, triángulo luminoso definido bajo el ojo en sombra y caída tonal orgánica',
    deltaEn:
      'relight with 45-degree Rembrandt directional key light, crisp cheek light triangle and natural shadow falloff',
    patch: {
      lighting: 'Rembrandt lighting, directional light with cheek triangle',
      temperature: 'Cálida cinematográfica (3800K)',
    },
  },
  {
    id: 'light-rim',
    label: 'Contraluz / Rim Light',
    shortSpec: 'Recorte posterior separando silueta',
    effectExplanation:
      'Separa inmediatamente al sujeto del fondo dibujando un halo fino sobre bordes, textura o cabello, ideal para tensión dramática.',
    deltaEs:
      'trasladar fuente principal a contraluz trasero con rim light definido en los bordes, atmósfera limpia y alto contraste entre figura y fondo',
    deltaEn:
      'shift key source to strong backlight rim lighting sculpting silhouette edges with atmospheric separation',
    patch: {
      lighting: 'Dramatic backlit rim light outlining the silhouette with soft front fill',
      atmosphere: 'Bruma ligera iluminada a contraluz',
    },
  },
  {
    id: 'light-highkey',
    label: 'High Key editorial',
    shortSpec: 'Luz envolvente limpia, sombras mínimas',
    effectExplanation:
      'Elimina tensiones de sombra dura y prioriza frescura gráfica, claridad expositiva y lectura instantánea de texturas claras.',
    deltaEs:
      'iluminación High Key envolvente de estudio con difusores amplios, sombras mínimas y luminosidad limpia sin sobreexposición plástica',
    deltaEn:
      'high-key wraparound soft diffused studio lighting, airy minimal shadows, crisp highlights without blown-out skin',
    patch: {
      lighting: 'High-key wraparound diffused studio lighting on bright neutral ground',
      temperature: 'Luz día nítida (5600K)',
    },
  },
  {
    id: 'light-split',
    label: 'Split Chiaroscuro 90°',
    shortSpec: 'Mitad iluminada / mitad en penumbra',
    effectExplanation:
      'Genera dualidad narrativa y máxima tensión gráfica al dividir el encuadre exactamente a 90 grados sin relleno secundario.',
    deltaEs:
      'iluminación Split estricta a 90 grados laterales sin relleno, mitad en luz definida y mitad en penumbra profunda con detalle residual',
    deltaEn:
      'strict 90-degree split chiaroscuro lighting with minimal bounce, half frame sculpted in light and half in deep shadow',
    patch: {
      lighting: '90-degree dramatic Split lighting, half subject in deep shadow',
      temperature: 'Neutra contrastada (4800K)',
    },
  },
  {
    id: 'light-window',
    label: 'Ventana natural 4800K',
    shortSpec: 'Luz direccional suave de hora dorada',
    effectExplanation:
      'Reemplaza la artificialidad de estudio por intimidad documental con gradientes suaves propios de un espacio habitado.',
    deltaEs:
      'luz natural lateral de ventana amplia al final de la tarde, caída tonal suave, calidez orgánica y realismo documental sin flashes',
    deltaEn:
      'soft late-afternoon natural window light from the side, gentle tonal roll-off and authentic documentary realism',
    patch: {
      lighting: 'Soft directional natural window light at late afternoon',
      temperature: 'Hora dorada suave (4200K)',
    },
  },
];

export const LENS_HYPOTHESES: ResearchHypothesisOption[] = [
  {
    id: 'lens-24mm',
    label: '24mm Gran Angular',
    shortSpec: '24mm f/4 · Perspectiva expansiva',
    effectExplanation:
      'Amplía el contexto espacial alrededor del sujeto, exagera ligeramente la profundidad y mete al espectador dentro de la escena.',
    deltaEs:
      'reencuadrar con lente gran angular 24mm f/4 integrando arquitectura y entorno circundante con líneas dinámicas en perspectiva',
    deltaEn:
      'reframe with 24mm f/4 wide-angle lens capturing rich spatial context and dynamic environmental perspective',
    patch: {
      lens: '24mm wide-angle prime lens',
      aperture: 'f/4.0 contextual sharpness',
      composition: 'Gran angular ambiental con profundidad marcada en primer y tercer plano',
    },
  },
  {
    id: 'lens-35mm',
    label: '35mm Documental',
    shortSpec: '35mm f/2.0 · Presencia humana',
    effectExplanation:
      'Equilibrio clásico de fotoperiodismo y cine autoral: conserva entorno reconocible sin distorsionar los rasgos del sujeto.',
    deltaEs:
      'disparar con lente documental 35mm f/2.0 a distancia íntima manteniendo contexto narrativo legible en segundo plano',
    deltaEn:
      'shot on 35mm f/2.0 documentary prime lens balancing intimate subject presence with readable environmental storytelling',
    patch: {
      lens: '35mm documentary wide-normal lens',
      aperture: 'f/2.0 natural environmental falloff',
      composition: 'Regla de tercios con respiración contextual',
    },
  },
  {
    id: 'lens-50mm',
    label: '50mm Visión Natural',
    shortSpec: '50mm f/2.0 · Geometría honesta',
    effectExplanation:
      'Replica la proporción natural del ojo humano eliminando compresiones exageradas o fugas angulares artificiales.',
    deltaEs:
      'lente estándar 50mm f/2.0 con perspectiva geométrica honesta, transición óptica natural y balance limpio entre sujeto y fondo',
    deltaEn:
      '50mm f/2.0 standard prime lens with honest human-eye geometry and balanced spatial separation',
    patch: {
      lens: '50mm standard prime lens',
      aperture: 'f/2.0 organic optical transition',
    },
  },
  {
    id: 'lens-85mm',
    label: '85mm Retrato / Aislamiento',
    shortSpec: '85mm f/1.8 · Compresión suave',
    effectExplanation:
      'Comprime el fondo acercando planos distantes y aísla al protagonista mediante desenfoque cremoso sin perder proporción.',
    deltaEs:
      'óptica teleobjetivo corto 85mm f/1.8 con compresión sutil de planos y bokeh orgánico aislando claramente al sujeto',
    deltaEn:
      '85mm f/1.8 prime lens delivering flattering compression and creamy optical bokeh isolating the subject',
    patch: {
      lens: '85mm portrait prime lens',
      aperture: 'f/1.8 creamy bokeh',
      composition: 'Plano medio cerrado con aislamiento óptico del fondo',
    },
  },
  {
    id: 'lens-100mm',
    label: '100mm Macro Táctil 1:1',
    shortSpec: '100mm Macro f/4 · Microtextura',
    effectExplanation:
      'Transforma la escena en una exploración microscópica de materiales: fibras, gotas, poros, grano o grabados en primerísima escala.',
    deltaEs:
      'acercamiento con lente macro 100mm 1:1 a f/4 revelando microtexturas táctiles, relieve material y plano focal milimétrico',
    deltaEn:
      '100mm 1:1 macro lens closeup at f/4 revealing tactile surface microtextures and razor-thin focal plane',
    patch: {
      lens: '100mm 1:1 macro prime lens',
      aperture: 'f/4.0 macro tactile focus',
      shotSize: 'Plano Detalle (ECU)',
      composition: 'Macro detalle centrado sobre textura material dominante',
    },
  },
];

export const CONTEXT_HYPOTHESES: ResearchHypothesisOption[] = [
  {
    id: 'ctx-taller',
    label: 'Taller artesanal de barrio',
    shortSpec: 'Madera gastada, cerámica, polvo cálido',
    effectExplanation:
      'Ancla el mismo gesto visual o producto dentro de un espacio de oficio vivo con herramientas reales y memoria material.',
    deltaEs:
      'trasladar la escena a un taller artesanal latinoamericano con mesas de madera gastada, herramientas de oficio, polvo sutil en suspensión y calidez humana',
    deltaEn:
      'relocate the exact subject into a lived-in artisan workshop with worn wood workbenches, hand tools, suspended dust motes and tactile warmth',
    patch: {
      setting: 'Lived-in artisan workshop with worn wooden workbench, ceramic dust and authentic hand tools',
      atmosphere: 'Partículas de polvo sutiles captando luz lateral',
    },
  },
  {
    id: 'ctx-galeria',
    label: 'Galería brutalista',
    shortSpec: 'Concreto visto, luz museográfica',
    effectExplanation:
      'Eleva el motivo hacia una lectura curatorial contemporánea usando arquitectura en hormigón crudo y silencio espacial.',
    deltaEs:
      'situar la escena dentro de una galería de arte contemporáneo brutalista con muros de concreto visto, suelo pulido mate e iluminación museográfica precisa',
    deltaEn:
      'place the scene inside a contemporary brutalist concrete gallery with matte floors and museum-grade directional spotlighting',
    patch: {
      setting: 'Contemporary brutalist concrete art gallery with spacious architectural shadows',
      atmosphere: 'Aire limpio y quietud arquitectónica',
    },
  },
  {
    id: 'ctx-lluvia',
    label: 'Calle nocturna tras lluvia',
    shortSpec: 'Asfalto húmedo, reflejos ámbar/azul',
    effectExplanation:
      'Introduce reflejos especulares en el pavimento, contraste térmico cálido-frío y pulso narrativo cinematográfico.',
    deltaEs:
      'llevar la escena a una calle urbana nocturna justo después de llover, asfalto húmedo con reflejos cálidos y azulados y atmósfera cinematográfica',
    deltaEn:
      'transpose the scene to a wet nocturnal city street right after rain, specular asphalt reflections with warm tungsten and cool shadow contrast',
    patch: {
      setting: 'Wet urban street at night after rain with subtle warm and cool reflections on asphalt',
      colorPalette: 'Teal and orange cinematic grading with warm highlights and cool shadows',
      atmosphere: 'Humedad nocturna post-lluvia con reflejos en suelo',
    },
  },
  {
    id: 'ctx-andino',
    label: 'Territorio andino en neblina',
    shortSpec: 'Páramo brumoso, roca volcánica, alba',
    effectExplanation:
      'Conecta el sujeto con escala geográfica abierta, aire frío de altura y paleta mineral sobria.',
    deltaEs:
      'reubicar en paisaje de páramo andino con neblina matinal baja, roca volcánica húmeda y vegetación de altura bajo luz difusa de amanecer',
    deltaEn:
      'relocate to a misty Andean highland landscape with low morning fog, dark volcanic stone and crisp dawn atmosphere',
    patch: {
      setting: 'Misty Andean highland terrain with dark volcanic stone and morning valley fog',
      atmosphere: 'Neblina matinal en capas profundas',
      colorPalette: 'Paleta mineral fría equilibrada con tonos tierra',
    },
  },
  {
    id: 'ctx-archivo',
    label: 'Mesa de archivo editorial',
    shortSpec: 'Papel algodón, tinta, diseño gráfico',
    effectExplanation:
      'Convierte la escena en un objeto de estudio editorial rodeado de retículas, papel textura algodón e iluminación cenital.',
    deltaEs:
      'reinterpretar como composición sobre mesa de archivo editorial con papel de algodón crudo, muestras impresas y luz cenital controlada',
    deltaEn:
      'reinterpret on an editorial archive table with textured cotton paper, print proofs and controlled overhead softbox light',
    patch: {
      setting: 'Editorial design archive table with textured cotton paper, print proofs and minimal props',
      atmosphere: 'Estudio limpio sin neblina',
    },
  },
];

export const VIDEO_MOVEMENT_PRESETS: VideoMovementPreset[] = [
  {
    id: 'vid-dolly-in',
    label: 'Dolly In lento',
    movementSpec: 'Slow smooth dolly-in moving physically towards the subject',
    fps: '24 fps',
    duration: '6 segundos',
    effectExplanation:
      'Acerca físicamente la cámara sin deformar el fondo (a diferencia del zoom), intensificando intimidad y atención en el detalle.',
    promptSuffixEs:
      'Transformar en secuencia de video cinematográfico de 6 segundos a 24fps: movimiento físico lento de Dolly In hacia el sujeto, respiración sutil de luz y micro-movimiento ambiental natural, continuidad temporal estable sin deformaciones.',
    promptSuffixEn:
      'Transform into a 6-second 24fps cinematic video shot: slow physical dolly-in toward the subject, subtle natural ambient micro-motion and breathing light, temporal consistency without morphing.',
  },
  {
    id: 'vid-tracking',
    label: 'Tracking lateral',
    movementSpec: 'Smooth lateral tracking shot parallel to the subject',
    fps: '24 fps',
    duration: '6 segundos',
    effectExplanation:
      'Crea paralaje real entre primer plano, sujeto y fondo, revelando la tridimensionalidad arquitectónica o espacial de la lámina.',
    promptSuffixEs:
      'Transformar en plano secuencia lateral (tracking shot) de 6 segundos a 24fps sobre riel estable, generando paralaje suave entre primer plano y fondo mientras se mantiene foco continuo en el sujeto.',
    promptSuffixEn:
      'Transform into a 6-second 24fps smooth lateral tracking shot on cinema rails, revealing foreground-background parallax while locking sharp focus on the subject.',
  },
  {
    id: 'vid-orbit',
    label: 'Orbit suave 180°',
    movementSpec: 'Continuous smooth semi-circular orbit shot around the subject',
    fps: '24 fps',
    duration: '8 segundos',
    effectExplanation:
      'Rodea progresivamente al sujeto revelando cómo cambia la incidencia de la luz sobre sus volúmenes y materiales.',
    promptSuffixEs:
      'Secuencia de video de 8 segundos a 24fps con órbita suave de cámara alrededor del sujeto (90 a 180 grados), mostrando transición realista de reflejos y sombras sobre la superficie.',
    promptSuffixEn:
      '8-second 24fps smooth camera orbit gliding around the subject, revealing realistic specular shifts and shadow wrap across surfaces.',
  },
  {
    id: 'vid-crane',
    label: 'Crane Up revelador',
    movementSpec: 'Slow rising crane-up shot tilting gently down to reveal context',
    fps: '24 fps',
    duration: '6 segundos',
    effectExplanation:
      'Parte del detalle íntimo de la fotografía y se eleva gradualmente para contextualizar todo el escenario o territorio.',
    promptSuffixEs:
      'Secuencia cinematográfica de 6 segundos a 24fps iniciando en plano cerrado y elevándose con grúa suave (Crane Up) para revelar la escala completa del entorno.',
    promptSuffixEn:
      '6-second 24fps cinematic crane-up shot starting tight and rising gracefully to reveal the surrounding spatial scale.',
  },
];

export function buildCombinedExperimentPrompt(
  item: GalleryVisualItem,
  lang: 'es' | 'en',
  selectedLighting: ResearchHypothesisOption | null,
  selectedLens: ResearchHypothesisOption | null,
  selectedContext: ResearchHypothesisOption | null
): string {
  const base = lang === 'es' ? item.promptEs : item.promptEn;
  const deltas: string[] = [];

  if (selectedLighting) {
    deltas.push(
      lang === 'es'
        ? `Iluminación: ${selectedLighting.deltaEs}`
        : `Lighting: ${selectedLighting.deltaEn}`
    );
  }
  if (selectedLens) {
    deltas.push(
      lang === 'es' ? `Óptica: ${selectedLens.deltaEs}` : `Lens: ${selectedLens.deltaEn}`
    );
  }
  if (selectedContext) {
    deltas.push(
      lang === 'es'
        ? `Contexto: ${selectedContext.deltaEs}`
        : `Context: ${selectedContext.deltaEn}`
    );
  }

  if (deltas.length === 0) return base;
  return `${base} — [${deltas.join(' · ')}]`;
}

export function mapGalleryCollectionToCategory(
  collection: GalleryVisualItem['collection'],
  mediaType: GalleryVisualItem['mediaType']
): NonNullable<PromptBuilderState['category']> {
  if (mediaType === 'video' || collection === 'Motion y Video') return 'video';
  switch (collection) {
    case 'Producto':
      return 'branding';
    case 'Arte Digital':
      return 'experimental';
    case 'Paisaje':
      return 'architecture';
    case 'Cine':
    case 'Retrato':
    case 'Moda':
    case 'Macro y Naturaleza':
    default:
      return 'photo';
  }
}

export function buildCombinedBuilderPatch(
  item: GalleryVisualItem,
  lang: 'es' | 'en',
  selectedLighting: ResearchHypothesisOption | null,
  selectedLens: ResearchHypothesisOption | null,
  selectedContext: ResearchHypothesisOption | null,
  videoPreset?: VideoMovementPreset | null
): Partial<PromptBuilderState> {
  const promptText = buildCombinedExperimentPrompt(
    item,
    lang,
    selectedLighting,
    selectedLens,
    selectedContext
  );

  const isVideo = Boolean(videoPreset) || item.mediaType === 'video';
  const basePatch: Partial<PromptBuilderState> = {
    mode: isVideo ? 'video' : 'photo',
    category: isVideo ? 'video' : mapGalleryCollectionToCategory(item.collection, item.mediaType),
    subject: videoPreset
      ? `${promptText} — [${lang === 'es' ? videoPreset.promptSuffixEs : videoPreset.promptSuffixEn}]`
      : promptText,
    setting: selectedContext?.patch.setting || item.description,
    composition: selectedLens?.patch.composition || item.specs.composition,
    camera: item.specs.camera,
    lens: selectedLens?.patch.lens || item.specs.lens,
    aperture: selectedLens?.patch.aperture || item.specs.aperture,
    shotSize: selectedLens?.patch.shotSize,
    lighting: selectedLighting?.patch.lighting || item.specs.lighting,
    colorPalette: selectedContext?.patch.colorPalette || item.specs.color,
    temperature: selectedLighting?.patch.temperature,
    atmosphere:
      selectedContext?.patch.atmosphere ||
      selectedLighting?.patch.atmosphere ||
      item.specs.atmosphere,
    texture: item.specs.texture,
    materials: item.specs.texture,
    visualStyle: item.style,
    aspectRatio: item.aspectRatio,
    motion: videoPreset
      ? videoPreset.movementSpec
      : item.mediaType === 'video'
      ? 'Smooth controlled cinematic camera movement at 24fps'
      : undefined,
    fps: videoPreset?.fps,
    duration: videoPreset?.duration,
    negativeAvoid: item.negativePrompt
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    customNotes: `Galería · ${item.code} (${item.title}) · ${item.toolReference}`,
  };

  return basePatch;
}

export function buildPlateJsonProfile(
  item: GalleryVisualItem,
  selectedLighting: ResearchHypothesisOption | null = null,
  selectedLens: ResearchHypothesisOption | null = null,
  selectedContext: ResearchHypothesisOption | null = null
): JsonStyleProfile {
  const lightingValue = selectedLighting?.patch.lighting || item.specs.lighting;
  const lensValue = selectedLens?.patch.lens || item.specs.lens;
  const apertureValue = selectedLens?.patch.aperture || item.specs.aperture;
  const compositionValue = selectedLens?.patch.composition || item.specs.composition;
  const atmosphereValue =
    selectedContext?.patch.atmosphere ||
    selectedLighting?.patch.atmosphere ||
    item.specs.atmosphere;
  const colorValue = selectedContext?.patch.colorPalette || item.specs.color;
  const settingValue = selectedContext?.patch.setting || item.description;

  const experimentSuffix = [
    selectedLighting?.label,
    selectedLens?.label,
    selectedContext?.label,
  ]
    .filter(Boolean)
    .join(' + ');

  return {
    id: `gal-${item.id}`,
    style_name: experimentSuffix
      ? `${item.title} · Experimento (${experimentSuffix})`
      : `${item.title} (${item.style})`,
    category: item.collection,
    photography: `${item.technique} — referencia estética sin EXIF inventado`,
    camera: item.specs.camera,
    lens: lensValue,
    aperture: apertureValue,
    lighting: lightingValue,
    composition: compositionValue,
    color: colorValue,
    focus: 'Nítido sobre sujeto principal con transición óptica orgánica',
    depth_of_field:
      apertureValue.includes('1.4') || apertureValue.includes('1.8')
        ? 'Baja (separación suave del fondo)'
        : 'Media equilibrada con contexto visible',
    texture: item.specs.texture,
    atmosphere: atmosphereValue,
    background: settingValue,
    post_processing: 'Gradación tonal coherente sin saturación artificial ni piel plástica',
    observable_notes: item.technicalExplanation,
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  };
}

export function buildStoryboardSceneFromPlate(
  item: GalleryVisualItem,
  videoPreset: VideoMovementPreset,
  selectedLighting: ResearchHypothesisOption | null,
  selectedContext: ResearchHypothesisOption | null
): StoryboardSceneItem {
  const durationNum = parseInt(videoPreset.duration, 10) || 6;
  return {
    id: `sb-gal-${item.id}-${Date.now()}`,
    title: `${item.code} · ${item.title}`,
    shotSize: item.specs.composition.split(',')[0] || 'Plano Medio (MS)',
    angle: 'Normal / Dirección autoral',
    movement: videoPreset.label,
    durationSec: durationNum,
    action: selectedContext
      ? `${item.description} Trasladado a: ${selectedContext.shortSpec}.`
      : item.description,
    lightingNote: selectedLighting ? selectedLighting.shortSpec : item.specs.lighting,
  };
}

export function exportPlateResearchSheetText(
  item: GalleryVisualItem,
  promptEs: string,
  promptEn: string,
  videoPrompt: string,
  jsonProfile: JsonStyleProfile,
  personalNote: string
): string {
  return [
    `NÚCLEO COLECTIVO · FICHA DE INVESTIGACIÓN VISUAL`,
    `============================================================`,
    `ID: ${item.code} (${item.collection})`,
    `Título: ${item.title}`,
    `Estilo / Técnica: ${item.style} · ${item.technique}`,
    `Procedencia: ${item.provenance}`,
    ``,
    `1. ANÁLISIS VISUAL Y TÉCNICO`,
    `Descripción: ${item.description}`,
    `Fundamento técnico: ${item.technicalExplanation}`,
    `Aplicación recomendada: ${item.applicationExample}`,
    `- Cámara equiv.: ${item.specs.camera}`,
    `- Óptica actual: ${jsonProfile.lens} (${jsonProfile.aperture})`,
    `- Iluminación actual: ${jsonProfile.lighting}`,
    `- Colorimetría: ${jsonProfile.color}`,
    `- Composición: ${jsonProfile.composition}`,
    `- Textura y atmósfera: ${jsonProfile.texture} · ${jsonProfile.atmosphere}`,
    ``,
    `2. PROMPT EXPERIMENTAL (ES)`,
    promptEs,
    ``,
    `3. PROMPT EXPERIMENTAL (EN)`,
    promptEn,
    ``,
    `4. NEGATIVE PROMPT`,
    item.negativePrompt,
    ``,
    `5. CONVERSIÓN A SECUENCIA DE VIDEO`,
    videoPrompt,
    ``,
    `6. PERFIL JSON REUTILIZABLE`,
    JSON.stringify(jsonProfile, null, 2),
    ``,
    `7. BITÁCORA / HIPÓTESIS DEL INVESTIGADOR`,
    personalNote.trim() || '(Sin notas personales registradas todavía)',
    ``,
  ].join('\n');
}
