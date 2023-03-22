import React from 'react';
import { Autocomplete, InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';
import Box from '../../muiOverrides/Box';
import { Tag } from 'stores/types/tag.types';

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
  console.log({
    tagsDisplayed: tags.map((tag) => tag.name),
  });
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
        onChange={(_, value) => {
          if (value) {
            setSearchValue(value);
          }
        }}
        onInputChange={(_, value) => {
          setSearchValue(value);
        }}
        value={searchValue}
        inputValue={searchValue}
        freeSolo
        renderInput={({ InputProps, ...rest }) => {
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
        options={[...tags.map((tag) => `#${tag.name}`)]}
      />
    </Box>
  );
};
