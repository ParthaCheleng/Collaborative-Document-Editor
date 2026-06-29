"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, Users, Trash2, HeadphonesIcon } from "lucide-react";

export type FilterState = "all" | "mine" | "shared";

interface DashboardSidebarProps {
  currentFilter: FilterState;
  setFilter: (f: FilterState) => void;
}

export default function DashboardSidebar({ currentFilter, setFilter }: DashboardSidebarProps) {
  const { activeUser } = useAuth();
  
  const initials = activeUser.name.charAt(0).toUpperCase();
  const colorMap: Record<string, string> = {
    "a1111111-1111-1111-1111-111111111111": "from-indigo-500 to-violet-500",
    "b2222222-2222-2222-2222-222222222222": "from-emerald-500 to-teal-500",
  };
  const gradientClass = colorMap[activeUser.id] || "from-indigo-500 to-violet-500";
  const mockEmail = `${activeUser.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 h-screen sticky top-0 hidden md:flex">
      {/* Top Branding */}
      <div className="p-8 pb-6 flex items-center gap-3">
        <i className="fa-brands fa-atlassian text-[28px] text-blue-900"></i>
        <h1 className="text-2xl font-extrabold tracking-tight text-blue-900 italic">Template</h1>
      </div>

      {/* User Identity Card */}
      <div className="px-6 mb-8">
        <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 border border-gray-100">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass} text-sm font-bold text-white shadow-sm`}>
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{activeUser.name}</p>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{mockEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        <button 
          onClick={() => setFilter("all")}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${currentFilter === "all" ? "bg-gray-50 text-gray-900 shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50 border border-transparent"}`}
        >
          <LayoutDashboard size={18} className={currentFilter === "all" ? "text-gray-900" : "text-gray-400"} />
          Dashboard
        </button>
        
        <button 
          onClick={() => setFilter("mine")}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${currentFilter === "mine" ? "bg-gray-50 text-gray-900 shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50 border border-transparent"}`}
        >
          <FileText size={18} className={currentFilter === "mine" ? "text-gray-900" : "text-gray-400"} />
          My Documents
        </button>

        <button 
          onClick={() => setFilter("shared")}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${currentFilter === "shared" ? "bg-gray-50 text-gray-900 shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50 border border-transparent"}`}
        >
          <Users size={18} className={currentFilter === "shared" ? "text-gray-900" : "text-gray-400"} />
          Shared with Me
        </button>

        <div className="pt-4 mt-4 border-t border-gray-100">
          <button 
            disabled
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-300 cursor-not-allowed border border-transparent"
          >
            <Trash2 size={18} className="text-gray-300" />
            Trash / Archive
          </button>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-6">
        <button className="flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <HeadphonesIcon size={18} />
          Support
        </button>
      </div>
    </aside>
  );
}
