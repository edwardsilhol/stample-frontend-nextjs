'use client';

import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('caught error');
    console.error(error);
  }, [error]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ textAlign: 'center', pt: 8 }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
      <Typography variant="h1" color="textPrimary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        {error.toString()}
      </Typography>
      <Button
        component={Link}
        variant="contained"
        href="/"
        sx={{ mt: 3, bgcolor: 'primary.main' }}
      >
        Back
      </Button>
      <Button onClick={() => reset()}>Retry</Button>
    </Container>
  );
}
