import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const footerLinks = {
  buy: [
    { label: 'Businesses For Sale', href: '/businesses-for-sale' },
    { label: 'Business-In-A-Box', href: '/business-in-a-box' },
    { label: 'Sale Process', href: '/sale-process' },
  ],
  services: [
    { label: 'Custom Solutions', href: '/custom-solutions' },
    { label: 'Sell Your Business', href: '/sell-your-business' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top CTA strip */}
      <div className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-lg">Ready to start your digital business?</p>
            <p className="text-gray-400 text-sm">Book a free discovery call with our team today.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shrink-0"
          >
            Book a Discovery Call
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="block">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                RBP Marketplace
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted marketplace for ready-made web applications and online business opportunities.
              Built by Remote Business Partner.
            </p>
          </div>

          {/* Buy */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Buy</h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.buy.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <a href="mailto:info@rbpmarketplace.com" className="text-gray-400 hover:text-white transition-colors">
                  info@rbpmarketplace.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <a href="tel:+15551234567" className="text-gray-400 hover:text-white transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <span className="text-gray-400">Remote — Serving clients worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} RBP Marketplace by Remote Business Partner. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/sale-process" className="hover:text-gray-300 transition-colors">Sale Process</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
