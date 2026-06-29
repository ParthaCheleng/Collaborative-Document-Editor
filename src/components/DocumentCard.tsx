"use client";

import Link from "next/link";
import { Archive, Trash2, ArchiveRestore } from "lucide-react";

interface DocumentCardProps {
  id: string;
  title: string;
  content: string;
  ownerName: string;
  updatedAt: string;
  isShared?: boolean;
  isArchived?: boolean;
  isOwner?: boolean;
  onArchive?: (e: React.MouseEvent) => void;
  onRestore?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export default function DocumentCard({
  id,
  title,
  content,
  ownerName,
  updatedAt,
  isShared = false,
  isArchived = false,
  isOwner = false,
  onArchive,
  onRestore,
  onDelete,
}: DocumentCardProps) {
  // Strip HTML tags for preview
  const preview = content
    .replace(/<[^>]*>/g, "")
    .slice(0, 120)
    .trim();

  const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/documents/${id}`} className="block" id={`doc-card-${id}`}>
      <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group flex flex-col h-full min-h-[160px]">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between relative">
          <h3 className="line-clamp-1 flex-1 text-base font-bold text-gray-900 transition-colors group-hover:text-gray-600">
            {title || "Untitled Document"}
          </h3>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {isShared && !isArchived && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 uppercase tracking-wider">
                Shared
              </span>
            )}
            
            {/* Hover Actions (Only for owner) */}
            {isOwner && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white shadow-sm border border-gray-100 rounded-md p-1 absolute -top-2 -right-2">
                {!isArchived ? (
                  <button 
                    onClick={onArchive}
                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                    title="Archive"
                  >
                    <Archive size={14} />
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={onRestore}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Restore"
                    >
                      <ArchiveRestore size={14} />
                    </button>
                    <button 
                      onClick={onDelete}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Forever"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500 flex-1">
          {preview || "Empty document"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
              {ownerName.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-gray-700">{ownerName}</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
