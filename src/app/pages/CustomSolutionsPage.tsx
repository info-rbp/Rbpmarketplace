import { Link } from 'react-router-dom';
import { Code, Palette, Zap, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export function CustomSolutionsPage() {
  const services = [
    {
      icon: Code,
      title: 'Custom Web Applications',
      description: 'Bespoke web applications built to your exact specifications with modern tech stacks and scalable architecture.',
      features: [
        'Full-stack development',
        'API & database design',
        'Custom feature development',
        'Third-party integrations',
      ],
    },
    {
      icon: Palette,
      title: 'Complete Business Packages',
      description: 'Turnkey business solutions with everything needed to launch, from branding to deployment and marketing.',
      features: [
        'Business model design',
        'Brand identity & design',
        'Technical development',
        'Launch & marketing strategy',
      ],
    },
    {
      icon: Zap,
      title: 'SaaS Platform Development',
      description: 'Build your own SaaS platform with subscription billing, user management, and growth-ready infrastructure.',
      features: [
        'Multi-tenant architecture',
        'Subscription & billing',
        'User onboarding flows',
        'Analytics & reporting',
      ],
    },
    {
      icon: Users,
      title: 'Marketplace Solutions',
      description: 'Multi-sided marketplace platforms that connect buyers and sellers with powerful management tools.',
      features: [
        'Vendor & buyer portals',
        'Payment processing',
        'Search & filtering',
        'Reviews & ratings',
      ],
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery',
      description: 'We discuss your vision, goals, target market, and technical requirements in detail.',
    },
    {
      step: '02',
      title: 'Strategy',
      description: 'Our team develops a comprehensive strategy, architecture plan, and project timeline.',
    },
    {
      step: '03',
      title: 'Development',
      description: 'Agile development sprints with regular check-ins, demos, and feedback sessions.',
    },
    {
      step: '04',
      title: 'Delivery',
      description: 'Complete handover with documentation, training, deployment, and ongoing support.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Custom Solutions
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Built For Your Vision
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Remote Business Partner creates custom web applications, SaaS platforms, and complete digital businesses
              tailored to your specific industry, goals, and requirements.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
            >
              Request Custom Solution
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What We Build
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From simple web applications to complex SaaS platforms, we build solutions that scale with your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-100 mb-4">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We follow a proven process to ensure your custom solution exceeds expectations and delivers real business value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Example Use Cases
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how we've helped businesses launch custom solutions across various industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Estate Platform</h3>
              <p className="text-gray-600 mb-4">
                Custom property listing platform with virtual tours, CRM integration, and automated lead capture.
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Timeline:</span> 8 weeks
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare Booking System</h3>
              <p className="text-gray-600 mb-4">
                HIPAA-compliant appointment scheduling with patient portals, telehealth, and billing integration.
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Timeline:</span> 12 weeks
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">E-Learning Platform</h3>
              <p className="text-gray-600 mb-4">
                Custom LMS with course creation, student progress tracking, certifications, and payment processing.
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Timeline:</span> 10 weeks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Investment Range
            </h2>
            <p className="text-lg text-gray-600">
              Custom solutions are priced based on scope, complexity, and timeline. Here are typical ranges:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Simple Projects</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">$5K - $15K</div>
              <p className="text-sm text-gray-600">Landing pages, simple web apps, basic integrations</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-blue-500 text-center shadow-lg">
              <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Most Popular
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Standard Projects</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">$15K - $40K</div>
              <p className="text-sm text-gray-600">Full web applications, SaaS MVPs, marketplace platforms</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Complex Projects</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">$40K+</div>
              <p className="text-sm text-gray-600">Enterprise platforms, complex SaaS, custom integrations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Let's Build Your Vision Together
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Schedule a free discovery call to discuss your project. We'll explore your requirements,
            provide expert guidance, and deliver a detailed proposal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Book a Discovery Call
            </Link>
            <Link
              to="/businesses-for-sale"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Ready-Made Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
