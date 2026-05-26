import { beforeEach, describe, expect, it } from 'vitest';
import { handleApiRequest, type Env } from './index';
import { createPasswordHash } from './security';

interface StoredRateLimit {
  bucket: string;
  subject: string;
  windowStart: number;
  count: number;
  expiresAt: number;
}

interface StoredEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  businessSlug: string | null;
  enquiryType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'archived';
}

class FakePreparedStatement {
  private values: unknown[] = [];

  constructor(private readonly db: FakeD1Database, private readonly query: string) {}

  bind(...values: unknown[]) {
    this.values = values;
    return this;
  }

  async first<T>() {
    if (this.query.includes('SELECT count FROM rate_limits')) {
      const [bucket, subject, windowStart] = this.values as [string, string, number];
      const match = this.db.rateLimits.find(
        (entry) =>
          entry.bucket === bucket &&
          entry.subject === subject &&
          entry.windowStart === windowStart,
      );
      return (match ? ({ count: match.count } as T) : null);
    }

    return null;
  }

  async run() {
    if (this.query.startsWith('DELETE FROM rate_limits')) {
      const [now] = this.values as [number];
      this.db.rateLimits = this.db.rateLimits.filter((entry) => entry.expiresAt >= now);
      return { success: true };
    }

    if (this.query.startsWith('UPDATE rate_limits SET count = count + 1')) {
      const [expiresAt, bucket, subject, windowStart] = this.values as [number, string, string, number];
      const match = this.db.rateLimits.find(
        (entry) =>
          entry.bucket === bucket &&
          entry.subject === subject &&
          entry.windowStart === windowStart,
      );
      if (match) {
        match.count += 1;
        match.expiresAt = expiresAt;
      }
      return { success: true };
    }

    if (this.query.startsWith('INSERT INTO rate_limits')) {
      const [bucket, subject, windowStart, count, expiresAt] = this.values as [string, string, number, number, number];
      this.db.rateLimits.push({ bucket, subject, windowStart, count, expiresAt });
      return { success: true };
    }

    if (this.query.includes('INSERT INTO enquiries')) {
      const [
        id,
        name,
        email,
        phone,
        businessSlug,
        enquiryType,
        budgetRange,
        timeline,
        message,
        createdAt,
      ] = this.values as [
        string,
        string,
        string,
        string | null,
        string | null,
        string,
        string,
        string,
        string,
        string,
      ];

      this.db.enquiries.push({
        id,
        name,
        email,
        phone,
        businessSlug,
        enquiryType,
        budgetRange,
        timeline,
        message,
        createdAt,
        status: 'new',
      });
      return { success: true };
    }

    return { success: true };
  }

  async all<T>() {
    if (this.query.includes('FROM enquiries')) {
      const [limit] = this.values as [number];
      const results = [...this.db.enquiries]
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(0, limit) as T[];
      return { results };
    }

    return { results: [] as T[] };
  }
}

class FakeD1Database {
  enquiries: StoredEnquiry[] = [];
  rateLimits: StoredRateLimit[] = [];

  prepare(query: string) {
    return new FakePreparedStatement(this, query);
  }
}

const ctx = {
  waitUntil() {
    return undefined;
  },
};

function createEnv(overrides: Partial<Env> = {}) {
  const db = new FakeD1Database();
  const env: Env = {
    ASSETS: {
      fetch: async () => new Response('asset response', { status: 200 }),
    },
    DB: db,
    PUBLIC_APP_ORIGIN: 'https://example.com',
    SESSION_SECRET: 'session-secret',
    ...overrides,
  };

  return { env, db };
}

describe('worker API', () => {
  beforeEach(() => {
    globalThis.crypto.randomUUID = () => 'test-enquiry-id';
  });

  it('stores validated enquiries in D1', async () => {
    const { env, db } = createEnv();
    const request = new Request('https://example.com/api/enquiries', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({
        name: 'Alex Founder',
        email: 'alex@example.com',
        enquiryType: 'Buy or build this business',
        budgetRange: '$5,000 - $15,000',
        timeline: '1-3 months',
        message: 'I want to launch the landlord concept quickly.',
        businessSlug: 'private-landlord-website',
      }),
    });

    const response = await handleApiRequest(request, env, ctx);
    const payload = await response.json() as { success: boolean; id: string };

    expect(response.status).toBe(201);
    expect(payload).toEqual({ success: true, id: 'test-enquiry-id' });
    expect(db.enquiries).toHaveLength(1);
    expect(db.enquiries[0]?.email).toBe('alex@example.com');
  });

  it('rejects cross-origin submissions', async () => {
    const { env } = createEnv();
    const request = new Request('https://example.com/api/enquiries', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://evil.example.com',
      },
      body: JSON.stringify({
        name: 'Alex Founder',
        email: 'alex@example.com',
        enquiryType: 'Buy or build this business',
        budgetRange: '$5,000 - $15,000',
        timeline: '1-3 months',
        message: 'I want to launch the landlord concept quickly.',
      }),
    });

    const response = await handleApiRequest(request, env, ctx);
    expect(response.status).toBe(403);
  });

  it('authenticates admins and returns stored enquiries', async () => {
    const passwordHash = await createPasswordHash('correct horse battery staple', 'fixed-salt');
    const { env, db } = createEnv({
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD_HASH: passwordHash,
    });

    db.enquiries.push({
      id: 'enquiry-1',
      name: 'Taylor Buyer',
      email: 'taylor@example.com',
      phone: null,
      businessSlug: 'human-resources-business',
      enquiryType: 'Request a quote',
      budgetRange: '$15,000 - $50,000',
      timeline: 'This month',
      message: 'Please scope a done-for-you build.',
      createdAt: '2026-05-26T00:00:00.000Z',
      status: 'new',
    });

    const loginResponse = await handleApiRequest(
      new Request('https://example.com/api/admin/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://example.com',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'correct horse battery staple',
        }),
      }),
      env,
      ctx,
    );

    expect(loginResponse.status).toBe(200);
    const sessionCookie = loginResponse.headers.get('Set-Cookie');
    expect(sessionCookie).toContain('HttpOnly');

    const enquiryResponse = await handleApiRequest(
      new Request('https://example.com/api/admin/enquiries?limit=10', {
        headers: {
          cookie: sessionCookie ?? '',
        },
      }),
      env,
      ctx,
    );

    expect(enquiryResponse.status).toBe(200);
    const payload = await enquiryResponse.json() as { items: StoredEnquiry[] };
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0]?.email).toBe('taylor@example.com');
  });
});
