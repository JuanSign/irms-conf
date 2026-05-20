'use client';

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle, Upload, ArrowRight, CreditCard, BookOpen, Loader2, Trash2 } from "lucide-react";
import { createIopApplication, confirmIopPaymentProof, cancelIopApplication } from "@/app/(public)/dashboard/submission/[id]/actions";
import { getPaymentProofUploadUrl } from "@/actions/files"; 
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { IopPublication } from "@/db/schema";

interface IopPublicationWidgetProps {
  abstractId: string;
  iopData: IopPublication | null | undefined;
}

const IOP_FEE = 1200000;

const viewVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

export default function IopPublicationWidget({ abstractId, iopData }: IopPublicationWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    if (res?.error) setError(res.error);
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
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true); setError('');
    const res = await cancelIopApplication(abstractId);
    if (res?.error) setError(res.error);
    setLoading(false);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-sm shadow-slate-200/50 p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-irms-blue/10 p-2.5 rounded-xl text-irms-blue"><BookOpen size={20} /></div>
        <h3 className="font-extrabold text-lg text-slate-800">IOP Publication</h3>
      </div>

      <AnimatePresence mode="wait">
        {!iopData && (
          <motion.div key="banner" variants={viewVariants} initial="hidden" animate="visible" exit="exit" className="relative overflow-hidden rounded-2xl bg-irms-dark p-6 sm:p-8 text-white">
            <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-[#002b5c]/80 to-irms-blue/40 pointer-events-none"></div>
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

        {iopData && iopData.status === 'Pending Payment' && (
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
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setPaymentFile(e.dataTransfer.files[0]); }}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center min-h-30 transition-colors ${isDragging ? 'border-irms-blue bg-blue-50/50' : 'border-slate-300 bg-white'}`}
                >
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {previewUrl ? (
                    <div className="relative w-full max-w-25 h-16 rounded-lg overflow-hidden border border-slate-200"><Image src={previewUrl} alt="Preview" fill className="object-cover" /></div>
                  ) : (
                    <Upload size={20} className={`mb-2 ${isDragging ? 'text-irms-blue' : 'text-slate-400'}`} />
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

        {iopData && iopData.status !== 'Pending Payment' && (
          <motion.div key="status" variants={viewVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">IOP Application Status</p>
              <div className="flex items-center gap-2">
                {iopData.status === 'Verified' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clock size={18} className="text-amber-500" />}
                <p className="font-extrabold text-slate-800">{iopData.status}</p>
              </div>
            </div>
            {iopData.status === 'Verification Pending' && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-bold uppercase">Under Review</span>}
            {iopData.status === 'Verified' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold uppercase">Approved</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}