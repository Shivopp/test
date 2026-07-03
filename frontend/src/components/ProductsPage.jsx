import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { getCategoriesFromProducts } from '../utils/categories';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import Footer from './Footer';

export default function ProductsPage() {
  const { products } = useAdmin();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  const categories = useMemo(() => getCategoriesFromProducts(products), [products]);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => (p.category || 'General') === activeCategory);
  }, [products, activeCategory]);

  const setCategory = (category) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      <Navbar />

      <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300 mb-3">Catalog</p>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight">
            {activeCategory || 'All Products'}
          </h1>
          <p className="text-sm text-gray-300 mt-3 max-w-xl">
            {activeCategory
              ? `Showing ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} in ${activeCategory}.`
              : `Browse our full collection of ${products.length} premium tech products.`}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-purple-300 hover:text-white mt-5 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !activeCategory
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat.name
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {cat.icon} {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">No products found</h3>
            <p className="text-sm text-gray-400 mt-1">
              {activeCategory
                ? `Nothing in "${activeCategory}" right now. Try another category.`
                : 'No products available yet.'}
            </p>
            {activeCategory && (
              <button
                onClick={() => setCategory('')}
                className="mt-6 px-6 py-2.5 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
