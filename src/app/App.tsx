import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Layers3,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { categories, getCategoryById, getCategoryBySlug } from './data/categories';
import {
  businesses,
  getBusinessBySlug,
  getBusinessesByCategory,
  getFeaturedBusinesses,
} from './data/businesses';
import type {
  BuildPriority,
  BusinessComplexity,
  BusinessConcept,
  CategoryId,
  EnquiryPayload,
  RevenueSpeed,
} from './data/types';

type SortMode = 'priority' | 'revenue-speed' | 'complexity' | 'alphabetical';

const priorityRank: Record<BuildPriority, number> = { High: 0, Medium: 1, Low: 2 };
const revenueRank: Record<RevenueSpeed, number> = { Fast: 0, Medium: 1, Slow: 2 };
const complexityRank: Record<BusinessComplexity, number> = { Low: 0, Medium: 1, High: 2 };

function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }, [description, title]);
}

function trackEvent(name: string, payload?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.info('[analytics]', name, payload ?? {});
  }
}

function getCategoryName(categoryId: CategoryId) {
  return getCategoryById(categoryId)?.name ?? categoryId;
}

function searchBusinesses(source: BusinessConcept[], query: string) {
  const cleaned = query.trim().toLowerCase();
  if (!cleaned) return source;

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
    return haystack.includes(cleaned);
  });
}

