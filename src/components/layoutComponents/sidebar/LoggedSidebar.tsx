import React from 'react';
import { Box, Drawer, IconButton, Menu, MenuItem } from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import Button from '@mui/material/Button';
import {
  AccountCircleOutlined,
  ArrowDropDown,
  LogoutOutlined,
  MenuOpen,
} from '@mui/icons-material';
import Typography from '../../muiOverrides/Typography';
import { useLogout } from '../../../stores/hooks/user.hooks';
import { User } from '../../../stores/types/user.types';
import {
  useDocumentsCountPerTag,
  useTagsByTeam,
} from '../../../stores/hooks/tag.hooks';
import { TagsView } from './TagsView';
import { useIsSidebarOpen } from 'stores/data/layout.data';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useSelectedTeamId } from 'stores/data/team.data';
import { SelectTeamsAndOrganisationsDialog } from './SelectTeamsAndOrganisationsDialog';

const useStyles = () => ({
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
    width: 'fit-content',
    height: '22px',
    padding: 0,
    margin: '10px 0 0 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
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
      boxShadow: '0 10px 30px rgb(0,0,0,0.13)',
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
}
export const LoggedSidebar: React.FC<SidebarProps> = ({ user, isLoading }) => {
  const styles = useStyles();
  const isMobile = useIsMobile();
  const { data: documentsCountPerTags } = useDocumentsCountPerTag();
  const [selectedTeamId] = useSelectedTeamId();
  const {
    data: { rich: richTags },
  } = useTagsByTeam(selectedTeamId);
  const logout = useLogout();
  const [anchorAccountMenu, setAnchorAccountMenu] =
    React.useState<null | HTMLElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useIsSidebarOpen();
  const [
    isSelectTeamsAndOrganisationsOpen,
    setIsSelectTeamsAndOrganisationsOpen,
  ] = React.useState(false);
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openAccountMenu = Boolean(anchorAccountMenu);

  const handleAccountMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorAccountMenu(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorAccountMenu(null);
  };
  const displaySelectTeams = () => (
    <Box paddingX={1} paddingY={2}>
      <SelectTeamsAndOrganisationsDialog
        open={isSelectTeamsAndOrganisationsOpen}
        onClose={() => setIsSelectTeamsAndOrganisationsOpen(false)}
      />
    </Box>
  );

  const getAccountMenu = () => {
    return !isLoading && user ? (
      <>
        <Button
          disableRipple
          onClick={handleAccountMenuClick}
          sx={styles.accountButton}
        >
          <AccountCircleOutlined
            sx={{ width: '20px', height: '22px', paddingBottom: '2px' }}
          />
          <Typography
            variant="body2"
            fontWeight={600}
          >{`${user?.firstName} ${user?.lastName}`}</Typography>
          <ArrowDropDown sx={{ width: '12px', height: '12px' }} />
        </Button>
        <Menu
          anchorEl={anchorAccountMenu}
          open={openAccountMenu}
          onClose={handleAccountMenuClose}
          sx={styles.menuPaper}
        >
          <MenuItem onClick={() => logout.mutate()}>
            <Typography fontSize={12}>Logout</Typography>
            <LogoutOutlined sx={{ height: '18px' }} />
          </MenuItem>
        </Menu>
      </>
    ) : null;
  };

  const displayDrawerContent = () => (
    <Stack
      sx={{
        minHeight: '100vh',
        minWidth: '200px',
        width: '300px',
        maxWidth: '25%',
        backgroundColor: '#f6f5f4',
        borderRight: '1px solid #d3d4d5',
      }}
    >
      {isMobile ? (
        <IconButton
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          sx={{ alignSelf: 'end' }}
        >
          <MenuOpen />
        </IconButton>
      ) : null}
      {getAccountMenu()}
      {displaySelectTeams()}
      <TagsView tags={richTags} documentsCountPerTags={documentsCountPerTags} />
    </Stack>
  );
  return (
    <>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isSidebarOpen}
        onClose={handleSidebarToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'none',
            border: 'none',
            minWidth: '200px',
            width: '300px',
            maxWidth: '25%',
          },
        }}
      >
        {displayDrawerContent()}
      </Drawer>

      {/* <SelectTeamsAndOrganisationsDialog
        open={isSelectTeamsAndOrganisationsOpen}
        onClose={() => setIsSelectTeamsAndOrganisationsOpen(false)}
      /> */}
    </>
  );
};
