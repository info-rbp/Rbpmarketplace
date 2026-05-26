import { z } from 'zod';

export const budgetOptions = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $15,000',
  '$15,000 - $50,000',
  '$50,000+',
] as const;

export const timelineOptions = [
  'Immediately',
  'This month',
  '1-3 months',
  '3-6 months',
  'Just researching',
] as const;

export const enquiryTypes = [
  'Buy or build this business',
  'Partner',
  'Request a quote',
  'Get a custom Business-In-A-Box built',
  'Request templates or resources',
] as const;

export const adminSessionCookieName = 'rbp_admin_session';

const businessSlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, 'Business selection is invalid.');

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(160),
  phone: z
    .string()
    .trim()
    .max(40, 'Phone numbers must be 40 characters or less.')
    .optional()
    .or(z.literal(''))
    .transform((value) => value || undefined),
  businessSlug: businessSlugSchema
    .optional()
    .or(z.literal(''))
    .transform((value) => value || undefined),
  enquiryType: z.enum(enquiryTypes, {
    errorMap: () => ({ message: 'Please choose an enquiry type.' }),
  }),
  budgetRange: z.enum(budgetOptions, {
    errorMap: () => ({ message: 'Please choose a budget range.' }),
  }),
  timeline: z.enum(timelineOptions, {
    errorMap: () => ({ message: 'Please choose a timeline.' }),
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Please provide a little more context.')
    .max(4000, 'Messages must be 4000 characters or less.'),
  companyWebsite: z
    .string()
    .trim()
    .max(0, 'Spam submissions are not accepted.')
    .optional()
    .default(''),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid admin email address.').max(160),
  password: z.string().min(8, 'Please enter your password.').max(200),
});

export type EnquiryFormValues = z.input<typeof enquirySchema>;
export type EnquiryPayload = z.output<typeof enquirySchema>;
export type AdminLoginInput = z.output<typeof adminLoginSchema>;

export interface AdminEnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  businessSlug?: string;
  enquiryType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'archived';
}

export interface AdminSessionResponse {
  authenticated: boolean;
  email?: string;
  expiresAt?: string;
}
