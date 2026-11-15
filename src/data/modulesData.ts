import type { VisualAspectRatio } from '../components/ResilientImage';
import { VISUAL_LIBRARY_PATHS } from './visualLibraryRegistry';

export type ModuleId =
  | 'mod-01'
  | 'mod-02'
  | 'mod-03'
  | 'mod-04'
  | 'mod-05'
  | 'mod-06'
  | 'mod-07'
  | 'mod-08'
  | 'mod-09'
  | 'mod-10'
  | 'mod-11'
  | 'mod-12'
  | 'mod-13'
  | 'mod-14'
  | 'mod-15'
  | 'mod-16'
  | 'mod-17'
  | 'mod-18'
  | 'mod-19'
  | 'mod-20'
  | 'mod-21'
  | 'mod-22'
  | 'mod-23'
  | 'mod-24'
  | 'mod-25'
  | 'mod-26';

export type DiagramType =
  | 'none'
  | 'lighting'
  | 'lens-fov'
  | 'aperture-dof'
  | 'composition'
  | 'shot-size'
  | 'camera-angle'
  | 'camera-motion'
  | 'color-palette';

export interface DiagramConfig {
  // Lighting diagram
  keyAngle?: number; // degrees around subject (0 = front/camera, 90 = right, -90 = left, 180 = back)
  fillLevel?: 'none' | 'low' | 'medium' | 'high';
  rimActive?: boolean;
  contrast?: 'low' | 'medium' | 'high' | 'extreme';
  // Lens diagram
  focalMm?: number;
  // Aperture diagram
  fStop?: number;
  // Composition / Shot / Angle
  overlayMode?:
    | 'thirds'
    | 'symmetry'
    | 'golden'
    | 'leading-lines'
    | 'framing'
    | 'negative-space'
    | 'central'
    | 'depth-layers'
    | 'gpg'
    | 'pg'
    | 'pe'
    | 'pa'
    | 'pm'
    | 'pmc'
    | 'pp'
    | 'ppp'
    | 'pd'
    | 'eye-level'
    | 'low-angle'
    | 'high-angle'
    | 'birds-eye'
    | 'worms-eye'
    | 'dutch'
    | 'ots'
    | 'pov';
  // Video camera motion
  motionType?:
    | 'pan'
    | 'tilt'
    | 'dolly-in'
    | 'dolly-out'
    | 'tracking'
    | 'orbit'
    | 'crane-up'
    | 'crane-down'
    | 'pedestal'
    | 'truck'
    | 'zoom'
    | 'rack-focus'
    | 'whip-pan'
    | 'handheld'
    | 'steadicam'
    | 'drone'
    | 'fpv'
    | 'roll'
    | 'arc'
    | 'parallax'
    | 'static';
  // Color swatches
  swatches?: string[];
}

export interface LibraryEntry {
  id: string;
  moduleId: ModuleId;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  explanation: string;
  visual_examples: string[];
  image: string;
  aspectRatio?: VisualAspectRatio;
  objectPosition?: 'center' | 'top' | 'bottom';
  alt?: string;
  applicationExample?: string;
  diagramType: DiagramType;
  diagramConfig?: DiagramConfig;
  technical_terms: string[];
  prompt_examples: {
    es: string;
    en: string;
  };
  builderPatch?: {
    mode?: 'photo' | 'video';
    genre?: string;
    camera?: string;
    lens?: string;
    aperture?: string;
    lighting?: string;
    colorPalette?: string;
    motion?: string;
    shotSize?: string;
    cameraAngle?: string;
    temperature?: string;
    atmosphere?: string;
    visualStyle?: string;
    fps?: string;
    aspectRatio?: string;
  };
  related_topics: string[];
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  tags: string[];
  source: string;
  license: string;
  provenance?: {
    author: string;
    aiStatus: 'Generada con IA (referencia educativa)' | 'Editada / Híbrida con IA' | 'Diagrama técnico SVG';
    consent: string;
  };
}

export interface ModuleMeta {
  id: ModuleId;
  number: string;
  group?: 'imagen-cine' | 'narrativa-diseno' | 'especialidades-etica';
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  subcategories: string[];
}

export const MODULES_META: ModuleMeta[] = [
  {
    id: 'mod-01',
    number: '01',
    title: 'Generación de Imágenes',
    shortTitle: 'Imágenes',
    subtitle: 'Ilustración, Fotografía, Diseño, Mundos Imaginarios y Territorio',
    description:
      'Biblioteca visual organizada por estilos artísticos, géneros fotográficos, comunicación gráfica, mundos especulativos y ejercicios situados para talleres.',
    subcategories: [
      'A. Ilustración y creación artística',
      'B. Fotografía',
      'C. Diseño gráfico y publicidad',
      'D. Mundos imaginarios y territorio',
      'E. Talleres y creación situada',
    ],
  },
  {
    id: 'mod-02',
    number: '02',
    title: 'Fotografía Técnica y Equipamiento',
    shortTitle: 'Óptica y Cámaras',
    subtitle: 'Cámaras, Marcas de Referencia, Lentes 8mm–400mm y Parámetros',
    description:
      'Comprende cómo se traducen los formatos de cámara, distancias focales, aperturas f/1.4–f/16, ISO y obturación dentro de los prompts visuales.',
    subcategories: [
      'A. Tipos de cámara',
      'B. Marcas y sistemas de referencia',
      'C. Lentes y distancias focales (8mm–400mm)',
      'D. Parámetros fotográficos',
    ],
  },
  {
    id: 'mod-03',
    number: '03',
    title: 'Iluminación Fotográfica',
    shortTitle: 'Iluminación',
    subtitle: 'Fuentes de Luz y Técnicas Clásicas de Estudio y Cine',
    description:
      'Cada ficha incluye diagrama espacial de ubicación de luces, resultado visual esperado en sombras y textura, y prompt directo para aplicar.',
    subcategories: [
      'A. Tipos y fuentes de luz',
      'B. Técnicas de iluminación y modelado',
    ],
  },
  {
    id: 'mod-04',
    number: '04',
    title: 'Color y Dirección de Arte',
    shortTitle: 'Color y Arte',
    subtitle: 'Temperatura, Paletas Cromáticas y Estéticas Fílmicas',
    description:
      'Dirección cromática y referencias cinematográficas. Las referencias a emulsiones o películas actúan como inspiración estética, no reproducción química garantizada.',
    subcategories: [
      'A. Temperatura de color',
      'B. Paletas y combinaciones cromáticas',
      'C. Estéticas visuales y referencias fílmicas',
    ],
  },
  {
    id: 'mod-05',
    number: '05',
    title: 'Composición y Lenguaje de Cámara',
    shortTitle: 'Composición',
    subtitle: 'Escala de Planos, Ángulos de Cámara y Reglas Espaciales',
    description:
      'Domina desde el Gran Plano General hasta el Plano Detalle, angulaciones expresivas y estructuras de composición con retículas SVG interactivas.',
    subcategories: [
      'A. Tipos de plano',
      'B. Ángulos de cámara',
      'C. Reglas y recursos de composición',
    ],
  },
  {
    id: 'mod-06',
    number: '06',
    title: 'Generación de Video y Cinematografía',
    shortTitle: 'Video Lab',
    subtitle: '25 Movimientos de Cámara, Temporalidad, Efectos y Continuidad',
    description:
      'Lenguaje audiovisual para Runway, Kling, Veo y Sora: trayectorias espaciales de cámara, velocidad temporal, animación híbrida y continuidad sin morphing.',
    subcategories: [
      'A. Movimientos de cámara',
      'B. Velocidad y temporalidad',
      'C. Animación y movimiento',
      'D. Efectos cinematográficos',
      'E. Continuidad y transiciones',
      'F. Ejemplos de museografía y arte',
    ],
  },
];

const IMG = {
  studio: VISUAL_LIBRARY_PATHS.videoStudio,
  noir: VISUAL_LIBRARY_PATHS.photoNeoNoir,
  product: VISUAL_LIBRARY_PATHS.adLuxury,
  generative: VISUAL_LIBRARY_PATHS.animGenerativeParticles,
  analog: VISUAL_LIBRARY_PATHS.photoAnalogDocumentary,
  artwork: VISUAL_LIBRARY_PATHS.videoGalleryTour,
  loop: VISUAL_LIBRARY_PATHS.videoInfiniteLoop,
  billboard: VISUAL_LIBRARY_PATHS.adBillboard,
  botanical: VISUAL_LIBRARY_PATHS.artBotanical,
  compFocal: VISUAL_LIBRARY_PATHS.focalComparison,
  compLight: VISUAL_LIBRARY_PATHS.lightComparison,
  territory: VISUAL_LIBRARY_PATHS.photoTerritory,
  composition: VISUAL_LIBRARY_PATHS.compCinematography,
  videoRig: VISUAL_LIBRARY_PATHS.camRigStudio,
  compJson: VISUAL_LIBRARY_PATHS.colorJsonTransfer,
  hybrid: VISUAL_LIBRARY_PATHS.artHybridOrganism,
  // Nuevos recursos dedicados .webp
  fashion: VISUAL_LIBRARY_PATHS.photoFashion,
  architecture: VISUAL_LIBRARY_PATHS.photoArchitecture,
  street: VISUAL_LIBRARY_PATHS.photoDocumentaryStreet,
  splash: VISUAL_LIBRARY_PATHS.adSplash,
  floating: VISUAL_LIBRARY_PATHS.adFloating,
  beauty: VISUAL_LIBRARY_PATHS.adBeauty,
  butterfly: VISUAL_LIBRARY_PATHS.lightButterfly,
  rembrandt: VISUAL_LIBRARY_PATHS.lightRembrandt,
  split: VISUAL_LIBRARY_PATHS.lightSplit,
  rim: VISUAL_LIBRARY_PATHS.lightRim,
  highkey: VISUAL_LIBRARY_PATHS.lightHighKey,
  focal14: VISUAL_LIBRARY_PATHS.focal14mm,
  focal24: VISUAL_LIBRARY_PATHS.focal24mm,
  focal50: VISUAL_LIBRARY_PATHS.focal50mm,
  focal85: VISUAL_LIBRARY_PATHS.focal85mm,
  focal100: VISUAL_LIBRARY_PATHS.focal100mmMacro,
  focal135: VISUAL_LIBRARY_PATHS.focal135mm,
  rangefinder: VISUAL_LIBRARY_PATHS.camRangefinder,
  cinemaRig: VISUAL_LIBRARY_PATHS.camCinemaRig,
  ews: VISUAL_LIBRARY_PATHS.compExtremeWide,
  lowAngle: VISUAL_LIBRARY_PATHS.compLowAngle,
  birdsEye: VISUAL_LIBRARY_PATHS.compBirdsEye,
  ots: VISUAL_LIBRARY_PATHS.compOverShoulder,
  dutch: VISUAL_LIBRARY_PATHS.compDutchAngle,
  leading: VISUAL_LIBRARY_PATHS.compLeadingLines,
  tealOrange: VISUAL_LIBRARY_PATHS.colorTealOrange,
  portra: VISUAL_LIBRARY_PATHS.colorKodakPortra,
  eterna: VISUAL_LIBRARY_PATHS.colorFujifilmEterna,
  bleach: VISUAL_LIBRARY_PATHS.colorBleachBypass,
  duotone: VISUAL_LIBRARY_PATHS.colorDuotone,
  mapping: VISUAL_LIBRARY_PATHS.vfxProjectionMapping,
  sculpture3d: VISUAL_LIBRARY_PATHS.anim3dSculpture,
  worldCity: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
};

export const WORKSHOP_ROUTE = [
  {
    step: '01',
    name: 'Escuchar',
    question: '¿Qué queremos decir, recordar o imaginar?',
    action: 'Definir la intención cultural, territorial o poética antes de abrir la herramienta de IA.',
  },
  {
    step: '02',
    name: 'Enfocar',
    question: '¿Quién, dónde, con qué lenguaje y para quién?',
    action: 'Aterrizar sujeto, entorno, referente visual, luz, encuadre y límites éticos o formales.',
  },
  {
    step: '03',
    name: 'Experimentar',
    question: '¿Qué cambia si ajusto una sola variable a la vez?',
    action: 'Probar variaciones controladas (cambiar solo lente o solo iluminación) para entender el modelo.',
  },
  {
    step: '04',
    name: 'Crear',
    question: '¿Qué pieza funciona como serie, relato o afiche?',
    action: 'Consolidar series coherentes manteniendo paleta, escala y criterio visual.',
  },
  {
    step: '05',
    name: 'Activar',
    question: '¿Cómo dialoga la imagen con el mundo real?',
    action: 'Llevar las piezas a exposición, fanzine, memoria barrial, clase o prototipo multimedia.',
  },
];

export const IMAGE_REVIEW_CRITERIA = [
  '¿La imagen dialoga con la idea original o se volvió genérica?',
  '¿La composición ayuda a leer la escena con claridad y jerarquía?',
  '¿Hay clichés visuales, brillos falsos o estereotipos que conviene corregir?',
  '¿La luz, el color y los materiales tienen coherencia física y cultural?',
  '¿Los detalles (manos, objetos, arquitectura, territorio) son creíbles?',
  '¿Qué habría que ajustar en una sola variable del prompt para mejorarla?',
];

