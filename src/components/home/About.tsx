"use client";

import { Users, BookOpen, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-irms-light/50 -skew-x-12 translate-x-1/2 -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left mb-16 lg:mb-20"
        >
          <span className="text-irms-red font-bold text-sm tracking-widest uppercase flex items-center justify-center md:justify-start gap-2">
            <span className="w-8 h-px bg-irms-red"></span> The Conference
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-irms-dark mt-4">About IRMS 2026</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <p className="text-xl text-slate-700 leading-relaxed font-medium">
              The <span className="text-irms-blue font-bold">Indonesian Rock Mechanics Society (IRMS) Conference 2026</span> is the premier national scientific forum dedicated to the advancement of rock engineering.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              This event brings together a diverse ecosystem of academics, researchers, and practitioners to share breakthroughs in rock mechanics, ensuring that Indonesia's mining, energy, and infrastructure sectors continue to lead in safety and sustainability.
            </p>

            <div className="p-6 md:p-8 bg-irms-light border-l-4 border-irms-red rounded-r-2xl shadow-inner mt-8">
              <p className="text-irms-dark italic font-medium leading-relaxed text-lg">
                "Promoting safe, efficient, and sustainable rock engineering practices to support national development and disaster mitigation."
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-5">
            {[
              { icon: <Users size={24} />, title: "Expert Networking", desc: "Connect with industry leaders", color: "text-irms-blue", bg: "bg-irms-blue/10" },
              { icon: <BookOpen size={24} />, title: "Scientific Excellence", desc: "Peer-reviewed presentations", color: "text-irms-red", bg: "bg-irms-red/10" },
              { icon: <ShieldCheck size={24} />, title: "Strategic Impact", desc: "Shaping national standards", color: "text-slate-700", bg: "bg-slate-100" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 + (idx * 0.15) }}
                className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform"
              >
                <div className={`${item.bg} ${item.color} p-4 rounded-xl shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-irms-dark text-lg">{item.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;