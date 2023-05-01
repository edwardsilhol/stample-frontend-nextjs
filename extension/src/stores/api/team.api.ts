import { CreateTeamDTO, Team, PopulatedTeam } from '../types/team.types';
import { apiRequest } from '../../utils/api';

export const fetchTeam = async (
  teamId: string,
): Promise<PopulatedTeam | null> => {
  try {
    return await apiRequest<PopulatedTeam>('GET', '/team/' + teamId);
  } catch (error) {
    return null;
  }
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
