import { Link } from 'react-router-dom';
import { CheckCircle2, TrendingUp, Users, DollarSign, FileText, Handshake, Rocket, ArrowRight } from 'lucide-react';

export function SellYourBusinessPage() {
  const benefits = [
    {
      icon: Users,
      title: 'Qualified Buyer Network',
      description: 'Access our network of vetted entrepreneurs and investors actively seeking digital business opportunities.',
    },
    {
      icon: TrendingUp,
      title: 'Professional Marketing',
      description: 'We create compelling listings with professional descriptions, technical documentation, and visual assets.',
    },
    {
      icon: DollarSign,
      title: 'Optimal Pricing Strategy',
      description: 'Our team helps you price your business competitively based on market analysis and asset valuation.',
    },
    {
      icon: Handshake,
      title: 'Full Transaction Support',
      description: 'From initial enquiry to final handover, we manage the entire sales process on your behalf.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Initial Assessment',
      description: 'Submit your business for review. We evaluate the technical stack, business model, revenue potential, and market fit.',
      details: [
        'Technical audit of your application',
        'Business model evaluation',
        'Market opportunity analysis',
        'Documentation review',
      ],
    },
    {
      step: '02',
      title: 'Listing Preparation',
      description: 'Our team prepares a professional listing package that showcases your business in the best light.',
      details: [
        'Professional business description',
        'Technical documentation creation',
        'Asset organization & inventory',
        'Pricing strategy development',
      ],
    },
    {
      step: '03',
      title: 'Marketing & Outreach',
      description: 'We actively market your business to our buyer network and handle all enquiries and initial screening.',
      details: [
        'Featured placement on RBP Marketplace',
        'Email marketing to buyer network',
        'Social media promotion',
        'Buyer qualification & screening',
      ],
    },
    {
      step: '04',
      title: 'Sale & Handover',
      description: 'We facilitate negotiations, manage the transaction process, and ensure smooth handover to the buyer.',
      details: [
        'Buyer communication & negotiation',
        'Agreement preparation',
        'Secure payment processing',
        'Complete handover support',
      ],
    },
  ];

  const eligibility = [
    'Fully functional web application or SaaS platform',
    'Clean, documented source code',
    'Clear ownership of all assets and intellectual property',
    'Modern technology stack',
    'Revenue generating or clear monetization path',
    'Scalable architecture',
  ];

  const commission = [
    {
      range: 'Under $10,000',
      rate: '20% commission',
      description: 'Ideal for smaller applications and starter projects',
    },
    {
      range: '$10,000 - $25,000',
      rate: '15% commission',
      description: 'Most common range for established web applications',
    },
    {
      range: 'Over $25,000',
      rate: '10% commission',
      description: 'Premium businesses and comprehensive platforms',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Sell Your Digital Business
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mt-2">
                On RBP Marketplace
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Have you built a web application, SaaS platform, or digital business that's ready for a new owner?
              List it on RBP Marketplace and connect with qualified buyers who are ready to invest.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-green-500 transition-colors"
            >
              List Your Business
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Sell With RBP Marketplace?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We handle the complexity of selling your digital business so you can focus on what you do best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-100 mb-4">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes selling your business simple and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {process.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Requirements */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Is Your Business Eligible?
            </h2>
            <p className="text-lg text-gray-600">
              We list high-quality digital businesses that meet our standards for technical excellence and market potential.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Minimum Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibility.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We only succeed when you succeed. Our commission-based model aligns our interests with yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commission.map((tier, index) => (
              <div
                key={index}
                className={`rounded-xl p-8 border-2 text-center ${
                  index === 1
                    ? 'bg-white border-blue-500 shadow-lg'
                    : 'bg-white border-gray-200'
                }`}
              >
                {index === 1 && (
                  <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    Most Common
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tier.range}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">{tier.rate}</div>
                <p className="text-sm text-gray-600">{tier.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 max-w-4xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-2">What's Included in Our Service:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                Professional listing creation
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                Marketing to buyer network
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                Buyer screening & qualification
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                Transaction management
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                Negotiation support
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                Complete handover assistance
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Engagement Services */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <Rocket className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Additional Engagement Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need help preparing your business for sale? We offer additional services to maximize your sale price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Code Audit & Cleanup</h3>
              <p className="text-gray-600 mb-4">
                Professional code review, refactoring, and documentation to increase buyer confidence and value.
              </p>
              <p className="text-sm text-gray-500">Starting at $1,500</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Documentation Creation</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive technical and business documentation that buyers expect and value.
              </p>
              <p className="text-sm text-gray-500">Starting at $800</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">UI/UX Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Polish your application's design and user experience to maximize appeal and sale price.
              </p>
              <p className="text-sm text-gray-500">Starting at $2,000</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Feature Completion</h3>
              <p className="text-gray-600 mb-4">
                Complete unfinished features or add high-value functionality before listing.
              </p>
              <p className="text-sm text-gray-500">Custom pricing</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security Hardening</h3>
              <p className="text-gray-600 mb-4">
                Security audit and implementation of best practices to ensure buyer confidence.
              </p>
              <p className="text-sm text-gray-500">Starting at $1,200</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Demo & Marketing Content</h3>
              <p className="text-gray-600 mb-4">
                Professional demo videos, screenshots, and marketing materials for your listing.
              </p>
              <p className="text-sm text-gray-500">Starting at $600</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How long does it take to sell a business?
              </h3>
              <p className="text-gray-600">
                The timeline varies based on pricing, market demand, and business complexity. Most businesses sell within 4-12 weeks,
                though some may take longer or sell faster depending on buyer interest and market conditions.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What if my business doesn't sell?
              </h3>
              <p className="text-gray-600">
                There's no upfront fee to list your business. If it doesn't sell, you don't pay anything. We may suggest
                price adjustments, enhancements, or repositioning strategies to improve marketability.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Can I remain anonymous during the listing?
              </h3>
              <p className="text-gray-600">
                Yes, we can list your business anonymously. Buyers will see the business details but not your identity
                until you choose to reveal it during negotiations with qualified buyers.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Do you provide legal or tax advice?
              </h3>
              <p className="text-gray-600">
                We facilitate the sale process but recommend consulting with legal and tax professionals for advice specific
                to your situation. We can recommend trusted partners if needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Sell Your Digital Business?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Get started today by submitting your business for review. Our team will assess your opportunity
            and get back to you within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-green-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Submit Your Business
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/businesses-for-sale"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-green-600 transition-colors"
            >
              View Example Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
