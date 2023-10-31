'use client';

import Invitation from '../../../../../components/cards/Invitation';
import { useTeamByInvitation } from '../../../../../stores/hooks/team.hooks';
import CircularLoading from '../../../../../components/base/circularLoading';
import { useEffect } from 'react';
import { notFound } from 'next/navigation';
interface Props {
  params: {
    teamId: string;
  };
}
function InvitationPage({ params: { teamId } }: Props) {
  const { data: team, isLoading } = useTeamByInvitation(teamId);

  useEffect(() => {
    if (!isLoading) {
      ((team && team.isPersonal) || !team) && notFound();
    }
  }, [isLoading, team]);

  return !isLoading && team ? <Invitation team={team} /> : <CircularLoading />;
}

export default InvitationPage;
