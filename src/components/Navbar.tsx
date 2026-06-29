"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import UserSwitcher from "./UserSwitcher";

export default function Navbar() {

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-800/60 bg-surface-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-brand-500/25">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight text-surface-50">
            Ajaia<span className="text-brand-400">Doc</span>
          </span>
        </Link>

        {/* User Switcher */}
        <UserSwitcher />
      </div>
    </nav>
  );
}
