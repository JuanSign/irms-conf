import { useState, useRef } from 'react';
import { X, Search, FileText, UploadCloud, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { searchAuthors, submitAbstract } from '@/actions/submissions';
import { getUploadUrl } from '@/actions/upload';
import { AuthorSearchResult } from '@/types/submission';

const topicsList = [
  "Fundamental Rock Mechanics",
  "Rock Engineering Analysis & Numerical Modeling",
  "Rock Mechanics Applications",
];

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubmissionModal({ isOpen, onClose, onSuccess }: SubmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AuthorSearchResult[]>([]);
  const [selectedCoAuthors, setSelectedCoAuthors] = useState<AuthorSearchResult[]>([]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length >= 2) {
      // Typecasting the return if your action doesn't return the exact typed object natively yet
      const results = (await searchAuthors(val)) as AuthorSearchResult[];
      const filtered = results.filter(r => !selectedCoAuthors.find(c => c.id === r.id));
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const addCoAuthor = (user: AuthorSearchResult) => {
    setSelectedCoAuthors([...selectedCoAuthors, user]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeCoAuthor = (userId: string) => {
    setSelectedCoAuthors(selectedCoAuthors.filter(u => u.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Grab the form data IMMEDIATELY before any async pauses
    const formData = new FormData(e.currentTarget);
    const paperTitle = formData.get('title') as string;

    if (!selectedFile) return toast.error("Please upload a PDF abstract.");
    if (!paperTitle) return toast.error("Please provide a paper title.");

    setIsSubmitting(true);
    const loadingToast = toast.loading("Preparing upload...");

    try {
      // Create a clean filename from the user's title
      const cleanTitle = paperTitle.substring(0, 50).trim();
      const newFilename = `${cleanTitle}.pdf`;

      const { presignedUrl, fileUrl, error: urlError } = await getUploadUrl(newFilename, selectedFile.type);

      if (urlError || !presignedUrl || !fileUrl) {
        throw new Error(urlError || "Failed to get upload authorization.");
      }

      toast.loading("Uploading abstract...", { id: loadingToast });
      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: { 'Content-Type': selectedFile.type },
      });
      if (!uploadRes.ok) throw new Error("Cloudflare upload failed.");

      toast.loading("Saving submission...", { id: loadingToast });

      // Inject the extra data into the FormData
      formData.set('fileUrl', fileUrl);
      formData.set('coAuthors', JSON.stringify(selectedCoAuthors.map(u => u.id)));

      const dbResult = await submitAbstract(formData);
      if (dbResult?.error) throw new Error(dbResult.error);

      toast.success("Abstract submitted successfully!", { id: loadingToast });
      onSuccess();
      onClose();

    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error(errMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !isSubmitting && onClose()}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-gray-900">Submit New Abstract</h3>
          <button onClick={() => !isSubmitting && onClose()} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Paper Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Paper Title</label>
              <input type="text" name="title" required disabled={isSubmitting} placeholder="e.g., Numerical Analysis of Tunnel Stability..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-irms-blue/20 focus:border-irms-blue transition disabled:bg-gray-50" />
            </div>

            {/* Topic Dropdown */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Symposium Topic</label>
              <div className="relative">
                <select name="topic" required defaultValue="" disabled={isSubmitting} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-irms-blue/20 focus:border-irms-blue transition appearance-none bg-white text-gray-700 disabled:bg-gray-50">
                  <option value="" disabled>Select a topic...</option>
                  {topicsList.map((topic, idx) => (
                    <option key={idx} value={topic}>{topic}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <MoreVertical size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Co-Authors Search Area */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner">
              <label className="block text-sm font-bold text-gray-900 mb-2">Add Co-Authors (Optional)</label>

              {selectedCoAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCoAuthors.map(user => (
                    <span key={user.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-irms-blue text-white shadow-sm">
                      {user.name}
                      <button type="button" onClick={() => removeCoAuthor(user.id)} disabled={isSubmitting} className="hover:text-red-200 disabled:opacity-50 transition-colors"><X size={14}/></button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" value={searchQuery} onChange={handleSearch} disabled={isSubmitting} placeholder="Search registered users by name or email..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-irms-blue/20 focus:border-irms-blue transition disabled:bg-gray-50" />

                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {searchResults.map(user => (
                      <div key={user.id} onClick={() => addCoAuthor(user)} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors">
                        <div className="font-bold text-sm text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{user.email} • {user.affiliation || 'No Affiliation'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Upload Abstract (PDF)</label>
              <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} disabled={isSubmitting} />
              <div onClick={() => !isSubmitting && fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-irms-blue hover:bg-blue-50/30'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${selectedFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {selectedFile ? <FileText size={24} /> : <UploadCloud size={24} />}
                </div>
                <p className="text-sm font-bold text-gray-900">{selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}</p>
                <p className={`text-xs mt-1 ${selectedFile ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF only'}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => onClose()} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-irms-blue hover:bg-blue-800 rounded-lg shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : 'Submit Abstract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}