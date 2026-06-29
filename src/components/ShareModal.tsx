"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth, SEEDED_USERS } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { X, UserPlus, Mail } from "lucide-react";

interface ShareModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({
  documentId,
  isOpen,
  onClose,
}: ShareModalProps) {
  const { activeUser } = useAuth();
  const [sharedUsers, setSharedUsers] = useState<Map<string, string>>(new Map());
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("viewer");

  const otherUsers = SEEDED_USERS.filter((u) => u.id !== activeUser.id);

  const fetchShares = useCallback(async () => {
    setFetching(true);
    const { data } = await supabase
      .from("document_shares")
      .select("user_id, role")
      .eq("document_id", documentId);

    if (data) {
      const map = new Map<string, string>();
      data.forEach(row => map.set(row.user_id, row.role));
      setSharedUsers(map);
    }
    setFetching(false);
  }, [documentId]);

  useEffect(() => {
    if (isOpen) {
      fetchShares();
      setSuccessMessage(null);
      setShareEmail("");
    }
  }, [isOpen, fetchShares]);

  if (!isOpen) return null;

  const handleShare = async () => {
    // Find the seeded user by matching email (mock logic)
    const targetUser = otherUsers.find(
      u => `${u.name.toLowerCase().replace(/\s+/g, '')}@gmail.com` === shareEmail.toLowerCase()
    );

    if (!targetUser) {
      alert("User not found in system. Try: " + otherUsers.map(u => `${u.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`).join(", "));
      return;
    }

    setLoadingUserId(targetUser.id);
    const { error } = await supabase
      .from("document_shares")
      .upsert({ document_id: documentId, user_id: targetUser.id, role: shareRole });

    setLoadingUserId(null);

    if (!error) {
      setSharedUsers((prev) => {
        const next = new Map(prev);
        next.set(targetUser.id, shareRole);
        return next;
      });
      setSuccessMessage(`Shared with ${targetUser.name}!`);
      setShareEmail("");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleUnshare = async (userId: string) => {
    setLoadingUserId(userId);
    const { error } = await supabase
      .from("document_shares")
      .delete()
      .eq("document_id", documentId)
      .eq("user_id", userId);

    setLoadingUserId(null);

    if (!error) {
      setSharedUsers((prev) => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const currentCollaborators = SEEDED_USERS.filter(u => sharedUsers.has(u.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-[24px] shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Share Document</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8 space-y-8">
          
          {/* Active Collaborators Grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Active Collaborators</h3>
            
            {fetching ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              </div>
            ) : currentCollaborators.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCollaborators.map((user) => {
                  const role = sharedUsers.get(user.id) || "viewer";
                  const mockEmail = `${user.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
                  const isLoading = loadingUserId === user.id;

                  return (
                    <div key={user.id} className="group relative bg-gray-50 rounded-[16px] p-3 flex flex-col justify-center border border-gray-100 shadow-sm transition-all hover:border-gray-300">
                      <button 
                        onClick={() => handleUnshare(user.id)}
                        disabled={isLoading}
                        className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm text-red-500 hover:bg-red-50 transition-all border border-gray-100 disabled:opacity-50"
                        title="Remove Access"
                      >
                        <X size={12} />
                      </button>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-inner">
                          {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">{mockEmail}</p>
                          <p className="text-[10px] uppercase font-bold text-brand-600 mt-1 tracking-wider">{role}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-[16px] border border-gray-100">
                This document is not shared with anyone yet.
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Form Fields & Input Lines */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">Invite New</h3>
            
            {successMessage && (
              <div className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 border border-emerald-100">
                {successMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-end gap-6">
              {/* Minimal Underline Input */}
              <div className="flex items-center gap-4 flex-1 w-full border-b border-gray-300 pb-2 focus-within:border-brand-500 transition-colors">
                <span className="text-sm font-bold text-gray-900 shrink-0">Collaborator email</span>
                <div className="w-px h-6 bg-gray-300 shrink-0" />
                <div className="flex-1 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={shareRole}
                  onChange={(e) => setShareRole(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>

                <button
                  onClick={handleShare}
                  disabled={!shareEmail.trim() || !!loadingUserId}
                  className="bg-gray-900 text-white rounded-xl px-5 py-2.5 font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                >
                  <UserPlus size={16} />
                  Invite
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
