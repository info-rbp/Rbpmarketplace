import {
  adminLoginSchema,
  adminSessionCookieName,
  enquirySchema,
  type AdminEnquiryRecord,
  type AdminSessionResponse,
} from '@/shared/contracts';
import {
  createSessionToken,
  hashIp,
  serializeExpiredSessionCookie,
  serializeSessionCookie,
  verifyPassword,
  verifySessionToken,
} from './security';

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
}

interface AssetBinding {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export interface Env {
  ASSETS: AssetBinding;
  DB: D1Database;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD_HASH?: string;
  SESSION_SECRET?: string;
  PUBLIC_APP_ORIGIN?: string;
}

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'",
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
} as const;

const sessionDurationSeconds = 60 * 60 * 12;
const defaultApiHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};

function withSecurityHeaders(response: Response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(payload: unknown, status = 200, headers?: HeadersInit) {
  return withSecurityHeaders(
    new Response(JSON.stringify(payload), {
      status,
      headers: {
        ...defaultApiHeaders,
        ...(headers ?? {}),
      },
    }),
  );
}

function getAllowedOrigin(request: Request, env: Env) {
  return env.PUBLIC_APP_ORIGIN ?? new URL(request.url).origin;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? cookie.slice(name.length + 1) : null;
}

async function parseJsonBody(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('Requests must be sent as application/json.');
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > 10_000) {
    throw new Error('Request body is too large.');
  }

  return request.json();
}

function formatValidationError(issues: Array<{ path: PropertyKey[]; message: string }>) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

function assertSameOrigin(request: Request, env: Env) {
  const origin = request.headers.get('origin');
  if (!origin) {
    return null;
  }

  const allowedOrigin = getAllowedOrigin(request, env);
  if (origin !== allowedOrigin) {
    return json({ error: 'Cross-origin requests are not allowed.' }, 403);
  }

  return null;
}

async function cleanupExpiredRateLimits(env: Env) {
  const now = Date.now();
  await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(now).run();
}

async function enforceRateLimit(
  env: Env,
  bucket: string,
  subject: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const windowStart = now - (now % windowMs);
  const existing = await env.DB.prepare(
    'SELECT count FROM rate_limits WHERE bucket = ? AND subject = ? AND window_start = ?',
  )
    .bind(bucket, subject, windowStart)
    .first<{ count: number }>();

  if (existing && existing.count >= limit) {
    return false;
  }

  if (existing) {
    await env.DB.prepare(
      'UPDATE rate_limits SET count = count + 1, expires_at = ? WHERE bucket = ? AND subject = ? AND window_start = ?',
    )
      .bind(windowStart + windowMs, bucket, subject, windowStart)
      .run();
  } else {
    await env.DB.prepare(
      'INSERT INTO rate_limits (bucket, subject, window_start, count, expires_at) VALUES (?, ?, ?, ?, ?)',
    )
      .bind(bucket, subject, windowStart, 1, windowStart + windowMs)
      .run();
  }

  return true;
}

async function getAdminSession(request: Request, env: Env) {
  const secret = env.SESSION_SECRET;
  if (!secret) {
    return null;
  }

  const token = getCookie(request, adminSessionCookieName);
  if (!token) {
    return null;
  }

  return verifySessionToken(token, secret);
}

async function requireAdmin(request: Request, env: Env) {
  const session = await getAdminSession(request, env);
  if (!session) {
    return { session: null, response: json({ error: 'You must sign in to access this area.' }, 401) };
  }

  return { session, response: null };
}

async function handleHealthcheck() {
  return json({ ok: true, service: 'rbpmarketplace-api' });
}

async function handleEnquirySubmission(request: Request, env: Env, ctx: ExecutionContextLike) {
  const originError = assertSameOrigin(request, env);
  if (originError) {
    return originError;
  }

  ctx.waitUntil(cleanupExpiredRateLimits(env));

  const ipHash = await hashIp(getClientIp(request), env.SESSION_SECRET);
  const allowed = await enforceRateLimit(env, 'public-enquiry', ipHash, 10, 60 * 60 * 1000);
  if (!allowed) {
    return json({ error: 'Too many submissions from this address. Please try again later.' }, 429);
  }

  let rawBody: unknown;
  try {
    rawBody = await parseJsonBody(request);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Request body could not be read.' }, 400);
  }

  const parsed = enquirySchema.safeParse(rawBody);
  if (!parsed.success) {
    return json(
      {
        error: 'Please review the highlighted fields and try again.',
        fieldErrors: formatValidationError(parsed.error.issues),
      },
      400,
    );
  }

  if (parsed.data.companyWebsite) {
    return json({ success: true }, 202);
  }

  const enquiryId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const userAgent = request.headers.get('user-agent') ?? undefined;

  await env.DB.prepare(
    `INSERT INTO enquiries (
      id,
      name,
      email,
      phone,
      business_slug,
      enquiry_type,
      budget_range,
      timeline,
      message,
      created_at,
      status,
      source_ip_hash,
      user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`,
  )
    .bind(
      enquiryId,
      parsed.data.name,
      parsed.data.email,
      parsed.data.phone ?? null,
      parsed.data.businessSlug ?? null,
      parsed.data.enquiryType,
      parsed.data.budgetRange,
      parsed.data.timeline,
      parsed.data.message,
      createdAt,
      ipHash,
      userAgent ?? null,
    )
    .run();

  return json({ success: true, id: enquiryId }, 201);
}

