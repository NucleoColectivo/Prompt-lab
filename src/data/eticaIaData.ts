import ethicsCardSesgos from '../assets/images/ethics_card_sesgos_1795400896612.jpg';
import ethicsCardDilemas from '../assets/images/ethics_card_dilemas_1795400897041.jpg';
import ethicsCardImpostores from '../assets/images/ethics_card_impostores_1795400896818.jpg';
import ethicsCardCaja from '../assets/images/ethics_card_caja_1795400896543.jpg';
import ethicsCardEco from '../assets/images/ethics_card_eco_1795400897644.jpg';
import ethicsCardCiudad from '../assets/images/ethics_card_ciudad_1795400897290.jpg';

import biasLeaderBefore from '../assets/images/bias_leader_before_1795400896848.jpg';
import biasLeaderAfter from '../assets/images/bias_leader_after_1795400897277.jpg';
import biasFamilyBefore from '../assets/images/bias_family_before_1795400896414.jpg';
import biasFamilyAfter from '../assets/images/bias_family_after_1795400897041.jpg';
import biasCoderBefore from '../assets/images/bias_coder_before_1795400897273.jpg';
import biasCoderAfter from '../assets/images/bias_coder_after_1795400896948.jpg';
import biasDangerBefore from '../assets/images/bias_danger_before_1795400895583.jpg';
import biasDangerAfter from '../assets/images/bias_danger_after_1795400896587.jpg';

import impostorStreetMarket from '../assets/images/impostor_street_market_1795401457529.jpg';
import impostorNeonCafeAi from '../assets/images/impostor_neon_cafe_ai_1795401457527.jpg';
import impostorHandsClay from '../assets/images/impostor_hands_clay_1795401459523.jpg';
import impostorPlazaCrowdAi from '../assets/images/impostor_plaza_crowd_ai_1795401459687.jpg';
import impostorRainBus from '../assets/images/impostor_rain_bus_1795401459277.jpg';
import impostorPortraitGlassesAi from '../assets/images/impostor_portrait_glasses_ai_1795401459444.jpg';
import xaiAuditPrism from '../assets/images/xai_audit_prism_1795401768095.jpg';
import dataEchoTraces from '../assets/images/data_echo_traces_1795401768156.jpg';
import cityAiGovernance from '../assets/images/city_ai_governance_1795402058609.jpg';

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
  coverImage: string;
  coverAlt: string;
  metaLabel: string;
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

export type BiasDimensionKey = 'gender' | 'skinTone' | 'age' | 'context';

export interface BiasPromptPreset {
  id: string;
  prompt: string;
  observedPattern: string;
  homogeneityNote: string;
  dimensions: Record<BiasDimensionKey, string>;
  suggestedHack: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  hackSummary: string;
}

export type EthicalFramework = 'utilitarista' | 'deontologico' | 'justicia';
export type EthicalProfileKey = EthicalFramework | 'hibrido';

export interface MoralDilemmaOption {
  id: 'A' | 'B';
  title: string;
  actionSummary: string;
  tradeoff: string;
  framework: EthicalFramework;
  frameworkLabel: string;
  consequenceHeadline: string;
  consequenceDetail: string;
  reflectionQuestion: string;
}

export interface MoralDilemmaScenario {
  id: string;
  code: string;
  domain: string;
  title: string;
  context: string;
  tensionLeft: { label: string; detail: string };
  tensionRight: { label: string; detail: string };
  image: string;
  imageAlt: string;
  optionA: MoralDilemmaOption;
  optionB: MoralDilemmaOption;
}

export interface EthicalProfileSummary {
  key: EthicalProfileKey;
  title: string;
  subtitle: string;
  description: string;
  blindSpot: string;
  governanceLesson: string;
}

export type ImpostorVerdict = 'documental' | 'sintetico';

export interface ImpostorClue {
  id: number;
  x: number; // percentage 0..100
  y: number; // percentage 0..100
  label: string;
  detail: string;
}

export interface ImpostorCase {
  id: string;
  code: string;
  title: string;
  category: string;
  image: string;
  imageAlt: string;
  verdict: ImpostorVerdict;
  verdictLabel: string;
  hint: string;
  summary: string;
  provenanceNote: string;
  clues: ImpostorClue[];
}

export interface ForensicProtocolStep {
  step: string;
  title: string;
  detail: string;
}

export interface XaiFeature {
  id: string;
  label: string;
  observedValue: string;
  defaultPoints: number;
  minPoints: number;
  maxPoints: number;
  isProxy: boolean;
  explanation: string;
  proxyWarning?: string;
}

export interface XaiCase {
  id: string;
  code: string;
  title: string;
  domain: string;
  applicantName: string;
  applicantSummary: string;
  baseScore: number;
  threshold: number;
  blackBoxCode: string;
  blackBoxNotice: string;
  features: XaiFeature[];
}

export interface DataEchoAction {
  id: string;
  time: string;
  category: string;
  title: string;
  rawSignal: string;
  brokersReceiving: string[];
  exposureWeight: number;
  mitigatedByDefenseId?: string;
}

export interface DataEchoInference {
  id: string;
  title: string;
  requiredActionIds: string[];
  minMatches: number;
  inferredProfile: string;
  realWorldImpact: string;
  severity: 'Media' | 'Alta' | 'Crítica';
  neutralizedByDefenseId: string;
}

export interface DataPrivacyDefense {
  id: string;
  title: string;
  description: string;
  exposureReduction: number;
}

export type CityMetricKey = 'wellbeing' | 'privacy' | 'budget' | 'trust';

export type CityMetrics = Record<CityMetricKey, number>;

export interface CityPolicyOption {
  id: 'A' | 'B' | 'C';
  title: string;
  summary: string;
  deltas: CityMetrics;
  headline: string;
  chronicle: string;
}

export interface CityTurn {
  id: string;
  turnNumber: number;
  sector: string;
  title: string;
  briefing: string;
  options: [CityPolicyOption, CityPolicyOption, CityPolicyOption];
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
      "Detecta lo invisible. Compara estereotipos visuales de la IA, audita patrones de datos y aprende a 'hackear' el sesgo algorítmico.",
    status: 'Activo',
    coverImage: ethicsCardSesgos,
    coverAlt:
      'Composición editorial con rostros superpuestos tras una retícula óptica que evidencia patrones algorítmicos',
    metaLabel: '4 casos reales · Comparador Antes/Después',
  },
  {
    id: 'dilemas',
    title: 'Dilemas Morales',
    description:
      'Enfrenta 4 decisiones críticas en salud, movilidad, crédito y espacio público y descubre tu perfil ético frente al estudio MIT Moral Machine.',
    status: 'Activo',
    coverImage: ethicsCardDilemas,
    coverAlt:
      'Intersección urbana nocturna bajo lluvia con haces de luz que simbolizan una bifurcación ética de vehículos autónomos',
    metaLabel: '4 escenarios · Perfil ético final',
  },
  {
    id: 'real_falso',
    title: 'Detector de Impostores',
    description:
      'Pon a prueba tu ojo forense en 6 casos visuales con lupa 2× para identificar pistas documentales frente a artefactos de IA.',
    status: 'Activo',
    coverImage: ethicsCardImpostores,
    coverAlt:
      'Lupa óptica editorial inspeccionando un retrato impreso con artefactos sutiles de generación sintética',
    metaLabel: '6 rondas · Lupa forense 2× + Puntaje',
  },
  {
    id: 'caja_transparente',
    title: 'La Caja Transparente',
    description:
      "Compara un sistema de IA de 'caja negra' con uno auditable, detecta variables proxy sesgadas y manipula pesos en tiempo real (XAI).",
    status: 'Activo',
    coverImage: ethicsCardCaja,
    coverAlt:
      'Contraste escultórico entre un monolito opaco negro y un cubo de cristal transparente con circuitos luminosos visibles',
    metaLabel: '3 casos · Auditoría XAI en vivo',
  },
  {
    id: 'eco_datos',
    title: 'El Eco de los Datos',
    description:
      'Simula un día cotidiano, observa cómo se cruzan tus rastros entre intermediarios y prueba contramedidas reales de privacidad.',
    status: 'Activo',
    coverImage: ethicsCardEco,
    coverAlt:
      'Visualización editorial de huellas digitales cotidianas conectadas mediante líneas de luz hacia nodos de perfilado',
    metaLabel: '8 rastros · Mapa de inferencias y defensas',
  },
  {
    id: 'impacto_social',
    title: 'Simulador de Ciudad IA',
    description:
      'Gobierna una ciudad durante 5 turnos decidiendo políticas de IA mientras equilibras bienestar, privacidad, presupuesto y confianza.',
    status: 'Activo',
    coverImage: ethicsCardCiudad,
    coverAlt:
      'Maqueta arquitectónica iluminada de una ciudad contemporánea sobre mesa de planificación cívica',
    metaLabel: '5 turnos · 4 indicadores cívicos',
  },
];

