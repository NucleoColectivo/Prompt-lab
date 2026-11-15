export interface CommandItem {
  id: string;
  command: string;
  label: string;
  category: string;
  section: 'photo' | 'video' | 'both';
  family: string;
  description: string;
  effect: string;
  technicalDetails?: string;
  samplePromptEs: string;
  samplePromptEn: string;
  tags: string[];
}

export interface ColorPaletteItem {
  name: string;
  colors: string[];
  hexCodes: string[];
  description: string;
  vibe: string;
}

export interface RecipeItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'photo' | 'video' | 'ads' | 'experimental';
  image?: string;
  commands: string[];
  fullPrompt: string;
  description: string;
  specs: {
    camera: string;
    lens: string;
    lighting: string;
    color: string;
    motion?: string;
    aspectRatio: string;
  };
  context: string;
}

export const COLOR_PALETTES: ColorPaletteItem[] = [
  {
    name: 'Teal & Orange',
    colors: ['Cian Profundo', 'Ámbar Cálido'],
    hexCodes: ['#007F86', '#E88943'],
    description: 'El clásico contraste complementario cinematográfico de Hollywood. Tonos fríos en sombras y calidez orgánica en altas luces y piel.',
    vibe: 'Cinematográfico, Dramático, Taquillero'
  },
  {
    name: 'Cyberpunk',
    colors: ['Cian Eléctrico', 'Magenta Neón'],
    hexCodes: ['#00F0FF', '#FF00A8'],
    description: 'Estética futurista distópica de alta saturación y contraste lumínico nocturno.',
    vibe: 'Sci-Fi, Nocturno, Sintético'
  },
  {
    name: 'Forest',
    colors: ['Verde Musgo Profundo', 'Salvia Claro'],
    hexCodes: ['#173D32', '#79966B'],
    description: 'Atmósfera orgánica botánica y natural, transmite serenidad, profundidad vegetal y autenticidad terrenal.',
    vibe: 'Orgánico, Documental, Místico'
  },
  {
    name: 'Desert & Sand',
    colors: ['Terracota Cálido', 'Arena Dorada'],
    hexCodes: ['#C28E61', '#E6C9A2'],
    description: 'Tonos minerales desérticos inspirados en dunas al atardecer, materiales nobles y calor seco.',
    vibe: 'Mineral, Cálido, Sol Naciente'
  },
  {
    name: 'Nordic Mist',
    colors: ['Hielo Platino', 'Gris Pizarra Nórdico'],
    hexCodes: ['#DDE4E5', '#89999F'],
    description: 'Estética escandinava minimalista de contrastes suaves, luz difusa y sobriedad reflexiva.',
    vibe: 'Minimalista, Sereno, Arquitectónico'
  },
  {
    name: 'Burgundy & Rose',
    colors: ['Borgoña Noble', 'Rosa Ceniza'],
    hexCodes: ['#5A172C', '#B66A76'],
    description: 'Lujo editorial contemporáneo, terciopelo, cosmética premium y sofisticación nocturna.',
    vibe: 'Lujo, Editorial, Íntimo'
  },
  {
    name: 'Midnight Cinema',
    colors: ['Azul Abisal', 'Cobalto Cinematográfico'],
    hexCodes: ['#101B37', '#416A9A'],
    description: 'Profundidad de noche urbana, misterio, lluvia reflectante e iluminación incidental suave.',
    vibe: 'Nocturno, Misterioso, Noir'
  },
  {
    name: 'Monochrome Silver',
    colors: ['Negro Carbón', 'Plata Suave'],
    hexCodes: ['#111111', '#F0F0F0'],
    description: 'Blanco y negro puro con riqueza de tonos medios inspirados en gelatinas de plata y fotografía documental.',
    vibe: 'Clásico, Atemporal, Editorial'
  },
  {
    name: 'Olive & Gold',
    colors: ['Verde Oliva Militar', 'Arena Dorada'],
    hexCodes: ['#626B3F', '#B6AA7D'],
    description: 'Elegancia utilitaria, texturas táctiles de lienzo y lino, estética de expedición o moda sustentable.',
    vibe: 'Táctil, Moda Sostenible, Expedición'
  },
  {
    name: 'Electric Neon',
    colors: ['Azul Cobalto Eléctrico', 'Cian Pura Luz'],
    hexCodes: ['#1835FF', '#00D9FF'],
    description: 'Energía lumínica de alta frecuencia, arte generativo, visuales de concierto y motion graphics.',
    vibe: 'Digital, Generativo, Alta Energía'
  }
];

