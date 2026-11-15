import { LibraryEntry } from './modulesData';

const IMG = {
  studio: '/images/hero_cinematic_studio_1794436191894.jpg',
  noir: '/images/recipe_neo_noir_portrait_1794436191840.jpg',
  product: '/images/recipe_luxury_product_1794436192275.jpg',
  generative: '/images/recipe_generative_art_1794436193380.jpg',
  analog: '/images/recipe_analog_documentary_1794437087703.jpg',
  artwork: '/images/recipe_artwork_tour_1794437087396.jpg',
  loop: '/images/recipe_infinite_loop_1794437088322.jpg',
  billboard: '/images/example_timesquare_billboard_1794437088499.jpg',
  botanical: '/images/mod_botanical_illustration_1794593012433.jpg',
  compFocal: '/images/comp_focal_35_85_1794593013583.jpg',
  compLight: '/images/comp_lighting_rembrandt_highkey_1794593014446.jpg',
  territory: '/images/mod_territory_memory_1794593014725.jpg',
  composition: '/images/mod_composition_cinematography_1794593015294.jpg',
  videoRig: '/images/mod_video_camera_rig_1794593015892.jpg',
  compJson: '/images/comp_json_style_transfer_1794593016651.jpg',
  hybrid: '/images/mod_hybrid_organism_art_1794593016294.jpg',
};

