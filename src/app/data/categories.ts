import type { Category } from './types';

export const categories: Category[] = [
  {
    id: 'compliance',
    name: 'Compliance-as-a-Service',
    slug: 'compliance-as-a-service',
    description:
      'Businesses built around regulatory obligations, templates, audits, policies, and managed compliance workflows.',
    positioning:
      'Best for templates, subscriptions, compliance checklists, audit readiness, policy packs, and advisory support.',
  },
  {
    id: 'property',
    name: 'Property & Real Estate Services',
    slug: 'property-real-estate-services',
    description:
      'Web applications and service models for landlords, strata schemes, property inspections, and real estate operations.',
    positioning:
      'Best for inspection workflows, document packs, landlord tools, strata administration, and service bookings.',
  },
  {
    id: 'business-lifecycle',
    name: 'Business Lifecycle Services',
    slug: 'business-lifecycle-services',
    description:
      'Businesses that support starting, valuing, selling, franchising, or managing businesses.',
    positioning:
      'Best for consulting, calculators, readiness reports, business sale preparation, franchise packaging, and high-ticket services.',
  },
  {
    id: 'insurance-risk',
    name: 'Insurance & Risk Services',
    slug: 'insurance-risk-services',
    description:
      'Lead-generation, claims management, and risk-support businesses for insurance-related markets.',
    positioning:
      'Best for affiliate revenue, claims support, quote funnels, broker referrals, and risk checklists.',
  },
  {
    id: 'digital-platforms',
    name: 'Digital Platforms & Marketplaces',
    slug: 'digital-platforms-marketplaces',
    description:
      'Affiliate, recruitment, PLR, and remote-service platforms that can scale through content, marketplace mechanics, or partnerships.',
    positioning:
      'Best for scalable content sites, job boards, remote service marketplaces, PLR stores, and affiliate engines.',
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryById(id: Category['id']) {
  return categories.find((category) => category.id === id);
}