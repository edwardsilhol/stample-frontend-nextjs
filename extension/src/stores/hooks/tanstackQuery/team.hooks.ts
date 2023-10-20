import { fetchTeam, fetchTeams } from '../../api/team.api';
import { getSortedTeams } from '@src/helpers/team.helper';
import { useQuery } from '@tanstack/react-query';

export const useTeam = (teamId: string | null) => {
  return useQuery({
    queryKey: ['team', { teamId }],
    queryFn: () => (teamId ? fetchTeam(teamId) : null),
  });
};

export const useAllTeams = () =>
  useQuery({
    queryKey: ['allTeams'],
    queryFn: fetchTeams,
    initialData: [],
    select: getSortedTeams,
  });
