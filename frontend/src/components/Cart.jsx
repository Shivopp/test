import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Add some items to your cart first!");
      return;
    }
    if (!user) {
      toast.info("Please sign in to your account before placing an order! 🛒");
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Shopping Cart</h1>
            {cartItems.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-sm font-medium text-rose-600 hover:text-rose-700 transition"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <span className="text-4xl">🛒</span>
              <h2 className="text-lg font-semibold text-gray-900 mt-4">Your cart is empty</h2>
              <p className="text-sm text-gray-400 mt-1 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-sm"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item._id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm max-w-xs truncate">{item.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">₹{item.price.toLocaleString('en-IN')} each</p>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-600 mt-2 block"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)}
                          className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 transition"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, 1)}
                          className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-gray-900 text-sm min-w-[70px] text-right">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                <div className="space-y-3 text-sm border-b border-gray-100 pb-4">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{getCartTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                </div>
                
                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm shadow-purple-600/10"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}