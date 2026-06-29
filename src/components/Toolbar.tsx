"use client";

import type { Editor } from "@tiptap/react";
import { 
  Undo, Redo, Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List as ListIcon, ListOrdered, ChevronDown, Plus, Minus
} from "lucide-react";
import { useState, useEffect } from "react";

interface ToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ToolbarButton({ icon, isActive, onClick, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-pressed={isActive}
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-4 w-[1px] bg-gray-300" aria-hidden="true" />;
}

export default function Toolbar({ editor }: ToolbarProps) {
  // Always call hooks first
  const currentFontSizeStr = editor?.getAttributes('textStyle').fontSize?.replace('px', '') || '16';
  const [fontSizeInput, setFontSizeInput] = useState(currentFontSizeStr);

  useEffect(() => {
    setFontSizeInput(currentFontSizeStr);
  }, [currentFontSizeStr]);

  if (!editor) return null;

  const handleFontSizeChange = (newSize: number) => {
    if (isNaN(newSize) || newSize < 1 || newSize > 100) return;
    editor.chain().focus().setFontSize(`${newSize}px`).run();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSizeInput(e.target.value);
  };

  const handleInputBlur = () => {
    const size = parseInt(fontSizeInput);
    if (!isNaN(size) && size >= 1 && size <= 100) {
      handleFontSizeChange(size);
    } else {
      setFontSizeInput(currentFontSizeStr);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      editor.commands.focus();
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="flex items-center gap-1 px-4 py-1.5 overflow-x-auto">
        {/* 1. Undo / Redo */}
        <ToolbarButton
          icon={<Undo size={16} />}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        />
        <ToolbarButton
          icon={<Redo size={16} />}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        />
        
        <Divider />

        {/* 2. Text Style & Font (Visual Placeholders for aesthetic) */}
        <button className="flex h-7 items-center gap-1 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
          <span>Normal text</span>
          <ChevronDown size={14} className="text-gray-500" />
        </button>
        
        <Divider />
        
        <select 
          className="h-7 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors outline-none cursor-pointer appearance-none bg-transparent"
          onChange={(e) => {
            if (e.target.value === 'default') {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(e.target.value).run();
            }
          }}
          value={editor.getAttributes('textStyle').fontFamily || 'default'}
        >
          <option value="default">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>

        <Divider />

        {/* 3. Font Size */}
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors"
            onClick={() => {
              const current = parseInt(fontSizeInput) || 16;
              const newSize = current - 1;
              if (newSize >= 1) {
                setFontSizeInput(newSize.toString());
                handleFontSizeChange(newSize);
              }
            }}
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            min={1}
            max={100}
            value={fontSizeInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="text-sm text-gray-700 w-10 text-center border border-transparent hover:border-gray-300 focus:border-blue-500 rounded outline-none"
          />
          <button 
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors"
            onClick={() => {
              const current = parseInt(fontSizeInput) || 16;
              const newSize = current + 1;
              if (newSize <= 100) {
                setFontSizeInput(newSize.toString());
                handleFontSizeChange(newSize);
              }
            }}
          >
            <Plus size={14} />
          </button>
        </div>

        <Divider />

        {/* 4. Bold, Italic, Underline */}
        <ToolbarButton
          icon={<Bold size={16} strokeWidth={2.5} />}
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          icon={<Italic size={16} />}
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon={<Underline size={16} />}
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />

        <Divider />

        {/* 5. Text Alignment */}
        <ToolbarButton
          icon={<AlignLeft size={16} />}
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        />
        <ToolbarButton
          icon={<AlignCenter size={16} />}
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        />
        <ToolbarButton
          icon={<AlignRight size={16} />}
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        />
        <ToolbarButton
          icon={<AlignJustify size={16} />}
          isActive={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        />

        <Divider />

        {/* 6. Lists */}
        <ToolbarButton
          icon={<ListIcon size={16} />}
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          icon={<ListOrdered size={16} />}
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>
    </div>
  );
}
