export type BuilderCategoryId =
  | 'photo'
  | 'video'
  | 'graphic'
  | 'branding'
  | 'illustration'
  | 'architecture'
  | 'web-ui'
  | 'experimental';

export type BuilderPlatformTarget =
  | 'universal'
  | 'midjourney'
  | 'gemini'
  | 'chatgpt'
  | 'runway'
  | 'json';

export interface BuilderCategoryConfig {
  id: BuilderCategoryId;
  label: string;
  shortLabel: string;
  baseMode: 'photo' | 'video';
  tagline: string;
  subjectPlaceholder: string;
  actionPlaceholder: string;
  settingPlaceholder: string;
  defaultAspectRatio: string;
  defaultGenre: string;
  defaultVisualStyle: string;
  genres: { label: string; cmd: string }[];
  styles: string[];
  extraField1: {
    key: 'medium' | 'soundDesign' | 'layoutGrid' | 'materials' | 'characterDetails' | 'architectureStyle' | 'uiFramework';
    label: string;
    options: string[];
  };
  extraField2: {
    key: 'typography' | 'materials' | 'medium' | 'customNotes';
    label: string;
    placeholder: string;
    suggestions: string[];
  };
  recommendedApps: { name: string; url: string }[];
  quickSample: {
    subject: string;
    action: string;
    setting: string;
    lighting: string;
    colorPalette: string;
    aspectRatio: string;
  };
}

