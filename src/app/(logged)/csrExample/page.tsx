'use client';

import React from 'react';
import { useLogout } from '../../../stores/hooks/user.hooks';
import Button from '@mui/material/Button';

function HomePage() {
  const logout = useLogout();

  return (
    <div>
      <h1>Home Page</h1>
      <Button
        variant="contained"
        onClick={() => {
          logout.mutate();
        }}
      >
        Logout
      </Button>
    </div>
  );
}

export default HomePage;
