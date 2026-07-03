import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import ProductsPage from './components/ProductsPage';
import Cart from './components/Cart';
import Login from './components/Login';
import Checkout from './components/Checkout';
import MyOrders from './components/MyOrders';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import Products from './components/admin/Products';
import Orders from './components/admin/Orders';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* PROTECTED USER ROUTES */}
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

              {/* PROTECTED ADMIN ROUTES */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
              </Route>
            </Routes>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}