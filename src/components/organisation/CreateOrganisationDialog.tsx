import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CreateOrganisationForm } from 'components/forms/organisation/CreateOrganisationForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateOrganisationDialog: React.FC<Props> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a new organisation</DialogTitle>
      <DialogContent>
        <CreateOrganisationForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
