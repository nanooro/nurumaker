'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import YouTube from '@tiptap/extension-youtube'
import { Toolbar } from './Toolbar'

export const TiptapEditor = ({ onChange, content }: any) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true, // Allows pasting images directly
      }),
      YouTube.configure({
        nocookie: true,
        modestbranding: true,
        controls: false,
        allowFullscreen: false,
        HTMLAttributes: {
          class: 'iframe-wrapper',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  return (
    <div onClick={() => editor?.commands.focus()}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
