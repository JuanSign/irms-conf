'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, LogOut, Settings, Loader2, FileText } from 'lucide-react';
import { getUserAbstracts } from '@/actions/submissions';
import { AbstractSubmission } from '@/types/submission';

import Sidebar from '@/components/portal/Sidebar';
import SubmissionCard from '@/components/portal/SubmissionCard';
import SubmissionModal from '@/components/portal/SubmissionModal';

export default function PortalPage() {
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<AbstractSubmission[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadSubmissions = async () => {
    setIsLoadingData(true);
    const result = await getUserAbstracts();
    if (result.success) {
      setMySubmissions(result.data as AbstractSubmission[]);
    } else {
      toast.error("Could not load your submissions.");
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1 text-lg">
              Welcome back, <span className="font-semibold text-gray-900">{session?.user?.name || "Author"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => signOut({ callbackUrl: '/submission/register' })} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition shadow-sm cursor-pointer">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Actions Header */}
            <div className="bg-linear-to-r from-white to-slate-50 p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">New Submission</h3>
                <p className="text-sm text-gray-500 mt-0.5">Ready to submit another abstract?</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-irms-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <Plus size={18} /> Submit Abstract
              </button>
            </div>

            {/* Submissions List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-xl text-gray-900">My Abstracts</h3>
                <span className="bg-blue-50 text-irms-blue border border-blue-100 text-xs font-bold px-3 py-1 rounded-full">
                  {mySubmissions.length} Active
                </span>
              </div>

              {isLoadingData ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center text-gray-400">
                   <Loader2 size={36} className="animate-spin mb-4 text-irms-blue" />
                   <p className="font-medium text-gray-500">Loading your abstracts...</p>
                </div>
              ) : mySubmissions.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <FileText size={32} className="text-gray-300" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">No abstracts found</h4>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">You haven't submitted any abstracts yet. Click the button above to start your first submission.</p>
                </div>
              ) : (
                mySubmissions.map((sub) => <SubmissionCard key={sub.id} sub={sub} />)
              )}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar session={session} />

        </div>
      </div>

      {/* Modal Rendered Here */}
      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadSubmissions}
      />
    </main>
  );
}