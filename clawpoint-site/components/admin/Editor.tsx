'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useRef } from 'react'

interface EditorProps {
  content: string
  onChange: (html: string) => void
}

const BTN = 'px-2 py-1 font-mono text-xs border border-[var(--tactical-green)] text-white hover:text-[var(--night-vision)] hover:border-[var(--night-vision)] transition-all duration-200'
const BTN_ACTIVE = 'px-2 py-1 font-mono text-xs border border-[var(--night-vision)] text-[var(--night-vision)] bg-[var(--tactical-green-dark)]/30'

export default function Editor({ content, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto my-4' } }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[var(--night-vision)] hover:underline' },
      }),
      Placeholder.configure({ placeholder: 'Begin your intel report...' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'blog-body min-h-[400px] p-4 text-white focus:outline-none',
      },
    },
  })

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/images/upload', { method: 'POST', body: formData })
    const { url } = await res.json()
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  if (!editor) return null

  return (
    <div className="border border-[var(--tactical-green)] bg-black/60">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--tactical-green)] bg-black/80">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? BTN_ACTIVE : BTN}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? BTN_ACTIVE : BTN}><em>I</em></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? BTN_ACTIVE : BTN}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? BTN_ACTIVE : BTN}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? BTN_ACTIVE : BTN}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? BTN_ACTIVE : BTN}>1. List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? BTN_ACTIVE : BTN}>" Quote</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? BTN_ACTIVE : BTN}>{`</>`}</button>
        <button type="button" onClick={() => {
          const url = window.prompt('Enter URL:')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }} className={editor.isActive('link') ? BTN_ACTIVE : BTN}>Link</button>
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className={BTN}>Image</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={BTN}>—</button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file)
          e.target.value = ''
        }}
      />

      <EditorContent editor={editor} />
    </div>
  )
}
