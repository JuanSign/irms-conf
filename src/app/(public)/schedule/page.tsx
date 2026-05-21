"use client";

import { MapPin, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const detailedEvents = [
  {
    id: 1,
    date: "30 June 2026",
    title: "Full Paper Submission",
    status: "active",
    description: "Submit your final, camera-ready full paper through our portal. All submissions undergo a rigorous final technical review by the scientific committee before inclusion in the official conference proceedings.",
    location: "Submission Portal"
  },
  {
    id: 2,
    date: "14 July 2026",
    title: "Pre Event (Workshop)",
    status: "upcoming",
    description: "Kick off the conference with specialized, hands-on workshops led by industry experts. These intensive sessions are designed to provide deep technical insights and practical skills in applied rock mechanics.",
    location: "Holiday Inn Bandung Pasteur"
  },
  {
    id: 3,
    date: "15 July 2026",
    title: "Keynote & QnA and Rockers Night",
    status: "upcoming",
    description: "The main conference opens with inspiring keynote speeches from global leaders in rock engineering, followed by interactive Q&A. The day concludes with the exclusive 'Rockers Night' gala dinner for networking and celebration.",
    location: "Holiday Inn Bandung Pasteur"
  },
  {
    id: 4,
    date: "16 July 2026",
    title: "Keynote & QnA and Paralel Session",
    status: "upcoming",
    description: "The final day features additional expert keynotes and extensive parallel technical sessions, where researchers and practitioners present their accepted papers across various specialized topics.",
    location: "Holiday Inn Bandung Pasteur"
  }
];

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <div className="bg-white pt-32 pb-16 border-b border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-20%] right-[-5%] w-96 h-96 bg-irms-blue/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <span className="text-irms-blue font-bold text-sm tracking-widest uppercase mb-3 block">
            Timeline
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Conference Schedule
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Stay on track with our detailed timeline of deadlines, exclusive workshops, and the main event agenda.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {detailedEvents.map((event, index) => {
             const isActive = event.status === 'active';
             const isDone = event.status === 'done';
             const isUpcoming = event.status === 'upcoming';

             return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group bg-white rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden
                  ${isActive
                    ? 'shadow-xl shadow-irms-red/5 border-l-4 border-irms-red ring-1 ring-irms-red/10 transform md:scale-[1.02]'
                    : isDone
                      ? 'border border-gray-200 bg-slate-50/50 opacity-75 hover:opacity-100'
                      : 'border border-gray-200 shadow-sm hover:shadow-md border-l-4 border-l-irms-blue'
                  }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-irms-red/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                )}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 relative z-10">
                  <div className="md:w-1/4 shrink-0">
                    <div className={`font-extrabold text-lg flex items-center gap-2 ${isDone ? 'text-gray-500' : 'text-slate-900'}`}>
                      <Calendar className={`w-5 h-5 ${isActive ? 'text-irms-red' : isDone ? 'opacity-50' : 'text-irms-blue'}`} />
                      {event.date}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {isActive && (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-irms-red border border-red-100">
                             <AlertCircle size={14} className="animate-pulse" /> ACTION REQUIRED
                         </span>
                      )}
                      {isDone && (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                             <CheckCircle2 size={14} /> COMPLETED
                         </span>
                      )}
                      {isUpcoming && (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-irms-blue border border-blue-100">
                             <Clock size={14} /> UPCOMING
                         </span>
                      )}
                    </div>
                  </div>

                  <div className="md:w-3/4">
                    <h3 className={`text-xl md:text-2xl font-extrabold mb-3 leading-tight ${isActive ? 'text-irms-red' : 'text-slate-800'}`}>
                      {event.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base font-medium">
                      {event.description}
                    </p>

                    <div className={`inline-flex items-center text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${
                      isActive ? 'bg-red-50 text-irms-red' : isDone ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-irms-blue'
                    }`}>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}