'use client';

import { TextField, Autocomplete } from '@mui/material';
import { Tag } from '../../../stores/types/tag.types';
import { useTagsByTeam } from '../../../stores/hooks/tag.hooks';
import { SyntheticEvent, useState } from 'react';

type TagTextFieldProps = {
  teamId: string;
  onChange: (value: Tag[]) => void;
};

function TagTextField({ teamId, onChange }: TagTextFieldProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const {
    data: { raw: flatTags },
    isLoading,
  } = useTagsByTeam(teamId);

  const handleInputChange = (event: SyntheticEvent, value: string) => {
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
          <TextField
            {...params}
            placeholder="Select tags"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </>
  );
}

export default TagTextField;
