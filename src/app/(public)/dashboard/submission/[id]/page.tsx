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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Accepted': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={16}/> };
    case 'Rejected': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: <AlertCircle size={16}/> };
    case 'Revision Required': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', icon: <AlertCircle size={16}/> };
    case 'Under Review': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: <FileSearch size={16}/> };
    default: return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Clock size={16}/> };
  }
};

export default async function AbstractDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/dashboard/register");

  const { id } = await params;

  const abstractData = await db.query.abstracts.findFirst({
    where: eq(abstracts.id, id),
    with: {
      author: true,
      coauthors: {
        with: { user: true }
      },
      comments: {
        with: { admin: true }
      },
      reviews: {
        with: { admin: true }
      }
    }
  });

  if (!abstractData) redirect("/dashboard");

  const isWriter = abstractData.writerId === session.user.id;
  const isCoauthor = abstractData.coauthors.some(co => co.userId === session.user.id);

  if (!isWriter && !isCoauthor) {
    redirect("/dashboard");
  }

  const badge = getStatusBadge(abstractData.status);

  const timeline = [
    ...abstractData.comments.map(c => ({ type: 'comment' as const, date: c.createdAt, data: c })),
    ...abstractData.reviews.map(r => ({ type: 'review' as const, date: r.createdAt, data: r }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="min-h-screen bg-irms-light pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-irms-blue transition-colors mb-2">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Submission Details</h1>
              {isWriter ? (
                <span className="text-[10px] font-bold text-white bg-irms-blue px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 mt-1">
                  <PenTool size={10} /> Primary
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 mt-1">
                  <Users size={10} /> Co-Author
                </span>
              )}
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold shadow-sm ${badge.bg} ${badge.text} ${badge.border}`}>
            {badge.icon} <span className="uppercase tracking-wider">{abstractData.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <span className="inline-block text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wider mb-4">
                  {abstractData.topic}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-800 leading-snug mb-6">
                  {abstractData.title}
                </h2>
                
                <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" />
                    Submitted: {format(new Date(abstractData.createdAt), 'MMMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-slate-400" />
                    Last Updated: {format(new Date(abstractData.updatedAt), 'MMMM dd, yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 sm:p-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-1">Original Manuscript</p>
                  <p className="text-xs text-slate-500">{abstractData.fileName}</p>
                </div>
                <a 
                  href={abstractData.path} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:border-irms-blue hover:text-irms-blue transition-all shadow-sm"
                >
                  <Download size={18} /> Download PDF
                </a>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 p-2.5 rounded-xl text-irms-blue"><Users size={20} /></div>
                <h3 className="font-extrabold text-lg text-slate-800">Authorship</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                      {abstractData.author.name}
                      <span className="text-[10px] bg-irms-blue text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Primary</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{abstractData.author.email}</p>
                  </div>
                </div>

                {abstractData.coauthors.map((co) => (
                  <div key={co.userId} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-800 flex items-center gap-2">
                        {co.user.name}
                        {session.user.id === co.userId && (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider">You</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{co.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 h-full min-h-[500px]">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600"><MessageSquare size={20} /></div>
                <h3 className="font-extrabold text-lg text-slate-800">Committee Feedback</h3>
              </div>

              {timeline.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <Clock size={28} className="text-slate-300" />
                  </div>
                  <p className="text-slate-800 font-bold mb-1">Under Review</p>
                  <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">
                    The scientific committee is currently evaluating your submission. Feedback will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-sm shrink-0 ${
                        item.type === 'comment' ? 'bg-amber-100 text-amber-600' : 'bg-irms-blue text-white'
                      }`}>
                        {item.type === 'comment' ? <MessageSquare size={16} /> : <FileText size={16} />}
                      </div>

                      <div className="flex-1 min-w-0 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-xs font-bold text-slate-800">
                            {item.data.admin?.role || 'Reviewer'}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {format(new Date(item.date), 'MMM dd')}
                          </p>
                        </div>
                        
                        {item.type === 'comment' ? (
                          <p className="text-sm text-slate-600 leading-relaxed">
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
                              className="inline-flex items-center gap-2 text-xs font-bold bg-white border border-slate-200 text-irms-blue px-4 py-2 rounded-xl hover:border-irms-blue transition-all"
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