import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import {
  getAdminCredentials,
  hasAdminSession,
  startAdminSession,
  validateAdminCredentials,
} from '@/app/lib/admin';

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
  const credentials = getAdminCredentials();
  const redirectTarget = new URLSearchParams(location.search).get('redirect') || '/admin';

  if (hasAdminSession()) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!validateAdminCredentials(email, password)) {
      setError('Those details did not match the current admin login.');
      return;
    }

    startAdminSession();
    navigate(redirectTarget, { replace: true });
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

      {credentials.isTemporary ? (
        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900 shadow-sm">
          <p className="font-semibold">Temporary admin credentials are active.</p>
          <p className="mt-2">
            This login is running on the fallback credentials because
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">VITE_ADMIN_EMAIL</code>
            and
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">VITE_ADMIN_PASSWORD</code>
            are not set yet.
          </p>
          <p className="mt-2">
            Email: <span className="font-semibold">{credentials.email}</span>
          </p>
          <p>
            Password: <span className="font-semibold">{credentials.password}</span>
          </p>
        </section>
      ) : null}

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
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}