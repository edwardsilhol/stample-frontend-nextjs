import { useSearchDocumentsQuery } from 'stores/hooks/jotai/document.hooks';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Search from '@mui/icons-material/Search';

function CustomSearchBar() {
  const [searchDocumentsQuery, setSearchDocumentsQuery] =
    useSearchDocumentsQuery();
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
          setSearchDocumentsQuery(e.target.value);
        }}
        value={searchDocumentsQuery ?? ''}
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
