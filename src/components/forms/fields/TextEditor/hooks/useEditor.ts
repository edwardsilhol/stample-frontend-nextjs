import { EditorOptions, useEditor as TipTapUseEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Mention as TipTapMention } from '@tiptap/extension-mention';
import { styleObjectToString } from '../../../../../utils/style';
import getMentionSuggestionsConfig from '../utils/mentions';
import { Placeholder } from '@tiptap/extension-placeholder';
import { makeStyles } from '@mui/styles';
import { CSSProperties, DependencyList } from 'react';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Mention } from '../../../../lists/mentionList';

const useStyle = makeStyles({
  isEditorEmpty: {
    '&:first-child::before': {
      color: '#adb5bd',
      content: 'attr(data-placeholder)',
      float: 'left',
      height: 0,
      pointerEvents: 'none',
    },
  },
});
interface UseEditorProps extends Partial<EditorOptions> {
  placeholder?: string;
  editorStyle?: CSSProperties;
  possibleMentions?: Mention[];
}

function useEditor(
  {
    placeholder,
    editorStyle,
    possibleMentions,
    editable = true,
    ...options
  }: UseEditorProps,
  deps?: DependencyList,
) {
  const classes = useStyle();
  return TipTapUseEditor(
    {
      editorProps: {
        attributes: {
          style: styleObjectToString({
            ...(editable && {
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.23)',
              borderRadius: '8px',
              padding: '0 10px',
            }),
            ...editorStyle,
          }),
        },
      },
      extensions: [
        StarterKit,
        Placeholder.configure({
          emptyEditorClass: classes.isEditorEmpty,
          placeholder,
        }),
        Underline.configure({}),
        Link.configure({
          protocols: ['ftp', 'mailto'],
        }),
        TipTapMention.configure({
          HTMLAttributes: {
            style: styleObjectToString({
              boxDecorationBreak: 'clone',
              backgroundColor: '#B7CEEB',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.25rem',
            }),
          },
          suggestion: getMentionSuggestionsConfig(possibleMentions || []),
        }),
      ],
      editable,
      ...options,
    },
    deps,
  );
}

export { useEditor };
