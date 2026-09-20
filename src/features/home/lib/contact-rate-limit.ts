export const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;

interface RateBucket {
  count: number;
  resetAt: number;
}

export interface ContactRateLimitResult {
  limited: boolean;
  message: string | null;
  attemptCount: number;
  maxRequests: number;
  windowMs: number;
  resetAt: number | null;
  remainingMs: number | null;
}

const buckets = new Map<string, RateBucket>();

export function getClientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for');

  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }

  return headers.get('x-real-ip')?.trim() || 'unknown';
}

export function consumeContactRateLimit(key: string): ContactRateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + CONTACT_RATE_LIMIT_WINDOW_MS;
    buckets.set(key, { count: 1, resetAt });
    return {
      limited: false,
      message: null,
      attemptCount: 1,
      maxRequests: CONTACT_RATE_LIMIT_MAX_REQUESTS,
      windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
      resetAt,
      remainingMs: CONTACT_RATE_LIMIT_WINDOW_MS,
    };
  }

  if (existing.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    const remainingMs = Math.max(0, existing.resetAt - now);
    const minutes = Math.max(1, Math.ceil(remainingMs / 60000));

    return {
      limited: true,
      message: `Too many messages. Try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`,
      attemptCount: existing.count,
      maxRequests: CONTACT_RATE_LIMIT_MAX_REQUESTS,
      windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
      resetAt: existing.resetAt,
      remainingMs,
    };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return {
    limited: false,
    message: null,
    attemptCount: existing.count,
    maxRequests: CONTACT_RATE_LIMIT_MAX_REQUESTS,
    windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
    resetAt: existing.resetAt,
    remainingMs: Math.max(0, existing.resetAt - now),
  };
}
