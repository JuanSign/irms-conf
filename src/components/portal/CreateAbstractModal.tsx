"use client";

import { useState, useEffect } from "react";
import { X, UploadCloud, Loader2, Search, UserPlus, FileText, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { submitAbstract, searchAuthors } from "@/actions/submissions";
import { getUploadUrl } from "@/actions/files";
import { TopicType, AuthorSearchResult } from "@/types/submission";

const TOPICS: TopicType[] = [
  'Fundamental Rock Mechanics',
  'Rock Engineering Analysis & Numerical Modeling',
  'Rock Mechanics Applications'
];

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAbstractModal({ isOpen, onClose, onSuccess }: CreateModalProps) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState<TopicType>(TOPICS[0]);
  const [file, setFile] = useState<File | null>(null);

  const [coAuthors, setCoAuthors] = useState<AuthorSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AuthorSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setTopic(TOPICS[0]);
      setFile(null);
      setCoAuthors([]);
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchAuthors = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchAuthors(searchQuery) as AuthorSearchResult[];
        setSearchResults(results.filter(user => !coAuthors.some(ca => ca.id === user.id)));
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchAuthors, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, coAuthors]);

  if (!isOpen) return null;

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
    if (!file) return toast.error("A PDF file is required.");
    setIsSubmitting(true);

    try {
      const { presignedUrl, fileUrl, fileId, error } = await getUploadUrl(file.type);
      if (error || !presignedUrl || !fileId) throw new Error(error || "Upload failed.");

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Failed to upload file to Cloudflare.");

      const formData = new FormData();
      formData.append("id", fileId);
      formData.append("title", title);
      formData.append("topic", topic);
      formData.append("fileUrl", fileUrl);
      formData.append("coAuthors", JSON.stringify(coAuthors.map(ca => ca.id)));

      const result = await submitAbstract(formData);
      if (result.error) throw new Error(result.error);

      toast.success("Abstract submitted successfully!");
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
          <h2 className="text-xl font-extrabold text-slate-900">Submit New Abstract</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
          <form id="create-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Abstract Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Topic */}
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Co-Authors (Optional)</label>

              {/* Selected Co-Authors Tags */}
              {coAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {coAuthors.map(user => (
                    <div key={user.id} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 pl-3 pr-1.5 py-1.5 rounded-lg text-sm shadow-sm group">
                      <span className="font-semibold text-blue-800">{user.name}</span>
                      <button type="button" onClick={() => handleRemoveCoAuthor(user.id)} className="p-1 text-blue-400 hover:text-red-500 hover:bg-white rounded-md transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleagues by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                />

                {/* Search Results Dropdown */}
                {searchQuery.length > 1 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto overflow-hidden">
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-slate-500 flex justify-center gap-2 items-center">
                        <Loader2 size={16} className="animate-spin text-blue-500" /> Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-1">
                        {searchResults.map(user => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleAddCoAuthor(user)}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex justify-between items-center transition-colors group"
                          >
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

            {/* File Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Abstract Document (PDF)</label>

              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="mb-1 text-sm text-slate-600"><span className="font-bold text-blue-600">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-slate-400 font-medium">PDF file up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-xl shadow-sm ring-1 ring-blue-50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={24} />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2"
                    title="Remove file"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white flex justify-end gap-3 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-form"
            disabled={isSubmitting || !file}
            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit Abstract"}
          </button>
        </div>

      </div>
    </div>
  );
}