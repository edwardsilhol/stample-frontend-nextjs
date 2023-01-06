import React, { ReactNode } from 'react';
import Drawer from '../../muiOverrides/Drawer';
import List from '../../muiOverrides/List';
import ListItem from '../../muiOverrides/ListItem';
import ListItemIcon from '../../muiOverrides/ListItemIcon';
import ListItemText from '../../muiOverrides/ListItemText';
import PersonIcon from '../../muiOverrides/PersonIcon';
import AddIcon from '../../muiOverrides/AddIcon';

export interface SidebarProps {
  children: ReactNode;
  open: boolean;
}

export const WorkspaceSidebar: React.FC<SidebarProps> = (props) => {
  const { open, children } = props;

  return (
    <>
      <Drawer variant="persistent" open={open}>
        <List>
          <ListItem button>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Collection" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Filters" />
          </ListItem>
        </List>
      </Drawer>
      {children}
    </>
  );
};

export default WorkspaceSidebar;
