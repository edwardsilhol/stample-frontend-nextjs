import Button from '@mui/material/Button';
import { ReactNode, useState, MouseEvent } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';

export interface FloatingEditorMenuButtonProps {
  id: string;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  subButtons?: FloatingEditorMenuButtonProps[];
}
function FloatingEditorMenuButton({
  id,
  onClick,
  icon,
  label,
  isActive,
  subButtons,
}: FloatingEditorMenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!subButtons) {
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
  return (
    <Button
      onClick={handleClick}
      aria-label={label}
      key={id}
      style={{
        backgroundColor: open ? '#F1F5F9' : '#F9FAFB',
        color: open ? 'blue' : '#6B7280',
      }}
      endIcon={<KeyboardArrowDownIcon />}
    >
      {subButtons?.filter((button) => button.isActive)[0]?.label ?? label}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {subButtons.map((child) => (
          <MenuItem
            key={child.id}
            onClick={() => {
              child.onClick();
              handleClose();
            }}
            disableRipple
          >
            <ListItemIcon>{child.icon}</ListItemIcon>
            <ListItemText>{child.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Button>
  );
}
export default FloatingEditorMenuButton;