export const BUILDER_CATEGORIES: BuilderCategoryConfig[] = [
  {
    id: 'photo',
    label: 'Fotografía & Retrato',
    shortLabel: 'Fotografía',
    baseMode: 'photo',
    tagline: 'Retrato editorial, documental 35mm, moda, gastronomía y fotografía de autor.',
    subjectPlaceholder: 'Ej: Retrato de una ceramista de 45 años con manos cubiertas de arcilla',
    actionPlaceholder: 'Ej: moldeando una vasija en el torno, mirada serena',
    settingPlaceholder: 'Ej: taller artesanal con ventanal amplio y estantes de barro',
    defaultAspectRatio: '4:5',
    defaultGenre: '/editorial',
    defaultVisualStyle: 'Editorial Contemporáneo',
    genres: [
      { label: 'Editorial Revista', cmd: '/editorial' },
      { label: 'Documental 35mm', cmd: '/documentary' },
      { label: 'Retrato Cinematográfico', cmd: '/cinematicportrait' },
      { label: 'Fotorrealista RAW', cmd: '/photorealistic' },
      { label: 'Moda & Lookbook', cmd: '/fashioneditorial' },
      { label: 'Macro & Gastronomía', cmd: '/macro' },
      { label: 'Fotografía Callejera', cmd: '/streetphotography' },
      { label: 'Bellas Artes', cmd: '/fineart' },
    ],
    styles: [
      'Editorial Contemporáneo',
      'Documental Analógico 35mm',
      'Neo Noir Nocturno',
      'Retrato Escultórico Sobrio',
      'Alta Moda Minimalista',
      'Fotoperiodismo Humanista',
    ],
    extraField1: {
      key: 'medium',
      label: 'Emulsión / Sensor',
      options: [
        'Película Kodak Portra 400 (grano orgánico cálido)',
        'Digital Medio Formato RAW sin filtro plástico',
        'CineStill 800T (halos cálidos nocturnos)',
        'Ilford HP5 400 Blanco y Negro',
        'Fujifilm Eterna suave cinematográfico',
      ],
    },
    extraField2: {
      key: 'customNotes',
      label: 'Detalle clave de autenticidad',
      placeholder: 'Ej: poros reales, reflejo sutil en ojos, tejido de lino natural',
      suggestions: [
        'poros reales y líneas de expresión naturales',
        'reflejo natural de ventana en los ojos (catchlight)',
        'sin retoque de belleza artificial',
      ],
    },
    recommendedApps: [
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/' },
      { name: 'Gemini', url: 'https://gemini.google.com/' },
      { name: 'Midjourney', url: 'https://www.midjourney.com/' },
      { name: 'ChatGPT', url: 'https://chatgpt.com/' },
      { name: 'FLUX / Freepik', url: 'https://www.freepik.com/ai/image-generator' },
    ],
    quickSample: {
      subject: 'Retrato editorial de una grabadora de 42 años junto a su prensa metálica',
      action: 'sosteniendo una matriz recién entintada con expresión serena',
      setting: 'taller luminoso de grabado con ventanal norte y papel secando al fondo',
      lighting: 'Luz natural lateral de ventana tipo Rembrandt a 45°',
      colorPalette: 'Kodak Portra 400 cálido y orgánico',
      aspectRatio: '4:5',
    },
  },
  {
    id: 'video',
    label: 'Video & Cine IA',
    shortLabel: 'Video & Cine',
    baseMode: 'video',
    tagline: 'Secuencias cinematográficas, cámara en movimiento, loops y diseño sonoro.',
    subjectPlaceholder: 'Ej: Escultura cinética de bronce rotando suavemente en una sala de museo',
    actionPlaceholder: 'Ej: partículas de polvo flotan atravesando un haz de sol matinal',
    settingPlaceholder: 'Ej: galería brutalista de concreto visto con neblina sutil',
    defaultAspectRatio: '16:9',
    defaultGenre: '/cinematicvideo',
    defaultVisualStyle: 'Cine Independiente 35mm',
    genres: [
      { label: 'Cine Narrativo', cmd: '/cinematicvideo' },
      { label: 'Comercial de Marca', cmd: '/commercialfilm' },
      { label: 'Videoarte / Instalación', cmd: '/artfilm' },
      { label: 'Loop Audiovisual Infinito', cmd: '/loopvideo' },
      { label: 'Documental Poético', cmd: '/documentaryfilm' },
      { label: 'Stop Motion 12fps', cmd: '/stopmotion' },
      { label: 'VFX & Fluidos', cmd: '/particle-simulation' },
    ],
    styles: [
      'Cine Independiente 35mm',
      'Anamórfico Cinemascope',
      'Documental Contemplativo',
      'Comercial de Alta Velocidad',
      'Stop Motion Artesanal',
      'Videoarte Generativo',
    ],
    extraField1: {
      key: 'soundDesign',
      label: 'Diseño Sonoro / Audio Diegético',
      options: [
        'Ambiente diegético silencioso (room tone + viento sutil)',
        'Foley táctil de materiales, pasos y agua cercana',
        'Drone atmosférico grave + eco de galería',
        'Paisaje urbano nocturno bajo lluvia ligera',
        'Sin diálogo, ritmo hipnótico contemplativo',
      ],
    },
    extraField2: {
      key: 'customNotes',
      label: 'Continuidad temporal y física',
      placeholder: 'Ej: mantener rostro, luz y geometría estables sin cortes ni morphing',
      suggestions: [
        'un solo plano continuo sin cortes abruptos',
        'inercia física realista y luz constante de inicio a fin',
        'primer y último fotograma sincronizados en loop',
      ],
    },
    recommendedApps: [
      { name: 'Runway Gen-3', url: 'https://app.runwayml.com/' },
      { name: 'Google Flow / Veo', url: 'https://labs.google/fx/tools/flow' },
      { name: 'Kling AI', url: 'https://klingai.com/' },
      { name: 'Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine' },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/' },
    ],
    quickSample: {
      subject: 'Ciclista avanzando con calma por una avenida lluviosa al anochecer',
      action: 'pedaleando de forma constante mientras reflejos cálidos vibran sobre el asfalto húmedo',
      setting: 'avenida latinoamericana nocturna con farolas de sodio y tiendas iluminadas',
      lighting: 'Luz práctica urbana cálida en contraste con reflejos azul petróleo',
      colorPalette: 'Teal & Orange contenido de cine nocturno',
      aspectRatio: '16:9',
    },
  },
  {
    id: 'graphic',
    label: 'Diseño Gráfico & Cartel',
    shortLabel: 'Diseño Gráfico',
    baseMode: 'photo',
    tagline: 'Afiches culturales, tipografía experimental, portadas editoriales y risografía.',
    subjectPlaceholder: 'Ej: Cartel cultural para un festival de arte sonoro y tecnología comunitaria',
    actionPlaceholder: 'Ej: ondas geométricas interceptando una silueta botánica en tensión visual',
    settingPlaceholder: 'Ej: papel algodón crema sin estucar con textura real de impresión',
    defaultAspectRatio: '2:3',
    defaultGenre: '/posterdesign',
    defaultVisualStyle: 'Diseño Suizo Contemporáneo',
    genres: [
      { label: 'Cartel / Afiche Cultural', cmd: '/posterdesign' },
      { label: 'Portada Editorial / Libro', cmd: '/editorialcover' },
      { label: 'Tipografía 3D Expresiva', cmd: '/3dtypography' },
      { label: 'Risografía Dos Tintas', cmd: '/risograph' },
      { label: 'Collage Gráfico Mixto', cmd: '/graphiccollage' },
      { label: 'Sistema de Infografía', cmd: '/infographic' },
    ],
    styles: [
      'Diseño Suizo Contemporáneo',
      'Risografía Artesanal 2 Tintas',
      'Serigrafía Latinoamericana',
      'Brutalismo Tipográfico Editorial',
      'Bauhaus Geométrico Limpio',
      'Collage Fotográfico + Gráfica',
    ],
    extraField1: {
      key: 'layoutGrid',
      label: 'Retícula y Reserva Tipográfica',
      options: [
        'Tercio superior despejado (espacio negativo para titular)',
        'Retícula modular suiza asimétrica de 12 columnas',
        'Composición central icónica con márgenes amplios',
        'Doble página editorial con jerarquía imagen + aire',
        'Diagonal dinámica con bloque inferior limpio para fechas',
      ],
    },
    extraField2: {
      key: 'typography',
      label: 'Texto exacto (entre comillas) o sin texto',
      placeholder: 'Ej: Título exacto "SONIDO VIVO" arriba — o escribir "Sin texto para maquetar"',
      suggestions: [
        'Sin texto ni letras (espacio limpio para maquetar en Figma/Illustrator)',
        'Tipografía geométrica audaz con el texto exacto "FUTURO VIVO"',
        'Tipografía condensada suiza con el texto exacto "NÚCLEO 2026"',
      ],
    },
    recommendedApps: [
      { name: 'Ideogram', url: 'https://ideogram.ai/' },
      { name: 'Recraft', url: 'https://www.recraft.ai/' },
      { name: 'ChatGPT', url: 'https://chatgpt.com/' },
      { name: 'Midjourney', url: 'https://www.midjourney.com/' },
      { name: 'Gemini', url: 'https://gemini.google.com/' },
    ],
    quickSample: {
      subject: 'Afiche cultural minimalista donde anillos acústicos geométricos cruzan una hoja botánica',
      action: 'impresión en risografía con registro auténtico de dos tintas translúcidas',
      setting: 'papel algodón crema 300g con amplio espacio negativo superior para titular',
      lighting: 'Reproducción plana de escáner editorial uniforme sin reflejos',
      colorPalette: 'Núcleo Editorial (Crema, Carbón, Amarillo Cadmio y Azul Cobalto)',
      aspectRatio: '2:3',
    },
  },
  {
    id: 'branding',
    label: 'Branding & Packaging',
    shortLabel: 'Branding',
    baseMode: 'photo',
    tagline: 'Empaques táctiles, productos de lujo, identidad visual y mockups de marca.',
    subjectPlaceholder: 'Ej: Bolsa de café de origen colombiano y vaso cerámico sobre piedra travertino',
    actionPlaceholder: 'Ej: vapor delicado ascendiendo con sombra de contacto nítida',
    settingPlaceholder: 'Ej: set minimalista de estudio sobre bloque mineral cálido',
    defaultAspectRatio: '4:5',
    defaultGenre: '/packagingdesign',
    defaultVisualStyle: 'Lujo Editorial Sostenible',
    genres: [
      { label: 'Packaging & Empaque', cmd: '/packagingdesign' },
      { label: 'Producto Hero Comercial', cmd: '/premiumshowcase' },
      { label: 'Papelería & Identidad', cmd: '/brandidentity' },
      { label: 'Bodegón Flotante', cmd: '/floatingstilllife' },
      { label: 'Campaña Cosmética', cmd: '/beautyproduct' },
      { label: 'Mockup Editorial Real', cmd: '/brandmockup' },
    ],
    styles: [
      'Lujo Editorial Sostenible',
      'Minimalismo Industrial Nórdico',
      'Artesanal Contemporáneo',
      'Publicidad Escultórica de Estudio',
      'Alta Cosmética Botánica',
    ],
    extraField1: {
      key: 'materials',
      label: 'Materiales y Acabados de Producción',
      options: [
        'Papel algodón 350g mate + bajo relieve seco (debossing)',
        'Vidrio ámbar estriado + tapa de madera de nogal',
        'Cerámica gres sin esmaltar + piedra travertino cálida',
        'Aluminio anodizado cepillado + acrílico esmerilado',
        'Cartón kraft reciclado + tinta negra de soja',
      ],
    },
    extraField2: {
      key: 'typography',
      label: 'Etiqueta / Marca o superficie limpia',
      placeholder: 'Ej: Etiqueta crema minimalista en blanco sin texto basura',
      suggestions: [
        'etiqueta minimalista limpia en blanco sin texto inventado',
        'sello discreto en bajo relieve con la palabra "ORIGEN"',
        'espacio superior limpio para titular publicitario',
      ],
    },
    recommendedApps: [
      { name: 'ChatGPT', url: 'https://chatgpt.com/' },
      { name: 'Midjourney', url: 'https://www.midjourney.com/' },
      { name: 'Ideogram', url: 'https://ideogram.ai/' },
      { name: 'FLUX / Freepik', url: 'https://www.freepik.com/ai/image-generator' },
      { name: 'Adobe Firefly', url: 'https://firefly.adobe.com/' },
    ],
    quickSample: {
      subject: 'Frasco de vidrio ámbar de sérum botánico junto a un bloque de piedra travertino',
      action: 'suspendido con gotas finas de condensación congeladas en el aire',
      setting: 'estudio publicitario minimalista sobre fondo arena cálido con aire superior',
      lighting: 'Softbox de estudio + doble luz de recorte (rim light) en bordes de vidrio',
      colorPalette: 'Desert & Earth Tones (Arena, Terracota y Ámbar)',
      aspectRatio: '4:5',
    },
  },
  {
    id: 'illustration',
    label: 'Ilustración & Personajes',
    shortLabel: 'Ilustración',
    baseMode: 'photo',
    tagline: 'Diseño de personajes, hojas turnaround, cómic, álbum ilustrado y concept art.',
    subjectPlaceholder: 'Ej: Botánica andina joven con chaqueta mostaza y cuaderno de campo ilustrado',
    actionPlaceholder: 'Ej: dibujando una orquídea luminosa mientras camina por un sendero de niebla',
    settingPlaceholder: 'Ej: bosque de niebla con puentes de madera y arquitectura orgánica al fondo',
    defaultAspectRatio: '3:2',
    defaultGenre: '/conceptart',
    defaultVisualStyle: 'Gouache Editorial Texturizado',
    genres: [
      { label: 'Hoja de Personaje (Turnaround)', cmd: '/characterdesign' },
      { label: 'Concept Art de Mundos', cmd: '/worldbuilding' },
      { label: 'Cómic / Novela Gráfica', cmd: '/graphicnovel' },
      { label: 'Álbum Ilustrado', cmd: '/editorialillustration' },
      { label: 'Juguete Coleccionable Vinyl', cmd: '/vinyltoy' },
      { label: 'Ilustración Botánica', cmd: '/botanicalart' },
    ],
    styles: [
      'Gouache Editorial Texturizado',
      'Línea Clara Europea + Acuarela',
      'Grabado en Linóleo Contemporáneo',
      'Concept Art Pictórico Cinematográfico',
      'Ilustración Vectorial Geométrica',
      'Stop Motion en Fieltro y Papel',
    ],
    extraField1: {
      key: 'characterDetails',
      label: 'Ancla de Personaje / Tipo de Lámina',
      options: [
        'Vista turnaround (frente, 3/4 y perfil) sobre papel crema',
        'Hoja de 5 expresiones faciales coherentes del mismo personaje',
        'Escena narrativa completa con personaje integrado al entorno',
        'Secuencia de 4 viñetas de cómic con narrativa visual clara',
        'Figura coleccionable 3D estilizada en vinilo mate',
      ],
    },
    extraField2: {
      key: 'medium',
      label: 'Trazos, pincelada y soporte',
      placeholder: 'Ej: pincelada visible de gouache, tinta china sutil sobre papel acuarela 300g',
      suggestions: [
        'pincelada orgánica de gouache sobre papel acuarela prensado en frío',
        'tinta editorial nítida con lavados suaves de acuarela',
        'textura táctil de papel recortado y fibras visibles',
      ],
    },
    recommendedApps: [
      { name: 'Midjourney', url: 'https://www.midjourney.com/' },
      { name: 'ChatGPT', url: 'https://chatgpt.com/' },
      { name: 'Gemini', url: 'https://gemini.google.com/' },
      { name: 'Recraft', url: 'https://www.recraft.ai/' },
      { name: 'FLUX / Freepik', url: 'https://www.freepik.com/ai/image-generator' },
    ],
    quickSample: {
      subject: 'Hoja de referencia de personaje original: joven archivista andina con abrigo ocre y gafas redondas',
      action: 'mostrada en vista frontal, tres cuartos, perfil y dos gestos expresivos coherentes',
      setting: 'lámina limpia de estudio sobre papel crema cálido con notas de paleta',
      lighting: 'Iluminación neutra uniforme de presentación editorial',
      colorPalette: 'Selva & Cobre (Verde Bosque, Ocre y Papel Crema)',
      aspectRatio: '16:9',
    },
  },
  {
    id: 'architecture',
    label: 'Arquitectura & Espacios',
    shortLabel: 'Arquitectura',
    baseMode: 'photo',
    tagline: 'Arquitectura bioclimática, interiorismo, museografía y transformación espacial.',
    subjectPlaceholder: 'Ej: Biblioteca pública bioclimática con patio interior de helechos nativos',
    actionPlaceholder: 'Ej: dos lectores en silueta dando escala humana real al espacio',
    settingPlaceholder: 'Ej: ladera andina con cielo limpio y luz oblicua de media tarde',
    defaultAspectRatio: '3:2',
    defaultGenre: '/architecture',
    defaultVisualStyle: 'Arquitectura Bioclimática Contemporánea',
    genres: [
      { label: 'Arquitectura Exterior', cmd: '/architecture' },
      { label: 'Interiorismo Editorial', cmd: '/interiordesign' },
      { label: 'Museografía & Galería', cmd: '/exhibitionspace' },
      { label: 'Espacio Público Cultural', cmd: '/urbanspace' },
      { label: 'Maqueta Arquitectónica', cmd: '/archmodel' },
    ],
    styles: [
      'Arquitectura Bioclimática Contemporánea',
      'Brutalismo Cálido Latinoamericano',
      'Minimalismo Japonés en Madera y Cal',
      'Rehabilitación Patrimonial de Ladrillo',
      'Pabellón Efímero de Diseño',
    ],
    extraField1: {
      key: 'architectureStyle',
      label: 'Sistema Constructivo y Materiales',
      options: [
        'Concreto encofrado en madera + celosías de cedro cálido',
        'Ladrillo artesanal a la vista + patios con vegetación nativa',
        'Tierra compactada (tapia) + cubiertas ligeras de bambú',
        'Piedra mineral mate + vidrio sin marco + estuco a la cal',
        'Acero negro estructural + madera clara + iluminación indirecta',
      ],
    },
    extraField2: {
      key: 'customNotes',
      label: 'Corrección óptica y escala humana',
      placeholder: 'Ej: lente 24mm tilt-shift, verticales estrictamente paralelas, hora 4:30 pm',
      suggestions: [
        'verticales arquitectónicas estrictamente paralelas (lente tilt-shift)',
        'escala humana discreta con dos visitantes en segundo plano',
        'sombras geométricas nítidas del sol oblicuo de la tarde',
      ],
    },
    recommendedApps: [
      { name: 'Midjourney', url: 'https://www.midjourney.com/' },
      { name: 'FLUX / Freepik', url: 'https://www.freepik.com/ai/image-generator' },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/' },
      { name: 'ChatGPT', url: 'https://chatgpt.com/' },
    ],
    quickSample: {
      subject: 'Pabellón cultural bioclimático de concreto visto, celosías de cedro y jardín interior de helechos',
      action: 'dos visitantes caminando suavemente bajo la pérgola dando escala real',
      setting: 'entorno urbano arbolado bañado por luz solar baja de media tarde',
      lighting: 'Sol oblicuo natural proyectando sombras arquitectónicas geométricas',
      colorPalette: 'Cal & Terracota (Concreto Cálido, Madera y Oliva)',
      aspectRatio: '3:2',
    },
  },
  {
    id: 'web-ui',
    label: 'Diseño Web & UI/UX',
    shortLabel: 'Web & UI/UX',
    baseMode: 'photo',
    tagline: 'Landing pages editoriales, dashboards, apps culturales y sistemas de diseño.',
    subjectPlaceholder: 'Ej: Página de inicio de un archivo cultural interactivo y laboratorio de arte',
    actionPlaceholder: 'Ej: navegación superior limpia, titular editorial fuerte y galería asimétrica',
    settingPlaceholder: 'Ej: presentación plana de escritorio 16:9 con alineación impecable',
    defaultAspectRatio: '16:9',
    defaultGenre: '/webdesign',
    defaultVisualStyle: 'Editorial Suizo Digital',
    genres: [
      { label: 'Landing Page Editorial', cmd: '/webdesign' },
      { label: 'App Móvil Educativa', cmd: '/mobileui' },
      { label: 'Dashboard / Plataforma', cmd: '/dashboardui' },
      { label: 'Portafolio Creativo', cmd: '/portfolioui' },
      { label: 'Sistema de Diseño / Tokens', cmd: '/designsystem' },
    ],
    styles: [
      'Editorial Suizo Digital',
      'Minimalismo Luminoso Papel & Tinta',
      'Bento Grid Contemporáneo Limpio',
      'Galería Oscura de Alto Contraste',
      'Producto Cultural Accesible WCAG AA',
    ],
    extraField1: {
      key: 'uiFramework',
      label: 'Arquitectura de Interfaz y Vista',
      options: [
        'Vista plana limpia de navegador Desktop (1440px, 16:9)',
        'Tres pantallas de App Móvil alineadas sobre fondo neutro',
        'Hero editorial asimétrico + barra superior mínima + tarjetas',
        'Dashboard con navegación lateral y visualizaciones limpias',
        'Guía de estilo UI mostrando tipografía, botones y paleta',
      ],
    },
    extraField2: {
      key: 'typography',
      label: 'Jerarquía tipográfica y contraste',
      placeholder: 'Ej: fondo crema #F4F2ED, texto carbón #101014, botones precisos sin saturación',
      suggestions: [
        'fondo papel crema #F4F2ED, texto carbón #101014, acento amarillo y azul',
        'contraste alto accesible WCAG AA, sin gradientes neón ni ruido visual',
        'líneas divisorias finas de 1px y mucho espacio en blanco',
      ],
    },
    recommendedApps: [
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/' },
      { name: 'ChatGPT', url: 'https://chatgpt.com/' },
      { name: 'Claude', url: 'https://claude.ai/' },
      { name: 'Midjourney', url: 'https://www.midjourney.com/' },
      { name: 'Ideogram', url: 'https://ideogram.ai/' },
    ],
    quickSample: {
      subject: 'Diseño de interfaz web editorial para una plataforma cultural de arte, fotografía y laboratorios IA',
      action: 'cabecera limpia con titular tipográfico fuerte, fotografía protagonista y tarjetas limpias',
      setting: 'vista plana desktop 16:9 con retícula suiza de 12 columnas y aire generoso',
      lighting: 'Presentación UI plana nítida de alto contraste',
      colorPalette: 'Núcleo Editorial (Crema #F4F2ED, Carbón #101014, Amarillo y Azul)',
      aspectRatio: '16:9',
    },
  },
  {
    id: 'experimental',
    label: 'Arte Experimental & 3D',
    shortLabel: 'Arte & 3D',
    baseMode: 'photo',
    tagline: 'Instalaciones interactivas, projection mapping, escultura 3D y diseño especulativo.',
    subjectPlaceholder: 'Ej: Instalación inmersiva de hilos translúcidos reaccionando a proyecciones láser',
    actionPlaceholder: 'Ej: visitantes en silueta caminando entre planos luminosos en sala oscura',
    settingPlaceholder: 'Ej: antigua nave industrial de ladrillo convertida en centro de arte',
    defaultAspectRatio: '16:9',
    defaultGenre: '/installationart',
    defaultVisualStyle: 'Bienal de Arte y Tecnología',
    genres: [
      { label: 'Instalación Interactiva', cmd: '/installationart' },
      { label: 'Projection Mapping', cmd: '/projectionmapping' },
      { label: 'Escultura 3D PBR', cmd: '/3dsculpture' },
      { label: 'Arte Generativo / Datos', cmd: '/generativeart' },
      { label: 'Diseño Especulativo 2050', cmd: '/speculativedesign' },
      { label: 'Fotografía Surrealista', cmd: '/surrealphoto' },
    ],
    styles: [
      'Bienal de Arte y Tecnología',
      'Escultura Cinética & Luz Volumétrica',
      'Surrealismo Conceptual Sobrio',
      'Render Físico PBR (Vidrio, Bronce, Mineral)',
      'Bio-Arte y Organismos Híbridos',
    ],
    extraField1: {
      key: 'medium',
      label: 'Dispositivo Físico / Medio Artístico',
      options: [
        'Proyección mapeada arquitectónica con bruma teatral sutil',
        'Escultura física en vidrio soplado, bronce y fibra óptica',
        'Pantallas LED monumentales reactivas al movimiento del público',
        'Objeto especulativo industrial fotografiado en museo',
        'Instalación textil suspendida con haces de luz blanca',
      ],
    },
    extraField2: {
      key: 'customNotes',
      label: 'Realismo curatorial y escala',
      placeholder: 'Ej: fotografiado como registro documental real de bienal, sin HUD sci-fi',
      suggestions: [
        'registro documental real de exposición en museo, con público en silueta',
        'reflejos reales sobre piso de concreto pulido y caída física de luz',
        'evitar estética cliché de ciencia ficción neón o videojuego',
      ],
    },
    recommendedApps: [
      { name: 'Midjourney', url: 'https://www.midjourney.com/' },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/' },
      { name: 'Runway Gen-3', url: 'https://app.runwayml.com/' },
      { name: 'FLUX / Freepik', url: 'https://www.freepik.com/ai/image-generator' },
    ],
    quickSample: {
      subject: 'Instalación interactiva de cortinas translúcidas verticales atrapando líneas geométricas de luz proyectada',
      action: 'dos visitantes en silueta recorriendo la sala mientras las líneas se ondulan a su paso',
      setting: 'sala museográfica oscura de concreto visto con reflejos suaves en el piso',
      lighting: 'Haces volumétricos nítidos de proyector atravesando neblina ligera',
      colorPalette: 'Midnight Cinema & Destellos Cian-Violeta contenidos',
      aspectRatio: '16:9',
    },
  },
];

