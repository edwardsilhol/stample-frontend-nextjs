import React from 'react';
import Box from '../muiOverrides/Box';
import AppBar from '../muiOverrides/AppBar';
import AddDocumentButton from '../buttons/addDocumentButton/AddDocumentButton';

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
      <AppBar position="static" sx={styles.topbar}>
        <AddDocumentButton />
      </AppBar>
    </Box>
  );
}

export default GeneralTopbar;
