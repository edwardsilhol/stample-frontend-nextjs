import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CreateOrUpdateTeamForm from 'components/forms/team/CreateOrUpdateTeamForm';
import { useTeam } from '../../stores/hooks/team.hooks';
import CircularLoading from '../base/circularLoading';

interface CreateTeamDialogsProps {
  open: boolean;
  teamId?: string;
  onClose: () => void;
}

function CreateTeamDialog({ open, teamId, onClose }: CreateTeamDialogsProps) {
  const { data: team, isLoading: isTeamLoading } = useTeam(teamId);
  return !isTeamLoading ? (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {teamId ? 'Update team' : 'Create a new team'}
          <IconButton onClick={onClose} sx={{ paddingRight: 0 }}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <CreateOrUpdateTeamForm team={team} onClose={onClose} />
      </DialogContent>
    </Dialog>
  ) : (
    <CircularLoading />
  );
}

export default CreateTeamDialog;
