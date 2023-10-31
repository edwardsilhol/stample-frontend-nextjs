'use client';

import Invitation from '../../../../../components/cards/Invitation';
import { useTeamByInvitation } from '../../../../../stores/hooks/team.hooks';
import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import CircularLoading from '../../../../../components/base/circularLoading';
interface Props {
  params: {
    teamId: string;
  };
}
function InvitationPage({ params: { teamId } }: Props) {
  const { data: team, isLoading } = useTeamByInvitation(teamId);

  useEffect(() => {
    !isLoading && !team && notFound();
  }, [isLoading, team]);

  return !isLoading && team ? <Invitation team={team} /> : <CircularLoading />;
}

export default InvitationPage;