export const BIAS_LAB_PRESETS: BiasPromptPreset[] = [
  {
    id: 'leader',
    prompt: 'Una persona líder',
    observedPattern:
      'Los modelos entrenados en archivos corporativos occidentales tienden a generar hombres de mediana edad en traje formal dentro de oficinas acristaladas.',
    homogeneityNote: 'Patrón dominante: ejecutivo corporativo occidental',
    dimensions: {
      gender: 'Mayoría masculina (~80% en salidas sin especificar)',
      skinTone: 'Sobrerrepresentación de piel clara y estética corporativa norteamericana',
      age: 'Adulto entre 38 y 55 años',
      context: 'Sala de juntas acristalada o podio financiero',
    },
    suggestedHack:
      'Una líder comunitaria indígena de 60 años dirigiendo un laboratorio de innovación territorial con mapas y luz natural de taller',
    beforeImage: biasLeaderBefore,
    afterImage: biasLeaderAfter,
    beforeAlt: 'Estereotipo corporativo homogéneo generado para el prompt genérico "Una persona líder"',
    afterAlt:
      'Retrato documental de una líder comunitaria indígena de 60 años guiando un laboratorio de innovación',
    hackSummary:
      'Desplaza el liderazgo desde el arquetipo ejecutivo único hacia liderazgo territorial, sabiduría intergeneracional y agencia colectiva.',
  },
  {
    id: 'family',
    prompt: 'Una familia feliz',
    observedPattern:
      'Predomina el arquetipo publicitario nuclear homogéneo en interiores suburbanos de alto poder adquisitivo con luz artificial uniforme.',
    homogeneityNote: 'Patrón dominante: familia nuclear publicitaria suburbana',
    dimensions: {
      gender: 'Pareja heterosexual normativa con dos hijos',
      skinTone: 'Estética publicitaria homogénea y poco diversa',
      age: 'Padres jóvenes 30–35 años, abuelos ausentes',
      context: 'Sala de estar suburbana estilo catálogo inmobiliario',
    },
    suggestedHack:
      'Una familia intergeneracional latinoamericana de tres generaciones preparando comida juntos en una cocina de barrio con luz cálida de tarde',
    beforeImage: biasFamilyBefore,
    afterImage: biasFamilyAfter,
    beforeAlt: 'Estereotipo publicitario suburbano generado para "Una familia feliz"',
    afterAlt:
      'Fotografía documental de una familia latinoamericana intergeneracional cocinando junta en luz natural cálida',
    hackSummary:
      'Recupera vínculos intergeneracionales, cocina vivida y memoria cotidiana real frente al decorado genérico de catálogo.',
  },
  {
    id: 'coder',
    prompt: 'Un programador brillante',
    observedPattern:
      'Se repite el cliché visual de la cultura geek solitaria: habitación oscura, sudadera con capucha y múltiples monitores con luz neón.',
    homogeneityNote: 'Patrón dominante: estereotipo solitario nocturno neón',
    dimensions: {
      gender: 'Hombre joven con sudadera con capucha',
      skinTone: 'Sesgo hacia rasgos caucásicos o asiáticos estereotipados',
      age: '20–30 años',
      context: 'Escritorio nocturno aislado iluminado por pantallas azules',
    },
    suggestedHack:
      'Una ingeniera de software afrodescendiente de 45 años facilitando un taller colaborativo de código abierto con pizarras y luz diurna natural',
    beforeImage: biasCoderBefore,
    afterImage: biasCoderAfter,
    beforeAlt: 'Cliché nocturno con sudadera y pantallas neón generado para "Un programador brillante"',
    afterAlt:
      'Fotografía documental de una ingeniera de software afrodescendiente facilitando un taller colaborativo luminoso',
    hackSummary:
      'Rompe el mito del genio aislado y muestra la tecnología como práctica colaborativa, diversa y pedagógica.',
  },
  {
    id: 'danger',
    prompt: 'Una persona peligrosa',
    observedPattern:
      'Uno de los sesgos más críticos: el algoritmo amplifica prejuicios raciales, de clase social, vestimenta urbana nocturna y estigmatización territorial.',
    homogeneityNote: 'Patrón dominante: criminalización visual de cuerpos y barrios',
    dimensions: {
      gender: 'Sobrerrepresentación masculina intimidante',
      skinTone: 'Criminalización visual de rasgos racializados y entornos populares',
      age: 'Jóvenes adultos en entornos urbanos oscuros',
      context: 'Callejones nocturnos con iluminación dura de alto contraste',
    },
    suggestedHack:
      'Ilustración editorial conceptual sobre desinformación financiera: manos invisibles manipulando titulares y gráficos bursátiles desde una sala de juntas de lujo',
    beforeImage: biasDangerBefore,
    afterImage: biasDangerAfter,
    beforeAlt:
      'Representación nocturna estigmatizante en callejón oscuro generada para "Una persona peligrosa"',
    afterAlt:
      'Composición editorial conceptual sobre desinformación y poder financiero en una oficina minimalista de alto nivel',
    hackSummary:
      'Cuestiona qué llamamos "peligro" desplazando el foco del prejuicio corporal hacia daños sistémicos como la desinformación o el fraude.',
  },
];

