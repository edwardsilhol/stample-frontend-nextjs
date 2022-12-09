'use client';

import React, { ReactNode } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const useStyles = () => ({
  leftContainer: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
});
interface Props {
  children: ReactNode;
}

function AuthLayout({ children }: Props) {
  const classes = useStyles();
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={false} sm={false} md={8} sx={classes.leftContainer} />
      <Grid item xs={12} sm={12} md={4} component={Paper} elevation={6} square>
        {children}
      </Grid>
    </Grid>
  );
}
export default AuthLayout;
