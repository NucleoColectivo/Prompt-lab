/**
 * Centralized localStorage persistence & unified creative project store
 * for NÚCLEO COLECTIVO · Visual Prompt Lab 2.1.
 *
 * REGLA DE COMPATIBILIDAD:
 * - Todas las claves antiguas (`nc_*`) se conservan intactas.
 * - No se migran ni sobrescriben datos existentes del usuario.
 */

import type { PromptBuilderState } from '../components/PromptBuilder';
import type { BuilderCategoryId } from '../data/promptBuilderConfig';
import { GALLERY_VISUAL_ITEMS } from '../data/galleryCollectionsData';

export const STORAGE_KEYS = {
  // Legacy keys (100% preserved)
  galleryFavorites: 'nc_fav_gallery_v1',
  fichaFavorites: 'nc_fav_fichas_v1',
  savedPrompts: 'nc_fav_prompts_v1',
  promptProjects: 'nc_prompt_projects_v1',
  jsonStyles: 'nc_fav_json_styles_v1',
  jsonStylesLegacy: 'nc_fav_json_v1',
  storyboard: 'nc_storyboard_v1',
  moodboards: 'nc_moodboards_v1',
  creativeJournal: 'nc_creative_journal_v1',
  welcomeWizardSeen: 'nc_welcome_wizard_seen_v1',
  // New additive keys (Visual Prompt Lab 2.1 — non-destructive)
  lightingSetups: 'nc_lighting_setups_v1',
  unifiedProjects: 'nc_unified_projects_v1',
} as const;

export interface MoodboardReferenceItem {
  id: string;
  title: string;
  image: string;
  source: 'galeria' | 'archivo' | 'gallery' | 'upload';
  galleryId?: string;
  role: 'Composición' | 'Color' | 'Iluminación' | 'Textura' | 'Sujeto' | 'Atmósfera';
  note: string;
}

export interface SavedMoodboard {
  id: string;
  title: string;
  concept: string;
  discipline: string;
  paletteName: string;
  colors: string[];
  styles: string[];
  keywords: string[];
  references: MoodboardReferenceItem[];
  creativeSummary: string;
  generatedPrompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreativeJournalEntry {
  id: string;
  projectName: string;
  objective: string;
  discipline: string;
  originalPrompt: string;
  variations: string[];
  results: string;
  tools: string[];
  date: string;
  observations: string;
  learnings: string;
  updatedAt: string;
}

export interface LightingRigParams {
  keyAngle: number;
  keyIntensity: number;
  fillIntensity: number;
  rimEnabled: boolean;
  rimIntensity: number;
  sideEnabled: boolean;
  sideDirection: 'izquierda' | 'derecha';
  sideIntensity: number;
  topEnabled: boolean;
  topIntensity: number;
  kelvin: number;
  globalIntensity: 'low-key' | 'mid-key' | 'high-key';
  shadowQuality: 'suave' | 'media' | 'dura';
  diffuser: 'directa' | 'softbox' | 'octabox' | 'paraguas' | 'scrim-bandera' | 'ventana-natural';
}

export interface SavedLightingSetup {
  id: string;
  title: string;
  presetOrigin?: string | null;
  subjectId?: string;
  subjectLabel?: string;
  rig: LightingRigParams;
  contrastRatio: string;
  kelvinLabel: string;
  diffuserLabel: string;
  promptEs: string;
  promptEn: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectSourceModule =
  | 'builder'
  | 'gallery'
  | 'moodboard'
  | 'lighting'
  | 'film-director'
  | 'journal';

export interface ProjectPromptVersion {
  id: string;
  versionLabel: string;
  promptEs: string;
  promptEn?: string;
  source: ProjectSourceModule;
  createdAt: string;
  builderSnapshot?: Partial<PromptBuilderState>;
}

export interface ProjectVisualReference {
  id: string;
  title: string;
  image?: string;
  role?: string;
  source: ProjectSourceModule | 'upload';
  code?: string;
  note?: string;
}

export interface ProjectFilmPlanSummary {
  projectTitle: string;
  logline: string;
  narrativeArc: string;
  cameraReference: string;
  lightingScheme: string;
  colorPaletteHex: string[];
  scenesCount: number;
  scenesSummary: string[];
}

export interface UnifiedCreativeProject {
  id: string;
  title: string;
  discipline: string;
  category?: BuilderCategoryId;
  sourceModules: ProjectSourceModule[];
  initialData: {
    concept: string;
    objective: string;
    audience?: string;
    format?: string;
    notes?: string;
  };
  prompts: ProjectPromptVersion[];
  references: ProjectVisualReference[];
  palette?: {
    name: string;
    colors: string[];
  };
  lightingSetup?: SavedLightingSetup;
  filmPlan?: ProjectFilmPlanSummary;
  results: string;
  tools: string[];
  observations: string;
  learnings?: string;
  createdAt: string;
  updatedAt: string;
}

export function safeReadArray<T>(key: string, fallback: T[] = []): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function safeWriteJson(key: string, value: unknown): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function notifyWorkspaceUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nc-favorites-updated'));
  }
}

