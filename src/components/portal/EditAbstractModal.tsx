"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, FileText, Search, UserPlus, UploadCloud, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { updateAbstract, searchAuthors } from "@/actions/submissions";
import { getUploadUrl } from "@/actions/files";
import { AbstractSubmission, TopicType, AuthorSearchResult } from "@/types/submission";

const TOPICS: TopicType[] = [
  'Fundamental Rock Mechanics',
  'Rock Engineering Analysis & Numerical Modeling',
  'Rock Mechanics Applications'
];

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: AbstractSubmission | null;
}

export default function EditAbstractModal({ isOpen, onClose, onSuccess, initialData }: EditModalProps) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState<TopicType>(TOPICS[0]);
  const [file, setFile] = useState<File | null>(null);

  const [coAuthors, setCoAuthors] = useState<AuthorSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AuthorSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setTopic(initialData.topic as TopicType);
      setFile(null);

      const existingCoAuthors = initialData.coauthors?.map(ca => ca.user) || [];
      setCoAuthors(existingCoAuthors);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const fetchAuthors = async () => {
      if (searchQuery.length < 2) return setSearchResults([]);
      setIsSearching(true);
      try {
        const results = await searchAuthors(searchQuery) as AuthorSearchResult[];
        setSearchResults(results.filter(user => !coAuthors.some(ca => ca.id === user.id)));
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };
    const timeoutId = setTimeout(fetchAuthors, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, coAuthors]);

  if (!isOpen || !initialData) return null;

  const handleAddCoAuthor = (user: AuthorSearchResult) => {
    setCoAuthors(prev => [...prev, user]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveCoAuthor = (userId: string) => {
    setCoAuthors(prev => prev.filter(u => u.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalFileUrl = initialData.path;

      if (file) {
        const { presignedUrl, fileUrl, error } = await getUploadUrl(file.type, initialData.id);
        if (error || !presignedUrl) throw new Error(error || "Upload failed.");

        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!uploadRes.ok) throw new Error("Failed to replace file in Cloudflare.");

        finalFileUrl = fileUrl;
      }

      const formData = new FormData();
      formData.append("id", initialData.id);
      formData.append("title", title);
      formData.append("topic", topic);
      formData.append("fileUrl", finalFileUrl);
      formData.append("coAuthors", JSON.stringify(coAuthors.map(ca => ca.id)));

      const result = await updateAbstract(formData);
      if (result.error) throw new Error(result.error);

      toast.success("Changes saved successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0 bg-white">
          <h2 className="text-xl font-extrabold text-slate-900">Edit Abstract Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Abstract Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium text-slate-900"
              />
            </div>

            {/* Topic Enum Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Research Topic</label>
              <select
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value as TopicType)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium text-slate-900 appearance-none cursor-pointer"
              >
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Co-Authors UI */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Co-Authors</label>

              {coAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {coAuthors.map(user => (
                    <div key={user.id} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 pl-3 pr-1.5 py-1.5 rounded-lg text-sm shadow-sm">
                      <span className="font-semibold text-blue-800">{user.name}</span>
                      <button type="button" onClick={() => handleRemoveCoAuthor(user.id)} className="p-1 text-blue-400 hover:text-red-500 hover:bg-white rounded-md transition-colors"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleagues to add..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                />

                {searchQuery.length > 1 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto overflow-hidden">
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-slate-500 flex justify-center gap-2 items-center">
                        <Loader2 size={16} className="animate-spin text-blue-500" /> Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-1">
                        {searchResults.map(user => (
                          <button key={user.id} type="button" onClick={() => handleAddCoAuthor(user)} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex justify-between items-center transition-colors group">
                            <div>
                              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <div className="p-1.5 rounded-md text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              <UserPlus size={16} />
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-500">No registered users found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Unified Replace File UI */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Abstract Document</label>
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">

                {/* Status showing either the uploaded file or the existing one */}
                <div className="flex-1 min-w-0 flex items-center gap-3 w-full">
                  <div className={`p-2.5 rounded-lg shrink-0 ${file ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <FileText size={24} />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {file ? file.name : "Current_Submission.pdf"}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium mt-0.5">
                      {file ? (
                         <span className="text-blue-600 flex items-center gap-1">New file selected <CheckCircle2 size={12}/></span>
                      ) : (
                        <a href={initialData.path} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1">
                          View Original <ArrowRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hidden File Input & Styled Trigger Button */}
                <div className="w-full sm:w-auto shrink-0">
                  <input
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <UploadCloud size={16} />
                    {file ? "Change File" : "Upload Replacement"}
                  </button>
                </div>

              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white flex justify-end gap-3 border-t border-gray-100 shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-form" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null} Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}