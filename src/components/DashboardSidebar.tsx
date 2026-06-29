"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, Users, Trash2, HeadphonesIcon, ChevronDown } from "lucide-react";

export type FilterState = "all" | "mine" | "shared" | "archived";

interface DashboardSidebarProps {
  currentFilter: FilterState;
  setFilter: (f: FilterState) => void;
}

export default function DashboardSidebar({ currentFilter, setFilter }: DashboardSidebarProps) {
  const { activeUser, users, switchUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
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
      <div className="px-6 mb-8 relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-gray-50 hover:bg-gray-100 rounded-2xl p-3 flex items-center justify-between border border-gray-100 transition-colors text-left"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass} text-sm font-bold text-white shadow-sm`}>
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{activeUser.name}</p>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">{mockEmail}</p>
            </div>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute left-6 right-6 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
            <div className="px-4 py-2 border-b border-gray-100 mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Switch Account</p>
            </div>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  u.id === activeUser.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{u.name}</span>
                {u.id === activeUser.id && (
                  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
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
            onClick={() => setFilter("archived")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${currentFilter === "archived" ? "bg-gray-50 text-gray-900 shadow-sm border border-gray-100" : "text-gray-500 hover:text-red-600 hover:bg-red-50/50 border border-transparent"}`}
          >
            <Trash2 size={18} className={currentFilter === "archived" ? "text-gray-900" : "text-gray-400"} />
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
