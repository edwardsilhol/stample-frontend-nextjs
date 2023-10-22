'use client';

import {
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import RichTextPlugin from './plugins/RichTextPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
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
import MentionsPlugin, { Mention } from './plugins/MentionsPlugin';
import { MentionNode } from './utils/mentions';

export const INITIAL_EDITOR_STATE =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'white',
    paddingLeft: '14px',
    paddingTop: '0.5px',
    paddingBottom: '0.5px',
    overflow: 'auto',
  },
  editableRoot: {
    height: '136px',
    border: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '8px',
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
  name: string;
  placeholder?: string;
  editorState?: InitialEditorStateType;
  onChange?: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
  ) => void;
  mentions?: Mention[];
  editable?: boolean;
}
function RichTextEditor({
  name,
  editorState,
  onChange,
  mentions,
  editable = true,
  placeholder,
}: RichTextEditorProps) {
  const classes = useStyles();
  function onError(error: Error) {
    console.error(error);
  }
  const initialConfig = {
    namespace: `editor-${name}`,
    editorState: editorState || INITIAL_EDITOR_STATE,
    editable,
    theme: {
      root: `${classes.root} ${editable && classes.editableRoot}`,
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
      MentionNode,
    ],
  };
  return (
    <LexicalComposer
      initialConfig={initialConfig}
      key={editorState?.toString()}
    >
      <Box
        style={{
          backgroundColor: 'transparent',
          position: 'relative',
        }}
      >
        <RichTextPlugin editable={editable} placeholder={placeholder} />
        <FloatingMenuPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        {onChange && <OnChangePlugin onChange={onChange} />}
        {mentions && <MentionsPlugin mentions={mentions} />}
      </Box>
    </LexicalComposer>
  );
}

export default RichTextEditor;
