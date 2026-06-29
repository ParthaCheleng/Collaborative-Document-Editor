"use client";

import { List } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <List size={14} />
          Document Outline
        </h2>
        <div className="mt-6 text-sm text-gray-400 italic px-2">
          Headings that you add to the document will appear here.
        </div>
      </div>
    </aside>
  );
}
