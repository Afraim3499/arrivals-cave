"use client";

import { useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
    Bold, Italic, Underline as UnderlineIcon,
    Strikethrough, List, ListOrdered,
    Quote, ImageIcon, Link as LinkIcon, Unlink
} from "lucide-react";

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Underline,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[150px] px-4 py-3 bg-neutral-950 text-neutral-200 text-sm",
            },
        },
        immediatelyRender: false,
    });
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt("URL of the image:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL:", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return (
        <div className="border border-neutral-800 rounded-md overflow-hidden flex flex-col focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500 transition-colors">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-900 border-b border-neutral-800">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${editor.isActive("bold") ? "bg-neutral-800 text-orange-500" : "text-neutral-400"}`}
                    type="button"
                    title="Bold"
                >
                    <Bold size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${editor.isActive("italic") ? "bg-neutral-800 text-orange-500" : "text-neutral-400"}`}
                    type="button"
                    title="Italic"
                >
                    <Italic size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${editor.isActive("underline") ? "bg-neutral-800 text-orange-500" : "text-neutral-400"}`}
                    type="button"
                    title="Underline"
                >
                    <UnderlineIcon size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${editor.isActive("strike") ? "bg-neutral-800 text-orange-500" : "text-neutral-400"}`}
                    type="button"
                    title="Strikethrough"
                >
                    <Strikethrough size={16} />
                </button>

                <div className="w-px h-5 bg-neutral-800 mx-1"></div>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${editor.isActive("bulletList") ? "bg-neutral-800 text-orange-500" : "text-neutral-400"}`}
                    type="button"
                    title="Bullet List"
                >
                    <List size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${editor.isActive("orderedList") ? "bg-neutral-800 text-orange-500" : "text-neutral-400"}`}
                    type="button"
                    title="Ordered List"
                >
                    <ListOrdered size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${editor.isActive("blockquote") ? "bg-neutral-800 text-orange-500" : "text-neutral-400"}`}
                    type="button"
                    title="Blockquote"
                >
                    <Quote size={16} />
                </button>

                <div className="w-px h-5 bg-neutral-800 mx-1"></div>

                <button
                    onClick={setLink}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${editor.isActive("link") ? "bg-neutral-800 text-orange-500" : "text-neutral-400"}`}
                    type="button"
                    title="Set Link"
                >
                    <LinkIcon size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive("link")}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors text-neutral-400 disabled:opacity-50`}
                    type="button"
                    title="Unset Link"
                >
                    <Unlink size={16} />
                </button>
                <button
                    onClick={addImage}
                    className="p-1.5 rounded hover:bg-neutral-800 transition-colors text-neutral-400"
                    type="button"
                    title="Add Image"
                >
                    <ImageIcon size={16} />
                </button>
            </div>

            <div className="flex-1 bg-neutral-950 overflow-y-auto cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
