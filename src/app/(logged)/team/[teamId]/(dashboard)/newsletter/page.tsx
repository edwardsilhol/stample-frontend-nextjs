'use client';

import SendNewsletterButton from '../../../../../../components/buttons/sendNewsletterButton';
import Stack from '@mui/material/Stack';
import { notFound } from 'next/navigation';
import { useTeam } from '../../../../../../stores/hooks/team.hooks';
import CircularLoading from '../../../../../../components/base/circularLoading';
import { useEffect } from 'react';

interface NewsletterPageProps {
  params: {
    teamId: string;
  };
}

function NewsletterPage({ params: { teamId } }: NewsletterPageProps) {
  const { data: team, isLoading } = useTeam(teamId);

  useEffect(() => {
    !isLoading && (!team || (team && team.isPersonal)) && notFound();
  }, [isLoading, team]);
  return !isLoading && team ? (
    <Stack justifyContent="center" alignItems="center" width="100%">
      <SendNewsletterButton teamId={teamId} />
    </Stack>
  ) : (
    <CircularLoading />
  );
}

export default NewsletterPage;
