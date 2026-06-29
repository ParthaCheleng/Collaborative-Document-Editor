"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FileText, Star, Lock, Download, Upload, File as FileIcon } from "lucide-react";
import UserSwitcher from "./UserSwitcher";
import ActiveUsers from "./ActiveUsers";
import { useAuth } from "@/contexts/AuthContext";

interface EditorHeaderProps {
  documentId: string;
  title: string;
  setTitle: (t: string) => void;
  role: "viewer" | "editor";
  onShare: () => void;
  isOwner: boolean;
  onSave: () => void;
  saveState: "idle" | "saving" | "saved";
  onExportMarkdown: () => void;
  onExportPDF: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EditorHeader({
  documentId,
  title,
  setTitle,
  role,
  onShare,
  isOwner,
  onSave,
  saveState,
  onExportMarkdown,
  onExportPDF,
  onImportFile,
}: EditorHeaderProps) {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setFileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = ["Edit", "View", "Insert", "Format", "Tools", "Extensions", "Help"];

  return (
    <header className="flex flex-col bg-white border-b border-gray-200 px-4 py-2 shrink-0">
      <div className="flex items-center justify-between">
        {/* Left side: Icon + Title + Star */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center h-10 w-10 hover:bg-gray-100 rounded-full transition-colors" title="Back to Dashboard">
            <FileText size={36} className="text-[#4285F4] fill-[#4285F4]" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={role === "viewer"}
                readOnly={role === "viewer"}
                className="text-lg text-gray-900 border border-transparent hover:border-gray-300 focus:border-[#1a73e8] focus:outline-none rounded px-1.5 -ml-1.5 transition-colors disabled:hover:border-transparent disabled:bg-transparent min-w-[200px]"
              />
              <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors" title="Star">
                <Star size={18} />
              </button>
            </div>
            
            {/* Bottom Row Menus */}
            <div className="flex items-center gap-1 -ml-1 mt-0.5">
              <div className="relative" ref={fileMenuRef}>
                <button
                  onClick={() => setFileMenuOpen(!fileMenuOpen)}
                  className={`px-1.5 py-1 text-[13px] text-gray-700 rounded cursor-pointer transition-colors ${fileMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                >
                  File
                </button>
                {fileMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md py-1 z-50">
                    <button 
                      onClick={() => { onSave(); setFileMenuOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileIcon size={14} /> Save manually
                    </button>
                    <div className="h-px bg-gray-200 my-1" />
                    <button 
                      onClick={() => { onExportMarkdown(); setFileMenuOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Download size={14} /> Download as Markdown
                    </button>
                    <button 
                      onClick={() => { onExportPDF(); setFileMenuOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Download size={14} /> Download as PDF
                    </button>
                    <div className="h-px bg-gray-200 my-1" />
                    <button 
                      onClick={() => { fileInputRef.current?.click(); setFileMenuOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Upload size={14} /> Import File
                    </button>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".txt,.md"
                  onChange={onImportFile}
                />
              </div>

              {menuItems.map((item) => (
                <button
                  key={item}
                  className="px-1.5 py-1 text-[13px] text-gray-700 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Active Users + Share + Profile */}
        <div className="flex items-center gap-4">
          <ActiveUsers documentId={documentId} />
          
          {role === "editor" && (
            <button
              onClick={onSave}
              disabled={saveState === "saving"}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-medium text-[14px] transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
            >
              {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved ✓" : "Save"}
            </button>
          )}

          {isOwner && (
            <button
              onClick={onShare}
              className="flex items-center gap-2 bg-[#C2E7FF] hover:bg-[#b0dcf6] text-[#001D35] px-5 py-2.5 rounded-full font-medium text-[14px] transition-colors"
            >
              <Lock size={16} />
              Share
            </button>
          )}

          <UserSwitcher variant="light" />
        </div>
      </div>
    </header>
  );
}
