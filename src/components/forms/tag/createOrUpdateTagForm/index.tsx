import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Button, Popover, TextField } from '@mui/material';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useCreateTag, useUpdateTag } from '../../../../stores/hooks/tag.hooks';

interface CreateOrUpdateTagFormProps {
  open: boolean;
  teamId: string;
  handleClose: () => void;
  variant: 'create' | 'update';
  tagId?: string;
  anchorEl?: HTMLElement;
}
function CreateOrUpdateTagForm({
  open,
  teamId,
  handleClose,
  tagId,
  anchorEl,
  variant,
}: CreateOrUpdateTagFormProps) {
  if (variant === 'update' && !tagId) {
    throw new Error('tagId is required for update variant');
  }

  const [newTagName, setNewTagName] = useState<string>('');
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();

  const handleCreateTag = async () => {
    if (variant === 'update') {
      tagId &&
        (await updateTag.mutateAsync({
          tagId,
          payload: {
            name: newTagName,
          },
        }));
    } else {
      await createTag.mutateAsync({
        name: newTagName,
        teamId,
        parentId: tagId,
      });
    }

    setNewTagName('');
    handleClose();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.key === 'Enter' && handleCreateTag();
  };
  return (
    <Popover
      sx={{
        '& .MuiPopover-paper': {
          boxShadow: '0 10px 30px rgb(0,0,0,0.13)',
          border: '1px solid rgba(0,0,0,0.13)',
          borderRadius: '4px',
          margin: '-20px 0 0 -20px',
          padding: 1,
        },
      }}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {' '}
      <Typography variant="body2" fontWeight={500} paddingBottom={0.5}>
        Tag
      </Typography>
      <Stack direction="row" alignItems="center" spacing="5px">
        <TextField
          autoFocus
          variant="outlined"
          placeholder="Enter your tag"
          value={newTagName}
          inputProps={{ sx: { paddingY: 0.75 } }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setNewTagName(event.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          onClick={handleCreateTag}
          sx={{
            textTransform: 'none',
            fontSize: '12px',
          }}
        >
          Submit
        </Button>
      </Stack>
    </Popover>
  );
}

export default CreateOrUpdateTagForm;
