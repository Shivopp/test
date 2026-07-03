export const CATEGORY_META = {
  Tablets: {
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80',
    description: 'Portable power for work & creativity',
    gradient: 'from-violet-500 to-indigo-600',
    icon: '📱',
  },
  Smartwatches: {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
    description: 'Track fitness & stay connected',
    gradient: 'from-rose-500 to-pink-600',
    icon: '⌚',
  },
  Phones: {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
    description: 'Latest smartphones & flagships',
    gradient: 'from-blue-500 to-cyan-600',
    icon: '📲',
  },
  Laptops: {
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
    description: 'Performance machines for every need',
    gradient: 'from-slate-600 to-slate-900',
    icon: '💻',
  },
  Speakers: {
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=80',
    description: 'Premium audio on the go',
    gradient: 'from-amber-500 to-orange-600',
    icon: '🔊',
  },
  'Smart Home': {
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80',
    description: 'Automate your living space',
    gradient: 'from-emerald-500 to-teal-600',
    icon: '🏠',
  },
  Accessories: {
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=500&q=80',
    description: 'Essential tech add-ons',
    gradient: 'from-purple-500 to-fuchsia-600',
    icon: '🎧',
  },
  Storage: {
    image: 'https://images.unsplash.com/photo-1597872200963-2bca5a9f3c9b?auto=format&fit=crop&w=500&q=80',
    description: 'SSDs, drives & memory cards',
    gradient: 'from-zinc-500 to-zinc-700',
    icon: '💾',
  },
  Cameras: {
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
    description: 'Capture every moment in detail',
    gradient: 'from-sky-500 to-blue-700',
    icon: '📷',
  },
  Gaming: {
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80',
    description: 'Gear up for the next level',
    gradient: 'from-red-500 to-rose-700',
    icon: '🎮',
  },
  General: {
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=500&q=80',
    description: 'Explore our full collection',
    gradient: 'from-gray-500 to-gray-700',
    icon: '✨',
  },
};

export function getCategoriesFromProducts(products) {
  const counts = {};
  products.forEach((p) => {
    const cat = p.category || 'General';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      ...(CATEGORY_META[name] || CATEGORY_META.General),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
