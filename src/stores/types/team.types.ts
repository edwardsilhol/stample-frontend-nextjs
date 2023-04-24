import { PopulatedUserAndPermissions, UserAndPermissions } from './user.types';

export interface Team {
  _id: string;
  name: string;
  users: UserAndPermissions[];
  tags: string[];
  isPersonal: boolean;
  createdAt: Date;
}

export interface PopulatedTeam extends Omit<Team, 'users'> {
  users: PopulatedUserAndPermissions[];
}

export type CreateTeamDTO = Pick<Team, 'name' | 'tags'>;
export type UpdateTeamDTO = Partial<CreateTeamDTO>;
