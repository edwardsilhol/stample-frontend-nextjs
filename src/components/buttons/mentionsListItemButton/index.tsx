import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import { MentionTypeaheadOption } from '../../forms/fields/richTextEditor/utils/mentions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
interface MentionsListItemButtonProps {
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}

function MentionsListItemButton({
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: MentionsListItemButtonProps) {
  return (
    <ListItemButton
      key={option.key}
      tabIndex={-1}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={{
        height: '30px',
      }}
    >
      <ListItemIcon>
        {option.picture ? (
          <Avatar
            alt={option.name}
            src={option.picture}
            sx={{ width: 20, height: 20 }}
          />
        ) : (
          <AccountCircleIcon sx={{ fontSize: 20 }} />
        )}
      </ListItemIcon>
      <ListItemText
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {option.name}
      </ListItemText>
    </ListItemButton>
  );
}

export default MentionsListItemButton;
