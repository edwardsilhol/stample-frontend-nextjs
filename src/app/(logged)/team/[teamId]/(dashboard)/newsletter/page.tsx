'use client';

import { notFound } from 'next/navigation';
import { useTeam } from '../../../../../../stores/hooks/team.hooks';
import CircularLoading from '../../../../../../components/base/circularLoading';
import { useEffect } from 'react';
import NewsletterForm from '../../../../../../components/forms/newsletter/newsletterForm';
import { useSession } from '../../../../../../stores/hooks/user.hooks';
import { LocalRole } from '../../../../../../stores/types/user.types';
import { useSearchDocuments } from '../../../../../../stores/hooks/document.hooks';

interface NewsletterPageProps {
  params: {
    teamId: string;
  };
}

function NewsletterPage({ params: { teamId } }: NewsletterPageProps) {
  const { data: loggedUser, isLoading: isLoggedUserLoading } = useSession();
  const { data: team, isLoading: isTeamLoading } = useTeam(teamId);
  const { data: documents, isLoading: isDocumentsLoading } = useSearchDocuments(
    {
      team: teamId,
    },
  );

  useEffect(() => {
    if (!isLoggedUserLoading && !isTeamLoading) {
      const isLoggedUserAnAdminOrOwner =
        loggedUser &&
        team &&
        team.users.find((user) => user.user._id === loggedUser._id)?.role !==
          LocalRole.MEMBER;
      const isTeamPersonal = !team || (team && team.isPersonal);

      (isTeamPersonal || !isLoggedUserAnAdminOrOwner) && notFound();
    }
  }, [isTeamLoading, team, loggedUser, isLoggedUserLoading]);

  return !isTeamLoading &&
    team &&
    !isDocumentsLoading &&
    documents &&
    !isLoggedUserLoading &&
    loggedUser ? (
    <NewsletterForm
      teamId={teamId}
      documents={documents.pages.flatMap((page) => page.documents)}
    />
  ) : (
    <CircularLoading />
  );
}

export default NewsletterPage;
