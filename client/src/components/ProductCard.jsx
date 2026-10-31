import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 capitalize">{product.category}</p>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400 text-sm">
            {'★'.repeat(Math.floor(product.rating || 0))}
            {'☆'.repeat(5 - Math.floor(product.rating || 0))}
          </div>
          <span className="text-gray-400 text-sm ml-1">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product._id)}
            disabled={product.stock === 0}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
