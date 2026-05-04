import { User, Clock, Lock, LogOut, LayoutDashboard, FileDown, CheckCircle2 } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  session: Session | null;
  onNewSubmission: () => void;
}

export default function Sidebar({ session, onNewSubmission }: SidebarProps) {
  const getShortName = (fullName?: string | null) => {
    if (!fullName) return "Author";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };

  const displayName = getShortName(session?.user?.name);

  return (
    <aside className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">

      {/* Dashboard Header & Identity */}
      <div className="p-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
            <LayoutDashboard className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200 shrink-0 shadow-sm">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs text-slate-500">Welcome back,</div>
            <div className="font-bold text-slate-900 truncate" title={session?.user?.name || ""}>
              {displayName}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action (Locked) & Download Link */}
      <div className="p-6 border-b border-slate-100 shrink-0 bg-slate-50/50">
        <button
          onClick={onNewSubmission}
          className="w-full flex justify-center items-center gap-2 bg-slate-100 text-slate-400 border border-slate-200 px-5 py-3 rounded-xl font-bold cursor-not-allowed transition-all"
          title="Submission period has ended"
        >
          <Lock size={18} /> Submissions Closed
        </button>

        <a
          href="/IRMS 2026_Abstract_Template.docx"
          download="IRMS_Abstract_Template.docx"
          className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <FileDown size={16} className="text-slate-400 group-hover:text-blue-600 transition-all" />
          Template Reference
        </a>
      </div>

      {/* Upcoming Deadlines (Updated Timeline) */}
      <div className="p-6 flex-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Clock size={16} className="text-blue-500" /> Timeline
        </h3>
        
        <div className="space-y-6 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1.25 top-2 bottom-2 w-0.5 bg-slate-100"></div>

          {/* Past Milestone */}
          <div className="relative pl-6 opacity-60">
            <div className="absolute -left-0.5 top-1 bg-white">
              <CheckCircle2 size={16} className="text-slate-400 fill-slate-100" />
            </div>
            <div className="text-sm font-semibold text-slate-500 line-through decoration-slate-300">30 Apr 2026</div>
            <div className="text-xs text-slate-400 mt-0.5">Submission Deadline</div>
          </div>

          {/* Active Next Milestone */}
          <div className="relative pl-6">
            <div className="absolute left-0.75 top-2 w-1.5 h-1.5 bg-blue-600 rounded-full ring-4 ring-blue-100 animate-pulse"></div>
            <div className="text-sm font-bold text-slate-900">8 May 2026</div>
            <div className="text-xs font-medium text-blue-600 mt-0.5">Acceptance Notification</div>
          </div>
        </div>
      </div>

      {/* Footer / Sign Out */}
      <div className="p-6 border-t border-slate-100 bg-white mt-auto shrink-0">
        <div className="mb-4 text-xs text-slate-500 truncate text-center">
          {session?.user?.email}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/submission/register' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}