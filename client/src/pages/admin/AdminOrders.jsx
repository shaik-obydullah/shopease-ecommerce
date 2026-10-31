import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const updatePayment = async (orderId, paymentStatus) => {
    try {
      await api.put(`/orders/${orderId}/payment`, { paymentStatus });
      toast.success('Payment status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Payment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-4">{order.user?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{order.items.length}</td>
                  <td className="py-3 px-4 font-medium">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updatePayment(order._id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <p className="text-gray-500 text-center py-8">No orders found</p>
        )}
      </div>
    </div>
  );
}
