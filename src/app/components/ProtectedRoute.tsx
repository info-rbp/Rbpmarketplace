import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { AdminSessionResponse } from '@/app/data/types';
import { apiRequest } from '@/app/lib/api';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiRequest<AdminSessionResponse>('/api/admin/session')
      .then((response) => {
        if (!cancelled) {
          setIsAuthenticated(response.authenticated);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsChecking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Checking access…</p>
        </section>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectTarget = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`,
    );
    return <Navigate to={`/admin/login?redirect=${redirectTarget}`} replace />;
  }

  return <>{children}</>;
}
