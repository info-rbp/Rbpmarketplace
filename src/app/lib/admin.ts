import { businesses } from '@/app/data/businesses';
import type { EnquiryPayload } from '@/app/data/types';

export const ADMIN_SESSION_KEY = 'rbp-admin-session';
export const ENQUIRY_STORAGE_KEY = 'rbp-enquiries';

export interface AdminCredentials {
  email: string;
  password: string;
  isTemporary: boolean;
}

export function getAdminCredentials(): AdminCredentials {
  const email = import.meta.env.VITE_ADMIN_EMAIL;
  const password = import.meta.env.VITE_ADMIN_PASSWORD;

  if (email && password) {
    return { email, password, isTemporary: false };
  }

  return {
    email: 'admin@rbpmarketplace.com',
    password: 'change-this-password',
    isTemporary: true,
  };
}

export function validateAdminCredentials(email: string, password: string) {
  const configured = getAdminCredentials();
  return (
    email.trim().toLowerCase() === configured.email.toLowerCase() &&
    password === configured.password
  );
}

export function hasAdminSession() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active';
}

export function startAdminSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
}

export function clearAdminSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getStoredEnquiries(): EnquiryPayload[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ENQUIRY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as EnquiryPayload[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAdminSnapshot() {
  const enquiries = getStoredEnquiries();
  const highPriorityBusinesses = businesses.filter((business) => business.priority === 'High');
  const fastLaunchBusinesses = businesses.filter(
    (business) => business.revenueSpeed === 'Fast',
  );

  return {
    totalBusinesses: businesses.length,
    highPriorityBusinesses,
    fastLaunchBusinesses,
    enquiries,
  };
}