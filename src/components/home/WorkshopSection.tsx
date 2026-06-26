"use client";

import { Calendar, ShieldCheck, Activity, Layers, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const workshops = [
  { 
    id: 1, 
    presenterNode: <span className="text-sm font-bold text-irms-dark">Anggun Permai Tekindo</span>,
    logos: [
      "/image/sponsors/Anggun Permai Tekindo.png"
    ],
    title: "Practical Application of Geotechnical Solutions for Risk Mitigation and Ground Support",
    icon: <ShieldCheck size={28} strokeWidth={1.5} />
  },
  { 
    id: 2, 
    presenterNode: <span className="text-sm font-bold text-irms-dark">Hexagon</span>,
    logos: [
      "/image/sponsors/Hexagon IDS Leica.png"
    ],
    title: "Digital Monitoring and Data-Driven Decision-Making for Safer Mining Operations",
    icon: <Activity size={28} strokeWidth={1.5} />
  },
  { 
    id: 3, 
    presenterNode: (
      <div className="text-xs text-slate-500 leading-relaxed">
        <span className="block"><strong className="text-irms-dark">PT Delta Nusantara</strong> as Bentley & Seequent Channel Partner</span>
        <span className="block mt-1"><strong className="text-irms-dark">NGC Itenas</strong> as Bentley Training Partner</span>
      </div>
    ),
    logos: [
      "/image/sponsors/Bentley.png",
      "/image/sponsors/Delta Sigma Nusantara.png",
      "/image/sponsors/NGC.png",
      "/image/sponsors/Seequent.png"
    ],
    title: "3D Geological Modelling for Geotechnical and Rock Engineering Applications",
    icon: <Layers size={28} strokeWidth={1.5} />
  },
  { 
    id: 4, 
    presenterNode: (
      <div className="text-xs text-slate-500 leading-relaxed">
        <span className="block"><strong className="text-irms-dark">PT Delta Nusantara</strong> as Bentley & Seequent Channel Partner</span>
        <span className="block mt-1"><strong className="text-irms-dark">NGC Itenas</strong> as Bentley Training Partner</span>
      </div>
    ),
    logos: [
      "/image/sponsors/Bentley.png",
      "/image/sponsors/Delta Sigma Nusantara.png",
      "/image/sponsors/NGC.png",
      "/image/sponsors/Seequent.png"
    ],
    title: "Numerical Modelling for Geotechnical and Rock Engineering Applications",
    icon: <Cpu size={28} strokeWidth={1.5} />
  },
];

const WorkshopSection = () => {
  return (
    <section id="workshop" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="md:w-3/5"
          >
            <span className="text-irms-red font-bold text-sm tracking-widest uppercase flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-irms-red"></span> Pre-Event
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-irms-dark leading-tight mb-6">
              Pre-Conference <span className="text-irms-blue">Workshops</span>
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed text-lg">
              Gain practical knowledge and technical insights through specialized workshops led by experienced professionals in rock mechanics, geotechnical engineering, and mining technology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-2/5 flex md:justify-end"
          >
            <div className="inline-flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-lg border border-slate-100">
              <div className="bg-irms-blue/10 p-3 rounded-xl text-irms-blue">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                <p className="text-lg font-extrabold text-irms-dark">14 July 2026</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2x2 Workshop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {workshops.map((workshop, idx) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group bg-white p-8 rounded-3xl border border-slate-200 hover:border-irms-blue/30 hover:shadow-xl hover:shadow-irms-blue/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              
              {/* Top: Icon & "Presented By" Label */}
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Presented By
                </p>
                <div className="text-slate-300 group-hover:text-irms-blue transition-colors group-hover:scale-110 transform duration-300 shrink-0">
                  {workshop.icon}
                </div>
              </div>

              {/* Logos Array */}
              <div className="flex flex-wrap items-center gap-4 mb-4 min-h-[2.5rem]">
                {workshop.logos.map((logoPath, i) => (
                  <img 
                    key={i} 
                    src={logoPath} 
                    alt="Presenter Logo" 
                    className="h-8 max-w-[120px] object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                ))}
              </div>

              {/* Presenter Description */}
              <div className="mb-6 border-l-2 border-slate-100 pl-3 group-hover:border-irms-blue/30 transition-colors">
                {workshop.presenterNode}
              </div>
              
              {/* Title (Pushed to bottom using mt-auto to keep cards aligned) */}
              <h3 className="text-xl md:text-2xl font-extrabold text-irms-dark leading-snug mt-auto pt-5 border-t border-slate-50">
                {workshop.title}
              </h3>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WorkshopSection;