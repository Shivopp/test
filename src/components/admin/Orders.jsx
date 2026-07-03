import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function Orders() {
  const { recentOrders, updateOrderStatus, deleteOrder } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  const statusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Pending':   return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Cancelled': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'Shipped':   return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'Processing': return 'bg-blue-50 border-blue-200 text-blue-700';
      default:          return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const dotStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500';
      case 'Pending':   return 'bg-amber-500';
      case 'Cancelled': return 'bg-rose-500';
      case 'Shipped':   return 'bg-sky-500';
      case 'Processing': return 'bg-blue-500';
      default:          return 'bg-gray-400';
    }
  };

  const paymentIcon = (method) => {
    if (!method) return '❓';
    const m = method.toLowerCase();
    if (m.includes('upi')) return '📱';
    if (m.includes('card')) return '💳';
    if (m.includes('net')) return '🏦';
    if (m.includes('cash') || m.includes('cod')) return '💵';
    return '💰';
  };

  const paymentBadge = (method) => {
    if (!method) return 'bg-gray-50 text-gray-500';
    const m = method.toLowerCase();
    if (m.includes('upi')) return 'bg-violet-50 text-violet-700 border border-violet-100';
    if (m.includes('card')) return 'bg-blue-50 text-blue-700 border border-blue-100';
    if (m.includes('net')) return 'bg-teal-50 text-teal-700 border border-teal-100';
    if (m.includes('cash') || m.includes('cod')) return 'bg-amber-50 text-amber-700 border border-amber-100';
    return 'bg-gray-50 text-gray-600 border border-gray-100';
  };

  // Find dynamic status values from the live array for context synchronization
  const currentSelectedOrder = selectedOrder 
    ? (recentOrders || []).find(o => o._id === selectedOrder._id) || selectedOrder 
    : null;

  const filteredOrders = (recentOrders || []).filter(order => {
    const matchesSearch =
      !searchQuery ||
      (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order._id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.phone || '').includes(searchQuery);
    const matchesStatus = filterStatus === 'All' || (order.status || 'Pending') === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    // If the changed order is loaded in the detail drawer, sync its view properties instantly
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDelete = (orderId) => {
    setConfirmDeleteId(orderId);
  };

  const confirmDelete = async () => {
    const orderId = confirmDeleteId;
    setConfirmDeleteId(null);
    await deleteOrder(orderId);
    if (selectedOrder?._id === orderId) setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Fulfillment</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track checkouts, review customer info, and manage shipment status.</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['All', ...statusOptions].map(s => {
          const count = s === 'All'
            ? (recentOrders || []).length
            : (recentOrders || []).filter(o => (o.status || 'Pending') === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-xl border px-4 py-3 flex items-center gap-2 text-left transition ${
                filterStatus === s
                  ? 'border-purple-400 bg-purple-50 shadow-sm'
                  : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/40'
              }`}
            >
              {s !== 'All' && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotStyle(s)}`} />}
              <div>
                <p className="text-xs text-gray-400 font-medium">{s}</p>
                <p className={`text-lg font-bold ${filterStatus === s ? 'text-purple-700' : 'text-gray-900'}`}>{count}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, phone, order ID…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition placeholder:text-gray-300"
          />
        </div>
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-gray-400 hover:text-gray-600 px-2">
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-6 items-start">
        {/* Orders table */}
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all ${currentSelectedOrder ? 'flex-1' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-gray-400 text-sm">
                      <p className="text-3xl mb-2">📭</p>
                      {searchQuery || filterStatus !== 'All' ? 'No orders match your filter' : 'No orders yet'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = currentSelectedOrder?._id === order._id;
                    return (
                      <tr
                        key={order._id || order.id}
                        onClick={() => setSelectedOrder(isSelected ? null : order)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-50/60 border-l-2 border-l-purple-500'
                            : 'hover:bg-gray-50/50'
                        }`}
                      >
                        {/* Order ID & date */}
                        <td className="px-5 py-4">
                          <span className="font-bold text-purple-600 block text-xs truncate max-w-[100px]">
                            #{(order._id || order.id)?.slice(-8)?.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400 block mt-0.5">
                            {order.date
                              ? new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                              : 'Recent'}
                          </span>
                        </td>

                        {/* Customer info */}
                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900 block text-sm">{order.customerName || 'N/A'}</span>
                          <span className="text-xs text-gray-400 block mt-0.5 truncate max-w-[140px]">{order.email}</span>
                          {order.phone && (
                            <span className="text-xs text-gray-400 block mt-0.5">📞 {order.phone}</span>
                          )}
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${paymentBadge(order.paymentMethod)}`}>
                            {paymentIcon(order.paymentMethod)}
                            <span className="truncate max-w-[90px]">{order.paymentMethod || 'Not specified'}</span>
                          </span>
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            {(order.items || []).slice(0, 2).map((item, idx) => (
                              <div key={item._id || idx} className="text-xs text-gray-600">
                                {item.name} <span className="text-purple-600 font-bold">×{item.quantity}</span>
                              </div>
                            ))}
                            {(order.items || []).length > 2 && (
                              <span className="text-xs text-gray-400">+{order.items.length - 2} more</span>
                            )}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">
                          ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle(order.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyle(order.status)}`} />
                            {order.status || 'Pending'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-center" onClick={e => e.stopPropagation()}>
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => handleStatusUpdate(order._id || order.id, e.target.value)}
                            className="text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition cursor-pointer block mx-auto"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDelete(order._id || order.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition hover:underline block mx-auto mt-1.5"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Panel */}
        {currentSelectedOrder && (
          <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            {/* Panel header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">
                  Order #{currentSelectedOrder._id?.slice(-8)?.toUpperCase()}
                </p>
                <p className="text-purple-200 text-xs mt-0.5">
                  {currentSelectedOrder.date
                    ? new Date(currentSelectedOrder.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
                    : 'Recent order'}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xs transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[calc(100vh-16rem)] overflow-y-auto">

              {/* Status badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusStyle(currentSelectedOrder.status)}`}>
                  <span className={`w-2 h-2 rounded-full ${dotStyle(currentSelectedOrder.status)}`} />
                  {currentSelectedOrder.status || 'Pending'}
                </span>
                <select
                  value={currentSelectedOrder.status || 'Pending'}
                  onChange={(e) => handleStatusUpdate(currentSelectedOrder._id, e.target.value)}
                  className="text-xs font-medium bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition cursor-pointer"
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Customer Details */}
              <Section title="👤 Customer Details">
                <InfoRow label="Name" value={currentSelectedOrder.customerName || '—'} />
                <InfoRow label="Email" value={currentSelectedOrder.email || '—'} mono />
                <InfoRow label="Phone" value={currentSelectedOrder.phone ? `+91 ${currentSelectedOrder.phone}` : '—'} />
              </Section>

              {/* Delivery Address */}
              <Section title="📍 Delivery Address">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentSelectedOrder.address || 'No address provided'}
                </p>
              </Section>

              {/* Payment Method */}
              <Section title="💳 Payment Method">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${paymentBadge(currentSelectedOrder.paymentMethod)}`}>
                  <span className="text-base">{paymentIcon(currentSelectedOrder.paymentMethod)}</span>
                  {currentSelectedOrder.paymentMethod || 'Not specified'}
                </div>
              </Section>

              {/* Order Items */}
              <Section title={`🛍️ Items Ordered (${(currentSelectedOrder.items || []).length})`}>
                <div className="space-y-3">
                  {(currentSelectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 leading-snug">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ₹{(item.price || 0).toLocaleString('en-IN')} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-gray-900 whitespace-nowrap">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Order Total */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">₹{(currentSelectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center font-bold text-gray-900 text-base pt-3 border-t border-gray-200">
                  <span>Total Paid</span>
                  <span className="text-purple-700">₹{(currentSelectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(currentSelectedOrder._id)}
                className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 py-2.5 rounded-xl font-semibold text-xs transition"
              >
                🗑️ Delete This Order
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-modal-in">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-2xl mx-auto mb-4">
              🗑️
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1.5">Delete this order?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently remove order <span className="font-semibold text-gray-700">#{confirmDeleteId?.slice(-8)?.toUpperCase()}</span> from the database. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>

          <style>{`
            @keyframes modal-in {
              from { opacity: 0; transform: scale(0.95) translateY(8px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-modal-in { animation: modal-in 0.18s ease-out; }
          `}</style>
        </div>
      )}
    </div>
  );
}

// Helper components
function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
      <span className={`text-xs font-medium text-gray-800 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}