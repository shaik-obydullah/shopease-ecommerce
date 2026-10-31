import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">ShopEase</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <div className="flex flex-col gap-2 text-gray-400 text-sm">
              <Link to="/products" className="hover:text-white transition">All Products</Link>
              <Link to="/products?category=electronics" className="hover:text-white transition">Electronics</Link>
              <Link to="/products?category=clothing" className="hover:text-white transition">Clothing</Link>
              <Link to="/products?category=home" className="hover:text-white transition">Home & Living</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <div className="flex flex-col gap-2 text-gray-400 text-sm">
              <Link to="/login" className="hover:text-white transition">Login</Link>
              <Link to="/register" className="hover:text-white transition">Register</Link>
              <Link to="/orders" className="hover:text-white transition">My Orders</Link>
              <Link to="/cart" className="hover:text-white transition">Cart</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="flex flex-col gap-2 text-gray-400 text-sm">
              <p>Email: support@shopease.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Shop St, NY 10001</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
