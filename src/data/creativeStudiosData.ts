import restorationBeforeAfterImg from '../assets/images/restoration_before_after_1794780462859.jpg';
import productCommerceStudioImg from '../assets/images/product_commerce_studio_1794780463192.jpg';
import drawingTo3dRenderImg from '../assets/images/drawing_to_3d_render_1794780463277.jpg';
import drawingArchRenderImg from '../assets/images/drawing_arch_render_1794780463935.jpg';
import webDesignShowcaseImg from '../assets/images/web_design_showcase_1794780465236.jpg';
import { VISUAL_LIBRARY_PATHS } from './visualLibraryRegistry';
import type { LabSubSection } from '../types/navigation';

export const STUDIO_MEDIA_ASSETS = {
  restorationBeforeAfter: restorationBeforeAfterImg,
  productCommerceStudio: productCommerceStudioImg,
  drawingTo3dRender: drawingTo3dRenderImg,
  drawingArchRender: drawingArchRenderImg,
  webDesignShowcase: webDesignShowcaseImg,
  fourLightsButterfly: VISUAL_LIBRARY_PATHS.lightButterfly,
  fourLightsRembrandt: VISUAL_LIBRARY_PATHS.lightRembrandt,
  fourLightsSplit: VISUAL_LIBRARY_PATHS.lightSplit,
  fourLightsRim: VISUAL_LIBRARY_PATHS.lightRim,
  productSplash: VISUAL_LIBRARY_PATHS.adSplash,
  productLuxury: VISUAL_LIBRARY_PATHS.adLuxury,
  productFloating: VISUAL_LIBRARY_PATHS.adFloating,
  productBeauty: VISUAL_LIBRARY_PATHS.adBeauty,
  territoryPhoto: VISUAL_LIBRARY_PATHS.photoTerritory,
  analogPortrait: VISUAL_LIBRARY_PATHS.photoAnalogDocumentary,
  sculpture3d: VISUAL_LIBRARY_PATHS.anim3dSculpture,
  botanicalArt: VISUAL_LIBRARY_PATHS.artBotanical,
  hybridOrganism: VISUAL_LIBRARY_PATHS.artHybridOrganism,
  characterSheet: VISUAL_LIBRARY_PATHS.storyCharacterSheet,
  worldbuildingCity: VISUAL_LIBRARY_PATHS.storyWorldbuildingCity,
  cinemaStudio: VISUAL_LIBRARY_PATHS.videoStudio,
};

// ============================================================================
// 01. WEB DESIGN & WEBSITE BUILDER DATA
// ============================================================================
export const WEB_CATEGORIES = [
  { id: 'landing', name: 'Landing Pages', desc: 'Captación clara, propuesta de valor, prueba social y CTA único.' },
  { id: 'portfolio', name: 'Portafolios Artísticos', desc: 'Galerías de obra, ficha curatorial, Lightbox y biografía editorial.' },
  { id: 'ecommerce', name: 'Tiendas Virtuales', desc: 'Catálogo filtrable, variantes de producto, carrito y ficha de compra.' },
  { id: 'institutional', name: 'Páginas Institucionales', desc: 'Misión, transparencia, informes, equipo y contacto accesible.' },
  { id: 'editorial', name: 'Blogs y Revistas', desc: 'Tipografía de lectura cómoda, archivo por temas y artículos destacados.' },
  { id: 'edtech', name: 'Plataformas Educativas', desc: 'Rutas de aprendizaje, módulos progresivos, ejercicios y glosarios.' },
  { id: 'directory', name: 'Directorios y Bibliotecas', desc: 'Buscador global, filtros combinados, favoritos y fichas detalladas.' },
  { id: 'dashboard', name: 'Dashboards', desc: 'Métricas tabulares, filtros por fecha, tablas y estados operativos.' },
  { id: 'webapp', name: 'Aplicaciones Web', desc: 'Flujos interactivos, estado persistente, formularios y vistas dinámicas.' },
  { id: 'microsite', name: 'Micrositios Interactivos', desc: 'Narrativa por capítulos, audio/video sincronizado y exploración guiada.' },
  { id: 'immersive', name: 'Experiencias Inmersivas', desc: 'Canvas WebGL/3D, transiciones fluidas y exploración espacial.' },
  { id: 'chatbot-ui', name: 'Interfaces Conversacionales', desc: 'Flujos de consulta guiada, prompts sugeridos y respuestas estructuradas.' },
];

