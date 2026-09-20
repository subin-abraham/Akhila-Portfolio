import { createHmac, randomInt, timingSafeEqual } from 'crypto';

import type { MathChallengePublic } from '@/types/components/contact-section';

const MIN_SOLVE_MS = 1500;
const MAX_AGE_MS = 30 * 60 * 1000;

function getChallengeSecret() {
  return (
    process.env.CONTACT_CHALLENGE_SECRET ??
    process.env.RESEND_API_KEY ??
    'dev-contact-challenge-secret'
  );
}

function sign(payload: string) {
  return createHmac('sha256', getChallengeSecret()).update(payload).digest('hex');
}

function safeEqualHex(left: string, right: string) {
  const leftBuffer = Buffer.from(left, 'utf8');
  const rightBuffer = Buffer.from(right, 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createMathChallenge(): MathChallengePublic {
  const useAddition = randomInt(0, 2) === 0;
  let left = randomInt(0, 10);
  let right = randomInt(0, 10);

  if (!useAddition && left < right) {
    const swap = left;
    left = right;
    right = swap;
  }

  const operator = useAddition ? '+' : '-';
  const answer = useAddition ? left + right : left - right;
  const issuedAt = Date.now();
  const payload = `${left}|${operator}|${right}|${answer}|${issuedAt}`;
  const token = Buffer.from(`${payload}|${sign(payload)}`).toString('base64url');

  return {
    question: `What is ${left} ${operator} ${right}?`,
    token,
  };
}

export function verifyMathChallenge(
  token: string,
  answerRaw: string
): string | null {
  if (!token) {
    return 'Complete the math check and try again.';
  }

  let decoded: string;

  try {
    decoded = Buffer.from(token, 'base64url').toString('utf8');
  } catch {
    return 'Math check expired. Refresh and try again.';
  }

  const parts = decoded.split('|');

  if (parts.length !== 6) {
    return 'Math check expired. Refresh and try again.';
  }

  const [left, operator, right, expectedRaw, issuedAtRaw, signature] = parts;

  if (
    !left ||
    !operator ||
    !right ||
    !expectedRaw ||
    !issuedAtRaw ||
    !signature
  ) {
    return 'Math check expired. Refresh and try again.';
  }

  const payload = `${left}|${operator}|${right}|${expectedRaw}|${issuedAtRaw}`;

  if (!safeEqualHex(sign(payload), signature)) {
    return 'Math check expired. Refresh and try again.';
  }

  const issuedAt = Number.parseInt(issuedAtRaw, 10);

  if (!Number.isFinite(issuedAt)) {
    return 'Math check expired. Refresh and try again.';
  }

  const ageMs = Date.now() - issuedAt;

  if (ageMs < MIN_SOLVE_MS) {
    return 'Please take a moment and try again.';
  }

  if (ageMs > MAX_AGE_MS) {
    return 'Math check expired. Refresh and try again.';
  }

  const expected = Number.parseInt(expectedRaw, 10);
  const provided = Number.parseInt(answerRaw.trim(), 10);

  if (!Number.isFinite(provided) || provided !== expected) {
    return 'Incorrect answer to the math check.';
  }

  return null;
}
