import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { path: '/admin', name: 'Dashboard Overview', icon: '📊' },
    { path: '/admin/products', name: 'Inventory Catalog', icon: '📦' },
    { path: '/admin/orders', name: 'Order Processing', icon: '🛒' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 h-screen">
      {/* Top Header Branding Brand */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
            <span>⚡</span> TechKraft Admin
          </span>
        </div>
        
        {/* Navigation Action Links */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'} // Prevents dashboard highlight on sub-routes
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                    : 'hover:bg-slate-800/60 hover:text-slate-100'
                }`
              }
            >
              <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer Back to Store option */}
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition"
        >
          <span>⬅️</span> Back to Storefront
        </NavLink>
      </div>
    </aside>
  );
}