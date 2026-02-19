import { User, Clock } from 'lucide-react';
import { Session } from 'next-auth';

interface SidebarProps {
  session: Session | null;
}

export default function Sidebar({ session }: SidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Profile Summary */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-gray-500">
            <User size={24} />
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-gray-900 truncate">{session?.user?.name || "Loading..."}</div>
            <div className="text-xs text-gray-500 truncate">
              {session?.user?.affiliation || "No Affiliation"}
            </div>
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900 truncate max-w-37.5 ml-4">{session?.user?.email || "..."}</span>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-irms-red" /> Next Deadlines
        </h3>
        <div className="space-y-4 relative">
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
          <div className="relative pl-8">
            <div className="absolute left-1 top-1.5 w-3.5 h-3.5 bg-irms-red rounded-full border-2 border-white ring-1 ring-red-100"></div>
            <div className="text-sm font-bold text-gray-900">23 Feb 2026</div>
            <div className="text-xs text-gray-500">Abstract Submission Closes</div>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-1 top-1.5 w-3.5 h-3.5 bg-gray-300 rounded-full border-2 border-white"></div>
            <div className="text-sm font-medium text-gray-500">15 Mar 2026</div>
            <div className="text-xs text-gray-400">Acceptance Notification</div>
          </div>
        </div>
      </div>
    </div>
  );
}