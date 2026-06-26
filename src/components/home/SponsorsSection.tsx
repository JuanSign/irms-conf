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

        {/* Tightened vertical gap from 24/16 to 16/12 */}
        <div className="flex flex-col gap-12 md:gap-16">
          
          {/* 1. Platinum Sponsor (Now takes maximum available width) */}
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
                  // Expanded width logic here
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

          {/* 2. Gold Sponsors */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-6 sm:mb-8 text-center">
              Our Gold Sponsors
            </h3>
            {/* Reduced horizontal gaps for better mobile wrapping */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-16 w-full">
              {sponsors.gold.map((sponsor, idx) => (
                <motion.div 
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative w-36 h-16 sm:w-48 sm:h-24 md:w-56 md:h-28 hover:scale-105 transition-transform duration-300"
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

          {/* Bottom Grid for smaller tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 pt-4 md:pt-8 border-t border-slate-50">
            
            {/* 3. Rockers Night Sponsors */}
            <div className="flex flex-col items-center w-full">
              <h3 className="text-slate-400 font-bold text-xs tracking-widest uppercase mb-6 sm:mb-8 text-center">
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
                    className="relative w-24 h-12 sm:w-32 sm:h-14 md:w-36 md:h-16 hover:scale-105 transition-transform duration-300"
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
            <div className="flex flex-col items-center w-full">
              <h3 className="text-slate-400 font-bold text-xs tracking-widest uppercase mb-6 sm:mb-8 text-center">
                Session Break Sponsors
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full">
                {sponsors.sessionBreak.map((sponsor, idx) => (
                  <motion.div 
                    key={sponsor.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative w-24 h-12 sm:w-32 sm:h-14 md:w-36 md:h-16 hover:scale-105 transition-transform duration-300"
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
      </div>
    </section>
  );
};

export default SponsorsSection;