export const MODULES_01_TO_05_ENTRIES: LibraryEntry[] = [
  // =========================================================================
  // MÓDULO 01 — GENERACIÓN DE IMÁGENES
  // A. Ilustración y creación artística
  // =========================================================================
  {
    id: 'm1-ilustracion-botanica',
    moduleId: 'mod-01',
    title: 'Ilustración botánica y científica',
    category: 'Ilustración y creación artística',
    subcategory: 'A. Ilustración y creación artística',
    description:
      'Láminas detalladas de flora, semillas, raíces y anatomía natural sobre papel algodón envejecido con rigor observacional.',
    explanation:
      'Combina trazo fino de tinta sepia, veladuras de acuarela translúcida y observación científica de nervaduras, estambres y ciclos vitales. Ideal para herbario contemporáneo, educación ambiental y archivos territoriales.',
    visual_examples: [
      'Lámina de helecho andino con corte transversal de esporas',
      'Cuaderno de campo naturalista sobre papel verjurado crema',
      'Catálogo de flora nativa sin tipografía artificial',
    ],
    image: IMG.botanical,
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#FAF4E6', '#3A5A40', '#A3B18A', '#7F4F24'] },
    technical_terms: ['Botanical plate', 'Watercolor wash', 'Fine ink linework', 'Cotton rag paper'],
    prompt_examples: {
      es: 'Ilustración botánica científica de una orquídea andina con raíces aéreas y sección de semilla, tinta sepia fina y acuarela translúcida sobre papel de algodón marfil, iluminación cenital suave de taller, sin textos ni sellos.',
      en: 'Scientific botanical illustration of an Andean orchid with aerial roots and seed cross-section, fine sepia ink linework and translucent watercolor washes on warm ivory cotton rag paper, soft overhead studio light, no text or labels.',
    },
    builderPatch: {
      mode: 'photo',
      genre: '/fineart',
      visualStyle: 'Ilustración Botánica Científica',
      colorPalette: 'Mineral earth tones, terracotta, warm sand and sun-baked ochre',
    },
    related_topics: ['m1-ilustracion-tinta-grabado', 'm1-organismos-hibridos', 'm1-taller-animal-territorio'],
    difficulty: 'Básico',
    tags: ['botánica', 'acuarela', 'tinta', 'científica', 'ilustración'],
    source: 'Núcleo Colectivo · Biblioteca de Prompts',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-ilustracion-editorial',
    moduleId: 'mod-01',
    title: 'Ilustración editorial y conceptual',
    category: 'Ilustración y creación artística',
    subcategory: 'A. Ilustración y creación artística',
    description:
      'Metáforas visuales de alto impacto pensadas para revistas culturales, ensayos periodísticos y portadas de opinión.',
    explanation:
      'A diferencia de la ilustración decorativa, la editorial sintetiza una idea compleja mediante contraste simbólico, economía de elementos y composición limpia con espacio negativo para lectura rápida.',
    visual_examples: [
      'Figura humana abriendo una puerta hacia un paisaje interior de libros',
      'Siluetas geométricas con textura de risografía a tres tintas',
      'Editorial minimalista sobre papel mate de revista',
    ],
    image: IMG.artwork,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'negative-space' },
    technical_terms: ['Editorial metaphor', 'Conceptual minimalism', 'Risograph grain', 'Negative space'],
    prompt_examples: {
      es: 'Ilustración editorial conceptual sobre la memoria digital: una biblioteca flotante suspendida sobre un archivo de tarjetas perforadas, estilo pictórico mate con textura de papel impreso y paleta ocre, cobalto y carbón, composición centrada con amplio espacio negativo.',
      en: 'Conceptual editorial illustration about digital memory: a floating archive suspended over punched cards, matte painterly style with printed paper grain, ochre, cobalt and charcoal palette, balanced composition with generous negative space.',
    },
    builderPatch: { genre: '/fineart', visualStyle: 'Ilustración Editorial Conceptual' },
    related_topics: ['m1-collage-surrealista', 'm1-diseno-carteles', 'm5-espacio-negativo'],
    difficulty: 'Intermedio',
    tags: ['editorial', 'metáfora', 'prensa', 'concepto'],
    source: 'Núcleo Colectivo · Biblioteca de Prompts',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-ilustracion-tinta-grabado',
    moduleId: 'mod-01',
    title: 'Dibujo a tinta, carboncillo y grabado',
    category: 'Ilustración y creación artística',
    subcategory: 'A. Ilustración y creación artística',
    description:
      'Técnicas gráficas de trazo expresivo: plumilla, achurado (cross-hatching), xilografía, aguafuerte y carboncillo sobre grano grueso.',
    explanation:
      'Al especificar el tipo de matriz (xilografía en madera, aguafuerte en cobre o carbón vegetal sobre papel Canson), el modelo evita el aspecto digital liso y construye volumen mediante tramas, reservas blancas y mordidas de tinta.',
    visual_examples: [
      'Grabado xilográfico de montaña nocturna con gubia marcada',
      'Retrato en carboncillo con difuminado y luces de goma maleable',
      'Dibujo arquitectónico a tinta china con achurado cruzado',
    ],
    image: IMG.noir,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -90, fillLevel: 'none', contrast: 'extreme' },
    technical_terms: ['Woodcut printmaking', 'Etching cross-hatching', 'Charcoal chiaroscuro', 'India ink'],
    prompt_examples: {
      es: 'Grabado artesanal en xilografía e impresión a una tinta negra sobre papel crema artesanal, taller de imprenta antiguo iluminado por una lámpara colgante, trazo de gubia marcado y alto contraste dramático.',
      en: 'Hand-carved woodcut printmaking artwork in dense black ink on artisanal cream paper, old printmaking workshop illuminated by a single pendant lamp, visible gouge marks and dramatic chiaroscuro.',
    },
    builderPatch: {
      genre: '/fineart',
      visualStyle: 'Xilografía & Grabado',
      colorPalette: 'Pure silver gelatin monochrome with deep contrast and rich midtones',
    },
    related_topics: ['m1-ilustracion-botanica', 'm3-chiaroscuro', 'm1-oleo-acuarela'],
    difficulty: 'Básico',
    tags: ['tinta', 'grabado', 'xilografía', 'carboncillo', 'dibujo'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-oleo-acuarela',
    moduleId: 'mod-01',
    title: 'Acuarela, óleo y dibujo conceptual',
    category: 'Ilustración y creación artística',
    subcategory: 'A. Ilustración y creación artística',
    description:
      'Materialidad pictórica tradicional: empaste al óleo con espátula, aguadas húmedo-sobre-húmedo en acuarela y bocetos conceptuales de preproducción.',
    explanation:
      'Nombrar el soporte (lino crudo, papel 300g prensado en frío), el gesto de la pincelada (impasto grueso vs veladura transparente) y la dirección de la luz evita acabados plásticos genéricos.',
    visual_examples: [
      'Bodegón al óleo con pincelada visible e impasto en luces altas',
      'Paisaje atmosférico en acuarela con bordes suaves y sangrado de pigmento',
      'Boceto conceptual arquitectónico con marcadores y lápiz grafito',
    ],
    image: IMG.botanical,
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#264653', '#2A9D8F', '#E9C46A', '#E76F51'] },
    technical_terms: ['Thick oil impasto', 'Wet-on-wet watercolor', 'Concept art speedpaint', 'Raw linen canvas'],
    prompt_examples: {
      es: 'Pintura al óleo contemporánea sobre lienzo de lino crudo: escena costera al atardecer con pinceladas anchas de espátula, empaste táctil en los reflejos del agua y sombras violáceas frías.',
      en: 'Contemporary oil painting on raw linen canvas: coastal scene at dusk with expressive palette knife brushstrokes, tactile impasto highlights on water reflections and cool violet shadows.',
    },
    builderPatch: { genre: '/fineart', visualStyle: 'Óleo Contemporáneo' },
    related_topics: ['m1-ilustracion-botanica', 'm1-ilustracion-tinta-grabado'],
    difficulty: 'Básico',
    tags: ['óleo', 'acuarela', 'pintura', 'boceto', 'impasto'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-collage-surrealista',
    moduleId: 'mod-01',
    title: 'Collage analógico y surrealista',
    category: 'Ilustración y creación artística',
    subcategory: 'A. Ilustración y creación artística',
    description:
      'Recortes físicos de revistas impresas, grabados decimonónicos, texturas de papel rasgado y yuxtaposiciones poéticas fuera de escala.',
    explanation:
      'El secreto del collage analógico en IA radica en describir imperfecciones físicas: bordes cortados con tijera o rasgados a mano, sombras sutiles de papel superpuesto, trama de impresión halftone y cinta adhesiva translúcida.',
    visual_examples: [
      'Collage dadaísta con recortes botánicos, relojes y arquitectura brutalista',
      'Fotomontaje analógico en papel satinado de los años 70 con textura de revista',
    ],
    image: IMG.generative,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'depth-layers' },
    technical_terms: ['Analog cut-paper collage', 'Torn paper edges', 'Halftone print texture', 'Dadaist juxtaposition'],
    prompt_examples: {
      es: 'Collage analógico surrealista hecho con recortes de revistas impresas de los años setenta y papel kraft rasgado a mano: una escalera que asciende desde un mapa topográfico hacia una luna de cerámica, sombras sutiles entre capas de papel y trama de impresión offset.',
      en: 'Surrealist analog cut-paper collage made from 1970s printed magazine cutouts and hand-torn kraft paper: a staircase rising from a topographic map into a ceramic moon, subtle drop shadows between paper layers and offset halftone texture.',
    },
    builderPatch: { genre: '/fineart', visualStyle: 'Collage Analógico Surrealista' },
    related_topics: ['m1-mundos-surrealismo', 'm1-diseno-carteles', 'm1-ilustracion-editorial'],
    difficulty: 'Intermedio',
    tags: ['collage', 'surrealismo', 'recorte', 'papel', 'analógico'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-arte-abstracto-generativo',
    moduleId: 'mod-01',
    title: 'Arte abstracto, geométrico, minimalista y generativo',
    category: 'Ilustración y creación artística',
    subcategory: 'A. Ilustración y creación artística',
    description:
      'Sistemas visuales basados en ritmo, repetición matemática, campos de color, geometría sagrada, código algorítmico y pixel art.',
    explanation:
      'Agrupa lenguajes no figurativos desde la abstracción geométrica y minimalista hasta el arte generativo con partículas, líneas de flujo (flow fields) y pixel art retro de 16 bits con paleta indexada.',
    visual_examples: [
      'Campos de partículas generativas en alta resolución tipo instalación lumínica',
      'Composición geométrica constructivista en terracota, crema y negro carbón',
      'Escena pixel art isométrica de laboratorio creativo con iluminación nocturna',
    ],
    image: IMG.generative,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'symmetry' },
    technical_terms: ['Generative flow fields', 'Geometric abstraction', 'Color field minimalism', 'Isometric pixel art'],
    prompt_examples: {
      es: 'Arte generativo contemporáneo basado en campos de flujo algorítmicos y filamentos luminosos de vidrio translúcido sobre fondo mineral oscuro, simetría orgánica y precisión de instalación museográfica.',
      en: 'Contemporary generative art built from algorithmic flow fields and translucent glass-like luminous filaments over a deep mineral backdrop, organic mathematical symmetry, museum-grade installation aesthetic.',
    },
    builderPatch: { genre: '/generativeart', visualStyle: 'Arte Generativo Algorítmico' },
    related_topics: ['m1-arte-3d-escultura', 'm1-arte-tecnologia', 'm6-animacion-generativa'],
    difficulty: 'Intermedio',
    tags: ['abstracto', 'geométrico', 'minimalista', 'generativo', 'pixel art'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-arte-3d-escultura',
    moduleId: 'mod-01',
    title: 'Cómic, novela gráfica, escultura digital y arte 3D',
    category: 'Ilustración y creación artística',
    subcategory: 'A. Ilustración y creación artística',
    description:
      'Narrativa secuencial en viñetas, modelado escultórico de precisión (ZBrush/Blender) y materiales físicamente realistas (subsurface scattering, cerámica, bronce).',
    explanation:
      'Para cómic y novela gráfica conviene definir la escuela visual (línea clara franco-belga, manga entintado, noir estadounidense). Para arte 3D y escultura digital es clave nombrar el material, la rugosidad superficial y el motor de luz suave sin brillos exagerados.',
    visual_examples: [
      'Viñeta de novela gráfica línea clara con sombras en tinta plana',
      'Escultura digital contemporánea en mármol travertino y latón cepillado',
    ],
    image: IMG.sculpture3d,
    aspectRatio: '3:2',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -45, fillLevel: 'medium', rimActive: true },
    technical_terms: ['Ligne claire comic', 'Digital sculpting', 'Subsurface scattering', 'Matte ceramic shader'],
    prompt_examples: {
      es: 'Escultura digital contemporánea de formas orgánicas entrelazadas en cerámica mate porosa y bronce envejecido, iluminada con luz lateral suave en sala museográfica minimalista de concreto pulido.',
      en: 'Contemporary digital sculpture of intertwined organic forms crafted in porous matte ceramic and aged bronze, softly sidelit inside a minimalist polished concrete museum gallery.',
    },
    builderPatch: { genre: '/fineart', visualStyle: 'Escultura Digital Museográfica' },
    related_topics: ['m1-arte-abstracto-generativo', 'm6-arte-museografia'],
    difficulty: 'Intermedio',
    tags: ['cómic', 'novela gráfica', '3D', 'escultura', 'arte conceptual'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },

  // B. Fotografía
  {
    id: 'm1-foto-retrato',
    moduleId: 'mod-01',
    title: 'Retrato editorial, cinematográfico y corporativo',
    category: 'Fotografía',
    subcategory: 'B. Fotografía',
    description:
      'Estudios de rostro y presencia humana: desde la intimidad psicológica del retrato editorial hasta la narrativa fílmica y la sobriedad institucional.',
    explanation:
      'Un buen prompt de retrato evita pedir "belleza genérica" y describe postura, dirección de mirada, textura cutánea auténtica (poros, líneas de expresión, vello) y relación óptica entre sujeto y fondo.',
    visual_examples: [
      'Retrato editorial de revista cultural en luz de ventana',
      'Retrato cinematográfico nocturno con neón cálido y sombra profunda',
      'Retrato institucional sobrio sobre fondo neutro texturizado',
    ],
    image: IMG.beauty,
    aspectRatio: '3:4',
    objectPosition: 'top',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -45, fillLevel: 'low', rimActive: true, contrast: 'high' },
    technical_terms: ['Editorial portrait', 'Cinematic headshot', 'Visible skin pores', 'Catchlights in eyes'],
    prompt_examples: {
      es: 'Retrato editorial de una directora de cine de 45 años en su estudio, expresión serena y mirada directa a cámara, textura real de piel con poros visibles, luz suave de ventana lateral izquierda, lente 85mm f/2.0.',
      en: 'Editorial portrait of a 45-year-old film director in her studio, calm expression looking directly into the lens, authentic skin texture with visible pores, soft left window sidelight, 85mm f/2.0.',
    },
    builderPatch: {
      mode: 'photo',
      genre: '/editorial',
      lens: '85mm portrait prime lens',
      aperture: 'f/1.8 creamy bokeh',
      lighting: 'Rembrandt lighting, directional light with cheek triangle',
    },
    related_topics: ['m3-rembrandt', 'm2-lente-85mm', 'm5-primer-plano'],
    difficulty: 'Básico',
    tags: ['retrato', 'editorial', 'cinematográfico', 'corporativo', 'piel'],
    source: 'Núcleo Colectivo · Guía Parte 1',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-foto-moda-publicidad',
    moduleId: 'mod-01',
    title: 'Fotografía de moda, publicitaria y producto',
    category: 'Fotografía',
    subcategory: 'B. Fotografía',
    description:
      'Dirección de arte comercial de alta gama enfocada en caída de textiles, reflejos controlados sobre vidrio o metal y escenografía de estudio.',
    explanation:
      'Exige describir el material exacto del objeto o prenda (lino pesado, vidrio esmerilado, metal cepillado), la superficie de apoyo (basalto, travertino, acrílico) y la calidad de la luz (softbox difuso o recorte duro de estudio).',
    visual_examples: [
      'Bodegón de frasco de perfume sobre piedra volcánica húmeda',
      'Editorial de moda en arquitectura brutalista con sombra dura de mediodía',
    ],
    image: IMG.fashion,
    aspectRatio: '3:4',
    objectPosition: 'top',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: 45, fillLevel: 'medium', rimActive: true },
    technical_terms: ['High-fashion editorial', 'Commercial still life', 'Specular highlight control', 'Tactile textiles'],
    prompt_examples: {
      es: 'Fotografía publicitaria de producto de lujo: frasco escultórico de vidrio ámbar sobre roca basáltica negra con finas gotas de condensación, iluminación controlada con softbox lateral y luz de recorte posterior, estética editorial minimalista.',
      en: 'Luxury commercial product photography: sculptural amber glass bottle resting on dark basalt stone with fine condensation droplets, controlled softbox side lighting and crisp rim light, minimalist editorial aesthetic.',
    },
    builderPatch: {
      mode: 'photo',
      genre: '/premiumshowcase',
      camera: 'Hasselblad X2D (Medio Formato)',
      lens: '100mm macro f/2.8 lens',
      aperture: 'f/8 sharp commercial focus',
      lighting: 'Large diffused studio softbox with silver bounce fill',
    },
    related_topics: ['m1-foto-macro-gastronomia', 'm2-formato-medio', 'm3-rim-edge'],
    difficulty: 'Intermedio',
    tags: ['moda', 'publicidad', 'producto', 'lujo', 'estudio'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-foto-documental-street',
    moduleId: 'mod-01',
    title: 'Fotografía documental, urbana y street photography',
    category: 'Fotografía',
    subcategory: 'B. Fotografía',
    description:
      'Captura espontánea de la vida cotidiana, la arquitectura barrial, los oficios y el instante decisivo sin poses artificiales.',
    explanation:
      'Funciona mejor con focales de reportaje (28mm o 35mm), luz ambiente disponible (hora azul, farolas de sodio, neblina matinal) y momentos cotidianos reales evitando poses de estudio.',
    visual_examples: [
      'Ladera urbana de Medellín al amanecer con vida cotidiana en escalinatas',
      'Mercado nocturno bajo lluvia ligera con reflejos en pavimento',
    ],
    image: IMG.street,
    aspectRatio: '3:2',
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 35 },
    technical_terms: ['Candid street photography', 'Documentary storytelling', 'Available ambient light', '35mm reportage'],
    prompt_examples: {
      es: 'Fotografía documental callejera en 35mm: carpintero abriendo su taller al amanecer en un barrio de ladera latinoamericano, niebla matinal ligera, luz cálida del sol naciente cruzando la calle, captura espontánea sin poses.',
      en: '35mm documentary street photography: a carpenter opening his workshop at dawn in a Latin American hillside neighborhood, light morning mist, warm early sunbeams crossing the street, candid unposed moment.',
    },
    builderPatch: {
      mode: 'photo',
      genre: '/documentary',
      camera: 'Leica M11 (Rangefinder 35mm)',
      lens: '35mm prime lens',
      colorPalette: 'Kodak Portra 400 film emulation, natural skin tones and gentle grain',
    },
    related_topics: ['m1-memoria-territorio', 'm2-lente-35mm', 'm4-kodak-portra'],
    difficulty: 'Básico',
    tags: ['documental', 'urbana', 'street', 'reportaje', 'cotidiano'],
    source: 'Núcleo Colectivo · Biblioteca de Prompts',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-foto-arquitectura-interiores',
    moduleId: 'mod-01',
    title: 'Fotografía arquitectónica, interiores, paisaje y naturaleza',
    category: 'Fotografía',
    subcategory: 'B. Fotografía',
    description:
      'Rigor geométrico en verticales, lectura espacial de luz en interiores y vastedad atmosférica en paisajes naturales.',
    explanation:
      'Para arquitectura e interiores es fundamental indicar líneas verticales rectas (perspectiva corregida / tilt-shift) y la hora del día. Para paisajes, indicar capas de profundidad (primer plano, plano medio y horizonte con bruma atmosférica).',
    visual_examples: [
      'Pabellón cultural de concreto visto y madera con luz geométrica oblicua',
      'Interior minimalista con ventanal al bosque nublado',
    ],
    image: IMG.architecture,
    aspectRatio: '3:2',
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'leading-lines' },
    technical_terms: ['Architectural photography', 'Corrected verticals', 'Interior daylighting', 'Atmospheric layers'],
    prompt_examples: {
      es: 'Fotografía arquitectónica de un centro cultural contemporáneo en concreto y ladrillo a la vista, líneas verticales perfectamente rectas, gran angular 24mm, luz solar oblicua de media tarde proyectando sombras geométricas sobre el patio interior.',
      en: 'Architectural photography of a contemporary cultural center in raw concrete and exposed brick, perfectly straight vertical lines, 24mm wide-angle tilt-shift perspective, late afternoon oblique sunlight casting geometric shadows across the courtyard.',
    },
    builderPatch: {
      mode: 'photo',
      genre: '/architecture',
      lens: '24mm wide angle lens',
      aperture: 'f/11 deep focus',
    },
    related_topics: ['m2-optica-tilt-shift', 'm5-lineas-guia', 'm5-gran-plano-general'],
    difficulty: 'Intermedio',
    tags: ['arquitectura', 'interiores', 'paisaje', 'naturaleza', 'verticales'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-foto-macro-gastronomia',
    moduleId: 'mod-01',
    title: 'Fotografía macro, gastronómica, nocturna, deportiva y experimental',
    category: 'Fotografía',
    subcategory: 'B. Fotografía',
    description:
      'Especialidades técnicas extremas: acercamiento microscópico, texturas culinarias, larga exposición nocturna, congelación de acción y experimentación óptica.',
    explanation:
      'Cada especialidad responde a un parámetro físico clave: macro (100mm f/2.8 y foco milimétrico), deporte (obturación rápida 1/2000s), nocturna (exposición prolongada o ISO alto con halos reales), experimental (doble exposición, prisma de cristal o barrido intencional).',
    visual_examples: [
      'Macro de gota de rocío y fibras textiles bajo luz rasante',
      'Plato artesanal en mesa de madera rústica con vapor sutil y luz lateral de ventana',
      'Fotografía experimental con doble exposición entre rostro y follaje',
    ],
    image: IMG.focal100,
    aspectRatio: '3:2',
    diagramType: 'aperture-dof',
    diagramConfig: { fStop: 2.8 },
    technical_terms: ['Macro 1:1 magnification', 'Food styling daylight', 'Long exposure light trails', 'Double exposure'],
    prompt_examples: {
      es: 'Fotografía macro extrema de textura botánica sobre corteza húmeda con esporas doradas, lente macro 100mm, profundidad de campo de milímetros, luz lateral rasante que revela cada relieve microscópico.',
      en: 'Extreme macro photography of damp tree bark texture with golden moss spores, 100mm macro lens, razor-thin millimeter depth of field, raking side light revealing every microscopic relief.',
    },
    builderPatch: {
      mode: 'photo',
      genre: '/macro',
      lens: '100mm macro f/2.8 lens',
      aperture: 'f/2.8 aperture',
    },
    related_topics: ['m2-lente-105mm', 'm2-param-obturacion', 'm1-foto-moda-publicidad'],
    difficulty: 'Intermedio',
    tags: ['macro', 'gastronómica', 'nocturna', 'deportiva', 'experimental', 'eventos'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },

  // C. Diseño gráfico y publicidad
  {
    id: 'm1-diseno-carteles',
    moduleId: 'mod-01',
    title: 'Campañas publicitarias, carteles experimentales y portadas',
    category: 'Diseño gráfico y publicidad',
    subcategory: 'C. Diseño gráfico y publicidad',
    description:
      'Piezas gráficas de alto impacto visual para festivales culturales, exposiciones de arte, portadas editoriales y vallas urbanas.',
    explanation:
      'Cuando generes carteles o portadas, indica explícitamente la jerarquía de espacio libre para titular posteriormente en diseño editorial (ej. "amplio margen superior despejado para tipografía") o pide ausencia de texto deformado si lo maquetarás en Figma/Illustrator.',
    visual_examples: [
      'Valla publicitaria nocturna en vía urbana con pantalla LED de alta luminancia',
      'Afiche cultural serigráfico con formas suizas y contraste en dos tintas',
    ],
    image: IMG.billboard,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'thirds' },
    technical_terms: ['Poster art direction', 'Clean copy space', 'Swiss grid aesthetic', 'Urban OOH campaign'],
    prompt_examples: {
      es: 'Cartel experimental para festival de arte sonoro y tecnología, composición gráfica geométrica en papel mate grueso color hueso con formas abstractas en bermellón y negro profundo, amplio espacio superior limpio sin texto inventado.',
      en: 'Experimental poster art direction for a sound art and technology festival, geometric graphic composition on heavy off-white matte stock with vermilion and deep charcoal abstract forms, clean upper negative space with no artificial text.',
    },
    builderPatch: { genre: '/editorial', visualStyle: 'Cartel Experimental & Dirección de Arte' },
    related_topics: ['m1-diseno-branding-packaging', 'm1-taller-afiche-cultural'],
    difficulty: 'Básico',
    tags: ['carteles', 'campañas', 'portadas', 'publicidad', 'dirección de arte'],
    source: 'Núcleo Colectivo · Biblioteca de Prompts',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-diseno-branding-packaging',
    moduleId: 'mod-01',
    title: 'Branding, identidad visual, packaging y mockups',
    category: 'Diseño gráfico y publicidad',
    subcategory: 'C. Diseño gráfico y publicidad',
    description:
      'Aplicaciones táctiles de marca: empaques sostenibles en cartón reciclado, papel timbrado, fotomontajes comerciales y mockups en contexto real.',
    explanation:
      'Para que un mockup parezca una fotografía real y no un render estéril, sitúa el empaque sobre una superficie orgánica (mesa de estudio con luz de ventana) e incluye defectos reales como relieve en seco (debossing) o textura de fibra del cartón.',
    visual_examples: [
      'Mockup de libro editorial abierto sobre mesa de roble con luz matinal',
      'Empaque de café de origen en papel kraft sellado sobre mostrador de terrazo',
    ],
    image: IMG.floating,
    aspectRatio: '3:4',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -60, fillLevel: 'high', contrast: 'low' },
    technical_terms: ['Tactile packaging', 'Blind debossing', 'Studio mockup', 'Brand collateral'],
    prompt_examples: {
      es: 'Mockup fotográfico de identidad visual para marca cultural: libreta de pasta dura en tela de lino crudo con relieve seco sin tinta, acompañada de tarjetas impresas en papel algodón sobre mesa de madera clara con sombra suave de ventana.',
      en: 'Photographic brand identity mockup for a cultural studio: hardcover notebook bound in raw linen cloth with blind debossed cover, paired with cotton paper stationery on a light oak studio table under soft window shadow.',
    },
    builderPatch: { genre: '/premiumshowcase', visualStyle: 'Branding & Packaging Táctil' },
    related_topics: ['m1-diseno-carteles', 'm1-foto-moda-publicidad'],
    difficulty: 'Intermedio',
    tags: ['branding', 'packaging', 'mockup', 'fotomontaje', 'anuncios'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },

  // D. Mundos imaginarios y territorio
  {
    id: 'm1-mundos-surrealismo',
    moduleId: 'mod-01',
    title: 'Surrealismo, fantasía y paisajes imaginarios',
    category: 'Mundos imaginarios y experimentación',
    subcategory: 'D. Mundos imaginarios y territorio',
    description:
      'Arquitecturas oníricas, escalas imposibles y territorios poéticos tratados con verosimilitud fotográfica y coherencia física de la luz.',
    explanation:
      'La paradoja del buen surrealismo es que cuanto más imposible sea la escena (ej. una casa colonial flotando entre niebla de páramo), más realista y sobria debe describirse la luz y la textura del aire para que resulte convincente.',
    visual_examples: [
      'Paisaje de páramo andino donde nubes densas entran por ventanas de una ruina antigua',
      'Escenario inmersivo de espejos líquidos bajo cielo crepuscular',
    ],
    image: IMG.artwork,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'depth-layers' },
    technical_terms: ['Photorealistic surrealism', 'Dreamscape architecture', 'Atmospheric perspective', 'Impossible scale'],
    prompt_examples: {
      es: 'Escena surrealista fotorrealista: una escalera de piedra antigua emerge de una laguna de páramo completamente quieta y sube hacia una nube baja iluminada por el alba, niebla sutil, colores sobrios de museo y gran profundidad atmosférica.',
      en: 'Photorealistic surrealist scene: an ancient stone staircase emerging from a mirror-still highland lagoon ascending into a low dawn-lit cloud, subtle mist, muted museum-grade tones and deep atmospheric perspective.',
    },
    builderPatch: { genre: '/fineart', visualStyle: 'Surrealismo Fotográfico' },
    related_topics: ['m1-collage-surrealista', 'm1-organismos-hibridos'],
    difficulty: 'Intermedio',
    tags: ['surrealismo', 'fantasía', 'paisajes imaginarios', 'inmersivo'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-scifi-cyberpunk-retro',
    moduleId: 'mod-01',
    title: 'Ciencia ficción, cyberpunk, retrofuturismo y ciudades del futuro',
    category: 'Mundos imaginarios y experimentación',
    subcategory: 'D. Mundos imaginarios y territorio',
    description:
      'Especulación tecnológica y urbana: desde el retrofuturismo analógico de los años 70 hasta ecociudades y arquitectura especulativa habitable.',
    explanation:
      'Evita el cliché genérico de neón rosa/azul pidiendo arquitectura especulativa concreta: materiales (hormigón verde, cobre oxidado, paneles translúcidos solares), clima (lluvia tropical o polvo solar) y vida humana en la calle.',
    visual_examples: [
      'Arquitectura especulativa bioclimática integrada en montaña tropical',
      'Laboratorio retrofuturista de 1978 con consolas analógicas y luz cálida de tungsteno',
    ],
    image: IMG.worldCity,
    aspectRatio: '16:9',
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#0B132B', '#1C2541', '#5BC0BE', '#F4A261'] },
    technical_terms: ['Speculative architecture', 'Solarpunk / Biopunk', 'Cassette retrofuturism', 'Atmospheric sci-fi'],
    prompt_examples: {
      es: 'Arquitectura especulativa de una ciudad futura andina bioclimática: torres escalonadas de madera laminada y jardines verticales suspendidos sobre puentes peatonales, niebla matinal entre montañas, luz natural suave y escala humana realista.',
      en: 'Speculative architecture of a bioclimatic future Andean city: terraced cross-laminated timber towers and vertical hanging gardens connected by pedestrian skybridges, morning mountain mist, soft natural daylight and realistic human scale.',
    },
    builderPatch: { genre: '/architecture', visualStyle: 'Arquitectura Especulativa' },
    related_topics: ['m1-organismos-hibridos', 'm1-arte-tecnologia'],
    difficulty: 'Intermedio',
    tags: ['ciencia ficción', 'cyberpunk', 'retrofuturismo', 'ciudades del futuro', 'especulativa'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-organismos-hibridos',
    moduleId: 'mod-01',
    title: 'Biopunk y organismos híbridos especulativos',
    category: 'Mundos imaginarios y experimentación',
    subcategory: 'D. Mundos imaginarios y territorio',
    description:
      'Fusión de biología vegetal, micelio, minerales y estructuras sintéticas en clave de diseño especulativo y arte-ciencia.',
    explanation:
      'Inspirado en la ilustración científica y el diseño biofílico, describe membranas translúcidas, micelio bioluminiscente sutil y simbiosis entre flora nativa y dispositivos de observación.',
    visual_examples: [
      'Organismo híbrido entre orquídea, coral translúcido y circuito de cobre fino',
      'Lámina de especulación biopunk sobre fondo neutro de laboratorio',
    ],
    image: IMG.hybrid,
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#1B4332', '#52B788', '#D8F3DC', '#E09F3E'] },
    technical_terms: ['Biopunk aesthetic', 'Hybrid botanical organism', 'Translucent membrane', 'Bio-art specimen'],
    prompt_examples: {
      es: 'Ilustración de arte-ciencia sobre organismo híbrido biopunk: simbiosis entre helecho luminoso, micelio cristalino y filamentos delicados de latón oxidado, estética de gabinete de curiosidades contemporáneo sobre fondo papel mineral claro.',
      en: 'Bio-art speculative illustration of a hybrid organism: symbiosis between luminous fern structures, crystalline mycelium and delicate oxidized brass filaments, contemporary cabinet of curiosities aesthetic on pale mineral paper.',
    },
    builderPatch: { genre: '/fineart', visualStyle: 'Biopunk & Bio-Arte' },
    related_topics: ['m1-ilustracion-botanica', 'm1-taller-animal-territorio'],
    difficulty: 'Avanzado',
    tags: ['biopunk', 'organismos híbridos', 'bioarte', 'universos abstractos'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-memoria-territorio',
    moduleId: 'mod-01',
    title: 'Memoria, territorio y creación comunitaria',
    category: 'Mundos imaginarios y experimentación',
    subcategory: 'D. Mundos imaginarios y territorio',
    description:
      'Escenas que honran barrios populares, laderas, casas de tapia o ladrillo, memoria familiar, oficios y vida colectiva sin exotización.',
    explanation:
      'Eje central de los talleres de Núcleo Colectivo: exige precisión cultural, respeto por las arquitecturas locales (ladrillo a la vista, teja de barro, vegetación tropical de ladera) y luz cálida digna que evite estereotipos turísticos o miseria espectacularizada.',
    visual_examples: [
      'Mirador comunitario de ladera al atardecer con vecinos conversando y vegetación nativa',
      'Archivo familiar recreado desde objetos cotidianos de memoria',
    ],
    image: IMG.territory,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'thirds' },
    technical_terms: ['Community memory', 'Territorial documentary', 'Dignified portraiture', 'Local architecture'],
    prompt_examples: {
      es: 'Fotografía documental luminosa de un barrio de ladera en Medellín al atardecer: casas de ladrillo a la vista rodeadas de jardines comunitarios, vecinos conversando frente a un mural colectivo, luz dorada cálida y atmósfera cotidiana auténtica sin artificios.',
      en: 'Warm documentary photography of a hillside neighborhood in Medellín at golden hour: exposed brick homes surrounded by community planters, neighbors conversing beside a collective mural, authentic everyday atmosphere, 35mm lens.',
    },
    builderPatch: {
      mode: 'photo',
      genre: '/documentary',
      lens: '35mm prime lens',
      colorPalette: 'Kodak Portra 400 film emulation, natural skin tones and gentle grain',
    },
    related_topics: ['m1-foto-documental-street', 'm1-taller-barrio-sonado', 'm1-taller-objeto-memoria'],
    difficulty: 'Básico',
    tags: ['memoria', 'territorio', 'comunidad', 'barrio', 'cultura'],
    source: 'Núcleo Colectivo · Biblioteca de Prompts (Área 5)',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-arte-tecnologia',
    moduleId: 'mod-01',
    title: 'Arte, tecnología, instalaciones y laboratorios creativos',
    category: 'Mundos imaginarios y experimentación',
    subcategory: 'D. Mundos imaginarios y territorio',
    description:
      'Visualización de instalaciones lumínicas, proyecciones interactivas, robótica poética y laboratorios ciudadanos de arte-ciencia.',
    explanation:
      'Útil para prototipar montajes expositivos antes de producirlos físicamente: define las dimensiones de la sala, las superficies de proyección (tela translúcida, muro industrial, agua) y la presencia de visitantes interactuando.',
    visual_examples: [
      'Instalación interactiva de hilos de luz y proyección generativa en sala oscura',
      'Laboratorio ciudadano con mesas de electrónica, bocetos y prototipos',
    ],
    image: IMG.mapping,
    aspectRatio: '16:9',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: 180, fillLevel: 'low', rimActive: true },
    technical_terms: ['Interactive installation', 'Projection mapping', 'Media art lab', 'Museum spatial design'],
    prompt_examples: {
      es: 'Vista documental de una instalación interactiva de arte y tecnología en un antiguo galpón cultural: visitantes observan columnas de luz volumétrica proyectadas sobre cortinas de gasa translúcida, reflejos suaves en el suelo pulido, estética expositiva contemporánea.',
      en: 'Documentary view of an interactive media art installation inside a converted industrial gallery: visitors silhouetted gently before volumetric light projections on translucent gauze curtains, subtle floor reflections, contemporary museum aesthetic.',
    },
    builderPatch: { genre: '/artfilm', visualStyle: 'Instalación Arte y Tecnología' },
    related_topics: ['m1-arte-abstracto-generativo', 'm6-arte-museografia'],
    difficulty: 'Intermedio',
    tags: ['instalación', 'tecnología', 'media art', 'laboratorio', 'exposición'],
    source: 'Núcleo Colectivo · Biblioteca de Prompts (Área 6)',
    license: 'CC BY-NC-SA 4.0',
  },

  // E. Talleres y creación situada (PDF 1 & 2)
  {
    id: 'm1-taller-barrio-sonado',
    moduleId: 'mod-01',
    title: 'Taller: Mi barrio soñado y cartografías afectivas',
    category: 'Aplicaciones rápidas para talleres',
    subcategory: 'E. Talleres y creación situada',
    description:
      'Ejercicio participativo de 15 minutos para imaginar transformaciones ecológicas, lúdicas y comunitarias sobre un territorio real.',
    explanation:
      'Permite a comunidades y estudiantes visualizar mejoras urbanas posibles (huertas, bibliotecas abiertas, ríos limpios, movilidad peatonal) manteniendo la identidad arquitectónica y afectiva del lugar.',
    visual_examples: [
      'Calle barrial transformada con huertas comunitarias, sombra de guayacanes y biblioteca al aire libre',
    ],
    image: IMG.territory,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'leading-lines' },
    technical_terms: ['Participatory urbanism', 'Situational prompt', 'Community co-design'],
    prompt_examples: {
      es: 'Fotografía realista y luminosa de una calle barrial latinoamericana transformada colectivamente: casas tradicionales coloridas, huerta urbana comunitaria en terrazas, biblioteca pública abierta bajo árboles floridos, niños y mayores compartiendo el espacio al atardecer.',
      en: 'Warm realistic photography of a collectively transformed Latin American neighborhood street: traditional colorful homes, terraced community urban garden, open-air street library beneath flowering trees, neighbors of all ages sharing golden hour.',
    },
    builderPatch: { genre: '/documentary', visualStyle: 'Cartografía Afectiva Comunitaria' },
    related_topics: ['m1-memoria-territorio', 'm1-taller-objeto-memoria'],
    difficulty: 'Básico',
    tags: ['taller', 'barrio', 'comunidad', 'urbanismo', 'educación'],
    source: 'Núcleo Colectivo · Biblioteca de Prompts (Área 7)',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-taller-animal-territorio',
    moduleId: 'mod-01',
    title: 'Taller: Animal fantástico del territorio y objeto con memoria',
    category: 'Aplicaciones rápidas para talleres',
    subcategory: 'E. Talleres y creación situada',
    description:
      'Dinámicas creativas para jóvenes y adultos: construir seres simbólicos con flora y fauna local, o retratar objetos cargados de historia familiar.',
    explanation:
      'Propone partir de un elemento real (una semilla, una taza desportillada de la abuela, un colibrí de niebla) y traducirlo a ilustración botánica o fotografía íntima en luz de ventana.',
    visual_examples: [
      'Guardián mitológico inspirado en oso andino, helechos de páramo y agua cristalina',
      'Retrato de objeto cotidiano antiguo sobre mesa de madera con luz lateral nostálgica',
    ],
    image: IMG.hybrid,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -45, fillLevel: 'medium' },
    technical_terms: ['Territorial mythology', 'Memory object', 'Window light still life'],
    prompt_examples: {
      es: 'Retrato íntimo de un objeto con memoria: antigua radio de baquelita y cuaderno manuscrito abierto sobre un mantel tejido a mano junto a una ventana con luz suave de mañana, textura cálida documental y nostalgia digna.',
      en: 'Intimate portrait of a memory object: vintage bakelite radio and open handwritten notebook resting on a hand-woven tablecloth beside a soft morning window, warm documentary texture and quiet dignity.',
    },
    builderPatch: { genre: '/editorial', visualStyle: 'Objeto con Memoria' },
    related_topics: ['m1-organismos-hibridos', 'm1-ilustracion-botanica', 'm1-taller-afiche-cultural'],
    difficulty: 'Básico',
    tags: ['taller', 'objeto', 'memoria', 'animal fantástico', 'pedagogía'],
    source: 'Núcleo Colectivo · Biblioteca de Prompts (Área 7)',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm1-taller-afiche-cultural',
    moduleId: 'mod-01',
    title: 'Taller: Mi otro yo, historieta comunitaria y afiche cultural',
    category: 'Aplicaciones rápidas para talleres',
    subcategory: 'E. Talleres y creación situada',
    description:
      'Tres formatos expresivos para procesos formativos: autorretrato simbólico, narrativa en viñetas de barrio y cartel para convocar encuentros.',
    explanation:
      'Cada ejercicio refuerza la estructura de los 7 elementos fundamentales: Sujeto + Acción + Contexto + Estilo + Composición + Iluminación/Color + Límite claro.',
    visual_examples: [
      'Autorretrato editorial rodeado de herramientas de oficio y plantas del hogar',
      'Afiche serigráfico para cine-foro al aire libre en plaza de barrio',
    ],
    image: IMG.analog,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'thirds' },
    technical_terms: ['7-element prompt formula', 'Cultural poster', 'Community comic'],
    prompt_examples: {
      es: 'Afiche cultural en estilo serigrafía contemporánea para un cine-foro comunitario nocturno: proyector antiguo proyectando luz cálida sobre una plaza rodeada de árboles y sillas vecinales, tinta terracota, azul noche y papel crema, espacio limpio arriba para título.',
      en: 'Contemporary screenprint-style cultural poster for a nocturnal community open-air cinema: vintage film projector casting warm beam across a tree-lined plaza with neighborhood chairs, terracotta, midnight blue and cream paper inks, clean top title area.',
    },
    builderPatch: { genre: '/fineart', visualStyle: 'Afiche Serigráfico Cultural' },
    related_topics: ['m1-diseno-carteles', 'm1-taller-barrio-sonado'],
    difficulty: 'Básico',
    tags: ['taller', 'historieta', 'afiche', 'autorretrato', 'pedagogía'],
    source: 'Núcleo Colectivo · Guía Parte 1 & Área 7',
    license: 'CC BY-NC-SA 4.0',
  },

  // =========================================================================
  // MÓDULO 02 — FOTOGRAFÍA TÉCNICA Y EQUIPAMIENTO
  // A. Tipos de cámara
  // =========================================================================
  {
    id: 'm2-cam-dslr-mirrorless',
    moduleId: 'mod-02',
    title: 'Cámaras DSLR y Mirrorless Full Frame',
    category: 'Tipos de cámara',
    subcategory: 'A. Tipos de cámara',
    description:
      'El estándar profesional versátil de 35mm digital: equilibrio entre nitidez clínica, rango dinámico limpio y profundidad de campo controlada.',
    explanation:
      'En prompts de IA, indicar un cuerpo Full Frame moderno (como referencia estética, no requisito obligatorio) orienta al modelo hacia fotografías contemporáneas limpias, enfoque preciso al ojo y reproducción cromática fiel.',
    visual_examples: [
      'Retrato editorial moderno con nitidez cristalina en iris y desenfoque progresivo',
      'Reportaje de evento interior con rango dinámico limpio sin grano excesivo',
    ],
    image: IMG.focal50,
    aspectRatio: '3:2',
    objectPosition: 'top',
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 50 },
    technical_terms: ['Full-frame sensor', 'Mirrorless eye-AF sharpness', 'Clean dynamic range'],
    prompt_examples: {
      es: 'Fotografía editorial contemporánea capturada con estética de cámara mirrorless full frame y lente 50mm f/1.8, enfoque nítido en los ojos, transiciones suaves de luces y sombras.',
      en: 'Contemporary editorial photograph with full-frame mirrorless camera aesthetic and 50mm f/1.8 prime lens, tack-sharp eye focus, clean dynamic range and smooth highlight transitions.',
    },
    builderPatch: { camera: 'Sony A7R V (Full Frame)' },
    related_topics: ['m2-cam-formato-medio', 'm2-marca-sony-canon-nikon'],
    difficulty: 'Básico',
    tags: ['DSLR', 'mirrorless', 'full frame', 'cámara'],
    source: 'Núcleo Colectivo · Módulo Técnico',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-cam-formato-medio',
    moduleId: 'mod-02',
    title: 'Formato Medio y Gran Formato (Placas)',
    category: 'Tipos de cámara',
    subcategory: 'A. Tipos de cámara',
    description:
      'Sensores y placas de gran superficie física que producen una tridimensionalidad singular ("medium format pop"), microcontraste tonal y caída suave de foco.',
    explanation:
      'Indicar formato medio o gran formato es ideal para moda de alta costura, retrato museográfico, arquitectura y bodegón publicitario donde se requiere riqueza de detalle en materiales y sensación escultórica.',
    visual_examples: [
      'Retrato en estudio con separación volumétrica sutil sin desenfoque exagerado',
      'Bodegón arquitectónico de gran detalle en piedra y tela',
    ],
    image: IMG.product,
    diagramType: 'aperture-dof',
    diagramConfig: { fStop: 2.8 },
    technical_terms: ['Medium format pop', 'Large format 4x5', 'Smooth tonal gradation', 'Microcontrast'],
    prompt_examples: {
      es: 'Retrato editorial con estética de cámara de formato medio digital, transición tonal sedosa en la piel, gran detalle en fibras del abrigo de lana y separación tridimensional suave respecto al fondo neutro.',
      en: 'Editorial portrait with digital medium format camera aesthetic, silky tonal gradation on skin, extraordinary micro-detail in wool coat fibers and three-dimensional subject separation against a textured neutral backdrop.',
    },
    builderPatch: { camera: 'Hasselblad X2D (Medio Formato)' },
    related_topics: ['m2-marca-hasselblad-leica', 'm1-foto-moda-publicidad'],
    difficulty: 'Intermedio',
    tags: ['formato medio', 'gran formato', 'hasselblad', 'gfx', 'dimensionalidad'],
    source: 'Núcleo Colectivo · Módulo Técnico',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-cam-analogica-instantanea',
    moduleId: 'mod-02',
    title: 'Cámaras Analógicas 35mm, Instantáneas y Compactas',
    category: 'Tipos de cámara',
    subcategory: 'A. Tipos de cámara',
    description:
      'Estética fotoquímica: grano orgánico de haluro de plata, imperfecciones ópticas de compactas flash-directo o marcos químicos de fotografía instantánea.',
    explanation:
      'Las cámaras analógicas 35mm aportan calidez orgánica y roll-off suave en luces altas; las compactas con flash frontal crean estética documental cruda de los 90; las instantáneas ofrecen contraste nostálgico, viñeteo suave y color ligeramente lavado.',
    visual_examples: [
      'Escena documental en película 35mm con grano visible y sombras cálidas',
      'Retrato espontáneo con cámara compacta y flash directo en evento nocturno',
    ],
    image: IMG.rangefinder,
    aspectRatio: '3:2',
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#D9A05B', '#8C5A3C', '#2B2D42', '#EDF2F4'] },
    technical_terms: ['35mm analog film', 'Instant film look', 'Point-and-shoot direct flash', 'Organic grain'],
    prompt_examples: {
      es: 'Fotografía espontánea con estética de cámara analógica de 35mm, grano fílmico sutil y orgánico, luces altas cremosas sin recorte digital y color ligeramente cálido de recuerdo familiar.',
      en: 'Candid photograph with 35mm analog film camera aesthetic, subtle organic silver-halide grain, creamy highlight roll-off and slightly warm nostalgic color rendition.',
    },
    builderPatch: {
      camera: 'Canon AE-1 (Película 35mm)',
      colorPalette: 'Kodak Portra 400 film emulation, natural skin tones and gentle grain',
    },
    related_topics: ['m4-kodak-portra', 'm1-foto-documental-street'],
    difficulty: 'Básico',
    tags: ['analógica', '35mm', 'instantánea', 'compacta', 'grano'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-cam-cine-accion-movil',
    moduleId: 'mod-02',
    title: 'Cámaras Cinematográficas, de Acción y Smartphone',
    category: 'Tipos de cámara',
    subcategory: 'A. Tipos de cámara',
    description:
      'Tres registros visuales opuestos: la latitud sedosa del cine digital, el ultra-angular inmersivo de acción y la cercanía cotidiana del smartphone.',
    explanation:
      'Las cámaras de cine priorizan 24 fps, rango dinámico amplio en sombras y lentes anamórficos. Las de acción generan gran angular extremo y proximidad física en movimiento. El registro smartphone (computacional/directo) funciona para realismo cotidiano UGC o documental íntimo.',
    visual_examples: [
      'Fotograma de cine digital con relación 2.39:1 y flare horizontal sutil',
      'Toma inmersiva desde casco o manillar con cámara de acción gran angular',
    ],
    image: IMG.cinemaRig,
    aspectRatio: '16:9',
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'fpv' },
    technical_terms: ['Digital cinema camera', 'Action cam wide FOV', 'Smartphone candid realism', '24fps cadence'],
    prompt_examples: {
      es: 'Fotograma cinematográfico capturado con estética de cámara de cine digital, latitud profunda en sombras, colorimetría equilibrada y cadencia fílmica de 24 cuadros por segundo.',
      en: 'Cinematic film still with digital cinema camera aesthetic, deep shadow latitude, balanced skin tones and 24fps motion cadence.',
    },
    builderPatch: { mode: 'video', camera: 'ARRI Alexa 35 (Cine Referente)' },
    related_topics: ['m2-marca-arri-red-blackmagic', 'm6-mov-fpv-drone'],
    difficulty: 'Intermedio',
    tags: ['cine', 'acción', 'smartphone', 'arri', 'red', 'blackmagic'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },

  // B. Marcas y sistemas de referencia
  {
    id: 'm2-marca-sony-canon-nikon',
    moduleId: 'mod-02',
    title: 'Referencias: Sony Alpha, Canon EOS y Nikon Z',
    category: 'Marcas y sistemas de referencia',
    subcategory: 'B. Marcas y sistemas de referencia',
    description:
      'Nota pedagógica: citar marcas en un prompt NO es obligatorio ni reproduce exactamente un sensor físico; funciona como atajo cultural de ciencia de color y nitidez.',
    explanation:
      'En el lenguaje de prompts: Sony Alpha suele asociarse a nitidez moderna y contraste limpio; Canon EOS a tonos de piel cálidos y amables para retrato y bodas; Nikon Z a fidelidad natural en paisajes y texturas. Puedes lograr exactamente lo mismo describiendo la luz y el color sin nombrar marca.',
    visual_examples: [
      'Retrato editorial luminoso con tonos de piel cálidos y fieles',
      'Paisaje montañoso con nitidez uniforme de esquina a esquina',
    ],
    image: IMG.compFocal,
    diagramType: 'none',
    technical_terms: ['Color science cue', 'Modern sharpness', 'Pleasing skin tones', 'Optional brand reference'],
    prompt_examples: {
      es: 'Retrato editorial de luz natural con tonos de piel cálidos y equilibrados, nitidez limpia de óptica moderna full frame (referencia estética tipo Canon EOS / Sony Alpha, sin ser requisito técnico obligatorio).',
      en: 'Natural light editorial portrait with warm balanced skin tones and modern full-frame optical crispness, contemporary digital editorial aesthetic.',
    },
    builderPatch: { camera: 'Sony A7R V (Full Frame)' },
    related_topics: ['m2-marca-hasselblad-leica', 'm2-marca-arri-red-blackmagic'],
    difficulty: 'Básico',
    tags: ['sony alpha', 'canon eos', 'nikon z', 'fujifilm', 'marcas'],
    source: 'Núcleo Colectivo · Nota Metodológica',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-marca-hasselblad-leica',
    moduleId: 'mod-02',
    title: 'Referencias: Fujifilm X/GFX, Leica y Hasselblad',
    category: 'Marcas y sistemas de referencia',
    subcategory: 'B. Marcas y sistemas de referencia',
    description:
      'Asociaciones estéticas de autor: color fílmico de Fujifilm, carácter callejero y microcontraste de Leica, y precisión cromática de Hasselblad.',
    explanation:
      'Recordatorio clave: la marca no sustituye la dirección de arte. En prompts, Leica evoca reportaje sobrio y contraste clásico; Fujifilm X/GFX sugiere simulaciones cromáticas suaves; Hasselblad remite a estudio de lujo y archivo museográfico.',
    visual_examples: [
      'Escena callejera sobria con microcontraste alto y negros ricos',
      'Estudio de producto en color natural preciso sin sobresaturación',
    ],
    image: IMG.analog,
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#22223B', '#4A4E69', '#9A8C98', '#F2E9E4'] },
    technical_terms: ['Leica monochrome vibe', 'Fujifilm film simulation', 'Hasselblad color accuracy'],
    prompt_examples: {
      es: 'Escena urbana documental sobria inspirada en la estética clásica de telémetro y simulación fílmica suave, microcontraste equilibrado, negros con detalle y colores contenidos.',
      en: 'Restrained urban documentary scene inspired by classic rangefinder contrast and gentle film color science, rich shadow detail and natural muted tones.',
    },
    builderPatch: { camera: 'Fujifilm GFX 100 II' },
    related_topics: ['m2-cam-formato-medio', 'm2-marca-sony-canon-nikon'],
    difficulty: 'Intermedio',
    tags: ['fujifilm', 'leica', 'hasselblad', 'gfx', 'referencia'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-marca-arri-red-blackmagic',
    moduleId: 'mod-02',
    title: 'Referencias Cine: ARRI Alexa, RED y Blackmagic Design',
    category: 'Marcas y sistemas de referencia',
    subcategory: 'B. Marcas y sistemas de referencia',
    description:
      'Códigos visuales de la cinematografía contemporánea para prompts de video y fotogramas de película.',
    explanation:
      'ARRI Alexa simboliza textura orgánica, luces altas suaves y fidelidad en rostros; RED sugiere nitidez extrema para VFX, acción y cámara lenta; Blackmagic Design remite a cine independiente con acabado fílmico accesible. Son pistas estéticas para el modelo, nunca garantías hardware.',
    visual_examples: [
      'Fotograma de drama íntimo con luces cálidas suaves estilo cine europeo',
      'Secuencia de acción nítida en cámara lenta para campaña deportiva',
    ],
    image: IMG.studio,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'dolly-in' },
    technical_terms: ['ARRI highlight roll-off', 'RED crisp VFX detail', 'Blackmagic indie cinema'],
    prompt_examples: {
      es: 'Fotograma de cine contemporáneo con luces altas sedosas, gradación orgánica en piel y grano cinematográfico fino, relación panorámica 2.39:1.',
      en: 'Contemporary cinema still with silky highlight roll-off, organic skin-tone rendering and subtle film grain, 2.39:1 widescreen composition.',
    },
    builderPatch: { mode: 'video', camera: 'ARRI Alexa 35 (Cine Referente)' },
    related_topics: ['m2-cam-cine-accion-movil', 'm6-mov-dolly'],
    difficulty: 'Intermedio',
    tags: ['arri alexa', 'red', 'blackmagic', 'cine', 'video'],
    source: 'Núcleo Colectivo',
    license: 'CC BY-NC-SA 4.0',
  },

  // C. Lentes y ópticas (8mm a 400mm + tipos)
  {
    id: 'm2-lente-8-14-16mm',
    moduleId: 'mod-02',
    title: 'Ultra Gran Angular y Fisheye (8mm · 14mm · 16mm)',
    category: 'Lentes y distancias focales',
    subcategory: 'C. Lentes y distancias focales (8mm–400mm)',
    description:
      'Campos visuales extremos (100° a 180°): exageran la perspectiva frontal, alargan espacios pequeños y curvan horizontes en versión ojo de pez (8mm).',
    explanation:
      '• 8mm Fisheye: distorsión esférica creativa, skateboarding, música y arquitectura experimental.\n• 14mm: ultra gran angular rectilíneo para paisajes vastos, cielos nocturnos y arquitectura monumental.\n• 16mm: gran angular dinámico ideal para interiores amplios, FPV y planos generales inmersivos.',
    visual_examples: [
      '8mm ojo de pez mirando hacia arriba entre edificios brutalistas',
      '14mm en caverna o sala museográfica abarcando techo y suelo',
    ],
    image: IMG.focal14,
    aspectRatio: '3:2',
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 14 },
    technical_terms: ['8mm Fisheye', '14mm Ultra-wide', '16mm Rectilinear wide', 'Perspective exaggeration'],
    prompt_examples: {
      es: 'Fotografía arquitectónica inmersiva con lente ultra gran angular de 14mm desde ángulo contrapicado bajo, enfatizando líneas convergentes dramáticas y sensación monumental del espacio.',
      en: 'Immersive architectural photograph captured with a 14mm ultra-wide lens from a low upward angle, emphasizing dramatic converging lines and monumental spatial depth.',
    },
    builderPatch: { lens: '14mm ultra-wide lens', aperture: 'f/11 deep focus' },
    related_topics: ['m2-lente-24-28mm', 'm5-angulo-contrapicado'],
    difficulty: 'Intermedio',
    tags: ['8mm', '14mm', '16mm', 'fisheye', 'ultra gran angular'],
    source: 'Núcleo Colectivo · Óptica',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-lente-24-28mm',
    moduleId: 'mod-02',
    title: 'Gran Angular de Contexto (24mm · 28mm)',
    category: 'Lentes y distancias focales',
    subcategory: 'C. Lentes y distancias focales (8mm–400mm)',
    description:
      'Equilibrio entre entorno amplio y presencia humana sin deformación extrema. El 28mm es un clásico de calle; el 24mm domina paisaje, cine y arquitectura.',
    explanation:
      '• 24mm: integra protagonista y escenario con fuerza narrativa.\n• 28mm: distancia icónica de reporteros gráficos y cámaras compactas clásicas; exige acercarse al sujeto manteniendo el pulso del barrio o la escena alrededor.',
    visual_examples: [
      '24mm en taller de artista mostrando herramientas, mesa y luz de ventana',
      '28mm en calle con mercado y personas en múltiples planos',
    ],
    image: IMG.focal24,
    aspectRatio: '3:2',
    objectPosition: 'top',
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 24 },
    technical_terms: ['24mm Environmental wide', '28mm Street classic', 'Contextual storytelling'],
    prompt_examples: {
      es: 'Retrato ambiental en taller con lente gran angular de 24mm: la escultora trabaja en primer plano mientras se aprecia todo el estudio lleno de bocetos y luz natural lateral.',
      en: 'Environmental portrait in a workshop with a 24mm wide-angle lens: the sculptor works in the foreground while the full studio filled with sketches and side daylight remains clearly legible.',
    },
    builderPatch: { lens: '24mm wide angle lens' },
    related_topics: ['m2-lente-35mm', 'm2-lente-8-14-16mm'],
    difficulty: 'Básico',
    tags: ['24mm', '28mm', 'gran angular', 'ambiental', 'reportaje'],
    source: 'Núcleo Colectivo · Óptica',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-lente-35mm',
    moduleId: 'mod-02',
    title: 'Lente 35mm y Normal 50mm (Perspectiva Humana)',
    category: 'Lentes y distancias focales',
    subcategory: 'C. Lentes y distancias focales (8mm–400mm)',
    description:
      '• 35mm: el rey de la narrativa documental y el cine realista.\n• 50mm: "lente normal", reproduce proporciones naturales cercanas a la visión humana centrada.',
    explanation:
      'Si buscas naturalidad sin artificio óptico, 35mm aporta contexto respirable y 50mm ofrece equilibrio perfecto para retratos de medio cuerpo, gastronomía y moda discreta.',
    visual_examples: [
      'Comparación directa: 35mm incluye entorno y profundidad vs 85mm comprime el fondo',
    ],
    image: IMG.compFocal,
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 35 },
    technical_terms: ['35mm Documentary prime', '50mm Standard prime', 'Natural perspective', 'Focal fija'],
    prompt_examples: {
      es: 'Fotografía documental natural con lente fija de 35mm a f/2.8, perspectiva humana honesta que equilibra el rostro del protagonista con el ambiente del café de barrio.',
      en: 'Natural documentary photograph shot with a 35mm prime lens at f/2.8, honest human perspective balancing the subject expression with the surrounding neighborhood cafe atmosphere.',
    },
    builderPatch: { lens: '35mm prime lens', aperture: 'f/2.8 aperture' },
    related_topics: ['m2-lente-85mm', 'm1-foto-documental-street'],
    difficulty: 'Básico',
    tags: ['35mm', '50mm', 'normal', 'focal fija', 'documental'],
    source: 'Núcleo Colectivo · Óptica',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-lente-85mm',
    moduleId: 'mod-02',
    title: 'Teleobjetivos Cortos de Retrato (85mm · 105mm · 135mm)',
    category: 'Lentes y distancias focales',
    subcategory: 'C. Lentes y distancias focales (8mm–400mm)',
    description:
      'Favorecen las proporciones del rostro, aíslan al sujeto mediante bokeh cremoso y comprimen agradablemente los planos posteriores.',
    explanation:
      '• 85mm: el estándar de oro del retrato editorial.\n• 105mm: precisión para belleza, macro y primeros planos sin invadir al modelo.\n• 135mm: compresión intensa que convierte fondos urbanos caóticos en manchas pictóricas suaves.',
    visual_examples: [
      'Comparación 35mm vs 85mm: rostro estilizado y fondo suavemente comprimido',
    ],
    image: IMG.focal85,
    aspectRatio: '3:2',
    objectPosition: 'top',
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 85 },
    technical_terms: ['85mm Portrait prime', '105mm Macro / Beauty', '135mm Compression bokeh'],
    prompt_examples: {
      es: 'Retrato íntimo en primer plano con lente teleobjetivo de 85mm a f/1.8, compresión facial favorecedora y fondo urbano nocturno transformado en bokeh suave y circular.',
      en: 'Intimate close-up portrait shot with an 85mm portrait lens at f/1.8, flattering facial compression and distant city lights melted into creamy circular bokeh.',
    },
    builderPatch: { lens: '85mm portrait prime lens', aperture: 'f/1.8 creamy bokeh' },
    related_topics: ['m2-lente-35mm', 'm2-lente-200-400mm', 'm2-param-apertura'],
    difficulty: 'Básico',
    tags: ['85mm', '105mm', '135mm', 'teleobjetivo', 'retrato', 'bokeh'],
    source: 'Núcleo Colectivo · Óptica',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-lente-200-400mm',
    moduleId: 'mod-02',
    title: 'Teleobjetivo y Superteleobjetivo (200mm · 300mm · 400mm)',
    category: 'Lentes y distancias focales',
    subcategory: 'C. Lentes y distancias focales (8mm–400mm)',
    description:
      'Aplanamiento espacial dramático: acercan montañas, luna, fachadas o atletas distantes haciéndolos parecer pegados al primer plano.',
    explanation:
      '• 200mm: moda en exteriores, detalles arquitectónicos altos y retratos comprimidos.\n• 300mm y 400mm: fauna silvestre, deportes de estadio y paisajes donde sol, montañas y siluetas adquieren escala gigantesca por compresión óptica.',
    visual_examples: [
      'Silueta de caminante frente a una luna llena gigantesca comprimida a 400mm',
      'Capas de montañas brumosas apiladas con teleobjetivo de 300mm',
    ],
    image: IMG.focal135,
    aspectRatio: '3:2',
    objectPosition: 'top',
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 300 },
    technical_terms: ['200mm Telephoto', '300mm Wildlife', '400mm Super-telephoto', 'Spatial compression'],
    prompt_examples: {
      es: 'Paisaje de alta montaña capturado con superteleobjetivo de 300mm: múltiples cordilleras azuladas apiladas unas sobre otras por compresión óptica en la neblina del amanecer.',
      en: 'High mountain landscape captured with a 300mm super-telephoto lens: stacked blue mountain ridges compressed tightly together across morning mist layers.',
    },
    builderPatch: { lens: '200mm telephoto lens' },
    related_topics: ['m2-param-compresion', 'm2-lente-85mm'],
    difficulty: 'Intermedio',
    tags: ['200mm', '300mm', '400mm', 'teleobjetivo', 'superteleobjetivo', 'zoom'],
    source: 'Núcleo Colectivo · Óptica',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-optica-tilt-shift',
    moduleId: 'mod-02',
    title: 'Ópticas Especiales: Anamórfico, Macro, Tilt-Shift, Zoom vs Focal Fija',
    category: 'Lentes y distancias focales',
    subcategory: 'C. Lentes y distancias focales (8mm–400mm)',
    description:
      'Herramientas ópticas con firma visual inconfundible: destellos horizontales anamórficos, plano focal inclinado (miniaturas) o nitidez de lente fijo.',
    explanation:
      '• Anamórfico: bokeh ovalado vertical, formato panorámico 2.39:1 y flares horizontales azulados o ámbar.\n• Tilt-Shift: corrige líneas en edificios o inclina el plano de enfoque creando efecto maqueta.\n• Macro: relación 1:1 para insectos, piel, joyería.\n• Focal fija (Prime) vs Zoom: los primes ofrecen mayor apertura y carácter; el zoom aporta versatilidad documental.',
    visual_examples: [
      'Retrato nocturno con lente anamórfico y bokeh ovalado suave',
      'Vista aérea urbana con tilt-shift selectivo efecto maqueta',
    ],
    image: IMG.videoRig,
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 40 },
    technical_terms: ['Anamorphic oval bokeh', 'Tilt-shift miniature', '1:1 Macro', 'Prime vs Zoom'],
    prompt_examples: {
      es: 'Fotograma panorámico con lente anamórfico Cooke de 40mm: personaje caminando bajo lluvia ligera en estación nocturna, destellos horizontales sutiles de farolas y bokeh ovalado característico.',
      en: 'Widescreen film frame captured on a 40mm Cooke anamorphic prime lens: solitary figure walking under light rain at a nocturnal station, subtle horizontal streak flares and signature oval bokeh.',
    },
    builderPatch: { lens: 'Cooke 40mm anamorphic prime lens', aspectRatio: '2.39:1' },
    related_topics: ['m1-foto-arquitectura-interiores', 'm6-efecto-anamorfico'],
    difficulty: 'Avanzado',
    tags: ['anamórfico', 'tilt-shift', 'macro', 'zoom', 'focal fija'],
    source: 'Núcleo Colectivo · Óptica Avanzada',
    license: 'CC BY-NC-SA 4.0',
  },

  // D. Parámetros fotográficos
  {
    id: 'm2-param-apertura',
    moduleId: 'mod-02',
    title: 'Apertura de diafragma, Profundidad de campo y Bokeh (f/1.4 a f/16)',
    category: 'Parámetros fotográficos',
    subcategory: 'D. Parámetros fotográficos',
    description:
      'Control de cuánta escena queda nítida desde el primer plano hasta el infinito.',
    explanation:
      '• f/1.4 – f/1.8: profundidad mínima, solo ojos o un detalle quedan nítidos; bokeh muy cremoso.\n• f/2.8: separación limpia entre sujeto y fondo manteniendo forma en todo el rostro.\n• f/4 – f/5.6: ideal para retratos grupales de 2 personas y reportaje.\n• f/8: el punto dulce comercial y editorial con nitidez uniforme.\n• f/11 – f/16: paisaje y arquitectura donde primer plano y horizonte están enfocados.',
    visual_examples: [
      'Retrato a f/1.4 con fondo totalmente disuelto frente a f/8 donde se lee el taller',
    ],
    image: IMG.compFocal,
    diagramType: 'aperture-dof',
    diagramConfig: { fStop: 1.8 },
    technical_terms: ['f/1.4–f/16', 'Shallow depth of field', 'Bokeh discs', 'Selective focus'],
    prompt_examples: {
      es: 'Retrato ambiental en librería antigua a f/1.8 con enfoque selectivo milimétrico en los ojos mientras los lomos de los libros detrás se disuelven en un bokeh cálido y suave.',
      en: 'Environmental portrait inside an antique bookstore shot at f/1.8 with selective pinpoint focus on the eyes while distant bookshelves dissolve into soft warm bokeh.',
    },
    builderPatch: { aperture: 'f/1.8 creamy bokeh' },
    related_topics: ['m2-lente-85mm', 'm2-param-compresion'],
    difficulty: 'Básico',
    tags: ['apertura', 'f/1.4', 'f/1.8', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16', 'bokeh', 'profundidad de campo'],
    source: 'Núcleo Colectivo · Parámetros',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-param-obturacion',
    moduleId: 'mod-02',
    title: 'Velocidad de obturación, ISO, Exposición y Rango dinámico',
    category: 'Parámetros fotográficos',
    subcategory: 'D. Parámetros fotográficos',
    description:
      'Cómo el tiempo y la sensibilidad dibujan el movimiento, la textura nocturna y el detalle entre las sombras más oscuras y los brillos más intensos.',
    explanation:
      '• Obturación rápida (1/2000s): congela gotas de agua, baile o polvo en el aire.\n• Obturación lenta (1/15s o 2s): produce estelas de movimiento (motion blur) en personas o luces.\n• ISO alto (3200–6400): añade textura nocturna real.\n• Alto rango dinámico natural: conserva detalles tanto en nubes luminosas como en zonas en sombra sin aspecto HDR artificial.',
    visual_examples: [
      'Bailarina congelada en salto con polvo en suspensión (1/2000s)',
      'Transeúntes con estela sedosa frente a sujeto inmóvil (1/4s)',
    ],
    image: IMG.loop,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'tracking' },
    technical_terms: ['High shutter freeze', 'Long exposure motion blur', 'High ISO grain', 'Dynamic range'],
    prompt_examples: {
      es: 'Fotografía documental de danza contemporánea con obturación lenta de 1/8s que genera un sutil desenfoque de movimiento en las manos mientras el rostro permanece nítido bajo un haz de luz cenital.',
      en: 'Contemporary dance documentary photograph using a slow 1/8s shutter speed creating poetic motion blur along moving arms while keeping the dancer face crisp under an overhead stage beam.',
    },
    builderPatch: { genre: '/documentary', visualStyle: 'Larga Exposición & Movimiento' },
    related_topics: ['m2-param-apertura', 'm6-vel-motion-blur'],
    difficulty: 'Intermedio',
    tags: ['velocidad de obturación', 'iso', 'exposición', 'rango dinámico', 'motion blur'],
    source: 'Núcleo Colectivo · Parámetros',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm2-param-compresion',
    moduleId: 'mod-02',
    title: 'Distancia focal, Distancia de enfoque, Balance de blancos y Compresión',
    category: 'Parámetros fotográficos',
    subcategory: 'D. Parámetros fotográficos',
    description:
      'Relación entre cercanía física, longitud del lente y temperatura cromática calibrada.',
    explanation:
      'La compresión de perspectiva no la crea el lente por arte de magia, sino alejarse físicamente y usar un teleobjetivo. A la inversa, acercarse con 24mm expande el espacio. El Balance de Blancos (Kelvin) fija si una escena nevada luce azul gélido o dorada al amanecer.',
    visual_examples: [
      'Comparación de perspectiva: rostro cerca en 24mm vs lejos en 85mm',
    ],
    image: IMG.compFocal,
    diagramType: 'lens-fov',
    diagramConfig: { focalMm: 135 },
    technical_terms: ['Perspective compression', 'Focus distance', 'White balance Kelvin', 'Focal length'],
    prompt_examples: {
      es: 'Avenida urbana fotografiada con teleobjetivo de 135mm mostrando intensa compresión de perspectiva entre ciclistas, árboles y edificios al fondo, balance de blancos cálido de tarde (5800K).',
      en: 'City avenue photographed with a 135mm telephoto lens showing strong perspective compression stacking cyclists, trees and distant facades, warm late-afternoon 5800K white balance.',
    },
    builderPatch: { lens: '85mm portrait prime lens', temperature: 'Cálida dorada (5800K)' },
    related_topics: ['m2-lente-200-400mm', 'm4-temperatura-color'],
    difficulty: 'Intermedio',
    tags: ['distancia focal', 'distancia de enfoque', 'balance de blancos', 'compresión de perspectiva'],
    source: 'Núcleo Colectivo · Parámetros',
    license: 'CC BY-NC-SA 4.0',
  },

  // =========================================================================
  // MÓDULO 03 — ILUMINACIÓN FOTOGRÁFICA
  // A. Tipos y fuentes de luz
  // =========================================================================
  {
    id: 'm3-luz-natural-golden-blue',
    moduleId: 'mod-03',
    title: 'Luz Natural, Ventana, Hora Dorada y Hora Azul',
    category: 'Tipos de luz',
    subcategory: 'A. Tipos y fuentes de luz',
    description:
      'Las fuentes orgánicas más favorecedoras: direccionalidad suave de ventana, calidez rasante del atardecer y azul crepuscular.',
    explanation:
      '• Luz de ventana (Window Light): actúa como un softbox natural enorme.\n• Hora dorada: sol bajo (3200K–4000K) con sombras largas y piel luminosa.\n• Hora azul: minutos tras el ocaso donde el cielo azul profundo equilibra luces cálidas urbanas.',
    visual_examples: [
      'Retrato junto a ventanal norte con caída suave de sombra',
      'Escena callejera en hora azul con farolas cálidas encendiéndose',
    ],
    image: IMG.territory,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -75, fillLevel: 'medium', contrast: 'low' },
    technical_terms: ['Window light', 'Golden hour', 'Blue hour twilight', 'Soft overcast'],
    prompt_examples: {
      es: 'Retrato íntimo iluminado únicamente con luz natural suave de ventana lateral norte en mañana nublada, caída progresiva hacia sombras limpias en el fondo del taller.',
      en: 'Intimate portrait illuminated solely by soft north-facing window daylight on an overcast morning, gentle fall-off into clean ambient shadows inside the workshop.',
    },
    builderPatch: { lighting: 'Soft natural window light during golden hour' },
    related_topics: ['m3-luz-dura-suave', 'm4-temperatura-color'],
    difficulty: 'Básico',
    tags: ['luz natural', 'hora dorada', 'hora azul', 'ventana', 'nublado'],
    source: 'Núcleo Colectivo · Iluminación',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm3-luz-dura-suave',
    moduleId: 'mod-03',
    title: 'Luz Dura, Luz Suave, Difusa y Rebotada',
    category: 'Tipos de luz',
    subcategory: 'A. Tipos y fuentes de luz',
    description:
      'La calidad de la sombra define el carácter emocional: bordes recortados y gráficos (luz dura) frente a degradados envolventes (luz suave/difusa).',
    explanation:
      'Una fuente pequeña y directa (sol de mediodía, fresnel desnudo) genera luz dura. Pasar la luz por un difusor amplio o rebotarla contra una pared blanca (bounce light) agranda la fuente aparente y suaviza arrugas, metales y volúmenes.',
    visual_examples: [
      'Sombras nítidas geométricas de persiana sobre rostro (luz dura)',
      'Piel y vidrio sin reflejos agresivos bajo tela difusora (luz rebotada)',
    ],
    image: IMG.compLight,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -45, fillLevel: 'high', contrast: 'low' },
    technical_terms: ['Hard specular light', 'Soft diffused light', 'Bounce fill', 'Shadow edge transition'],
    prompt_examples: {
      es: 'Bodegón editorial bajo luz dura directa de sol de mediodía proyectando sombras negras nítidas y recortadas sobre muro encalado, alto contraste gráfico y textura de cal viva.',
      en: 'Editorial still life under direct hard midday sunlight casting razor-sharp geometric shadows across a limewashed plaster wall, crisp graphic contrast.',
    },
    builderPatch: { lighting: 'Large diffused studio softbox with silver bounce fill' },
    related_topics: ['m3-luz-estudio-tungsteno', 'm3-rembrandt'],
    difficulty: 'Básico',
    tags: ['luz dura', 'luz suave', 'difusa', 'rebotada', 'nublado'],
    source: 'Núcleo Colectivo · Iluminación',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm3-luz-estudio-tungsteno',
    moduleId: 'mod-03',
    title: 'Luz de Estudio, Artificial, Neón, Tungsteno y Ambiental',
    category: 'Tipos de luz',
    subcategory: 'A. Tipos y fuentes de luz',
    description:
      'Control escenográfico total: desde el fresnel de tungsteno cálido (3200K) hasta tubos fluorescentes, letreros de neón y luces prácticas integradas en escena.',
    explanation:
      'Combinar dos temperaturas opuestas (tungsteno cálido 3200K sobre el sujeto + ambiental frío azul o cian detrás) genera profundidad inmediata sin necesidad de saturación artificial.',
    visual_examples: [
      'Taller nocturno iluminado por lámpara de escritorio tungsteno frente a ventana azulada',
      'Retrato nocturno con reflejo real de neón sobre asfalto húmedo',
    ],
    image: IMG.noir,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: 55, fillLevel: 'low', rimActive: true, contrast: 'high' },
    technical_terms: ['3200K Tungsten', 'Neon ambient spill', 'Studio strobes', 'Practical lamps'],
    prompt_examples: {
      es: 'Escena cinematográfica en cafetería nocturna: rostro iluminado por la luz cálida de tungsteno de una lámpara de mesa mientras el cristal trasero refleja tenues luces frías y neones de la calle bajo llovizna.',
      en: 'Cinematic late-night diner scene: face lit by a warm tungsten table lamp while the rain-streaked glass window behind reflects subtle cool ambient city neon.',
    },
    builderPatch: { lighting: 'Tungsten key light mixed with cool nocturnal ambient fill' },
    related_topics: ['m3-practical-volumetric', 'm4-paleta-teal-orange'],
    difficulty: 'Intermedio',
    tags: ['estudio', 'artificial', 'neón', 'tungsteno', 'ambiental', 'nocturna'],
    source: 'Núcleo Colectivo · Iluminación',
    license: 'CC BY-NC-SA 4.0',
  },

  // B. Técnicas de iluminación
  {
    id: 'm3-rembrandt',
    moduleId: 'mod-03',
    title: 'Iluminación Rembrandt',
    category: 'Técnicas de iluminación',
    subcategory: 'B. Técnicas de iluminación y modelado',
    description:
      'Luz principal a 45° lateral y ligeramente elevada que dibuja un pequeño triángulo luminoso bajo el ojo del lado en sombra.',
    explanation:
      'Clásico pictórico y cinematográfico. Aporta volumen tridimensional, seriedad psicológica y nobleza al rostro sin ocultar por completo el ojo en penumbra.',
    visual_examples: [
      'Comparación directa: Rembrandt dramático a la izquierda frente a High Key luminoso a la derecha',
    ],
    image: IMG.rembrandt,
    aspectRatio: '3:4',
    objectPosition: 'top',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -45, fillLevel: 'low', rimActive: false, contrast: 'high' },
    technical_terms: ['Rembrandt triangle', '45-degree key light', 'Sculpted facial volume'],
    prompt_examples: {
      es: 'Retrato fotográfico con iluminación Rembrandt clásica: fuente principal a 45 grados dejando un triángulo definido de luz bajo el ojo izquierdo en sombra, fondo oscuro sobrio y gran profundidad tonal.',
      en: 'Photographic portrait using classic Rembrandt lighting: 45-degree elevated key light forming a crisp triangle of light under the shadowed eye, sculpted cheek volume against a deep matte backdrop.',
    },
    builderPatch: { lighting: 'Rembrandt lighting, directional light with cheek triangle' },
    related_topics: ['m3-loop-split', 'm3-chiaroscuro', 'm3-butterfly-highkey'],
    difficulty: 'Básico',
    tags: ['rembrandt', 'triángulo', 'retrato', 'dramático'],
    source: 'Núcleo Colectivo · Iluminación',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm3-butterfly-highkey',
    moduleId: 'mod-03',
    title: 'Butterfly (Paramount) y High Key',
    category: 'Técnicas de iluminación',
    subcategory: 'B. Técnicas de iluminación y modelado',
    description:
      '• Butterfly: luz centrada y elevada sobre el eje de cámara que proyecta una pequeña sombra simétrica bajo la nariz.\n• High Key: iluminación envolvente luminosa de sombras mínimas.',
    explanation:
      'Muy utilizadas en belleza, moda editorial luminosa, cosmética y retratos frescos. Resalta pómulos y elimina sombras duras bajo ojos o cuello si se apoya con un reflector inferior.',
    visual_examples: [
      'Comparación visual: derecha de estudio High Key con estética limpia y luminosa',
    ],
    image: IMG.butterfly,
    aspectRatio: '3:4',
    objectPosition: 'top',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: 0, fillLevel: 'high', rimActive: false, contrast: 'low' },
    technical_terms: ['Butterfly / Paramount light', 'High key beauty', 'Under-chin silver reflector'],
    prompt_examples: {
      es: 'Retrato editorial High Key con iluminación Butterfly frontal elevada y reflector inferior suave, tonos claros limpios, pómulos esculpidos con sombra sutil bajo la nariz y atmósfera luminosa sin estridencias.',
      en: 'High-key editorial beauty portrait with overhead frontal Butterfly lighting and subtle bottom bounce fill, sculpted cheekbones, crisp clean tones and luminous shadowless atmosphere.',
    },
    builderPatch: { lighting: 'Butterfly lighting, sculpted cheekbones' },
    related_topics: ['m3-rembrandt', 'm3-lowkey-silhouette'],
    difficulty: 'Básico',
    tags: ['butterfly', 'high key', 'belleza', 'moda', 'luminoso'],
    source: 'Núcleo Colectivo · Iluminación',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm3-loop-split',
    moduleId: 'mod-03',
    title: 'Loop Lighting, Split Lighting, Broad y Short Lighting',
    category: 'Técnicas de iluminación',
    subcategory: 'B. Técnicas de iluminación y modelado',
    description:
      'Cuatro modulaciones precisas del ángulo lateral para estilizar o dramatizar el rostro.',
    explanation:
      '• Loop (30°): pequeña sombra nasal oblicua que no toca la mejilla; favorece a casi todos los rostros.\n• Split (90°): divide el rostro exactamente mitad luz y mitad sombra para máximo misterio.\n• Broad: ilumina el lado del rostro más cercano a cámara (ensancha suavemente).\n• Short: ilumina el lado alejado de cámara (estiliza y aporta profundidad cinematográfica).',
    visual_examples: [
      'Retrato Split 50/50 de cine negro',
      'Retrato Short Lighting mirando hacia la luz lateral',
    ],
    image: IMG.split,
    aspectRatio: '3:4',
    objectPosition: 'top',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -90, fillLevel: 'none', contrast: 'extreme' },
    technical_terms: ['Loop lighting', 'Split 50/50', 'Broad vs Short lighting'],
    prompt_examples: {
      es: 'Retrato cinematográfico con iluminación Split a 90 grados laterales: exactamente la mitad izquierda del rostro iluminada y la mitad derecha sumida en sombra profunda, mirada serena hacia cámara.',
      en: 'Cinematic portrait with 90-degree Split lighting: one half of the face crisply illuminated while the opposite half falls into deep dramatic shadow, calm direct gaze.',
    },
    builderPatch: { lighting: 'Split lighting, half in shadow half in light' },
    related_topics: ['m3-rembrandt', 'm3-chiaroscuro'],
    difficulty: 'Intermedio',
    tags: ['loop', 'split', 'broad', 'short', 'lateral'],
    source: 'Núcleo Colectivo · Iluminación',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm3-chiaroscuro',
    moduleId: 'mod-03',
    title: 'Chiaroscuro (Claroscuro) y Low Key',
    category: 'Técnicas de iluminación',
    subcategory: 'B. Técnicas de iluminación y modelado',
    description:
      'Predominio deliberado de las sombras (Low Key) y contraste escultórico inspirado en la pintura barroca (Chiaroscuro) sin perder textura en negros.',
    explanation:
      'Fundamental especificar negros profundos con detalle en pliegues y cabello para que la IA no aplaste la imagen ni invente brillos plásticos. Es la base del estilo Neo Noir y del preset JSON Chiaroscuro Monochrome.',
    visual_examples: [
      'Retrato Low Key monocromático emergiendo de penumbra densa',
    ],
    image: IMG.compJson,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -65, fillLevel: 'none', rimActive: true, contrast: 'extreme' },
    technical_terms: ['Chiaroscuro baroque contrast', 'Low key exposure', 'Deep uncrushed blacks'],
    prompt_examples: {
      es: 'Retrato Low Key en estética Chiaroscuro: una única fuente lateral dura esculpe el rostro y las manos emergiendo de un fondo completamente en penumbra, alto contraste manteniendo textura sutil en los tonos oscuros.',
      en: 'Low-key Chiaroscuro portrait: a single directional light sculpts the face and hands emerging from deep atmospheric darkness, rich contrast preserving subtle shadow texture.',
    },
    builderPatch: { lighting: 'Chiaroscuro, dramatic contrast between light and deep shadow' },
    related_topics: ['m3-rembrandt', 'm3-rim-edge', 'm4-estetica-noir'],
    difficulty: 'Intermedio',
    tags: ['chiaroscuro', 'claroscuro', 'low key', 'sombras', 'barroco'],
    source: 'Núcleo Colectivo · Guía JSON',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm3-rim-edge',
    moduleId: 'mod-03',
    title: 'Rim Light, Edge Light y Silhouette (Contraluz)',
    category: 'Técnicas de iluminación',
    subcategory: 'B. Técnicas de iluminación y modelado',
    description:
      'Luz posicionada detrás del sujeto para delinear un halo brillante alrededor de hombros, cabello o contorno de objetos (Rim/Edge), o convertir al sujeto en silueta pura.',
    explanation:
      '• Rim / Edge Light: separa visualmente al protagonista de fondos oscuros o complejos creando un borde luminoso fino.\n• Silhouette: expone para el fondo luminoso dejando al sujeto completamente en negro recortado.',
    visual_examples: [
      'Botella de vidrio y roca volcánica perfiladas con contraluz plateado',
      'Silueta recortada contra portal de luz al atardecer',
    ],
    image: IMG.rim,
    aspectRatio: '3:4',
    objectPosition: 'top',
    diagramType: 'lighting',
    diagramConfig: { keyAngle: 150, fillLevel: 'none', rimActive: true, contrast: 'high' },
    technical_terms: ['Crisp rim lighting', 'Edge separation light', 'Backlit silhouette'],
    prompt_examples: {
      es: 'Escultura y sujeto de perfil separados de un fondo oscuro mediante una luz de contorno (Rim Light) trasera intensa que dibuja una línea dorada precisa sobre el cabello y los hombros.',
      en: 'Sculptural profile subject separated from a pitch-dark backdrop by a crisp rear Rim Light tracing a fine luminous edge along the hair, jaw and shoulders.',
    },
    builderPatch: { lighting: 'Crisp rim lighting separating subject from dark backdrop' },
    related_topics: ['m3-practical-volumetric', 'm1-foto-moda-publicidad'],
    difficulty: 'Básico',
    tags: ['rim light', 'edge light', 'silhouette', 'silueta', 'contraluz'],
    source: 'Núcleo Colectivo · Iluminación',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm3-practical-volumetric',
    moduleId: 'mod-03',
    title: 'Practical Lighting y Volumetric Lighting (Haces en Atmósfera)',
    category: 'Técnicas de iluminación',
    subcategory: 'B. Técnicas de iluminación y modelado',
    description:
      '• Practical: lámparas, velas, fogatas o neones visibles dentro del cuadro que justifican la luz real.\n• Volumetric: rayos visibles cortando neblina, polvo o vapor.',
    explanation:
      'Combinar luces prácticas en escena con neblina sutil (atmospheric haze) convierte instantáneamente un espacio plano en una atmósfera tridimensional respirable para fotografía y video.',
    visual_examples: [
      'Haces de luz entrando por claraboya de galería con polvo suspendido',
      'Mesa iluminada por lámpara práctica visible en escena nocturna',
    ],
    image: IMG.studio,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: 120, fillLevel: 'low', rimActive: true, contrast: 'high' },
    technical_terms: ['Volumetric light shafts', 'Practical in-frame lights', 'Atmospheric haze', 'God rays'],
    prompt_examples: {
      es: 'Interior de taller artístico con iluminación volumétrica: rayos de sol oblicuos atraviesan polvo fino y neblina ligera desde ventanales altos, apoyados por una lámpara cálida práctica encendida sobre la mesa de dibujo.',
      en: 'Artist studio interior with volumetric lighting: oblique sunbeams cutting through fine suspended dust and atmospheric haze from high industrial windows, complemented by a warm practical desk lamp.',
    },
    builderPatch: { lighting: 'Volumetric light shafts cutting through soft atmospheric haze' },
    related_topics: ['m3-luz-estudio-tungsteno', 'm1-arte-tecnologia'],
    difficulty: 'Intermedio',
    tags: ['practical lighting', 'volumetric lighting', 'haces', 'neblina', 'atmósfera'],
    source: 'Núcleo Colectivo · Iluminación',
    license: 'CC BY-NC-SA 4.0',
  },

  // =========================================================================
  // MÓDULO 04 — COLOR Y DIRECCIÓN DE ARTE
  // A. Temperatura de color
  // =========================================================================
  {
    id: 'm4-temperatura-color',
    moduleId: 'mod-04',
    title: 'Temperatura de Color: Cálida, Fría, Neutra y Mixta (Kelvin)',
    category: 'Temperatura de color',
    subcategory: 'A. Temperatura de color',
    description:
      'Cómo los grados Kelvin (2800K tungsteno ámbar vs 5500K neutro vs 7500K sombra azul) estructuran la emoción psicológica de una escena.',
    explanation:
      'Incluye variaciones clave: Luz cálida (acogedora, nostálgica), Luz fría (clínica, nocturna, introspectiva), Neutra (documental/producto fiel), Mixta (choque cálido/frío en cine), Dorada (atardecer), Ámbar (velas/sodio), Azulada (madrugada) y Pastel (editorial etéreo).',
    visual_examples: [
      'Escena interior cálida 3200K frente a exterior frío crepuscular 7000K en el mismo cuadro',
    ],
    image: IMG.studio,
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#FF9E00', '#FFD166', '#E5E7EB', '#4CC9F0', '#1D3557'] },
    technical_terms: ['Warm 3200K', 'Cool 7500K', 'Mixed color temperature', 'Neutral daylight 5500K'],
    prompt_examples: {
      es: 'Escena con temperatura de color mixta: interior cálido en ámbar 3200K iluminando al personaje mientras el exterior tras el ventanal mantiene un azul profundo frío de madrugada (7200K).',
      en: 'Mixed color temperature scene: warm 3200K amber interior glow on the subject contrasting against deep cool 7200K pre-dawn blue light outside the window.',
    },
    builderPatch: { temperature: 'Mixta (Cálida 3200K / Fría 7200K)' },
    related_topics: ['m4-paleta-teal-orange', 'm3-luz-estudio-tungsteno'],
    difficulty: 'Básico',
    tags: ['temperatura', 'cálida', 'fría', 'neutra', 'mixta', 'dorada', 'ámbar', 'azulada', 'pastel'],
    source: 'Núcleo Colectivo · Color',
    license: 'CC BY-NC-SA 4.0',
  },

  // B. Paletas y combinaciones
  {
    id: 'm4-paleta-teal-orange',
    moduleId: 'mod-04',
    title: 'Paletas Cinematográficas: Teal & Orange, Complementaria y Split',
    category: 'Paletas y combinaciones',
    subcategory: 'B. Paletas y combinaciones cromáticas',
    description:
      'Armonías basadas en el círculo cromático para separar sujetos cálidos de fondos fríos o construir tensión editorial.',
    explanation:
      '• Teal & Orange: piel y luces cálidas frente a sombras verde-azuladas.\n• Complementarios directos: opuestos en el círculo cromático.\n• Análogos y Tríada: armonía suave o contraste equilibrado en tres puntos.\n• Split-complementary: un color dominante frente a dos adyacentes de su opuesto.',
    visual_examples: [
      'Retrato urbano con piel cálida y reflejos azul-petróleo en arquitectura nocturna',
    ],
    image: IMG.tealOrange,
    aspectRatio: '16:9',
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#007F86', '#2A9D8F', '#E88943', '#F4A261'] },
    technical_terms: ['Teal and orange', 'Complementary harmony', 'Split-complementary', 'Triadic palette'],
    prompt_examples: {
      es: 'Fotograma cinematográfico con paleta Teal & Orange contenida: tonos piel cálidos y naturales frente a sombras arquitectónicas azul petróleo profundo, sin sobresaturación artificial.',
      en: 'Cinematic film frame with restrained Teal and Orange color grading: warm natural skin tones balanced against deep petrol-teal architectural shadows, avoiding oversaturation.',
    },
    builderPatch: { colorPalette: 'Teal and orange cinematic grading with warm skin and cool shadows' },
    related_topics: ['m4-paleta-monocromatica-terrosa', 'm4-estetica-noir'],
    difficulty: 'Básico',
    tags: ['teal and orange', 'complementarios', 'análogos', 'tríada', 'paletas'],
    source: 'Núcleo Colectivo · Color',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm4-paleta-monocromatica-terrosa',
    moduleId: 'mod-04',
    title: 'Monocromática, Acromática, Terrosa, Pastel, Neón y Saturación',
    category: 'Paletas y combinaciones',
    subcategory: 'B. Paletas y combinaciones cromáticas',
    description:
      'Control del nivel de pureza cromática: desde el blanco y negro acromático hasta tonos minerales, pastel desaturados o neones vibrantes.',
    explanation:
      'Controlar la saturación en el prompt ("muted earthy palette" vs "vivid neon reflections") es la forma más rápida de darle identidad curatorial a una serie de imágenes.',
    visual_examples: [
      'Bodegón en tonos tierra, terracota, arena y ocre quemado',
      'Retrato acromático en plata gelatina con negros profundos',
    ],
    image: IMG.botanical,
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#C28E61', '#E6C9A2', '#6B4226', '#2C1E16'] },
    technical_terms: ['Earthy mineral palette', 'Achromatic B&W', 'Muted desaturated', 'Monochromatic'],
    prompt_examples: {
      es: 'Serie editorial de cerámica contemporánea con paleta terrosa mineral desaturada: ocres quemados, arena seca, arcilla cruda y fondo crema mate.',
      en: 'Editorial ceramic series in a muted earthy mineral palette: burnt ochre, dry sand, raw clay tones and matte warm cream backdrop.',
    },
    builderPatch: { colorPalette: 'Mineral earth tones, terracotta, warm sand and sun-baked ochre' },
    related_topics: ['m4-paleta-teal-orange', 'm4-kodak-portra'],
    difficulty: 'Básico',
    tags: ['monocromática', 'acromática', 'terrosa', 'pastel', 'neón', 'desaturada', 'alta saturación'],
    source: 'Núcleo Colectivo · Color',
    license: 'CC BY-NC-SA 4.0',
  },

  // C. Estéticas visuales y referencias fílmicas
  {
    id: 'm4-kodak-portra',
    moduleId: 'mod-04',
    title: 'Inspiración Fílmica: Kodak Portra, CineStill 800T y Fujifilm',
    category: 'Estéticas visuales',
    subcategory: 'C. Estéticas visuales y referencias fílmicas',
    description:
      'Referencias estéticas a emulsiones clásicas para orientar calidez de piel, grano y halos nocturnos.',
    explanation:
      'Nota honesta: las menciones a películas (Kodak Portra 400, Gold 200, Tri-X 400, CineStill 800T, Fujifilm Velvia/Pro 400H, Ilford HP5) sirven como inspiración estética de color, contraste y grano; la IA no simula químicamente la película real.',
    visual_examples: [
      'Documental cálido con respuesta cromática suave inspirada en Portra 400',
      'Escena nocturna con halos rojizos sutiles alrededor de luces inspirada en CineStill 800T',
    ],
    image: IMG.portra,
    aspectRatio: '3:2',
    objectPosition: 'top',
    diagramType: 'color-palette',
    diagramConfig: { swatches: ['#E8C5A5', '#C88D6B', '#4A6B7C', '#24272B'] },
    technical_terms: ['Portra-inspired tones', 'CineStill halation look', 'Tri-X / HP5 contrast', 'Aesthetic inspiration'],
    prompt_examples: {
      es: 'Fotografía urbana al anochecer inspirada estéticamente en película de tungsteno 800T: luces de neón con halos rojos sutiles, sombras verdosas frías, grano fino y atmósfera cinematográfica sin exageración.',
      en: 'Dusk street photograph aesthetically inspired by 800T tungsten film: subtle red halation around practical lights, cool greenish shadows, fine organic grain and realistic cinema atmosphere.',
    },
    builderPatch: { colorPalette: 'CineStill 800T film look with distinct red halation around point lights' },
    related_topics: ['m2-cam-analogica-instantanea', 'm4-estetica-noir'],
    difficulty: 'Intermedio',
    tags: ['kodak portra', 'kodak gold', 'tri-x', 'cinestill', 'fujifilm', 'ilford', 'cinematic look'],
    source: 'Núcleo Colectivo · Color y Emulsión',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm4-estetica-noir',
    moduleId: 'mod-04',
    title: 'Estéticas Visuales: Film Noir, Neo Noir, Editorial y Minimalista',
    category: 'Estéticas visuales',
    subcategory: 'C. Estéticas visuales y referencias fílmicas',
    description:
      'Códigos visuales completos que integran luz, vestuario, ritmo cromático y atmósfera: desde el Film Noir clásico hasta la estética futurista o vintage.',
    explanation:
      'Definir la estética global alinea todos los demás parámetros: Film Noir (B&N contraste extremo, persianas), Neo Noir (noche húmeda, sombras densas + un color acento), Minimalista (geometría limpia y aire), Documental (luz disponible sin poses), Vintage (calidez 70s/80s).',
    visual_examples: [
      'Retrato Neo Noir nocturno bajo lluvia con iluminación lateral',
      'Bodegón minimalista de galería con luz suave y geometría pura',
    ],
    image: IMG.noir,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: -85, fillLevel: 'none', rimActive: true, contrast: 'extreme' },
    technical_terms: ['Film Noir', 'Neo Noir', 'Contemporary Editorial', 'Minimalist gallery', 'Retro / Vintage'],
    prompt_examples: {
      es: 'Escena de estética Neo Noir contemporánea bajo llovizna nocturna: detective cultural mirando desde la esquina de una galería iluminada por un único reflejo ámbar sobre pavimento mojado, sombras ricas y 35mm anamórfico.',
      en: 'Contemporary Neo Noir scene under light nocturnal drizzle: character framed at the edge of an urban gallery lit by a single warm amber reflection on wet asphalt, deep shadows and cinema framing.',
    },
    builderPatch: { visualStyle: 'Neo Noir', colorPalette: 'Kodak 2383 cinematic print film stock, rich blacks and soft highlight roll-off' },
    related_topics: ['m3-chiaroscuro', 'm4-kodak-portra'],
    difficulty: 'Básico',
    tags: ['film noir', 'neo noir', 'editorial', 'documental', 'vintage', 'retro', 'futurista', 'minimalista'],
    source: 'Núcleo Colectivo · Dirección de Arte',
    license: 'CC BY-NC-SA 4.0',
  },

  // =========================================================================
  // MÓDULO 05 — COMPOSICIÓN Y LENGUAJE DE CÁMARA
  // A. Tipos de plano
  // =========================================================================
  {
    id: 'm5-gran-plano-general',
    moduleId: 'mod-05',
    title: 'Gran Plano General (GPG) y Plano General (PG)',
    category: 'Tipos de plano',
    subcategory: 'A. Tipos de plano',
    description:
      '• GPG (Extreme Long Shot): domina el territorio, la arquitectura o el paisaje; la figura humana es diminuta.\n• PG (Long Shot): muestra cuerpo completo integrado en su entorno contextual.',
    explanation:
      'Sirven para situar geografía, escala monumental y relación entre comunidad y ambiente antes de acercarse emocionalmente al protagonista.',
    visual_examples: [
      'Gran plano general de ladera urbana y montañas al alba',
      'Plano general de artista caminando por nave industrial de exposiciones',
    ],
    image: IMG.ews,
    aspectRatio: '16:9',
    diagramType: 'shot-size',
    diagramConfig: { overlayMode: 'gpg' },
    technical_terms: ['Extreme Long Shot (ELS)', 'Long Shot (LS)', 'Establishing shot'],
    prompt_examples: {
      es: 'Gran plano general (Extreme Long Shot) de un valle andino envuelto en bruma matinal donde una pequeña casa comunitaria de madera destaca junto al río, luz suave del alba, gran amplitud espacial.',
      en: 'Extreme Long Shot of a misty Andean valley at dawn where a small timber community house stands beside a winding river, expansive scale and soft morning haze.',
    },
    builderPatch: { shotSize: 'Gran Plano General (ELS)', lens: '24mm wide angle lens' },
    related_topics: ['m5-plano-entero-americano', 'm5-angulo-cenital'],
    difficulty: 'Básico',
    tags: ['gran plano general', 'plano general', 'ELS', 'LS', 'escala'],
    source: 'Núcleo Colectivo · Lenguaje de Cámara',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm5-plano-entero-americano',
    moduleId: 'mod-05',
    title: 'Plano Entero (PE), Plano Americano (PA) y Plano Medio (PM)',
    category: 'Tipos de plano',
    subcategory: 'A. Tipos de plano',
    description:
      '• Plano Entero: cabeza a pies exactos.\n• Plano Americano (3/4): corta justo sobre las rodillas (ideal para acción, moda y actitud corporal).\n• Plano Medio: corta en la cintura (conversación y gesto de manos).',
    explanation:
      'Son los planos vertebradores de la narrativa visual y la moda editorial: permiten leer lenguaje corporal, vestuario y acción manual sin perder conexión con el rostro.',
    visual_examples: [
      'Plano medio de artesano modelando cerámica con ambas manos sobre el torno',
    ],
    image: IMG.composition,
    diagramType: 'shot-size',
    diagramConfig: { overlayMode: 'pm' },
    technical_terms: ['Full Shot', 'Cowboy / 3/4 Shot', 'Medium Shot', 'Body language framing'],
    prompt_examples: {
      es: 'Plano medio (Medium Shot) desde la cintura hacia arriba de una ceramista en su taller amasando barro fresco sobre mesa de madera, gesto natural de las manos, lente 50mm.',
      en: 'Medium shot from the waist up of a ceramicist in her workshop kneading raw clay on a timber workbench, natural hand gesture and focused expression, 50mm lens.',
    },
    builderPatch: { shotSize: 'Plano Medio (MS)', lens: '50mm standard lens' },
    related_topics: ['m5-primer-plano', 'm5-gran-plano-general'],
    difficulty: 'Básico',
    tags: ['plano entero', 'plano americano', 'plano medio', 'medium shot'],
    source: 'Núcleo Colectivo · Lenguaje de Cámara',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm5-primer-plano',
    moduleId: 'mod-05',
    title: 'Plano Medio Corto, Primer Plano, Primerísimo Primer Plano y Detalle',
    category: 'Tipos de plano',
    subcategory: 'A. Tipos de plano',
    description:
      '• PMC: pecho arriba.\n• Primer Plano (PP): hombros y rostro (intimidad psicológica).\n• PPP: frente a barbilla.\n• Plano Detalle (PD): un ojo, una llave, la textura del papel o una gota.',
    explanation:
      'A medida que se cierra el encuadre, crece la carga emocional y la exigencia de microtextura real (iris, poros, tejidos, vetas).',
    visual_examples: [
      'Primer plano emocional con mirada directa y bokeh suave',
      'Plano detalle macro de gotas sobre piedra mineral',
    ],
    image: IMG.noir,
    diagramType: 'shot-size',
    diagramConfig: { overlayMode: 'pp' },
    technical_terms: ['Medium Close-Up (MCU)', 'Close-Up (CU)', 'Extreme Close-Up (ECU)', 'Detail / Insert shot'],
    prompt_examples: {
      es: 'Primerísimo primer plano (Extreme Close-Up) de las manos tejiendo fibras vegetales teñidas con pigmentos naturales, enfocando el entramado táctil con lente 85mm y luz cálida rasante.',
      en: 'Extreme Close-Up detail shot of hands weaving naturally dyed plant fibers, razor-sharp focus on tactile weave texture under warm raking daylight, 85mm lens.',
    },
    builderPatch: { shotSize: 'Primer Plano (CU)', lens: '85mm portrait prime lens' },
    related_topics: ['m1-foto-retrato', 'm2-param-apertura'],
    difficulty: 'Básico',
    tags: ['primer plano', 'primerísimo primer plano', 'plano detalle', 'PMC', 'CU', 'ECU'],
    source: 'Núcleo Colectivo · Lenguaje de Cámara',
    license: 'CC BY-NC-SA 4.0',
  },

  // B. Ángulos de cámara
  {
    id: 'm5-angulo-normal-picado-contrapicado',
    moduleId: 'mod-05',
    title: 'Ángulo Normal, Contrapicado (Low Angle) y Picado (High Angle)',
    category: 'Ángulos de cámara',
    subcategory: 'B. Ángulos de cámara',
    description:
      '• Normal (Eye Level): empatía horizontal de igual a igual.\n• Contrapicado (Low Angle): cámara baja mirando arriba; otorga fuerza o monumentalidad.\n• Picado (High Angle): cámara alta mirando abajo; muestra contexto o vulnerabilidad.',
    explanation:
      'La altura física de la cámara define la relación de poder y empatía con el sujeto antes de leer cualquier detalle.',
    visual_examples: [
      'Contrapicado arquitectónico mirando hacia cúpula o personaje heroico',
      'Picado suave sobre plaza pública observando recorrido de peatones',
    ],
    image: IMG.lowAngle,
    aspectRatio: '3:2',
    objectPosition: 'top',
    diagramType: 'camera-angle',
    diagramConfig: { overlayMode: 'low-angle' },
    technical_terms: ['Eye-level neutral', 'Low angle heroic', 'High angle overview'],
    prompt_examples: {
      es: 'Fotografía desde ángulo contrapicado bajo (Low Angle) de un puente peatonal contemporáneo recortado contra nubes doradas del atardecer, sensación de monumentalidad y líneas fugadas hacia arriba.',
      en: 'Low-angle photograph looking up at a contemporary pedestrian bridge silhouetted against golden sunset clouds, conveying monumental scale and converging upward geometry.',
    },
    builderPatch: { cameraAngle: 'Contrapicado (Low Angle)' },
    related_topics: ['m5-angulo-cenital', 'm5-angulo-holandes-pov'],
    difficulty: 'Básico',
    tags: ['eye level', 'low angle', 'high angle', 'normal', 'picado', 'contrapicado'],
    source: 'Núcleo Colectivo · Ángulos',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm5-angulo-cenital',
    moduleId: 'mod-05',
    title: 'Cenital (Bird’s Eye / Overhead) y Nadir (Worm’s Eye)',
    category: 'Ángulos de cámara',
    subcategory: 'B. Ángulos de cámara',
    description:
      '• Cenital / Overhead (90° abajo): vista aérea o flat-lay de mesa.\n• Nadir / Worm’s Eye (90° arriba): desde el suelo mirando verticalmente al cielo o copa de árboles.',
    explanation:
      'El cenital (Overhead / Top-down) es indispensable para diseño editorial flat-lay, mesas de trabajo, arquitectura en planta y tomas aéreas de dron. El nadir crea vértigo geométrico en bosques o rascacielos.',
    visual_examples: [
      'Cenital de mesa de taller con acuarelas, pinceles y cuaderno abierto',
      'Nadir desde el centro de un bosque de palmas de cera mirando al cielo con bruma',
    ],
    image: IMG.birdsEye,
    aspectRatio: '1:1',
    diagramType: 'camera-angle',
    diagramConfig: { overlayMode: 'birds-eye' },
    technical_terms: ["Bird's eye view", 'Overhead flat-lay', "Worm's eye nadir"],
    prompt_examples: {
      es: 'Vista cenital perpendicular (Overhead 90°) de una mesa de trabajo de diseño gráfico: cuadernos de bocetos abiertos, muestras de papel texturizado, tintas minerales y luz natural uniforme sin sombras duras.',
      en: 'Perpendicular 90-degree overhead flat-lay of a graphic designer desk: open sketchbooks, textured paper swatches and mineral inks under soft even daylight.',
    },
    builderPatch: { cameraAngle: 'Cenital / Overhead (90°)' },
    related_topics: ['m5-angulo-normal-picado-contrapicado', 'm5-angulo-holandes-pov'],
    difficulty: 'Básico',
    tags: ['cenital', 'nadir', 'overhead', "bird's eye", "worm's eye", 'flat-lay'],
    source: 'Núcleo Colectivo · Ángulos',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm5-angulo-holandes-pov',
    moduleId: 'mod-05',
    title: 'Plano Holandés (Dutch Angle), Over the Shoulder y POV',
    category: 'Ángulos de cámara',
    subcategory: 'B. Ángulos de cámara',
    description:
      '• Holandés (Tilted): horizonte inclinado para inquietud o dinamismo.\n• Over the Shoulder (OTS): por encima del hombro hacia otro interlocutor.\n• POV: cámara en primera persona viendo exactamente lo que ven los ojos del personaje.',
    explanation:
      'Muy efectivos en guiones de video e historieta para generar tensión psicológica (Holandés), diálogo cinematográfico (OTS) o inmersión táctil (POV de manos trabajando).',
    visual_examples: [
      'POV mirando las propias manos sosteniendo una cámara analógica frente a un mirador',
      'Plano holandés sutil de 15° en pasillo arquitectónico nocturno',
    ],
    image: IMG.dutch,
    aspectRatio: '16:9',
    diagramType: 'camera-angle',
    diagramConfig: { overlayMode: 'dutch' },
    technical_terms: ['Dutch / Tilted angle', 'Over-the-shoulder (OTS)', 'First-person POV'],
    prompt_examples: {
      es: 'Plano subjetivo en primera persona (POV) mirando hacia abajo las manos de un ilustrador dibujando con plumilla sobre una mesa frente a un ventanal lluvioso, inmersión directa.',
      en: 'First-person POV shot looking down at an illustrator hands drawing with a dip pen on a table facing a rain-streaked window, immediate immersive perspective.',
    },
    builderPatch: { cameraAngle: 'POV (Primera Persona)' },
    related_topics: ['m5-angulo-normal-picado-contrapicado', 'm6-mov-handheld-steadicam'],
    difficulty: 'Intermedio',
    tags: ['dutch angle', 'holandés', 'over the shoulder', 'POV', 'tilted'],
    source: 'Núcleo Colectivo · Ángulos',
    license: 'CC BY-NC-SA 4.0',
  },

  // C. Composición
  {
    id: 'm5-tercios-golden-simetria',
    moduleId: 'mod-05',
    title: 'Regla de Tercios, Proporción Áurea, Simetría y Perspectiva Central',
    category: 'Composición',
    subcategory: 'C. Reglas y recursos de composición',
    description:
      'Estructuras clásicas de orden visual para ubicar puntos de interés o construir rigor geométrico.',
    explanation:
      '• Regla de Tercios: sitúa sujeto en intersecciones laterales dejando aire hacia donde mira.\n• Proporción Áurea: espiral orgánica para recorridos naturales.\n• Simetría y Perspectiva Central: orden ceremonial o arquitectónico (estilo Wes Anderson o Kubrick).',
    visual_examples: [
      'Arco arquitectónico con persona ubicada en el tercio derecho y perspectiva profunda',
    ],
    image: IMG.composition,
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'thirds' },
    technical_terms: ['Rule of thirds', 'Golden ratio spiral', 'Central symmetry', 'One-point perspective'],
    prompt_examples: {
      es: 'Composición arquitectónica de simetría central perfecta mirando a lo largo de una galería abovedada de piedra, punto de fuga único en el centro con una figura solitaria iluminada al final del corredor.',
      en: 'Perfect central symmetry architectural composition looking down a vaulted stone gallery, strict one-point perspective leading to a solitary backlit figure at the center.',
    },
    builderPatch: { visualStyle: 'Simetría & Perspectiva Central' },
    related_topics: ['m5-lineas-encuadre-capas', 'm5-espacio-negativo'],
    difficulty: 'Básico',
    tags: ['regla de tercios', 'simetría', 'perspectiva central', 'golden ratio'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm5-lineas-encuadre-capas',
    moduleId: 'mod-05',
    title: 'Líneas Guía, Encuadre Natural (Framing), Profundidad por Capas y Perspectiva Forzada',
    category: 'Composición',
    subcategory: 'C. Reglas y recursos de composición',
    description:
      'Recursos espaciales para guiar la mirada dentro de la imagen bidimensional creando sensación tridimensional.',
    explanation:
      '• Líneas guía: caminos, barandillas o sombras que apuntan al sujeto.\n• Encuadre dentro del encuadre: usar arcos, puertas o ventanas para rodear al protagonista.\n• Profundidad por capas: objeto desenfocado en primer plano + sujeto nítido en medio + fondo atmosférico.',
    visual_examples: [
      'Persona enmarcada por arco de concreto con líneas convergentes en el suelo',
    ],
    image: IMG.leading,
    aspectRatio: '3:2',
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'framing' },
    technical_terms: ['Leading lines', 'Frame within a frame', 'Foreground-midground-background layers', 'Forced perspective'],
    prompt_examples: {
      es: 'Fotografía con encuadre natural dentro de la escena: observamos a una lectora sentada en un patio soleado a través del marco oscuro de una puerta de madera antigua en primer plano desenfocado, profundidad por capas.',
      en: 'Layered composition using natural framing: a woman reading in a sunlit courtyard viewed through the dark out-of-focus doorframe in the foreground, clear depth separation across three planes.',
    },
    builderPatch: { visualStyle: 'Encuadre Natural & Capas' },
    related_topics: ['m5-tercios-golden-simetria', 'm5-espacio-negativo'],
    difficulty: 'Intermedio',
    tags: ['líneas guía', 'encuadre', 'profundidad por capas', 'perspectiva forzada'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm5-espacio-negativo',
    moduleId: 'mod-05',
    title: 'Espacio Negativo y Equilibrio Visual',
    category: 'Composición',
    subcategory: 'C. Reglas y recursos de composición',
    description:
      'Uso consciente del vacío (cielo despejado, muro neutro, agua quieta) para dar respiro, elegancia editorial y espacio para texto.',
    explanation:
      'Indispensable para campañas publicitarias, portadas de libros y afiches culturales donde el sujeto ocupa solo un 20–30% del área total y el resto respira con textura sutil.',
    visual_examples: [
      'Frasco minimalista en esquina inferior derecha con 70% de piedra y sombra limpia',
    ],
    image: IMG.floating,
    aspectRatio: '3:4',
    diagramType: 'composition',
    diagramConfig: { overlayMode: 'negative-space' },
    technical_terms: ['Negative space', 'Visual balance', 'Editorial copy room'],
    prompt_examples: {
      es: 'Composición minimalista con abundante espacio negativo: un pequeño árbol solitario en la esquina inferior izquierda ante una ladera de niebla uniforme gris perla que ocupa el 75% superior del encuadre, equilibrio visual sereno.',
      en: 'Minimalist composition with generous negative space: a small solitary tree anchored in the lower-left corner against a soft pearl-gray misty slope occupying 75% of the frame, serene visual balance.',
    },
    builderPatch: { visualStyle: 'Minimalismo & Espacio Negativo' },
    related_topics: ['m1-diseno-carteles', 'm5-tercios-golden-simetria'],
    difficulty: 'Básico',
    tags: ['espacio negativo', 'equilibrio visual', 'minimalismo', 'aire'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
  },
];
