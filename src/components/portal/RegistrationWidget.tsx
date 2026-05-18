'use client';

import { useState } from 'react';
import { Ticket, UploadCloud, CheckCircle2, Clock, AlertCircle, FileDown, Loader2, Building2, GraduationCap, UserSquare2, RefreshCcw, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { EventRegistration } from '@/types/registration';
import { createRegistration, uploadPaymentProof, cancelRegistration } from '@/actions/registration';
import { getPaymentProofUploadUrl } from '@/actions/files';

interface RegistrationWidgetProps {
  registration: EventRegistration | null;
  onRegistrationUpdated: () => void;
}

// Updated Categories to handle two-tier pricing
const CATEGORIES = [
  { id: 'Student', label: 'Student', memberPrice: 350000, nonMemberPrice: 500000, icon: GraduationCap },
  { id: 'Academic', label: 'Academic', memberPrice: 600000, nonMemberPrice: 800000, icon: Building2 },
  { id: 'Industry/Practitioner', label: 'Industry / Practitioner', memberPrice: 1100000, nonMemberPrice: 1500000, icon: UserSquare2 },
];

export default function RegistrationWidget({ registration, onRegistrationUpdated }: RegistrationWidgetProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isMember, setIsMember] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // STEP 1: Generate Invoice
  const handleCreateInvoice = async () => {
    if (!selectedCategory) return toast.error("Please select a category.");
    if (isMember && !memberId.trim()) return toast.error("Please enter your IRMS Member ID.");

    setIsSubmitting(true);
    try {
      const catData = CATEGORIES.find(c => c.id === selectedCategory);
      if (!catData) throw new Error("Invalid category");

      const finalPrice = isMember ? catData.memberPrice : catData.nonMemberPrice;

      const res = await createRegistration({
        category: selectedCategory,
        amount: finalPrice,
        isIrmsMember: isMember,
        irmsMemberId: isMember ? memberId.trim() : undefined
      });

      if (!res.success) throw new Error(res.error);

      toast.success("Invoice generated successfully!");
      onRegistrationUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // CANCEL INVOICE
  const handleCancelInvoice = async () => {
    if (!registration) return;
    setIsSubmitting(true);
    try {
      const res = await cancelRegistration(registration.id);
      if (!res.success) throw new Error(res.error);

      toast.success("Invoice cancelled. Please select a new category.");
      setSelectedCategory('');
      setFile(null);
      setIsMember(false);
      setMemberId('');
      onRegistrationUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: Upload Proof
  const handleUploadProof = async () => {
    if (!file || !registration) return toast.error("Please select a file.");
    setIsSubmitting(true);
    try {
      const { presignedUrl, fileUrl, error } = await getPaymentProofUploadUrl(file.type, file.name);
      if (error || !presignedUrl || !fileUrl) throw new Error(error || "Upload initialization failed.");

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Failed to upload file to storage.");

      const res = await uploadPaymentProof(registration.id, fileUrl);
      if (!res.success) throw new Error(res.error);

      toast.success("Payment proof submitted! Pending verification.");
      setFile(null);
      onRegistrationUpdated();
    } catch (error: any) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // STATE 0: NOT REGISTERED (Select Category)
  // ==========================================
  if (!registration) {
    return (
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Ticket className="text-irms-blue" /> Choose Registration Category
          </h3>

          {/* Membership Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto shrink-0 border border-slate-200">
            <button
              onClick={() => setIsMember(false)}
              className={`flex-1 md:w-40 py-2 text-sm font-bold rounded-lg transition-all ${!isMember ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Non-Member
            </button>
            <button
              onClick={() => setIsMember(true)}
              className={`flex-1 md:w-40 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${isMember ? 'bg-irms-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ShieldCheck size={16} /> IRMS Member
            </button>
          </div>
        </div>

        {/* Member ID Input (Conditionally Rendered) */}
        {isMember && (
          <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-xl animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-bold text-slate-900 mb-2">
              IRMS Member ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-irms-blue focus:border-irms-blue outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">Required to validate discounted member pricing.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            // Dynamic pricing based on toggle
            const currentPrice = isMember ? cat.memberPrice : cat.nonMemberPrice;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? 'border-irms-blue bg-blue-50/50 shadow-md'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <Icon size={28} className={`mb-4 transition-colors ${isSelected ? 'text-irms-blue' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-irms-blue' : 'text-slate-900'}`}>{cat.label}</div>

                {/* Price Display */}
                <div className={`font-extrabold text-2xl ${isSelected ? 'text-irms-blue' : 'text-slate-600'}`}>
                  Rp {currentPrice.toLocaleString('id-ID')}
                </div>

                {isSelected && (
                  <div className="absolute top-4 right-4 text-irms-blue">
                    <CheckCircle2 size={24} className="animate-in zoom-in" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={handleCreateInvoice}
            disabled={!selectedCategory || isSubmitting || (isMember && !memberId.trim())}
            className="px-8 py-3.5 bg-irms-blue text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
            Generate Invoice
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // STATE 1 & 4: PENDING PAYMENT / REJECTED
  // ==========================================
  if (registration.status === 'Pending Payment' || registration.status === 'Rejected') {
    const isRejected = registration.status === 'Rejected';

    return (
      <div className="w-full">
        {isRejected && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-start gap-3 mb-6">
            <AlertCircle className="text-irms-red shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-red-900">Payment Verification Failed</h4>
              <p className="text-sm text-red-700 mt-1">{registration.rejectionReason || "Your document could not be verified. Please re-upload a clear proof of payment."}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="text-irms-blue" /> Payment Invoice
            </h3>
            <p className="text-sm text-slate-500 mt-1">Please transfer the exact amount below.</p>
          </div>

          <button
            onClick={handleCancelInvoice}
            disabled={isSubmitting}
            className="text-sm font-semibold text-slate-500 hover:text-irms-red transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"
            title="Cancel invoice and choose a different category"
          >
            <RefreshCcw size={14} /> Change Category
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Category</span>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{registration.category}</div>
                  {/* Show if they claimed member pricing */}
                  {(registration as any).isIrmsMember && (
                    <div className="text-xs text-irms-blue font-bold flex items-center justify-end gap-1 mt-0.5">
                      <ShieldCheck size={12} /> Member Pricing
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Due</span>
                <span className="text-2xl font-extrabold text-irms-blue">
                  Rp {registration.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <p className="text-xs font-bold text-irms-blue uppercase tracking-wider mb-3">Bank Transfer Destination</p>
              <div className="font-bold text-slate-900 text-lg mb-1">Bank Mandiri</div>
              <p className="text-slate-800 font-mono text-xl tracking-wider font-semibold mb-1">123-456-789-0000</p>
              <p className="text-sm text-slate-600 font-medium">a.n. IRMS 2026 Committee</p>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Upload Transfer Proof</h3>

            {!file ? (
              <label className="flex flex-col items-center justify-center w-full flex-1 min-h-[250px] border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-irms-blue" />
                </div>
                <p className="mb-1 text-sm text-slate-600"><span className="font-bold text-irms-blue">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-400">PDF, JPG, or PNG (Max 5MB)</p>
                <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
            ) : (
              <div className="flex flex-col justify-between flex-1 min-h-[250px] bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileDown className="text-irms-blue shrink-0" />
                    <span className="text-sm font-bold text-slate-900 truncate">{file.name}</span>
                  </div>
                  <button onClick={() => setFile(null)} className="text-sm font-bold text-slate-400 hover:text-irms-red transition-colors ml-4 shrink-0">Remove</button>
                </div>

                <button
                  onClick={handleUploadProof}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-irms-blue text-white font-bold rounded-xl hover:opacity-90 transition-all flex justify-center items-center gap-2 mt-auto shadow-sm"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                  Submit Payment Proof
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STATE 2 & 3: Waiting / Accepted
  // ==========================================
  if (registration.status === 'Verification Pending') {
    return (
      <div className="w-full bg-blue-50/40 border border-blue-100 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-14 h-14 bg-white text-irms-blue rounded-full flex items-center justify-center shrink-0 border border-blue-100 shadow-sm relative">
          <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-ping opacity-30"></div>
          <Clock size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Payment Under Verification</h3>
          <p className="text-slate-600 text-sm mt-0.5">We are reviewing your payment proof. This typically takes 1-2 business days.</p>
        </div>
      </div>
    );
  }

  if (registration.status === 'Verified') {
    return (
      <div className="w-full bg-linear-to-r from-emerald-50 to-white border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Registration Confirmed</h3>
            <p className="text-slate-600 text-sm flex items-center gap-1.5">
              Registered as <strong className="text-slate-900">{registration.category}</strong>
              {(registration as any).isIrmsMember && <span className="text-emerald-600 font-bold text-xs bg-emerald-100 px-1.5 py-0.5 rounded ml-1">Member</span>}
            </p>
          </div>
        </div>

        <div className="relative z-10 w-full sm:w-auto shrink-0">
          {registration.invitationUrl ? (
            <a
              href={registration.invitationUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-white text-emerald-700 font-bold border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm flex justify-center items-center gap-2"
            >
              <FileDown size={18} />
              Download Invitation
            </a>
          ) : (
            <div className="px-5 py-2.5 bg-white text-emerald-700 font-semibold border border-emerald-200 rounded-lg flex items-center justify-center gap-2 text-sm w-full sm:w-auto">
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}