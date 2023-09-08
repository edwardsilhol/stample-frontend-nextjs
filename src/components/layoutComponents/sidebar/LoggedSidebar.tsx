import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
} from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import { Logout, MenuOpen } from '@mui/icons-material';
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
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentlyViewedDocumentId } from 'stores/data/document.data';

interface SidebarProps {
  user: User | null | undefined;
  isLoading: boolean;
}
export const LoggedSidebar: React.FC<SidebarProps> = ({ user, isLoading }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const { data: documentsCountPerTags } = useDocumentsCountPerTag();
  const [selectedTeamId] = useSelectedTeamId();
  const [currentlyViewedDocumentId, setCurrentlyViewedDocumentId] =
    useCurrentlyViewedDocumentId();
  const {
    data: { rich: richTags },
  } = useTagsByTeam(selectedTeamId);
  const logout = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useIsSidebarOpen();
  const [
    isSelectTeamsAndOrganisationsOpen,
    setIsSelectTeamsAndOrganisationsOpen,
  ] = React.useState(false);
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onGoBackHome = () => {
    if (pathname !== '/me') {
      router.push('/me');
    } else if (!!currentlyViewedDocumentId) {
      setCurrentlyViewedDocumentId(null);
    }
  };

  const displaySelectTeams = () => (
    <Box paddingY={1}>
      <SelectTeamsAndOrganisationsDialog
        open={isSelectTeamsAndOrganisationsOpen}
        onClose={() => {
          setIsSelectTeamsAndOrganisationsOpen(false);
          if (isMobile) {
            setIsSidebarOpen(false);
          }
          onGoBackHome();
        }}
      />
    </Box>
  );

  const getAccountMenu = () => {
    return !isLoading && user ? (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar sx={{ width: 44, height: 44 }} src={user?.profilePictureUrl} />
        <Stack direction="column">
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{
              cursor: 'default',
            }}
          >
            Stample
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              cursor: 'default',
            }}
          >{`${user?.firstName} ${user?.lastName}`}</Typography>
        </Stack>
      </Stack>
    ) : null;
  };

  const displayDrawerContent = () => (
    <Stack
      sx={{
        minHeight: '100vh',
        width: '100%',
        borderTopRightRadius: '12px',
        borderBottomRightRadius: '12px',
        boxShadow: '4px 4px 34px rgba(0, 0, 0, 0.05)',
        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        padding: 3,
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
      <Divider sx={{ marginTop: 2 }} />
      {displaySelectTeams()}
      <TagsView
        tags={richTags}
        documentsCountPerTags={documentsCountPerTags}
        onSelectTag={() => {
          if (isMobile) {
            setIsSidebarOpen(false);
          }
          onGoBackHome();
        }}
      />
      <Divider sx={{ marginBottom: 2 }} />
      <Button
        startIcon={<Logout />}
        onClick={() => logout.mutate()}
        sx={{
          textTransform: 'none',
          textAlign: 'start',
          justifyContent: 'start',
          fontWeight: 500,
        }}
        color="error"
        fullWidth
      >
        Logout
      </Button>
    </Stack>
  );
  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
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
              width: '75%',
              maxWidth: '100%',
            },
          }}
        >
          {displayDrawerContent()}
        </Drawer>
      ) : (
        <Box
          sx={{
            minWidth: '200px',
            width: '330px',
            maxWidth: '25%',
            backgroundColor: 'transparent',
          }}
        >
          {displayDrawerContent()}
        </Box>
      )}

      {/* <SelectTeamsAndOrganisationsDialog
        open={isSelectTeamsAndOrganisationsOpen}
        onClose={() => setIsSelectTeamsAndOrganisationsOpen(false)}
      /> */}
    </>
  );
};
