export type EthicsSimulationId =
  | 'sesgos'
  | 'dilemas'
  | 'real_falso'
  | 'caja_transparente'
  | 'eco_datos'
  | 'impacto_social';

export interface EthicsSimulationCard {
  id: EthicsSimulationId;
  title: string;
  description: string;
  status: 'Activo' | 'Próximamente';
}

export type EthicsVideoCategory =
  | 'Fundamentos'
  | 'Sesgos y Datos'
  | 'Derechos y Futuro'
  | 'Diseño Responsable'
  | 'Debates';

export interface EthicsVideoItem {
  id: string;
  title: string;
  description: string;
  videoId: string;
  category: EthicsVideoCategory;
}

export interface BiasPromptPreset {
  prompt: string;
  observedPattern: string;
  dimensions: {
    gender: string;
    skinTone: string;
    age: string;
    context: string;
  };
  suggestedHack: string;
  beforeAlt: string;
  afterAlt: string;
}

export const ETICA_IA_HEADER = {
  provocation: '¿Confiarías tu reputación a un algoritmo que no entiendes?',
  enterCta: '[ Entrar al laboratorio ]',
  warning: 'Advertencia: aquí no damos respuestas cómodas.',
  title: 'Laboratorio de Ética IA',
  subtitle:
    'Un espacio interactivo para explorar los dilemas y responsabilidades de crear con inteligencia artificial a través de juegos, simulaciones y una videoteca curada.',
};

export const ETHICS_SIMULATIONS: EthicsSimulationCard[] = [
  {
    id: 'sesgos',
    title: 'Laboratorio de Sesgos',
    description:
      "Detecta lo invisible. Genera imágenes, analiza los patrones y aprende a 'hackear' el sesgo algorítmico.",
    status: 'Activo',
  },
  {
    id: 'dilemas',
    title: 'Dilemas Morales',
    description:
      'Enfrenta decisiones complejas en un simulador narrativo y observa las consecuencias de tus elecciones.',
    status: 'Activo',
  },
  {
    id: 'real_falso',
    title: 'Detector de Impostores',
    description:
      'Pon a prueba tu intuición en un juego rápido para diferenciar contenido real de contenido generado por IA.',
    status: 'Próximamente',
  },
  {
    id: 'caja_transparente',
    title: 'La Caja Transparente',
    description:
      "Compara un sistema de IA de 'caja negra' con uno transparente y entiende el valor de la explicabilidad.",
    status: 'Próximamente',
  },
  {
    id: 'eco_datos',
    title: 'El Eco de los Datos',
    description:
      'Visualiza cómo tus datos ficticios viajan y son utilizados para crear perfiles y predicciones.',
    status: 'Próximamente',
  },
  {
    id: 'impacto_social',
    title: 'Simulador de Ciudad IA',
    description:
      'Gobierna una ciudad y toma decisiones sobre la implementación de IA, sopesando sus consecuencias.',
    status: 'Próximamente',
  },
];

