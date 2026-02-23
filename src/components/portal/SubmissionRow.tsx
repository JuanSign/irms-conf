"use client";

import { useState } from 'react';
import { Clock, FileText, Download, Loader2, CheckCircle2, XCircle, MessageSquare, Pencil, ChevronDown, Calendar, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { AbstractSubmission } from '@/types/submission';

interface SubmissionRowProps {
  sub: AbstractSubmission;
  onEdit: () => void;
}

export default function SubmissionRow({ sub, onEdit }: SubmissionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const formattedDate = new Date(sub.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const updatedDate = sub.updatedAt ? new Date(sub.updatedAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : null;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Accepted': return { bg: 'bg-green-50 text-green-700 border-green-200', icon: <CheckCircle2 size={14} /> };
      case 'Rejected': return { bg: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle size={14} /> };
      case 'Revision Required': return { bg: 'bg-orange-50 text-orange-700 border-orange-200', icon: <Pencil size={14} /> };
      default: return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={14} /> };
    }
  };

  const statusStyle = getStatusStyles(sub.status);
  const canEdit = sub.status !== 'Accepted';

  const commentCount = sub.comments?.length || 0;
  const reviewCount = sub.reviews?.length || 0;
  const hasFeedback = commentCount > 0 || reviewCount > 0;

  const handleDownload = async (path: string, fallbackName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setIsDownloading(true);
      const response = await fetch(path);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fallbackName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error("Failed to download file.");
      window.open(path, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`transition-all duration-200 ${isExpanded ? 'bg-blue-50/20' : 'hover:bg-slate-50'}`}>

      {/* Table Row (Visible Header) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-6 py-4 cursor-pointer flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 group"
      >
        {/* Title, Topic & Badges */}
        <div className="col-span-5 min-w-0">
          <div className="flex items-center gap-3 lg:hidden mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${statusStyle.bg}`}>
              {statusStyle.icon} {sub.status}
            </span>
          </div>
          <h4 className="text-sm font-bold text-gray-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
            {sub.title}
          </h4>

          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-xs text-gray-500 font-medium truncate max-w-37.5 sm:max-w-50">
              {sub.topic}
            </p>

            {hasFeedback && (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                {commentCount > 0 && (
                  <span
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md shadow-sm"
                    title={`${commentCount} Comments`}
                  >
                    <MessageSquare size={12} /> {commentCount}
                  </span>
                )}
                {reviewCount > 0 && (
                  <span
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md shadow-sm"
                    title={`${reviewCount} Review Files`}
                  >
                    <FileDown size={12} /> {reviewCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status (Desktop) */}
        <div className="col-span-3 hidden lg:block">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${statusStyle.bg}`}>
            {statusStyle.icon} {sub.status}
          </span>
        </div>

        {/* Date */}
        <div className="col-span-3 text-sm text-gray-600 flex items-center gap-1.5">
          <Calendar size={14} className="text-gray-400" /> {formattedDate}
        </div>

        {/* Expand Action */}
        <div className="col-span-1 flex justify-end">
          <div className={`p-1.5 rounded-full text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-blue-100 text-blue-600' : ''}`}>
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Expanded Content Area */}
      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 border-t border-blue-100/50">

            {/* Top Bar of Expanded View: Actions & Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="text-xs text-gray-500">
                 {updatedDate && <span>Last updated: {updatedDate}</span>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => handleDownload(sub.path, `${sub.title}.pdf`, e)}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Your Document
                </button>

                {canEdit && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-sm font-bold rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                  >
                    <Pencil size={16} /> Edit Details
                  </button>
                )}
              </div>
            </div>

            {/* Reviewer Comments */}
            {sub.comments && sub.comments.length > 0 && (
              <div className="mt-2 mb-4">
                <h5 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  <MessageSquare size={14} /> Reviewer Comments
                </h5>
                <div className="space-y-3">
                  {sub.comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-xl" />
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <p className="text-[11px] text-gray-500 font-medium">
                          By <span className="font-bold text-gray-700">{comment.admin?.name || 'Reviewer'}</span>
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Documents */}
            {sub.reviews && sub.reviews.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h5 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  <FileDown size={14} /> Review Documents
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sub.reviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group/file shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0 group-hover/file:bg-red-100 transition-colors">
                          <FileText size={16} />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {review.fileName || 'Review_Document.pdf'}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Uploaded by <span className="font-semibold">{review.admin?.name || 'Admin'}</span> • {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDownload(review.filePath, review.fileName || 'review.pdf', e)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors shrink-0"
                        title="Download Review File"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}