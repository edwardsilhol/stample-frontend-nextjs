import CreateOrganisationForm from 'components/forms/organisation/CreateOrganisationForm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface CreateOrganisationDialogProps {
  open: boolean;
  onClose: () => void;
}

function CreateOrganisationDialog({
  open,
  onClose,
}: CreateOrganisationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a new organisation</DialogTitle>
      <DialogContent>
        <CreateOrganisationForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
export default CreateOrganisationDialog;