export const MORAL_DILEMMAS: MoralDilemmaScenario[] = [
  {
    id: 'autonomo',
    code: 'DILEMA 01',
    domain: 'Movilidad Autónoma · MIT Moral Machine',
    title: 'Falla de frenos en intersección urbana',
    context:
      'Un vehículo autónomo pierde los frenos a 60 km/h bajo la lluvia. Sus sensores confirman que no es posible detenerse antes del cruce: debe ejecutar una maniobra irreversible en 120 milisegundos.',
    tensionLeft: { label: '5 peatones', detail: 'cruzando el paso cebra' },
    tensionRight: { label: '1 pasajero', detail: 'dentro del vehículo' },
    image: ethicsCardDilemas,
    imageAlt: 'Intersección nocturna lluviosa iluminada por faros de vehículos frente a una bifurcación',
    optionA: {
      id: 'A',
      title: 'Opción A: Desviar contra la barrera',
      actionSummary: 'El vehículo vira bruscamente hacia el muro de contención lateral.',
      tradeoff: 'Sacrifica al pasajero para salvar a los 5 peatones del cruce.',
      framework: 'utilitarista',
      frameworkLabel: 'Enfoque Utilitarista (minimizar víctimas)',
      consequenceHeadline: '5 vidas salvadas · 1 pasajero sacrificado',
      consequenceDetail:
        'Tu código priorizó el mayor número total de vidas preservadas. Sin embargo, estudios muestran que los consumidores desconfían de comprar vehículos programados para sacrificar a su propio ocupante.',
      reflectionQuestion:
        '¿Debe una empresa privada decidir el valor relativo de una vida dentro de una actualización de software?',
    },
    optionB: {
      id: 'B',
      title: 'Opción B: Mantener la trayectoria',
      actionSummary: 'El vehículo sigue recto sin iniciar una maniobra deliberada contra su ocupante.',
      tradeoff: 'Protege al pasajero a costa de impactar a los 5 peatones.',
      framework: 'deontologico',
      frameworkLabel: 'Enfoque Deontológico (deber de no desviar deliberadamente)',
      consequenceHeadline: '1 pasajero a salvo · 5 peatones afectados',
      consequenceDetail:
        'Aplicaste el principio de no causar daño intencional desviando el vehículo contra alguien que estaba fuera del peligro directo, priorizando además el contrato de seguridad con el pasajero.',
      reflectionQuestion:
        'Si un fabricante prioriza siempre al comprador del coche, ¿quién protege a quienes caminan por la ciudad?',
    },
  },
  {
    id: 'triaje',
    code: 'DILEMA 02',
    domain: 'Salud Pública · Algoritmos Clínicos',
    title: 'Triaje hospitalario bajo saturación crítica',
    context:
      'Una sala de urgencias solo dispone de una cama UCI. Un modelo predictivo de apoyo clínico recomienda asignar el recurso al paciente con mayor probabilidad estadística de recuperación, pero su puntuación usa indirectamente el gasto médico histórico (sesgo de acceso a salud privada).',
    tensionLeft: { label: 'Eficiencia predictiva', detail: 'mayor puntaje histórico de éxito' },
    tensionRight: { label: 'Equidad clínica', detail: 'neutralizar sesgos socioeconómicos' },
    image: ethicsCardCaja,
    imageAlt: 'Representación editorial de transparencia algorítmica frente a caja negra decisional',
    optionA: {
      id: 'A',
      title: 'Opción A: Seguir el puntaje del modelo',
      actionSummary: 'Se asigna la cama al paciente con mayor probabilidad de alta según el algoritmo.',
      tradeoff: 'Maximiza la tasa estadística de éxito, pero reproduce desigualdad histórica de acceso.',
      framework: 'utilitarista',
      frameworkLabel: 'Enfoque Utilitarista (maximizar recuperación agregada)',
      consequenceHeadline: 'Decisión optimizada por tasa histórica · Sesgo estructural intacto',
      consequenceDetail:
        'En 2019, un estudio en Science demostró que un algoritmo usado en millones de pacientes en EE.UU. subestimaba la gravedad de pacientes negros porque usaba el gasto sanitario previo como proxy de necesidad médica.',
      reflectionQuestion:
        '¿Cuándo un dato "objetivo" como el gasto previo es en realidad un espejo de desigualdad?',
    },
    optionB: {
      id: 'B',
      title: 'Opción B: Auditar y retirar variables proxy',
      actionSummary: 'El comité clínico ignora el puntaje opaco y evalúa únicamente signos vitales y orden de llegada.',
      tradeoff: 'Acepta menor certeza estadística inmediata para impedir discriminación socioeconómica.',
      framework: 'justicia',
      frameworkLabel: 'Enfoque de Justicia Distributiva (equidad en derechos)',
      consequenceHeadline: 'Sesgo socioeconómico bloqueado · Criterio clínico transparente',
      consequenceDetail:
        'Garantizaste que el acceso a una cama vital no dependa del código postal ni del seguro previo, estableciendo trazabilidad y responsabilidad médica humana.',
      reflectionQuestion:
        '¿Qué protocolos de auditoría obligatoria deberían existir antes de desplegar IA en hospitales públicos?',
    },
  },
  {
    id: 'credito',
    code: 'DILEMA 03',
    domain: 'Finanzas y Vivienda · Scoring Algorítmico',
    title: 'Microcréditos de vivienda y código postal',
    context:
      'Una cooperativa financiera procesa 5.000 solicitudes de crédito para mejoramiento de vivienda. El equipo técnico descubre que incluir el barrio y la densidad de comercios cercanos reduce un 11% la morosidad predicha, pero rechaza automáticamente a solicitantes solventes de zonas periféricas.',
    tensionLeft: { label: 'Riesgo financiero', detail: '-11% impago estimado global' },
    tensionRight: { label: 'No discriminación', detail: 'evaluación individual justa' },
    image: ethicsCardEco,
    imageAlt: 'Red visual de datos cotidianos conectados a perfiles predictivos',
    optionA: {
      id: 'A',
      title: 'Opción A: Mantener las variables territoriales',
      actionSummary: 'Se activa el modelo completo para proteger la liquidez general de la cooperativa.',
      tradeoff: 'Reduce pérdidas proyectadas pero genera "redlining digital" sobre barrios enteros.',
      framework: 'utilitarista',
      frameworkLabel: 'Enfoque Utilitarista (sostenibilidad financiera agregada)',
      consequenceHeadline: 'Cartera más rentable · Exclusión territorial automatizada',
      consequenceDetail:
        'Al castigar el barrio en lugar de evaluar a la persona, el algoritmo convierte la desigualdad histórica del territorio en una profecía autocumplida que impide mejorar precisamente las zonas que más lo necesitan.',
      reflectionQuestion:
        '¿Es legítimo que una correlación estadística castigue a una persona por el lugar donde vive?',
    },
    optionB: {
      id: 'B',
      title: 'Opción B: Eliminar proxies y exigir explicabilidad',
      actionSummary: 'Se prohíben variables de ubicación y se entrega a cada persona el motivo comprensible del resultado.',
      tradeoff: 'Asume un riesgo financiero ligeramente mayor y requiere diseño de explicaciones claras.',
      framework: 'justicia',
      frameworkLabel: 'Enfoque de Justicia Distributiva (igualdad de oportunidades)',
      consequenceHeadline: 'Evaluación individual justa · Derecho a explicación garantizado',
      consequenceDetail:
        'Evitaste la discriminación indirecta y cumpliste estándares modernos de IA confiable: toda persona afectada por una decisión automatizada puede comprenderla e impugnarla.',
      reflectionQuestion:
        '¿Qué derecho debería prevalecer cuando un modelo de caja negra contradice el historial real de una persona?',
    },
  },
  {
    id: 'moderacion',
    code: 'DILEMA 04',
    domain: 'Espacio Público · Moderación y Derechos',
    title: 'Filtro automático en medio de una protesta cívica',
    context:
      'Durante una jornada de movilización ciudadana, una plataforma cívica registra un pico de rumores alarmistas que podrían provocar pánico. Puedes activar un filtro automático de IA que borra contenido sospechoso en segundos —pero comete 18% de falsos positivos silenciando reportes ciudadanos legítimos— o mantener revisión humana con 25 minutos de retraso.',
    tensionLeft: { label: 'Contención inmediata', detail: 'filtro automático (18% error)' },
    tensionRight: { label: 'Libertad informativa', detail: 'revisión humana + contexto' },
    image: ethicsCardCiudad,
    imageAlt: 'Maqueta urbana iluminada que representa decisiones de gobernanza tecnológica en la ciudad',
    optionA: {
      id: 'A',
      title: 'Opción A: Activar bloqueo preventivo con IA',
      actionSummary: 'El algoritmo oculta automáticamente publicaciones con patrones de alarma antes de que se viralicen.',
      tradeoff: 'Detiene rumores rápidos pero censura por error denuncias reales de prensa comunitaria.',
      framework: 'utilitarista',
      frameworkLabel: 'Enfoque Utilitarista (contener daño colectivo rápido)',
      consequenceHeadline: 'Desinformación frenada · 18% de periodismo ciudadano silenciado',
      consequenceDetail:
        'La automatización priorizó la velocidad sobre el contexto. En crisis sociales, los falsos positivos suelen afectar desproporcionadamente dialectos locales, denuncias de abuso y medios independientes.',
      reflectionQuestion:
        '¿Quién rinde cuentas cuando un filtro automático silencia una denuncia legítima en un momento crítico?',
    },
    optionB: {
      id: 'B',
      title: 'Opción B: Revisión humana + etiquetas de verificación',
      actionSummary: 'Se mantienen visibles las publicaciones con aviso de "en verificación" hasta que el equipo humano revise.',
      tradeoff: 'Algunos rumores circulan más tiempo, pero se respeta el principio de no censura previa.',
      framework: 'deontologico',
      frameworkLabel: 'Enfoque Deontológico (derecho fundamental sin censura previa)',
      consequenceHeadline: 'Libertad de expresión protegida · Fricción transparente ante rumores',
      consequenceDetail:
        'Defendiste un derecho fundamental frente a la eficiencia automática, usando la IA como asistente de priorización para moderadores humanos en lugar de juez definitivo.',
      reflectionQuestion:
        '¿Qué decisiones en una democracia nunca deberían delegarse por completo a un sistema automatizado?',
    },
  },
];

