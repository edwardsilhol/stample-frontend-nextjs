'use client';

import { ReactNode } from 'react';
import { RouteParams } from '../../../../stores/types/global.types';
import { useTeam } from '../../../../stores/hooks/team.hooks';
import { notFound } from 'next/navigation';
interface Props {
  children: ReactNode;
  params: RouteParams;
}
function TeamLayout({ children, params: { teamId } }: Props) {
  const { data: team, isLoading } = useTeam(teamId);

  if (!team && !isLoading) {
    notFound();
  }

  return !isLoading && team ? <>{children}</> : null;
}

export default TeamLayout;