// ============================================================================
// MÓDULO 06 — GENERACIÓN DE VIDEO Y CINEMATOGRAFÍA
// ============================================================================
export const MODULE_06_VIDEO_ENTRIES: LibraryEntry[] = [
  // A. Movimientos de cámara (25 movimientos agrupados en fichas ricas + variantes)
  {
    id: 'm6-mov-pan-tilt',
    moduleId: 'mod-06',
    title: 'Static, Pan (Left/Right) y Tilt (Up/Down)',
    category: 'Movimientos de cámara',
    subcategory: 'A. Movimientos de cámara',
    description:
      'Rotación de cámara sobre su propio eje en trípode fijo: horizontal (Pan Left / Pan Right), vertical (Tilt Up / Tilt Down) o bloqueo total (Static / Locked-off).',
    explanation:
      '• Static Shot: deja que el sujeto o la luz actúen sin distracción de cámara.\n• Pan Left / Pan Right: revela el espacio lateralmente como un giro de cabeza.\n• Tilt Up / Tilt Down: recorre altura monumental (de zapatos a rostro o de piso a cúpula).',
    visual_examples: [
      'Static tripod shot de retrato con viento moviendo cabello y cortina',
      'Slow tilt-up revelando fachada de biblioteca desde la calle hasta el cielo',
    ],
    image: IMG.composition,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'pan' },
    technical_terms: ['Static / Locked-off', 'Pan Left / Right', 'Tilt Up / Down', 'Tripod pivot'],
    prompt_examples: {
      es: 'Toma en trípode con movimiento lento Tilt Up desde las manos de un escultor tallando madera hasta su rostro concentrado en el taller, luz natural lateral constante y 24fps.',
      en: 'Tripod-mounted slow Tilt-Up camera movement rising steadily from a sculptor hands carving wood up to his focused face inside a sunlit workshop, 24fps.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Slow continuous tilt-up from subject base to upper environment on locked tripod',
    },
    related_topics: ['m6-mov-dolly', 'm6-mov-crane-pedestal', 'm6-mov-whip-roll'],
    difficulty: 'Básico',
    tags: ['static', 'pan left', 'pan right', 'tilt up', 'tilt down', 'trípode'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm6-mov-dolly',
    moduleId: 'mod-06',
    title: 'Dolly In, Dolly Out, Push In, Pull Back y Truck',
    category: 'Movimientos de cámara',
    subcategory: 'A. Movimientos de cámara',
    description:
      'Traslación física de la cámara sobre rieles o carro: acercamiento (Dolly In / Push In), alejamiento (Dolly Out / Pull Back) o desplazamiento lateral paralelo (Truck Left / Right).',
    explanation:
      'A diferencia del Zoom óptico, el Dolly desplaza físicamente la cámara en el espacio, generando paralaje real entre primer plano y fondo.\n• Dolly In / Push In: intensifica la emoción.\n• Dolly Out / Pull Back: revela soledad o contexto más amplio.\n• Truck Left / Right: desliza lateralmente paralelo a una vitrina, mesa o calle.',
    visual_examples: [
      'Slow Dolly-In hacia el rostro de un músico en ensayo con polvo iluminado',
      'Pull-Back revelando que la mesa solitaria está en medio de un gran teatro vacío',
    ],
    image: IMG.videoRig,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'dolly-in' },
    technical_terms: ['Dolly In / Out', 'Push In / Pull Back', 'Truck Left / Right', 'Physical track parallax'],
    prompt_examples: {
      es: 'Movimiento físico fluido Dolly In (Push In) sobre rieles acercándose lentamente hacia una pintura al óleo en caballete mientras un haz de luz solar recorre la textura del lienzo.',
      en: 'Smooth physical Dolly-In (Push In) tracking steadily toward an oil painting on a wooden easel as warm daylight glides across the impasto brushstroke texture, 24fps.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Slow smooth dolly-in moving physically towards the subject',
    },
    related_topics: ['m6-mov-orbit-arc', 'm6-mov-zoom-rack', 'm6-arte-museografia'],
    difficulty: 'Básico',
    tags: ['dolly in', 'dolly out', 'push in', 'pull back', 'truck left', 'truck right', 'rieles'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm6-mov-orbit-arc',
    moduleId: 'mod-06',
    title: 'Tracking Shot, Orbit Shot, 360° Orbit, Arc Shot y Parallax',
    category: 'Movimientos de cámara',
    subcategory: 'A. Movimientos de cámara',
    description:
      'Desplazamientos curvos o de seguimiento continuo que rodean al sujeto o revelan volumen escultórico por capas.',
    explanation:
      '• Tracking Shot: sigue al sujeto mientras camina o actúa.\n• Orbit / 360° Orbit / Arc Shot: describe un arco parcial o giro completo alrededor del objeto o personaje manteniendo el foco en él.\n• Parallax Movement: ubica un objeto cercano desenfocado pasando frente al lente para multiplicar la sensación 3D.',
    visual_examples: [
      'Órbita continua 360° alrededor de escultura contemporánea en galería',
      'Arc shot semicircular en torno a dos personas conversando en un café',
    ],
    image: IMG.videoRig,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'orbit' },
    technical_terms: ['Tracking shot', 'Orbit / 360-degree', 'Arc shot', 'Foreground parallax'],
    prompt_examples: {
      es: 'Movimiento orbital fluido de 180 grados (Orbit / Arc Shot) girando alrededor de una escultura de cerámica iluminada lateralmente en sala museográfica, con fuerte efecto parallax respecto a las columnas del fondo.',
      en: 'Smooth continuous Orbit / Arc Shot circling 180 degrees around a ceramic sculpture in a quiet gallery, strong spatial parallax against background concrete columns, natural lighting.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Continuous smooth 360-degree orbit shot around the subject',
    },
    related_topics: ['m6-mov-dolly', 'm6-mov-handheld-steadicam', 'm6-arte-museografia'],
    difficulty: 'Intermedio',
    tags: ['tracking', 'orbit', '360', 'arc shot', 'parallax'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm6-mov-crane-pedestal',
    moduleId: 'mod-06',
    title: 'Crane Up / Crane Down, Jib Shot y Pedestal Up / Down',
    category: 'Movimientos de cámara',
    subcategory: 'A. Movimientos de cámara',
    description:
      'Elevaciones y descensos verticales de la cámara completa en el espacio (a diferencia del Tilt, que solo inclina el lente).',
    explanation:
      '• Pedestal Up/Down: sube o baja la columna vertical manteniendo el horizonte nivelado (ideal para revelar objetos detrás de una mesa o muro).\n• Crane / Jib Shot: movimiento amplio en arco ascendente o descendente que pasa de primer plano íntimo a vista panorámica del escenario.',
    visual_examples: [
      'Crane Up ascendiendo desde plaza vecinal hasta revelar la cordillera completa',
      'Pedestal Up elevándose detrás de mostrador hacia el artista',
    ],
    image: IMG.territory,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'crane-up' },
    technical_terms: ['Crane Up / Down', 'Jib sweep', 'Pedestal elevation'],
    prompt_examples: {
      es: 'Toma en grúa (Crane Up) que comienza a ras de suelo frente a un mural comunitario y asciende suavemente diez metros hasta revelar todo el barrio de ladera al atardecer.',
      en: 'Majestic Crane-Up shot beginning at street level before a community mural and smoothly rising high into the air to reveal the entire terraced hillside neighborhood at golden hour.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Majestic crane-up movement revealing the expansive environment',
    },
    related_topics: ['m6-mov-fpv-drone', 'm6-mov-pan-tilt'],
    difficulty: 'Intermedio',
    tags: ['crane up', 'crane down', 'jib', 'pedestal'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm6-mov-zoom-rack',
    moduleId: 'mod-06',
    title: 'Zoom In / Zoom Out y Rack Focus (Trasfoco)',
    category: 'Movimientos de cámara',
    subcategory: 'A. Movimientos de cámara',
    description:
      'Cambios puramente ópticos sin mover la cámara de sitio: variación de distancia focal (Zoom) o salto selectivo de nitidez entre planos (Rack Focus).',
    explanation:
      '• Zoom In / Out: cambia el ángulo de visión y compresión sin paralaje.\n• Rack Focus: traslada el foco nítido desde un objeto cercano (ej. pincel en primer plano) hacia el rostro desenfocado al fondo (o viceversa) guiando la atención narrativa.',
    visual_examples: [
      'Rack focus desde gota de tinta en primer plano hacia el ojo del ilustrador',
    ],
    image: IMG.compFocal,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'rack-focus' },
    technical_terms: ['Optical Zoom In/Out', 'Rack focus / Focus pull', 'Selective plane shift'],
    prompt_examples: {
      es: 'Toma fija cinematográfica con Rack Focus progresivo: el enfoque inicia nítido en una taza humeante en primer plano y se desplaza suavemente hacia la mujer que escribe junto a la ventana en segundo plano.',
      en: 'Locked-off cinematic shot with smooth Rack Focus pull: sharp focus starts on a steaming ceramic cup in the foreground and glides cleanly to a woman writing by the window in the background.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Smooth cinematic rack focus pulling attention from foreground detail to background subject',
    },
    related_topics: ['m2-param-apertura', 'm6-efecto-dolly-zoom'],
    difficulty: 'Intermedio',
    tags: ['zoom in', 'zoom out', 'rack focus', 'trasfoco'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm6-mov-whip-roll',
    moduleId: 'mod-06',
    title: 'Whip Pan (Barrido Rápido) y Camera Roll (Rotación sobre Eje Z)',
    category: 'Movimientos de cámara',
    subcategory: 'A. Movimientos de cámara',
    description:
      'Giros expresivos de alta energía o desorientación controlada: barrido veloz horizontal (Whip Pan) o rotación circular del horizonte (Camera Roll).',
    explanation:
      '• Whip Pan: sirve para transiciones dinámicas entre dos sujetos o escenas con desenfoque direccional.\n• Camera Roll: gira la imagen sobre el eje del lente creando efecto de sueño, gravedad alterada o coreografía experimental.',
    visual_examples: [
      'Camera roll lento de 45° dentro de instalación de espejos y luz',
    ],
    image: IMG.loop,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'roll' },
    technical_terms: ['Whip pan swish', 'Z-axis Camera Roll', 'Dutch rotation'],
    prompt_examples: {
      es: 'Secuencia experimental con Camera Roll lento y continuo sobre el eje óptico mientras partículas doradas flotan en cámara lenta dentro de un espacio arquitectónico oscuro.',
      en: 'Experimental sequence featuring a slow continuous Z-axis Camera Roll as fine golden dust motes drift gently across a dark architectural gallery.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Slow hypnotic Z-axis camera roll through atmospheric light',
    },
    related_topics: ['m6-mov-fpv-drone', 'm6-continuidad-transiciones'],
    difficulty: 'Avanzado',
    tags: ['whip pan', 'camera roll', 'rotación'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm6-mov-handheld-steadicam',
    moduleId: 'mod-06',
    title: 'Handheld (Cámara en Mano) y Steadicam (Flujo Estabilizado)',
    category: 'Movimientos de cámara',
    subcategory: 'A. Movimientos de cámara',
    description:
      'Dos filosofías físicas de acompañamiento: vibración orgánica humana (Handheld) frente a deslizamiento flotante ininterrumpido (Steadicam / Gimbal).',
    explanation:
      '• Handheld: aporta urgencia documental, respiración y presencia íntima.\n• Steadicam: atraviesa puertas, pasillos y multitudes en plano secuencia con fluidez hipnótica.',
    visual_examples: [
      'Steadicam siguiendo a un personaje que entra desde la calle iluminada al interior del estudio',
      'Handheld sutil en conversación documental callejera',
    ],
    image: IMG.videoRig,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'steadicam' },
    technical_terms: ['Steadicam tracking', 'Organic handheld', 'Single-take flow'],
    prompt_examples: {
      es: 'Plano secuencia fluido con Steadicam siguiendo por detrás y ligeramente de lado a una artista mientras atraviesa un pasillo industrial hacia un patio soleado lleno de esculturas.',
      en: 'Fluid Steadicam continuous tracking shot following an artist from slightly behind as she walks through a dim industrial corridor into a sunlit sculpture courtyard.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Steadicam tracking shot moving parallel to the movement',
    },
    related_topics: ['m6-mov-orbit-arc', 'm6-continuidad-transiciones'],
    difficulty: 'Intermedio',
    tags: ['handheld', 'steadicam', 'gimbal', 'cámara en mano'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm6-mov-fpv-drone',
    moduleId: 'mod-06',
    title: 'Drone Shot (Aéreo Estabilizado) y FPV Flythrough',
    category: 'Movimientos de cámara',
    subcategory: 'A. Movimientos de cámara',
    description:
      'Vuelo aéreo cinematográfico amplio (Drone Shot) o travesía ágil inmersiva atravesando aberturas, bosques o galerías (FPV Flythrough).',
    explanation:
      'Especifica siempre la velocidad de vuelo ("gentle slow drone glide" vs "dynamic FPV flythrough") para evitar que la IA genere movimientos vertiginosos incoherentes o geometría rota.',
    visual_examples: [
      'Drone lento deslizándose sobre neblina entre montañas al amanecer',
      'FPV suave entrando por un arco de ladrillo hacia un patio interior',
    ],
    image: IMG.territory,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'fpv' },
    technical_terms: ['Aerial Drone glide', 'FPV Flythrough', 'Continuous spatial traversal'],
    prompt_examples: {
      es: 'Vuelo suave FPV Flythrough a velocidad controlada entrando por un gran ventanal abierto hacia el interior de una biblioteca antigua mientras rayos de sol matinal cruzan las estanterías.',
      en: 'Controlled-pace FPV flythrough gliding smoothly through an open arched window into an old timber library bathed in morning sunbeams.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Dynamic FPV flythrough traversing through architectural space',
    },
    related_topics: ['m6-mov-crane-pedestal', 'm6-arte-museografia'],
    difficulty: 'Intermedio',
    tags: ['drone', 'fpv', 'flythrough', 'aéreo'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },

  // B. Velocidad y temporalidad
  {
    id: 'm6-vel-temporalidad',
    moduleId: 'mod-06',
    title: 'Tiempo Real, Slow Motion, Super Slow Motion, Time-Lapse y Hyperlapse',
    category: 'Velocidad y temporalidad',
    subcategory: 'B. Velocidad y temporalidad',
    description:
      'Control del ritmo temporal en video generativo: cadencia real (24fps), dilatación poética (Slow Motion / 120fps) o compresión del paso del tiempo (Time-Lapse / Hyperlapse).',
    explanation:
      'Incluye también Motion Blur natural, Freeze Frame, Fast Motion, Speed Ramp (cambio de rápido a lento en un momento clave) y Loop Continuo (frame final idéntico al inicial).',
    visual_examples: [
      'Super Slow Motion de pigmentos minerales cayendo en agua cristalina',
      'Time-Lapse de sombras solares moviéndose sobre muro de ladrillo',
    ],
    image: IMG.loop,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'tracking' },
    technical_terms: ['24fps Real-time', '120fps Slow Motion', 'Time-Lapse / Hyperlapse', 'Speed Ramp', 'Seamless Loop'],
    prompt_examples: {
      es: 'Secuencia en Super Slow Motion (120fps) de manos vertiendo arena dorada y pigmento terracota sobre una mesa de piedra oscura, cada grano suspendido con nitidez física bajo luz lateral.',
      en: 'Super Slow Motion 120fps sequence of hands pouring fine golden sand and terracotta pigment over dark stone, individual grains drifting cleanly through directional side light.',
    },
    builderPatch: {
      mode: 'video',
      fps: '120 fps (Slow Motion)',
      motion: 'Seamless loop where final frame matches first frame with constant inertia',
    },
    related_topics: ['m6-efecto-particulas-atmos', 'm6-continuidad-transiciones'],
    difficulty: 'Básico',
    tags: ['tiempo real', 'slow motion', 'super slow motion', 'time-lapse', 'hyperlapse', 'speed ramp', 'loop', 'freeze frame'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },

  // C. Animación y movimiento
  {
    id: 'm6-animacion-hibrida',
    moduleId: 'mod-06',
    title: 'Imagen a Video, Stop Motion, Cut-out, Pintura Animada y Escultura en Profundidad',
    category: 'Animación y movimiento',
    subcategory: 'C. Animación y movimiento',
    description:
      'Cómo dar vida respetuosa a obras fijas: desde animación 2D/3D y stop motion en plastilina/papel hasta cinemagraphs sutiles o recorridos por cuadros.',
    explanation:
      'Especialidad clave para artistas y museos: en "Animación sutil / Cinemagraph" solo se mueve un elemento (agua, humo, tela, luz) manteniendo estable la obra; en "Animación de escultura" la cámara orbita respetando el volumen sin deformarlo.',
    visual_examples: [
      'Stop Motion artesanal con recortes de papel y textura táctil (12fps)',
      'Cinemagraph donde solo la luz de vela y la cortina respiran suavemente',
    ],
    image: IMG.artwork,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'parallax' },
    technical_terms: ['Image-to-Video', 'Stop motion 12fps', 'Cut-out collage', 'Cinemagraph subtle motion', 'Kinetic sculpture'],
    prompt_examples: {
      es: 'Animación artesanal Stop Motion a 12 cuadros por segundo de un diorama hecho en papel recortado y cartón reciclado mostrando un bosque de niebla vivo, ligera textura táctil en cada fotograma.',
      en: 'Handcrafted Stop Motion animation at 12fps of a layered cut-paper and cardboard diorama portraying a living cloud forest, authentic tactile miniature lighting.',
    },
    builderPatch: {
      mode: 'video',
      genre: '/artfilm',
      visualStyle: 'Stop Motion & Pintura Animada',
    },
    related_topics: ['m6-arte-museografia', 'm1-collage-surrealista'],
    difficulty: 'Intermedio',
    tags: ['stop motion', '2D', '3D', 'cut-out', 'cinemagraph', 'rotoscopia', 'pintura animada', 'arte generativo'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },

  // D. Efectos cinematográficos
  {
    id: 'm6-efecto-anamorfico',
    moduleId: 'mod-06',
    title: 'Efectos Ópticos: Bokeh Dinámico, Lens Flare, Anamórfico, Profundidad y Dolly Zoom',
    category: 'Efectos cinematográficos',
    subcategory: 'D. Efectos cinematográficos',
    description:
      'Lenguaje visual óptico en movimiento: destellos de lente controlados, cambio de desenfoque, compresión espacial y el célebre Dolly Zoom (efecto vértigo).',
    explanation:
      '• Dolly Zoom: la cámara retrocede físicamente mientras el lente hace zoom hacia adelante (el sujeto conserva tamaño pero el fondo se comprime dramáticamente).\n• Optical Lens Flare: destello sutil al rozar una fuente luminosa real sin tapar la escena.',
    visual_examples: [
      'Lens flare anamórfico sutil cuando el personaje cruza frente a un proyector',
    ],
    image: IMG.studio,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'zoom' },
    technical_terms: ['Dynamic bokeh', 'Anamorphic streak flare', 'Dolly Zoom / Vertigo', 'Rack focus'],
    prompt_examples: {
      es: 'Toma cinematográfica con Dolly Zoom sutil sobre un protagonista inmóvil en el centro de una avenida nocturna mientras las luces de fondo se expanden en bokeh anamórfico cálido.',
      en: 'Cinematic shot executing a subtle Dolly Zoom on a stationary protagonist in the center of a quiet evening avenue while distant streetlights swell into warm anamorphic bokeh.',
    },
    builderPatch: {
      mode: 'video',
      lens: 'Cooke 40mm anamorphic prime lens',
      motion: 'Subtle cinematic Dolly Zoom shifting background perspective while subject stays centered',
    },
    related_topics: ['m6-efecto-particulas-atmos', 'm2-optica-tilt-shift'],
    difficulty: 'Avanzado',
    tags: ['dolly zoom', 'lens flare', 'bokeh dinámico', 'anamórfico', 'cambio de foco'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },
  {
    id: 'm6-efecto-particulas-atmos',
    moduleId: 'mod-06',
    title: 'Atmósfera en Movimiento: Niebla, Polvo, Lluvia, Reflejos, Humo y Grano',
    category: 'Efectos cinematográficos',
    subcategory: 'D. Efectos cinematográficos',
    description:
      'Microelementos físicos que dan vida real a la imagen en movimiento: lluvia real, humo ascendente, partículas suspendidas en haces de luz y reflejos en agua.',
    explanation:
      'En video generativo, añadir una micro-física atmosférica coherente (polvo en haz de luz, llovizna fina, ondas suaves sobre espejo de agua) evita escenas estáticas o artificiales.',
    visual_examples: [
      'Humo de incienso dibujando volutas lentas ante contraluz cálido',
      'Gotas de lluvia cayendo sobre charco con reflejo de neón suave',
    ],
    image: IMG.loop,
    diagramType: 'lighting',
    diagramConfig: { keyAngle: 150, fillLevel: 'low', rimActive: true },
    technical_terms: ['Floating dust motes', 'Volumetric haze drift', 'Rain reflections', 'Organic film grain'],
    prompt_examples: {
      es: 'Plano detalle cinematográfico de lluvia nocturna cayendo suavemente sobre un charco en calle adoquinada que refleja luces ámbar de faroles antiguos, leve niebla rasante y grano de película fino.',
      en: 'Cinematic close-up of steady evening rain rippling across a dark cobblestone puddle reflecting warm streetlamp amber, gentle ground mist and subtle organic film grain.',
    },
    builderPatch: {
      mode: 'video',
      atmosphere: 'Neblina sutil y partículas de polvo iluminadas',
    },
    related_topics: ['m3-practical-volumetric', 'm6-vel-temporalidad'],
    difficulty: 'Básico',
    tags: ['niebla', 'partículas', 'polvo', 'humo', 'lluvia', 'reflejos', 'iluminación volumétrica', 'grano'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },

  // E. Continuidad y transiciones
  {
    id: 'm6-continuidad-transiciones',
    moduleId: 'mod-06',
    title: 'Continuidad Visual, Match Cut, Whip Transition y Consistencia Temporal',
    category: 'Continuidad y transiciones',
    subcategory: 'E. Continuidad y transiciones',
    description:
      'Reglas para evitar morphing, saltos de rostro o cambios aleatorios de iluminación entre fotogramas o planos consecutivos.',
    explanation:
      '• Consistencia de sujeto, luz y color: describe un solo movimiento claro por clip (5–10 s).\n• Match Cut: une dos planos por forma o movimiento similar (ej. taza girando -> disco de vinilo girando).\n• Whip Transition / Light Transition / Morphing controlado: puentes visuales fluidos entre escenas.',
    visual_examples: [
      'Match cut geométrico entre cúpula arquitectónica y ojo en primer plano',
      'Transición mediante barrido oscuro detrás de columna (Invisible Wipe)',
    ],
    image: IMG.videoRig,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'whip-pan' },
    technical_terms: ['Temporal consistency', 'Match Cut', 'Invisible Wipe', 'Whip Transition', 'Morphing control'],
    prompt_examples: {
      es: 'Secuencia con transición invisible detrás de columna oscura (Invisible Wipe): la cámara hace Tracking lateral pasando de un taller de cerámica diurno hacia una sala de exposición nocturna manteniendo idéntica altura de lente y fluidez constante.',
      en: 'Continuous lateral tracking shot executing a seamless wipe behind a dark architectural pillar, transitioning smoothly from a sunlit ceramic studio into a dimly lit exhibition gallery at identical eye-level speed.',
    },
    builderPatch: {
      mode: 'video',
      motion: 'Continuous lateral tracking shot with seamless architectural wipe transition',
    },
    related_topics: ['m6-mov-handheld-steadicam', 'm6-mov-whip-roll'],
    difficulty: 'Avanzado',
    tags: ['continuidad', 'match cut', 'transición', 'morphing', 'consistencia', 'wipe'],
    source: 'Núcleo Colectivo · Video Lab',
    license: 'CC BY-NC-SA 4.0',
  },

  // F. Ejemplos aplicados (Arte, Museografía, Escultura, Pintura)
  {
    id: 'm6-arte-museografia',
    moduleId: 'mod-06',
    title: 'Ejemplos Aplicados: Pintura en Profundidad, Escultura 360° y Museografía',
    category: 'Aplicaciones en arte y museo',
    subcategory: 'F. Ejemplos de museografía y arte',
    description:
      'Plantillas especializadas para artistas visuales, curadores e instituciones culturales que transforman obra plástica o maquetas en recorrido audiovisual.',
    explanation:
      'Fórmula de Video Núcleo Colectivo:\n[Sujeto / Obra] + [Acción sutil / Atmósfera] + [Entorno museográfico] + [Movimiento único de cámara] + [Luz y color] + [Cadencia 24fps y regla de no deformar la obra].',
    visual_examples: [
      'Recorrido Dolly-In por capas 3D dentro de una pintura al óleo sin distorsionar pinceladas',
      'Instalación museográfica nocturna con haces de luz respirando suavemente',
    ],
    image: IMG.artwork,
    diagramType: 'camera-motion',
    diagramConfig: { motionType: 'dolly-in' },
    technical_terms: ['Museum gallery tour', '2.5D Painting parallax', 'Sculpture turntable orbit', 'No artwork distortion'],
    prompt_examples: {
      es: 'Recorrido museográfico cinematográfico dentro de una galería de arte contemporáneo minimalista: movimiento lento Dolly-In hacia una pintura abstracta de gran formato mientras la luz natural cambia suavemente sobre el suelo de concreto, manteniendo estricta fidelidad geométrica en la obra.',
      en: 'Cinematic museum gallery sequence: slow steady Dolly-In toward a large-scale textured abstract painting in a minimalist concrete exhibition hall while soft daylight shifts across the floor, preserving exact artwork geometry.',
    },
    builderPatch: {
      mode: 'video',
      genre: '/artfilm',
      camera: 'ARRI Alexa 35 (Cine Referente)',
      motion: 'Slow smooth dolly-in moving physically towards the subject',
    },
    related_topics: ['m1-arte-3d-escultura', 'm1-arte-tecnologia', 'm6-mov-orbit-arc'],
    difficulty: 'Intermedio',
    tags: ['museografía', 'pintura', 'escultura', 'galería', 'obra de arte', 'instalación'],
    source: 'Núcleo Colectivo · Curaduría Digital',
    license: 'CC BY-NC-SA 4.0',
  },
];