export const BUILDER_CAMERAS_PHOTO = [
  'Hasselblad X2D (Medio Formato)',
  'Sony A7R V (Full Frame)',
  'Leica M11 (Rangefinder 35mm)',
  'Phase One IQ4 (Estudio Técnico)',
  'Canon AE-1 (Película 35mm)',
  'Fujifilm GFX 100 II',
];

export const BUILDER_CAMERAS_VIDEO = [
  'ARRI Alexa 35 (Cine Referente)',
  'RED V-Raptor (8K High-Speed)',
  'Sony Venice 2 (Gran Formato)',
  'Blackmagic URSA 12K',
  'Cooke Cinema Rig',
  'DJI Ronin 4D (Estabilizada)',
];

export const BUILDER_LENSES = [
  { label: '14mm Ultra Gran Angular', val: '14mm ultra-wide rectilinear lens' },
  { label: '24mm Tilt-Shift / Contexto', val: '24mm wide-angle tilt-shift lens' },
  { label: '35mm Documental / Cine', val: '35mm prime lens' },
  { label: '50mm Perspectiva Natural', val: '50mm standard prime lens' },
  { label: '85mm Retrato & Bokeh', val: '85mm portrait prime lens' },
  { label: '100mm Macro Microtextura', val: '100mm macro f/2.8 lens' },
  { label: '135mm Compresión Teleobjetivo', val: '135mm telephoto prime lens' },
  { label: 'Cooke 40mm Anamórfico', val: 'Cooke 40mm anamorphic prime lens' },
];

