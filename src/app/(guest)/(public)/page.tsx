'use client';

import React from 'react';
import Typography from '../../../components/muiOverrides/Typography';
import Stack from '../../../components/muiOverrides/Stack';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

function useStyles() {
  return {
    container: {
      height: '100vh',
      my: 8,
      alignItems: 'center',
    },
  };
}

export default function HomePage() {
  const styles = useStyles();
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/signIn');
  };

  const handleSignUp = () => {
    router.push('/signUp');
  };

  return (
    <Stack sx={styles.container} spacing={3}>
      <Typography variant="h1">Welcome to Stample!</Typography>
      <Stack direction="row" spacing={3}>
        <Button variant="contained" onClick={handleSignIn}>
          Sign In
        </Button>
        <Button variant="outlined" onClick={handleSignUp}>
          Sign Up
        </Button>
      </Stack>
    </Stack>
  );
}
