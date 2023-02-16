'use client';

import React from 'react';
import Typography from '../../../components/muiOverrides/Typography';
import Link from 'next/link';
import Stack from '../../../components/muiOverrides/Stack';
import Button from '@mui/material/Button';

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

  return (
    <Stack sx={styles.container} spacing={3}>
      <Typography variant="h1">Welcome to Stample!</Typography>
      <Stack direction="row" spacing={3}>
        <Link href="/signIn" passHref>
          <Button variant="contained">Sign In</Button>
        </Link>
        <Link href="/signUp" passHref>
          <Button variant="outlined">Sign Up</Button>
        </Link>
      </Stack>
    </Stack>
  );
}
