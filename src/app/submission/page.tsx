'use client';

import Link from 'next/link';
import {
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  FileDown,
  FileText
} from 'lucide-react';

export default function SubmissionPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="bg-white pt-32 pb-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-irms-blue font-semibold text-sm tracking-wider uppercase mb-2 block">
            Call for Papers
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Abstract Submission
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Please download the official template below before submitting your abstract.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
          <div className="bg-green-100 p-3 rounded-full text-green-700 shrink-0">
            <CheckCircle2 size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-green-900 text-lg">Submission System is OPEN</h3>
            <p className="text-green-800 text-sm mt-1">
              The portal is currently accepting abstracts. Please ensure you follow the document format below.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-green-200 text-green-800 font-bold text-sm shadow-sm whitespace-nowrap">
            Deadline: 23 Feb 2026
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content: Downloads */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-irms-blue rounded-lg flex items-center justify-center">
                  <FileDown size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Download Resource</h2>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                To ensure a smooth review process, please prepare your abstract using the official template provided below.
              </p>

              <div className="space-y-4">
                <a
                  href="/IRMS 2026_Abstract_Template.docx"
                  download="IRMS_Abstract_Template.docx"
                  className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-irms-blue hover:bg-blue-50/50 transition-all duration-200"
                >
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-md mr-4 shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-irms-blue transition-colors">
                      Abstract Template
                    </h4>
                    <p className="text-sm text-gray-500">
                      DOCX • Microsoft Word Format
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-irms-blue">
                    <FileDown size={20} />
                  </div>
                </a>
              </div>
            </section>
          </div>

          {/* Sidebar Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-irms-red sticky top-28">
              <div className="flex items-center gap-2 text-irms-red mb-2">
                <UploadCloud size={24} />
                <h3 className="text-xl font-bold text-gray-900">Submit Abstract</h3>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Ready to submit?
              </p>

              <Link
                href="/submission/register"
                className="w-full bg-irms-red text-white font-bold py-4 px-4 rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg mb-4 flex items-center justify-center gap-2 group"
              >
                Go to Portal
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <hr className="my-6 border-gray-100"/>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Deadline</span>
                  <span className="font-bold text-gray-900">23 Feb 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}