export const ETHICAL_PROFILES: Record<EthicalProfileKey, EthicalProfileSummary> = {
  utilitarista: {
    key: 'utilitarista',
    title: 'Perfil Pragmático · Utilitarista',
    subtitle: 'Priorizas el resultado agregado y la minimización cuantitativa del daño.',
    description:
      'Tus decisiones buscan maximizar el beneficio colectivo medible: salvar más vidas, optimizar tasas de éxito o frenar riesgos a escala.',
    blindSpot:
      'Riesgo a vigilar: las métricas agregadas suelen invisibilizar a minorías, normalizar falsos positivos o justificar sacrificios individuales en nombre de la eficiencia.',
    governanceLesson:
      'En diseño de IA, el enfoque utilitarista requiere límites explícitos de derechos humanos (líneas rojas) que ningún puntaje de optimización pueda cruzar.',
  },
  deontologico: {
    key: 'deontologico',
    title: 'Perfil de Principios · Deontológico',
    subtitle: 'Priorizas reglas universales, deberes y derechos que no deben vulnerarse.',
    description:
      'Rechazas utilizar a una persona como medio o aceptar censura previa incluso cuando el cálculo estadístico promete un mejor resultado global.',
    blindSpot:
      'Riesgo a vigilar: apegarse rígidamente a una regla formal puede paralizar la respuesta ante crisis reales o ignorar consecuencias desproporcionadas.',
    governanceLesson:
      'En gobernanza de IA, este enfoque sustenta principios irrenunciables como la supervisión humana significativa, el consentimiento y la responsabilidad legal.',
  },
  justicia: {
    key: 'justicia',
    title: 'Perfil de Equidad · Justicia Distributiva',
    subtitle: 'Priorizas corregir asimetrías estructurales y evitar discriminación indirecta.',
    description:
      'Identificas cómo los datos históricos heredan desigualdades y exiges transparencia, eliminación de variables proxy y trato justo a quienes están en desventaja.',
    blindSpot:
      'Riesgo a vigilar: corregir sesgos requiere auditorías continuas y acuerdos colectivos claros sobre qué definición de equidad aplica en cada contexto.',
    governanceLesson:
      'En proyectos culturales y públicos con IA, la justicia algorítmica exige participación comunitaria desde el diseño del dataset hasta la evaluación final.',
  },
  hibrido: {
    key: 'hibrido',
    title: 'Perfil Situado · Equilibrio Crítico',
    subtitle: 'Combinas impacto colectivo, derechos fundamentales y justicia según el contexto.',
    description:
      'No aplicaste una única fórmula mecánica: evaluaste cada escenario según las personas afectadas, la irreversibilidad del daño y los sesgos presentes.',
    blindSpot:
      'Riesgo a vigilar: la flexibilidad contextual necesita criterios documentados y trazables para evitar arbitrariedad cuando se traduce a políticas públicas o código.',
    governanceLesson:
      'Este es precisamente el corazón de la ética aplicada en IA: ningún algoritmo resuelve solo los conflictos de valores; la deliberación humana debe permanecer visible.',
  },
};

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
      'La mayoría de personas prefiere salvar más vidas, pero la cultura, el derecho y el contexto transforman radicalmente la decisión.',
  },
];

export const IMPOSTOR_CASES: ImpostorCase[] = [
  {
    id: 'imp-1',
    code: 'CASO 01',
    title: 'Mercado de flores al amanecer',
    category: 'Fotografía Callejera',
    image: impostorStreetMarket,
    imageAlt:
      'Vendedora mayor organizando flores de cempasúchil en un mercado callejero con transeúntes desenfocados al fondo',
    verdict: 'documental',
    verdictLabel: 'Patrón Documental Plausible',
    hint: 'Observa la dirección de la luz nublada, la textura orgánica de las manos y el desenfoque de movimiento a la derecha.',
    summary:
      'Presenta coherencia física propia de un registro documental de 35 mm: luz difusa consistente, pliegues naturales de lana, arrugas sin exceso simétrico y desenfoque de movimiento creíble.',
    provenanceNote:
      'Regla de oro: incluso cuando una escena luce 100% documental, la inspección visual nunca reemplaza confirmar autoría y archivo original.',
    clues: [
      {
        id: 1,
        x: 41,
        y: 35,
        label: 'Piel y luz difusa coherente',
        detail:
          'Las sombras suaves sobre el rostro y la pañoleta corresponden a cielo nublado uniforme, sin brillos plásticos ni simetría artificial.',
      },
      {
        id: 2,
        x: 54,
        y: 74,
        label: 'Anatomía de manos bajo tensión',
        detail:
          'Los dedos sujetan los tallos con presión realista, venas y pliegues naturales en la piel, sin fusiones ni dedos sobrantes.',
      },
      {
        id: 3,
        x: 82,
        y: 44,
        label: 'Desenfoque óptico de movimiento',
        detail:
          'La peatona en tránsito muestra un barrido direccional compatible con obturación lenta en fotografía callejera real.',
      },
    ],
  },
  {
    id: 'imp-2',
    code: 'CASO 02',
    title: 'Café nocturno bajo la lluvia',
    category: 'Retrato Editorial Nocturno',
    image: impostorNeonCafeAi,
    imageAlt:
      'Mujer sosteniendo una taza de café junto a una ventana lluviosa con luces neón y una pizarra de menú al fondo',
    verdict: 'sintetico',
    verdictLabel: 'Síntesis Generativa (IA)',
    hint: 'Usa la lupa 2× sobre la pizarra del menú al fondo a la derecha y el letrero neón junto a la ventana.',
    summary:
      'Delata señales clásicas de generación por difusión: texto deformado e ilegible en segundo plano, piel excesivamente pulida sin poros y paleta cian-naranja hiperuniforme.',
    provenanceNote:
      'Las tipografías secundarias en letreros, menús y etiquetas siguen siendo uno de los primeros puntos donde revisar autenticidad.',
    clues: [
      {
        id: 1,
        x: 78,
        y: 30,
        label: 'Pseudo-texto deformado en el menú',
        detail:
          'Al hacer zoom en la pizarra aparecen palabras distorsionadas y grafemas imposibles ("BESSESO", "COFFFE") típicos de síntesis neuronal.',
      },
      {
        id: 2,
        x: 42,
        y: 13,
        label: 'Letrero neón con caracteres incoherentes',
        detail:
          'El tubo luminoso junto a la ventana forma letras invertidas y fracturadas sin correspondencia real.',
      },
      {
        id: 3,
        x: 54,
        y: 35,
        label: 'Piel porcelana y luz hiper-estilizada',
        detail:
          'Textura cutánea excesivamente aerografiada y contraste cian/ámbar de catálogo sintético con ausencia de micro-imperfecciones reales.',
      },
    ],
  },
  {
    id: 'imp-3',
    code: 'CASO 03',
    title: 'Oficio de cerámica con luz lateral',
    category: 'Documental de Taller',
    image: impostorHandsClay,
    imageAlt:
      'Artesana mayor moldeando una vasija de barro húmedo en un torno junto a una ventana luminosa',
    verdict: 'documental',
    verdictLabel: 'Patrón Documental Plausible',
    hint: 'Examina la transición de foco desde el torno hacia la mesa de madera y la coherencia de las salpicaduras de barro.',
    summary:
      'Muestra continuidad física entre la ventana lateral, la humedad del barro, las manchas orgánicas del delantal y la caída progresiva de profundidad de campo.',
    provenanceNote:
      'Los detalles cotidianos imperfectos (salpicaduras irregulares, herramientas desgastadas) suelen ser consistentes con registros documentales situados.',
    clues: [
      {
        id: 1,
        x: 16,
        y: 34,
        label: 'Fuente de luz direccional consistente',
        detail:
          'Toda la escena responde a la misma ventana izquierda: el borde iluminado del cuenco, la frente y el reflejo sobre el torno.',
      },
      {
        id: 2,
        x: 63,
        y: 62,
        label: 'Barro húmedo y anatomía coherente',
        detail:
          'Las articulaciones, uñas y textura del barro seco y húmedo se comportan con fricción y desgaste creíbles.',
      },
      {
        id: 3,
        x: 35,
        y: 79,
        label: 'Micro-desorden material de taller',
        detail:
          'Espátula metálica, charcos de agua y restos de arcilla sobre madera envejecida sin repeticiones mecánicas.',
      },
    ],
  },
  {
    id: 'imp-4',
    code: 'CASO 04',
    title: 'Plaza histórica al atardecer',
    category: 'Arquitectura y Multitud',
    image: impostorPlazaCrowdAi,
    imageAlt:
      'Gran plaza histórica europea al atardecer con arcos de piedra, rayos solares dramáticos y decenas de turistas',
    verdict: 'sintetico',
    verdictLabel: 'Síntesis Generativa (IA)',
    hint: 'Inspecciona la continuidad de las columnas superiores a la izquierda y los cuerpos de los turistas en el plano medio.',
    summary:
      'Combina geometría arquitectónica que se comprime de forma irregular, multitud en plano medio con figuras fusionadas y rayos solares hiper-teatrales.',
    provenanceNote:
      'Las escenas abiertas con arcos repetitivos y multitudes son pruebas clave: la IA suele perder coherencia estructural al fondo.',
    clues: [
      {
        id: 1,
        x: 42,
        y: 30,
        label: 'Arcos y columnas con deriva geométrica',
        detail:
          'La galería superior altera el ritmo, grosor y perspectiva de sus arcos conforme se aleja hacia el fondo, acompañada de rayos volumétricos teatrales.',
      },
      {
        id: 2,
        x: 64,
        y: 56,
        label: 'Siluetas de multitud difusas o fundidas',
        detail:
          'Al acercar con lupa, varios transeúntes del fondo presentan cabezas cerosas y piernas que se mezclan entre sí.',
      },
      {
        id: 3,
        x: 52,
        y: 78,
        label: 'Brillo especular hiper-saturado',
        detail:
          'Los adoquines brillan como si estuvieran cubiertos de aceite dorado uniforme pese a no verse charcos definidos.',
      },
    ],
  },
  {
    id: 'imp-5',
    code: 'CASO 05',
    title: 'Paradero urbano bajo la lluvia',
    category: 'Crónica Urbana',
    image: impostorRainBus,
    imageAlt:
      'Grupo de personas con paraguas esperando en un paradero urbano bajo lluvia al anochecer con tráfico al fondo',
    verdict: 'documental',
    verdictLabel: 'Patrón Documental Plausible',
    hint: 'Analiza la naturalidad del encuadre, las posturas cotidianas y los reflejos del tráfico en el asfalto mojado.',
    summary:
      'Exhibe grano ISO nocturno natural, posturas no posadas, paraguas heterogéneos y reflejos físicos coherentes con las luces de freno sobre el pavimento mojado.',
    provenanceNote:
      'Advertencia crítica: los modelos recientes ya imitan el grano de 35 mm con enorme realismo. Siempre verifica contexto, fecha y metadatos C2PA.',
    clues: [
      {
        id: 1,
        x: 48,
        y: 48,
        label: 'Gestos cotidianos sin pose editorial',
        detail:
          'Las miradas, hombros encogidos por el frío y el acto de buscar algo en el bolso rompen la simetría artificial habitual en la IA.',
      },
      {
        id: 2,
        x: 84,
        y: 42,
        label: 'Bokeh óptico y luces de tráfico',
        detail:
          'La progresión del desenfoque en los vehículos y semáforos responde de forma natural a una lente luminosa nocturna.',
      },
      {
        id: 3,
        x: 78,
        y: 74,
        label: 'Reflejos consistentes sobre asfalto mojado',
        detail:
          'Las franjas rojas y blancas sobre el suelo húmedo coinciden verticalmente con la posición exacta de las luces de los autos.',
      },
    ],
  },
  {
    id: 'imp-6',
    code: 'CASO 06',
    title: 'Retrato en biblioteca con anteojos',
    category: 'Retrato de Primer Plano',
    image: impostorPortraitGlassesAi,
    imageAlt:
      'Primer plano de un hombre mayor con barba y anteojos redondos metálicos dentro de una biblioteca con una lámpara detrás',
    verdict: 'sintetico',
    verdictLabel: 'Síntesis Generativa (IA)',
    hint: 'Compara lo que refleja el lente izquierdo con lo que refleja el lente derecho — y mira dónde está la lámpara en la habitación.',
    summary:
      'Ejemplo de libro sobre física óptica imposible: cada lente refleja un entorno distinto, e incluso proyecta en el frente la lámpara y estantería que están a su espalda.',
    provenanceNote:
      'Los ojos, gafas, espejos y superficies metálicas son el talón de Aquiles óptico de muchos generadores de imagen.',
    clues: [
      {
        id: 1,
        x: 61,
        y: 42,
        label: 'Reflejo físicamente imposible en lente derecho',
        detail:
          'El cristal muestra una biblioteca y una lámpara encendida que en realidad están DETRÁS del sujeto, no frente a él.',
      },
      {
        id: 2,
        x: 39,
        y: 42,
        label: 'Incoherencia entre ambos cristales',
        detail:
          'El lente izquierdo refleja una ventana brillante abstracta totalmente distinta al reflejo nítido del lente derecho.',
      },
      {
        id: 3,
        x: 50,
        y: 27,
        label: 'Brillo cutáneo ceroso e hiper-simetría',
        detail:
          'La frente y el puente nasal presentan un lustre plástico excesivo y un encuadre frontal rígidamente simétrico.',
      },
    ],
  },
];

