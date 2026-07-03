import drone from '../assets/drone.png'
import headphone from '../assets/headphone.png'
import iphone from '../assets/iphone.png'


const categories = [
  {
    id: 1,
    title: 'ProductName',
    details: 'Product Details:',
    image: drone, // Drone placeholder
  },
  {
    id: 2,
    title: 'ProductName',
    details: 'Product Details:',
    image: headphone, // Headphones
  },
  {
    id: 3,
    title: 'ProductName',
    details: 'Product Details:',
    image: iphone, // Phone
  },
  {
    id: 4,
    title: 'ProductName',
    details: 'Product Details:',
    image: drone, // Drone placeholder
  },
];

const ProductCategories = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {categories.map((category) => (
        <div 
          key={category.id} 
          className="bg-[#f4f4f6] rounded-3xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden group"
        >
          <div className="space-y-2 max-w-[60%]">
            <h3 className="text-2xl font-serif tracking-tight text-gray-900">{category.title}</h3>
            <p className="text-sm font-medium text-gray-900">{category.details}</p>
          </div>
          
          <div className="pt-8">
            <a href="#explore" className="inline-flex items-center text-sm font-medium text-gray-900 hover:underline">
              Explore Category <span className="ml-1">→</span>
            </a>
          </div>

          {/* Absolute positioned product image matching the bottom-right corner crop */}
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 md:h-3/5 flex items-end justify-end">
            <img 
              src={category.image} 
              alt={category.title} 
              className="object-contain max-h-full max-w-full transform translate-x-4 translate-y-4 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProductCategories;