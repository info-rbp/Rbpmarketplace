import { categories } from '@/app/data/categories';
import { CategoryCard } from '@/app/components/CategoryCard';
import { getCategoryBusinessCount } from '@/app/lib/business';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';

export function CategoriesPage() {
  useDocumentMeta(
    'Categories | Business-In-A-Box',
    'Browse Business-In-A-Box categories including compliance, property, insurance, digital platforms, and business services.',
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Categories</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Choose the market that suits you best</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Each category groups businesses by the kind of customer they serve, the problems
          they solve, and the commercial model they are best suited to.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            businessCount={getCategoryBusinessCount(category.id)}
          />
        ))}
      </section>
    </div>
  );
}