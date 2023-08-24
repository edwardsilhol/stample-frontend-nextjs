import React, { useMemo } from 'react';
import { Autocomplete, InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';
import Box from '../../muiOverrides/Box';
import { Tag } from 'stores/types/tag.types';
import { uniq } from 'lodash';
import { useSearchDocumentsQuery } from 'stores/data/document.data';

interface CustomSearchBarProps {
  tags: Tag[];
}

export const CustomSearchBar: React.FC<CustomSearchBarProps> = ({ tags }) => {
  const [searchDocumentsQuery, setSearchDocumentsQuery] =
    useSearchDocumentsQuery();
  const uniqueTags = useMemo(
    () => uniq(tags.map((tag) => `#${tag.name}`)),
    [tags],
  );
  return (
    <Box
      sx={{
        '& .MuiInputBase-input': {
          padding: '0',
          margin: '0 5px',
          fontSize: '14px',
          fontWeight: 400,
        },
        maxWidth: '100%',
      }}
    >
      <Autocomplete
        onInputChange={(_, value) => {
          setSearchDocumentsQuery(value);
        }}
        inputValue={searchDocumentsQuery ?? ''}
        freeSolo
        ListboxProps={{
          style: {
            fontSize: '14px',
          },
        }}
        renderInput={({ InputProps, InputLabelProps: _, ...rest }) => {
          return (
            <InputBase
              {...InputProps}
              {...rest}
              startAdornment={
                <Search sx={{ fontSize: '20px', color: '#737373' }} />
              }
              placeholder="Search"
              sx={{
                backgroundColor: 'white',
                height: '34px',
                borderRadius: 0.75,
                paddingLeft: '4px',
                width: '375px',
                maxWidth: '100%',
                border: '1px solid #E5E5E5',
              }}
            />
          );
        }}
        options={uniqueTags}
      />
    </Box>
  );
};
