import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r transition-all duration-300 flex-shrink-0 hidden md:block`}>
        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                  isActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
