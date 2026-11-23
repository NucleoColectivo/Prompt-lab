export interface ExtendedTemplateVariable {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}

export interface ExtendedMasterTemplate {
  id: 'photo' | 'video' | 'design' | 'branding' | 'web' | 'art';
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
  mode: 'photo' | 'video';
  defaultAspectRatio: string;
  variables: ExtendedTemplateVariable[];
  templateBody: string;
}

export interface PromptBeforeAfterCase {
  id: string;
  discipline: 'Retrato' | 'Producto' | 'Arquitectura' | 'Cine / Video' | 'Cartel Gráfico';
  title: string;
  weakPrompt: string;
  diagnosis: string;
  strongPrompt: string;
  improvements: string[];
  builderPatch: {
    mode: 'photo' | 'video';
    subject: string;
    genre: string;
    camera: string;
    lens: string;
    lighting: string;
    colorPalette: string;
    aspectRatio: string;
  };
}

export interface ExerciseFreeTool {
  name: string;
  role: string;
  url: string;
}

export interface PracticeDrill {
  id: string;
  code: string;
  title: string;
  level: 'Inicial' | 'Intermedio' | 'Avanzado';
  duration: string;
  skill: string;
  objective: string;
  steps: string[];
  starterPrompt: string;
  evaluationChecklist: string[];
  freeTools: ExerciseFreeTool[];
  builderPatch: {
    mode: 'photo' | 'video';
    subject: string;
    genre: string;
    lighting: string;
    aspectRatio: string;
  };
}

export interface TroubleshootingCase {
  id: string;
  category: 'Retrato y Anatomía' | 'Texto y Composición' | 'Luz y Color' | 'Video y Continuidad';
  symptom: string;
  cause: string;
  removeTokens: string[];
  addTokens: string[];
  fixedExample: string;
  negativePrompt: string;
}

export interface NegativePromptPack {
  id: string;
  title: string;
  useCase: string;
  tokens: string[];
}

export interface AspectRatioSpec {
  ratio: string;
  name: string;
  widthUnits: number;
  heightUnits: number;
  midjourneyFlag: string;
  platforms: string;
  bestFor: string;
  framingTip: string;
}

export interface ExtraPaletteItem {
  name: string;
  colors: string[];
  hexCodes: string[];
  description: string;
  vibe: string;
  promptSnippet: string;
}

export interface CheatSheetRow {
  term: string;
  effect: string;
  promptToken: string;
  idealUse: string;
}

export interface WorkshopCheckItem {
  id: string;
  group: 'Técnico' | 'Dirección de Arte' | 'Ética y Derechos';
  label: string;
  detail: string;
}

