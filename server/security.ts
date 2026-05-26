import { adminSessionCookieName } from '@/shared/contracts';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

interface SessionPayload {
  email: string;
  exp: number;
  iat: number;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + padding);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function hex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }

  return mismatch === 0;
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return new Uint8Array(signature);
}

async function pbkdf2(password: string, salt: string, iterations: number) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: encoder.encode(salt),
      iterations,
    },
    key,
    256,
  );

  return new Uint8Array(bits);
}

export async function createPasswordHash(password: string, salt = crypto.randomUUID()) {
  const iterations = 120_000;
  const derived = await pbkdf2(password, salt, iterations);
  return `pbkdf2$${iterations}$${salt}$${hex(derived)}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationText, salt, expectedHash] = storedHash.split('$');
  if (algorithm !== 'pbkdf2' || !iterationText || !salt || !expectedHash) {
    return false;
  }

  const iterations = Number(iterationText);
  if (!Number.isInteger(iterations) || iterations <= 0) {
    return false;
  }

  const actual = await pbkdf2(password, salt, iterations);
  const expected = fromHex(expectedHash);
  return timingSafeEqual(actual, expected);
}

function fromHex(value: string) {
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }
  return bytes;
}

export async function hashIp(value: string, secret?: string) {
  if (!value) {
    return 'unknown';
  }

  if (secret) {
    const signed = await hmac(secret, value);
    return hex(signed).slice(0, 32);
  }

  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return hex(new Uint8Array(digest)).slice(0, 32);
}

export async function createSessionToken(email: string, secret: string, maxAgeSeconds: number) {
  const payload: SessionPayload = {
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const encodedPayload = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmac(secret, encodedPayload);
  return `${encodedPayload}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string, secret: string) {
  const [encodedPayload, encodedSignature] = token.split('.');
  if (!encodedPayload || !encodedSignature) {
    return null;
  }

  const expected = await hmac(secret, encodedPayload);
  const supplied = fromBase64Url(encodedSignature);
  if (!timingSafeEqual(expected, supplied)) {
    return null;
  }

  const payload = JSON.parse(decoder.decode(fromBase64Url(encodedPayload))) as SessionPayload;
  if (!payload.email || payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

function cookieSecuritySuffix(secure: boolean) {
  return secure ? '; SameSite=Strict; Secure' : '; SameSite=Lax';
}

export function serializeSessionCookie(token: string, maxAgeSeconds: number, secure: boolean) {
  return `${adminSessionCookieName}=${token}; HttpOnly; Path=/; Max-Age=${maxAgeSeconds}${cookieSecuritySuffix(secure)}`;
}

export function serializeExpiredSessionCookie(secure: boolean) {
  return `${adminSessionCookieName}=; HttpOnly; Path=/; Max-Age=0${cookieSecuritySuffix(secure)}`;
}
