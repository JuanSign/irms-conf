import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AuthForm } from "./AuthForm";
import Image from "next/image";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user && session.user.role === "user") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen pt-20 flex w-full bg-white">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-irms-dark flex-col justify-center p-12 lg:p-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image/auth-bg.jpg"
            alt="Rock Mechanics Background"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/20 via-[#002b5c]/40 to-irms-blue/20" />
        </div>
        <div className="relative z-10 -mt-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Advancing the Future of Rock Mechanics
          </h1>
          <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
            Join industry leaders, practitioners, and academics. Secure your delegate pass, submit your technical abstracts, and manage your participation in one portal.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-start sm:items-center justify-center px-6 py-10 sm:p-12 lg:p-16 bg-white relative">
        <div className="w-full max-w-md mx-auto">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}