export const EXTENDED_TEMPLATES: ExtendedMasterTemplate[] = [
  {
    id: 'photo',
    label: 'Fotografía Editorial & Retrato',
    shortLabel: 'Fotografía',
    badge: 'SEC. 16',
    description: 'Estructura completa de 10 capas para retratos, documental, moda y bodegón fotorrealista.',
    mode: 'photo',
    defaultAspectRatio: '3:2',
    variables: [
      {
        key: 'SUJETO',
        label: 'Sujeto principal',
        placeholder: 'Ej. Ceramista trabajando arcilla húmeda en un taller luminoso',
        defaultValue: 'Artesano latinoamericano moldeando una vasija de barro en un taller con ventana amplia',
      },
      {
        key: 'CAMARA',
        label: 'Cámara y lente',
        placeholder: 'Ej. Leica M11, 50mm f/2.0',
        defaultValue: 'Hasselblad X2D, 85mm f/2.0',
      },
      {
        key: 'LUZ',
        label: 'Esquema de luz',
        placeholder: 'Ej. Luz Rembrandt suave lateral desde ventana norte',
        defaultValue: 'Luz natural lateral tipo Rembrandt entrando por ventanal con polvo en suspensión',
      },
      {
        key: 'PALETA',
        label: 'Paleta y emulsión',
        placeholder: 'Ej. Kodak Portra 400, tonos tierra y crema',
        defaultValue: 'Kodak Portra 400, tonos terracota, arcilla cálida y sombras suaves',
      },
      {
        key: 'RATIO',
        label: 'Formato / Aspect Ratio',
        placeholder: 'Ej. 4:5 o 3:2',
        defaultValue: '3:2',
      },
    ],
    templateBody: `MASTER PROMPT — PHOTOGRAPHY & VISUAL ART
01. SUBJECT
{{SUJETO}}

02. PHOTOGRAPHY GENRE
/photorealistic /editorial /documentary

03. CAMERA, SENSOR & OPTICS
Camera & Lens: {{CAMARA}}
Depth of field: Shallow natural optical bokeh, sharp focus on eyes and primary textures.

04. LIGHTING SETUP
{{LUZ}}

05. COLOR PALETTE & FILM LOOK
{{PALETA}}

06. COMPOSITION & FRAMING
Rule of thirds, authentic posture, breathing room in frame, eye-level perspective.

07. TEXTURE & REALISM
/filmgrain /naturaltexture /realisticskin /rawphotography

08. OUTPUT & NEGATIVE INSTRUCTIONS
Aspect ratio: {{RATIO}}
Avoid: plastic skin, artificial oversaturation, fake HDR, distorted hands, unwanted text, watermarks.`,
  },
  {
    id: 'video',
    label: 'Video & Cine en Movimiento',
    shortLabel: 'Video & Cine',
    badge: 'SEC. 22',
    description: 'Guion técnico de toma continua con trayectoria de cámara, cadencia temporal y diseño sonoro.',
    mode: 'video',
    defaultAspectRatio: '16:9',
    variables: [
      {
        key: 'ESCENA',
        label: 'Escena y atmósfera',
        placeholder: 'Ej. Galería brutalista al amanecer con neblina sutil',
        defaultValue: 'Galería contemporánea de concreto visto al amanecer con neblina sutil y haces de sol',
      },
      {
        key: 'ACCION',
        label: 'Sujeto y acción continua',
        placeholder: 'Ej. Escultura cinética girando lentamente mientras el polvo flota',
        defaultValue: 'Escultura cinética de bronce y vidrio rotando suavemente mientras partículas de polvo flotan en la luz',
      },
      {
        key: 'MOVIMIENTO',
        label: 'Trayectoria de cámara',
        placeholder: 'Ej. Slow stabilized 180-degree orbit shot',
        defaultValue: 'Slow stabilized orbital tracking shot moving smoothly around the subject',
      },
      {
        key: 'ESTETICA',
        label: 'Cámara y color de cine',
        placeholder: 'Ej. ARRI Alexa 35, Cooke Anamorphic 40mm, Kodak 2383',
        defaultValue: 'ARRI Alexa 35, Cooke Anamorphic 40mm T2.3, Kodak 2383 print film look',
      },
      {
        key: 'RATIO',
        label: 'Formato',
        placeholder: 'Ej. 16:9 o 2.39:1',
        defaultValue: '16:9',
      },
    ],
    templateBody: `MASTER VIDEO PROMPT — CINEMATOGRAPHY & MOTION
01. SCENE & ATMOSPHERE
{{ESCENA}}

02. SUBJECT & CONTINUOUS ACTION
{{ACCION}}

03. CINEMA CAMERA & COLOR SCIENCE
{{ESTETICA}}

04. CAMERA MOVEMENT & TRAJECTORY
{{MOVIMIENTO}}
Cadence: 24 fps cinema motion blur, steady constant velocity, zero jitter.

05. CONTINUITY & OUTPUT
Aspect ratio: {{RATIO}}
Maintain exact geometry, consistent light direction and object permanence across all frames.
Negative: no morphing, no warping, no sudden cuts, no flickering textures.`,
  },
  {
    id: 'design',
    label: 'Diseño Gráfico, Cartel & Editorial',
    shortLabel: 'Cartel & Editorial',
    badge: 'GRÁFICO',
    description: 'Ideal para afiches culturales, portadas de libros, risografía y composiciones con reserva tipográfica.',
    mode: 'photo',
    defaultAspectRatio: '2:3',
    variables: [
      {
        key: 'TEMA',
        label: 'Concepto del cartel o portada',
        placeholder: 'Ej. Festival de arte sonoro y tecnología comunitaria',
        defaultValue: 'Afiche cultural para un festival de arte sonoro, ecología y programación creativa',
      },
      {
        key: 'ESTILO',
        label: 'Sistema gráfico y técnica',
        placeholder: 'Ej. Diseño suizo + textura de risografía en papel algodón',
        defaultValue: 'Estilo gráfico suizo contemporáneo impreso en risografía sobre papel algodón sin estucar',
      },
      {
        key: 'PALETA',
        label: 'Paleta de tintas',
        placeholder: 'Ej. Azul cobalto, amarillo cadmio y negro tinta sobre crema',
        defaultValue: 'Dos tintas dominantes azul cobalto (#326BFF) y amarillo cadmio (#F8C300) sobre papel crema cálido',
      },
      {
        key: 'RESERVA',
        label: 'Espacio para texto',
        placeholder: 'Ej. Tercio superior limpio para titular',
        defaultValue: 'Generoso espacio negativo limpio en el tercio superior reservado para titular posterior en maquetación',
      },
      {
        key: 'RATIO',
        label: 'Formato',
        placeholder: 'Ej. 2:3 o 4:5',
        defaultValue: '2:3',
      },
    ],
    templateBody: `MASTER PROMPT — GRAPHIC DESIGN & EDITORIAL POSTER
01. VISUAL CONCEPT
{{TEMA}}

02. GRAPHIC SYSTEM & PRINT MEDIUM
{{ESTILO}}

03. GRID & COMPOSITION
Swiss modular layout, strong visual hierarchy, bold central geometric/illustrative motif.
Copy space: {{RESERVA}}

04. INK PALETTE & PAPER TEXTURE
{{PALETA}}
Subtle halftone grain, authentic overprint ink registration, crisp edges.

05. CONSTRAINTS & NEGATIVES
Aspect ratio: {{RATIO}}
No random illegible text, no garbled typography, no cheap 3D bevels, no stock clipart look.`,
  },
  {
    id: 'branding',
    label: 'Identidad Visual & Packaging',
    shortLabel: 'Marca & Packaging',
    badge: 'BRANDING',
    description: 'Para prototipar empaques, sistemas de papelería, materiales táctiles y presentaciones de marca.',
    mode: 'photo',
    defaultAspectRatio: '4:5',
    variables: [
      {
        key: 'PRODUCTO',
        label: 'Objeto o empaque',
        placeholder: 'Ej. Bolsa de café de origen en papel kraft y sello en relieve',
        defaultValue: 'Empaque editorial de café de origen colombiano en cartón reciclado crema con sello en bajo relieve',
      },
      {
        key: 'MATERIAL',
        label: 'Materiales y acabados',
        placeholder: 'Ej. Papel algodón mate, tinta soja negra, cerámica cruda',
        defaultValue: 'Papel algodón 350g sin brillo, estampado seco (debossing), vidrio ámbar mate y base de piedra travertino',
      },
      {
        key: 'ESCENARIO',
        label: 'Escenografía de estudio',
        placeholder: 'Ej. Mesa arquitectónica con sombra diagonal de sol',
        defaultValue: 'Set minimalista de estudio sobre bloque de piedra cálida con sombra diagonal de luz natural',
      },
      {
        key: 'PALETA',
        label: 'Paleta de marca',
        placeholder: 'Ej. Crema papel, carbón profundo, acento terracota',
        defaultValue: 'Crema papel, negro carbón mate y acento terracota orgánico',
      },
      {
        key: 'RATIO',
        label: 'Formato',
        placeholder: 'Ej. 4:5 o 1:1',
        defaultValue: '4:5',
      },
    ],
    templateBody: `MASTER PROMPT — BRAND IDENTITY & PACKAGING MOCKUP
01. HERO PACKAGING / BRAND APPLICATION
{{PRODUCTO}}

02. TACTILE MATERIALS & PRODUCTION FINISHES
{{MATERIAL}}

03. ART DIRECTION & SET DESIGN
{{ESCENARIO}}
Camera: Phase One IQ4, 90mm macro lens at f/8, razor sharp packaging edges, clean reflections.

04. BRAND COLOR SYSTEM
{{PALETA}}

05. PRODUCTION SAFETY
Aspect ratio: {{RATIO}}
Clean minimal label area without hallucinated gibberish text, no floating artifacts, realistic contact shadows.`,
  },
  {
    id: 'web',
    label: 'Interfaz Web & Producto Digital (UI/UX)',
    shortLabel: 'UI / Web',
    badge: 'DIGITAL',
    description: 'Dirección visual para pantallas, landing pages culturales, apps educativas y prototipos de interfaz.',
    mode: 'photo',
    defaultAspectRatio: '16:9',
    variables: [
      {
        key: 'PRODUCTO',
        label: 'Tipo de sitio o app',
        placeholder: 'Ej. Plataforma cultural interactiva de archivo fotográfico',
        defaultValue: 'Página de inicio de un archivo cultural interactivo y laboratorio de diseño contemporáneo',
      },
      {
        key: 'ESTETICA',
        label: 'Dirección visual UI',
        placeholder: 'Ej. Editorial minimalista suizo, alto contraste, tarjetas limpias',
        defaultValue: 'Diseño editorial minimalista suizo, tipografía geométrica expresiva, grilla asimétrica y mucho aire visual',
      },
      {
        key: 'PALETA',
        label: 'Sistema de color UI',
        placeholder: 'Ej. Fondo hueso #F4F2ED, texto carbón #101014, acento azul',
        defaultValue: 'Fondo crema claro #F4F2ED, tinta carbón #101014, acentos puntuales en amarillo cadmio y azul cobalto',
      },
      {
        key: 'PRESENTACION',
        label: 'Encuadre de presentación',
        placeholder: 'Ej. Vista plana limpia de navegador desktop 16:9',
        defaultValue: 'Flat clean desktop viewport presentation, crisp pixel alignment, readable grid structure',
      },
      {
        key: 'RATIO',
        label: 'Formato',
        placeholder: 'Ej. 16:9',
        defaultValue: '16:9',
      },
    ],
    templateBody: `MASTER PROMPT — WEB DESIGN & DIGITAL INTERFACE CONCEPT
01. DIGITAL PRODUCT BRIEF
{{PRODUCTO}}

02. VISUAL SYSTEM & TYPOGRAPHIC HIERARCHY
{{ESTETICA}}
Clear navigation bar, strong editorial headline, high-contrast focal photography, structured content cards.

03. COLOR TOKENS & CONTRAST
{{PALETA}}
Accessible contrast, zero cluttered neon gradients, clean hairline dividers.

04. PRESENTATION VIEW
{{PRESENTACION}}

05. NEGATIVE CONSTRAINTS
Aspect ratio: {{RATIO}}
Avoid messy overlapping UI widgets, avoid blurry illegible microtext, avoid generic dark-purple SaaS templates.`,
  },
  {
    id: 'art',
    label: 'Instalación Interactiva & Arte Experimental',
    shortLabel: 'Instalación & Arte',
    badge: 'MUSEOGRAFÍA',
    description: 'Prototipado visual de exposiciones, projection mapping, esculturas de luz y piezas con escala humana.',
    mode: 'photo',
    defaultAspectRatio: '16:9',
    variables: [
      {
        key: 'OBRA',
        label: 'Concepto de la instalación',
        placeholder: 'Ej. Bosques de hilos luminosos reactivos al sonido en sala oscura',
        defaultValue: 'Instalación audiovisual inmersiva con haces de luz arquitectónicos y proyecciones generativas de partículas reactivas al sonido',
      },
      {
        key: 'ESPACIO',
        label: 'Arquitectura del lugar',
        placeholder: 'Ej. Antigua nave industrial de ladrillo convertida en centro cultural',
        defaultValue: 'Antigua nave industrial de concreto y ladrillo convertida en sala de arte contemporáneo',
      },
      {
        key: 'PUBLICO',
        label: 'Escala humana y público',
        placeholder: 'Ej. Dos visitantes en silueta observando a distancia',
        defaultValue: 'Tres visitantes en silueta oscura interactuando suavemente, dando escala monumental real a la pieza',
      },
      {
        key: 'ATMOSFERA',
        label: 'Luz, óptica y registro',
        placeholder: 'Ej. 24mm gran angular, bruma sutil para ver los rayos de luz',
        defaultValue: '24mm wide-angle architectural documentary photo, subtle theatrical haze revealing volumetric light beams, realistic reflections on polished concrete floor',
      },
      {
        key: 'RATIO',
        label: 'Formato',
        placeholder: 'Ej. 16:9',
        defaultValue: '16:9',
      },
    ],
    templateBody: `MASTER PROMPT — INTERACTIVE INSTALLATION & CONTEMPORARY ART
01. ARTWORK & CONCEPT
{{OBRA}}

02. EXHIBITION ARCHITECTURE
{{ESPACIO}}

03. HUMAN SCALE & PARTICIPATION
{{PUBLICO}}

04. DOCUMENTATION PHOTOGRAPHY & ATMOSPHERE
{{ATMOSFERA}}

05. CURATORIAL REALISM
Aspect ratio: {{RATIO}}
Photographed as real biennial exhibition documentation, authentic projector light falloff, no sci-fi HUD overlays, no cartoon glow.`,
  },
];

