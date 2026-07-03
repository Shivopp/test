import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'Pay via UPI ID or QR code' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
];

export default function Checkout() {
  const { cartItems, getCartTotal, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = address, 2 = payment, 3 = review
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');

  const totalAmount = getCartTotal();
  const shipping = 0;

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateAddress = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = 'Full name is required';
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone.trim()))
      e.phone = 'Enter a valid 10-digit phone number';
    if (!address.street.trim()) e.street = 'Street address is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.state.trim()) e.state = 'State is required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode.trim()))
      e.pincode = 'Enter a valid 6-digit PIN code';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!paymentMethod) e.paymentMethod = 'Please select a payment method';
    if (paymentMethod === 'upi' && !upiId.trim()) e.upiId = 'UPI ID is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleAddressChange = (field, val) => {
    setAddress((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleNextStep = () => {
    if (step === 1 && validateAddress()) setStep(2);
    if (step === 2 && validatePayment()) setStep(3);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    const formattedAddress = `${address.fullName}, ${address.street}${address.landmark ? `, Near ${address.landmark}` : ''}, ${address.city}, ${address.state} – ${address.pincode}`;
    const success = await checkout({
      address: formattedAddress,
      fullAddress: address,
      paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label,
      phone: address.phone,
      fullName: address.fullName,
    });
    setPlacing(false);
    if (success) setOrderPlaced(true);
  };

  // ── Order Success Screen ───────────────────────────────────────────────────
  if (orderPlaced) {
    const selectedMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod);
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between font-sans antialiased">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Order Placed Successfully!</h2>
            <p className="text-sm text-gray-500 mb-8">Thank you, {address.fullName}! Your order has been confirmed.</p>
            <div className="text-left space-y-4 bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">📍 Delivering to</p>
                <p className="text-sm text-gray-700">{address.street}{address.landmark ? `, Near ${address.landmark}` : ''}, {address.city}, {address.state} – {address.pincode}</p>
                <p className="text-xs text-gray-400 mt-0.5">📞 {address.phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">💳 Payment</p>
                <p className="text-sm text-gray-700">{selectedMethod?.icon} {selectedMethod?.label}{paymentMethod === 'upi' && <span className="text-gray-400 ml-1">({upiId})</span>}</p>
              </div>
            </div>
            <Link to="/" className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm transition">Continue Shopping →</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Guard: empty cart ─────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between font-sans">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-24 text-center">
          <span className="text-5xl">🛒</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">Your cart is empty</h2>
          <p className="text-sm text-gray-400 mt-1 mb-6">Add some items before checking out.</p>
          <Link to="/" className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition">
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between font-sans antialiased">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-sm text-gray-400 mt-0.5">Complete your order in just a few steps</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10 max-w-sm">
          {[
            { n: 1, label: 'Address' },
            { n: 2, label: 'Payment' },
            { n: 3, label: 'Review' },
          ].map(({ n, label }, idx) => (
            <div key={n} className="flex items-center">
              <button
                onClick={() => step > n && setStep(n)}
                className={`flex items-center gap-2 ${step > n ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                    step === n
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : step > n
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}
                >
                  {step > n ? '✓' : n}
                </span>
                <span className={`text-xs font-semibold ${step === n ? 'text-purple-600' : step > n ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </button>
              {idx < 2 && <span className="mx-3 h-px w-10 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── Left panel ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* STEP 1 – Delivery Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Delivery Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name *" error={errors.fullName}>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={address.fullName}
                      onChange={e => handleAddressChange('fullName', e.target.value)}
                      className={inputCls(errors.fullName)}
                    />
                  </Field>

                  <Field label="Phone Number *" error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={address.phone}
                      onChange={e => handleAddressChange('phone', e.target.value.replace(/\D/g, ''))}
                      className={inputCls(errors.phone)}
                    />
                  </Field>

                  <Field label="Street / House No. *" error={errors.street} className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="House No., Street, Area, Colony"
                      value={address.street}
                      onChange={e => handleAddressChange('street', e.target.value)}
                      className={inputCls(errors.street)}
                    />
                  </Field>

                  <Field label="Landmark" error={errors.landmark} className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Nearby landmark (optional)"
                      value={address.landmark}
                      onChange={e => handleAddressChange('landmark', e.target.value)}
                      className={inputCls(false)}
                    />
                  </Field>

                  <Field label="City *" error={errors.city}>
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={e => handleAddressChange('city', e.target.value)}
                      className={inputCls(errors.city)}
                    />
                  </Field>

                  <Field label="State *" error={errors.state}>
                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={e => handleAddressChange('state', e.target.value)}
                      className={inputCls(errors.state)}
                    />
                  </Field>

                  <Field label="PIN Code *" error={errors.pincode}>
                    <input
                      type="text"
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      value={address.pincode}
                      onChange={e => handleAddressChange('pincode', e.target.value.replace(/\D/g, ''))}
                      className={inputCls(errors.pincode)}
                    />
                  </Field>
                </div>

                <button
                  onClick={handleNextStep}
                  className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm transition"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 2 – Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-4 border rounded-xl px-4 py-3 cursor-pointer transition ${
                        paymentMethod === m.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => { setPaymentMethod(m.id); setErrors(prev => ({ ...prev, paymentMethod: '' })); }}
                        className="accent-purple-600"
                      />
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{m.label}</p>
                        <p className="text-xs text-gray-400">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {errors.paymentMethod && (
                  <p className="text-xs text-rose-500 mt-2">{errors.paymentMethod}</p>
                )}

                {/* UPI ID field */}
                {paymentMethod === 'upi' && (
                  <div className="mt-4">
                    <Field label="UPI ID *" error={errors.upiId}>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={e => { setUpiId(e.target.value); setErrors(prev => ({ ...prev, upiId: '' })); }}
                        className={inputCls(errors.upiId)}
                      />
                    </Field>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold text-sm transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm transition"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 – Review & Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Address summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">📍 Delivery Address</h3>
                    <button onClick={() => setStep(1)} className="text-xs text-purple-600 hover:underline font-medium">Edit</button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{address.fullName} · {address.phone}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {address.street}{address.landmark ? `, Near ${address.landmark}` : ''}, {address.city}, {address.state} – {address.pincode}
                  </p>
                </div>

                {/* Payment summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">💳 Payment Method</h3>
                    <button onClick={() => setStep(2)} className="text-xs text-purple-600 hover:underline font-medium">Edit</button>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon} {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
                    {paymentMethod === 'upi' && <span className="text-gray-400 font-normal ml-1">({upiId})</span>}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">🛍️ Order Items ({cartItems.length})</h3>
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item._id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold text-sm transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition"
                  >
                    {placing ? 'Placing Order…' : '✅ Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right panel – Order Summary ───────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 sticky top-6">
            <h3 className="text-base font-bold text-gray-900">Order Summary</h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item._id} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">× {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-900 whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">🔒 Secure & encrypted checkout</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError) {
  return `w-full border ${hasError ? 'border-rose-400 focus:ring-rose-300' : 'border-gray-200 focus:ring-purple-300'} rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition placeholder:text-gray-300`;
}