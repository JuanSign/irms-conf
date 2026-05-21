'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, AlertCircle, Upload, FileText, Download, Loader2, Trash2, MonitorPlay } from "lucide-react";
import { submitPresentationSlides, cancelSlideSubmission } from "@/app/(public)/dashboard/submission/[id]/actions";
import { getPaymentProofUploadUrl } from "@/actions/files";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SlideSubmission } from "@/db/schema";

interface SlidesWidgetProps {
  abstractId: string;
  slideData: SlideSubmission | null | undefined;
}

const SLIDE_TEMPLATES = [
  { name: "PPT Template", file: "PPT_Template.pptx", path: "/doc/PPT Template.pptx", type: "PowerPoint" },
  { name: "PPT Example", file: "PPT_Example.pdf", path: "/doc/PPT Example.pdf", type: "PDF" }
];

const viewVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

export default function SlidesSubmissionWidget({ abstractId, slideData }: SlidesWidgetProps) {
  const router = useRouter();
  const [activeData, setActiveData] = useState<SlideSubmission | null | undefined>(slideData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setActiveData(slideData);
  }, [slideData]);

  const handleUpload = async () => {
    if (!slideFile) return setError("Please select a presentation file.");
    setLoading(true); setError('');

    try {
      const { presignedUrl, fileUrl, error: urlError } = await getPaymentProofUploadUrl(slideFile.type, slideFile.name);
      if (urlError || !presignedUrl || !fileUrl) throw new Error(urlError || "Secure upload failed.");

      const uploadRes = await fetch(presignedUrl, { method: 'PUT', body: slideFile, headers: { 'Content-Type': slideFile.type } });
      if (!uploadRes.ok) throw new Error("Cloud upload failed.");

      const confirmRes = await submitPresentationSlides(abstractId, fileUrl);
      if (confirmRes?.error) throw new Error(confirmRes.error);

      setActiveData(prev => prev ? { ...prev, status: 'Under Review', fileUrl } : { abstractId, status: 'Under Review', fileUrl } as SlideSubmission);
      setSlideFile(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true); setError('');
    const res = await cancelSlideSubmission(abstractId);
    if (res?.error) {
      setError(res.error);
    } else {
      setActiveData(null);
      setSlideFile(null);
      router.refresh();
    }
    setLoading(false);
  };

  const canResubmit = activeData && activeData.status !== 'Accepted';

  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-sm shadow-slate-200/50 p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600"><MonitorPlay size={20} /></div>
        <h3 className="font-extrabold text-lg text-slate-800">Presentation Slides</h3>
      </div>

      <AnimatePresence mode="wait">
        {activeData && (
          <motion.div key="status" variants={viewVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Slide Status</p>
              <div className="flex items-center gap-2">
                {activeData.status === 'Accepted' && <CheckCircle2 size={18} className="text-emerald-500" />}
                {activeData.status === 'Under Review' && <Clock size={18} className="text-amber-500" />}
                {activeData.status === 'Rejected' && <AlertCircle size={18} className="text-rose-500" />}
                <p className="font-extrabold text-slate-800">{activeData.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a href={activeData.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none text-center bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                View Uploaded
              </a>
              {canResubmit && (
                <button onClick={handleDelete} disabled={loading} className="p-2 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shrink-0">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {(!activeData || canResubmit) && (
          <motion.div key="upload" variants={viewVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-6 flex flex-col gap-5">
              <div>
                <h4 className="font-extrabold text-slate-800 mb-1">{activeData ? 'Resubmit Slides' : 'Submit Your Slides'}</h4>
                <p className="text-xs sm:text-sm text-slate-500">To present at the IRMS Conference, you must submit your presentation slides for committee review.</p>
              </div>

              {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium flex gap-2 items-center"><AlertCircle size={14}/>{error}</div>}

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setSlideFile(e.dataTransfer.files[0]); }}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center min-h-32 transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 bg-white hover:border-indigo-300'}`}
              >
                <input type="file" accept=".ppt,.pptx,.pdf" onChange={(e) => setSlideFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <Upload size={24} className={`mb-3 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`} />
                <h4 className="text-sm font-bold text-slate-800 mb-1 relative z-10 line-clamp-1 px-4">
                  {slideFile ? slideFile.name : 'Drag & drop or click to upload'}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium relative z-10">
                  {slideFile ? `${(slideFile.size / 1024 / 1024).toFixed(2)} MB` : 'Supported formats: PPT, PPTX, PDF'}
                </p>
              </div>

              {slideFile && (
                <div className="flex justify-end">
                  <button onClick={handleUpload} disabled={loading} className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : 'Submit Slides'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-6 pt-6 border-t border-slate-200"
      >
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Presentation Templates
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SLIDE_TEMPLATES.map((doc, idx) => (
            <a
              key={idx}
              href={doc.path}
              download={doc.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/30 transition-colors group"
            >
              <div className="bg-white p-2 border border-slate-200 rounded-lg text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500 transition-colors shrink-0">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 truncate">
                  {doc.name}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  {doc.type}
                </p>
              </div>
              <Download size={16} className="text-slate-300 group-hover:text-indigo-500 shrink-0" />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}