export const FORENSIC_VERIFICATION_PROTOCOL: ForensicProtocolStep[] = [
  {
    step: '01',
    title: 'Inspección óptica y contextual',
    detail:
      'Revisa reflejos en ojos y gafas, tipografías de fondo, continuidad de sombras, manos y geometría arquitectónica antes de compartir.',
  },
  {
    step: '02',
    title: 'Búsqueda inversa y fuente primaria',
    detail:
      'Contrasta la imagen en buscadores inversos y confirma si un medio, archivo o fotógrafo verificable publicó el registro original con fecha y lugar.',
  },
  {
    step: '03',
    title: 'Procedencia y credenciales C2PA',
    detail:
      'Cuando una imagen luce hiperrealista y sin fallos visibles, exige trazabilidad criptográfica (Content Credentials / C2PA) o declaración transparente de uso de IA.',
  },
];

export const XAI_HEADER_IMAGE = {
  src: xaiAuditPrism,
  alt: 'Prisma óptico de cristal descomponiendo luz sobre planos analíticos, metáfora de explicabilidad algorítmica',
};

export const DATA_ECHO_HEADER_IMAGE = {
  src: dataEchoTraces,
  alt: 'Objetos cotidianos sobre mesa oscura conectados por hilos de luz hacia un mapa de rastros e inferencias',
};

