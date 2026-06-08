"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const sponsors = [
  { name: "Dahana", image: "/image/Dahana.png", size: "normal" },
  { name: "Tura", image: "/image/Tura.png", size: "normal" },
  { name: "Abel", image: "/image/Abel.png", size: "normal" },
  { name: "Hexagon", image: "/image/Hexagon.png", size: "large" },
  { name: "IDS Georadar", image: "/image/IDS Georadar.png", size: "large" },
  { name: "Leica Geosystems", image: "/image/Leica Geosystems.png", size: "large" },
];

const SponsorsSection = () => {
  const largeSponsors = sponsors.filter(sponsor => sponsor.size === "large");
  const normalSponsors = sponsors.filter(sponsor => sponsor.size === "normal");

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">Proudly Supported By</span>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-20">
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24">
            {largeSponsors.map((sponsor, idx) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative w-52 h-28 sm:w-64 sm:h-32 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
              >
                <Image
                  src={sponsor.image}
                  alt={`${sponsor.name} Logo`}
                  fill
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {normalSponsors.map((sponsor, idx) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative w-40 h-20 sm:w-48 sm:h-24 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
              >
                <Image
                  src={sponsor.image}
                  alt={`${sponsor.name} Logo`}
                  fill
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;