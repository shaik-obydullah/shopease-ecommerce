import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, Star, Truck, Shield, CreditCard } from 'lucide-react';
import { useEffect } from 'react';
import api from '../utils/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products/featured');
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Shop the Latest Trends
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Discover amazing products at unbeatable prices. Quality guaranteed.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center gap-2"
              >
                Shop Now <ArrowRight className="h-5 w-5" />
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
            <Truck className="h-12 w-12 text-primary-600" />
            <div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-gray-500 text-sm">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
            <Shield className="h-12 w-12 text-primary-600" />
            <div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-gray-500 text-sm">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
            <CreditCard className="h-12 w-12 text-primary-600" />
            <div>
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-gray-500 text-sm">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
              <Link to={`/products/${product._id}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(Math.floor(product.rating || 0))}
                    {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
