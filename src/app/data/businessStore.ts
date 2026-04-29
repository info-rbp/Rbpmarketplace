/**
 * RBP Marketplace — Business Store
 * Wraps the static businesses array with localStorage persistence
 * so admin-created / edited / deleted listings survive page refreshes.
 */

import { businesses as seedData, Business } from './businesses';

const STORAGE_KEY = 'rbp_businesses';

/** Load from localStorage, falling back to the seed data */
function load(): Business[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Business[];
  } catch {
    /* ignore parse errors */
  }
  return seedData;
}

/** Persist the current list */
function save(list: Business[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** Generate a URL-safe slug from a title */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// Public CRUD helpers
// ---------------------------------------------------------------------------

export function getAllBusinesses(): Business[] {
  return load();
}

export function getBusinessById(id: string): Business | undefined {
  return load().find((b) => b.id === id);
}

export function getBusinessesByType(type: 'standard' | 'business-in-a-box'): Business[] {
  return load().filter((b) => b.type === type);
}

export function getFeaturedBusinesses(): Business[] {
  return load().filter((b) => b.featured);
}

export function addBusiness(business: Business): void {
  const list = load();
  // Ensure unique id
  if (list.find((b) => b.id === business.id)) {
    business.id = `${business.id}-${Date.now()}`;
  }
  list.unshift(business); // new listings appear first
  save(list);
}

export function updateBusiness(id: string, updated: Business): void {
  const list = load().map((b) => (b.id === id ? { ...updated, id } : b));
  save(list);
}

export function deleteBusiness(id: string): void {
  const list = load().filter((b) => b.id !== id);
  save(list);
}

/** Reset to the original seed data */
export function resetToSeed(): void {
  localStorage.removeItem(STORAGE_KEY);
}
