import { PLATFORM_METRICS, type PlatformMetricKey } from '../data/platformMetrics';
import {
  GALLERY_COLLECTIONS,
  GALLERY_VISUAL_ITEMS,
} from '../data/galleryCollectionsData';
import {
  CREATIVE_DISCIPLINES,
  CREATIVE_LAB_EXPERIENCES,
  CREATIVE_PROJECT_CHALLENGES,
  EXPRESS_CHALLENGES,
  OPEN_EXPERIMENTS,
} from '../data/creativeExperiencesData';
import { FULL_CREATIVE_CHALLENGES } from '../data/creativeStudiosData';
import { MODULES_01_TO_05_ENTRIES, MODULES_META } from '../data/modulesData';
import { MODULE_06_VIDEO_ENTRIES } from '../data/videoAndJsonData';
import {
  AI_TOOLS_DIRECTORY,
  BILINGUAL_GLOSSARY,
  CREATIVE_CHALLENGES,
  EXTENDED_LIBRARY_ENTRIES,
  EXTENDED_MODULES_META,
} from '../data/extendedModulesData';
import {
  EXTENDED_TEMPLATES,
  PRACTICE_DRILLS,
  PROMPT_TROUBLESHOOTING_CASES,
} from '../data/resourcesExtendedData';
import {
  STEP_BY_STEP_TUTORIALS,
  TUTORIAL_LEARNING_PATHS,
} from '../data/resourcesTutorialsData';
import { MASTER_COMMANDS, RECIPES } from '../data/promptData';
import { BUILDER_CATEGORIES } from '../data/promptBuilderConfig';
import { ETHICS_SIMULATIONS, ETHICS_VIDEOS } from '../data/eticaIaData';
import { DOCUMENTARY_VIDEOS, FICTION_MOVIES } from '../data/moviesIaData';
import type { LabSubSection } from '../types/navigation';

export const SPECIALIZED_STUDIO_IDS: readonly LabSubSection[] = [
  'principiante',
  'dibujo',
  'restauracion',
  'producto',
  'web',
  'interactivo',
  'moodboard',
  'iluminacion',
  'labs',
  'json',
] as const;

export type AuditCategory =
  | 'Disciplinas'
  | 'Laboratorios'
  | 'Experiencias'
  | 'Retos Express'
  | 'Fichas técnicas'
  | 'Tutoriales'
  | 'Láminas'
  | 'Colecciones'
  | 'Aplicaciones externas'
  | 'Cultura crítica y recursos';

export interface MetricAuditRow {
  metric: PlatformMetricKey;
  category: AuditCategory;
  label: string;
  source: string;
  declared: number;
  actual: number;
  delta: number;
  ok: boolean;
}

export interface DuplicateAuditRow {
  dataset: string;
  total: number;
  unique: number;
  duplicates: string[];
  ok: boolean;
}

export interface PlatformAuditReport {
  checkedAt: string;
  allMetricsMatch: boolean;
  allIdsUnique: boolean;
  metrics: MetricAuditRow[];
  duplicates: DuplicateAuditRow[];
  mismatches: MetricAuditRow[];
}

function findDuplicateIds(items: { id: string }[]): string[] {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) dups.add(item.id);
    seen.add(item.id);
  }
  return Array.from(dups);
}

/**
 * Compara cada indicador declarado en PLATFORM_METRICS contra la cantidad real
 * de registros disponibles en los datasets del repositorio, y detecta IDs duplicados.
 */
