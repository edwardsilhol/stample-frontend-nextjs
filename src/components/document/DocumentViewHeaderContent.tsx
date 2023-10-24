import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { KeyboardArrowLeft } from '@mui/icons-material';

interface DocumentViewHeaderContentProps {
  onClickBack: () => void;
}

function DocumentViewHeaderContent({
  onClickBack,
}: DocumentViewHeaderContentProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      paddingY={1}
    >
      <Button
        variant="text"
        startIcon={<KeyboardArrowLeft />}
        onClick={onClickBack}
        sx={{ padding: 0, borderRadius: '4px' }}
      >
        Back
      </Button>
    </Stack>
  );
}
export default DocumentViewHeaderContent;
