"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const speakers = [
  {
    name: "Lufi Rachmad M.Eng",
    title: "Managing Director and Principal",
    organization: "GEOMINE Mining",
    image: "/image/Lufi Rachmad.jpeg"
  },
  {
    name: "Dr. techn. Indra Noer Hamdan, S.T., M.T.",
    title: "Expert Team Member",
    organization: "Road Safety and Road Tunnels Commission",
    image: "/image/Indra Noer.jpeg"
  },
  {
    name: "Alessandro Maggioni",
    title: "Product Manager Soil and Rock Equipment",
    organization: "CONTROLS Group",
    image: "/image/Alessandro Maggioni.jpeg"
  },
  {
    name: "Neal Harries",
    title: "Director - Mine Monitoring APAC",
    organization: "Hexagon Geosystems",
    image: "/image/Neal Harries.jpeg"
  },
];

const KeynoteSpeakers = () => {
  return (
    <section className="py-24 bg-irms-light relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-irms-blue font-bold text-sm tracking-widest uppercase">Eminent Voices</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-irms-dark mt-4">Keynote Speakers</h2>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
          {speakers.map((speaker, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(50%-2rem)] group bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 relative shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:shadow-lg transition-shadow duration-500">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 text-center sm:text-left pt-2 flex flex-col h-full">
                <div>
                  <div className="w-10 h-1 bg-irms-red rounded-full mb-4 mx-auto sm:mx-0 opacity-50 group-hover:w-16 transition-all duration-500"></div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-irms-dark leading-tight mb-2">
                    {speaker.name}
                  </h3>
                  <p className="text-irms-blue font-bold text-sm sm:text-base mb-1">
                    {speaker.title}
                  </p>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {speaker.organization}
                  </p>
                </div>
                {/* {speaker.presentation && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Presentation Topic
                    </p>
                    <p className="text-slate-700 text-sm italic font-medium leading-snug">
                      &quot;{speaker.presentation}&quot;
                    </p>
                  </div>
                )} */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeynoteSpeakers;