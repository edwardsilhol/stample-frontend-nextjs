import { Editor } from '@tiptap/react';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import { ButtonGroup } from '@mui/material';

const EDITOR_BUTTONS: Omit<EditorMenuButtonProps, 'editor'>[] = [
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

interface EditorMenuProps {
  editor: Editor;
}

interface EditorMenuButtonProps {
  id: string;
  editor: Editor;
  onClick: (editor: Editor) => void;
  checkIfActive: (editor: Editor) => boolean;
  label: string;
  icon?: ReactNode;
}

function EditorMenu({ editor }: EditorMenuProps) {
  function renderEditorMenuButton({
    id,
    editor,
    onClick,
    checkIfActive,
    label,
    icon,
  }: EditorMenuButtonProps) {
    return (
      <Button
        key={id}
        onClick={() => onClick(editor)}
        style={{
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.23)',
          color: checkIfActive(editor) ? 'black' : 'rgba(0, 0, 0, 0.23)',
          fontSize: 20,
          backgroundColor: 'white',
        }}
      >
        {icon || label}
      </Button>
    );
  }
  return (
    <ButtonGroup
      style={{
        backgroundColor: 'transparent',
      }}
    >
      {EDITOR_BUTTONS.map((button) =>
        renderEditorMenuButton({ ...button, editor }),
      )}
    </ButtonGroup>
  );
}
export default EditorMenu;
