/**
 * RBP Marketplace – Notion CMS Configuration
 * ============================================
 * This file is the single source of truth for all Notion database IDs
 * and property mappings used across the marketplace.
 *
 * HOW TO USE:
 *  1. Duplicate the Notion template (see NOTION_CMS.md)
 *  2. Copy each database ID from the Notion URL and paste below
 *  3. Set VITE_NOTION_API_KEY in your .env file
 *  4. Run `npm run dev` – the app will fetch live data automatically
 *
 * NOTION URL FORMAT:
 *  https://www.notion.so/workspace/<DATABASE_ID>?v=<VIEW_ID>
 *  The DATABASE_ID is the 32-character hex string before the `?`
 */

// ---------------------------------------------------------------------------
// Environment – set these in your .env file (never commit real values)
// ---------------------------------------------------------------------------
export const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY ?? '';
export const NOTION_API_BASE = 'https://api.notion.com/v1';
export const NOTION_VERSION = '2022-06-28';

// ---------------------------------------------------------------------------
// Database IDs – replace the placeholder strings with your real IDs
// ---------------------------------------------------------------------------
export const NOTION_DB = {
  /**
   * Businesses For Sale
   * Each row = one listing shown on /businesses-for-sale and /business/:id
   * Required properties: Title, Description, Price, Category, Type,
   *   Featured (checkbox), Status (select: Published | Draft)
   */
  BUSINESSES: import.meta.env.VITE_NOTION_DB_BUSINESSES ?? 'REPLACE_WITH_BUSINESSES_DB_ID',

  /**
   * Business-In-A-Box Packages
   * Each row = one package shown on /business-in-a-box
   * Required properties: Title, Description, Price, LongDescription,
   *   Inclusions (multi-select), AddOns (multi-select), Extras (multi-select),
   *   TechStack (multi-select), Features (multi-select), Integrations (multi-select),
   *   BusinessModel, TargetMarket, RevenueModel (multi-select), Status
   */
  BIAB_PACKAGES: import.meta.env.VITE_NOTION_DB_BIAB ?? 'REPLACE_WITH_BIAB_DB_ID',

  /**
   * Contact / Enquiry Submissions
   * Each row = one form submission from /contact
   * Required properties: Name, Email, Phone, EnquiryType (select),
   *   BudgetRange (select), Message, PreferredContact (select),
   *   SubmittedAt (date), Status (select: New | In Progress | Resolved)
   */
  ENQUIRIES: import.meta.env.VITE_NOTION_DB_ENQUIRIES ?? 'REPLACE_WITH_ENQUIRIES_DB_ID',

  /**
   * Seller Submissions
   * Each row = one "Sell Your Business" submission
   * Required properties: BusinessName, SellerName, Email, Description,
   *   AskingPrice, TechStack (multi-select), MonthlyRevenue, SubmittedAt,
   *   Status (select: Under Review | Listed | Rejected)
   */
  SELLER_SUBMISSIONS: import.meta.env.VITE_NOTION_DB_SELLERS ?? 'REPLACE_WITH_SELLERS_DB_ID',

  /**
   * Site Settings / CMS Config
   * A single-row database for global content (hero text, banners, FAQs, etc.)
   * Required properties: Key (title), Value (rich_text), Page (select),
   *   Active (checkbox)
   */
  SITE_SETTINGS: import.meta.env.VITE_NOTION_DB_SETTINGS ?? 'REPLACE_WITH_SETTINGS_DB_ID',
} as const;

// ---------------------------------------------------------------------------
// Property name maps  (Notion property name → our internal key)
// Update these if you rename columns in Notion
// ---------------------------------------------------------------------------
export const BUSINESS_PROPS = {
  title: 'Title',
  description: 'Description',
  price: 'Price',
  category: 'Category',
  type: 'Type',
  featured: 'Featured',
  status: 'Status',
  longDescription: 'LongDescription',
  inclusions: 'Inclusions',
  addOns: 'AddOns',
  extras: 'Extras',
  techStack: 'TechStack',
  features: 'Features',
  integrations: 'Integrations',
  businessModel: 'BusinessModel',
  targetMarket: 'TargetMarket',
  revenueModel: 'RevenueModel',
} as const;

