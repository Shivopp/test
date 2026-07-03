import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result?.success) {
      const savedUser = JSON.parse(localStorage.getItem('eshop_user'));
      if (savedUser?.role === 'admin') {
        navigate('/admin');
      } else {
        toast.error('Access denied. This account does not have admin privileges.');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-rose-100 shadow-xl shadow-rose-500/5">
        <div className="text-center">
          <span className="text-4xl">🔐</span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 tracking-tight">Admin Portal</h2>
          <p className="text-xs text-gray-400 mt-1">Authorized personnel only.</p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleAdminLogin}>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</label>
            <input
              type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              placeholder="admin@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</label>
            <input
              type="password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-xl transition shadow-md shadow-rose-600/20"
          >
            {loading ? 'Verifying…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}