import { VISUAL_LIBRARY_PATHS } from './visualLibraryRegistry';

import expA1PosterImg from '../assets/images/exp_a1_poster_design_1795402465264.jpg';
import expA2TypoImg from '../assets/images/exp_a2_3d_typography_1795402464466.jpg';
import expA3EditorialImg from '../assets/images/exp_a3_editorial_magazine_1795402462021.jpg';
import expA4BrandImg from '../assets/images/exp_a4_brand_identity_1795402464037.jpg';
import expB2SurrealImg from '../assets/images/exp_b2_surreal_photography_1795402464300.jpg';
import expB4GastronomyImg from '../assets/images/exp_b4_gastronomy_photo_1795402462517.jpg';
import expC3ComicImg from '../assets/images/exp_c3_comic_panels_1795402466159.jpg';
import expC4ArtToyImg from '../assets/images/exp_c4_colombian_art_toy_1795402464079.jpg';
import expE1WebUiImg from '../assets/images/web_design_showcase_1794780465236.jpg';
import expE2SocialImg from '../assets/images/exp_e2_social_campaign_1795402463513.jpg';
import expE3PackagingImg from '../assets/images/exp_e3_artisan_packaging_1795402462397.jpg';
import expE4InfographicImg from '../assets/images/exp_e4_editorial_infographic_1795402462433.jpg';
import expF1CollageImg from '../assets/images/exp_f1_surreal_collage_1795402463707.jpg';
import expF5SpeculativeImg from '../assets/images/exp_f5_speculative_design_1795402464154.jpg';

export type CreativeDisciplineId =
  | 'diseno-grafico'
  | 'fotografia-arte'
  | 'ilustracion-mundos'
  | 'video-narrativas'
  | 'web-digital'
  | 'laboratorio-experimental';

export type ExperienceLevel = 'Principiante' | 'Intermedio' | 'Avanzado';

export type PromptFieldKey =
  | 'sujeto'
  | 'accion'
  | 'contexto'
  | 'estilo'
  | 'composicion'
  | 'iluminacion'
  | 'color'
  | 'texturas'
  | 'camara'
  | 'materiales'
  | 'formato'
  | 'calidad';

export interface PromptFieldSpec {
  key: PromptFieldKey;
  label: string;
  placeholder: string;
  defaultValue: string;
  options: string[];
}

export interface InspirationReference {
  title: string;
  note: string;
  image: string;
  alt: string;
}

export interface StyleVariation {
  id: string;
  label: string;
  description: string;
  modifier: string;
}

export interface CreativeDisciplineMeta {
  id: CreativeDisciplineId;
  letter: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  isExperimental?: boolean;
}

export interface CreativeLabExperience {
  id: string;
  code: string;
  title: string;
  description: string;
  exercise: string;
  disciplineId: CreativeDisciplineId;
  category: string;
  level: ExperienceLevel;
  duration: string;
  durationMinutes: number;
  image: string;
  imageAlt: string;
  objective: string;
  inspirations: InspirationReference[];
  promptFields: PromptFieldSpec[];
  starterPrompt: string;
  styleVariations: StyleVariation[];
  tools: string[];
  ethicsTip: string;
  tags: string[];
  featured?: boolean;
}

export interface ExpressChallengeItem {
  id: string;
  number: string;
  title: string;
  brief: string;
  instructions: string[];
  starterPrompt: string;
  category: string;
  disciplineId: CreativeDisciplineId;
  level: ExperienceLevel;
  durationMinutes: number;
  image: string;
  imageAlt: string;
  referenceNote: string;
  tools: string[];
}

export interface CreativeProjectChallenge {
  id: string;
  number: string;
  title: string;
  summary: string;
  deliverable: string;
  duration: string;
  durationMinutes: number;
  level: ExperienceLevel;
  disciplineId: CreativeDisciplineId;
  category: string;
  image: string;
  imageAlt: string;
  stages: string[];
  starterPrompt: string;
  tools: string[];
}

export interface OpenExperimentItem {
  id: string;
  number: string;
  question: string;
  provocation: string;
  startingHint: string;
  suggestedPrompt: string;
  disciplineId: CreativeDisciplineId;
  image: string;
  imageAlt: string;
  tools: string[];
}

export interface CommunityExperimentEntry {
  id: string;
  author: string;
  title: string;
  category: string;
  disciplineId: CreativeDisciplineId;
  exerciseId?: string;
  prompt: string;
  toolUsed: string;
  notes: string;
  image: string;
  imageAlt: string;
  createdAt: string;
  isUserCreated?: boolean;
}

export const EXPERIENCES_STORAGE_KEYS = {
  completedLabs: 'nc_exp_completed_labs_v1',
  completedExpress: 'nc_exp_completed_express_v1',
  projectStages: 'nc_exp_project_stages_v1',
  openResponses: 'nc_exp_open_responses_v1',
  communityGallery: 'nc_exp_community_gallery_v1',
  savedVersions: 'nc_exp_saved_versions_v1',
} as const;

export const CREATIVE_DISCIPLINES: CreativeDisciplineMeta[] = [
  {
    id: 'diseno-grafico',
    letter: 'A',
    title: 'Diseño Gráfico y Comunicación Visual',
    subtitle: 'Carteles, tipografía experimental, editorial e identidad visual',
    description:
      'Sistemas gráficos, jerarquía tipográfica, retículas editoriales y marcas culturales con dirección de arte controlada.',
    accentColor: '#326BFF',
  },
  {
    id: 'fotografia-arte',
    letter: 'B',
    title: 'Fotografía y Dirección de Arte',
    subtitle: 'Retrato cinematográfico, surrealismo, espacios y gastronomía',
    description:
      'Control de luz, encuadre, óptica, atmósfera y puesta en escena fotográfica sin caer en acabados plásticos.',
    accentColor: '#F8C300',
  },
  {
    id: 'ilustracion-mundos',
    letter: 'C',
    title: 'Ilustración, Personajes y Mundos Creativos',
    subtitle: 'Diseño de personajes, worldbuilding, cómic y art toys',
    description:
      'Construcción de universos coherentes, hojas de personaje, narrativa secuencial y objetos coleccionables.',
    accentColor: '#7545D6',
  },
  {
    id: 'video-narrativas',
    letter: 'D',
    title: 'Video, Animación y Narrativas',
    subtitle: 'Storyboards, loops animados, cortometrajes IA y visuales musicales',
    description:
      'Del guion visual y la planificación por planos al movimiento fluido, el montaje rítmico y el concierto audiovisual.',
    accentColor: '#326BFF',
  },
  {
    id: 'web-digital',
    letter: 'E',
    title: 'Web, Productos y Comunicación Digital',
    subtitle: 'Interfaces web, campañas sociales, empaques artesanales e infografía',
    description:
      'Prototipado de experiencias digitales, sistemas de campaña, packaging sostenible y visualización clara de datos.',
    accentColor: '#F8C300',
  },
  {
    id: 'laboratorio-experimental',
    letter: 'F',
    title: 'Laboratorio Experimental · Núcleo Colectivo',
    subtitle: 'Collage imposible, arte generativo, instalaciones, sonido y especulación',
    description:
      'Territorio abierto para el cruce entre arte contemporáneo, tecnología, pensamiento crítico, materialidades híbridas y futuros posibles.',
    accentColor: '#7545D6',
    isExperimental: true,
  },
];

function makeField(
  key: PromptFieldKey,
  label: string,
  defaultValue: string,
  options: string[],
  placeholder?: string
): PromptFieldSpec {
  return {
    key,
    label,
    defaultValue,
    options,
    placeholder: placeholder || `Describe ${label.toLowerCase()}...`,
  };
}

