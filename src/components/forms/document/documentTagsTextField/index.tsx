'use client';

import { TextField, Autocomplete, Chip } from '@mui/material';
import { Tag } from '../../../../stores/types/tag.types';
import { useTagsByTeam } from '../../../../stores/hooks/tag.hooks';
import { SyntheticEvent, useState } from 'react';

type TagTextFieldProps = {
  teamId: string;
  onChange: (value: Tag[]) => void;
  value?: Tag[];
};

function DocumentTagsTextField({
  teamId,
  onChange,
  value = [],
}: TagTextFieldProps) {
  const [inputValue, setInputValue] = useState('');

  const {
    data: { raw: flatTags },
    isLoading,
  } = useTagsByTeam(teamId);

  const handleInputChange = (_: SyntheticEvent, value: string) => {
    setInputValue(value);
  };

  const handleTagSelect = (_: SyntheticEvent, tagValue: (string | Tag)[]) => {
    if (!Array.isArray(tagValue)) {
      if (!value.includes(tagValue)) {
        onChange([...value, tagValue]);
      }
    } else if (Array.isArray(tagValue)) {
      onChange(tagValue as Tag[]);
    }
  };

  return !isLoading && flatTags ? (
    <Autocomplete
      multiple
      options={flatTags.map((tag) => ({
        name: tag.name,
        _id: tag._id,
      }))}
      value={value?.map((tag) => ({
        name: tag.name,
        _id: tag._id,
      }))}
      onChange={handleTagSelect}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select tags"
          variant="outlined"
          fullWidth
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip {...getTagProps({ index })} key={index} label={option.name} />
        ))
      }
    />
  ) : (
    <></>
  );
}

export default DocumentTagsTextField;
