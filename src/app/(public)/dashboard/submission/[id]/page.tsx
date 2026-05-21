import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { abstracts } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft, FileText, Users, Calendar,
  MessageSquare, FileSearch, CheckCircle2,
  AlertCircle, Clock, Download, PenTool
} from "lucide-react";
import IopPublicationWidget from "@/components/dashboard/document/IopPublicationWidget";
import SlidesSubmissionWidget from "@/components/dashboard/document/SlidesSubmissionWidget";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Accepted': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={16}/> };
    case 'Rejected': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: <AlertCircle size={16}/> };
    case 'Revision Required': return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', icon: <AlertCircle size={16}/> };
    case 'Under Review': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: <FileSearch size={16}/> };
    default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: <Clock size={16}/> };
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default async function AbstractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/dashboard/register");

  const { id } = await params;

  const abstractData = await db.query.abstracts.findFirst({
    where: eq(abstracts.id, id),
    with: {
      author: true,
      coauthors: { with: { user: true } },
      comments: { with: { admin: true } },
      reviews: { with: { admin: true } },
      iopPublication: true,
      slideSubmission: true
    }
  });

  if (!abstractData) redirect("/dashboard");

  const isWriter = abstractData.writerId === session.user.id;
  const isCoauthor = abstractData.coauthors.some(co => co.userId === session.user.id);

  if (!isWriter && !isCoauthor) redirect("/dashboard");

  const badge = getStatusBadge(abstractData.status);
  const timeline = [
    ...abstractData.comments.map(c => ({ type: 'comment' as const, date: c.createdAt, data: c })),
    ...abstractData.reviews.map(r => ({ type: 'review' as const, date: r.createdAt, data: r }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="min-h-screen bg-irms-light pb-12 pt-20">
      <div className="sticky top-20 z-30 bg-irms-light/95 backdrop-blur-md pt-5 pb-4 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 shadow-sm shadow-slate-100/50">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-irms-blue transition-colors w-fit">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight line-clamp-2" title={abstractData.title}>
            {abstractData.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm shadow-slate-200/50 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg uppercase tracking-wider">
                    {abstractData.topic}
                  </span>
                  {isWriter ? (
                    <span className="text-[10px] font-bold text-irms-blue bg-irms-blue/10 border border-irms-blue/20 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                      <PenTool size={12} /> Primary
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                      <Users size={12} /> Co-Author
                    </span>
                  )}
                </div>
                <div className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-xs sm:text-sm ${badge.bg} ${badge.text} ${badge.border}`}>
                  {badge.icon} <span className="uppercase tracking-wider">{abstractData.status}</span>
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-slate-800 mb-6">Submission Details</h3>

              <div className="flex flex-wrap gap-8 text-sm font-medium text-slate-600 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 shrink-0"><Calendar size={18} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Submitted</p>
                    <p className="text-slate-800 font-bold">{format(new Date(abstractData.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 shrink-0"><Clock size={18} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Last Updated</p>
                    <p className="text-slate-800 font-bold">{format(new Date(abstractData.updatedAt), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 mb-3">Original Manuscript</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl group hover:border-irms-blue/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-irms-blue shrink-0"><FileText size={24} strokeWidth={1.5} /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate" title={abstractData.fileName}>{abstractData.fileName}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">PDF Document</p>
                    </div>
                  </div>
                  <a href={abstractData.path} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-irms-blue hover:text-irms-blue transition-all shrink-0">
                    <Download size={16} /> Download
                  </a>
                </div>
              </div>
            </div>

            <SlidesSubmissionWidget abstractId={abstractData.id} slideData={abstractData.slideSubmission} />

            {abstractData.status === 'Accepted' && (
              <IopPublicationWidget abstractId={abstractData.id} iopData={abstractData.iopPublication} />
            )}

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm shadow-slate-200/50 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-irms-blue/10 p-2.5 rounded-xl text-irms-blue"><Users size={20} /></div>
                <h3 className="font-extrabold text-lg text-slate-800">Authorship</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-irms-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {getInitials(abstractData.author.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-slate-800 truncate" title={abstractData.author.name}>
                        {abstractData.author.name}
                      </p>
                      <span className="text-[9px] bg-irms-blue/10 text-irms-blue border border-irms-blue/20 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">Primary</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate" title={abstractData.author.email}>{abstractData.author.email}</p>
                  </div>
                </div>
                {abstractData.coauthors.map((co) => (
                  <div key={co.userId} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">{getInitials(co.user.name)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-slate-800 truncate" title={co.user.name}>
                          {co.user.name}
                        </p>
                        {session.user.id === co.userId && (
                          <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">You</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate" title={co.user.email}>{co.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-57.5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm shadow-slate-200/50 p-6 sm:p-8 min-h-100 max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 mb-8 sticky top-0 bg-white z-20 pb-2">
                <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600"><MessageSquare size={20} /></div>
                <h3 className="font-extrabold text-lg text-slate-800">Feedback</h3>
              </div>

              {timeline.length === 0 ? (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <Clock size={28} className="text-slate-300" />
                  </div>
                  <p className="text-slate-800 font-bold mb-1">Pending Review</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    The scientific committee is currently evaluating your submission. Feedback will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-sm shrink-0 mt-1 ${
                        item.type === 'comment' ? 'bg-amber-100 text-amber-600' : 'bg-irms-blue text-white'
                      }`}>
                        {item.type === 'comment' ? <MessageSquare size={16} /> : <FileText size={16} />}
                      </div>

                      <div className="flex-1 min-w-0 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-xs font-bold text-slate-800">
                            {item.data.admin?.role || 'Committee Member'}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                            {format(new Date(item.date), 'MMM dd')}
                          </p>
                        </div>

                        {item.type === 'comment' ? (
                          <p className="text-sm text-slate-600 leading-relaxed wrap-break-word whitespace-pre-wrap">
                            {item.data.content}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm text-slate-600 font-medium">
                              An annotated manuscript has been uploaded with required revisions.
                            </p>
                            <a
                              href={item.data.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-bold bg-white border border-slate-200 text-irms-blue px-4 py-2.5 rounded-xl hover:border-irms-blue hover:shadow-sm transition-all w-full justify-center"
                            >
                              <Download size={14} /> Download Annotations
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}