type RateLimitBucket = {
  attempts: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function isRateLimited(key: string) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { attempts: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  existing.attempts += 1;
  buckets.set(key, existing);

  return existing.attempts > MAX_ATTEMPTS;
}

