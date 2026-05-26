import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, BriefcaseBusiness, Layers3, ShieldCheck } from 'lucide-react';
import { categories } from '@/app/data/categories';
import { getFeaturedBusinesses } from '@/app/data/businesses';
import { BusinessGrid } from '@/app/components/BusinessGrid';
import { CategoryCard } from '@/app/components/CategoryCard';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { getCategoryBusinessCount } from '@/app/lib/business';
import { brandConfig } from '@/config/brand';

const featuredClusters = [
  {
    title: 'Compliance-as-a-Service',
    body: 'A strong fit for buyers who want recurring revenue from templates, policy packs, audits, and support services.',
  },
  {
    title: 'Property & Real Estate Services',
    body: 'Inspection, landlord, and strata offers with clear customer pain points and repeatable workflow demand.',
  },
  {
    title: 'Business Lifecycle Services',
    body: 'Higher-value service businesses built around valuation, sale preparation, franchising, and custom delivery.',
  },
];

export function HomePage() {
  useDocumentMeta(
    `${brandConfig.productName} | ${brandConfig.brandName}`,
    `${brandConfig.productDescription}`,
  );

  const featuredBusinesses = getFeaturedBusinesses();

  return (
    <div className="space-y-14 pb-16">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pt-16">
        <div className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
            {brandConfig.productLabel}
          </p>
          <h1 className="mt-5 text-4xl font-bold sm:text-6xl">
            Buy, build, or partner on business concepts that are ready to be taken to market.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {brandConfig.brandName} brings together practical business opportunities that can
            be sold as services, templates, subscriptions, lead-generation sites, or complete
            digital businesses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/businesses"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
            >
              Explore Businesses
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Find My Best Fit
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            {
              icon: ShieldCheck,
              title: 'Clear, cleaned-up offers',
              body: 'Each opportunity is grouped into one clear offer so buyers can understand what is actually on the table.',
            },
            {
              icon: BriefcaseBusiness,
              title: 'Designed to be commercial',
              body: 'Every business includes customer fit, offer ideas, revenue paths, and practical ways it can be packaged.',
            },
            {
              icon: BarChart3,
              title: 'Easy to compare',
              body: 'Use the compare and assessment tools to narrow the shortlist before you enquire or move forward.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-8 w-8 text-sky-600" />
              <h2 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Categories</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Browse by the type of business you want to own or launch</h2>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-slate-900">
            View all categories
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              businessCount={getCategoryBusinessCount(category.id)}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Featured opportunities</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Featured businesses with strong near-term sales potential
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            These are some of the clearest {brandConfig.productName} offers for buyers who want a
            practical starting point, faster go-to-market options, or obvious customer demand.
          </p>
          <div className="mt-8">
            <BusinessGrid businesses={featuredBusinesses} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          {
            title: `How ${brandConfig.productName} works`,
            body: 'Each listing starts with a sellable core offer, then expands into extra services, templates, content, or software as demand grows.',
            icon: Layers3,
          },
          ...featuredClusters,
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            {item.icon ? <item.icon className="h-8 w-8 text-sky-600" /> : null}
            <h2 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] bg-slate-900 p-8 text-white lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold">Move from interest to the right next step</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Compare opportunities, use the fit assessment, or send an enquiry and we will
              help you work out the best way to buy, build, or customise the business.
            </p>
          </div>
          <Link to="/compare" className="rounded-[1.5rem] bg-white/5 p-6 hover:bg-white/10">
            <p className="text-lg font-semibold">Compare opportunities</p>
            <p className="mt-2 text-sm text-slate-300">Review up to four businesses side by side before you commit to one direction.</p>
          </Link>
          <Link to="/assessment" className="rounded-[1.5rem] bg-sky-500 p-6 hover:bg-sky-400">
            <p className="text-lg font-semibold">Find the best fit</p>
            <p className="mt-2 text-sm text-white/90">Answer a short quiz and get the three opportunities most likely to suit you.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
