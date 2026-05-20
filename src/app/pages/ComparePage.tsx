import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { businesses, getBusinessBySlug } from '@/app/data/businesses';
import { ComparisonTable } from '@/app/components/ComparisonTable';
import { EnquiryCTA } from '@/app/components/EnquiryCTA';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { trackEvent } from '@/app/lib/analytics';

const defaultSelection = [
  'business-insurance-website',
  'private-landlord-website',
  'human-resources-business',
  'custom-business-build-service',
];

export function ComparePage() {
  useDocumentMeta(
    'Compare Businesses | Business-In-A-Box',
    'Compare Business-In-A-Box opportunities across category, setup level, sales fit, revenue speed, customers, and included components.',
  );

  const [params] = useSearchParams();
  const initialFromQuery = params.get('businesses')?.split(',').filter(Boolean) ?? [];
  const [selected, setSelected] = useState<string[]>(
    initialFromQuery.length > 0 ? [...new Set([...initialFromQuery, ...defaultSelection])].slice(0, 4) : defaultSelection,
  );

  const selectedBusinesses = useMemo(
    () =>
      selected
        .map((slug) => getBusinessBySlug(slug))
        .filter((business): business is NonNullable<typeof business> => Boolean(business)),
    [selected],
  );

  function updateSelection(index: number, slug: string) {
    const next = [...selected];
    next[index] = slug;
    setSelected(next);
    trackEvent('compare_business_added', { businessSlug: slug, slot: index + 1 });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Compare</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Compare up to four businesses side by side</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This view helps you narrow your shortlist by comparing the kind of buyer each
          business suits, how quickly it can earn, and what can be packaged into the offer.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <select
              key={index}
              value={selected[index]}
              onChange={(event) => updateSelection(index, event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            >
              {businesses.map((business) => (
                <option key={business.slug} value={business.slug}>
                  {business.title}
                </option>
              ))}
            </select>
          ))}
        </div>
      </section>

      {selectedBusinesses.length >= 2 ? (
        <ComparisonTable businesses={selectedBusinesses} />
      ) : (
        <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          Select at least two businesses to compare them.
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          to={`/enquire?business=${selectedBusinesses[0]?.slug ?? ''}`}
          className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">Build this business</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start with the first compared business and move straight into a tailored enquiry.
          </p>
        </Link>
        <Link
          to="/enquire"
          className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">Request an implementation plan</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Ask RBP to package, validate, or build one of these businesses with you.
          </p>
        </Link>
      </section>

      <EnquiryCTA />
    </div>
  );
}