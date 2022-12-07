'use client';

import React from 'react';
import SignInForm from '../../../components/forms/auth/SignInForm';
import Typography from '@mui/material/Typography';

function SignInPage() {
  return (
    <>
      <Typography variant="additionalVariant">Sign In</Typography>
      <SignInForm />
    </>
  );
}

export default SignInPage;