// --- Gallery Favorites ---

export function readGalleryFavorites(): string[] {
  return safeReadArray<string>(STORAGE_KEYS.galleryFavorites, []);
}

export function writeGalleryFavorites(ids: string[]): void {
  safeWriteJson(STORAGE_KEYS.galleryFavorites, ids);
  notifyWorkspaceUpdated();
}

export function saveRecreatedPromptToVault(entry: {
  title: string;
  prompt: string;
  sourceCode: string;
  platform: string;
  project?: string;
  mode?: 'photo' | 'video';
  category?: BuilderCategoryId;
  builderState?: Partial<PromptBuilderState>;
}): boolean {
  const existing = safeReadArray<Record<string, unknown>>(STORAGE_KEYS.savedPrompts, []);
  const item = {
    id: `recreate-${Date.now()}`,
    title: entry.title,
    projectName: entry.project || 'Recreaciones de Galería',
    createdAt: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
    mode: entry.mode || 'photo',
    category: entry.category || (entry.mode === 'video' ? 'video' : 'photo'),
    promptText: entry.prompt,
    sourceCode: entry.sourceCode,
    platform: entry.platform,
    ...(entry.builderState ? { state: entry.builderState } : {}),
  };
  const ok = safeWriteJson(STORAGE_KEYS.savedPrompts, [item, ...existing]);
  if (ok) notifyWorkspaceUpdated();
  return ok;
}

// --- Moodboards ---

export function readMoodboards(): SavedMoodboard[] {
  return safeReadArray<SavedMoodboard>(STORAGE_KEYS.moodboards, []);
}

export function saveMoodboard(board: SavedMoodboard): SavedMoodboard[] {
  const existing = readMoodboards();
  const idx = existing.findIndex((b) => b.id === board.id);
  const next =
    idx >= 0
      ? existing.map((b, i) => (i === idx ? board : b))
      : [board, ...existing];
  safeWriteJson(STORAGE_KEYS.moodboards, next);
  notifyWorkspaceUpdated();
  return next;
}

export function deleteMoodboard(id: string): SavedMoodboard[] {
  const next = readMoodboards().filter((b) => b.id !== id);
  safeWriteJson(STORAGE_KEYS.moodboards, next);
  notifyWorkspaceUpdated();
  return next;
}

function mapMoodboardDisciplineToCategory(discipline: string): BuilderCategoryId {
  const norm = discipline.toLowerCase();
  if (norm.includes('cine') || norm.includes('video')) return 'video';
  if (norm.includes('gráfico') || norm.includes('editorial') || norm.includes('cartel')) return 'graphic';
  if (norm.includes('producto') || norm.includes('branding') || norm.includes('publicidad')) return 'branding';
  if (norm.includes('ilustr')) return 'illustration';
  if (norm.includes('arquitect') || norm.includes('espacio')) return 'architecture';
  if (norm.includes('web') || norm.includes('ui')) return 'web-ui';
  if (norm.includes('experimental') || norm.includes('3d') || norm.includes('arte')) return 'experimental';
  return 'photo';
}

