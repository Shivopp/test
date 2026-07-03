import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-gray-900 text-white shadow-sm'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartBadgeCount = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-6">

          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-200">
              <span className="text-white font-extrabold text-sm tracking-tighter">TK</span>
            </div>
            <div className="leading-none">
              <span className="block text-lg font-bold text-gray-900 tracking-tight">TechKraft</span>
              <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Premium Tech</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 border border-gray-100 rounded-full p-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all duration-200"
              aria-label="Shopping cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {cartBadgeCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartBadgeCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 max-w-[80px] truncate">{user.name}</span>
                </div>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex text-xs font-semibold text-gray-600 hover:text-purple-600 px-3 py-2 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition"
                  >
                    Admin
                  </Link>
                )}

                <Link
                  to="/my-orders"
                  className="hidden sm:inline-flex text-xs font-semibold text-gray-600 hover:text-purple-600 px-3 py-2 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition"
                >
                  My Orders
                </Link>

                <button
                  onClick={logout}
                  className="text-xs font-semibold text-gray-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-white bg-gray-900 hover:bg-purple-600 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-purple-500/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 pb-3 -mt-1 overflow-x-auto">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
        </nav>
      </div>
    </header>
  );
}