'use client';

import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

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
    <div>
      <Alert severity="error">
        <strong>Something went wrong!</strong>
      </Alert>
      <Button variant="contained" color="primary" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
