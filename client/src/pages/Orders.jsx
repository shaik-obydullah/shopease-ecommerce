import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing': return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcon(order.status)}
                  <span className="capitalize font-medium">{order.status}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between">
                <span className="text-gray-600">Payment: <span className={`capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span></span>
                <span className="font-bold text-gray-900">Total: ${order.totalPrice.toFixed(2)}</span>
              </div>

              {order.trackingNumber && (
                <div className="mt-3 text-sm text-gray-500">
                  Tracking: <span className="font-mono">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
