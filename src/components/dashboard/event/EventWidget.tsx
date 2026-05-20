'use client';

import { useState, useCallback, useEffect } from "react";
import {
  Ticket, Calendar, CheckCircle2, Clock, AlertCircle,
  Upload, ArrowRight, MapPin, ArrowLeft, CreditCard,
  User, Building, GraduationCap, Loader2, QrCode, Trash2
} from "lucide-react";
import { EventRegistration, RegistrationCategory } from "@/types/event";
import { createEventRegistration, confirmPaymentProof, cancelEventRegistration } from "./actions";
import { getPaymentProofUploadUrl } from "@/actions/files";
import Image from "next/image";

const PRICING = {
  'Industry/Practitioner': { member: 1100000, nonMember: 1500000, icon: <Building size={24}/> },
  'Academic': { member: 600000, nonMember: 800000, icon: <User size={24}/> },
  'Student': { member: 500000, nonMember: 500000, icon: <GraduationCap size={24}/> },
};

// ==========================================
// 1. MAIN CONTAINER
// ==========================================
export default function EventWidget({ registration }: { registration: EventRegistration | null | undefined }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState('');

  const [category, setCategory] = useState<RegistrationCategory>('Industry/Practitioner');
  const [isMember, setIsMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [attendingWorkshop, setAttendingWorkshop] = useState(false);
  const [attendingRockersNight, setAttendingRockersNight] = useState(false);

  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentFee = PRICING[category][isMember ? 'member' : 'nonMember'];

  const handleRegister = async () => {
    setLoading(true); setError('');
    const res = await createEventRegistration({ category, isMember, memberEmail, amount: currentFee, attendingWorkshop, attendingRockersNight });
    if (res?.error) setError(res.error);
    setLoading(false);
  };

  const handlePaymentUpload = async () => {
    if (!paymentFile) return setError("Please select a payment proof file.");
    setLoading(true); setError('');

    try {
      const { presignedUrl, fileUrl, error: urlError } = await getPaymentProofUploadUrl(paymentFile.type, paymentFile.name);
      if (urlError || !presignedUrl || !fileUrl) throw new Error(urlError || "Failed to initialize secure upload.");

      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT', body: paymentFile, headers: { 'Content-Type': paymentFile.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file to cloud storage.");

      const confirmRes = await confirmPaymentProof(fileUrl);
      if (confirmRes?.error) throw new Error(confirmRes.error);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    setIsCancelling(true); setError('');
    const res = await cancelEventRegistration();
    if (res?.error) setError(res.error);
    setIsCancelling(false);
  };

  const handleNextStep = () => {
    if (step === 2 && isMember && !memberEmail) return setError("EMAIL_ERROR");
    setError(''); setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError('');
    if (step === 1) setIsRegistering(false);
    else setStep(step - 1);
  };

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setPaymentFile(e.dataTransfer.files[0]);
  }, []);

  if (!registration && !isRegistering) {
    return <UnregisteredBanner onRegister={() => setIsRegistering(true)} />;
  }

  if (!registration && isRegistering) {
    return (
      <RegistrationForm
        step={step} handleNext={handleNextStep} handleBack={handlePrevStep} handleRegister={handleRegister}
        error={error} clearError={() => setError('')} loading={loading} currentFee={currentFee}
        form={{ category, setCategory, isMember, setIsMember, memberEmail, setMemberEmail, attendingWorkshop, setAttendingWorkshop, attendingRockersNight, setAttendingRockersNight }}
      />
    );
  }

  if (registration && registration.status === 'Pending Payment') {
    return (
      <PaymentPending
        registration={registration} error={error} loading={loading} isCancelling={isCancelling}
        paymentFile={paymentFile} setPaymentFile={setPaymentFile} isDragging={isDragging}
        handlePaymentUpload={handlePaymentUpload} handleCancelRegistration={handleCancelRegistration}
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      />
    );
  }

  if (registration) {
    return <EventTicket registration={registration} />;
  }

  return null;
}

// ==========================================
// 2. PRESENTATIONAL UI COMPONENTS
// ==========================================