export const ENQUIRY_PROPS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  enquiryType: 'EnquiryType',
  budgetRange: 'BudgetRange',
  message: 'Message',
  preferredContact: 'PreferredContact',
  submittedAt: 'SubmittedAt',
  status: 'Status',
} as const;

export const SELLER_PROPS = {
  businessName: 'BusinessName',
  sellerName: 'SellerName',
  email: 'Email',
  description: 'Description',
  askingPrice: 'AskingPrice',
  techStack: 'TechStack',
  monthlyRevenue: 'MonthlyRevenue',
  submittedAt: 'SubmittedAt',
  status: 'Status',
} as const;

// ---------------------------------------------------------------------------
// Notion helper – build standard request headers
// ---------------------------------------------------------------------------
export function notionHeaders(): Record<string, string> {
  if (!NOTION_API_KEY) {
    console.warn(
      '[Notion CMS] VITE_NOTION_API_KEY is not set. ' +
        'Add it to your .env file to enable live CMS data.'
    );
  }
  return {
    Authorization: `Bearer ${NOTION_API_KEY}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

// ---------------------------------------------------------------------------
// Notion helper – query a database with optional filter
// ---------------------------------------------------------------------------
export async function queryNotionDatabase(
  databaseId: string,
  filter?: object,
  sorts?: object[]
): Promise<NotionPage[]> {
  const res = await fetch(`${NOTION_API_BASE}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      filter,
      sorts,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`[Notion CMS] Query failed (${res.status}): ${error}`);
  }

  const data = await res.json();
  return data.results as NotionPage[];
}

// ---------------------------------------------------------------------------
// Notion helper – create a page (form submission)
// ---------------------------------------------------------------------------
export async function createNotionPage(
  databaseId: string,
  properties: object
): Promise<void> {
  const res = await fetch(`${NOTION_API_BASE}/pages`, {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`[Notion CMS] Page creation failed (${res.status}): ${error}`);
  }
}

// ---------------------------------------------------------------------------
// Type stubs (lightweight – expand as needed)
// ---------------------------------------------------------------------------
export interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
}

export type NotionProperty =
  | { type: 'title'; title: Array<{ plain_text: string }> }
  | { type: 'rich_text'; rich_text: Array<{ plain_text: string }> }
  | { type: 'number'; number: number | null }
  | { type: 'select'; select: { name: string } | null }
  | { type: 'multi_select'; multi_select: Array<{ name: string }> }
  | { type: 'checkbox'; checkbox: boolean }
  | { type: 'date'; date: { start: string } | null }
  | { type: 'email'; email: string | null }
  | { type: 'phone_number'; phone_number: string | null }
  | { type: 'url'; url: string | null };

// ---------------------------------------------------------------------------
// Property extractors – safely pull values from Notion page properties
// ---------------------------------------------------------------------------
export function getText(prop: NotionProperty | undefined): string {
  if (!prop) return '';
  if (prop.type === 'title') return prop.title.map((t) => t.plain_text).join('');
  if (prop.type === 'rich_text') return prop.rich_text.map((t) => t.plain_text).join('');
  if (prop.type === 'email') return prop.email ?? '';
  if (prop.type === 'phone_number') return prop.phone_number ?? '';
  if (prop.type === 'url') return prop.url ?? '';
  return '';
}

export function getSelect(prop: NotionProperty | undefined): string {
  if (!prop || prop.type !== 'select') return '';
  return prop.select?.name ?? '';
}

export function getMultiSelect(prop: NotionProperty | undefined): string[] {
  if (!prop || prop.type !== 'multi_select') return [];
  return prop.multi_select.map((s) => s.name);
}

export function getCheckbox(prop: NotionProperty | undefined): boolean {
  if (!prop || prop.type !== 'checkbox') return false;
  return prop.checkbox;
}

export function getNumber(prop: NotionProperty | undefined): number | null {
  if (!prop || prop.type !== 'number') return null;
  return prop.number;
}
