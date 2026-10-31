import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-5 w-5" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/600x400'}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
          {product.images?.length > 1 && (
            <div className="flex gap-2 p-4">
              {product.images.map((img, i) => (
                <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-primary-500" />
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-primary-600 text-sm font-medium uppercase">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          {product.brand && <p className="text-gray-500 mt-1">by {product.brand}</p>}

          <div className="flex items-center gap-2 mt-4">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating || 0))}
              {'☆'.repeat(5 - Math.floor(product.rating || 0))}
            </div>
            <span className="text-gray-500 text-sm">({product.numReviews || 0} reviews)</span>
          </div>

          <p className="text-3xl font-bold text-gray-900 mt-6">${product.price.toFixed(2)}</p>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6">
            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>

          {product.stock > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => addToCart(product._id, quantity)}
            disabled={product.stock === 0}
            className="mt-8 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