function UnregisteredBanner({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="h-fit self-start group relative overflow-hidden rounded-3xl shadow-xl bg-irms-dark animate-in fade-in zoom-in-95 duration-500">
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-irms-blue/80 to-irms-blue/40 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

      <div className="hidden sm:block absolute -top-32 -right-32 w-120 h-120 bg-blue-400 opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none"></div>

      <div className="relative p-6 sm:p-10 flex flex-col text-white w-full z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight leading-tight w-full drop-shadow-sm">
          Secure Your Spot at<br className="hidden sm:block" /> IRMS 2026
        </h2>
        <p className="text-blue-100/80 mb-6 sm:mb-8 w-full text-sm sm:text-lg leading-relaxed max-w-lg">
          Join the premier gathering of rock mechanics professionals. Experience two days of groundbreaking keynotes, technical sessions, and exclusive networking.
        </p>

        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 bg-black/30 rounded-2xl p-3 sm:p-4 border border-white/10 backdrop-blur-sm shadow-inner">
            <div className="bg-white/10 text-white p-1.5 sm:p-2 rounded-xl"><Calendar size={18} /></div>
            <div><p className="font-bold text-xs sm:text-sm text-white/90">14-16 Jul 2026</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-black/30 rounded-2xl p-3 sm:p-4 border border-white/10 backdrop-blur-sm shadow-inner">
            <div className="bg-white/10 text-white p-1.5 sm:p-2 rounded-xl"><MapPin size={18} /></div>
            <div><p className="font-bold text-xs sm:text-sm text-white/90">Bandung, Indonesia</p></div>
          </div>
        </div>

        <button onClick={onRegister} className="relative overflow-hidden w-full sm:w-max bg-white text-irms-blue font-bold px-8 py-3.5 sm:py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 group/btn">
          <span className="relative z-10">Register Now</span>
          <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function RegistrationForm({ step, handleNext, handleBack, handleRegister, error, clearError, loading, currentFee, form }: any) {
  return (
    <div className="h-fit self-start bg-slate-100 border border-slate-300 rounded-3xl shadow-xl animate-in slide-in-from-right-8 fade-in duration-300 flex flex-col overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={handleBack} className="p-2 sm:p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-irms-dark hover:shadow-sm transition-all">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-800 leading-tight mb-1">Registration</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Step {step} of 3</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full bg-irms-blue transition-all duration-500 ease-out ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
        {error && error !== 'EMAIL_ERROR' && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <p className="font-medium text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 fade-in">
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-3">Select Your Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(PRICING) as RegistrationCategory[]).map((cat) => (
                <button
                  key={cat} onClick={() => form.setCategory(cat)}
                  className={`relative flex flex-row sm:flex-col items-center sm:justify-center justify-start gap-3 sm:gap-4 p-3.5 sm:p-5 border-2 rounded-2xl transition-all shadow-sm ${
                    form.category === cat ? 'border-irms-blue bg-blue-50/80 ring-2 sm:ring-4 ring-irms-blue/10 scale-[1.01] sm:scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {form.category === cat && <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:top-3 sm:translate-y-0 sm:right-3 text-irms-blue"><CheckCircle2 size={18}/></div>}
                  <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0 ${form.category === cat ? 'bg-irms-blue text-white shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
                    {PRICING[cat].icon}
                  </div>
                  <span className={`font-bold text-sm text-left sm:text-center pr-6 sm:pr-0 leading-tight ${form.category === cat ? 'text-irms-blue' : 'text-slate-700'}`}>{cat === 'Industry/Practitioner' ? 'Practitioner' : cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 fade-in">
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-3">Are you an IRMS Member?</label>
            <div className="flex flex-col gap-4 sm:gap-5 bg-white p-4 sm:p-5 rounded-2xl border shadow-sm border-slate-200">
              <div className="flex p-1.5 bg-slate-100 rounded-xl w-full sm:w-fit">
                <button
                  onClick={() => form.setIsMember(true)}
                  className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${form.isMember ? 'bg-irms-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  Yes, Member
                </button>
                <button
                  onClick={() => { form.setIsMember(false); clearError(); }}
                  className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${!form.isMember ? 'bg-irms-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  No, Non-Member
                </button>
              </div>

              {form.isMember && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Verification Email</label>
                  <input
                    type="email"
                    placeholder="Enter registered IRMS Email"
                    value={form.memberEmail}
                    onChange={(e) => { form.setMemberEmail(e.target.value); if(error === 'EMAIL_ERROR') clearError(); }}
                    className={`w-full h-11 px-4 border-2 rounded-xl outline-none transition-all placeholder:text-slate-400 text-base font-medium bg-slate-50 ${error === 'EMAIL_ERROR' ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-4 focus:ring-irms-blue/10 focus:border-irms-blue'}`}
                  />
                  {error === 'EMAIL_ERROR' ? (
                    <p className="text-[11px] sm:text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12}/> Please enter your registered email.</p>
                  ) : (
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1.5"><Clock size={12}/> Will be verified against our database.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right-4 fade-in">
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-3">Event RSVP</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { state: form.attendingWorkshop, setter: form.setAttendingWorkshop, title: "Pre-Conference Workshops", desc: "14 July 2026. Specialized sessions." },
                { state: form.attendingRockersNight, setter: form.setAttendingRockersNight, title: "Rockers Night", desc: "15 July 2026. Gala dinner." }
              ].map((item, idx) => (
                <div key={idx} onClick={() => item.setter(!item.state)} className={`group flex items-start gap-3 p-3 sm:p-4 border-2 rounded-2xl cursor-pointer transition-all select-none shadow-sm ${item.state ? 'border-irms-blue bg-blue-50/80' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className={`mt-0.5 flex shrink-0 items-center justify-center w-5 h-5 rounded-md border-2 transition-colors ${item.state ? 'bg-irms-blue border-irms-blue text-white' : 'border-slate-300 bg-slate-50 group-hover:border-irms-blue/50'}`}>
                    {item.state && <CheckCircle2 size={14} strokeWidth={3} />}
                  </div>
                  <div>
                    <span className={`block font-bold text-sm mb-0.5 ${item.state ? 'text-irms-blue' : 'text-slate-800'}`}>{item.title}</span>
                    <span className="block text-xs text-slate-500 font-medium">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white shadow-sm p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center justify-between mt-4">
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold mb-0.5 uppercase tracking-wide">Total Fee Due</p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-baseline gap-1">
                  <span className="text-sm sm:text-base text-slate-400 font-medium">Rp</span>
                  {currentFee.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200">
          <div className="flex justify-end gap-3 w-full">
            {step < 3 ? (
              <button onClick={handleNext} className="w-full sm:w-auto bg-irms-blue text-white px-8 py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-[#002b5c] transition-all flex justify-center items-center gap-2 shadow-md">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button onClick={handleRegister} disabled={loading} className="w-full sm:w-auto bg-irms-blue text-white px-8 py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-[#002b5c] hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-md">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : 'Confirm & Proceed'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentPending({ registration, error, loading, isCancelling, paymentFile, setPaymentFile, isDragging, handlePaymentUpload, handleCancelRegistration, onDragOver, onDragLeave, onDrop }: any) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentFile) { setPreviewUrl(null); return; }
    if (paymentFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(paymentFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [paymentFile]);

  return (
    <div className="h-fit self-start bg-slate-100 border border-slate-300 rounded-3xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="bg-linear-to-r from-amber-50 to-white border-b border-amber-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 z-10">
          <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700 shadow-sm"><CreditCard size={20} /></div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Payment Required</h3>
            <p className="text-slate-500 font-medium text-xs mt-0.5">Awaiting transfer completion.</p>
          </div>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-200 text-center sm:text-right">
          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Amount Due</span>
          <span className="block font-extrabold text-irms-blue text-lg">Rp {registration.amount.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl font-medium flex gap-2 items-center"><AlertCircle size={16}/>{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white shadow-sm p-4 rounded-2xl border border-slate-200 flex flex-col justify-center h-full">
            <div className="mb-3">
              <p className="text-[10px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">Transfer To</p>
              <p className="text-slate-800 font-bold text-sm">Bank Negara Indonesia (BNI)</p>
              <p className="text-slate-600 text-xs font-medium">Simon Heru Prassetyo</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Account Number</p>
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
                <p className="text-base sm:text-lg text-slate-800 font-mono tracking-wider font-extrabold">0623293023</p>
              </div>
            </div>
          </div>

          <div
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-2xl p-4 text-center flex flex-col items-center justify-center min-h-30 h-full transition-all duration-200 overflow-hidden shadow-sm ${
              isDragging ? 'border-irms-blue bg-blue-50/50 scale-[1.01]' : 'border-slate-300 hover:border-slate-400 bg-white'
            }`}
          >
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />

            {previewUrl ? (
              <div className="relative w-full max-w-30 h-20 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm z-10 group">
                <Image src={previewUrl} alt="Preview" fill className="object-cover group-hover:opacity-50 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5"><Upload size={12}/> Replace</span>
                </div>
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors z-10 relative border border-slate-100 ${isDragging ? 'bg-irms-blue text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                <Upload size={16} className={`${isDragging ? 'animate-bounce' : ''}`} />
              </div>
            )}

            <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-0.5 mt-2 relative z-10 line-clamp-1 px-2">
              {paymentFile ? paymentFile.name : 'Upload Payment Proof'}
            </h4>
            <p className="text-[10px] text-slate-500 font-medium relative z-10">
              {paymentFile ? `${(paymentFile.size / 1024 / 1024).toFixed(2)} MB • Click to change` : 'Drag & drop or click'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button onClick={handleCancelRegistration} disabled={isCancelling || loading} className="sm:col-span-1 w-full px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm border-2 border-slate-300 text-slate-600 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-sm">
            {isCancelling ? <Loader2 className="animate-spin" size={16}/> : <><Trash2 size={16}/> Cancel</>}
          </button>
          <button onClick={handlePaymentUpload} disabled={loading || !paymentFile} className="sm:col-span-2 w-full bg-irms-blue text-white font-bold px-4 py-2.5 sm:py-3 rounded-xl text-sm hover:bg-[#002b5c] hover:shadow-xl hover:shadow-irms-blue/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-md">
            {loading ? <><Loader2 className="animate-spin" size={16}/> Verifying...</> : 'Submit Proof'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventTicket({ registration }: any) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Verified': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={16} /> };
      case 'Rejected': return { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: <AlertCircle size={16} /> };
      default: return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={16} /> };
    }
  };
  const statusConfig = getStatusConfig(registration.status);

  return (
    <div className="h-fit self-start bg-slate-100 border border-slate-300 rounded-4xl shadow-xl animate-in zoom-in-95 fade-in duration-500 relative overflow-hidden flex flex-col group">
      <div className="absolute -left-4 top-19 sm:top-21 w-8 h-8 bg-irms-light rounded-full border border-slate-300 z-10 shadow-inner hidden sm:block"></div>
      <div className="absolute -right-4 top-19 sm:top-21 w-8 h-8 bg-irms-light rounded-full border border-slate-300 z-10 shadow-inner hidden sm:block"></div>

      <div className="bg-linear-to-r from-slate-50 to-white p-5 sm:p-6 pb-6 sm:pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-dashed border-slate-300 relative">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-irms-blue text-white p-3 sm:p-3.5 rounded-2xl shadow-lg shadow-irms-blue/20"><Ticket size={20} className="sm:w-6 sm:h-6" /></div>
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">IRMS 2026 Pass</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 font-bold font-mono tracking-widest mt-0.5 sm:mt-1">ID: {registration.id.split('-')[0].toUpperCase()}</p>
          </div>
        </div>
        <div className={`flex items-center w-fit gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold rounded-xl border ${statusConfig.color} shadow-sm`}>
          {statusConfig.icon} <span className="uppercase tracking-wider">{registration.status}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 pt-6 sm:pt-8 flex-1 flex flex-col sm:flex-row gap-5 sm:gap-6 bg-slate-100">
        <div className="flex-1 space-y-5 sm:space-y-6">
          <div className="grid grid-cols-2 gap-y-5 sm:gap-y-6 gap-x-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 sm:mb-1.5">Category</p>
              <p className="font-extrabold text-sm sm:text-base text-slate-800">{registration.category === 'Industry/Practitioner' ? 'Practitioner' : registration.category}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 sm:mb-1.5">Member Status</p>
              <p className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-1.5">
                {registration.isIrmsMember ? <><CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-irms-blue"/> Verified</> : 'Non-Member'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2 sm:mb-2.5">Granted Access</p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                <span className="bg-slate-800 text-white border border-slate-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wide shadow-sm">Main Conference (16 Jul)</span>
                {registration.attendingWorkshop && <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wide">Workshops (14 Jul)</span>}
                {registration.attendingRockersNight && <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wide">Rockers Night (15 Jul)</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}