export const WEB_CONCEPTS_LIBRARY = [
  {
    topic: 'Diseño UI',
    concepts: ['Grid Systems', 'Cards', 'Hero Sections', 'Navigation', 'Design Systems'],
    explanation: 'Sistemas modulares de rejilla, tarjetas sin sobrecarga, barras superiores limpias y jerarquía de componentes.',
  },
  {
    topic: 'Diseño UX',
    concepts: ['User Journey', 'Wireframes', 'Sitemap', 'Flujo por objetivos'],
    explanation: 'Arquitectura de información pensada desde lo que la persona necesita lograr en menos de 3 clics.',
  },
  {
    topic: 'Estética',
    concepts: ['Minimal', 'Editorial', 'Brutalista', 'Futurista'],
    explanation: 'Dirección visual intencional con disciplina 60-30-10 de color y equilibrio entre espacio en blanco y contenido.',
  },
  {
    topic: 'Tipografía',
    concepts: ['Jerarquía', 'Escalas', 'Combinaciones Display + Body + Mono'],
    explanation: 'Regla 2+1 de fuentes, alturas de línea legibles (1.5–1.7) y numerales tabulares para datos.',
  },
  {
    topic: 'Responsive',
    concepts: ['Mobile First', 'Desktop', 'Tablet', 'Touch targets ≥ 44px'],
    explanation: 'Adaptación fluida sin desbordamientos horizontales desde pantallas móviles hasta monitores de escritorio.',
  },
  {
    topic: 'Interacción',
    concepts: ['Hover', 'Scroll', 'Microinteracciones', 'Reduce Motion'],
    explanation: 'Transiciones rápidas (≤ 200ms) en transform/opacity con respeto estricto a prefers-reduced-motion.',
  },
  {
    topic: 'Desarrollo',
    concepts: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS'],
    explanation: 'Código modular, semántico y mantenible con tipado estricto y cero dependencias innecesarias.',
  },
  {
    topic: 'Accesibilidad & SEO',
    concepts: ['Contraste WCAG AA', 'Navegación teclado', 'Lectores de pantalla', 'SEO semántico'],
    explanation: 'Contraste ≥ 4.5:1, etiquetas aria claras, foco visible, textos alternativos y metadatos OpenGraph.',
  },
];

// ============================================================================
// 02. PHOTO RESTORATION LAB DATA
// ============================================================================
export const RESTORATION_CATEGORIES = [
  '1. Fotografías antiguas en blanco y negro',
  '2. Fotografías sepia',
  '3. Fotografías descoloridas',
  '4. Fotografías rayadas',
  '5. Fotografías rotas',
  '6. Fotografías con manchas',
  '7. Fotografías borrosas',
  '8. Fotografías de baja resolución',
  '9. Fotografías sobreexpuestas',
  '10. Fotografías subexpuestas',
  '11. Recuperación de rostros',
  '12. Reconstrucción de zonas faltantes',
  '13. Colorización histórica',
  '14. Restauración de fotografías familiares',
  '15. Restauración de archivos históricos',
];

export const RESTORATION_TOOLS = [
  { es: 'Eliminación de rayones', en: 'Scratch Removal', desc: 'Limpia fisuras lineales sin difuminar el grano ni los rasgos.' },
  { es: 'Eliminación de polvo', en: 'Dust Removal', desc: 'Retira motas blancas o negras de escaneo y emulsión envejecida.' },
  { es: 'Reducción de ruido', en: 'Image Denoising', desc: 'Suaviza ruido digital conservando la textura química analógica.' },
  { es: 'Recuperación de rostros', en: 'Face Detail Recovery', desc: 'Aclara ojos y facciones existentes sin sustituir la identidad.' },
  { es: 'Enfoque sutil', en: 'Image Sharpening', desc: 'Mejora acutancia en bordes reales evitando halos artificiales.' },
  { es: 'Corrección de manchas', en: 'Stain & Mold Cleanup', desc: 'Neutraliza humedad, hongos u oxidación en papel fotográfico.' },
  { es: 'Reconstrucción de bordes', en: 'Edge & Corner Reconstruction', desc: 'Completa esquinas rasgadas respetando contexto y época.' },
  { es: 'Recuperación de contraste', en: 'Contrast Recovery', desc: 'Devuelve negros profundos y medios tonos en copias lavadas.' },
  { es: 'Corrección tonal', en: 'Tonal & Exposure Balance', desc: 'Equilibra altas luces quemadas o sombras subexpuestas.' },
  { es: 'Ampliación de resolución', en: 'Super Resolution Upscale', desc: 'Escala para archivo e impresión manteniendo fidelidad documental.' },
  { es: 'Colorización histórica', en: 'Historical Colorization', desc: 'Aplica color verosímil de época de forma explícitamente opcional.' },
  { es: 'Restauración de textura', en: 'Authentic Film Grain Preservation', desc: 'Evita piel plástica preservando el carácter del negativo.' },
];

