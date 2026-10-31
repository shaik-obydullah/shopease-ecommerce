import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search.trim()}`);
      setSearch('');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">ShopEase</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-gray-600 hover:text-primary-600 transition">
              Products
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary-600 transition">
                    <LayoutDashboard className="h-6 w-6" />
                  </Link>
                )}
                <Link to="/orders" className="text-gray-600 hover:text-primary-600 transition">
                  Orders
                </Link>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
                <button onClick={logout} className="text-gray-600 hover:text-red-600 transition">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 pb-4">
          <form onSubmit={handleSearch} className="my-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </form>
          <div className="flex flex-col gap-3">
            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-primary-600">
              Products
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-primary-600">
              Cart ({cartCount})
            </Link>
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-primary-600">
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-primary-600">
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-primary-600 font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
