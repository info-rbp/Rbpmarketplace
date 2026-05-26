export type CategoryId =
  | 'compliance'
  | 'property'
  | 'business-lifecycle'
  | 'insurance-risk'
  | 'digital-platforms';

export type BusinessComplexity = 'Low' | 'Medium' | 'High';
export type RevenueSpeed = 'Fast' | 'Medium' | 'Slow';
export type BuildPriority = 'High' | 'Medium' | 'Low';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  positioning: string;
}

export interface BusinessConcept {
  id: number;
  title: string;
  slug: string;
  category: CategoryId;
  shortDescription: string;
  variations: string[];
  positioning: string;
  targetCustomers: string[];
  revenueModels: string[];
  productsToSell: string[];
  coreFeatures: string[];
  leadMagnets: string[];
  implementationNotes: string[];
  complexity: BusinessComplexity;
  revenueSpeed: RevenueSpeed;
  priority: BuildPriority;
}

export type {
  AdminEnquiryRecord,
  AdminSessionResponse,
  EnquiryFormValues,
  EnquiryPayload,
} from '@/shared/contracts';
