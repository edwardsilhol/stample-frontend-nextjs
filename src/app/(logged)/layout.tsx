'use client';

import { ReactNode, useEffect } from 'react';
import LoggedAuthProvider from '../../providers/LoggedAuthProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useAllTeams } from '../../stores/hooks/team.hooks';
import { TEAM_ROUTE } from '../../constants/routes.constant';

interface Props {
  children: ReactNode;
}
function LoggedLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: teams, isLoading } = useAllTeams();
  useEffect(() => {
    if (pathname === TEAM_ROUTE && teams && teams.length > 0 && !isLoading) {
      const defaultTeam = teams.find((team) => team.isPersonal);
      router.push(`${TEAM_ROUTE}/${defaultTeam?._id || teams[0]._id}`);
    }
  }, [teams, isLoading, pathname]);

  return <LoggedAuthProvider>{children}</LoggedAuthProvider>;
}

export default LoggedLayout;
