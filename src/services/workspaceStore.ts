/**
 * Unified non-destructive persistence layer over nc_* localStorage keys.
 * Preserves 100% compatibility with previously saved user data in browsers
 * and adds typed storage for Moodboards (Fase 4) and Bitácora Creativa (Fase 5).
 */

export const STORAGE_KEYS = {
  galleryFavorites: 'nc_fav_gallery_v1',
  libraryFichasFavorites: 'nc_fav_fichas_v1',
  savedPrompts: 'nc_fav_prompts_v1',
  promptProjects: 'nc_prompt_projects_v1',
  jsonStyles: 'nc_fav_json_styles_v1',
  jsonStylesLegacy: 'nc_fav_json_v1',
  storyboard: 'nc_storyboard_v1',
  challenges: 'nc_challenges_v1',
  galleryNotes: 'nc_gallery_notes_v1',
  welcomeWizardSeen: 'nc_welcome_wizard_seen_v1',
  ethicsProgress: 'nc_etica_ia_progress_v1',
  expCompletedLabs: 'nc_exp_completed_labs_v1',
  expCompletedExpress: 'nc_exp_completed_express_v1',
  resourcesDrills: 'nc_resources_drills_completed_v1',
  resourcesTutorials: 'nc_resources_tutorials_done_v1',
  moodboards: 'nc_moodboards_v1',
  creativeJournal: 'nc_creative_journal_v1',
} as const;

export interface MoodboardReferenceItem {
  id: string;
  title: string;
  image: string;
  role: 'Composición' | 'Iluminación' | 'Color' | 'Textura' | 'Sujeto' | 'Atmósfera';
  note: string;
  source: 'galeria' | 'archivo';
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

export interface WorkspaceSummary {
  favoritesTotal: number;
  galleryFavoritesCount: number;
  savedPromptsCount: number;
  libraryFichasCount: number;
  jsonStylesCount: number;
  storyboardScenesCount: number;
  moodboardsCount: number;
  journalEntriesCount: number;
  completedActivitiesCount: number;
}

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('nc-favorites-updated'));
    return true;
  } catch {
    return false;
  }
}

export function safeArrayLength(key: string): number {
  const val = safeReadJson<unknown>(key, []);
  return Array.isArray(val) ? val.length : 0;
}

export function readGalleryFavorites(): string[] {
  const parsed = safeReadJson<unknown>(STORAGE_KEYS.galleryFavorites, []);
  return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
}

export function writeGalleryFavorites(ids: string[]): void {
  safeWriteJson(STORAGE_KEYS.galleryFavorites, ids);
}

export function readMoodboards(): SavedMoodboard[] {
  const parsed = safeReadJson<unknown>(STORAGE_KEYS.moodboards, []);
  return Array.isArray(parsed) ? (parsed as SavedMoodboard[]) : [];
}

export function saveMoodboard(board: SavedMoodboard): SavedMoodboard[] {
  const existing = readMoodboards();
  const idx = existing.findIndex((b) => b.id === board.id);
  const next =
    idx >= 0
      ? existing.map((b, i) => (i === idx ? board : b))
      : [board, ...existing].slice(0, 40);
  safeWriteJson(STORAGE_KEYS.moodboards, next);
  return next;
}

export function deleteMoodboard(id: string): SavedMoodboard[] {
  const next = readMoodboards().filter((b) => b.id !== id);
  safeWriteJson(STORAGE_KEYS.moodboards, next);
  return next;
}

export function readCreativeJournal(): CreativeJournalEntry[] {
  const parsed = safeReadJson<unknown>(STORAGE_KEYS.creativeJournal, []);
  return Array.isArray(parsed) ? (parsed as CreativeJournalEntry[]) : [];
}

export function saveJournalEntry(entry: CreativeJournalEntry): CreativeJournalEntry[] {
  const existing = readCreativeJournal();
  const idx = existing.findIndex((e) => e.id === entry.id);
  const next =
    idx >= 0
      ? existing.map((e, i) => (i === idx ? entry : e))
      : [entry, ...existing].slice(0, 100);
  safeWriteJson(STORAGE_KEYS.creativeJournal, next);
  return next;
}

export function deleteJournalEntry(id: string): CreativeJournalEntry[] {
  const next = readCreativeJournal().filter((e) => e.id !== id);
  safeWriteJson(STORAGE_KEYS.creativeJournal, next);
  return next;
}

export function saveRecreatedPromptToVault(entry: {
  title: string;
  prompt: string;
  sourceCode: string;
  platform: string;
  project?: string;
}): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existing = safeReadJson<Array<Record<string, unknown>>>(STORAGE_KEYS.savedPrompts, []);
    const nextItem = {
      id: `recreate-${Date.now()}`,
      title: entry.title,
      projectName: entry.project || 'Recreaciones de Galería',
      mode: 'photo',
      promptText: entry.prompt,
      createdAt: new Date().toISOString(),
      source: `${entry.sourceCode} · ${entry.platform}`,
    };
    const nextList = [nextItem, ...(Array.isArray(existing) ? existing : [])].slice(0, 120);
    return safeWriteJson(STORAGE_KEYS.savedPrompts, nextList);
  } catch {
    return false;
  }
}

export function getWorkspaceSummary(galleryFavoritesOverride?: string[]): WorkspaceSummary {
  const galleryFavoritesCount = galleryFavoritesOverride
    ? galleryFavoritesOverride.length
    : safeArrayLength(STORAGE_KEYS.galleryFavorites);
  const libraryFichasCount = safeArrayLength(STORAGE_KEYS.libraryFichasFavorites);
  const savedPromptsCount = safeArrayLength(STORAGE_KEYS.savedPrompts);
  const jsonStylesCount =
    safeArrayLength(STORAGE_KEYS.jsonStyles) || safeArrayLength(STORAGE_KEYS.jsonStylesLegacy);
  const storyboardScenesCount = safeArrayLength(STORAGE_KEYS.storyboard);
  const moodboardsCount = safeArrayLength(STORAGE_KEYS.moodboards);
  const journalEntriesCount = safeArrayLength(STORAGE_KEYS.creativeJournal);

  const completedActivitiesCount =
    safeArrayLength(STORAGE_KEYS.expCompletedLabs) +
    safeArrayLength(STORAGE_KEYS.expCompletedExpress) +
    safeArrayLength(STORAGE_KEYS.resourcesTutorials) +
    safeArrayLength(STORAGE_KEYS.resourcesDrills) +
    safeArrayLength(STORAGE_KEYS.ethicsProgress);

  return {
    favoritesTotal:
      galleryFavoritesCount +
      libraryFichasCount +
      savedPromptsCount +
      jsonStylesCount +
      moodboardsCount +
      journalEntriesCount,
    galleryFavoritesCount,
    savedPromptsCount,
    libraryFichasCount,
    jsonStylesCount,
    storyboardScenesCount,
    moodboardsCount,
    journalEntriesCount,
    completedActivitiesCount,
  };
}