export const RECIPES: RecipeItem[] = [
  {
    id: 'neo-noir-portrait',
    title: 'Retrato Cinematográfico Neo Noir',
    subtitle: 'Claroscuro moderno con separación cromática teal & orange',
    type: 'photo',
    image: '/images/recipe_neo_noir_portrait_1794436191840.jpg',
    commands: [
      '/cinematicportrait',
      '/neonoir',
      '/fullframe',
      '/85mm',
      '/f1.8',
      '/splitlighting',
      '/lowkey',
      '/tealandorange',
      '/naturaltexture',
      '/shallowdof'
    ],
    fullPrompt: 'Cinematic portrait of an expressive person in a moody urban alley, Shot on Hasselblad X2D with 85mm f/1.8 lens. Dramatic split lighting, high contrast low-key atmosphere with deep shadows and subtle teal and orange rim glow. Visible authentic skin pores, delicate catchlight in the eyes, natural hair detail, film grain texture. No plastic skin, no artificial oversaturation.',
    description: 'Composición de retrato de alto impacto con iluminación lateral que divide el rostro, fondo urbano con luces desenfocadas de bokeh cremoso y atmósfera de thriller moderno.',
    specs: {
      camera: 'Hasselblad X2D / Full Frame',
      lens: '85mm f/1.8 Prime Lens',
      lighting: 'Split Lighting + Subtle Rim Light',
      color: 'Teal & Orange (#007F86 / #E88943)',
      aspectRatio: '4:5 (Vertical Editorial)'
    },
    context: 'Ideal para carteles de cine, campañas de moda contemporánea, portadas editoriales y perfiles de artistas.'
  },
  {
    id: 'luxury-product-showcase',
    title: 'Publicidad de Producto de Lujo',
    subtitle: 'Bodegón comercial premium con control de reflejos y fluidos',
    type: 'ads',
    image: '/images/recipe_luxury_product_1794436192275.jpg',
    commands: [
      '/premiumshowcase',
      '/mediumformat',
      '/100mmmacro',
      '/f8',
      '/studioflash',
      '/rimlighting',
      '/luxuryeditorial',
      '/highcontrast',
      '/photorealistic'
    ],
    fullPrompt: 'Luxury commercial product photograph of a sculptural perfume bottle resting on a wet dark travertine stone slab. Crisp water splash frozen in mid-air around the flacon with microscopic droplets, studio softbox illumination, subtle rim light separating the glass geometry. Shot on Phase One IQ4, 100mm macro f/8, ultra-sharp detail, pristine optical reflections. No distorted brand labels.',
    description: 'Escenario publicitario internacional con física de fluidos en congelación de alta velocidad, iluminación de estudio multicapa y nitidez macro absoluta.',
    specs: {
      camera: 'Phase One IQ4 / Medium Format Digital',
      lens: '100mm Macro f/8',
      lighting: 'Studio Softbox + Dual Rim Lights',
      color: 'Monochrome Warm Minerals & Pure Glass',
      aspectRatio: '4:5 (Instagram / Catálogo)'
    },
    context: 'Diseñado para e-commerce premium, perfumería, licores finos, relojería y vallas de alto impacto publicitario.'
  },
  {
    id: 'generative-digital-art',
    title: 'Video Experimental Generativo',
    subtitle: 'Estructuras orgánicas de partículas, fluidos y audio-reactividad',
    type: 'experimental',
    image: '/images/recipe_generative_art_1794436193380.jpg',
    commands: [
      '/generativevideo',
      '/particle-simulation',
      '/fluid-animation',
      '/abstract-motion',
      '/volumetric-effects',
      '/audio-reactive',
      '/seamless-loop'
    ],
    fullPrompt: 'Experimental generative art video installation, organic luminescent particles and iridescent liquid ribbons continuously evolving and folding through dark volumetric space. Slow orbital camera motion around the undulating geometric form, chromatic aberration at the borders, deep cyan and violet light pulses. Cinematic 60fps, hypnotic fluid simulation, seamless loop continuity.',
    description: 'Instalación audiovisual donde millones de partículas luminosas reaccionan formando esculturas biomórficas en constante mutación dentro de un espacio de exposición museográfico.',
    specs: {
      camera: 'Virtual Cinema Camera / ARRI Render',
      lens: '35mm Wide Anamorphic',
      lighting: 'Internal Bioluminescent Volumetric Light',
      color: 'Electric Neon & Violet Cyan',
      motion: 'Slow 360° Continuous Orbit',
      aspectRatio: '16:9 (Pantallas / Videowall)'
    },
    context: 'Diseñado para visuales de conciertos, museos de arte digital, pantallas LED inmersivas y laboratorios interactivos de Núcleo Colectivo.'
  },
  {
    id: 'analog-documentary',
    title: 'Fotografía Documental Analógica',
    subtitle: 'Textura 35mm, luz natural y autenticidad espontánea',
    type: 'photo',
    image: '/images/recipe_analog_documentary_1794437087703.jpg',
    commands: [
      '/documentary',
      '/35mmfilm',
      '/35mm',
      '/fujifilmstyle',
      '/availablelight',
      '/filmgrain',
      '/naturalcolors',
      '/candid',
      '/authentic'
    ],
    fullPrompt: 'Authentic documentary street photography captured on 35mm Kodak Portra 400 film, Leica M11 with 35mm f/2 Summicron lens. Natural golden hour window light, unposed spontaneous interaction between artisans in a traditional ceramic workshop. Organic film grain, soft highlight roll-off, rich earthen palette, true human connection. No synthetic sharpening.',
    description: 'Estética cálida y humana que evoca los grandes reportajes de Magnum Photos, con grano de emulsión físico, colores fieles y ausencia de artificios digitales.',
    specs: {
      camera: 'Leica M11 / 35mm Film Body',
      lens: '35mm f/2 Summicron',
      lighting: 'Available Natural Window Light',
      color: 'Kodak Portra 400 Warm Tones',
      aspectRatio: '3:2 (Fotografía Clásica)'
    },
    context: 'Ideal para proyectos culturales, libros de fotografía, archivos de memoria y narrativas comunitarias.'
  },
  {
    id: 'artwork-exhibition-tour',
    title: 'Recorrido Cinematográfico en Obra de Arte',
    subtitle: 'Toma continua alrededor de escultura o instalación física',
    type: 'video',
    image: '/images/recipe_artwork_tour_1794437087396.jpg',
    commands: [
      '/artfilm',
      '/orbit-shot',
      '/slow-motion',
      '/anamorphic-lens',
      '/volumetric-light',
      '/cinematic-color-grading',
      '/continuous-shot'
    ],
    fullPrompt: 'Cinematic art film sequence, ARRI Alexa 35 with Cooke 40mm anamorphic prime lens at T2.3. Camera performs a slow, perfectly stabilized orbital tracking shot moving 360 degrees around a massive contemporary bronze and resin sculpture in a minimalist concrete gallery. Volumetric shafts of morning light cut through light atmospheric haze. Subtle shallow depth of field pulling focus along the textured metallic surface. 24fps motion cadence.',
    description: 'Movimiento fluido y contemplativo sin cortes que devela la dimensionalidad, los materiales y la relación espacial de una pieza artística.',
    specs: {
      camera: 'ARRI Alexa 35',
      lens: 'Cooke Anamorphic 40mm T2.3',
      lighting: 'Volumetric Daylight Shafts + Diffused Haze',
      color: 'Kodak 2383 Print Film Emulation',
      motion: 'Steadicam 360° Smooth Orbit',
      aspectRatio: '2.39:1 (Cinemascope)'
    },
    context: 'Producción de showreels de artistas, recorridos de bienales, documentales de diseño y exposiciones de Núcleo Colectivo.'
  },
  {
    id: 'infinite-loop-audiovisual',
    title: 'Loop Audiovisual Infinito para Pantallas',
    subtitle: 'Continuidad matemática perfecta entre el fotograma inicial y final',
    type: 'video',
    image: '/images/recipe_infinite_loop_1794437088322.jpg',
    commands: [
      '/loopvideo',
      '/orbit-shot',
      '/slow-motion',
      '/volumetric-light',
      '/organic-motion',
      '/seamless-loop'
    ],
    fullPrompt: 'Hypnotic seamless loop video for gallery display. A complex kinetic structure of polished obsidian and gold floating in calm air, slowly spinning on a precise axis while light caresses its facets. The 360 camera orbit timing is perfectly synchronized so the very last frame matches the exact coordinates and lighting of the first frame. No stutter, zero jump-cut, fluid physical inertia.',
    description: 'Pieza concebida para reproducción infinita sin saltos ni cortes visibles, pensada para pantallas verticales de lobby o proyecciones ambientales continuas.',
    specs: {
      camera: 'Virtual Studio Rig',
      lens: '50mm Prime T2.0',
      lighting: 'Rotating Key Light with Soft Fill',
      color: 'Midnight Black & Polished Gold',
      motion: 'Constant Velocity Mathematical Orbit',
      aspectRatio: '1:1 o 9:16'
    },
    context: 'Videowalls, pantallas de galerías, fondos escenográficos para presentaciones y arte digital ambiental.'
  },
  {
    id: 'timesquare-billboard-showcase',
    title: 'Valla 3D Gigante en Times Square',
    subtitle: 'Publicidad anamórfica de impacto urbano monumental',
    type: 'ads',
    image: '/images/example_timesquare_billboard_1794437088499.jpg',
    commands: [
      '/timesquare',
      '/3dbillboard',
      '/adcreative',
      '/heroimage',
      '/cinematic'
    ],
    fullPrompt: 'Monumental 3D digital anamorphic billboard in Times Square at dusk under light rain, featuring a luxury chronograph watch seemingly breaking out of the screen into the street space. Surrounding city architecture, vibrant neon reflections on wet asphalt, yellow cabs passing below, dramatic commercial lighting.',
    description: 'Efecto de valla publicitaria tridimensional hiperrealista en un entorno urbano vivo con reflejos de lluvia y escala monumental.',
    specs: {
      camera: 'ARRI Alexa 35 / Wide Cinema Lens',
      lens: '24mm Wide Cinema Prime',
      lighting: 'Neon Ambient & Screen Glow',
      color: 'Teal & Electric Cyan Urban Contrast',
      aspectRatio: '16:9 (Panorámico Pantallas)'
    },
    context: 'Lanzamientos de productos, presentaciones de branding monumental y campañas de alto impacto visual.'
  }
];

