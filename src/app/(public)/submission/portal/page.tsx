'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Ticket, ArrowRight, ArrowLeft, FileText, BellRing, CalendarDays } from 'lucide-react';

// Server Actions
import { getUserAbstracts } from '@/actions/submissions';
import { getUserRegistration } from '@/actions/registration';

// Types
import { AbstractSubmission } from '@/types/submission';
import { EventRegistration } from '@/types/registration';

// Components
import Sidebar from '@/components/portal/Sidebar';
import SubmissionRow from '@/components/portal/SubmissionRow';
import EditAbstractModal from '@/components/portal/EditAbstractModal';
import RegistrationWidget from '@/components/portal/RegistrationWidget';

export default function PortalPage() {
  const { data: session } = useSession();

  // Abstract Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<AbstractSubmission | null>(null);

  // Data State
  const [mySubmissions, setMySubmissions] = useState<AbstractSubmission[]>([]);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // UI State for toggling the registration form
  const [isRegistering, setIsRegistering] = useState(false);

  // Fetch Dashboard Data
  const loadDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const [subsResult, regResult] = await Promise.all([
        getUserAbstracts(),
        getUserRegistration()
      ]);

      if (subsResult.success) {
        setMySubmissions(subsResult.data as AbstractSubmission[]);
      }

      if (regResult.success && regResult.data) {
        setRegistration(regResult.data as EventRegistration);
      } else {
        setRegistration(null);
      }

    } catch (error) {
      toast.error("Could not load dashboard data.");
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const openEditModal = (sub: AbstractSubmission) => {
    setEditingSubmission(sub);
    setIsEditOpen(true);
  };

  const hasAbstracts = mySubmissions.length > 0;

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex flex-col lg:flex-row gap-8 items-start relative">

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-28 z-10 flex flex-col">
          <Sidebar session={session} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          {isLoadingData ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <Loader2 size={40} className="animate-spin mb-4 text-irms-blue" />
              <p className="font-semibold text-gray-500">Loading portal data...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* =========================================
                  MODULE A: REGISTRATION STATUS
                  ========================================= */}
              {!registration ? (

                !isRegistering ? (
                  /* 1. Unregistered Banner */
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row animate-in fade-in duration-300">

                    {/* Left Content Area - Brand Blue */}
                    <div className="bg-irms-blue px-8 py-10 lg:py-12 flex-1 text-white relative">
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
                          Registration Open
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                          IRMS Conference 2026
                        </h2>

                        <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-2xl mb-8">
                          Two days of keynote speeches, technical sessions, and networking events gathering industry leaders, practitioners, and academics.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex items-center gap-3 text-sm text-slate-200 bg-black/20 px-4 py-2.5 rounded-lg w-fit">
                            <CalendarDays size={18} className="text-white" />
                            <span>Includes Gala Dinner (July 15th)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Area - Clean White */}
                    <div className="bg-white px-8 py-10 lg:w-[320px] flex flex-col justify-center items-center text-center border-t lg:border-t-0 lg:border-l border-gray-100 shrink-0">
                      <div className="w-16 h-16 bg-slate-50 text-irms-blue rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                        <Ticket size={28} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Your Spot</h3>
                      <p className="text-sm text-slate-500 mb-8 px-4">
                        Select your professional category and process your payment invoice.
                      </p>

                      {/* Button to toggle the full widget */}
                      <button
                        onClick={() => setIsRegistering(true)}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-irms-blue text-white rounded-lg font-semibold hover:bg-[#002244] transition-colors shadow-sm"
                      >
                        Register Now
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 2. Full-Width Registration Form */
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 animate-in slide-in-from-bottom-4 duration-300">
                    <button
                      onClick={() => setIsRegistering(false)}
                      className="mb-6 text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 font-medium transition-colors w-fit"
                    >
                      <ArrowLeft size={16} /> Back to overview
                    </button>

                    <RegistrationWidget
                      registration={null}
                      onRegistrationUpdated={() => {
                        setIsRegistering(false); // Close the form view
                        loadDashboardData();     // Refresh the data (which will trigger the "Registered Widget" view)
                      }}
                    />
                  </div>
                )

              ) : (
                /* 3. Registered Progress Widget */
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                   <RegistrationWidget
                     registration={registration}
                     onRegistrationUpdated={loadDashboardData}
                   />
                </div>
              )}

              {/* =========================================
                  MODULE B: ABSTRACTS (Only rendered if > 0)
                  ========================================= */}
              {hasAbstracts && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="text-irms-blue" /> Submitted Abstracts
                    </h3>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start gap-4">
                    <div className="bg-white text-irms-blue p-2.5 rounded-lg border border-slate-200 shrink-0 shadow-sm">
                      <BellRing size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        Review Phase Active
                      </h3>
                      <p className="text-slate-600 text-sm mt-1.5 leading-relaxed max-w-3xl">
                        Your abstracts are currently undergoing peer review. Check here for official feedback, revision requests, and final acceptance notifications.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <div className="col-span-5">Title & Topic</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-3">Date Submitted</div>
                      <div className="col-span-1 text-right"></div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {mySubmissions.map((sub) => (
                        <SubmissionRow
                          key={sub.id}
                          sub={sub}
                          onEdit={() => openEditModal(sub)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Abstract Modal */}
      <EditAbstractModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingSubmission(null); }}
        onSuccess={loadDashboardData}
        initialData={editingSubmission}
      />
    </main>
  );
}