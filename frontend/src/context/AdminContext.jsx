import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { fireToast } from './ToastContext';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // Added a centralized loading state initialized to true
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalRevenue: 142350,
    salesGrowth: "+12%",
    totalOrders: 312,
    lowStockAlerts: 0,
  });

  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  
  const [weeklyRevenue, setWeeklyRevenue] = useState([
    { day: "Mon", value: 65 }, { day: "Tue", value: 45 }, { day: "Wed", value: 85 },
    { day: "Thu", value: 30 }, { day: "Fri", value: 90 }, { day: "Sat", value: 75 }, { day: "Sun", value: 50 },
  ]);

  // ==========================================
  // CONFIGURATION: ENVIRONMENT-AWARE API URLS
  // ==========================================
  const IS_PRODUCTION = import.meta.env.PROD;

  const API_URL = IS_PRODUCTION 
    ? "https://ecart-backend-yocf.onrender.com/api/products" 
    : "http://localhost:5000/api/products";

  const ORDERS_API_URL = IS_PRODUCTION 
    ? "https://ecart-backend-yocf.onrender.com/api/orders" 
    : "http://localhost:5000/api/orders";

  // ==========================================
  // 1. READ OPERATIONS (Fetch Products & Orders)
  // ==========================================
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products from database:", error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(ORDERS_API_URL);
      setRecentOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders from database:", error.message);
    }
  };

  // Run automatically when the context mounts and clear loading when finished
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true); // Start layout skeletons
      // Promise.all Settled keeps things moving even if one network route fails temporarily
      await Promise.allSettled([fetchProducts(), fetchOrders()]);
      setLoading(false); // Turn off layout skeletons safely
    };

    initializeData();
  }, []);

  // ==========================================
  // 2. PRODUCT CRUD OPERATIONS
  // ==========================================
  const addProduct = async (newProd) => {
    try {
      const response = await axios.post(API_URL, {
        name: newProd.name,
        price: Number(newProd.price),
        stock: Number(newProd.stock),
        category: newProd.category,
        image: newProd.image
      });
      setProducts((prev) => [...prev, response.data]);
      fireToast("Product added successfully!", "success");
    } catch (error) {
      console.error("Error adding product to database:", error.message);
      fireToast("Failed to save product to database.", "error");
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        name: updatedFields.name,
        price: Number(updatedFields.price),
        stock: Number(updatedFields.stock),
        category: updatedFields.category,
        image: updatedFields.image
      });
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? response.data : product))
      );
      fireToast("Product updated successfully!", "success");
    } catch (error) {
      console.error("Error updating product in database:", error.message);
      fireToast("Failed to save product updates.", "error");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts((prev) => prev.filter(p => p._id !== id));
      fireToast("Product deleted.", "success");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      fireToast("Failed to delete product.", "error");
    }
  };

  // ==========================================
  // 3. ORDER MANAGEMENT OPERATIONS
  // ==========================================
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${ORDERS_API_URL}/${orderId}`, { status: newStatus });
      setRecentOrders((prev) =>
        prev.map((order) => (order._id === orderId ? response.data : order))
      );
      fireToast(`Order status updated to "${newStatus}"`, "success");
    } catch (error) {
      console.error("Error updating order status:", error.message);
      fireToast("Failed to update order status.", "error");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${ORDERS_API_URL}/${orderId}`);
      setRecentOrders((prev) => prev.filter(order => order._id !== orderId));
      fireToast("Order deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting order:", error.message);
      fireToast("Failed to delete the order.", "error");
    }
  };

  return (
    <AdminContext.Provider 
      value={{ 
        loading, // Pass loading down so your Home grid switches seamlessly
        stats, 
        recentOrders, 
        weeklyRevenue, 
        products, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        updateOrderStatus,
        deleteOrder, 
        fetchOrders,
        fetchProducts 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);