import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getCategoryBySlug } from '@/app/data/categories';
import { businesses } from '@/app/data/businesses';
import { BusinessGrid } from '@/app/components/BusinessGrid';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { trackEvent } from '@/app/lib/analytics';

export function CategoryDetailPage() {
  const { slug = '' } = useParams();
  const category = getCategoryBySlug(slug);

  useDocumentMeta(
    category ? `${category.name} | Business-In-A-Box` : 'Category | Business-In-A-Box',
    category
      ? `${category.description} Explore the business concepts available in this commercial cluster.`
      : 'Explore Business-In-A-Box categories.',
  );

  const matchingBusinesses = category
    ? businesses.filter((business) => business.category === category.id)
    : [];

  useEffect(() => {
    if (!category) {
      return;
    }

    trackEvent('category_viewed', {
      category: category.id,
      count: matchingBusinesses.length,
    });
  }, [category, matchingBusinesses.length]);

  if (!category) {
    return <Navigate to="/categories" replace />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Category</p>
        <h1 className="mt-3 text-4xl font-bold">{category.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{category.description}</p>
        <p className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
          {category.positioning}
        </p>
        <div className="mt-6">
          <Link
            to="/compare"
            className="inline-flex items-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Compare businesses in this category
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Businesses in this category</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            These opportunities sit inside the {category.name.toLowerCase()} group and can be
            sold as services, digital products, subscription offers, or complete packaged
            businesses depending on the concept you choose.
          </p>
        </div>
        <BusinessGrid businesses={matchingBusinesses} />
      </section>
    </div>
  );
}