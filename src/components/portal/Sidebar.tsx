import { User, Clock, Plus, LogOut, LayoutDashboard, FileDown } from 'lucide-react'; // <-- Added FileDown
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
    <aside className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">

      {/* Dashboard Header & Identity */}
      <div className="p-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
            <LayoutDashboard className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-200 shrink-0 shadow-sm">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs text-gray-500">Welcome back,</div>
            <div className="font-bold text-gray-900 truncate" title={session?.user?.name || ""}>
              {displayName}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action & Download Link */}
      <div className="p-6 border-b border-gray-100 shrink-0">
        <button
          onClick={onNewSubmission}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus size={20} /> Submit New Abstract
        </button>

        <a
          href="/IRMS 2026_Abstract_Template.docx"
          download="IRMS_Abstract_Template.docx"
          className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors group"
        >
          <FileDown size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:-translate-y-0.5 transition-all" />
          Download Template
        </a>
      </div>

      {/* Upcoming Deadlines */}
      <div className="p-6 flex-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock size={16} className="text-red-500" /> Next Deadlines
        </h3>
        <div className="space-y-5 relative">
          <div className="absolute left-1.25 top-2 bottom-2 w-0.5 bg-gray-100"></div>

          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-3 h-3 bg-red-500 rounded-full ring-4 ring-white"></div>
            <div className="text-sm font-bold text-gray-900">22 Mar 2026</div>
            <div className="text-xs text-gray-500 mt-0.5">Abstract Submission Closes</div>
          </div>

          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-3 h-3 bg-gray-300 rounded-full ring-4 ring-white"></div>
            <div className="text-sm font-medium text-gray-600">5 Apr 2026</div>
            <div className="text-xs text-gray-400 mt-0.5">Acceptance Notification</div>
          </div>
        </div>
      </div>

      {/* Footer / Sign Out */}
      <div className="p-6 border-t border-gray-100 bg-slate-50 mt-auto shrink-0">
        <div className="mb-4 text-xs text-gray-500 truncate text-center">
          {session?.user?.email}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/submission/register' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}