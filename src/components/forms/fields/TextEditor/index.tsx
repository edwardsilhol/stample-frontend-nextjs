'use client';

import { Editor, EditorContent } from '@tiptap/react';
import React from 'react';
import EditorMenu from '../../../menus/editorMenu';
import Box from '@mui/material/Box';

interface TextEditorProps {
  editor: Editor | null;
}
function TextEditor({ editor }: TextEditorProps) {
  return (
    <Box key={editor?.toString()}>
      {editor?.isEditable && <EditorMenu editor={editor} />}
      <EditorContent editor={editor} />
    </Box>
  );
}

export default TextEditor;
