"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Editor from "@/components/Editor";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  content: string;
  owner_id: string;
}

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { activeUser } = useAuth();
  const documentId = params.id as string;

  const [doc, setDoc] = useState<Document | null>(null);
  const [userRole, setUserRole] = useState<"viewer" | "editor">("viewer");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchDocument() {
      setLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, content, owner_id")
        .eq("id", documentId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setDoc(data);
        const isOwner = data.owner_id === activeUser.id;
        let role: "viewer" | "editor" = "viewer";
        
        if (isOwner) {
          role = "editor";
        } else {
          const { data: shareData } = await supabase
            .from("document_shares")
            .select("role")
            .eq("document_id", documentId)
            .eq("user_id", activeUser.id)
            .single();
            
          if (shareData) {
            role = shareData.role;
          }
        }
        setUserRole(role);
      }
      setLoading(false);
    }

    if (documentId) fetchDocument();
  }, [documentId, activeUser.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm text-surface-500">Loading document...</p>
        </div>
      </div>
    );
  }

  if (notFound || !doc) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
            <svg
              className="h-8 w-8 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-surface-100">
            Document Not Found
          </h2>
          <p className="text-sm text-surface-500">
            This document doesn&apos;t exist or has been deleted.
          </p>
          <Link
            href="/"
            className="btn-glow mt-2 inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = doc.owner_id === activeUser.id;

  return (
    <Editor
      documentId={doc.id}
      initialTitle={doc.title}
      initialContent={doc.content}
      isOwner={isOwner}
      role={userRole}
    />
  );
}