export const XAI_CASES: XaiCase[] = [
  {
    id: 'xai-beca',
    code: 'CASO XAI 01',
    title: 'Beca Pública de Arte y Tecnología',
    domain: 'Cultura y Convocatorias',
    applicantName: 'Camila R. · Artista comunitaria (34 años)',
    applicantSummary:
      'Presenta un laboratorio comunitario de archivo fotográfico y memoria barrial con 6 años de trayectoria y cartas de respaldo local.',
    baseScore: 50,
    threshold: 70,
    blackBoxCode: 'ERR-SCORE-058 · DENEGADO',
    blackBoxNotice:
      'Su postulación no superó el puntaje interno mínimo del modelo automatizado de preselección. Por política de propiedad intelectual del proveedor, los criterios detallados son confidenciales.',
    features: [
      {
        id: 'calidad-propuesta',
        label: 'Solidez artística y pedagógica',
        observedValue: 'Evaluación técnica: 9.2 / 10',
        defaultPoints: 18,
        minPoints: 0,
        maxPoints: 25,
        isProxy: false,
        explanation: 'Criterio sustantivo directamente vinculado al objeto de la convocatoria.',
      },
      {
        id: 'impacto-comunitario',
        label: 'Impacto territorial verificable',
        observedValue: '3 centros culturales aliados',
        defaultPoints: 14,
        minPoints: 0,
        maxPoints: 20,
        isProxy: false,
        explanation: 'Evidencia directa de participación comunitaria y continuidad.',
      },
      {
        id: 'presupuesto-viable',
        label: 'Coherencia presupuestal',
        observedValue: 'Cronograma y costos consistentes',
        defaultPoints: 8,
        minPoints: 0,
        maxPoints: 15,
        isProxy: false,
        explanation: 'Variable auditable sobre viabilidad financiera del proyecto.',
      },
      {
        id: 'proxy-institucion',
        label: 'Historial de becas en instituciones de élite',
        observedValue: 'Sin becas previas internacionales',
        defaultPoints: -18,
        minPoints: -25,
        maxPoints: 0,
        isProxy: true,
        explanation: 'Penaliza a creadores emergentes o autodidactas fuera del circuito tradicional.',
        proxyWarning:
          'Variable proxy de privilegio: reproduce la concentración histórica de fondos en los mismos ganadores.',
      },
      {
        id: 'proxy-estilo-texto',
        label: 'Similitud léxica con ensayos académicos',
        observedValue: 'Lenguaje claro comunitario',
        defaultPoints: -14,
        minPoints: -20,
        maxPoints: 0,
        isProxy: true,
        explanation: 'El modelo NLP premia jerga académica heredada de convocatorias pasadas.',
        proxyWarning:
          'Sesgo lingüístico oculto: castiga propuestas claras escritas desde prácticas comunitarias.',
      },
    ],
  },
  {
    id: 'xai-credito',
    code: 'CASO XAI 02',
    title: 'Microcrédito para Mejoramiento de Vivienda',
    domain: 'Scoring Financiero',
    applicantName: 'Jorge M. · Carpintero independiente (46 años)',
    applicantSummary:
      'Ingresos estables durante 5 años, cero atrasos en servicios y ahorro programado del 22% del valor solicitado.',
    baseScore: 50,
    threshold: 70,
    blackBoxCode: 'DECISION-DENY-061 · RECHAZADO',
    blackBoxNotice:
      'El sistema automatizado clasificó su solicitud como "Riesgo Elevado". No es posible detallar el peso de cada variable ni iniciar revisión inmediata.',
    features: [
      {
        id: 'capacidad-pago',
        label: 'Relación cuota / ingreso mensual',
        observedValue: 'Cuota representa 24% del ingreso',
        defaultPoints: 19,
        minPoints: 0,
        maxPoints: 25,
        isProxy: false,
        explanation: 'Indicador financiero directo y objetivo de solvencia real.',
      },
      {
        id: 'historial-pagos',
        label: 'Cumplimiento en servicios y proveedores',
        observedValue: '60 meses sin mora',
        defaultPoints: 16,
        minPoints: 0,
        maxPoints: 20,
        isProxy: false,
        explanation: 'Conducta verificable individual de pago responsable.',
      },
      {
        id: 'ahorro-previo',
        label: 'Fondo de ahorro previo',
        observedValue: '22% del monto cubierto',
        defaultPoints: 9,
        minPoints: 0,
        maxPoints: 15,
        isProxy: false,
        explanation: 'Respaldo concreto que reduce riesgo sin discriminar.',
      },
      {
        id: 'proxy-codigo-postal',
        label: 'Índice de morosidad del código postal',
        observedValue: 'Barrio periférico · Comuna 8',
        defaultPoints: -21,
        minPoints: -25,
        maxPoints: 0,
        isProxy: true,
        explanation: 'Atribuye al solicitante el promedio económico de su vecindario.',
        proxyWarning:
          'Redlining digital: discrimina por territorio ignorando el historial impecable de la persona.',
      },
      {
        id: 'proxy-dispositivo',
        label: 'Modelo de teléfono y horario de solicitud',
        observedValue: 'Android gama media · 11:40 p.m.',
        defaultPoints: -12,
        minPoints: -20,
        maxPoints: 0,
        isProxy: true,
        explanation: 'Metadato de comportamiento usado como atajo opaco de perfil socioeconómico.',
        proxyWarning:
          'Variable invasiva irrelevante: penalizar la hora de conexión castiga a quienes trabajan todo el día.',
      },
    ],
  },
  {
    id: 'xai-talento',
    code: 'CASO XAI 03',
    title: 'Filtro Automatizado de Hoja de Vida (ATS)',
    domain: 'Selección Laboral',
    applicantName: 'Elena V. · Diseñadora UX Senior (41 años)',
    applicantSummary:
      '8 años liderando productos accesibles, portafolio verificado y pausa laboral de 18 meses por cuidado familiar.',
    baseScore: 50,
    threshold: 70,
    blackBoxCode: 'ATS-FILTER-056 · DESCARTADA',
    blackBoxNotice:
      'Gracias por postular. Nuestro sistema de evaluación determinó que tu perfil no se ajusta a los patrones históricos del cargo.',
    features: [
      {
        id: 'portafolio-ux',
        label: 'Calidad técnica y accesibilidad (WCAG)',
        observedValue: 'Casos reales auditados · 9.5/10',
        defaultPoints: 20,
        minPoints: 0,
        maxPoints: 25,
        isProxy: false,
        explanation: 'Competencia central requerida para el rol.',
      },
      {
        id: 'experiencia-liderazgo',
        label: 'Experiencia demostrada en producto',
        observedValue: '8 años en equipos multidisciplinares',
        defaultPoints: 15,
        minPoints: 0,
        maxPoints: 20,
        isProxy: false,
        explanation: 'Trayectoria directamente relevante para el desempeño.',
      },
      {
        id: 'prueba-practica',
        label: 'Resolución de reto técnico',
        observedValue: 'Entrega clara y documentada',
        defaultPoints: 9,
        minPoints: 0,
        maxPoints: 15,
        isProxy: false,
        explanation: 'Evaluación objetiva basada en trabajo real.',
      },
      {
        id: 'proxy-brecha-cuidados',
        label: 'Continuidad laboral sin pausas (>12 meses)',
        observedValue: 'Pausa de 18 meses por cuidados',
        defaultPoints: -22,
        minPoints: -25,
        maxPoints: 0,
        isProxy: true,
        explanation: 'Descuenta puntos automáticamente por cualquier vacío en fechas del CV.',
        proxyWarning:
          'Sesgo de género indirecto: penaliza desproporcionadamente a mujeres y personas cuidadoras.',
      },
      {
        id: 'proxy-edad-graduacion',
        label: 'Proximidad con año de graduación promedio',
        observedValue: 'Egresada hace >15 años',
        defaultPoints: -16,
        minPoints: -20,
        maxPoints: 0,
        isProxy: true,
        explanation: 'El modelo aprendió del histórico joven de la empresa y castiga la edad.',
        proxyWarning:
          'Edadismo algorítmico: utiliza la fecha de grado como proxy de edad.',
      },
    ],
  },
];

export const DATA_ECHO_ACTIONS: DataEchoAction[] = [
  {
    id: 'act-podcast',
    time: '02:10 a.m.',
    category: 'Audio / Rutina',
    title: 'Escuchas podcasts sobre ansiedad laboral de madrugada',
    rawSignal: 'Patrón de insomnio + tema emocional sensible',
    brokersReceiving: ['Plataforma de audio', 'Red publicitaria móvil'],
    exposureWeight: 14,
    mitigatedByDefenseId: 'def-trackers',
  },
  {
    id: 'act-salud',
    time: '08:25 a.m.',
    category: 'Búsqueda',
    title: 'Buscas "dolor lumbar persistente" y farmacias cercanas',
    rawSignal: 'Consulta sintomática + intención médica inmediata',
    brokersReceiving: ['Buscador web', 'Corredores de datos de salud'],
    exposureWeight: 18,
    mitigatedByDefenseId: 'def-busqueda',
  },
  {
    id: 'act-ubicacion',
    time: '09:15 a.m.',
    category: 'GPS',
    title: 'Mantienes ubicación "Siempre activa" en app de descuentos',
    rawSignal: 'Trayecto casa–trabajo–clínica con precisión de metros',
    brokersReceiving: ['SDK de geolocalización', 'Agregadores de movilidad'],
    exposureWeight: 18,
    mitigatedByDefenseId: 'def-ubicacion',
  },
  {
    id: 'act-arriendo',
    time: '12:40 p.m.',
    category: 'Comunidad',
    title: 'Participas en grupo barrial sobre alza de arriendos',
    rawSignal: 'Interacción comunitaria + estrés habitacional',
    brokersReceiving: ['Red social', 'Modelos de scoring alternativo'],
    exposureWeight: 12,
    mitigatedByDefenseId: 'def-trackers',
  },
  {
    id: 'act-foto',
    time: '04:05 p.m.',
    category: 'Imagen',
    title: 'Subes foto familiar pública sin borrar metadatos EXIF',
    rawSignal: 'Coordenadas exactas, cámara, fecha y rostros indexables',
    brokersReceiving: ['Plataforma social', 'Scrapers biométricos'],
    exposureWeight: 15,
    mitigatedByDefenseId: 'def-exif',
  },
  {
    id: 'act-tarjeta',
    time: '06:30 p.m.',
    category: 'Consumo',
    title: 'Pagas café, transporte y farmacia con tarjeta y app de puntos',
    rawSignal: 'Ticket promedio, horarios y fidelización comercial',
    brokersReceiving: ['Programa de puntos', 'Buro de consumo'],
    exposureWeight: 10,
    mitigatedByDefenseId: 'def-trackers',
  },
  {
    id: 'act-opinion',
    time: '08:50 p.m.',
    category: 'Opinión',
    title: 'Comentas una noticia política y guardas reportajes críticos',
    rawSignal: 'Afinidad ideológica y sensibilidad emocional ante titulares',
    brokersReceiving: ['Algoritmo de recomendación', 'Micro-segmentación política'],
    exposureWeight: 13,
    mitigatedByDefenseId: 'def-trackers',
  },
  {
    id: 'act-cookies',
    time: '10:15 p.m.',
    category: 'Web',
    title: 'Pulsas "Aceptar todas las cookies" en 3 portales de noticias',
    rawSignal: 'Identificador cruzado en +40 socios publicitarios',
    brokersReceiving: ['AdTech en tiempo real', 'Data Brokers internacionales'],
    exposureWeight: 15,
    mitigatedByDefenseId: 'def-trackers',
  },
];