export const CREATIVE_LAB_EXPERIENCES: CreativeLabExperience[] = [
  // =========================================================================
  // A. DISEÑO GRÁFICO Y COMUNICACIÓN VISUAL
  // =========================================================================
  {
    id: 'exp-a1-cartel',
    code: 'A1',
    title: 'Diseñar un cartel o afiche',
    description: 'Crear carteles culturales, musicales, sociales y experimentales a partir de una idea.',
    exercise: 'Diseña un cartel para un festival de arte y tecnología.',
    disciplineId: 'diseno-grafico',
    category: 'Diseño Gráfico',
    level: 'Principiante',
    duration: '20 min',
    durationMinutes: 20,
    image: expA1PosterImg,
    imageAlt: 'Cartel experimental de diseño gráfico impreso en risografía sobre muro de concreto en galería',
    objective:
      'Traducir un concepto cultural o musical en un afiche con jerarquía visual clara, tensión gráfica y espacio reservado para tipografía.',
    inspirations: [
      {
        title: 'Afiche risográfico sobre concreto',
        note: 'Contraste de tintas planas, trama halftone y geometría suiza.',
        image: expA1PosterImg,
        alt: 'Afiche experimental con geometría en azul cobalto, ocre y negro sobre muro de concreto',
      },
      {
        title: 'Duotono editorial de alto impacto',
        note: 'Reducción cromática a dos tintas para impacto inmediato en calle.',
        image: VISUAL_LIBRARY_PATHS.colorDuotone,
        alt: 'Composición editorial en duotono cobalto y bermellón',
      },
      {
        title: 'Valla urbana y escala pública',
        note: 'Cómo respira el afiche en espacio arquitectónico real.',
        image: VISUAL_LIBRARY_PATHS.adBillboard,
        alt: 'Afiche y comunicación visual aplicada a escala urbana',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Concepto central', 'afiche contemporáneo para festival de arte y tecnología', [
        'afiche contemporáneo para festival de arte y tecnología',
        'cartel cultural para concierto de música electrónica andina',
        'póster de exposición de fotografía experimental y memoria',
      ]),
      makeField('estilo', 'Corriente gráfica', 'estilo suizo experimental con impresión risográfica', [
        'estilo suizo experimental con impresión risográfica',
        'gráfica latinoamericana serigráfica contemporánea',
        'brutalismo tipográfico con fotografía en alto contraste',
      ]),
      makeField('composicion', 'Composición y retícula', 'retícula asimétrica con formas geométricas y aire negativo superior para título', [
        'retícula asimétrica con formas geométricas y aire negativo superior para título',
        'diagonal dinámica con punto focal central escultórico',
        'bloques modulares en 3 columnas con tensión vertical',
      ]),
      makeField('color', 'Paleta de tintas', 'azul cobalto, amarillo ocre, negro carbón sobre papel algodón crema', [
        'azul cobalto, amarillo ocre, negro carbón sobre papel algodón crema',
        'bermellón intenso, negro tinta y blanco hueso',
        'verde bosque, violeta ácido y gris piedra',
      ]),
      makeField('texturas', 'Acabado e impresión', 'trama de semitonos, registro imperfecto de tinta y papel grueso sin estucar', [
        'trama de semitonos, registro imperfecto de tinta y papel grueso sin estucar',
        'serigrafía artesanal con superposición translúcida',
        'acabado litográfico mate de museo',
      ]),
      makeField('formato', 'Formato', 'cartel vertical 2:3 montado sobre muro de concreto iluminado con luz lateral', [
        'cartel vertical 2:3 montado sobre muro de concreto iluminado con luz lateral',
        'arte plano frontal listo para impresión 50x70 cm',
        'serie de tres afiches pegados en calle cultural',
      ]),
    ],
    starterPrompt:
      'Afiche contemporáneo para un festival de arte y tecnología, estilo suizo experimental en impresión risográfica, composición en retícula asimétrica con formas geométricas abstractas y espacio limpio superior para tipografía, paleta en azul cobalto, amarillo ocre y negro carbón sobre papel algodón crema, textura de semitonos y grano fino de papel, fotografiado sobre muro de concreto con luz natural oblicua, formato vertical 2:3.',
    styleVariations: [
      {
        id: 'riso',
        label: 'Risografía cultural',
        description: 'Sobreimpresión de tintas vibrantes con grano orgánico.',
        modifier: 'risograph two-tone overprint, visible ink grain, tactile uncoated cotton paper',
      },
      {
        id: 'bauhaus',
        label: 'Geometría Bauhaus',
        description: 'Formas puras, rigor constructivo y balance asimétrico.',
        modifier: 'Bauhaus modernist geometry, crisp diagonal balance, archival print clarity',
      },
      {
        id: 'photo-poster',
        label: 'Fotocartel editorial',
        description: 'Fotografía monocroma contrastada con acento cromático.',
        modifier: 'high-contrast monochrome documentary photograph integrated with bold geometric color overlay',
      },
    ],
    tools: ['Midjourney', 'Ideogram', 'FLUX', 'ChatGPT / DALL-E', 'Canva / Figma'],
    ethicsTip:
      'Verifica siempre los derechos de fuentes y referentes visuales; usa la IA para explorar composiciones y realiza el montaje tipográfico final en Figma o Illustrator.',
    tags: ['afiche', 'cartel', 'diseño gráfico', 'festival', 'risografía'],
    featured: true,
  },
  {
    id: 'exp-a2-tipografia',
    code: 'A2',
    title: 'Crear tipografía experimental',
    description: 'Transformar palabras en composiciones visuales, letras tridimensionales y tipografía expresiva.',
    exercise: 'Convierte la palabra «FUTURO» en una composición tipográfica 3D.',
    disciplineId: 'diseno-grafico',
    category: 'Tipografía Experimental',
    level: 'Principiante',
    duration: '15 min',
    durationMinutes: 15,
    image: expA2TypoImg,
    imageAlt: 'Letras escultóricas tridimensionales de aluminio cepillado, vidrio ahumado y piedra travertino',
    objective:
      'Explorar la letra como escultura material, combinando luz, reflejos, volumen y legibilidad para una palabra clave.',
    inspirations: [
      {
        title: 'Letras en aluminio y piedra',
        note: 'Volúmenes arquitectónicos sobre pedestal oscuro con luz rasante.',
        image: expA2TypoImg,
        alt: 'Composición tipográfica 3D en metal cepillado, vidrio y piedra travertino',
      },
      {
        title: 'Escultura 3D PBR',
        note: 'Control de materiales físicos y especularidad.',
        image: VISUAL_LIBRARY_PATHS.anim3dSculpture,
        alt: 'Escultura tridimensional con materiales PBR y luz de estudio',
      },
      {
        title: 'Fluidos y volumen lumínico',
        note: 'Tipografía que interactúa con atmósfera y refracción.',
        image: VISUAL_LIBRARY_PATHS.vfxFluidSmoke,
        alt: 'Simulación volumétrica de luz y humo sobre fondo oscuro',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Palabra o sigla', 'la palabra "FUTURO" en letras escultóricas tridimensionales', [
        'la palabra "FUTURO" en letras escultóricas tridimensionales',
        'la palabra "NÚCLEO" tallada como arquitectura monumental',
        'la palabra "SONIDO" formada por ondas metálicas y vidrio',
      ]),
      makeField('materiales', 'Materialidad de las letras', 'aluminio anodizado cepillado, vidrio ahumado translúcido y piedra travertino', [
        'aluminio anodizado cepillado, vidrio ahumado translúcido y piedra travertino',
        'cerámica esmaltada mate en ocre con filos de latón',
        'agua congelada cristalina con refracciones prismáticas',
      ]),
      makeField('iluminacion', 'Iluminación y cáusticas', 'luz lateral dura de estudio con reflejos cáusticos sobre la base', [
        'luz lateral dura de estudio con reflejos cáusticos sobre la base',
        'contraluz cálido dorado delineando los bordes metálicos',
        'iluminación difusa de museo sobre fondo neutro claro',
      ]),
      makeField('composicion', 'Encuadre', 'plano medio en perspectiva de tres cuartos sobre pedestal de concreto mate', [
        'plano medio en perspectiva de tres cuartos sobre pedestal de concreto mate',
        'vista frontal simétrica con fondo infinito minimalista',
        'plano contrapicado monumental contra cielo crepuscular',
      ]),
      makeField('calidad', 'Render y nitidez', 'fotografía de estudio de objeto real, lente 85mm, texturas microscópicas nítidas', [
        'fotografía de estudio de objeto real, lente 85mm, texturas microscópicas nítidas',
        'render físico Octane / Cinema 4D con profundidad de campo sutil',
        'estética de maqueta física iluminada en taller',
      ]),
    ],
    starterPrompt:
      'Composición tipográfica tridimensional con la palabra "FUTURO" en letras escultóricas monumentales construidas en aluminio cepillado, vidrio ahumado translúcido y piedra travertino porosa, apoyadas sobre un pedestal de concreto oscuro mate, iluminación lateral de estudio generando cáusticas suaves y reflejos nítidos, ángulo tres cuartos, fotografía de estudio con lente 85mm y textura física auténtica, formato 16:9.',
    styleVariations: [
      {
        id: 'mineral',
        label: 'Piedra y Metal',
        description: 'Brutalismo táctil con travertino y aluminio.',
        modifier: 'brutalist architectural letterforms, raw travertine and brushed steel, gallery lighting',
      },
      {
        id: 'glass',
        label: 'Óptica y Vidrio',
        description: 'Transparencia, refracción y dispersiones de color.',
        modifier: 'blown dichroic glass typography, crisp optical caustics and soft studio shadows',
      },
      {
        id: 'inflatable-foil',
        label: 'Cerámica Esmaltada',
        description: 'Volumen orgánico artesanal en esmalte brillante.',
        modifier: 'hand-glazed sculptural ceramic letters, organic imperfections, warm natural daylight',
      },
    ],
    tools: ['Ideogram 2.0', 'Midjourney v6', 'FLUX.1', 'Adobe Firefly', 'Blender'],
    ethicsTip:
      'Los modelos de imagen a veces deforman tildes o letras largas; usa palabras cortas (4–8 letras) o genera la base en Ideogram/FLUX y pule detalles en postproducción.',
    tags: ['tipografía', '3D', 'letras', 'materiales', 'branding'],
  },
  {
    id: 'exp-a3-editorial',
    code: 'A3',
    title: 'Diseñar una revista o editorial',
    description: 'Crear portadas, diagramación, artículos, retículas y sistemas gráficos editoriales.',
    exercise: 'Diseña una doble página editorial sobre inteligencia artificial y creatividad.',
    disciplineId: 'diseno-grafico',
    category: 'Diseño Editorial',
    level: 'Intermedio',
    duration: '30 min',
    durationMinutes: 30,
    image: expA3EditorialImg,
    imageAlt: 'Doble página abierta de revista contemporánea de arte y diseño sobre mesa de piedra travertino',
    objective:
      'Estructurar una doble página editorial equilibrando fotografía protagonista, columnas de lectura, espacios en blanco y ritmo visual.',
    inspirations: [
      {
        title: 'Doble página de arte contemporáneo',
        note: 'Balance entre bloque fotográfico y retícula limpia de columnas.',
        image: expA3EditorialImg,
        alt: 'Revista abierta mostrando diagramación editorial minimalista sobre mesa de piedra',
      },
      {
        title: 'Mesa cenital de proceso editorial',
        note: 'Ritmo geométrico visto desde arriba a 90 grados.',
        image: VISUAL_LIBRARY_PATHS.compBirdsEye,
        alt: 'Vista cenital de mesa de trabajo creativa con bocetos y materiales',
      },
      {
        title: 'Moda y fotografía editorial',
        note: 'Fotografía con aire negativo lista para dialogar con titulares.',
        image: VISUAL_LIBRARY_PATHS.photoFashion,
        alt: 'Fotografía editorial de moda con arquitectura brutalista',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Publicación', 'doble página abierta de revista independiente sobre inteligencia artificial y creatividad', [
        'doble página abierta de revista independiente sobre inteligencia artificial y creatividad',
        'portada y contraportada de catálogo de exposición de arte digital',
        'fanzine cultural impreso sobre fotografía documental y territorio',
      ]),
      makeField('composicion', 'Diagramación', 'retícula suiza de 4 columnas, fotografía arquitectónica a sangrado en izquierda y estudio material a la derecha', [
        'retícula suiza de 4 columnas, fotografía arquitectónica a sangrado en izquierda y estudio material a la derecha',
        'composición minimalista con amplio espacio blanco y fotografía central enmarcada',
        'collage editorial dinámico mezclando diagramas finos y retrato documental',
      ]),
      makeField('materiales', 'Papel y encuadernación', 'papel mate sin estucar de alto gramaje, encuadernación cosida abierta sobre travertino', [
        'papel mate sin estucar de alto gramaje, encuadernación cosida abierta sobre travertino',
        'papel prensa reciclado con textura orgánica sobre escritorio de madera',
        'catálogo de tapa dura con papel algodón marfil y bordes limpios',
      ]),
      makeField('iluminacion', 'Luz del mockup', 'luz natural de ventana lateral proyectando sombras diagonales suaves sobre las páginas', [
        'luz natural de ventana lateral proyectando sombras diagonales suaves sobre las páginas',
        'luz cenital difusa de estudio fotográfico sin brillos',
        'sol cálido de tarde marcando el relieve del pliegue central',
      ]),
      makeField('camara', 'Punto de vista', 'fotografía cenital a tres cuartos desde 45 grados con lente 50mm', [
        'fotografía cenital a tres cuartos desde 45 grados con lente 50mm',
        'toma cenital estricta a 90 grados para lectura completa de la retícula',
        'plano detalle del pliegue editorial con poca profundidad de campo',
      ]),
    ],
    starterPrompt:
      'Fotografía editorial en ángulo de tres cuartos de una revista contemporánea independiente abierta en doble página sobre inteligencia artificial y creatividad, apoyada en una mesa de piedra travertino, diagramación con retícula suiza de 4 columnas, abundante espacio blanco, fotografías artísticas en blanco y negro y tonos tierra, papel mate sin estucar con textura táctil real, luz natural suave de ventana con sombras sutiles, lente 50mm.',
    styleVariations: [
      {
        id: 'swiss',
        label: 'Retícula Suiza',
        description: 'Orden tipográfico, rigor y amplios márgenes.',
        modifier: 'Swiss international typographic grid, clean generous margins, monochrome photography accents',
      },
      {
        id: 'indie-zine',
        label: 'Fanzine Independiente',
        description: 'Energía experimental, papel táctil y collage.',
        modifier: 'independent art zine aesthetic, raw recycled paper texture, risograph accents, bold layout',
      },
      {
        id: 'museum-book',
        label: 'Catálogo de Museo',
        description: 'Elegancia curatorial, fotografía protagonista y calma visual.',
        modifier: 'museum monograph book spread, serene whitespace, fine art photographic plates',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'InDesign', 'Figma', 'ChatGPT'],
    ethicsTip:
      'Usa la IA para definir dirección de arte y bocetar ritmo editorial, pero maqueta siempre los textos reales con herramientas vectoriales para asegurar legibilidad y ortografía.',
    tags: ['editorial', 'revista', 'retícula', 'diagramación', 'publicación'],
  },
  {
    id: 'exp-a4-identidad',
    code: 'A4',
    title: 'Crear una identidad visual',
    description: 'Construir logos, paletas cromáticas, aplicaciones y sistemas de identidad para una marca.',
    exercise: 'Crea la identidad de una organización cultural imaginaria.',
    disciplineId: 'diseno-grafico',
    category: 'Branding e Identidad',
    level: 'Intermedio',
    duration: '30 min',
    durationMinutes: 30,
    image: expA4BrandImg,
    imageAlt: 'Sistema de identidad visual con papelería de algodón, muestrario de colores y bolsa de lona',
    objective:
      'Cohesionar símbolo, paleta cromática, materiales y soportes físicos en un sistema visual reconocible para un proyecto cultural.',
    inspirations: [
      {
        title: 'Papelería y muestrario cromático',
        note: 'Cómo conviven tarjetas, carpetas, tela y cartas de color reales.',
        image: expA4BrandImg,
        alt: 'Flat-lay de identidad visual para museo contemporáneo con muestras ocre, cobalto y carbón',
      },
      {
        title: 'Empaque y materialidad táctil',
        note: 'Coherencia entre identidad y soporte físico.',
        image: expE3PackagingImg,
        alt: 'Cajas de papel reciclado con grabado botánico y cinta textil',
      },
      {
        title: 'Afiche de sistema de marca',
        note: 'Extensión de la identidad al espacio cultural.',
        image: expA1PosterImg,
        alt: 'Afiche geométrico de sistema gráfico sobre concreto',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Organización o marca', 'sistema de identidad visual para un centro cultural contemporáneo imaginario', [
        'sistema de identidad visual para un centro cultural contemporáneo imaginario',
        'identidad gráfica para un laboratorio comunitario de cine y sonido',
        'branding para una editorial independiente de botánica andina',
      ]),
      makeField('materiales', 'Soportes del mockup', 'tarjetas en papel algodón, carpeta con golpe seco, tote bag de lona cruda y muestras de color', [
        'tarjetas en papel algodón, carpeta con golpe seco, tote bag de lona cruda y muestras de color',
        'credenciales de evento, afiche doblado, libreta cosida y sello metálico',
        'señalética arquitectónica en aluminio, guía impresa y funda textil',
      ]),
      makeField('color', 'Paleta de marca', 'amarillo ocre, azul cobalto profundo, negro carbón y crema cálido', [
        'amarillo ocre, azul cobalto profundo, negro carbón y crema cálido',
        'terracota mineral, verde musgo, arena y grafito',
        'violeta contemporáneo, blanco hueso y plata cepillada',
      ]),
      makeField('contexto', 'Superficie de presentación', 'mesa de piedra caliza cálida con luz natural direccional de estudio', [
        'mesa de piedra caliza cálida con luz natural direccional de estudio',
        'mesa arquitectónica de madera de roble claro con sombras limpias',
        'superficie de concreto pulido minimalista',
      ]),
      makeField('estilo', 'Lenguaje visual', 'minimalismo geométrico contemporáneo, sobrio, táctil y atemporal', [
        'minimalismo geométrico contemporáneo, sobrio, táctil y atemporal',
        'gráfica brutalista de alto contraste y carácter experimental',
        'estética orgánica editorial inspirada en artesanía y territorio',
      ]),
    ],
    starterPrompt:
      'Fotografía flat-lay de un sistema completo de identidad visual para un centro cultural contemporáneo imaginario sobre piedra caliza cálida: tarjetas en papel algodón grueso, carpeta negra con relieve en seco, bolsa de lona cruda, libreta minimalista y fichas físicas de paleta cromática en amarillo ocre, azul cobalto y carbón, luz natural suave direccional, fotografía comercial de diseño impecable.',
    styleVariations: [
      {
        id: 'cultural',
        label: 'Institución Cultural',
        description: 'Elegancia museográfica, algodón y relieve seco.',
        modifier: 'contemporary museum identity system, blind debossing, tactile heavy cotton stock',
      },
      {
        id: 'street-lab',
        label: 'Colectivo Independiente',
        description: 'Stickers, cintas, credenciales y energía urbana.',
        modifier: 'independent creative collective branding, vibrant screenprint tags, raw concrete table',
      },
      {
        id: 'eco-brand',
        label: 'Marca Sostenible',
        description: 'Fibras recicladas, tintas minerales y calidez.',
        modifier: 'sustainable craft brand identity, recycled sugarcane paper, botanical ink palette',
      },
    ],
    tools: ['Midjourney', 'Ideogram', 'FLUX', 'Figma', 'Adobe Illustrator'],
    ethicsTip:
      'Nunca registres un logotipo generado tal cual por IA sin redibujarlo vectorialmente y verificar originalidad frente a marcas existentes.',
    tags: ['branding', 'identidad visual', 'logo', 'papelería', 'paleta'],
  },

  // =========================================================================
  // B. FOTOGRAFÍA Y DIRECCIÓN DE ARTE
  // =========================================================================
  {
    id: 'exp-b1-retrato',
    code: 'B1',
    title: 'Crear un retrato cinematográfico',
    description: 'Transformar una fotografía cotidiana en un retrato editorial profesional mediante iluminación, composición y dirección de arte.',
    exercise: 'Convierte un retrato sencillo en una fotografía cinematográfica.',
    disciplineId: 'fotografia-arte',
    category: 'Fotografía Editorial',
    level: 'Principiante',
    duration: '15 min',
    durationMinutes: 15,
    image: VISUAL_LIBRARY_PATHS.photoNeoNoir,
    imageAlt: 'Retrato cinematográfico nocturno con iluminación de contraste y atmósfera editorial',
    objective:
      'Dominar dirección de luz (Rembrandt, Rim, Split), distancia focal (85mm) y etalonaje cinematográfico conservando textura real de piel.',
    inspirations: [
      {
        title: 'Retrato Neo-Noir atmosférico',
        note: 'Contraste dramático entre luz cálida y penumbra fría.',
        image: VISUAL_LIBRARY_PATHS.photoNeoNoir,
        alt: 'Retrato cinematográfico con iluminación atmosférica nocturna',
      },
      {
        title: 'Iluminación Rembrandt a 45°',
        note: 'Triángulo de luz clásico sobre la mejilla en sombra.',
        image: VISUAL_LIBRARY_PATHS.lightRembrandt,
        alt: 'Retrato de estudio con iluminación Rembrandt a 45 grados',
      },
      {
        title: 'Etalonaje Teal & Orange',
        note: 'Separación cromática cinematográfica en escena interior.',
        image: VISUAL_LIBRARY_PATHS.colorTealOrange,
        alt: 'Fotograma cinematográfico con etalonaje Teal y Orange',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Protagonista', 'retrato cinematográfico de una compositora joven mirando por una ventana lluviosa', [
        'retrato cinematográfico de una compositora joven mirando por una ventana lluviosa',
        'retrato editorial de un artesano adulto mayor en su taller al atardecer',
        'retrato íntimo de una bailarina descansando tras bambalinas',
      ]),
      makeField('iluminacion', 'Esquema de luz', 'iluminación Rembrandt lateral suave con luz de contorno cálida en cabello', [
        'iluminación Rembrandt lateral suave con luz de contorno cálida en cabello',
        'luz Split a 90 grados de alto contraste cinematográfico',
        'luz de ventana difusa en hora azul con reflejo tungsteno lejano',
      ]),
      makeField('camara', 'Óptica y cámara', 'lente 85mm f/1.8, foco preciso en los ojos, bokeh suave y grano 35mm', [
        'lente 85mm f/1.8, foco preciso en los ojos, bokeh suave y grano 35mm',
        'lente anamórfico 50mm f/2.0 con destello horizontal sutil',
        'cámara de formato medio 110mm f/2.8, textura cutánea hiperreal',
      ]),
      makeField('color', 'Color y película', 'paleta contenida inspirada en Kodak Portra con sombras azul petróleo', [
        'paleta contenida inspirada en Kodak Portra con sombras azul petróleo',
        'etalonaje Teal & Orange sobrio de cine independiente',
        'blanco y negro fílmico de grano plateado con negros profundos',
      ]),
      makeField('texturas', 'Realismo orgánico', 'poros reales, cabello suelto natural, tejido de lana con fibra visible, cero piel plástica', [
        'poros reales, cabello suelto natural, tejido de lana con fibra visible, cero piel plástica',
        'gotas de lluvia en el cristal y ligero vaho atmosférico',
        'polvo fino en el haz de luz y grano analógico sutil',
      ]),
    ],
    starterPrompt:
      'Retrato cinematográfico editorial de una compositora mirando serenamente junto a una ventana lluviosa al anochecer, iluminación Rembrandt lateral suave con delicado rim light cálido sobre el perfil, capturado en lente 85mm f/1.8 con foco nítido en los ojos y fondo en bokeh profundo, textura de piel completamente natural con poros reales sin retoque plástico, etalonaje fílmico sobrio inspirado en cine independiente en 35mm, relación 16:9.',
    styleVariations: [
      {
        id: 'rembrandt',
        label: 'Claroscuro Rembrandt',
        description: 'Volumen escultórico y calidez íntima.',
        modifier: 'classic 45-degree Rembrandt lighting, warm tungsten key, deep velvet shadow falloff',
      },
      {
        id: 'anamorphic',
        label: 'Cine Anamórfico',
        description: 'Encuadre widescreen, bokeh ovalado y atmósfera nocturna.',
        modifier: '2.39:1 anamorphic cinema still, oval bokeh, atmospheric mist, subtle halation',
      },
      {
        id: 'doc-35mm',
        label: 'Documental 35mm',
        description: 'Luz natural honesta y cadencia analógica.',
        modifier: 'candid 35mm Kodak Portra editorial portrait, available window light, authentic texture',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3', 'Photoshop Generative Fill', 'Lightroom'],
    ethicsTip:
      'Al trabajar con retratos de personas reales, solicita consentimiento explícito antes de subir fotografías propias a modelos externos y evita alterar rasgos identitarios de forma engañosa.',
    tags: ['retrato', 'cine', 'iluminación', '85mm', 'dirección de arte'],
    featured: true,
  },
  {
    id: 'exp-b2-surrealismo',
    code: 'B2',
    title: 'Crear fotografía surrealista',
    description: 'Combinar objetos, escenarios imposibles y metáforas visuales en composiciones fotográficas realistas.',
    exercise: 'Crea una imagen surrealista que represente un sueño o memoria.',
    disciplineId: 'fotografia-arte',
    category: 'Fotografía Surrealista',
    level: 'Intermedio',
    duration: '25 min',
    durationMinutes: 25,
    image: expB2SurrealImg,
    imageAlt: 'Escalera escultórica de travertino ascendiendo desde un lago espejo hacia nubes en el crepúsculo',
    objective:
      'Unir dos realidades incompatibles bajo una misma física de luz, reflejos y óptica creíble para producir asombro poético.',
    inspirations: [
      {
        title: 'Escalera imposible en espejo de agua',
        note: 'Luz y reflejo 100% verosímiles hacen creíble lo imposible.',
        image: expB2SurrealImg,
        alt: 'Fotografía surrealista de escalera flotante de piedra sobre salar espejo al atardecer',
      },
      {
        title: 'Bodegón flotante minimalista',
        note: 'Gravedad suspendida con iluminación limpia de estudio.',
        image: VISUAL_LIBRARY_PATHS.adFloating,
        alt: 'Objetos cerámicos suspendidos en el aire en bodegón minimalista',
      },
      {
        title: 'Gran plano territorial',
        note: 'Escala humana diminuta frente a lo monumental.',
        image: VISUAL_LIBRARY_PATHS.compExtremeWide,
        alt: 'Gran plano general de cordillera andina con bruma y escala monumental',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Metáfora o elemento imposible', 'una escalera de piedra travertino ascendiendo desde un salar espejo hacia nubes cúmulos', [
        'una escalera de piedra travertino ascendiendo desde un salar espejo hacia nubes cúmulos',
        'una biblioteca antigua inundada suavemente por niebla luminosa y peces de cristal',
        'un marco de puerta de madera solitario en medio de un desierto abriéndose hacia un bosque húmedo',
      ]),
      makeField('contexto', 'Escenario', 'planicie infinita de agua quieta al crepúsculo con horizonte lejano', [
        'planicie infinita de agua quieta al crepúsculo con horizonte lejano',
        'interior de casa colonial silenciosa con suelo cubierto de musgo y nubes bajas',
        'azotea urbana de concreto flotando sobre un mar de bruma andina',
      ]),
      makeField('iluminacion', 'Física de luz coherente', 'luz dorada baja de atardecer generando reflejos exactos sobre el agua', [
        'luz dorada baja de atardecer generando reflejos exactos sobre el agua',
        'luz nublada difusa de mañana con sombras suaves realistas',
        'claridad lunar fría con un único rayo cálido atravesando la escena',
      ]),
      makeField('camara', 'Óptica fotográfica', 'cámara analógica de formato medio 6x7, lente 45mm, profundidad de campo amplia', [
        'cámara analógica de formato medio 6x7, lente 45mm, profundidad de campo amplia',
        'lente gran angular 24mm rectilíneo con simetría precisa',
        'lente 50mm f/4 con grano fino de película fotográfica',
      ]),
      makeField('estilo', 'Referencia poética', 'realismo mágico fotográfico contemporáneo, sereno y contemplativo, sin brillos neón', [
        'realismo mágico fotográfico contemporáneo, sereno y contemplativo, sin brillos neón',
        'surrealismo arquitectónico inspirado en René Magritte y fotografía de galería',
        'poética onírica minimalista en tonos pastel desaturados',
      ]),
    ],
    starterPrompt:
      'Fotografía surrealista de arte contemporáneo: una escalera helicoidal de piedra travertino surge desde un lago salar completamente quieto y asciende hasta disolverse en nubes cúmulos bajas durante el crepúsculo, luz dorada baja en el horizonte reflejada con exactitud física sobre el agua espejo, cielo índigo suave, capturada en cámara de formato medio con grano sutil de película, estética poética y silenciosa sin efectos fantasiosos artificiales.',
    styleVariations: [
      {
        id: 'magritte',
        label: 'Poética Magritte',
        description: 'Claridad diurna, paradoja limpia y misterio calmo.',
        modifier: 'daylight poetic surrealism, crisp architectural clarity, quiet metaphysical paradox',
      },
      {
        id: 'magic-realism',
        label: 'Realismo Mágico',
        description: 'Atmósfera latinoamericana, humedad, luz dorada y memoria.',
        modifier: 'Latin American magical realism photography, humid atmospheric mist, warm analog film grain',
      },
      {
        id: 'dream-minimal',
        label: 'Onírico Minimalista',
        description: 'Pocos elementos, silencio espacial y composición geométrica.',
        modifier: 'minimalist fine-art dreamscape, vast negative space, muted atmospheric color palette',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3', 'Photoshop'],
    ethicsTip:
      'En fotografía conceptual, la transparencia fortalece el valor artístico: documenta cuándo una imagen es fotografía manipulada o generada por IA.',
    tags: ['surrealismo', 'realismo mágico', 'metáfora', 'fine art', 'sueños'],
  },
  {
    id: 'exp-b3-espacios',
    code: 'B3',
    title: 'Transformar espacios y arquitectura',
    description: 'Rediseñar habitaciones, edificios, espacios culturales y escenarios urbanos con distintos estilos.',
    exercise: 'Transforma un espacio cotidiano en un lugar futurista, natural o artístico.',
    disciplineId: 'fotografia-arte',
    category: 'Arquitectura y Espacios',
    level: 'Intermedio',
    duration: '20 min',
    durationMinutes: 20,
    image: VISUAL_LIBRARY_PATHS.photoArchitecture,
    imageAlt: 'Pabellón arquitectónico contemporáneo en concreto visto y madera cálida bajo luz oblicua',
    objective:
      'Reimaginar un espacio real modificando materialidad, vegetación, luz solar y función cultural mientras se respetan proporciones y líneas verticales.',
    inspirations: [
      {
        title: 'Concreto, madera y sol oblicuo',
        note: 'Verticales rectas (tilt-shift) y diálogo entre material mineral y luz.',
        image: VISUAL_LIBRARY_PATHS.photoArchitecture,
        alt: 'Arquitectura contemporánea de concreto y madera con sombras geométricas',
      },
      {
        title: 'Ultra gran angular 14mm',
        note: 'Amplitud espacial extrema en interiores monumentales.',
        image: VISUAL_LIBRARY_PATHS.focal14mm,
        alt: 'Interior museográfico capturado con lente 14mm',
      },
      {
        title: 'Líneas guía en arcos',
        note: 'Perspectiva rítmica que conduce la mirada a través del espacio.',
        image: VISUAL_LIBRARY_PATHS.compLeadingLines,
        alt: 'Columnata de arcos en ladrillo con punto de fuga luminoso',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Espacio a transformar', 'antigua bodega industrial reconvertida en centro cultural biofílico con biblioteca abierta', [
        'antigua bodega industrial reconvertida en centro cultural biofílico con biblioteca abierta',
        'habitación cotidiana transformada en estudio minimalista con luz natural y plantas tropicales',
        'plaza urbana de cemento reimaginada como jardín comunitario sombreado con pabellón de bambú',
      ]),
      makeField('materiales', 'Materialidad arquitectónica', 'concreto visto cálido, madera de cedro, acero negro y vidrio transparente', [
        'concreto visto cálido, madera de cedro, acero negro y vidrio transparente',
        'ladrillo artesanal local, guadua estructural y patios con vegetación nativa',
        'yeso mineral encalado, piedra volcánica y textiles crudos',
      ]),
      makeField('iluminacion', 'Hora solar', 'sol oblicuo de media tarde proyectando geometrías largas de luz sobre el piso', [
        'sol oblicuo de media tarde proyectando geometrías largas de luz sobre el piso',
        'luz cenital entrando por tragaluces con vegetación colgante',
        'atardecer cálido combinado con lámparas arquitectónicas indirectas',
      ]),
      makeField('camara', 'Óptica arquitectónica', 'lente tilt-shift 24mm con líneas verticales perfectamente paralelas', [
        'lente tilt-shift 24mm con líneas verticales perfectamente paralelas',
        'gran angular 16mm a altura de ojos humanos (1.6m)',
        'encuadre simétrico a un punto de fuga estilo revista de arquitectura',
      ]),
      makeField('estilo', 'Enfoque espacial', 'arquitectura bioclimática contemporánea latinoamericana, habitable y humana', [
        'arquitectura bioclimática contemporánea latinoamericana, habitable y humana',
        'espacio museográfico minimalista sereno con obras luminosas',
        'futurismo orgánico sostenible integrado con bosque húmedo',
      ]),
    ],
    starterPrompt:
      'Fotografía arquitectónica editorial de una antigua bodega industrial transformada en centro cultural biofílico y biblioteca abierta: estructura en concreto visto y madera cálida de cedro, patios interiores con helechos nativos y claraboyas cenitales, luz solar oblicua de media tarde dibujando sombras geométricas limpias, lente tilt-shift 24mm con líneas verticales perfectamente rectas, escala humana natural, estética de arquitectura contemporánea latinoamericana.',
    styleVariations: [
      {
        id: 'biophilic',
        label: 'Biofílico y Natural',
        description: 'Vegetación nativa, ventilación cruzada y madera.',
        modifier: 'biophilic tropical modernist architecture, lush indoor courtyard plants, warm cedar timber',
      },
      {
        id: 'brutalist-museum',
        label: 'Museo Contemporáneo',
        description: 'Concreto escultórico, silencio y haces cenitales.',
        modifier: 'serene concrete art museum space, dramatic skylight beams, minimalist exhibition atmosphere',
      },
      {
        id: 'solarpunk-civic',
        label: 'Futuro Cívico',
        description: 'Energía limpia, sombra verde y espacio comunitario.',
        modifier: 'human-scale sustainable future civic pavilion, bamboo canopy, diffused dappled sunlight',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'ControlNet / Krea', 'Google AI Studio', 'SketchUp'],
    ethicsTip:
      'Al presentar visualizaciones arquitectónicas a comunidades o clientes, aclara siempre que se trata de un concepto especulativo y no de un plano estructural verificado.',
    tags: ['arquitectura', 'interiores', 'espacios', 'tilt-shift', 'urbanismo'],
  },
  {
    id: 'exp-b4-gastronomia',
    code: 'B4',
    title: 'Crear fotografía gastronómica',
    description: 'Producir imágenes editoriales y publicitarias de alimentos, cafés, restaurantes y productos culinarios.',
    exercise: 'Crea una fotografía publicitaria de un café o plato artesanal.',
    disciplineId: 'fotografia-arte',
    category: 'Fotografía Gastronómica',
    level: 'Principiante',
    duration: '15 min',
    durationMinutes: 15,
    image: expB4GastronomyImg,
    imageAlt: 'Fotografía gastronómica editorial de café filtrado colombiano y plato con frutas y cacao sobre pizarra oscura',
    objective:
      'Activar sensaciones de temperatura, aroma, frescura y textura mediante luz lateral rasante, vajilla artesanal y profundidad de campo corta.',
    inspirations: [
      {
        title: 'Café de origen y cacao en pizarra',
        note: 'Vapor atrapado a contraluz y contraste de colores cálidos sobre piedra oscura.',
        image: expB4GastronomyImg,
        alt: 'Café filtrado artesanal humeante junto a plato de frutas tropicales y cacao',
      },
      {
        title: 'Salpicadura a 1/4000s',
        note: 'Acción congelada para bebidas y publicidad de alto dinamismo.',
        image: VISUAL_LIBRARY_PATHS.adSplash,
        alt: 'Fotografía comercial de líquido congelado en alta velocidad',
      },
      {
        title: 'Microtextura macro 100mm',
        note: 'Acercamiento extremo para resaltar brillo, humedad y detalle.',
        image: VISUAL_LIBRARY_PATHS.focal100mmMacro,
        alt: 'Fotografía macro 100mm mostrando gotas cristalinas y textura',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Alimento o bebida', 'café filtrado de especialidad colombiano recién servido junto a plato de frutas y cacao', [
        'café filtrado de especialidad colombiano recién servido junto a plato de frutas y cacao',
        'pan de masa madre recién horneado cortado con miga aireada y mantequilla artesanal',
        'ceviche pacífico contemporáneo en plato de cerámica oscura con gotas de cítrico',
      ]),
      makeField('materiales', 'Vajilla y superficie', 'cerámica artesanal oscura, piedra pizarra volcánica, madera envejecida y servilleta de lino', [
        'cerámica artesanal oscura, piedra pizarra volcánica, madera envejecida y servilleta de lino',
        'mesa de mármol travertino claro con cubertería de latón mate',
        'madera rústica de finca cafetera con taza de barro esmaltado',
      ]),
      makeField('iluminacion', 'Luz de apetito', 'luz lateral rasante de ventana en claroscuro atrapando el vapor cálido', [
        'luz lateral rasante de ventana en claroscuro atrapando el vapor cálido',
        'luz matinal brillante y fresca con rebotes suaves en cristalería',
        'contraluz suave destacando brillo de aceites, jugos y vapor',
      ]),
      makeField('camara', 'Ángulo y lente', 'ángulo de 45 grados (mirada de comensal), lente 85mm f/2.8 con bokeh cálido', [
        'ángulo de 45 grados (mirada de comensal), lente 85mm f/2.8 con bokeh cálido',
        'vista cenital a 90 grados estilo mesa editorial completa',
        'macro 100mm enfocando la textura de crema, granos o corteza',
      ]),
      makeField('texturas', 'Detalles sensoriales', 'vapor ascendente sutil, gotas de condensación, migas naturales y textura crujiente', [
        'vapor ascendente sutil, gotas de condensación, migas naturales y textura crujiente',
        'brillo húmedo de salsa fresca y hojas verdes recién cortadas',
        'crema dorada de espresso con espuma microtexturizada real',
      ]),
    ],
    starterPrompt:
      'Fotografía gastronómica editorial de un café filtrado de especialidad colombiano recién preparado en jarra de cerámica negra mate junto a un plato artesanal con mango fresco, maracuyá y nibs de cacao sobre pizarra volcánica oscura, vapor sutil elevándose atrapado por luz natural lateral de ventana en claroscuro, ángulo de 45 grados, lente 85mm f/2.8 con poca profundidad de campo, colores orgánicos auténticos y textura crujiente realista.',
    styleVariations: [
      {
        id: 'dark-moody',
        label: 'Claroscuro Editorial',
        description: 'Fondos oscuros, vapor luminoso y carácter artesanal.',
        modifier: 'dark moody chiaroscuro food styling, dark slate surface, glowing rising steam',
      },
      {
        id: 'bright-morning',
        label: 'Mañana Luminosa',
        description: 'Superficies claras, frescura y editorial de cafetería.',
        modifier: 'bright airy morning daylight food photography, cream linen and pale stone, crisp fresh tones',
      },
      {
        id: 'action-pour',
        label: 'Acción y Vertido',
        description: 'Movimiento congelado de café, miel o salsa cayendo.',
        modifier: 'dynamic high-speed pour action frozen at 1/2000s, glossy liquid motion, appetizing realism',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3', 'Photoshop'],
    ethicsTip:
      'Para menús de restaurantes o productos reales a la venta, usa fotografías reales del plato final y emplea la IA principalmente para moodboards, estilismo y planificación de sesión.',
    tags: ['gastronomía', 'café', 'food styling', 'publicidad', 'bodegón'],
  },

  // =========================================================================
  // C. ILUSTRACIÓN, PERSONAJES Y MUNDOS CREATIVOS
  // =========================================================================
  {
    id: 'exp-c1-personaje',
    code: 'C1',
    title: 'Crear un personaje',
    description: 'Diseñar personajes originales para animación, videojuegos, cuentos, marcas o narrativa visual.',
    exercise: 'Diseña un personaje original con personalidad, vestuario y 3 expresiones.',
    disciplineId: 'ilustracion-mundos',
    category: 'Diseño de Personajes',
    level: 'Principiante',
    duration: '20 min',
    durationMinutes: 20,
    image: VISUAL_LIBRARY_PATHS.storyCharacterSheet,
    imageAlt: 'Hoja de diseño de personaje mostrando vistas de cuerpo completo, vestuario y expresiones',
    objective:
      'Definir silueta memorable, vestuario funcional, paleta propia y consistencia facial en una hoja de personaje (character turnaround).',
    inspirations: [
      {
        title: 'Hoja de personaje (Turnaround)',
        note: 'Vistas frontal, perfil y expresiones para mantener consistencia.',
        image: VISUAL_LIBRARY_PATHS.storyCharacterSheet,
        alt: 'Hoja técnica de personaje con múltiples vistas y detalles de vestuario',
      },
      {
        title: 'Narrativa gráfica en tinta',
        note: 'Cómo actúa el personaje dentro de viñetas y encuadres.',
        image: expC3ComicImg,
        alt: 'Páginas de cómic ilustradas en tinta y acuarela',
      },
      {
        title: 'Escultura y volumen 3D',
        note: 'Trasladar el personaje de 2D a figura tridimensional.',
        image: expC4ArtToyImg,
        alt: 'Figura coleccionable inspirada en fauna andina y orfebrería',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Identidad del personaje', 'joven exploradora sonora andina con audífonos artesanales y mochila de sensores', [
        'joven exploradora sonora andina con audífonos artesanales y mochila de sensores',
        'guardián botánico anciano con capa tejida y linterna de luciérnagas',
        'robot mensajero reciclado de latón y cerámica que cuida plantas urbanas',
      ]),
      makeField('composicion', 'Estructura de la lámina', 'hoja de diseño de personaje: vista frontal, perfil, espalda y 3 expresiones faciales', [
        'hoja de diseño de personaje: vista frontal, perfil, espalda y 3 expresiones faciales',
        'retrato de cuerpo completo en pose dinámica con notas de vestuario alrededor',
        'cuadrícula de 4 emociones (curiosidad, asombro, concentración, alegría)',
      ]),
      makeField('estilo', 'Estilo ilustrativo', 'concept art pintado a mano con línea de tinta expresiva y gouache cálido', [
        'concept art pintado a mano con línea de tinta expresiva y gouache cálido',
        'ilustración de cine animado estilo estudio independiente europeo',
        'diseño estilizado 3D con texturas de tela y cerámica mate',
      ]),
      makeField('color', 'Paleta del personaje', 'ocre mostaza, azul índigo, terracota y detalles en latón envejecido', [
        'ocre mostaza, azul índigo, terracota y detalles en latón envejecido',
        'verde selva, crema natural, coral suave y carbón',
        'violeta profundo, blanco hueso y amarillo señalética',
      ]),
      makeField('contexto', 'Fondo de estudio', 'fondo neutro papel pergamino claro limpio para lectura de silueta', [
        'fondo neutro papel pergamino claro limpio para lectura de silueta',
        'fondo gris neutro de estudio de animación sin distracciones',
        'boceto de fondo suave con cuadrícula de proporciones',
      ]),
    ],
    starterPrompt:
      'Hoja profesional de diseño de personaje (character design sheet) de una joven exploradora sonora andina con poncho técnico tejido, audífonos de latón y mochila con micrófonos de campo: vista frontal, perfil y espalda de cuerpo completo junto a 3 retratos de expresiones faciales (curiosidad, concentración y sonrisa), estilo concept art pintado con tinta fina y gouache cálido, paleta en ocre, índigo y terracota sobre fondo papel crema neutro limpio.',
    styleVariations: [
      {
        id: 'gouache',
        label: 'Gouache y Tinta',
        description: 'Línea expresiva, pincelada visible y calidez editorial.',
        modifier: 'hand-painted gouache and ink linework character concept art, textured illustration paper',
      },
      {
        id: 'animation-2d',
        label: 'Animación 2D',
        description: 'Siluetas claras y colores planos listos para animar.',
        modifier: 'feature 2D animation production model sheet, clean readable silhouettes, flat cel-shading',
      },
      {
        id: 'stylized-3d',
        label: '3D Estilizado',
        description: 'Volumen escultórico, telas táctiles y luz suave.',
        modifier: 'stylized 3D character maquette render, tactile fabric and matte clay shaders, soft studio light',
      },
    ],
    tools: ['Midjourney (--cref)', 'FLUX', 'Leonardo AI', 'ChatGPT', 'Procreate'],
    ethicsTip:
      'Evita copiar personajes protegidos por derechos de autor o reproducir estereotipos culturales caricaturescos; diseña rasgos, prendas y oficios con investigación real.',
    tags: ['personaje', 'character sheet', 'ilustración', 'animación', 'concept art'],
    featured: true,
  },
  {
    id: 'exp-c2-mundos',
    code: 'C2',
    title: 'Crear mundos imaginarios',
    description: 'Construir ciudades futuras, paisajes fantásticos, arquitecturas imposibles y universos visuales.',
    exercise: 'Imagina y diseña una ciudad del futuro sostenible.',
    disciplineId: 'ilustracion-mundos',
    category: 'Worldbuilding',
    level: 'Intermedio',
    duration: '25 min',
    durationMinutes: 25,
    image: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
    imageAlt: 'Ciudad imaginaria sostenible con arquitectura escalonada, canales y vegetación en la montaña',
    objective:
      'Diseñar un universo coherente definiendo geografía, clima, arquitectura, movilidad, escala humana y atmósfera ambiental.',
    inspirations: [
      {
        title: 'Ciudad sostenible en paisaje de montaña',
        note: 'Profundidad atmosférica por planos y escala arquitectónica creíble.',
        image: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
        alt: 'Concept art de ciudad futura sostenible integrada con la naturaleza',
      },
      {
        title: 'Escala territorial andina',
        note: 'Capas de neblina y horizonte amplio para sensación de vastedad.',
        image: VISUAL_LIBRARY_PATHS.compExtremeWide,
        alt: 'Gran plano general panorámico de montañas entre neblina',
      },
      {
        title: 'Objeto especulativo del mundo',
        note: 'Cómo se diseñan las tecnologías cotidianas de ese universo.',
        image: expF5SpeculativeImg,
        alt: 'Prototipo de diseño especulativo en vidrio y cerámica',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Mundo o asentamiento', 'ciudad sostenible del futuro construida en terrazas de madera y piedra sobre un valle andino', [
        'ciudad sostenible del futuro construida en terrazas de madera y piedra sobre un valle andino',
        'archipiélago flotante de huertos solares y bibliotecas conectadas por puentes peatonales',
        'estación botánica subterránea iluminada por fibras ópticas solares y cascadas',
      ]),
      makeField('composicion', 'Plano y profundidad', 'gran plano general panorámico en perspectiva aérea con tres capas de profundidad atmosférica', [
        'gran plano general panorámico en perspectiva aérea con tres capas de profundidad atmosférica',
        'vista desde un mirador peatonal con habitantes en primer plano mirando la metrópoli',
        'corte panorámico lateral mostrando niveles subterráneos y jardines en altura',
      ]),
      makeField('iluminacion', 'Clima y luz', 'luz dorada de amanecer atravesando niebla de montaña con reflejos en canales de agua', [
        'luz dorada de amanecer atravesando niebla de montaña con reflejos en canales de agua',
        'tarde lluviosa luminosa con nubes dramáticas y faroles cálidos encendiéndose',
        'mediodía despejado con sombras largas de estructuras solares textiles',
      ]),
      makeField('estilo', 'Dirección de arte', 'matte painting cinematográfico de alta precisión con pincelada pictórica orgánica', [
        'matte painting cinematográfico de alta precisión con pincelada pictórica orgánica',
        'ilustración arquitectónica futurista estilo Syd Mead y Moebius',
        'fotografía aérea hiperrealista de maqueta territorial',
      ]),
      makeField('color', 'Atmósfera cromática', 'verdes bosque húmedo, terracota cálida, piedra clara y azul brumoso en la distancia', [
        'verdes bosque húmedo, terracota cálida, piedra clara y azul brumoso en la distancia',
        'arena dorada, cobre oxidado y cielo turquesa limpio',
        'índigo nocturno con luces cálidas ámbar en balcones y mercados',
      ]),
    ],
    starterPrompt:
      'Concept art panorámico de una ciudad sostenible del futuro construida en terrazas orgánicas de madera, ladrillo y piedra sobre un valle montañoso andino, puentes peatonales colgantes, canales de agua lluvia, huertos en cubiertas y transporte silencioso por cable, luz dorada de amanecer filtrándose entre capas de niebla, diminutas figuras humanas dando escala real, matte painting cinematográfico detallado, relación 16:9.',
    styleVariations: [
      {
        id: 'solarpunk-andes',
        label: 'Solarpunk Andino',
        description: 'Territorio vivo, agua, madera y tecnología amable.',
        modifier: 'Andean solarpunk worldbuilding, terraced timber architecture, lush mountain mist, warm daylight',
      },
      {
        id: 'moebius',
        label: 'Línea Clara (Moebius)',
        description: 'Tinta limpia, horizontes vastos y colores pastel.',
        modifier: 'European ligne claire graphic novel worldbuilding, crisp ink contours, luminous pastel skies',
      },
      {
        id: 'cinema-matte',
        label: 'Matte Painting Cine',
        description: 'Escala épica fotorrealista para largometraje.',
        modifier: 'epic feature-film matte painting, atmospheric perspective layers, 24mm widescreen realism',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Photoshop', 'Blender', 'Unreal Engine'],
    ethicsTip:
      'Imaginar futuros sostenibles también es una decisión política: evita reducir el futuro a rascacielos estériles e incluye vida comunitaria, biodiversidad y cuidados.',
    tags: ['worldbuilding', 'futuro', 'ciudad', 'paisaje', 'concept art'],
  },
  {
    id: 'exp-c3-comic',
    code: 'C3',
    title: 'Crear un cómic o historieta',
    description: 'Desarrollar escenas narrativas, viñetas, diálogos visuales y secuencias ilustradas.',
    exercise: 'Crea una historia corta de 4 viñetas sobre un encuentro inesperado.',
    disciplineId: 'ilustracion-mundos',
    category: 'Cómic y Narrativa Gráfica',
    level: 'Intermedio',
    duration: '30 min',
    durationMinutes: 30,
    image: expC3ComicImg,
    imageAlt: 'Mesa de ilustrador con páginas de cómic en tinta china, lavados de acuarela ocre e índigo y plumilla',
    objective:
      'Narrar un giro emocional en 4 viñetas variando escala de planos (general → medio → detalle → reacción) con estilo gráfico constante.',
    inspirations: [
      {
        title: 'Páginas en tinta y aguada',
        note: 'Ritmo de viñetas con contraste entre plano general y primer plano.',
        image: expC3ComicImg,
        alt: 'Páginas de novela gráfica ilustradas en tinta y acuarela sobre mesa de madera',
      },
      {
        title: 'Encuadre Over-the-Shoulder',
        note: 'Plano de diálogo ideal para la viñeta 2 o 3 del encuentro.',
        image: VISUAL_LIBRARY_PATHS.compOverShoulder,
        alt: 'Plano cinematográfico por encima del hombro en diálogo',
      },
      {
        title: 'Hoja de storyboard secuencial',
        note: 'Planificación visual del paso de una viñeta a la siguiente.',
        image: VISUAL_LIBRARY_PATHS.storySheet,
        alt: 'Secuencia de viñetas de storyboard con continuidad narrativa',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Premisa de 4 viñetas', 'página de cómic de 4 viñetas narrando el encuentro inesperado entre un ciclista nocturno y un pájaro mecánico luminoso', [
        'página de cómic de 4 viñetas narrando el encuentro inesperado entre un ciclista nocturno y un pájaro mecánico luminoso',
        'historieta silenciosa de 4 paneles donde una planta comienza a florecer dentro de un vagón de metro',
        'secuencia de novela gráfica de 4 viñetas sobre dos desconocidos compartiendo un paraguas bajo lluvia intensa',
      ]),
      makeField('composicion', 'Estructura de viñetas', 'retícula clara de 4 paneles con calles blancas: plano general, plano medio, plano detalle y plano reacción', [
        'retícula clara de 4 paneles con calles blancas: plano general, plano medio, plano detalle y plano reacción',
        '1 viñeta panorámica superior + 3 viñetas verticales inferiores',
        '4 viñetas cuadradas simétricas de ritmo pausado sin globos de texto',
      ]),
      makeField('estilo', 'Técnica gráfica', 'novela gráfica en tinta china negra expresiva con aguadas de acuarela ocre y azul índigo', [
        'novela gráfica en tinta china negra expresiva con aguadas de acuarela ocre y azul índigo',
        'cómic franco-belga de línea clara limpia y colores planos suaves',
        'manga alternativo en blanco y negro con tramas de tinta y gran dinamismo',
      ]),
      makeField('iluminacion', 'Clima narrativo', 'contraste nocturno entre farolas cálidas ámbar y sombras profundas azuladas', [
        'contraste nocturno entre farolas cálidas ámbar y sombras profundas azuladas',
        'luz diurna suave de tarde lluviosa con reflejos en el pavimento',
        'amanecer neblinoso con siluetas recortadas',
      ]),
      makeField('texturas', 'Soporte', 'papel de acuarela de grano fino con trazos visibles de plumilla y pincel', [
        'papel de acuarela de grano fino con trazos visibles de plumilla y pincel',
        'impresión vintage de cómic en papel crema mate',
        'tinta digital limpia con textura de lápiz grafito',
      ]),
    ],
    starterPrompt:
      'Página de novela gráfica dividida en 4 viñetas claras con bordes blancos limpios y sin texto legible, narrando un encuentro inesperado en una calle lluviosa al anochecer: panel 1 plano general de una ciclista deteniéndose bajo una farola, panel 2 plano detalle de un pequeño pájaro mecánico de latón posado sobre el manubrio, panel 3 primer plano del rostro asombrado de la ciclista iluminado por el reflejo cálido, panel 4 plano abierto con ambos mirando el horizonte; técnica de tinta china expresiva con aguadas de acuarela en ocre y azul índigo sobre papel de algodón.',
    styleVariations: [
      {
        id: 'ink-wash',
        label: 'Tinta y Acuarela',
        description: 'Trama orgánica, emoción y calidez autoral.',
        modifier: 'expressive black dip-pen ink and ochre-indigo watercolor wash graphic novel page',
      },
      {
        id: 'ligne-claire',
        label: 'Línea Clara',
        description: 'Contornos uniformes, claridad arquitectónica y color limpio.',
        modifier: 'classic European ligne claire comic layout, crisp uniform lineweight, harmonious flat colors',
      },
      {
        id: 'bw-noir',
        label: 'Noir Blanco y Negro',
        description: 'Manchas dramáticas de tinta negra y silencio visual.',
        modifier: 'high-contrast black and white ink graphic novel panels, dramatic chiaroscuro shadows',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Clip Studio Paint', 'Canva / Figma (globos de diálogo)'],
    ethicsTip:
      'Genera las viñetas sin texto dentro de la imagen y agrega los globos de diálogo y rotulación en español con herramientas de diseño para mantener lectura impecable.',
    tags: ['cómic', 'historieta', 'viñetas', 'narrativa gráfica', 'tinta'],
  },
  {
    id: 'exp-c4-art-toy',
    code: 'C4',
    title: 'Diseñar un juguete o figura coleccionable',
    description: 'Crear art toys, miniaturas, figuras estilizadas y objetos coleccionables en 3D.',
    exercise: 'Diseña un art toy inspirado en la cultura colombiana.',
    disciplineId: 'ilustracion-mundos',
    category: 'Art Toy y 3D',
    level: 'Principiante',
    duration: '15 min',
    durationMinutes: 15,
    image: expC4ArtToyImg,
    imageAlt: 'Art toy coleccionable en vinilo mate y latón inspirado en el oso de anteojos y la orfebrería precolombina',
    objective:
      'Sintetizar un referente cultural y biológico en una figura coleccionable de proporciones sólidas, acabados táctiles y estética de galería.',
    inspirations: [
      {
        title: 'Art toy de oso de anteojos y orfebrería',
        note: 'Síntesis geométrica en terracota mate, negro obsidiana y latón cepillado.',
        image: expC4ArtToyImg,
        alt: 'Figura art toy de oso andino con patrones geométricos dorados sobre bloque de concreto',
      },
      {
        title: 'Diorama stop motion táctil',
        note: 'Cómo fotografiar miniaturas con escala creíble y luz de maqueta.',
        image: VISUAL_LIBRARY_PATHS.animStopMotion,
        alt: 'Miniatura artesanal en diorama iluminado con foco cálido',
      },
      {
        title: 'Escultura 3D en estudio',
        note: 'Control de materiales mate y metálicos.',
        image: VISUAL_LIBRARY_PATHS.anim3dSculpture,
        alt: 'Escultura 3D con materiales realistas de estudio',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Referente del art toy', 'figura art toy coleccionable inspirada en el oso de anteojos andino y la orfebrería quimbaya', [
        'figura art toy coleccionable inspirada en el oso de anteojos andino y la orfebrería quimbaya',
        'art toy estilizado basado en la rana dorada del Pacífico colombiano con mochila tejida',
        'figura coleccionable inspirada en una silletera contemporánea y botánica de montaña',
      ]),
      makeField('materiales', 'Materiales de fabricación', 'vinilo mate terracota, resina negra obsidiana y detalles en latón dorado cepillado', [
        'vinilo mate terracota, resina negra obsidiana y detalles en latón dorado cepillado',
        'cerámica sin esmaltar, madera torneada y pintura acrílica mate',
        'resina translúcida esmerilada con núcleo mineral brillante',
      ]),
      makeField('composicion', 'Presentación', 'plano frontal de objeto de colección sobre bloque minimalista de concreto', [
        'plano frontal de objeto de colección sobre bloque minimalista de concreto',
        'vista tres cuartos junto a su caja de edición limitada numerada',
        'trío de variaciones de color alineadas en estante de galería',
      ]),
      makeField('iluminacion', 'Iluminación', 'luz de estudio softbox difusa con suave luz de borde destacando los grabados metálicos', [
        'luz de estudio softbox difusa con suave luz de borde destacando los grabados metálicos',
        'luz natural lateral de galería de diseño contemporáneo',
        'iluminación dramática sobre fondo carbón neutro',
      ]),
      makeField('camara', 'Óptica', 'fotografía de producto de estudio con lente macro 85mm f/4 y fondo suavemente desenfocado', [
        'fotografía de producto de estudio con lente macro 85mm f/4 y fondo suavemente desenfocado',
        'plano de catálogo 50mm completamente nítido',
        'encuadre ligeramente contrapicado dando presencia escultórica',
      ]),
    ],
    starterPrompt:
      'Fotografía de producto en estudio de una figura art toy coleccionable contemporánea inspirada en el oso de anteojos andino y la geometría de la orfebrería precolombina colombiana, cuerpo estilizado en vinilo mate terracota, máscara en negro obsidiana y grabados en latón dorado cepillado, apoyada sobre un pequeño bloque de concreto visto en galería minimalista, luz softbox difusa y natural, lente 85mm con profundidad de campo suave.',
    styleVariations: [
      {
        id: 'vinyl-gallery',
        label: 'Vinilo de Galería',
        description: 'Acabado mate impecable y estética designer toy.',
        modifier: 'limited-edition designer vinyl art toy, matte soft-touch finish, brushed brass details, gallery plinth',
      },
      {
        id: 'ceramic-craft',
        label: 'Cerámica Artesanal',
        description: 'Barro cocido, esmalte manual y huella humana.',
        modifier: 'handcrafted stoneware ceramic figurine, raw clay texture, subtle kiln glaze variations',
      },
      {
        id: 'wood-toy',
        label: 'Madera Torneada',
        description: 'Juguete escultórico en madera natural pintada a mano.',
        modifier: 'turned natural beechwood collectible sculpture, hand-painted matte mineral pigments',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Meshy / Tripo 3D (imagen a 3D)', 'Blender'],
    ethicsTip:
      'Al inspirarte en culturas indígenas o artesanales colombianas, estudia sus significados, evita el uso comercial extractivo y da crédito a las tradiciones que inspiran la pieza.',
    tags: ['art toy', 'colombia', 'juguete', '3D', 'coleccionable'],
  },

  // =========================================================================
  // D. VIDEO, ANIMACIÓN Y NARRATIVAS
  // =========================================================================
  {
    id: 'exp-d1-storyboard',
    code: 'D1',
    title: 'Crear un storyboard',
    description: 'Planificar escenas visuales antes de grabar o generar video.',
    exercise: 'Crea el storyboard de una historia de 6 escenas.',
    disciplineId: 'video-narrativas',
    category: 'Preproducción y Storyboard',
    level: 'Intermedio',
    duration: '25 min',
    durationMinutes: 25,
    image: VISUAL_LIBRARY_PATHS.storySheet,
    imageAlt: 'Hoja de storyboard cinematográfico con seis recuadros secuenciales anotados en grafito',
    objective:
      'Visualizar ritmo, continuidad espacial y movimientos de cámara en 6 planos numerados antes de gastar recursos en rodaje o generación de video.',
    inspirations: [
      {
        title: 'Hoja profesional de storyboard',
        note: 'Encuadres 16:9 con flechas de dirección de cámara y notas breves.',
        image: VISUAL_LIBRARY_PATHS.storySheet,
        alt: 'Hoja de storyboard en blanco y negro con 6 escenas numeradas',
      },
      {
        title: 'Plano Over-the-Shoulder',
        note: 'Recurso clave para escenas de diálogo e interacción.',
        image: VISUAL_LIBRARY_PATHS.compOverShoulder,
        alt: 'Encuadre cinematográfico sobre el hombro',
      },
      {
        title: 'Ángulo holandés de tensión',
        note: 'Útil para el punto de giro dramático en la escena 4 o 5.',
        image: VISUAL_LIBRARY_PATHS.compDutchAngle,
        alt: 'Plano inclinado de tensión narrativa en pasillo nocturno',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Historia de 6 escenas', 'storyboard cinematográfico de 6 viñetas 16:9 de una joven descubriendo una señal luminosa en un bosque urbano', [
        'storyboard cinematográfico de 6 viñetas 16:9 de una joven descubriendo una señal luminosa en un bosque urbano',
        'storyboard de 6 planos para cápsula documental sobre una ceramista desde el barro hasta el horno',
        'storyboard de 6 escenas para videoclip poético en una estación de tren vacía al alba',
      ]),
      makeField('composicion', 'Progresión de planos', '1: plano general, 2: plano medio caminando, 3: plano detalle manos, 4: contrapicado, 5: primer plano mirada, 6: gran plano final', [
        '1: plano general, 2: plano medio caminando, 3: plano detalle manos, 4: contrapicado, 5: primer plano mirada, 6: gran plano final',
        'secuencia continua con flechas de paneo lateral y dolly in progresivo',
        'alternancia de plano/contraplano acelerando hacia el clímax',
      ]),
      makeField('estilo', 'Trazo de storyboard', 'boceto profesional de preproducción en lápiz grafito y marcador gris cálido con flechas de cámara', [
        'boceto profesional de preproducción en lápiz grafito y marcador gris cálido con flechas de cámara',
        'storyboard limpio en tinta fina con acento amarillo para el sujeto principal',
        'frames pintados en escala de grises cinematográfica (value study)',
      ]),
      makeField('formato', 'Disposición de página', 'hoja horizontal ordenada en retícula de 3x2 recuadros 16:9 sobre papel blanco', [
        'hoja horizontal ordenada en retícula de 3x2 recuadros 16:9 sobre papel blanco',
        'dos tiras horizontales estilo sala de escritores',
        'cuaderno abierto de dirección de cine con notas técnicas',
      ]),
    ],
    starterPrompt:
      'Hoja profesional de storyboard cinematográfico organizada en retícula de 3x2 con 6 recuadros panorámicos 16:9 sobre papel blanco limpio, narrando cómo una joven descubre una señal luminosa entre árboles urbanos al atardecer: 1 gran plano general, 2 plano medio caminando, 3 plano detalle de sus manos, 4 ángulo contrapicado mirando luz entre ramas, 5 primer plano de expresión asombrada, 6 plano abierto final; dibujado en lápiz grafito y marcador gris cálido con flechas sutiles de movimiento de cámara.',
    styleVariations: [
      {
        id: 'pencil-marker',
        label: 'Grafito y Marcador',
        description: 'Clásico storyboard de estudio con claridad de luz y sombra.',
        modifier: 'film production storyboard sheet, graphite pencil and warm grey Copic marker shading, clean 16:9 frames',
      },
      {
        id: 'color-script',
        label: 'Color Script',
        description: 'Planifica la evolución emocional del color escena a escena.',
        modifier: 'animation color script sheet of 6 widescreen frames showing emotional lighting progression',
      },
      {
        id: 'blueprint-cam',
        label: 'Técnico con Flechas',
        description: 'Enfocado en ejes de cámara, lentes y desplazamientos.',
        modifier: 'clean technical director storyboard panels with minimal directional camera movement arrows',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Boords', 'Planificador Audiovisual (Núcleo Lab)'],
    ethicsTip:
      'Un buen storyboard respeta el tiempo de todo el equipo humano de rodaje; úsalo como puente de conversación con fotografía, arte y sonido.',
    tags: ['storyboard', 'guion visual', 'cine', 'planos', 'preproducción'],
  },
  {
    id: 'exp-d2-animacion',
    code: 'D2',
    title: 'Crear una animación o secuencia en movimiento',
    description: 'Dar vida a imágenes estáticas mediante movimiento de cámara, partículas, atmósferas y loops.',
    exercise: 'Convierte una imagen fija en una animación de 5 segundos.',
    disciplineId: 'video-narrativas',
    category: 'Animación y Motion',
    level: 'Intermedio',
    duration: '20 min',
    durationMinutes: 20,
    image: VISUAL_LIBRARY_PATHS.videoInfiniteLoop,
    imageAlt: 'Secuencia visual cinética diseñada como bucle animado fluido con luz y geometría orgánica',
    objective:
      'Escribir instrucciones precisas de movimiento físico (velocidad, trayectoria de cámara, elementos dinámicos y estabilidad de sujeto) para un clip o loop de 5 segundos.',
    inspirations: [
      {
        title: 'Bucle cinético infinito',
        note: 'Movimiento continuo y predecible ideal para loops hipnóticos.',
        image: VISUAL_LIBRARY_PATHS.videoInfiniteLoop,
        alt: 'Visual en movimiento continuo diseñado para bucle infinito',
      },
      {
        title: 'Stop motion artesanal 12fps',
        note: 'Cadencia táctil con textura de papel y cartón.',
        image: VISUAL_LIBRARY_PATHS.animStopMotion,
        alt: 'Escena stop motion en diorama de papel y fieltro',
      },
      {
        title: 'Desplazamiento aéreo fluido',
        note: 'Velocidad constante sin giros bruscos que rompan la coherencia.',
        image: VISUAL_LIBRARY_PATHS.videoDroneFpv,
        alt: 'Movimiento aéreo de dron sobre acantilados costeros',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Escena base', 'escultura botánica de vidrio y hojas suspendida en un invernadero silencioso', [
        'escultura botánica de vidrio y hojas suspendida en un invernadero silencioso',
        'calle nocturna con lluvia fina y reflejos cálidos sobre el pavimento',
        'diorama en miniatura de papel recortado con molino y nubes móviles',
      ]),
      makeField('accion', 'Movimiento físico principal', 'rotación lenta continua, partículas de polvo flotando suavemente y suave brisa moviendo las hojas', [
        'rotación lenta continua, partículas de polvo flotando suavemente y suave brisa moviendo las hojas',
        'agua cayendo en cámara lenta y ondas concéntricas en bucle continuo',
        'animación stop motion a 12fps con desplazamientos rítmicos de papel',
      ]),
      makeField('camara', 'Movimiento de cámara', 'dolly-in imperceptible y estable a 24fps, sin cortes ni sacudidas', [
        'dolly-in imperceptible y estable a 24fps, sin cortes ni sacudidas',
        'cámara completamente fija en trípode para loop perfecto',
        'órbita lenta de 15 grados alrededor del objeto central',
      ]),
      makeField('iluminacion', 'Luz dinámica', 'rayos de sol desplazándose suavemente y destellos sutiles en el cristal', [
        'rayos de sol desplazándose suavemente y destellos sutiles en el cristal',
        'parpadeo suave de luz cálida interior frente a lluvia azulada',
        'iluminación constante limpia para empalme invisible del bucle',
      ]),
      makeField('formato', 'Duración y cadencia', 'clip de 5 segundos en loop perfecto, 16:9, ritmo contemplativo', [
        'clip de 5 segundos en loop perfecto, 16:9, ritmo contemplativo',
        'vertical 9:16 de 5 segundos para instalación móvil o reel',
        'cuadrado 1:1 a 12fps estética stop motion',
      ]),
    ],
    starterPrompt:
      'Secuencia animada de 5 segundos en loop fluido a partir de una escultura botánica de vidrio y helechos dentro de un invernadero minimalista: movimiento lento y continuo de partículas de luz flotando en el aire, suave brisa agitando las hojas, cámara en dolly-in casi imperceptible y estable a 24fps, iluminación solar rasante generando reflejos suaves sobre el cristal, sin deformaciones ni saltos bruscos, formato 16:9.',
    styleVariations: [
      {
        id: 'cinemagraph',
        label: 'Cinemagraph Sutil',
        description: 'Todo quieto excepto un único elemento vivo en loop.',
        modifier: 'locked tripod cinemagraph, only gentle atmospheric motion in mist and water ripples, seamless 5s loop',
      },
      {
        id: 'stop-motion-12',
        label: 'Stop Motion 12fps',
        description: 'Encanto manual cuadro a cuadro con materiales reales.',
        modifier: 'handcrafted 12fps stop-motion cadence, paper and felt diorama textures, tactile slight frame jitter',
      },
      {
        id: 'kinetic-3d',
        label: 'Loop Cinético 3D',
        description: 'Geometría en movimiento hipnótico y fluido.',
        modifier: 'hypnotic seamless 3D kinetic loop, smooth continuous physics, studio rim lighting',
      },
    ],
    tools: ['Runway Gen-3 / Gen-4', 'Google Veo', 'Kling AI', 'Luma Dream Machine', 'CapCut'],
    ethicsTip:
      'Describe un solo movimiento de cámara y una sola acción física por plano de 5 segundos: menos caos produce resultados más fieles y reduce reintentos innecesarios.',
    tags: ['animación', 'video IA', 'loop', 'motion', '5 segundos'],
  },
  {
    id: 'exp-d3-cortometraje',
    code: 'D3',
    title: 'Crear un cortometraje con IA',
    description: 'Integrar guion, imágenes, video, voz, música y edición en una pieza audiovisual completa.',
    exercise: 'Produce una microhistoria audiovisual de 30 segundos.',
    disciplineId: 'video-narrativas',
    category: 'Cine IA',
    level: 'Avanzado',
    duration: '60 min',
    durationMinutes: 60,
    image: VISUAL_LIBRARY_PATHS.camCinemaRig,
    imageAlt: 'Cámara de cine digital sobre rieles dolly en estudio atmosférico para rodaje de cortometraje',
    objective:
      'Orquestar una microhistoria de 30 segundos (5 a 6 planos coherentes) manteniendo continuidad de personaje, paleta de color, voz y diseño sonoro.',
    inspirations: [
      {
        title: 'Dirección de fotografía cinematográfica',
        note: 'Definir un solo lente y paleta para toda la película.',
        image: VISUAL_LIBRARY_PATHS.camCinemaRig,
        alt: 'Rig de cámara cinematográfica profesional sobre rieles en set',
      },
      {
        title: 'Etalonaje unificador',
        note: 'El mismo perfil de color cohesiona planos generados en momentos distintos.',
        image: VISUAL_LIBRARY_PATHS.colorFujifilmEterna,
        alt: 'Fotograma de cine contemplativo con paleta Fujifilm Eterna',
      },
      {
        title: 'Diseño sonoro y foley',
        note: 'El sonido aporta el 50% de la inmersión cinematográfica.',
        image: VISUAL_LIBRARY_PATHS.storySoundFoley,
        alt: 'Estudio de diseño sonoro y foley artesanal',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Concepto del corto (30s)', 'microcortometraje poético de 30 segundos sobre una carta perdida que viaja por una ciudad lluviosa hasta llegar a su destino', [
        'microcortometraje poético de 30 segundos sobre una carta perdida que viaja por una ciudad lluviosa hasta llegar a su destino',
        'corto de ciencia ficción íntima sobre el último jardín botánico de una estación orbital',
        'cápsula documental híbrida sobre la memoria sonora de un barrio artesanal',
      ]),
      makeField('composicion', 'Estructura de 5 planos', 'Plano 1 apertura aérea (6s) · Plano 2 protagonista (6s) · Plano 3 obstáculo (6s) · Plano 4 revelación (6s) · Plano 5 cierre poético (6s)', [
        'Plano 1 apertura aérea (6s) · Plano 2 protagonista (6s) · Plano 3 obstáculo (6s) · Plano 4 revelación (6s) · Plano 5 cierre poético (6s)',
        '3 planos largos contemplativos de 10 segundos unidos por fundidos suaves',
        'montaje rítmico rápido de 6 planos guiado por voz en off íntima',
      ]),
      makeField('camara', 'Biblia óptica constante', 'cámara de cine digital, lente anamórfico 40mm, 24fps, encuadre panorámico 2.39:1', [
        'cámara de cine digital, lente anamórfico 40mm, 24fps, encuadre panorámico 2.39:1',
        'estética documental 16mm cámara en mano suave con grano orgánico',
        'planos fijos compuestos con precisión arquitectónica en 16:9',
      ]),
      makeField('color', 'Look de película', 'Fujifilm Eterna suave, verdes apagados, ámbar cálido interior y sombras con detalle', [
        'Fujifilm Eterna suave, verdes apagados, ámbar cálido interior y sombras con detalle',
        'Bleach Bypass metálico de alto contraste para tensión dramática',
        'Kodak Portra cálido nostálgico con luz dorada constante',
      ]),
      makeField('contexto', 'Sonido y música', 'lluvia fina de fondo, pasos sobre piedra mojada, cello minimalista y narración pausada en español', [
        'lluvia fina de fondo, pasos sobre piedra mojada, cello minimalista y narración pausada en español',
        'paisaje sonoro urbano + sintetizador analógico atmosférico sin voz',
        'silencio dramático roto por foley táctil de papel, viento y respiración',
      ]),
    ],
    starterPrompt:
      'Biblia visual para cortometraje de 30 segundos en 5 planos (2.39:1, 24fps): historia poética de una carta de papel que atraviesa una ciudad andina lluviosa hasta manos desconocidas. Consistencia visual estricta en todos los planos: lente anamórfico 40mm, paleta Fujifilm Eterna con sombras suaves azul-verde y acentos tungsteno cálidos, movimientos lentos de dolly sin cortes bruscos, atmósfera de cine independiente contemplativo, acompañado de sonido diegético de lluvia y cello minimalista.',
    styleVariations: [
      {
        id: 'indie-film',
        label: 'Cine Independiente',
        description: 'Ritmo humano, luz disponible y verdad emocional.',
        modifier: 'A24-inspired independent cinema look, restrained color grading, subtle 35mm film grain',
      },
      {
        id: 'sci-fi-intimate',
        label: 'Sci-Fi Poético',
        description: 'Futuro tangible, arquitectura sobria y emoción cercana.',
        modifier: 'intimate architectural sci-fi cinematography, natural light through mist, grounded realism',
      },
      {
        id: 'doc-essay',
        label: 'Ensayo Documental',
        description: 'Textura 16mm, voz reflexiva y archivos visuales.',
        modifier: 'poetic documentary film essay, 16mm film texture, handheld observational framing',
      },
    ],
    tools: ['Planificador Audiovisual (Núcleo Lab)', 'Veo / Runway / Kling', 'ElevenLabs / Udio', 'DaVinci Resolve / CapCut'],
    ethicsTip:
      'Declara en los créditos finales qué herramientas de IA participaron en imagen, sonido o montaje y qué decisiones fueron dirección humana.',
    tags: ['cortometraje', 'cine IA', 'dirección', 'montaje', 'guion'],
  },
  {
    id: 'exp-d4-visuales-musica',
    code: 'D4',
    title: 'Crear visuales para música',
    description: 'Generar visuales para conciertos, videoclips, live visuals y experiencias audiovisuales.',
    exercise: 'Diseña una serie visual para una canción o ritmo musical.',
    disciplineId: 'video-narrativas',
    category: 'Visuales y Escena',
    level: 'Intermedio',
    duration: '20 min',
    durationMinutes: 20,
    image: VISUAL_LIBRARY_PATHS.vfxFluidSmoke,
    imageAlt: 'Volutas densas de humo iluminadas por haces volumétricos en escenario oscuro para visuales musicales',
    objective:
      'Traducir tempo, textura tímbrica (graves, medios, agudos) y atmósfera de una canción en un sistema visual escénico coherente.',
    inspirations: [
      {
        title: 'Humo y haces volumétricos',
        note: 'Alto contraste ideal para pantallas LED de escenario o proyección.',
        image: VISUAL_LIBRARY_PATHS.vfxFluidSmoke,
        alt: 'Simulación volumétrica de humo y luz láser en cámara oscura',
      },
      {
        title: 'Mapping arquitectónico nocturno',
        note: 'Visuales musicales proyectados sobre volumen real.',
        image: VISUAL_LIBRARY_PATHS.vfxProjectionMapping,
        alt: 'Instalación nocturna de projection mapping sobre piedra',
      },
      {
        title: 'Partículas generativas',
        note: 'Enjambres luminosos que pueden reaccionar al espectro FFT.',
        image: VISUAL_LIBRARY_PATHS.animGenerativeParticles,
        alt: 'Arte generativo de partículas luminosas en flujo',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Motivo visual sonoro', 'ondas escultóricas de humo denso y filamentos luminosos reaccionando a un pulso grave de electrónica orgánica', [
        'ondas escultóricas de humo denso y filamentos luminosos reaccionando a un pulso grave de electrónica orgánica',
        'geometrías monolíticas de obsidiana que se fragmentan al ritmo de percusión afrocaribeña',
        'paisaje topográfico minimalista de líneas doradas vibrando con sintetizadores ambient',
      ]),
      makeField('iluminacion', 'Escenografía lumínica', 'haces volumétricos precisos cortando un escenario negro absoluto con destellos ámbar y azul eléctrico', [
        'haces volumétricos precisos cortando un escenario negro absoluto con destellos ámbar y azul eléctrico',
        'luz estroboscópica controlada sobre superficies cromadas reflectantes',
        'resplandor cálido difuso emergiendo desde el centro de la pantalla',
      ]),
      makeField('composicion', 'Formato escénico', 'encuadre panorámico 16:9 simétrico pensado para pantalla LED de concierto detrás de músicos', [
        'encuadre panorámico 16:9 simétrico pensado para pantalla LED de concierto detrás de músicos',
        'proyección envolvente sin centro recargado para dar espacio al performer',
        'cierre abstracto macro de ondas fluidas a pantalla completa',
      ]),
      makeField('color', 'Paleta escénica', 'negro profundo, amarillo eléctrico, azul cobalto y blanco humo', [
        'negro profundo, amarillo eléctrico, azul cobalto y blanco humo',
        'carmesí oscuro, bronce metálico y carbón',
        'monocromo blanco y negro de alto contraste tipo arte cinético',
      ]),
      makeField('estilo', 'Estética audiovisual', 'arte audiovisual de festival Sónar / MUTEK, sofisticado, sin clichés neón baratos', [
        'arte audiovisual de festival Sónar / MUTEK, sofisticado, sin clichés neón baratos',
        'visualización física tipo cimática y partículas fluidas en alta velocidad',
        'collage analógico de video CRT con texturas orgánicas',
      ]),
    ],
    starterPrompt:
      'Visual escénico panorámico 16:9 diseñado para concierto de música electrónica orgánica: densas cintas escultóricas de humo translúcido y partículas finas atravesadas por haces volumétricos precisos en negro absoluto, acentos en ámbar cálido y azul eléctrico profundo, estética audiovisual contemporánea de festival MUTEK / Sónar, composición equilibrada que deja zona limpia para la silueta del músico en vivo, alta nitidez y atmósfera inmersiva.',
    styleVariations: [
      {
        id: 'cymatics',
        label: 'Cimática y Fluidos',
        description: 'Ondas físicas en agua, arena o humo.',
        modifier: 'high-speed physical cymatics wave patterns in dark liquid and fine metallic dust, macro spotlight',
      },
      {
        id: 'monolith-led',
        label: 'Monolito LED',
        description: 'Arquitectura minimalista de luz para grandes escenarios.',
        modifier: 'minimalist architectural stage visuals, crisp geometric light beams, deep pitch-black void',
      },
      {
        id: 'analog-crt',
        label: 'Videoarte Analógico',
        description: 'Scanlines, eco de señal y textura de sintetizador de video.',
        modifier: 'analog video synthesizer feedback aesthetic, subtle CRT scanlines, sculptural monochrome forms',
      },
    ],
    tools: ['Lab Interactivo (Núcleo Lab)', 'TouchDesigner', 'Hydra', 'Runway', 'Resolume'],
    ethicsTip:
      'Evita patrones estroboscópicos rápidos (3–60 Hz) que puedan afectar a personas con epilepsia fotosensible; prioriza transiciones fluidas y control de contraste.',
    tags: ['visuales', 'música', 'live visuals', 'VFX', 'concierto'],
  },

  // =========================================================================
  // E. WEB, PRODUCTOS Y COMUNICACIÓN DIGITAL
  // =========================================================================
  {
    id: 'exp-e1-interfaz-web',
    code: 'E1',
    title: 'Diseñar una interfaz web',
    description: 'Crear conceptos de páginas web, landing pages, aplicaciones y sistemas de interfaz.',
    exercise: 'Diseña la portada de una página web para un proyecto creativo.',
    disciplineId: 'web-digital',
    category: 'UI / UX y Web',
    level: 'Intermedio',
    duration: '25 min',
    durationMinutes: 25,
    image: expE1WebUiImg,
    imageAlt: 'Prototipo visual de interfaz web editorial contemporánea con tipografía clara y bloques curados',
    objective:
      'Definir arquitectura visual, jerarquía tipográfica, grilla responsive, contraste WCAG y una acción principal clara antes de escribir código.',
    inspirations: [
      {
        title: 'Interfaz web editorial',
        note: 'Navegación sobria de 3 zonas, espacio en blanco y foco visual único.',
        image: expE1WebUiImg,
        alt: 'Vitrina de diseño web contemporáneo con estructura limpia',
      },
      {
        title: 'Sistema de identidad aplicado',
        note: 'Paleta de marca coherente trasladada a componentes UI.',
        image: expA4BrandImg,
        alt: 'Sistema de colores y papelería cultural',
      },
      {
        title: 'Infografía y arquitectura de información',
        note: 'Claridad visual para bloques de datos y navegación.',
        image: expE4InfographicImg,
        alt: 'Infografía editorial suiza sobre mesa de roble',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Producto o sitio web', 'página de inicio (landing page) para un colectivo de arte digital, talleres y exposiciones', [
        'página de inicio (landing page) para un colectivo de arte digital, talleres y exposiciones',
        'portafolio interactivo de una fotógrafa documental con archivo por territorios',
        'tienda digital minimalista de cerámica artesanal y objetos de diseño',
      ]),
      makeField('composicion', 'Arquitectura de pantalla', 'barra superior limpia de 3 zonas, hero asimétrico 60/40 con imagen protagonista y cuadrícula de 3 proyectos', [
        'barra superior limpia de 3 zonas, hero asimétrico 60/40 con imagen protagonista y cuadrícula de 3 proyectos',
        'portada editorial centrada con gran titular balanceado y galería panorámica inferior',
        'diseño modular en grilla bento limpia sin tarjetas sobrecargadas',
      ]),
      makeField('color', 'Sistema de color (60-30-10)', '60% crema cálido #F4F2ED, 30% blanco y carbón #101014, 10% acento amarillo #F8C300 y azul #326BFF', [
        '60% crema cálido #F4F2ED, 30% blanco y carbón #101014, 10% acento amarillo #F8C300 y azul #326BFF',
        'modo claro editorial blanco piedra, grafito profundo y acento terracota',
        'modo oscuro galería carbón mate, gris pizarra y acento ámbar cálido',
      ]),
      makeField('estilo', 'Dirección UI', 'diseño editorial contemporáneo de alta legibilidad, contraste WCAG AA y cero relleno decorativo', [
        'diseño editorial contemporáneo de alta legibilidad, contraste WCAG AA y cero relleno decorativo',
        'estética suiza minimalista con tipografía geométrica expresiva',
        'interfaz cultural cálida con fotografía protagonista en formato 16:9',
      ]),
      makeField('formato', 'Vista del mockup', 'pantalla de escritorio 1440px limpia con vista secundaria móvil responsive', [
        'pantalla de escritorio 1440px limpia con vista secundaria móvil responsive',
        'mockup realista en portátil sobre escritorio minimalista iluminado',
        'presentación frontal limpia de UI sin distracciones de fondo',
      ]),
    ],
    starterPrompt:
      'Diseño de interfaz web (UI/UX) en formato desktop 1440px para un colectivo contemporáneo de arte, tecnología y talleres creativos: barra de navegación superior limpia en una sola línea, sección hero asimétrica 60/40 con titular tipográfico sólido y fotografía curatorial de gran formato, grilla inferior de 3 proyectos con abundante espacio en blanco, sistema de color 60-30-10 en crema cálido #F4F2ED, tinta carbón #101014 y acento amarillo #F8C300, contraste accesible WCAG AA, estética editorial sobria sin gradientes genéricos.',
    styleVariations: [
      {
        id: 'editorial-light',
        label: 'Editorial Claro',
        description: 'Papel digital, tipografía limpia y aire curatorial.',
        modifier: 'warm editorial light-mode web UI, crisp hairline borders, generous whitespace, high contrast',
      },
      {
        id: 'gallery-dark',
        label: 'Galería Oscura',
        description: 'Carbón mate para resaltar fotografía y videoarte.',
        modifier: 'matte charcoal dark-mode portfolio interface, luminous artwork focus, refined muted metadata',
      },
      {
        id: 'swiss-grid',
        label: 'Retícula Suiza',
        description: 'Estructura modular visible y jerarquía tipográfica fuerte.',
        modifier: 'Swiss modular grid web design, sharp architectural alignment, bold geometric sans typography',
      },
    ],
    tools: ['Lab Diseño Web IA (Núcleo Lab)', 'Figma', 'Google AI Studio', 'Lovable / Bolt', 'Midjourney'],
    ethicsTip:
      'Diseña siempre pensando en accesibilidad real: contraste mínimo 4.5:1, foco visible de teclado, textos claros y soporte móvil antes de los adornos.',
    tags: ['web', 'UI', 'UX', 'landing page', 'prototipo'],
    featured: true,
  },
  {
    id: 'exp-e2-campana-redes',
    code: 'E2',
    title: 'Crear una campaña para redes',
    description: 'Desarrollar una serie coherente de piezas visuales para comunicación digital.',
    exercise: 'Crea una campaña de 3 piezas visuales para lanzar un evento o producto.',
    disciplineId: 'web-digital',
    category: 'Comunicación Digital',
    level: 'Principiante',
    duration: '20 min',
    durationMinutes: 20,
    image: expE2SocialImg,
    imageAlt: 'Sistema visual de campaña digital en smartphones, tarjetas de paleta cromática y hojas de contacto',
    objective:
      'Mantener unidad estética (paleta, luz, encuadre y tono) a través de 3 piezas con objetivos distintos: expectativa, anuncio y llamado a la acción.',
    inspirations: [
      {
        title: 'Sistema de campaña en pantalla y color',
        note: 'Coherencia entre fotografía vertical móvil y cartas de color.',
        image: expE2SocialImg,
        alt: 'Tres smartphones mostrando fotografías coherentes junto a muestras de color y cámara',
      },
      {
        title: 'Campaña de producto',
        note: 'Espacio limpio superior para titulares y fecha del lanzamiento.',
        image: VISUAL_LIBRARY_PATHS.adFloating,
        alt: 'Bodegón minimalista con aire negativo para texto de campaña',
      },
      {
        title: 'Estética editorial móvil',
        note: 'Alto impacto visual en los primeros 2 segundos de scroll.',
        image: VISUAL_LIBRARY_PATHS.adBeauty,
        alt: 'Primer plano editorial de alta nitidez y textura real',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Campaña (3 piezas)', 'campaña visual de 3 piezas coherentes para lanzar un festival de diseño y cine independiente', [
        'campaña visual de 3 piezas coherentes para lanzar un festival de diseño y cine independiente',
        'lanzamiento digital de 3 piezas para una colección de café y cacao de origen',
        'serie de 3 visuales educativos para invitar a un laboratorio comunitario de IA creativa',
      ]),
      makeField('composicion', 'Formatos y espacio de texto', 'encuadres verticales 4:5 con zona limpia superior o inferior reservada para titulares', [
        'encuadres verticales 4:5 con zona limpia superior o inferior reservada para titulares',
        'serie de 3 pantallas móviles mostradas lado a lado sobre mesa creativa con cartas de color',
        'carrusel panorámico continuo divisible en 3 piezas cuadradas',
      ]),
      makeField('color', 'Cohesión cromática', 'terracota cálido, crema natural, azul cobalto y carbón constante en las 3 piezas', [
        'terracota cálido, crema natural, azul cobalto y carbón constante en las 3 piezas',
        'amarillo señalética, blanco puro y fotografía en blanco y negro',
        'verde oliva, arena y acentos dorados cálidos',
      ]),
      makeField('iluminacion', 'Tratamiento de luz', 'luz natural diurna cálida y uniforme que unifica fotografía de personas, objetos y lugar', [
        'luz natural diurna cálida y uniforme que unifica fotografía de personas, objetos y lugar',
        'luz de estudio nítida con sombras geométricas modernas',
        'atardecer urbano con calidez editorial constante',
      ]),
      makeField('estilo', 'Tono visual', 'dirección de arte editorial contemporánea, humana, directa y libre de estética de stock', [
        'dirección de arte editorial contemporánea, humana, directa y libre de estética de stock',
        'gráfica cultural vibrante con fotografía documental y bloques de color',
        'minimalismo premium con foco en textura y detalle',
      ]),
    ],
    starterPrompt:
      'Presentación de campaña digital coherente de 3 piezas visuales para lanzar un festival cultural de arte y tecnología: tres pantallas móviles dispuestas sobre una mesa de yeso crema cálido mostrando fotografía editorial coherente (retrato, arquitectura y objeto), rodeadas por tarjetas físicas de paleta cromática en terracota, azul cobalto, arena y verde bosque, luz natural diurna brillante y limpia, dirección de arte contemporánea sin texto distorsionado.',
    styleVariations: [
      {
        id: 'editorial-series',
        label: 'Serie Editorial',
        description: 'Fotografía coherente con espacio limpio para copy.',
        modifier: 'cohesive editorial social campaign photography, generous negative space for typography, unified film grade',
      },
      {
        id: 'bold-cultural',
        label: 'Cultural Vibrante',
        description: 'Bloques cromáticos, dinamismo y energía comunitaria.',
        modifier: 'vibrant cultural campaign visual system, bold geometric framing, documentary warmth',
      },
      {
        id: 'minimal-product',
        label: 'Producto Minimal',
        description: 'Foco en materialidad y silencio visual.',
        modifier: 'minimalist product launch visuals, clean travertine surfaces, soft studio shadows',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Figma', 'Canva', 'CapCut'],
    ethicsTip:
      'Usa imágenes honestas que representen fielmente el evento o producto real; evita promesas exageradas o retratos sintéticos haciéndose pasar por asistentes reales.',
    tags: ['redes sociales', 'campaña', 'marketing cultural', 'contenido', 'serie'],
  },
  {
    id: 'exp-e3-empaques',
    code: 'E3',
    title: 'Diseñar empaques',
    description: 'Visualizar cajas, etiquetas, envases y presentaciones de productos físicos.',
    exercise: 'Diseña el empaque de un producto artesanal colombiano.',
    disciplineId: 'web-digital',
    category: 'Packaging y Producto',
    level: 'Intermedio',
    duration: '25 min',
    durationMinutes: 25,
    image: expE3PackagingImg,
    imageAlt: 'Cajas de empaque artesanal colombiano en papel de caña reciclado con grabado botánico y cinta de lino terracota',
    objective:
      'Comunicar origen, sostenibilidad y valor artesanal mediante estructura del envase, sustratos táctiles, relieves y fotografía comercial.',
    inspirations: [
      {
        title: 'Cajas de cacao y café en papel de caña',
        note: 'Relieve seco botánico, cinta textil y luz cálida sobre travertino.',
        image: expE3PackagingImg,
        alt: 'Empaques artesanales en papel reciclado con grabado en relieve y cinta terracota',
      },
      {
        title: 'Estudio de producto de lujo',
        note: 'Composición de volumen y control de reflejos.',
        image: VISUAL_LIBRARY_PATHS.adLuxury,
        alt: 'Fotografía comercial de envase premium sobre superficie mineral',
      },
      {
        title: 'Ilustración botánica para etiquetas',
        note: 'Motivos naturales propios del territorio para vestir el empaque.',
        image: VISUAL_LIBRARY_PATHS.artBotanical,
        alt: 'Ilustración botánica detallada de flora local',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Producto artesanal', 'empaque sostenible para chocolate artesanal y café de altura colombiano', [
        'empaque sostenible para chocolate artesanal y café de altura colombiano',
        'botella de vidrio ámbar con etiqueta táctil para infusión botánica andina',
        'caja rígida ecológica para cerámica pintada a mano de Carmen de Viboral',
      ]),
      makeField('materiales', 'Sustratos y acabados', 'papel reciclado de bagazo de caña sin blanquear, grabado botánico en relieve seco, cinta de lino terracota y microestampado dorado', [
        'papel reciclado de bagazo de caña sin blanquear, grabado botánico en relieve seco, cinta de lino terracota y microestampado dorado',
        'cartón kraft texturizado, tinta serigráfica en dos colores y sello de cera natural',
        'vidrio reciclado esmerilado con tapa de madera local y etiqueta en algodón',
      ]),
      makeField('contexto', 'Escenografía', 'bloques de piedra travertino natural con fondo enlucido cálido neutro', [
        'bloques de piedra travertino natural con fondo enlucido cálido neutro',
        'mesa de madera de café con hojas frescas desenfocadas al fondo',
        'superficie de estudio minimalista crema con sombras arquitectónicas',
      ]),
      makeField('iluminacion', 'Iluminación', 'luz lateral suave de ventana resaltando las fibras del papel y la profundidad del relieve', [
        'luz lateral suave de ventana resaltando las fibras del papel y la profundidad del relieve',
        'iluminación comercial de estudio limpia con brillo sutil sobre el foil',
        'sol cálido matinal con sombras delicadas de hojas',
      ]),
      makeField('camara', 'Óptica', 'fotografía de producto con lente 85mm f/5.6, nitidez total en textura del envase', [
        'fotografía de producto con lente 85mm f/5.6, nitidez total en textura del envase',
        'plano tres cuartos mostrando frente y lateral de dos tamaños de empaque',
        'macro detalle del sello, grabado y fibra del papel',
      ]),
    ],
    starterPrompt:
      'Fotografía profesional de diseño de empaque sostenible para cacao y café de altura artesanal colombiano: dos cajas minimalistas elaboradas en papel reciclado de bagazo de caña con fibras naturales visibles, motivos botánicos en relieve seco, cinta de lino color terracota y delicado estampado dorado, dispuestas sobre bloques de piedra travertino con luz solar lateral suave, lente 85mm, sin texto deformado, lujo artesanal consciente.',
    styleVariations: [
      {
        id: 'craft-luxury',
        label: 'Artesanía Contemporánea',
        description: 'Fibras naturales, relieve seco y sobriedad editorial.',
        modifier: 'contemporary craft luxury packaging, blind embossed botanical motif, sugarcane paper, travertine',
      },
      {
        id: 'colorful-folk',
        label: 'Color Territorial',
        description: 'Ilustración botánica vibrante y carácter festivo.',
        modifier: 'vibrant Colombian botanical illustration packaging, matte textured sleeve, warm natural light',
      },
      {
        id: 'minimal-apothecary',
        label: 'Botánica Apotecaria',
        description: 'Vidrio ámbar, etiquetas tipográficas y pureza.',
        modifier: 'minimalist apothecary amber glass bottle, tactile cotton label, clean studio lighting',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Lab de Producto (Núcleo Lab)', 'Adobe Dimension / Illustrator'],
    ethicsTip:
      'Antes de pasar a producción física, valida viabilidad real de troqueles, tintas ecológicas y costos con imprentas o talleres locales.',
    tags: ['empaques', 'packaging', 'colombia', 'sostenible', 'producto'],
  },
  {
    id: 'exp-e4-infografia',
    code: 'E4',
    title: 'Crear una infografía o visual educativo',
    description: 'Explicar conceptos complejos, procesos o datos de forma visual y comprensible.',
    exercise: 'Crea una infografía visual sobre cómo funciona la inteligencia artificial.',
    disciplineId: 'web-digital',
    category: 'Visualización y Educación',
    level: 'Intermedio',
    duration: '25 min',
    durationMinutes: 25,
    image: expE4InfographicImg,
    imageAlt: 'Infografía impresa de estilo editorial suizo sobre mesa de madera con diagramas concéntricos y gráficos en cobalto y ocre',
    objective:
      'Sintetizar un proceso técnico en una estructura visual legible (entrada → proceso → salida) con jerarquía, codificación cromática y claridad didáctica.',
    inspirations: [
      {
        title: 'Infografía editorial impresa',
        note: 'Anillos concéntricos, barras limpias y mapa topográfico en 3 tintas.',
        image: expE4InfographicImg,
        alt: 'Lámina infográfica con gráficos geométricos en azul cobalto, ocre y gris sobre papel crema',
      },
      {
        title: 'Diagramación de revista',
        note: 'Cómo ordenar bloques informativos con aire visual.',
        image: expA3EditorialImg,
        alt: 'Doble página editorial con retícula modular',
      },
      {
        title: 'Prisma analítico de explicabilidad',
        note: 'Metáfora visual para explicar cajas negras e IA.',
        image: VISUAL_LIBRARY_PATHS.colorJsonTransfer,
        alt: 'Visualización estructurada de parámetros de estilo',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Tema educativo', 'infografía editorial moderna explicando visualmente el ciclo de datos, entrenamiento y generación en inteligencia artificial', [
        'infografía editorial moderna explicando visualmente el ciclo de datos, entrenamiento y generación en inteligencia artificial',
        'diagrama visual de ecosistemas de páramo andino y ciclo del agua',
        'guía visual paso a paso de los 7 elementos de un buen prompt fotográfico',
      ]),
      makeField('composicion', 'Estructura gráfica', 'lámina horizontal con diagrama circular central, barras comparativas a la izquierda y mapa de flujo a la derecha', [
        'lámina horizontal con diagrama circular central, barras comparativas a la izquierda y mapa de flujo a la derecha',
        'flujo lineal en 4 pasos conectados por líneas finas numeradas',
        'diagrama isométrico limpio con capas separadas y leyendas laterales',
      ]),
      makeField('color', 'Codificación cromática', 'azul cobalto para datos, amarillo ocre para creatividad humana, grafito para arquitectura sobre papel marfil', [
        'azul cobalto para datos, amarillo ocre para creatividad humana, grafito para arquitectura sobre papel marfil',
        'verde bosque, turquesa agua y tierra sobre blanco puro',
        'escala de grises técnica con un único acento violeta eléctrico',
      ]),
      makeField('estilo', 'Lenguaje de información', 'diseño de información estilo editorial suizo / Bauhaus, líneas finas vectoriales, claridad absoluta', [
        'diseño de información estilo editorial suizo / Bauhaus, líneas finas vectoriales, claridad absoluta',
        'ilustración científica contemporánea con íconos geométricos mínimos',
        'diagrama arquitectónico tipo blueprint cálido',
      ]),
      makeField('formato', 'Presentación', 'póster impreso sobre papel algodón extendido en mesa de madera de roble con luz natural', [
        'póster impreso sobre papel algodón extendido en mesa de madera de roble con luz natural',
        'arte digital plano 16:9 listo para presentación educativa',
        'doble página desplegable de libro de divulgación científica',
      ]),
    ],
    starterPrompt:
      'Fotografía plana arquitectónica de una infografía editorial educativa impresa sobre papel algodón marfil encima de una mesa de madera de roble: diseño de información estilo suizo explicando visualmente el funcionamiento de la inteligencia artificial mediante un diagrama circular concéntrico central, bloques comparativos a la izquierda y curvas topográficas a la derecha, paleta codificada en azul cobalto, amarillo ocre y gris carbón, líneas geométricas limpias sin texto ilegible, luz natural de ventana.',
    styleVariations: [
      {
        id: 'swiss-data',
        label: 'Datos Estilo Suizo',
        description: 'Grillas precisas, líneas finas y elegancia informativa.',
        modifier: 'Swiss data visualization poster, crisp vector linework, cobalt ochre charcoal palette, cotton paper',
      },
      {
        id: 'isometric-edu',
        label: 'Isométrico Didáctico',
        description: 'Flujos tridimensionales claros para explicar sistemas.',
        modifier: 'clean architectural isometric educational diagram, matte surfaces, soft daylight clarity',
      },
      {
        id: 'botanical-atlas',
        label: 'Atlas Científico',
        description: 'Dibujo técnico y observación naturalista.',
        modifier: 'contemporary scientific atlas plate, fine ink diagrams and subtle watercolor coding',
      },
    ],
    tools: ['Midjourney', 'Figma', 'Illustrator', 'NotebookLM (síntesis)', 'Canva'],
    ethicsTip:
      'Nunca confíes en cifras o textos escritos automáticamente por un generador de imágenes: verifica los datos en fuentes confiables y coloca todos los rótulos manualmente.',
    tags: ['infografía', 'educación', 'datos', 'diagrama', 'divulgación'],
  },

  // =========================================================================
  // F. LABORATORIO EXPERIMENTAL · IDENTIDAD PROPIA DE NÚCLEO COLECTIVO
  // =========================================================================
  {
    id: 'exp-f1-collage',
    code: 'F1',
    title: 'Collage imposible',
    description: 'Mezclar épocas, objetos, texturas, fotografías, ilustraciones y símbolos en una sola composición surrealista.',
    exercise: 'Combina un elemento antiguo, uno natural y uno futurista en una obra visual.',
    disciplineId: 'laboratorio-experimental',
    category: 'Laboratorio Experimental',
    level: 'Principiante',
    duration: '15 min',
    durationMinutes: 15,
    image: expF1CollageImg,
    imageAlt: 'Collage artístico contemporáneo mezclando grabados botánicos antiguos, fragmentos de concreto, papel cobalto rasgado y geometrías doradas',
    objective:
      'Provocar fricción poética juntando tres tiempos o materialidades disímiles (antiguo + natural + futurista) con bordes rasgados y capas tangibles.',
    inspirations: [
      {
        title: 'Collage botánico, concreto y astrolabio',
        note: 'Superposición física de grabados del siglo XIX, papel rasgado y geometría 3D.',
        image: expF1CollageImg,
        alt: 'Obra de collage mixto en galería con helechos grabados, concreto y esferas doradas',
      },
      {
        title: 'Hibridación orgánica',
        note: 'Fusión surrealista entre botánica y tecnología.',
        image: VISUAL_LIBRARY_PATHS.artHybridOrganism,
        alt: 'Arte digital híbrido entre organismo botánico y estructura mineral',
      },
      {
        title: 'Ilustración botánica de archivo',
        note: 'Textura histórica ideal como capa base del collage.',
        image: VISUAL_LIBRARY_PATHS.artBotanical,
        alt: 'Ilustración botánica clásica sobre fondo crema',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Triada imposible (Antiguo + Natural + Futurista)', 'grabados botánicos de helechos del siglo XIX + arcos de concreto brutalista fracturados + poliedros dorados levitando', [
        'grabados botánicos de helechos del siglo XIX + arcos de concreto brutalista fracturados + poliedros dorados levitando',
        'astrolabio de latón antiguo + orquídeas andinas vivas + circuitos translúcidos de vidrio',
        'fotografía sepia de archivo + raíces aéreas de bosque + satélites geométricos flotantes',
      ]),
      makeField('materiales', 'Capas y cortes', 'papel artesanal azul cobalto rasgado a mano, lienzo de lino crudo, recorte fotográfico y lámina de oro', [
        'papel artesanal azul cobalto rasgado a mano, lienzo de lino crudo, recorte fotográfico y lámina de oro',
        'recortes de revista vintage, cinta adhesiva translúcida y pigmento acrílico crudo',
        'fotocomposición digital con sombras reales entre capas de papel grueso',
      ]),
      makeField('composicion', 'Tensión espacial', 'ensamblaje central en profundidad con capas superpuestas y respiración perimetral', [
        'ensamblaje central en profundidad con capas superpuestas y respiración perimetral',
        'diálogo diagonal entre pasado a la izquierda y especulación futura a la derecha',
        'constelación equilibrada de fragmentos flotando sobre fondo textil',
      ]),
      makeField('iluminacion', 'Luz de exhibición', 'iluminación de galería de arte contemporáneo revelando el grosor real del papel y las sombras de corte', [
        'iluminación de galería de arte contemporáneo revelando el grosor real del papel y las sombras de corte',
        'luz plana de escáner de alta resolución conservando cada fibra',
        'luz rasante lateral dramatizando el relieve del ensamblaje',
      ]),
      makeField('estilo', 'Espíritu experimental', 'arte contemporáneo conceptual, dadaísmo poético actual, cero clichés digitales', [
        'arte contemporáneo conceptual, dadaísmo poético actual, cero clichés digitales',
        'collage editorial de museo latinoamericano',
        'fanzine de vanguardia en técnicas mixtas',
      ]),
    ],
    starterPrompt:
      'Obra de collage contemporáneo en técnicas mixtas expuesta en galería: superposición física de grabados botánicos de helechos del siglo XIX, fragmentos de un arco brutalista de concreto, papel hecho a mano en azul cobalto rasgado, aros de un astrolabio antiguo de latón y poliedros geométricos dorados flotando en el centro sobre lienzo de lino crudo, sombras reales entre las capas de papel, iluminación curatorial suave, estética de arte contemporáneo conceptual.',
    styleVariations: [
      {
        id: 'tactile-paper',
        label: 'Papel Rasgado Táctil',
        description: 'Bordes rasgados, textura física y sombras reales.',
        modifier: 'tactile physical mixed-media paper collage, torn deckled edges, real layered cast shadows',
      },
      {
        id: 'archive-dada',
        label: 'Archivo y Grabado',
        description: 'Mezcla de libros antiguos, fotografía sepia y color plano.',
        modifier: 'archival 19th-century engraving collage combined with flat cobalt geometric cutouts',
      },
      {
        id: 'hybrid-photo',
        label: 'Fotomontaje Onírico',
        description: 'Unión fotográfica limpia de escalas imposibles.',
        modifier: 'conceptual fine-art photomontage, unexpected scale juxtapositions, museum print aesthetic',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Photoshop', 'GIMP', 'Escáner + collage físico'],
    ethicsTip:
      'Cuando mezcles archivos históricos o fotografías de terceros, utiliza colecciones de dominio público (como Biodiversity Heritage Library o Europeana) y cita su procedencia.',
    tags: ['collage', 'experimental', 'técnicas mixtas', 'surrealismo', 'arte contemporáneo'],
    featured: true,
  },
  {
    id: 'exp-f2-arte-generativo',
    code: 'F2',
    title: 'Arte generativo',
    description: 'Explorar patrones algorítmicos, geometrías complejas, estructuras matemáticas y estéticas digitales.',
    exercise: 'Crea una obra inspirada en patrones de la naturaleza y geometría algorítmica.',
    disciplineId: 'laboratorio-experimental',
    category: 'Laboratorio Experimental',
    level: 'Intermedio',
    duration: '20 min',
    durationMinutes: 20,
    image: VISUAL_LIBRARY_PATHS.animGenerativeParticles,
    imageAlt: 'Obra de arte generativo formada por miles de partículas algorítmicas y flujos orgánicos luminosos',
    objective:
      'Combinar reglas matemáticas (campos de flujo, voronoi, fractales, recursión) con patrones biológicos para crear obras algorítmicas sofisticadas.',
    inspirations: [
      {
        title: 'Campos de flujo de partículas',
        note: 'Miles de agentes siguiendo trayectorias vectoriales orgánicas.',
        image: VISUAL_LIBRARY_PATHS.animGenerativeParticles,
        alt: 'Visualización generativa de partículas en flujo',
      },
      {
        title: 'Diagramas topográficos y anillos',
        note: 'Geometría precisa que puede trazarse con plotter de tinta.',
        image: expE4InfographicImg,
        alt: 'Curvas topográficas y geometrías concéntricas sobre papel algodón',
      },
      {
        title: 'Escultura algorítmica 3D',
        note: 'De la fórmula bidimensional a la forma física imprimible.',
        image: VISUAL_LIBRARY_PATHS.anim3dSculpture,
        alt: 'Forma tridimensional generativa con textura mate',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Sistema algorítmico', 'obra de arte generativo inspirada en crecimiento de corales, campos de flujo vectorial y geometría diferencial', [
        'obra de arte generativo inspirada en crecimiento de corales, campos de flujo vectorial y geometría diferencial',
        'dibujo de pen-plotter con 10.000 líneas finas formando curvas topográficas de un río andino',
        'teselación voronoi orgánica transformándose en nervaduras de hoja translúcida',
      ]),
      makeField('estilo', 'Salida visual', 'arte algorítmico de museo estilo Processing / p5.js de ultra alta precisión', [
        'arte algorítmico de museo estilo Processing / p5.js de ultra alta precisión',
        'trazado de plotter mecánico con tinta azul y dorada sobre papel algodón',
        'simulación generativa volumétrica sobre fondo carbón profundo',
      ]),
      makeField('color', 'Paleta algorítmica', 'carbón profundo, oro mineral, azul cobalto y blanco marfil con gradación matemática', [
        'carbón profundo, oro mineral, azul cobalto y blanco marfil con gradación matemática',
        'tinta negra y bermellón sobre papel hueso de archivo',
        'gradiente orgánico de verde liquen, arena y plata',
      ]),
      makeField('composicion', 'Regla espacial', 'simetría emergente rota por ruido Perlin controlado desde el centro hacia los bordes', [
        'simetría emergente rota por ruido Perlin controlado desde el centro hacia los bordes',
        'retícula recursiva que se subdivide en espiral áurea',
        'flujo horizontal estratificado como corte geológico',
      ]),
      makeField('texturas', 'Acabado', 'trazo microscópico nítido con sutil textura de impresión giclée o pantalla OLED de galería', [
        'trazo microscópico nítido con sutil textura de impresión giclée o pantalla OLED de galería',
        'grano sutil de papel de grabado y relieve de tinta',
        'partículas cristalinas con profundidad óptica real',
      ]),
    ],
    starterPrompt:
      'Obra de arte generativo contemporáneo inspirada en campos de flujo vectorial y crecimiento orgánico de corales: decenas de miles de líneas y partículas finísimas siguiendo curvas de ruido Perlin con densidad variable, equilibrio entre orden matemático y caos biológico, paleta refinada en azul cobalto, oro mineral y blanco marfil sobre fondo carbón mate profundo, estética de exhibición de arte algorítmico (Processing / p5.js / giclée de museo), máxima nitidez.',
    styleVariations: [
      {
        id: 'pen-plotter',
        label: 'Pen Plotter en Papel',
        description: 'Líneas vectoriales reales trazadas con estilógrafo.',
        modifier: 'axi-draw mechanical pen plotter artwork on warm cotton rag paper, ultra-fine cobalt and gold ink lines',
      },
      {
        id: 'flow-field',
        label: 'Campo de Flujo',
        description: 'Corrientes fluidas de partículas sobre fondo oscuro.',
        modifier: 'generative particle flow-field simulation, luminous fine trails on deep matte charcoal canvas',
      },
      {
        id: 'bio-voronoi',
        label: 'Morfogénesis Orgánica',
        description: 'Patrones de reacción-difusión y estructuras celulares.',
        modifier: 'Turing reaction-diffusion and organic cellular morphogenesis sculpture, matte mineral texture',
      },
    ],
    tools: ['p5.js / Processing', 'Lab Interactivo (Núcleo Lab)', 'TouchDesigner', 'Midjourney', 'FLUX'],
    ethicsTip:
      'El verdadero salto del arte generativo ocurre cuando pasas de imitar su estética en una imagen a escribir tus propias reglas, semillas y variables interactivas.',
    tags: ['arte generativo', 'algoritmo', 'p5.js', 'patrones', 'geometría'],
  },
  {
    id: 'exp-f3-instalacion',
    code: 'F3',
    title: 'Instalación interactiva',
    description: 'Conceptuar instalaciones artísticas con proyección, luz, sensores, espacio y participación del público.',
    exercise: 'Diseña una instalación interactiva para una galería o espacio público.',
    disciplineId: 'laboratorio-experimental',
    category: 'Laboratorio Experimental',
    level: 'Avanzado',
    duration: '30 min',
    durationMinutes: 30,
    image: VISUAL_LIBRARY_PATHS.vfxProjectionMapping,
    imageAlt: 'Instalación nocturna de projection mapping arquitectónico interactivo con visitantes observando en silueta',
    objective:
      'Visualizar la relación entre arquitectura, proyección o luz, sensores corporales y experiencia colectiva del público en un espacio real.',
    inspirations: [
      {
        title: 'Projection mapping en fachada histórica',
        note: 'La luz abraza la geometría real del edificio con público a escala.',
        image: VISUAL_LIBRARY_PATHS.vfxProjectionMapping,
        alt: 'Instalación nocturna de mapping sobre arcos de piedra',
      },
      {
        title: 'Escala museográfica en 14mm',
        note: 'Cómo encuadrar una sala completa para mostrar inmersión.',
        image: VISUAL_LIBRARY_PATHS.focal14mm,
        alt: 'Interior museográfico de concreto en gran angular',
      },
      {
        title: 'Escultura atmosférica y humo',
        note: 'Luz volumétrica tangible que responde al movimiento del cuerpo.',
        image: VISUAL_LIBRARY_PATHS.vfxFluidSmoke,
        alt: 'Haces luminosos volumétricos atravesando humo en sala oscura',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Concepto de la instalación', 'instalación interactiva de luz volumétrica y proyección generativa que responde al desplazamiento y gestos del público', [
        'instalación interactiva de luz volumétrica y proyección generativa que responde al desplazamiento y gestos del público',
        'pabellón público nocturno con mapping arquitectónico activado por la voz y pasos de la comunidad',
        'sala inmersiva de hilos suspendidos y sonido espacial que cambian de patrón al acercarse',
      ]),
      makeField('contexto', 'Espacio físico', 'sala industrial de museo contemporáneo con techo alto, pisos oscuros reflectantes y muros de concreto visto', [
        'sala industrial de museo contemporáneo con techo alto, pisos oscuros reflectantes y muros de concreto visto',
        'plaza patrimonial latinoamericana al anochecer con fachada de piedra',
        'jardín botánico nocturno intervenido con sensores sutiles de luz cálida',
      ]),
      makeField('accion', 'Interacción humana', 'visitantes en silueta caminando y extendiendo sus manos mientras ondas luminosas emergen a su alrededor', [
        'visitantes en silueta caminando y extendiendo sus manos mientras ondas luminosas emergen a su alrededor',
        'grupo de niños y adultos rodeando una mesa táctil proyectada en el suelo',
        'una sola persona contemplando un haz geométrico que sigue su respiración',
      ]),
      makeField('iluminacion', 'Tecnología lumínica', 'proyección láser nítida de alta luminosidad con neblina atmosférica sutil y reflejos en el suelo', [
        'proyección láser nítida de alta luminosidad con neblina atmosférica sutil y reflejos en el suelo',
        'retículas de LED cálido lineal integradas en la arquitectura',
        'contraste entre penumbra de sala y haces geométricos cobalto y amarillo',
      ]),
      makeField('camara', 'Documentación fotográfica', 'fotografía documental de exhibición con lente gran angular 20mm a altura de visitante', [
        'fotografía documental de exhibición con lente gran angular 20mm a altura de visitante',
        'vista elevada en esquina mostrando el flujo completo de personas en la sala',
        'plano medio íntimo del gesto de un visitante interactuando con la proyección',
      ]),
    ],
    starterPrompt:
      'Fotografía documental de una instalación de arte interactivo en una amplia sala de concreto visto de museo contemporáneo: proyecciones generativas de geometrías lineales en amarillo cálido y azul eléctrico envuelven las paredes y el suelo reflectante, reaccionando en tiempo real a las siluetas de visitantes que caminan y extienden las manos generando ondas de luz, neblina atmosférica muy sutil revelando los haces de proyección, lente gran angular 20mm, escala humana realista y atmósfera curatorial.',
    styleVariations: [
      {
        id: 'museum-light',
        label: 'Sala de Museo',
        description: 'Inmersión sobria, suelo reflectante y luz arquitectónica.',
        modifier: 'contemporary art museum interactive light installation, architectural concrete, visitors in silhouette',
      },
      {
        id: 'public-mapping',
        label: 'Espacio Público',
        description: 'Fachadas ciudadanas y encuentro comunitario nocturno.',
        modifier: 'outdoor civic architectural projection mapping festival at night, diverse crowd watching in awe',
      },
      {
        id: 'kinetic-textile',
        label: 'Escultura Cinética',
        description: 'Materiales físicos suspendidos, luz suave y sensores.',
        modifier: 'suspended kinetic translucent textile sculpture reacting to air and warm spotlighting in gallery',
      },
    ],
    tools: ['Lab Interactivo (Núcleo Lab)', 'TouchDesigner', 'MediaPipe', 'Midjourney', 'Arduino / OSC'],
    ethicsTip:
      'En instalaciones con cámaras o micrófonos en espacio público, procesa los datos localmente sin almacenar rostros ni grabaciones y comunica claramente cómo funciona la interacción.',
    tags: ['instalación', 'interactivo', 'mapping', 'museo', 'sensores'],
  },
  {
    id: 'exp-f4-imagen-sonido',
    code: 'F4',
    title: 'Imagen y sonido',
    description: 'Traducir sonidos, música, emociones o ambientes sonoros en imágenes visuales.',
    exercise: 'Transforma un sonido o canción en una escena visual.',
    disciplineId: 'laboratorio-experimental',
    category: 'Laboratorio Experimental',
    level: 'Principiante',
    duration: '15 min',
    durationMinutes: 15,
    image: VISUAL_LIBRARY_PATHS.storySoundFoley,
    imageAlt: 'Estudio de diseño sonoro y objetos acústicos iluminados con calidez para traducción audiovisual',
    objective:
      'Practicar la sinestesia creativa convirtiendo frecuencia, ritmo, timbre y silencio en forma, color, textura y atmósfera visual.',
    inspirations: [
      {
        title: 'Taller de sonido y foley',
        note: 'Materialidad física del sonido: madera, agua, metal y aire.',
        image: VISUAL_LIBRARY_PATHS.storySoundFoley,
        alt: 'Estudio de sonido foley con objetos físicos y micrófonos',
      },
      {
        title: 'Ondas visuales reactivas',
        note: 'Cómo luce una frecuencia grave frente a un agudo cristalino.',
        image: VISUAL_LIBRARY_PATHS.vfxFluidSmoke,
        alt: 'Visualización volumétrica de ondas luminosas',
      },
      {
        title: 'Partículas en resonancia',
        note: 'Patrones acústicos convertidos en dibujo generativo.',
        image: VISUAL_LIBRARY_PATHS.animGenerativeParticles,
        alt: 'Partículas luminosas en movimiento orgánico',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Sonido a traducir', 'traducción visual sinestésica del sonido de lluvia nocturna sobre tejado de zinc mezclada con un piano distante', [
        'traducción visual sinestésica del sonido de lluvia nocturna sobre tejado de zinc mezclada con un piano distante',
        'paisaje visual nacido de una percusión de tambor alegre y marimba de chonta',
        'escultura visual del silencio de alta montaña roto por el viento entre frailejones',
      ]),
      makeField('texturas', 'Correspondencia tímbrica', 'graves como masas densas de agua oscura y agudos como chispas de vidrio y ondas concéntricas plateadas', [
        'graves como masas densas de agua oscura y agudos como chispas de vidrio y ondas concéntricas plateadas',
        'ritmo percusivo traducido en bloques de madera vibrante y polvo dorado suspendido',
        'acordes sostenidos como velos translúcidos de niebla luminosa en capas',
      ]),
      makeField('color', 'Temperatura sonora', 'índigo profundo, plata húmeda y destellos ámbar cálido', [
        'índigo profundo, plata húmeda y destellos ámbar cálido',
        'terracota vibrante, ocre solar y carbón rítmico',
        'blanco neblina, verde musgo y gris pizarra sereno',
      ]),
      makeField('estilo', 'Lenguaje visual', 'fotografía experimental de larga exposición mezclada con arte sonoro visual', [
        'fotografía experimental de larga exposición mezclada con arte sonoro visual',
        'pintura abstracta orgánica de gran formato con relieve táctil',
        'fotograma cinematográfico poético de sinestesia',
      ]),
      makeField('iluminacion', 'Dinámica de luz', 'pulsos suaves de luz lateral atravesando gotas y superficies vibrantes', [
        'pulsos suaves de luz lateral atravesando gotas y superficies vibrantes',
        'luz cálida tenue evocando intimidad acústica',
        'alto contraste rítmico de luces y sombras repetitivas',
      ]),
    ],
    starterPrompt:
      'Traducción visual sinestésica del sonido de lluvia nocturna sobre metal acompañado por notas lejanas de piano: superficie de agua negra vibrando en ondas concéntricas precisas, finas gotas suspendidas en el aire como notas agudas de cristal iluminadas por un haz cálido ámbar lateral, atmósfera índigo profunda y serena, fotografía experimental macro de arte contemporáneo, poética, táctil y libre de clichés musicales literales.',
    styleVariations: [
      {
        id: 'acoustic-photo',
        label: 'Fotografía Acústica',
        description: 'Agua, vibración real y reflejos de luz.',
        modifier: 'experimental macro photography of vibrating dark water surface and suspended sound droplets, warm rim light',
      },
      {
        id: 'abstract-score',
        label: 'Partitura Gráfica',
        description: 'Notación visual experimental inspirada en música contemporánea.',
        modifier: 'contemporary graphic musical score artwork on archival paper, geometric rhythm marks and ink washes',
      },
      {
        id: 'cinema-synesthesia',
        label: 'Atmósfera Cinematográfica',
        description: 'Escena narrativa que evoca exactamente cómo suena un lugar.',
        modifier: 'poetic atmospheric cinema still evoking ambient soundscape, rain haze, soft golden glow',
      },
    ],
    tools: ['Lab Interactivo Micrófono FFT (Núcleo Lab)', 'Midjourney', 'FLUX', 'Web Audio API', 'Suno / Udio'],
    ethicsTip:
      'Para proyectos accesibles, combina la traducción visual del sonido con descripciones textuales ricas que también abran la experiencia musical a personas sordas o con baja audición.',
    tags: ['sonido', 'sinestesia', 'música', 'audio reactivo', 'experimental'],
  },
  {
    id: 'exp-f5-diseno-especulativo',
    code: 'F5',
    title: 'Diseño especulativo',
    description: 'Imaginar objetos, tecnologías, interfaces o soluciones del futuro.',
    exercise: 'Diseña un objeto cotidiano del año 2050.',
    disciplineId: 'laboratorio-experimental',
    category: 'Laboratorio Experimental',
    level: 'Avanzado',
    duration: '25 min',
    durationMinutes: 25,
    image: expF5SpeculativeImg,
    imageAlt: 'Prototipo de diseño especulativo en vidrio soplado, porcelana porosa y cobre expuesto en pedestal de museo',
    objective:
      'Crear un artefacto del año 2050 como pregunta crítica sobre clima, cuerpo, comunidad o memoria, exhibido con rigor de diseño industrial de museo.',
    inspirations: [
      {
        title: 'Recolector atmosférico de agua (2050)',
        note: 'Tecnología sensible en vidrio soplado, porcelana y filamentos de cobre.',
        image: expF5SpeculativeImg,
        alt: 'Prototipo especulativo en vidrio y porcelana sobre pedestal de museo',
      },
      {
        title: 'Ciudad del futuro sostenible',
        note: 'Contexto urbano y ecológico donde habitaría el objeto.',
        image: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
        alt: 'Ciudad futura sostenible en terrazas de montaña',
      },
      {
        title: 'Escultura material',
        note: 'Combinación de tecnología con oficios táctiles.',
        image: VISUAL_LIBRARY_PATHS.anim3dSculpture,
        alt: 'Estudio escultórico de materiales',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Artefacto del año 2050', 'vasija doméstica biomimética del año 2050 que cosecha agua de la niebla urbana usando porcelana porosa y vidrio soplado', [
        'vasija doméstica biomimética del año 2050 que cosecha agua de la niebla urbana usando porcelana porosa y vidrio soplado',
        'traductor táctil de emociones y señales vegetales hecho en madera, latón y micelio',
        'relicario solar portátil del 2050 que guarda archivos familiares en cristales ópticos',
      ]),
      makeField('materiales', 'Materialidad no-cliché', 'porcelana mate porosa, vidrio borosilicato soplado a mano y filamentos finos de cobre', [
        'porcelana mate porosa, vidrio borosilicato soplado a mano y filamentos finos de cobre',
        'biopolímero de micelio prensado, lino tejido y bronce reciclado',
        'piedra volcánica tallada, aluminio anodizado y lentes minerales',
      ]),
      makeField('contexto', 'Contexto de exhibición', 'pedestal minimalista de concreto dentro de una exposición de diseño especulativo con visitantes desenfocados', [
        'pedestal minimalista de concreto dentro de una exposición de diseño especulativo con visitantes desenfocados',
        'mesa de laboratorio de diseño industrial junto a bocetos y muestras de materiales',
        'escena doméstica cotidiana del 2050 mostrando el objeto en uso real',
      ]),
      makeField('iluminacion', 'Luz curatorial', 'foco dirigido de museo revelando transparencias, filamentos internos y sombras limpias sobre el pedestal', [
        'foco dirigido de museo revelando transparencias, filamentos internos y sombras limpias sobre el pedestal',
        'luz natural difusa de taller de prototipado',
        'luz lateral suave de catálogo de diseño industrial',
      ]),
      makeField('estilo', 'Enfoque crítico', 'diseño especulativo europeo-latinoamericano (Dunne & Raby), plausible, poético y sin estética cyberpunk', [
        'diseño especulativo europeo-latinoamericano (Dunne & Raby), plausible, poético y sin estética cyberpunk',
        'fotografía de catálogo de diseño industrial suizo / japonés',
        'prototipo de investigación bio-design de universidad de arte',
      ]),
    ],
    starterPrompt:
      'Fotografía documental de exposición de diseño especulativo: prototipo de objeto cotidiano del año 2050, una vasija biomimética cosechadora de agua atmosférica elaborada en vidrio soplado transparente, porcelana porosa mate y finos filamentos de cobre interno, apoyada sobre un pedestal minimalista de concreto visto en un museo contemporáneo con visitantes suavemente desenfocados al fondo, foco direccional de galería creando delicadas cáusticas, diseño industrial plausible y poético sin clichés futuristas.',
    styleVariations: [
      {
        id: 'museum-prototype',
        label: 'Prototipo en Museo',
        description: 'Presentado como pieza histórica de un futuro cercano.',
        modifier: 'museum exhibition photography of speculative design artifact on concrete plinth, focused gallery spot',
      },
      {
        id: 'everyday-2050',
        label: 'Uso Cotidiano 2050',
        description: 'El objeto habitando una mesa o cocina real del futuro.',
        modifier: 'documentary lifestyle photograph of speculative 2050 object resting naturally on sunlit home table',
      },
      {
        id: 'bio-design',
        label: 'Bio-Diseño Táctil',
        description: 'Micelio, cerámica viva y tecnología orgánica.',
        modifier: 'tactile bio-design industrial prototype, grown mycelium and matte porcelain, studio macro daylight',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'ChatGPT (escenario crítico)', 'Blender / Rhino'],
    ethicsTip:
      'El diseño especulativo no busca predecir el futuro sino abrir debates hoy: pregúntate quién tiene acceso a tu objeto del 2050 y a quién dejaría por fuera.',
    tags: ['diseño especulativo', 'futuro 2050', 'diseño industrial', 'bio-diseño', 'crítica'],
  },
  {
    id: 'exp-f6-mutaciones',
    code: 'F6',
    title: 'Mutaciones visuales',
    description: 'Tomar una imagen y transformarla en múltiples versiones cambiando estilo, época, materialidad o lenguaje visual.',
    exercise: 'Transforma una misma idea en 4 versiones completamente distintas.',
    disciplineId: 'laboratorio-experimental',
    category: 'Laboratorio Experimental',
    level: 'Principiante',
    duration: '20 min',
    durationMinutes: 20,
    image: VISUAL_LIBRARY_PATHS.artHybridOrganism,
    imageAlt: 'Metamorfosis visual híbrida que combina anatomía botánica, cerámica mineral y luz experimental',
    objective:
      'Comprender cuánto controla realmente el prompt manteniendo fijo el sujeto mientras se mutan radicalmente materialidad, época, óptica y medio.',
    inspirations: [
      {
        title: 'Metamorfosis orgánica-mineral',
        note: 'Un mismo motivo reinterpretado a través de otro reino material.',
        image: VISUAL_LIBRARY_PATHS.artHybridOrganism,
        alt: 'Obra experimental de hibridación orgánica y mineral',
      },
      {
        title: 'Comparativa de lenguaje visual',
        note: 'Mantener el sujeto y cambiar una sola variable revela el poder del estilo.',
        image: VISUAL_LIBRARY_PATHS.lightComparison,
        alt: 'Comparativa lado a lado de transformación lumínica sobre el mismo sujeto',
      },
      {
        title: 'Transferencia de estilo estructurada',
        note: 'Cómo documentar mutaciones en parámetros reutilizables.',
        image: VISUAL_LIBRARY_PATHS.colorJsonTransfer,
        alt: 'Esquema de transferencia de estilo visual',
      },
    ],
    promptFields: [
      makeField('sujeto', 'Motivo fijo (semilla)', 'una silla clásica de madera en el centro de una habitación vacía', [
        'una silla clásica de madera en el centro de una habitación vacía',
        'un colibrí suspendido frente a una flor',
        'una mano sosteniendo una taza de café humeante',
      ]),
      makeField('materiales', 'Mutación de materialidad', 'convertida en arquitectura de vidrio soplado y musgo vivo', [
        'convertida en arquitectura de vidrio soplado y musgo vivo',
        'esculpida en papel doblado origami con luz cálida interior',
        'forjada en bronce oxidado cubierto de cristales minerales',
      ]),
      makeField('estilo', 'Mutación de época o medio', 'grabado científico del siglo XVIII vs fotografía brutalista contemporánea', [
        'grabado científico del siglo XVIII vs fotografía brutalista contemporánea',
        'maqueta stop motion de fieltro y cartón a 12fps',
        'pintura al óleo barroco con iluminación tenebrista',
      ]),
      makeField('composicion', 'Encuadre constante', 'mismo plano medio frontal centrado para comparar las 4 mutaciones en serie', [
        'mismo plano medio frontal centrado para comparar las 4 mutaciones en serie',
        'políptico de 2x2 mostrando las 4 transformaciones simultáneamente',
        'secuencia evolutiva de izquierda a derecha en un solo cuadro panorámico',
      ]),
      makeField('iluminacion', 'Luz de estudio', 'iluminación constante de galería que hace evidente el cambio de textura y superficie', [
        'iluminación constante de galería que hace evidente el cambio de textura y superficie',
        'luz dramática que muta de cálido analógico a frío mineral',
        'luz natural difusa de archivo museográfico',
      ]),
    ],
    starterPrompt:
      'Políptico artístico en cuadrícula 2x2 mostrando 4 mutaciones radicales del mismo motivo fijo (una silla clásica centrada en una habitación mínima): versión 1 grabado botánico en tinta sobre papel antiguo del siglo XVIII, versión 2 escultura translúcida de vidrio soplado con musgo vivo bajo luz de galería, versión 3 maqueta artesanal stop motion en cartón kraft y fieltro, versión 4 arquitectura brutalista en concreto y latón; encuadre idéntico en las 4 piezas para evidenciar la metamorfosis visual.',
    styleVariations: [
      {
        id: 'v1-engraving',
        label: 'Mutación 1 · Grabado 1790',
        description: 'Tinta calcográfica sobre papel envejecido.',
        modifier: '18th-century copperplate botanical engraving on aged cotton paper, fine crosshatching ink',
      },
      {
        id: 'v2-glass-moss',
        label: 'Mutación 2 · Vidrio y Musgo',
        description: 'Transparencia óptica fusionada con naturaleza viva.',
        modifier: 'sculptural hand-blown glass intertwined with living forest moss, bright museum spotlight',
      },
      {
        id: 'v3-kraft-model',
        label: 'Mutación 3 · Maqueta Kraft',
        description: 'Cartón corrugado, alambre y luz cálida de taller.',
        modifier: 'handcrafted miniature model made of kraft cardboard, paper and warm tungsten studio lamp',
      },
    ],
    tools: ['Midjourney', 'FLUX', 'Lab Comparador A/B (Núcleo Lab)', 'Lab JSON Visual'],
    ethicsTip:
      'Registrar tus mutaciones en versiones numeradas (v1, v2, v3, v4) construye pensamiento crítico y demuestra autoría en tu proceso creativo.',
    tags: ['mutaciones', 'iteración', 'estilos', 'experimento', 'serie'],
  },
];

