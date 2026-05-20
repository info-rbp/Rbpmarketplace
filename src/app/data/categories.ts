import type { Category } from './types';

export const categories: Category[] = [
  {
    id: 'compliance',
    name: 'Compliance-as-a-Service',
    slug: 'compliance-as-a-service',
    description:
      'Business opportunities built around practical compliance support, policy packs, audit readiness, and subscription-style advisory services.',
    positioning:
      'Strong fit for buyers who want recurring revenue from templates, subscriptions, compliance reviews, and managed support.',
  },
  {
    id: 'property',
    name: 'Property & Real Estate Services',
    slug: 'property-real-estate-services',
    description:
      'Sellable service and digital businesses for landlords, strata schemes, inspection providers, and property operators.',
    positioning:
      'Well suited to document packs, inspection workflows, landlord tools, and service-booking models with repeat demand.',
  },
  {
    id: 'business-lifecycle',
    name: 'Business Lifecycle Services',
    slug: 'business-lifecycle-services',
    description:
      'Commercial offers that help clients start, value, sell, expand, or package their businesses more professionally.',
    positioning:
      'Best for consulting-led offers, readiness reports, calculators, sale preparation, and higher-value advisory work.',
  },
  {
    id: 'insurance-risk',
    name: 'Insurance & Risk Services',
    slug: 'insurance-risk-services',
    description:
      'Lead-generation and service businesses focused on insurance enquiries, claims support, and business risk guidance.',
    positioning:
      'Strong fit for quote funnels, broker referrals, claims support, affiliate revenue, and practical risk resources.',
  },
  {
    id: 'digital-platforms',
    name: 'Digital Platforms & Marketplaces',
    slug: 'digital-platforms-marketplaces',
    description:
      'Online businesses that can grow through content, listings, digital products, referrals, and remote-service delivery.',
    positioning:
      'Well suited to buyers who want scalable digital products, niche marketplaces, affiliate sites, or service-led platforms.',
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryById(id: Category['id']) {
  return categories.find((category) => category.id === id);
}