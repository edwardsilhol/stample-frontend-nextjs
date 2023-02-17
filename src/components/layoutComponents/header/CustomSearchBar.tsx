import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Tag } from '../../../stores/types/tag.types';
import { DocumentType } from '../../../stores/types/document.types';

interface SearchBarProps {
  tags: Tag[];
  documents: DocumentType[];
}
export const CustomSearchBar: React.FC<SearchBarProps> = ({
  tags,
  documents,
}) => {
  const tagNames = tags.map((tag) => tag.name);
  const documentTitles = documents.map((document) => document.title);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      freeSolo
      options={[...tagNames, ...documentTitles]}
      renderInput={(params) => (
        <TextField {...params} label="Search" variant="outlined" />
      )}
      groupBy={(option) => (tagNames.includes(option) ? 'Tags' : 'Documents')}
      getOptionLabel={(option) => option}
    />
  );
};
