import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getCategoriesFromProducts } from '../utils/categories';
import Navbar from './Navbar';
import ProductCategories from './ProductCategories';
import ProductCard from './ProductCard';
import Testimonial from './Testimonial';
import Footer from './Footer';

const FEATURED_LIMIT = 8;

function HeroSlideshow({ products, addToCart }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % products.length);
  }, [current, products.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + products.length) % products.length);
  }, [current, products.length, goTo]);

  useEffect(() => {
    if (products.length <= 1) return;
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next, products.length]);

  const pauseTimer = () => clearInterval(timerRef.current);
  const resumeTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4000);
  };

  if (!products.length) return null;

  const product = products[current];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 shadow-2xl shadow-purple-900/20"
      style={{ minHeight: '460px' }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(168,85,247,0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1),_transparent_50%)]" />

      {products.map((p, i) => (
        <div
          key={p._id}
          className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-8 md:px-14 py-12 md:py-16"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? 'translateX(0)' : i < current ? 'translateX(-40px)' : 'translateX(40px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          <div className="md:col-span-6 space-y-5 z-10">
            <Link
              to={`/products?category=${encodeURIComponent(p.category || 'General')}`}
              className="inline-block text-xs font-bold uppercase tracking-widest text-purple-300 bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition"
            >
              {p.category || 'Featured'}
            </Link>
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white leading-tight">
              {p.name}
            </h1>
            <p className="text-3xl font-extrabold text-white">
              ₹{Number(p.price).toLocaleString('en-IN')}
            </p>
            <p className={`text-sm font-medium ${p.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {p.stock > 0 ? `In Stock — ${p.stock} units available` : 'Currently unavailable'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => addToCart(p)}
                disabled={p.stock === 0}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                  p.stock > 0
                    ? 'bg-white text-gray-900 hover:bg-purple-100 active:scale-95 shadow-lg'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <Link
                to="/products"
                className="px-8 py-3 rounded-full text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition"
              >
                View All
              </Link>
            </div>
          </div>

          <div className="md:col-span-6 flex items-center justify-center h-full">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-75" />
              <img
                src={p.image}
                alt={p.name}
                className="relative max-h-72 md:max-h-80 w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 flex items-center justify-center transition text-white text-xl"
        aria-label="Previous product"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 flex items-center justify-center transition text-white text-xl"
        aria-label="Next product"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all rounded-full ${
              i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-5 right-5 z-20 text-xs font-semibold text-white/70 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
        {current + 1} / {products.length}
      </div>
    </div>
  );
}

function StatsBar({ products }) {
  const categories = useMemo(() => getCategoriesFromProducts(products), [products]);

  const stats = [
    { label: 'Products', value: products.length },
    { label: 'Categories', value: categories.length },
    { label: 'In Stock', value: products.filter((p) => p.stock > 0).length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
      <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 md:p-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustStrip() {
  const perks = [
    { icon: '🚚', title: 'Fast Delivery', desc: 'Ships within 24 hrs' },
    { icon: '🔒', title: 'Secure Checkout', desc: 'Safe & encrypted' },
    { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
    { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {perks.map((perk) => (
          <div
            key={perk.title}
            className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <span className="text-2xl">{perk.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{perk.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { products } = useAdmin();
  const { addToCart } = useCart();
  const featuredProducts = products.slice(0, FEATURED_LIMIT);

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        {products.length === 0 ? (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 px-8 py-16 md:px-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[420px] shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(168,85,247,0.2),_transparent_60%)]" />
            <div className="md:col-span-5 space-y-6 relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">Welcome to TechKraft</p>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white leading-tight">
                Premium tech <br />
                <span className="italic text-purple-200">gadgets</span> & accessories
              </h1>
              <p className="text-sm text-gray-300 max-w-sm">
                Discover the latest phones, laptops, gaming gear, and smart home devices — all in one place.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="bg-white text-gray-900 text-sm font-semibold px-8 py-3 rounded-full hover:bg-purple-100 transition-colors shadow-lg"
                >
                  Browse Products
                </Link>
              </div>
            </div>
            <div className="md:col-span-7 flex items-center justify-center min-h-[280px] relative z-10">
              <img
                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=80"
                alt="Tech showcase"
                className="w-full max-w-md rounded-2xl object-contain shadow-2xl"
              />
            </div>
          </section>
        ) : (
          <>
            <HeroSlideshow products={products} addToCart={addToCart} />
            <StatsBar products={products} />
          </>
        )}
      </div>

      {products.length > 0 && <ProductCategories products={products} />}

      <TrustStrip />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 mb-2">Trending</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">Hand-picked tech from our latest arrivals.</p>
          </div>
          {products.length > FEATURED_LIMIT && (
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition shrink-0"
            >
              View all {products.length} products →
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <span className="text-4xl">📦</span>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">No Products Available</h3>
            <p className="text-sm text-gray-400 mt-1">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block px-8 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-purple-600 transition shadow-md"
            >
              Explore Full Catalog
            </Link>
          </div>
        )}
      </section>

      <Testimonial />
      <Footer />
    </div>
  );
}