export const RESTORATION_ETHICS_RULES = [
  'Conservar siempre la identidad y los rasgos originales de las personas (no inventar rostros ni cambiar edades).',
  'No alterar vestuario, objetos simbólicos ni contexto arquitectónico sin indicación expresa del custodio del archivo.',
  'Conservar una copia intacta del archivo original sin modificar.',
  'Distinguir con transparencia la limpieza técnica de la reconstrucción generativa cuando falten zonas completas.',
  'Presentar la colorización y la reconstrucción de partes perdidas como una interpretación visual, nunca como evidencia documental.',
];

// ============================================================================
// 03. PRODUCT & COMMERCE LAB DATA
// ============================================================================
export const PRODUCT_CATEGORIES = [
  'Juguetes',
  'Muñecos y figuras coleccionables',
  'Ropa y accesorios',
  'Zapatos y bolsos',
  'Cosméticos',
  'Perfumería',
  'Artesanías',
  'Cerámica',
  'Mobiliario',
  'Electrónica',
  'Alimentos',
  'Productos naturales',
  'Merchandising',
  'Productos digitales con representación visual',
];

export const PRODUCT_PHOTO_TECHNIQUES = [
  {
    id: 'packshot',
    name: 'Packshot',
    application: 'Producto aislado sobre fondo limpio con geometría fiel para e-commerce.',
    promptEn: 'clean isolated studio packshot on matte seamless backdrop, distortion-free rectilinear optics, accurate true-to-life product colors',
    promptEs: 'fotografía packshot aislada sobre fondo mate continuo, óptica sin distorsión y fidelidad exacta de color del producto',
  },
  {
    id: 'hero-shot',
    name: 'Hero Shot',
    application: 'Imagen principal de campaña con dirección de arte e iluminación escultórica.',
    promptEn: 'dramatic commercial hero product photograph on sculptural mineral pedestal, directional softbox rim light, crisp shadows',
    promptEs: 'hero shot comercial protagonista sobre pedestal mineral escultórico, softbox direccional con luz de recorte y sombras nítidas',
  },
  {
    id: 'lifestyle',
    name: 'Product Lifestyle',
    application: 'Producto integrado en una escena cotidiana real de uso y escala humana.',
    promptEn: 'editorial lifestyle product scene in a sunlit lived-in interior showing authentic human scale and everyday context',
    promptEs: 'escena lifestyle editorial con el producto en uso real dentro de un espacio iluminado con luz natural de día',
  },
  {
    id: 'macro-detail',
    name: 'Macro Detail',
    application: 'Acercamiento táctil a costuras, esmaltes, grabados, madera o tejido.',
    promptEn: '100mm macro detail photograph highlighting authentic craft materials, surface grain, stitching and tactile finish',
    promptEs: 'fotografía macro de 100mm resaltando materiales reales, veta, costuras y acabado táctil artesanal',
  },
  {
    id: 'flat-lay',
    name: 'Flat Lay',
    application: 'Composición cenital a 90° ordenada con props complementarios y retícula clara.',
    promptEn: 'overhead 90-degree flat lay composition neatly arranged on warm textured stone with curated natural props',
    promptEs: 'composición cenital flat lay a 90 grados ordenada sobre piedra cálida con elementos complementarios naturales',
  },
  {
    id: 'ghost-mannequin',
    name: 'Ghost Mannequin',
    application: 'Prendas con volumen tridimensional real sin modelo visible.',
    promptEn: 'invisible ghost mannequin apparel studio photography showing natural 3D garment drape, collar interior and true fabric weight',
    promptEs: 'fotografía maniquí invisible (ghost mannequin) mostrando caída tridimensional real de la prenda y textura del tejido',
  },
  {
    id: 'exploded-view',
    name: 'Exploded View',
    application: 'Componentes o capas del producto suspendidos en orden técnico comprensible.',
    promptEn: 'clean studio exploded-view composition showing product parts suspended in aligned isometric clarity',
    promptEs: 'vista explosionada ordenada en estudio mostrando piezas o ingredientes del producto suspendidos con claridad técnica',
  },
  {
    id: '360-product',
    name: '360° Product View',
    application: 'Consistencia frontal, lateral, 3/4 y posterior con luz fija invariable.',
    promptEn: 'multi-angle 360 product turntable reference views under locked constant studio lighting and neutral backdrop',
    promptEs: 'serie multiángulo 360 grados (frontal, 3/4, lateral, posterior) bajo iluminación fija de estudio constante',
  },
  {
    id: 'packaging',
    name: 'Packaging Shot',
    application: 'Presentación del empaque, caja, etiqueta y experiencia de apertura.',
    promptEn: 'tactile packaging photography showcasing outer box, printed label alignment and unboxing presentation in warm daylight',
    promptEs: 'fotografía de empaque y unboxing mostrando caja, etiqueta alineada y presentación comercial con luz suave',
  },
  {
    id: 'social-commerce',
    name: 'Social Commerce',
    application: 'Encuadre vertical 4:5 o 9:16 con aire limpio para titular y llamado a compra.',
    promptEn: 'vertical 4:5 social commerce campaign composition with clean negative headroom for typography and vivid material clarity',
    promptEs: 'composición vertical 4:5 o 9:16 para redes sociales con zona limpia superior para titular y lectura inmediata',
  },
];