export const PROMPT_BEFORE_AFTER_CASES: PromptBeforeAfterCase[] = [
  {
    id: 'ba-portrait',
    discipline: 'Retrato',
    title: 'De retrato genérico con piel plástica a retrato documental con alma',
    weakPrompt: 'retrato bonito de una mujer artista en su taller, muy realista, 8k, iluminación perfecta, ultra detallado',
    diagnosis: 'Palabras vacías como "bonito", "8k" o "iluminación perfecta" empujan al modelo hacia caras genéricas con piel plastificada y luz artificial sin intención.',
    strongPrompt: 'Editorial portrait of a 42-year-old Colombian printmaker standing beside an etching press in her sunlit studio, captured on Leica M11 with 50mm f/2 lens. Soft directional north-window Rembrandt lighting, natural skin texture with fine lines and ink stains on her hands, warm Kodak Portra 400 tones, candid composed gaze, 4:5 aspect ratio. Avoid airbrushed plastic skin.',
    improvements: [
      'Define edad, oficio y detalles reales (manchas de tinta, prensa de grabado).',
      'Cambia "8k" por óptica y luz concreta (50mm f/2, ventana norte tipo Rembrandt).',
      'Agrega restricción explícita contra piel retocada artificialmente.',
    ],
    builderPatch: {
      mode: 'photo',
      subject: '42-year-old printmaker beside an etching press in a sunlit studio, subtle ink stains on hands',
      genre: '/editorial',
      camera: 'Leica M11',
      lens: '50mm f/2.0',
      lighting: 'Soft directional north-window Rembrandt light',
      colorPalette: 'Kodak Portra 400 warm authentic tones',
      aspectRatio: '4:5',
    },
  },
  {
    id: 'ba-product',
    discipline: 'Producto',
    title: 'De foto plana de catálogo a dirección de arte comercial',
    weakPrompt: 'botella de perfume elegante sobre una mesa, fondo bonito, fotografía profesional de publicidad',
    diagnosis: 'No define material del frasco, superficie de apoyo, ángulo de cámara ni comportamiento físico de la luz sobre el vidrio.',
    strongPrompt: 'Commercial luxury still-life of a heavy fluted amber glass botanical perfume bottle resting on a wet dark basalt slab, surrounded by subtle morning condensation droplets. Shot on Phase One IQ4 with 100mm macro lens at f/8, crisp dual rim lights carving specular edges on glass, dark mineral backdrop with generous clean copy space above, 4:5 aspect ratio, no gibberish label text.',
    improvements: [
      'Especifica geometría y materialidad (vidrio ámbar estriado, basalto húmedo).',
      'Usa f/8 y macro 100mm para nitidez de producto de borde a borde.',
      'Reserva espacio negativo superior para titular publicitario.',
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Fluted amber glass botanical perfume bottle on wet dark basalt slab with fine condensation droplets',
      genre: '/commercial',
      camera: 'Phase One IQ4',
      lens: '100mm Macro f/8',
      lighting: 'Dual studio rim lights + overhead softbox',
      colorPalette: 'Warm amber glass & dark charcoal mineral',
      aspectRatio: '4:5',
    },
  },
  {
    id: 'ba-architecture',
    discipline: 'Arquitectura',
    title: 'De edificio futurista cliché a pabellón bioclimático creíble',
    weakPrompt: 'biblioteca moderna futurista con plantas, arquitectura increíble, luz del sol, hiperrealista',
    diagnosis: '"Futurista" suele generar vidrio azul curvo genérico y perspectivas torcidas sin materiales locales ni escala humana.',
    strongPrompt: 'Architectural photography of a contemporary bioclimatic public library built with board-formed raw concrete, warm local cedar louvers and an interior courtyard filled with native ferns. Captured with a 24mm tilt-shift lens keeping strictly parallel vertical lines, oblique late afternoon sunlight casting crisp geometric shadows across concrete floors, two readers in silhouette for human scale, 3:2.',
    improvements: [
      'Nombra materiales constructivos reales (concreto encofrado, celosías de cedro).',
      'Usa lente 24mm tilt-shift para garantizar verticales rectas.',
      'Incluye escala humana y dirección horaria exacta del sol.',
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Bioclimatic public library made of board-formed concrete and warm cedar louvers with native fern courtyard',
      genre: '/photorealistic',
      camera: 'Sony A7R V',
      lens: '24mm Tilt-Shift f/8',
      lighting: 'Oblique late afternoon sunlight casting crisp geometric shadows',
      colorPalette: 'Warm mineral concrete, cedar wood & deep botanical green',
      aspectRatio: '3:2',
    },
  },
  {
    id: 'ba-video',
    discipline: 'Cine / Video',
    title: 'De secuencia confusa con saltos a plano cinematográfico continuo',
    weakPrompt: 'video cinematográfico de un ciclista en una ciudad lluviosa de noche con luces neón y cámara épica',
    diagnosis: 'Sin trayectoria exacta de cámara, velocidad ni continuidad, los modelos de video improvisan cortes bruscos o deforman la bicicleta.',
    strongPrompt: 'Continuous 24fps cinema tracking shot filmed on ARRI Alexa 35 with 35mm anamorphic lens. Camera glides smoothly sideways at eye level following a cyclist pedaling steadily through a quiet rain-slicked avenue at dusk. Warm sodium streetlights and turquoise storefront reflections ripple across wet asphalt, steady physical motion, subtle raindrop streaks, no sudden camera cuts, no morphing, 16:9.',
    improvements: [
      'Define un solo movimiento continuo ("glides smoothly sideways at eye level").',
      'Describe la acción en presente y con ritmo constante.',
      'Agrega restricciones temporales ("no sudden cuts, no morphing").',
    ],
    builderPatch: {
      mode: 'video',
      subject: 'Cyclist pedaling steadily along a quiet rain-slicked avenue at dusk with warm streetlights reflecting on wet asphalt',
      genre: '/cinematicvideo',
      camera: 'ARRI Alexa 35',
      lens: '35mm Anamorphic T2.3',
      lighting: 'Warm sodium streetlamps + cool turquoise storefront reflections',
      colorPalette: 'Restrained Teal & Amber Nocturne',
      aspectRatio: '16:9',
    },
  },
  {
    id: 'ba-poster',
    discipline: 'Cartel Gráfico',
    title: 'De imagen saturada a cartel cultural con jerarquía gráfica',
    weakPrompt: 'poster de festival de música electrónica y arte, colorido, diseño gráfico moderno genial',
    diagnosis: 'Al no definir técnica de impresión, paleta acotada ni espacio negativo, la IA inventa texto corrupto y mezcla demasiados estilos.',
    strongPrompt: 'Contemporary Swiss-inspired cultural poster illustration for an experimental sound art festival, printed in two-ink risograph (cobalt blue and cadmium yellow) on warm uncoated cotton paper. Central minimalist visual metaphor of geometric acoustic wave rings intersecting an organic botanical leaf, generous clean cream negative space at the top third reserved for typography, subtle halftone paper grain, 2:3 aspect ratio, strictly no text or letters.',
    improvements: [
      'Limita la paleta a 2 tintas sobre papel real (risografía en papel algodón).',
      'Usa una metáfora visual clara en vez de adjetivos vagos ("moderno genial").',
      'Pide explícitamente cero texto para maquetar la tipografía real después.',
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Swiss-inspired cultural poster artwork showing geometric acoustic wave rings intersecting a botanical leaf in two-ink risograph print, clean top negative space',
      genre: '/editorial',
      camera: 'Flat Print Scan / Studio Reproduction',
      lens: '50mm Flat Field',
      lighting: 'Even archival studio reproduction light',
      colorPalette: 'Cobalt blue & cadmium yellow ink on warm cream cotton paper',
      aspectRatio: '2:3',
    },
  },
];

