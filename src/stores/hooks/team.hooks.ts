import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  answerInvitation,
  createTeam,
  fetchTeam,
  fetchTeamByInvitation,
  fetchTeams,
  sendNewsletter,
  summarizeTeamDocuments,
  updateTeam,
} from '../api/team.api';
import { getSortedTeams } from '../../utils/team.helper';
import {
  AnswerInvitationDTO,
  CreateTeamDTO,
  UpdateTeamDTO,
} from '../types/team.types';

export const useTeam = (teamId?: string | null) => {
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (createTeamDto: CreateTeamDTO) => createTeam(createTeamDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['allTeams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      updateTeamDto,
    }: {
      teamId: string;
      updateTeamDto: UpdateTeamDTO;
    }) => updateTeam(teamId, updateTeamDto),
    onSuccess: async (team) => {
      await queryClient.setQueryData(['team', { teamId: team._id }], team);
      await queryClient.invalidateQueries({ queryKey: ['allTeams'] });
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

export const useSendNewsletter = (teamId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendNewsletter,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'documents',
          {
            query: {
              team: teamId,
            },
          },
        ],
      });
    },
  });
};

export const useSummarizeTeamDocuments = () => {
  const queryClient = useQueryClient();
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
