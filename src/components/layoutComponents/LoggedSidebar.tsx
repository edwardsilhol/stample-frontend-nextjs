import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import Stack from '../muiOverrides/Stack';
import Button from '@mui/material/Button';
import {
  AccountCircleOutlined,
  Add,
  ArrowDropDown,
  ArrowRight,
  KeyboardArrowDownOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { createUseStyles } from 'react-jss';
import Typography from '../muiOverrides/Typography';
import { useLogout } from '../../stores/hooks/user.hooks';
import { TreeView, TreeItem } from '@mui/lab';
import { Tag } from '../../stores/types/tag.types';
import { User } from '../../stores/types/user.types';

const drawerWidth = '300px';

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
    '&:hover $tagAddButton': {
      display: 'inline-flex',
    },
    '&:hover $showButton': {
      display: 'inline-flex',
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: 'black',
    opacity: 0.6,
    fontSize: '13px',
    fontWeight: 600,
  },
  tagsContainer: {
    '&:hover $tagAddButton': {
      display: 'inline-flex',
    },
  },
  tagAddButton: {
    display: 'none',
    borderRadius: '4px',
    width: '20px',
    height: '18px',
    padding: 0,
  },
  showButton: {
    display: 'none',
    color: 'black',
    opacity: 0.7,
    width: 'fit-content',
    minWidth: 0,
    border: '1px solid rgba(0, 0, 0, 0.3)',
    borderRadius: '3px',
    padding: '0 6px',
    margin: 0,
    textTransform: 'none',
    '&:hover': {
      border: '1px solid rgba(0, 0, 0, 0.7)',
    },
  },
});

const tags: Tag[] = [
  {
    _id: '1',
    name: 'tag 1',
    children: [
      {
        _id: '3',
        name: 'tag 3',
        children: [],
      },
      {
        _id: '4',
        name: 'tag 4',
        children: [
          {
            _id: '7',
            name: 'tag 7',
            children: [],
          },
        ],
      },
    ],
  },
  {
    _id: '2',
    name: 'tag 2',
    children: [
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
    ],
  },
];

interface SidebarProps {
  user: User | null | undefined;
  isLoading: boolean;
}
export const LoggedSidebar: React.FC<SidebarProps> = ({ user, isLoading }) => {
  const classes = useStyles();
  const logout = useLogout();
  const [showTags, setShowTags] = React.useState(false);
  const [anchorAccountMenu, setAnchorAccountMenu] =
    React.useState<null | HTMLElement>(null);
  const openAccountMenu = Boolean(anchorAccountMenu);

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

  const renderTags = ({ _id, name, children }: Tag) => {
    return (
      <TreeItem
        key={_id}
        nodeId={_id}
        label={
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            className={classes.tagsContainer}
          >
            <Typography className={classes.tagsLabel}>{`#${name}`}</Typography>
            <IconButton
              className={classes.tagAddButton}
              onClick={(event) => {
                event.stopPropagation();
                console.log('add tag');
              }}
            >
              <Add sx={{ height: '12px' }} />
            </IconButton>
          </Stack>
        }
      >
        {children.length > 0 && children.map((child: Tag) => renderTags(child))}
      </TreeItem>
    );
  };

  return (
    <Stack className={classes.navContainer}>
      {!isLoading && user && (
        <Button
          disableRipple
          onClick={handleAccountMenuClick}
          className={classes.accountButton}
        >
          <AccountCircleOutlined sx={{ height: '18px' }} />
          <Typography
            fontSize={12}
            fontWeight={600}
          >{`${user?.firstName} ${user?.lastName}`}</Typography>
          <KeyboardArrowDownOutlined sx={{ height: '18px' }} />
        </Button>
      )}
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
        {showTags ? (
          <IconButton
            className={classes.tagAddButton}
            onClick={(event) => {
              event.stopPropagation();
              console.log('add tag');
            }}
          >
            <Add sx={{ height: '12px' }} />
          </IconButton>
        ) : (
          <Button className={classes.showButton}>
            <Typography fontSize={10} lineHeight={1.4}>
              Show
            </Typography>
          </Button>
        )}
      </Button>
      {showTags && (
        <TreeView
          defaultCollapseIcon={
            <ArrowDropDown sx={{ height: '16px', color: '#4d4d4d' }} />
          }
          defaultExpandIcon={
            <ArrowRight sx={{ height: '16px', color: '#4d4d4d' }} />
          }
        >
          {tags.map((tag) => renderTags(tag))}
        </TreeView>
      )}
    </Stack>
  );
};
