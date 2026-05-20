import { BusinessCard } from './BusinessCard';
import type { BusinessConcept } from '@/app/data/types';

interface BusinessGridProps {
  businesses: BusinessConcept[];
}

export function BusinessGrid({ businesses }: BusinessGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {businesses.map((business) => (
        <BusinessCard key={business.slug} business={business} />
      ))}
    </div>
  );
}