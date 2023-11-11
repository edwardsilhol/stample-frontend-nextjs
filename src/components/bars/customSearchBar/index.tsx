'use client';

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Search from '@mui/icons-material/Search';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SEARCH_QUERY_PARAM } from '../../../constants/queryParams.constant';
import { debounce } from 'lodash';
import { useState } from 'react';

function CustomSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get(SEARCH_QUERY_PARAM);
  const [searchQueryState, setSearchQueryState] = useState<string | null>(
    searchQuery,
  );

  const handleSearch = debounce(() => {
    router.push(`${pathname}?${SEARCH_QUERY_PARAM}=${searchQueryState}`);
  }, 200);

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
      <InputBase
        onChange={(e) => {
          setSearchQueryState(e.target.value);
        }}
        onKeyUp={handleSearch}
        value={searchQueryState ?? ''}
        startAdornment={<Search sx={{ fontSize: '20px', color: '#737373' }} />}
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
    </Box>
  );
}

export default CustomSearchBar;
