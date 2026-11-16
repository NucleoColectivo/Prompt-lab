export type InteractiveAreaId =
  | 'videoarte'
  | 'vision-tracking'
  | 'museos-cultura'
  | 'audio-reactivo'
  | 'artes-escenicas'
  | 'educacion'
  | 'accesibilidad-salud'
  | 'comercio-marca'
  | 'webxr-ar';

export interface InteractiveAreaCase {
  id: InteractiveAreaId;
  code: string;
  area: string;
  headline: string;
  description: string;
  inputs: string[];
  processing: string[];
  outputs: string[];
  recommendedTools: string[];
  sampleUseCases: string[];
  defaultPreset: {
    sensor: string;
    engine: string;
    stack: string;
    concept: string;
  };
}

export interface SensorCapability {
  id: string;
  name: string;
  landmarksOrMetric: string;
  apiOrLib: string;
  privacyNote: string;
  bestFor: string;
  latency: string;
}

export interface PlayableExperimentPreset {
  id: 'mugevi-air-piano' | 'ipd-grid' | 'shy-machine-fft' | 'rain-room-silhouette' | 'caosmosis-videoart';
  title: string;
  subtitle: string;
  inspiration: string;
  studioMode: 'camera-motion' | 'hand-face-hud' | 'audio-reactive' | 'video-art';
  gestureSubMode: 'air-piano' | 'ipd-grid' | 'sculpture-wah';
  artStyle: 'particles' | 'feedback' | 'scanline' | 'duotone';
  paletteChoice: 'nucleo-gold' | 'violet-electric' | 'mono-chrome';
  symmetry: 1 | 2 | 4 | 8;
  feedbackAmount: number;
  rgbShift: number;
  interactionHint: string;
}

export interface InteractiveArtReference {
  id: string;
  title: string;
  artistOrGroup: string;
  originYear: string;
  category: 'LATAM & España' | 'Instalación Global' | 'Investigación NIME';
  sensorAndStack: string;
  pipelineFormula: string;
  summary: string;
  url: string;
  presetId: PlayableExperimentPreset['id'];
}

export const PLAYABLE_EXPERIMENTS: PlayableExperimentPreset[] = [
  {
    id: 'mugevi-air-piano',
    title: 'MuGeVI · Air Piano & Filtro (21 pts)',
    subtitle: 'Instrumento gestual sin sensores dedicados (NIME 2023)',
    inspiration: 'Basado en Yang et al. (2023): pinza Pulgar(4)–Índice(8) dispara notas; altura Y modula filtro Wah-Wah.',
    studioMode: 'hand-face-hud',
    gestureSubMode: 'air-piano',
    artStyle: 'particles',
    paletteChoice: 'nucleo-gold',
    symmetry: 4,
    feedbackAmount: 0.84,
    rgbShift: 4,
    interactionHint:
      'Mueve mano o cursor horizontalmente entre las 8 zonas musicales (C4–E5) y cierra la pinza o haz clic/tap para disparar notas reales con filtro Wah-Wah vertical.',
  },
  {
    id: 'ipd-grid',
    title: 'IPD · Cuadrícula Gestual',
    subtitle: 'Cartel tipográfico reactivo a palma abierta y agarre',
    inspiration: 'Inspirado en Interactive Poster Design (IPD): palma abierta expande la grilla; pinza/agarre deforma celdas.',
    studioMode: 'hand-face-hud',
    gestureSubMode: 'ipd-grid',
    artStyle: 'duotone',
    paletteChoice: 'violet-electric',
    symmetry: 2,
    feedbackAmount: 0.82,
    rgbShift: 3,
    interactionHint:
      'Recorre la retícula para despertar nodos geométricos; presiona o cierra la pinza para contraer las celdas locales como un póster interactivo.',
  },
  {
    id: 'shy-machine-fft',
    title: 'The Shy Machine & AURA · Escultura FFT',
    subtitle: 'Poliedro de 12 caras reactivo a voz, música o sintetizador',
    inspiration: 'Inspirado en Daric Gill (The Shy Machine) y Alex Rex (AURA): geometría y varillas responden al espectro FFT.',
    studioMode: 'audio-reactive',
    gestureSubMode: 'sculpture-wah',
    artStyle: 'feedback',
    paletteChoice: 'nucleo-gold',
    symmetry: 4,
    feedbackAmount: 0.88,
    rgbShift: 6,
    interactionHint:
      'Activa tu micrófono, sube un archivo MP3/WAV o enciende el Sintetizador Interno: los graves expanden la escultura de 12 caras y los agudos vibran en el anillo.',
  },
  {
    id: 'rain-room-silhouette',
    title: 'Rain Room & Sanctuary · Silueta & Lluvia',
    subtitle: 'Campo de partículas que evade o sigue el movimiento corporal',
    inspiration: 'Inspirado en Random International (Rain Room) y Chris Milk (Treachery of Sanctuary).',
    studioMode: 'camera-motion',
    gestureSubMode: 'sculpture-wah',
    artStyle: 'particles',
    paletteChoice: 'mono-chrome',
    symmetry: 1,
    feedbackAmount: 0.85,
    rgbShift: 2,
    interactionHint:
      'Activa la cámara o mueve el cursor para proyectar ondas de flujo óptico que desvían partículas luminosas en tiempo real.',
  },
  {
    id: 'caosmosis-videoart',
    title: 'Caósmosis · Espectrograma & Videoarte',
    subtitle: 'Feedback loop cromático, simetría 8x y desplazamiento RGB',
    inspiration: 'Inspirado en Caósmosis (Luis Clériga & OTONO, Colombia/México) y síntesis de video analógico-digital.',
    studioMode: 'video-art',
    gestureSubMode: 'sculpture-wah',
    artStyle: 'feedback',
    paletteChoice: 'violet-electric',
    symmetry: 8,
    feedbackAmount: 0.94,
    rgbShift: 10,
    interactionHint:
      'Combina video en vivo o archivo MP4 con audio reactivo para generar espejos caleidoscópicos y escaneos RGB continuos.',
  },
];

