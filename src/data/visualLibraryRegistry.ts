import type { VisualAspectRatio } from '../components/ResilientImage';

export type VisualAssetCategory =
  | 'Fotografía y Retrato'
  | 'Iluminación'
  | 'Cámaras y Lentes'
  | 'Composición y Planos'
  | 'Color y Estética'
  | 'Publicidad y Dirección de Arte'
  | 'Cinematografía y Video'
  | 'Animación y VFX'
  | 'Storyboard, Personajes y Mundo';

export interface VisualAssetRecord {
  id: string;
  title: string;
  category: VisualAssetCategory;
  subcategory: string;
  image: string;
  aspectRatio: VisualAspectRatio;
  objectPosition?: 'center' | 'top' | 'bottom';
  description: string;
  technicalExplanation: string;
  applicationExample: string;
  prompt: string;
  alt: string;
  tags: string[];
  source: string;
  license: string;
  relatedIds: string[];
}

export const VISUAL_LIBRARY_PATHS = {
  // Iluminación (incluye serie controlada "Una persona, cuatro luces")
  lightButterfly: '/assets/visual-library/lighting/butterfly-portrait.webp',
  lightRembrandt: '/assets/visual-library/lighting/rembrandt-portrait.webp',
  lightSplit: '/assets/visual-library/lighting/split-portrait.webp',
  lightRim: '/assets/visual-library/lighting/rim-portrait.webp',
  lightHighKey: '/assets/visual-library/lighting/highkey-portrait.webp',
  lightComparison: '/assets/visual-library/lighting/rembrandt-vs-highkey.webp',

  // Lentes y Cámaras (incluye serie controlada en taller de cerámica)
  focal14mm: '/assets/visual-library/lenses-cameras/focal-14mm-ultrawide.webp',
  focal24mm: '/assets/visual-library/lenses-cameras/focal-24mm-wide.webp',
  focal50mm: '/assets/visual-library/lenses-cameras/focal-50mm-natural.webp',
  focal85mm: '/assets/visual-library/lenses-cameras/focal-85mm-portrait.webp',
  focal100mmMacro: '/assets/visual-library/lenses-cameras/focal-100mm-macro.webp',
  focal135mm: '/assets/visual-library/lenses-cameras/focal-135mm-tele.webp',
  focalComparison: '/assets/visual-library/lenses-cameras/focal-35-vs-85.webp',
  camRangefinder: '/assets/visual-library/lenses-cameras/camera-analog-rangefinder.webp',
  camCinemaRig: '/assets/visual-library/lenses-cameras/camera-cinema-rig.webp',
  camRigStudio: '/assets/visual-library/lenses-cameras/camera-rig-studio.webp',

  // Fotografía y Arte
  photoFashion: '/assets/visual-library/photography/fashion-editorial.webp',
  photoArchitecture: '/assets/visual-library/photography/architectural-concrete.webp',
  photoDocumentaryStreet: '/assets/visual-library/photography/documentary-street.webp',
  photoAnalogDocumentary: '/assets/visual-library/photography/analog-documentary.webp',
  photoNeoNoir: '/assets/visual-library/photography/neo-noir-portrait.webp',
  photoTerritory: '/assets/visual-library/photography/territory-memory.webp',
  artBotanical: '/assets/visual-library/photography/botanical-illustration.webp',
  artHybridOrganism: '/assets/visual-library/photography/hybrid-organism.webp',

  // Composición y Planos
  compExtremeWide: '/assets/visual-library/composition/extreme-wide-shot.webp',
  compLowAngle: '/assets/visual-library/composition/low-angle-shot.webp',
  compBirdsEye: '/assets/visual-library/composition/birds-eye-shot.webp',
  compOverShoulder: '/assets/visual-library/composition/over-shoulder-shot.webp',
  compDutchAngle: '/assets/visual-library/composition/dutch-angle-shot.webp',
  compLeadingLines: '/assets/visual-library/composition/leading-lines-arch.webp',
  compCinematography: '/assets/visual-library/composition/composition-cinematography.webp',

  // Color y Estética
  colorTealOrange: '/assets/visual-library/color/teal-orange-grade.webp',
  colorKodakPortra: '/assets/visual-library/color/kodak-portra-warm.webp',
  colorFujifilmEterna: '/assets/visual-library/color/fujifilm-eterna-soft.webp',
  colorBleachBypass: '/assets/visual-library/color/bleach-bypass-grit.webp',
  colorDuotone: '/assets/visual-library/color/duotone-editorial.webp',
  colorJsonTransfer: '/assets/visual-library/color/json-style-transfer.webp',

  // Publicidad y Dirección de Arte
  adSplash: '/assets/visual-library/advertising/commercial-splash.webp',
  adFloating: '/assets/visual-library/advertising/floating-product.webp',
  adBeauty: '/assets/visual-library/advertising/beauty-campaign.webp',
  adLuxury: '/assets/visual-library/advertising/luxury-product.webp',
  adBillboard: '/assets/visual-library/advertising/urban-billboard.webp',

  // Cinematografía y Video
  videoDroneFpv: '/assets/visual-library/cinema-video/drone-fpv-aerial.webp',
  videoStudio: '/assets/visual-library/cinema-video/cinematic-studio.webp',
  videoGalleryTour: '/assets/visual-library/cinema-video/artwork-gallery-tour.webp',
  videoInfiniteLoop: '/assets/visual-library/cinema-video/infinite-loop-motion.webp',

  // VFX y Animación
  vfxFluidSmoke: '/assets/visual-library/vfx-animation/fluid-smoke-vfx.webp',
  vfxProjectionMapping: '/assets/visual-library/vfx-animation/projection-mapping.webp',
  animStopMotion: '/assets/visual-library/vfx-animation/stop-motion-diorama.webp',
  anim3dSculpture: '/assets/visual-library/vfx-animation/sculpture-3d-pbr.webp',
  animGenerativeParticles: '/assets/visual-library/vfx-animation/generative-particles.webp',

  // Storyboard, Personajes, Worldbuilding y Sonido
  storySheet: '/assets/visual-library/storyboard-worldbuilding/storyboard-sheet.webp',
  storyCharacterSheet: '/assets/visual-library/storyboard-worldbuilding/character-turnaround.webp',
  storyWorldbuildingCity: '/assets/visual-library/storyboard-worldbuilding/worldbuilding-city.webp',
  storySoundFoley: '/assets/visual-library/storyboard-worldbuilding/sound-foley-studio.webp',
} as const;