export const BIAS_LAB_PRESETS: BiasPromptPreset[] = [
  {
    prompt: 'Una persona líder',
    observedPattern:
      'Los modelos entrenados en archivos corporativos occidentales tienden a generar hombres de mediana edad en traje formal dentro de oficinas acristaladas.',
    dimensions: {
      gender: 'Mayoría masculina (~80% en salidas sin especificar)',
      skinTone: 'Sobrerrepresentación de piel clara / estética corporativa norteamericana',
      age: 'Adulto entre 38 y 55 años',
      context: 'Sala de juntas corporativa o podio financiero',
    },
    suggestedHack:
      'Una líder comunitaria indígena de 60 años dirigiendo un laboratorio de innovación',
    beforeAlt: 'Estereotipo estadístico genérico para "Una persona líder"',
    afterAlt: 'Representación específica y situada tras hackear el prompt',
  },
  {
    prompt: 'Una familia feliz',
    observedPattern:
      'Predomina el arquetipo publicitario nuclear homogéneo en interiores suburbanos de alto poder adquisitivo con luz artificial uniforme.',
    dimensions: {
      gender: 'Pareja heterosexual normativa con dos hijos',
      skinTone: 'Estética publicitaria homogénea y poco diversa',
      age: 'Padres jóvenes 30–35 años, abuelos ausentes',
      context: 'Sala de estar suburbana limpia estilo catálogo inmobiliario',
    },
    suggestedHack:
      'Una familia intergeneracional latinoamericana de tres generaciones compartiendo la preparación de alimentos en una cocina de barrio con luz natural de tarde',
    beforeAlt: 'Estereotipo publicitario para "Una familia feliz"',
    afterAlt: 'Escena familiar situada con diversidad intergeneracional y contexto real',
  },
  {
    prompt: 'Un programador brillante',
    observedPattern:
      'Se repite el cliché visual de la cultura geek solitaria: habitación oscura, múltiples monitores con código verde o luces neón azules.',
    dimensions: {
      gender: 'Hombre joven con sudadera con capucha',
      skinTone: 'Sesgo hacia rasgos caucásicos o asiáticos estereotipados',
      age: '20–30 años',
      context: 'Escritorio nocturno aislado iluminado por pantallas neón',
    },
    suggestedHack:
      'Una ingeniera de software afrodescendiente de 45 años facilitando un taller colaborativo de código abierto con pizarras y luz diurna natural',
    beforeAlt: 'Cliché visual oscuro para "Un programador brillante"',
    afterAlt: 'Representación colaborativa y realista de ingeniería tecnológica',
  },
  {
    prompt: 'Una persona peligrosa',
    observedPattern:
      'Uno de los sesgos más críticos: el algoritmo amplifica prejuicios raciales, de clase social, vestimenta urbana nocturna y marginalidad.',
    dimensions: {
      gender: 'Sobrerrepresentación masculina intimidante',
      skinTone: 'Criminalización visual de rasgos racializados y barrios populares',
      age: 'Jóvenes adultos en entornos degradados',
      context: 'Callejones oscuros con iluminación dura de alto contraste',
    },
    suggestedHack:
      'Ilustración editorial conceptual sobre desinformación financiera: un algoritmo invisible manipulando titulares y gráficos bursátiles desde una oficina de lujo',
    beforeAlt: 'Sesgo criminalizante heredado en "Una persona peligrosa"',
    afterAlt: 'Reencuadre conceptual del riesgo sin criminalizar cuerpos ni territorios',
  },
];

export const MORAL_DILEMMA_INSIGHTS = [
  {
    label: 'Culturas Colectivistas (ej. Japón):',
    detail: 'Muestran una fuerte tendencia a salvar a los peatones (el grupo más grande).',
  },
  {
    label: 'Culturas Individualistas (ej. EE.UU.):',
    detail:
      'Muestran una preferencia menor por salvar a los peatones, con más variabilidad.',
  },
  {
    label: 'Conclusión General:',
    detail:
      'La mayoría de personas prefiere salvar más vidas, pero la cultura y el contexto influyen fuertemente en la decisión.',
  },
];

export const ETHICS_VIDEOTECA_CATEGORIES: EthicsVideoCategory[] = [
  'Fundamentos',
  'Sesgos y Datos',
  'Derechos y Futuro',
  'Diseño Responsable',
  'Debates',
];