export const BUILDER_APERTURES = [
  { label: 'f/1.4 (Bokeh muy suave)', val: 'f/1.4 shallow depth of field' },
  { label: 'f/1.8 (Separación retrato)', val: 'f/1.8 creamy bokeh' },
  { label: 'f/2.8 (Equilibrio editorial)', val: 'f/2.8 aperture' },
  { label: 'f/8 (Nitidez producto/arquitectura)', val: 'f/8 sharp commercial focus' },
  { label: 'f/11 (Profundidad total paisaje)', val: 'f/11 deep focus' },
  { label: 'T2.3 (Óptica Cine)', val: 'T2.3 cinematic aperture' },
];

export const BUILDER_LIGHTINGS = [
  { label: 'Rembrandt (45° volumen clásico)', val: 'Rembrandt lighting, directional 45-degree key light with cheek triangle' },
  { label: 'Luz Natural de Ventana', val: 'Soft directional natural north-window light' },
  { label: 'Butterfly (Editorial limpia)', val: 'Overhead frontal Butterfly lighting with soft fill' },
  { label: 'Split (90° contraste dramático)', val: '90-degree Split lighting, half illuminated half deep shadow' },
  { label: 'Rim Light (Contraluz de borde)', val: 'Crisp rear rim lighting carving silhouette and glass edges' },
  { label: 'Volumétrica / Haces de Sol', val: 'Volumetric light shafts cutting through light atmospheric haze' },
  { label: 'Softbox Comercial de Estudio', val: 'Large diffused studio softbox with clean bounce fill' },
  { label: 'Hora Dorada / Sol Oblicuo', val: 'Low golden hour oblique sunlight casting long crisp shadows' },
  { label: 'Plana de Escáner / Editorial', val: 'Even shadowless archival studio lighting for graphic flat reproduction' },
];

