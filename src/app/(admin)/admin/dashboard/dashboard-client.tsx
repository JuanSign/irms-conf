"use client";

import { useState } from "react";
import { LayoutDashboard, BookOpen, Presentation, Ticket, Users, ShieldCheck, Library } from "lucide-react";
import { UserDetail, AdminDetail, AbstractDetail, EventRegistrationDetail, IopDetail, SlideDetail, DashboardStats } from "./types";
import { OverviewTab, AbstractsTab, RegistrationsTab, IopTab, SlidesTab, UsersTab, AdminsTab } from "./dashboard-tabs";

export default function DashboardClient({
  userName, users, admins, abstracts, registrations, iopPublications, slides, stats
}: {
  userName: string; users: UserDetail[]; admins: AdminDetail[]; abstracts: AbstractDetail[];
  registrations: EventRegistrationDetail[]; iopPublications: IopDetail[]; slides: SlideDetail[]; stats: DashboardStats
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "abstracts", label: "Abstracts", icon: BookOpen },
    { id: "slides", label: "Presentations", icon: Presentation },
    { id: "iop", label: "IOP Publications", icon: Library },
    { id: "registrations", label: "Registrations", icon: Ticket },
    { id: "users", label: "Authors Directory", icon: Users },
    { id: "admins", label: "Reviewers & Roles", icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-900">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 shadow-xl z-20">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tight">Super Admin</h2>
          <p className="text-sm text-slate-400 mt-1 truncate">Welcome, {userName}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto min-h-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {activeTab === "overview" && <OverviewTab stats={stats} />}
            {activeTab === "abstracts" && <AbstractsTab abstracts={abstracts} />}
            {activeTab === "slides" && <SlidesTab slides={slides} />}
            {activeTab === "iop" && <IopTab iopPublications={iopPublications} />}
            {activeTab === "registrations" && <RegistrationsTab registrations={registrations} />}
            {activeTab === "users" && <UsersTab users={users} />}
            {activeTab === "admins" && <AdminsTab admins={admins} abstracts={abstracts} />}
          </div>
        </div>
      </main>
    </div>
  );
}