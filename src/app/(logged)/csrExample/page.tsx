'use client';

import React from 'react';
import { useLogout } from '../../../stores/hooks/user.hooks';
import Button from '@mui/material/Button';
import Box from '../../../components/muiOverrides/Box';
import Typography from '../../../components/muiOverrides/Typography';

function useStyles() {
  return {
    container: {
      height: '100vh',
      my: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };
}

function CSRExample() {
  const styles = useStyles();
  const logout = useLogout();

  return (
    <Box sx={styles.container}>
      <Typography variant="h1">Logged</Typography>
      <Button variant="contained" onClick={() => logout.mutate()}>
        Logout
      </Button>
    </Box>
  );
}

export default CSRExample;
