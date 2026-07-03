import KeynoteSection from "@/components/program/KeynoteSection";
import WorkshopSection from "@/components/program/WorkshopSection";

export const metadata = {
  title: 'Program | IRMS Conference 2026',
  description: 'Detailed information about Keynote Speakers and Workshops at the IRMS Conference 2026.',
};

export default function ProgramPage() {
  return (
    <main className="min-h-screen pt-24 bg-white">
      {/* Page Header */}
      <section className="py-16 bg-irms-dark relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-irms-red blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-irms-blue blur-[120px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-irms-red animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-widest uppercase">Event Schedule</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Conference <span className="text-irms-blue">Program</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Explore our lineup of eminent keynote speakers and immersive pre-conference workshops designed to advance rock engineering.
          </p>
        </div>
      </section>

      <KeynoteSection />
      <WorkshopSection />
    </main>
  );
}