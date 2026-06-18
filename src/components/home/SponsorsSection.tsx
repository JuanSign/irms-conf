import Image from 'next/image';

const mediumSponsors = [
  { name: "Vale", image: "/image/Vale.png" },
  { name: "Ground Probe", image: "/image/Ground Probe.png" },
];

const smallSponsors = [
  { name: "Dahana", image: "/image/Dahana.png" },
  { name: "Tura", image: "/image/Tura.png" },
  { name: "Abel", image: "/image/Abel.png" },
];

const SponsorsSection = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">
            Proudly Supported By
          </span>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          
          {/* 1. Large Sponsors 1 */}
          <div className="w-full flex justify-center items-center">
            <Image
              src="/image/SPONSORS.jpeg"
              alt="Main Large Sponsors"
              width={1280} 
              height={400} 
              className="w-full max-w-4xl h-auto object-contain"
              priority 
            />
          </div>

          {/* 2. Large Sponsors 2 */}
          <div className="w-full flex justify-center items-center">
            <Image
              src="/image/New Module International.png"
              alt="New Module International"
              width={1280} 
              height={400} 
              className="w-full max-w-4xl h-auto object-contain"
            />
          </div>

          {/* 3. Adaro */}
          <div className="flex justify-center items-center">
            <div className="relative w-48 h-16 sm:w-64 sm:h-20">
              <Image
                src="/image/Adaro.png"
                alt="Adaro Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* 4. Vale and Ground Probe */}
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            {mediumSponsors.map((sponsor) => (
              <div key={sponsor.name} className="relative w-40 h-24 sm:w-56 sm:h-28">
                <Image
                  src={sponsor.image}
                  alt={`${sponsor.name} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* 5. 3 Small Sponsors */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {smallSponsors.map((sponsor) => (
              <div key={sponsor.name} className="relative w-24 h-12 sm:w-32 sm:h-16">
                <Image
                  src={sponsor.image}
                  alt={`${sponsor.name} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;