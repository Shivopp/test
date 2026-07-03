import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // <-- 1. Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- 2. Wrap Auth outer-most */}
      <AdminProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  </React.StrictMode>,
)