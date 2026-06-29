"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function UserSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { activeUser, users, switchUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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
  const gradientClass =
    colorMap[activeUser.id] || "from-indigo-500 to-violet-500";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 transition-all ${
          variant === 'dark' 
            ? 'border-surface-800 bg-surface-900/80 hover:border-brand-500/40 hover:bg-surface-850'
            : 'border-transparent hover:bg-gray-100'
        }`}
        aria-label="Switch user"
        id="user-switcher-button"
      >
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass} text-xs font-bold text-white shadow-md`}
        >
          {initials}
        </div>
        <span className={`text-sm font-medium ${variant === 'dark' ? 'text-surface-200' : 'text-gray-700'}`}>
          {activeUser.name}
        </span>
        <svg
          className={`h-4 w-4 text-surface-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className={`absolute right-0 mt-2 w-56 animate-fade-in rounded-xl border p-1.5 shadow-2xl z-50 ${
          variant === 'dark'
            ? 'border-surface-800 bg-surface-900 shadow-black/40'
            : 'border-gray-200 bg-white shadow-gray-200/50'
        }`}>
          <p className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider ${variant === 'dark' ? 'text-surface-500' : 'text-gray-500'}`}>
            Switch User
          </p>
          {users.map((user) => {
            const isActive = user.id === activeUser.id;
            const userGradient =
              colorMap[user.id] || "from-indigo-500 to-violet-500";
            return (
              <button
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  setDropdownOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                  isActive
                    ? variant === 'dark' ? "bg-brand-500/10 text-brand-300" : "bg-blue-50 text-blue-700"
                    : variant === 'dark' ? "text-surface-300 hover:bg-surface-800 hover:text-surface-100" : "text-gray-700 hover:bg-gray-100"
                }`}
                id={`user-switch-${user.name.toLowerCase()}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${userGradient} text-xs font-bold text-white`}
                >
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-surface-500">
                    {user.id.slice(0, 8)}...
                  </p>
                </div>
                {isActive && (
                  <svg
                    className="ml-auto h-4 w-4 text-brand-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