/**
 * Construye un patch completo para PromptBuilder a partir de un Moodboard,
 * rescatando especificaciones ópticas/lumínicas/materiales de las láminas de Galería vinculadas.
 */
export function buildMoodboardBuilderPatch(
  board: Pick<
    SavedMoodboard,
    'title' | 'concept' | 'discipline' | 'paletteName' | 'colors' | 'styles' | 'keywords' | 'references'
  >
): Partial<PromptBuilderState> {
  const category = mapMoodboardDisciplineToCategory(board.discipline);
  const isVideo = category === 'video';

  const findRefByRole = (role: MoodboardReferenceItem['role']) =>
    board.references.find((r) => r.role === role);

  const findGalleryForRef = (ref?: MoodboardReferenceItem) => {
    if (!ref?.galleryId) return undefined;
    return GALLERY_VISUAL_ITEMS.find((g) => g.id === ref.galleryId);
  };

  const lightingRef = findRefByRole('Iluminación');
  const compositionRef = findRefByRole('Composición');
  const textureRef = findRefByRole('Textura');
  const subjectRef = findRefByRole('Sujeto');
  const atmosphereRef = findRefByRole('Atmósfera');
  const primaryGallery =
    findGalleryForRef(subjectRef) ||
    findGalleryForRef(compositionRef) ||
    findGalleryForRef(lightingRef) ||
    findGalleryForRef(board.references[0]);

  const lightingGallery = findGalleryForRef(lightingRef);
  const compositionGallery = findGalleryForRef(compositionRef);
  const textureGallery = findGalleryForRef(textureRef);
  const atmosphereGallery = findGalleryForRef(atmosphereRef);

  const patch: Partial<PromptBuilderState> = {
    mode: isVideo ? 'video' : 'photo',
    category,
    subject:
      board.concept.trim() ||
      subjectRef?.note?.trim() ||
      `${board.title.trim()} (${board.discipline})`,
    setting: atmosphereRef?.note?.trim() || primaryGallery?.description,
    visualStyle: board.styles.join(', ') || primaryGallery?.style || 'Editorial Contemporáneo',
    colorPalette: `${board.paletteName} (${board.colors.join(', ')})`,
    lighting: lightingRef?.note?.trim() || lightingGallery?.specs.lighting,
    composition: compositionRef?.note?.trim() || compositionGallery?.specs.composition,
    texture: textureRef?.note?.trim() || textureGallery?.specs.texture,
    materials: textureRef?.note?.trim() || textureGallery?.specs.texture,
    atmosphere:
      [atmosphereRef?.note?.trim(), atmosphereGallery?.specs.atmosphere, ...board.keywords]
        .filter(Boolean)
        .join(', ') || undefined,
    camera: primaryGallery?.specs.camera,
    lens: primaryGallery?.specs.lens,
    aperture: primaryGallery?.specs.aperture,
    aspectRatio: primaryGallery?.aspectRatio,
    customNotes: `Moodboard · ${board.title} (${board.references.length} refs · ${board.colors.join(', ')})`,
  };

  // Strip undefined properties so existing builder state fields are preserved cleanly
  return Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined && v !== '')
  ) as Partial<PromptBuilderState>;
}

// --- Saved Lighting Setups ---

export function readLightingSetups(): SavedLightingSetup[] {
  return safeReadArray<SavedLightingSetup>(STORAGE_KEYS.lightingSetups, []);
}

export function saveLightingSetup(setup: SavedLightingSetup): SavedLightingSetup[] {
  const existing = readLightingSetups();
  const idx = existing.findIndex((s) => s.id === setup.id);
  const next =
    idx >= 0
      ? existing.map((s, i) => (i === idx ? setup : s))
      : [setup, ...existing];
  safeWriteJson(STORAGE_KEYS.lightingSetups, next);
  notifyWorkspaceUpdated();
  return next;
}

