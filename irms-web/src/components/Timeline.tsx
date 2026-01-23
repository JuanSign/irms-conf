const events = [
  { id: 1, date: "22 Dec 2025", title: "Open Registration", status: "done" },
  { id: 2, date: "23 Feb 2026", title: "Abstract Submission Deadline", status: "active" }, // Highlighted
  { id: 3, date: "1 Mar 2026", title: "Extended Abstract Submission", status: "upcoming" },
  { id: 4, date: "15 Mar 2026", title: "Notification of Acceptance", status: "upcoming" },
  { id: 5, date: "1 Jun 2026", title: "Full Paper Submission", status: "upcoming" },
  { id: 6, date: "14 Jul 2026", title: "Pre-Conference Workshop", status: "upcoming" },
  { id: 7, date: "14-16 Jul 2026", title: "IRMS Conference 2026 (Main Event)", status: "highlight" },
];

const Timeline = () => {
  return (
    <section id="schedule" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-irms-blue">Important Dates</h2>
          <p className="mt-4 text-gray-600">Mark your calendar for these key deadlines and events.</p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {events.map((event, index) => (
              <div key={event.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 z-10 
                  ${event.status === 'done' ? 'bg-gray-400 border-gray-200' : 
                    event.status === 'active' ? 'bg-irms-red border-red-200 animate-pulse' : 
                    'bg-irms-blue border-blue-200'}`}
                ></div>

                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'}`}>
                  
                  {event.status === 'active' && (
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                      UPCOMING DEADLINE
                    </span>
                  )}
                  {event.status === 'done' && (
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-full">
                      COMPLETED
                    </span>
                  )}

                  <h3 className={`text-lg font-bold ${event.status === 'done' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {event.title}
                  </h3>
                  <p className={`text-md font-medium mt-1 ${event.status === 'active' ? 'text-irms-red' : 'text-irms-blue'}`}>
                    {event.date}
                  </p>
                </div>

                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;