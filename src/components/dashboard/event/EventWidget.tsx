// components/dashboard/EventWidget.tsx
'use client';

import { useState, useCallback } from "react";
import { 
  Ticket, Calendar, CheckCircle2, Clock, AlertCircle, 
  Upload, ArrowRight, MapPin, ArrowLeft, CreditCard, 
  User, Building, GraduationCap, Loader2, FileText, QrCode, Trash2
} from "lucide-react";
import { EventRegistration, RegistrationCategory } from "@/types/event";
import { createEventRegistration, confirmPaymentProof, cancelEventRegistration } from "./actions";
import { getPaymentProofUploadUrl } from "@/actions/files";

const PRICING = {
  'Industry/Practitioner': { member: 1100000, nonMember: 1500000, icon: <Building size={24}/> },
  'Academic': { member: 600000, nonMember: 800000, icon: <User size={24}/> },
  'Student': { member: 500000, nonMember: 500000, icon: <GraduationCap size={24}/> },
};

export default function EventWidget({ registration }: { registration: EventRegistration | null | undefined }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1); // Added for multi-step flow
  const [loading, setLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [category, setCategory] = useState<RegistrationCategory>('Industry/Practitioner');
  const [isMember, setIsMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [attendingWorkshop, setAttendingWorkshop] = useState(false);
  const [attendingRockersNight, setAttendingRockersNight] = useState(false);
  
  // File Upload State
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentFee = PRICING[category][isMember ? 'member' : 'nonMember'];

  // --- Handlers ---
  const handleRegister = async () => {
    setLoading(true); setError('');
    
    const res = await createEventRegistration({
      category, isMember, memberEmail, amount: currentFee, attendingWorkshop, attendingRockersNight
    });
    
    if (res?.error) setError(res.error);
    setLoading(false);
  };

  const handlePaymentUpload = async () => {
    if (!paymentFile) return setError("Please select a payment proof file.");
    setLoading(true); setError('');

    try {
      const { presignedUrl, fileUrl, error: urlError } = await getPaymentProofUploadUrl(
        paymentFile.type, paymentFile.name
      );

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

  // Drag and Drop Handlers
  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setPaymentFile(e.dataTransfer.files[0]);
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Verified': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={16} /> };
      case 'Rejected': return { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: <AlertCircle size={16} /> };
      default: return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={16} /> };
    }
  };

  // ---------------------------------------------------------
  // STATE 1: UNREGISTERED (Premium Banner)
  // ---------------------------------------------------------
  if (!registration && !isRegistering) {
    return (
      <div className="group relative overflow-hidden rounded-3xl shadow-xl border border-transparent bg-gradient-to-br from-[#003366] via-irms-blue to-[#001f3f] animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="relative p-8 sm:p-10 flex flex-col text-white w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 w-fit mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-irms-red opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-irms-red"></span></span>
            <span className="text-xs font-bold tracking-wider uppercase text-white/90">Registration Open</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight leading-tight w-full">
            Secure Your Spot at<br className="hidden sm:block" /> IRMS 2026
          </h2>
          <p className="text-blue-100 mb-8 w-full text-base sm:text-lg leading-relaxed">
            Join the premier gathering of rock mechanics professionals. Two days of groundbreaking keynotes, technical sessions, and exclusive networking.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <div className="flex items-center gap-3 bg-black/20 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="bg-irms-red/20 text-irms-red p-2 rounded-xl"><Calendar size={20} /></div>
              <div><p className="font-bold text-sm">14-16 Jul 2026</p></div>
            </div>
            <div className="flex items-center gap-3 bg-black/20 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="bg-irms-red/20 text-irms-red p-2 rounded-xl"><MapPin size={20} /></div>
              <div><p className="font-bold text-sm">Bandung, ID</p></div>
            </div>
          </div>

          <button onClick={() => setIsRegistering(true)} className="relative overflow-hidden w-full sm:w-max bg-white text-irms-blue font-bold px-8 py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 group/btn">
            <span className="relative z-10">Register</span>
            <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // STATE 2: REGISTRATION FORM (Multi-step)
  // ---------------------------------------------------------
  if (!registration && isRegistering) {
    const handleNext = () => {
      if (step === 2 && isMember && !memberEmail) {
        setError("Please enter your registered IRMS Email");
        return;
      }
      setError('');
      setStep(step + 1);
    };

    const handleBack = () => {
      setError('');
      if (step === 1) setIsRegistering(false);
      else setStep(step - 1);
    };

    return (
      <div className="bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/40 animate-in slide-in-from-right-8 fade-in duration-300 overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-irms-dark hover:shadow-sm transition-all">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">Registration</h3>
              <p className="text-xs text-slate-500 font-medium">Step {step} of 3</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex-1 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-3 animate-in fade-in">
              <AlertCircle size={20} className="shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* STEP 1: Category */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wide">1. Attendee Category</label>
              <div className="grid sm:grid-cols-3 gap-4">
                {(Object.keys(PRICING) as RegistrationCategory[]).map((cat) => (
                  <button
                    key={cat} onClick={() => setCategory(cat)}
                    className={`relative flex flex-col items-center gap-4 p-6 border-2 rounded-2xl transition-all ${
                      category === cat ? 'border-irms-blue bg-blue-50/50 shadow-md ring-4 ring-irms-blue/10 scale-[1.02]' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {category === cat && <div className="absolute top-3 right-3 text-irms-blue"><CheckCircle2 size={18}/></div>}
                    <div className={`p-3 rounded-2xl ${category === cat ? 'bg-irms-blue text-white shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
                      {PRICING[cat].icon}
                    </div>
                    <span className={`font-bold text-sm ${category === cat ? 'text-irms-blue' : 'text-slate-600'}`}>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Membership */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wide">2. IRMS Membership Status</label>
              <div className="flex flex-col gap-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex p-1 bg-slate-200/60 rounded-xl w-full sm:w-fit">
                  <button onClick={() => setIsMember(true)} className={`flex-1 sm:flex-none px-8 py-3 text-sm font-bold rounded-lg transition-all ${isMember ? 'bg-white text-irms-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Yes, Member</button>
                  <button onClick={() => setIsMember(false)} className={`flex-1 sm:flex-none px-8 py-3 text-sm font-bold rounded-lg transition-all ${!isMember ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>No, Non-Member</button>
                </div>
                
                {isMember && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Verification Email</label>
                    <input type="email" placeholder="Enter registered IRMS Email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} className="w-full h-12 px-5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-irms-blue/10 focus:border-irms-blue outline-none transition-all placeholder:text-slate-400 font-medium" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Add-ons & Total */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-800 uppercase tracking-wide">3. Event Add-ons</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { state: attendingWorkshop, setter: setAttendingWorkshop, title: "Pre-Conference Workshops", desc: "14 July 2026. Specialized sessions." },
                    { state: attendingRockersNight, setter: setAttendingRockersNight, title: "Rockers Night", desc: "15 July 2026. Gala dinner." }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => item.setter(!item.state)}
                      className={`group flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all select-none ${item.state ? 'border-irms-blue bg-blue-50/30' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <div className={`mt-0.5 flex shrink-0 items-center justify-center w-6 h-6 rounded-md border-2 transition-colors ${item.state ? 'bg-irms-blue border-irms-blue text-white' : 'border-slate-300 bg-white group-hover:border-irms-blue/50'}`}>
                        {item.state && <CheckCircle2 size={16} strokeWidth={3} />}
                      </div>
                      <div>
                        <span className={`block font-bold mb-1 ${item.state ? 'text-irms-blue' : 'text-slate-800'}`}>{item.title}</span>
                        <span className="block text-sm text-slate-500 font-medium">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">Total Fee Due</p>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-baseline gap-1">
                    <span className="text-lg text-slate-400 font-medium">Rp</span>
                    {currentFee.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-6 mt-auto border-t border-slate-100 flex justify-end gap-4">
            {step < 3 ? (
              <button onClick={handleNext} className="w-full sm:w-auto bg-irms-blue text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#002b5c] transition-all flex justify-center items-center gap-2">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button onClick={handleRegister} disabled={loading} className="w-full sm:w-auto bg-irms-blue text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#002b5c] hover:shadow-lg hover:shadow-irms-blue/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : 'Confirm & Proceed to Payment'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!registration) return null;
  // ---------------------------------------------------------
  // STATE 3: PENDING PAYMENT (The Uploader - Compact)
  // ---------------------------------------------------------
  if (registration.status === 'Pending Payment') {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/40 animate-in slide-in-from-bottom-8 fade-in duration-500">
        
        {/* Compact Header */}
        <div className="bg-amber-400 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-amber-300 rounded-full opacity-50 blur-2xl"></div>
          <div className="relative flex items-center gap-4 z-10">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm text-amber-900"><CreditCard size={24} /></div>
            <div>
              <h3 className="font-extrabold text-amber-950 text-xl tracking-tight">Payment Required</h3>
              <p className="text-amber-900 font-medium text-sm mt-0.5">Please complete your transfer.</p>
            </div>
          </div>
          <div className="relative z-10 bg-white px-5 py-3 rounded-xl shadow-sm text-center sm:text-right">
            <span className="block text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Amount Due</span>
            <span className="block font-extrabold text-slate-800 text-xl">Rp {registration.amount.toLocaleString('id-ID')}</span>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-medium flex gap-2 items-center"><AlertCircle size={18}/>{error}</div>}
          
          {/* Bank Details */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Transfer To</p>
              <p className="text-slate-800 font-bold text-base">Bank Negara Indonesia (BNI)</p>
              <p className="text-slate-600 text-sm font-medium">Simon Heru Prassetyo</p>
            </div>
            <div className="sm:text-right w-full sm:w-auto">
              <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider hidden sm:block">Account Number</p>
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-center sm:text-right">
                <p className="text-xl text-slate-800 font-mono tracking-wider font-extrabold">0623293023</p>
              </div>
            </div>
          </div>
          
          {/* Compact Upload Zone */}
          <div 
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-200 ${
              isDragging ? 'border-irms-blue bg-blue-50/50 scale-[1.01]' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50 bg-white'
            }`}
          >
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${paymentFile ? 'bg-emerald-100 text-emerald-600' : isDragging ? 'bg-irms-blue text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
              {paymentFile ? <FileText size={24} /> : <Upload size={24} className={isDragging ? 'animate-bounce' : ''} />}
            </div>
            
            <h4 className="text-lg font-bold text-slate-800 mb-1">
              {paymentFile ? paymentFile.name : 'Upload Payment Proof'}
            </h4>
            <p className="text-sm text-slate-500 font-medium">
              {paymentFile ? `${(paymentFile.size / 1024 / 1024).toFixed(2)} MB • Click to change` : 'Drag & drop or click to browse'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={handleCancelRegistration} disabled={isCancelling || loading} className="w-full sm:w-1/3 px-6 py-4 rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
              {isCancelling ? <Loader2 className="animate-spin" size={20}/> : <><Trash2 size={20}/> Cancel</>}
            </button>
            <button onClick={handlePaymentUpload} disabled={loading || !paymentFile} className="w-full sm:w-2/3 bg-irms-blue text-white font-bold px-6 py-4 rounded-xl hover:bg-[#002b5c] hover:shadow-xl hover:shadow-irms-blue/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2">
              {loading ? <><Loader2 className="animate-spin" size={20}/> Verifying...</> : 'Submit Proof'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // STATE 4: VERIFIED / REJECTED / VERIFICATION PENDING
  // ---------------------------------------------------------
  const statusConfig = getStatusConfig(registration.status);
  
  return (
    <div className="bg-white border-2 border-slate-200 rounded-[2rem] shadow-sm animate-in zoom-in-95 fade-in duration-500 relative overflow-hidden flex flex-col h-full">
      
      {/* Visual Ticket Notches */}
      <div className="absolute left-[-16px] top-[90px] w-8 h-8 bg-irms-light rounded-full border-r-2 border-slate-200 z-10 hidden sm:block"></div>
      <div className="absolute right-[-16px] top-[90px] w-8 h-8 bg-irms-light rounded-full border-l-2 border-slate-200 z-10 hidden sm:block"></div>

      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-dashed border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-irms-blue text-white p-3 rounded-2xl shadow-md"><Ticket size={24} /></div>
          <div>
            <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">IRMS 2026 Pass</h3>
            <p className="text-xs text-slate-500 font-bold font-mono tracking-widest mt-1">ID: {registration.id.split('-')[0].toUpperCase()}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border-2 ${statusConfig.color} shadow-sm`}>
          {statusConfig.icon} <span className="uppercase tracking-wider">{registration.status}</span>
        </div>
      </div>
      
      {/* Ticket Body */}
      <div className="p-6 flex-1 flex flex-col sm:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {registration.status === 'Rejected' && registration.rejectionReason && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              <strong className="font-bold flex items-center gap-2 mb-1"><AlertCircle size={16}/> Rejection Reason:</strong>
              <p className="text-sm font-medium">{registration.rejectionReason}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Category</p>
              <p className="font-bold text-base text-slate-800">{registration.category}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Member Status</p>
              <p className="font-bold text-base text-slate-800 flex items-center gap-1.5">
                {registration.isIrmsMember ? <><CheckCircle2 size={16} className="text-irms-blue"/> Verified</> : 'Non-Member'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">Granted Access</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-800 text-white border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide">Main Conference (16 Jul)</span>
                {registration.attendingWorkshop && <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide">Workshops (14 Jul)</span>}
                {registration.attendingRockersNight && <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide">Rockers Night (15 Jul)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Dummy QR Code */}
        <div className="hidden sm:flex flex-col items-center justify-center p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 min-w-[140px]">
          <QrCode size={64} className="text-slate-300 mb-2" strokeWidth={1.5} />
          <p className="text-[9px] text-slate-400 font-mono text-center uppercase font-bold tracking-widest">Scan at Venue</p>
        </div>
      </div>

    </div>
  );
}