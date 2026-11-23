/**
 * Single source of truth for verified Núcleo Colectivo · Visual Prompt Lab metrics.
 * Avoids duplicated or mismatched counts across Hero, Home, Header, Footer, and Vault.
 */
export const PLATFORM_METRICS = {
  galleryPlates: 40,
  galleryCollections: 8,
  disciplines: 8,
  labsCount: 10,
  experiences: 26,
  expressChallenges: 10,
  openExperiments: 8,
  modules: 26,
  fichas: 130,
  tutorials: 12,
  recipes: 12,
  commands: 47,
  aiTools: 31,
  ethicsSimulators: 6,
  ethicsTalks: 20,
  documentaries: 31,
  fictionMovies: 20,
} as const;
