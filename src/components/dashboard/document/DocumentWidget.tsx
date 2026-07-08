'use client';

import Link from "next/link";
import { format } from "date-fns";
import {
  FileText, ArrowRight, Users, PenTool, AlertCircle, MonitorPlay, ChevronRight
} from "lucide-react";
import { AbstractSubmission } from "@/types/submission";
import { motion, Variants } from "framer-motion";

interface DocumentWidgetProps {
  abstracts: AbstractSubmission[];
  currentUserId: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Accepted': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Accepted' };
    case 'Rejected': return { color: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Rejected' };
    case 'Revision Required': return { color: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400', label: 'Revision Required' };
    case 'Under Review': return { color: 'bg-indigo-50 text-indigo-700 border-indigo-100', label: 'Under Review' };
    default: return { color: 'bg-slate-50 text-slate-700 border-slate-200', label: 'Submitted' };
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

export default function DocumentWidget({ abstracts, currentUserId }: DocumentWidgetProps) {
  return (
    <motion.section
      variants={containerVariants}
      initial={false}
      animate="visible"
      className="bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/40 flex flex-col h-full overflow-hidden"
    >
      <motion.div variants={itemVariants} className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="bg-irms-blue p-2.5 rounded-xl text-white shadow-sm shadow-blue-900/20">
            <FileText size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">My Submissions</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Track your abstracts and reviews</p>
          </div>
        </div>
      </motion.div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-start bg-slate-50/30">
        <div className="space-y-4 w-full">
          {abstracts.map((abstract) => {
            const statusConfig = getStatusConfig(abstract.status);
            const coauthorCount = abstract.coauthors?.length || 0;
            const commentsCount = abstract.comments?.length || 0;
            const hasFeedback = commentsCount > 0 || abstract.status === 'Revision Required';
            const isPrimaryAuthor = abstract.writerId === currentUserId;
            
            const needsSlides = abstract.status === 'Accepted' && !abstract.slideSubmission;

            return (
              <motion.div key={abstract.id} variants={itemVariants}>
                <Link
                  href={`/dashboard/submission/${abstract.id}`}
                  className={`flex group relative bg-white border rounded-2xl p-5 transition-all duration-300 flex-col gap-4 ${
                    needsSlides 
                      ? 'border-indigo-300 shadow-md shadow-indigo-100/50 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-200/50 ring-1 ring-indigo-50' 
                      : 'border-slate-200 shadow-sm shadow-slate-200/40 hover:border-irms-blue/40 hover:shadow-md hover:shadow-slate-200/50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      {format(new Date(abstract.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wide whitespace-nowrap shadow-sm ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base sm:text-lg leading-snug group-hover:text-irms-blue transition-colors duration-200 mb-2.5 line-clamp-2" title={abstract.title}>
                      {abstract.title}
                    </h3>
                    <span className="inline-flex text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {abstract.topic}
                    </span>
                  </div>

                  {hasFeedback && (
                    <div className="flex items-center gap-2.5 bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs font-bold px-3.5 py-2.5 rounded-xl">
                      <AlertCircle size={16} className="text-amber-500" strokeWidth={2.5} />
                      Feedback available for your review
                    </div>
                  )}

                  {needsSlides && (
                    <div className="relative overflow-hidden flex items-center justify-between gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-3.5 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 z-10">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                          <MonitorPlay size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold tracking-wide">Action Required</p>
                          <p className="text-[11px] text-indigo-100 font-medium mt-0.5">Submit your presentation slides</p>
                        </div>
                      </div>
                      <div className="z-10 bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1 hover:bg-indigo-50 transition-colors shadow-sm shrink-0">
                        <span className="text-[10px] uppercase tracking-wider">Submit</span>
                        <ChevronRight size={14} strokeWidth={3} />
                      </div>
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    </div>
                  )}

                  <div className="pt-4 mt-1 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {isPrimaryAuthor ? (
                        <div className="flex items-center gap-1.5 text-irms-blue text-[11px] font-bold bg-irms-blue/5 border border-irms-blue/10 px-2.5 py-1 rounded-md" title="Primary Author">
                          <PenTool size={12} />
                          <span>Primary</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-bold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md" title="Co-Author">
                          <Users size={12} />
                          <span>Co-Author</span>
                        </div>
                      )}

                      {coauthorCount > 0 && (
                        <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold bg-slate-50 border border-slate-100 px-2 py-1 rounded-md" title={`${coauthorCount} Co-author(s)`}>
                          <Users size={12} />
                          <span>+{coauthorCount}</span>
                        </div>
                      )}
                    </div>

                    <div className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                        hasFeedback
                          ? 'text-amber-700 bg-amber-100 group-hover:bg-amber-200'
                          : needsSlides
                          ? 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100'
                          : 'text-irms-blue bg-blue-50 group-hover:bg-blue-100'
                      }`}
                    >
                      <span>{hasFeedback ? 'View Feedback' : 'Details'}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}