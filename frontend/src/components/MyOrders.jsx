import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const IS_PRODUCTION = import.meta.env.PROD;
const ORDERS_API_URL = IS_PRODUCTION
  ? 'https://ecart-backend-yocf.onrender.com/api/orders'
  : 'http://localhost:5000/api/orders';

const statusStyle = (status) => {
  switch (status) {
    case 'Delivered':  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Pending':    return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Cancelled':  return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Shipped':    return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
    default:           return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const statusDot = (status) => {
  switch (status) {
    case 'Delivered':  return 'bg-emerald-500';
    case 'Pending':    return 'bg-amber-500';
    case 'Cancelled':  return 'bg-rose-500';
    case 'Shipped':    return 'bg-sky-500';
    case 'Processing': return 'bg-blue-500';
    default:           return 'bg-gray-400';
  }
};

const paymentIcon = (method) => {
  if (!method) return '❓';
  const m = method.toLowerCase();
  if (m.includes('upi'))  return '📱';
  if (m.includes('card')) return '💳';
  if (m.includes('net'))  return '🏦';
  if (m.includes('cash') || m.includes('cod')) return '💵';
  return '💰';
};

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`${ORDERS_API_URL}/myorders/${user.email}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between font-sans antialiased">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track and review your past purchases</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <span className="text-5xl">📦</span>
            <h2 className="text-lg font-bold text-gray-900 mt-4">No orders yet</h2>
            <p className="text-sm text-gray-400 mt-1 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition"
            >
              Shop Now →
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(order => {
              const isExpanded = expandedOrder === order._id;
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Order header row */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition"
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Order ID + date */}
                      <div>
                        <p className="text-xs font-bold text-purple-600">
                          #{order._id?.slice(-8)?.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(order.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot(order.status)}`} />
                        {order.status || 'Pending'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-gray-900">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </p>
                      <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 space-y-5">

                      {/* Items */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                          🛍️ Items Ordered ({order.items?.length})
                        </p>
                        <div className="space-y-3">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  ₹{(item.price || 0).toLocaleString('en-IN')} × {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-gray-900">
                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery + Payment */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">📍 Delivery Address</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{order.address || '—'}</p>
                          {order.phone && (
                            <p className="text-xs text-gray-400 mt-1.5">📞 {order.phone}</p>
                          )}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">💳 Payment Method</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {paymentIcon(order.paymentMethod)} {order.paymentMethod || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Total Paid</span>
                        <span className="text-base font-bold text-purple-700">
                          ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