export const BUILDER_MOTIONS = [
  { label: 'Static Tripod (Plano fijo vivo)', val: 'Locked-off static tripod shot with subtle organic environmental motion' },
  { label: 'Slow Dolly-In (Acercamiento)', val: 'Slow smooth stabilized dolly-in moving gently toward the subject' },
  { label: 'Orbit Shot (Órbita 180°/360°)', val: 'Continuous smooth orbital tracking shot revolving around the subject' },
  { label: 'Lateral Tracking (Seguimiento)', val: 'Steady lateral tracking shot moving parallel at eye level' },
  { label: 'Crane Up (Revelación vertical)', val: 'Slow majestic crane-up movement revealing spatial scale' },
  { label: 'Seamless Loop (Bucle infinito)', val: 'Seamless loop where final frame matches initial frame with constant velocity' },
];

export const BUILDER_PALETTES = [
  {
    label: 'Núcleo Editorial (Crema, Carbón, Cadmio)',
    val: 'Warm cream cotton paper (#F4F2ED), matte charcoal ink (#101014), cadmium yellow (#F8C300) and cobalt blue (#326BFF) accents',
    swatches: ['#F4F2ED', '#101014', '#F8C300', '#326BFF'],
  },
  {
    label: 'Kodak Portra 400 (Cálido orgánico)',
    val: 'Kodak Portra 400 film emulation, authentic warm skin tones and soft highlight roll-off',
    swatches: ['#E6C9A2', '#C28E61', '#6E5A4F', '#2C2724'],
  },
  {
    label: 'Teal & Orange Cinematográfico',
    val: 'Restrained Teal and Orange cinematic grading with warm amber skin and cool petrol shadows',
    swatches: ['#007F86', '#10343B', '#E88943', '#F4D4B0'],
  },
  {
    label: 'Selva & Cobre Bioclimático',
    val: 'Deep botanical rainforest green (#18392B), burnished copper terracotta (#B86B3B) and basalt stone',
    swatches: ['#18392B', '#5A7D65', '#B86B3B', '#232528'],
  },
  {
    label: 'Risografía Botánica (Pino & Coral)',
    val: 'Two-ink risograph print in pine green (#1D5B4C) and coral vermilion (#E95B47) over warm sand paper',
    swatches: ['#1D5B4C', '#E95B47', '#F2E9DC', '#1E1E22'],
  },
  {
    label: 'Nordic Mist (Minimalismo Frío)',
    val: 'Scandinavian minimalist palette of pale platinum, soft slate gray and diffused overcast light',
    swatches: ['#DDE4E5', '#89999F', '#4A5960', '#F7F8F9'],
  },
  {
    label: 'Midnight Cinema (Nocturno Azul)',
    val: 'Deep abyssal blue, nocturnal cobalt reflections and warm sodium practical street lights',
    swatches: ['#101B37', '#2B4C7E', '#F2A949', '#0B0D14'],
  },
  {
    label: 'Monochrome Silver (Blanco y Negro)',
    val: 'Pure silver gelatin monochrome photography with crisp midtones and deep velvet blacks',
    swatches: ['#111111', '#555555', '#B5B5B5', '#F2F2F2'],
  },
];

