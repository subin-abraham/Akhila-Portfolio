export const ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const ADMIN_LOGIN_RATE_LIMIT_MAX_REQUESTS = 10;
export const ADMIN_LOGIN_MAX_FAILED_ATTEMPTS = 3;
export const ADMIN_LOGIN_LOCKOUT_MS = 10 * 60 * 1000;

interface RateBucket {
  count: number;
  resetAt: number;
}

interface LockoutBucket {
  failures: number;
  lockedUntil: number | null;
}

export interface AdminLoginRateLimitResult {
  limited: boolean;
  message: string | null;
}

export interface AdminLoginLockoutResult {
  locked: boolean;
  message: string | null;
  failures: number;
  remainingMs: number | null;
}

const rateBuckets = new Map<string, RateBucket>();
const lockoutBuckets = new Map<string, LockoutBucket>();

function formatMinutes(remainingMs: number) {
  const minutes = Math.max(1, Math.ceil(remainingMs / 60000));
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

export function buildAdminLoginKeys(ipAddress: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return {
    ipKey: `admin-login:ip:${ipAddress}`,
    emailKey: normalizedEmail ? `admin-login:email:${normalizedEmail}` : null,
  };
}

export function consumeAdminLoginRateLimit(key: string): AdminLoginRateLimitResult {
  const now = Date.now();
  const existing = rateBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, {
      count: 1,
      resetAt: now + ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
    });
    return { limited: false, message: null };
  }

  if (existing.count >= ADMIN_LOGIN_RATE_LIMIT_MAX_REQUESTS) {
    const remainingMs = Math.max(0, existing.resetAt - now);
    return {
      limited: true,
      message: `Too many sign-in attempts. Try again in about ${formatMinutes(remainingMs)}.`,
    };
  }

  existing.count += 1;
  rateBuckets.set(key, existing);
  return { limited: false, message: null };
}

export function getAdminLoginLockout(key: string): AdminLoginLockoutResult {
  const now = Date.now();
  const existing = lockoutBuckets.get(key);

  if (!existing) {
    return { locked: false, message: null, failures: 0, remainingMs: null };
  }

  if (existing.lockedUntil !== null && existing.lockedUntil > now) {
    const remainingMs = existing.lockedUntil - now;
    return {
      locked: true,
      message: `Too many failed sign-in attempts. Try again in about ${formatMinutes(remainingMs)}.`,
      failures: existing.failures,
      remainingMs,
    };
  }

  if (existing.lockedUntil !== null && existing.lockedUntil <= now) {
    lockoutBuckets.delete(key);
    return { locked: false, message: null, failures: 0, remainingMs: null };
  }

  return {
    locked: false,
    message: null,
    failures: existing.failures,
    remainingMs: null,
  };
}

export function recordAdminLoginFailure(key: string): AdminLoginLockoutResult {
  const now = Date.now();
  const current = getAdminLoginLockout(key);

  if (current.locked) {
    return current;
  }

  const failures = current.failures + 1;

  if (failures >= ADMIN_LOGIN_MAX_FAILED_ATTEMPTS) {
    const lockedUntil = now + ADMIN_LOGIN_LOCKOUT_MS;
    lockoutBuckets.set(key, { failures, lockedUntil });
    return {
      locked: true,
      message: `Too many failed sign-in attempts. Try again in about ${formatMinutes(ADMIN_LOGIN_LOCKOUT_MS)}.`,
      failures,
      remainingMs: ADMIN_LOGIN_LOCKOUT_MS,
    };
  }

  lockoutBuckets.set(key, { failures, lockedUntil: null });
  return {
    locked: false,
    message: null,
    failures,
    remainingMs: null,
  };
}

export function clearAdminLoginFailures(key: string) {
  lockoutBuckets.delete(key);
}
