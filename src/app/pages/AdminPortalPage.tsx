import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { categories } from '@/app/data/categories';
import { businesses, getBusinessBySlug } from '@/app/data/businesses';
import type { AdminEnquiryRecord, AdminSessionResponse } from '@/app/data/types';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { ApiError, apiRequest } from '@/app/lib/api';

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

export function AdminPortalPage() {
  useDocumentMeta(
    'Admin Portal | Business-In-A-Box',
    'Review enquiries and the Business-In-A-Box catalogue from the admin portal.',
  );

  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSessionResponse | null>(null);
  const [enquiries, setEnquiries] = useState<AdminEnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPortal() {
      try {
        const [sessionResponse, enquiryResponse] = await Promise.all([
          apiRequest<AdminSessionResponse>('/api/admin/session'),
          apiRequest<{ items: AdminEnquiryRecord[] }>('/api/admin/enquiries?limit=100'),
        ]);

        if (!sessionResponse.authenticated) {
          if (!cancelled) {
            setAccessDenied(true);
          }
          return;
        }

        if (!cancelled) {
          setSession(sessionResponse);
          setEnquiries(enquiryResponse.items);
        }
      } catch (requestError) {
        if (requestError instanceof ApiError && requestError.status === 401) {
          if (!cancelled) {
            setAccessDenied(true);
          }
          return;
        }

        if (!cancelled) {
          setError('The admin portal could not load right now. Please try again shortly.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPortal();

    return () => {
      cancelled = true;
    };
  }, []);

  const highPriorityBusinesses = useMemo(
    () => businesses.filter((business) => business.priority === 'High'),
    [],
  );
  const fastLaunchBusinesses = useMemo(
    () => businesses.filter((business) => business.revenueSpeed === 'Fast'),
    [],
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-AU', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [],
  );

  async function handleLogout() {
    try {
      await apiRequest('/api/admin/logout', { method: 'POST' });
    } finally {
      navigate('/admin/login', { replace: true });
    }
  }

  if (accessDenied) {
    return <Navigate to="/admin/login?redirect=/admin" replace />;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Loading admin portal…</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
              Admin Portal
            </p>
            <h1 className="mt-3 text-4xl font-bold">RBP Marketplace control room</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Use this portal to review durable enquiry submissions, keep the strongest
              sellable concepts front of mind, and jump back into the public pages when you
              need to check the buyer experience.
            </p>
            {session?.email ? (
              <p className="mt-3 text-sm text-slate-300">Signed in as {session.email}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </section>

      {error ? (
        <section className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          {error}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Catalogue"
          value={String(businesses.length)}
          detail="Total businesses currently visible on the public site."
        />
        <SummaryCard
          label="Categories"
          value={String(categories.length)}
          detail="Commercial clusters used to group the public catalogue."
        />
        <SummaryCard
          label="High Priority"
          value={String(highPriorityBusinesses.length)}
          detail="Best near-term offers to feature and promote first."
        />
        <SummaryCard
          label="Stored Enquiries"
          value={String(enquiries.length)}
          detail="Enquiries securely stored in the production database."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                Recent Enquiries
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Follow-up queue
              </h2>
            </div>
            <Link to="/enquire" className="text-sm font-semibold text-slate-900">
              Open enquiry page
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-7 text-slate-600">
              No enquiries have been stored yet. Once a visitor submits the public form,
              those records will appear here for follow-up.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {enquiries.map((enquiry) => {
                const businessTitle = enquiry.businessSlug
                  ? getBusinessBySlug(enquiry.businessSlug)?.title
                  : null;

                return (
                  <article
                    key={enquiry.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{enquiry.name}</h3>
                        <p className="text-sm text-slate-600">{enquiry.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {enquiry.timeline}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {dateFormatter.format(new Date(enquiry.createdAt))}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Interest:</span>{' '}
                        {businessTitle || enquiry.businessSlug || 'General enquiry'}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Budget:</span> {enquiry.budgetRange}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Type:</span> {enquiry.enquiryType}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Phone:</span> {enquiry.phone || 'Not provided'}
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-700">{enquiry.message}</p>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Quick Links
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                to="/businesses"
                className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900"
              >
                Review the full public catalogue
              </Link>
              <Link
                to="/compare"
                className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900"
              >
                Compare featured opportunities
              </Link>
              <Link
                to="/about"
                className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900"
              >
                Check the customer-facing offer story
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Featured Focus
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Fastest to take to market
            </h2>
            <div className="mt-5 space-y-3">
              {fastLaunchBusinesses.slice(0, 5).map((business) => (
                <div key={business.slug} className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="font-semibold text-slate-900">{business.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {business.shortDescription}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
