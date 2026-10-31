import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (user) {
        const { data } = await api.post('/cart', { productId, quantity });
        setCart(data);
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '{ "items": [] }');
        const existing = localCart.items.find(i => i.product === productId || i._id === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          localCart.items.push({ product: productId, quantity, _id: productId });
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCart(localCart);
      }
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (user) {
        const { data } = await api.put(`/cart/${itemId}`, { quantity });
        setCart(data);
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '{ "items": [] }');
        if (quantity <= 0) {
          localCart.items = localCart.items.filter(i => i._id !== itemId);
        } else {
          const item = localCart.items.find(i => i._id === itemId);
          if (item) item.quantity = quantity;
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCart(localCart);
      }
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      if (user) {
        const { data } = await api.delete(`/cart/${itemId}`);
        setCart(data);
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '{ "items": [] }');
        localCart.items = localCart.items.filter(i => i._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCart(localCart);
      }
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await api.delete('/cart');
      }
      localStorage.removeItem('cart');
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const cartCount = cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
