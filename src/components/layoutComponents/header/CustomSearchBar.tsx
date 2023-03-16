import React from 'react';
import { InputBase } from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import { Search } from '@mui/icons-material';
import Box from '../../muiOverrides/Box';

interface CustomSearchBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  searchValue,
  setSearchValue,
}) => {
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
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        sx={{
          backgroundColor: '#f6f5f4',
          minWidth: '100px',
          width: '300px',
          maxWidth: '70%',
          height: '100%',
          borderRadius: '4px',
          border: '1px solid rgba(0,0,0,0)',
        }}
      >
        <Search sx={{ height: '20px' }} />
        <InputBase
          sx={{ width: '100%' }}
          placeholder={'Search'}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </Stack>
    </Box>
  );
};
