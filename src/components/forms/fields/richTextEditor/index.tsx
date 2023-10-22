'use client';

import {
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import RichTextPlugin from './plugins/richTextPlugin';
import AutoLinkPlugin from './plugins/autoLinkPlugin';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import { FloatingMenuPlugin } from './plugins/FloatingMenuPlugin';
import { makeStyles } from '@mui/styles';
import { EditorState, LexicalEditor } from 'lexical';
import Box from '@mui/material/Box';

const useStyles = makeStyles(() => ({
  root: {
    height: '136px',
    backgroundColor: 'white',
    border: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '8px',
    paddingLeft: '14px',
    paddingTop: '0.5px',
    paddingBottom: '0.5px',
    overflow: 'auto',
  },
  link: {
    cursor: 'pointer',
  },
  bold: {
    fontWeight: '600',
  },
  underline: {
    textDecoration: 'underline',
  },
  italic: {
    fontStyle: 'italic',
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
  underlineStrikethrough: {
    textDecoration: 'underline line-through',
  },
}));

export interface RichTextEditorProps {
  editorState?: InitialEditorStateType;
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
  ) => void;
}
function RichTextEditor({ editorState, onChange }: RichTextEditorProps) {
  const classes = useStyles();
  function onError(error: Error) {
    console.error(error);
  }
  const initialConfig = {
    namespace: 'DocumentEditor',
    editorState,
    theme: {
      root: classes.root,
      link: classes.link,
      text: {
        bold: classes.bold,
        underline: classes.underline,
        italic: classes.italic,
        strikethrough: classes.strikethrough,
        underlineStrikethrough: classes.underlineStrikethrough,
      },
    },
    onError,
    nodes: [
      AutoLinkNode,
      LinkNode,
      ListNode,
      ListItemNode,
      AutoLinkNode,
      LinkNode,
      ListNode,
      ListItemNode,
    ],
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Box
        style={{
          background: '#fff',
          position: 'relative',
        }}
      >
        <RichTextPlugin />
        <FloatingMenuPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <OnChangePlugin onChange={onChange} />
      </Box>
    </LexicalComposer>
  );
}

export default RichTextEditor;
