"use client";

import { Calendar, ShieldCheck, Activity, Layers, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import WorkshopCard from './WorkshopCard';

const workshops = [
  { 
    id: 1, 
    presenterNode: <span className="font-bold text-irms-dark">Anggun Permai Tekindo</span>,
    logos: ["/image/sponsors/Anggun Permai Tekindo.png"],
    title: "Practical Application of Geotechnical Solutions for Risk Mitigation and Ground Support",
    icon: <ShieldCheck size={32} strokeWidth={1.5} />,
    overview: "To Be Announced (TBA)",
    presenterInfo: "To Be Announced (TBA)"
  },
  { 
    id: 2, 
    presenterNode: <span className="font-bold text-irms-dark">Hexagon (IDS GeoRadar & Leica Geosystems)</span>,
    logos: ["/image/sponsors/Hexagon IDS Leica.png"],
    title: "Digital Monitoring and Data-Driven Decision-Making for Safer Mining Operations",
    icon: <Activity size={32} strokeWidth={1.5} />,
    overview: "To Be Announced (TBA)",
    presenterInfo: (
      <div className="space-y-4">
        <div>
          <p className="font-bold text-irms-dark">Dwiki Maulana, M.Eng.</p>
          <p className="text-sm text-slate-600">Manager of Mine Monitoring, IDS GeoRadar Indonesia</p>
          <p className="text-sm text-slate-500 mt-1">Manager of Mine Monitoring Center at Hexagon (IDS GeoRadar) with extensive experience in advanced monitoring technology since 2019. He specializes in geotechnical monitoring and radar data analysis for slope stability and risk mitigation. With a strong background in Geological Engineering, he delivers reliable, data-driven solutions to enhance mine safety.</p>
        </div>
        <div>
          <p className="font-bold text-irms-dark">Adhityo Susilo Nugroho, S.T.</p>
          <p className="text-sm text-slate-600">Product Manager – Structural Monitoring & CORS, PT Leica Geosystems Indonesia</p>
          <p className="text-sm text-slate-500 mt-1">Product Manager for Structural Monitoring & CORS at PT Leica Geosystems Indonesia, with extensive experience in geodetic monitoring technology since 2006. He specializes in structural and mine monitoring using Robotic Total Stations and GNSS equipment, with a strong focus on slope stability monitoring. With a geodetic engineering background, he delivers reliable, technology-driven monitoring solutions for critical infrastructure and operations.</p>
        </div>
      </div>
    )
  },
  { 
    id: 3, 
    presenterNode: (
      <div className="text-sm text-slate-500 leading-relaxed">
        <span className="block"><strong className="text-irms-dark">PT Delta Nusantara</strong> (Bentley & Seequent Channel Partner)</span>
        <span className="block mt-1"><strong className="text-irms-dark">NGC Itenas</strong> (Bentley Training Partner)</span>
      </div>
    ),
    logos: [
      "/image/sponsors/Bentley.png",
      "/image/sponsors/Delta Sigma Nusantara.png",
      "/image/sponsors/NGC.png",
      "/image/sponsors/Seequent.png"
    ],
    title: "3D Geological Modelling for Geotechnical and Rock Engineering Applications",
    icon: <Layers size={32} strokeWidth={1.5} />,
    overview: "To Be Announced (TBA)",
    presenterInfo: "To Be Announced (TBA)"
  },
  { 
    id: 4, 
    presenterNode: (
      <div className="text-sm text-slate-500 leading-relaxed">
        <span className="block"><strong className="text-irms-dark">PT Delta Nusantara</strong> (Bentley & Seequent Channel Partner)</span>
        <span className="block mt-1"><strong className="text-irms-dark">Dr. techn. Indra Noer Hamdhan</strong> (NGC Itenas)</span>
      </div>
    ),
    logos: [
      "/image/sponsors/Bentley.png",
      "/image/sponsors/Delta Sigma Nusantara.png",
      "/image/sponsors/NGC.png",
      "/image/sponsors/Seequent.png"
    ],
    title: "Numerical Modelling for Geotechnical and Rock Engineering Applications",
    icon: <Cpu size={32} strokeWidth={1.5} />,
    overview: "Dr. techn. Indra Noer Hamdhan will discuss advanced methodologies for simulating tunnel construction using PLAXIS 2D and PLAXIS 3D, with an emphasis on understanding ground–structure interaction during tunnel excavation. The presentation will explore the application of the Stress Reduction Method (β-method) for representing stress redistribution and load sharing between the surrounding ground and tunnel lining, as well as practical approaches for determining appropriate stress reduction factors in two-dimensional numerical analyses. The session will further examine the capabilities and limitations of both 2D and 3D numerical modeling, highlighting the circumstances under which each approach is most appropriate. Particular attention will be given to the importance of three-dimensional analysis for evaluating tunnel face stability, sequential excavation, and complex construction stages that cannot be adequately represented using simplified two-dimensional models. Drawing upon both research and practical engineering experience, Dr. techn. Indra Noer Hamdhan will demonstrate how advanced numerical modeling can be applied to predict ground deformation, lining response, and surface settlement, ultimately supporting safer, more reliable, and performance-based tunnel design and construction.",
    presenterInfo: "Dr. techn. Indra Noer Hamdhan is the Head of the National Geotechnics Center (NGC) at the Institut Teknologi Nasional (ITENAS), Bandung, and a Bentley Channel Partner in Indonesia."
  },
];

export default function WorkshopSection() {
  return (
    <section id="workshop" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <span className="text-irms-red font-bold text-sm tracking-widest uppercase flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-irms-red"></span> Pre-Event
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-irms-dark leading-tight mt-4">
              Pre-Conference <span className="text-irms-blue">Workshops</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex shrink-0 gap-4 bg-white px-6 py-4 rounded-2xl shadow-lg border border-slate-100"
          >
            <div className="bg-irms-blue/10 p-3 rounded-xl text-irms-blue flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
              <p className="text-lg font-extrabold text-irms-dark">14 July 2026</p>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-10">
          {workshops.map((workshop, idx) => (
            <WorkshopCard key={workshop.id} workshop={workshop} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}