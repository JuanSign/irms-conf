import { Users, BookOpen, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtly decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-irms-light/50 -skew-x-12 translate-x-1/2 -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-irms-red font-bold text-sm tracking-widest uppercase">The Conference</span>
          <h2 className="text-4xl font-extrabold text-irms-dark mt-2">About IRMS 2026</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Description */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xl text-slate-700 leading-relaxed font-medium">
              The <span className="text-irms-blue font-bold">Indonesian Rock Mechanics Society (IRMS) Conference 2026</span> is the
              premier national scientific forum dedicated to the advancement of rock engineering.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              This event brings together a diverse ecosystem of academics, researchers, and practitioners
              to share breakthroughs in rock mechanics, ensuring that Indonesia's mining, energy, and
              infrastructure sectors continue to lead in safety and sustainability.
            </p>

            {/* Highlighted Mission Box */}
            <div className="p-6 bg-irms-light border-l-4 border-irms-red rounded-r-xl shadow-sm">
              <p className="text-irms-dark italic font-medium leading-relaxed">
                &quot;Promoting safe, efficient, and sustainable rock engineering practices to
                support national development and disaster mitigation.&quot;
              </p>
            </div>
          </div>

          {/* Quick Stats/Features Column */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-irms-blue/10 p-3 rounded-lg text-irms-blue">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-bold text-irms-dark">Expert Networking</h4>
                <p className="text-xs text-slate-500">Connect with industry leaders</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-irms-red/10 p-3 rounded-lg text-irms-red">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="font-bold text-irms-dark">Scientific Excellence</h4>
                <p className="text-xs text-slate-500">Peer-reviewed paper presentations</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-slate-100 p-3 rounded-lg text-slate-700">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-irms-dark">Strategic Impact</h4>
                <p className="text-xs text-slate-500">Shaping national safety standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;