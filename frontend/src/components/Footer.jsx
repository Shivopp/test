import { Link } from 'react-router-dom';

const SHOP_LINKS = [
  { label: 'All Products', to: '/products' },
  { label: 'Phones', to: '/products?category=Phones' },
  { label: 'Laptops', to: '/products?category=Laptops' },
  { label: 'Gaming', to: '/products?category=Gaming' },
  { label: 'Smart Home', to: '/products?category=Smart%20Home' },
];

const SUPPORT_LINKS = [
  { label: 'Contact Us', href: '#contact' },
  { label: 'Shipping Info', href: '#shipping' },
  { label: 'Returns & Refunds', href: '#refund' },
  { label: 'FAQ', href: '#faq' },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-950 text-gray-400">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(79,70,229,0.1),_transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

            <div className="lg:col-span-5 space-y-5">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
                  <span className="text-white font-extrabold text-sm">TK</span>
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">TechKraft</span>
              </Link>
              <p className="text-sm leading-relaxed max-w-sm text-gray-400">
                Your trusted destination for premium tech — phones, laptops, gaming gear, and smart home devices delivered with care.
              </p>
              <div className="flex items-center gap-3 pt-1">
                {['𝕏', 'in', '▶'].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition"
                    aria-label="Social link"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Shop</h4>
              <ul className="space-y-3">
                {SHOP_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-purple-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Support</h4>
              <ul className="space-y-3">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-purple-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Stay Updated</h4>
              <p className="text-sm text-gray-500">Get deals on the latest tech drops.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition"
                />
                <button className="shrink-0 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} TechKraft. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#privacy" className="hover:text-gray-300 transition">Privacy</a>
            <a href="#terms" className="hover:text-gray-300 transition">Terms</a>
            <Link to="/admin-login" className="hover:text-purple-400 transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