export function deleteLightingSetup(id: string): SavedLightingSetup[] {
  const next = readLightingSetups().filter((s) => s.id !== id);
  safeWriteJson(STORAGE_KEYS.lightingSetups, next);
  notifyWorkspaceUpdated();
  return next;
}

export function buildLightingBuilderPatch(
  setup: Pick<
    SavedLightingSetup,
    'title' | 'rig' | 'contrastRatio' | 'kelvinLabel' | 'diffuserLabel' | 'promptEs' | 'promptEn' | 'subjectLabel'
  >,
  lang: 'es' | 'en' = 'es'
): Partial<PromptBuilderState> {
  const promptValue = lang === 'en' ? setup.promptEn : setup.promptEs;
  const atmosphereByKey =
    setup.rig.globalIntensity === 'low-key'
      ? `Atmósfera dramática low-key (${setup.contrastRatio}), sombras ${setup.rig.shadowQuality}s`
      : setup.rig.globalIntensity === 'high-key'
      ? `Atmósfera luminosa high-key (${setup.contrastRatio}), difusión ${setup.diffuserLabel}`
      : `Atmósfera equilibrada mid-key (${setup.contrastRatio}), sombras ${setup.rig.shadowQuality}s`;

  const colorHint =
    setup.rig.kelvin <= 3500
      ? `Dominante cálida ${setup.rig.kelvin}K (${setup.kelvinLabel}) con acentos ámbar`
      : setup.rig.kelvin >= 6200
      ? `Dominante fría ${setup.rig.kelvin}K (${setup.kelvinLabel}) con sombras azuladas`
      : `Balance neutro ${setup.rig.kelvin}K (${setup.kelvinLabel})`;

  return {
    lighting: promptValue,
    temperature: `${setup.kelvinLabel} (${setup.rig.kelvin}K)`,
    colorPalette: colorHint,
    atmosphere: atmosphereByKey,
    customNotes: `Simulador de Iluminación · ${setup.title} · Key ${setup.rig.keyAngle}° (${setup.rig.keyIntensity}%) / Fill ${setup.rig.fillIntensity}% / ${setup.diffuserLabel}`,
  };
}

export function formatLightingSetupTxt(setup: SavedLightingSetup): string {
  return [
    '========================================================',
    'NÚCLEO COLECTIVO · CONFIGURACIÓN DE ILUMINACIÓN',
    '========================================================',
    `NOMBRE:          ${setup.title}`,
    `ORIGEN:          ${setup.presetOrigin || 'Personalizado'}`,
    `SUJETO BASE:     ${setup.subjectLabel || 'Estudio general'}`,
    `RATIO CONTRASTE: ${setup.contrastRatio}`,
    `TEMPERATURA:     ${setup.rig.kelvin}K (${setup.kelvinLabel})`,
    `DIFUSOR:         ${setup.diffuserLabel}`,
    `CLAVE / SOMBRAS: ${setup.rig.globalIntensity.toUpperCase()} · Sombras ${setup.rig.shadowQuality}s`,
    `KEY LIGHT:       ${setup.rig.keyAngle}° · ${setup.rig.keyIntensity}%`,
    `FILL LIGHT:      ${setup.rig.fillIntensity}%`,
    `RIM (CONTRALUZ): ${setup.rig.rimEnabled ? `${setup.rig.rimIntensity}%` : 'Apagada'}`,
    `LATERAL:         ${setup.rig.sideEnabled ? `${setup.rig.sideDirection} (${setup.rig.sideIntensity}%)` : 'Apagada'}`,
    `CENITAL:         ${setup.rig.topEnabled ? `${setup.rig.topIntensity}%` : 'Apagada'}`,
    '',
    '--- PROMPT DE ILUMINACIÓN (ES) ---',
    setup.promptEs,
    '',
    '--- LIGHTING PROMPT (EN) ---',
    setup.promptEn,
    ...(setup.notes ? ['', '--- NOTAS ---', setup.notes] : []),
  ].join('\n');
}