export const PRODUCT_PRESERVATION_RULES = [
  'Conservar exactamente la forma, proporciones y silueta del producto original.',
  'Mantener los colores reales y materiales auténticos sin exageraciones plásticas.',
  'No alterar, deformar ni reescribir el logotipo o tipografía de la etiqueta original.',
  'No inventar características técnicas, certificaciones, ingredientes o funciones inexistentes.',
];

// ============================================================================
// 04. MI PRIMERA IMAGEN (NIVEL INICIAL) DATA
// ============================================================================
export const BEGINNER_STEPS_DATA = {
  subjects: [
    { id: 'animal', label: 'Un animal', example: 'un colibrí descansando en una rama', promptEn: 'a hummingbird resting gently on a mossy branch' },
    { id: 'landscape', label: 'Un paisaje', example: 'una montaña andina entre nubes al amanecer', promptEn: 'an Andean mountain ridge emerging through morning clouds at dawn' },
    { id: 'person', label: 'Una persona', example: 'una ceramista sonriendo en su taller', promptEn: 'an artisan ceramicist smiling naturally in her workshop' },
    { id: 'object', label: 'Un objeto', example: 'una taza artesanal de barro humeante', promptEn: 'a handcrafted clay coffee mug with gentle rising steam' },
    { id: 'world', label: 'Un mundo imaginario', example: 'una biblioteca flotante rodeada de árboles', promptEn: 'a peaceful floating botanical library suspended among giant trees' },
  ],
  styles: [
    { id: 'photo', label: 'Fotografía real', glossary: 'Parece tomada con una cámara real, con luz y texturas auténticas.', promptEn: 'authentic natural photograph, realistic lighting and textures' },
    { id: 'watercolor', label: 'Acuarela', glossary: 'Trazos suaves de agua y pigmento sobre papel de algodón visible.', promptEn: 'delicate hand-painted watercolor illustration on textured cotton paper' },
    { id: 'illustration', label: 'Ilustración editorial', glossary: 'Dibujo expresivo con colores armónicos ideal para libros o afiches.', promptEn: 'contemporary editorial illustration with expressive clean lines' },
    { id: '3d', label: 'Personaje o escena 3D', glossary: 'Volúmenes tridimensionales suaves tipo animación de cine.', promptEn: 'tactile handcrafted 3D sculpted scene with soft studio light' },
    { id: 'comic', label: 'Cómic / Novela gráfica', glossary: 'Tinta definida y sombreado gráfico con fuerza narrativa.', promptEn: 'graphic novel ink and wash comic art style' },
  ],
  colors: [
    { id: 'warm', label: 'Cálidos (dorado y tierra)', promptEn: 'warm golden amber and earthy terracotta palette' },
    { id: 'cool', label: 'Frescos (azul y bosque)', promptEn: 'calm cool slate blue and deep forest green palette' },
    { id: 'vibrant', label: 'Alegres y contrastados', promptEn: 'vibrant balanced primary color accents' },
    { id: 'pastel', label: 'Suaves y luminosos', promptEn: 'soft luminous airy pastel tones' },
  ],
  settings: [
    { id: 'forest', label: 'Bosque o naturaleza', promptEn: 'set inside a quiet sunlit forest' },
    { id: 'city', label: 'Ciudad o barrio', promptEn: 'set on a lively neighborhood street corner' },
    { id: 'studio', label: 'Fondo limpio de estudio', promptEn: 'against a clean minimalist studio backdrop' },
    { id: 'space', label: 'Cielo nocturno o espacio', promptEn: 'under a calm starry night sky' },
  ],
  moods: [
    { id: 'calm', label: 'Sereno y luminoso', promptEn: 'peaceful bright atmosphere' },
    { id: 'mysterious', label: 'Misterioso', promptEn: 'mysterious poetic mist atmosphere' },
    { id: 'cinematic', label: 'Cinematográfico', promptEn: 'dramatic cinematic movie-still mood' },
    { id: 'joyful', label: 'Alegre y cercano', promptEn: 'warm joyful welcoming mood' },
  ],
  formats: [
    { id: '4:5', label: 'Vertical redes (4:5)', promptEn: 'aspect ratio 4:5' },
    { id: '16:9', label: 'Panorámico (16:9)', promptEn: 'aspect ratio 16:9' },
    { id: '1:1', label: 'Cuadrado (1:1)', promptEn: 'aspect ratio 1:1' },
  ],
};