// =========================================================================
// 3. RETOS EXPRESS · 15 MINUTOS PARA CREAR (10 RETOS)
// =========================================================================
export const EXPRESS_CHALLENGES: ExpressChallengeItem[] = [
  {
    id: 'express-01',
    number: '01',
    title: 'Convierte tu nombre en una escultura 3D',
    brief: 'Elige tu nombre o apodo (o una palabra corta) y dale cuerpo en un material inesperado.',
    instructions: [
      'Sustituye [TU NOMBRE] por 4 a 7 letras claras.',
      'Elige dos materiales contrastantes (ej. cerámica mate y latón, o piedra y cristal).',
      'Prueba al menos dos iluminaciones distintas: luz solar cálida vs galería oscura.',
    ],
    starterPrompt:
      'Escultura tipográfica tridimensional de la palabra "[TU NOMBRE]" construida en piedra travertino porosa y filos de latón cepillado, apoyada sobre un bloque de concreto mate en galería minimalista, luz natural lateral generando sombras limpias, fotografía de objeto real 85mm.',
    category: 'Tipografía 3D',
    disciplineId: 'diseno-grafico',
    level: 'Principiante',
    durationMinutes: 15,
    image: expA2TypoImg,
    imageAlt: 'Escultura tipográfica 3D en materiales arquitectónicos',
    referenceNote: 'Cuanto más corta la palabra, mejor respeta el modelo las proporciones de cada letra.',
    tools: ['Ideogram', 'FLUX', 'Midjourney'],
  },
  {
    id: 'express-02',
    number: '02',
    title: 'Transforma un objeto común en una obra de museo',
    brief: 'Eleva un objeto cotidiano (una cuchara, un lápiz, un zapato, una taza) a pieza curatorial.',
    instructions: [
      'Escoge un objeto humilde de tu escritorio o cocina.',
      'Cambia su escala o ubícalo sobre un pedestal iluminado con rigor museográfico.',
      'Describe la textura real de uso (rayones, cerámica, madera) para evitar look plástico.',
    ],
    starterPrompt:
      'Fotografía documental de museo contemporáneo exhibiendo una taza de peltre cotidiana ligeramente desgastada elevada sobre un pedestal monolítico de piedra caliza, foco cenital dramático en sala minimalista silenciosa, visitantes lejanos desenfocados, lente 50mm.',
    category: 'Dirección de Arte',
    disciplineId: 'fotografia-arte',
    level: 'Principiante',
    durationMinutes: 15,
    image: expF5SpeculativeImg,
    imageAlt: 'Objeto escultórico exhibido sobre pedestal en sala de museo',
    referenceNote: 'El contraste entre lo cotidiano y la luz curatorial crea el sentido conceptual.',
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3'],
  },
  {
    id: 'express-03',
    number: '03',
    title: 'Crea una portada de disco imaginario',
    brief: 'Diseña una carátula cuadrada 1:1 para un álbum musical que aún no existe.',
    instructions: [
      'Define el género musical y la emoción dominante (melancolía, pulso tropical, electrónica ambient).',
      'Deja espacio limpio en un tercio del cuadro para añadir el título después.',
      'Limita la paleta a máximo 3 colores con fuerte identidad.',
    ],
    starterPrompt:
      'Portada cuadrada 1:1 para un disco imaginario de electrónica andina contemporánea: fotografía analógica en doble exposición sutil de niebla de montaña y ondas geométricas doradas reflejadas en agua oscura, grano fino 35mm, sin texto, estética de sello independiente.',
    category: 'Diseño Musical',
    disciplineId: 'diseno-grafico',
    level: 'Principiante',
    durationMinutes: 15,
    image: VISUAL_LIBRARY_PATHS.colorDuotone,
    imageAlt: 'Composición gráfica editorial en duotono de alto impacto para portada',
    referenceNote: 'Una buena portada funciona incluso vista en miniatura en un celular.',
    tools: ['Midjourney', 'FLUX', 'Canva / Figma'],
  },
  {
    id: 'express-04',
    number: '04',
    title: 'Diseña un cartel para un evento imposible',
    brief: 'Anuncia un evento surrealista: un concierto submarino, una feria de nubes o un festival en el año 2099.',
    instructions: [
      'Formula el evento imposible en una frase concreta.',
      'Aplica una técnica de impresión reconocible (risografía, serigrafía o fotocartel).',
      'Comprueba que haya una jerarquía visual clara desde lejos.',
    ],
    starterPrompt:
      'Cartel cultural en impresión risográfica anunciando un festival de cine bajo la lluvia en terrazas flotantes: formas geométricas en azul cobalto, ocre y tinta negra sobre papel algodón crema, textura de semitonos, composición suiza asimétrica, sin texto ilegible.',
    category: 'Cartel Experimental',
    disciplineId: 'diseno-grafico',
    level: 'Principiante',
    durationMinutes: 15,
    image: expA1PosterImg,
    imageAlt: 'Cartel experimental impreso sobre muro de concreto',
    referenceNote: 'La técnica de impresión le da credibilidad física a una idea imposible.',
    tools: ['Ideogram', 'Midjourney', 'FLUX'],
  },
  {
    id: 'express-05',
    number: '05',
    title: 'Reimagina tu ciudad en el año 2080',
    brief: 'Toma un rincón real de tu barrio o ciudad e imagínalo transformado por ecología y cultura en 2080.',
    instructions: [
      'Nombra un rasgo reconocible de tu territorio (montañas, ladrillo, río, plaza, tranvía).',
      'Suma infraestructura sostenible plausible: corredores verdes, agua limpia, sombra comunitaria.',
      'Evita los clichés oscuros ciberpunk; busca un futuro habitable.',
    ],
    starterPrompt:
      'Fotografía panorámica 16:9 de una ciudad andina latinoamericana en el año 2080: arquitectura escalonada de ladrillo y madera cubierta de jardines verticales nativos, puentes peatonales de bambú sobre quebradas cristalinas, teleféricos silenciosos, luz cálida de mañana y vida barrial activa, realismo cinematográfico.',
    category: 'Futuros y Territorio',
    disciplineId: 'ilustracion-mundos',
    level: 'Principiante',
    durationMinutes: 15,
    image: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
    imageAlt: 'Ciudad sostenible del futuro rodeada de montañas y vegetación',
    referenceNote: 'Anclar el futuro en materiales locales lo vuelve mucho más original.',
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3'],
  },
  {
    id: 'express-06',
    number: '06',
    title: 'Crea un personaje basado en un animal local',
    brief: 'Inspírate en fauna colombiana o de tu región (colibrí, jaguar, oso de anteojos, zarigüeya, guacamaya).',
    instructions: [
      'Asigna un oficio o rol creativo al personaje (botánica, luthier, cartógrafo, bibliotecaria).',
      'Describe una prenda o herramienta característica.',
      'Pide fondo neutro claro para leer bien su silueta.',
    ],
    starterPrompt:
      'Ilustración de diseño de personaje de un colibrí andino antropomorfo convertido en cartógrafo viajero con chaleco tejido en ocre, brújula de latón y rollos de mapas botánicos, estilo concept art pintado en gouache y tinta fina sobre fondo papel crema limpio.',
    category: 'Personajes',
    disciplineId: 'ilustracion-mundos',
    level: 'Principiante',
    durationMinutes: 15,
    image: VISUAL_LIBRARY_PATHS.storyCharacterSheet,
    imageAlt: 'Ilustración de personaje con vestuario y personalidad definida',
    referenceNote: 'Un buen oficio + una herramienta icónica construyen historia al instante.',
    tools: ['Midjourney', 'FLUX', 'Leonardo AI'],
  },
  {
    id: 'express-07',
    number: '07',
    title: 'Convierte una emoción en un paisaje',
    brief: 'Traduce una emoción concreta (nostalgia, alivio, asombro, calma) en arquitectura, clima y luz.',
    instructions: [
      'No escribas solo el nombre de la emoción: tradúcela a hora del día, clima y temperatura de color.',
      'Define un único punto focal tranquilo.',
      'Controla la distancia focal (gran angular para vastedad o teleobjetivo para intimidad).',
    ],
    starterPrompt:
      'Paisaje fotográfico poético que encarna la sensación de calma tras la tormenta: sendero de piedra húmeda atravesando un páramo brumoso al primer rayo de sol dorado, nubes abriéndose lentamente, reflejos suaves en charcos de lluvia, estética Fujifilm Eterna 35mm.',
    category: 'Poética Visual',
    disciplineId: 'fotografia-arte',
    level: 'Principiante',
    durationMinutes: 15,
    image: VISUAL_LIBRARY_PATHS.colorFujifilmEterna,
    imageAlt: 'Paisaje brumoso contemplativo con paleta suave cinematográfica',
    referenceNote: 'La luz y el clima comunican emociones con más fuerza que los símbolos literales.',
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3'],
  },
  {
    id: 'express-08',
    number: '08',
    title: 'Diseña una cafetería futurista',
    brief: 'Combina la calidez sensorial del café artesanal con un espacio arquitectónico del futuro.',
    instructions: [
      'Equilibra tecnología limpia con materiales cálidos (madera, cerámica, piedra, vapor).',
      'Usa lente gran angular arquitectónico con verticales rectas.',
      'Incluye detalle de luz natural entrando por ventanales o tragaluces.',
    ],
    starterPrompt:
      'Fotografía arquitectónica interior de una cafetería futurista bioclimática en Medellín: barra escultórica monolítica de travertino y latón con métodos de filtrado en vidrio, techo curvo de madera con jardín colgante, vapor de café atrapado por luz solar oblicua, lente tilt-shift 24mm.',
    category: 'Espacios y Gastronomía',
    disciplineId: 'fotografia-arte',
    level: 'Principiante',
    durationMinutes: 15,
    image: expB4GastronomyImg,
    imageAlt: 'Café filtrado artesanal humeante bajo luz natural cálida',
    referenceNote: 'Mantén lo sensorial del café (vapor, granos, cerámica) para que el espacio se sienta habitable.',
    tools: ['Midjourney', 'FLUX', 'Krea'],
  },
  {
    id: 'express-09',
    number: '09',
    title: 'Crea una escena surrealista con un libro',
    brief: 'Haz que un libro abierto se convierta en portal, arquitectura, océano o ecosistema vivo.',
    instructions: [
      'Ubica el libro sobre una mesa o espacio cotidiano creíble.',
      'Haz que la escena imposible surja físicamente de sus páginas con sombras coherentes.',
      'Pide luz de ventana real y textura de papel.',
    ],
    starterPrompt:
      'Fotografía surrealista poética de un libro grueso abierto sobre una mesa de madera antigua: de entre sus páginas emergen lentamente pequeñas nubes reales y una escalera diminuta de piedra iluminadas por un rayo lateral de sol de tarde, textura de papel auténtica, lente 50mm f/2.8.',
    category: 'Surrealismo',
    disciplineId: 'laboratorio-experimental',
    level: 'Principiante',
    durationMinutes: 15,
    image: expB2SurrealImg,
    imageAlt: 'Composición fotográfica surrealista de escalera y nubes con luz natural',
    referenceNote: 'La iluminación coherente entre el objeto real y lo surrealista es el secreto del impacto.',
    tools: ['Midjourney', 'FLUX', 'Photoshop'],
  },
  {
    id: 'express-10',
    number: '10',
    title: 'Transforma una foto en ilustración editorial',
    brief: 'Toma una escena cotidiana o una foto tuya y reinterprétala con estilo de revista cultural.',
    instructions: [
      'Describe los elementos esenciales de tu escena (persona, lugar, gesto) sin sobrecomplicar.',
      'Elige un estilo editorial claro (tinta + bloques de color plano, gouache o risografía).',
      'Reduce la paleta a 3–4 tonos armónicos.',
    ],
    starterPrompt:
      'Ilustración editorial contemporánea estilo revista The New Yorker sobre papel mate crema: escena cotidiana de dos amigas conversando con café en un balcón lleno de plantas al atardecer, trazo de tinta expresivo y bloques de color en ocre, azul cobalto y terracota.',
    category: 'Ilustración Editorial',
    disciplineId: 'ilustracion-mundos',
    level: 'Principiante',
    durationMinutes: 15,
    image: expC3ComicImg,
    imageAlt: 'Ilustración editorial en tinta y aguadas de acuarela sobre papel',
    referenceNote: 'Limitar la paleta hace que cualquier escena cotidiana adquiera voz autoral.',
    tools: ['Midjourney', 'FLUX', 'ChatGPT', 'Procreate'],
  },
];

