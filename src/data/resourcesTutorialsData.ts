import type { PromptBuilderState } from '../components/PromptBuilder';

export type TutorialToolId =
  | 'Google AI Studio'
  | 'Gemini'
  | 'ChatGPT'
  | 'Midjourney'
  | 'Runway'
  | 'Ideogram'
  | 'FLUX.1';

export interface StepByStepTutorial {
  id: string;
  tool: TutorialToolId;
  category: 'Multimodal & Apps' | 'Imagen & Dirección de Arte' | 'Video & Cine IA' | 'Diseño Gráfico & Tipografía';
  title: string;
  channel: string;
  videoId: string;
  level: 'Inicial' | 'Intermedio' | 'Avanzado';
  duration: string;
  summary: string;
  whatYouLearn: string[];
  steps: string[];
  practicalExercise: {
    title: string;
    goal: string;
    deliverable: string;
    starterPrompt: string;
    builderPatch: Partial<PromptBuilderState>;
  };
}

export interface TutorialLearningPath {
  id: string;
  title: string;
  subtitle: string;
  tutorialIds: string[];
}

export const STEP_BY_STEP_TUTORIALS: StepByStepTutorial[] = [
  {
    id: 'tut-gstudio-complete',
    tool: 'Google AI Studio',
    category: 'Multimodal & Apps',
    title: 'Google AI Studio desde cero: prompts, imagen, audio, video y prototipos',
    channel: 'Nil EduAI',
    videoId: 'ZuPUCz2tWRo',
    level: 'Inicial',
    duration: 'Guía completa',
    summary:
      'Recorrido integral por el entorno de Google AI Studio: cómo configurar instrucciones del sistema, trabajar con archivos multimodales y prototipar ideas creativas sin barreras técnicas.',
    whatYouLearn: [
      'Diferencia entre System Instructions y el prompt del usuario.',
      'Cómo subir referencias visuales o de audio para analizar y transformar.',
      'Control básico de temperatura y salida estructurada.',
    ],
    steps: [
      'Abre Google AI Studio e inicia sesión con tu cuenta de Google.',
      'Crea un nuevo prompt y define el rol creativo en "System Instructions".',
      'Adjunta una imagen o boceto de referencia y solicita 3 variaciones de dirección de arte.',
      'Ajusta la temperatura entre 0.6 y 1.0 y compara la riqueza de las propuestas.',
    ],
    practicalExercise: {
      title: 'Brief de Dirección de Arte Multimodal',
      goal: 'Convertir una idea cultural en 3 propuestas visuales distintas usando instrucciones de sistema.',
      deliverable: 'Tres prompts estructurados (Editorial, Documental y Experimental) listos para generar imagen.',
      starterPrompt:
        'Actúa como director de arte de un centro cultural contemporáneo. A partir del tema "Memoria del Agua y Tecnología", genera 3 conceptos visuales detallados indicando sujeto, lente fotográfico, esquema de iluminación, paleta en códigos HEX y relación de aspecto 4:5.',
      builderPatch: {
        mode: 'photo',
        subject: 'Contemporary cultural exhibition piece exploring water memory and projection light inside a concrete courtyard',
        genre: '/editorial',
        lighting: 'Volumetric soft daylight reflecting on water ripples',
        colorPalette: 'Deep teal, raw concrete grey and warm amber highlights',
        aspectRatio: '4:5',
      },
    },
  },
  {
    id: 'tut-gstudio-15min',
    tool: 'Google AI Studio',
    category: 'Multimodal & Apps',
    title: 'Google AI Studio & Gemini explicado en 15 minutos',
    channel: 'Germán Huertas',
    videoId: '-l5wLmxvQxk',
    level: 'Inicial',
    duration: '15 min',
    summary:
      'Introducción rápida y directa para entender los modelos Gemini dentro de AI Studio, sus ventajas frente al chat tradicional y cómo organizar pruebas repetibles.',
    whatYouLearn: [
      'Cómo elegir entre modelos rápidos (Flash) y de razonamiento profundo (Pro).',
      'Uso de contexto largo para analizar guiones, PDFs o investigaciones completas.',
      'Cómo guardar y reutilizar plantillas de prompts para tus talleres.',
    ],
    steps: [
      'Selecciona el modelo Gemini disponible en el panel lateral derecho.',
      'Pega un borrador de texto o brief de proyecto cultural en el editor.',
      'Pide una crítica estructurada: objetivos claros, público, riesgos y mejoras visuales.',
      'Guarda el prompt como plantilla reutilizable para futuros proyectos.',
    ],
    practicalExercise: {
      title: 'Auditoría Rápida de Concepto Creativo',
      goal: 'Usar Gemini en AI Studio para refinar un prompt fotográfico antes de renderizarlo.',
      deliverable: 'Versión mejorada de un prompt en español e inglés con óptica e iluminación precisas.',
      starterPrompt:
        'Revisa este prompt de fotografía documental: "artesano trabajando madera en su taller". Mejora el sujeto, añade lente 35mm, luz natural lateral, paleta cálida estilo película analógica y una lista breve de elementos a evitar.',
      builderPatch: {
        mode: 'photo',
        subject: 'Master woodcarver shaping cedar wood with chisels inside a sunlit workshop with fine sawdust in the air',
        genre: '/documentary',
        lens: '35mm f/2.0',
        lighting: 'Directional warm morning window light',
        colorPalette: 'Kodak Portra 400 warm cedar and earthen tones',
        aspectRatio: '3:2',
      },
    },
  },
  {
    id: 'tut-gemini-full',
    tool: 'Gemini',
    category: 'Multimodal & Apps',
    title: 'Google Gemini: tutorial completo para flujos creativos e investigación',
    channel: 'IA Latinoamérica',
    videoId: 'QT_wpvNXsg4',
    level: 'Inicial',
    duration: 'Guía práctica',
    summary:
      'Aprende a integrar Gemini en tu día a día creativo: redacción de conceptos, investigación visual, creación de Gems personalizados y organización de proyectos.',
    whatYouLearn: [
      'Cómo escribir instrucciones claras por bloques en Gemini.',
      'Cómo usar Gems para crear asistentes especializados (ej. corrector de prompts o curador).',
      'Integración de investigación, síntesis y generación de imágenes en una misma sesión.',
    ],
    steps: [
      'Define un objetivo claro de proyecto (exposición, campaña o clase).',
      'Pide a Gemini que organice una lluvia de ideas visual en tabla (Concepto, Paleta, Referencia, Formato).',
      'Refina la opción ganadora solicitando un guion de 4 escenas consecutivas.',
      'Crea un Gem reutilizable con tus criterios estéticos y éticos de Núcleo Colectivo.',
    ],
    practicalExercise: {
      title: 'Diseña tu Propio Asistente Curatorial (Gem)',
      goal: 'Configurar un asistente personal en Gemini que convierta ideas sueltas en prompts listos para producción.',
      deliverable: 'Instrucciones maestras de tu Gem + 1 serie visual de 3 piezas coherentes.',
      starterPrompt:
        'Eres un asistente de dirección visual para arte y diseño. Cada vez que te dé una idea breve, responde con: 1) Concepto visual, 2) Prompt en inglés listo para fotografía o ilustración, 3) Paleta de 3 colores HEX y 4) Aspect ratio sugerido. Tema de prueba: "Jardín nocturno de plantas nativas luminosas".',
      builderPatch: {
        mode: 'photo',
        subject: 'Botanical night garden of native Andean flora illuminated by soft warm architectural uplights under misty sky',
        genre: '/fineart',
        lighting: 'Subtle warm architectural uplights and cool twilight ambient fill',
        colorPalette: 'Deep forest emerald, obsidian night and warm brass accents',
        aspectRatio: '4:5',
      },
    },
  },
  {
    id: 'tut-gemini-course',
    tool: 'Gemini',
    category: 'Multimodal & Apps',
    title: 'Curso completo de Google Gemini desde cero: Gems, Canvas y multimedia',
    channel: 'Pablo Martínez',
    videoId: 'vEtXQtUO9FM',
    level: 'Intermedio',
    duration: 'Curso 2h',
    summary:
      'Formación profunda para pasar del uso básico a flujos profesionales: trabajo iterativo con documentos, investigación guiada y creación de activos multimodales.',
    whatYouLearn: [
      'Estructuración avanzada de conversaciones largas sin perder coherencia.',
      'Uso de herramientas de edición iterativa (Canvas) para guiones y propuestas.',
      'Cómo encadenar investigación conceptual con generación visual.',
    ],
    steps: [
      'Inicia un documento en modo iterativo para redactar el manifiesto visual de tu proyecto.',
      'Solicita 3 referencias históricas de diseño o fotografía coherentes con tu tema.',
      'Traduce la dirección conceptual en parámetros técnicos: cámara, lente, luz y textura.',
      'Exporta el guion final y prueba la escena clave en el Constructor de Prompts.',
    ],
    practicalExercise: {
      title: 'Mini-Biblia Visual de Proyecto Cultural',
      goal: 'Construir en Gemini el brief completo (narrativa, paleta y 3 escenas) para un microdocumental o exposición.',
      deliverable: 'Documento de 1 página + 1 fotograma maestro listo para generar.',
      starterPrompt:
        'Desarrolla una mini-biblia visual para un proyecto documental sobre oficios textiles contemporáneos. Incluye tono narrativo, paleta cromática natural, encuadres recomendados y un prompt maestro fotográfico para la portada en proporción 3:2.',
      builderPatch: {
        mode: 'photo',
        subject: 'Contemporary textile artist weaving natural dyed wool on a large wooden loom inside a bright stone studio',
        genre: '/documentary',
        lens: '50mm f/2.0',
        lighting: 'Soft diffused daylight from high courtyard windows',
        colorPalette: 'Natural indigo, raw unbleached wool and terracotta red',
        aspectRatio: '3:2',
      },
    },
  },
  {
    id: 'tut-chatgpt-no-ai-look',
    tool: 'ChatGPT',
    category: 'Diseño Gráfico & Tipografía',
    title: 'Cómo usar ChatGPT para crear diseños que NO se vean hechos con IA',
    channel: 'Fa Sandoval',
    videoId: 'ukGVRWQ75rc',
    level: 'Inicial',
    duration: 'Práctico',
    summary:
      'Claves concretas de dirección de arte para evitar el aspecto plástico o genérico al generar piezas publicitarias, editoriales y visuales con ChatGPT.',
    whatYouLearn: [
      'Por qué los prompts genéricos producen acabados artificiales y repetitivos.',
      'Cómo especificar texturas reales, papel, sombras físicas y aire compositivo.',
      'Cómo iterar sobre una imagen ya generada corrigiendo solo un detalle puntual.',
    ],
    steps: [
      'Escribe primero el propósito real de la pieza (afiche, empaque o editorial) y su soporte físico.',
      'Sustituye adjetivos vagos ("moderno", "increíble") por materiales concretos (papel algodón, cerámica mate, luz solar lateral).',
      'Pide explícitamente espacio negativo limpio donde luego montarás tu tipografía real.',
      'En el segundo mensaje, solicita ajustes quirúrgicos sin rehacer toda la composición.',
    ],
    practicalExercise: {
      title: 'Anuncio Editorial sin "Look IA"',
      goal: 'Crear una imagen publicitaria limpia y creíble para un producto artesanal evitando brillos sintéticos.',
      deliverable: 'Fotografía comercial 4:5 con espacio superior despejado y materiales honestos.',
      starterPrompt:
        'Crea una fotografía editorial minimalista en formato 4:5 de una barra de jabón botánico artesanal envuelta en papel kraft sin blanquear sobre piedra travertino mate, luz solar natural diagonal con sombra real de una hoja, grano sutil de película, tercio superior completamente despejado para titular, sin texto ni logotipos inventados.',
      builderPatch: {
        mode: 'photo',
        subject: 'Artisanal botanical soap bar wrapped in unbleached kraft paper resting on matte travertine stone with natural leaf shadow',
        genre: '/commercial',
        lens: '90mm Macro f/8',
        lighting: 'Crisp diagonal natural morning sunlight',
        colorPalette: 'Warm kraft paper, limestone cream and muted sage',
        aspectRatio: '4:5',
      },
    },
  },
  {
    id: 'tut-chatgpt-effective-prompts',
    tool: 'ChatGPT',
    category: 'Imagen & Dirección de Arte',
    title: 'Cómo crear imágenes con ChatGPT usando prompts efectivos paso a paso',
    channel: 'Bruno Veloso',
    videoId: 'cENLwDAz-Bs',
    level: 'Inicial',
    duration: 'Paso a paso',
    summary:
      'Metodología clara para transformar bocetos o ideas simples en imágenes precisas dentro de ChatGPT controlando encuadre, estilo y consistencia.',
    whatYouLearn: [
      'Anatomía práctica de un prompt visual efectivo dentro del chat.',
      'Cómo partir de una foto o boceto propio como referencia estructural.',
      'Cómo mantener el mismo estilo visual a lo largo de una serie de varias piezas.',
    ],
    steps: [
      'Redacta la escena siguiendo el orden: Sujeto + Acción + Entorno + Estilo + Luz.',
      'Genera una primera versión exploratoria y detecta qué elemento distrajo el foco.',
      'Pide a ChatGPT que conserve el sujeto y la luz, pero cambie únicamente el plano o la paleta.',
      'Documenta el prompt final ganador para replicarlo en una serie de 3 piezas.',
    ],
    practicalExercise: {
      title: 'Serie de 3 Ilustraciones Coherentes',
      goal: 'Mantener la misma técnica pictórica y paleta en tres escenas narrativas consecutivas.',
      deliverable: 'Tríptico editorial ilustrado (Escena de inicio, encuentro y cierre).',
      starterPrompt:
        'Ilustración editorial en técnica gouache sobre papel acuarela con textura visible, paleta acotada de azul petróleo, ocre cálido y crema. Escena 1: una bibliotecaria organiza libros antiguos junto a una ventana mientras llueve suavemente en la ciudad, luz cálida de lámpara de latón, composición limpia 4:5, sin texto.',
      builderPatch: {
        mode: 'photo',
        subject: 'Editorial gouache illustration on textured watercolor paper of a librarian arranging vintage books beside a rainy window under warm brass lamp light',
        genre: '/fineart',
        lighting: 'Warm interior brass lamp glow contrasting with cool rainy dusk outside',
        colorPalette: 'Petrol blue, warm ochre and cream watercolor paper',
        aspectRatio: '4:5',
      },
    },
  },
  {
    id: 'tut-midjourney-perfect-prompt',
    tool: 'Midjourney',
    category: 'Imagen & Dirección de Arte',
    title: 'Cómo crear el prompt perfecto en Midjourney (estructura y parámetros)',
    channel: 'Julio Arango',
    videoId: 'NvXjxaHOtls',
    level: 'Inicial',
    duration: 'Guía clave',
    summary:
      'Aprende cómo interpreta Midjourney el orden de las palabras, el peso de los estilos artísticos y los parámetros indispensables como --ar, --stylize y --style raw.',
    whatYouLearn: [
      'Jerarquía de palabras: por qué lo primero en el prompt tiene mayor peso visual.',
      'Cuándo usar --style raw para resultados fotográficos menos "maquillados".',
      'Cómo controlar formato (--ar) y exclusiones (--no) con precisión.',
    ],
    steps: [
      'Redacta el núcleo del sujeto en inglés claro y conciso (máximo 2 frases).',
      'Añade cámara, lente y esquema de iluminación realistas.',
      'Agrega al final los flags técnicos: `--ar 3:2 --style raw --no text, watermark`.',
      'Compara la parrilla de 4 opciones y escala (Upscale) la que tenga mejor luz y composición.',
    ],
    practicalExercise: {
      title: 'Experimento --style raw vs. Estilo Estándar',
      goal: 'Comprobar cómo cambia el fotorrealismo en Midjourney al activar --style raw y especificar óptica real.',
      deliverable: 'Dos versiones comparativas del mismo retrato editorial.',
      starterPrompt:
        'Candid editorial portrait of a jazz saxophonist resting backstage after a concert, warm tungsten dressing room mirror lights, Leica M11 50mm f/1.4, authentic skin texture and subtle 35mm film grain --ar 4:5 --style raw --no plastic skin, text',
      builderPatch: {
        mode: 'photo',
        subject: 'Candid portrait of a jazz saxophonist resting backstage near warm tungsten dressing room mirror lights',
        genre: '/editorial',
        camera: 'Leica M11',
        lens: '50mm f/1.4',
        lighting: 'Warm practical tungsten mirror bulbs with deep velvet shadows',
        colorPalette: 'Warm amber tungsten & deep matte charcoal',
        aspectRatio: '4:5',
      },
    },
  },
  {
    id: 'tut-midjourney-under-1h',
    tool: 'Midjourney',
    category: 'Imagen & Dirección de Arte',
    title: 'Aprende Midjourney paso a paso: flujo completo, variaciones y referencias',
    channel: 'RBG Escuela',
    videoId: 'xhLJpPisFGk',
    level: 'Intermedio',
    duration: 'Masterclass',
    summary:
      'Clase completa de producción en Midjourney cubriendo configuración, variaciones sutiles vs. fuertes, reencuadre, consistencia estética (--sref) y acabado final.',
    whatYouLearn: [
      'Flujo profesional desde exploración rápida hasta imagen final en alta calidad.',
      'Uso de variaciones sutiles, zoom out y pan para ajustar encuadres editoriales.',
      'Cómo mantener identidad visual coherente en un portafolio completo.',
    ],
    steps: [
      'Genera una imagen base en formato horizontal 16:9 que defina tu atmósfera cromática.',
      'Aplica Variation (Subtle) para pulir detalles sin perder la estructura compositiva.',
      'Usa Zoom Out o Pan si necesitas ampliar el espacio negativo para diseño editorial.',
      'Guarda tu referencia estética (--sref) para generar 2 escenas hermanas con el mismo look.',
    ],
    practicalExercise: {
      title: 'Díptico de Arquitectura y Atmósfera',
      goal: 'Generar una vista exterior y una interior del mismo centro cultural manteniendo idéntica luz y materialidad.',
      deliverable: 'Dos imágenes coherentes en 16:9 listas para presentación de proyecto.',
      starterPrompt:
        'Contemporary Latin American cultural center built with warm terracotta brick lattice and raw concrete, late afternoon golden hour sunbeams casting rhythmic geometric shadows across an open courtyard, 24mm tilt-shift architectural photography --ar 16:9 --style raw',
      builderPatch: {
        mode: 'photo',
        subject: 'Contemporary cultural center built with terracotta brick lattice and raw concrete bathed in late afternoon sunbeams',
        genre: '/photorealistic',
        camera: 'Sony A7R V',
        lens: '24mm Tilt-Shift f/8',
        lighting: 'Golden hour oblique sunlight casting rhythmic geometric shadows',
        colorPalette: 'Terracotta brick, warm concrete and crisp cobalt sky',
        aspectRatio: '16:9',
      },
    },
  },
  {
    id: 'tut-runway-gen3-guide',
    tool: 'Runway',
    category: 'Video & Cine IA',
    title: 'Guía completa para dominar Runway Gen-3 Alpha (prompts y cámara)',
    channel: 'Software Emprendedor',
    videoId: 'O4m1bL1HmoQ',
    level: 'Intermedio',
    duration: 'Guía completa',
    summary:
      'Cómo dirigir secuencias cinematográficas en Runway Gen-3 Alpha estructurando movimiento de cámara, acción física creíble, iluminación y ritmo temporal.',
    whatYouLearn: [
      'Estructura recomendada por Runway: Movimiento de cámara + Escena + Sujeto + Iluminación.',
      'Cómo evitar cortes bruscos y deformaciones pidiendo una sola trayectoria clara.',
      'Palabras clave cinematográficas que estabilizan la física en clips de 5 a 10 segundos.',
    ],
    steps: [
      'Define una acción física simple y continua (viento, agua, caminar lento, rotación de objeto).',
      'Empieza el prompt indicando exactamente el movimiento de cámara (ej. "Slow continuous dolly-in").',
      'Describe luz, atmósfera y velocidad constante en presente simple.',
      'Revisa el resultado y simplifica adjetivos si notas morphing o temblor en el fondo.',
    ],
    practicalExercise: {
      title: 'Plano Secuencia Poético de 5 Segundos',
      goal: 'Escribir y dirigir un clip cinematográfico estable con una sola trayectoria suave de cámara.',
      deliverable: 'Prompt maestro de video 16:9 listo para Runway Gen-3 o Google Veo.',
      starterPrompt:
        'Slow stabilized dolly-in cinema shot at 24fps. Inside a quiet misty greenhouse at dawn, morning sunlight filters through glass panels as delicate water droplets fall smoothly from fern leaves. Consistent natural physics, soft depth of field, zero camera shake, no morphing.',
      builderPatch: {
        mode: 'video',
        subject: 'Quiet misty botanical greenhouse at dawn as morning sunbeams illuminate fine water droplets falling from fern leaves',
        genre: '/cinematicvideo',
        camera: 'ARRI Alexa 35',
        lens: '40mm Anamorphic T2.3',
        lighting: 'Volumetric dawn sunlight through condensation-covered glass',
        motion: 'Slow stabilized dolly-in camera movement',
        fps: '24 fps',
        aspectRatio: '16:9',
      },
    },
  },
  {
    id: 'tut-runway-image-to-video',
    tool: 'Runway',
    category: 'Video & Cine IA',
    title: 'Runway Gen-3 Turbo: transforma tus fotografías e ilustraciones en video',
    channel: 'Joseph Nava',
    videoId: 'XILHVtfg8oY',
    level: 'Inicial',
    duration: 'Práctico',
    summary:
      'El flujo más confiable en cine con IA: primero diseñas el fotograma perfecto (en Midjourney, FLUX o fotografía propia) y luego le das movimiento controlado en Runway.',
    whatYouLearn: [
      'Por qué Image-to-Video ofrece mucha más dirección de arte que Text-to-Video puro.',
      'Cómo redactar prompts cortos enfocados solo en el movimiento (sin volver a describir toda la foto).',
      'Cómo animar retratos, bodegones de producto y escenografías con sutileza profesional.',
    ],
    steps: [
      'Prepara una imagen fija en 16:9 o 9:16 con buena separación entre sujeto y fondo.',
      'Súbela como primer fotograma (First Frame) en Runway Gen-3 Turbo.',
      'Escribe un prompt breve que describa únicamente qué se mueve y hacia dónde viaja la cámara.',
      'Evalúa la continuidad del sujeto y ajusta la intensidad del movimiento si resulta exagerado.',
    ],
    practicalExercise: {
      title: 'De Fotografía Editorial a Cinemagraph Vivo',
      goal: 'Animar sutilmente un retrato o bodegón manteniendo intacta la identidad visual del fotograma original.',
      deliverable: 'Prompt de movimiento puro (Image-to-Video) de menos de 35 palabras.',
      starterPrompt:
        'Subtle slow camera push-in. Gentle breeze moves linen curtains and loose strands of hair while warm afternoon sunlight shifts softly across the wall. Natural serene motion, stable facial features, 24fps.',
      builderPatch: {
        mode: 'video',
        subject: 'Editorial portrait beside sheer linen curtains moving gently in an afternoon breeze',
        genre: '/cinematicvideo',
        motion: 'Subtle slow camera push-in with gentle ambient wind',
        lighting: 'Warm shifting late-afternoon window sunlight',
        fps: '24 fps',
        aspectRatio: '16:9',
      },
    },
  },
  {
    id: 'tut-ideogram-posters',
    tool: 'Ideogram',
    category: 'Diseño Gráfico & Tipografía',
    title: 'Diseño gráfico y carteles con tipografía real en Ideogram 2.0',
    channel: 'Taller Creativo IA Con Alejo',
    videoId: 'kLtUM3Yts98',
    level: 'Inicial',
    duration: 'Diseño gráfico',
    summary:
      'Domina la herramienta más fuerte para integrar tipografía legible directamente en afiches, portadas, logos conceptuales y piezas de comunicación visual.',
    whatYouLearn: [
      'Cómo escribir texto literal entre comillas para que salga sin errores ortográficos.',
      'Uso del selector de estilo "Design" y paletas cromáticas personalizadas.',
      'Cómo combinar ilustración minimalista y jerarquía tipográfica suiza.',
    ],
    steps: [
      'Define el título corto (1 a 3 palabras) que irá entre comillas dentro del prompt.',
      'Selecciona el modo "Design" y la proporción vertical 2:3 o 4:5.',
      'Describe la técnica gráfica (serigrafía, risografía o diseño suizo) y limita la paleta a 2–3 colores.',
      'Descarga la mejor propuesta y pule detalles finales o información secundaria en tu editor vectorial.',
    ],
    practicalExercise: {
      title: 'Cartel Tipográfico para Festival Cultural',
      goal: 'Generar un afiche con titular legible integrado orgánicamente en la composición gráfica.',
      deliverable: 'Cartel vertical 2:3 con estética de risografía contemporánea.',
      starterPrompt:
        'Contemporary Swiss risograph cultural poster featuring bold geometric sans-serif typography reading "SONIDO VIVO" at the top third, below it a minimalist graphic intersection of cobalt blue sound wave rings and a cadmium yellow botanical silhouette on warm uncoated cream paper, crisp print registration, 2:3.',
      builderPatch: {
        mode: 'photo',
        subject: 'Swiss risograph cultural poster with bold geometric graphic sound wave rings and botanical silhouette on warm cream cotton paper',
        genre: '/editorial',
        lighting: 'Flat even archival print scan',
        colorPalette: 'Cobalt blue, cadmium yellow and deep ink black on cream paper',
        aspectRatio: '2:3',
      },
    },
  },
  {
    id: 'tut-flux-photorealism',
    tool: 'FLUX.1',
    category: 'Imagen & Dirección de Arte',
    title: 'Tutorial FLUX.1 en español: fotorrealismo, manos naturales y precisión',
    channel: 'LLM Master Cursos',
    videoId: 'fD5Wb222Qm8',
    level: 'Intermedio',
    duration: 'Guía técnica',
    summary:
      'Conoce las diferencias entre FLUX.1 Schnell, Dev y Pro, por qué sigue fielmente instrucciones largas en lenguaje natural y cómo lograr retratos y escenas de gran fidelidad.',
    whatYouLearn: [
      'Diferencias prácticas entre FLUX Schnell (velocidad), Dev (control abierto) y Pro (máxima calidad).',
      'Cómo redactar descripciones largas y espaciales que FLUX respeta al pie de la letra.',
      'Ventajas de FLUX para manos humanas, texto integrado y fotografía documental honesta.',
    ],
    steps: [
      'Redacta un párrafo natural describiendo primer plano, plano medio y fondo (FLUX entiende espacialidad).',
      'Evita listas de spam como "8k, trending on artstation"; usa lenguaje fotográfico directo.',
      'Prueba una generación rápida para validar encuadre y luego pasa a mayor calidad.',
      'Compara la naturalidad de manos, ojos y texturas frente a otros generadores.',
    ],
    practicalExercise: {
      title: 'Escena Narrativa en Tres Planos Espaciales',
      goal: 'Aprovechar la comprensión espacial de FLUX describiendo con claridad qué hay adelante, en el centro y al fondo.',
      deliverable: 'Fotografía documental 3:2 rica en capas visuales y sin errores anatómicos.',
      starterPrompt:
        'Authentic 35mm documentary photograph inside a bustling neighborhood botanical bookshop. In the foreground, slightly out of focus, stacked art zines rest on a worn oak counter; in the center, a smiling 50-year-old bookseller hands a wrapped book to a student; in the background, tall wooden shelves and warm pendant lamps glow against dusk windows. Natural available light, Leica 35mm f/2, organic film grain.',
      builderPatch: {
        mode: 'photo',
        subject: 'Neighborhood botanical bookshop with art zines in foreground, bookseller handing a wrapped book in center, and warm glowing bookshelves in background',
        genre: '/documentary',
        camera: 'Leica M11',
        lens: '35mm f/2.0',
        lighting: 'Warm practical pendant lamps balanced with cool dusk window light',
        colorPalette: 'Warm oak wood, muted sage and filmic amber highlights',
        aspectRatio: '3:2',
      },
    },
  },
];

export const TUTORIAL_LEARNING_PATHS: TutorialLearningPath[] = [
  {
    id: 'path-starter',
    title: 'Ruta 01 · Primeros Pasos Multimodales',
    subtitle: 'Domina prompts, referencias y asistentes creativos con Google AI Studio, Gemini y ChatGPT.',
    tutorialIds: ['tut-gstudio-complete', 'tut-gemini-full', 'tut-chatgpt-no-ai-look'],
  },
  {
    id: 'path-visual-design',
    title: 'Ruta 02 · Dirección de Arte y Cartel',
    subtitle: 'Combina fotografía autoral, tipografía real y precisión espacial en Midjourney, Ideogram y FLUX.',
    tutorialIds: ['tut-midjourney-perfect-prompt', 'tut-ideogram-posters', 'tut-flux-photorealism'],
  },
  {
    id: 'path-cinema-ia',
    title: 'Ruta 03 · De Fotograma Fijo a Cine IA',
    subtitle: 'Construye el encuadre perfecto y llévalo a movimiento cinematográfico controlado en Runway Gen-3.',
    tutorialIds: ['tut-midjourney-under-1h', 'tut-runway-image-to-video', 'tut-runway-gen3-guide'],
  },
];
