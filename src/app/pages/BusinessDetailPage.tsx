import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getBusinessBySlug, getBusinessesByCategory } from '@/app/data/businesses';
import { BusinessDetailHeader } from '@/app/components/BusinessDetailHeader';
import { EnquiryCTA } from '@/app/components/EnquiryCTA';
import { LeadMagnetSection } from '@/app/components/LeadMagnetSection';
import { ProductList } from '@/app/components/ProductList';
import { RevenueModelList } from '@/app/components/RevenueModelList';
import { VariationList } from '@/app/components/VariationList';
import { BusinessGrid } from '@/app/components/BusinessGrid';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { trackEvent } from '@/app/lib/analytics';

function Roadmap({ notes }: { notes: string[] }) {
  const phases = [
    { label: 'MVP', text: notes[0] },
    { label: 'Phase 2', text: notes[1] ?? notes[0] },
    { label: 'Phase 3', text: notes[2] ?? notes[1] ?? notes[0] },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {phases.map((phase) => (
        <div key={phase.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">{phase.label}</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">{phase.text}</p>
        </div>
      ))}
    </div>
  );
}

export function BusinessDetailPage() {
  const { slug = '' } = useParams();
  const business = getBusinessBySlug(slug);

  useDocumentMeta(
    business ? `${business.title} | Business-In-A-Box` : 'Business | Business-In-A-Box',
    business
      ? `Explore the ${business.title} opportunity, including customer fit, revenue options, included versions, and how it can be taken to market.`
      : 'Explore Business-In-A-Box opportunities.',
  );

  useEffect(() => {
    if (!business) {
      return;
    }

    trackEvent('business_detail_viewed', {
      businessSlug: business.slug,
      category: business.category,
      priority: business.priority,
    });
  }, [business]);

  if (!business) {
    return <Navigate to="/businesses" replace />;
  }

  const relatedBusinesses = getBusinessesByCategory(business.category).filter(
    (item) => item.slug !== business.slug,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <BusinessDetailHeader business={business} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Why this business makes sense</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">{business.positioning}</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            This Business-In-A-Box can be packaged as a practical commercial offer rather than
            a loose concept. The focus is on what a buyer can sell first, how demand can be
            tested, and where expansion can happen once the core offer is proven.
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Who this business is built to serve</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {business.targetCustomers.map((customer) => (
              <div key={customer} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
                {customer}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Included versions and related concepts</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          These related concept names sit under the same core business so you can see the
          versions, angles, or adjacent offers already tied to this opportunity.
        </p>
        <div className="mt-5">
          <VariationList items={business.variations} />
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-bold text-slate-900">How this business can earn revenue</h2>
        <RevenueModelList items={business.revenueModels} />
      </section>

      <ProductList title="What you can package and sell first" items={business.productsToSell} />
      <ProductList title="What can be included in the offer" items={business.coreFeatures} />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Suggested launch path</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This phased view shows how the business can start with a clear commercial offer and
          grow into a broader service, platform, or digital product over time.
        </p>
        <div className="mt-5">
          <Roadmap notes={business.implementationNotes} />
        </div>
      </section>

      <LeadMagnetSection items={business.leadMagnets} />
      <EnquiryCTA businessSlug={business.slug} />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Related businesses</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Other opportunities from the same category that may suit a similar buyer.
            </p>
          </div>
          <Link to="/compare" className="text-sm font-semibold text-slate-900">
            Compare opportunities
          </Link>
        </div>
        <div className="mt-6">
          <BusinessGrid businesses={relatedBusinesses.slice(0, 3)} />
        </div>
      </section>
    </div>
  );
}