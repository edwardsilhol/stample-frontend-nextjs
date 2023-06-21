import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
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
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {team ? 'Update team' : 'Create a new team'}
          <IconButton onClick={onClose} sx={{ paddingRight: 0 }}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <CreateOrUpdateTeamForm team={team} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