// =========================================================================
// 4. DESAFÍOS CREATIVOS · DE LA IDEA AL PROYECTO (8 PROYECTOS)
// =========================================================================
export const CREATIVE_PROJECT_CHALLENGES: CreativeProjectChallenge[] = [
  {
    id: 'project-01',
    number: '01',
    title: 'Crea una marca completa desde cero',
    summary: 'Desarrolla nombre, manifiesto, símbolo visual, paleta cromática y 3 aplicaciones físicas/digitales para un proyecto propio.',
    deliverable: 'Mini manual visual + papelería + pieza de lanzamiento',
    duration: '60–90 min',
    durationMinutes: 75,
    level: 'Intermedio',
    disciplineId: 'diseno-grafico',
    category: 'Branding Integral',
    image: expA4BrandImg,
    imageAlt: 'Sistema completo de identidad visual con papelería y muestras de color',
    stages: [
      'Define propósito, audiencia y 3 adjetivos rectores de la marca.',
      'Explora 3 direcciones de símbolo y paleta cromática (60-30-10).',
      'Genera un mockup cohesivo de papelería o soportes físicos.',
      'Crea la pieza gráfica principal de presentación en redes o afiche.',
      'Documenta las reglas de uso y verifica originalidad antes de aplicar.',
    ],
    starterPrompt:
      'Sistema de identidad visual contemporánea para una marca cultural independiente: papelería en papel algodón, muestras cromáticas en ocre, cobalto y carbón, tote bag de lona cruda y folleto editorial fotografiados sobre piedra caliza con luz natural limpia.',
    tools: ['Midjourney', 'Ideogram', 'Figma', 'ChatGPT / Claude'],
  },
  {
    id: 'project-02',
    number: '02',
    title: 'Diseña una revista digital de 4 páginas',
    summary: 'Planifica y produce portada, índice visual y una doble página central ilustrada sobre un tema que te apasione.',
    deliverable: 'Portada + doble página editorial + contraportada',
    duration: '60 min',
    durationMinutes: 60,
    level: 'Intermedio',
    disciplineId: 'diseno-grafico',
    category: 'Proyecto Editorial',
    image: expA3EditorialImg,
    imageAlt: 'Doble página editorial de revista contemporánea sobre mesa de piedra',
    stages: [
      'Elige el tema editorial y redacta 1 titular principal + 3 subtítulos.',
      'Genera la fotografía o ilustración protagonista de portada dejando aire superior.',
      'Construye la doble página central con imágenes coherentes en color y luz.',
      'Maqueta las 4 páginas en Figma, Canva o InDesign con retícula consistente.',
    ],
    starterPrompt:
      'Doble página editorial de revista independiente sobre arte, territorio y tecnología, retícula suiza de 4 columnas, fotografía documental sobria en la página izquierda y composición material a la derecha, papel mate sin estucar y abundante espacio blanco.',
    tools: ['Midjourney', 'FLUX', 'Figma / InDesign', 'NotebookLM'],
  },
  {
    id: 'project-03',
    number: '03',
    title: 'Crea un libro ilustrado corto',
    summary: 'Escribe una microhistoria de 5 escenas con un personaje consistente y conviértela en un álbum ilustrado.',
    deliverable: 'Personaje base + 5 láminas narrativas + portada',
    duration: '90 min',
    durationMinutes: 90,
    level: 'Intermedio',
    disciplineId: 'ilustracion-mundos',
    category: 'Álbum Ilustrado',
    image: VISUAL_LIBRARY_PATHS.storyCharacterSheet,
    imageAlt: 'Hoja de personaje para libro ilustrado con estilo consistente',
    stages: [
      'Escribe la historia en 5 frases (inicio, detonante, viaje, giro, cierre).',
      'Diseña la hoja del personaje principal para fijar vestuario y paleta.',
      'Genera las 5 ilustraciones reutilizando la misma técnica y paleta.',
      'Ensambla texto e imagen en formato horizontal de libro infantil o fanzine.',
    ],
    starterPrompt:
      'Ilustración de libro álbum contemporáneo pintada en gouache cálido y lápiz de color sobre papel texturizado: pequeño protagonista curioso explorando un bosque de helechos gigantes al amanecer, luz suave dorada y espacio inferior limpio para texto narrativo.',
    tools: ['Midjourney (--cref / --sref)', 'FLUX', 'Figma / Canva'],
  },
  {
    id: 'project-04',
    number: '04',
    title: 'Produce un cortometraje de 30 segundos con IA',
    summary: 'Integra concepto, storyboard de 5 planos, clips de video, paisaje sonoro y montaje final en una pieza breve.',
    deliverable: 'Corto de 30s en 16:9 con sonido y créditos transparentes',
    duration: '90 min',
    durationMinutes: 90,
    level: 'Avanzado',
    disciplineId: 'video-narrativas',
    category: 'Producción Audiovisual',
    image: VISUAL_LIBRARY_PATHS.camCinemaRig,
    imageAlt: 'Producción cinematográfica con rig de cámara sobre rieles en estudio',
    stages: [
      'Redacta premisa y desglose de 5 planos (6 segundos cada uno) en el Planificador.',
      'Genera los 5 fotogramas clave (keyframes) con una sola paleta y óptica.',
      'Anima cada plano con movimientos de cámara suaves y controlados.',
      'Diseña música, foley y/o narración breve y edita el ritmo en CapCut o Resolve.',
      'Agrega créditos honestos indicando dirección humana y herramientas IA.',
    ],
    starterPrompt:
      'Fotograma clave de cortometraje poético 2.39:1 en 35mm, lente anamórfico 40mm, paleta Fujifilm Eterna suave, personaje avanzando lentamente por pasillo luminoso con lluvia afuera, continuidad cinematográfica sobria.',
    tools: ['Planificador Audiovisual', 'Runway / Veo / Kling', 'CapCut / DaVinci Resolve'],
  },
  {
    id: 'project-05',
    number: '05',
    title: 'Diseña la campaña visual de un festival cultural',
    summary: 'Construye el sistema visual completo de un festival: afiche principal, 3 piezas para redes y escenario.',
    deliverable: 'Afiche + serie social (3 piezas) + visual de escenario',
    duration: '60 min',
    durationMinutes: 60,
    level: 'Intermedio',
    disciplineId: 'web-digital',
    category: 'Campaña Cultural',
    image: expE2SocialImg,
    imageAlt: 'Sistema de campaña visual en pantallas móviles y cartas cromáticas',
    stages: [
      'Define nombre del festival, eje temático y 3 colores protagonistas.',
      'Crea el afiche principal vertical con una metáfora gráfica memorable.',
      'Adapta la identidad a 3 piezas para redes (anuncio, programación, recordatorio).',
      'Diseña un visual panorámico 16:9 para proyectar en el escenario principal.',
    ],
    starterPrompt:
      'Sistema gráfico para festival cultural de arte, sonido y tecnología: fotografía editorial combinada con formas geométricas en azul cobalto, amarillo ocre y carbón, cohesión total entre afiche vertical, piezas móviles y pantalla escénica.',
    tools: ['Midjourney', 'Ideogram', 'Figma', 'Canva'],
  },
  {
    id: 'project-06',
    number: '06',
    title: 'Crea una exposición virtual de arte con IA',
    summary: 'Curaduría de 6 obras experimentales bajo una misma tesis conceptual, acompañadas de textos curatoriales y vista de sala.',
    deliverable: '6 obras curadas + texto de sala + vista arquitectónica',
    duration: '75 min',
    durationMinutes: 75,
    level: 'Intermedio',
    disciplineId: 'laboratorio-experimental',
    category: 'Curaduría y Arte',
    image: expF1CollageImg,
    imageAlt: 'Obra conceptual montada en muro de galería contemporánea con iluminación curatorial',
    stages: [
      'Formula la pregunta curatorial central de la exposición (1 párrafo).',
      'Produce una serie de 6 obras con lenguaje visual coherente y numerado.',
      'Visualiza cómo lucen montadas dentro de una galería física o virtual.',
      'Escribe fichas técnicas (título, año, técnica híbrida, reflexión) y compártelas.',
    ],
    starterPrompt:
      'Vista de sala de museo contemporáneo exhibiendo una serie coherente de obras experimentales de collage botánico y arquitectura sobre muros blancos cálidos, iluminación curatorial precisa, pisos de concreto pulido y proporción real.',
    tools: ['Midjourney', 'FLUX', 'Galería de Experimentos (Núcleo Lab)'],
  },
  {
    id: 'project-07',
    number: '07',
    title: 'Diseña una página web desde concepto hasta prototipo',
    summary: 'Pasa de una necesidad real a arquitectura de información, dirección visual, prompts de UI y prototipo navegable.',
    deliverable: 'Estructura + sistema de color + prototipo interactivo',
    duration: '75 min',
    durationMinutes: 75,
    level: 'Avanzado',
    disciplineId: 'web-digital',
    category: 'Producto Digital',
    image: expE1WebUiImg,
    imageAlt: 'Prototipo de interfaz web contemporánea con sistema editorial limpio',
    stages: [
      'Define objetivo del sitio, usuario principal y flujo clave en 3 pasos.',
      'Crea el mapa de secciones (máximo 5 bloques claros) y paleta WCAG AA.',
      'Genera la dirección visual y fotografías coherentes del sitio.',
      'Construye el prototipo funcional en Google AI Studio, Lovable, Bolt o React.',
    ],
    starterPrompt:
      'Prompt de arquitectura UI/UX para plataforma cultural interactiva: barra superior de 3 zonas, hero editorial 60/40, grilla de experiencias con filtros claros, modo claro/oscuro accesible WCAG AA y diseño responsive.',
    tools: ['Lab Diseño Web IA', 'Google AI Studio', 'Figma', 'Lovable / Bolt'],
  },
  {
    id: 'project-08',
    number: '08',
    title: 'Crea una serie fotográfica conceptual de 5 imágenes',
    summary: 'Construye un ensayo fotográfico de 5 obras unidas por un mismo concepto, óptica, luz y narrativa visual.',
    deliverable: 'Serie de 5 fotografías + título + texto de autor',
    duration: '60 min',
    durationMinutes: 60,
    level: 'Intermedio',
    disciplineId: 'fotografia-arte',
    category: 'Ensayo Fotográfico',
    image: VISUAL_LIBRARY_PATHS.photoNeoNoir,
    imageAlt: 'Fotografía editorial conceptual con iluminación controlada de serie autoral',
    stages: [
      'Define un hilo conductor poético (ej. memoria del agua, arquitectura silenciosa, oficios nocturnos).',
      'Fija una sola óptica (ej. 50mm) y un solo tratamiento de color para toda la serie.',
      'Varía las 5 escenas entre plano abierto, retrato, detalle, espacio y cierre.',
      'Ordena la secuencia y escribe una breve declaración conceptual.',
    ],
    starterPrompt:
      'Serie fotográfica conceptual de arte contemporáneo en película 35mm, lente 50mm f/2.8, paleta contenida con sombras profundas y luz natural lateral constante: escena 1 de 5 explorando la huella humana en arquitecturas silenciosas al alba.',
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3', 'Lightroom'],
  },
];

