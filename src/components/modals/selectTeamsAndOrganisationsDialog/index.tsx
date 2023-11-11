'use client';

import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CreateTeamDialog from 'components/dialogs/CreateTeamDialog';
import { MouseEvent, useState } from 'react';
import { useAllTeams, useLeaveTeam } from 'stores/hooks/team.hooks';
import { getTeamDisplayedName } from '../../../utils/team';
import { PopulatedTeam, Team } from 'stores/types/team.types';
import { TEAM_ROUTE } from '../../../constants/routes.constant';
import { useRouter } from 'next/navigation';
import CircularLoading from '../../base/circularLoading';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Delete from '@mui/icons-material/Delete';
import ConfirmDialog from '../confirmDialog';

interface SelectTeamsAndOrganisationsDialogProps {
  team: PopulatedTeam;
  userHasTeamPrivilege: boolean;
}
function SelectTeamsAndOrganisationsDialog({
  team,
  userHasTeamPrivilege,
}: SelectTeamsAndOrganisationsDialogProps) {
  const router = useRouter();
  const leaveTeam = useLeaveTeam();
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [isUpdateTeamDialogOpen, setIsUpdateTeamDialogOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [confirmLeaveTeamDialogOpen, setConfirmLeaveTeamDialogOpen] =
    useState(false);

  const { data: teams, isLoading: isTeamsLoading } = useAllTeams();

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
  };

  const handleLeaveTeam = async () => {
    console.log('leave team');
    await leaveTeam.mutateAsync(team._id, {
      onSuccess: () => {
        router.push(TEAM_ROUTE);
      },
    });
    setConfirmLeaveTeamDialogOpen(false);
  };

  const teamOptions = [
    {
      text: 'Leave the team',
      Icon: Delete,
      onClick: () => setConfirmLeaveTeamDialogOpen(true),
    },
  ];
  const renderTeamOptionsButton = () => (
    <>
      <IconButton
        sx={{
          borderRadius: '4px',
          width: '14px',
          height: '14px',
          padding: 0,
        }}
        onClick={handleMenuClick}
      >
        <MoreHorizIcon
          sx={{
            height: '14px',
          }}
        />
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {teamOptions.map(({ text, Icon, onClick }, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              onClick();
              handleMenuClose(e);
            }}
          >
            <ListItemIcon>
              <Icon
                sx={{
                  height: '14px',
                }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">{text}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
      <ConfirmDialog
        open={confirmLeaveTeamDialogOpen}
        title="Confirm leave team"
        content="Are you sure you want to leave this team?"
        onConfirm={handleLeaveTeam}
        onCancel={() => setConfirmLeaveTeamDialogOpen(false)}
      />
    </>
  );

  return !isTeamsLoading && teams ? (
    <>
      <Typography fontSize="10px" fontWeight={500}>
        TEAM
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <TextField
          value={team._id}
          sx={{
            '.MuiInputBase-input:focus': {
              backgroundColor: 'inherit',
            },
            width: '100%',
          }}
          SelectProps={{
            open: isSelectOpen,
            onOpen: () => setIsSelectOpen(true),
            onClose: () => setIsSelectOpen(false),
            renderValue: (value) => {
              const selectedTeam = teams?.find(
                (team) => team._id === value,
              ) as Team;
              return selectedTeam ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  overflow="hidden"
                >
                  <GroupsOutlined fontSize="small" color="primary" />
                  <Typography
                    variant="body2"
                    textOverflow="ellipsis"
                    fontWeight="bold"
                  >
                    {getTeamDisplayedName(selectedTeam)}
                  </Typography>
                </Stack>
              ) : (
                <></>
              );
            },
            IconComponent: KeyboardArrowDown,
            disableUnderline: true,
            sx: {
              '.MuiSelect-icon': {
                fontSize: '16px',
                color: 'black',
              },
              '.MuiSelect-select': {
                paddingTop: 0,
                paddingBottom: 0,
              },
            },
          }}
          onChange={(event) => {
            if (event.target.value)
              router.push(`${TEAM_ROUTE}/${event.target.value}`);
          }}
          select
          InputProps={{
            sx: {
              height: '30px',
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          variant="standard"
        >
          {teams.map((t) => (
            <MenuItem
              key={t._id}
              value={t._id}
              sx={{
                ...(t._id === team._id
                  ? {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }
                  : {}),
              }}
            >
              <Typography
                variant="body2"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {getTeamDisplayedName(t)}
              </Typography>
            </MenuItem>
          ))}
          <Button
            onClick={() => setIsCreateTeamDialogOpen(true)}
            endIcon={<Add />}
            key="create-team"
            fullWidth
          >
            Create Team
          </Button>
        </TextField>
        {!userHasTeamPrivilege ? (
          renderTeamOptionsButton()
        ) : (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setIsUpdateTeamDialogOpen(true);
              }}
              sx={{ width: '20px', height: '20px' }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <CreateTeamDialog
              open={isCreateTeamDialogOpen || isUpdateTeamDialogOpen}
              team={isUpdateTeamDialogOpen ? team : undefined}
              onClose={() => {
                setIsCreateTeamDialogOpen(false);
                setIsUpdateTeamDialogOpen(false);
                setIsSelectOpen(false);
              }}
            />
          </>
        )}
      </Stack>
    </>
  ) : (
    <CircularLoading />
  );
}

export default SelectTeamsAndOrganisationsDialog;
