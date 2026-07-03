import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eshop_token') || null);
  const [loading, setLoading] = useState(true);

  // 1. DYNAMIC ENVIRONMENT URL SWITCHER
  const IS_PRODUCTION = import.meta.env.PROD;
  const API_URL = IS_PRODUCTION 
    ? "https://ecart-backend-yocf.onrender.com/api/auth" 
    : "http://localhost:5000/api/auth";

  useEffect(() => {
    if (token) {
      localStorage.setItem('eshop_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('eshop_token');
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    const savedUser = localStorage.getItem('eshop_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 2. REGISTER ACTION (Using Dynamic URL)
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { 
        name, 
        email, 
        password 
      });
      
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('eshop_user', JSON.stringify(response.data.user));
        alert(`Welcome aboard, ${response.data.user.name}! 🎉`);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration endpoint connection failure";
      alert(msg);
      return { success: false, error: msg };
    }
  };

  // 3. LOGIN ACTION (Using Dynamic URL)
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { 
        email, 
        password 
      });
      
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('eshop_user', JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid username credentials";
      alert(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('eshop_user');
    localStorage.removeItem('eshop_token');
    alert("Logged out successfully. See you soon! 👋");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);