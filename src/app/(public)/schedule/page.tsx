"use client";

import { MapPin, Calendar, Clock, List } from 'lucide-react';
import { motion } from 'framer-motion';

const detailedEvents = [
  {
    id: 1,
    date: "14 July 2026",
    title: "Day 1: Pre-Event Workshops",
    status: "upcoming",
    description: "Kick off the conference with specialized, hands-on workshops led by industry experts. These intensive sessions provide deep technical insights and practical skills in applied rock mechanics.",
    location: "Holiday Inn Bandung Pasteur",
    agenda: [
      { time: "07:00 - 08:00", type: "General", activity: "Registration and Entrance Open" },
      { time: "08:00 - 10:00", type: "Workshop 1", speaker: "APTEKINDO", activity: "Practical Applications of Geotechnical Solutions for Risk Mitigation and Ground Support" },
      { time: "10:00 - 10:15", type: "Break", activity: "Coffee Break" },
      { time: "10:15 - 12:15", type: "Workshop 2", speaker: "HEXAGON", activity: "Integrated Slope Stability Monitoring for Improved Mine Safety and Decision-Making" },
      { time: "12:15 - 13:30", type: "Break", activity: "Lunch Break" },
      { time: "13:30 - 15:30", type: "Workshop 3", speaker: "Seequent", activity: "Evolving Geotechnical Workflow for Dynamic and Fast-Paced Mining Decisions" },
      { time: "15:30 - 15:45", type: "Break", activity: "Coffee Break" },
      { time: "15:45 - 17:45", type: "Workshop 4", speaker: "NGC ITENAS, Delta Sigma Nusantara & Seequent", activity: "Numerical Modelling of NATM Tunnels Using PLAXIS 2D" }
    ]
  },
  {
    id: 2,
    date: "15 July 2026",
    title: "Day 2: Keynotes, Parallel Sessions & Rockers Night",
    status: "upcoming",
    description: "The main conference opens with inspiring keynote speeches from global leaders in rock engineering, followed by technical sessions and the exclusive 'Rockers Night'.",
    location: "Holiday Inn Bandung Pasteur",
    agenda: [
      { time: "08:00 - 09:00", type: "General", activity: "Registration and Entrance Open" },
      { time: "09:00 - 09:15", type: "General", activity: "Welcome Remarks (OC Chair & President of IRMS)" },
      { time: "09:15 - 10:30", type: "Keynote", speaker: "Neal Harries (IDS Hexagon)", activity: "Risk Management Approaches of Managing Slope Instability Hazards in Open Pit Mines" },
      { time: "10:30 - 10:45", type: "Break", activity: "Coffee Break" },
      { time: "10:45 - 12:00", type: "Keynote", speaker: "Alessandro Maggioni (New Module International)", activity: "Rock Testing for Uniaxial and Triaxial" },
      { time: "12:00 - 13:00", type: "Break", activity: "Lunch Break" },
      { time: "13:00 - 14:30", type: "General", activity: "Parallel Paper Presentation Session 1 (2 Rooms)" },
      { time: "14:30 - 14:45", type: "Break", activity: "Coffee Break" },
      { time: "14:45 - 16:15", type: "General", activity: "Parallel Paper Presentation Session 2 (2 Rooms)" },
      { time: "16:15 - 18:30", type: "Break", activity: "Free Time" },
      { time: "18:30 - 22:00", type: "General", activity: "Rockers Night" }
    ]
  },
  {
    id: 3,
    date: "16 July 2026",
    title: "Day 3: Keynotes, Parallel Sessions & Closing",
    status: "upcoming",
    description: "The final day features additional expert keynotes, extensive parallel technical sessions, and the awarding/closing ceremony.",
    location: "Holiday Inn Bandung Pasteur",
    agenda: [
      { time: "08:00 - 09:00", type: "General", activity: "Registration and Entrance Open" },
      { time: "09:00 - 09:45", type: "Keynote", speaker: "Lufi Rachmad (GEOMINE)", activity: "Rock Mechanics in the Era of Deeper Mining, Emerging Technologies, and Sustainable Resource Development" },
      { time: "09:45 - 10:30", type: "Keynote", speaker: "Indra Noer Hamdan (ITENAS)", activity: "2D vs 3D Numerical Modelling of NATM Tunnel using Finite Element Method" },
      { time: "10:30 - 10:45", type: "Break", activity: "Coffee Break" },
      { time: "10:45 - 11:30", type: "Keynote", speaker: "Okky Chandra Perdana (APTEKINDO)", activity: "The Evolution and Strategic Role of Cementation Technology in the Modern Mining Industry" },
      { time: "11:30 - 13:00", type: "Break", activity: "Lunch Break" },
      { time: "13:00 - 14:30", type: "General", activity: "Parallel Paper Presentation Session 3 (3 Rooms)" },
      { time: "14:30 - 14:45", type: "Break", activity: "Coffee Break" },
      { time: "14:45 - 16:00", type: "General", activity: "Parallel Paper Presentation Session 4 (2 Rooms)" },
      { time: "16:00 - 17:00", type: "General", activity: "Awarding & Closing" }
    ]
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
            Stay on track with our detailed timeline of exclusive workshops and the main event agenda.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {detailedEvents.map((event, index) => {
             return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden border border-gray-200 shadow-sm hover:shadow-md border-l-4 border-l-irms-blue"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 relative z-10">
                  <div className="md:w-1/4 shrink-0">
                    <div className="font-extrabold text-lg flex items-center gap-2 text-slate-900">
                      <Calendar className="w-5 h-5 text-irms-blue" />
                      {event.date}
                    </div>
                  </div>

                  <div className="md:w-3/4">
                    <h3 className="text-xl md:text-2xl font-extrabold mb-3 leading-tight text-slate-800">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base font-medium">
                      {event.description}
                    </p>

                    <div className="inline-flex items-center text-sm font-bold px-4 py-2.5 rounded-xl transition-colors mb-6 bg-blue-50 text-irms-blue">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {event.location}
                      </div>
                    </div>

                    {/* Detailed Agenda Rendering */}
                    {event.agenda && event.agenda.length > 0 && (
                      <div className="border-t border-slate-100 pt-6">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                          <List size={16} className="text-irms-blue" />
                          Detailed Rundown
                        </h4>
                        <div className="space-y-3">
                          {event.agenda.map((item, i) => {
                            const isWorkshop = item.type.includes("Workshop");
                            const isKeynote = item.type === "Keynote";
                            const isSpecial = isWorkshop || isKeynote;

                            return (
                              <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-white transition-colors">
                                <span className="font-semibold text-irms-blue shrink-0 sm:w-32 mt-0.5">{item.time}</span>

                                <div className="flex-1 flex flex-col gap-1.5">
                                  {isSpecial ? (
                                    <>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                                          isWorkshop ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                          'bg-purple-50 text-purple-600 border-purple-200'
                                        }`}>
                                          {item.type}
                                        </span>
                                        {item.speaker && (
                                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                            {item.speaker}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-slate-900 font-bold text-[15px] leading-snug">{item.activity}</span>
                                    </>
                                  ) : (
                                    <span className={`font-medium ${item.type === 'Break' ? 'text-slate-400 italic' : 'text-slate-700'}`}>
                                      {item.activity}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
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