export const PRACTICE_DRILLS: PracticeDrill[] = [
  {
    id: 'drill-01',
    code: 'EJ-01',
    title: 'Un mismo sujeto, tres esquemas de luz',
    level: 'Inicial',
    duration: '15 min',
    skill: 'Control de Iluminación',
    objective: 'Comprender cómo la luz cambia por completo la narrativa emocional sin modificar al sujeto ni el encuadre.',
    steps: [
      'Mantén idéntico el sujeto y el lente (ej. busto de cerámica en 85mm f/2.8).',
      'Genera versión A con luz High Key difusa, versión B con Rembrandt a 45° y versión C con Split Lighting lateral a 90°.',
      'Compara qué versión transmite calma, cuál misterio y cuál volumen táctil.',
    ],
    starterPrompt: 'Studio portrait of a raw terracotta sculpture bust on a matte charcoal pedestal, shot on 85mm f/2.8, [CAMBIAR LUZ: High Key diffused wraparound / 45-degree Rembrandt / 90-degree dramatic Split lighting], crisp clay texture, 4:5.',
    evaluationChecklist: [
      'El sujeto y el ángulo se mantuvieron estables en las 3 pruebas.',
      'Se distingue claramente la dirección y dureza de cada sombra.',
    ],
    freeTools: [
      { name: 'Gemini', role: 'Generar 3 variaciones de luz gratis', url: 'https://gemini.google.com/' },
      { name: 'Leonardo.ai', role: '150 tokens diarios gratis', url: 'https://app.leonardo.ai/' },
      { name: 'Qwen Chat', role: 'Imagen gratis sin límite inicial', url: 'https://chat.qwenlm.ai/' },
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Raw terracotta sculpture bust on a matte charcoal pedestal with crisp clay texture',
      genre: '/fineart',
      lighting: '45-degree Rembrandt directional key light',
      aspectRatio: '4:5',
    },
  },
  {
    id: 'drill-02',
    code: 'EJ-02',
    title: 'Narrativa óptica: 24mm contextual vs. 85mm íntimo',
    level: 'Inicial',
    duration: '15 min',
    skill: 'Lenguaje de Lentes',
    objective: 'Dominar la diferencia entre contar el entorno (gran angular) y aislar la emoción (teleobjetivo corto).',
    steps: [
      'Elige una escena de oficio real (panadería, taller de serigrafía o huerta urbana).',
      'Genera primero con 24mm f/5.6 mostrando herramientas, espacio y contexto.',
      'Repite exactamente la misma escena cambiando a 85mm f/1.8 enfocado en manos o mirada.',
    ],
    starterPrompt: 'Documentary photograph in a sunlit screenprinting studio, artist pulling a squeegee over fresh ink, shot on [CAMBIAR LENTE: 24mm f/5.6 wide environmental view / 85mm f/1.8 intimate close-up with creamy bokeh], Kodak Portra 400, 3:2.',
    evaluationChecklist: [
      'La versión 24mm explica claramente el espacio completo del taller.',
      'La versión 85mm comprime el fondo y dirige la mirada al gesto principal.',
    ],
    freeTools: [
      { name: 'Gemini', role: 'Fotorrealismo documental gratis', url: 'https://gemini.google.com/' },
      { name: 'Leonardo.ai', role: 'Control óptico y encuadre', url: 'https://app.leonardo.ai/' },
      { name: 'Google AI Studio', role: 'Comparar y depurar prompts', url: 'https://aistudio.google.com/' },
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Artist pulling a screenprinting squeegee over vibrant ink inside a sunlit print studio',
      genre: '/documentary',
      lighting: 'Available natural workshop daylight',
      aspectRatio: '3:2',
    },
  },
  {
    id: 'drill-03',
    code: 'EJ-03',
    title: 'Cartel con espacio negativo listo para tipografía',
    level: 'Inicial',
    duration: '20 min',
    skill: 'Composición Editorial',
    objective: 'Aprender a dirigir la composición dejando aire limpio para diseñar titulares reales en Figma, Illustrator, Canva o Photopea.',
    steps: [
      'Define un motivo central en el tercio inferior o lateral derecho.',
      'Indica explícitamente "generous uncluttered negative space in upper third for headline typography" y "/notext".',
      'Verifica si podrías colocar un título grande y una fecha legible sin pelear contra el fondo.',
    ],
    starterPrompt: 'Editorial poster artwork for a botanical design exhibition, delicate backlit monstera leaf casting crisp architectural shadows along the bottom right corner, generous clean warm cream negative space across the upper two thirds for headline layout, minimal print grain, strictly no text, 2:3.',
    evaluationChecklist: [
      'El tercio superior está despejado y ofrece alto contraste para texto.',
      'La imagen no contiene letras deformes ni marcas inventadas.',
    ],
    freeTools: [
      { name: 'Ideogram', role: 'Cartel + tipografía precisa gratis', url: 'https://ideogram.ai/' },
      { name: 'Canva', role: 'Maquetar titular y fechas gratis', url: 'https://www.canva.com/' },
      { name: 'Photopea', role: 'Edición PSD gratis en navegador', url: 'https://www.photopea.com/' },
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Backlit botanical leaf casting crisp shadows in bottom-right corner with generous clean warm cream negative space across the top for typography',
      genre: '/editorial',
      lighting: 'Crisp directional studio sunlight',
      aspectRatio: '2:3',
    },
  },
  {
    id: 'drill-04',
    code: 'EJ-04',
    title: 'Consistencia de personaje en 3 planos narrativos',
    level: 'Intermedio',
    duration: '25 min',
    skill: 'Storytelling & Personajes',
    objective: 'Mantener vestuario, rasgos, paleta y estilo intactos al pasar de plano general a primer plano.',
    steps: [
      'Redacta un bloque fijo de "ancla de identidad" (edad, peinado, prenda distintiva, paleta).',
      'Pega ese bloque sin alterarlo en 3 prompts distintos: plano general caminando, plano medio observando un mapa y primer plano reaccionando.',
      'Revisa qué atributos del ancla resistieron mejor entre tomas.',
    ],
    starterPrompt: '[ANCLA FIJA: Young Andean botanist woman, short wavy dark hair, mustard canvas field jacket with brass buttons, leather satchel, gouache editorial illustration style] — Scene 1: Wide shot walking across misty cloud forest trail at dawn, muted sage and ochre palette, 16:9.',
    evaluationChecklist: [
      'La chaqueta mostaza, el cabello y el medio pictórico coinciden en las 3 escenas.',
      'Cada plano cambia claramente de escala sin perder coherencia visual.',
    ],
    freeTools: [
      { name: 'Google Whisk', role: 'Remix de Sujeto + Escena + Estilo gratis', url: 'https://labs.google/fx/tools/whisk' },
      { name: 'Google Flow', role: 'Continuidad de personaje en escenas', url: 'https://labs.google/fx/tools/flow' },
      { name: 'DeepSeek', role: 'Redactar ancla de identidad coherente', url: 'https://chat.deepseek.com/' },
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Young Andean botanist woman with short wavy dark hair wearing a mustard canvas field jacket and leather satchel walking across a misty cloud forest trail, gouache editorial illustration',
      genre: '/fineart',
      lighting: 'Soft misty dawn mountain light',
      aspectRatio: '16:9',
    },
  },
  {
    id: 'drill-05',
    code: 'EJ-05',
    title: 'Dirección de producto con materiales táctiles reales',
    level: 'Intermedio',
    duration: '20 min',
    skill: 'Publicidad & Bodegón',
    objective: 'Sustituir adjetivos vacíos ("lujoso", "bonito") por física de materiales, reflejos y superficies concretas.',
    steps: [
      'Elige un producto artesanal o local (jabón botánico, café, cerámica, bebida).',
      'Describe exactamente 3 texturas: el material del objeto, el pedestal y un elemento atmosférico (vapor, gotas, sombra de hoja).',
      'Ajusta el prompt hasta lograr sombras de contacto creíbles y cero texto inventado.',
    ],
    starterPrompt: 'Commercial studio product photograph of a matte hand-thrown stoneware coffee pour-over carafe resting on warm travertine stone beside roasted coffee beans, delicate rising steam backlit by soft morning window light, 90mm macro f/8, clean natural shadows, no logos or text, 4:5.',
    evaluationChecklist: [
      'Se percibe la porosidad real de la cerámica y la piedra.',
      'El objeto apoya con sombra de contacto física (no parece pegado).',
    ],
    freeTools: [
      { name: 'Krea AI', role: 'Upscaler y control en vivo gratis', url: 'https://www.krea.ai/' },
      { name: 'Microsoft Designer', role: 'Bodegón y borrado de fondo gratis', url: 'https://designer.microsoft.com/' },
      { name: 'Canva', role: 'Armar pieza publicitaria final', url: 'https://www.canva.com/' },
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Matte hand-thrown stoneware coffee pour-over carafe on warm travertine stone with delicate rising steam',
      genre: '/commercial',
      lighting: 'Backlit soft morning window light with subtle fill',
      aspectRatio: '4:5',
    },
  },
  {
    id: 'drill-06',
    code: 'EJ-06',
    title: 'Toma continua de video sin morphing',
    level: 'Intermedio',
    duration: '20 min',
    skill: 'Cine Generativo',
    objective: 'Escribir un prompt de video de 5–8 segundos que respete la física real y una sola trayectoria limpia de cámara.',
    steps: [
      'Elige una acción física simple y observable (viento en cortinas, agua cayendo, manos tejiendo).',
      'Especifica un único movimiento de cámara (ej. slow dolly-in) en lugar de combinar varios.',
      'Añade instrucciones explícitas de cadencia (24fps) y estabilidad temporal.',
    ],
    starterPrompt: 'Slow stabilized dolly-in cinema shot at 24fps inside a quiet sunlit conservatory. Sheer linen curtains billow gently in a warm breeze while dappled leaf shadows drift smoothly across a wooden reading table. Shot on ARRI Alexa 35, 40mm lens, consistent physical motion, zero camera shake, no morphing, 16:9.',
    evaluationChecklist: [
      'Solo hay un movimiento de cámara claro de principio a fin.',
      'La escena describe física realista fácil de sostener durante varios segundos.',
    ],
    freeTools: [
      { name: 'Google Flow', role: 'Dirección de escena cinematográfica', url: 'https://labs.google/fx/tools/flow' },
      { name: 'Hailuo AI', role: 'Créditos diarios gratis de video', url: 'https://hailuoai.video/' },
      { name: 'CapCut / Clipchamp', role: 'Montaje y subtítulos 1080p gratis', url: 'https://clipchamp.com/' },
    ],
    builderPatch: {
      mode: 'video',
      subject: 'Sheer linen curtains billowing gently in a quiet sunlit conservatory with drifting leaf shadows on a wooden table',
      genre: '/cinematicvideo',
      lighting: 'Warm dappled afternoon sunlight through foliage',
      aspectRatio: '16:9',
    },
  },
  {
    id: 'drill-07',
    code: 'EJ-07',
    title: 'Auditoría de sesgos y representación situada',
    level: 'Avanzado',
    duration: '25 min',
    skill: 'Ética & Dirección Crítica',
    objective: 'Detectar estereotipos automáticos de los modelos de IA y reescribir prompts hacia representaciones diversas y situadas.',
    steps: [
      'Prueba un prompt neutro breve (ej. "experto en tecnología dando una charla") y observa qué género, edad y estética asume el modelo por defecto.',
      'Reescribe el prompt incorporando contexto latinoamericano contemporáneo, diversidad etaria y vestuario real sin folclorismo.',
      'Documenta qué palabras clave desactivaron el estereotipo.',
    ],
    starterPrompt: 'Authentic documentary photograph of a 58-year-old Afro-Colombian software engineer leading a community robotics workshop inside a bright contemporary public library in Medellín, mixed-age participants collaborating around wooden tables, natural window daylight, 35mm documentary lens, dignified candid realism, 3:2.',
    evaluationChecklist: [
      'La escena evita clichés turísticos y estéticas corporativas genéricas.',
      'El entorno y la luz corresponden a un espacio real y creíble.',
    ],
    freeTools: [
      { name: 'DeepSeek', role: 'Auditar sesgos del prompt gratis', url: 'https://chat.deepseek.com/' },
      { name: 'Kimi.ai', role: 'Contrastar bibliografía y contexto', url: 'https://kimi.ai/' },
      { name: 'Gemini', role: 'Comparar versiones visuales gratis', url: 'https://gemini.google.com/' },
    ],
    builderPatch: {
      mode: 'photo',
      subject: '58-year-old Afro-Colombian engineer leading an intergenerational community robotics workshop in a bright contemporary public library',
      genre: '/documentary',
      lighting: 'Natural bright daylight through wide library windows',
      aspectRatio: '3:2',
    },
  },
  {
    id: 'drill-08',
    code: 'EJ-08',
    title: 'Prototipo museográfico de instalación interactiva',
    level: 'Avanzado',
    duration: '30 min',
    skill: 'Arte & Tecnología',
    objective: 'Visualizar una propuesta de instalación física real (para convocatorias, becas o clientes) antes de producirla.',
    steps: [
      'Define el dispositivo físico real (pantallas, proyectores, sensores, espejos o textiles).',
      'Sitúa la pieza en una arquitectura específica con público interactuando en silueta.',
      'Asegura que el resultado parezca foto documental de bienal y no un render de videojuego.',
    ],
    starterPrompt: 'Exhibition documentation photograph of an interactive light and sound installation inside a dark concrete cultural center: suspended translucent vertical fabric sheets catching crisp white geometric laser projections that ripple as two visitors walk between them. Captured on 24mm wide lens, authentic low-light grain, subtle floor reflections, real biennial catalog feel, 16:9.',
    evaluationChecklist: [
      'Se entiende cómo funciona físicamente la obra dentro del espacio.',
      'Incluye escala humana real y evita efectos gráficos imposibles.',
    ],
    freeTools: [
      { name: 'Blender', role: 'Bloqueo espacial 3D 100% gratis', url: 'https://www.blender.org/' },
      { name: 'Google AI Studio', role: 'Estructurar memoria técnica gratis', url: 'https://aistudio.google.com/' },
      { name: 'Leonardo.ai', role: 'Visualización museográfica gratis', url: 'https://app.leonardo.ai/' },
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Interactive light installation with suspended translucent fabric sheets catching geometric white projections as two visitors walk through a dark concrete gallery',
      genre: '/fineart',
      lighting: 'Crisp volumetric projector beams in dark exhibition room',
      aspectRatio: '16:9',
    },
  },
  {
    id: 'drill-09',
    code: 'EJ-09',
    title: 'Paisaje sonoro, música instrumental y Foley para video IA',
    level: 'Inicial',
    duration: '20 min',
    skill: 'Audio, Música & FX',
    objective: 'Dar cuerpo físico y emoción a un clip de video mudo combinando música instrumental, Foley puntual y ambiente real sin gastar dinero.',
    steps: [
      'Genera una cama musical instrumental minimalista (70–85 BPM, sin voces) en Suno o Udio usando emociones e instrumentos concretos.',
      'Crea o descarga 2 efectos puntuales de Foley (lluvia, pasos, viento, cerámica) en Stable Audio, ElevenLabs SFX o Freesound.',
      'Mezcla las 3 capas en Audacity o CapCut dejando la música a -18 dB para que el ambiente respire.',
    ],
    starterPrompt: '[MÚSICA — SUNO/UDIO]: Minimalist cinematic instrumental, warm felt piano, soft solo cello and subtle vinyl room tone, 72 BPM, contemplative Andean dawn mood, no vocals, clean dynamic build.  |  [FX — STABLE AUDIO / ELEVENLABS SFX]: Soft steady morning rain on clay roof tiles with distant courtyard birds, crisp stereo field recording, 15 seconds.',
    evaluationChecklist: [
      'La música acompaña la imagen sin tapar los efectos físicos ni saturar.',
      'Existen al menos 2 capas sonoras diferenciadas (música + ambiente/Foley).',
    ],
    freeTools: [
      { name: 'Suno', role: 'Música instrumental gratis diaria', url: 'https://suno.com/' },
      { name: 'Stable Audio', role: 'Efectos FX y atmósferas gratis', url: 'https://stableaudio.com/' },
      { name: 'Freesound', role: 'Foley y ambientes CC gratis', url: 'https://freesound.org/' },
      { name: 'Audacity', role: 'Mezcla multipista 100% gratis', url: 'https://www.audacityteam.org/' },
    ],
    builderPatch: {
      mode: 'video',
      subject: 'Quiet Andean stone courtyard during soft morning rain with subtle mist drifting over clay roof tiles',
      genre: '/cinematicvideo',
      lighting: 'Soft overcast misty dawn light',
      aspectRatio: '16:9',
    },
  },
  {
    id: 'drill-10',
    code: 'EJ-10',
    title: 'Micro-podcast documental limpio con guion y voz IA',
    level: 'Intermedio',
    duration: '25 min',
    skill: 'Voces & Podcast',
    objective: 'Producir un episodio piloto de 2 minutos desde investigación hasta masterización profesional usando únicamente herramientas gratuitas.',
    steps: [
      'Sube 2 textos o notas a Kimi.ai, DeepSeek o NotebookLM para armar una escaleta de 3 bloques (apertura, hallazgo y cierre) o un Audio Overview.',
      'Graba tu voz con el celular y pásala por Adobe Podcast (Enhance Speech), o genera una locución en español con ElevenLabs o TTSMaker.',
      'Une voz + cortinilla musical en Audacity y nivela el volumen final automáticamente en Auphonic.',
    ],
    starterPrompt: '[GUION PODCAST — KIMI.AI / DEEPSEEK]: Redacta un guion conversacional de 2 minutos (aprox. 280 palabras) para un micro-podcast cultural sobre arte y tecnología en América Latina. Tono cercano y claro, sin tecnicismos vacíos. Incluye marcas explícitas de [PAUSA 1s], [CORTINILLA MUSICAL 4s] y [EFECTO AMBIENTE TALLER].',
    evaluationChecklist: [
      'La voz suena limpia, sin eco de habitación ni saltos bruscos de volumen.',
      'La música baja suavemente cuando entra la locución (ducking limpio).',
    ],
    freeTools: [
      { name: 'Adobe Podcast', role: 'Limpiar voz grabada gratis (1h/día)', url: 'https://podcast.adobe.com/' },
      { name: 'ElevenLabs', role: 'Voz expresiva y aislador gratis', url: 'https://elevenlabs.io/' },
      { name: 'TTSMaker', role: 'Voces en español 100% gratis', url: 'https://ttsmaker.com/' },
      { name: 'NotebookLM', role: 'Podcast conversacional desde PDFs', url: 'https://notebooklm.google.com/' },
      { name: 'Auphonic', role: 'Masterización podcast gratis (2h/mes)', url: 'https://auphonic.com/' },
    ],
    builderPatch: {
      mode: 'photo',
      subject: 'Warm editorial documentary portrait of two cultural podcast hosts recording with condenser microphones inside an intimate acoustic studio',
      genre: '/documentary',
      lighting: 'Warm amber practical desk lamps with soft window fill',
      aspectRatio: '16:9',
    },
  },
];

