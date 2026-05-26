import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';

export function NotFoundPage() {
  useDocumentMeta('Page Not Found | Business-In-A-Box', 'Return to the RBP Marketplace catalogue.');

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-slate-950 px-8 py-14 text-white shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">404</p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">That page could not be found</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          The link may be outdated, or the page may have moved while the catalogue was being updated.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            to="/businesses"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
            Browse businesses
          </Link>
        </div>
      </section>
    </div>
  );
}
