'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useSendNewsletter } from '../../../stores/hooks/team.hooks';

interface SendNewsletterButtonProps {
  teamId: string;
}
function SendNewsletterButton({ teamId }: SendNewsletterButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sendNewsletter = useSendNewsletter();

  const handleClick = async () => {
    setLoading(true);
    sendNewsletter.mutate(teamId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setDone(true);

    setTimeout(() => {
      setDone(false);
    }, 2000);
  };

  return (
    <Button
      variant="contained"
      color={done ? 'success' : 'primary'}
      disabled={loading}
      onClick={handleClick}
      endIcon={loading ? <CircularProgress size={20} /> : null}
    >
      {done ? 'Done!' : 'Send newsletter'}
    </Button>
  );
}

export default SendNewsletterButton;