export const BEGINNER_GLOSSARY = [
  { term: 'Prompt', meaning: 'Es la instrucción escrita que le das a la inteligencia artificial para explicarle qué imagen o escena quieres construir.' },
  { term: 'Estilo visual', meaning: 'Define si el resultado parecerá una fotografía tomada con cámara, un dibujo en acuarela, un cómic o una escultura 3D.' },
  { term: 'Ambiente', meaning: 'La emoción y la sensación de luz de la escena: tranquila, misteriosa, alegre o de película.' },
  { term: 'Formato (Aspect Ratio)', meaning: 'La forma del rectángulo de tu imagen: cuadrada (1:1), vertical para celular (4:5 o 9:16) o ancha como cine (16:9).' },
  { term: 'Iterar', meaning: 'Cambiar una sola cosa de tu prompt (por ejemplo solo el estilo o solo los colores) para comparar qué funciona mejor.' },
];

// ============================================================================
// 05. DRAWING TO IMAGE LAB DATA
// ============================================================================
export const DRAWING_TRANSFORMATION_TABLE = [
  { original: 'Dibujo a lápiz', target: 'Fotografía realista', summary: 'Conserva pose y encuadre del grafito traduciéndolos a luz y materiales físicos reales.' },
  { original: 'Boceto rápido', target: 'Ilustración editorial', summary: 'Refina proporciones y trazo expresivo con paleta armónica de libro o revista.' },
  { original: 'Dibujo infantil', target: 'Personaje 3D', summary: 'Mantiene el encanto e imaginación exacta del dibujo en volumen 3D táctil o cerámica.' },
  { original: 'Croquis arquitectónico', target: 'Render arquitectónico', summary: 'Convierte líneas de perspectiva a mano en edificio real con madera, concreto y sol.' },
  { original: 'Diseño de juguete', target: 'Producto comercial', summary: 'Lleva el boceto de juguete u objeto a fotografía comercial de estudio lista para venta.' },
  { original: 'Dibujo a tinta', target: 'Cómic', summary: 'Potencia el entintado, achurados y alto contraste narrativo de novela gráfica.' },
  { original: 'Acuarela en papel', target: 'Arte digital', summary: 'Amplifica atmósferas y veladuras manteniendo la pincelada orgánica del autor.' },
  { original: 'Garabato libre', target: 'Personaje fantástico', summary: 'Estructura la silueta espontánea en criatura o personaje coherente.' },
  { original: 'Dibujo técnico', target: 'Modelo visual conceptual', summary: 'Traduce cotas y vistas ortogonales en prototipo visual isométrico o de estudio.' },
  { original: 'Collage físico', target: 'Composición cinematográfica', summary: 'Unifica recortes y capas de papel bajo una atmósfera de luz e historia común.' },
];

