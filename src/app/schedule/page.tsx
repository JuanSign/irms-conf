'use client';

import Image from 'next/image';
import { MapPin, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const detailedEvents = [
  {
    id: 1,
    date: "22 Mar 2026",
    title: "Abstract Submission Deadline",
    status: "active",
    description: "Authors are invited to submit a short abstract (max 300 words) outlining the scope and results of their research. Abstracts must be written in English.",
    location: "Submission Portal",
    highlight: true
  },
  {
    id: 2,
    date: "5 Apr 2026",
    title: "Notification of Acceptance",
    status: "upcoming",
    description: "Authors will be notified via email regarding the acceptance of their abstracts. Successful authors will receive guidelines for Full Paper submission.",
    location: "Email Notification"
  },
  {
    id: 3,
    date: "14 June 2026",
    title: "Full Paper Submission",
    status: "upcoming",
    description: "Submission of the camera-ready full paper. Papers will undergo a final technical review before being included in the conference proceedings.",
    location: "Submission Portal"
  },
  {
    id: 4,
    date: "14-16 July 2026",
    title: "IRMS Conference 2026 (Main Event)",
    status: "upcoming",
    description: "Two days of keynote speeches, technical sessions, and networking events. Includes Gala Dinner on the night of July 15th.",
    location: "éL Hotel Bandung"
  }
];

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="bg-white pt-32 pb-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-irms-blue font-semibold text-sm tracking-wider uppercase mb-2 block">
            Timeline
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Conference Schedule
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stay on track with our detailed timeline of deadlines, workshops, and the main event agenda.
          </p>
        </div>
      </div>

      {/* Detailed List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {detailedEvents.map((event) => {
             const isActive = event.status === 'active';
             const isDone = event.status === 'done';
             const isUpcoming = event.status === 'upcoming';

             return (
              <div
                key={event.id}
                className={`group bg-white rounded-xl p-6 md:p-8 transition-all duration-300
                  ${isActive
                    ? 'shadow-lg border-l-4 border-irms-red ring-1 ring-slate-100 transform scale-[1.01]'
                    : isDone
                      ? 'border border-gray-100 bg-slate-50/50 grayscale-[0.5] hover:grayscale-0'
                      : 'border border-gray-200 shadow-sm hover:shadow-md border-l-4 border-l-irms-blue'
                  }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                  <div className="md:w-1/4 shrink-0">
                    <div className={`font-bold text-lg flex items-center gap-2 ${isDone ? 'text-gray-500' : 'text-slate-900'}`}>
                      <Calendar className="w-5 h-5 opacity-70" />
                      {event.date}
                    </div>

                    <div className="mt-3">
                      {isActive && (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 animate-pulse">
                             <AlertCircle size={14} /> ONGOING
                         </span>
                      )}
                      {isDone && (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                             <CheckCircle2 size={14} /> COMPLETED
                         </span>
                      )}
                      {isUpcoming && (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                             <Clock size={14} /> UPCOMING
                         </span>
                      )}
                    </div>
                  </div>

                  <div className="md:w-3/4">
                    <h3 className={`text-xl font-bold mb-3 ${isActive ? 'text-irms-red' : 'text-slate-800'}`}>
                      {event.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-5 text-base">
                      {event.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-irms-blue" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}