export function auditPlatformMetrics(): PlatformAuditReport {
  const allModulesMeta = [...MODULES_META, ...EXTENDED_MODULES_META];
  const allLibraryEntries = [
    ...MODULES_01_TO_05_ENTRIES,
    ...MODULE_06_VIDEO_ENTRIES,
    ...EXTENDED_LIBRARY_ENTRIES,
  ];

  const checks: Omit<MetricAuditRow, 'declared' | 'delta' | 'ok'>[] = [
    // Disciplinas
    {
      metric: 'disciplines',
      category: 'Disciplinas',
      label: 'Disciplinas del Constructor Modular',
      source: 'promptBuilderConfig.ts · BUILDER_CATEGORIES',
      actual: BUILDER_CATEGORIES.length,
    },
    {
      metric: 'builderDisciplines',
      category: 'Disciplinas',
      label: 'Disciplinas del Constructor (alias explícito)',
      source: 'promptBuilderConfig.ts · BUILDER_CATEGORIES',
      actual: BUILDER_CATEGORIES.length,
    },
    {
      metric: 'experienceDisciplines',
      category: 'Disciplinas',
      label: 'Disciplinas de Experiencias Guiadas (A–F)',
      source: 'creativeExperiencesData.ts · CREATIVE_DISCIPLINES',
      actual: CREATIVE_DISCIPLINES.length,
    },
    {
      metric: 'templateDisciplines',
      category: 'Disciplinas',
      label: 'Disciplinas con Plantillas Maestras',
      source: 'resourcesExtendedData.ts · EXTENDED_TEMPLATES',
      actual: EXTENDED_TEMPLATES.length,
    },

    // Laboratorios
    {
      metric: 'labsCount',
      category: 'Laboratorios',
      label: 'Laboratorios interactivos especializados',
      source: 'types/navigation.ts · LabSubSection',
      actual: SPECIALIZED_STUDIO_IDS.length,
    },
    {
      metric: 'specializedStudios',
      category: 'Laboratorios',
      label: 'Estudios interactivos (alias explícito)',
      source: 'types/navigation.ts · LabSubSection',
      actual: SPECIALIZED_STUDIO_IDS.length,
    },

    // Experiencias
    {
      metric: 'experiences',
      category: 'Experiencias',
      label: 'Experiencias guiadas paso a paso (8 etapas)',
      source: 'creativeExperiencesData.ts · CREATIVE_LAB_EXPERIENCES',
      actual: CREATIVE_LAB_EXPERIENCES.length,
    },
    {
      metric: 'projectChallenges',
      category: 'Experiencias',
      label: 'Desafíos creativos completos',
      source: 'creativeExperiencesData.ts · CREATIVE_PROJECT_CHALLENGES',
      actual: CREATIVE_PROJECT_CHALLENGES.length,
    },
    {
      metric: 'studioChallenges',
      category: 'Experiencias',
      label: 'Retos integrales en Estudios Creativos',
      source: 'creativeStudiosData.ts · FULL_CREATIVE_CHALLENGES',
      actual: FULL_CREATIVE_CHALLENGES.length,
    },
    {
      metric: 'academyChallenges',
      category: 'Experiencias',
      label: 'Retos de Academia',
      source: 'extendedModulesData.ts · CREATIVE_CHALLENGES',
      actual: CREATIVE_CHALLENGES.length,
    },
    {
      metric: 'openExperiments',
      category: 'Experiencias',
      label: 'Experimentos abiertos',
      source: 'creativeExperiencesData.ts · OPEN_EXPERIMENTS',
      actual: OPEN_EXPERIMENTS.length,
    },

    // Retos Express
    {
      metric: 'expressChallenges',
      category: 'Retos Express',
      label: 'Retos Express (15 min)',
      source: 'creativeExperiencesData.ts · EXPRESS_CHALLENGES',
      actual: EXPRESS_CHALLENGES.length,
    },

    // Fichas técnicas y módulos
    {
      metric: 'modules',
      category: 'Fichas técnicas',
      label: 'Módulos de la Biblioteca Visual y Técnica',
      source: 'modulesData.ts + extendedModulesData.ts',
      actual: allModulesMeta.length,
    },
    {
      metric: 'fichas',
      category: 'Fichas técnicas',
      label: 'Fichas técnicas verificadas (Mód. 01–26)',
      source: 'modulesData.ts + videoAndJsonData.ts + extendedModulesData.ts',
      actual: allLibraryEntries.length,
    },

    // Tutoriales
    {
      metric: 'tutorials',
      category: 'Tutoriales',
      label: 'Tutoriales paso a paso en video',
      source: 'resourcesTutorialsData.ts · STEP_BY_STEP_TUTORIALS',
      actual: STEP_BY_STEP_TUTORIALS.length,
    },
    {
      metric: 'tutorialPaths',
      category: 'Tutoriales',
      label: 'Rutas guiadas de aprendizaje',
      source: 'resourcesTutorialsData.ts · TUTORIAL_LEARNING_PATHS',
      actual: TUTORIAL_LEARNING_PATHS.length,
    },

    // Láminas y Colecciones
    {
      metric: 'galleryPlates',
      category: 'Láminas',
      label: 'Láminas curadas en Galería Visual',
      source: 'galleryCollectionsData.ts · GALLERY_VISUAL_ITEMS',
      actual: GALLERY_VISUAL_ITEMS.length,
    },
    {
      metric: 'galleryCollections',
      category: 'Colecciones',
      label: 'Colecciones temáticas de Galería',
      source: 'galleryCollectionsData.ts · GALLERY_COLLECTIONS',
      actual: GALLERY_COLLECTIONS.length,
    },

    // Aplicaciones externas
    {
      metric: 'aiTools',
      category: 'Aplicaciones externas',
      label: 'Directorio de aplicaciones externas de IA',
      source: 'extendedModulesData.ts · AI_TOOLS_DIRECTORY',
      actual: AI_TOOLS_DIRECTORY.length,
    },

    // Cultura crítica y recursos
    {
      metric: 'recipes',
      category: 'Cultura crítica y recursos',
      label: 'Recetas Maestras',
      source: 'promptData.ts · RECIPES',
      actual: RECIPES.length,
    },
    {
      metric: 'commands',
      category: 'Cultura crítica y recursos',
      label: 'Comandos del Diccionario Visual',
      source: 'promptData.ts · MASTER_COMMANDS',
      actual: MASTER_COMMANDS.length,
    },
    {
      metric: 'practiceDrills',
      category: 'Cultura crítica y recursos',
      label: 'Ejercicios prácticos',
      source: 'resourcesExtendedData.ts · PRACTICE_DRILLS',
      actual: PRACTICE_DRILLS.length,
    },
    {
      metric: 'troubleshootingCases',
      category: 'Cultura crítica y recursos',
      label: 'Casos de Clínica de Errores',
      source: 'resourcesExtendedData.ts · PROMPT_TROUBLESHOOTING_CASES',
      actual: PROMPT_TROUBLESHOOTING_CASES.length,
    },
    {
      metric: 'bilingualGlossary',
      category: 'Cultura crítica y recursos',
      label: 'Términos en Glosario Bilingüe ES–EN',
      source: 'extendedModulesData.ts · BILINGUAL_GLOSSARY',
      actual: BILINGUAL_GLOSSARY.length,
    },
    {
      metric: 'ethicsSimulators',
      category: 'Cultura crítica y recursos',
      label: 'Simuladores interactivos de Ética IA',
      source: 'eticaIaData.ts · ETHICS_SIMULATIONS',
      actual: ETHICS_SIMULATIONS.length,
    },
    {
      metric: 'ethicsTalks',
      category: 'Cultura crítica y recursos',
      label: 'Charlas y paneles críticos de Ética IA',
      source: 'eticaIaData.ts · ETHICS_VIDEOS',
      actual: ETHICS_VIDEOS.length,
    },
    {
      metric: 'documentaries',
      category: 'Cultura crítica y recursos',
      label: 'Documentales y debates en Cine IA',
      source: 'moviesIaData.ts · DOCUMENTARY_VIDEOS',
      actual: DOCUMENTARY_VIDEOS.length,
    },
    {
      metric: 'fictionMovies',
      category: 'Cultura crítica y recursos',
      label: 'Películas de ficción en Filmoteca IA',
      source: 'moviesIaData.ts · FICTION_MOVIES',
      actual: FICTION_MOVIES.length,
    },
  ];

  const metrics: MetricAuditRow[] = checks.map((c) => {
    const declared = PLATFORM_METRICS[c.metric];
    const delta = c.actual - declared;
    return {
      ...c,
      declared,
      delta,
      ok: delta === 0,
    };
  });

  const duplicateSpecs: { dataset: string; items: { id: string }[] }[] = [
    { dataset: 'GALLERY_VISUAL_ITEMS', items: GALLERY_VISUAL_ITEMS },
    { dataset: 'GALLERY_COLLECTIONS', items: GALLERY_COLLECTIONS },
    { dataset: 'ALL_MODULES_META (01–26)', items: allModulesMeta },
    { dataset: 'ALL_LIBRARY_ENTRIES (fichas)', items: allLibraryEntries },
    { dataset: 'CREATIVE_LAB_EXPERIENCES', items: CREATIVE_LAB_EXPERIENCES },
    { dataset: 'EXPRESS_CHALLENGES', items: EXPRESS_CHALLENGES },
    { dataset: 'STEP_BY_STEP_TUTORIALS', items: STEP_BY_STEP_TUTORIALS },
    { dataset: 'AI_TOOLS_DIRECTORY', items: AI_TOOLS_DIRECTORY },
    { dataset: 'ETHICS_VIDEOS', items: ETHICS_VIDEOS },
    { dataset: 'DOCUMENTARY_VIDEOS', items: DOCUMENTARY_VIDEOS },
    { dataset: 'FICTION_MOVIES', items: FICTION_MOVIES },
  ];

  const duplicates: DuplicateAuditRow[] = duplicateSpecs.map((spec) => {
    const dups = findDuplicateIds(spec.items);
    return {
      dataset: spec.dataset,
      total: spec.items.length,
      unique: new Set(spec.items.map((i) => i.id)).size,
      duplicates: dups,
      ok: dups.length === 0,
    };
  });

  const mismatches = metrics.filter((m) => !m.ok);

  return {
    checkedAt: new Date().toISOString(),
    allMetricsMatch: mismatches.length === 0,
    allIdsUnique: duplicates.every((d) => d.ok),
    metrics,
    duplicates,
    mismatches,
  };
}
