import React from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { Tag } from '../../../stores/types/tag.types';
import { useCreateTag, useTags } from '../../../stores/hooks/tag.hooks';

type TagTextFieldProps = {
  onChange: (value: Tag[]) => void;
};

const TagTextField: React.FC<TagTextFieldProps> = ({ onChange }) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  const {
    data: { flatTags },
    isLoading,
  } = useTags();
  const createTag = useCreateTag();

  const handleInputChange = (event: React.SyntheticEvent, value: string) => {
    setInputValue(value);
  };

  const handleTagSelect = (
    event: React.SyntheticEvent,
    value: (string | Tag)[],
  ) => {
    if (!Array.isArray(value)) {
      if (!selectedTags.includes(value)) {
        setSelectedTags([...selectedTags, value]);
        onChange([...selectedTags, value]);
      }
    } else if (Array.isArray(value)) {
      setSelectedTags(value as Tag[]);
      onChange(value as Tag[]);
    }
  };

  const handleCreateTag = () => {
    if (inputValue && !flatTags?.map((t) => t.name).includes(inputValue)) {
      createTag.mutateAsync({ name: inputValue }).then((newTag) => {
        if (newTag) {
          setSelectedTags([...selectedTags, newTag]);
          onChange([...selectedTags, newTag]);
        }
      });
    }
    setInputValue('');
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return !flatTags || isLoading ? null : (
    <>
      <Autocomplete
        multiple
        freeSolo
        options={flatTags.map((t) => t.name)}
        value={selectedTags.map((t) => t.name)}
        onChange={handleTagSelect}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField {...params} label={'Tags'} variant="outlined" fullWidth />
        )}
        noOptionsText={
          <span>
            No matching tags. Press enter to create a new tag:{' '}
            <strong>{inputValue}</strong>
          </span>
        }
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            inputValue &&
            !flatTags.map((t) => t.name).includes(inputValue)
          ) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create new tag?</DialogTitle>
        <DialogContent>
          <List>
            <ListItemButton onClick={handleCreateTag}>
              <ListItemText primary={inputValue} />
            </ListItemButton>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateTag} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TagTextField;
