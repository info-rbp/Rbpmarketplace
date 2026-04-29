import { useParams, Link, Navigate } from 'react-router-dom';
import { getBusinessById } from '../data/businesses';
import { ArrowLeft, CheckCircle2, Package, Code, Target, DollarSign, Users, ArrowRight } from 'lucide-react';

export function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const business = id ? getBusinessById(id) : undefined;

  if (!business) {
    return <Navigate to="/businesses-for-sale" replace />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={business.type === 'business-in-a-box' ? '/business-in-a-box' : '/businesses-for-sale'}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {business.type === 'business-in-a-box' ? 'Business-In-A-Box' : 'Businesses For Sale'}
          </Link>
        </div>
      </section>

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              {business.featured && (
                <div className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                  Featured Business
                </div>
              )}
              {!business.featured && (
                <div className="inline-block bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                  {business.category}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {business.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">{business.description}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">{business.price}</span>
                {business.price.includes('From') && (
                  <span className="text-gray-500">starting price</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
              <div className="space-y-4">
                <Link
                  to="/contact"
                  className="block w-full text-center rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  Enquire About This Business
                </Link>
                <Link
                  to="/sale-process"
                  className="block w-full text-center rounded-lg border-2 border-gray-300 bg-white px-6 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  View Purchase Process
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Questions? We typically respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Long Description */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Business</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{business.longDescription}</p>
          </div>
        </div>
      </section>

      {/* Key Details Grid */}
      {(business.businessModel || business.targetMarket || business.revenueModel) && (
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {business.businessModel && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Business Model</h3>
                  <p className="text-gray-600">{business.businessModel}</p>
                </div>
              )}

              {business.targetMarket && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Target Market</h3>
                  <p className="text-gray-600">{business.targetMarket}</p>
                </div>
              )}

              {business.revenueModel && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Revenue Model</h3>
                  <ul className="space-y-1">
                    {business.revenueModel.map((model, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">{model}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Inclusions */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {business.inclusions.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      {business.technicalDetails && (
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Code className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Technical Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Technology Stack</h3>
                <ul className="space-y-2">
                  {business.technicalDetails.stack.map((tech, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {business.technicalDetails.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Integrations</h3>
                <ul className="space-y-2">
                  {business.technicalDetails.integrations.map((integration, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {integration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add-Ons */}
      {business.addOns && business.addOns.length > 0 && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Optional Add-Ons</h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Enhance your business with these optional upgrades and customizations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.addOns.map((addon, index) => (
                <div key={index} className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{addon}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Extras */}
      {business.extras && business.extras.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Included Extras</h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Every purchase includes these valuable extras to ensure your success.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.extras.map((extra, index) => (
                <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-200">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{extra}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Interested in {business.title}?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Get in touch with our team to discuss this business opportunity, ask questions,
            or schedule a detailed consultation call.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Contact Us Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to={business.type === 'business-in-a-box' ? '/business-in-a-box' : '/businesses-for-sale'}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              View More Businesses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