function sortBusinesses(source: BusinessConcept[], mode: SortMode) {
  return [...source].sort((a, b) => {
    switch (mode) {
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

function getRecommendations(answers: {
  launchPreference: 'fast' | 'balanced' | 'complex';
  market: CategoryId;
  revenueModel: 'affiliate' | 'templates' | 'subscription' | 'consulting' | 'marketplace';
  complexity: BusinessComplexity;
  audience: 'B2B' | 'B2C' | 'Both';
}) {
  return [...businesses]
    .map((business) => {
      let score = 0;
      if (business.category === answers.market) score += 4;
      if (business.complexity === answers.complexity) score += 3;
      if (answers.launchPreference === 'fast' && business.revenueSpeed === 'Fast') score += 3;
      if (answers.launchPreference === 'balanced' && business.revenueSpeed === 'Medium') score += 2;
      if (answers.launchPreference === 'complex' && business.complexity === 'High') score += 3;

      const revenueText = business.revenueModels.join(' ').toLowerCase();
      if (answers.revenueModel === 'affiliate' && revenueText.includes('affiliate')) score += 3;
      if (answers.revenueModel === 'templates' && (revenueText.includes('template') || revenueText.includes('pack'))) score += 3;
      if (answers.revenueModel === 'subscription' && revenueText.includes('subscription')) score += 3;
      if (answers.revenueModel === 'consulting' && (revenueText.includes('consult') || revenueText.includes('service'))) score += 3;
      if (answers.revenueModel === 'marketplace' && (revenueText.includes('marketplace') || revenueText.includes('lead generation'))) score += 3;

      const audienceText = [business.shortDescription, business.positioning, ...business.targetCustomers].join(' ').toLowerCase();
      if (answers.audience === 'B2B' && audienceText.includes('business')) score += 2;
      if (answers.audience === 'B2C' && audienceText.includes('landlord')) score += 2;
      if (answers.audience === 'Both') score += 1;
      if (business.priority === 'High') score += 2;

      return { business, score };
    })
    .sort((a, b) => b.score - a.score || a.business.title.localeCompare(b.business.title))
    .slice(0, 3)
    .map((entry) => entry.business);
}

function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'brand' | 'neutral' | 'success' | 'warning' }) {
  const classes = {
    brand: 'bg-sky-100 text-sky-800',
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes[tone]}`}>{children}</span>;
}

function Header() {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/businesses', label: 'Businesses' },
    { to: '/categories', label: 'Categories' },
    { to: '/compare', label: 'Compare' },
    { to: '/assessment', label: 'Assessment' },
    { to: '/enquire', label: 'Enquire' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">B</div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">RBP Marketplace</div>
            <div className="text-lg font-bold text-slate-900">Business-In-A-Box</div>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition-colors ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 hover:text-slate-900'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Business-In-A-Box</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Launch-ready business concepts packaged for real commercial use.</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">Browse deduplicated opportunities across compliance, property, insurance, digital platforms, and business lifecycle services.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Explore</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/businesses">All businesses</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/compare">Compare</Link>
            <Link to="/assessment">Assessment</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Action</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/enquire">Enquire now</Link>
            <Link to="/about">About the model</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <Search className="h-5 w-5 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, variation, customer, or revenue model"
        className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </label>
  );
}

function BusinessCard({ business }: { business: BusinessConcept }) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{getCategoryName(business.category)}</Badge>
        <Badge tone={business.priority === 'High' ? 'warning' : 'neutral'}>Priority: {business.priority}</Badge>
      </div>
      <div className="mt-5 flex-1">
        <h3 className="text-xl font-bold text-slate-900">{business.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{business.shortDescription}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Badge>Complexity: {business.complexity}</Badge>
        <Badge tone={business.revenueSpeed === 'Fast' ? 'success' : 'neutral'}>Revenue: {business.revenueSpeed}</Badge>
        <Badge>{business.variations.length} variation(s)</Badge>
      </div>
      <Link
        to={`/businesses/${business.slug}`}
        onClick={() => trackEvent('business_card_clicked', { businessSlug: business.slug, category: business.category, priority: business.priority })}
        className="mt-6 inline-flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-sky-600"
      >
        View business
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function BusinessGrid({ items }: { items: BusinessConcept[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((business) => (
        <BusinessCard key={business.slug} business={business} />
      ))}
    </div>
  );
}

function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  const businessCount = businesses.filter((business) => business.category === category.id).length;
  return (
    <Link to={`/categories/${category.slug}`} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">{businessCount} businesses</p>
      <h3 className="mt-4 text-2xl font-bold text-slate-900">{category.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{category.description}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        Explore category
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function EnquiryCTA({ businessSlug }: { businessSlug?: string }) {
  const target = businessSlug ? `/enquire?business=${businessSlug}` : '/enquire';
  return (
    <section className="rounded-[2rem] bg-slate-900 px-6 py-8 text-white sm:px-8">
      <h2 className="text-3xl font-bold">Ready to turn this concept into a working business?</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Use the enquiry flow to request a quote, a custom build, or a deeper implementation plan.</p>
      <Link to={target} className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400">
        Start an enquiry
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function HomePage() {
  useDocumentMeta('Business-In-A-Box | RBP Marketplace', 'Browse launch-ready business concepts across compliance, property, insurance, business lifecycle services, and digital platforms.');
  const featuredBusinesses = getFeaturedBusinesses();

  return (
    <div className="space-y-14 pb-16">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pt-16">
        <div className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Ready-to-build business concepts</p>
          <h1 className="mt-5 text-4xl font-bold sm:text-6xl">Launch-ready business concepts, packaged for real-world sales.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Browse monetisable business models across compliance, property, insurance, legal services, HR, and digital products.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/businesses" className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400">
              Explore Businesses
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/assessment" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Find My Best Fit
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            { icon: ShieldCheck, title: '20 deduplicated businesses', body: 'Duplicates are merged into clean parent offers with their folder-name variations preserved.' },
            { icon: BriefcaseBusiness, title: 'Built for selling', body: 'Each concept includes target customers, revenue models, products to sell, and launch notes.' },
            { icon: BarChart3, title: 'Decision-ready', body: 'Use compare and assessment flows to decide what to build, buy, or launch next.' },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-8 w-8 text-sky-600" />
              <h2 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Categories</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Commercial clusters with clearer buyer logic</h2>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-slate-900">View all categories</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Featured opportunities</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Highest-priority businesses to take to market first</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">These are the strongest launch candidates based on revenue speed, product fit, and commercial clarity.</p>
          <div className="mt-8"><BusinessGrid items={featuredBusinesses} /></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          { title: 'How the model works', body: 'Start with a concept, package the first sellable offers, validate demand, then add workflow or SaaS layers once demand is proven.', icon: Layers3 },
          { title: 'Compliance-as-a-Service', body: 'Subscription, template, and advisory models with strong B2B demand.' },
          { title: 'Property & Real Estate Services', body: 'Inspection, landlord, and strata concepts with repeatable document workflows.' },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            {item.icon ? <item.icon className="h-8 w-8 text-sky-600" /> : null}
            <h2 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] bg-slate-900 p-8 text-white lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold">Move from browsing to building</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">Compare concepts side by side, take the fit assessment, or start an enquiry with the business already selected.</p>
          </div>
          <Link to="/compare" className="rounded-[1.5rem] bg-white/5 p-6 hover:bg-white/10">
            <p className="text-lg font-semibold">Compare opportunities</p>
            <p className="mt-2 text-sm text-slate-300">Line up up to four concepts and compare complexity, monetisation, and core features.</p>
          </Link>
          <Link to="/assessment" className="rounded-[1.5rem] bg-sky-500 p-6 hover:bg-sky-400">
            <p className="text-lg font-semibold">Find the best fit</p>
            <p className="mt-2 text-sm text-white/90">Answer a short quiz and get your top three recommendations.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

function BusinessesPage() {
  useDocumentMeta('Businesses | Business-In-A-Box', 'Explore all 20 deduplicated business concepts, with filters for category, complexity, revenue speed, and priority.');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [complexity, setComplexity] = useState<BusinessComplexity | 'all'>('all');
  const [revenueSpeed, setRevenueSpeed] = useState<RevenueSpeed | 'all'>('all');
  const [priority, setPriority] = useState<BuildPriority | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('priority');

  const filtered = useMemo(() => {
    return sortBusinesses(
      searchBusinesses(
        businesses.filter((business) => {
          if (category !== 'all' && business.category !== category) return false;
          if (complexity !== 'all' && business.complexity !== complexity) return false;
          if (revenueSpeed !== 'all' && business.revenueSpeed !== revenueSpeed) return false;
          if (priority !== 'all' && business.priority !== priority) return false;
          return true;
        }),
        search,
      ),
      sort,
    );
  }, [category, complexity, priority, revenueSpeed, search, sort]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">All businesses</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">20 launch-ready concepts, cleaned up into one catalogue</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Search across titles, descriptions, variations, customer types, and revenue models. Filter by category, complexity, revenue speed, and priority.</p>
        <div className="mt-6 space-y-4">
          <SearchInput value={search} onChange={setSearch} />
          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-5">
            <select value={category} onChange={(event) => setCategory(event.target.value as CategoryId | 'all')} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select value={complexity} onChange={(event) => setComplexity(event.target.value as BusinessComplexity | 'all')} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option value="all">All complexity</option>
              <option value="Low">Low complexity</option>
              <option value="Medium">Medium complexity</option>
              <option value="High">High complexity</option>
            </select>
            <select value={revenueSpeed} onChange={(event) => setRevenueSpeed(event.target.value as RevenueSpeed | 'all')} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option value="all">All revenue speed</option>
              <option value="Fast">Fast revenue</option>
              <option value="Medium">Medium revenue</option>
              <option value="Slow">Slow revenue</option>
            </select>
            <select value={priority} onChange={(event) => setPriority(event.target.value as BuildPriority | 'all')} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option value="all">All priority</option>
              <option value="High">High priority</option>
              <option value="Medium">Medium priority</option>
              <option value="Low">Low priority</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option value="priority">Priority first</option>
              <option value="revenue-speed">Fastest revenue</option>
              <option value="complexity">Lowest complexity</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </section>
      <section>
        <p className="mb-5 text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{filtered.length}</span> businesses</p>
        <BusinessGrid items={filtered} />
      </section>
    </div>
  );
}

function BusinessDetailPage() {
  const { slug = '' } = useParams();
  const business = getBusinessBySlug(slug);

  useDocumentMeta(
    business ? `${business.title} | Business-In-A-Box` : 'Business | Business-In-A-Box',
    business ? `Explore the ${business.title} concept, including variations, target customers, revenue models, products to sell, and implementation options.` : 'Explore Business-In-A-Box opportunities.',
  );

  useEffect(() => {
    if (!business) return;
    trackEvent('business_detail_viewed', { businessSlug: business.slug, category: business.category, priority: business.priority });
  }, [business]);

  if (!business) return <Navigate to="/businesses" replace />;

  const relatedBusinesses = getBusinessesByCategory(business.category).filter((item) => item.slug !== business.slug);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{getCategoryName(business.category)}</Badge>
          <Badge tone="warning">Priority: {business.priority}</Badge>
          <Badge>Complexity: {business.complexity}</Badge>
          <Badge tone="success">Revenue: {business.revenueSpeed}</Badge>
        </div>
        <h1 className="mt-6 max-w-4xl text-4xl font-bold sm:text-5xl">{business.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{business.shortDescription}</p>
        <p className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">{business.positioning}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={`/enquire?business=${business.slug}`} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400">
            Enquire About This Business
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to={`/compare?businesses=${business.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Compare This Business
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">{business.positioning}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Target Customers</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {business.targetCustomers.map((customer) => (
              <div key={customer} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">{customer}</div>
            ))}
          </div>
        </div>
      </section>

      {[
        { title: 'Business Variations', items: business.variations },
        { title: 'Revenue Models', items: business.revenueModels },
        { title: 'Products to Sell', items: business.productsToSell },
        { title: 'Core Web App Features', items: business.coreFeatures },
      ].map((section) => (
        <section key={section.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {section.items.map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">{item}</div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Implementation Roadmap</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {['MVP', 'Phase 2', 'Phase 3'].map((label, index) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">{label}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{business.implementationNotes[index] ?? business.implementationNotes[business.implementationNotes.length - 1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Lead magnets</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Easy offers to capture interest early</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {business.leadMagnets.map((item) => (
            <div key={item} className="rounded-2xl border border-sky-100 bg-white px-4 py-4 text-sm text-slate-700">{item}</div>
          ))}
        </div>
      </section>

      <EnquiryCTA businessSlug={business.slug} />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Related businesses</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">More opportunities from the same category.</p>
          </div>
          <Link to="/compare" className="text-sm font-semibold text-slate-900">Compare opportunities</Link>
        </div>
        <div className="mt-6"><BusinessGrid items={relatedBusinesses.slice(0, 3)} /></div>
      </section>
    </div>
  );
}

function CategoriesPage() {
  useDocumentMeta('Categories | Business-In-A-Box', 'Browse business categories including compliance, property, insurance, digital platforms, and business lifecycle services.');
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Categories</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Commercial clusters that make the catalogue easier to navigate</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Each category groups business concepts by the kind of customer problem they solve and the monetisation style they suit best.</p>
      </section>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
      </section>
    </div>
  );
}

function CategoryDetailPage() {
  const { slug = '' } = useParams();
  const category = getCategoryBySlug(slug);
  const matches = category ? businesses.filter((business) => business.category === category.id) : [];

  useDocumentMeta(
    category ? `${category.name} | Business-In-A-Box` : 'Category | Business-In-A-Box',
    category ? `${category.description} Explore the business concepts available in this commercial cluster.` : 'Explore Business-In-A-Box categories.',
  );

  useEffect(() => {
    if (!category) return;
    trackEvent('category_viewed', { category: category.id, count: matches.length });
  }, [category, matches.length]);

  if (!category) return <Navigate to="/categories" replace />;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Category</p>
        <h1 className="mt-3 text-4xl font-bold">{category.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{category.description}</p>
        <p className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">{category.positioning}</p>
      </section>
      <BusinessGrid items={matches} />
    </div>
  );
}

function ComparePage() {
  useDocumentMeta('Compare Businesses | Business-In-A-Box', 'Compare up to four business concepts across category, complexity, priority, revenue speed, target customers, and core features.');
  const [params] = useSearchParams();
  const base = params.get('businesses')?.split(',').filter(Boolean) ?? [];
  const defaults = ['business-insurance-website', 'private-landlord-website', 'human-resources-business', 'custom-business-build-service'];
  const [selected, setSelected] = useState<string[]>([...new Set([...base, ...defaults])].slice(0, 4));
  const selectedBusinesses = selected.map((slug) => getBusinessBySlug(slug)).filter(Boolean) as BusinessConcept[];

  function updateSelection(index: number, slug: string) {
    const next = [...selected];
    next[index] = slug;
    setSelected(next);
    trackEvent('compare_business_added', { businessSlug: slug, slot: index + 1 });
  }

  const rows: Array<[string, (business: BusinessConcept) => string]> = [
    ['Category', (business) => getCategoryName(business.category)],
    ['Priority', (business) => business.priority],
    ['Complexity', (business) => business.complexity],
    ['Revenue speed', (business) => business.revenueSpeed],
    ['Target customers', (business) => business.targetCustomers.join(', ')],
    ['Revenue models', (business) => business.revenueModels.join(', ')],
    ['Products to sell', (business) => business.productsToSell.join(', ')],
    ['Core features', (business) => business.coreFeatures.join(', ')],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Compare</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Put up to four business opportunities side by side</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <select key={index} value={selected[index]} onChange={(event) => updateSelection(index, event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none">
              {businesses.map((business) => (
                <option key={business.slug} value={business.slug}>{business.title}</option>
              ))}
            </select>
          ))}
        </div>
      </section>

      {selectedBusinesses.length >= 2 ? (
        <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 font-semibold text-slate-700">Criteria</th>
                {selectedBusinesses.map((business) => (
                  <th key={business.slug} className="min-w-[260px] px-5 py-4 font-semibold text-slate-900">{business.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label} className="border-b border-slate-100 align-top">
                  <td className="px-5 py-4 font-medium text-slate-600">{label}</td>
                  {selectedBusinesses.map((business) => (
                    <td key={`${label}-${business.slug}`} className="px-5 py-4 leading-6 text-slate-700">{render(business)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <EnquiryCTA businessSlug={selectedBusinesses[0]?.slug} />
    </div>
  );
}

function AssessmentPage() {
  useDocumentMeta('Assessment | Business-In-A-Box', 'Answer a short business-opportunity quiz and get the top three matching Business-In-A-Box concepts.');
  const [answers, setAnswers] = useState({
    launchPreference: 'fast' as const,
    market: 'compliance' as CategoryId,
    revenueModel: 'templates' as const,
    complexity: 'Medium' as BusinessComplexity,
    audience: 'B2B' as const,
  });
  const recommendations = useMemo(() => getRecommendations(answers), [answers]);

  function updateAnswers(next: typeof answers) {
    setAnswers(next);
    trackEvent('assessment_started');
    trackEvent('assessment_completed', { topBusiness: getRecommendations(next)[0]?.slug });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Assessment</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Find the most suitable business opportunity</h1>
      </section>
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          {[
            {
              label: 'Do you want a fast-to-launch business or a higher-value complex business?',
              value: answers.launchPreference,
              options: [['Fast launch', 'fast'], ['Balanced', 'balanced'], ['High-value complex', 'complex']] as const,
              apply: (value: 'fast' | 'balanced' | 'complex') => updateAnswers({ ...answers, launchPreference: value }),
            },
            {
              label: 'Which market interests you most?',
              value: answers.market,
              options: [['Compliance', 'compliance'], ['Property', 'property'], ['Insurance', 'insurance-risk'], ['Business lifecycle', 'business-lifecycle'], ['Digital platforms', 'digital-platforms']] as const,
              apply: (value: CategoryId) => updateAnswers({ ...answers, market: value }),
            },
            {
              label: 'What revenue model do you prefer?',
              value: answers.revenueModel,
              options: [['Affiliate commissions', 'affiliate'], ['Template sales', 'templates'], ['Subscription', 'subscription'], ['Consulting or service fees', 'consulting'], ['Marketplace or lead generation', 'marketplace']] as const,
              apply: (value: typeof answers.revenueModel) => updateAnswers({ ...answers, revenueModel: value }),
            },
            {
              label: 'What build complexity can you handle?',
              value: answers.complexity,
              options: [['Low', 'Low'], ['Medium', 'Medium'], ['High', 'High']] as const,
              apply: (value: BusinessComplexity) => updateAnswers({ ...answers, complexity: value }),
            },
            {
              label: 'Do you prefer B2B, B2C, or both?',
              value: answers.audience,
              options: [['B2B', 'B2B'], ['B2C', 'B2C'], ['Both', 'Both']] as const,
              apply: (value: 'B2B' | 'B2C' | 'Both') => updateAnswers({ ...answers, audience: value }),
            },
          ].map((question) => (
            <div key={question.label} className="mb-6">
              <p className="text-sm font-semibold text-slate-900">{question.label}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {question.options.map(([label, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => question.apply(value as never)}
                    className={`rounded-full px-4 py-2 text-sm transition-colors ${question.value === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Top recommendations</p>
          <div className="mt-5 space-y-4">
            {recommendations.map((business, index) => (
              <div key={business.slug} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Recommendation {index + 1}</p>
                <h3 className="mt-2 text-lg font-bold">{business.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{business.shortDescription}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/businesses/${business.slug}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    View business
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to={`/enquire?business=${business.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white">Enquire</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function submitEnquiry(payload: EnquiryPayload) {
  const response = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (response?.ok) return;

  const stored = JSON.parse(window.localStorage.getItem('rbp-enquiries') ?? '[]') as EnquiryPayload[];
  stored.push(payload);
  window.localStorage.setItem('rbp-enquiries', JSON.stringify(stored));
}

function EnquirePage() {
  useDocumentMeta('Enquire | Business-In-A-Box', 'Send an enquiry about a Business-In-A-Box concept, custom build, partnership, quote, or resource request.');
  const [params] = useSearchParams();
  const [form, setForm] = useState<EnquiryPayload>({
    name: '',
    email: '',
    phone: '',
    businessSlug: params.get('business') ?? '',
    enquiryType: 'Buy or build this business',
    budgetRange: '$5,000 - $15,000',
    timeline: '1-3 months',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryPayload, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const businessTitle = getBusinessBySlug(form.businessSlug ?? '')?.title;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof EnquiryPayload, string>> = {};
    if (!form.name || form.name.trim().length < 2) nextErrors.name = 'Please enter your full name.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!form.message || form.message.trim().length < 10) nextErrors.message = 'Please provide a little more context.';
    if (!form.enquiryType) nextErrors.enquiryType = 'Please choose an enquiry type.';
    if (!form.budgetRange) nextErrors.budgetRange = 'Please choose a budget range.';
    if (!form.timeline) nextErrors.timeline = 'Please choose a timeline.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setServerError(null);
    trackEvent('enquiry_started', { businessSlug: form.businessSlug });
    try {
      await submitEnquiry(form);
      trackEvent('enquiry_submitted', { businessSlug: form.businessSlug, enquiryType: form.enquiryType });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setServerError('Something went wrong while submitting your enquiry. Please try again.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Enquire</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Start the conversation</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">Send an enquiry for a selected concept, a quote, a custom build, a partnership discussion, or a resource request.</p>
        {businessTitle ? <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">Selected business: {businessTitle}</p> : null}
      </section>

      {submitted ? (
        <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-emerald-900">Enquiry received</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-800">Your enquiry has been recorded and is ready for follow-up.</p>
        </section>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ['Full name', 'name', 'text'],
              ['Email', 'email', 'email'],
              ['Phone', 'phone', 'text'],
            ].map(([label, field, type]) => (
              <label key={field} className="space-y-2 text-sm text-slate-700">
                <span className="font-semibold">{label}</span>
                <input
                  type={type}
                  value={(form as Record<string, string>)[field]}
                  onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
                {errors[field as keyof EnquiryPayload] ? <span className="text-xs text-rose-600">{errors[field as keyof EnquiryPayload]}</span> : null}
              </label>
            ))}

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-semibold">Business concept of interest</span>
              <select value={form.businessSlug ?? ''} onChange={(event) => setForm((current) => ({ ...current, businessSlug: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option value="">Choose a business</option>
                {businesses.map((business) => <option key={business.slug} value={business.slug}>{business.title}</option>)}
              </select>
            </label>

            {[
              ['Enquiry type', 'enquiryType', ['Buy or build this business', 'Partner', 'Request a quote', 'Get a custom Business-In-A-Box built', 'Request templates or resources']],
              ['Budget range', 'budgetRange', ['Under $1,000', '$1,000 - $5,000', '$5,000 - $15,000', '$15,000 - $50,000', '$50,000+']],
              ['Timeline', 'timeline', ['Immediately', 'This month', '1-3 months', '3-6 months', 'Just researching']],
            ].map(([label, field, options]) => (
              <label key={field} className={`space-y-2 text-sm text-slate-700 ${field === 'timeline' ? 'md:col-span-2' : ''}`}>
                <span className="font-semibold">{label}</span>
                <select value={(form as Record<string, string>)[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                  {(options as string[]).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            ))}

            <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
              <span className="font-semibold">Message</span>
              <textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} rows={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
              {errors.message ? <span className="text-xs text-rose-600">{errors.message}</span> : null}
            </label>
          </div>
          {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
          <button type="submit" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600">Submit enquiry</button>
        </form>
      )}
    </div>
  );
}

function AboutPage() {
  useDocumentMeta('About | Business-In-A-Box', 'Learn how Business-In-A-Box turns business concepts into sellable offers, lead-generation systems, and future-ready product foundations.');
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">About the model</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Business-In-A-Box is a sales-ready concept catalogue, not just an idea list</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>The aim is to turn raw business concepts into commercial offers that can be sold, compared, and eventually built as service businesses, lead-generation sites, template stores, or SaaS products.</p>
          <p>Each concept here is framed around who it serves, how it makes money, what it can sell first, and what the staged product roadmap looks like.</p>
          <p>That lets the catalogue act as a buyer-facing marketplace today and as a build pipeline for future products later.</p>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-transparent">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route path="/businesses/:slug" element={<BusinessDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/enquire" element={<EnquirePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}