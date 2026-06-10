"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import YoutubeExt from "@tiptap/extension-youtube";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import {
  Bold, Italic, Heading2, Heading3,
  List, ListOrdered, Link2, Video, Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  dir = "ltr",
  placeholder,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExt.configure({ openOnClick: false }),
      YoutubeExt.configure({ controls: true, nocookie: true }),
      ImageExt,
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
          dir === "rtl" && "text-right"
        ),
        dir,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value when form resets (e.g. switching to edit mode)
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("Paste YouTube or Vimeo URL:");
    if (!url || !editor) return;
    editor.commands.setYoutubeVideo({ src: url });
  };

  const addImage = () => {
    const url = window.prompt("Paste image URL:");
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  const ToolBtn = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors text-gray-600 hover:bg-gray-200",
        active && "bg-[#0F6A4A]/15 text-[#0F6A4A]",
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn(
      "border border-gray-200 rounded-lg overflow-hidden",
      "focus-within:border-[#0F6A4A] focus-within:ring-2 focus-within:ring-[#0F6A4A]/20",
      className,
    )}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 className="w-4 h-4" />
        </ToolBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <List className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
          <ListOrdered className="w-4 h-4" />
        </ToolBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolBtn onClick={addLink} active={editor.isActive("link")} title="Insert link">
          <Link2 className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={addImage} active={false} title="Insert image (URL)">
          <Image className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={addYoutube} active={false} title="Embed YouTube / Vimeo video">
          <Video className="w-4 h-4" />
        </ToolBtn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
