import { Meta } from '@storybook/react';
import RichTextEditor from './index';
import { EditorState, LexicalEditor } from 'lexical';

export default {
  title: 'Components/Forms/Fields/RichTextEditor',
  component: RichTextEditor,
  args: {
    onChange: (
      editorState: EditorState,
      editor: LexicalEditor,
      tags: Set<string>,
    ) => {
      console.log('editor', editorState, editor, tags);
    },
  },
} as Meta;

export const Default = {};

export const filled = {
  args: {
    editorState:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"text prefilled","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
  },
};
