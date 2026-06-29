"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "@/lib/FontSize";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import TurndownService from "turndown";
import Toolbar from "@/components/Toolbar";
import ShareModal from "@/components/ShareModal";
import EditorHeader from "@/components/EditorHeader";
import Sidebar from "@/components/Sidebar";

interface EditorProps {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  isOwner: boolean;
  role: "viewer" | "editor";
}

type SaveState = "idle" | "saving" | "saved";

export default function Editor({
  documentId,
  initialTitle,
  initialContent,
  isOwner,
  role,
}: EditorProps) {
  const { activeUser } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontFamily,
      FontSize,
    ],
    content: initialContent,
    editable: role === "editor",
    immediatelyRender: false,
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;

    setSaveState("saving");

    const { error } = await supabase
      .from("documents")
      .update({
        title,
        content: editor.getHTML(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    if (error) {
      console.error("Save failed:", error.message);
      setSaveState("idle");
      return;
    }

    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2000);
  }, [editor, title, documentId]);

  const onExportMarkdown = useCallback(() => {
    if (!editor) return;
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(editor.getHTML());
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'Untitled Document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [editor, title]);

  const onExportPDF = useCallback(() => {
    window.print();
  }, []);

  const onImportFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      const text = await file.text();
      let htmlContent = text;
      
      if (file.name.endsWith(".md")) {
        const { parse } = await import("marked");
        htmlContent = await parse(text);
      } else {
        htmlContent = text.replace(/\n/g, "<br>");
      }
      
      editor.commands.setContent(htmlContent);
    } catch (err) {
      console.error("Error reading file:", err);
    }
    
    e.target.value = '';
  }, [editor]);

  return (
    <div className="h-screen w-full flex flex-col bg-[#F9FBFD] overflow-hidden text-gray-900">
      <EditorHeader 
        documentId={documentId}
        title={title}
        setTitle={setTitle}
        role={role}
        onShare={() => setShareModalOpen(true)}
        isOwner={isOwner}
        onSave={handleSave}
        saveState={saveState}
        onExportMarkdown={onExportMarkdown}
        onExportPDF={onExportPDF}
        onImportFile={onImportFile}
      />

      {role === "editor" && <Toolbar editor={editor} />}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div 
            className="max-w-[816px] mx-auto bg-white border border-gray-300 shadow-sm mt-6 mb-12 min-h-[1056px] px-8 py-12 sm:px-16 cursor-text" 
            onClick={() => editor?.commands.focus()}
          >
            <div className="tiptap-editor h-full">
              <EditorContent editor={editor} />
            </div>
          </div>
        </main>
      </div>

      <ShareModal
        documentId={documentId}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}
