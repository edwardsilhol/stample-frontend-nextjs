import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListItemText from '@mui/material/ListItemText';

export interface Mention {
  id: string;
  label: string;
  avatar?: string;
}

interface MentionListProps {
  items: Mention[];
  command: (args: { id: string; label: string }) => void;
}

const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item.id, label: item.label });
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length,
        );
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <List>
      {props.items.length ? (
        props.items.map(({ id, label, avatar }, index) => (
          <ListItemButton
            style={{
              backgroundColor: index === selectedIndex ? '#e5e7eb' : 'white',
            }}
            key={id}
            onClick={() => selectItem(index)}
          >
            <ListItemIcon>
              {avatar ? (
                <Avatar
                  alt={label}
                  src={avatar}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              ) : (
                <AccountCircleIcon
                  style={{
                    fontSize: 20,
                  }}
                />
              )}
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </ListItemButton>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </List>
  );
});

MentionList.displayName = 'MentionList';

export default MentionList;
