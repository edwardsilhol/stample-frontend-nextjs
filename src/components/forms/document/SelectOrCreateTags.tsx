import React from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { Tag } from '../../../stores/types/tag.types';
import { useTags } from '../../../stores/hooks/tag.hooks';

type TagTextFieldProps = {
  onChange: (value: Tag[]) => void;
};

const TagTextField: React.FC<TagTextFieldProps> = ({ onChange }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  const {
    data: { raw: flatTags },
    isLoading,
  } = useTags();

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

  return !flatTags || isLoading ? null : (
    <>
      <Autocomplete
        multiple
        options={flatTags}
        value={selectedTags}
        onChange={handleTagSelect}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label={'Tags'} variant="outlined" fullWidth />
        )}
      />
    </>
  );
};

export default TagTextField;
