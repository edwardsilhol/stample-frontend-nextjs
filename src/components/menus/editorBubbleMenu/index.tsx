import { BubbleMenu, Editor } from '@tiptap/react';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import { ButtonGroup } from '@mui/material';

const EDITOR_BUTTONS: Omit<BubbleMenuButtonProps, 'editor'>[] = [
  {
    id: 'bold',
    icon: <FormatBoldIcon />,
    label: 'Format text as bold',
    onClick: (editor) => editor.chain().focus().toggleBold().run(),
    checkIfActive: (editor) => editor.isActive('bold'),
  },
  {
    id: 'italic',
    icon: <FormatItalicIcon />,
    label: 'Format text as italic',
    onClick: (editor) => editor.chain().focus().toggleItalic().run(),
    checkIfActive: (editor) => editor.isActive('italic'),
  },
  {
    id: 'underline',
    icon: <FormatUnderlinedIcon />,
    label: 'Format text to underlined',
    onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
    checkIfActive: (editor) => editor.isActive('underline'),
  },
  {
    id: 'strike',
    icon: <StrikethroughSIcon />,
    label: 'Format text with a strikethrough',
    onClick: (editor) => editor.chain().focus().toggleStrike().run(),
    checkIfActive: (editor) => editor.isActive('strike'),
  },
];

interface FloatingEditorMenuProps {
  editor: Editor;
}

interface BubbleMenuButtonProps {
  id: string;
  editor: Editor;
  onClick: (editor: Editor) => void;
  checkIfActive: (editor: Editor) => boolean;
  label: string;
  icon?: ReactNode;
}

function EditorBubbleMenu({ editor }: FloatingEditorMenuProps) {
  function renderBubbleMenuButton({
    id,
    editor,
    onClick,
    checkIfActive,
    label,
    icon,
  }: BubbleMenuButtonProps) {
    return (
      <Button
        key={id}
        onClick={() => onClick(editor)}
        style={{
          color: checkIfActive(editor) ? 'black' : 'blue',
        }}
      >
        {icon || label}
      </Button>
    );
  }
  return (
    <BubbleMenu tippyOptions={{ duration: 100 }} editor={editor}>
      <ButtonGroup
        style={{
          backgroundColor: 'white',
        }}
      >
        {EDITOR_BUTTONS.map((button) =>
          renderBubbleMenuButton({ ...button, editor }),
        )}
      </ButtonGroup>
    </BubbleMenu>
  );
}
export default EditorBubbleMenu;
