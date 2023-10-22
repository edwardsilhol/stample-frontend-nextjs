import ButtonGroup from '@mui/material/ButtonGroup';
import FloatingEditorMenuButton, {
  FloatingEditorMenuButtonProps,
} from '../floatingEditorMenuButton';

interface FloatingEditorMenuProps {
  buttons: FloatingEditorMenuButtonProps[];
}
function FloatingEditorMenuButtonsGroup({ buttons }: FloatingEditorMenuProps) {
  return (
    <>
      <ButtonGroup>
        {buttons.map((button) => (
          <FloatingEditorMenuButton key={button.id} {...button} />
        ))}
      </ButtonGroup>
    </>
  );
}
export default FloatingEditorMenuButtonsGroup;
