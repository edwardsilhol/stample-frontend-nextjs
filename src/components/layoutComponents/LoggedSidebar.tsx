import React from 'react';
import { Drawer, Menu, MenuItem } from '@mui/material';
import Stack from '../muiOverrides/Stack';
import Box from '../muiOverrides/Box';
import Button from '@mui/material/Button';
import {
  AccountCircleOutlined,
  ChevronRight,
  ExpandMore,
  KeyboardArrowDownOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { createUseStyles } from 'react-jss';
import Typography from '../muiOverrides/Typography';
import { useLogout } from '../../stores/hooks/user.hooks';
import { TreeView, TreeItem } from '@mui/lab';
import { Tag } from '../../stores/types/tag.types';

const drawerWidth = '230px';

const useStyles = createUseStyles({
  navContainer: {
    width: drawerWidth,
    backgroundColor: '#f6f5f4',
    borderRight: '1px solid #d3d4d5',
  },
  tagsButton: {
    marginTop: '50px',
    color: '#808080',
    width: '100%',
    height: '22px',
    padding: '0 10px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    display: 'flex',
    justifyContent: 'space-between',
    textTransform: 'none',
  },
  accountButton: {
    color: '#4d4d4d',
    width: '150px',
    height: '22px',
    padding: 0,
    margin: '10px 0 0 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textTransform: 'none',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#e6e5e4',
    },
  },
  menuPaper: {
    '& .MuiPaper-root': {
      marginLeft: '-6px',
      width: '170px',
      border: '1px solid #d3d4d5',
      borderRadius: '4px',
      '& .MuiMenu-list': {
        padding: 0,
      },
      '& .MuiMenuItem-root': {
        padding: '0 8px',
        color: '#4d4d4d',
        height: '22px',
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
  },
  tagsLabel: {
    '& .MuiTreeItem-label': {
      color: '#4d4d4d',
      fontSize: '13px',
      fontWeight: 500,
    },
  },
});

const tags: Tag[] = [
  {
    _id: '1',
    name: 'tag 1',
    children: ['3', '4'],
  },
  {
    _id: '2',
    name: 'tag 2',
    children: ['5', '6'],
  },
  {
    _id: '3',
    name: 'tag 3',
    children: [],
  },
  {
    _id: '4',
    name: 'tag 4',
    children: ['7'],
  },
  {
    _id: '5',
    name: 'tag 5',
    children: [],
  },
  {
    _id: '6',
    name: 'tag 6',
    children: [],
  },
  {
    _id: '7',
    name: 'tag 7',
    children: [],
  },
];

interface SidebarProps {
  firstName: string;
  lastName: string;
}
export const LoggedSidebar: React.FC<SidebarProps> = ({
  firstName,
  lastName,
}) => {
  const classes = useStyles();
  const logout = useLogout();
  const [showTags, setShowTags] = React.useState(false);
  const [anchorAccountMenu, setAnchorAccountMenu] =
    React.useState<null | HTMLElement>(null);
  const openAccountMenu = Boolean(anchorAccountMenu);
  const seen: string[] = [];

  const handleTagsClick = () => {
    setShowTags(!showTags);
  };

  const handleAccountMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorAccountMenu(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorAccountMenu(null);
  };

  const renderTags = (tag: Tag) => {
    if (seen.includes(tag._id)) {
      return null;
    }
    seen.push(tag._id);
    return (
      <TreeItem
        key={tag._id}
        nodeId={tag._id.toString()}
        label={`#${tag.name}`}
        className={classes.tagsLabel}
      >
        {tag.children.map((child: any) =>
          renderTags(tags.filter((t) => t._id === child)[0]),
        )}
      </TreeItem>
    );
  };

  return (
    <Stack className={classes.navContainer}>
      <Button
        disableRipple
        onClick={handleAccountMenuClick}
        className={classes.accountButton}
      >
        <AccountCircleOutlined sx={{ height: '18px' }} />
        <Typography
          fontSize={12}
          fontWeight={600}
        >{`${firstName} ${lastName}`}</Typography>
        <KeyboardArrowDownOutlined sx={{ height: '18px' }} />
      </Button>
      <Menu
        anchorEl={anchorAccountMenu}
        open={openAccountMenu}
        onClose={handleAccountMenuClose}
        className={classes.menuPaper}
      >
        <MenuItem onClick={() => logout.mutate()}>
          <Typography fontSize={12}>Logout</Typography>
          <LogoutOutlined sx={{ height: '18px' }} />
        </MenuItem>
      </Menu>
      <Button
        disableRipple
        className={classes.tagsButton}
        onClick={handleTagsClick}
      >
        <Typography fontSize={12}>Tags</Typography>
      </Button>
      {showTags && (
        <TreeView
          defaultCollapseIcon={
            <ExpandMore sx={{ height: '16px', color: '#4d4d4d' }} />
          }
          defaultExpandIcon={
            <ChevronRight sx={{ height: '16px', color: '#4d4d4d' }} />
          }
        >
          {tags.map((tag) => renderTags(tag))}
        </TreeView>
      )}
    </Stack>
  );
};
