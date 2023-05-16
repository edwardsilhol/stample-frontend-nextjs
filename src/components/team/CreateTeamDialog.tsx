import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CreateOrUpdateTeamForm } from 'components/forms/team/CreateOrUpdateTeamForm';
import { PopulatedTeam } from 'stores/types/team.types';

interface Props {
  open: boolean;
  team?: PopulatedTeam;
  onClose: () => void;
}

export const CreateTeamDialog: React.FC<Props> = ({ open, team, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{team ? 'Update team' : 'Create a new team'}</DialogTitle>
      <DialogContent>
        <CreateOrUpdateTeamForm team={team} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
