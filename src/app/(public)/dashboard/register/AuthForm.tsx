"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";

export function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!isLogin) {
      // Handle Registration
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const res = await registerUser(formData);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
    }

    // Handle Login (Runs immediately after successful registration too)
    const result = await signIn("user-login", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh(); // Ensure the layout updates with the new session
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 rounded-md bg-irms-red/10 border border-irms-red/20 text-irms-red text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-irms-blue focus:border-transparent transition-colors"
                placeholder="Dr. Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="affiliation">Affiliation / Institution</label>
              <input
                id="affiliation"
                name="affiliation"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-irms-blue focus:border-transparent transition-colors"
                placeholder="University of Technology"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-irms-blue focus:border-transparent transition-colors"
            placeholder="jane.doe@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-irms-blue focus:border-transparent transition-colors"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-irms-blue focus:border-transparent transition-colors"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-irms-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-irms-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(""); // Clear errors when switching modes
            }}
            className="font-semibold text-irms-blue hover:underline focus:outline-none"
          >
            {isLogin ? "Register here" : "Sign in here"}
          </button>
        </p>
      </div>
    </div>
  );
}