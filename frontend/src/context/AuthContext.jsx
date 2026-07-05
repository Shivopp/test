import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eshop_token') || null);
  const [loading, setLoading] = useState(true);

  // Derived, not stored — always computed from `user`, which itself is
  // always fetched fresh from the server (never read back out of
  // localStorage). This is what makes it un-spoofable via DevTools.
  const isAdmin = user?.role === 'admin';

  // 1. DYNAMIC ENVIRONMENT URL SWITCHER
  const IS_PRODUCTION = import.meta.env.PROD;
  const API_URL = IS_PRODUCTION
    ? "https://ecart-backend-yocf.onrender.com/api/auth"
    : "http://localhost:5000/api/auth";

  // Whenever the token changes (including on first load, from whatever
  // was saved in localStorage), verify it against the server and pull
  // the real user record back — including the real `role`. We never
  // trust a cached user object from localStorage for this, since that
  // JSON can be edited freely in DevTools. If the token is missing,
  // invalid, or expired, this clears the session.
  useEffect(() => {
    const syncSession = async () => {
      if (!token) {
        localStorage.removeItem('eshop_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setLoading(false);
        return;
      }

      localStorage.setItem('eshop_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const response = await axios.get(`${API_URL}/me`);
        setUser(response.data.user);
      } catch (error) {
        // Token is invalid/expired/tampered — force a clean logout
        setUser(null);
        setToken(null);
        localStorage.removeItem('eshop_token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    syncSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid username credentials";
      alert(msg);
      return { success: false, error: msg };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/admin-login`, {
        email,
        password
      });

      if (response.data.token) {
        setToken(response.data.token);
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
    localStorage.removeItem('eshop_token');
    alert("Logged out successfully. See you soon! 👋");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, adminLogin, login, register, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);