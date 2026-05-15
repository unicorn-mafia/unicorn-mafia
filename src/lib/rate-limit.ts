/**
 * Simple in-memory token-bucket rate limiter.
 * 5 requests per IP per 60 s by default.
 *
 * Works well for a single Vercel instance; swap for Upstash Ratelimit if you
 * need cross-instance enforcement at scale.
 */

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { count: 0, windowStart: now };

  if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    bucket.count = 0;
    bucket.windowStart = now;
  }

  bucket.count += 1;
  buckets.set(ip, bucket);

  // Prune old entries to avoid memory growth on long-running instances
  if (buckets.size > 5_000) {
    for (const [key, val] of buckets) {
      if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) buckets.delete(key);
    }
  }

  return bucket.count > RATE_LIMIT_MAX;
}

export function getIp(req: Request): string {
  return (
    (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip")) ||
    "unknown"
  );
}