async function handleAdminLogin(request: Request, env: Env, ctx: ExecutionContextLike) {
  const originError = assertSameOrigin(request, env);
  if (originError) {
    return originError;
  }

  ctx.waitUntil(cleanupExpiredRateLimits(env));

  const ipHash = await hashIp(getClientIp(request), env.SESSION_SECRET);
  const allowed = await enforceRateLimit(env, 'admin-login', ipHash, 10, 15 * 60 * 1000);
  if (!allowed) {
    return json({ error: 'Too many login attempts. Please try again later.' }, 429);
  }

  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD_HASH || !env.SESSION_SECRET) {
    return json({ error: 'Admin login is not configured for this environment yet.' }, 503);
  }

  let rawBody: unknown;
  try {
    rawBody = await parseJsonBody(request);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Request body could not be read.' }, 400);
  }

  const parsed = adminLoginSchema.safeParse(rawBody);
  if (!parsed.success) {
    return json(
      {
        error: 'Please review the highlighted fields and try again.',
        fieldErrors: formatValidationError(parsed.error.issues),
      },
      400,
    );
  }

  const emailMatches = parsed.data.email.trim().toLowerCase() === env.ADMIN_EMAIL.trim().toLowerCase();
  const passwordMatches = emailMatches
    ? await verifyPassword(parsed.data.password, env.ADMIN_PASSWORD_HASH)
    : false;

  if (!emailMatches || !passwordMatches) {
    return json({ error: 'Those details did not match an administrator account.' }, 401);
  }

  const token = await createSessionToken(env.ADMIN_EMAIL, env.SESSION_SECRET, sessionDurationSeconds);
  const session: AdminSessionResponse = {
    authenticated: true,
    email: env.ADMIN_EMAIL,
    expiresAt: new Date(Date.now() + sessionDurationSeconds * 1000).toISOString(),
  };

  return json(session, 200, {
    'Set-Cookie': serializeSessionCookie(token, sessionDurationSeconds),
  });
}

async function handleAdminLogout(request: Request, env: Env) {
  const originError = assertSameOrigin(request, env);
  if (originError) {
    return originError;
  }

  return json(
    { authenticated: false },
    200,
    {
      'Set-Cookie': serializeExpiredSessionCookie(),
    },
  );
}

async function handleAdminSession(request: Request, env: Env) {
  const session = await getAdminSession(request, env);
  if (!session) {
    return json({ authenticated: false } satisfies AdminSessionResponse, 200);
  }

  return json(
    {
      authenticated: true,
      email: session.email,
      expiresAt: new Date(session.exp * 1000).toISOString(),
    } satisfies AdminSessionResponse,
    200,
  );
}

async function handleAdminEnquiries(request: Request, env: Env) {
  const { response } = await requireAdmin(request, env);
  if (response) {
    return response;
  }

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get('limit') ?? '50');
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 200)
    : 50;

  const { results } = await env.DB.prepare(
    `SELECT
      id,
      name,
      email,
      phone,
      business_slug AS businessSlug,
      enquiry_type AS enquiryType,
      budget_range AS budgetRange,
      timeline,
      message,
      created_at AS createdAt,
      status
    FROM enquiries
    ORDER BY created_at DESC
    LIMIT ?`,
  )
    .bind(limit)
    .all<AdminEnquiryRecord>();

  return json({ items: results ?? [] });
}

export async function handleApiRequest(request: Request, env: Env, ctx: ExecutionContextLike) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    return withSecurityHeaders(new Response(null, { status: 204 }));
  }

  if (pathname === '/api/health' && request.method === 'GET') {
    return handleHealthcheck();
  }
  if (pathname === '/api/enquiries' && request.method === 'POST') {
    return handleEnquirySubmission(request, env, ctx);
  }
  if (pathname === '/api/admin/login' && request.method === 'POST') {
    return handleAdminLogin(request, env, ctx);
  }
  if (pathname === '/api/admin/logout' && request.method === 'POST') {
    return handleAdminLogout(request, env);
  }
  if (pathname === '/api/admin/session' && request.method === 'GET') {
    return handleAdminSession(request, env);
  }
  if (pathname === '/api/admin/enquiries' && request.method === 'GET') {
    return handleAdminEnquiries(request, env);
  }

  return json({ error: 'Not found.' }, 404);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContextLike) {
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, ctx);
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};
