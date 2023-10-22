import Button from '@mui/material/Button';
import { ReactNode } from 'react';

export interface FloatingEditorMenuButtonProps {
  id: string;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}
function FloatingEditorMenuButton({
  id,
  onClick,
  icon,
  label,
  isActive,
}: FloatingEditorMenuButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label={label}
      key={id}
      style={{
        backgroundColor: isActive ? '#F1F5F9' : '#F9FAFB',
        color: isActive ? 'blue' : '#6B7280',
      }}
    >
      {icon}
    </Button>
  );
}
export default FloatingEditorMenuButton;
