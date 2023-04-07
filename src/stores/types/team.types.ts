import { UserForOtherClient } from './user.types';

export interface Team {
  _id: string;
  name: string;
  users: string[];
  tags: string[];
  isPersonal: boolean;
  createdAt: Date;
}

export interface PopulatedTeam extends Omit<Team, 'users'> {
  users: UserForOtherClient[];
}

export type CreateTeamDTO = Pick<Team, 'name' | 'tags'>;
