import { Link } from 'react-router-dom';
import { getCategoriesFromProducts } from '../utils/categories';

export default function ProductCategories({ products }) {
  const categories = getCategoriesFromProducts(products);

  if (!categories.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 mb-3">Browse</p>
        <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-gray-900">
          Shop by Category
        </h2>
        <p className="text-sm text-gray-500 mt-3">
          Jump straight into the tech you need — phones, laptops, gaming, and more.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            <div className="p-4 md:p-5 flex flex-col h-full min-h-[160px]">
              <span className="text-2xl mb-2">{cat.icon}</span>
              <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">{cat.name}</h3>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 flex-1">{cat.description}</p>
              <p className="text-[10px] font-semibold text-purple-600 mt-3 uppercase tracking-wider">
                {cat.count} {cat.count === 1 ? 'item' : 'items'} →
              </p>
            </div>

            <div className="absolute -right-2 -bottom-2 w-20 h-20 md:w-24 md:h-24 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-300">
              <img src={cat.image} alt="" className="w-full h-full object-cover rounded-xl" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
