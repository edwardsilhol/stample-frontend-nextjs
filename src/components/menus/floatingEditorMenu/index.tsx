import { useEffect, useRef, useState } from 'react';
import { computePosition } from '@floating-ui/dom';
import Box from '@mui/material/Box';
import FloatingEditorMenuButtonsGroup from '../../buttons/floatingEditorMenuButtonsGroup';
import { FloatingEditorMenuButtonProps } from '../../buttons/floatingEditorMenuButton';

type FloatingMenuPosition = { x: number; y: number } | undefined;

export type ActiveButtonsState = {
  [key: string]: boolean;
};
interface FloatingEditorMenuProps {
  show: boolean;
  buttons: FloatingEditorMenuButtonProps[];
}
function FloatingEditorMenu({ show, buttons }: FloatingEditorMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<FloatingMenuPosition>(undefined);

  const nativeSel = window.getSelection();

  useEffect(() => {
    const isCollapsed = nativeSel?.rangeCount === 0 || nativeSel?.isCollapsed;

    if (!show || !ref.current || !nativeSel || isCollapsed) {
      setPos(undefined);
      return;
    }
    const domRange = nativeSel.getRangeAt(0);

    computePosition(domRange, ref.current, { placement: 'top' })
      .then((pos) => {
        setPos({ x: pos.x, y: pos.y - 10 });
      })
      .catch(() => {
        setPos(undefined);
      });
  }, [show, nativeSel, nativeSel?.anchorOffset]);

  return (
    <Box
      ref={ref}
      style={{
        position: 'absolute',
        top: pos?.y,
        left: pos?.x,
        visibility: pos?.x && pos?.y ? 'visible' : 'hidden',
      }}
      aria-hidden={!pos?.x || !pos?.y}
    >
      <FloatingEditorMenuButtonsGroup buttons={buttons} />
    </Box>
  );
}
export default FloatingEditorMenu;