export const MASTER_COMMANDS: CommandItem[] = [
  // 01. GÉNEROS FOTOGRÁFICOS
  {
    id: 'cmd-photorealistic',
    command: '/photorealistic',
    label: 'Fotografía Fotorrealista',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Imagen fotográfica con texturas ópticas, luz y materiales indistinguibles de una captura real.',
    effect: 'Elimina acabados plásticos e ilustrativos, forzando física óptica coherente.',
    technicalDetails: 'Prioriza microtexturas, dispersión subsuperficial y profundidad de campo realista.',
    samplePromptEs: 'Retrato de un artesano trabajando arcilla, /photorealistic, luz natural de ventana, detalles de textura en manos y piel.',
    samplePromptEn: 'A portrait of an artisan sculpting clay, /photorealistic, natural window light, intricate skin and clay textures.',
    tags: ['realismo', 'foto', 'textura', 'optica']
  },
  {
    id: 'cmd-hyperrealism',
    command: '/hyperrealism',
    label: 'Hiperrealismo',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Enfatiza un nivel de detalle milimétrico superior a la percepción humana ordinaria.',
    effect: 'Máxima nitidez en poros, reflejos en los ojos y entramado de textiles.',
    samplePromptEs: 'Ojo humano con reflejo del horizonte al amanecer, /hyperrealism, macro f/4, detalle de iris.',
    samplePromptEn: 'Human eye with horizon reflection at dawn, /hyperrealism, macro f/4, microscopic iris detail.',
    tags: ['detalle', 'macro', 'microscópico']
  },
  {
    id: 'cmd-editorial',
    command: '/editorial',
    label: 'Fotografía Editorial',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Estilo de revista de alta gama con dirección de arte cuidada, narrativa visual y elegancia sobria.',
    effect: 'Composiciones con intención discursiva y acabados de publicación de moda o arquitectura.',
    samplePromptEs: 'Retrato de moda de vanguardia con silueta arquitectónica en museo, /editorial, composición sobria.',
    samplePromptEn: 'High fashion portrait with architectural silhouette in an art museum, /editorial, high-end magazine aesthetic.',
    tags: ['revista', 'moda', 'diseño', 'vogue']
  },
  {
    id: 'cmd-commercial',
    command: '/commercial',
    label: 'Fotografía Comercial',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Producción publicitaria de alta gama orientada a venta de producto o posicionamiento de marca.',
    effect: 'Iluminación controlada sin sombras empastadas, fidelidad de producto y acabados impecables.',
    samplePromptEs: 'Audífonos inalámbricos de titanio sobre base de cuarzo blanco, /commercial, iluminación de estudio suave.',
    samplePromptEn: 'Titanium wireless headphones on white quartz base, /commercial, soft studio lighting.',
    tags: ['producto', 'publicidad', 'catalogo']
  },
  {
    id: 'cmd-fineart',
    command: '/fineart',
    label: 'Fotografía Artística / Bellas Artes',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Enfoque donde prima la visión estética y conceptual del autor sobre la función comercial.',
    effect: 'Atmósferas poéticas, composiciones meditativas y juego de claroscuro.',
    samplePromptEs: 'Figura solitaria frente a una niebla marina matinal, /fineart, tonos apagados, contemplativo.',
    samplePromptEn: 'Solitary silhouette facing morning sea mist, /fineart, muted palette, contemplative mood.',
    tags: ['arte', 'galeria', 'poetico']
  },
  {
    id: 'cmd-cinematic',
    command: '/cinematic',
    label: 'Fotografía Cinematográfica',
    category: 'Géneros Fotográficos',
    section: 'both',
    family: '01. Géneros y Tipos',
    description: 'Transforma cualquier escena en un fotograma que parece extraído de una película de cine.',
    effect: 'Iluminación motivada, formato ancho, grano de película y etalonaje tonal intencional.',
    samplePromptEs: 'Conductor dentro de un auto bajo la lluvia nocturna con luces de neón reflejadas, /cinematic, 35mm anamorphic.',
    samplePromptEn: 'Driver inside car during nighttime rain with reflected neon lights, /cinematic, 35mm anamorphic.',
    tags: ['cine', 'película', 'dramatismo']
  },
  {
    id: 'cmd-documentary',
    command: '/documentary',
    label: 'Fotografía Documental',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Estilo directo, verídico y espontáneo sin poses forzadas ni artificios de estudio.',
    effect: 'Aporta autenticidad humana, contexto sociourbano y luz natural disponible.',
    samplePromptEs: 'Músicos ensayando en un patio colonial al caer la tarde, /documentary, luz natural, sin posar.',
    samplePromptEn: 'Musicians rehearsing in a courtyard at dusk, /documentary, available light, unposed candid.',
    tags: ['real', 'calle', 'reportaje', 'autentico']
  },
  {
    id: 'cmd-streetphotography',
    command: '/streetphotography',
    label: 'Fotografía Callejera',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Captura del instante decisivo en espacios públicos con dinamismo urbano y sombras marcadas.',
    effect: 'Composición con líneas urbanas, transeúntes en movimiento y contrastes de sol y sombra.',
    samplePromptEs: 'Hombre con sombrero cruzando rayo de sol entre dos rascacielos, /streetphotography, Leica M11, 28mm.',
    samplePromptEn: 'Man in hat crossing beam of sunlight between skyscrapers, /streetphotography, Leica M11, 28mm.',
    tags: ['urbano', 'calle', 'espontaneo']
  },
  {
    id: 'cmd-macro',
    command: '/macro',
    label: 'Fotografía Macro',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Acercamiento extremo con relación de reproducción 1:1 o superior para revelar texturas diminutas.',
    effect: 'Poca profundidad de campo extrema, bokeh envolvente y detalle hiperdefinido en patrones minúsculos.',
    samplePromptEs: 'Gota de rocío sobre ala de mariposa mostrando escamas iridiscentes, /macro, 100mm f/2.8.',
    samplePromptEn: 'Dew drop on butterfly wing revealing iridescent micro-scales, /macro, 100mm f/2.8 lens.',
    tags: ['detalle', 'lente', 'textura']
  },
  {
    id: 'cmd-minimalphotography',
    command: '/minimalphotography',
    label: 'Fotografía Minimalista',
    category: 'Géneros Fotográficos',
    section: 'photo',
    family: '01. Géneros y Tipos',
    description: 'Reducción al elemento esencial con amplio uso del espacio negativo y geometría limpia.',
    effect: 'Composiciones aireadas, paletas monocromáticas o reducidas y serenidad visual.',
    samplePromptEs: 'Una sola silla de roble en una sala de hormigón blanco con un haz de luz cenital, /minimalphotography.',
    samplePromptEn: 'A single oak chair in an all-white concrete gallery with zenith sunlight beam, /minimalphotography.',
    tags: ['minimalismo', 'espacio', 'zen']
  },

  // 02. CÁMARAS Y SISTEMAS
  {
    id: 'cmd-mediumformat',
    command: '/mediumformat',
    label: 'Medio Formato (Hasselblad / Fujifilm GFX)',
    category: 'Cámaras y Sistemas',
    section: 'photo',
    family: '02. Cámaras y Sistemas',
    description: 'Sensor de gran superficie con transición tonal ultra suave, altísima resolución y gradiente de foco sublime.',
    effect: 'Produce esa cualidad tridimensional (3D pop) inconfundible de la fotografía de moda y catálogo de lujo.',
    technicalDetails: 'Referencia a sensores de 44x33mm o 54x40mm (Hasselblad X2D, Phase One IQ4, GFX 100 II).',
    samplePromptEs: 'Retrato de estudio de alta costura, Shot on Hasselblad X2D, /mediumformat, riqueza tonal inmensa.',
    samplePromptEn: 'High fashion studio portrait, Shot on Hasselblad X2D, /mediumformat, exceptional tonal depth.',
    tags: ['hasselblad', 'sensor', 'calidad', 'estudio']
  },
  {
    id: 'cmd-fullframe',
    command: '/fullframe',
    label: 'Full Frame (Sony A7R V / Canon R5)',
    category: 'Cámaras y Sistemas',
    section: 'photo',
    family: '02. Cámaras y Sistemas',
    description: 'Sensor de 35mm tradicional que equilibra versatilidad, nitidez y control de profundidad de campo.',
    effect: 'Estética contemporánea nítida y equilibrada para todo tipo de fotografía profesional.',
    samplePromptEs: 'Retrato urbano al atardecer, /fullframe, Sony Alpha 7R V, 85mm f/1.4, tonos cálidos.',
    samplePromptEn: 'Urban portrait at sunset, /fullframe, Sony Alpha 7R V, 85mm f/1.4, warm backlight.',
    tags: ['sony', 'canon', 'nikon', 'estandar']
  },
  {
    id: 'cmd-rangefinder',
    command: '/rangefinder',
    label: 'Telemétrica / Leica M',
    category: 'Cámaras y Sistemas',
    section: 'photo',
    family: '02. Cámaras y Sistemas',
    description: 'Sistema telemétrico manual legendario de Leica. Carácter óptico intimista y documental.',
    effect: 'Enfoque manual intencional, perspectiva de 35mm o 50mm y microcontraste orgánico.',
    samplePromptEs: 'Escena de café en Lisboa bajo la lluvia, Shot on Leica M11, /rangefinder, Summilux 35mm.',
    samplePromptEn: 'Lisbon cafe scene in rain, Shot on Leica M11, /rangefinder, Summilux 35mm lens, quiet contrast.',
    tags: ['leica', 'clasico', 'reportaje']
  },
  {
    id: 'cmd-35mmfilm',
    command: '/35mmfilm',
    label: 'Película Analógica 35mm',
    category: 'Cámaras y Sistemas',
    section: 'photo',
    family: '02. Cámaras y Sistemas',
    description: 'Captura química con grano visible, imperfecciones ópticas sutiles y calidez de emulsión.',
    effect: 'Atmósfera nostálgica, tonos de piel orgánicos y altas luces suaves.',
    samplePromptEs: 'Retrato juvenil en la playa en verano, /35mmfilm, Canon AE-1, grano visible, Kodak Portra 400.',
    samplePromptEn: 'Youth portrait on beach during summer, /35mmfilm, Canon AE-1, visible analog grain, Portra 400.',
    tags: ['analogo', 'grano', 'nostalgia']
  },
  {
    id: 'cmd-technicalcamera',
    command: '/technicalcamera',
    label: 'Cámara Técnica de Estudio (Phase One IQ4)',
    category: 'Cámaras y Sistemas',
    section: 'photo',
    family: '02. Cámaras y Sistemas',
    description: 'Cámaras de arquitectura y museo con control de basculamiento y descentramiento (tilt-shift) para líneas paralelas perfectas.',
    effect: 'Líneas verticales completamente rectas, cero distorsión de perspectiva y nitidez absoluta.',
    samplePromptEs: 'Fachada de rascacielos geométrico de cristal, /technicalcamera, Phase One IQ4, corrección de perspectiva.',
    samplePromptEn: 'Geometric glass skyscraper facade, /technicalcamera, Phase One IQ4, perfect perspective correction.',
    tags: ['arquitectura', 'estudio', 'lineas']
  },

  // 03. ÓPTICA Y LENTES
  {
    id: 'cmd-24mm',
    command: '24mm',
    label: '24mm — Gran Angular',
    category: 'Óptica y Distancias Focales',
    section: 'both',
    family: '03. Lentes y Distancias Focales',
    description: 'Campo visual amplio que integra al sujeto con su entorno sin deformación extrema.',
    effect: 'Ideal para paisaje, arquitectura interior y retratos ambientales contextuales.',
    samplePromptEs: 'Arquitecto en su taller rodeado de planos y maquetas, lente 24mm f/4, retrato ambiental.',
    samplePromptEn: 'Architect in studio surrounded by blueprints and models, 24mm f/4 lens, environmental portrait.',
    tags: ['angular', 'entorno', 'paisaje']
  },
  {
    id: 'cmd-35mm',
    command: '35mm',
    label: '35mm — Lente Documental',
    category: 'Óptica y Distancias Focales',
    section: 'both',
    family: '03. Lentes y Distancias Focales',
    description: 'La focal predilecta del fotoperiodismo y cine. Perspectiva humana natural con contexto.',
    effect: 'Transmite la sensación de estar físicamente presente en la escena sin distorsionar proporciones.',
    samplePromptEs: 'Conversación espontánea en un mercado nocturno, lente 35mm f/2, narrativa visual.',
    samplePromptEn: 'Spontaneous conversation in night market, 35mm f/2 lens, natural visual storytelling.',
    tags: ['documental', 'calle', 'cine']
  },
  {
    id: 'cmd-50mm',
    command: '50mm',
    label: '50mm — El Lente Estándar',
    category: 'Óptica y Distancias Focales',
    section: 'both',
    family: '03. Lentes y Distancias Focales',
    description: 'La perspectiva equivalente a la visión focal del ojo humano.',
    effect: 'Composiciones honestas, neutrales y equilibradas sin compresión ni exageración de distancias.',
    samplePromptEs: 'Retrato de medio cuerpo de una escultora, lente 50mm f/1.8, perspectiva natural limpia.',
    samplePromptEn: 'Medium shot portrait of a sculptor, 50mm f/1.8 lens, clean natural human perspective.',
    tags: ['estandar', 'natural', 'ojo']
  },
  {
    id: 'cmd-85mm',
    command: '85mm',
    label: '85mm — El Rey del Retrato',
    category: 'Óptica y Distancias Focales',
    section: 'both',
    family: '03. Lentes y Distancias Focales',
    description: 'Compresión ideal del rostro, separación dramática del fondo y desenfoque bokeh cremoso.',
    effect: 'Favorece las facciones anatómicas, desenfoca fondos caóticos y crea foco nítido en la mirada.',
    samplePromptEs: 'Primer plano cinematográfico de actriz, lente 85mm f/1.4, fondo desenfocado bokeh suave, ojos nítidos.',
    samplePromptEn: 'Cinematic close-up of actress, 85mm f/1.4 lens, creamy blurred background bokeh, razor-sharp eyes.',
    tags: ['retrato', 'bokeh', 'belleza']
  },
  {
    id: 'cmd-100mmmacro',
    command: '100mm Macro',
    label: '100mm Macro — Detalle Absoluto',
    category: 'Óptica y Distancias Focales',
    section: 'both',
    family: '03. Lentes y Distancias Focales',
    description: 'Permite enfocar a milímetros del objeto con fidelidad geométrica plana y sin distorsión esférica.',
    effect: 'Especial para joyería, esferas de relojes, texturas cosméticas y naturaleza en miniatura.',
    samplePromptEs: 'Gotas de agua sobre cristal de reloj de oro, lente 100mm macro f/8, nitidez milimétrica.',
    samplePromptEn: 'Water beads on gold watch crystal, 100mm macro f/8 lens, razor-sharp commercial detail.',
    tags: ['macro', 'joyas', 'reloj']
  },
  {
    id: 'cmd-anamorphic',
    command: '/anamorphic',
    label: 'Lente Anamórfico Cinematográfico',
    category: 'Óptica y Distancias Focales',
    section: 'both',
    family: '03. Lentes y Distancias Focales',
    description: 'Lente de cine con elementos cilíndricos que comprime la imagen horizontalmente.',
    effect: 'Destellos horizontales característicos (streaks), bokeh ovalado y formato panorámico cinematográfico.',
    samplePromptEs: 'Secuencia nocturna en autopista futurista, /anamorphic, destellos horizontales azules y bokeh ovalado.',
    samplePromptEn: 'Night sequence on futuristic highway, /anamorphic lens, horizontal blue streak flares and oval bokeh.',
    tags: ['cine', 'anamorfico', 'destellos']
  },

  // 04. ILUMINACIÓN FOTOGRÁFICA
  {
    id: 'cmd-rembrandt',
    command: 'Rembrandt Lighting',
    label: 'Iluminación Rembrandt',
    category: 'Iluminación Fotográfica',
    section: 'both',
    family: '05. Iluminación',
    description: 'Luz principal lateral a 45 grados que genera un pequeño triángulo iluminado característico sobre la mejilla en sombra.',
    effect: 'Aporta tridimensionalidad, dramatismo pictórico y solemnidad al rostro.',
    samplePromptEs: 'Retrato de un pensador en estudio, Rembrandt lighting, triángulo de luz en mejilla, sombra suave.',
    samplePromptEn: 'Studio portrait of a philosopher, Rembrandt lighting setup, characteristic light triangle on shadow cheek.',
    tags: ['rembrandt', 'clasico', 'triangulo', 'dramatico']
  },
  {
    id: 'cmd-butterfly',
    command: 'Butterfly Lighting',
    label: 'Iluminación Butterfly / Paramount',
    category: 'Iluminación Fotográfica',
    section: 'both',
    family: '05. Iluminación',
    description: 'Luz principal colocada directamente encima y delante del sujeto, creando una sombra simétrica en forma de mariposa bajo la nariz.',
    effect: 'Realza los pómulos, estiliza el rostro y proporciona una luz de belleza limpia y sedosa.',
    samplePromptEs: 'Fotografía de belleza para portada de revista, Butterfly lighting, pómulos resaltados, piel luminosa.',
    samplePromptEn: 'Beauty editorial portrait for magazine cover, Butterfly lighting setup, sculpted cheekbones, luminous skin.',
    tags: ['belleza', 'moda', 'rostro']
  },
  {
    id: 'cmd-splitlighting',
    command: 'Split Lighting',
    label: 'Split Lighting (Luz Dividida)',
    category: 'Iluminación Fotográfica',
    section: 'both',
    family: '05. Iluminación',
    description: 'Luz a 90 grados exactos del sujeto: una mitad del rostro queda completamente iluminada y la otra sumida en sombra profunda.',
    effect: 'Transmite misterio, dualidad moral, dramatismo de cine noir o tensión psicológica.',
    samplePromptEs: 'Retrato dramático en blanco y negro, Split lighting, mitad en luz y mitad en sombra profunda.',
    samplePromptEn: 'Dramatic black and white portrait, Split lighting setup, one half in light and other half in deep shadow.',
    tags: ['dualidad', 'misterio', 'noir']
  },
  {
    id: 'cmd-rimlighting',
    command: '/rimlighting',
    label: 'Rim Light / Luz de Contorno',
    category: 'Iluminación Fotográfica',
    section: 'both',
    family: '05. Iluminación',
    description: 'Luz situada detrás del sujeto que dibuja un fino contorno brillante a lo largo de su silueta.',
    effect: 'Separa al sujeto del fondo oscuro, define hombros y cabello, y aporta volumen tridimensional.',
    samplePromptEs: 'Atleta preparándose en vestuario oscuro, /rimlighting que dibuja su musculatura y silueta.',
    samplePromptEn: 'Athlete focusing in dark locker room, crisp /rimlighting tracing silhouette and hair edges.',
    tags: ['contorno', 'volumen', 'separacion']
  },
  {
    id: 'cmd-volumetriclighting',
    command: '/volumetriclighting',
    label: 'Luz Volumétrica / God Rays',
    category: 'Iluminación Fotográfica',
    section: 'both',
    family: '05. Iluminación',
    description: 'Haz de luz visible a través de partículas suspendidas en el aire (niebla, polvo o humo suave).',
    effect: 'Crea rayos de luz celestiales tangibles que conectan elementos del espacio arquitectónico.',
    samplePromptEs: 'Interior de catedral gótica con niebla matinal, /volumetriclighting, rayos de sol entrando por vitral.',
    samplePromptEn: 'Gothic cathedral interior with morning haze, /volumetriclighting, majestic god rays cutting through stained glass.',
    tags: ['rayos', 'niebla', 'atmosfera']
  },
  {
    id: 'cmd-chiaroscuro',
    command: '/chiaroscuro',
    label: 'Claroscuro / Caravaggio',
    category: 'Iluminación Fotográfica',
    section: 'both',
    family: '05. Iluminación',
    description: 'Contraste extremo entre luces intensas focalizadas y sombras tenebristas profundas.',
    effect: 'Inspiración pictórica barroca, atmósfera solemne y concentración visual en el sujeto.',
    samplePromptEs: 'Bodegón de frutas silvestres y cuchillo de plata sobre mesa de nogal, /chiaroscuro, estilo barroco.',
    samplePromptEn: 'Still life with wild fruits and silver knife on walnut table, /chiaroscuro, dramatic baroque Caravaggio lighting.',
    tags: ['barroco', 'sombras', 'pintura']
  },

  // 05. PUBLICIDAD Y PRODUCTO (ADS)
  {
    id: 'cmd-premiumshowcase',
    command: '/premiumshowcase',
    label: 'Showcase Publicitario de Lujo',
    category: 'Publicidad y Producto (ADS)',
    section: 'photo',
    family: '12. Fotografía Publicitaria',
    description: 'Convierte cualquier objeto en una pieza central de campaña publicitaria internacional de alta gama.',
    effect: 'Superficies minerales nobles, reflejos milimétricos, atmósfera de lujo sobrio y acabados impecables.',
    samplePromptEs: 'Frasco de perfume sobre pedestal de mármol negro con agua en calma, /premiumshowcase, f/8, reflejos nítidos.',
    samplePromptEn: 'Perfume bottle resting on black marble pedestal with still water reflections, /premiumshowcase, f/8, crisp reflections.',
    tags: ['lujo', 'ads', 'campaña', 'producto']
  },
  {
    id: 'cmd-timesquare',
    command: '/timesquare',
    label: 'Valla Gigante en Times Square',
    category: 'Publicidad y Producto (ADS)',
    section: 'photo',
    family: '12. Fotografía Publicitaria',
    description: 'Proyecta el producto en una gigantesca pantalla LED publicitaria en el cruce de Times Square, Nueva York.',
    effect: 'Reflejos de la multitud, luces nocturnas urbanas y escala monumental del producto en la pantalla.',
    samplePromptEs: 'Zapatillas deportivas futuristas proyectadas en pantalla gigante de Times Square bajo la lluvia, /timesquare.',
    samplePromptEn: 'Futuristic running shoes featured on massive Times Square LED billboard at night under rain, /timesquare.',
    tags: ['valla', 'pantalla', 'billboard', 'nyc']
  },
  {
    id: 'cmd-productburst',
    command: '/productburst',
    label: 'Explosión de Ingredientes Alrededor',
    category: 'Publicidad y Producto (ADS)',
    section: 'photo',
    family: '12. Fotografía Publicitaria',
    description: 'El producto suspendido en el centro rodeado por sus ingredientes naturales o componentes en explosión radial congelada.',
    effect: 'Física dinámica de alta velocidad, frescura extrema y sensación de energía explosiva.',
    samplePromptEs: 'Lata de bebida energética suspendida con gotas de condensación, rodeada de trozos de lima y hielo en explosión, /productburst.',
    samplePromptEn: 'Cold beverage can in mid-air with condensation, surrounded by exploding fresh lime wedges and ice shards, /productburst.',
    tags: ['explosion', 'ingredientes', 'congelado']
  },
  {
    id: 'cmd-explodedview',
    command: '/explodedview',
    label: 'Despiece Técnico / Exploded View',
    category: 'Publicidad y Producto (ADS)',
    section: 'photo',
    family: '12. Fotografía Publicitaria',
    description: 'Separación flotante milimétrica de todas las capas internas y componentes de ingeniería de un dispositivo.',
    effect: 'Revela la arquitectura de hardware interna, materiales, circuitos y precisión de diseño industrial.',
    samplePromptEs: 'Despiece técnico de un reloj de buceo de titanio mostrando engranajes, cristal de zafiro y corona flotando, /explodedview.',
    samplePromptEn: 'Precision exploded view of titanium dive watch showing floating gears, sapphire glass, dial and casing, /explodedview.',
    tags: ['despiece', 'tecnico', 'ingenieria']
  },
  {
    id: 'cmd-magazinecover',
    command: '/magazinecover',
    label: 'Portada Editorial de Revista',
    category: 'Publicidad y Producto (ADS)',
    section: 'photo',
    family: '12. Fotografía Publicitaria',
    description: 'Disposición visual y composición con espacio pensado para cabecera tipográfica de revista de moda o diseño.',
    effect: 'Encuadre vertical 4:5 equilibrado, mirada penetrante o silueta icónica y balance compositivo superior.',
    samplePromptEs: 'Retrato de diseñadora vanguardista en estudio minimalista, /magazinecover, composición editorial 4:5.',
    samplePromptEn: 'Avant-garde fashion designer portrait in minimalist studio, /magazinecover, editorial 4:5 layout balance.',
    tags: ['portada', 'editorial', 'revista']
  },
  {
    id: 'cmd-splashphotography',
    command: '/splashphotography',
    label: 'Fotografía de Salpicaduras de Líquido',
    category: 'Publicidad y Producto (ADS)',
    section: 'photo',
    family: '12. Fotografía Publicitaria',
    description: 'Captura a 1/8000s de fluidos transparentes o lechosos coronando o envolviendo el producto en movimiento.',
    effect: 'Gotas en suspensión, escultura líquida orgánica y refracción óptica hiperdetallada.',
    samplePromptEs: 'Frasco de sérum facial cayendo sobre superficie de agua pura con salpicadura en corona, /splashphotography, 1/4000s.',
    samplePromptEn: 'Facial serum bottle touching pure water surface with crisp crown splash and micro-droplets, /splashphotography.',
    tags: ['agua', 'salpicadura', 'liquido']
  },

  // 06. PELÍCULAS Y TEXTURAS ANALÓGICAS
  {
    id: 'cmd-portra400',
    command: 'Kodak Portra 400',
    label: 'Kodak Portra 400',
    category: 'Películas y Texturas Analógicas',
    section: 'photo',
    family: '09. Películas y Texturas',
    description: 'La película de color más apreciada del mundo para retratos. Tonos de piel sedosos y saturación suave.',
    effect: 'Transiciones de color cálidas y apacibles, grano fino estético y altas luces sedosas.',
    samplePromptEs: 'Retrato al atardecer en terraza de madera, película Kodak Portra 400, tonos de piel cálidos y naturales.',
    samplePromptEn: 'Golden hour portrait on wooden deck, Kodak Portra 400 film emulation, soft skin tones and gentle grain.',
    tags: ['kodak', 'portra', 'piel', 'calidez']
  },
  {
    id: 'cmd-cinestill800t',
    command: 'CineStill 800T',
    label: 'CineStill 800T (Halos Rojos Nocturnos)',
    category: 'Películas y Texturas Analógicas',
    section: 'photo',
    family: '09. Películas y Texturas',
    description: 'Película de cine adaptada a fotografía nocturna balanceada para tungsteno. Produce halos rojos característicos en las luces directas.',
    effect: 'Atmósfera cinematográfica nocturna, halos rojizos brillantes en farolas y neones, y sombras azuladas frías.',
    samplePromptEs: 'Calles mojadas de Tokio de noche iluminadas por neones y faros de taxi, película CineStill 800T, halos rojos en fuentes de luz.',
    samplePromptEn: 'Rain-soaked Tokyo streets at night with neon signs and taxi headlights, CineStill 800T film, red halation glow around point lights.',
    tags: ['cinestill', 'nocturno', 'neones', 'halos']
  },
  {
    id: 'cmd-tri-x',
    command: 'Kodak Tri-X 400',
    label: 'Kodak Tri-X 400 (B&W Clásico)',
    category: 'Películas y Texturas Analógicas',
    section: 'photo',
    family: '09. Películas y Texturas',
    description: 'La mítica emulsión en blanco y negro del fotoperiodismo del siglo XX. Grano marcado y negros profundos.',
    effect: 'Contraste punchy, grano tangible y sensación de testimonio histórico documental.',
    samplePromptEs: 'Manifestación cultural o concierto íntimo en blanco y negro, película Kodak Tri-X 400, grano orgánico y sombras profundas.',
    samplePromptEn: 'Intimate jazz concert in black and white, Kodak Tri-X 400 film, punchy organic grain, deep rich blacks.',
    tags: ['blancoynegro', 'grano', 'clasico']
  },

  // 07. VIDEO: CÁMARAS Y MOVIMIENTOS
  {
    id: 'cmd-arri-alexa-35',
    command: '/arri-alexa-35',
    label: 'ARRI Alexa 35 (Cine Referente)',
    category: 'Video y Cinematografía',
    section: 'video',
    family: '20. Video - Cámaras de Cine',
    description: 'La cámara de cine digital más galardonada de la industria cinematográfica internacional. 17 pasos de rango dinámico.',
    effect: 'Reproducción de color inigualable, rolloff de altas luces orgánico y texturas fílmicas perfectas.',
    technicalDetails: 'Sensor ALEV 4 con arquitectura de color REVEAL y curva LogC4.',
    samplePromptEs: 'Escena cinematográfica en interior con luz de vela, /arri-alexa-35, Cooke 35mm T2.0, rango dinámico amplio.',
    samplePromptEn: 'Cinematic interior scene with candlelight, /arri-alexa-35 camera, Cooke 35mm T2.0, wide organic dynamic range.',
    tags: ['arri', 'cine', 'hollywood', 'color']
  },
  {
    id: 'cmd-red-vraptor',
    command: '/red-vraptor',
    label: 'RED V-Raptor (8K Alta Velocidad)',
    category: 'Video y Cinematografía',
    section: 'video',
    family: '20. Video - Cámaras de Cine',
    description: 'Cámara de sensor completo de alta resolución para producciones con efectos visuales complejos y cámara lenta.',
    effect: 'Nitidez cristalina, separación espacial de planos y capacidad para VFX y CGI sin artefactos.',
    samplePromptEs: 'Acción deportiva en pista de carreras, /red-vraptor, cámara lenta a 120fps, detalle extremo.',
    samplePromptEn: 'High-speed sports action on racetrack, /red-vraptor, 120fps slow motion, ultra-detailed textures.',
    tags: ['red', '8k', 'vfx', 'accion']
  },
  {
    id: 'cmd-dolly-in',
    command: '/dolly-in',
    label: 'Dolly In (Acercamiento Físico)',
    category: 'Video y Movimientos de Cámara',
    section: 'video',
    family: '20. Video - Movimientos de Cámara',
    description: 'La cámara se desplaza físicamente hacia el sujeto sobre raíles o dolly motorizado.',
    effect: 'Intensifica la tensión dramática y la intimidad emocional con el personaje manteniendo la perspectiva natural.',
    samplePromptEs: 'El protagonista descubre un mensaje secreto en su mesa de trabajo, /dolly-in lento y continuo hacia su rostro.',
    samplePromptEn: 'Protagonist discovers a secret message at wooden desk, slow smooth /dolly-in moving physically closer to their eyes.',
    tags: ['dolly', 'movimiento', 'acercamiento']
  },
  {
    id: 'cmd-orbit-shot',
    command: '/orbit-shot',
    label: 'Orbit Shot (Giro en Órbita)',
    category: 'Video y Movimientos de Cámara',
    section: 'video',
    family: '20. Video - Movimientos de Cámara',
    description: 'La cámara gira en trayectoria circular continua alrededor del sujeto o de la obra de arte.',
    effect: 'Revela la volumetría tridimensional completa, los reflejos de luz cambiantes y el contexto espacial envolvente.',
    samplePromptEs: 'Escultura geométrica de vidrio y bronce en galería vacía, /orbit-shot de 360 grados continuo y fluido.',
    samplePromptEn: 'Geometric glass and bronze sculpture in empty gallery, smooth continuous 360 /orbit-shot.',
    tags: ['orbita', '360', 'escultura', 'espacio']
  },
  {
    id: 'cmd-fpv-drone',
    command: '/fpv-drone',
    label: 'FPV Flythrough (Dron FPV Ágil)',
    category: 'Video y Movimientos de Cámara',
    section: 'video',
    family: '20. Video - Movimientos de Cámara',
    description: 'Vuelo inmersivo a gran velocidad atravesando aberturas estrechas, ventanas y espacios arquitectónicos.',
    effect: 'Sensación visceral de vuelo continuo, perspectiva cinética y dinamismo espacial extremo.',
    samplePromptEs: 'Vuelo que atraviesa el pórtico de un museo moderno y entra en el patio central de cristal, /fpv-drone, movimiento fluido.',
    samplePromptEn: 'Drone flying smoothly through the portal of a modern museum into central glass atrium, /fpv-drone cinematic flythrough.',
    tags: ['dron', 'vuelo', 'inmersivo', 'arquitectura']
  },
  {
    id: 'cmd-crane-up',
    command: '/crane-up',
    label: 'Crane Up / Elevación en Grúa',
    category: 'Video y Movimientos de Cámara',
    section: 'video',
    family: '20. Video - Movimientos de Cámara',
    description: 'La cámara asciende verticalmente de manera majestuosa desde el nivel de los ojos hasta una vista panorámica amplia.',
    effect: 'Revela la magnitud de la multitud, el paisaje o la soledad del personaje en el vasto entorno.',
    samplePromptEs: 'Un caminante deteniéndose en la cima de un risco al atardecer, la cámara hace un /crane-up revelando el valle infinito.',
    samplePromptEn: 'A lone hiker pausing at cliff edge at sunset, camera performs a majestic /crane-up revealing the vast valley below.',
    tags: ['grua', 'elevacion', 'escala']
  },
  {
    id: 'cmd-slowmotion',
    command: '/slowmotion',
    label: 'Cámara Lenta / High Speed',
    category: 'Video y Movimientos de Cámara',
    section: 'video',
    family: '20. Video - Tiempo y Velocidad',
    description: 'Dilata el tiempo para observar fenómenos físicos que el ojo no puede registrar a velocidad normal.',
    effect: 'Poesía del movimiento, elegancia en salpicaduras, caídas de tela y expresiones emocionales sutiles.',
    samplePromptEs: 'Bailarina contemporánea girando con velo de seda en suspensión aérea, /slowmotion a 120fps, física realista.',
    samplePromptEn: 'Contemporary dancer spinning with floating silk veil, /slowmotion at 120fps, fluid realistic fabric inertia.',
    tags: ['camaralenta', 'tiempo', 'poesia']
  },
  {
    id: 'cmd-seamless-loop',
    command: '/seamless-loop',
    label: 'Seamless Loop (Bucle Infinito)',
    category: 'Video y Movimientos de Cámara',
    section: 'video',
    family: '20. Video - Continuidad',
    description: 'Sincronización exacta del primer y último cuadro para reproducción continua e imperceptible en instalaciones.',
    effect: 'Cero saltos entre el final y el inicio del video, perfecto para exposiciones, fondos y videowalls.',
    samplePromptEs: 'Estructura escultórica giratoria con iluminación en ciclo cerrado, /seamless-loop, sin cortes perceptibles.',
    samplePromptEn: 'Rotating sculptural metallic geometry with cyclic lighting, /seamless-loop, final frame exactly matches first frame.',
    tags: ['bucle', 'loop', 'galeria', 'pantallas']
  },

  // 08. COMANDOS NEGATIVOS (QUÉ EVITAR)
  {
    id: 'cmd-noartificialskin',
    command: '/noartificialskin',
    label: 'Evitar Piel Plástica / Artificial',
    category: 'Instrucciones Negativas',
    section: 'both',
    family: '17. Comandos Negativos',
    description: 'Impide que los generadores de IA apliquen el clásico suavizado de cera o efecto muñeca de porcelana.',
    effect: 'Fuerza la presencia de poros naturales, vello facial sutil, textura dérmica y microvariaciones tonales.',
    samplePromptEs: 'Retrato de mujer de 40 años con luz natural, /noartificialskin, piel con poros reales.',
    samplePromptEn: 'Portrait of 40-year-old woman with natural sunlight, /noartificialskin, authentic real human skin pores.',
    tags: ['negativo', 'piel', 'antislop']
  },
  {
    id: 'cmd-nofakebokeh',
    command: '/nofakebokeh',
    label: 'Evitar Desenfoque Falso',
    category: 'Instrucciones Negativas',
    section: 'both',
    family: '17. Comandos Negativos',
    description: 'Evita los artefactos de recorte de software estilo modo retrato de celular de gama baja.',
    effect: 'Exige una caída óptica gradual y realista de la profundidad de campo basada en leyes físicas de lentes.',
    samplePromptEs: 'Primer plano con flores al fondo, /nofakebokeh, transición óptica gradual suave.',
    samplePromptEn: 'Close-up with floral background, /nofakebokeh, natural physical optical depth falloff.',
    tags: ['negativo', 'bokeh', 'lente']
  },
  {
    id: 'cmd-notext',
    command: '/notext',
    label: 'Sin Texto ni Tipografía Inventada',
    category: 'Instrucciones Negativas',
    section: 'both',
    family: '17. Comandos Negativos',
    description: 'Prohíbe a los modelos generar letras incomprensibles, marcas falsas o tipografías distorsionadas en la imagen.',
    effect: 'Limpia vallas, etiquetas, ropa y fondos de cualquier basura tipográfica generada aleatoriamente.',
    samplePromptEs: 'Fotografía de producto cosmético, frasco de vidrio ámbar limpio, /notext, sin logotipos inventados.',
    samplePromptEn: 'Cosmetic skincare product photo, clean amber glass container, /notext, no hallucinated brand gibberish.',
    tags: ['negativo', 'texto', 'limpio']
  }
];

