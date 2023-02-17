import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Tag } from '../../../stores/types/tag.types';
import { DocumentType } from '../../../stores/types/document.types';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    width: '300px',
    margin: '10px',
  },
});

interface SearchBarProps {
  tags: Tag[];
  documents: DocumentType[];
}
export const CustomSearchBar: React.FC<SearchBarProps> = ({
  tags,
  documents,
}) => {
  const classes = useStyles();
  const tagNames = tags.map((tag) => tag.name);
  const documentTitles = documents.map((document) => document.title);

  return (
    <Autocomplete
      size={'small'}
      className={classes.container}
      options={[...tagNames, ...documentTitles]}
      renderInput={(params) => (
        <TextField {...params} label="Search" variant="outlined" />
      )}
      groupBy={(option) => (tagNames.includes(option) ? 'Tags' : 'Documents')}
      getOptionLabel={(option) => option}
    />
  );
};
