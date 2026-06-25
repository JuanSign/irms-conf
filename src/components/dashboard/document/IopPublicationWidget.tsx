'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, AlertCircle, Upload, ArrowRight, CreditCard, BookOpen, Loader2, Trash2, FileText, Download, FileUp } from "lucide-react";
import { createIopApplication, confirmIopPaymentProof, cancelIopApplication, submitIopFullPaper } from "@/app/(public)/dashboard/submission/[id]/actions";
import { getPaymentProofUploadUrl, getFullPaperUploadUrl } from "@/actions/files";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface IopPublication {
  abstractId: string;
  status: 'Pending Payment' | 'Verification Pending' | 'Verified' | 'Rejected';
  paymentProofUrl?: string | null;
  paperStatus: 'Pending Submission' | 'Waiting For Verification' | 'Verified' | 'Rejected';
  fullPaperUrl?: string | null;
}

interface IopPublicationWidgetProps {
  abstractId: string;
  iopData: IopPublication | null | undefined;
}

const IOP_FEE = 1200000;

const IOP_DOCUMENTS = [
  { name: "Guideline", file: "Guideline.pdf", path: "/doc/Guideline.pdf", type: "PDF Document" },
  { name: "Instruction", file: "Instruction.pdf", path: "/doc/Instruction.pdf", type: "PDF Document" },
  { name: "Template", file: "Template.doc", path: "/doc/Template.docx", type: "Word Document" }
];

const viewVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