// ============================================================================
// COMPARACIONES VISUALES LADO A LADO (Usan imágenes reales generadas)
// ============================================================================
export interface VisualComparisonItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  leftLabel: string;
  leftSpecs: string;
  rightLabel: string;
  rightSpecs: string;
  lesson: string;
  relatedModule: string;
}

export const VISUAL_COMPARISONS: VisualComparisonItem[] = [
  {
    id: 'comp-focal',
    title: 'Distancia Focal y Compresión: 35mm vs 85mm',
    subtitle: 'Cómo cambia la proporción facial y la cercanía del fondo al cambiar de óptica',
    image: IMG.compFocal,
    leftLabel: '35mm Gran Angular Moderado',
    leftSpecs: 'Mayor contexto arquitectónico · Perspectiva abierta · Profundidad natural',
    rightLabel: '85mm Teleobjetivo de Retrato',
    rightSpecs: 'Fondo comprimido · Desenfoque cremoso · Rasgos estilizados',
    lesson:
      'A idéntica distancia de encuadre del rostro, 35mm incluye el lugar y la historia del entorno, mientras 85mm aísla al sujeto en un bokeh íntimo y comprime los edificios lejanos.',
    relatedModule: 'Módulo 02 · Lentes y Ópticas',
  },
  {
    id: 'comp-lighting',
    title: 'Dirección y Clave Lumínica: Rembrandt Low Key vs Butterfly High Key',
    subtitle: 'El impacto psicológico de mover la luz principal 45° laterales o elevarla frontalmente',
    image: IMG.compLight,
    leftLabel: 'Rembrandt Low Key (Izquierda)',
    leftSpecs: 'Luz lateral 45° · Triángulo en mejilla · Sombras densas y volumen',
    rightLabel: 'Butterfly High Key (Derecha)',
    rightSpecs: 'Luz frontal elevada · Relleno limpio · Estética luminosa editorial',
    lesson:
      'El mismo sujeto cambia completamente de narrativa sin tocar vestuario ni cámara: Rembrandt comunica introspección y peso dramático; High Key transmite claridad, moda y apertura.',
    relatedModule: 'Módulo 03 · Iluminación',
  },
  {
    id: 'comp-json',
    title: 'Transferencia de Estilo vía JSON: Fotografía Original vs Chiaroscuro Monochrome',
    subtitle: 'Aplicación de un perfil JSON técnico conservando rasgos, pose y expresión del sujeto',
    image: IMG.compJson,
    leftLabel: 'Fotografía Base Original',
    leftSpecs: 'Luz natural cotidiana · Color neutro · Entorno abierto',
    rightLabel: 'Estilo Aplicado (JSON Chiaroscuro)',
    rightSpecs: 'Monocromo plata gelatina · Fondo penumbra · Identidad 100% preservada',
    lesson:
      'Separar los parámetros de estilo en JSON (lighting, color, texture, preservation) permite reinterpretar la dirección de arte de una fotografía personal sin inventar otro rostro.',
    relatedModule: 'Módulo 07 · Laboratorio JSON Visual',
  },
];

