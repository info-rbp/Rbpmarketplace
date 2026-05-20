import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Business-In-A-Box
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            Ready-to-launch businesses, packaged to be sold, built, or partnered on.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
            RBP Marketplace helps buyers and operators explore practical Business-In-A-Box
            opportunities across compliance, property, insurance, digital services, and
            business growth categories.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Explore
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/businesses">All businesses</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/compare">Compare</Link>
            <Link to="/assessment">Assessment</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Work With Us
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/enquire">Start an enquiry</Link>
            <Link to="/about">How Business-In-A-Box works</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Admin
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/admin/login">Admin login</Link>
            <Link to="/admin">Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}