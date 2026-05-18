import { User, Clock, LogOut, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  session: Session | null;
}

export default function Sidebar({ session }: SidebarProps) {
  const getShortName = (fullName?: string | null) => {
    if (!fullName) return "Participant";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };

  const displayName = getShortName(session?.user?.name);

  return (
    <aside className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
      {/* Dashboard Header & Identity */}
      <div className="p-6 border-b border-slate-100 shrink-0 bg-slate-50/50">

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
            <User size={24} />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Welcome back</div>
            <div className="font-bold text-slate-900 truncate text-lg" title={session?.user?.name || ""}>
              {displayName}
            </div>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="p-6 flex-1 bg-white">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Clock size={16} className="text-blue-500" /> Event Timeline
        </h3>

        <div className="space-y-6 relative ml-2">
          {/* Vertical connecting line */}
          <div className="absolute left-1.75 top-2 bottom-2 w-0.5 bg-slate-100"></div>

          {/* Past Milestone 1 */}
          <div className="relative pl-8 opacity-60">
            <div className="absolute -left-1 top-0.5 bg-white">
              <CheckCircle2 size={20} className="text-slate-400 fill-slate-100" />
            </div>
            <div className="text-sm font-semibold text-slate-500 line-through decoration-slate-300">30 Apr 2026</div>
            <div className="text-xs font-medium text-slate-400 mt-0.5">Call for Papers Closed</div>
          </div>

          {/* Active Milestone */}
          <div className="relative pl-8">
            <div className="absolute left-0.75 top-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-4 ring-blue-100 animate-pulse"></div>
            <div className="text-sm font-bold text-slate-900">18 May 2026</div>
            <div className="text-xs font-bold text-blue-600 mt-0.5">Abstract Notification</div>
          </div>

          {/* Active Milestone */}
          <div className="relative pl-8">
            <div className="absolute left-0.75 top-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-4 ring-blue-100 animate-pulse"></div>
            <div className="text-sm font-bold text-slate-900">Current Phase</div>
            <div className="text-xs font-bold text-blue-600 mt-0.5">Main Event Registration</div>
          </div>
        </div>
      </div>

      {/* Footer / Sign Out */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
        <div className="mb-4 text-xs font-medium text-slate-500 truncate text-center">
          {session?.user?.email}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/submission/register' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}