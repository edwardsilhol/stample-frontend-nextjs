import { Add } from '@mui/icons-material';
import {
  Button,
  // Dialog,
  // DialogContent,
  MenuItem,
  // Stack,
  TextField,
} from '@mui/material';
// import { CreateOrganisationDialog } from 'components/organisation/CreateOrganisationDialog';
import { CreateTeamDialog } from 'components/team/CreateTeamDialog';
import { getDefaultSelectedTeamId } from 'helpers/team.helper';
import React, { useEffect } from 'react';
// import { useSelectedOrganisationId } from 'stores/data/organisation.data';
import { useSelectedTeamId } from 'stores/data/team.data';
// import { useAllOrganisations } from 'stores/hooks/organisation.hooks';
import { useAllTeams } from 'stores/hooks/team.hooks';
import { getTeamDisplayedName } from '../../../helpers/team.helper';

interface Props {
  open: boolean;
  onClose: () => void;
}
export const SelectTeamsAndOrganisationsDialog: React.FC<Props> = ({}) => {
  // const [selectedOrganisationId, setSelectedOrganisationId] =
  //   useSelectedOrganisationId();
  const [selectedTeamId, setSelectedTeamId] = useSelectedTeamId();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = React.useState(false);
  // const [isCreateOrganisationOpen, setIsCreateOrganisationOpen] =
  //   React.useState(false);
  const { data: teams } = useAllTeams();
  // const { data: organisations } = useAllOrganisations();

  // useEffect(() => {
  //   const defaultSelectedOrganisationId = organisations?.[0]?._id;
  //   if (selectedOrganisationId === null && defaultSelectedOrganisationId) {
  //     setSelectedOrganisationId(defaultSelectedOrganisationId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [organisations]);
  const handleClickCreateTeam = () => {
    setIsCreateTeamOpen(true);
  };

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
      <TextField
        value={
          selectedTeamId === null || selectedTeamId === undefined
            ? ''
            : selectedTeamId
        }
        onChange={(event) => setSelectedTeamId(event.target.value as string)}
        label="Select Team"
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
      >
        {teams?.map((team) => (
          <MenuItem key={team._id} value={team._id}>
            {getTeamDisplayedName(team)}
          </MenuItem>
        ))}
        <Button
          onClick={handleClickCreateTeam}
          endIcon={<Add />}
          key="create-team"
          fullWidth
        >
          Create Team
        </Button>
      </TextField>
      <CreateTeamDialog
        open={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
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
