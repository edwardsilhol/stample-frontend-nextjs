import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Tag } from '../../../stores/types/tag.types';
import { DocumentType } from '../../../stores/types/document.types';
import { createUseStyles } from 'react-jss';
import { useRawTags } from '../../../stores/hooks/tag.hooks';

const useStyles = createUseStyles({
  container: {
    width: '300px',
    margin: '10px',
  },
});

export const CustomSearchBar: React.FC = () => {
  const classes = useStyles();
  const { data: tags } = useRawTags();
  const documents: DocumentType[] = [];
  const tagNames = tags ? tags.map((tag) => tag.name) : [];
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
