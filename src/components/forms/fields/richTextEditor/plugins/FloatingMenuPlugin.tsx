'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useUserInteractions from '../../../../../utils/hooks/useUserInteractions';
import {
  $getSelection,
  $isRangeSelection,
  EditorState,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  RangeSelection,
  TextFormatType,
} from 'lexical';
import FloatingEditorMenu from '../../../../menus/floatingEditorMenu';
import { FloatingEditorMenuButtonProps } from '../../../../buttons/floatingEditorMenuButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';

interface PartialFloatingEditorMenuButtonProps
  extends Omit<
    FloatingEditorMenuButtonProps,
    'onClick' | 'isActive' | 'subButtons'
  > {
  onClick?: (editor?: LexicalEditor) => void;
  subButtons?: PartialFloatingEditorMenuButtonProps[];
  checkIfActive?: (selection: RangeSelection) => boolean;
}

const ANCHOR_ELEMENT = document.body;

const EDITOR_BUTTONS: PartialFloatingEditorMenuButtonProps[] = [
  {
    id: 'bold',
    icon: <FormatBoldIcon />,
    label: 'Format text as bold',
  },
  {
    id: 'italic',
    icon: <FormatItalicIcon />,
    label: 'Format text as italic',
  },
  {
    id: 'underline',
    icon: <FormatUnderlinedIcon />,
    label: 'Format text to underlined',
  },
  {
    id: 'strikethrough',
    icon: <StrikethroughSIcon />,
    label: 'Format text with a strikethrough',
  },
];

function $isRangeSelected(
  selection: EditorState['_selection'],
): selection is RangeSelection {
  return $isRangeSelection(selection) && !selection.anchor.is(selection.focus);
}

function formatButtonProps(
  editor: LexicalEditor,
  button: PartialFloatingEditorMenuButtonProps,
): FloatingEditorMenuButtonProps {
  return {
    ...button,
    onClick: button.onClick
      ? () => button.onClick && button.onClick(editor)
      : () => {
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            button.id as TextFormatType,
          );
        },
    isActive: false,
    subButtons: button.subButtons
      ? button.subButtons.map((subButton) =>
          formatButtonProps(editor, subButton),
        )
      : undefined,
  };
}
function checkIfButtonIsActive(selection: RangeSelection, buttonId: string) {
  const button = EDITOR_BUTTONS.find((button) => button.id === buttonId);
  if (!button) return false;
  if (button.checkIfActive) return button.checkIfActive(selection);
  return selection.hasFormat(button.id as TextFormatType);
}

export function FloatingMenuPlugin() {
  const [editor] = useLexicalComposerContext();
  const [show, setShow] = useState(false);
  const [editorButtons, setEditorButtons] = useState(
    EDITOR_BUTTONS.map((button) => formatButtonProps(editor, button)),
  );

  const { isPointerDown, isKeyDown } = useUserInteractions();

  const updateFloatingMenu = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing() || isPointerDown || isKeyDown) return;

      if (editor.getRootElement() !== document.activeElement) {
        setShow(false);
        return;
      }

      const selection = $getSelection();

      if ($isRangeSelected(selection)) {
        setEditorButtons(
          editorButtons.map((button) => ({
            ...button,
            isActive: checkIfButtonIsActive(selection, button.id),
            subButtons: button.subButtons
              ? button.subButtons.map((subButton) => ({
                  ...subButton,
                  isActive: checkIfButtonIsActive(selection, subButton.id),
                }))
              : undefined,
          })),
        );
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [editor, isPointerDown, isKeyDown]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateFloatingMenu();
    });
  }, [editor, updateFloatingMenu]);

  useEffect(() => {
    updateFloatingMenu();
  }, [isPointerDown, isKeyDown, updateFloatingMenu]);

  return createPortal(
    <FloatingEditorMenu show={show} buttons={editorButtons} />,
    ANCHOR_ELEMENT,
  );
}
