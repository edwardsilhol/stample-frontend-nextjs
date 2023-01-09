import React from 'react';
import Drawer from '../../muiOverrides/Drawer';
import List from '../../muiOverrides/List';
import ListItem from '../../muiOverrides/ListItem';
import ListItemText from '../../muiOverrides/ListItemText';
import PersonIcon from '../../muiOverrides/PersonIcon';
import AddIcon from '../../muiOverrides/AddIcon';
import IconButton from '../../muiOverrides/IconButton';
import ListItemAvatar from '../../muiOverrides/ListItemAvatar';
import Avatar from '../../muiOverrides/Avatar';
import ListItemButton from '../../muiOverrides/ListItemButton';
import KeyboardArrowDownIcon from '../../muiOverrides/KeyboardArrowDownIcon';
import MoreHorizIcon from '../../muiOverrides/MoreHorizIcon';

export const WorkspaceSidebar: React.FC = () => {
  return (
    <>
      <Drawer variant="persistent" open>
        <List>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="add-tag">
                <AddIcon />
              </IconButton>
            }
            dense={true}
            divider={true}
            sx={{ justifyContent: 'space-between' }}
          >
            <ListItemButton
              dense={true}
              sx={{
                padding: 0,
                display: 'flex',
                alignItems: 'left',
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Profil" />
            </ListItemButton>
          </ListItem>
          <ListItem
            button
            divider={true}
            sx={{ justifyContent: 'space-between' }}
            secondaryAction={
              <IconButton edge="end" aria-label="options">
                <MoreHorizIcon />
              </IconButton>
            }
          >
            <ListItemButton
              sx={{
                padding: 0,
                display: 'flex',
                alignItems: 'left',
                justifyContent: 'left',
              }}
            >
              <ListItemText primary="Tags" />
              <KeyboardArrowDownIcon />
            </ListItemButton>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Filters" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default WorkspaceSidebar;
