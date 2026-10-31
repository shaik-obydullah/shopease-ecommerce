import { Trash } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const product = item.product;

  if (!product) return null;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/100'}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-primary-600 font-medium">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">${(product.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeItem(item._id)}
          className="text-red-500 hover:text-red-700 mt-1 transition"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
