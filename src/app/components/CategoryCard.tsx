import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/app/data/types';

interface CategoryCardProps {
  category: Category;
  businessCount: number;
}

export function CategoryCard({ category, businessCount }: CategoryCardProps) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
        {businessCount} businesses
      </p>
      <h3 className="mt-4 text-2xl font-bold text-slate-900">{category.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{category.description}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        View businesses
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}