export const PROMPT_TROUBLESHOOTING_CASES: TroubleshootingCase[] = [
  {
    id: 'err-plastic-skin',
    category: 'Retrato y Anatomía',
    symptom: 'Piel plástica, rostro de cera o look "render 3D"',
    cause: 'Uso de palabras como "flawless", "perfect skin", "beauty retouch", "8k hyperdetailed" o ausencia de referencia óptica y película.',
    removeTokens: ['flawless skin', 'perfect face', 'smooth skin', '8k octane render', 'airbrushed'],
    addTokens: ['authentic natural skin texture', 'visible fine pores', 'subtle analog film grain', 'shot on 35mm film', 'unretouched editorial realism'],
    fixedExample: 'Editorial portrait with authentic natural skin texture, fine pores and subtle film grain, shot on 85mm f/2.0, natural window light.',
    negativePrompt: 'plastic skin, waxy face, airbrushed, heavy beauty filter, CGI skin, porcelain doll, oversmoothed',
  },
  {
    id: 'err-hands',
    category: 'Retrato y Anatomía',
    symptom: 'Manos deformes, dedos extra o poses antinaturales',
    cause: 'Describir acciones manuales demasiado complejas sin dar contexto espacial o pedir múltiples manos superpuestas en primer plano.',
    removeTokens: ['intricate hand gestures', 'complex fingers', 'awkward pose'],
    addTokens: ['natural relaxed posture', 'anatomically accurate hands resting on wooden table', 'medium portrait framing'],
    fixedExample: 'Medium portrait of an architect with relaxed posture, anatomically accurate hands resting naturally on rolled paper blueprints.',
    negativePrompt: 'extra fingers, fused fingers, deformed hands, mutated anatomy, six fingers, distorted wrists',
  },
  {
    id: 'err-gibberish-text',
    category: 'Texto y Composición',
    symptom: 'Letras deformes, logotipos falsos o texto basura en carteles y empaques',
    cause: 'Escenas urbanas, botellas, camisetas o libros sin instrucción explícita de suprimir texto o sin especificar comillas exactas en modelos tipográficos.',
    removeTokens: ['branded packaging', 'newspaper text', 'signage everywhere'],
    addTokens: ['clean blank minimalist label', 'unbranded surfaces', '/notext', 'clean negative space for later typography'],
    fixedExample: 'Minimalist ceramic bottle with clean blank cream label and unbranded packaging, generous negative space above, strictly no text.',
    negativePrompt: 'gibberish text, misspelled words, random letters, fake logos, watermarks, signature, typography artifacts',
  },
  {
    id: 'err-flat-light',
    category: 'Luz y Color',
    symptom: 'Iluminación plana, sin volumen ni profundidad atmosférica',
    cause: 'Escribir solo "buena iluminación" o "bien iluminado" hace que el modelo aplique luz frontal pareja sin contraste ni dirección.',
    removeTokens: ['good lighting', 'bright light', 'perfect lighting'],
    addTokens: ['directional 45-degree side light', 'soft shadow falloff', 'subtle rear rim light', 'motivated window light'],
    fixedExample: 'Directional late-afternoon side sunlight entering from the left, sculpted soft shadows and subtle warm rim light separating silhouette from background.',
    negativePrompt: 'flat front flash, even shadowless lighting, washed out contrast, dull grey lighting',
  },
  {
    id: 'err-warped-arch',
    category: 'Texto y Composición',
    symptom: 'Paredes inclinadas, columnas torcidas o perspectiva arquitectónica imposible',
    cause: 'Ángulos muy extremos sin nombrar corrección óptica ni referencias geométricas claras.',
    removeTokens: ['fisheye', 'crazy perspective', 'ultra dramatic angle'],
    addTokens: ['24mm tilt-shift architectural lens', 'strictly parallel vertical lines', 'leveled horizon', 'coherent structural geometry'],
    fixedExample: 'Architectural interior photographed with a 24mm tilt-shift lens, strictly parallel vertical lines and leveled horizon.',
    negativePrompt: 'tilted verticals, warped walls, impossible Escher geometry, fisheye distortion, crooked horizon',
  },
  {
    id: 'err-video-morph',
    category: 'Video y Continuidad',
    symptom: 'Video con morphing, objetos que mutan o cortes inesperados',
    cause: 'Pedir demasiados eventos, cambios de vestuario o múltiples movimientos de cámara dentro de un clip corto de 5 segundos.',
    removeTokens: ['fast epic montage', 'camera spins and zooms and flies', 'chaotic transformation'],
    addTokens: ['single continuous stabilized dolly-in shot', 'steady physical inertia', 'consistent subject geometry', '24fps natural motion blur'],
    fixedExample: 'Single continuous stabilized slow tracking shot at 24fps, consistent subject geometry and lighting from start to finish.',
    negativePrompt: 'morphing, melting objects, flickering details, sudden jump cuts, erratic camera shake, warping limbs',
  },
  {
    id: 'err-ai-slop',
    category: 'Luz y Color',
    symptom: 'Estética sobrecargada "sopa IA" (demasiado brillo, humo y fantasía genérica)',
    cause: 'Apilar demasiados modificadores de tendencia ("trending on artstation, unreal engine 5, epic masterpiece, ultra glow").',
    removeTokens: ['trending on artstation', 'unreal engine 5', 'epic masterpiece', 'hyperdetailed glowing', 'award winning'],
    addTokens: ['restrained editorial art direction', 'natural materials', 'authentic optical imperfections', 'clean uncluttered composition'],
    fixedExample: 'Restrained editorial photography with natural matte materials, subtle shadow depth and clean uncluttered composition.',
    negativePrompt: 'oversaturated HDR, neon glow spam, generic fantasy CGI, cluttered visual noise, shiny plastic reflections',
  },
  {
    id: 'err-oversaturated',
    category: 'Luz y Color',
    symptom: 'Colores chillones, naranjas nucleares o contrastes artificiales',
    cause: 'Pedir "colores vibrantes" o "HDR" sin acotar una paleta concreta ni una referencia tonal sobria.',
    removeTokens: ['vibrant neon colors', 'extreme HDR', 'vivid saturation'],
    addTokens: ['controlled three-color palette', 'soft highlight roll-off', 'muted organic film tones', 'Fujifilm Eterna color science'],
    fixedExample: 'Controlled three-color palette of warm cream, muted olive and deep charcoal, soft highlight roll-off inspired by Fujifilm Eterna.',
    negativePrompt: 'oversaturated colors, clipped highlights, garish neon tint, aggressive HDR halo, artificial cyan cast',
  },
  {
    id: 'err-no-copy-space',
    category: 'Texto y Composición',
    symptom: 'Composición abarrotada donde no cabe un titular ni logo',
    cause: 'El modelo centra al sujeto llenando el 90% del cuadro cuando no se define proporción de aire o encuadre asimétrico.',
    removeTokens: ['close full frame center', 'filled background'],
    addTokens: ['generous clean negative space on upper third', 'off-center rule of thirds placement', 'uncluttered matte backdrop'],
    fixedExample: 'Subject positioned in the lower right third with generous clean matte negative space across the upper left for editorial typography.',
    negativePrompt: 'cluttered background, cropped tight head, busy distracting props, centered overcrowded frame',
  },
  {
    id: 'err-bias-cliche',
    category: 'Retrato y Anatomía',
    symptom: 'Caras repetitivas (clones IA) o estereotipos culturales planos',
    cause: 'Usar descripciones genéricas ("persona", "artista", "ciudad latina") sin rasgos individuales, rango etario ni detalles cotidianos reales.',
    removeTokens: ['beautiful generic model', 'exotic stereotype', 'typical crowd'],
    addTokens: ['distinctive lived-in facial features', 'specific age range', 'authentic contemporary local clothing', 'candid human expression'],
    fixedExample: 'Candid portrait of a 64-year-old community radio host with silver curls, glasses and warm lived-in smile inside a real neighborhood studio.',
    negativePrompt: 'clone faces, mannequin symmetry, stereotypical costume clichés, stock photo fake smile',
  },
];

