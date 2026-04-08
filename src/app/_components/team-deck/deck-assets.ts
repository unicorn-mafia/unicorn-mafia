/**
 * Static files under /public/team-deck are cached aggressively by browsers and CDNs.
 * Bump `TEAM_DECK_ASSET_VERSION` (or set NEXT_PUBLIC_TEAM_DECK_ASSET_VERSION) after replacing images.
 */
export const TEAM_DECK_ASSET_VERSION =
  process.env.NEXT_PUBLIC_TEAM_DECK_ASSET_VERSION ?? "8";

export function teamDeckUrl(path: string): string {
  if (!path.startsWith("/team-deck/")) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${TEAM_DECK_ASSET_VERSION}`;
}
