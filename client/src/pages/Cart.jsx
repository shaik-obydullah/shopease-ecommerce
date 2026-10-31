import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-20 w-20 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">Add some products to get started</p>
        <Link
          to="/products"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-sm text-primary-600">Free shipping on orders over $100</p>
            )}
            <div className="border-t pt-3 flex justify-between text-gray-900 font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/products"
            className="mt-3 w-full text-primary-600 py-3 rounded-lg font-medium hover:text-primary-700 transition flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
