// @/components/portal/EditAbstractModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Loader2, FileText, Search, UserPlus, UploadCloud } from "lucide-react";
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

  // Pre-fill form when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setTopic(initialData.topic as TopicType); // Ensure it matches enum
      setFile(null); // Reset file input (they only upload if replacing)

      const existingCoAuthors = initialData.coauthors?.map(ca => ca.user) || [];
      setCoAuthors(existingCoAuthors);

      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen, initialData]);

  // Typesafe debounce search
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

      // 1. If replacing the file, upload it over the existing ID
      if (file) {
        // Pass the EXISTING abstract ID to overwrite the file in Cloudflare!
        const { presignedUrl, fileUrl, error } = await getUploadUrl(file.type, initialData.id);
        if (error || !presignedUrl) throw new Error(error || "Upload failed.");

        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!uploadRes.ok) throw new Error("Failed to replace file in Cloudflare.");

        finalFileUrl = fileUrl; // Should be the same, but safe to update
      }

      // 2. Update database
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-extrabold text-gray-900">Edit Abstract</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Topic Enum Dropdown */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Topic</label>
              <select required value={topic} onChange={(e) => setTopic(e.target.value as TopicType)} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Co-Authors UI (This uses searchResults!) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Co-Authors</label>

              {coAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {coAuthors.map(user => (
                    <div key={user.id} className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-full text-sm shadow-sm">
                      <span className="font-medium text-gray-800">{user.name}</span>
                      <button type="button" onClick={() => handleRemoveCoAuthor(user.id)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleagues..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />

                {searchQuery.length > 1 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-sm text-gray-500 flex justify-center gap-2">
                        <Loader2 size={14} className="animate-spin" /> Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map(user => (
                        <button key={user.id} type="button" onClick={() => handleAddCoAuthor(user)} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex justify-between border-b last:border-0 border-gray-100">
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

            {/* Replace File UI */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Replace Document (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {!file && (
                  <a href={initialData.path} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline shrink-0 font-medium">
                    <FileText size={16} /> View Current
                  </a>
                )}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold bg-white border rounded-lg">Cancel</button>
          <button type="submit" form="edit-form" disabled={isSubmitting} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg flex gap-2">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null} Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}