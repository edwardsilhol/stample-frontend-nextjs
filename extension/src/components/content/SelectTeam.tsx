import { MenuItem, TextField } from '@mui/material';
import {
  getDefaultSelectedTeamId,
  getTeamDisplayedName,
} from '@src/helpers/team.helper';
import { useSelectedTeamId } from '@src/stores/hooks/jotai/team.hooks';
import { useAllTeams } from '@src/stores/hooks/tanstackQuery/team.hooks';
import { useEffect } from 'react';

function SelectTeam() {
  const [selectedTeamId, setSelectedTeamId] = useSelectedTeamId();
  const { data: teams } = useAllTeams();
  useEffect(() => {
    const defaultSelectedTeamId = getDefaultSelectedTeamId(teams);
    if (defaultSelectedTeamId && !selectedTeamId) {
      setSelectedTeamId(defaultSelectedTeamId);
    }
  }, [teams]);
  return (
    <TextField
      value={
        selectedTeamId === null || selectedTeamId === undefined
          ? ''
          : selectedTeamId
      }
      onChange={(event) => setSelectedTeamId(event.target.value as string)}
      label="Select Team"
      select
      InputProps={{
        sx: {
          height: '30px',
        },
      }}
      InputLabelProps={{
        shrink: true,
      }}
    >
      {teams?.map((team) => (
        <MenuItem key={team._id} value={team._id}>
          {getTeamDisplayedName(team)}
        </MenuItem>
      ))}
    </TextField>
  );
}
export default SelectTeam;
