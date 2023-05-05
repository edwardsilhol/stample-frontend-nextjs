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
        color: 'black',
        opacity: 0.6,
        '& .MuiInputBase-input': {
          padding: '0',
          margin: '0 5px',
          fontSize: '13px',
          fontWeight: 600,
        },
      }}
    >
      <Autocomplete
        onInputChange={(_, value) => {
          setSearchDocumentsQuery(value);
        }}
        inputValue={searchDocumentsQuery ?? ''}
        freeSolo
        renderInput={({ InputProps, InputLabelProps: _, ...rest }) => {
          return (
            <InputBase
              {...InputProps}
              {...rest}
              startAdornment={<Search sx={{ fontSize: '20px' }} />}
              placeholder={'Search'}
              sx={{
                backgroundColor: 'additionalColors.sidebarBackground',
                height: '34px',
                borderRadius: 0.5,
                paddingLeft: '4px',
                width: '300px',
                maxWidth: '100%',
              }}
            />
          );
        }}
        options={uniqueTags}
      />
    </Box>
  );
};
