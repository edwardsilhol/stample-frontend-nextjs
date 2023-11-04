'use client';

import { notFound } from 'next/navigation';
import { useTeam } from '../../../../../../stores/hooks/team.hooks';
import CircularLoading from '../../../../../../components/base/circularLoading';
import { useEffect } from 'react';
import NewsletterForm from '../../../../../../components/forms/newsletter/newsletterForm';
import { useSession } from '../../../../../../stores/hooks/user.hooks';
import { LocalRole } from '../../../../../../stores/types/user.types';
import { useSearchDocuments } from '../../../../../../stores/hooks/document.hooks';
import Stack from '@mui/material/Stack';
import { useIsMobile } from '../../../../../../utils/hooks/useIsMobile';

interface NewsletterPageProps {
  params: {
    teamId: string;
  };
}

function NewsletterPage({ params: { teamId } }: NewsletterPageProps) {
  const isMobile = useIsMobile();
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
    <Stack
      direction="column"
      flex={1}
      sx={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: '100%',
      }}
      paddingX={2}
      paddingTop={isMobile ? 0 : 7}
    >
      <NewsletterForm
        teamId={teamId}
        documents={documents.pages.flatMap((page) => page.documents)}
      />
    </Stack>
  ) : (
    <CircularLoading />
  );
}

export default NewsletterPage;
