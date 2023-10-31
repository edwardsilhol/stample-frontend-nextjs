'use client';

import { notFound } from 'next/navigation';
import { useTeam } from '../../../../../../stores/hooks/team.hooks';
import CircularLoading from '../../../../../../components/base/circularLoading';
import { useEffect } from 'react';
import NewsletterForm from '../../../../../../components/forms/newsletter/newsletterForm';
import { useSession } from '../../../../../../stores/hooks/user.hooks';
import { LocalRole } from '../../../../../../stores/types/user.types';

interface NewsletterPageProps {
  params: {
    teamId: string;
  };
}

function NewsletterPage({ params: { teamId } }: NewsletterPageProps) {
  const { data: team, isLoading: isTeamLoading } = useTeam(teamId);
  const { data: loggedUser, isLoading: isLoggedUserLoading } = useSession();

  useEffect(() => {
    const isLoggedUserAnAdminOrOwner =
      !isLoggedUserLoading &&
      loggedUser &&
      team &&
      team.users.find((user) => user.user._id === loggedUser._id)?.role !==
        LocalRole.MEMBER;
    console.log(isLoggedUserAnAdminOrOwner);
    const isTeamPersonal =
      !isTeamLoading && (!team || (team && team.isPersonal));

    (isTeamPersonal || !isLoggedUserAnAdminOrOwner) && notFound();
  }, [isTeamLoading, team, loggedUser, isLoggedUserLoading]);

  return !isTeamLoading && team ? (
    <NewsletterForm teamId={teamId} />
  ) : (
    <CircularLoading />
  );
}

export default NewsletterPage;
