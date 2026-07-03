
const Hero = () => {
  return (
    <section className="my-9 max-w-7xl bg-[#f4f4f6] rounded-2xl  mx-auto px-6 py-12 md:px-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      {/* Left Content */}
      <div className="md:col-span-5 space-y-6">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-gray-900 leading-tight">
          High-quality tech <br /> 
          <span className="italic">gadets</span> & accessories
        </h1>
        <div className="flex items-center space-x-4 pt-2">
          <button className="bg-black text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Browse
          </button>
          <button className="border border-gray-400 text-black text-sm font-medium px-8 py-3 rounded-full hover:bg-gray-50 transition-colors">
            About Us
          </button>
        </div>
      </div>

      {/* Right Image Container */}
      <div className="md:col-span-7 rounded-3xl p-8 flex items-center justify-center min-h-[300px] overflow-hidden relative">
        <img 
          src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=80" 
          alt="Phones Showcase" 
          className="w-full max-w-md rounded-xl object-contain transform translate-y-4"
        />
      </div>
    </section>
  );
};

export default Hero;