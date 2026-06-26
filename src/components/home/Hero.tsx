"use client";

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/home-bg.jpg"
          alt="IRMS Conference 2026 Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-900/75" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-irms-red animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-widest uppercase">Official IRMS Event 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[1.1]"
          >
            IRMS Conference <span className="text-irms-red relative inline-block">
              2026
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-irms-red/60" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl lg:text-3xl text-slate-300 font-light mb-12 italic max-w-3xl mx-auto leading-relaxed"
          >
            "Rock Engineering for a Sustainable Future"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center w-full sm:w-auto mt-4"
          >
            <Link
              href="/dashboard/register"
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 md:px-14 md:py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-irms-dark hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-white/5 flex items-center justify-center gap-3 group w-full sm:w-auto"
            >
              Register Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;