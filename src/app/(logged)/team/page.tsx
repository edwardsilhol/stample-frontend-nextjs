'use client';

import { useAllTeams } from '../../../stores/hooks/team.hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TAG_ROUTE, TEAM_ROUTE } from '../../../constants/routes.constant';

function MainPage() {
  const router = useRouter();
  const { data: teams, isLoading } = useAllTeams();
  useEffect(() => {
    if (teams && teams.length > 0 && !isLoading) {
      const defaultTeam = teams.find((team) => team.isPersonal);
      router.push(`${TEAM_ROUTE}/${defaultTeam?._id || teams[0]._id}`);
    }
  }, [teams, isLoading]);
  return <></>;
}

export default MainPage;
