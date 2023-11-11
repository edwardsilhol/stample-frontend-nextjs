import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  answerInvitation,
  createTeam,
  fetchTeam,
  fetchTeamByInvitation,
  fetchTeams,
  leaveTeam,
  sendNewsletter,
  updateTeam,
} from '../api/team.api';
import { getSortedTeams } from '../../utils/team';
import {
  AnswerInvitationDTO,
  CreateTeamDTO,
  Team,
  UpdateTeamDTO,
} from '../types/team.types';
import { documentQueryKey } from './document.hooks';

const teamQueryKey = {
  base: ['team'],
  all: ['teams'],
  one: (teamId: string) => [...teamQueryKey.base, { teamId }],
  invitation: (teamId: string) => [
    ...teamQueryKey.base,
    'invitation',
    { teamId },
  ],
};
export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: teamQueryKey.one(teamId),
    queryFn: () => fetchTeam(teamId),
  });
};

export const useTeamByInvitation = (teamId: string) => {
  return useQuery({
    queryKey: teamQueryKey.invitation(teamId),
    queryFn: () => fetchTeamByInvitation(teamId),
  });
};

export const useAllTeams = () => {
  return useQuery({
    queryKey: teamQueryKey.all,
    queryFn: fetchTeams,
    initialData: [],
    select: getSortedTeams,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (createTeamDto: CreateTeamDTO) => createTeam(createTeamDto),
    onSuccess: async (team) => {
      await queryClient.setQueryData(teamQueryKey.all, (oldTeams?: Team[]) => [
        ...(oldTeams ?? []),
        team,
      ]);
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
      await queryClient.invalidateQueries({
        queryKey: teamQueryKey.one(team._id),
      });
      await queryClient.setQueryData(teamQueryKey.all, (oldTeams?: Team[]) => {
        if (oldTeams) {
          return oldTeams.map((oldTeam) =>
            oldTeam._id === team._id ? team : oldTeam,
          );
        }
      });
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
        queryKey: documentQueryKey.search({ team: teamId }),
      });
    },
  });
};

export const useLeaveTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveTeam,
    onSuccess: async (team) => {
      await queryClient.invalidateQueries({
        queryKey: teamQueryKey.one(team._id),
      });
      await queryClient.setQueryData(teamQueryKey.all, (oldTeams?: Team[]) => {
        if (oldTeams) {
          return oldTeams.filter((oldTeam) => oldTeam._id !== team._id);
        }
      });
    },
  });
};
