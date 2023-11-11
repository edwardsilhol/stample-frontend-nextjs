'use client';

import { Editor, EditorContent } from '@tiptap/react';
import React from 'react';
import EditorMenu from '../../../menus/editorMenu';
import Stack from '@mui/material/Stack';

interface TextEditorProps {
  editor: Editor | null;
  showMenu?: boolean;
}
function TextEditor({ editor, showMenu = true }: TextEditorProps) {
  return (
    <Stack key={editor?.toString()} direction="column" spacing={0.5}>
      {editor?.isEditable && showMenu && <EditorMenu editor={editor} />}
      <EditorContent editor={editor} />
    </Stack>
  );
}

export default TextEditor;
