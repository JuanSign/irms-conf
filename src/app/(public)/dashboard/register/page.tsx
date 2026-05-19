import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AuthForm } from "./AuthForm";

export default async function RegisterPage() {
  const session = await auth();

  // If already authenticated as a user, redirect to their dashboard
  if (session?.user && session.user.role === "user") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-irms-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-md border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-irms-dark">
            Author & Delegate Portal
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Secure access to event registration and abstract submissions.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}