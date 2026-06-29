"use client";

import Link from "next/link";

interface DocumentCardProps {
  id: string;
  title: string;
  content: string;
  ownerName: string;
  updatedAt: string;
  isShared?: boolean;
}

export default function DocumentCard({
  id,
  title,
  content,
  ownerName,
  updatedAt,
  isShared = false,
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
        <div className="mb-3 flex items-start justify-between">
          <h3 className="line-clamp-1 flex-1 text-base font-bold text-gray-900 transition-colors group-hover:text-gray-600">
            {title || "Untitled Document"}
          </h3>
          {isShared && (
            <span className="ml-2 flex-shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 uppercase tracking-wider">
              Shared
            </span>
          )}
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