export default function IopPublicationWidget({ abstractId, iopData }: IopPublicationWidgetProps) {
  const router = useRouter();
  const [activeData, setActiveData] = useState<IopPublication | null | undefined>(iopData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isPaymentDragging, setIsPaymentDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [isPaperDragging, setIsPaperDragging] = useState(false);

  useEffect(() => {
    setActiveData(iopData);
  }, [iopData]);

  useEffect(() => {
    if (!paymentFile) { setPreviewUrl(null); return; }
    if (paymentFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(paymentFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [paymentFile]);

  const handleApply = async () => {
    setLoading(true); setError('');
    const res = await createIopApplication(abstractId);
    if (res?.error) {
      setError(res.error);
    } else {
      setActiveData({ abstractId, status: 'Pending Payment', paperStatus: 'Pending Submission' } as IopPublication);
      router.refresh();
    }
    setLoading(false);
  };

  const handlePaymentUpload = async () => {
    if (!paymentFile) return setError("Please select a payment proof file.");
    setLoading(true); setError('');

    try {
      const { presignedUrl, fileUrl, error: urlError } = await getPaymentProofUploadUrl(paymentFile.type, paymentFile.name);
      if (urlError || !presignedUrl || !fileUrl) throw new Error(urlError || "Upload failed.");

      const uploadRes = await fetch(presignedUrl, { method: 'PUT', body: paymentFile, headers: { 'Content-Type': paymentFile.type } });
      if (!uploadRes.ok) throw new Error("Cloud upload failed.");

      const confirmRes = await confirmIopPaymentProof(abstractId, fileUrl);
      if (confirmRes?.error) throw new Error(confirmRes.error);

      setActiveData(prev => prev ? { ...prev, status: 'Verification Pending', paymentProofUrl: fileUrl } : null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true); setError('');
    const res = await cancelIopApplication(abstractId);
    if (res?.error) {
      setError(res.error);
    } else {
      setActiveData(null);
      setPaymentFile(null);
      router.refresh();
    }
    setLoading(false);
  };

  const handlePaperUpload = async () => {
    if (!paperFile) return setError("Please select a manuscript file.");
    setLoading(true); setError('');

    try {
      const { presignedUrl, fileUrl, error: urlError } = await getFullPaperUploadUrl(paperFile.type, paperFile.name);
      if (urlError || !presignedUrl || !fileUrl) throw new Error(urlError || "Upload failed.");

      const uploadRes = await fetch(presignedUrl, { method: 'PUT', body: paperFile, headers: { 'Content-Type': paperFile.type } });
      if (!uploadRes.ok) throw new Error("Cloud upload failed.");

      const confirmRes = await submitIopFullPaper(abstractId, fileUrl);
      if (confirmRes?.error) throw new Error(confirmRes.error);

      setActiveData(prev => prev ? { ...prev, paperStatus: 'Waiting For Verification', fullPaperUrl: fileUrl } : null);
      setPaperFile(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getPaperStatusConfig = (status: string) => {
    switch (status) {
      case 'Verified': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={16} /> };
      case 'Rejected': return { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: <AlertCircle size={16} /> };
      case 'Waiting For Verification': return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={16} /> };
      default: return { color: 'bg-slate-50 text-slate-700 border-slate-200', icon: <FileUp size={16} /> };
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-sm shadow-slate-200/50 p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-irms-blue/10 p-2.5 rounded-xl text-irms-blue"><BookOpen size={20} /></div>
        <h3 className="font-extrabold text-lg text-slate-800">IOP Publication</h3>
      </div>

      <AnimatePresence mode="wait">
        {!activeData && (
          <motion.div key="banner" variants={viewVariants} initial="hidden" animate="visible" exit="exit" className="relative overflow-hidden rounded-2xl bg-irms-dark p-6 sm:p-8 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,var(--color-slate-900)_0%,#002b5c_50%,var(--color-irms-blue)_100%)] opacity-90 pointer-events-none"></div>
            <div className="relative z-10">
              <h4 className="text-xl sm:text-2xl font-extrabold mb-2">Publish your Abstract</h4>
              <p className="text-blue-100/80 text-sm mb-6 max-w-md">Your abstract has been accepted! You are now eligible to propose this manuscript for publication in the IOP Conference Series.</p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <div>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Publication Fee</p>
                  <p className="text-xl font-extrabold text-white">Rp {IOP_FEE.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-emerald-300 font-bold mt-0.5">Refundable if not accepted by IOP</p>
                </div>
                <button onClick={handleApply} disabled={loading} className="w-full sm:w-auto bg-white text-irms-blue font-bold px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shrink-0">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Apply Now <ArrowRight size={16}/></>}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeData && activeData.status === 'Pending Payment' && (
          <motion.div key="payment" variants={viewVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-700"><CreditCard size={18} /></div>
                <div>
                  <p className="font-extrabold text-slate-800 text-sm">Payment Required</p>
                  <p className="text-[11px] text-slate-500 font-medium">Rp {IOP_FEE.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium flex gap-2 items-center"><AlertCircle size={14}/>{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white shadow-sm p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Transfer To</p>
                  <p className="text-slate-800 font-bold text-sm mt-0.5">Bank Negara Indonesia (BNI)</p>
                  <p className="text-slate-600 text-xs font-medium mb-3">Simon Heru Prassetyo</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account Number</p>
                  <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 w-fit mt-1">
                    <p className="text-base text-slate-800 font-mono tracking-wider font-extrabold">0623293023</p>
                  </div>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsPaymentDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsPaymentDragging(false); }}
                  onDrop={(e) => { e.preventDefault(); setIsPaymentDragging(false); if (e.dataTransfer.files[0]) setPaymentFile(e.dataTransfer.files[0]); }}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center min-h-30 transition-colors ${isPaymentDragging ? 'border-irms-blue bg-blue-50/50' : 'border-slate-300 bg-white'}`}
                >
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {previewUrl ? (
                    <div className="relative w-full max-w-25 h-16 rounded-lg overflow-hidden border border-slate-200"><Image src={previewUrl} alt="Preview" fill className="object-cover" /></div>
                  ) : (
                    <Upload size={20} className={`mb-2 ${isPaymentDragging ? 'text-irms-blue' : 'text-slate-400'}`} />
                  )}
                  <p className="text-xs font-bold text-slate-800 mt-2 line-clamp-1">{paymentFile ? paymentFile.name : 'Upload Proof'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button onClick={handleCancel} disabled={loading} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shrink-0">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
                <button onClick={handlePaymentUpload} disabled={loading || !paymentFile} className="flex-1 bg-irms-blue text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#002b5c] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Submit Proof'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeData && activeData.status === 'Verification Pending' && (
          <motion.div key="payment_status" variants={viewVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Payment Status</p>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-500" />
                <p className="font-extrabold text-slate-800">Verification Pending</p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-bold uppercase">Under Review</span>
          </motion.div>
        )}

        {activeData && activeData.status === 'Verified' && (
          <motion.div key="paper_submission" variants={viewVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-white border-b border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">Full Paper Manuscript</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1 max-w-sm">Submit your full paper. Document will be verified by the admin committee.</p>
              </div>
              <div className={`flex items-center w-fit gap-2 px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-xl border ${getPaperStatusConfig(activeData.paperStatus).color} shadow-sm shrink-0`}>
                {getPaperStatusConfig(activeData.paperStatus).icon} 
                <span className="uppercase tracking-wider">{activeData.paperStatus}</span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium flex gap-2 items-center"><AlertCircle size={14}/>{error}</div>}

              {activeData.fullPaperUrl && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-blue-50 p-2.5 rounded-lg text-irms-blue shrink-0"><FileText size={20} /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">Current Submission</p>
                      <a href={activeData.fullPaperUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-irms-blue hover:underline truncate block font-medium mt-0.5">
                        View uploaded document
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeData.paperStatus !== 'Verified' && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsPaperDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsPaperDragging(false); }}
                  onDrop={(e) => { e.preventDefault(); setIsPaperDragging(false); if (e.dataTransfer.files[0]) setPaperFile(e.dataTransfer.files[0]); }}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition-colors ${
                    isPaperDragging ? 'border-irms-blue bg-blue-50/50' : 
                    activeData.paperStatus === 'Rejected' ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <input type="file" accept=".doc,.docx,.pdf" onChange={(e) => setPaperFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  
                  <div className={`p-3 rounded-full mb-3 ${isPaperDragging ? 'bg-irms-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Upload size={24} />
                  </div>
                  
                  <h5 className="text-sm font-bold text-slate-800 mb-1">
                    {paperFile ? paperFile.name : (activeData.fullPaperUrl ? 'Upload Replacement File' : 'Upload Full Paper')}
                  </h5>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {paperFile ? `${(paperFile.size / 1024 / 1024).toFixed(2)} MB • Ready to submit` : 'Drag & drop or click to browse (.pdf, .doc, .docx)'}
                  </p>
                  
                  {activeData.paperStatus === 'Rejected' && !paperFile && (
                    <p className="text-[10px] text-rose-600 font-bold mt-3 bg-rose-100 px-3 py-1 rounded-md uppercase tracking-wider">
                      Please resubmit corrections
                    </p>
                  )}
                </div>
              )}

              {activeData.paperStatus !== 'Verified' && paperFile && (
                <div className="flex justify-end mt-2">
                  <button onClick={handlePaperUpload} disabled={loading} className="w-full sm:w-auto bg-irms-blue text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#002b5c] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : 'Submit Manuscript'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeData && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Required Documents & Templates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {IOP_DOCUMENTS.map((doc, idx) => (
              <a
                key={idx}
                href={doc.path}
                download={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-irms-blue hover:bg-blue-50/30 transition-colors group"
              >
                <div className="bg-white p-2 border border-slate-200 rounded-lg text-slate-400 group-hover:border-irms-blue/30 group-hover:text-irms-blue transition-colors shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-irms-blue truncate">{doc.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{doc.type}</p>
                </div>
                <Download size={16} className="text-slate-300 group-hover:text-irms-blue shrink-0" />
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}