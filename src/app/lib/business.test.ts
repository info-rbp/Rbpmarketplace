import { describe, expect, it } from 'vitest';
import { businesses } from '@/app/data/businesses';
import { filterBusinesses, getBusinessRecommendations } from '@/app/lib/business';

describe('business catalogue helpers', () => {
  it('filters by category and search term together', () => {
    const filtered = filterBusinesses(businesses, {
      category: 'property',
      complexity: 'all',
      revenueSpeed: 'all',
      priority: 'all',
      search: 'landlord',
      sort: 'alphabetical',
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((business) => business.category === 'property')).toBe(true);
    expect(filtered.some((business) => business.slug === 'private-landlord-website')).toBe(true);
  });

  it('recommends fast-launch opportunities for simple B2B template buyers', () => {
    const recommendations = getBusinessRecommendations({
      launchPreference: 'fast',
      market: 'compliance',
      revenueModel: 'templates',
      complexity: 'Low',
      audience: 'B2B',
    });

    expect(recommendations).toHaveLength(3);
    expect(recommendations[0]?.priority).toBe('High');
  });
});
