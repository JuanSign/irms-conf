'use client';

import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  FileDown,
  FileText,
  AlertCircle,
  BellRing,
  LayoutDashboard,
  Mail,
  MessageSquare
} from 'lucide-react';

export default function SubmissionPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <div className="bg-white pt-32 pb-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-irms-red font-semibold text-sm tracking-wider uppercase mb-2 block">
            Important Update
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Submission Closed
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The call for papers has officially ended. Thank you to all authors who submitted their research for consideration.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Status Banner */}
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 mb-12 flex flex-col md:flex-row items-start md:items-center gap-5 shadow-sm">
          <div className="bg-slate-200 p-3 rounded-full text-slate-700 shrink-0">
            <AlertCircle size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-lg">New Submissions are Offline</h3>
            <p className="text-slate-700 text-sm mt-1 leading-relaxed">
              We are no longer accepting new abstracts. If you have urgent inquiries, missed the deadline due to technical issues, or need to withdraw a submission, please contact the administration.
            </p>
          </div>
          <a
            href="mailto:irms2026.secretariat@gmail.com"
            className="bg-white px-5 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-sm whitespace-nowrap flex items-center gap-2 transition-all"
          >
            <Mail size={16} className="text-slate-500" /> Email Admin
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content: Heavy Focus on Updates & Portal */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-linear-to-br from-white to-blue-50/40 p-8 md:p-10 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
              {/* Decorative background blur */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-3xl pointer-events-none"></div>

              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-12 h-12 bg-irms-blue text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <BellRing size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Track Your Submission</h2>
              </div>

              <div className="space-y-6 relative">
                <p className="text-gray-600 leading-relaxed text-lg">
                  All submitted abstracts are currently undergoing the peer-review process. To ensure you don't miss any critical information, please log in to the <strong>Author Portal</strong> regularly.
                </p>

                <div className="bg-white/60 rounded-xl p-6 border border-white shadow-sm">
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 text-irms-blue p-1 rounded-md mt-0.5 shrink-0">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                      <span className="leading-snug">Track the real-time <strong>review status</strong> of your abstract.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 text-irms-blue p-1 rounded-md mt-0.5 shrink-0">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                      <span className="leading-snug">Receive instant <strong>notifications</strong> regarding acceptance, revisions, or formatting requests.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 text-irms-blue p-1 rounded-md mt-0.5 shrink-0">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                      <span className="leading-snug">Access reviewer feedback and download official letters once decisions are finalized.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Kept as a secondary reference block */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileText size={18} className="text-gray-400"/>
                  Abstract Template Reference
                </h3>
                <p className="text-sm text-gray-500 mt-1">Need to review the formatting guidelines while waiting?</p>
              </div>
              <a
                href="/IRMS 2026_Abstract_Template.docx"
                download="IRMS_Abstract_Template.docx"
                className="text-irms-blue hover:text-blue-900 font-medium text-sm flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-lg transition-colors border border-blue-100 hover:border-blue-200 w-full sm:w-auto justify-center"
              >
                Download File <FileDown size={16}/>
              </a>
            </section>
          </div>

          {/* Sidebar Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border-t-4 border-irms-blue sticky top-28">
              <div className="flex items-center gap-3 text-irms-blue mb-3">
                <LayoutDashboard size={26} />
                <h3 className="text-xl font-bold text-gray-900">Author Portal</h3>
              </div>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Access your personalized dashboard to view notifications and manage your submitted papers.
              </p>

              <Link
                href="/submission/portal" // Update this path to match your actual dashboard route
                className="w-full bg-irms-blue text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-900 transition-all shadow-md hover:shadow-lg mb-6 flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <hr className="my-6 border-slate-100"/>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-irms-red" /> Need Assistance?
                </h4>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  If you require technical support or have questions regarding your submission status, our team is here to help.
                </p>
                <a
                  href="mailto:irms2026.secretariat@gmail.com"
                  className="text-irms-red hover:text-red-800 font-bold text-sm flex items-center gap-1 group w-fit transition-colors"
                >
                  Contact Admin
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}