// --- Creative Journal ---

export function readCreativeJournal(): CreativeJournalEntry[] {
  return safeReadArray<CreativeJournalEntry>(STORAGE_KEYS.creativeJournal, []);
}

export function saveJournalEntry(entry: CreativeJournalEntry): CreativeJournalEntry[] {
  const existing = readCreativeJournal();
  const idx = existing.findIndex((e) => e.id === entry.id);
  const next =
    idx >= 0
      ? existing.map((e, i) => (i === idx ? entry : e))
      : [entry, ...existing];
  safeWriteJson(STORAGE_KEYS.creativeJournal, next);
  notifyWorkspaceUpdated();
  return next;
}

export function deleteJournalEntry(id: string): CreativeJournalEntry[] {
  const next = readCreativeJournal().filter((e) => e.id !== id);
  safeWriteJson(STORAGE_KEYS.creativeJournal, next);
  notifyWorkspaceUpdated();
  return next;
}

// --- Unified Creative Projects (Common Project Model across all 6 labs) ---

export function readUnifiedProjects(): UnifiedCreativeProject[] {
  return safeReadArray<UnifiedCreativeProject>(STORAGE_KEYS.unifiedProjects, []);
}

export function saveUnifiedProject(project: UnifiedCreativeProject): UnifiedCreativeProject[] {
  const existing = readUnifiedProjects();
  const idx = existing.findIndex((p) => p.id === project.id);
  const normalized: UnifiedCreativeProject = {
    ...project,
    sourceModules: Array.from(new Set(project.sourceModules)),
    tools: Array.from(new Set(project.tools.filter(Boolean))),
    updatedAt: new Date().toISOString(),
  };
  const next =
    idx >= 0
      ? existing.map((p, i) => (i === idx ? normalized : p))
      : [normalized, ...existing];
  safeWriteJson(STORAGE_KEYS.unifiedProjects, next);
  notifyWorkspaceUpdated();
  return next;
}

export function appendPromptVersionToProject(
  projectId: string,
  version: Omit<ProjectPromptVersion, 'id' | 'versionLabel' | 'createdAt'>
): UnifiedCreativeProject[] {
  const existing = readUnifiedProjects();
  const target = existing.find((p) => p.id === projectId);
  if (!target) return existing;

  const nextVersionNumber = target.prompts.length + 1;
  const newVersion: ProjectPromptVersion = {
    ...version,
    id: `pv-${Date.now()}`,
    versionLabel: `v${nextVersionNumber}`,
    createdAt: new Date().toISOString(),
  };

  const updated: UnifiedCreativeProject = {
    ...target,
    sourceModules: Array.from(new Set([...target.sourceModules, version.source])),
    prompts: [...target.prompts, newVersion],
    updatedAt: new Date().toISOString(),
  };

  return saveUnifiedProject(updated);
}

export function deleteUnifiedProject(id: string): UnifiedCreativeProject[] {
  const next = readUnifiedProjects().filter((p) => p.id !== id);
  safeWriteJson(STORAGE_KEYS.unifiedProjects, next);
  notifyWorkspaceUpdated();
  return next;
}

