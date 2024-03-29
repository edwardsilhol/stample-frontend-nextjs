import React, { useMemo } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { Tag } from '@src/stores/types/tag.types';
import { groupBy } from 'lodash';

type TagTextFieldProps = {
  selectedTags: string[];
  tags: Tag[];
  onChange: (value: string[]) => void;
};

function SelectTags({ selectedTags, tags, onChange }: TagTextFieldProps) {
  const [inputValue, setInputValue] = React.useState('');

  const tagsByIds = useMemo(() => groupBy(tags, '_id'), [tags]);

  const handleInputChange = (_: React.SyntheticEvent, value: string) => {
    setInputValue(value);
  };

  const handleTagSelect = (_: React.SyntheticEvent, value: string[]) => {
    if (!Array.isArray(value)) {
      if (!selectedTags.includes(value)) {
        onChange([...selectedTags, value]);
      }
    } else if (Array.isArray(value)) {
      onChange(value);
    }
  };

  return (
    <Autocomplete
      multiple
      options={tags.map((tag) => tag._id)}
      value={selectedTags}
      onChange={handleTagSelect}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => tagsByIds[option][0].name}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder="Select tags..."
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '.MuiInputBase-root': {
              fontSize: '14px',
            },
          }}
        />
      )}
    />
  );
}

export default SelectTags;
