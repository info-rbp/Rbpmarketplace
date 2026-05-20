import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { categories } from '@/app/data/categories';
import { businesses, getBusinessBySlug } from '@/app/data/businesses';
import type { EnquiryPayload } from '@/app/data/types';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import {
  clearAdminSession,
  getAdminSnapshot,
  hasAdminSession,
} from '@/app/lib/admin';

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
  const [enquiries, setEnquiries] = useState<EnquiryPayload[]>([]);

  useEffect(() => {
    setEnquiries(getAdminSnapshot().enquiries);
  }, []);

  if (!hasAdminSession()) {
    return <Navigate to="/admin/login?redirect=/admin" replace />;
  }

  const highPriorityBusinesses = businesses.filter((business) => business.priority === 'High');
  const fastLaunchBusinesses = businesses.filter((business) => business.revenueSpeed === 'Fast');

  function handleLogout() {
    clearAdminSession();
    navigate('/admin/login', { replace: true });
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
              Use this portal to review incoming enquiries from this browser session, keep
              the strongest sellable concepts front of mind, and jump back into the public
              pages when you need to check the buyer experience.
            </p>
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
          detail="Enquiries saved in this browser when the API is unavailable."
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
              No local enquiries are stored in this browser yet. Once a visitor submits the
              form and the fallback storage is used, those enquiries will appear here.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {enquiries.slice().reverse().map((enquiry, index) => {
                const businessTitle = enquiry.businessSlug
                  ? getBusinessBySlug(enquiry.businessSlug)?.title
                  : null;

                return (
                  <article
                    key={`${enquiry.email}-${index}`}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{enquiry.name}</h3>
                        <p className="text-sm text-slate-600">{enquiry.email}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {enquiry.timeline}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Interest:</span>{' '}
                        {businessTitle || 'General enquiry'}
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