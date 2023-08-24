import {
  Add,
  Edit,
  GroupsOutlined,
  KeyboardArrowDown,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  // Dialog,
  // DialogContent,
  MenuItem,
  Stack,
  // Stack,
  TextField,
  Typography,
} from '@mui/material';
// import { CreateOrganisationDialog } from 'components/organisation/CreateOrganisationDialog';
import { CreateTeamDialog } from 'components/team/CreateTeamDialog';
import { getDefaultSelectedTeamId } from 'helpers/team.helper';
import React, { useEffect } from 'react';
// import { useSelectedOrganisationId } from 'stores/data/organisation.data';
import { useSelectedTeam, useSelectedTeamId } from 'stores/data/team.data';
// import { useAllOrganisations } from 'stores/hooks/organisation.hooks';
import { useAllTeams } from 'stores/hooks/team.hooks';
import { getTeamDisplayedName } from '../../../helpers/team.helper';
import { Team } from 'stores/types/team.types';

interface Props {
  open: boolean;
  onClose: () => void;
}
export const SelectTeamsAndOrganisationsDialog: React.FC<Props> = ({
  onClose,
}) => {
  // const [selectedOrganisationId, setSelectedOrganisationId] =
  //   useSelectedOrganisationId();
  const [selectedTeamId, setSelectedTeamId] = useSelectedTeamId();
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] =
    React.useState(false);
  const [isUpdateTeamDialogOpen, setIsUpdateTeamDialogOpen] =
    React.useState(false);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);

  // const [isCreateOrganisationOpen, setIsCreateOrganisationOpen] =
  //   React.useState(false);
  const { data: teams } = useAllTeams();
  const { data: team } = useSelectedTeam();
  const teamsByIds: Record<string, Team> = React.useMemo(() => {
    if (!teams) return {};
    return teams.reduce((accumulator, team) => {
      return {
        ...accumulator,
        [team._id]: team,
      };
    }, {});
  }, [teams]);

  // const { data: organisations } = useAllOrganisations();

  // useEffect(() => {
  //   const defaultSelectedOrganisationId = organisations?.[0]?._id;
  //   if (selectedOrganisationId === null && defaultSelectedOrganisationId) {
  //     setSelectedOrganisationId(defaultSelectedOrganisationId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [organisations]);
  // const handleClickCreateOrganisation = () => {
  //   setIsCreateOrganisationOpen(true);
  // };

  // const organisationTeams = useMemo(() => {
  //   const selectedOrganisation = organisations?.find(
  //     (organisation) => organisation._id === selectedOrganisationId,
  //   );
  //   if (selectedOrganisation) {
  //     return teams?.filter((team) =>
  //       selectedOrganisation.teams.includes(team._id),
  //     );
  //   }
  //   const allOrganisationsTeamsIds = organisations?.reduce(
  //     (accumulator, organisation) => [...accumulator, ...organisation.teams],
  //     [] as string[],
  //   );
  //   return teams?.filter(
  //     (team) => !allOrganisationsTeamsIds?.includes(team._id),
  //   );
  // }, [organisations, teams, selectedOrganisationId]);
  useEffect(() => {
    const defaultSelectedTeamId = getDefaultSelectedTeamId(teams);
    if (defaultSelectedTeamId && !selectedTeamId) {
      setSelectedTeamId(defaultSelectedTeamId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams]);
  return (
    <>
      <Typography fontSize="10px" fontWeight={500} paddingY={1.5}>
        TEAM
      </Typography>
      <TextField
        value={
          selectedTeamId === null || selectedTeamId === undefined
            ? ''
            : selectedTeamId
        }
        SelectProps={{
          open: isSelectOpen,
          onOpen: () => setIsSelectOpen(true),
          onClose: () => setIsSelectOpen(false),
          renderValue: (value) => {
            const selectedTeam = teamsByIds[value as string];
            return selectedTeam ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1.5}
                width="100%"
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <GroupsOutlined fontSize="small" />
                  <Typography
                    variant="body2"
                    overflow="hidden"
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
          setSelectedTeamId(event.target.value as string);
          onClose();
        }}
        select
        sx={{
          width: '100%',
        }}
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
              ...(team._id === selectedTeamId
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
            {team._id === selectedTeamId ? (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUpdateTeamDialogOpen(true);
                }}
                sx={{ width: '20px', height: '20px' }}
              >
                <Edit fontSize="small" />
              </IconButton>
            ) : null}
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
      <CreateTeamDialog
        open={isCreateTeamDialogOpen || isUpdateTeamDialogOpen}
        team={isUpdateTeamDialogOpen ? team ?? undefined : undefined}
        onClose={() => {
          setIsCreateTeamDialogOpen(false);
          setIsUpdateTeamDialogOpen(false);
          setIsSelectOpen(false);
        }}
      />
      {/* <CreateOrganisationDialog
        open={isCreateOrganisationOpen}
        onClose={() => setIsCreateOrganisationOpen(false)}
      /> */}
    </>
  );
  // <Dialog open={open} onClose={onClose}>
  //   <DialogContent>
  //     <Stack spacing={2}>
  //       <TextField
  //         value={
  //           selectedOrganisationId === null ? '' : selectedOrganisationId
  //         }
  //         onChange={(event) => {
  //           if (!event.target.value) {
  //             setSelectedOrganisationId(null);
  //           } else {
  //             setSelectedOrganisationId(event.target.value as string);
  //           }
  //         }}
  //         label="Select Organisation"
  //         select
  //         sx={{
  //           width: '100%',
  //         }}
  //         InputProps={{
  //           sx: {
  //             height: '30px',
  //           },
  //         }}
  //         InputLabelProps={{
  //           shrink: true,
  //         }}
  //         fullWidth
  //         SelectProps={{
  //           displayEmpty: true,
  //         }}
  //       >
  //         <MenuItem value="" key="no-organisation">
  //           No Organisation
  //         </MenuItem>
  //         {organisations?.map((organisation) => (
  //           <MenuItem key={organisation._id} value={organisation._id}>
  //             {organisation.name}
  //           </MenuItem>
  //         ))}
  //       </TextField>
  //       <TextField
  //         value={selectedTeamId}
  //         onChange={(event) =>
  //           setSelectedTeamId(event.target.value as string)
  //         }
  //         label="Select Team"
  //         select
  //         sx={{
  //           width: '100%',
  //         }}
  //         InputProps={{
  //           sx: {
  //             height: '30px',
  //           },
  //         }}
  //         InputLabelProps={{
  //           shrink: true,
  //         }}
  //         fullWidth
  //       >
  //         {organisationTeams?.map((team) => (
  //           <MenuItem key={team._id} value={team._id}>
  //             {team.name}
  //           </MenuItem>
  //         ))}
  //       </TextField>
  //     </Stack>
  //     <Stack spacing={2} direction="row">
  //       <Button onClick={handleClickCreateTeam}>Create Team</Button>
  //       <Button onClick={handleClickCreateOrganisation}>
  //         Create Organisation
  //       </Button>
  //     </Stack>
  //     <CreateTeamDialog
  //       open={isCreateTeamOpen}
  //       onClose={() => setIsCreateTeamOpen(false)}
  //     />
  //     <CreateOrganisationDialog
  //       open={isCreateOrganisationOpen}
  //       onClose={() => setIsCreateOrganisationOpen(false)}
  //     />
  //   </DialogContent>
  // </Dialog>
};
