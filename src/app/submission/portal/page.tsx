'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, FileText } from 'lucide-react';
import { getUserAbstracts } from '@/actions/submissions';
import { AbstractSubmission } from '@/types/submission';

import Sidebar from '@/components/portal/Sidebar';
import SubmissionRow from '@/components/portal/SubmissionRow';
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex flex-col lg:flex-row gap-8 items-start relative">

      <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 z-10 flex flex-col">
        <Sidebar session={session} onNewSubmission={() => setIsCreateOpen(true)} />
      </div>

        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Abstracts</h2>
              <p className="text-gray-500 text-sm mt-1">Manage and track the status of your submissions.</p>
            </div>
            <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap">
              {mySubmissions.length} {mySubmissions.length === 1 ? 'Total' : 'Total'}
            </span>
          </div>

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
                   <Loader2 size={36} className="animate-spin mb-4 text-blue-600" />
                   <p className="font-medium text-gray-500">Loading your abstracts...</p>
                </div>
              ) : mySubmissions.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <FileText size={28} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">No abstracts found</h4>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">You haven't submitted any abstracts yet. Use the sidebar to create your first submission.</p>
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

      <CreateAbstractModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={loadSubmissions} />
      <EditAbstractModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditingSubmission(null); }} onSuccess={loadSubmissions} initialData={editingSubmission} />
    </main>
  );
}