'use client';

import { Logout, MenuOpen } from '@mui/icons-material';
import { useLogout, useSession } from '../../../stores/hooks/user.hooks';
import {
  useDocumentsCountPerTagByTeam,
  useTagsByTeam,
} from '../../../stores/hooks/tag.hooks';
import TagsTree from '../../lists/TagsTree';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import SelectTeamsAndOrganisationsDialog from './SelectTeamsAndOrganisationsDialog';
import { useParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/icons-material/Menu';
import { useState } from 'react';
import GotoNewsletterButton from '../../buttons/GoToNewsletterButton';
import { RouteParams } from '../../../stores/types/global.types';
import { useTeam } from '../../../stores/hooks/team.hooks';
import { LocalRole } from '../../../stores/types/user.types';

function LoggedSidebar() {
  const { teamId } = useParams<RouteParams>();
  const isMobile = useIsMobile();
  const { data: user, isLoading: isUserLoading } = useSession();
  const { data: team, isLoading: isTeamLoading } = useTeam(teamId);
  const { data: documentsCountPerTags } = useDocumentsCountPerTagByTeam(teamId);
  const {
    data: { rich: richTags },
  } = useTagsByTeam(teamId);
  const logout = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentUserRole = team?.users.find((u) => u.user._id === user?._id)
    ?.role;
  const UserHasPrivilege =
    currentUserRole === LocalRole.ADMIN || currentUserRole === LocalRole.OWNER;

  const getAccountMenu = () => {
    return !isUserLoading && user ? (
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
      <Divider sx={{ marginY: 2 }} />
      <Stack direction="column" spacing={0.75}>
        {!isTeamLoading && team && (
          <>
            <SelectTeamsAndOrganisationsDialog team={team} open />
            <GotoNewsletterButton
              teamId={teamId}
              userHasPrivilege={UserHasPrivilege}
              isPersonalTeam={team.isPersonal}
            />
            <TagsTree
              teamId={teamId}
              tags={richTags}
              userHasPrivilege={UserHasPrivilege}
              documentsCountPerTags={documentsCountPerTags}
              onSelectTag={() => {
                if (isMobile) {
                  setIsSidebarOpen(false);
                }
              }}
            />
          </>
          // TODO: skeleton or optimistically update
        )}
      </Stack>
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
        <>
          <IconButton
            style={{
              position: 'absolute',
              top: '8px',
              zIndex: 1000,
            }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </IconButton>
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
                minWidth: '300px',
                width: '75%',
                maxWidth: '100%',
              },
            }}
          >
            {displayDrawerContent()}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            minWidth: '300px',
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
}

export default LoggedSidebar;
