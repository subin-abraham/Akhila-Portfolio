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
const CAPTCHA_WIDTH = 240;
const CAPTCHA_HEIGHT = 72;

const DIGIT_SEGMENTS: Record<string, readonly boolean[]> = {
  '0': [true, true, true, true, true, true, false],
  '1': [false, true, true, false, false, false, false],
  '2': [true, true, false, true, true, false, true],
  '3': [true, true, true, true, false, false, true],
  '4': [false, true, true, false, false, true, true],
  '5': [true, false, true, true, false, true, true],
  '6': [true, false, true, true, true, true, true],
  '7': [true, true, true, false, false, false, false],
  '8': [true, true, true, true, true, true, true],
  '9': [true, true, true, true, false, true, true],
};

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

function segmentRect(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="${height.toFixed(1)}" rx="1.5" transform="rotate(${rotation.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" />`;
}

function renderDigit(digit: string, originX: number, originY: number, hueShift: number) {
  const segments = DIGIT_SEGMENTS[digit];

  if (!segments) {
    return '';
  }

  const unit = 10;
  const thickness = 3.2;
  const length = unit * 2.1;
  const color = `rgb(${180 + hueShift}, ${230 - hueShift}, ${70 + hueShift})`;
  const [a, b, c, d, e, f, g] = segments;
  const parts: string[] = [];

  if (a) {
    parts.push(segmentRect(originX + thickness, originY, length, thickness, randomInt(-4, 5)));
  }
  if (b) {
    parts.push(
      segmentRect(
        originX + thickness + length,
        originY + thickness,
        thickness,
        length,
        randomInt(-4, 5)
      )
    );
  }
  if (c) {
    parts.push(
      segmentRect(
        originX + thickness + length,
        originY + thickness * 2 + length,
        thickness,
        length,
        randomInt(-4, 5)
      )
    );
  }
  if (d) {
    parts.push(
      segmentRect(
        originX + thickness,
        originY + thickness * 2 + length * 2,
        length,
        thickness,
        randomInt(-4, 5)
      )
    );
  }
  if (e) {
    parts.push(
      segmentRect(
        originX,
        originY + thickness * 2 + length,
        thickness,
        length,
        randomInt(-4, 5)
      )
    );
  }
  if (f) {
    parts.push(
      segmentRect(originX, originY + thickness, thickness, length, randomInt(-4, 5))
    );
  }
  if (g) {
    parts.push(
      segmentRect(
        originX + thickness,
        originY + thickness + length,
        length,
        thickness,
        randomInt(-4, 5)
      )
    );
  }

  return `<g fill="${color}">${parts.join('')}</g>`;
}

function renderOperator(operator: '+' | '-', originX: number, originY: number) {
  const color = 'rgb(182, 243, 75)';
  const parts: string[] = [
    segmentRect(originX, originY + 18, 18, 3.2, randomInt(-6, 7)),
  ];

  if (operator === '+') {
    parts.push(segmentRect(originX + 7.4, originY + 10, 3.2, 18, randomInt(-6, 7)));
  }

  return `<g fill="${color}">${parts.join('')}</g>`;
}

function renderEquals(originX: number, originY: number) {
  const color = 'rgba(182,243,75,0.85)';
  return `<g fill="${color}">
    ${segmentRect(originX, originY + 8, 14, 3, randomInt(-8, 9))}
    ${segmentRect(originX, originY + 28, 14, 3, randomInt(-8, 9))}
  </g>`;
}

function renderNoise() {
  const lines: string[] = [];

  for (let index = 0; index < 8; index += 1) {
    const x1 = randomInt(0, CAPTCHA_WIDTH);
    const y1 = randomInt(0, CAPTCHA_HEIGHT);
    const x2 = randomInt(0, CAPTCHA_WIDTH);
    const y2 = randomInt(0, CAPTCHA_HEIGHT);
    const opacity = (randomInt(15, 35) / 100).toFixed(2);
    lines.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,${opacity})" stroke-width="${(randomInt(8, 18) / 10).toFixed(1)}" />`
    );
  }

  for (let index = 0; index < 12; index += 1) {
    const cx = randomInt(0, CAPTCHA_WIDTH);
    const cy = randomInt(0, CAPTCHA_HEIGHT);
    const radius = randomInt(1, 2);
    const opacity = (randomInt(10, 30) / 100).toFixed(2);
    lines.push(
      `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="rgba(182,243,75,${opacity})" />`
    );
  }

  return lines.join('');
}

function buildCaptchaImageDataUrl(
  left: number,
  operator: '+' | '-',
  right: number
) {
  const leftX = 18 + randomInt(0, 6);
  const operatorX = 78 + randomInt(0, 6);
  const rightX = 118 + randomInt(0, 8);
  const equalsX = 188 + randomInt(0, 4);
  const baseY = 12 + randomInt(0, 6);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CAPTCHA_WIDTH}" height="${CAPTCHA_HEIGHT}" viewBox="0 0 ${CAPTCHA_WIDTH} ${CAPTCHA_HEIGHT}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#1d1d1d"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="12" fill="url(#bg)"/>
  <rect x="1" y="1" width="${CAPTCHA_WIDTH - 2}" height="${CAPTCHA_HEIGHT - 2}" rx="11" fill="none" stroke="rgba(255,255,255,0.12)"/>
  ${renderNoise()}
  ${renderDigit(String(left), leftX, baseY, randomInt(-12, 13))}
  ${renderOperator(operator, operatorX, baseY)}
  ${renderDigit(String(right), rightX, baseY + randomInt(-2, 3), randomInt(-12, 13))}
  ${renderEquals(equalsX, baseY + randomInt(0, 4))}
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
