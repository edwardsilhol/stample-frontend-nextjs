import { createTeam, fetchTeam, fetchTeams } from '../api/team.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateTeamDTO } from '../types/team.types';
import { getSortedTeams } from 'helpers/team.helper';

export const useTeam = (teamId: string) => {
  return useQuery(['team', { teamId }], () => fetchTeam(teamId));
};

export const useAllTeams = () =>
  useQuery(['allTeams'], fetchTeams, {
    initialData: [],
    select: getSortedTeams,
  });

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (createTeamDto: CreateTeamDTO) => createTeam(createTeamDto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['allTeams']);
      },
    },
  );
};
