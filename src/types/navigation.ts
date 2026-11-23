export type AppSectionId =
  | 'home'
  | 'galeria'
  | 'fundamentos'
  | 'biblioteca'
  | 'laboratorios'
  | 'experiencias'
  | 'film-director'
  | 'builder'
  | 'academia'
  | 'etica-ia'
  | 'movies-ia'
  | 'recursos'
  | 'favoritos';

export type PrimaryNavAxis =
  | 'home'
  | 'galeria'
  | 'crear'
  | 'biblioteca'
  | 'explorar'
  | 'etica-ia'
  | 'movies-ia'
  | 'favoritos';

export type LabSubSection =
  | 'principiante'
  | 'dibujo'
  | 'restauracion'
  | 'producto'
  | 'web'
  | 'interactivo'
  | 'labs'
  | 'json';

export type ResourceSubSection =
  | 'recetas'
  | 'diccionario'
  | 'plantillas'
  | 'tutoriales'
  | 'ejercicios'
  | 'errores'
  | 'guias';

export function getPrimaryAxisForSection(
  section: AppSectionId,
  resourceSub?: ResourceSubSection
): PrimaryNavAxis {
  if (section === 'home') return 'home';
  if (section === 'galeria') return 'galeria';
  if (section === 'etica-ia') return 'etica-ia';
  if (section === 'movies-ia') return 'movies-ia';
  if (section === 'builder' || section === 'laboratorios' || section === 'film-director') {
    return 'crear';
  }
  if (section === 'recursos' && resourceSub === 'tutoriales') {
    return 'explorar';
  }
  if (section === 'biblioteca' || section === 'recursos' || section === 'fundamentos') {
    return 'biblioteca';
  }
  if (section === 'experiencias' || section === 'academia') {
    return 'explorar';
  }
  return 'favoritos';
}
