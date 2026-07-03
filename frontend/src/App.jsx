import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}