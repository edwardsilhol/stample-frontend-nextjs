import React, { useEffect } from 'react';
import { useSession } from '@src/stores/hooks/user.hooks';
import SignInForm from '@src/components/forms/auth/signInForm/SignInForm';
import { WebClipper } from '@src/components/webClipper/WebClipper';
import { Box } from '@mui/material';

const Popup = () => {
  const { data: user } = useSession();
  if (user) {
    return <WebClipper />;
  }
  return <SignInForm />;
};

export default Popup;
