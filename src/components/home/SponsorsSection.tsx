"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const sponsors = {
  platinum: [
    { name: "Hexagon IDS Leica", image: "/image/sponsors/Hexagon IDS Leica.png" }
  ],
  gold: [
    { name: "Adaro", image: "/image/sponsors/adaro.png" },
    { name: "New Module International", image: "/image/sponsors/PT NEW MODULE INTERNATIONAL.png" },
    { name: "Anggun Permai Tekindo", image: "/image/sponsors/Anggun Permai Tekindo.png" }
  ],
  rockersNight: [
    { name: "Vale", image: "/image/sponsors/VALE.png" },
    { name: "Borneo Indobara", image: "/image/sponsors/PT BORNEO INDOBARA.png" },
    { name: "Orica", image: "/image/sponsors/ORICA Digital Solutions.png" }
  ],
  sessionBreak: [
    { name: "Dahana", image: "/image/sponsors/Dahana.png" },
    { name: "Abel", image: "/image/sponsors/ABEL.png" },
    { name: "Tura", image: "/image/sponsors/TURA.png" }
  ]
};

const SponsorsSection = () => {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-irms-blue font-bold text-sm tracking-widest uppercase">
            Partners & Backers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-irms-dark mt-4">Proudly Supported By</h2>
        </motion.div>

        {/* Vertical Stack for Hierarchy */}
        <div className="flex flex-col gap-12 md:gap-16">
          
          {/* 1. Platinum Sponsor */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-6 sm:mb-8">
              Our Platinum Sponsor
            </h3>
            <div className="w-full flex justify-center items-center px-4">
              {sponsors.platinum.map((sponsor, idx) => (
                <motion.div 
                  key={sponsor.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative w-full max-w-md sm:max-w-2xl md:max-w-4xl h-32 sm:h-56 md:h-72 hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src={sponsor.image}
                    alt={`${sponsor.name} Logo`}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2. Gold Sponsors (Increased Size) */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-6 sm:mb-8 text-center">
              Our Gold Sponsors
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 w-full">
              {sponsors.gold.map((sponsor, idx) => (
                <motion.div 
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative w-44 h-20 sm:w-56 sm:h-28 md:w-64 md:h-32 hover:scale-105 transition-transform duration-300"
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

          {/* 3. Rockers Night Sponsors */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-6 sm:mb-8 text-center">
              Rockers Night Sponsors
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full">
              {sponsors.rockersNight.map((sponsor, idx) => (
                <motion.div 
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative w-28 h-12 sm:w-36 sm:h-16 md:w-44 md:h-20 hover:scale-105 transition-transform duration-300"
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

          {/* 4. Session Break Sponsors */}
          <div className="flex flex-col items-center w-full pt-4">
            <h3 className="text-slate-400 font-bold text-xs tracking-widest uppercase mb-6 sm:mb-8 text-center">
              Session Break Sponsors
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8 md:gap-10 w-full">
              {sponsors.sessionBreak.map((sponsor, idx) => (
                <motion.div 
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative w-20 h-10 sm:w-28 sm:h-12 md:w-32 md:h-14 hover:scale-105 transition-transform duration-300"
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
      </div>
    </section>
  );
};

export default SponsorsSection;