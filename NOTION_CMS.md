# RBP Marketplace — Notion CMS Setup Guide

This guide explains how to connect your RBP Marketplace website to Notion as a
headless CMS so you can manage all content (listings, enquiries, site copy) from
Notion without touching any code.

---

## 1. Architecture Overview

```
Notion Databases  →  notionConfig.ts helpers  →  React pages
     (CMS)               (API layer)              (UI)
```

Five databases power the entire site:

| Database | Purpose | Connected Page(s) |
|---|---|---|
| **Businesses** | For-sale listings | `/businesses-for-sale`, `/business/:id` |
| **BIAB Packages** | Business-In-A-Box | `/business-in-a-box`, `/business/:id` |
| **Enquiries** | Contact form submissions | `/contact` (write-only) |
| **Seller Submissions** | Sell-your-business leads | `/sell-your-business` (write-only) |
| **Site Settings** | Global copy & config | All pages |

---

## 2. Create the Notion Databases

### 2a. Businesses For Sale

Create a full-page database in Notion named **"RBP — Businesses For Sale"** with
these properties:

| Property | Type | Notes |
|---|---|---|
| Title | Title | Listing name |
| Description | Text | Short one-liner |
| LongDescription | Text | Full description paragraph |
| Price | Text | e.g. `From $8,900` |
| Category | Select | SaaS Application, Productivity Tool, EdTech Platform… |
| Type | Select | `standard` or `business-in-a-box` |
| Featured | Checkbox | Shows "Featured" badge on card |
| Status | Select | `Published` / `Draft` |
| Inclusions | Multi-select | Each inclusion as a tag |
| AddOns | Multi-select | Each add-on as a tag |
| TechStack | Multi-select | React, Node.js, PostgreSQL… |
| Features | Multi-select | Key platform features |
| Integrations | Multi-select | Stripe, OpenAI, etc. |
| BusinessModel | Text | One-sentence description |
| TargetMarket | Text | Audience description |
| RevenueModel | Multi-select | Subscription, one-time, etc. |

### 2b. Business-In-A-Box Packages

Create **"RBP — Business-In-A-Box"** — same schema as above but also add:

| Property | Type | Notes |
|---|---|---|
| Extras | Multi-select | Included-extras bullet points |

### 2c. Enquiries (Contact Form)

Create **"RBP — Enquiries"** with:

| Property | Type | Notes |
|---|---|---|
| Name | Title | Submitter full name |
| Email | Email | — |
| Phone | Phone | — |
| EnquiryType | Select | business-for-sale / business-in-a-box / custom-solution / general |
| BudgetRange | Select | under-5k / 5k-10k / 10k-25k / 25k-50k / 50k-plus |
| Message | Text | Free text message |
| PreferredContact | Select | email / phone / either |
| SubmittedAt | Date | Auto-set on creation |
| Status | Select | New / In Progress / Resolved |

### 2d. Seller Submissions

Create **"RBP — Seller Submissions"** with:

| Property | Type | Notes |
|---|---|---|
| BusinessName | Title | Name of their business |
| SellerName | Text | Contact name |
| Email | Email | — |
| Description | Text | What the business does |
| AskingPrice | Number | Numeric asking price |
| TechStack | Multi-select | Technologies used |
| MonthlyRevenue | Number | MRR or 0 |
| SubmittedAt | Date | Auto-set on creation |
| Status | Select | Under Review / Listed / Rejected |

### 2e. Site Settings

Create **"RBP — Site Settings"** with:

| Property | Type | Notes |
|---|---|---|
| Key | Title | Unique key, e.g. `hero_headline` |
| Value | Text | The content string |
| Page | Select | home / businesses / biab / contact / global |
| Active | Checkbox | Only active rows are fetched |

---

## 3. Create a Notion Integration

1. Go to **https://www.notion.so/my-integrations**
2. Click **"+ New integration"**
3. Name it `RBP Marketplace`
4. Select your workspace
5. Under **Capabilities** enable: Read content, Update content, Insert content
6. Click **Save** → copy the **Internal Integration Secret**

