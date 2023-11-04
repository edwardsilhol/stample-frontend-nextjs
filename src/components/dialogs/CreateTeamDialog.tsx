import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CreateOrUpdateTeamForm from 'components/forms/team/CreateOrUpdateTeamForm';
import { PopulatedTeam } from '../../stores/types/team.types';

interface CreateTeamDialogsProps {
  open: boolean;
  team?: PopulatedTeam;
  onClose: () => void;
}

function CreateTeamDialog({ open, team, onClose }: CreateTeamDialogsProps) {
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
}

export default CreateTeamDialog;
