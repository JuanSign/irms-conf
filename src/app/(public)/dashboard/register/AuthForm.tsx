"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Mail, Lock, User, Building, ArrowRight, ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

const formVariants: Variants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction > 0 ? 30 : -30 }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: (direction: number) => ({ opacity: 0, x: direction < 0 ? 30 : -30, transition: { duration: 0.2 } })
};

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const [data, setData] = useState({
    name: "",
    affiliation: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [e.target.name]: false }));
    if (error) setError("");
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    let hasErr = false;
    const newErrs = { ...fieldErrors };

    if (!data.name.trim()) {
      newErrs.name = true;
      hasErr = true;
    }

    if (hasErr) {
      setFieldErrors(newErrs);
      return;
    }

    setError("");
    setDirection(1);
    setStep(2);
  };

  const handlePrevStep = () => {
    setError("");
    setDirection(-1);
    setStep(1);
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setError("");
    setFieldErrors({});
    setMode(newMode);
    setStep(1);
    setDirection(newMode === 'register' ? 1 : -1);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    let hasErr = false;
    const newErrs = { ...fieldErrors };

    if (mode === 'login') {
      if (!data.email.trim()) { newErrs.email = true; hasErr = true; }
      if (!data.password.trim()) { newErrs.password = true; hasErr = true; }
    } else {
      if (!data.email.trim()) { newErrs.email = true; hasErr = true; }
      if (!data.password.trim()) { newErrs.password = true; hasErr = true; }
      if (!data.confirmPassword.trim()) { newErrs.confirmPassword = true; hasErr = true; }
    }

    if (hasErr) {
      setFieldErrors(newErrs);
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      if (data.password !== data.confirmPassword) {
        setFieldErrors(prev => ({ ...prev, password: true, confirmPassword: true }));
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      if (data.password.length < 6) {
        setFieldErrors(prev => ({ ...prev, password: true }));
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("affiliation", data.affiliation);
      formData.append("password", data.password);

      const res = await registerUser(formData);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
    }

    const result = await signIn("user-login", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  const getInputClasses = (field: string) => `w-full pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-4 transition-all font-medium text-sm sm:text-base placeholder:text-slate-400 ${
    fieldErrors[field]
      ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50 text-rose-900'
      : 'border-slate-200 focus:ring-irms-blue/10 focus:border-irms-blue focus:bg-white text-slate-800'
  }`;

  const getIconClasses = (field: string) => `absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
    fieldErrors[field] ? 'text-rose-500' : 'text-slate-400'
  }`;

  return (
    <div className="w-full bg-white sm:p-10 sm:rounded-3xl sm:border border-slate-200 sm:shadow-2xl sm:shadow-slate-200/40">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          {mode === 'login'
            ? 'Access your author dashboard and event passes.'
            : 'Register as an author or delegate for IRMS 2026.'}
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-3"
          >
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative" noValidate>
        <AnimatePresence custom={direction} mode="wait">
          {mode === 'login' && (
            <motion.div key="login" custom={direction} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className={getIconClasses('email')}><Mail size={18} /></div>
                  <input
                    id="email" name="email" type="email"
                    value={data.email} onChange={handleChange}
                    className={getInputClasses('email')}
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="password">Password</label>
                <div className="relative">
                  <div className={getIconClasses('password')}><Lock size={18} /></div>
                  <input
                    id="password" name="password" type="password"
                    value={data.password} onChange={handleChange}
                    className={getInputClasses('password')}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-irms-blue hover:bg-[#002b5c] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8 flex justify-center items-center gap-2"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Signing In...</> : "Sign In"}
              </button>
            </motion.div>
          )}

          {mode === 'register' && step === 1 && (
            <motion.div key="register-step-1" custom={direction} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 sm:space-y-5">
              <div className="flex gap-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-irms-blue w-1/2 transition-all duration-300" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="name">Full Name</label>
                <div className="relative">
                  <div className={getIconClasses('name')}><User size={18} /></div>
                  <input
                    id="name" name="name" type="text"
                    value={data.name} onChange={handleChange}
                    className={getInputClasses('name')}
                    placeholder="Dr. Jane Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="affiliation">Affiliation / Institution <span className="text-slate-400 normal-case text-[10px] ml-1">(Optional)</span></label>
                <div className="relative">
                  <div className={getIconClasses('affiliation')}><Building size={18} /></div>
                  <input
                    id="affiliation" name="affiliation" type="text"
                    value={data.affiliation} onChange={handleChange}
                    className={getInputClasses('affiliation')}
                    placeholder="University of Technology"
                  />
                </div>
              </div>

              <button
                type="button" onClick={handleNextStep}
                className="w-full py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-irms-blue hover:bg-[#002b5c] transition-all mt-8 flex justify-center items-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {mode === 'register' && step === 2 && (
            <motion.div key="register-step-2" custom={direction} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={handlePrevStep} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">
                  <ArrowLeft size={16} />
                </button>
                <div className="flex gap-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-irms-blue w-full transition-all duration-300" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className={getIconClasses('email')}><Mail size={18} /></div>
                  <input
                    id="email" name="email" type="email"
                    value={data.email} onChange={handleChange}
                    className={getInputClasses('email')}
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="password">Password</label>
                <div className="relative">
                  <div className={getIconClasses('password')}><Lock size={18} /></div>
                  <input
                    id="password" name="password" type="password"
                    value={data.password} onChange={handleChange}
                    className={getInputClasses('password')}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                  <div className={getIconClasses('confirmPassword')}><CheckCircle2 size={18} /></div>
                  <input
                    id="confirmPassword" name="confirmPassword" type="password"
                    value={data.confirmPassword} onChange={handleChange}
                    className={getInputClasses('confirmPassword')}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-irms-blue hover:bg-[#002b5c] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8 flex justify-center items-center gap-2"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</> : "Complete Registration"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600 font-medium">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="font-bold text-irms-blue hover:text-[#002b5c] transition-colors focus:outline-none ml-1"
          >
            {mode === 'login' ? "Register here" : "Sign in here"}
          </button>
        </p>
      </div>
    </div>
  );
}