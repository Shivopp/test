import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { fireToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('eshop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('eshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    fireToast(`${product.name} added to cart!`, 'success');
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  const checkout = async (customerDetails) => {
    if (!user) {
      fireToast("Please sign in before placing an order!", 'warning');
      return false;
    }

    try {
      const IS_PRODUCTION = import.meta.env.PROD;
      const CHECKOUT_URL = IS_PRODUCTION
        ? "https://ecart-backend-yocf.onrender.com/api/orders"
        : "http://localhost:5000/api/orders";

      const safeName = customerDetails?.fullName || user.name;
      const safeEmail = user.email;
      const safeAddress = customerDetails?.address || "Address not provided";
      const safePaymentMethod = customerDetails?.paymentMethod || "Not specified";
      const safePhone = customerDetails?.phone || "";

      if (!cartItems || cartItems.length === 0) {
        fireToast("Your shopping cart is empty!", 'warning');
        return false;
      }

      const response = await axios.post(CHECKOUT_URL, {
        customerName: safeName,
        email: safeEmail,
        address: safeAddress,
        paymentMethod: safePaymentMethod,
        phone: safePhone,
        items: cartItems.map(item => ({
          productId: String(item._id || item.id || "dummy-id-123"),
          name: item.name || "Unknown Item",
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0)
        })),
        totalAmount: Number(getCartTotal() || 0)
      });

      clearCart();
      return true;
    } catch (error) {
      fireToast(`Checkout failed: ${error.response?.data?.message || error.message}`, 'error');
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount, checkout }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);