import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* 404 Number */}
        <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-none">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto">
          Sorry, we couldn't find the page you're looking for. It may have been moved,
          deleted, or never existed.
        </p>

        {/* Quick links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <Link
            to="/businesses-for-sale"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Search className="h-5 w-5" />
            Browse Businesses
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 mb-4">Looking for one of these pages?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: 'Businesses For Sale', href: '/businesses-for-sale' },
              { label: 'Business-In-A-Box', href: '/business-in-a-box' },
              { label: 'Sale Process', href: '/sale-process' },
              { label: 'Custom Solutions', href: '/custom-solutions' },
              { label: 'Sell Your Business', href: '/sell-your-business' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