// ============================================================================
// MÓDULO 07 — LABORATORIO JSON VISUAL (PDF 3: Guía Práctica JSON)
// ============================================================================
export interface JsonStyleProfile {
  id: string;
  style_name: string;
  category: string;
  photography: string;
  camera: string;
  lens: string;
  aperture: string;
  lighting: string;
  composition: string;
  color: string;
  focus: string;
  depth_of_field: string;
  texture: string;
  atmosphere: string;
  background: string;
  post_processing: string;
  observable_notes: string;
  preservation: {
    keep_subject_identity: boolean;
    keep_facial_features: boolean;
    keep_natural_pose: boolean;
  };
}

export const JSON_STYLE_PRESETS: JsonStyleProfile[] = [
  {
    id: 'chiaroscuro-monochrome',
    style_name: 'Chiaroscuro Monochrome (Referencia Guía PDF)',
    category: 'Chiaroscuro Monochrome',
    photography: 'editorial black and white portrait, expressive fine art photography',
    camera: 'estética equivalente a formato medio clásico de estudio',
    lens: '85mm portrait prime lens appearance',
    aperture: 'f/2.2 shallow separation',
    lighting: 'dramatic chiaroscuro, strong directional side light, deep sculpted shadows, subtle rim light',
    composition: 'close-up portrait, upper chest and shoulders visible, balanced negative space',
    color: 'monochrome black and white, deep velvety blacks, luminous highlights, silvery midtones',
    focus: 'tack-sharp focus on eyes and facial structure',
    depth_of_field: 'shallow, smooth background falloff',
    texture: 'natural skin pores, crisp fabric weave, subtle organic film grain',
    atmosphere: 'intimate, serious, timeless editorial mood',
    background: 'clean dark neutral background receding into soft shadow',
    post_processing: 'classic silver-gelatin contrast curve without harsh digital clipping',
    observable_notes: 'Basado en el ejemplo maestro de la Guía Práctica JSON de Núcleo Colectivo.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'retrato-editorial',
    style_name: 'Retrato Editorial Luz de Ventana',
    category: 'Retrato editorial',
    photography: 'contemporary magazine editorial portrait, natural candid poise',
    camera: 'apariencia estética full-frame editorial moderna',
    lens: '85mm f/1.8 prime aesthetic',
    aperture: 'f/2.0',
    lighting: 'soft north-facing window sidelight, gentle shadow transition, clean eye catchlight',
    composition: 'rule of thirds medium close-up with natural headroom',
    color: 'neutral warm skin tones, desaturated sage and mineral cream accents',
    focus: 'precise iris sharpness',
    depth_of_field: 'creamy selective separation',
    texture: 'authentic skin microtexture, visible linen fibers, zero plastic smoothing',
    atmosphere: 'calm, honest, cultural publication',
    background: 'softly blurred studio wall and organic plant silhouette',
    post_processing: 'subtle matte highlight roll-off, clean tonal balance',
    observable_notes: 'Ideal para retratos de artistas, gestores y entrevistas.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'neo-noir',
    style_name: 'Neo Noir Nocturno Urbano',
    category: 'Neo Noir',
    photography: 'cinematic neo-noir nocturnal portrait in urban rain atmosphere',
    camera: 'estética anamórfica de cine digital nocturno',
    lens: '40mm anamorphic prime look',
    aperture: 'T2.2',
    lighting: 'split mixed lighting: warm amber sodium streetlamp vs cool cyan shadow fill, crisp wet rim',
    composition: 'off-center cinematic 16:9 or 4:5 frame with foreground reflection',
    color: 'deep shadows, petrol teal blues, warm tungsten highlights',
    focus: 'sharp eyes with soft optical edge falloff',
    depth_of_field: 'shallow with oval night bokeh lights',
    texture: 'rain droplets, damp wool texture, fine cinema grain',
    atmosphere: 'mysterious, contemplative, rain-slicked night',
    background: 'out-of-focus wet street reflections and distant warm shopfront glow',
    post_processing: 'cinematic print film curve, rich shadow density',
    observable_notes: 'Evita sobresaturación neón manteniendo realismo atmosférico.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'fotografia-analogica',
    style_name: 'Fotografía Analógica Cálida 35mm',
    category: 'Fotografía analógica',
    photography: '35mm film street and portrait photography, intimate analog look',
    camera: 'apariencia estética de cámara mecánica 35mm',
    lens: '35mm prime natural perspective',
    aperture: 'f/2.8',
    lighting: 'late afternoon golden sunbeams, gentle natural bounce fill',
    composition: 'relaxed environmental framing showing personal context',
    color: 'warm organic palette inspired by Portra film aesthetics, gentle green-tinted shadows',
    focus: 'natural optical sharpness without digital oversharpening',
    depth_of_field: 'moderate environmental depth',
    texture: 'authentic fine silver-halide grain, soft halation on bright highlights',
    atmosphere: 'nostalgic, sunlit, unposed life',
    background: 'textured neighborhood architecture and foliage in soft golden haze',
    post_processing: 'soft lifted blacks, natural color warmth',
    observable_notes: 'La referencia fílmica es inspiración estética de tono y grano.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'cinematic-warm',
    style_name: 'Cinematic Warm Storytelling',
    category: 'Cinematic Warm',
    photography: 'warm narrative cinema frame, intimate film still',
    camera: 'estética de cámara de cine de gran formato',
    lens: '50mm vintage prime aesthetic',
    aperture: 'T2.0',
    lighting: 'warm practical tungsten interior light balanced with soft window daylight',
    composition: 'balanced narrative frame with subtle foreground depth layer',
    color: 'golden ochre, terracotta skin warmth, soft espresso shadows',
    focus: 'soft organic cinema focus on face',
    depth_of_field: 'cinematic falloff with smooth transition',
    texture: 'subtle film weave, soft skin rendering, warm atmospheric dust',
    atmosphere: 'welcoming, poetic, dramatic warmth',
    background: 'warm timber studio interior out of focus',
    post_processing: 'soft highlight roll-off, rich warm midtones',
    observable_notes: 'Recomendado para escenas de talleres, oficios y memoria.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'documental-urbano',
    style_name: 'Documental Urbano y Territorio',
    category: 'Documental urbano',
    photography: 'authentic territorial documentary photography, honest unposed reality',
    camera: 'estética de reportaje compacto 35mm',
    lens: '28mm–35mm reportage wide angle',
    aperture: 'f/5.6',
    lighting: 'available natural overcast or early morning daylight',
    composition: 'contextual environmental framing with clear human-territory relationship',
    color: 'true-to-life natural hues, brick terracotta, foliage greens, realistic sky',
    focus: 'deep clear focus across subject and immediate surroundings',
    depth_of_field: 'moderate-to-deep documentary clarity',
    texture: 'crisp architectural stone, brick, natural clothing and skin',
    atmosphere: 'dignified, grounded, everyday community life',
    background: 'detailed street, facade or hillside community environment',
    post_processing: 'minimal natural contrast adjustment, zero HDR artifacts',
    observable_notes: 'Diseñado para documentar sin artificialidad ni filtros plásticos.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'fashion-editorial',
    style_name: 'Fashion Editorial High Contrast',
    category: 'Fashion Editorial',
    photography: 'high-fashion magazine editorial shoot, sculptural styling clarity',
    camera: 'apariencia estética formato medio de moda',
    lens: '50mm–85mm studio prime',
    aperture: 'f/4.0',
    lighting: 'crisp directional key light with subtle silver fill, sculpted cheekbones and garment folds',
    composition: 'asymmetrical editorial framing with generous architectural negative space',
    color: 'refined monochrome or muted alabaster, charcoal and warm camel tones',
    focus: 'razor-sharp eyes and garment textile weave',
    depth_of_field: 'controlled medium-format separation',
    texture: 'crisp wool, silk or linen fibers, authentic natural skin luster',
    atmosphere: 'bold, contemporary, architectural poise',
    background: 'minimalist plaster wall or brutalist concrete geometry',
    post_processing: 'clean editorial microcontrast and crisp neutral whites',
    observable_notes: 'Evita suavizado excesivo de piel conservando textura editorial.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'fotografia-producto',
    style_name: 'Fotografía de Producto Escultórica',
    category: 'Fotografía de producto',
    photography: 'luxury commercial still life and product photography',
    camera: 'estética de cámara técnica de estudio de alta resolución',
    lens: '100mm macro commercial lens look',
    aperture: 'f/8.0',
    lighting: 'large diffused overhead softbox with crisp side strip light tracing glass/metal edges',
    composition: 'minimalist centered or golden-ratio pedestal placement',
    color: 'controlled neutral mineral grays, warm amber highlights and pure product color accuracy',
    focus: 'edge-to-edge sharpness across primary object label and materials',
    depth_of_field: 'deep focus on object, soft gradient behind',
    texture: 'mineral stone pores, fine water condensation, brushed metal grain',
    atmosphere: 'tactile, refined, commercial luxury',
    background: 'dark basalt slab or travertine plinth with soft falloff',
    post_processing: 'clean specular highlight control without blown whites',
    observable_notes: 'Pensado para objetos, artesanías, envases y prototipos.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'experimental-luz',
    style_name: 'Experimental Prism & Double Exposure',
    category: 'Experimental',
    photography: 'experimental fine art photography with glass prism refraction and subtle motion',
    camera: 'estética fotográfica experimental híbrida',
    lens: '50mm vintage glass with optical flare',
    aperture: 'f/2.0',
    lighting: 'directional shaft of sunlight passing through optical glass prism casting soft spectral light',
    composition: 'poetic off-balance framing with ethereal light foreground veils',
    color: 'luminous warm highlights, subtle spectral amber-violet refraction, soft shadows',
    focus: 'selective soft-sharp focus centered on one eye',
    depth_of_field: 'extremely shallow dreamy optical transitions',
    texture: 'organic light bloom, soft atmospheric grain',
    atmosphere: 'poetic, sensory, avant-garde gallery piece',
    background: 'abstract light refractions melting softly into dark warm tones',
    post_processing: 'gentle analog bloom without digital saturation clipping',
    observable_notes: 'Combina realismo humano con óptica experimental física.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
  {
    id: 'surrealismo-digital',
    style_name: 'Surrealismo Poético Museográfico',
    category: 'Surrealismo digital',
    photography: 'photorealistic poetic surrealism artwork, museum exhibition quality',
    camera: 'apariencia estética formato medio gran angular',
    lens: '35mm crisp lens aesthetic',
    aperture: 'f/5.6',
    lighting: 'ethereal twilight directional glow piercing through low mist',
    composition: 'monumental balanced perspective with unexpected scale juxtaposition',
    color: 'muted slate blue, bone cream, warm ochre accents',
    focus: 'crisp believable material sharpness across impossible elements',
    depth_of_field: 'deep atmospheric layering',
    texture: 'tactile stone, drifting mist, believable surface imperfections',
    atmosphere: 'enigmatic, quiet, contemplative surrealism',
    background: 'vast misty horizon or dreamlike minimalist architecture',
    post_processing: 'painterly museum tone curve, controlled natural contrast',
    observable_notes: 'Mantiene verosimilitud física de luz aunque la escena sea onírica.',
    preservation: {
      keep_subject_identity: true,
      keep_facial_features: true,
      keep_natural_pose: true,
    },
  },
];

export const READY_PROMPTS_PDF3 = [
  {
    id: 'p1-extraer',
    title: 'Prompt 1 · Extraer JSON de una fotografía de referencia',
    description: 'Úsalo cuando subas una imagen inspiradora para capturar únicamente su estética en JSON limpio.',
    prompt: `Analiza únicamente el estilo visual y fotográfico de esta imagen de referencia.
Devuelve exclusivamente un objeto JSON válido que describa el estilo reutilizable (lighting, composition, color, camera, lens, aperture, focus, depth_of_field, texture, atmosphere, background, post_processing y preservation).
Reglas: No describas rasgos personales del sujeto ni su identidad; expresa el equivalente óptico de cámara/lente como apariencia estética observable, sin inventar datos EXIF ocultos.`,
  },
  {
    id: 'p2-aplicar',
    title: 'Prompt 2 · Aplicar JSON sobre tu fotografía conservando identidad',
    description: 'Úsalo en ChatGPT o editores multimodales junto con tu foto personal y el JSON generado.',
    prompt: `Aplica exactamente el siguiente estilo fotográfico en formato JSON a la fotografía adjunta.
REGLA CRÍTICA: Conserva fielmente la identidad, rostro, rasgos faciales, proporción corporal, expresión y pose natural de la persona en la foto original. No cambies su edad ni inventes rasgos nuevos.
Reconstruye únicamente la iluminación, colorimetría, textura fotográfica, atmósfera, profundidad de campo y estética de fondo definidas en este JSON:`,
  },
  {
    id: 'p3-formato',
    title: 'Prompt 3 · Variar formato (Vertical 9:16) sin romper el estilo',
    description: 'Adapta la escena a historias, afiches o Reels conservando el mismo perfil JSON.',
    prompt: `Mantén exactamente el mismo estilo visual JSON y la identidad intacta del sujeto de la fotografía original, pero adapta el encuadre a formato vertical 9:16 ampliando de manera natural el espacio superior e inferior del fondo con la misma iluminación y atmósfera.`,
  },
  {
    id: 'p4-iluminacion',
    title: 'Prompt 4 · Ajustar únicamente iluminación y textura sin tocar encuadre',
    description: 'Modifica solo la clave lumínica manteniendo intactos sujeto, ropa y composición.',
    prompt: `Conserva la identidad del sujeto, el encuadre y la composición de la foto original, pero modifica únicamente la dirección de luz y el microcontraste siguiendo los campos lighting, texture y post_processing del JSON adjunto.`,
  },
  {
    id: 'p5-comparar',
    title: 'Prompt 5 · Comparar dos estilos JSON lado a lado',
    description: 'Evalúa cuál perfil visual funciona mejor para tu proyecto o taller.',
    prompt: `Compara técnicamente estos dos perfiles JSON (Estilo A vs Estilo B) explicando qué cambia en dirección de luz, contraste, temperatura cromática, sensación espacial y qué tipo de narrativa o proyecto cultural favorece cada uno.`,
  },
];

export const JSON_TROUBLESHOOTING = [
  {
    problem: 'Cambia el rostro o altera la identidad',
    cause: 'El JSON incluyó descripciones de otro sujeto o faltó la regla de preservación.',
    solution:
      'Activa keep_subject_identity, keep_facial_features y keep_natural_pose en true y añade: "No alteres rasgos faciales ni proporciones de la persona original".',
  },
  {
    problem: 'La piel luce plástica, cerosa o sobre-suavizada',
    cause: 'Falta especificar microtextura orgánica o el modelo exageró estética "beauty".',
    solution:
      'Incluye en texture: "natural skin pores, realistic skin microtexture, subtle film grain" y evita palabras como "flawless" o "airbrushed".',
  },
  {
    problem: 'Iluminación plana sin volumen ni relieve',
    cause: 'Descripción ambigua de luz ("good lighting") sin ángulo ni contraste.',
    solution:
      'Define dirección exacta (45° side light, chiaroscuro, rim light) y relación entre altas luces y sombras.',
  },
  {
    problem: 'Negros lavados o grises sin fuerza en blanco y negro',
    cause: 'Falta definir curva tonal en color y post_processing.',
    solution:
      'Especifica: "deep velvety blacks with subtle shadow detail, silvery midtones, luminous highlights, silver-gelatin curve".',
  },
  {
    problem: 'Fondo artificial o recorte tipo collage falso',
    cause: 'Desconexión entre la luz del sujeto y la iluminación del nuevo entorno.',
    solution:
      'Asegura que el campo background comparta la misma fuente y temperatura de luz y añade "natural depth-of-field falloff".',
  },
  {
    problem: 'Desenfoque exagerado o irreal (efecto recorte)',
    cause: 'Apertura extrema mal equilibrada con el plano general.',
    solution:
      'Usa aperturas realistas como f/2.0–f/2.8 en primer plano o f/4.0–f/5.6 en planos medios con transición progresiva.',
  },
  {
    problem: 'El JSON queda demasiado largo o contradictorio',
    cause: 'Se mezclaron instrucciones de día soleado con estética nocturna o múltiples estilos.',
    solution:
      'Simplifica a 10–14 claves limpias y coherentes entre sí; usa el comparador para eliminar redundancias.',
  },
];

export const FOLDER_STRUCTURE_SUGGESTION = `nucleo-colectivo-json-lab/
├── 01-referencias-visuales/
│   ├── retrato-editorial.jpg
│   └── chiaroscuro-referencia.jpg
├── 02-perfiles-json/
│   ├── chiaroscuro_monochrome.json
│   ├── retrato_editorial.json
│   └── documental_urbano.json
├── 03-fotos-base-taller/
│   └── participante_01_original.jpg
└── 04-resultados-y-fichas/
    ├── participante_01_chiaroscuro.png
    └── ficha_tecnica_taller.pdf`;