export const MASTER_TEMPLATES = {
  photo: `MASTER PROMPT — PHOTOGRAPHY & VISUAL ART
01. SUBJECT
[Describe el sujeto principal, objeto, persona o escena con claridad]

02. PHOTOGRAPHY GENRE
/photorealistic /editorial /commercial /fineart /documentary

03. CAMERA & SENSOR
Camera: [Sony A7R V / Hasselblad X2D / Leica M11 / Phase One IQ4]
Sensor: [Full Frame / Medium Format / 35mm Film]

04. LENS & APERTURE
Lens: [24mm / 35mm / 50mm / 85mm / 100mm Macro / Anamorphic]
Aperture: [f/1.4 / f/2.8 / f/5.6 / f/8 / f/11]
Depth of field: [Shallow / Deep / Creamy Bokeh]

05. CAMERA SETTINGS
ISO: [100 / 400 / 800]
Shutter speed: [1/125s / 1/500s / 1/2000s / Long Exposure]
White balance: [Neutral 5500K / Warm Tungsten 3200K / Cool Shade 7000K]

06. LIGHTING SETUP
[Rembrandt / Butterfly / Split / Rim Lighting / Volumetric / Softbox / Chiaroscuro]
Dirección, fuente, temperatura y calidad de difusión de la luz.

07. COLOR PALETTE & FILM LOOK
Primary palette: [Teal & Orange / Monochrome / Earth Tones / Cyberpunk / Nordic]
Film stock reference: [Kodak Portra 400 / CineStill 800T / Tri-X 400 / Velvia 50]

08. COMPOSITION & FRAMING
[Rule of thirds / Golden ratio / Centered / Leading lines / Negative space]
Shot type: [Close-up / Medium shot / Wide shot / Extreme close-up]
Angle: [Eye-level / Low angle / High angle]

09. TEXTURE & POSTPRODUCTION
/filmgrain /naturaltexture /realisticskin /rawphotography /highdynamicrange

10. OUTPUT & NEGATIVE INSTRUCTIONS
Aspect ratio: [1:1 / 4:5 / 3:2 / 16:9 / 9:16]
Avoid: plastic skin, artificial oversaturation, fake bokeh, distorted anatomy, unwanted text, watermarks.`,

  video: `MASTER VIDEO PROMPT — CINEMATOGRAPHY & MOTION
01. SCENE & ATMOSPHERE
[Lugar, época, contexto, clima y atmósfera lumínica de la secuencia]

02. SUBJECT & ACTION
[Personaje u objeto principal, acción exacta que transcurre y evolución del movimiento]

03. CINEMA CAMERA & SENSOR
Camera: [ARRI Alexa 35 / RED V-Raptor / Sony Venice 2 / Blackmagic URSA]
Sensor format: [Super 35 / Large Format / Monstro 8K]

04. CINEMA LENS & OPTICS
Lens: [Cooke Anamorphic 40mm / ARRI Signature Prime 35mm / Master Prime 50mm]
Aperture: [T2.0 / T2.8 / T5.6]
Optical character: [Cinematic flare, oval bokeh, organic highlight roll-off]

05. CAMERA MOVEMENT & TRAJECTORY
Movement: [/dolly-in /orbit-shot /tracking-shot /crane-up /fpv-drone /steadicam]
Direction: [Forward / Circular / Upward / Lateral]
Speed: [Slow / Steady / Constant velocity / High dynamic]
Trajectory description: [Trayectoria exacta y continua de la cámara]

06. TEMPORAL CADENCE & SPEED
Frame rate: [24 fps Cine Clásico / 60 fps Fluido / 120 fps Cámara Lenta]
Time dynamic: [Normal speed / Speedramp / Timelapse / Super-slowmotion]

07. LIGHTING & ENVIRONMENT
[Cinematic lighting / Practical fixtures / Volumetric god-rays / Atmospheric haze / Smoke]

08. COLOR SCIENCE & FILM PRINT
Grading: [Kodak 2383 Print Film Look / ARRI LogC4 / Bleach Bypass / Teal & Orange]
Highlights & Shadows: [Soft highlight roll-off, deep rich black levels]

09. SOUND DESIGN & AUDIO ATMOSPHERE
Soundscape: [Diegetic ambient room-tone / Foley / Atmospheric drone / Sub bass impact]

10. CONTINUITY & SEAMLESS FINISH
Aspect ratio: [16:9 / 2.39:1 Cinemascope / 9:16 Vertical]
Temporal consistency: Maintain exact character geometry, physical lighting, and object permanence throughout.
Negative: No morphing, no jitter, no warping, no random camera cuts, no synthetic artifacts.`
};
