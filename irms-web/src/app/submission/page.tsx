import Navbar from '@/components/Navbar';

export default function SubmissionPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* 1. Header Section */}
      <div className="bg-white pt-24 pb-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-irms-blue mb-4">
            Abstract Submission
          </h1>
          <p className="text-lg text-gray-600">
            Share your research with the rock mechanics community.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 2. Status Banner (Active) */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-10 rounded-r-lg flex items-start">
          <div>
            <h3 className="font-bold text-green-800">Submission System is OPEN</h3>
            <p className="text-green-700 text-sm mt-1">
              The portal is currently accepting abstracts. Deadline: <span className="font-semibold">23 February 2026</span>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3. Main Guidelines (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* General Info */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-irms-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                General Guidelines
              </h2>
              <div className="prose text-gray-600">
                <p className="mb-4">
                  Prospective authors are invited to submit an abstract aligned with one of the symposium topics. 
                  Abstracts must be written in <strong>English</strong> and provide a clear explanation of the research content.
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-sm text-orange-800">
                  <strong>Note:</strong> Previously published findings are not eligible for submission. 
                  Please ensure your work presents novel contributions.
                </div>
              </div>
            </section>

            {/* Content Requirements */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-irms-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                What to Include
              </h2>
              <p className="text-gray-600 mb-4">It is highly recommended that each abstract explicitly includes:</p>
              <ul className="space-y-3">
                {[
                  "The study's objective",
                  "The results and their significance",
                  "Advancements or novel contributions relative to prior work"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-irms-red mr-2">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

             {/* Formatting */}
             <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-irms-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Format & Structure
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Length & File</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Approx. <strong>500 words</strong></li>
                    <li>• <strong>PDF</strong> format only</li>
                    <li>• No specific template required</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Must Contain</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Paper Title</li>
                    <li>• Chosen Symposium Topic</li>
                    <li>• 4-5 Keywords</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                * Author information is <strong>NOT</strong> required at this stage (Double-blind review preparation).
              </p>
            </section>
          </div>

          {/* 4. Sidebar Action Card (Right Column) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-irms-red sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Submit?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Ensure your file is in PDF format and meets the word count requirements.
              </p>
              
              <button className="w-full bg-irms-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition shadow-md mb-4 flex items-center justify-center gap-2">
                Go to Submission Portal
              </button>

              <div className="text-center">
                <a href="#" className="text-sm text-irms-blue hover:underline">
                  Need help? Contact Support
                </a>
              </div>

              <hr className="my-6 border-gray-100"/>

              <div className="text-xs text-gray-400">
                <p className="font-semibold text-gray-500 mb-1">Key Deadline:</p>
                <p>23 February 2026</p>
                <p>(23:59 WIB)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}