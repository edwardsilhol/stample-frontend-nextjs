import { fetchTeam, fetchTeams } from '../api/team.api';
import { useQuery } from '@tanstack/react-query';
import { getSortedTeams } from '../../helpers/team.helper';

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
