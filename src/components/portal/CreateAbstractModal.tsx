// @/components/portal/CreateAbstractModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, UploadCloud, Loader2, Search, UserPlus } from "lucide-react";
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

  // Reset form purely on open/close
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

  // Typesafe debounce search for Co-Authors
  useEffect(() => {
    const fetchAuthors = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchAuthors(searchQuery) as AuthorSearchResult[];
        // Filter out users already in the coAuthors list
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
      // 1. Get Presigned URL and our newly generated UUID
      const { presignedUrl, fileUrl, fileId, error } = await getUploadUrl(file.type);
      if (error || !presignedUrl || !fileId) throw new Error(error || "Upload failed.");

      // 2. Upload directly to Cloudflare
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Failed to upload file to Cloudflare.");

      // 3. Save to database using the SAME UUID
      const formData = new FormData();
      formData.append("id", fileId); // Attach generated UUID
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-extrabold text-gray-900">Submit Abstract</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form id="create-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter abstract title"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Topic</label>
              <select
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value as TopicType)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
              >
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Co-Authors UI */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Co-Authors (Optional)</label>

              {/* Selected Co-Authors Tags */}
              {coAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {coAuthors.map(user => (
                    <div key={user.id} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm shadow-sm">
                      <span className="font-medium text-gray-800">{user.name}</span>
                      <button type="button" onClick={() => handleRemoveCoAuthor(user.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleagues by name or email..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                />

                {/* Search Results Dropdown */}
                {searchQuery.length > 1 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-sm text-gray-500 flex justify-center gap-2 items-center">
                        <Loader2 size={14} className="animate-spin" /> Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map(user => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleAddCoAuthor(user)}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 flex justify-between items-center border-b last:border-0 border-gray-100 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <UserPlus size={16} className="text-blue-500" />
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-sm text-gray-500">No users found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Abstract Document (PDF)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  {file ? (
                    <>
                      <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-62.5">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="mb-1 text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-form"
            disabled={isSubmitting || !file}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit Abstract"}
          </button>
        </div>

      </div>
    </div>
  );
}