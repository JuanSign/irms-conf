import { Pickaxe, Cpu, Mountain } from 'lucide-react';

const topics = [
  {
    id: 1,
    title: "Fundamental Rock Mechanics",
    icon: <Mountain size={32} />,
    description: "Theoretical development, analytical solutions, laboratory and in-situ testing, rock mass characterization, and geophysical, geological, and hydrogeological considerations."
  },
  {
    id: 2,
    title: "Rock Engineering Analysis & Numerical Modeling",
    icon: <Cpu size={32} />,
    description: "Data assimilation and back analysis, field measurement and monitoring, risk assessment and mitigation of geo-hazards, and numerical modeling in geomechanics."
  },
  {
    id: 3,
    title: "Rock Mechanics Applications",
    icon: <Pickaxe size={32} />,
    description: "Slope stability, tunnels and underground construction, rock mechanics in mining, petroleum, and civil engineering, as well as rock excavation and blasting."
  },
];

const Topics = () => {
  return (
    <section id="topics" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-irms-red font-bold text-sm tracking-widest uppercase">Focus Areas</span>
          <h2 className="text-4xl font-extrabold text-irms-dark mt-2">Conference Topics</h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto font-medium">
            Bridging theoretical research with practical engineering solutions for sustainable industry growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="group p-10 rounded-2xl border border-slate-100 bg-irms-light hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-irms-blue mb-8 shadow-sm group-hover:bg-irms-blue group-hover:text-white transition-colors">
                {topic.icon}
              </div>
              <h3 className="text-xl font-extrabold text-irms-dark mb-4 leading-tight">
                {topic.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed grow">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Topics;