export const ETHICS_VIDEOS: EthicsVideoItem[] = [
  // Fundamentos
  {
    id: 'ev-1',
    title: '¿Qué es la ética de la tecnología y por qué debería importarte?',
    description: 'Reflexión clara sobre responsabilidad tecnológica, gobernanza y poder.',
    videoId: 'XJDBN2j9rr4',
    category: 'Fundamentos',
  },
  {
    id: 'ev-2',
    title: 'Ética de la Inteligencia Artificial',
    description: 'Análisis filosófico profundo sobre límites morales de la automatización.',
    videoId: 'S4qIQd8wqnk',
    category: 'Fundamentos',
  },
  {
    id: 'ev-3',
    title: '¿Ética o ideología de la inteligencia artificial?',
    description: 'Debate contemporáneo sobre valores implícitos en sistemas algorítmicos.',
    videoId: '2KEwmWFaxO0',
    category: 'Fundamentos',
  },
  {
    id: 'ev-4',
    title: 'Inteligencia Artificial y poder – Antonio Ortiz',
    description: 'Quién controla la IA y qué implica para la democracia.',
    videoId: 'WsJtUeyvBgk',
    category: 'Fundamentos',
  },
  {
    id: 'ev-19',
    title: 'Pioneering Ethics: Forging AI’s Moral Compass',
    description: 'Explora cómo construir una brújula ética para IA (en inglés).',
    videoId: 'FbnQrFMxQiw',
    category: 'Fundamentos',
  },

  // Sesgos y Datos
  {
    id: 'ev-5',
    title: 'Ética e IA: los sesgos del algoritmo',
    description: 'Panel sobre discriminación algorítmica y diseño responsable.',
    videoId: 'xLiAsU39nvY',
    category: 'Sesgos y Datos',
  },
  {
    id: 'ev-6',
    title: 'Capítulo 5: Sesgos algorítmicos en la IA',
    description: 'Explicación pedagógica de cómo se originan los sesgos.',
    videoId: 'fP_f-aNZFLo',
    category: 'Sesgos y Datos',
  },
  {
    id: 'ev-7',
    title: '¿Cuál será el impacto de la IA? – DotCSV',
    description: 'Impacto social, laboral y estructural de la IA.',
    videoId: 'RMM1T4jdOgI',
    category: 'Sesgos y Datos',
  },
  {
    id: 'ev-8',
    title: 'IA con Carlos Santana – DotCSV',
    description: 'Visión técnica con implicaciones éticas claras.',
    videoId: 'm64Gx0u_RcI',
    category: 'Sesgos y Datos',
  },

  // Derechos y Futuro
  {
    id: 'ev-9',
    title: 'Las nuevas neurotecnologías y sus consecuencias éticas',
    description: 'Neuroderechos y protección mental en la era digital.',
    videoId: 'mqfghQJAB2w',
    category: 'Derechos y Futuro',
  },
  {
    id: 'ev-10',
    title: 'NeuroDerechos en la era de la IA',
    description: 'Marco jurídico emergente sobre privacidad cognitiva.',
    videoId: 'FFcFVbQHxHs',
    category: 'Derechos y Futuro',
  },
  {
    id: 'ev-20',
    title: 'Mar España: "Cuando sepas la verdad de Internet, te dará miedo..."',
    description:
      'La exdirectora de la AEPD revela cómo el negocio digital convierte nuestros datos y atención en mercancía.',
    videoId: 'li3RponfRE0',
    category: 'Derechos y Futuro',
  },

  // Diseño Responsable
  {
    id: 'ev-11',
    title: 'La era de la IA responsable – Mónica Villas',
    description: 'Principios para una IA centrada en las personas.',
    videoId: 'QjQ-uTHUQUg',
    category: 'Diseño Responsable',
  },
  {
    id: 'ev-12',
    title: 'Un uso ético y responsable de la IA',
    description: 'Buenas prácticas aplicadas a organizaciones.',
    videoId: '2qbTmlaKaZ8',
    category: 'Diseño Responsable',
  },
  {
    id: 'ev-13',
    title: 'Ética e IA – Miguel Camacho (TEDx)',
    description: 'Relación entre ética, política pública y tecnología.',
    videoId: 'UaPaEwwIX4g',
    category: 'Diseño Responsable',
  },
  {
    id: 'ev-14',
    title: 'Ética e IA para sociedades inclusivas - Gemma Galdón (TEDx)',
    description: 'IA como herramienta para inclusión social.',
    videoId: 'nTAJEVdP4wg',
    category: 'Diseño Responsable',
  },

  // Debates
  {
    id: 'ev-15',
    title: 'Diálogos Fin de Semana – Ética de la IA',
    description: 'Mesa redonda accesible sobre desafíos actuales.',
    videoId: '_rUB7oY0jg8',
    category: 'Debates',
  },
  {
    id: 'ev-16',
    title: 'Ética y filosofía entorno a la IA II',
    description: 'Coloquio académico ampliado.',
    videoId: 'veGnRF1TDVI',
    category: 'Debates',
  },
  {
    id: 'ev-17',
    title: 'Presentación libro: ¿Ética o ideología de la IA?',
    description: 'Conversación extensa sobre marco conceptual.',
    videoId: 'H1UY-_LIwmw',
    category: 'Debates',
  },
  {
    id: 'ev-18',
    title: 'Ética tecnológica con Gemma Galdón – Podcast',
    description: 'Conversación práctica sobre regulación y diseño.',
    videoId: 'WDaby4PjumU',
    category: 'Debates',
  },
];
