import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { AdminSessionResponse } from '@/app/data/types';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { ApiError, apiRequest } from '@/app/lib/api';
import { adminLoginSchema } from '@/shared/contracts';

export function AdminLoginPage() {
  useDocumentMeta(
    'Admin Login | Business-In-A-Box',
    'Sign in to the Business-In-A-Box admin portal.',
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [alreadyAuthenticated, setAlreadyAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTarget = new URLSearchParams(location.search).get('redirect') || '/admin';

  useEffect(() => {
    let cancelled = false;

    apiRequest<AdminSessionResponse>('/api/admin/session')
      .then((session) => {
        if (!cancelled && session.authenticated) {
          setAlreadyAuthenticated(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAlreadyAuthenticated(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCheckingSession(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (alreadyAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const parsed = adminLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check your login details and try again.');
      return;
    }

    setIsSubmitting(true);
    apiRequest<AdminSessionResponse>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    })
      .then(() => {
        navigate(redirectTarget, { replace: true });
      })
      .catch((apiError) => {
        if (apiError instanceof ApiError) {
          setError(apiError.message);
          return;
        }

        setError('The login service is currently unavailable. Please try again shortly.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  if (checkingSession) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-600">Checking admin session…</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          Admin Access
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Sign in to the admin portal
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Use the admin area to review stored enquiries, keep an eye on the strongest
          opportunities in the catalogue, and manage internal follow-up.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">Admin email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </label>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
