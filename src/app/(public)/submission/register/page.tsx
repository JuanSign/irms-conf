'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Building, Lock, LogIn, UserPlus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { registerUser, loginUser } from '@/actions/auth';

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    } else {
      toast.success('Account created successfully!');

      // Automatically log the user in after registration
      const loginResult = await loginUser(formData);

      if (loginResult?.error) {
        toast.error(loginResult.error);
        setIsLoading(false);
      } else {
        // Use window.location to force a hard hydration of the session
        window.location.href = '/submission/portal';
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    } else {
      toast.success('Welcome back!');
      setTimeout(() => {
        window.location.href = '/submission/portal';
      }, 500);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen flex flex-col items-center pt-28 pb-12 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Author Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === 'register'
              ? 'Create an account to submit your abstract'
              : 'Welcome back! Please sign in to continue'}
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Tab Switcher */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('register')}
              disabled={isLoading}
              className={`w-1/2 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'register'
                  ? 'bg-white text-irms-blue border-b-2 border-irms-blue'
                  : 'bg-slate-50 text-gray-500 hover:text-gray-700 hover:bg-slate-100'}`}
            >
              <UserPlus size={18} />
              New Account
            </button>
            <button
              onClick={() => setActiveTab('login')}
              disabled={isLoading}
              className={`w-1/2 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'login'
                  ? 'bg-white text-irms-blue border-b-2 border-irms-blue'
                  : 'bg-slate-50 text-gray-500 hover:text-gray-700 hover:bg-slate-100'}`}
            >
              <LogIn size={18} />
              Sign In
            </button>
          </div>

          <div className="p-8">

            {/* ---------------- REGISTER FORM ---------------- */}
            {activeTab === 'register' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-irms-blue focus:border-irms-blue transition sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder="Dr. John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-irms-blue focus:border-irms-blue transition sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder="john@university.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Building size={18} />
                      </div>
                      <input
                        type="text"
                        name="affiliation"
                        required
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-irms-blue focus:border-irms-blue transition sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder="University / Company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-irms-blue focus:border-irms-blue transition sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-irms-blue hover:bg-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Register & Continue'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account? <button onClick={() => setActiveTab('login')} disabled={isLoading} className="text-irms-blue font-bold hover:underline disabled:opacity-50">Log in</button>
                </p>
              </div>
            )}


            {/* ---------------- LOGIN FORM ---------------- */}
            {activeTab === 'login' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-irms-blue focus:border-irms-blue transition sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder="john@university.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <Link href="#" className="text-xs text-irms-blue hover:text-blue-800">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        required
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-irms-blue focus:border-irms-blue transition sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-irms-blue hover:bg-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  New here? <button onClick={() => setActiveTab('register')} disabled={isLoading} className="text-irms-blue font-bold hover:underline disabled:opacity-50">Create an account</button>
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">Back to Home</Link>
          <span>•</span>
          <Link href="/submission" className="hover:text-gray-600">Submission Guidelines</Link>
        </div>
      </div>
    </main>
  );
}