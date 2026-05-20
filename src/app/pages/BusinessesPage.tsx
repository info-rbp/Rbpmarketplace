import { useMemo, useState } from 'react';
import { businesses } from '@/app/data/businesses';
import { BusinessGrid } from '@/app/components/BusinessGrid';
import { FilterBar } from '@/app/components/FilterBar';
import { SearchInput } from '@/app/components/SearchInput';
import { filterBusinesses } from '@/app/lib/business';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';

export function BusinessesPage() {
  useDocumentMeta(
    'Businesses | Business-In-A-Box',
    'Explore Business-In-A-Box opportunities with filters for category, setup level, revenue speed, and sales fit.',
  );

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | (typeof businesses)[number]['category']>('all');
  const [complexity, setComplexity] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [revenueSpeed, setRevenueSpeed] = useState<'all' | 'Fast' | 'Medium' | 'Slow'>('all');
  const [priority, setPriority] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [sort, setSort] = useState<'priority' | 'revenue-speed' | 'complexity' | 'alphabetical'>(
    'priority',
  );

  const filtered = useMemo(
    () =>
      filterBusinesses(businesses, {
        category,
        complexity,
        revenueSpeed,
        priority,
        search,
        sort,
      }),
    [category, complexity, priority, revenueSpeed, search, sort],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">All businesses</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Explore the Business-In-A-Box catalogue</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Browse the current opportunities, compare their setup level, and focus on the
          businesses that best match the type of buyer, operator, or partner you want to be.
        </p>
        <div className="mt-6 space-y-4">
          <SearchInput value={search} onChange={setSearch} />
          <FilterBar
            category={category}
            complexity={complexity}
            revenueSpeed={revenueSpeed}
            priority={priority}
            sort={sort}
            onCategoryChange={setCategory}
            onComplexityChange={setComplexity}
            onRevenueSpeedChange={setRevenueSpeed}
            onPriorityChange={setPriority}
            onSortChange={setSort}
          />
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> opportunities
          </p>
        </div>
        <BusinessGrid businesses={filtered} />
      </section>
    </div>
  );
}