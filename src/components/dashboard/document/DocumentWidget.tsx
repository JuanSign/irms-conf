// components/dashboard/document/DocumentWidget.tsx
'use client';

import Link from "next/link";
import { format } from "date-fns";
import { 
  FileText, FilePlus, ArrowRight, MessageSquare, 
  Users, AlertCircle, FileSearch, PenTool
} from "lucide-react";
import { AbstractSubmission } from "@/types/submission";

interface DocumentWidgetProps {
  abstracts: AbstractSubmission[];
  currentUserId: string; // <-- Added this to check authorship
}

export default function DocumentWidget({ abstracts, currentUserId }: DocumentWidgetProps) {
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Accepted': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Accepted' };
      case 'Rejected': return { color: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Rejected' };
      case 'Revision Required': return { color: 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-100', label: 'Revision Required' };
      case 'Under Review': return { color: 'bg-indigo-50 text-indigo-700 border-indigo-100', label: 'Under Review' };
      default: return { color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Submitted' };
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/40 flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="bg-irms-blue/10 p-2 rounded-xl text-irms-blue">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">My Submission</h2>
            <p className="text-xs text-slate-500 font-medium">Track your submissions & reviews</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-start">
        {abstracts.length > 0 ? (
          <div className="space-y-4 w-full">
            {abstracts.map((abstract) => {
              const statusConfig = getStatusConfig(abstract.status);
              const coauthorCount = abstract.coauthors?.length || 0;
              const commentsCount = abstract.comments?.length || 0;
              const hasFeedback = commentsCount > 0 || abstract.status === 'Revision Required';
              
              // 👇 Determine Authorship Role
              const isPrimaryAuthor = abstract.writerId === currentUserId;

              return (
                <div 
                  key={abstract.id} 
                  className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-irms-blue/40 hover:shadow-md hover:shadow-slate-100 transition-all duration-200 flex flex-col justify-between gap-4 group"
                >
                  {hasFeedback && (
                    <div className="absolute -top-3 -right-2 flex items-center gap-1.5 bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md animate-in zoom-in">
                      <MessageSquare size={10} fill="currentColor" />
                      Feedback Available
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    {/* Authorship & Topic Badges */}
                    <div className="flex flex-wrap items-center gap-2 max-w-[65%]">
                      {isPrimaryAuthor ? (
                        <span className="text-[10px] font-bold text-white bg-irms-blue px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
                          <PenTool size={10} /> Primary
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
                          <Users size={10} /> Co-Author
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider line-clamp-1">
                        {abstract.topic}
                      </span>
                    </div>

                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wide whitespace-nowrap ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug group-hover:text-irms-blue transition-colors duration-150" title={abstract.title}>
                      {abstract.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-2">
                      Submitted on {format(new Date(abstract.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold">
                      {coauthorCount > 0 && (
                        <div className="flex items-center gap-1.5" title={`${coauthorCount} Co-author(s)`}>
                          <Users size={14} />
                          <span>{coauthorCount}</span>
                        </div>
                      )}
                      {commentsCount > 0 && (
                        <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md">
                          <MessageSquare size={14} />
                          <span>{commentsCount} Notes</span>
                        </div>
                      )}
                    </div>

                    <Link 
                      href={`/dashboard/submission/${abstract.id}`} 
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                        hasFeedback 
                          ? 'bg-irms-blue text-white shadow-md shadow-irms-blue/20 hover:bg-[#002b5c]' 
                          : 'text-irms-blue bg-blue-50/50 hover:bg-blue-100'
                      }`}
                    >
                      <span>{hasFeedback ? 'View Feedback' : 'View Details'}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center flex-1 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-irms-blue/50">
              <FileSearch size={28} strokeWidth={1.5} />
            </div>
            <h4 className="text-slate-800 font-extrabold text-base mb-1">No abstracts yet</h4>
            <p className="text-slate-500 text-sm font-medium mb-5 max-w-[260px] leading-relaxed mx-auto">
              Ready to present at IRMS 2026? Upload your technical abstract for committee review.
            </p>
            <Link 
              href="/dashboard/abstracts/new" 
              className="text-sm font-bold text-white bg-irms-blue px-6 py-2.5 rounded-xl hover:bg-[#002b5c] transition-colors shadow-sm shadow-irms-blue/20"
            >
              Start Submission
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}