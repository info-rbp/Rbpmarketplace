import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from './Badge';
import type { BusinessConcept } from '@/app/data/types';
import { getCategoryName } from '@/app/lib/business';
import { trackEvent } from '@/app/lib/analytics';

interface BusinessCardProps {
  business: BusinessConcept;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{getCategoryName(business.category)}</Badge>
        <Badge tone={business.priority === 'High' ? 'warning' : 'neutral'}>
          Sales fit: {business.priority}
        </Badge>
      </div>

      <div className="mt-5 flex-1">
        <h3 className="text-xl font-bold text-slate-900">{business.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{business.shortDescription}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge tone="neutral">Setup: {business.complexity}</Badge>
        <Badge tone={business.revenueSpeed === 'Fast' ? 'success' : 'neutral'}>
          Revenue speed: {business.revenueSpeed}
        </Badge>
        <Badge tone="neutral">{business.variations.length} version(s)</Badge>
      </div>

      <Link
        to={`/businesses/${business.slug}`}
        onClick={() =>
          trackEvent('business_card_clicked', {
            businessSlug: business.slug,
            category: business.category,
            priority: business.priority,
          })
        }
        className="mt-6 inline-flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-sky-600"
      >
        View opportunity
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  );
}