"use client";

import { Calendar, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const events = [
  { id: 1, date: "30 Jun 2026", title: "Full Paper Submission", status: "upcoming", icon: <Clock size={24} /> },
  { id: 2, date: "14 Jul 2026", title: "Pre Event (Workshop)", status: "highlight", icon: <Calendar size={24} /> },
  { id: 3, date: "15 Jul 2026", title: "Keynote & QnA and Rockers Night", status: "highlight", icon: <Star size={24} /> },
  { id: 4, date: "16 Jul 2026", title: "Keynote & QnA and Paralel Session", status: "highlight", icon: <Calendar size={24} /> },
];

const Timeline = () => {
  return (
    <section id="schedule" className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-irms-blue font-bold text-sm tracking-widest uppercase">Milestones</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-irms-dark mt-4">Important Dates</h2>
        </motion.div>

        <div className="relative border-l-2 border-slate-100 md:ml-6 ml-4 space-y-12 pb-4">
          {events.map((event, index) => {
            const isHighlight = event.status === 'highlight';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative pl-8 md:pl-12"
              >
                <div className={`absolute -left-2.75 top-4 w-5 h-5 rounded-full border-4 border-white ${isHighlight ? 'bg-irms-blue scale-125' : 'bg-slate-300'}`}></div>

                <div className={`flex flex-col sm:flex-row sm:items-center p-6 md:p-8 rounded-2xl border-2 transition-all group hover:-translate-y-1 ${
                  isHighlight ? 'bg-irms-blue text-white border-irms-blue shadow-[0_8px_30px_rgb(0,43,92,0.2)]' :
                  'bg-slate-50 hover:bg-white border-slate-100 hover:shadow-md'
                }`}>
                  <div className={`hidden sm:flex mr-6 p-4 rounded-xl shrink-0 ${isHighlight ? 'bg-white/20' : 'bg-white shadow-sm text-irms-blue border border-slate-100 group-hover:border-irms-blue/30 transition-colors'}`}>
                    {event.icon}
                  </div>

                  <div className="flex-1">
                    <p className={`text-sm font-bold mb-1 tracking-wider uppercase ${isHighlight ? 'text-blue-200' : 'text-slate-500'}`}>
                      {event.date}
                    </p>
                    <h3 className={`font-extrabold text-xl md:text-2xl ${isHighlight ? 'text-white' : 'text-irms-dark'}`}>
                      {event.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;