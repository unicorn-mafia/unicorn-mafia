/**
 * Brand colour palette — single source of truth.
 * Import these wherever you need UM brand colours rather than hardcoding hex strings.
 */

export const BRAND_COLOURS = {
  purple: "#B307EB",
  blue: "#3198F1",
  green: "#0aab6e",
  red: "#EE1701",
  gold: "#FFD700",
  cyan: "#4EF9BD",
} as const;

/** Colours used for news/content categories */
export const CATEGORY_COLOURS: Record<string, string> = {
  launches: BRAND_COLOURS.blue,
  product: BRAND_COLOURS.purple,
  hackathon_wins: BRAND_COLOURS.green,
};