export const SENSOR_CAPABILITIES: SensorCapability[] = [
  {
    id: 'hand-tracking',
    name: 'Tracking de Manos (21 Keypoints)',
    landmarksOrMetric: '21 puntos articulares por mano (0: muñeca, 4: pulgar, 8: índice, x/y/z)',
    apiOrLib: '@mediapipe/tasks-vision (HandLandmarker) / ml5.handPose',
    privacyNote: 'Inferencia local en navegador (WASM / WebGL), sin enviar video a servidores.',
    bestFor:
      'Air piano con pinza (MuGeVI), cuadrículas interactivas (IPD), modelado 3D en el aire e interfaces sin contacto.',
    latency: '~15–25 ms (30–60 fps)',
  },
  {
    id: 'face-tracking',
    name: 'Tracking Facial & Expresión',
    landmarksOrMetric: '478 puntos de malla facial + orientación Yaw/Pitch + blendshapes',
    apiOrLib: '@mediapipe/tasks-vision (FaceLandmarker) / TensorFlow.js',
    privacyNote: 'Procesamiento volátil en memoria sin almacenar biometría ni rostros.',
    bestFor:
      'Avatares reactivos, máscaras generativas de videoarte, control de cámara por inclinación y accesibilidad sin manos.',
    latency: '~18–30 ms',
  },
  {
    id: 'optical-motion',
    name: 'Cámara · Flujo Óptico y Silueta',
    landmarksOrMetric: 'Diferencia de luminancia entre fotogramas + centroide de movimiento',
    apiOrLib: 'MediaDevices getUserMedia + Canvas 2D / WebGL',
    privacyNote: 'Procesamiento matemático por píxel; funciona incluso sin modelos ML pesados.',
    bestFor:
      'Partículas reactivas al público (Rain Room), espejos generativos, videoarte con feedback y disparo por presencia.',
    latency: '< 10 ms (60 fps)',
  },
  {
    id: 'microphone-fft',
    name: 'Micrófono & Audio · Análisis FFT + Filtros',
    landmarksOrMetric: 'Bandas Graves / Medios / Agudos + RMS + filtro Biquad Wah-Wah en vivo',
    apiOrLib: 'Web Audio API (AnalyserNode + BiquadFilterNode) / Tone.js',
    privacyNote: 'Audio procesado localmente en tiempo real sin grabación automática.',
    bestFor:
      'Visualizadores audioreactivos, tipografía cinética al ritmo de la voz y efectos en tiempo real sobre instrumentos.',
    latency: '< 8 ms (tiempo real)',
  },
  {
    id: 'pose-body',
    name: 'Cuerpo Completo & Captura Escénica',
    landmarksOrMetric: '33 puntos esqueléticos corporales + silueta de profundidad',
    apiOrLib: 'MediaPipe PoseLandmarker / MoveNet / Kinect / Leap Motion',
    privacyNote: 'Proyección de esqueletos abstractos o siluetas de luz para preservar privacidad en sala.',
    bestFor: 'Danza contemporánea interactiva, teatro multimedia, proyecciones arquitectónicas y museografía.',
    latency: '~20–35 ms',
  },
  {
    id: 'webxr-spatial',
    name: 'Realidad Extendida (WebXR, AR.js & 3D)',
    landmarksOrMetric: 'Pose 6DoF en espacio físico, marcadores impresos e inmersión VR/AR web',
    apiOrLib: 'WebXR Device API / Three.js / A-Frame / AR.js',
    privacyNote: 'Ejecución directa en navegador móvil o visor XR sin instalar apps nativas.',
    bestFor:
      'Esculturas AR sobre carteles o libros de arte, galerías virtuales VR y experiencias espaciales multiplataforma.',
    latency: '60–90 fps XR',
  },
];

