"use client";

import { useState } from 'react';
import { Clock, MoreVertical, FileText, Download, Loader2, CheckCircle2, XCircle, MessageSquare, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { AbstractSubmission } from '@/types/submission';

interface SubmissionCardProps {
  sub: AbstractSubmission;
  onEdit: () => void;
}

export default function SubmissionCard({ sub, onEdit }: SubmissionCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const formattedDate = new Date(sub.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Accepted':
        return { bg: 'bg-green-50 text-green-700 border-green-200', icon: <CheckCircle2 size={12} /> };
      case 'Rejected':
        return { bg: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle size={12} /> };
      default: // Under Review
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={12} /> };
    }
  };

  const statusStyle = getStatusStyles(sub.status);

  // Rule: Can only edit if not Accepted
  const canEdit = sub.status !== 'Accepted';

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(sub.path);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${sub.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error("Failed to download file.");
      window.open(sub.path, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-6 group">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle.bg}`}>
                {statusStyle.icon} {sub.status}
              </span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-1.5 leading-tight transition-colors">
              {sub.title}
            </h4>
            <p className="text-sm text-gray-500 font-medium">
              Topic: <span className="text-gray-700">{sub.topic}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors font-medium text-sm"
              >
                <Pencil size={16} /> Edit
              </button>
            )}
          </div>
        </div>

        {sub.comments && sub.comments.length > 0 && (
          <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
            <h5 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              <MessageSquare size={14} /> Reviewer Feedback
            </h5>
            <div className="space-y-3">
              {sub.comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    Received on {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <div className="text-gray-500 font-medium flex items-center gap-1.5">
          <FileText size={14} /> Submitted on {formattedDate}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? 'Downloading...' : 'PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}