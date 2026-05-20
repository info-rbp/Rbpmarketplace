import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from './Badge';
import type { BusinessConcept } from '@/app/data/types';
import { getCategoryName } from '@/app/lib/business';

interface BusinessDetailHeaderProps {
  business: BusinessConcept;
}

export function BusinessDetailHeader({ business }: BusinessDetailHeaderProps) {
  return (
    <section className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{getCategoryName(business.category)}</Badge>
        <Badge tone="warning">Sales fit: {business.priority}</Badge>
        <Badge tone="neutral">Setup: {business.complexity}</Badge>
        <Badge tone="success">Revenue speed: {business.revenueSpeed}</Badge>
      </div>

      <h1 className="mt-6 max-w-4xl text-4xl font-bold sm:text-5xl">{business.title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{business.shortDescription}</p>
      <p className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
        {business.positioning}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to={`/enquire?business=${business.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
        >
          Ask About This Business
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to={`/compare?businesses=${business.slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Compare This Business
        </Link>
      </div>
    </section>
  );
}