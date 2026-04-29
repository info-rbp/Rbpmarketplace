import { BusinessCard } from '../components/BusinessCard';
import { Filter, X } from 'lucide-react';
import { getBusinessesByType } from '../data/businesses';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function BusinessForSalePage() {
  const allBusinesses = getBusinessesByType('standard');
  const categories = ['All', ...Array.from(new Set(allBusinesses.map((b) => b.category)))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered =
    activeCategory === 'All'
      ? allBusinesses
      : allBusinesses.filter((b) => b.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Businesses For Sale
            </h1>
            <p className="text-lg text-gray-600">
              Explore our selection of ready-to-launch web applications and digital products.
              Each business comes with complete source code, documentation, and handover support.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b border-gray-200 bg-white sticky top-20 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600 shrink-0">
              <span className="font-semibold text-gray-900">{filtered.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{allBusinesses.length}</span> businesses
            </p>

            {/* Desktop category pills */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile filter toggle */}
            <button
              className="md:hidden inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {filterOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              {filterOpen ? 'Close' : 'Filter'}
            </button>
          </div>

          {/* Mobile filter drawer */}
          {filterOpen && (
            <div className="md:hidden mt-3 flex flex-wrap gap-2 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setFilterOpen(false); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-gray-500 mb-4">No businesses found in this category.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="text-blue-600 font-semibold hover:underline"
              >
                View all businesses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Don't See What You're Looking For?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We can build a custom web application or digital business tailored to your specific requirements and goals.
          </p>
          <Link
            to="/custom-solutions"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Request Custom Solution
          </Link>
        </div>
      </section>
    </div>
  );
}
