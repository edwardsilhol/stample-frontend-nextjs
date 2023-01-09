import React from 'react';
import Box from '../muiOverrides/Box';
import AppBar from '../muiOverrides/AppBar';
import AddDocumentButton from '../buttons/addDocumentButton/AddDocumentButton';
import Button from '../muiOverrides/Button';
import IosShareIcon from '../muiOverrides/IosShareIcon';

function useStyles() {
  return {
    topbar: {
      backgroundColor: 'primary.contrastText',
      alignItems: 'right',
    },
  };
}
function GeneralTopbar() {
  const styles = useStyles();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative" sx={styles.topbar}>
        <Box
          p={1}
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Button variant="outlined" startIcon={<IosShareIcon />}>
            Partager
          </Button>
          <AddDocumentButton />
        </Box>
      </AppBar>
    </Box>
  );
}

export default GeneralTopbar;
