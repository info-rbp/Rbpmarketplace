import { Link } from 'react-router-dom';
import { MessageCircle, Search, FileCheck, CreditCard, Settings, Rocket, Headphones, CheckCircle2 } from 'lucide-react';

export function SaleProcessPage() {
  const steps = [
    {
      number: '01',
      title: 'Initial Enquiry',
      icon: MessageCircle,
      description: 'Submit an enquiry through our contact form or book a discovery call. Share your goals, budget, and timeline.',
      details: [
        'Tell us which business interests you',
        'Discuss your technical requirements',
        'Share your launch timeline',
        'Get initial questions answered',
      ],
      timeframe: '1-2 business days',
    },
    {
      number: '02',
      title: 'Discovery & Consultation',
      icon: Search,
      description: 'Schedule a detailed consultation call to explore the business in depth and ensure it aligns with your goals.',
      details: [
        'Deep-dive into the business model',
        'Review technical architecture',
        'Discuss customization options',
        'Understand revenue potential',
      ],
      timeframe: '3-5 business days',
    },
    {
      number: '03',
      title: 'Proposal & Review',
      icon: FileCheck,
      description: 'Receive a comprehensive proposal with pricing, inclusions, add-ons, timeline, and terms. Review with our team.',
      details: [
        'Detailed pricing breakdown',
        'Scope of work document',
        'Timeline and milestones',
        'Terms and conditions',
      ],
      timeframe: '2-3 business days',
    },
    {
      number: '04',
      title: 'Agreement & Payment',
      icon: CreditCard,
      description: 'Sign the purchase agreement and complete payment. Flexible payment plans available for larger packages.',
      details: [
        'Sign digital agreement',
        'Process secure payment',
        'Receive purchase confirmation',
        'Access client portal',
      ],
      timeframe: '1-2 business days',
    },
    {
      number: '05',
      title: 'Setup & Onboarding',
      icon: Settings,
      description: 'Our team begins the setup and customization process. You receive access to staging environment and documentation.',
      details: [
        'Environment provisioning',
        'Initial customization',
        'Documentation delivery',
        'Training session scheduled',
      ],
      timeframe: '5-10 business days',
    },
    {
      number: '06',
      title: 'Handover & Launch',
      icon: Rocket,
      description: 'Complete training, receive all credentials and access, and launch your business with our technical support.',
      details: [
        'Full system training',
        'Credentials & access transfer',
        'Final testing & QA',
        'Go-live support',
      ],
      timeframe: '2-3 business days',
    },
    {
      number: '07',
      title: 'Post-Launch Support',
      icon: Headphones,
      description: 'Ongoing technical support, bug fixes, and guidance as you scale. Support duration depends on your package.',
      details: [
        'Technical support channel',
        'Bug fixes included',
        'Scaling guidance',
        'Optional maintenance plans',
      ],
      timeframe: 'Ongoing',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How The Sale Process Works
            </h1>
            <p className="text-lg text-gray-600">
              From initial enquiry to launch and beyond, we guide you through every step of acquiring
              and launching your digital business with complete transparency and support.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-20 h-full w-0.5 bg-gray-200 hidden sm:block" />
                  )}

                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white">
                          <Icon className="h-8 w-8" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                          {step.title}
                        </h3>
                        <span className="inline-flex items-center text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {step.timeframe}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{step.description}</p>

                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How long does the entire process take?
              </h3>
              <p className="text-gray-600">
                From initial enquiry to launch typically takes 2-4 weeks depending on the complexity of the business
                and any customization requirements. Business-In-A-Box packages may take longer due to their comprehensive nature.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What payment options are available?
              </h3>
              <p className="text-gray-600">
                We accept bank transfers, credit cards, and offer flexible payment plans for packages over $10,000.
                Typically, 50% is due upon signing, with the remaining 50% due before final handover.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What technical support is included?
              </h3>
              <p className="text-gray-600">
                All packages include post-launch technical support ranging from 3-6 months depending on the package tier.
                This covers bug fixes, technical questions, and guidance. Extended support plans are available.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Can I request customizations?
              </h3>
              <p className="text-gray-600">
                Yes! We offer customization options including branding, feature modifications, and integrations.
                These are discussed during the discovery phase and included in your proposal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Begin your journey to owning a profitable digital business today. Our team is ready to guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 hover:bg-gray-50 transition-colors"
            >
              Contact Us Today
            </Link>
            <Link
              to="/businesses-for-sale"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Available Businesses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
