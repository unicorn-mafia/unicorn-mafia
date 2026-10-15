export const WAITLIST_COUNT_FALLBACK = 200;
export const QUEUE_CAP = 200;

export function mapCountToVisual(count: number): number {
  if (count <= 0) return 1;
  if (count < 50) return count;
  // Continuous at 50: starts at 49, reaches 100 at count=500
  if (count < 500) return Math.ceil(49 + ((count - 50) * 51) / 450);
  // Continuous at 500: starts at 100, reaches QUEUE_CAP at count=5000
  if (count < 5000) return Math.ceil(100 + ((count - 500) * 100) / 4500);
  return QUEUE_CAP;
}
