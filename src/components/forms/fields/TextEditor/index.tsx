'use client';

import { Editor, EditorContent } from '@tiptap/react';
import React from 'react';
import EditorMenu from '../../../menus/editorMenu';
import Stack from '@mui/material/Stack';

interface TextEditorProps {
  editor: Editor | null;
}
function TextEditor({ editor }: TextEditorProps) {
  return (
    <Stack key={editor?.toString()} direction="column" spacing={0.5}>
      {editor?.isEditable && <EditorMenu editor={editor} />}
      <EditorContent editor={editor} />
    </Stack>
  );
}

export default TextEditor;
