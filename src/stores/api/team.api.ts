import {
  CreateTeamDTO,
  Team,
  PopulatedTeam,
  UpdateTeamDTO,
  AnswerInvitationDTO,
  SendNewsletterDto,
} from '../types/team.types';
import { apiRequest } from '../../utils/api';

export const fetchTeam = async (teamId: string): Promise<PopulatedTeam> => {
  return apiRequest<PopulatedTeam>('GET', '/team/' + teamId);
};

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    return await apiRequest<Team[]>('GET', '/team/all');
  } catch (error) {
    return [];
  }
};

export const createTeam = async (
  createTeamDto: CreateTeamDTO,
): Promise<Team> => {
  return await apiRequest<Team>('POST', '/team', undefined, createTeamDto);
};

export const updateTeam = async (
  teamId: string,
  updateTeamDto: UpdateTeamDTO,
): Promise<Team> => {
  return await apiRequest<Team>(
    'PATCH',
    `/team/${teamId}`,
    undefined,
    updateTeamDto,
  );
};
export const fetchTeamByInvitation = async (
  teamId: string,
): Promise<Team | null> => {
  return await apiRequest<Team>('GET', `/team/${teamId}/invitation`);
};

export const answerInvitation = async (
  teamId: string,
  answerInvitationDto: AnswerInvitationDTO,
): Promise<Team> => {
  return await apiRequest<Team>(
    'PATCH',
    `/team/${teamId}/invitation`,
    undefined,
    answerInvitationDto,
  );
};

export const sendNewsletter = async ({
  teamId,
  sendNewsletterDto,
}: {
  teamId: string;
  sendNewsletterDto: SendNewsletterDto;
}) => {
  return await apiRequest(
    'POST',
    `/team/${teamId}/newsletter`,
    undefined,
    sendNewsletterDto,
  );
};

export const summarizeTeamDocuments = async (
  teamId: string,
  tagId?: string,
) => {
  return await apiRequest<Document[]>(
    'POST',
    `/team/${teamId}/summary`,
    tagId ? { tagId } : undefined,
  );
};

export const leaveTeam = async (teamId: string): Promise<Team> => {
  return await apiRequest<Team>('POST', `/team/${teamId}/leave`);
};
