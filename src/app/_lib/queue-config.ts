export const WAITLIST_COUNT_FALLBACK = 247;
export const QUEUE_CAP = 200;

export function mapCountToVisual(count: number): number {
  if (count <= 0) return 1;
  if (count < 50) return count;
  if (count < 500) return Math.ceil(count / 5);
  if (count < 5000) return Math.ceil(count / 25);
  return QUEUE_CAP;
}
