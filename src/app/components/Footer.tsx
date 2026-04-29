import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              RBP Marketplace
            </div>
            <p className="text-sm text-gray-400">
              Your trusted marketplace for ready-made web applications and online business opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/businesses-for-sale" className="hover:text-white transition-colors">
                  Businesses For Sale
                </Link>
              </li>
              <li>
                <Link to="/business-in-a-box" className="hover:text-white transition-colors">
                  Business-In-A-Box
                </Link>
              </li>
              <li>
                <Link to="/sale-process" className="hover:text-white transition-colors">
                  Sale Process
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/custom-solutions" className="hover:text-white transition-colors">
                  Custom Solutions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>info@rbpmarketplace.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Remote Business Partner</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RBP Marketplace by Remote Business Partner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
