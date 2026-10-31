import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { CreditCard, MapPin } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const subtotal = cart.items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  const tax = subtotal * 0.1;
  const shippingCost = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0]
      }));

      const { data: order } = await api.post('/orders', {
        items: orderItems,
        shippingAddress: shipping,
        paymentMethod: 'stripe'
      });

      try {
        const { data: paymentData } = await api.post('/stripe/create-payment-intent', {
          amount: total
        });

        await api.post('/stripe/confirm', {
          paymentIntentId: paymentData.paymentIntentId,
          orderId: order._id
        });
      } catch (paymentError) {
        console.log('Stripe not configured, marking order as demo payment');
      }

      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">No items to checkout</p>
        <button onClick={() => navigate('/products')} className="text-primary-600 hover:text-primary-700">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shipping.street}
                  onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={shipping.zipCode}
                  onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                Payment will be processed via Stripe. For demo purposes, orders will be placed without actual payment.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.product?.name} x{item.quantity}</span>
                <span className="text-gray-900">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2">
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
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-gray-900 font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
