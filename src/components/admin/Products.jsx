import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';

export default function Products() {
  const { products, addProduct, deleteProduct, updateProduct } = useAdmin();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. This tracks WHICH product you want to edit. If it's null, it means we are adding a new product!
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: '', image: '' });

  // 2. This hook watches closely: whenever editingProduct changes, it copies its old data into the form inputs!
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        stock: editingProduct.stock,
        category: editingProduct.category || '',
        image: editingProduct.image || ''
      });
    } else {
      setFormData({ name: '', price: '', stock: '', category: '', image: '' });
    }
  }, [editingProduct]);

  const handleOpenAddModal = () => {
    setEditingProduct(null); // Clean out any old data so the form is blank
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product); // Lock in the product we want to modify
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '', category: '', image: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return toast.warning("Please fill in all required fields");

    const imgUrl = formData.image.trim() || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150";

    // 3. SMART BUTTON SWITCH: Checks if we are editing an item or creating a new one
    if (editingProduct) {
      updateProduct(editingProduct._id, { ...formData, image: imgUrl });
    } else {
      addProduct({ ...formData, image: imgUrl });
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Catalog</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage stock units and cloud records.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-sm gap-2"
        >
          <span>➕</span> Add New Product
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Availability</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-11 h-11 rounded-xl object-cover" />
                    <span className="font-semibold text-gray-950 block max-w-xs truncate">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">{product.category || 'General'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">{product.stock} units</td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)} // <-- Opens form pre-filled with data!
                        className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DYNAMIC FORM MODAL (HANDLES BOTH ADD & EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative w-full max-w-md bg-white p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            
            {/* Dynamic Modal Heading Text */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingProduct ? 'Modify Product Details' : 'Register New Item'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Product Title *</label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number" required value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Stock Count *</label>
                  <input
                    type="number" required value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                <input
                  type="text" value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Product Image Link</label>
                <input
                  type="url" value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCloseModal} className="flex-1 text-sm font-semibold text-gray-500 bg-gray-50 py-2.5 rounded-xl">
                  Dismiss
                </button>
                <button type="submit" className="flex-1 text-sm font-semibold text-white bg-purple-600 py-2.5 rounded-xl shadow-sm">
                  {editingProduct ? 'Save Updates' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}