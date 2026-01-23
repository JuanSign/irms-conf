const Welcome = () => {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="w-full lg:w-1/3 flex flex-col items-center text-center">
            <div className="w-64 h-64 bg-gray-200 rounded-lg shadow-md mb-6 overflow-hidden relative">
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-gray-400">
                <span className="text-sm">Photo of President</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-irms-blue">Ridho Kresna Wattimena</h3>
            <p className="text-irms-red font-medium text-sm mt-1 uppercase tracking-wide">
              President
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Indonesian Rock Mechanics Society (IRMS)
            </p>
          </div>

          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 relative inline-block">
              Welcome Message
              <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-irms-red -mb-2"></span>
            </h2>

            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6 text-justify">
              <p className="font-medium text-gray-800">
                Dear Valued Potential Sponsors,
              </p>

              <p>
                My name is <strong>Ridho Kresna Wattimena</strong>, and it is my pleasure to serve as the 
                President of the Indonesian Rock Mechanics Society (IRMS). On behalf of IRMS and the 
                organising committee, I invite your organisation to become valued partners for our upcoming 
                <span className="text-irms-blue font-semibold"> Indonesian Rock Mechanics Society Conference 2026 (IRMS Conference 2026)</span>.
              </p>

              <p>
                For over 18 years, the IRMS has provided significant contributions to the advancement of the 
                field of rock mechanics and rock engineering through organising various activities to increase 
                the knowledge of its members and the wider community and active participation in international 
                scientific conferences. Our conference is our most significant event, bringing together over 
                200 high-level professionals, decision-makers, and industry leaders from across South East Asia.
              </p>

              <p>
                The IRMS Conference 2026 is a continuation of our <em>National Workshop and Symposium on 
                Geomechanics (WSNG)</em>. The previous WSNG series (Yogyakarta 2012, Bandung 2013, Jakarta 2015, 
                Padang 2017, and Makassar 2019) have been premier scientific events with international networks 
                and professional forums for the Indonesian rock mechanics community to exchange ideas, research 
                findings, and practical experiences.
              </p>

              <div className="pt-8">
                <p className="mb-2">Kind regards,</p>
                <div className="font-script text-2xl text-irms-blue mb-2 font-bold opacity-80">
                  Ridho Kresna Wattimena
                </div>
                <p className="text-sm font-bold text-gray-900">President,</p>
                <p className="text-sm text-gray-500">Indonesian Rock Mechanics Society (IRMS)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Welcome;