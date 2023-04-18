import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CreateTeamForm } from 'components/forms/team/CreateTeamForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateTeamDialog: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a new team</DialogTitle>
      <DialogContent>
        <CreateTeamForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
