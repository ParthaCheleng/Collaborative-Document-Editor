"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { parseFile } from "@/lib/fileParser";
import DocumentCard from "@/components/DocumentCard";
import DashboardSidebar, { FilterState } from "@/components/DashboardSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { Search, Plus, FileText, Users, FileIcon } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  owner_name?: string;
  is_archived: boolean;
}

export default function DashboardPage() {
  const { activeUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [myDocs, setMyDocs] = useState<Document[]>([]);
  const [sharedDocs, setSharedDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<FilterState>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDocuments = useCallback(async () => {
    setLoading(true);

    // Fetch my documents
    const { data: mine } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_id", activeUser.id)
      .order("updated_at", { ascending: false });

    // Fetch shared documents (join document_shares with documents)
    const { data: shareRows } = await supabase
      .from("document_shares")
      .select("document_id")
      .eq("user_id", activeUser.id);

    let shared: Document[] = [];
    if (shareRows && shareRows.length > 0) {
      const docIds = shareRows.map((r) => r.document_id);
      const { data: sharedData } = await supabase
        .from("documents")
        .select("*")
        .in("id", docIds)
        .order("updated_at", { ascending: false });

      if (sharedData) {
        // Look up owner names for shared docs
        const ownerIds = [...new Set(sharedData.map((d) => d.owner_id))];
        const { data: owners } = await supabase
          .from("users")
          .select("id, name")
          .in("id", ownerIds);

        const ownerMap = new Map(owners?.map((o) => [o.id, o.name]) || []);

        shared = sharedData.map((d) => ({
          ...d,
          owner_name: ownerMap.get(d.owner_id) || "Unknown",
        }));
      }
    }

    setMyDocs(mine || []);
    setSharedDocs(shared);
    setLoading(false);
  }, [activeUser.id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCreateNew = async () => {
    setCreating(true);
    const { data, error } = await supabase
      .from("documents")
      .insert({
        title: "Untitled Document",
        content: "<p></p>",
        owner_id: activeUser.id,
      })
      .select()
      .single();

    if (data && !error) {
      router.push(`/documents/${data.id}`);
    }
    setCreating(false);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { title, content } = await parseFile(file);

      const { data, error } = await supabase
        .from("documents")
        .insert({
          title,
          content,
          owner_id: activeUser.id,
        })
        .select()
        .single();

      if (data && !error) {
        router.push(`/documents/${data.id}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import file.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const allDocs = [...myDocs, ...sharedDocs];
  
  // Filter logic
  let displayDocs = allDocs;
  if (filter === "mine") displayDocs = myDocs.filter(d => !d.is_archived);
  else if (filter === "shared") displayDocs = sharedDocs.filter(d => !d.is_archived);
  else if (filter === "archived") displayDocs = myDocs.filter(d => d.is_archived);
  else displayDocs = allDocs.filter(d => !d.is_archived); // "all"
  
  if (searchQuery) {
    displayDocs = displayDocs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const handleArchive = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const { error } = await supabase.from('documents').update({ is_archived: true }).eq('id', id);
    if (!error) fetchDocuments();
  };

  const handleRestore = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const { error } = await supabase.from('documents').update({ is_archived: false }).eq('id', id);
    if (!error) fetchDocuments();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const confirm = window.confirm("Are you sure you want to permanently delete this document?");
    if (!confirm) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (!error) fetchDocuments();
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <DashboardSidebar currentFilter={filter} setFilter={setFilter} />

      <main className="flex-1 flex flex-col p-8 sm:p-12 overflow-y-auto">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <h2 className="text-[32px] font-bold text-gray-900 tracking-tight">
            Hello, {activeUser.name.split(' ')[0]}
          </h2>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Metric Summary Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {/* Block 1: Soft Blue */}
          <div className="bg-[#BCCAF8] rounded-[24px] p-6 shadow-sm flex flex-col justify-between aspect-[4/3] cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setFilter('all')}>
            <div>
              <div className="h-10 w-10 rounded-full bg-white/40 flex items-center justify-center mb-4">
                <FileIcon size={20} className="text-[#2F327D]" />
              </div>
              <p className="font-bold text-[#2F327D] text-lg">All Documents</p>
              <p className="text-[#2F327D]/70 text-xs mt-1 font-medium">Workspace Total</p>
            </div>
            <p className="text-4xl font-extrabold text-[#2F327D]">{allDocs.length}</p>
          </div>

          {/* Block 2: Soft Sage */}
          <div className="bg-[#DAE4E0] rounded-[24px] p-6 shadow-sm flex flex-col justify-between aspect-[4/3] cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setFilter('shared')}>
            <div>
              <div className="h-10 w-10 rounded-full bg-white/40 flex items-center justify-center mb-4">
                <Users size={20} className="text-[#3A4B45]" />
              </div>
              <p className="font-bold text-[#3A4B45] text-lg">Shared with Me</p>
              <p className="text-[#3A4B45]/70 text-xs mt-1 font-medium">Collaborative</p>
            </div>
            <p className="text-4xl font-extrabold text-[#3A4B45]">{sharedDocs.length}</p>
          </div>

          {/* Block 3: Soft Pink */}
          <div className="bg-[#F6C6D3] rounded-[24px] p-6 shadow-sm flex flex-col justify-between aspect-[4/3] cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setFilter('mine')}>
            <div>
              <div className="h-10 w-10 rounded-full bg-white/40 flex items-center justify-center mb-4">
                <FileText size={20} className="text-[#5D2C38]" />
              </div>
              <p className="font-bold text-[#5D2C38] text-lg">Owner Drafts</p>
              <p className="text-[#5D2C38]/70 text-xs mt-1 font-medium">Your creations</p>
            </div>
            <p className="text-4xl font-extrabold text-[#5D2C38]">{myDocs.length}</p>
          </div>
        </div>

        {/* Workspace Divider & Action */}
        <div className="flex items-center gap-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">Documents Workspace</h3>
          
          <button 
            onClick={handleCreateNew} 
            disabled={creating}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-100 text-gray-600 hover:text-gray-900 transition-all shrink-0 ml-2"
          >
            <Plus size={24} />
          </button>
          
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Action Row: Underline Input Style for Import */}
        <div className="flex items-center gap-4 mb-8 max-w-lg">
          <span className="text-sm font-bold text-gray-900 w-32 shrink-0">Import Local</span>
          <div className="w-px h-6 bg-gray-300" />
          <div className="relative flex-1 group">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-left bg-transparent border-b border-gray-300 py-1 text-sm text-gray-500 outline-none hover:border-gray-500 transition-colors flex justify-between items-center"
            >
              Select .md or .txt file...
              <Plus size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>

        {/* Document Grid */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : displayDocs.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-[24px] border border-gray-100 shadow-sm">
            <p className="text-gray-500">No documents found.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
            {displayDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                content={doc.content}
                ownerName={doc.owner_name || activeUser.name}
                updatedAt={doc.updated_at}
                isShared={doc.owner_id !== activeUser.id}
                isArchived={doc.is_archived}
                isOwner={doc.owner_id === activeUser.id}
                onArchive={(e) => handleArchive(e, doc.id)}
                onRestore={(e) => handleRestore(e, doc.id)}
                onDelete={(e) => handleDelete(e, doc.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
