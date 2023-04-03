import React, { useMemo } from 'react';
import { Autocomplete, InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';
import Box from '../../muiOverrides/Box';
import { Tag } from 'stores/types/tag.types';
import { uniq } from 'lodash';

interface CustomSearchBarProps {
  searchValue: string;
  tags: Tag[];
  setSearchValue: (value: string) => void;
}

export const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  searchValue,
  tags,
  setSearchValue,
}) => {
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
          setSearchValue(value);
        }}
        inputValue={searchValue}
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
                width: '300px',
                borderRadius: 0.5,
                paddingLeft: '4px',
              }}
            />
          );
        }}
        options={uniqueTags}
      />
    </Box>
  );
};
