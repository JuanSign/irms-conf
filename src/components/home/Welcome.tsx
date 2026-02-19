import Image from 'next/image';

const Welcome = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start">

          {/* Profile Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-irms-light p-8 rounded-2xl border border-slate-100 text-center shadow-sm">
              <div className="w-48 h-64 relative mb-6 mx-auto rounded-xl overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src="/image/Ridho Kresna Wattimena.jpg"
                  alt="Ridho Kresna Wattimena"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-xl font-bold text-irms-dark">Ridho Kresna Wattimena</h3>
              <p className="text-irms-red font-bold text-xs mt-2 uppercase tracking-widest">President</p>
              <p className="text-slate-500 text-sm mt-1 font-medium">Indonesian Rock Mechanics Society</p>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-2/3">
            <header className="mb-8 text-center lg:text-left">
              <span className="text-irms-blue font-bold text-sm tracking-widest uppercase">Welcome Message</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-irms-dark mt-2">
                A Strategic <span className="text-irms-red">Partnership Opportunity</span>
              </h2>
            </header>

            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
              <p className="text-xl font-semibold text-slate-800 italic">Dear Valued Potential Sponsors,</p>

              <p>
                My name is Ridho Kresna Wattimena, and it is my pleasure to serve as the President of the <strong>Indonesian Rock Mechanics Society (IRMS)</strong>. On behalf of IRMS and the organising committee, I invite your organisation to become valued partners for our upcoming <span className="text-irms-blue font-bold">Indonesian Rock Mechanics Society Conference 2026 (IRMS Conference 2026)</span>.
              </p>

              <p>
                For over 18 years, the IRMS has provided significant contributions to the advancement of the field of rock mechanics and rock engineering through organising various activities to increase the knowledge of its members and the wider community and active participation in international scientific conferences. Our conference is our most significant event, bringing together over <strong>200 high-level professionals, decision-makers, and industry leaders</strong> from across South East Asia.
              </p>

              <p>
                The IRMS Conference 2026 is a continuation of our National Workshop and Symposium on Geomechanics (WSNG). The previous WSNG series (Yogyakarta 2012, Bandung 2013, Jakarta 2015, Padang 2017, and Makassar 2019) have been premier scientific events with international networks and professional forums for the Indonesian rock mechanics community to exchange ideas, research findings, and practical experiences.
              </p>

              <div className="pt-8 border-t border-slate-100 mt-10">
                <p className="text-irms-dark font-serif text-3xl opacity-80 italic">Ridho Kresna Wattimena</p>
                <p className="text-sm text-slate-400 mt-2 uppercase tracking-tighter font-bold">President of IRMS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;