export const NEGATIVE_PROMPT_PACKS: NegativePromptPack[] = [
  {
    id: 'neg-portrait',
    title: 'Retrato & Piel Real',
    useCase: 'Fotografía editorial, documental y moda sin acabado de cera.',
    tokens: [
      'plastic skin',
      'waxy texture',
      'airbrushed',
      'extra fingers',
      'deformed hands',
      'asymmetrical pupils',
      'clone face',
      'heavy beauty filter',
    ],
  },
  {
    id: 'neg-product',
    title: 'Producto & Publicidad',
    useCase: 'Bodegones, packaging, cosmética y gastronomía limpia.',
    tokens: [
      'gibberish text',
      'fake logos',
      'warped bottle geometry',
      'floating disconnected shadows',
      'cheap CGI reflection',
      'watermarks',
      'cluttered background',
    ],
  },
  {
    id: 'neg-arch',
    title: 'Arquitectura & Interiores',
    useCase: 'Espacios creíbles con líneas rectas y materiales nobles.',
    tokens: [
      'tilted vertical lines',
      'impossible geometry',
      'fisheye distortion',
      'warped windows',
      'melted furniture',
      'oversaturated HDR sky',
      'floating stairs',
    ],
  },
  {
    id: 'neg-design',
    title: 'Diseño Gráfico & Cartel',
    useCase: 'Piezas limpias listas para maquetación tipográfica real.',
    tokens: [
      'illegible text',
      'random letters',
      'corrupted typography',
      'stock clipart look',
      'cheap 3D bevels',
      'messy visual clutter',
      'watermarks',
    ],
  },
  {
    id: 'neg-illustration',
    title: 'Ilustración & Personajes',
    useCase: 'Cómic, storyboard, álbum ilustrado y concepto de mundos.',
    tokens: [
      'inconsistent line weight',
      'muddy shading',
      'extra limbs',
      'generic anime gloss',
      'blurred outlines',
      'cropped unintended frame',
    ],
  },
  {
    id: 'neg-video',
    title: 'Video & Cine Generativo',
    useCase: 'Runway, Veo, Kling y Luma con estabilidad física.',
    tokens: [
      'morphing',
      'melting faces',
      'flickering textures',
      'sudden camera cuts',
      'warping hands',
      'jittery motion',
      'temporal ghosting',
    ],
  },
];

