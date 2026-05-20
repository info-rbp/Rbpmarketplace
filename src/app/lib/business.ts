import { categories } from '@/app/data/categories';
import { businesses } from '@/app/data/businesses';
import type {
  BuildPriority,
  BusinessComplexity,
  BusinessConcept,
  CategoryId,
  RevenueSpeed,
} from '@/app/data/types';

export type SortMode =
  | 'priority'
  | 'revenue-speed'
  | 'complexity'
  | 'alphabetical';

export interface BusinessFilters {
  category: CategoryId | 'all';
  complexity: BusinessComplexity | 'all';
  revenueSpeed: RevenueSpeed | 'all';
  priority: BuildPriority | 'all';
  search: string;
  sort: SortMode;
}

const priorityRank: Record<BuildPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const revenueRank: Record<RevenueSpeed, number> = {
  Fast: 0,
  Medium: 1,
  Slow: 2,
};

const complexityRank: Record<BusinessComplexity, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};

export function searchBusinesses(source: BusinessConcept[], search: string) {
  const query = search.trim().toLowerCase();
  if (!query) {
    return source;
  }

  return source.filter((business) => {
    const haystack = [
      business.title,
      business.shortDescription,
      business.positioning,
      ...business.variations,
      ...business.targetCustomers,
      ...business.revenueModels,
      ...business.productsToSell,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function filterBusinesses(source: BusinessConcept[], filters: BusinessFilters) {
  return sortBusinesses(
    searchBusinesses(
      source.filter((business) => {
        if (filters.category !== 'all' && business.category !== filters.category) {
          return false;
        }
        if (filters.complexity !== 'all' && business.complexity !== filters.complexity) {
          return false;
        }
        if (filters.revenueSpeed !== 'all' && business.revenueSpeed !== filters.revenueSpeed) {
          return false;
        }
        if (filters.priority !== 'all' && business.priority !== filters.priority) {
          return false;
        }
        return true;
      }),
      filters.search,
    ),
    filters.sort,
  );
}

export function sortBusinesses(source: BusinessConcept[], sort: SortMode) {
  return [...source].sort((a, b) => {
    switch (sort) {
      case 'priority':
        return (
          priorityRank[a.priority] - priorityRank[b.priority] ||
          revenueRank[a.revenueSpeed] - revenueRank[b.revenueSpeed] ||
          a.title.localeCompare(b.title)
        );
      case 'revenue-speed':
        return (
          revenueRank[a.revenueSpeed] - revenueRank[b.revenueSpeed] ||
          priorityRank[a.priority] - priorityRank[b.priority] ||
          a.title.localeCompare(b.title)
        );
      case 'complexity':
        return (
          complexityRank[a.complexity] - complexityRank[b.complexity] ||
          priorityRank[a.priority] - priorityRank[b.priority] ||
          a.title.localeCompare(b.title)
        );
      case 'alphabetical':
      default:
        return a.title.localeCompare(b.title);
    }
  });
}

export function getBusinessRecommendations(answers: {
  launchPreference: 'fast' | 'balanced' | 'complex';
  market: CategoryId | 'all';
  revenueModel:
    | 'affiliate'
    | 'templates'
    | 'subscription'
    | 'consulting'
    | 'marketplace';
  complexity: BusinessComplexity;
  audience: 'B2B' | 'B2C' | 'Both';
}) {
  const scored = businesses.map((business) => {
    let score = 0;

    if (answers.market === 'all' || business.category === answers.market) {
      score += 4;
    }

    if (answers.complexity === business.complexity) {
      score += 3;
    }

    if (answers.launchPreference === 'fast' && business.revenueSpeed === 'Fast') {
      score += 3;
    }
    if (answers.launchPreference === 'balanced' && business.revenueSpeed === 'Medium') {
      score += 2;
    }
    if (answers.launchPreference === 'complex' && business.complexity === 'High') {
      score += 3;
    }

    const revenueText = business.revenueModels.join(' ').toLowerCase();
    if (answers.revenueModel === 'affiliate' && revenueText.includes('affiliate')) {
      score += 3;
    }
    if (
      answers.revenueModel === 'templates' &&
      (revenueText.includes('template') || revenueText.includes('pack'))
    ) {
      score += 3;
    }
    if (answers.revenueModel === 'subscription' && revenueText.includes('subscription')) {
      score += 3;
    }
    if (
      answers.revenueModel === 'consulting' &&
      (revenueText.includes('consult') || revenueText.includes('service'))
    ) {
      score += 3;
    }
    if (
      answers.revenueModel === 'marketplace' &&
      (revenueText.includes('marketplace') || revenueText.includes('lead generation'))
    ) {
      score += 3;
    }

    const audienceText = [
      business.shortDescription,
      business.positioning,
      ...business.targetCustomers,
    ]
      .join(' ')
      .toLowerCase();
    if (answers.audience === 'B2B' && audienceText.includes('business')) {
      score += 2;
    }
    if (answers.audience === 'B2C' && audienceText.includes('landlord')) {
      score += 2;
    }
    if (answers.audience === 'Both') {
      score += 1;
    }

    if (business.priority === 'High') {
      score += 2;
    }

    return { business, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.business.title.localeCompare(b.business.title))
    .slice(0, 3)
    .map((entry) => entry.business);
}

export function getCategoryBusinessCount(categoryId: CategoryId) {
  return businesses.filter((business) => business.category === categoryId).length;
}

export function getCategoryName(categoryId: CategoryId) {
  return categories.find((category) => category.id === categoryId)?.name ?? categoryId;
}