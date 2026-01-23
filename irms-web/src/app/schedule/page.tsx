import Navbar from '@/components/Navbar';

const detailedEvents = [
  {
    id: 1,
    date: "22 December 2025",
    title: "Open Registration",
    status: "done",
    description: "Online registration opens for all participants (professionals, students, and international delegates). Early bird rates are available until March 2026.",
    location: "Online via Website"
  },
  {
    id: 2,
    date: "23 February 2026",
    title: "Abstract Submission Deadline",
    status: "active",
    description: "Authors are invited to submit a short abstract (max 300 words) outlining the scope and results of their research. Abstracts must be written in English.",
    location: "Submission Portal",
    highlight: true
  },
  {
    id: 3,
    date: "1 March 2026",
    title: "Extended Abstract Submission",
    status: "upcoming",
    description: "Final deadline for late-breaking abstracts. No further extensions will be granted after this date to ensure the review process stays on track.",
    location: "Submission Portal"
  },
  {
    id: 4,
    date: "15 March 2026",
    title: "Notification of Acceptance",
    status: "upcoming",
    description: "Authors will be notified via email regarding the acceptance of their abstracts. Successful authors will receive guidelines for Full Paper submission.",
    location: "Email Notification"
  },
  {
    id: 5,
    date: "1 June 2026",
    title: "Full Paper Submission",
    status: "upcoming",
    description: "Submission of the camera-ready full paper. Papers will undergo a final technical review before being included in the conference proceedings.",
    location: "Submission Portal"
  },
  {
    id: 6,
    date: "14 July 2026",
    title: "Pre-Conference Workshop",
    status: "upcoming",
    description: "A full-day hands-on workshop focusing on 'Advanced Numerical Modeling in Rock Mechanics'. Separate registration is required.",
    location: "éL Hotel Bandung - Meeting Room A"
  },
  {
    id: 7,
    date: "15-16 July 2026",
    title: "IRMS Conference 2026 (Main Event)",
    status: "upcoming",
    description: "Two days of keynote speeches, technical sessions, and networking events. Includes Gala Dinner on the night of July 15th.",
    location: "éL Hotel Bandung - Grand Ballroom"
  }
];

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white pt-24 pb-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-irms-blue mb-4">
            Conference Schedule
          </h1>
          <p className="text-lg text-gray-600">
            A detailed timeline of deadlines, workshops, and the main event.
          </p>
        </div>
      </div>

      {/* Detailed List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {detailedEvents.map((event) => (
            <div 
              key={event.id}
              className={`bg-white rounded-xl p-6 md:p-8 shadow-sm border-l-4 transition-all hover:shadow-md
                ${event.highlight 
                  ? 'border-irms-red ring-1 ring-irms-red/10' 
                  : event.status === 'done' 
                    ? 'border-gray-300 opacity-70 grayscale-[0.5]' 
                    : 'border-irms-blue'
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                
                {/* Left: Date & Status */}
                <div className="md:w-1/4 shrink-0">
                  <div className="font-bold text-lg text-gray-900">{event.date}</div>
                  
                  {/* Status Badge */}
                  <div className="mt-2">
                    {event.status === 'active' && (
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Active Now
                       </span>
                    )}
                    {event.status === 'done' && (
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Completed
                       </span>
                    )}
                    {event.status === 'upcoming' && (
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                            Upcoming
                       </span>
                    )}
                  </div>
                </div>

                {/* Right: Content */}
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold text-irms-blue mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action for PDF */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-irms-blue hover:bg-blue-800 shadow-sm transition">
            📄 Download Schedule PDF
          </button>
        </div>
      </div>
    </main>
  );
}