import Image from 'next/image';

const sponsors = [
  // Large
  { name: "Hexagon", image: "/image/Hexagon.png", size: "large" },
  { name: "IDS Georadar", image: "/image/IDS Georadar.png", size: "large" },
  { name: "Leica Geosystems", image: "/image/Leica Geosystems.png", size: "large" },
  // Medium
  { name: "Adaro", image: "/image/Adaro.png", size: "medium" },
  // Small
  { name: "Dahana", image: "/image/Dahana.png", size: "small" },
  { name: "Tura", image: "/image/Tura.png", size: "small" },
  { name: "Abel", image: "/image/Abel.png", size: "small" },
];

const SponsorsSection = () => {
  const largeSponsors = sponsors.filter(sponsor => sponsor.size === "large");
  const mediumSponsors = sponsors.filter(sponsor => sponsor.size === "medium");
  const smallSponsors = sponsors.filter(sponsor => sponsor.size === "small");

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">
            Proudly Supported By
          </span>
        </div>

        <div className="flex flex-col gap-16 md:gap-20">
          
          {/* Large Sponsors */}
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24">
            {largeSponsors.map((sponsor) => (
              <div key={sponsor.name} className="relative w-48 h-24 sm:w-64 sm:h-32">
                <Image
                  src={sponsor.image}
                  alt={`${sponsor.name} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Medium Sponsors */}
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

          {/* Small Sponsors */}
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