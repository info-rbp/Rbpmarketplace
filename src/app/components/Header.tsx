import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingBag, Package, ArrowRightLeft, Wrench, Building2, Phone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NavItem {
  name: string;
  href?: string;
  children?: { name: string; href: string; description: string; icon: React.ElementType }[];
}

const navigation: NavItem[] = [
  {
    name: 'Buy',
    children: [
      {
        name: 'Businesses For Sale',
        href: '/businesses-for-sale',
        description: 'Ready-to-launch web apps & SaaS platforms',
        icon: ShoppingBag,
      },
      {
        name: 'Business-In-A-Box',
        href: '/business-in-a-box',
        description: 'Complete turnkey business solutions',
        icon: Package,
      },
    ],
  },
  {
    name: 'Sale Process',
    href: '/sale-process',
  },
  {
    name: 'Services',
    children: [
      {
        name: 'Custom Solutions',
        href: '/custom-solutions',
        description: 'Bespoke web apps built to your specs',
        icon: Wrench,
      },
      {
        name: 'Sell Your Business',
        href: '/sell-your-business',
        description: 'List your digital business on RBP',
        icon: Building2,
      },
    ],
  },
  {
    name: 'Contact',
    href: '/contact',
  },
];

function DropdownMenu({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const anyChildActive = item.children?.some((c) => isActive(c.href));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
          anyChildActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.name}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden">
          <div className="p-2">
            {item.children?.map((child) => {
              const Icon = child.icon;
              return (
                <Link
                  key={child.href}
                  to={child.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 rounded-lg px-3 py-3 transition-colors group ${
                    isActive(child.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive(child.href)
                        ? 'bg-blue-100'
                        : 'bg-gray-100 group-hover:bg-blue-100'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive(child.href)
                          ? 'text-blue-600'
                          : 'text-gray-500 group-hover:text-blue-600'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight">{child.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-snug">
                      {child.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const isActive = (href: string) => location.pathname === href;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RBP Marketplace
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.name} item={item} isActive={isActive} />
              ) : (
                <Link
                  key={item.name}
                  to={item.href!}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href!)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 pb-4 pt-2">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                if (item.children) {
                  const isExpanded = mobileExpanded === item.name;
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() =>
                          setMobileExpanded(isExpanded ? null : item.name)
                        }
                        className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {item.children.map((child) => {
                            const Icon = child.icon;
                            return (
                              <Link
                                key={child.href}
                                to={child.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                  isActive(child.href)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.href!}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.href!)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <Link
                to="/contact"
                className="mt-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white text-center hover:bg-blue-500 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
