// @/app/portal/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, LogOut, Loader2, FileText, LayoutDashboard } from 'lucide-react';
import { getUserAbstracts } from '@/actions/submissions';
import { AbstractSubmission } from '@/types/submission';

import Sidebar from '@/components/portal/Sidebar';
import SubmissionCard from '@/components/portal/SubmissionCard';
import CreateAbstractModal from '@/components/portal/CreateAbstractModal';
import EditAbstractModal from '@/components/portal/EditAbstractModal';

export default function PortalPage() {
  const { data: session } = useSession();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
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

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <LayoutDashboard className="text-blue-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Welcome back, <span className="font-semibold text-gray-900">{session?.user?.name || "Author"}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/submission/register' })}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm w-fit"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Actions Header */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Submit New Abstract</h3>
                <p className="text-sm text-gray-500 mt-1">Share your latest research findings with the committee.</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Plus size={18} /> New Submission
              </button>
            </div>

            {/* Submissions List Area */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-lg text-gray-900">My Abstracts</h3>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  {mySubmissions.length} {mySubmissions.length === 1 ? 'Submission' : 'Submissions'}
                </span>
              </div>

              <div className="p-6">
                {isLoadingData ? (
                  <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                     <Loader2 size={36} className="animate-spin mb-4 text-blue-600" />
                     <p className="font-medium text-gray-500">Loading your abstracts...</p>
                  </div>
                ) : mySubmissions.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FileText size={28} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">No abstracts found</h4>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">You haven't submitted any abstracts yet. Click the "New Submission" button to get started.</p>
                  </div>
                ) : (
                  <div className="max-h-150 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {mySubmissions.map((sub) => (
                      <SubmissionCard
                        key={sub.id}
                        sub={sub}
                        onEdit={() => openEditModal(sub)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Sidebar session={session} />
        </div>
      </div>

      {/* Modals */}
      <CreateAbstractModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={loadSubmissions} />
      <EditAbstractModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditingSubmission(null); }} onSuccess={loadSubmissions} initialData={editingSubmission} />
    </main>
  );
}