export function formatUnifiedProjectTxt(project: UnifiedCreativeProject): string {
  return [
    '========================================================',
    'NÚCLEO COLECTIVO · PROYECTO CREATIVO UNIFICADO (V2.1)',
    '========================================================',
    `PROYECTO:     ${project.title}`,
    `DISCIPLINA:   ${project.discipline}`,
    `MÓDULOS:      ${project.sourceModules.join(', ')}`,
    `HERRAMIENTAS: ${project.tools.join(', ') || 'Sin especificar'}`,
    `ACTUALIZADO:  ${project.updatedAt}`,
    '',
    '--- DATOS INICIALES ---',
    `Concepto: ${project.initialData.concept || '—'}`,
    `Objetivo: ${project.initialData.objective || '—'}`,
    ...(project.initialData.format ? [`Formato:  ${project.initialData.format}`] : []),
    ...(project.initialData.notes ? [`Notas:    ${project.initialData.notes}`] : []),
    '',
    `--- PROMPTS Y VERSIONES (${project.prompts.length}) ---`,
    ...project.prompts.flatMap((pv) => [
      `[${pv.versionLabel} · ${pv.source}] ${pv.promptEs}`,
      ...(pv.promptEn ? [`   (EN) ${pv.promptEn}`] : []),
    ]),
    '',
    `--- REFERENCIAS VISUALES (${project.references.length}) ---`,
    ...(project.references.length > 0
      ? project.references.map(
          (r, i) => `  ${i + 1}. ${r.title}${r.role ? ` [${r.role}]` : ''}${r.note ? ` — ${r.note}` : ''}`
        )
      : ['  (Sin referencias vinculadas)']),
    ...(project.palette
      ? ['', `--- PALETA CROMÁTICA ---`, `${project.palette.name}: ${project.palette.colors.join(', ')}`]
      : []),
    ...(project.lightingSetup
      ? [
          '',
          '--- ILUMINACIÓN VINCULADA ---',
          `${project.lightingSetup.title} (${setupSummary(project.lightingSetup)})`,
          project.lightingSetup.promptEs,
        ]
      : []),
    ...(project.filmPlan
      ? [
          '',
          '--- PLAN AUDIOVISUAL ---',
          `Logline: ${project.filmPlan.logline}`,
          `Arco:    ${project.filmPlan.narrativeArc}`,
          `Cámara:  ${project.filmPlan.cameraReference}`,
          ...project.filmPlan.scenesSummary.map((s) => `  - ${s}`),
        ]
      : []),
    '',
    '--- RESULTADOS Y OBSERVACIONES ---',
    `Resultados:    ${project.results || '—'}`,
    `Observaciones: ${project.observations || '—'}`,
    ...(project.learnings ? [`Aprendizajes:  ${project.learnings}`] : []),
  ].join('\n');
}

function setupSummary(s: SavedLightingSetup): string {
  return `Key ${s.rig.keyAngle}°/${s.rig.keyIntensity}% · Fill ${s.rig.fillIntensity}% · ${s.rig.kelvin}K · ${s.contrastRatio}`;
}

// --- Aggregate Workspace Summary (used by Header badges, etc.) ---

export interface WorkspaceSummary {
  galleryCount: number;
  fichasCount: number;
  promptsCount: number;
  jsonStylesCount: number;
  moodboardsCount: number;
  lightingSetupsCount: number;
  unifiedProjectsCount: number;
  journalCount: number;
  favoritesTotal: number;
}

export function getWorkspaceSummary(galleryFavoritesOverride?: string[]): WorkspaceSummary {
  const galleryCount = galleryFavoritesOverride
    ? galleryFavoritesOverride.length
    : readGalleryFavorites().length;
  const fichasCount = safeReadArray(STORAGE_KEYS.fichaFavorites).length;
  const promptsCount = safeReadArray(STORAGE_KEYS.savedPrompts).length;
  const jsonPrimary = safeReadArray(STORAGE_KEYS.jsonStyles);
  const jsonStylesCount =
    jsonPrimary.length > 0 ? jsonPrimary.length : safeReadArray(STORAGE_KEYS.jsonStylesLegacy).length;
  const moodboardsCount = readMoodboards().length;
  const lightingSetupsCount = readLightingSetups().length;
  const unifiedProjectsCount = readUnifiedProjects().length;
  const journalCount = readCreativeJournal().length;

  return {
    galleryCount,
    fichasCount,
    promptsCount,
    jsonStylesCount,
    moodboardsCount,
    lightingSetupsCount,
    unifiedProjectsCount,
    journalCount,
    favoritesTotal:
      galleryCount +
      fichasCount +
      promptsCount +
      jsonStylesCount +
      moodboardsCount +
      lightingSetupsCount +
      unifiedProjectsCount +
      journalCount,
  };
}