export const DRAWING_TARGET_MODES = [
  { id: 'enhance', label: 'Mejorar dibujo original', en: 'cleaned refined enhancement of the original hand-drawn artwork preserving authentic pencil and ink character' },
  { id: 'lineart', label: 'Línea limpia (Line Art)', en: 'crisp clean monochrome black ink line art on pure white paper, sharp balanced contours' },
  { id: 'vector', label: 'Estilo Vectorial', en: 'clean flat geometric vector graphic illustration with crisp shapes and balanced brand palette' },
  { id: 'watercolor', label: 'Acuarela', en: 'expressive watercolor and ink illustration on cold-press cotton paper with natural pigment washes' },
  { id: 'digital-ill', label: 'Ilustración Digital', en: 'polished contemporary digital editorial illustration with rich lighting and cohesive palette' },
  { id: 'comic', label: 'Cómic', en: 'classic graphic novel comic book style with dynamic ink crosshatching and color flatting' },
  { id: 'anime', label: 'Anime', en: 'handcrafted cel-shaded anime film still aesthetic with expressive painted backgrounds' },
  { id: '3d-char', label: 'Personaje 3D', en: 'tactile sculpted 3D character render with soft subsurface shading and studio rim lighting' },
  { id: 'clay', label: 'Clay Render', en: 'matte neutral gray/terracotta sculptural clay 3D maquette render showing pure form and volume' },
  { id: 'product', label: 'Render de Producto', en: 'commercial studio product render made of tangible wood, ceramic or anodized metal on neutral plinth' },
  { id: 'arch', label: 'Render Arquitectónico', en: 'sunlit architectural visualization with exposed timber, concrete, glass and native landscape context' },
  { id: 'photo', label: 'Fotografía Realista', en: 'authentic photorealistic photograph with natural daylight, optical depth of field and physical textures' },
  { id: 'cinema', label: 'Escena Cinematográfica', en: 'anamorphic cinema film frame with volumetric atmosphere, balanced color grading and 35mm texture' },
  { id: 'concept', label: 'Concept Art', en: 'high-craft production concept art painting with environmental scale and atmospheric depth' },
];

export const DRAWING_FIDELITY_LEVELS = [
  {
    id: 'high',
    label: 'Máxima fidelidad',
    summary: 'Conserva exactamente la composición, silueta, pose y elementos dibujados por el autor.',
    en: 'STRICT HIGH FIDELITY to the uploaded drawing: preserve exact silhouette, object placement, proportions, pose and every hand-drawn element without adding unrequested objects',
    es: 'FIDELIDAD MÁXIMA al dibujo original: conservar exactamente la silueta, composición, proporciones, pose y cada elemento trazado por el autor sin inventar objetos ajenos',
  },
  {
    id: 'moderate',
    label: 'Interpretación moderada',
    summary: 'Mantiene la estructura y personaje principal pero refina anatomía, perspectiva y acabados.',
    en: 'MODERATE INTERPRETATION of the uploaded sketch: keep the core subject, composition and visual storytelling while refining perspective, depth and surface materials',
    es: 'INTERPRETACIÓN MODERADA: mantener la estructura, sujeto principal e idea narrativa mientras se refinan perspectiva, volumen y acabado material',
  },
  {
    id: 'creative',
    label: 'Reinterpretación creativa',
    summary: 'Usa el boceto como semilla conceptual para expandir iluminación, entorno y escala.',
    en: 'CREATIVE REINTERPRETATION inspired by the uploaded sketch: preserve the central motif and expand environmental lighting, atmosphere and visual richness',
    es: 'REINTERPRETACIÓN CREATIVA: tomar el boceto como punto de partida manteniendo el motivo central para expandir entorno, atmósfera y riqueza visual',
  },
];

// ============================================================================
// 06. 6 RETOS CREATIVOS COMPLETOS (MÓDULO 14)
// ============================================================================
export interface FullCreativeChallenge {
  id: string;
  code: string;
  title: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  coverImage: string;
  materials: string[];
  objective: string;
  steps: string[];
  promptTemplate: string;
  outcome: string;
  labTarget: LabSubSection;
  labLabel: string;
}

