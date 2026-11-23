import type { AppSectionId, LabSubSection, ResourceSubSection } from '../types/navigation';

export interface ResolvedHashRoute {
  section: AppSectionId;
  labSub?: LabSubSection;
  resourceSub?: ResourceSubSection;
  academySub?: 'tools' | 'challenges' | 'glossary';
}

export const LAB_HASH_BY_SUB: Record<LabSubSection, string> = {
  principiante: 'mi-primera-imagen',
  dibujo: 'dibujo-a-imagen',
  restauracion: 'restauracion',
  producto: 'producto-lab',
  web: 'web-lab',
  interactivo: 'interactivo',
  moodboard: 'moodboard',
  iluminacion: 'iluminacion',
  labs: 'laboratorios',
  json: 'json-lab',
};

export function resolveRouteFromHash(hashValue: string): ResolvedHashRoute {
  const clean = hashValue.replace(/^#/, '').trim().toLowerCase();
  switch (clean) {
    case 'galeria':
      return { section: 'galeria' };
    case 'favoritos':
    case 'mis-proyectos':
    case 'proyectos':
    case 'bitacora':
      return { section: 'favoritos' };
    case 'fundamentos':
      return { section: 'fundamentos' };
    case 'biblioteca':
    case 'video-lab':
      return { section: 'biblioteca' };
    case 'mi-primera-imagen':
    case 'principiante':
      return { section: 'laboratorios', labSub: 'principiante' };
    case 'dibujo-a-imagen':
    case 'dibujo':
      return { section: 'laboratorios', labSub: 'dibujo' };
    case 'restauracion':
      return { section: 'laboratorios', labSub: 'restauracion' };
    case 'producto-lab':
    case 'producto':
      return { section: 'laboratorios', labSub: 'producto' };
    case 'web-lab':
    case 'web':
      return { section: 'laboratorios', labSub: 'web' };
    case 'interactivo':
    case 'videoarte':
    case 'tracking':
    case 'sensores':
      return { section: 'laboratorios', labSub: 'interactivo' };
    case 'moodboard':
    case 'tablero':
      return { section: 'laboratorios', labSub: 'moodboard' };
    case 'iluminacion':
    case 'simulador-luz':
    case 'simulador-iluminacion':
      return { section: 'laboratorios', labSub: 'iluminacion' };
    case 'laboratorios':
      return { section: 'laboratorios', labSub: 'labs' };
    case 'json-lab':
      return { section: 'laboratorios', labSub: 'json' };
    case 'experiencias':
    case 'explorar':
    case 'nuevos-laboratorios':
    case 'retos-express':
    case 'desafios-creativos':
    case 'experimentos':
    case 'experimentos-abiertos':
      return { section: 'experiencias' };
    case 'film-director':
      return { section: 'film-director' };
    case 'builder':
    case 'crear':
      return { section: 'builder' };
    case 'retos':
      return { section: 'academia', academySub: 'challenges' };
    case 'glosario':
      return { section: 'academia', academySub: 'glossary' };
    case 'herramientas-academia':
    case 'academia':
      return { section: 'academia', academySub: 'tools' };
    case 'etica-ia':
    case 'etica':
      return { section: 'etica-ia' };
    case 'movies-ia':
    case 'documentales':
    case 'peliculas':
    case 'cine-ia':
      return { section: 'movies-ia' };
    case 'recetas':
    case 'recursos':
      return { section: 'recursos', resourceSub: 'recetas' };
    case 'diccionario':
      return { section: 'recursos', resourceSub: 'diccionario' };
    case 'plantillas':
      return { section: 'recursos', resourceSub: 'plantillas' };
    case 'tutoriales':
    case 'tutoriales-ia':
    case 'tutoriales-paso-a-paso':
      return { section: 'recursos', resourceSub: 'tutoriales' };
    case 'ejercicios':
    case 'ejercicios-recursos':
      return { section: 'recursos', resourceSub: 'ejercicios' };
    case 'errores':
    case 'diagnostico':
    case 'negativos':
      return { section: 'recursos', resourceSub: 'errores' };
    case 'guias':
    case 'ratios':
    case 'paletas':
      return { section: 'recursos', resourceSub: 'guias' };
    case 'inicio':
    case 'home':
    case '':
    default:
      return { section: 'home' };
  }
}