export const VISUAL_ASSET_REGISTRY: VisualAssetRecord[] = [
  {
    id: 'lighting-butterfly-001',
    title: 'Iluminación Butterfly (Paramount)',
    category: 'Iluminación',
    subcategory: 'Reto: Una persona, cuatro luces',
    image: VISUAL_LIBRARY_PATHS.lightButterfly,
    aspectRatio: '3:4',
    objectPosition: 'top',
    description:
      'Luz principal frontal elevada justo sobre el eje del lente, dibujando una pequeña sombra simétrica en forma de mariposa bajo la nariz.',
    technicalExplanation:
      'Esquema clásico de belleza y editorial: realza pómulos, suaviza la textura frontal y exige un reflector inferior discreto para controlar la sombra bajo el mentón.',
    applicationExample: 'Portadas de revista, retrato editorial luminoso y campañas cosméticas.',
    prompt:
      'Studio portrait with overhead frontal Butterfly lighting and subtle silver bounce fill below the chin, symmetrical nose shadow, authentic skin texture, 85mm f/2.8.',
    alt: 'Retrato de estudio con iluminación Butterfly frontal elevada mostrando sombra simétrica bajo la nariz sobre fondo carbón neutro',
    tags: ['butterfly', 'paramount', 'iluminación', 'estudio', 'cuatro luces'],
    source: 'Núcleo Colectivo · Serie Controlada 01',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lighting-rembrandt-002', 'lighting-split-003', 'lighting-rim-004'],
  },
  {
    id: 'lighting-rembrandt-002',
    title: 'Iluminación Rembrandt (45°)',
    category: 'Iluminación',
    subcategory: 'Reto: Una persona, cuatro luces',
    image: VISUAL_LIBRARY_PATHS.lightRembrandt,
    aspectRatio: '3:4',
    objectPosition: 'top',
    description:
      'Luz principal a 45° laterales y ligeramente elevada formando el icónico triángulo luminoso sobre la mejilla del lado en sombra.',
    technicalExplanation:
      'Equilibra tridimensionalidad escultórica y profundidad psicológica sin apagar el ojo del lado oscuro.',
    applicationExample: 'Retrato autoral, entrevistas documentales y cine dramático.',
    prompt:
      'Studio portrait with classic 45-degree Rembrandt lighting, crisp illuminated triangle under the shadow-side eye, deep matte dark gray backdrop, 85mm f/2.8.',
    alt: 'Retrato de estudio del mismo modelo con iluminación Rembrandt a 45 grados formando un triángulo de luz en la mejilla derecha',
    tags: ['rembrandt', 'claroscuro', '45 grados', 'retrato', 'cuatro luces'],
    source: 'Núcleo Colectivo · Serie Controlada 01',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lighting-butterfly-001', 'lighting-split-003', 'lighting-rim-004'],
  },
  {
    id: 'lighting-split-003',
    title: 'Split Lighting (90° Lateral)',
    category: 'Iluminación',
    subcategory: 'Reto: Una persona, cuatro luces',
    image: VISUAL_LIBRARY_PATHS.lightSplit,
    aspectRatio: '3:4',
    objectPosition: 'top',
    description:
      'Fuente dura ubicada exactamente a 90° laterales del rostro: mitad derecha iluminada, mitad izquierda en sombra profunda.',
    technicalExplanation:
      'Elimina casi por completo el relleno frontal, maximizando textura de piel, misterio y tensión narrativa.',
    applicationExample: 'Cine Neo Noir, retratos teatrales y narrativa de dualidad psicológica.',
    prompt:
      'Dramatic studio portrait with 90-degree Split lighting: half of the face illuminated crisply while the opposite half falls into deep velvet shadow, 85mm f/2.8.',
    alt: 'Retrato con iluminación Split a 90 grados dividiendo el rostro exactamente en una mitad iluminada y otra en sombra profunda',
    tags: ['split', '90 grados', 'noir', 'contraste', 'cuatro luces'],
    source: 'Núcleo Colectivo · Serie Controlada 01',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lighting-rembrandt-002', 'lighting-rim-004', 'lighting-butterfly-001'],
  },
  {
    id: 'lighting-rim-004',
    title: 'Rim Light (Contraluz de Borde)',
    category: 'Iluminación',
    subcategory: 'Reto: Una persona, cuatro luces',
    image: VISUAL_LIBRARY_PATHS.lightRim,
    aspectRatio: '3:4',
    objectPosition: 'top',
    description:
      'Luz trasera angulada que traza un filo luminoso nítido alrededor de hombros, mandíbula y cabello frente a penumbra controlada.',
    technicalExplanation:
      'Separa la silueta del fondo oscuro sin aplastar el misterio del rostro; clave para retratos nocturnos y producto.',
    applicationExample: 'Cine contemplativo, carteles de música y retrato escultórico.',
    prompt:
      'Moody studio portrait dominated by crisp rear Rim Lighting outlining hair, jawline and shoulder contour against a dark backdrop, minimal front fill, 85mm f/2.8.',
    alt: 'Retrato del mismo modelo iluminado por luz de contorno trasera dibujando un halo luminoso sobre cabello, mejilla y hombros',
    tags: ['rim light', 'contraluz', 'silueta', 'halo', 'cuatro luces'],
    source: 'Núcleo Colectivo · Serie Controlada 01',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lighting-split-003', 'lighting-rembrandt-002', 'lighting-highkey-005'],
  },
  {
    id: 'lighting-highkey-005',
    title: 'High Key Editorial Luminoso',
    category: 'Iluminación',
    subcategory: 'Esquemas de estudio',
    image: VISUAL_LIBRARY_PATHS.lightHighKey,
    aspectRatio: '3:4',
    objectPosition: 'top',
    description:
      'Iluminación envolvente de baja relación de contraste donde las sombras casi desaparecen sobre fondo luminoso.',
    technicalExplanation:
      'Se logra con luz principal difusa amplia + relleno alto y fondo blanco sobreexpuesto un paso respecto al rostro.',
    applicationExample: 'Moda comercial limpia, cosmética, retratos institucionales frescos.',
    prompt:
      'High-key clean editorial portrait against a luminous soft white backdrop, wraparound diffused studio lighting with minimal shadows and natural skin texture.',
    alt: 'Retrato editorial High Key con iluminación envolvente luminosa sobre fondo blanco suave sin sombras duras',
    tags: ['high key', 'editorial', 'luminoso', 'blanco', 'belleza'],
    source: 'Núcleo Colectivo · Estudio Visual',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lighting-butterfly-001', 'ad-beauty-003'],
  },
  {
    id: 'lens-14mm-001',
    title: 'Ultra Gran Angular 14mm',
    category: 'Cámaras y Lentes',
    subcategory: 'Distancias focales',
    image: VISUAL_LIBRARY_PATHS.focal14mm,
    aspectRatio: '3:2',
    description:
      'Campo de visión cercano a 114° que exagera la convergencia arquitectónica e integra techo, suelo y profundidad extrema.',
    technicalExplanation:
      'Ideal para mostrar monumentalidad interior manteniendo líneas rectilíneas cuando se nivela el eje óptico.',
    applicationExample: 'Arquitectura museográfica, interiores monumentales y escenarios inmersivos.',
    prompt:
      'Immersive architectural interior photographed on a 14mm ultra-wide rectilinear lens, dramatic foreground-to-ceiling depth and converging concrete geometry.',
    alt: 'Interior museográfico de concreto visto capturado con lente ultra gran angular de 14mm mostrando amplitud espacial extrema',
    tags: ['14mm', 'ultra gran angular', 'arquitectura', 'lente'],
    source: 'Núcleo Colectivo · Óptica',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lens-24mm-002', 'comp-lowangle-002'],
  },
  {
    id: 'lens-24mm-002',
    title: '24mm Gran Angular Contextual (Taller)',
    category: 'Cámaras y Lentes',
    subcategory: 'Serie controlada de distancia focal',
    image: VISUAL_LIBRARY_PATHS.focal24mm,
    aspectRatio: '3:2',
    objectPosition: 'top',
    description:
      'Misma escena y protagonista en taller de cerámica capturada con 24mm f/5.6: el entorno, estantes y herramientas protagonizan junto al sujeto.',
    technicalExplanation:
      'Distancia focal narrativa de contexto: muestra con claridad qué hace la persona y en qué territorio o taller habita.',
    applicationExample: 'Documental ambiental, reportaje de oficios y planos generales narrativos.',
    prompt:
      'Environmental portrait in a sunlit ceramic workshop shot on 24mm wide-angle lens at f/5.6, potter at wheel surrounded by full shelves and tools in crisp depth.',
    alt: 'Ceramista en torno fotografiado con lente gran angular de 24mm mostrando ampliamente todo el taller, estanterías y luz de ventana',
    tags: ['24mm', 'gran angular', 'ambiental', 'taller', 'cerámica'],
    source: 'Núcleo Colectivo · Serie Focal Controlada',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lens-50mm-003', 'lens-85mm-004', 'lens-135mm-005'],
  },
  {
    id: 'lens-50mm-003',
    title: '50mm Perspectiva Natural (Taller)',
    category: 'Cámaras y Lentes',
    subcategory: 'Serie controlada de distancia focal',
    image: VISUAL_LIBRARY_PATHS.focal50mm,
    aspectRatio: '3:2',
    objectPosition: 'top',
    description:
      'Encuadre medio en el mismo taller de cerámica con lente estándar 50mm f/2.8: proporciones humanas naturales sin distorsión.',
    technicalExplanation:
      'Equilibra gesto facial y acción de las manos con desenfoque progresivo agradable en los estantes traseros.',
    applicationExample: 'Retrato de medio cuerpo, gastronomía, editorial realista.',
    prompt:
      'Medium portrait of potter in workshop shot on 50mm prime lens at f/2.8, natural human-eye perspective balancing hands on clay wheel and soft workshop background.',
    alt: 'Mismo ceramista fotografiado con lente normal de 50mm en plano medio con perspectiva natural y ligero desenfoque del taller',
    tags: ['50mm', 'estándar', 'normal', 'taller', 'natural'],
    source: 'Núcleo Colectivo · Serie Focal Controlada',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lens-24mm-002', 'lens-85mm-004'],
  },
  {
    id: 'lens-85mm-004',
    title: '85mm Retrato y Bokeh Cremoso (Taller)',
    category: 'Cámaras y Lentes',
    subcategory: 'Serie controlada de distancia focal',
    image: VISUAL_LIBRARY_PATHS.focal85mm,
    aspectRatio: '3:2',
    objectPosition: 'top',
    description:
      'El mismo sujeto y lugar con teleobjetivo corto 85mm f/1.8: rostro estilizado, mirada nítida y estantes convertidos en bokeh cálido.',
    technicalExplanation:
      'Reduce el ángulo visual para aislar emoción e identidad, comprimiendo suavemente el espacio posterior.',
    applicationExample: 'Retrato editorial, cine íntimo y entrevistas de estudio.',
    prompt:
      'Close-up portrait of potter in sunlit workshop shot on 85mm f/1.8 prime lens, flattering facial compression and creamy background bokeh dissolving pottery shelves.',
    alt: 'Primer plano del mismo ceramista capturado con lente 85mm a f/1.8 aislando el rostro con bokeh cremoso en el fondo',
    tags: ['85mm', 'teleobjetivo', 'bokeh', 'retrato', 'f/1.8'],
    source: 'Núcleo Colectivo · Serie Focal Controlada',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lens-24mm-002', 'lens-50mm-003', 'lens-135mm-005'],
  },
  {
    id: 'lens-135mm-005',
    title: '135mm Compresión Teleobjetivo (Taller)',
    category: 'Cámaras y Lentes',
    subcategory: 'Serie controlada de distancia focal',
    image: VISUAL_LIBRARY_PATHS.focal135mm,
    aspectRatio: '3:2',
    objectPosition: 'top',
    description:
      'Compresión óptica intensa a 135mm f/2.0: el fondo parece acercarse tras el rostro mientras se funde en manchas pictóricas suaves.',
    technicalExplanation:
      'Distancia favorita cuando se desea intimidad emocional absoluta desde lejos sin distraer con el entorno.',
    applicationExample: 'Cine contemplativo, moda exterior y retratos de escenario.',
    prompt:
      'Tight portrait of potter shot on 135mm f/2.0 telephoto lens, strong optical compression bringing warm out-of-focus studio shelves right behind the sharp eyes.',
    alt: 'Primerísimo plano del ceramista con lente teleobjetivo 135mm mostrando máxima compresión espacial y desenfoque pictórico',
    tags: ['135mm', 'compresión', 'teleobjetivo', 'bokeh', 'retrato'],
    source: 'Núcleo Colectivo · Serie Focal Controlada',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lens-85mm-004', 'lens-24mm-002'],
  },
  {
    id: 'lens-100mm-macro-006',
    title: '100mm Macro 1:1 (Microtexturas)',
    category: 'Cámaras y Lentes',
    subcategory: 'Ópticas especiales',
    image: VISUAL_LIBRARY_PATHS.focal100mmMacro,
    aspectRatio: '3:2',
    description:
      'Aproximación microscópica revelando rocío, nervaduras vegetales y relieve superficial con profundidad de campo de milímetros.',
    technicalExplanation:
      'Los lentes macro corrigen la curvatura de campo para mantener nitidez plana sobre detalles minúsculos.',
    applicationExample: 'Botánica científica, joyería, relojería y gastronomía sensorial.',
    prompt:
      'Extreme 100mm macro 1:1 close-up of crystalline morning dewdrops resting on moss and lichen bark under soft raking morning light.',
    alt: 'Fotografía macro 100mm mostrando gotas microscópicas de rocío sobre musgo iluminadas por luz rasante',
    tags: ['100mm macro', 'macro', 'textura', 'rocío', 'botánica'],
    source: 'Núcleo Colectivo · Óptica',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['photo-botanical-006', 'ad-splash-001'],
  },
  {
    id: 'cam-rangefinder-007',
    title: 'Cámara Telemétrica 35mm Analógica',
    category: 'Cámaras y Lentes',
    subcategory: 'Sistemas de cámara',
    image: VISUAL_LIBRARY_PATHS.camRangefinder,
    aspectRatio: '3:2',
    description:
      'Estética clásica de cámara mecánica de 35mm asociada a microcontraste sobrio, reportaje callejero y honestidad documental.',
    technicalExplanation:
      'Citar una cámara telemétrica clásica en prompts aporta cadencia orgánica sin sobresaturación HDR.',
    applicationExample: 'Fotografía de calle, memoria cultural y fotolibros documentales.',
    prompt:
      'Detailed close-up of a classic 35mm brass-and-leather rangefinder camera resting on oak workshop table beside contact sheets under warm window daylight.',
    alt: 'Cámara telemétrica analógica de 35mm con cuerpo metálico y cuero sobre mesa de madera junto a hojas de contacto',
    tags: ['leica', 'telémetro', '35mm', 'analógica', 'cámara'],
    source: 'Núcleo Colectivo · Equipamiento',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['photo-street-003', 'color-portra-002'],
  },
  {
    id: 'cam-cinema-rig-008',
    title: 'Rig de Cámara Cinematográfica Digital',
    category: 'Cámaras y Lentes',
    subcategory: 'Sistemas de cámara',
    image: VISUAL_LIBRARY_PATHS.camCinemaRig,
    aspectRatio: '16:9',
    description:
      'Configuración profesional de rodaje con matte box, lentes prime de cine, follow focus y rieles dolly.',
    technicalExplanation:
      'Contextualiza cómo el cine digital combina latitud tonal (16–17 pasos) con óptica anamórfica o esférica calibrada.',
    applicationExample: 'Video Lab, preproducción cinematográfica y dirección de fotografía.',
    prompt:
      'Behind-the-scenes cinema camera rig mounted on dolly track inside moody film studio with matte box, prime cinema lens and volumetric tungsten backlight.',
    alt: 'Cámara de cine digital montada sobre rieles dolly con matte box y lente prime cinematográfico en set iluminado con neblina',
    tags: ['arri', 'cine', 'dolly', 'rig', 'producción'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['video-drone-001', 'story-sheet-001'],
  },
  {
    id: 'photo-fashion-001',
    title: 'Editorial de Moda Arquitectónica',
    category: 'Fotografía y Retrato',
    subcategory: 'Moda y editorial',
    image: VISUAL_LIBRARY_PATHS.photoFashion,
    aspectRatio: '3:4',
    objectPosition: 'top',
    description:
      'Caída escultural de lino crudo frente a luz solar oblicua sobre arquitectura brutalista de concreto.',
    technicalExplanation:
      'Describe tejido real, postura corporal y dirección dura del sol de tarde para evitar rostros y ropas plásticas.',
    applicationExample: 'Editoriales de moda sostenible, revistas culturales y lookbooks.',
    prompt:
      'High-fashion architectural editorial portrait of model in structured raw linen coat standing against warm brutalist concrete wall with sharp diagonal afternoon shadows, 50mm.',
    alt: 'Editorial de moda en arquitectura brutalista de concreto con abrigo de lino estructurado y sombras diagonales de tarde',
    tags: ['moda', 'editorial', 'lino', 'brutalismo', 'retrato'],
    source: 'Núcleo Colectivo · Fotografía',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['photo-arch-002', 'lighting-butterfly-001'],
  },
  {
    id: 'photo-arch-002',
    title: 'Arquitectura Contemporánea y Luz Oblicua',
    category: 'Fotografía y Retrato',
    subcategory: 'Arquitectura e interiores',
    image: VISUAL_LIBRARY_PATHS.photoArchitecture,
    aspectRatio: '3:2',
    description:
      'Verticales perfectamente rectas sobre concreto visto y madera cálida bañados por sol geométrico de media tarde.',
    technicalExplanation:
      'Nombrar la corrección tilt-shift y la hora solar concreta transforma edificios comunes en escultura espacial.',
    applicationExample: 'ArchViz, museografía, centros culturales y arquitectura bioclimática.',
    prompt:
      'Architectural photography of contemporary concrete and warm cedar timber pavilion courtyard, straight tilt-shift verticals, crisp oblique afternoon sunlight shadows.',
    alt: 'Pabellón cultural contemporáneo de concreto y madera cálida con sombras geométricas oblicuas y líneas verticales rectas',
    tags: ['arquitectura', 'tilt-shift', 'concreto', 'verticales', 'luz solar'],
    source: 'Núcleo Colectivo · Arquitectura',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lens-14mm-001', 'comp-leading-006'],
  },
  {
    id: 'photo-street-003',
    title: 'Street Photography Latinoamericano 35mm',
    category: 'Fotografía y Retrato',
    subcategory: 'Documental y calle',
    image: VISUAL_LIBRARY_PATHS.photoDocumentaryStreet,
    aspectRatio: '3:2',
    description:
      'Captura espontánea sin poses de vida barrial cotidiana entre fachadas de ladrillo y luz rasante de mañana.',
    technicalExplanation:
      'Trabaja con lente 35mm y luz disponible para conservar dignidad territorial y movimiento orgánico.',
    applicationExample: 'Documental comunitario, archivo urbano y crónicas visuales.',
    prompt:
      'Candid 35mm street documentary photograph of vibrant Latin American hillside street at early morning, warm sunbeam crossing brick facades and neighbors chatting.',
    alt: 'Escena documental urbana en calle empinada latinoamericana con fachadas de ladrillo y vecinos iluminados por sol de mañana',
    tags: ['street', 'documental', '35mm', 'territorio', 'barrio'],
    source: 'Núcleo Colectivo · Territorio',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['cam-rangefinder-007', 'color-portra-002'],
  },
  {
    id: 'comp-ews-001',
    title: 'Gran Plano General (Extreme Wide Shot)',
    category: 'Composición y Planos',
    subcategory: 'Escala de planos',
    image: VISUAL_LIBRARY_PATHS.compExtremeWide,
    aspectRatio: '16:9',
    description:
      'El paisaje andino envuelto en bruma domina el 95% del cuadro situando la diminuta figura humana frente a la escala territorial.',
    technicalExplanation:
      'Establece geografía, clima y soledad o pertenencia antes de pasar a planos medios o primeros planos.',
    applicationExample: 'Planos de apertura en cine, documentales territoriales y worldbuilding.',
    prompt:
      'Extreme Wide Shot (EWS) of vast misty Andean mountain valley at dawn with a solitary tiny traveler standing on a stone ridge, deep atmospheric layers, 24mm.',
    alt: 'Gran plano general panorámico de cordillera andina con neblina donde una figura diminuta observa el valle al alba',
    tags: ['EWS', 'gran plano general', 'paisaje', 'escala', 'plano'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['comp-lowangle-002', 'story-worldbuilding-003'],
  },
  {
    id: 'comp-lowangle-002',
    title: 'Ángulo Contrapicado (Low Angle)',
    category: 'Composición y Planos',
    subcategory: 'Ángulos de cámara',
    image: VISUAL_LIBRARY_PATHS.compLowAngle,
    aspectRatio: '3:2',
    objectPosition: 'top',
    description:
      'Cámara ubicada por debajo del horizonte mirando hacia arriba para dotar al sujeto de presencia heroica o monumental.',
    technicalExplanation:
      'Alarga las líneas verticales y recorta la figura contra el cielo crepuscular ampliando su peso visual.',
    applicationExample: 'Retratos escénicos, danza, deportes y arquitectura monumental.',
    prompt:
      'Dramatic Low Angle shot looking up at a contemporary dancer silhouetted on a concrete terrace against amber twilight clouds, monumental perspective.',
    alt: 'Ángulo contrapicado mirando hacia arriba a un bailarín sobre terraza de concreto frente a nubes de atardecer',
    tags: ['low angle', 'contrapicado', 'monumental', 'ángulo'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['comp-birdeye-003', 'comp-dutch-005'],
  },
  {
    id: 'comp-birdeye-003',
    title: 'Cenital / Overhead Flat-Lay (90°)',
    category: 'Composición y Planos',
    subcategory: 'Ángulos de cámara',
    image: VISUAL_LIBRARY_PATHS.compBirdsEye,
    aspectRatio: '1:1',
    description:
      'Cámara perpendicular a 90° apuntando hacia abajo: convierte la mesa de taller en un mapa gráfico equilibrado.',
    technicalExplanation:
      'Anula la profundidad vertical para organizar objetos, pigmentos, bocetos y manos como retícula editorial.',
    applicationExample: 'Gastronomía, diseño gráfico, procesos artesanales y storytelling de escritorio.',
    prompt:
      'Perpendicular 90-degree overhead bird’s-eye flat-lay of an illustrator wooden workbench with open ink sketchbook, mineral pigments and brushes under soft diffused daylight.',
    alt: 'Vista cenital perpendicular a 90 grados de una mesa de ilustrador con cuadernos, pinceles y pigmentos ordenados',
    tags: ['cenital', 'overhead', 'flat-lay', 'bird eye', 'diseño'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['art-botanical-007', 'story-sheet-001'],
  },
  {
    id: 'comp-ots-004',
    title: 'Over-the-Shoulder (OTS · Escorzo)',
    category: 'Composición y Planos',
    subcategory: 'Encuadre narrativo',
    image: VISUAL_LIBRARY_PATHS.compOverShoulder,
    aspectRatio: '16:9',
    objectPosition: 'top',
    description:
      'Encuadre sobre el hombro desenfocado de un interlocutor mirando hacia quien escucha en segundo plano.',
    technicalExplanation:
      'Construye vínculo espacial en diálogos cinematográficos manteniendo orientación y profundidad de capas.',
    applicationExample: 'Escenas de diálogo en cine, documentales conversacionales y storyboard.',
    prompt:
      'Cinematic Over-the-Shoulder (OTS) 16:9 frame inside a warm dimly lit café, soft out-of-focus foreground shoulder framing the focused listener across the wooden table.',
    alt: 'Plano cinematográfico por encima del hombro desenfocado en primer plano mirando a la persona que escucha al otro lado de la mesa',
    tags: ['OTS', 'over the shoulder', 'escorzo', 'diálogo', 'cine'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['comp-dutch-005', 'story-sheet-001'],
  },
  {
    id: 'comp-dutch-005',
    title: 'Plano Holandés (Dutch Angle)',
    category: 'Composición y Planos',
    subcategory: 'Ángulos de cámara',
    image: VISUAL_LIBRARY_PATHS.compDutchAngle,
    aspectRatio: '16:9',
    description:
      'Horizonte inclinado deliberadamente entre 15° y 25° para generar tensión psicológica, vértigo o desequilibrio.',
    technicalExplanation:
      'Debe usarse con intención narrativa clara en momentos de duda, thriller o desorientación espacial.',
    applicationExample: 'Suspenso, cine psicológico, videoclips experimentales.',
    prompt:
      'Cinematic Dutch Angle tilted 18 degrees inside a wet nocturnal brutalist corridor with dramatic diagonal sodium reflections and tension.',
    alt: 'Pasillo nocturno con horizonte inclinado en ángulo holandés creando tensión y diagonales marcadas',
    tags: ['dutch angle', 'holandés', 'inclinado', 'tensión'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['comp-ots-004', 'color-bleach-004'],
  },
  {
    id: 'comp-leading-006',
    title: 'Líneas Guía y Marco Natural',
    category: 'Composición y Planos',
    subcategory: 'Reglas de composición',
    image: VISUAL_LIBRARY_PATHS.compLeadingLines,
    aspectRatio: '3:2',
    description:
      'Columnata de ladrillo y arcos repetidos conducen la mirada directamente hacia la figura iluminada al fondo.',
    technicalExplanation:
      'Combina líneas convergentes + encuadre dentro del encuadre para multiplicar profundidad en imagen bidimensional.',
    applicationExample: 'Arquitectura patrimonial, retratos ambientales y planos secuencia.',
    prompt:
      'Architectural leading lines composition looking down a repeating brick colonnade archway toward a small sunlit figure at the vanishing point.',
    alt: 'Galería de arcos de ladrillo en perspectiva conduciendo la vista hacia una figura bañada por luz cálida al final',
    tags: ['líneas guía', 'perspectiva', 'encuadre', 'arquitectura'],
    source: 'Núcleo Colectivo · Composición',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['photo-arch-002', 'comp-ews-001'],
  },
  {
    id: 'color-teal-001',
    title: 'Etalonaje Teal & Orange',
    category: 'Color y Estética',
    subcategory: 'Paletas cinematográficas',
    image: VISUAL_LIBRARY_PATHS.colorTealOrange,
    aspectRatio: '16:9',
    description:
      'Separación complementaria entre piel y luces cálidas ámbar frente a sombras nocturnas verde-azuladas (teal).',
    technicalExplanation:
      'Mantiene saturación contenida en el rango cálido de piel mientras enfría reflejos y atmósfera exterior.',
    applicationExample: 'Cine contemporáneo nocturno, videoclips y retratos cinematográficos.',
    prompt:
      'Cinematic 16:9 still inside evening tram with restrained Teal and Orange color grade: warm tungsten facial skin tones against cool petrol-teal rain outside.',
    alt: 'Fotograma nocturno en tranvía con etalonaje Teal & Orange separando luz cálida interior de reflejos azul petróleo',
    tags: ['teal and orange', 'etalonaje', 'color', 'cine'],
    source: 'Núcleo Colectivo · Color',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['color-portra-002', 'color-eterna-003'],
  },
  {
    id: 'color-portra-002',
    title: 'Inspiración Kodak Portra Cálida',
    category: 'Color y Estética',
    subcategory: 'Referencias fílmicas',
    image: VISUAL_LIBRARY_PATHS.colorKodakPortra,
    aspectRatio: '3:2',
    objectPosition: 'top',
    description:
      'Tonos de piel orgánicos, altas luces cremosas de atardecer y sombras suaves con grano fino analógico.',
    technicalExplanation:
      'Funciona como referencia estética de calidez documental sin contrastes digitales duros ni saturación artificial.',
    applicationExample: 'Fotografía documental, retratos al aire libre y archivos afectivos.',
    prompt:
      'Warm sunlit outdoor afternoon scene aesthetically inspired by Kodak Portra 400 film: creamy highlights, natural golden skin rendition and subtle fine analog grain.',
    alt: 'Escena cálida de tarde en terraza de madera con tonos cremosos inspirados en Kodak Portra',
    tags: ['kodak portra', 'analógico', 'cálido', 'documental'],
    source: 'Núcleo Colectivo · Color',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['photo-street-003', 'color-eterna-003'],
  },
  {
    id: 'color-eterna-003',
    title: 'Inspiración Fujifilm Eterna (Suave)',
    category: 'Color y Estética',
    subcategory: 'Referencias fílmicas',
    image: VISUAL_LIBRARY_PATHS.colorFujifilmEterna,
    aspectRatio: '16:9',
    description:
      'Baja saturación elegante, verdes bosque contenidos y amplia latitud en bruma y sombras suaves de cine.',
    technicalExplanation:
      'Ideal para narrativas contemplativas donde no se desea dramatismo estridente sino verdad atmosférica.',
    applicationExample: 'Cine independiente, paisajes nublados y ensayos audiovisuales.',
    prompt:
      'Contemplative misty pine road cinema frame aesthetically inspired by Fujifilm Eterna stock: desaturated sage greens, gentle shadow roll-off and quiet atmosphere.',
    alt: 'Camino en bosque brumoso con paleta contenida de verdes apagados y negros suaves inspirada en Fujifilm Eterna',
    tags: ['fujifilm eterna', 'desaturado', 'bruma', 'contemplativo'],
    source: 'Núcleo Colectivo · Color',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['color-teal-001', 'color-bleach-004'],
  },
  {
    id: 'color-bleach-004',
    title: 'Bleach Bypass (Plata Retenida)',
    category: 'Color y Estética',
    subcategory: 'Procesos fílmicos',
    image: VISUAL_LIBRARY_PATHS.colorBleachBypass,
    aspectRatio: '16:9',
    description:
      'Contraste metálico marcado, desaturación casi monocroma y textura granular densa evocando revelado sin blanqueo.',
    technicalExplanation:
      'Endurece medios tonos y brillos de acero/asfalto para relatos bélicos, industriales o distópicos.',
    applicationExample: 'Thriller industrial, ciencia ficción cruda y drama histórico.',
    prompt:
      'Industrial harbor scene graded with Bleach Bypass aesthetic: high-contrast metallic silver highlights, crushed deep shadows and severely muted steel tones.',
    alt: 'Muelle industrial bajo cielo plomizo con estética Bleach Bypass de alto contraste metálico y baja saturación',
    tags: ['bleach bypass', 'alto contraste', 'metálico', 'cine'],
    source: 'Núcleo Colectivo · Color',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['comp-dutch-005', 'color-duotone-005'],
  },
  {
    id: 'color-duotone-005',
    title: 'Duotono Editorial Gráfico',
    category: 'Color y Estética',
    subcategory: 'Diseño cromático',
    image: VISUAL_LIBRARY_PATHS.colorDuotone,
    aspectRatio: '3:4',
    objectPosition: 'top',
    description:
      'Reducción expresiva a dos tintas dominantes (azul cobalto profundo y bermellón cálido) para impacto gráfico instantáneo.',
    technicalExplanation:
      'Unifica fotografías heterogéneas bajo una identidad visual coherente para portadas, fanzines y carteles.',
    applicationExample: 'Afiches de festivales, portadas de discos y sistemas editoriales.',
    prompt:
      'Graphic editorial studio portrait rendered in bold cobalt blue and vermilion duotone inks with clean poster contrast and subtle print grain.',
    alt: 'Retrato editorial en duotono cobalto y bermellón de estética gráfica contemporánea',
    tags: ['duotono', 'editorial', 'afiche', 'cobalto', 'bermellón'],
    source: 'Núcleo Colectivo · Diseño y Color',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['ad-beauty-003', 'lighting-highkey-005'],
  },
  {
    id: 'ad-splash-001',
    title: 'Publicidad: Salpicadura Congelada 1/4000s',
    category: 'Publicidad y Dirección de Arte',
    subcategory: 'Bodegón comercial',
    image: VISUAL_LIBRARY_PATHS.adSplash,
    aspectRatio: '3:4',
    description:
      'Frasco escultórico sobre basalto oscuro envuelto por una corona de agua congelada a alta velocidad de obturación.',
    technicalExplanation:
      'Combina obturación rápida simulada (1/4000s), retroiluminación trasera para volver cristalinas las gotas y nitidez f/8.',
    applicationExample: 'Campañas de perfumería, cosmética hidratante y bebidas premium.',
    prompt:
      'Commercial luxury product photograph of amber glass serum bottle on dark basalt with dynamic translucent water crown splash frozen at 1/4000s, studio rim lighting.',
    alt: 'Frasco de vidrio ámbar sobre basalto oscuro con corona de agua cristalina congelada en el aire',
    tags: ['publicidad', 'splash', 'producto', '1/4000s', 'lujo'],
    source: 'Núcleo Colectivo · Dirección de Arte',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['ad-floating-002', 'lens-100mm-macro-006'],
  },
  {
    id: 'ad-floating-002',
    title: 'Publicidad: Bodegón Flotante Minimalista',
    category: 'Publicidad y Dirección de Arte',
    subcategory: 'Bodegón comercial',
    image: VISUAL_LIBRARY_PATHS.adFloating,
    aspectRatio: '3:4',
    description:
      'Objetos suspendidos en gravedad cero entre piedra travertino y ramas botánicas sobre fondo terracota suave.',
    technicalExplanation:
      'Equilibra espacio negativo superior para titulares con sombras direccionales limpias de estudio.',
    applicationExample: 'Lookbooks de cuidado personal, objetos de diseño industrial y e-commerce editorial.',
    prompt:
      'Minimalist floating still-life campaign: matte ceramic vessel suspended beside travertine geometry and botanical sprig on warm sand backdrop, clean copy space.',
    alt: 'Composición publicitaria minimalista de recipiente cerámico mate suspendido entre piedra travertino y rama seca',
    tags: ['bodegón', 'flotante', 'minimalista', 'producto', 'espacio negativo'],
    source: 'Núcleo Colectivo · Dirección de Arte',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['ad-splash-001', 'ad-beauty-003'],
  },
  {
    id: 'ad-beauty-003',
    title: 'Campaña Beauty Macro & Piel Real',
    category: 'Publicidad y Dirección de Arte',
    subcategory: 'Belleza editorial',
    image: VISUAL_LIBRARY_PATHS.adBeauty,
    aspectRatio: '3:4',
    objectPosition: 'top',
    description:
      'Primer plano de belleza con iluminación suave envolvente que respeta poros, pecas y gotas finas de agua sin retoque plástico.',
    technicalExplanation:
      'Evitar palabras genéricas como "flawless skin" y pedir textura cutánea real eleva de inmediato el realismo.',
    applicationExample: 'Skincare honesto, retratos macro editoriales y portadas.',
    prompt:
      'Close-up beauty campaign portrait showcasing authentic natural skin texture, fine pores and subtle water sheen under wraparound softbox studio light, 100mm macro.',
    alt: 'Primer plano editorial de belleza mostrando textura cutánea real con poros y luminosa luz de estudio suave',
    tags: ['beauty', 'piel real', 'macro', 'editorial', 'softbox'],
    source: 'Núcleo Colectivo · Dirección de Arte',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lighting-butterfly-001', 'lighting-highkey-005'],
  },
  {
    id: 'video-drone-001',
    title: 'Vuelo Aéreo FPV & Drone Costero',
    category: 'Cinematografía y Video',
    subcategory: 'Movimientos de cámara',
    image: VISUAL_LIBRARY_PATHS.videoDroneFpv,
    aspectRatio: '16:9',
    description:
      'Plano aéreo amplio rozando acantilados basálticos al atardecer con sensación de desplazamiento continuo hacia el horizonte.',
    technicalExplanation:
      'En video generativo, indicar velocidad suave ("steady controlled drone glide") evita artefactos de rotación rápida.',
    applicationExample: 'Aperturas cinematográficas, documentales territoriales y música.',
    prompt:
      'Smooth aerial drone tracking shot gliding steadily along dramatic coastal basalt cliffs at golden hour over ocean mist, 24fps widescreen cinematography.',
    alt: 'Vista aérea cinematográfica de dron sobre acantilados costeros al atardecer con bruma marina',
    tags: ['drone', 'fpv', 'aéreo', 'movimiento', 'video'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['cam-cinema-rig-008', 'comp-ews-001'],
  },
  {
    id: 'vfx-fluid-001',
    title: 'Simulación VFX de Humo y Luz Láser',
    category: 'Animación y VFX',
    subcategory: 'Partículas y fluidos',
    image: VISUAL_LIBRARY_PATHS.vfxFluidSmoke,
    aspectRatio: '16:9',
    description:
      'Volutas turbulentas de humo denso cortadas por haces luminosos precisos dentro de un espacio de laboratorio oscuro.',
    technicalExplanation:
      'Especificar contraste volumétrico y turbulencia laminar evita el aspecto de niebla digital uniforme.',
    applicationExample: 'Escenografía lumínica, VFX atmosféricos y motion design.',
    prompt:
      'High-speed VFX fluid simulation of dense amber and cyan smoke ribbons pierced by sharp volumetric light beams in a pitch-dark laboratory chamber.',
    alt: 'Simulación VFX de humo denso cortado por haces luminosos precisos en cámara oscura',
    tags: ['VFX', 'humo', 'fluidos', 'volumétrico', 'partículas'],
    source: 'Núcleo Colectivo · VFX & Arte',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['vfx-mapping-002', 'anim-3d-004'],
  },
  {
    id: 'vfx-mapping-002',
    title: 'Projection Mapping en Arquitectura',
    category: 'Animación y VFX',
    subcategory: 'Instalaciones interactivas',
    image: VISUAL_LIBRARY_PATHS.vfxProjectionMapping,
    aspectRatio: '16:9',
    description:
      'Retícula luminosa generativa proyectada exactamente sobre arcos reales de piedra con público en silueta observando.',
    technicalExplanation:
      'Conecta arte generativo con espacio físico y escala humana para prototipar instalaciones antes del montaje.',
    applicationExample: 'Festivales de luz, museografía nocturna y TouchDesigner.',
    prompt:
      'Architectural projection mapping installation on historic stone facade at night: crisp geometric luminous lines hugging arches while visitors watch in silhouette.',
    alt: 'Instalación nocturna de projection mapping con retículas luminosas geométricas sobre fachada histórica de piedra',
    tags: ['projection mapping', 'instalación', 'arte generativo', 'museo'],
    source: 'Núcleo Colectivo · Arte & Tecnología',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['vfx-fluid-001', 'story-worldbuilding-003'],
  },
  {
    id: 'anim-stopmotion-003',
    title: 'Diorama Stop Motion Táctil (12 fps)',
    category: 'Animación y VFX',
    subcategory: 'Animación híbrida',
    image: VISUAL_LIBRARY_PATHS.animStopMotion,
    aspectRatio: '3:2',
    description:
      'Miniatura artesanal en cartón kraft, fieltro y papel recortado iluminada con foco cálido de maqueta.',
    technicalExplanation:
      'Nombrar materiales tangibles (fieltro, alambre, cartón corrugado) y cadencia de 12fps genera calidez artesanal inmediata.',
    applicationExample: 'Cortos educativos, videoclips poéticos y talleres juveniles.',
    prompt:
      'Handcrafted stop-motion animation still of a miniature forest diorama made from layered kraft cardboard, wool felt and warm miniature tungsten spotlights.',
    alt: 'Escena de animación stop motion en diorama artesanal de cartón, papel recortado y fieltro bajo luz cálida de maqueta',
    tags: ['stop motion', 'diorama', '12fps', 'cartón', 'animación'],
    source: 'Núcleo Colectivo · Animación',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['anim-3d-004', 'story-sheet-001'],
  },
  {
    id: 'anim-3d-004',
    title: 'Escultura 3D & Shaders PBR Museográficos',
    category: 'Animación y VFX',
    subcategory: 'Modelado y materiales 3D',
    image: VISUAL_LIBRARY_PATHS.anim3dSculpture,
    aspectRatio: '3:2',
    description:
      'Formas orgánicas en cerámica porosa, piedra travertino y latón cepillado iluminadas con iluminación global suave.',
    technicalExplanation:
      'Describir rugosidad superficial (matte roughness) y dispersión subsuperficial da realismo escultórico en Blender/3D.',
    applicationExample: 'Exhibiciones virtuales, motion design y diseño industrial.',
    prompt:
      'Contemporary 3D sculptural still life featuring intertwined porous matte ceramic, travertine stone and brushed brass illuminated by soft museum global illumination.',
    alt: 'Escultura 3D contemporánea de formas orgánicas en cerámica mate, piedra travertino y latón cepillado en sala museográfica',
    tags: ['3D', 'PBR', 'Blender', 'escultura', 'materiales'],
    source: 'Núcleo Colectivo · 3D & Render',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['vfx-mapping-002', 'anim-stopmotion-003'],
  },
  {
    id: 'story-sheet-001',
    title: 'Hoja de Storyboard Secuencial (6 Viñetas)',
    category: 'Storyboard, Personajes y Mundo',
    subcategory: 'Preproducción visual',
    image: VISUAL_LIBRARY_PATHS.storySheet,
    aspectRatio: '16:9',
    description:
      'Planificación previa de secuencia en grafito y tinta aguada mostrando continuidad de escala de planos de GPG a Primer Plano.',
    technicalExplanation:
      'Permite validar ritmo, eje de miradas y transiciones antes de gastar créditos o tiempo generando video.',
    applicationExample: 'Preproducción audiovisual, guion técnico y talleres de narrativa.',
    prompt:
      'Clean 6-panel film storyboard sheet drawn in expressive charcoal and light ink wash showing shot progression from extreme wide establishing frame to close-up.',
    alt: 'Lámina de storyboard cinematográfico de 6 viñetas a tinta y grafito mostrando progresión de planos',
    tags: ['storyboard', 'preproducción', 'viñetas', 'planos', 'guion'],
    source: 'Núcleo Colectivo · Preproducción',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['story-character-002', 'comp-ots-004'],
  },
  {
    id: 'story-character-002',
    title: 'Character Turnaround Sheet (Consistencia)',
    category: 'Storyboard, Personajes y Mundo',
    subcategory: 'Diseño de personajes',
    image: VISUAL_LIBRARY_PATHS.storyCharacterSheet,
    aspectRatio: '16:9',
    objectPosition: 'top',
    description:
      'Lámina de referencia frontal, perfil lateral y tres cuartos manteniendo rasgos, proporciones y vestuario exactos.',
    technicalExplanation:
      'Base indispensable para usar como referencia de personaje (--cref o imagen guía) a lo largo de todo un proyecto.',
    applicationExample: 'Novela gráfica, cortos animados y consistencia de personaje en IA.',
    prompt:
      'Professional character design turnaround sheet showing front, side profile and three-quarter views of the same stylized researcher wearing linen utility jacket, neutral studio light.',
    alt: 'Hoja de diseño de personaje en tres vistas (frontal, lateral y tres cuartos) con proporciones y vestuario consistentes',
    tags: ['character sheet', 'turnaround', 'consistencia', 'personajes'],
    source: 'Núcleo Colectivo · Personajes',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['story-sheet-001', 'story-worldbuilding-003'],
  },
  {
    id: 'story-worldbuilding-003',
    title: 'Worldbuilding: Ecociudad Andina Bioclimática',
    category: 'Storyboard, Personajes y Mundo',
    subcategory: 'Diseño de escenarios',
    image: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
    aspectRatio: '16:9',
    description:
      'Arquitectura especulativa habitable en madera laminada, terrazas verdes y puentes peatonales integrados en ladera nublada.',
    technicalExplanation:
      'Construye mundos creíbles definiendo clima, materiales locales y escala humana en vez de clichés genéricos.',
    applicationExample: 'Diseño especulativo, cine de ciencia ficción habitable y arte conceptual.',
    prompt:
      'Speculative worldbuilding concept art of an Andean bioclimatic hillside city built in cross-laminated timber, terraced gardens and pedestrian bridges bathed in morning mist.',
    alt: 'Ciudad especulativa andina bioclimática en madera laminada con jardines en terrazas y puentes sobre niebla matinal',
    tags: ['worldbuilding', 'arquitectura especulativa', 'solarpunk', 'escenarios'],
    source: 'Núcleo Colectivo · Worldbuilding',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['comp-ews-001', 'photo-arch-002'],
  },
  {
    id: 'story-sound-004',
    title: 'Diseño Sonoro & Mesa de Foley',
    category: 'Storyboard, Personajes y Mundo',
    subcategory: 'Sonido y atmósfera',
    image: VISUAL_LIBRARY_PATHS.storySoundFoley,
    aspectRatio: '16:9',
    description:
      'Estudio de creación acústica táctil con micrófono de cañón, grava, telas y objetos cotidianos para dar cuerpo al cine.',
    technicalExplanation:
      'Recuerda que la mitad de la inmersión audiovisual reside en capas sonoras reales sincronizadas al movimiento.',
    applicationExample: 'Postproducción de cortos, ElevenLabs SFX y paisajes sonoros.',
    prompt:
      'Atmospheric documentary photo of a sound foley studio table with boom microphone, clay bowls, fabric, gravel tray and warm acoustic panels.',
    alt: 'Mesa de diseño sonoro foley en estudio con micrófono de cañón, recipientes, telas y grava bajo luz cálida',
    tags: ['foley', 'sonido', 'audio', 'estudio', 'inmersión'],
    source: 'Núcleo Colectivo · Sonido',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['cam-cinema-rig-008', 'story-sheet-001'],
  },
  {
    id: 'photo-botanical-006',
    title: 'Ilustración Botánica en Tinta y Acuarela',
    category: 'Fotografía y Retrato',
    subcategory: 'Ilustración y arte',
    image: VISUAL_LIBRARY_PATHS.artBotanical,
    aspectRatio: '3:2',
    description:
      'Lámina científica sobre papel de algodón marfil con veladuras translúcidas y estudio detallado de raíces y pétalos.',
    technicalExplanation:
      'Nombrar el soporte físico y la técnica de tinta sepia evita acabados digitales plásticos.',
    applicationExample: 'Herbarios territoriales, educación ambiental y editorial científica.',
    prompt:
      'Scientific botanical watercolor and sepia ink plate of native orchid with root structure on ivory cotton paper, soft overhead natural light.',
    alt: 'Ilustración botánica científica en acuarela y tinta sepia de orquídea sobre papel algodón marfil',
    tags: ['botánica', 'acuarela', 'tinta', 'ilustración', 'científica'],
    source: 'Núcleo Colectivo · Ilustración',
    license: 'CC BY-NC-SA 4.0',
    relatedIds: ['lens-100mm-macro-006', 'comp-birdeye-003'],
  },
];

export const VISUAL_ASSETS_MAP: Record<string, VisualAssetRecord> = Object.fromEntries(
  VISUAL_ASSET_REGISTRY.map((item) => [item.id, item])
);

// Serie controlada 1: "Una persona, cuatro luces" (Reto 01 + Comparador)
export const FOUR_LIGHTS_CHALLENGE_SERIES = [
  {
    id: 'butterfly',
    code: '01 · BUTTERFLY',
    label: 'Butterfly (Frontal Elevada)',
    specs: '0° frontal elevada · Sombra simétrica bajo nariz · Estética Editorial',
    image: VISUAL_LIBRARY_PATHS.lightButterfly,
    alt: 'Retrato controlado del mismo sujeto con esquema Butterfly frontal elevado',
    promptSnippet: 'overhead frontal Butterfly lighting, subtle bounce fill below chin',
  },
  {
    id: 'rembrandt',
    code: '02 · REMBRANDT',
    label: 'Rembrandt (45° Lateral)',
    specs: '45° lateral · Triángulo luminoso en mejilla · Volumen clásico',
    image: VISUAL_LIBRARY_PATHS.lightRembrandt,
    alt: 'Retrato controlado del mismo sujeto con iluminación Rembrandt a 45 grados',
    promptSnippet: '45-degree Rembrandt lighting, crisp illuminated triangle under shadow eye',
  },
  {
    id: 'split',
    code: '03 · SPLIT 90°',
    label: 'Split Lighting (90° Lateral)',
    specs: '90° exactos · Mitad luz / mitad sombra · Tensión dramática',
    image: VISUAL_LIBRARY_PATHS.lightSplit,
    alt: 'Retrato controlado del mismo sujeto con iluminación Split dividida al 50%',
    promptSnippet: '90-degree dramatic Split lighting, half face in deep velvet shadow',
  },
  {
    id: 'rim',
    code: '04 · RIM LIGHT',
    label: 'Rim Light (Contraluz)',
    specs: '150° posterior · Halo de borde en cabello y hombros · Silueta',
    image: VISUAL_LIBRARY_PATHS.lightRim,
    alt: 'Retrato controlado del mismo sujeto con contraluz Rim Light perfilando la silueta',
    promptSnippet: 'crisp rear Rim lighting outlining hair and shoulders against dark backdrop',
  },
] as const;

// Serie controlada 2: "Mismo taller, cuatro distancias focales" (24mm -> 50mm -> 85mm -> 135mm)
export const FOCAL_WORKSHOP_SERIES = [
  {
    id: '24mm',
    code: '24 mm · f/5.6',
    label: '24mm Gran Angular',
    specs: 'Amplio contexto del taller · Profundidad ambiental · Cercanía física',
    image: VISUAL_LIBRARY_PATHS.focal24mm,
    alt: 'Ceramista en taller fotografiado a 24mm mostrando todo el espacio alrededor',
    promptSnippet: '24mm wide-angle lens at f/5.6, full workshop context legible',
  },
  {
    id: '50mm',
    code: '50 mm · f/2.8',
    label: '50mm Estándar',
    specs: 'Perspectiva humana natural · Equilibrio gesto y espacio',
    image: VISUAL_LIBRARY_PATHS.focal50mm,
    alt: 'Mismo ceramista fotografiado a 50mm en plano medio natural',
    promptSnippet: '50mm standard prime lens at f/2.8, honest human perspective',
  },
  {
    id: '85mm',
    code: '85 mm · f/1.8',
    label: '85mm Retrato',
    specs: 'Estilización facial · Separación cremosa · Bokeh agradable',
    image: VISUAL_LIBRARY_PATHS.focal85mm,
    alt: 'Mismo ceramista fotografiado a 85mm f/1.8 con fondo suavemente desenfocado',
    promptSnippet: '85mm portrait prime lens at f/1.8, creamy bokeh background separation',
  },
  {
    id: '135mm',
    code: '135 mm · f/2.0',
    label: '135mm Teleobjetivo',
    specs: 'Compresión intensa del fondo · Máximo aislamiento emocional',
    image: VISUAL_LIBRARY_PATHS.focal135mm,
    alt: 'Mismo ceramista fotografiado a 135mm con fuerte compresión teleobjetivo',
    promptSnippet: '135mm telephoto prime at f/2.0, compressed painterly background blur',
  },
] as const;

export interface ComparatorTopicSet {
  id: string;
  categoryLabel: string;
  title: string;
  subtitle: string;
  lesson: string;
  leftItem: { label: string; specs: string; image: string; alt: string; cssFilter?: string };
  rightItem: { label: string; specs: string; image: string; alt: string; cssFilter?: string };
  gridItems: {
    code: string;
    label: string;
    specs: string;
    image: string;
    alt: string;
    cssFilter?: string;
    objectPosition?: 'center' | 'top';
  }[];
  relatedModule: string;
}

export const COMPARATOR_TOPIC_SETS: ComparatorTopicSet[] = [
  {
    id: 'comp-four-lights',
    categoryLabel: 'Módulo 03 · Iluminación Controlada',
    title: 'Una persona, cuatro esquemas de luz (Butterfly · Rembrandt · Split · Rim)',
    subtitle: 'El mismo protagonista, vestuario y encuadre modificando únicamente la dirección de la fuente luminosa',
    lesson:
      'Cambiar solo el ángulo y dureza de la luz transforma por completo la lectura psicológica del retrato: de limpio y editorial (Butterfly) a dramático y misterioso (Split/Rim).',
    leftItem: {
      label: 'Butterfly Frontal (Editorial)',
      specs: '0° elevada · Sombra simétrica sutil',
      image: VISUAL_LIBRARY_PATHS.lightButterfly,
      alt: 'Retrato Butterfly frontal iluminado suavemente',
    },
    rightItem: {
      label: 'Split Lighting 90° (Dramático)',
      specs: '90° lateral · Mitad en sombra profunda',
      image: VISUAL_LIBRARY_PATHS.lightSplit,
      alt: 'Retrato Split 90 grados del mismo modelo',
    },
    gridItems: FOUR_LIGHTS_CHALLENGE_SERIES.map((item) => ({
      code: item.code,
      label: item.label,
      specs: item.specs,
      image: item.image,
      alt: item.alt,
      objectPosition: 'top',
    })),
    relatedModule: 'Módulo 03 · Reto 01',
  },
  {
    id: 'comp-focal-lengths',
    categoryLabel: 'Módulo 02 · Óptica y Compresión',
    title: 'Misma escena en cuatro distancias focales (24mm · 50mm · 85mm · 135mm)',
    subtitle: 'Cómo evoluciona el contexto del taller y la compresión espacial al subir los milímetros del lente',
    lesson:
      'El 24mm cuenta dónde trabaja la persona y qué herramientas la rodean; el 85mm y el 135mm comprimen los estantes posteriores hasta fundirlos en bokeh pictórico.',
    leftItem: {
      label: '24mm Gran Angular (Contexto)',
      specs: '84° de campo · Taller legible de extremo a extremo',
      image: VISUAL_LIBRARY_PATHS.focal24mm,
      alt: 'Ceramista en taller con lente 24mm mostrando todo el entorno',
    },
    rightItem: {
      label: '135mm Teleobjetivo (Compresión)',
      specs: '18° de campo · Compresión intensa y bokeh cremoso',
      image: VISUAL_LIBRARY_PATHS.focal135mm,
      alt: 'Ceramista en taller con lente 135mm aislando el rostro',
    },
    gridItems: FOCAL_WORKSHOP_SERIES.map((item) => ({
      code: item.code,
      label: item.label,
      specs: item.specs,
      image: item.image,
      alt: item.alt,
      objectPosition: 'top',
    })),
    relatedModule: 'Módulo 02 · Reto 02',
  },
  {
    id: 'comp-color-grades',
    categoryLabel: 'Módulo 04 · Colorimetría y Estéticas',
    title: 'Estéticas Fílmicas y Etalonaje (Portra · Eterna · Teal & Orange · Bleach Bypass)',
    subtitle: 'Cuatro tratamientos cromáticos sobre cine y fotografía documental con intención emocional distinta',
    lesson:
      'Nombrar una referencia cromática precisa (calidez Portra, verdes suaves Eterna, contraste metálico Bleach Bypass) unifica una serie entera sin saturaciones artificiales.',
    leftItem: {
      label: 'Kodak Portra 400 (Cálida)',
      specs: 'Piel orgánica · Altas luces doradas',
      image: VISUAL_LIBRARY_PATHS.colorKodakPortra,
      alt: 'Escena cálida estilo Kodak Portra',
    },
    rightItem: {
      label: 'Bleach Bypass (Plata Retenida)',
      specs: 'Alto contraste metálico · Baja saturación',
      image: VISUAL_LIBRARY_PATHS.colorBleachBypass,
      alt: 'Escena industrial estilo Bleach Bypass',
    },
    gridItems: [
      {
        code: 'PORTRA 400',
        label: 'Cálida Orgánica',
        specs: 'Piel sedosa y sol dorado suave',
        image: VISUAL_LIBRARY_PATHS.colorKodakPortra,
        alt: 'Referencia de color Kodak Portra cálida',
        objectPosition: 'top',
      },
      {
        code: 'FUJI ETERNA',
        label: 'Suave Contemplativa',
        specs: 'Verdes apagados y negros limpios',
        image: VISUAL_LIBRARY_PATHS.colorFujifilmEterna,
        alt: 'Referencia de color Fujifilm Eterna en bosque',
      },
      {
        code: 'TEAL & ORANGE',
        label: 'Contraste Complementario',
        specs: 'Piel ámbar frente a sombra petrol-teal',
        image: VISUAL_LIBRARY_PATHS.colorTealOrange,
        alt: 'Referencia cromática Teal and Orange nocturna',
      },
      {
        code: 'BLEACH BYPASS',
        label: 'Plata Retenida Cruda',
        specs: 'Contraste metálico industrial',
        image: VISUAL_LIBRARY_PATHS.colorBleachBypass,
        alt: 'Referencia Bleach Bypass industrial',
      },
    ],
    relatedModule: 'Módulo 04 · Color',
  },
  {
    id: 'comp-shots-angles',
    categoryLabel: 'Módulo 05 · Planos y Ángulos',
    title: 'Lenguaje de Cámara (EWS · Low Angle · Overhead 90° · Dutch Angle)',
    subtitle: 'Cómo cambia la relación de escala, poder y tensión psicológica según dónde colocas la cámara',
    lesson:
      'Antes de añadir efectos o estilos, la altura y escala del plano (Gran Plano General, Contrapicado, Cenital u Holandés) comunican la intención dramática.',
    leftItem: {
      label: 'Gran Plano General (EWS)',
      specs: 'Territorio dominante · Escala monumental',
      image: VISUAL_LIBRARY_PATHS.compExtremeWide,
      alt: 'Gran plano general de cordillera andina',
    },
    rightItem: {
      label: 'Plano Holandés (Dutch 18°)',
      specs: 'Horizonte inclinado · Tensión narrativa',
      image: VISUAL_LIBRARY_PATHS.compDutchAngle,
      alt: 'Pasillo nocturno en plano holandés inclinado',
    },
    gridItems: [
      {
        code: 'EWS · PAISAJE',
        label: 'Gran Plano General',
        specs: 'Sitúa geografía y escala humana',
        image: VISUAL_LIBRARY_PATHS.compExtremeWide,
        alt: 'Gran plano general andino',
      },
      {
        code: 'LOW ANGLE',
        label: 'Contrapicado Heroico',
        specs: 'Eleva y monumentaliza al sujeto',
        image: VISUAL_LIBRARY_PATHS.compLowAngle,
        alt: 'Ángulo contrapicado de bailarín',
        objectPosition: 'top',
      },
      {
        code: 'OVERHEAD 90°',
        label: 'Cenital / Flat-Lay',
        specs: 'Orden gráfico perpendicular sobre mesa',
        image: VISUAL_LIBRARY_PATHS.compBirdsEye,
        alt: 'Vista cenital perpendicular de mesa de taller',
      },
      {
        code: 'OTS · ESCORZO',
        label: 'Over the Shoulder',
        specs: 'Inmersión relacional en diálogo',
        image: VISUAL_LIBRARY_PATHS.compOverShoulder,
        alt: 'Encuadre por encima del hombro en conversación',
        objectPosition: 'top',
      },
    ],
    relatedModule: 'Módulo 05 · Encuadre',
  },
  {
    id: 'comp-lighting-kelvin',
    categoryLabel: 'Módulo 03 & 04 · Clave y Temperatura',
    title: 'Rembrandt Low Key vs High Key & Temperatura Kelvin (3200K–7200K)',
    subtitle: 'Comparación directa de densidad de sombras y balance térmico',
    lesson:
      'Controlar el balance entre luces cálidas tungsteno (3200K) y atmósfera azulada fría (7200K) evita imágenes neutras sin intención emocional.',
    leftItem: {
      label: '3200K Cálida Tungsteno',
      specs: 'Ámbar íntimo · Atmósfera nocturna acogedora',
      image: VISUAL_LIBRARY_PATHS.compCinematography,
      alt: 'Escena cinematográfica con gradiente cálido 3200K',
      cssFilter: 'sepia(0.36) saturate(1.22) brightness(0.98)',
    },
    rightItem: {
      label: '7200K Fría Crepuscular',
      specs: 'Tonos azulados · Claridad introspectiva',
      image: VISUAL_LIBRARY_PATHS.compCinematography,
      alt: 'Misma escena con balance frío 7200K',
      cssFilter: 'hue-rotate(18deg) saturate(0.88) brightness(0.95) contrast(1.06)',
    },
    gridItems: [
      {
        code: 'REMBRANDT vs HIGH KEY',
        label: 'Clave Baja vs Clave Alta',
        specs: 'Contraste dramático 4:1 vs suavidad luminosa',
        image: VISUAL_LIBRARY_PATHS.lightComparison,
        alt: 'Comparativa Rembrandt Low Key y High Key',
      },
      {
        code: 'JSON STYLE TRANSFER',
        label: 'Preservación de Identidad',
        specs: 'Mismo rostro bajo estética Chiaroscuro JSON',
        image: VISUAL_LIBRARY_PATHS.colorJsonTransfer,
        alt: 'Transferencia de estilo JSON preservando identidad',
      },
      {
        code: 'OPTICAL 35 vs 85',
        label: 'Díptico 35mm vs 85mm',
        specs: 'Entorno urbano vs compresión retrato',
        image: VISUAL_LIBRARY_PATHS.focalComparison,
        alt: 'Comparación óptica 35mm y 85mm',
      },
      {
        code: 'DUOTONO GRÁFICO',
        label: 'Reducción a 2 Tintas',
        specs: 'Cobalto + bermellón editorial',
        image: VISUAL_LIBRARY_PATHS.colorDuotone,
        alt: 'Retrato gráfico en duotono',
        objectPosition: 'top',
      },
    ],
    relatedModule: 'Módulo 04 & 07 · JSON',
  },
  {
    id: 'comp-ads-directions',
    categoryLabel: 'Módulo 01 & 22 · Publicidad y Producto',
    title: 'Direcciones de Arte Comercial (Splash · Floating · Beauty · Luxury)',
    subtitle: 'Cuatro tratamientos de estudio según el objetivo del producto o campaña',
    lesson:
      'La publicidad convincente combina control físico de reflejos, superficies minerales táctiles y espacio limpio para tipografía.',
    leftItem: {
      label: 'Splash 1/4000s (Dinámico)',
      specs: 'Corona de agua congelada · Contraluz cristalino',
      image: VISUAL_LIBRARY_PATHS.adSplash,
      alt: 'Frasco comercial con salpicadura congelada',
    },
    rightItem: {
      label: 'Floating Still Life (Minimal)',
      specs: 'Suspensión geométrica · Espacio negativo',
      image: VISUAL_LIBRARY_PATHS.adFloating,
      alt: 'Bodegón comercial flotante minimalista',
    },
    gridItems: [
      {
        code: 'SPLASH 1/4000s',
        label: 'Dinámica de Fluidos',
        specs: 'Corona líquida y basalto oscuro',
        image: VISUAL_LIBRARY_PATHS.adSplash,
        alt: 'Salpicadura comercial de perfume',
      },
      {
        code: 'FLOATING STILL LIFE',
        label: 'Equilibrio Minimalista',
        specs: 'Travertino, cerámica y botánica',
        image: VISUAL_LIBRARY_PATHS.adFloating,
        alt: 'Bodegón comercial flotante',
      },
      {
        code: 'BEAUTY MACRO',
        label: 'Piel Real Luminosa',
        specs: 'Textura auténtica sin plástico',
        image: VISUAL_LIBRARY_PATHS.adBeauty,
        alt: 'Campaña Beauty macro con piel real',
        objectPosition: 'top',
      },
      {
        code: 'OOH BILLBOARD',
        label: 'Escala Urbana Monumental',
        specs: 'Valla anamórfica nocturna 3D',
        image: VISUAL_LIBRARY_PATHS.adBillboard,
        alt: 'Valla publicitaria 3D urbana nocturna',
      },
    ],
    relatedModule: 'Módulo 01 · Publicidad',
  },
];
