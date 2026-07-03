import { Link } from 'react-router-dom';

export default function ProductCard({ product, addToCart, showCategoryLink = true }) {
  const inStock = product.stock > 0;

  return (
    <article className="group bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!inStock && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </div>

      <div className="flex-1">
        {showCategoryLink ? (
          <Link
            to={`/products?category=${encodeURIComponent(product.category || 'General')}`}
            className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md mb-2 hover:bg-purple-100 transition"
          >
            {product.category || 'General'}
          </Link>
        ) : (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md mb-2">
            {product.category || 'General'}
          </span>
        )}
        <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug">{product.name}</h3>

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-extrabold text-gray-950">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              inStock ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            }`}
          >
            {inStock ? `${product.stock} left` : 'Out of Stock'}
          </span>
        </div>
      </div>

      <button
        onClick={() => addToCart(product)}
        disabled={!inStock}
        className={`w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition ${
          inStock
            ? 'bg-gray-900 text-white hover:bg-purple-600 shadow-sm'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {inStock ? 'Add to Cart' : 'Unavailable'}
      </button>
    </article>
  );
}