export const BUILDER_ASPECT_RATIOS = [
  { val: '1:1', label: '1:1', desc: 'Cuadrado', w: 22, h: 22 },
  { val: '4:5', label: '4:5', desc: 'Feed / Producto', w: 20, h: 25 },
  { val: '2:3', label: '2:3', desc: 'Afiche / Libro', w: 18, h: 27 },
  { val: '3:2', label: '3:2', desc: 'Foto 35mm', w: 27, h: 18 },
  { val: '16:9', label: '16:9', desc: 'Web / Video', w: 30, h: 17 },
  { val: '2.39:1', label: '2.39:1', desc: 'Cinemascope', w: 32, h: 13 },
  { val: '9:16', label: '9:16', desc: 'Reels / Móvil', w: 15, h: 27 },
];

export const BUILDER_COMPOSITIONS = [
  'Regla de tercios equilibrada',
  'Espacio negativo editorial para titular',
  'Simetría central arquitectónica',
  'Líneas guía en perspectiva',
  'Encuadre dentro del encuadre',
  'Diagonales dinámicas',
  'Flat-lay cenital perpendicular 90°',
  'Retícula modular suiza asimétrica',
];

export const BUILDER_SHOT_SIZES = [
  'Gran Plano General (ELS)',
  'Plano General (LS)',
  'Plano Entero (Full Shot)',
  'Plano Americano (3/4)',
  'Plano Medio (MS)',
  'Primer Plano (CU)',
  'Primerísimo Primer Plano (ECU)',
  'Plano Detalle (Macro)',
];

