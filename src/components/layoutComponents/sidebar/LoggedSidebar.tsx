import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import Button from '@mui/material/Button';
import {
  AccountCircleOutlined,
  Add,
  KeyboardArrowDownOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { createUseStyles } from 'react-jss';
import Typography from '../../muiOverrides/Typography';
import { useLogout } from '../../../stores/hooks/user.hooks';
import { User } from '../../../stores/types/user.types';
import { useRichTags } from '../../../stores/hooks/tag.hooks';
import { TagsView } from './TagsView';

const drawerWidth = '300px';

const useStyles = createUseStyles({
  navContainer: {
    minHeight: '100vh',
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

interface SidebarProps {
  user: User | null | undefined;
  isLoading: boolean;
  setSelectedTag: (tag: string) => void;
}
export const LoggedSidebar: React.FC<SidebarProps> = ({
  user,
  isLoading,
  setSelectedTag,
}) => {
  const classes = useStyles();
  const { data: tags } = useRichTags();
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
        <TagsView tags={tags || []} setSelectedTag={setSelectedTag} />
      )}
    </Stack>
  );
};
