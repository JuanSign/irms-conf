'use client';

import Link from "next/link";
import { format } from "date-fns";
import {
  FileText, ArrowRight, Users, PenTool, AlertCircle
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
    default: return { color: 'bg-white text-slate-700 border-slate-200', label: 'Submitted' };
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
      initial="hidden"
      animate="visible"
      className="bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/40 flex flex-col h-full overflow-hidden"
    >
      <motion.div variants={itemVariants} className="p-5 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-irms-blue/10 p-2.5 rounded-xl text-irms-blue">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">My Submissions</h2>
            <p className="text-xs text-slate-500 font-medium">Track your submissions & reviews</p>
          </div>
        </div>
      </motion.div>

      <div className="p-6 flex-1 flex flex-col justify-start">
        <div className="space-y-4 w-full">
          {abstracts.map((abstract) => {
            const statusConfig = getStatusConfig(abstract.status);
            const coauthorCount = abstract.coauthors?.length || 0;
            const commentsCount = abstract.comments?.length || 0;
            const hasFeedback = commentsCount > 0 || abstract.status === 'Revision Required';
            const isPrimaryAuthor = abstract.writerId === currentUserId;

            return (
              <motion.div key={abstract.id} variants={itemVariants}>
                <Link
                  href={`/dashboard/submission/${abstract.id}`}
                  className="flex group relative bg-slate-50/70 border border-slate-200 rounded-2xl p-5 hover:bg-white hover:border-irms-blue/40 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-200 flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-4 w-full">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {format(new Date(abstract.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wide whitespace-nowrap ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug group-hover:text-irms-blue transition-colors duration-150 mb-2 line-clamp-2" title={abstract.title}>
                      {abstract.title}
                    </h3>
                    <span className="inline-flex text-[11px] font-bold text-slate-500 bg-white border border-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {abstract.topic}
                    </span>
                  </div>

                  {hasFeedback && (
                    <div className="mt-1 flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold px-3 py-2 rounded-xl">
                      <AlertCircle size={14} className="text-amber-500" />
                      Feedback available for your review
                    </div>
                  )}

                  <div className="pt-4 mt-1 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {isPrimaryAuthor ? (
                        <div className="flex items-center gap-1.5 text-irms-blue text-xs font-bold bg-irms-blue/5 border border-irms-blue/10 px-2 py-1 rounded-md" title="Primary Author">
                          <PenTool size={13} />
                          <span>Primary</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-md" title="Co-Author">
                          <Users size={13} />
                          <span>Co-Author</span>
                        </div>
                      )}

                      {coauthorCount > 0 && (
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold" title={`${coauthorCount} Co-author(s)`}>
                          <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                          <Users size={13} />
                          <span>+{coauthorCount}</span>
                        </div>
                      )}
                    </div>

                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        hasFeedback
                          ? 'text-amber-700 bg-amber-100 group-hover:bg-amber-200'
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