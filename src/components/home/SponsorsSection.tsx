"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const sponsors = [
  { name: "Dahana", image: "/image/Dahana.png" },
  { name: "Tura", image: "/image/Tura.png" },
  { name: "Abel", image: "/image/Abel.png" },
];

const SponsorsSection = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">Proudly Supported By</span>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {sponsors.map((sponsor, idx) => (
            <motion.div
              key={idx}
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
    </section>
  );
};

export default SponsorsSection;