export const INTERACTIVE_AREAS_CATALOG: InteractiveAreaCase[] = [
  {
    id: 'videoarte',
    code: '01 · VIDEOARTE & LIVE VISUALS',
    area: 'Videoarte, Glitch y Visuales en Vivo',
    headline: 'Sintetizadores de video, feedback loops y visuales reactivos en tiempo real',
    description:
      'Construye piezas audiovisuales donde la señal de cámara, el ruido generativo y el sonido dialogan en directo sin depender de renders pregrabados.',
    inputs: ['Cámara en vivo / Video MP4', 'Micrófono / Línea de audio', 'Controladores MIDI / Teclado'],
    processing: ['Retroalimentación (Feedback Loop)', 'Shaders GLSL', 'Desplazamiento RGB y caleidoscopio'],
    outputs: ['Proyección en gran formato', 'Pantallas LED / CRT', 'Captura de fotogramas PNG / WebM'],
    recommendedTools: ['Hydra Video Synth', 'TouchDesigner', 'Resolume Arena', 'Cables.gl', 'Shaders GLSL'],
    sampleUseCases: [
      'Espejo de retroalimentación analógico-digital que multiplica el movimiento del visitante',
      'Live coding visual sincronizado con set de música electrónica o experimental',
      'Generador de texturas cromáticas y escaneos para videoclips independientes',
    ],
    defaultPreset: {
      sensor: 'Cámara (Flujo óptico) + Micrófono FFT',
      engine: 'Canvas 2D / Shaders GLSL con Feedback Loop y RGB Split',
      stack: 'React + TypeScript + Canvas + Web Audio API',
      concept: 'Instalación de videoarte generativo con estelas cromáticas y eco temporal reactivo al sonido ambiente',
    },
  },
  {
    id: 'vision-tracking',
    code: '02 · COMPUTER VISION & MUGeVI',
    area: 'Tracking de Manos, Cara y Cuerpo',
    headline: 'Aplicaciones web con seguimiento gestual (21 pts) y reconocimiento facial sin sensores extra',
    description:
      'Usa la webcam estándar para detectar dedos, pinzas pulgar–índice (MuGeVI), conteo gestual 1–8, inclinación de cabeza o cuadrículas tipo IPD.',
    inputs: ['Webcam estándar / Video', '21 puntos de mano (MediaPipe)', '478 puntos faciales', '33 puntos corporales'],
    processing: ['Distancias normalizadas (pinza 4–8)', 'Suavizado exponencial (lerp)', 'Clasificación gestual sin latencia'],
    outputs: ['Instrumento musical aéreo', 'Cuadrícula gráfica interactiva', 'Filtros faciales poéticos'],
    recommendedTools: ['@mediapipe/tasks-vision', 'ml5.js', 'TensorFlow.js', 'Three.js', 'p5.js'],
    sampleUseCases: [
      'Instrumento virtual tipo MuGeVI que dispara notas al unir pulgar e índice y aplica efecto Wah-Wah vertical',
      'Cartel generativo tipo IPD donde palma abierta explora la retícula y el agarre transforma módulos',
      'Máscara digital expresiva guiada por parpadeo y apertura vocal',
    ],
    defaultPreset: {
      sensor: 'Tracking de Manos (21 puntos · MediaPipe Hands)',
      engine: 'Canvas / Three.js con detección de pinza (4–8) y malla en vivo',
      stack: 'React + TypeScript + @mediapipe/tasks-vision + Web Audio API',
      concept: 'Instrumento y cartel visual controlado en el aire por pinza gestual y posición espacial de mano',
    },
  },
  {
    id: 'museos-cultura',
    code: '03 · MUSEOS & CULTURA',
    area: 'Instalaciones Culturales, Museos y Mediación',
    headline: 'Experiencias participativas de bajo umbral para públicos diversos',
    description:
      'Diseña dispositivos expositivos donde cualquier persona active archivos históricos, mapas sonoros o relatos comunitarios con gestos simples.',
    inputs: ['Presencia por cámara / IR', 'Voz / Micrófono direccional', 'Pantallas táctiles accesibles'],
    processing: ['Mapeo de zonas activas', 'Archivo multimedia curado', 'Transiciones suaves sin fatiga'],
    outputs: ['Muro interactivo', 'Archivo sonoro espacializado', 'Postales digitales descargables'],
    recommendedTools: ['p5.js', 'TouchDesigner', 'MadMapper', 'React Kiosk Mode', 'Web Speech API'],
    sampleUseCases: [
      'Archivo fotográfico barrial que cobra vida al acercarse el visitante (estilo teamLab / Rain Room)',
      'Cabina de escucha reflexiva con espectrogramas sincronizados inspirada en Caósmosis',
      'Mesa interactiva de memoria musical y juegos gestuales para museos juveniles',
    ],
    defaultPreset: {
      sensor: 'Cámara de presencia + Micrófono ambiental',
      engine: 'p5.js / Canvas interactivo con narrativa por zonas y espectrograma',
      stack: 'React + TypeScript + Web Audio API',
      concept: 'Mural digital de memoria comunitaria que revela fotografías y relatos sonoros según proximidad y voz',
    },
  },
  {
    id: 'audio-reactivo',
    code: '04 · AUDIO REACTIVO & SÍNTESIS',
    area: 'Música, Voz y Paisajes Sonoros',
    headline: 'Visuales conducidos por frecuencias FFT, filtros en vivo y síntesis web',
    description:
      'Conecta micrófonos, archivos de audio o sintetizadores Web Audio / Tone.js para convertir graves, medios y agudos en arquitectura cinética.',
    inputs: ['Micrófono en vivo / Línea', 'Archivo MP3 / WAV local', 'Sintetizador Web Audio / MIDI'],
    processing: ['Transformada Rápida de Fourier (FFT)', 'Filtro Biquad Wah-Wah por gesto', 'Detección de beats y envolvente'],
    outputs: ['Escultura sonora cinética', 'Partitura visual generativa', 'Audio procesado en tiempo real'],
    recommendedTools: ['Web Audio API', 'Tone.js', 'Max/MSP + OSC', 'Pure Data', 'Ableton Live'],
    sampleUseCases: [
      'Escultura geométrica de 12 caras tipo The Shy Machine que se abre o contrae según volumen ambiental',
      'Taller de escucha donde la voz infantil dibuja paisajes armónicos y espectrogramas',
      'Efecto Wah-Wah en vivo controlado por la altura del dedo índice frente a la webcam',
    ],
    defaultPreset: {
      sensor: 'Micrófono FFT (Graves / Medios / Agudos + RMS)',
      engine: 'Osciloscopio, filtro Wah-Wah y poliedro armónico Web Audio + Canvas',
      stack: 'React + TypeScript + Tone.js / Web Audio API',
      concept: 'Sintetizador audiovisual donde cada banda de frecuencia modula geometría, trazo y filtro sonoro',
    },
  },
  {
    id: 'artes-escenicas',
    code: '05 · ESCENA & DANZA',
    area: 'Danza, Teatro, Performance y Mapping',
    headline: 'Cuerpos en movimiento dialogando con luz, proyección y arquitectura',
    description:
      'Integra seguimiento de postura o silueta sobre escenario para que la escenografía digital y la iluminación respondan a la coreografía.',
    inputs: ['Cámara infrarroja / Kinect', 'Pose Tracking (33 pts)', 'Micrófono de contacto'],
    processing: ['Detección de velocidad articular', 'Warp y proyección mapeada', 'Envío OSC/DMX'],
    outputs: ['Proyección sobre tul o fachada', 'Control de luces DMX', 'Sonido escénico en vivo'],
    recommendedTools: ['TouchDesigner', 'Isadora', 'MadMapper', 'MediaPipe Pose', 'HeavyM'],
    sampleUseCases: [
      'Solo de danza donde la silueta del intérprete se disgrega en bandadas de partículas (estilo The Treachery of Sanctuary)',
      'Estelas coreográficas con fondo negro puro (#000000) listas para videoproyector en escena',
      'Escenografía generativa que cambia de clima según el pulso rítmico del intérprete',
    ],
    defaultPreset: {
      sensor: 'Tracking Corporal (33 puntos · MediaPipe Pose)',
      engine: 'Estela coreográfica de alta velocidad para proyección negra (#000000)',
      stack: 'TouchDesigner / React + Canvas WebGL fondo negro puro',
      concept: 'Sistema visual escénico con fondo negro absoluto para proyector que amplifica trayectorias de brazos y torso',
    },
  },
  {
    id: 'webxr-ar',
    code: '06 · WEBXR, AR & ESPACIAL',
    area: 'Realidad Aumentada, VR Web y Museografía XR',
    headline: 'Filtros AR, carteles aumentados y mundos 3D inmersivos directamente en el navegador',
    description:
      'Extiende la interacción hacia el espacio físico mediante WebXR, Three.js, A-Frame y marcadores AR.js sin obligar al público a descargar aplicaciones.',
    inputs: ['Cámara móvil trasera/frontal', 'Marcadores impresos / QR', 'Giroscopio y controladores XR'],
    processing: ['Tracking espacial 6DoF', 'Iluminación PBR en WebGL', 'Sincronización con Tone.js Transport'],
    outputs: ['Escultura AR sobre afiches impresos', 'Sala expositiva WebVR', 'Filtros espaciales con rostro/mano'],
    recommendedTools: ['Three.js', 'A-Frame', 'AR.js', 'WebXR API', 'React Three Fiber'],
    sampleUseCases: [
      'Cartel de exposición cultural que despliega modelos 3D audioreactivos al enfocarlo con AR.js',
      'Galería experimental WebVR accesible desde casco o teléfono con Audio Espacial',
      'Prototipo de objeto interactivo 3D manipulado mediante mano en webcam sobre escena Three.js',
    ],
    defaultPreset: {
      sensor: 'Cámara móvil (AR.js) + Tracking de Manos (Three.js)',
      engine: 'Escena espacial WebXR / Three.js con iluminación PBR y audio espacial',
      stack: 'React + Three.js + A-Frame / AR.js + Tone.js',
      concept: 'Experiencia WebXR que superpone esculturas geométricas reactivas al sonido sobre carteles impresos',
    },
  },
  {
    id: 'educacion',
    code: '07 · EDUCACIÓN CREATIVA',
    area: 'Educación, Talleres y Laboratorios Escolares',
    headline: 'Aprender ciencia, arte y programación jugando con el propio cuerpo y sonido',
    description:
      'Convierte el aula en un laboratorio donde estudiantes comprenden algoritmos y música viendo causa y efecto inmediato.',
    inputs: ['Webcam del portátil escolar', 'Micrófono del aula', 'Teclado / Touch'],
    processing: ['Reglas visuales transparentes', 'Entrada → Transformación → Salida', 'Ajuste en vivo'],
    outputs: ['Instrumentos inclusivos de aula', 'Simuladores de física y color', 'Muestras escolares'],
    recommendedTools: ['p5.js Web Editor', 'Google Teachable Machine', 'Scratch', 'ml5.js', 'Makey Makey'],
    sampleUseCases: [
      'Clasificador de gestos entrenado en 5 minutos con Teachable Machine para controlar un cuento',
      'Laboratorio de acústica visual para observar armónicos y frecuencias FFT en directo',
      'Juego inclusivo controlado por inclinación de cabeza para aprender geometría',
    ],
    defaultPreset: {
      sensor: 'Teachable Machine / Gestos simples por webcam',
      engine: 'p5.js educativo con visualización clara de variables en pantalla',
      stack: 'p5.js + ml5.js (sin instalación, ejecutable en navegador)',
      concept: 'Aplicación educativa para aula que visualiza en tiempo real cómo los datos de entrada transforman gráficos y sonido',
    },
  },
  {
    id: 'accesibilidad-salud',
    code: '08 · ACCESIBILIDAD & BIENESTAR',
    area: 'Accesibilidad, Terapia Creativa y Control sin Manos',
    headline: 'Interfaces alternativas basadas en voz, cabeza, respiración o gestos mínimos',
    description:
      'La visión por computador y el análisis sonoro abren caminos expresivos para personas con movilidad reducida o necesidades sensoriales diversas.',
    inputs: ['Inclinación de cabeza (Face Mesh)', 'Soplido / Voz suave', 'Gestos mínimos calibrables'],
    processing: ['Umbrales calibrables por persona', 'Filtros anti-temblor', 'Ritmos calmados'],
    outputs: ['Control sin mouse', 'Arte terapéutico respiratorio', 'Instrumentos digitales adaptados'],
    recommendedTools: ['MediaPipe FaceLandmarker', 'Web Speech API', 'Web Audio API', 'WCAG 2.2 AA'],
    sampleUseCases: [
      'Puntero visual accesible controlado con movimientos suaves de cabeza y parpadeo lento',
      'Visualizador de respiración guiada reactivo al sonido suave en el micrófono',
      'Instrumento musical inclusivo calibrado para rangos de movimiento acotados',
    ],
    defaultPreset: {
      sensor: 'Tracking Facial suave (inclinación de cabeza + calibración)',
      engine: 'Canvas accesible de alto contraste sin destellos bruscos',
      stack: 'React + TypeScript + MediaPipe FaceLandmarker + WCAG 2.2 AA',
      concept: 'Interfaz expresiva de control sin manos con calibración personal, alto contraste y movimiento reducido opcional',
    },
  },
  {
    id: 'comercio-marca',
    code: '09 · RETAIL & EXPERIENCIAS',
    area: 'Comercio, Vitrinas Interactivas y Eventos',
    headline: 'Activaciones físicas y digitales que despiertan curiosidad sin invadir la privacidad',
    description:
      'Transforma vitrinas, ferias de diseño y puntos de venta con experiencias gestuales memorables para interactuar con productos e identidad visual.',
    inputs: ['Cámara en vitrina', 'Gestos de mano a distancia', 'QR conectado al móvil'],
    processing: ['Detección anónima de mano/silueta', 'Catálogo interactivo en tiempo real', 'Paleta de marca'],
    outputs: ['Configurador gestual 3D', 'Vitrina reactiva al paso', 'Recuerdo gráfico descargable'],
    recommendedTools: ['Three.js', 'MediaPipe Hands', 'AR.js / WebXR', 'React + WebSockets'],
    sampleUseCases: [
      'Vitrina de tienda de diseño que cambia iluminación y exhibición al pasar frente al vidrio',
      'Stand de feria cultural donde los visitantes rotan piezas 3D moviendo la mano en el aire',
      'Photocall generativo que entrega una gráfica abstracta sin almacenar fotografías personales',
    ],
    defaultPreset: {
      sensor: 'Tracking de Manos a distancia + Sensor de paso por cámara',
      engine: 'Visor 3D Three.js con cambio de materiales por gesto',
      stack: 'React + Three.js + MediaPipe Hands (procesamiento 100% local)',
      concept: 'Vitrina o stand interactivo donde mover la mano permite rotar objetos y cambiar iluminación sin tocar pantalla',
    },
  },
];

