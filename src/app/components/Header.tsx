import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/businesses', label: 'Businesses' },
  { to: '/categories', label: 'Categories' },
  { to: '/compare', label: 'Compare' },
  { to: '/assessment', label: 'Assessment' },
  { to: '/enquire', label: 'Enquire' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
            R
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              RBP Marketplace
            </div>
            <div className="text-lg font-bold text-slate-900">Business-In-A-Box</div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}