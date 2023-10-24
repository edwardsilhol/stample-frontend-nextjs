import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import {
  answerInvitation,
  createTeam,
  fetchTeam,
  fetchTeamByInvitation,
  fetchTeams,
  summarizeTeamDocuments,
  updateTeam,
} from '../api/team.api';
import { getSortedTeams } from '../../helpers/team.helper';
import {
  AnswerInvitationDTO,
  CreateTeamDTO,
  UpdateTeamDTO,
} from '../types/team.types';

export const useTeam = (teamId: string | null) => {
  return useQuery({
    queryKey: ['team', { teamId }],
    queryFn: () => (teamId ? fetchTeam(teamId) : null),
  });
};

export const useTeamByInvitation = (teamId: string) => {
  return useQuery({
    queryKey: ['teamByInvitation', { teamId }],
    queryFn: () => fetchTeamByInvitation(teamId),
  });
};

export const useAllTeams = () => {
  return useQuery({
    queryKey: ['allTeams'],
    queryFn: fetchTeams,
    initialData: [],
    select: getSortedTeams,
  });
};

export const useCreateTeam = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (createTeamDto: CreateTeamDTO) => createTeam(createTeamDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['allTeams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      updateTeamDto,
    }: {
      teamId: string;
      updateTeamDto: UpdateTeamDTO;
    }) => updateTeam(teamId, updateTeamDto),
    onSuccess: async (_, { teamId }) => {
      await queryClient.invalidateQueries({ queryKey: ['team', { teamId }] });
    },
  });
};

export const useAnswerInvitation = () => {
  return useMutation({
    mutationFn: ({
      teamId,
      answerInvitationDto,
    }: {
      teamId: string;
      answerInvitationDto: AnswerInvitationDTO;
    }) => answerInvitation(teamId, answerInvitationDto),
  });
};

export const useSummarizeTeamDocuments = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: ({ teamId, tagId }: { teamId: string; tagId?: string }) =>
      summarizeTeamDocuments(teamId, tagId),
    onSuccess: async (_, { teamId, tagId }) => {
      await queryClient.invalidateQueries({
        queryKey: [
          'documents',
          {
            searchDocumentsDTO: {
              team: teamId,
              ...(tagId ? { tags: [tagId] } : {}),
            },
          },
        ],
      });
    },
  });
};