export const DATA_ECHO_INFERENCES: DataEchoInference[] = [
  {
    id: 'inf-vulnerabilidad-emocional',
    title: 'Vulnerabilidad emocional y fatiga laboral',
    requiredActionIds: ['act-podcast', 'act-salud', 'act-cookies'],
    minMatches: 2,
    inferredProfile:
      'Usuario con estrés crónico activo y ventanas nocturnas de baja resistencia a compras impulsivas.',
    realWorldImpact:
      'Publicidad hiper-segmentada de créditos rápidos, suplementos milagrosos o apps de pago a las 2 a.m.',
    severity: 'Crítica',
    neutralizedByDefenseId: 'def-trackers',
  },
  {
    id: 'inf-salud-sensible',
    title: 'Perfil de riesgo médico no declarado',
    requiredActionIds: ['act-salud', 'act-ubicacion', 'act-tarjeta'],
    minMatches: 2,
    inferredProfile:
      'Posible condición crónica musculoesquelética inferida sin historial clínico autorizado.',
    realWorldImpact:
      'Ajuste algorítmico de primas en seguros privados o campañas farmacéuticas dirigidas.',
    severity: 'Crítica',
    neutralizedByDefenseId: 'def-busqueda',
  },
  {
    id: 'inf-rutina-fisica',
    title: 'Mapa predictivo de hogar, trabajo y desplazamientos',
    requiredActionIds: ['act-ubicacion', 'act-foto', 'act-tarjeta'],
    minMatches: 2,
    inferredProfile:
      'Ubicación exacta de vivienda, horas en que la casa queda vacía y nivel socioeconómico del entorno.',
    realWorldImpact:
      'Precios dinámicos según zona y exposición física si la base de datos del intermediario sufre una filtración.',
    severity: 'Alta',
    neutralizedByDefenseId: 'def-ubicacion',
  },
  {
    id: 'inf-fragilidad-vivienda',
    title: 'Presión económica y riesgo habitacional',
    requiredActionIds: ['act-arriendo', 'act-podcast', 'act-tarjeta'],
    minMatches: 2,
    inferredProfile:
      'Hogar sensible a variaciones de ingresos con probabilidad de mudanza forzada.',
    realWorldImpact:
      'Segmentación con ofertas financieras abusivas o penalización indirecta en evaluaciones crediticias opacas.',
    severity: 'Alta',
    neutralizedByDefenseId: 'def-trackers',
  },
  {
    id: 'inf-biometria-contexto',
    title: 'Vínculos familiares e indexación facial',
    requiredActionIds: ['act-foto', 'act-ubicacion'],
    minMatches: 1,
    inferredProfile:
      'Rostros de terceros (incluso menores) asociados a coordenadas GPS y fecha exacta.',
    realWorldImpact:
      'Raspado automatizado para bases de reconocimiento facial o entrenamiento de IA sin consentimiento.',
    severity: 'Alta',
    neutralizedByDefenseId: 'def-exif',
  },
  {
    id: 'inf-camara-eco',
    title: 'Perfil psicográfico y polarización informativa',
    requiredActionIds: ['act-opinion', 'act-cookies', 'act-arriendo'],
    minMatches: 2,
    inferredProfile:
      'Mapa de indignación política y disparadores narrativos que maximizan tiempo en pantalla.',
    realWorldImpact:
      'Feeds que amplifican contenido polarizante y micro-campañas políticas invisibles para el resto de la sociedad.',
    severity: 'Media',
    neutralizedByDefenseId: 'def-trackers',
  },
];

export const DATA_PRIVACY_DEFENSES: DataPrivacyDefense[] = [
  {
    id: 'def-ubicacion',
    title: 'Ubicación solo "Al usar la app"',
    description: 'Corta el rastreo continuo en segundo plano de SDKs comerciales.',
    exposureReduction: 24,
  },
  {
    id: 'def-trackers',
    title: 'Bloquear cookies y rastreadores 3P',
    description: 'Impide que tu navegación entre sitios se fusione en un perfil único.',
    exposureReduction: 28,
  },
  {
    id: 'def-exif',
    title: 'Limpiar metadatos EXIF antes de subir',
    description: 'Elimina coordenadas GPS y datos del dispositivo en fotografías públicas.',
    exposureReduction: 18,
  },
  {
    id: 'def-busqueda',
    title: 'Separar búsquedas de salud en navegador privado',
    description: 'Evita que consultas médicas entren en tu perfil publicitario comercial.',
    exposureReduction: 20,
  },
];

export const CITY_HEADER_IMAGE = {
  src: cityAiGovernance,
  alt: 'Maqueta arquitectónica iluminada de una ciudad latinoamericana sostenible sobre mesa de planificación cívica',
};

export const CITY_INITIAL_METRICS: CityMetrics = {
  wellbeing: 60,
  privacy: 60,
  budget: 60,
  trust: 60,
};

