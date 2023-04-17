import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import Button from '@mui/material/Button';
import {
  AccountCircleOutlined,
  AddCircleOutlineOutlined,
  ArrowDropDown,
  LogoutOutlined,
  MenuOpen,
} from '@mui/icons-material';
import Typography from '../../muiOverrides/Typography';
import { useLogout } from '../../../stores/hooks/user.hooks';
import { User } from '../../../stores/types/user.types';
import { useTagsByTeam } from '../../../stores/hooks/tag.hooks';
import { TagsView } from './TagsView';
import { getDocumentsByTags } from 'helpers/document.helpers';
import { useDocumentsBySelectedTeam } from 'stores/hooks/document.hooks';
import { Document } from 'stores/types/document.types';
import { useIsSidebarOpen } from 'stores/data/layout.data';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useAllTeams } from 'stores/hooks/team.hooks';
import { useSelectedTeamId } from 'stores/data/team.data';
import { CreateTeamDialog } from 'components/team/CreateTeamDialog';
import {
  getDefaultSelectedTeamId,
  getTeamDisplayedName,
} from 'helpers/team.helper';
import { useSelectedOrganisationId } from 'stores/data/organisation.data';
import { useAllOrganisations } from 'stores/hooks/organisation.hooks';
import { capitalize } from 'lodash';
import { CreateOrganisationDialog } from 'components/organisation/CreateOrganisationDialog';

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
  const { data: documents } = useDocumentsBySelectedTeam();
  const { data: teams } = useAllTeams();
  const { data: organisations } = useAllOrganisations();
  const [selectedTeamId, setSelectedTeamId] = useSelectedTeamId();
  const [selectedorganisationId, setSelectedorganisationId] =
    useSelectedOrganisationId();
  const {
    data: { rich: richTags },
  } = useTagsByTeam(selectedTeamId);
  const documentsByTag = useMemo<Record<string, Document[]>>(
    () => getDocumentsByTags(documents || []),
    [documents],
  );
  const logout = useLogout();
  const [anchorAccountMenu, setAnchorAccountMenu] =
    React.useState<null | HTMLElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useIsSidebarOpen();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = React.useState(false);
  const [isCreateOrganisationOpen, setIsCreateOrganisationOpen] =
    React.useState(false);
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
  const handleClickCreateTeam = () => {
    setIsCreateTeamOpen(true);
  };

  const handleClickCreateOrganisation = () => {
    setIsCreateOrganisationOpen(true);
  };

  useEffect(() => {
    const defaultSelectedTeamId = getDefaultSelectedTeamId(teams);
    if (defaultSelectedTeamId && !selectedTeamId) {
      setSelectedTeamId(defaultSelectedTeamId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams]);

  useEffect(() => {
    const defaultSelectedorganisationId = organisations?.[0]?._id;
    if (selectedorganisationId === null && defaultSelectedorganisationId) {
      setSelectedorganisationId(defaultSelectedorganisationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisations]);

  const displaySelectOrganisations = () => (
    <Box paddingX={1} paddingTop={2}>
      <TextField
        value={selectedorganisationId !== null ? selectedorganisationId : ''}
        onChange={(e) => setSelectedorganisationId(e.target.value)}
        label="Selected organisation"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        select
        InputProps={{
          sx: { height: '30px' },
        }}
      >
        {organisations?.map((organisation) => (
          <MenuItem key={organisation._id} value={organisation._id}>
            {capitalize(organisation.name)}
          </MenuItem>
        ))}
        <Button
          onClick={handleClickCreateOrganisation}
          key="add-organisation"
          endIcon={<AddCircleOutlineOutlined />}
          fullWidth
        >
          Create organisation
        </Button>
      </TextField>
    </Box>
  );
  const displaySelectTeams = () => (
    <Box paddingX={1} paddingY={2}>
      <TextField
        value={selectedTeamId !== null ? selectedTeamId : ''}
        onChange={(e) => setSelectedTeamId(e.target.value)}
        label="Selected team"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        select
        InputProps={{
          sx: { height: '30px' },
        }}
      >
        {teams?.map((team) => (
          <MenuItem key={team._id} value={team._id}>
            {getTeamDisplayedName(team)}
          </MenuItem>
        ))}
        <Button
          onClick={handleClickCreateTeam}
          key="add-team"
          endIcon={<AddCircleOutlineOutlined />}
          fullWidth
        >
          Create team
        </Button>
      </TextField>
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
      {organisations && displaySelectOrganisations()}
      {displaySelectTeams()}
      <TagsView tags={richTags} documentsByTags={documentsByTag} />
    </Stack>
  );
  return (
    <>
      {!isMobile ? (
        displayDrawerContent()
      ) : (
        <Drawer
          variant={'temporary'}
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
      )}
      <CreateTeamDialog
        open={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
      />
      <CreateOrganisationDialog
        open={isCreateOrganisationOpen}
        onClose={() => setIsCreateOrganisationOpen(false)}
      />
    </>
  );
};