export const BUILDER_ANGLES = [
  'Normal (Eye Level)',
  'Contrapicado (Low Angle)',
  'Picado (High Angle)',
  'Cenital / Overhead (90°)',
  'Vista Frontal Plana (Orthographic)',
  'Plano Holandés (Dutch Angle)',
  'Over the Shoulder (OTS)',
];

export const BUILDER_TEMPERATURES = [
  'Neutra equilibrada (5500K)',
  'Cálida dorada (3200K–4200K)',
  'Fría nocturna / Hora azul (7200K)',
  'Mixta (Cálida interior / Fría exterior)',
];

export const BUILDER_ATMOSPHERES = [
  'Aire limpio natural',
  'Neblina sutil y partículas iluminadas',
  'Lluvia ligera nocturna con reflejos',
  'Silencio de sala de exposición',
  'Polvo dorado de taller al atardecer',
  'Superficie editorial impresa sin atmósfera',
];

export const BUILDER_TEXTURES = [
  'natural texture, visible pores',
  'grano fino orgánico Kodak 35mm sin suavizado plástico',
  'papel algodón mate 300g con registro de tinta real',
  'superficie mineral mate con pátina táctil auténtica',
  'tejido natural con fibras visibles y desgaste sutil',
  'reflejo especular limpio en vidrio y metal cepillado',
];

export const BUILDER_QUALITIES = [
  'RAW editorial authenticity, natural microtextures',
  'acabado cinematográfico limpio sin sobreenfoque',
  'rango dinámico amplio con transición suave en luces altas',
  'fidelidad óptica y material real sin HDR artificial',
  'precisión gráfica nítida lista para producción',
];

export const BUILDER_NEGATIVES = [
  'plastic skin, waxy texture',
  'gibberish text, fake logos, watermarks',
  'deformed hands, extra fingers, mutated anatomy',
  'artificial oversaturated HDR, neon spam',
  'tilted architecture verticals, impossible geometry',
  'fake software bokeh, digital oversharpening',
  'morphing, flickering, sudden camera cuts',
  'cluttered overcrowded background',
];
