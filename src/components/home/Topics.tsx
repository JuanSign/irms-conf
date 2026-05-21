"use client";

import { Pickaxe, Cpu, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

const topics = [
  { id: 1, title: "Fundamental Rock Mechanics", icon: <Mountain size={32} strokeWidth={1.5} />, description: "Theoretical development, analytical solutions, laboratory and in-situ testing, rock mass characterization, and geophysical, geological, and hydrogeological considerations." },
  { id: 2, title: "Analysis & Numerical Modeling", icon: <Cpu size={32} strokeWidth={1.5} />, description: "Data assimilation and back analysis, field measurement and monitoring, risk assessment and mitigation of geo-hazards, and numerical modeling in geomechanics." },
  { id: 3, title: "Rock Mechanics Applications", icon: <Pickaxe size={32} strokeWidth={1.5} />, description: "Slope stability, tunnels and underground construction, rock mechanics in mining, petroleum, and civil engineering, as well as rock excavation and blasting." },
];

const Topics = () => {
  return (
    <section id="topics" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-irms-red font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-irms-red"></span> Focus Areas <span className="w-8 h-px bg-irms-red"></span>
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-irms-dark mt-4">Conference Topics</h2>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Bridging theoretical research with practical engineering solutions for sustainable industry growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.2 }}
              className="group p-8 md:p-10 rounded-3xl border border-slate-200 bg-white hover:border-irms-blue/30 hover:shadow-[0_20px_40px_-15px_rgba(0,43,92,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-irms-blue to-irms-red opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-irms-blue mb-8 group-hover:bg-irms-blue group-hover:text-white group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-3">
                {topic.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-irms-dark mb-4 leading-tight">
                {topic.title}
              </h3>
              <p className="text-base text-slate-500 leading-relaxed grow font-medium">
                {topic.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Topics;