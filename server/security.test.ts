import { describe, expect, it } from 'vitest';
import {
  createPasswordHash,
  createSessionToken,
  verifyPassword,
  verifySessionToken,
} from './security';

describe('security helpers', () => {
  it('verifies passwords hashed with PBKDF2', async () => {
    const hash = await createPasswordHash('super-secret-password', 'demo-salt');

    await expect(verifyPassword('super-secret-password', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });

  it('creates and verifies signed admin sessions', async () => {
    const token = await createSessionToken('admin@example.com', 'session-secret', 60);
    const payload = await verifySessionToken(token, 'session-secret');

    expect(payload?.email).toBe('admin@example.com');
    expect(payload?.exp).toBeGreaterThan(payload?.iat ?? 0);
  });

  it('rejects tampered session tokens', async () => {
    const token = await createSessionToken('admin@example.com', 'session-secret', 60);
    const tampered = `${token}x`;

    await expect(verifySessionToken(tampered, 'session-secret')).resolves.toBeNull();
  });
});
