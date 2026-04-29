import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Headphones, TrendingUp } from 'lucide-react';
import { BusinessCard } from '../components/BusinessCard';
import { getFeaturedBusinesses } from '../data/businessStore';

export function HomePage() {
  const featuredListings = getFeaturedBusinesses().slice(0, 3);  // live from store

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Buy Ready-Made Digital Businesses
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Launch Your Empire Today
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              RBP Marketplace offers curated web applications, SaaS platforms, and complete business-in-a-box solutions.
              Skip months of development and launch your online business immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/businesses-for-sale"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
              >
                View Businesses For Sale
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/business-in-a-box"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Explore Business-In-A-Box
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RBP Marketplace?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to launch and scale your online business with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Launch Fast</h3>
              <p className="text-gray-600">
                Ready-made solutions mean you can launch your business in days, not months.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vetted Quality</h3>
              <p className="text-gray-600">
                Every business is built to professional standards with clean code and documentation.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Headphones className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Full Support</h3>
              <p className="text-gray-600">
                Comprehensive handover process with setup assistance and ongoing support options.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growth Ready</h3>
              <p className="text-gray-600">
                Scalable architecture designed to grow with your business and customer base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Opportunities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium digital businesses and web applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing, index) => (
              <BusinessCard key={index} {...listing} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/businesses-for-sale"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              View All Businesses
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Digital Business?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Book a discovery call with our team to discuss your goals and find the perfect business opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Book a Discovery Call
            </Link>
            <Link
              to="/custom-solutions"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Request Custom Solution
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