export const CITY_TURNS: CityTurn[] = [
  {
    id: 'turn-1-seguridad',
    turnNumber: 1,
    sector: 'Seguridad y Espacio Público',
    title: 'Reconocimiento facial en el transporte masivo',
    briefing:
      'Una empresa tecnológica ofrece instalar gratis 1.200 cámaras con reconocimiento facial en tiempo real en estaciones de metro y bus a cambio de entrenar sus modelos con el flujo ciudadano.',
    options: [
      {
        id: 'A',
        title: 'Aceptar el despliegue biométrico gratuito',
        summary: 'Cero costo inicial para el municipio, pero vigilancia biométrica permanente.',
        deltas: { wellbeing: 4, privacy: -24, budget: 12, trust: -16 },
        headline: 'Crónica local: "El transporte ya identifica rostros sin consentimiento previo"',
        chronicle:
          'El ahorro inicial sedujo al gabinete, pero colectivos vecinales denunciaron falsos positivos policiales y el uso privado de datos biométricos en el espacio público.',
      },
      {
        id: 'B',
        title: 'Prohibir biometría e invertir en iluminación y mediadores',
        summary: 'Protege libertades civiles y fortalece presencia humana en estaciones.',
        deltas: { wellbeing: 10, privacy: 14, budget: -14, trust: 12 },
        headline: 'Crónica local: "Estaciones más iluminadas y presencia comunitaria reducen incidentes"',
        chronicle:
          'El presupuesto sintió el esfuerzo, pero la ciudadanía celebró no ser tratada como sospechosa por defecto y recuperó la percepción de seguridad cotidiana.',
      },
      {
        id: 'C',
        title: 'Sensores anónimos de aforo sin biometría + auditoría abierta',
        summary: 'Mide congestión y alertas sin identificar rostros, con datos públicos auditables.',
        deltas: { wellbeing: 8, privacy: 8, budget: -6, trust: 10 },
        headline: 'Crónica local: "Tecnología de aforo sin rostros mejora frecuencias sin vigilar"',
        chronicle:
          'Al limitar la recolección de datos al mínimo necesario, las estaciones optimizaron frecuencias de trenes preservando el anonimato en la calle.',
      },
    ],
  },
  {
    id: 'turn-2-movilidad',
    turnNumber: 2,
    sector: 'Movilidad y Clima',
    title: 'Semáforos inteligentes y calidad del aire',
    briefing:
      'Los episodios de contaminación atmosférica aumentan un 18%. Debes definir cómo programar el nuevo centro municipal de control de tráfico asistido por IA.',
    options: [
      {
        id: 'A',
        title: 'Optimizar velocidad de avenidas principales para autos',
        summary: 'Reduce atascos vehiculares a corto plazo mediante software propietario.',
        deltas: { wellbeing: -4, privacy: -4, budget: 6, trust: -6 },
        headline: 'Crónica local: "Más fluidez para autos, pero sube el smog en barrios peatonales"',
        chronicle:
          'La fluidez vehicular incentivó más viajes en automóvil privado y desplazó la contaminación hacia corredores escolares y paradas de autobús.',
      },
      {
        id: 'B',
        title: 'IA abierta priorizando transporte público, bicis y aire limpio',
        summary: 'Da ola verde a buses eléctricos, ciclorrutas y alertas ambientales abiertas.',
        deltas: { wellbeing: 14, privacy: 4, budget: -10, trust: 10 },
        headline: 'Crónica local: "Los buses ahorran 19 minutos y bajan picos de material particulado"',
        chronicle:
          'La inversión inicial exigió ajustes fiscales, pero la ciudad ganó aire más limpio y un transporte público más puntual para la mayoría de habitantes.',
      },
      {
        id: 'C',
        title: 'Postergar la modernización y mantener ciclos fijos',
        summary: 'Ahorra presupuesto este año evitando contratos tecnológicos complejos.',
        deltas: { wellbeing: -8, privacy: 4, budget: 10, trust: -6 },
        headline: 'Crónica local: "Sin cambios en movilidad: persisten demoras y alertas ambientales"',
        chronicle:
          'Las finanzas se mantuvieron intactas, aunque creció la frustración ciudadana ante la falta de soluciones frente a los trancones y la contaminación.',
      },
    ],
  },
  {
    id: 'turn-3-educacion',
    turnNumber: 3,
    sector: 'Educación y Bibliotecas',
    title: 'IA generativa en colegios y bibliotecas públicas',
    briefing:
      'Docentes y estudiantes ya usan herramientas de IA sin lineamientos comunes. El concejo debate cómo integrar tecnología educativa en la red pública.',
    options: [
      {
        id: 'A',
        title: 'Contratar plataforma cerrada con perfilado predictivo estudiantil',
        summary: 'Asistentes personalizados rápidos, pero los perfiles de menores se almacenan en la nube privada.',
        deltas: { wellbeing: 6, privacy: -18, budget: -6, trust: -10 },
        headline: 'Crónica local: "Familias cuestionan qué empresa guarda los perfiles de sus hijos"',
        chronicle:
          'Aunque aceleró tareas administrativas, madres, padres y docentes exigieron explicaciones sobre el rastreo cognitivo y comercial de estudiantes menores de edad.',
      },
      {
        id: 'B',
        title: 'Red pública de alfabetización crítica y laboratorios abiertos',
        summary: 'Forma docentes, usa herramientas auditables sin perfilado y abre talleres barriales.',
        deltas: { wellbeing: 12, privacy: 10, budget: -10, trust: 14 },
        headline: 'Crónica local: "Bibliotecas públicas lideran laboratorios de pensamiento crítico en IA"',
        chronicle:
          'Estudiantes y adultos mayores aprendieron a cuestionar sesgos, verificar fuentes y crear con IA bajo estándares públicos de protección de datos.',
      },
      {
        id: 'C',
        title: 'Prohibir todo uso de IA en escuelas públicas',
        summary: 'Evita riesgos de privacidad de inmediato sin gasto nuevo, pero amplía la brecha digital.',
        deltas: { wellbeing: -8, privacy: 8, budget: 8, trust: -4 },
        headline: 'Crónica local: "Crece la brecha: colegios privados entrenan en IA mientras públicos la vetan"',
        chronicle:
          'La prohibición evitó contratos apresurados, pero dejó a la juventud de colegios públicos sin acompañamiento pedagógico frente a herramientas que ya usan en casa.',
      },
    ],
  },
  {
    id: 'turn-4-salud',
    turnNumber: 4,
    sector: 'Salud y Emergencias Climáticas',
    title: 'Sistemas predictivos en urgencias y lluvias extremas',
    briefing:
      'La red hospitalaria pública está saturada y se pronostica una temporada de lluvias intensas en laderas vulnerables. Debes decidir cómo desplegar modelos predictivos.',
    options: [
      {
        id: 'A',
        title: 'Automatizar el triaje hospitalario para recortar costos rápido',
        summary: 'El algoritmo decide prioridades clínicas con mínima intervención humana.',
        deltas: { wellbeing: -6, privacy: -10, budget: 14, trust: -16 },
        headline: 'Crónica local: "Pacientes de barrios periféricos denuncian demoras por filtro automático"',
        chronicle:
          'El recorte administrativo mejoró la caja municipal, pero el modelo heredó sesgos históricos de acceso sanitario y desató protestas del personal médico.',
      },
      {
        id: 'B',
        title: 'Alertas climáticas locales + apoyo clínico con supervisión médica',
        summary: 'IA transparente para prevenir deslizamientos y asistir médicos sin reemplazar su juicio.',
        deltas: { wellbeing: 14, privacy: 6, budget: -12, trust: 12 },
        headline: 'Crónica local: "Alertas tempranas comunitarias evitan tragedias durante las lluvias"',
        chronicle:
          'La combinación de sensores abiertos en quebradas y médicos con última palabra clínica protegió vidas y fortaleció la credibilidad institucional.',
      },
      {
        id: 'C',
        title: 'Subcontratar plataforma de caja negra a proveedor internacional',
        summary: 'Promete despliegue en 30 días, pero sin acceso municipal al código ni auditoría.',
        deltas: { wellbeing: 4, privacy: -12, budget: -6, trust: -8 },
        headline: 'Crónica local: "El municipio depende de un algoritmo que nadie en la ciudad puede auditar"',
        chronicle:
          'El sistema operó rápido, pero cuando fallaron dos predicciones locales, el municipio descubrió que no tenía control legal ni técnico sobre las reglas del modelo.',
      },
    ],
  },
  {
    id: 'turn-5-gobernanza',
    turnNumber: 5,
    sector: 'Gobernanza y Transparencia Pública',
    title: 'Regla definitiva para compras públicas de IA',
    briefing:
      'En tu último turno debes fijar el marco institucional que heredará la ciudad para los próximos 10 años cada vez que el Estado quiera adquirir o desplegar IA.',
    options: [
      {
        id: 'A',
        title: 'Vía rápida sin registro público para atraer inversión privada',
        summary: 'Acelera licitaciones y mejora ingresos corporativos, pero sacrifica control ciudadano.',
        deltas: { wellbeing: 2, privacy: -14, budget: 16, trust: -14 },
        headline: 'Crónica local: "Empresas celebran desregulación mientras crecen reclamos por opacidad"',
        chronicle:
          'Las arcas crecieron con nuevos convenios tecnológicos, pero la ciudadanía perdió herramientas para saber dónde y cómo se usan algoritmos sobre sus derechos.',
      },
      {
        id: 'B',
        title: 'Registro Público de Algoritmos + Consejo Ciudadano Vinculante',
        summary: 'Toda IA municipal debe declarar propósito, datos, auditoría de sesgos y vía de apelación.',
        deltas: { wellbeing: 10, privacy: 14, budget: -6, trust: 18 },
        headline: 'Crónica local: "La ciudad inaugura registro abierto de algoritmos con veeduría barrial"',
        chronicle:
          'El marco se convirtió en referente regional: tecnología pública sujeta a rendición de cuentas, explicabilidad obligatoria y participación comunitaria real.',
      },
      {
        id: 'C',
        title: 'Moratoria indefinida sobre nuevos proyectos de IA municipal',
        summary: 'Congela gastos y riesgos mientras se revisan contratos anteriores.',
        deltas: { wellbeing: -6, privacy: 10, budget: 6, trust: 2 },
        headline: 'Crónica local: "Pausa algorítmica frena abusos pero retrasa servicios digitales clave"',
        chronicle:
          'La ciudad evitó daños inmediatos por despliegues improvisados, aunque dejó pendiente construir capacidades técnicas públicas propias.',
      },
    ],
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
  {
    id: 'ev-21',
    title: '¿IA fuera de control? Los expertos en inteligencia artificial hacen sonar la alarma | DW Documental',
    description:
      'Documental de DW sobre los riesgos emergentes, la carrera por el desarrollo de la IA y las advertencias de investigadores sobre gobernanza y límites éticos.',
    videoId: 'eYtkBCrMKUc',
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
