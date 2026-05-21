"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const Welcome = () => {
  return (
    <section className="py-24 bg-slate-50 relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="absolute top-10 right-10 text-[200px] text-slate-200/50 font-serif leading-none -z-10 hidden lg:block">"</div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start">
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center shadow-xl shadow-slate-200/40 relative group">
              <div className="absolute inset-0 bg-linear-to-br from-irms-blue/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-52 h-64 relative mb-6 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl transition-shadow duration-500">
                <Image
                  src="/image/Ridho Kresna Wattimena.jpg"
                  alt="Ridho Kresna Wattimena"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl font-extrabold text-irms-dark relative z-10">Ridho Kresna Wattimena</h3>
              <p className="text-irms-red font-bold text-xs mt-3 uppercase tracking-widest relative z-10">President</p>
              <p className="text-slate-500 text-sm mt-1 font-medium relative z-10">Indonesian Rock Mechanics Society</p>
            </div>
          </div>

          <div className="w-full lg:w-2/3 lg:pt-8">
            <header className="mb-10 text-center lg:text-left">
              <span className="text-irms-blue font-bold text-sm tracking-widest uppercase">Welcome Message</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-irms-dark mt-3 leading-tight">
                A Strategic <span className="text-irms-red">Partnership Opportunity</span>
              </h2>
            </header>

            <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed space-y-6">
              <p className="text-2xl font-bold text-slate-800 italic font-serif">Dear Valued Potential Sponsors,</p>
              <p>
                My name is Ridho Kresna Wattimena, and it is my pleasure to serve as the President of the <strong>Indonesian Rock Mechanics Society (IRMS)</strong>. On behalf of IRMS and the organising committee, I invite your organisation to become valued partners for our upcoming <span className="text-irms-blue font-bold">Indonesian Rock Mechanics Society Conference 2026 (IRMS Conference 2026)</span>.
              </p>
              <p>
                For over 18 years, the IRMS has provided significant contributions to the advancement of the field of rock mechanics and rock engineering through organising various activities to increase the knowledge of its members and the wider community and active participation in international scientific conferences. Our conference is our most significant event, bringing together over <strong>200 high-level professionals, decision-makers, and industry leaders</strong> from across South East Asia.
              </p>
              <p>
                The IRMS Conference 2026 is a continuation of our National Workshop and Symposium on Geomechanics (WSNG). The previous WSNG series have been premier scientific events with international networks and professional forums for the Indonesian rock mechanics community to exchange ideas, research findings, and practical experiences.
              </p>

              <div className="pt-8 mt-10">
                <p className="text-irms-dark font-serif text-4xl opacity-80 italic signature-font">Ridho Kresna Wattimena</p>
                <p className="text-sm text-slate-400 mt-3 uppercase tracking-widest font-bold">President of IRMS</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Welcome;