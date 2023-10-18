import { fetchTeam, fetchTeams } from '../api/team.api';
import { getSortedTeams } from '@src/helpers/team.helper';
import { useQuery } from '@tanstack/react-query';

export const useTeam = (teamId: string | null) => {
  return useQuery(['team', { teamId }], () =>
    teamId ? fetchTeam(teamId) : null,
  );
};

export const useAllTeams = () =>
  useQuery(['allTeams'], fetchTeams, {
    initialData: [],
    select: getSortedTeams,
  });
