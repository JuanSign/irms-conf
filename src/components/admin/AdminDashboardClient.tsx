"use client";

import { useState, useTransition } from "react";
import { User, Abstract, Admin, AbstractComment } from "@/db/schema";
import { updateAbstractStatus, addAdminComment } from "@/actions/admin";
import { Search, Filter, FileText, MessageSquare, Check, RotateCcw, X, Send } from "lucide-react";

interface AbstractWithRelations extends Abstract {
  author: Pick<User, "name" | "email" | "affiliation"> | null;
  comments: (AbstractComment & { admin: Pick<Admin, "username"> | null })[];
  coauthors: { user: Pick<User, "name"> | null }[];
}

export default function AdminDashboardClient({ initialData }: { initialData: AbstractWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTopic, setFilterTopic] = useState("All");
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const filtered = initialData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.author?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === "All" || item.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  const handleStatusUpdate = (id: string, status: string) => {
    startTransition(async () => {
      await updateAbstractStatus(id, status);
    });
  };

  const handlePostComment = (id: string) => {
    const text = commentText[id];
    if (!text?.trim()) return;
    startTransition(async () => {
      await addAdminComment(id, text);
      setCommentText((prev) => ({ ...prev, [id]: "" }));
    });
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
            <div className="p-8">
              {/* Card Top */}
              <div className="flex flex-col xl:flex-row justify-between gap-6 mb-8">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border
                      ${abs.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        abs.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {abs.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{abs.topic}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-snug max-w-3xl">{abs.title}</h3>
                  <p className="text-slate-500 flex items-center gap-2">
                    <span className="font-bold text-slate-900 underline underline-offset-2">{abs.author?.name}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-sm italic">{abs.author?.affiliation}</span>
                  </p>
                </div>

                <div className="flex shrink-0">
                  <a href={abs.path} target="_blank" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                    <FileText size={18} /> View Document
                  </a>
                </div>
              </div>

              {/* Review History */}
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                  <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <MessageSquare size={14} /> Reviewer Thread
                  </h4>
                  <div className="space-y-4 max-h-50 overflow-y-auto pr-2 custom-scrollbar">
                    {abs.comments.length > 0 ? (
                      abs.comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                          <p className="text-slate-700 text-sm leading-relaxed mb-2 font-medium">{comment.content}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {comment.admin?.username} • {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No notes found for this submission.</p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Internal Note</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type feedback..."
                        className="w-full bg-white ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-4 pr-12 rounded-2xl outline-none text-sm font-medium transition-all"
                        value={commentText[abs.id] || ""}
                        onChange={(e) => setCommentText(prev => ({...prev, [abs.id]: e.target.value}))}
                      />
                      <button
                        onClick={() => handlePostComment(abs.id)}
                        disabled={isPending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleStatusUpdate(abs.id, "Accepted")}
                      disabled={isPending}
                      className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-2xl font-bold text-xs hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(abs.id, "Under Review")}
                      disabled={isPending}
                      className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold text-xs hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      <RotateCcw size={16} /> Review
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(abs.id, "Rejected")}
                      disabled={isPending}
                      className="flex items-center justify-center gap-2 bg-rose-100 text-rose-600 py-3 rounded-2xl font-bold text-xs hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <X size={16} /> Reject
                    </button>
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