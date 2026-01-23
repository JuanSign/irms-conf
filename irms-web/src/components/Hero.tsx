const Hero = () => {
  return (
    <div className="relative bg-irms-light pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-irms-blue text-sm font-semibold mb-6">
          National Scientific Forum
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          IRMS Conference <span className="text-irms-red">2026</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 font-light mb-8 italic">
          &quot;Rock Engineering for a Sustainable Future&quot;
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-irms-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition shadow-lg">
            Register Now
          </button>
          <button className="bg-white text-irms-blue border border-irms-blue px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Learn More
          </button>
        </div>
      </div>
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent -z-10 opacity-70"></div>
    </div>
  );
};

export default Hero;