// =========================================================================
// 5. EXPERIMENTOS ABIERTOS · EXPLORAR SIN LÍMITES (8 PREGUNTAS PROVOCADORAS)
// =========================================================================
export const OPEN_EXPERIMENTS: OpenExperimentItem[] = [
  {
    id: 'open-01',
    number: '01',
    question: '¿Cómo se vería la música si fuera arquitectura?',
    provocation: 'Traduce un ritmo, un acorde o un silencio en bóvedas, escaleras, acústica y luz construible.',
    startingHint: 'Piensa en una pieza musical concreta: ¿un bolero es ladrillo cálido y arcos? ¿La electrónica minimalista es concreto suspendido y reflejos?',
    suggestedPrompt:
      'Pabellón arquitectónico monumental inspirado en la estructura de una pieza de cello minimalista: arcos rítmicos de madera curva y concreto filtrando haces de luz solar como intervalos musicales, fotografía arquitectónica 24mm.',
    disciplineId: 'laboratorio-experimental',
    image: VISUAL_LIBRARY_PATHS.photoArchitecture,
    imageAlt: 'Arquitectura contemporánea con ritmo geométrico de luces y sombras',
    tools: ['Midjourney', 'FLUX', 'Lab Interactivo'],
  },
  {
    id: 'open-02',
    number: '02',
    question: '¿Qué pasaría si la naturaleza diseñara tecnología?',
    provocation: 'Imagina dispositivos que crecen, respiran, se reparan solos y vuelven a la tierra sin residuos.',
    startingHint: 'Reemplaza plástico y pantallas negras por micelio, hojas fotosintéticas, cerámica porosa, agua y cobre.',
    suggestedPrompt:
      'Dispositivo de comunicación bio-tecnológico cultivado en lugar de fabricado: carcasa viva de cerámica porosa, venas de cobre orgánico y filamentos bioluminiscentes suaves sobre mesa de laboratorio botánico, fotografía macro editorial.',
    disciplineId: 'laboratorio-experimental',
    image: VISUAL_LIBRARY_PATHS.artHybridOrganism,
    imageAlt: 'Hibridación estética entre organismo botánico y estructura mineral',
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3'],
  },
  {
    id: 'open-03',
    number: '03',
    question: '¿Cómo sería un museo dentro de un sueño?',
    provocation: 'Rompe las reglas de la gravedad, la escala y el tiempo curatorial manteniendo verosimilitud fotográfica.',
    startingHint: 'Combina la serenidad de una sala de museo real con una imposibilidad silenciosa: suelos de agua, nubes en vitrinas o marcos vacíos hacia el cielo.',
    suggestedPrompt:
      'Sala silenciosa de museo contemporáneo cuyo suelo es un espejo de agua tranquila reflejando nubes reales que atraviesan las claraboyas, visitantes observando marcos suspendidos sin muros, fotografía fine art en formato medio.',
    disciplineId: 'laboratorio-experimental',
    image: expB2SurrealImg,
    imageAlt: 'Arquitectura poética e imposible sobre lago espejo bajo nubes crepusculares',
    tools: ['Midjourney', 'FLUX', 'Photoshop'],
  },
  {
    id: 'open-04',
    number: '04',
    question: '¿Qué forma tendría un recuerdo que se está borrando?',
    provocation: 'Explora la fragilidad de la memoria: grano, doble exposición, zonas incompletas, ecos y restos afectivos.',
    startingHint: 'Piensa en un detalle doméstico (una mesa, una ventana, un jardín) disolviéndose lentamente en luz, neblina o papel gastado.',
    suggestedPrompt:
      'Fotografía poética experimental sobre la fragilidad de la memoria: mesa familiar junto a una ventana soleada parcialmente disuelta en neblina luminosa y grano analógico 35mm desvanecido, bordes suaves y nostalgia cálida sin rostro definido.',
    disciplineId: 'fotografia-arte',
    image: VISUAL_LIBRARY_PATHS.photoTerritory,
    imageAlt: 'Imagen evocadora sobre territorio, huella y memoria visual',
    tools: ['Midjourney', 'FLUX', 'Lab Restauración'],
  },
  {
    id: 'open-05',
    number: '05',
    question: '¿Cómo sería un alfabeto de otra civilización?',
    provocation: 'Inventa un sistema de escritura basado en gestos del viento, nudos, sombras, geología o sonido.',
    startingHint: 'Decide sobre qué soporte escriben: piedra volcánica, textiles anudados, vidrio óptico o marcas de agua.',
    suggestedPrompt:
      'Lámina de archivo antropológico especulativo mostrando un alfabeto tridimensional inventado basado en nudos textiles, sombras de latón y trazos minerales sobre piedra caliza, luz lateral de museo, sin letras latinas.',
    disciplineId: 'diseno-grafico',
    image: expA2TypoImg,
    imageAlt: 'Formas escultóricas tipográficas en metal, vidrio y piedra',
    tools: ['Midjourney', 'FLUX', 'p5.js'],
  },
  {
    id: 'open-06',
    number: '06',
    question: '¿Qué aspecto tendría una emoción hecha objeto?',
    provocation: 'Convierte la nostalgia, la valentía, la duda o la ternura en una escultura táctil que podrías sostener.',
    startingHint: 'Pregúntate cuánto pesa esa emoción, si es tibia o fría, transparente o áspera, frágil o densa.',
    suggestedPrompt:
      'Objeto escultórico contemporáneo que materializa la sensación de "ternura valiente": pieza táctil de vidrio soplado tibio envolviendo una piedra volcánica áspera sostenida por delicados hilos de cobre, pedestal claro y luz suave de galería.',
    disciplineId: 'laboratorio-experimental',
    image: expF5SpeculativeImg,
    imageAlt: 'Objeto escultórico de vidrio y cerámica con filamentos de cobre en galería',
    tools: ['Midjourney', 'FLUX', 'Blender'],
  },
  {
    id: 'open-07',
    number: '07',
    question: '¿Cómo se vería Internet si fuera un lugar físico?',
    provocation: 'Olvida los túneles azules de código: imagina archivos, mercados, jardines, bibliotecas y plazas reales.',
    startingHint: '¿Es un archivo laberíntico de vidrio, un mercado nocturno infinito, un bosque de cables y pájaros o un observatorio compartido?',
    suggestedPrompt:
      'Gran plano arquitectónico de Internet imaginado como una inmensa biblioteca-plaza física abierta al cielo: pasarelas de madera y cristal conectando archivos iluminados, mensajeros, jardines interiores y flujos sutiles de luz cálida, fotografía cinematográfica 24mm.',
    disciplineId: 'ilustracion-mundos',
    image: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
    imageAlt: 'Gran arquitectura especulativa conectada por puentes, jardines y luz',
    tools: ['Midjourney', 'FLUX', 'Google Imagen 3'],
  },
  {
    id: 'open-08',
    number: '08',
    question: '¿Qué pasaría si el arte tradicional y la IA colaboraran en una sola obra?',
    provocation: 'Cruza un gesto manual irrepetible (tinta, bordado, cerámica, linograbado) con síntesis algorítmica.',
    startingHint: 'Empieza con un trazo real o una técnica artesanal latinoamericana y permite que la capa digital la expanda sin borrar la mano humana.',
    suggestedPrompt:
      'Obra híbrida contemporánea combinando bordado textil manual en lino crudo con geometrías generativas proyectadas en luz cobalto y dorada sobre la misma tela, macro documental de taller artístico revelando puntadas reales y haces luminosos.',
    disciplineId: 'laboratorio-experimental',
    image: expF1CollageImg,
    imageAlt: 'Obra de técnica mixta uniendo grabado, materia física y geometría contemporánea',
    tools: ['Lab Dibujo a Imagen', 'Midjourney', 'Lab Interactivo'],
  },
];

