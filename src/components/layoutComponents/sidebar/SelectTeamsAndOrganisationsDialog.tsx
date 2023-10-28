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
import { useState } from 'react';
import { useAllTeams, useTeam } from 'stores/hooks/team.hooks';
import { getTeamDisplayedName } from '../../../utils/team.helper';
import { Team } from 'stores/types/team.types';
import { TEAM_ROUTE } from '../../../constants/routes.constant';
import { useRouter } from 'next/navigation';

interface SelectTeamsAndOrganisationsDialogProps {
  teamId: string;
  open: boolean;
}
function SelectTeamsAndOrganisationsDialog({
  teamId,
}: SelectTeamsAndOrganisationsDialogProps) {
  const router = useRouter();
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [isUpdateTeamDialogOpen, setIsUpdateTeamDialogOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { data: teams } = useAllTeams();
  const { data: team } = useTeam(teamId);

  return (
    <>
      <Typography fontSize="10px" fontWeight={500} paddingY={1.5}>
        TEAM
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <TextField
          value={teamId === null || teamId === undefined ? '' : teamId}
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
                  justifyContent="space-between"
                  spacing={1.5}
                  width="100%"
                  overflow="hidden"
                >
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
                </Stack>
              ) : (
                ''
              );
            },
            IconComponent: KeyboardArrowDown,
            disableUnderline: true,
            sx: {
              '.MuiSelect-icon': {
                fontSize: '16px',
                color: 'black',
              },
            },
          }}
          onChange={(event) => {
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
          {teams?.map((team) => (
            <MenuItem
              key={team._id}
              value={team._id}
              sx={{
                ...(team._id === teamId
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
                {getTeamDisplayedName(team)}
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
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setIsUpdateTeamDialogOpen(true);
          }}
          sx={{ width: '20px', height: '20px' }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Stack>
      <CreateTeamDialog
        open={isCreateTeamDialogOpen || isUpdateTeamDialogOpen}
        team={isUpdateTeamDialogOpen ? team ?? undefined : undefined}
        onClose={() => {
          setIsCreateTeamDialogOpen(false);
          setIsUpdateTeamDialogOpen(false);
          setIsSelectOpen(false);
        }}
      />
    </>
  );
}

export default SelectTeamsAndOrganisationsDialog;