### Connect databases to the integration

For **each** of the five databases:
1. Open the database in Notion
2. Click **"…"** (top-right) → **"Add connections"**
3. Search for `RBP Marketplace` and connect it

---

## 4. Get Database IDs

Each database URL looks like:
```
https://www.notion.so/your-workspace/DATABASE_ID?v=VIEW_ID
```

Copy the 32-character `DATABASE_ID` for each database.

---

## 5. Configure Environment Variables

Create a `.env` file in the project root (never commit this file):

```env
# Notion Integration Secret
VITE_NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Database IDs
VITE_NOTION_DB_BUSINESSES=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_NOTION_DB_BIAB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_NOTION_DB_ENQUIRIES=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_NOTION_DB_SELLERS=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_NOTION_DB_SETTINGS=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Restart the dev server after saving:
```bash
npm run dev
```

---

## 6. Wire Up Live Data (Next Steps)

The `notionConfig.ts` file already provides:
- `queryNotionDatabase()` — fetch rows with optional filters
- `createNotionPage()` — submit form data (enquiries, seller leads)
- `getText()`, `getSelect()`, `getMultiSelect()`, `getCheckbox()` — property extractors

### Example: Fetch published listings

```ts
import { queryNotionDatabase, NOTION_DB, BUSINESS_PROPS, getText, getSelect, getCheckbox } from './notionConfig';

async function fetchListings() {
  const pages = await queryNotionDatabase(NOTION_DB.BUSINESSES, {
    property: BUSINESS_PROPS.status,
    select: { equals: 'Published' },
  });

  return pages.map((page) => ({
    id: page.id,
    title: getText(page.properties[BUSINESS_PROPS.title]),
    description: getText(page.properties[BUSINESS_PROPS.description]),
    price: getText(page.properties[BUSINESS_PROPS.price]),
    featured: getCheckbox(page.properties[BUSINESS_PROPS.featured]),
    category: getSelect(page.properties[BUSINESS_PROPS.category]),
  }));
}
```

### Example: Submit a contact form enquiry

```ts
import { createNotionPage, NOTION_DB, ENQUIRY_PROPS } from './notionConfig';

async function submitEnquiry(formData: ContactFormData) {
  await createNotionPage(NOTION_DB.ENQUIRIES, {
    [ENQUIRY_PROPS.name]:    { title:       [{ text: { content: formData.name } }] },
    [ENQUIRY_PROPS.email]:   { email:       formData.email },
    [ENQUIRY_PROPS.phone]:   { phone_number: formData.phone },
    [ENQUIRY_PROPS.enquiryType]: { select:  { name: formData.enquiryType } },
    [ENQUIRY_PROPS.budgetRange]: { select:  { name: formData.budgetRange } },
    [ENQUIRY_PROPS.message]: { rich_text:   [{ text: { content: formData.message } }] },
    [ENQUIRY_PROPS.preferredContact]: { select: { name: formData.contactMethod } },
    [ENQUIRY_PROPS.submittedAt]: { date:    { start: new Date().toISOString() } },
    [ENQUIRY_PROPS.status]:  { select:      { name: 'New' } },
  });
}
```

---

## 7. Recommended Workflow

```
Content team edits Notion  →  Change Status to "Published"
        ↓
Site re-fetches data (on build or via ISR/SWR)
        ↓
New listing appears on website automatically
```

For real-time updates consider:
- **SWR / React Query** for client-side polling
- **Vercel ISR** (if moving to Next.js) for on-demand revalidation
- **Notion webhooks** (beta) to trigger re-deploys on Cloudflare / Vercel

---

## 8. Security Notes

- The Notion API key is **server-side only** in production — never expose it in
  a client bundle. For a production deployment, proxy calls through a serverless
  function or edge worker (Cloudflare Workers, Vercel API routes, etc.).
- The current `notionConfig.ts` is designed for rapid prototyping and local dev.
  Move API calls to a backend route before going live.
- Add the `.env` file to `.gitignore` (it already is if you used the default
  Vite template).