export const INTERACTIVE_ART_REFERENCES: InteractiveArtReference[] = [
  {
    id: 'mugevi',
    title: 'MuGeVI: Multi-Functional Gesture-Controlled Virtual Instrument',
    artistOrGroup: 'Yue Yang, Zhaowen Wang, Zijin Li (NIME 2023 · Ciudad de México)',
    originYear: 'China / México · 2023',
    category: 'Investigación NIME',
    sensorAndStack: 'Webcam estándar + OpenCV + MediaPipe (21 keypoints) + OSC + Max/MSP',
    pipelineFormula: 'Pinza Pulgar(4)–Índice(8) + Dedos 1–8 + Altura índice → Air Piano, Acordes, Transposición & Filtro Wah-Wah',
    summary:
      'Instrumento musical virtual sin sensores dedicados con 4 modos: Performance (Air Piano), Acompañamiento por conteo de dedos (1–8), Control (transposición/volumen) y Audio Effects (Wah-Wah en tiempo real).',
    url: 'https://nime.org/proc/nime2023_75/',
    presetId: 'mugevi-air-piano',
  },
  {
    id: 'caosmosis',
    title: 'Caósmosis: Radiografías Sonoras de Latinoamérica',
    artistOrGroup: 'Luis Clériga & Colectivo OTONO',
    originYear: 'Colombia / México · 2023',
    category: 'LATAM & España',
    sensorAndStack: 'Escucha interactiva + Espectrogramas reactivos en tiempo real',
    pipelineFormula: 'Archivo sonoro experimental latinoamericano + Análisis espectral → Meditación sonora y visual sincronizada',
    summary:
      'Instalación de escucha interactiva que entrelaza piezas sonoras experimentales de Latinoamérica con visuales de espectrogramas y breves instrucciones auditivas individuales.',
    url: 'https://fonotecanacional.cultura.gob.mx/index.php/component/eventbooking/sesion-de-escucha/caosmosis-instalacion-interactiva-con-radiografias-sonoras-de-latinoamerica',
    presetId: 'caosmosis-videoart',
  },
  {
    id: 'visualma-puebla',
    title: 'Módulos Interactivos del Museo de la Música (Puebla)',
    artistOrGroup: 'Colectivo Visualma',
    originYear: 'México · 2016',
    category: 'LATAM & España',
    sensorAndStack: 'Leap Motion (3D Hand Tracking) + Motor gráfico interactivo',
    pipelineFormula: 'Posición tridimensional de manos en el aire → Videojuego y mediación museográfica sin contacto',
    summary:
      'Serie de módulos interactivos museográficos donde visitantes usan sus manos frente a sensores 3D para controlar personajes y explorar dinámicas musicales en sala.',
    url: 'https://visualma.com/proyectos/instalaciones-interactivas-museo-de-la-musica',
    presetId: 'ipd-grid',
  },
  {
    id: 'pulse-room',
    title: 'Pulse Room',
    artistOrGroup: 'Rafael Lozano-Hemmer',
    originYear: 'México / Canadá · 2006',
    category: 'LATAM & España',
    sensorAndStack: 'Sensor biométrico de pulso + Matriz de bombillas incandescentes + Sonido',
    pipelineFormula: 'Frecuencia cardíaca del visitante → Coreografía lumínica de 300 lámparas y latido sonoro en galería',
    summary:
      'Cada visitante sostiene una interfaz que registra su ritmo cardíaco y lo traduce en parpadeos rítmicos que desplazan las grabaciones anteriores a través de la sala.',
    url: 'https://www.lozano-hemmer.com/pulse_room.php',
    presetId: 'shy-machine-fft',
  },
  {
    id: 'ipd-poster',
    title: 'IPD (Interactive Poster Design)',
    artistOrGroup: 'Chroma Art / Processing & Leap Motion',
    originYear: 'Internacional · 2024',
    category: 'Instalación Global',
    sensorAndStack: 'Leap Motion + Processing / Retícula tipográfica paramétrica',
    pipelineFormula: 'Palma extendida (explorar grilla) + Gesto de agarre → Deformación espacial y cromática de celdas',
    summary:
      'Cartel generativo en movimiento donde gestos sencillos de la mano —abrir palma para recorrer o cerrar el puño para sujetar— transforman la arquitectura gráfica en directo.',
    url: 'https://chromaartfilmfestival.org/2024/10/24/explore-interactive-visual-performance-with-leap-motion/',
    presetId: 'ipd-grid',
  },
  {
    id: 'shy-machine',
    title: 'The Shy Machine',
    artistOrGroup: 'Daric Gill',
    originYear: 'Estados Unidos · 2018',
    category: 'Instalación Global',
    sensorAndStack: 'Micrófono ambiental + Sensor de proximidad + Escultura cinética de 12 caras',
    pipelineFormula: 'Volumen acústico de sala + Movimiento cercano → Apertura o repliegue mecánico e iluminación interna',
    summary:
      'Escultura cinética poliédrica de 12 caras cuya geometría respira, ilumina u oculta sus pétalos mecánicos según la intensidad del sonido y presencia en la galería.',
    url: 'https://daricgill.com/2018/08/25/shy-machine-interactive-art/',
    presetId: 'shy-machine-fft',
  },
  {
    id: 'aura-rex',
    title: 'AURA — Sound Reactive Art Installation',
    artistOrGroup: 'Alex Rex',
    originYear: 'Alemania · 2018',
    category: 'Instalación Global',
    sensorAndStack: 'Micrófono (detección tonal) + Microcontroladores + Actuadores de madera',
    pipelineFormula: 'Notas musicales captadas por micrófono → Coreografía física de varillas en bosque cinético',
    summary:
      'Instalación sonora con varillas de madera motorizadas que reaccionan en sincronía con las notas interpretadas en un piano cercano.',
    url: 'https://www.pjrc.com/aura-sound-reactive-art-installation/',
    presetId: 'shy-machine-fft',
  },
  {
    id: 'rain-room',
    title: 'Rain Room',
    artistOrGroup: 'Random International (MoMA / Barbican)',
    originYear: 'Reino Unido · 2012',
    category: 'Instalación Global',
    sensorAndStack: 'Cámaras infrarrojas 3D + Válvulas hidráulicas + Paisaje sonoro ambiental',
    pipelineFormula: 'Silueta y posición humana bajo cámara IR → Suspensión localizada de la caída de lluvia',
    summary:
      'Entorno inmersivo de lluvia continua que se detiene exactamente sobre el perímetro del visitante gracias al seguimiento de silueta sin mojarlo.',
    url: 'https://en.wikipedia.org/wiki/Rain_Room',
    presetId: 'rain-room-silhouette',
  },
  {
    id: 'teamlab-flowers',
    title: 'Flowers and People – Dark / The Pool',
    artistOrGroup: 'teamLab (Japón) / Jen Lewin (EE.UU.)',
    originYear: 'Japón / EE.UU.',
    category: 'Instalación Global',
    sensorAndStack: 'Proyección interactiva 3D en tiempo real + Sensores de proximidad y presión',
    pipelineFormula: 'Desplazamiento del público en sala → Florecimiento/marchitación generativa y nodos de luz y música',
    summary:
      'Obras emblemáticas de entorno inmersivo donde la presencia colectiva transforma en directo paisajes vegetales 3D (teamLab) o plataformas musicales luminosas (The Pool).',
    url: 'https://interactiveimmersive.io/blog/interactive-media/interactive-art-examples/',
    presetId: 'rain-room-silhouette',
  },
  {
    id: 'virtual-pottery',
    title: 'Virtual Pottery',
    artistOrGroup: 'Han et al. (NIME 2012)',
    originYear: 'Internacional · 2012',
    category: 'Investigación NIME',
    sensorAndStack: 'Sensores manuales + Modelado 3D en vivo + Síntesis armónica',
    pipelineFormula: 'Moldeo gestual con ambas manos → Vasija 3D generativa + Capas sonoras armónicas',
    summary:
      'Instalación audiovisual donde los movimientos manuales esculpen cerámica digital giratoria mientras generan texturas sonoras armónicas en paralelo.',
    url: 'https://www.nime.org/proceedings/2012/nime2012_216.pdf',
    presetId: 'mugevi-air-piano',
  },
  {
    id: 'gestalt-nime',
    title: 'GestAlt: Adaptive Gesture-Controlled Interactive Music',
    artistOrGroup: 'Smith & Freeman (NIME 2025)',
    originYear: 'Internacional · 2025',
    category: 'Investigación NIME',
    sensorAndStack: 'ML en tiempo real sobre patrones de movimiento manual + Visualización de estado',
    pipelineFormula: 'Patrón cinético del intérprete → Adaptación musical autónoma + Visualización transparente del sistema',
    summary:
      'Sistema musical que analiza patrones gestuales con aprendizaje automático y comunica visualmente sus decisiones al intérprete para fomentar co-creación clara.',
    url: 'https://nime.org/proc/nime2025_55/index.html',
    presetId: 'mugevi-air-piano',
  },
];

