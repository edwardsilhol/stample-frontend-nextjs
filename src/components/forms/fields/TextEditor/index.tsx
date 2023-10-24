'use client';

import { Editor, EditorContent } from '@tiptap/react';
import React from 'react';
import EditorBubbleMenu from '../../../menus/editorBubbleMenu';
import Box from '@mui/material/Box';

interface TextEditorProps {
  editor: Editor | null;
}
function TextEditor({ editor }: TextEditorProps) {
  return (
    <Box key={editor?.toString()}>
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </Box>
  );
}

export default TextEditor;
