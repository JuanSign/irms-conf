const topics = [
  { id: 1, title: "FUNDAMENTAL ROCK MECHANICS", icon: "🔬" },
  { id: 2, title: "ROCK ENGINEERING ANALYSIS & NUMERICAL MODELING", icon: "💻" },
  { id: 3, title: "ROCK MECHANICS APPLICATIONS", icon: "🏗️" },
];

const Topics = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-irms-blue">Conference Topics</h2>
          <p className="mt-4 text-gray-600">Exploring the frontiers of rock mechanics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div 
              key={topic.id} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-irms-blue flex flex-col"
            >
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-14 flex items-center">
                {topic.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                In-depth discussions on innovations and latest professional experiences.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Topics;