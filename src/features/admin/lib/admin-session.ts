import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'admin_session_bound';
export const ADMIN_SESSION_MAX_MS = 8 * 60 * 60 * 1000;
export const ADMIN_SESSION_MAX_SECONDS = Math.floor(ADMIN_SESSION_MAX_MS / 1000);

function getSessionSecret() {
  return (
    process.env.CONTACT_CHALLENGE_SECRET ??
    process.env.NEXT_SUPABASE_SECRET_KEY ??
    'dev-admin-session-secret'
  );
}

function sign(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
}

function safeEqualHex(left: string, right: string) {
  const leftBuffer = Buffer.from(left, 'utf8');
  const rightBuffer = Buffer.from(right, 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionToken(issuedAt = Date.now()) {
  const payload = String(issuedAt);
  return Buffer.from(`${payload}.${sign(payload)}`).toString('base64url');
}

export function isAdminSessionTokenValid(token: string | undefined | null) {
  if (!token) {
    return false;
  }

  let decoded: string;

  try {
    decoded = Buffer.from(token, 'base64url').toString('utf8');
  } catch {
    return false;
  }

  const separatorIndex = decoded.lastIndexOf('.');

  if (separatorIndex <= 0) {
    return false;
  }

  const issuedAtRaw = decoded.slice(0, separatorIndex);
  const signature = decoded.slice(separatorIndex + 1);

  if (!issuedAtRaw || !signature || !safeEqualHex(sign(issuedAtRaw), signature)) {
    return false;
  }

  const issuedAt = Number.parseInt(issuedAtRaw, 10);

  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  const ageMs = Date.now() - issuedAt;

  if (ageMs < 0 || ageMs > ADMIN_SESSION_MAX_MS) {
    return false;
  }

  return true;
}

export function getAdminSessionCookieOptions(maxAgeSeconds = ADMIN_SESSION_MAX_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}
