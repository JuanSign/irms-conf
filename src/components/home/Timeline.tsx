import { Calendar, CheckCircle2, Clock } from 'lucide-react';

const events = [
  { id: 1, date: "1 March 2026", title: "Abstract Submission Deadline", status: "active" },
  { id: 2, date: "15 Mar 2026", title: "Abstract Acceptance Notification", status: "upcoming" },
  { id: 3, date: "1 Jun 2026", title: "Full Paper Submission", status: "upcoming" },
  { id: 4, date: "16 Jun 2026", title: "Full Paper Acceptance Notification", status: "upcoming" },
  { id: 5, date: "14 Jul 2026", title: "Pre-Conference Workshop", status: "upcoming" },
  { id: 6, date: "15-16 Jul 2026", title: "IRMS Conference 2026 (Main Event)", status: "highlight" },
];

const Timeline = () => {
  return (
    <section id="schedule" className="py-24 bg-irms-light">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-irms-blue font-bold text-sm tracking-widest uppercase">Milestones</span>
          <h2 className="text-4xl font-extrabold text-irms-dark mt-2">Important Dates</h2>
        </div>

        <div className="space-y-4">
          {events.map((event) => {
            const isActive = event.status === 'active';
            const isHighlight = event.status === 'highlight';

            return (
              <div
                key={event.id}
                className={`flex items-center p-6 rounded-xl border-2 transition-all ${
                  isHighlight ? 'bg-irms-blue text-white border-irms-blue scale-105 shadow-xl' :
                  isActive ? 'bg-white border-irms-red shadow-md' : 'bg-white/50 border-slate-100 opacity-80'
                }`}
              >
                <div className={`mr-6 p-3 rounded-lg ${isHighlight ? 'bg-white/20' : 'bg-irms-light text-irms-blue'}`}>
                  <Calendar size={24} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${isHighlight ? 'text-white' : 'text-irms-dark'}`}>{event.title}</h3>
                  <p className={`text-sm font-medium ${isHighlight ? 'text-blue-100' : 'text-slate-500'}`}>{event.date}</p>
                </div>
                {isActive && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-irms-red text-white text-[10px] font-black rounded-full animate-pulse">
                    <Clock size={12} /> ACTION REQUIRED
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;