export const FULL_CREATIVE_CHALLENGES: FullCreativeChallenge[] = [
  {
    id: 'reto-01',
    code: 'RETO 01',
    title: 'Una persona, cuatro luces',
    level: 'Principiante',
    duration: '30 min',
    coverImage: VISUAL_LIBRARY_PATHS.lightRembrandt,
    materials: ['1 sujeto fijo', 'Constructor o Galería', 'Generador de imagen IA'],
    objective: 'Comprender cómo la dirección de la iluminación modifica la lectura emocional de un mismo retrato sin cambiar el sujeto.',
    steps: [
      'Genera un retrato manteniendo fijo el sujeto, vestuario y fondo con luz frontal Butterfly.',
      'Repite idéntico prompt cambiando únicamente a iluminación lateral Rembrandt a 45°.',
      'Repite cambiando a Split Lighting estricto a 90° (mitad en sombra).',
      'Finaliza con Rim Light (contraluz de recorte) y compara las 4 láminas lado a lado.',
    ],
    promptTemplate:
      'Studio portrait of the same person, neutral charcoal backdrop, 85mm f/2.8, authentic skin texture with visible pores — [CAMBIAR SOLO LA LUZ: Butterfly / Rembrandt 45° / Split 90° / Rim Light]',
    outcome: 'Serie comparativa de 4 retratos demostrando el impacto directo de la luz.',
    labTarget: 'labs',
    labLabel: 'Abrir Simulador de Iluminación',
  },
  {
    id: 'reto-02',
    code: 'RETO 02',
    title: 'Rescatando la memoria',
    level: 'Principiante',
    duration: '25 min',
    coverImage: restorationBeforeAfterImg,
    materials: ['1 fotografía antigua familiar o de archivo', 'Photo Restoration Lab', 'Herramienta IA multimodal'],
    objective: 'Diagnosticar deterioros reales de una fotografía antigua y generar instrucciones éticas que recuperen nitidez sin alterar la identidad de las personas.',
    steps: [
      'Sube una fotografía antigua al Photo Restoration Lab y conserva siempre una copia intacta del original.',
      'Identifica los deterioros reales (rayones, sepia descolorido, manchas o zonas rotas).',
      'Configura el nivel de restauración y elige blanco y negro fiel o colorización explícitamente interpretativa.',
      'Compara Original vs Restauración validando que los rasgos faciales y vestuario no hayan sido inventados.',
    ],
    promptTemplate:
      'Careful archival photo restoration of the uploaded photograph: remove surface scratches, creases and paper stains, recover natural contrast and eye clarity while strictly preserving authentic facial identity, proportions and vintage film grain.',
    outcome: 'Díptico comparativo Original / Restauración documentado con ética patrimonial.',
    labTarget: 'restauracion',
    labLabel: 'Abrir Photo Restoration Lab',
  },
  {
    id: 'reto-03',
    code: 'RETO 03',
    title: 'De objeto cotidiano a producto comercial',
    level: 'Intermedio',
    duration: '35 min',
    coverImage: productCommerceStudioImg,
    materials: ['1 foto tomada con celular de un juguete, artesanía o producto', 'Product & Commerce Lab'],
    objective: 'Transformar una fotografía doméstica de cualquier producto en un sistema visual comercial completo manteniendo su forma, material y logotipo exactos.',
    steps: [
      'Toma y sube la fotografía de tu objeto cotidiano (juguete, cerámica, prenda o alimento) al Product Lab.',
      'Produce primero un Packshot limpio de catálogo preservando geometría y colores originales.',
      'Crea una segunda variación Hero Shot o Lifestyle contextualizada para tienda online.',
      'Adapta una pieza vertical 4:5 para Social Commerce y evalúa consistencia entre las tres piezas.',
    ],
    promptTemplate:
      'Commercial studio product photography preserving the exact shape, proportions, original materials and logo of the uploaded object: [Packshot / Hero Shot / Lifestyle] under soft directional softbox lighting, true-to-life color accuracy.',
    outcome: 'Kit de 3 piezas comerciales coherentes (Catálogo, Campaña Hero y Redes Sociales).',
    labTarget: 'producto',
    labLabel: 'Abrir Product & Commerce Lab',
  },
  {
    id: 'reto-04',
    code: 'RETO 04',
    title: 'Del dibujo a la realidad',
    level: 'Principiante',
    duration: '30 min',
    coverImage: drawingTo3dRenderImg,
    materials: ['Papel y lápiz o marcador', 'Cámara de celular o escáner', 'Drawing to Image Lab'],
    objective: 'Convertir un dibujo hecho a mano (boceto infantil, diseño de juguete o croquis arquitectónico) en una pieza visual acabada respetando su silueta original.',
    steps: [
      'Dibuja en papel una idea sencilla (personaje, juguete o espacio) y tómale una foto o súbela al laboratorio.',
      'Usa las herramientas de limpieza en Canvas para eliminar sombras del papel y reforzar el trazo.',
      'Elige el lenguaje destino (Personaje 3D, Fotografía realista, Render arquitectónico o Acuarela) y ajusta fidelidad alta.',
      'Compara el boceto original frente al resultado y guarda tu prompt de transformación.',
    ],
    promptTemplate:
      'Transform the uploaded hand-drawn sketch into a tactile sculpted 3D character render with soft studio rim lighting, strictly preserving the exact silhouette, proportions and whimsical details drawn by the author.',
    outcome: 'Comparativa Antes / Después desde trazo en papel hasta render 3D o ilustración profesional.',
    labTarget: 'dibujo',
    labLabel: 'Abrir Drawing to Image Lab',
  },
  {
    id: 'reto-05',
    code: 'RETO 05',
    title: 'Mi primera página web',
    level: 'Intermedio',
    duration: '40 min',
    coverImage: webDesignShowcaseImg,
    materials: ['1 idea de proyecto cultural, portafolio o tienda', 'Web Design & Website Builder', 'Google AI Studio / Bolt / Replit'],
    objective: 'Traducir una idea en arquitectura de información, dirección visual responsive, accesibilidad y un prompt listo para construir un sitio web real con IA.',
    steps: [
      'Define el tipo de sitio (Landing, Portafolio, Tienda o Biblioteca) y tu público objetivo en el Web Design Lab.',
      'Elige estética gráfica, estructura de secciones, componentes interactivos y requisitos responsive/WCAG.',
      'Genera el prompt técnico completo de implementación para Google AI Studio, Bolt o Replit.',
      'Copia el prompt, ábrelo en tu entorno asistido y verifica el diseño tanto en escritorio como en móvil.',
    ],
    promptTemplate:
      'Construye una aplicación web responsive en React + TypeScript + Tailwind CSS con estética editorial contemporánea, navegación limpia de 3 zonas, jerarquía tipográfica clara, contraste WCAG AA y secciones modulares para [TU PROYECTO].',
    outcome: 'Prompt técnico estructurado + primera versión navegable construida en entorno web IA.',
    labTarget: 'web',
    labLabel: 'Abrir Web Design Lab',
  },
  {
    id: 'reto-06',
    code: 'RETO 06',
    title: 'Mi primera imagen con IA',
    level: 'Principiante',
    duration: '15 min',
    coverImage: VISUAL_LIBRARY_PATHS.artBotanical,
    materials: ['Solo una idea sencilla (sin conocimientos previos)', 'Laboratorio Mi Primera Imagen'],
    objective: 'Perder el miedo técnico creando tu primera imagen desde cero y observando cómo cambia la misma idea al probar tres estilos diferentes.',
    steps: [
      'Elige un sujeto sencillo en Mi Primera Imagen (un animal, objeto, persona, paisaje o mundo).',
      'Completa estilo, colores, escenario y ambiente en lenguaje cotidiano (sin hablar de lentes ni ISO).',
      'Copia el primer prompt y pruébalo con estilo Fotografía real.',
      'Mantén el mismo sujeto cambiando únicamente el estilo a Acuarela y luego a Personaje 3D para comparar.',
    ],
    promptTemplate:
      'A hummingbird resting gently on a mossy branch, warm golden amber palette, set inside a quiet sunlit forest, peaceful bright atmosphere — [COMPARAR: Fotografía real vs Acuarela vs 3D]',
    outcome: 'Tres interpretaciones distintas de una misma idea y comprensión intuitiva de qué es un prompt.',
    labTarget: 'principiante',
    labLabel: 'Abrir Mi Primera Imagen',
  },
];
