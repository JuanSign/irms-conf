"use client";

import { useState, useTransition } from "react";
import { User, Abstract, Admin, AbstractComment, AbstractReview } from "@/db/schema";
import { updateAbstractStatus, addAdminComment, addAdminReviewFile, AbstractStatus } from "@/actions/admin";
import { getUploadUrl } from "@/actions/files";
import { Search, Filter, FileText, MessageSquare, Check, RotateCcw, X, Send, Paperclip, FileDown, Pencil, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AbstractWithRelations extends Abstract {
  author: Pick<User, "name" | "email" | "affiliation"> | null;
  comments: (AbstractComment & { admin: Pick<Admin, "username"> | null })[];
  reviews: (AbstractReview & { admin: Pick<Admin, "username"> | null })[];
  coauthors: { user: Pick<User, "name"> | null }[];
}

export default function AdminDashboardClient({ initialData }: { initialData: AbstractWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTopic, setFilterTopic] = useState("All");
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const filtered = initialData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.author?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === "All" || item.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  const handleStatusUpdate = (id: string, status: AbstractStatus) => {
    startTransition(async () => {
      await updateAbstractStatus(id, status);
      toast.success(`Status updated to ${status}`);
    });
  };

  const handlePostComment = (id: string) => {
    const text = commentText[id];
    if (!text?.trim()) return;
    startTransition(async () => {
      await addAdminComment(id, text);
      setCommentText((prev) => ({ ...prev, [id]: "" }));
      toast.success("Comment added");
    });
  };

  const handleFileUpload = async (abstractId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Uploading review file...");
    setUploadingId(abstractId);

    try {
      const { presignedUrl, fileUrl, error } = await getUploadUrl(file.type);
      if (error || !presignedUrl || !fileUrl) {
        throw new Error(error || "Failed to secure upload link.");
      }

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to Cloudflare.");
      }

      const formData = new FormData();
      formData.append("abstractId", abstractId);
      formData.append("fileUrl", fileUrl);
      formData.append("fileName", file.name);

      startTransition(async () => {
        await addAdminReviewFile(formData);
        toast.success("Review document uploaded!", { id: loadingToast });
      });
    } catch (error: any) {
      toast.error(error.message || "Upload failed.", { id: loadingToast });
    } finally {
      e.target.value = '';
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Modern Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search abstracts or authors..."
            className="w-full bg-white border-none shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-3 pl-12 rounded-2xl outline-none transition-all text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-72">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            className="w-full bg-white border-none shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-3 pl-12 rounded-2xl outline-none appearance-none text-slate-600 font-medium"
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
          >
            <option value="All">All Topics</option>
            <option value="Fundamental Rock Mechanics">Fundamental</option>
            <option value="Rock Engineering Analysis & Numerical Modeling">Modeling</option>
            <option value="Rock Mechanics Applications">Applications</option>
          </select>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.map((abs) => (
          <div key={abs.id} className="bg-white rounded-4xl p-1 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                <div className="lg:col-span-7 space-y-8">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border
                        ${abs.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          abs.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          abs.status === 'Revision Required' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {abs.status}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        {abs.topic}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 leading-snug">{abs.title}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-slate-900">{abs.author?.name}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-slate-500 italic">{abs.author?.affiliation}</span>
                    </div>
                    <a href={abs.path} target="_blank" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors mt-2">
                      <FileDown size={18} /> Download Original Document
                    </a>
                  </div>

                  {/* Feedback Thread */}
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      <MessageSquare size={14} /> Reviewer Thread
                    </h4>
                    <div className="space-y-4 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                      {abs.comments.length === 0 && abs.reviews.length === 0 && (
                        <p className="text-sm text-slate-400 italic">No notes or files found for this submission.</p>
                      )}

                      {/* Render Text Comments */}
                      {abs.comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                          <p className="text-slate-700 text-sm leading-relaxed mb-3">{comment.content}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {comment.admin?.username} • {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}

                      {/* Render Uploaded Review Files */}
                      {abs.reviews.map((review) => (
                        <div key={review.id} className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                              <FileText size={16} />
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-bold text-slate-800 truncate">{review.fileName}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                By {review.admin?.username} • {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <a href={review.filePath} target="_blank" className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <FileDown size={18} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">
                      Admin Actions
                    </h4>

                    {/* Status Updaters */}
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleStatusUpdate(abs.id, "Accepted")} disabled={isPending} className="flex flex-col items-center gap-1.5 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 py-3 rounded-2xl font-bold text-xs transition-all border border-emerald-100 hover:border-transparent">
                        <Check size={18} /> Accept
                      </button>
                      <button onClick={() => handleStatusUpdate(abs.id, "Revision Required")} disabled={isPending} className="flex flex-col items-center gap-1.5 bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-700 py-3 rounded-2xl font-bold text-xs transition-all border border-orange-100 hover:border-transparent">
                        <Pencil size={18} /> Needs Revision
                      </button>
                      <button onClick={() => handleStatusUpdate(abs.id, "Under Review")} disabled={isPending} className="flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-500 hover:text-white text-slate-600 py-3 rounded-2xl font-bold text-xs transition-all border border-slate-200 hover:border-transparent">
                        <RotateCcw size={18} /> Reviewing
                      </button>
                      <button onClick={() => handleStatusUpdate(abs.id, "Rejected")} disabled={isPending} className="flex flex-col items-center gap-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 py-3 rounded-2xl font-bold text-xs transition-all border border-rose-100 hover:border-transparent">
                        <X size={18} /> Reject
                      </button>
                    </div>

                    {/* Input Feedback */}
                    <div className="space-y-2 pt-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Text Note</label>
                      <div className="relative">
                        <textarea
                          placeholder="Type your feedback here..."
                          className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-4 pb-12 rounded-2xl outline-none text-sm resize-none transition-all"
                          rows={3}
                          value={commentText[abs.id] || ""}
                          onChange={(e) => setCommentText(prev => ({...prev, [abs.id]: e.target.value}))}
                        />
                        <button
                          onClick={() => handlePostComment(abs.id)}
                          disabled={isPending || !commentText[abs.id]?.trim()}
                          className="absolute right-3 bottom-3 bg-slate-900 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>

                    {/* File Upload Component */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attach Review File</label>
                      <label className={`flex items-center justify-center gap-2 w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 text-slate-500 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer ${(isPending || uploadingId === abs.id) ? 'opacity-50 pointer-events-none' : ''}`}>
                        {uploadingId === abs.id ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                        <span className="text-sm font-bold">
                          {uploadingId === abs.id ? 'Uploading...' : 'Upload Annotated PDF'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleFileUpload(abs.id, e)}
                        />
                      </label>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}