export const PROMPT_BLUEPRINT_SENSORS = [
  'Tracking de Manos (21 puntos · MediaPipe Hands + Pinza 4–8 estilo MuGeVI)',
  'Tracking Facial (478 puntos + inclinación cabeza y expresiones)',
  'Cámara (Flujo óptico y silueta de movimiento en Canvas sin modelos pesados)',
  'Micrófono / Archivo Audio FFT (Graves / Medios / Agudos + Filtro Biquad Wah-Wah)',
  'Tracking Corporal (33 puntos · MediaPipe Pose)',
  'Realidad Extendida WebXR / AR.js (Marcadores impresos y cámara 6DoF)',
  'Híbrido Multimodal (Cámara + Micrófono + Teclado/MIDI)',
];

export const PROMPT_BLUEPRINT_ENGINES = [
  'Canvas 2D / Partículas vectoriales, estelas y retícula gestual IPD',
  'Videoarte con Feedback Loop, RGB Split y Caleidoscopio',
  'Three.js / WebGL 3D interactivo compatible con WebXR',
  'p5.js (Programación creativa educativa y museográfica)',
  'Tone.js / Web Audio API (Instrumento virtual tipo MuGeVI + FFT)',
];

export const PROMPT_BLUEPRINT_STACKS = [
  'React + TypeScript + Tailwind CSS + @mediapipe/tasks-vision (para Google AI Studio / Bolt / Replit)',
  'HTML + JavaScript + p5.js + ml5.js (archivo único listo para taller)',
  'Three.js + A-Frame / AR.js + Tone.js (WebXR y museografía inmersiva)',
  'TouchDesigner / Max/MSP + Python OSC (instalación física y proyección)',
];