export const ASPECT_RATIO_SPECS: AspectRatioSpec[] = [
  {
    ratio: '1:1',
    name: 'Cuadrado Editorial',
    widthUnits: 1,
    heightUnits: 1,
    midjourneyFlag: '--ar 1:1',
    platforms: 'Carruseles, portadas de discos, catálogos y avatares.',
    bestFor: 'Composiciones simétricas, bodegón cenital y diseño gráfico modular.',
    framingTip: 'Aprovecha la simetría central o retículas 2×2 muy limpias.',
  },
  {
    ratio: '4:5',
    name: 'Vertical Feed & Retrato',
    widthUnits: 4,
    heightUnits: 5,
    midjourneyFlag: '--ar 4:5',
    platforms: 'Instagram Feed, publicidad de producto y portadas editoriales.',
    bestFor: 'Retratos de medio cuerpo, moda y fotografía comercial de empaques.',
    framingTip: 'Deja el 25% superior limpio si vas a superponer titular.',
  },
  {
    ratio: '2:3',
    name: 'Afiche / Cartel Clásico',
    widthUnits: 2,
    heightUnits: 3,
    midjourneyFlag: '--ar 2:3',
    platforms: 'Pósters impresos, portadas de libros, Pinterest y exposiciones.',
    bestFor: 'Carteles culturales, retratos de cuerpo entero y arquitectura vertical.',
    framingTip: 'Funciona excelente con jerarquía vertical en 3 bandas.',
  },
  {
    ratio: '3:2',
    name: 'Fotografía 35mm Clásica',
    widthUnits: 3,
    heightUnits: 2,
    midjourneyFlag: '--ar 3:2',
    platforms: 'Fotolibros, portafolios web, reportaje documental y prensa.',
    bestFor: 'Calle, documental humano, arquitectura horizontal y paisajes.',
    framingTip: 'Proporción natural de cámaras Leica, Sony y rollo 35mm.',
  },
  {
    ratio: '16:9',
    name: 'Panorámico Video & Web',
    widthUnits: 16,
    heightUnits: 9,
    midjourneyFlag: '--ar 16:9',
    platforms: 'YouTube, presentaciones, hero banners web, Runway y Google Veo.',
    bestFor: 'Storyboards, instalaciones interactivas, cine digital y mundos.',
    framingTip: 'Coloca sujeto en un tercio lateral para equilibrar contexto y recorrido.',
  },
  {
    ratio: '2.39:1',
    name: 'Cinemascope Anamórfico',
    widthUnits: 21,
    heightUnits: 9,
    midjourneyFlag: '--ar 21:9',
    platforms: 'Cine de autor, trailers, stills anamórficos y cabeceras inmersivas.',
    bestFor: 'Paisajes épicos, diálogos en plano ancho y ciencia ficción sobria.',
    framingTip: 'Ideal para contrastar pequeña escala humana frente a arquitectura o territorio.',
  },
  {
    ratio: '9:16',
    name: 'Vertical Móvil & Pantalla',
    widthUnits: 9,
    heightUnits: 16,
    midjourneyFlag: '--ar 9:16',
    platforms: 'Reels, TikTok, Shorts, tótems digitales y pantallas verticales de galería.',
    bestFor: 'Loops generativos verticales, moda dinámica y cápsulas educativas.',
    framingTip: 'Evita ubicar elementos clave en el 18% inferior (zona de botones en móvil).',
  },
];

export const EXTRA_CURATED_PALETTES: ExtraPaletteItem[] = [
  {
    name: 'Núcleo Editorial',
    colors: ['Papel Crema', 'Carbón Mate', 'Amarillo Cadmio', 'Azul Cobalto'],
    hexCodes: ['#F4F2ED', '#101014', '#F8C300', '#326BFF'],
    description: 'Sistema editorial contemporáneo de alta legibilidad que combina papel cálido, tinta profunda y acentos gráficos precisos.',
    vibe: 'Editorial, Cultural, Diseño Suizo',
    promptSnippet: 'warm cream cotton paper (#F4F2ED), matte charcoal ink (#101014), crisp cadmium yellow (#F8C300) and cobalt blue (#326BFF) graphic accents',
  },
  {
    name: 'Risografía Botánica',
    colors: ['Verde Pino', 'Coral Tinta', 'Arena Papel'],
    hexCodes: ['#1D5B4C', '#E95B47', '#F2E9DC'],
    description: 'Impresión en dos tintas translúcidas con textura de sobreimpresión ideal para fanzines, carteles y arte impreso.',
    vibe: 'Gráfico, Artesanal, Impreso',
    promptSnippet: 'two-ink risograph print palette in deep pine green (#1D5B4C) and coral vermilion (#E95B47) over warm uncoated sand paper (#F2E9DC)',
  },
  {
    name: 'Selva & Cobre',
    colors: ['Verde Selva', 'Cobre Oxidado', 'Piedra Basalto'],
    hexCodes: ['#18392B', '#B86B3B', '#232528'],
    description: 'Atmósfera tropical sobria para arquitectura bioclimática, café de origen, moda sostenible y cine territorial.',
    vibe: 'Bioclimático, Orgánico, Sofisticado',
    promptSnippet: 'deep rainforest botanical green (#18392B), burnished copper earth (#B86B3B) and dark volcanic basalt (#232528)',
  },
  {
    name: 'Cal & Terracota',
    colors: ['Cal Cálida', 'Arcilla Roja', 'Oliva Seca'],
    hexCodes: ['#EFE8DC', '#B4523A', '#6D7357'],
    description: 'Paleta mineral mediterránea y andina para cerámica, gastronomía de autor, libros y fotografía de interiores.',
    vibe: 'Táctil, Artesanal, Luminoso',
    promptSnippet: 'sun-baked lime plaster (#EFE8DC), warm terracotta clay (#B4523A) and muted dry olive (#6D7357) natural tones',
  },
];

export const QUICK_CHEATSHEETS: Record<
  'optica' | 'luz' | 'video' | 'estructura',
  { title: string; subtitle: string; rows: CheatSheetRow[] }
