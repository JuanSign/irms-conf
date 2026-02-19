import { ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden bg-slate-50">
      {/* Visual background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-irms-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-96 h-96 bg-irms-red/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-irms-blue tracking-widest uppercase">Official IRMS Event 2026</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-irms-dark tracking-tighter mb-6 leading-tight">
          IRMS <span className="text-irms-red">2026</span>
        </h1>

        <p className="text-xl md:text-3xl text-slate-600 font-light mb-12 italic max-w-3xl mx-auto leading-relaxed">
          &quot;Rock Engineering for a Sustainable Future&quot;
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/submission/register"
            className="bg-irms-blue text-white px-10 py-5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-xl hover:shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            Register Now <ArrowRight size={20} />
          </Link>

          <Link
            href="/submission"
            className="bg-white text-irms-dark border-2 border-slate-200 px-10 py-5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <FileText size={20} className="text-irms-red" /> Call for Papers
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;