// =========================================================================
// 7. GALERÍA DE EXPERIMENTOS (SEMILLA CURADA + CREACIONES LOCALES)
// =========================================================================
export const INITIAL_COMMUNITY_EXPERIMENTS: CommunityExperimentEntry[] = [
  {
    id: 'comm-seed-01',
    author: 'Núcleo Colectivo · Taller Medellín',
    title: 'Cartel Risográfico — Festival Sonido y Territorio',
    category: 'Diseño Gráfico',
    disciplineId: 'diseno-grafico',
    exerciseId: 'exp-a1-cartel',
    prompt:
      'Afiche contemporáneo en risografía de dos tintas (azul cobalto y amarillo ocre) sobre papel algodón crema, geometría constructiva asimétrica y textura de semitonos, montado sobre muro de concreto en galería.',
    toolUsed: 'FLUX + Figma',
    notes: 'Iteramos 3 veces reduciendo elementos hasta lograr una silueta legible a 5 metros de distancia.',
    image: expA1PosterImg,
    imageAlt: 'Cartel risográfico en azul cobalto y ocre sobre muro de concreto',
    createdAt: '2026-10-18',
  },
  {
    id: 'comm-seed-02',
    author: 'Colectivo Botánica Digital',
    title: 'Recolector Atmosférico 2050 — Prototipo 04',
    category: 'Laboratorio Experimental',
    disciplineId: 'laboratorio-experimental',
    exerciseId: 'exp-f5-diseno-especulativo',
    prompt:
      'Prototipo de diseño especulativo del año 2050: vasija cosechadora de agua de niebla en vidrio borosilicato soplado, porcelana mate porosa y filamentos de cobre en pedestal de museo.',
    toolUsed: 'Midjourney v6',
    notes: 'Evitamos el cliché cyberpunk usando materiales cerámicos y luz documental de museo.',
    image: expF5SpeculativeImg,
    imageAlt: 'Prototipo de diseño especulativo en vidrio y porcelana',
    createdAt: '2026-10-22',
  },
  {
    id: 'comm-seed-03',
    author: 'Taller Art Toy Andino',
    title: 'Guardián de Páramo — Edición Vinilo Mate',
    category: 'Art Toy y 3D',
    disciplineId: 'ilustracion-mundos',
    exerciseId: 'exp-c4-art-toy',
    prompt:
      'Figura coleccionable art toy inspirada en oso de anteojos y geometría de orfebrería precolombina en vinilo mate terracota, negro obsidiana y latón cepillado sobre concreto.',
    toolUsed: 'Google Imagen 3 + Blender',
    notes: 'Combinamos referencias del Museo del Oro con proporciones limpias de designer toy.',
    image: expC4ArtToyImg,
    imageAlt: 'Figura art toy coleccionable de oso andino con detalles en latón',
    createdAt: '2026-11-02',
  },
  {
    id: 'comm-seed-04',
    author: 'Laboratorio de Empaques Locales',
    title: 'Cacao y Café de Altura — Papel de Caña',
    category: 'Packaging y Producto',
    disciplineId: 'web-digital',
    exerciseId: 'exp-e3-empaques',
    prompt:
      'Empaques artesanales colombianos en papel reciclado de bagazo de caña con grabado botánico en relieve seco, cinta de lino terracota y microestampado dorado sobre travertino.',
    toolUsed: 'FLUX + Illustrator',
    notes: 'Probamos 4 sustratos distintos hasta encontrar una textura de papel reciclado creíble.',
    image: expE3PackagingImg,
    imageAlt: 'Cajas artesanales en papel reciclado con cinta de lino terracota',
    createdAt: '2026-11-09',
  },
];

export function assemblePromptFromFields(
  values: Record<string, string>,
  fields: PromptFieldSpec[],
  materialNote?: string,
  variationModifier?: string
): string {
  const parts = fields
    .map((f) => (values[f.key] || '').trim())
    .filter(Boolean);

  if (materialNote && materialNote.trim()) {
    parts.unshift(`Basado en material inicial: ${materialNote.trim()}`);
  }
  if (variationModifier && variationModifier.trim()) {
    parts.push(variationModifier.trim());
  }
  return parts.join(', ') + (parts.length > 0 ? '.' : '');
}