> = {
  optica: {
    title: 'Guía Rápida de Distancias Focales',
    subtitle: 'Cómo cambia la perspectiva y la cercanía emocional según el lente que escribas.',
    rows: [
      { term: '14mm – 20mm', effect: 'Amplitud extrema, líneas fugadas dramáticas y profundidad monumental.', promptToken: '14mm ultra-wide rectilinear lens', idealUse: 'Museos, interiores amplios, paisaje épico.' },
      { term: '24mm – 28mm', effect: 'Contextualiza sujeto + entorno con naturalidad documental.', promptToken: '24mm wide-angle lens f/5.6', idealUse: 'Calle, talleres, arquitectura, reportaje.' },
      { term: '35mm', effect: 'El estándar narrativo del cine y el fotoperiodismo clásico.', promptToken: '35mm prime lens f/2.0', idealUse: 'Escenas humanas, planos medios, diálogo.' },
      { term: '50mm', effect: 'Perspectiva fiel al ojo humano sin distorsión geométrica.', promptToken: '50mm standard prime lens f/1.8', idealUse: 'Retrato ambiental, gastronomía, editorial.' },
      { term: '85mm', effect: 'Estiliza rasgos faciales y disuelve el fondo en bokeh cremoso.', promptToken: '85mm portrait prime lens f/1.8', idealUse: 'Retrato editorial, moda, entrevistas.' },
      { term: '100mm Macro', effect: 'Revela microtexturas, gotas, fibras y relieves milimétricos.', promptToken: '100mm macro 1:1 lens f/8', idealUse: 'Producto, joyería, botánica, alimentos.' },
      { term: '135mm+', effect: 'Compresión espacial intensa; acerca el fondo tras el sujeto.', promptToken: '135mm telephoto lens f/2.0', idealUse: 'Cine contemplativo, exteriores, escenarios.' },
    ],
  },
  luz: {
    title: 'Esquemas de Iluminación Clave',
    subtitle: 'Palabras exactas que reemplazan el genérico "buena iluminación".',
    rows: [
      { term: 'Rembrandt (45°)', effect: 'Triángulo de luz bajo el ojo en sombra; volumen clásico y carácter.', promptToken: '45-degree Rembrandt directional key light', idealUse: 'Retrato autoral, cine dramático.' },
      { term: 'Butterfly / Paramount', effect: 'Luz frontal elevada con pequeña sombra simétrica bajo la nariz.', promptToken: 'overhead frontal Butterfly studio lighting', idealUse: 'Belleza, portadas, moda limpia.' },
      { term: 'Split (90°)', effect: 'Mitad del rostro iluminada y mitad en sombra profunda.', promptToken: '90-degree high-contrast Split lighting', idealUse: 'Neo Noir, tensión, retratos escénicos.' },
      { term: 'Rim Light / Contraluz', effect: 'Halo luminoso que recorta hombros, cabello o bordes de vidrio.', promptToken: 'crisp rear Rim lighting outlining edges', idealUse: 'Botellas, siluetas nocturnas, escenarios.' },
      { term: 'Volumétrica / God Rays', effect: 'Haces de luz visibles atravesando neblina, humo o polvo.', promptToken: 'volumetric light shafts through subtle haze', idealUse: 'Instalaciones, arquitectura, cine.' },
      { term: 'Golden / Blue Hour', effect: 'Sol bajo dorado cálido o crepúsculo azul profundo equilibrado.', promptToken: 'low golden hour raking sunlight', idealUse: 'Exteriores, documental, paisaje urbano.' },
    ],
  },
  video: {
    title: 'Movimientos de Cámara para Video IA',
    subtitle: 'Usa un solo movimiento claro por toma para evitar morphing.',
    rows: [
      { term: 'Static Tripod', effect: 'Cámara fija; toda la vida ocurre dentro del encuadre.', promptToken: 'locked-off static tripod shot, subtle ambient motion', idealUse: 'Loops, arquitectura, entrevistas, diálogos.' },
      { term: 'Slow Dolly-In', effect: 'Acercamiento físico suave hacia el sujeto aumentando intimidad.', promptToken: 'slow stabilized dolly-in camera movement', idealUse: 'Revelación emocional, producto hero.' },
      { term: 'Orbit Shot', effect: 'Recorrido circular continuo alrededor de un objeto o persona.', promptToken: 'smooth 180-degree orbital tracking shot', idealUse: 'Esculturas, moda, empaques, instalaciones.' },
      { term: 'Lateral Tracking', effect: 'Desplazamiento paralelo acompañando una caminata o vehículo.', promptToken: 'steady lateral tracking shot at eye level', idealUse: 'Personajes en movimiento, calle, cine.' },
      { term: 'Crane Up / Reveal', effect: 'Elevación vertical progresiva revelando la escala del lugar.', promptToken: 'slow crane-up revealing full environment', idealUse: 'Planos finales, ciudades, paisajes.' },
      { term: 'Handheld Subtle', effect: 'Respiración orgánica de cámara en mano sin temblor caótico.', promptToken: 'subtle organic documentary handheld motion', idealUse: 'Documental, realismo social, tensión.' },
    ],
  },
  estructura: {
    title: 'Fórmula de 7 Capas para Cualquier Prompt',
    subtitle: 'Orden recomendado de mayor a menor peso en los modelos actuales.',
    rows: [
      { term: '01 · Sujeto y Acción', effect: 'Quién o qué protagoniza y qué está haciendo exactamente.', promptToken: '[Edad/Rol/Objeto + material + acción precisa]', idealUse: 'Siempre al inicio del prompt.' },
      { term: '02 · Medio y Género', effect: 'Define si es foto editorial, risografía, stop motion o cine.', promptToken: 'editorial documentary photo / risograph poster', idealUse: 'Evita que el modelo adivine el estilo.' },
      { term: '03 · Entorno y Escala', effect: 'Dónde ocurre, época, clima y relación con el espacio.', promptToken: 'inside a sunlit concrete workshop, misty dawn', idealUse: 'Ancla la credibilidad territorial.' },
      { term: '04 · Composición y Lente', effect: 'Plano, ángulo, lente y espacio libre para texto.', promptToken: 'medium shot, 50mm f/2, clean top negative space', idealUse: 'Controla jerarquía y encuadre.' },
      { term: '05 · Iluminación', effect: 'Dirección, temperatura y dureza de la luz.', promptToken: 'soft north-window side light, crisp shadows', idealUse: 'Aporta tridimensionalidad y emoción.' },
      { term: '06 · Paleta y Textura', effect: 'Colores dominantes, película o soporte físico.', promptToken: 'warm terracotta & cream palette, subtle film grain', idealUse: 'Da coherencia a series completas.' },
      { term: '07 · Formato y Negativos', effect: 'Proporción del cuadro y qué artefactos bloquear.', promptToken: 'aspect ratio 4:5, no text, no plastic skin', idealUse: 'Limpia errores antes de renderizar.' },
    ],
  },
};

export const WORKSHOP_PREFLIGHT_CHECKLIST: WorkshopCheckItem[] = [
  {
    id: 'chk-01',
    group: 'Técnico',
    label: 'Relación de aspecto correcta para el destino final',
    detail: 'Confirmaste 4:5, 2:3, 16:9 o 9:16 antes de generar para evitar recortes forzados.',
  },
  {
    id: 'chk-02',
    group: 'Técnico',
    label: 'Sin texto basura ni artefactos en bordes o manos',
    detail: 'Revisaste etiquetas, fondos, manos, ojos y reflejos al 100% de zoom.',
  },
  {
    id: 'chk-03',
    group: 'Técnico',
    label: 'Resolución y nitidez aptas para pantalla o impresión',
    detail: 'Definiste si requiere escalado posterior (upscale) o limpieza en editor gráfico.',
  },
  {
    id: 'chk-04',
    group: 'Dirección de Arte',
    label: 'Coherencia de luz, óptica y paleta en toda la serie',
    detail: 'Si entregas más de una pieza, todas comparten temperatura de color y medio visual.',
  },
  {
    id: 'chk-05',
    group: 'Dirección de Arte',
    label: 'Espacio negativo real para tipografía e identidad',
    detail: 'El diseño final respira y permite insertar títulos reales con contraste WCAG AA.',
  },
  {
    id: 'chk-06',
    group: 'Dirección de Arte',
    label: 'Cero adjetivos vacíos y lenguaje visual propio',
    detail: 'La pieza comunica tu intención conceptual y no luce como una plantilla genérica de IA.',
  },
  {
    id: 'chk-07',
    group: 'Ética y Derechos',
    label: 'Revisión de sesgos y representación digna',
    detail: 'Evaluaste que las personas y territorios no reproduzcan estereotipos ni folclorismos.',
  },
  {
    id: 'chk-08',
    group: 'Ética y Derechos',
    label: 'Respeto por artistas vivos y marcas registradas',
    detail: 'Evitaste copiar el estilo personal de artistas contemporáneos o logotipos protegidos.',
  },
  {
    id: 'chk-09',
    group: 'Ética y Derechos',
    label: 'Consentimiento en retratos o fotografías de terceros',
    detail: 'Solo subiste o restauraste imágenes propias o con permiso explícito de sus titulares.',
  },
  {
    id: 'chk-10',
    group: 'Ética y Derechos',
    label: 'Transparencia sobre el uso de IA en créditos',
    detail: 'Cuando aplica (editorial, educación, concursos o clientes), declaras cómo se usó la IA en el proceso.',
  },
];
