import { Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Star } from 'lucide-react';
import { getBusinessesByType } from '../data/businesses';

export function BusinessInABoxPage() {
  const packages = getBusinessesByType('business-in-a-box');

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Package className="h-4 w-4" />
              Premium Complete Solutions
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Business-In-A-Box
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive, turnkey business solutions with everything you need to launch and scale.
              Each package includes the complete tech stack, business model, documentation, and dedicated support.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{pkg.title}</h2>
                      <p className="text-blue-100 text-lg">{pkg.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{pkg.price}</div>
                      <div className="text-blue-100 text-sm">base package</div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-700 text-lg mb-8">{pkg.longDescription}</p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        Base Inclusions
                      </h3>
                      <ul className="space-y-3">
                        {pkg.inclusions.slice(0, 10).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Optional Add-Ons</h3>
                      <ul className="space-y-3 mb-6">
                        {pkg.addOns?.slice(0, 5).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-xl font-bold text-gray-900 mb-4">Included Extras</h3>
                      <ul className="space-y-3">
                        {pkg.extras?.slice(0, 4).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={`/business/${pkg.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors flex-1"
                    >
                      View Full Details
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/sale-process"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      View Purchase Process
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need a Custom Business-In-A-Box?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We can build a complete turnkey business solution tailored to your specific industry, goals, and requirements.
          </p>
          <Link
            to="/custom-solutions"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Request Custom Solution
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
