'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, FileText, BellRing, Mail, Lock } from 'lucide-react';
import { getUserAbstracts } from '@/actions/submissions';
import { AbstractSubmission } from '@/types/submission';

import Sidebar from '@/components/portal/Sidebar';
import SubmissionRow from '@/components/portal/SubmissionRow';
import EditAbstractModal from '@/components/portal/EditAbstractModal';

export default function PortalPage() {
  const { data: session } = useSession();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<AbstractSubmission | null>(null);

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

  const openEditModal = (sub: AbstractSubmission) => {
    setEditingSubmission(sub);
    setIsEditOpen(true);
  };

  // Graceful handler in case the Sidebar still has a "New Submission" button
  const handleSubmissionClosed = () => {
    toast('Submissions are officially closed.', {
      icon: <Lock size={18} className="text-slate-400" />,
      style: {
        borderRadius: '10px',
        background: '#1e293b',
        color: '#fff',
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex flex-col lg:flex-row gap-8 items-start relative">

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 z-10 flex flex-col">
          <Sidebar
            session={session}
            onNewSubmission={handleSubmissionClosed}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">My Abstracts</h2>
              <p className="text-gray-500 text-sm mt-1">Manage and track the status of your submitted papers.</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap border border-blue-200">
              {mySubmissions.length} {mySubmissions.length === 1 ? 'Total' : 'Total'}
            </span>
          </div>

          {/* Important Announcement Banner */}
          <div className="bg-linear-to-r from-blue-50 to-white border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start gap-4">
            <div className="bg-blue-100 text-irms-blue p-3 rounded-xl shrink-0">
              <BellRing size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                Review Phase is Active
                <span className="bg-slate-200 text-slate-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold">Submissions Closed</span>
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed max-w-2xl">
                The call for papers has ended and we are no longer accepting new submissions. All existing abstracts are currently undergoing peer review. <strong>Please check this portal regularly</strong> for official feedback, revision requests, and final acceptance notifications.
              </p>
            </div>
          </div>

          {/* Submissions Table / List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">Title & Topic</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Date Submitted</div>
              <div className="col-span-1 text-right"></div>
            </div>

            <div className="divide-y divide-gray-100">
              {isLoadingData ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                   <Loader2 size={36} className="animate-spin mb-4 text-irms-blue" />
                   <p className="font-medium text-gray-500">Loading your abstracts...</p>
                </div>
              ) : mySubmissions.length === 0 ? (
                <div className="py-20 text-center px-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                    <FileText size={28} className="text-slate-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">No abstracts found</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                    You do not have any active submissions on record. The submission window has officially closed.
                  </p>
                  <a
                    href="mailto:admin@irms2026.org"
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
                  >
                    <Mail size={16} className="text-slate-500" />
                    Contact Administrator
                  </a>
                </div>
              ) : (
                mySubmissions.map((sub) => (
                  <SubmissionRow
                    key={sub.id}
                    sub={sub}
                    onEdit={() => openEditModal(sub)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      <EditAbstractModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingSubmission(null); }}
        onSuccess={loadSubmissions}
        initialData={editingSubmission}
      />
    </main>
  );
}