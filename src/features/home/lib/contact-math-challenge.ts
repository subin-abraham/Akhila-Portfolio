import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from 'crypto';

import type { MathChallengePublic } from '@/types/components/contact-section';

const MIN_SOLVE_MS = 1500;
const MAX_AGE_MS = 30 * 60 * 1000;
const CAPTCHA_WIDTH = 168;
const CAPTCHA_HEIGHT = 44;

function getChallengeSecret() {
  return (
    process.env.CONTACT_CHALLENGE_SECRET ??
    process.env.RESEND_API_KEY ??
    'dev-contact-challenge-secret'
  );
}

function getEncryptionKey() {
  return createHash('sha256').update(getChallengeSecret()).digest();
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

function sealPayload(payload: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

function openPayload(token: string) {
  try {
    const buffer = Buffer.from(token, 'base64url');

    if (buffer.length < 29) {
      return null;
    }

    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderChallengeText(left: number, operator: '+' | '-', right: number) {
  const characters = [String(left), operator, String(right), '='];
  const startX = 22 + randomInt(0, 4);
  const step = 30 + randomInt(0, 2);
  const baseline = CAPTCHA_HEIGHT / 2 + 5;

  return characters
    .map((character, index) => {
      const x = startX + index * step + randomInt(-2, 3);
      const y = baseline + randomInt(-4, 5);
      const rotation = randomInt(-6, 7);
      const fontSize = 18 + randomInt(0, 2);
      const fill = `rgb(${190 + randomInt(0, 30)}, ${190 + randomInt(0, 30)}, ${190 + randomInt(0, 30)})`;

      return `<text x="${x}" y="${y}" fill="${fill}" font-family="Georgia, 'Times New Roman', Times, serif" font-size="${fontSize}" font-style="italic" text-anchor="middle" transform="rotate(${rotation} ${x} ${y})">${escapeXml(character)}</text>`;
    })
    .join('');
}

function renderCrossingDesign() {
  const parts: string[] = [];

  for (let index = 0; index < 3; index += 1) {
    const x1 = randomInt(4, 36);
    const y1 = randomInt(4, CAPTCHA_HEIGHT - 4);
    const x2 = randomInt(CAPTCHA_WIDTH - 36, CAPTCHA_WIDTH - 4);
    const y2 = randomInt(4, CAPTCHA_HEIGHT - 4);
    const opacity = (randomInt(18, 32) / 100).toFixed(2);
    parts.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(200,200,200,${opacity})" stroke-width="${(randomInt(6, 11) / 10).toFixed(1)}" />`
    );
  }

  for (let index = 0; index < 2; index += 1) {
    const x1 = randomInt(12, CAPTCHA_WIDTH - 12);
    const y1 = randomInt(3, 10);
    const x2 = x1 + randomInt(-24, 25);
    const y2 = CAPTCHA_HEIGHT - randomInt(3, 10);
    const opacity = (randomInt(14, 26) / 100).toFixed(2);
    parts.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(180,180,180,${opacity})" stroke-width="0.7" />`
    );
  }

  for (let index = 0; index < 6; index += 1) {
    const cx = randomInt(8, CAPTCHA_WIDTH - 8);
    const cy = randomInt(6, CAPTCHA_HEIGHT - 6);
    const opacity = (randomInt(10, 22) / 100).toFixed(2);
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${(randomInt(4, 8) / 10).toFixed(1)}" fill="rgba(200,200,200,${opacity})" />`
    );
  }

  return parts.join('');
}

function buildCaptchaImageDataUrl(
  left: number,
  operator: '+' | '-',
  right: number
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CAPTCHA_WIDTH}" height="${CAPTCHA_HEIGHT}" viewBox="0 0 ${CAPTCHA_WIDTH} ${CAPTCHA_HEIGHT}" role="img">
  <rect width="100%" height="100%" rx="10" fill="#171717"/>
  <rect x="1" y="1" width="${CAPTCHA_WIDTH - 2}" height="${CAPTCHA_HEIGHT - 2}" rx="9" fill="none" stroke="rgba(180,180,180,0.45)" stroke-width="1" stroke-dasharray="3 2.5"/>
  ${renderChallengeText(left, operator, right)}
  ${renderCrossingDesign()}
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
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
  const signedPayload = `${payload}|${sign(payload)}`;

  return {
    token: sealPayload(signedPayload),
    imageDataUrl: buildCaptchaImageDataUrl(left, operator, right),
  };
}

export function verifyMathChallenge(
  token: string,
  answerRaw: string
): string | null {
  if (!token) {
    return 'Complete the math check and try again.';
  }

  const decoded = openPayload(token);

  if (!decoded) {
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
