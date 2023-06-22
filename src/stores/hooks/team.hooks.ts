import {
  answerInvitation,
  createTeam,
  fetchTeam,
  fetchTeamByInvitation,
  fetchTeams,
  updateTeam,
} from '../api/team.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AnswerInvitationDTO,
  CreateTeamDTO,
  UpdateTeamDTO,
} from '../types/team.types';
import { getSortedTeams } from 'helpers/team.helper';

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

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      teamId,
      updateTeamDto,
    }: {
      teamId: string;
      updateTeamDto: UpdateTeamDTO;
    }) => updateTeam(teamId, updateTeamDto),
    {
      onSuccess: (_, { teamId }) => {
        queryClient.invalidateQueries(['team', { teamId }]);
      },
    },
  );
};

export const useTeamByInvitation = (teamId: string) => {
  return useQuery(['teamByInvitation', { teamId }], () =>
    fetchTeamByInvitation(teamId),
  );
};

export const useAnswerInvitation = () => {
  return useMutation(
    ({
      teamId,
      answerInvitationDto,
    }: {
      teamId: string;
      answerInvitationDto: AnswerInvitationDTO;
    }) => answerInvitation(teamId, answerInvitationDto),
  );
};
