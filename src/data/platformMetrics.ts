/**
 * Fuente única de verdad para métricas verificadas de NÚCLEO COLECTIVO · Visual Prompt Lab.
 * Cada cifra se contrasta programáticamente mediante `auditPlatformMetrics()` en `src/utils/platformAudit.ts`.
 */
export const PLATFORM_METRICS = {
  // Galería Visual
  galleryPlates: 40, // GALLERY_VISUAL_ITEMS (40 láminas únicas: 35 imagen + 5 video)
  galleryCollections: 8, // GALLERY_COLLECTIONS (8 colecciones curadas)

  // Disciplinas (diferenciación explícita)
  disciplines: 8, // BUILDER_CATEGORIES en promptBuilderConfig.ts (Constructor Modular)
  builderDisciplines: 8, // Alias explícito: 8 disciplinas del Constructor
  experienceDisciplines: 6, // CREATIVE_DISCIPLINES (A–F) en creativeExperiencesData.ts
  templateDisciplines: 6, // EXTENDED_TEMPLATES en resourcesExtendedData.ts

  // Laboratorios y Experiencias (diferenciación explícita)
  labsCount: 10, // 10 estudios interactivos especializados (LabSubSection)
  specializedStudios: 10, // Alias explícito: 10 laboratorios interactivos
  experiences: 26, // CREATIVE_LAB_EXPERIENCES (26 experiencias guiadas de 8 etapas)
  expressChallenges: 10, // EXPRESS_CHALLENGES (Retos Express de 15 min)
  projectChallenges: 8, // CREATIVE_PROJECT_CHALLENGES (Desafíos completos)
  studioChallenges: 6, // FULL_CREATIVE_CHALLENGES en creativeStudiosData.ts
  academyChallenges: 4, // CREATIVE_CHALLENGES en extendedModulesData.ts
  openExperiments: 8, // OPEN_EXPERIMENTS (Experimentos abiertos)

  // Biblioteca Técnica
  modules: 26, // MODULES_META (6) + EXTENDED_MODULES_META (20)
  fichas: 130, // MODULES_01_TO_05_ENTRIES (61) + MODULE_06_VIDEO_ENTRIES (14) + EXTENDED_LIBRARY_ENTRIES (55)

  // Tutoriales y Recursos Prácticos
  tutorials: 12, // STEP_BY_STEP_TUTORIALS en resourcesTutorialsData.ts
  tutorialPaths: 3, // TUTORIAL_LEARNING_PATHS
  recipes: 12, // RECIPES en promptData.ts
  commands: 47, // MASTER_COMMANDS en promptData.ts
  practiceDrills: 10, // PRACTICE_DRILLS en resourcesExtendedData.ts
  troubleshootingCases: 10, // PROMPT_TROUBLESHOOTING_CASES en resourcesExtendedData.ts

  // Directorio de Aplicaciones Externas y Glosario
  aiTools: 48, // AI_TOOLS_DIRECTORY en extendedModulesData.ts
  bilingualGlossary: 22, // BILINGUAL_GLOSSARY en extendedModulesData.ts

  // Cultura Crítica y Audiovisual
  ethicsSimulators: 6, // ETHICS_SIMULATIONS en eticaIaData.ts
  ethicsTalks: 21, // ETHICS_VIDEOS en eticaIaData.ts (verificado: 21 charlas/videos)
  documentaries: 31, // DOCUMENTARY_VIDEOS en moviesIaData.ts
  fictionMovies: 20, // FICTION_MOVIES en moviesIaData.ts
} as const;

export type PlatformMetricKey = keyof typeof PLATFORM_METRICS;
