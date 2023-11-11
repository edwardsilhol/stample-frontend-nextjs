import {
  LocalRole,
  PopulatedUserAndPermissions,
  UserAndPermissions,
} from './user.types';
interface Invitation {
  email: string;
  role: LocalRole;
}
export interface Team {
  _id: string;
  name: string;
  users: UserAndPermissions[];
  invitations: Invitation[];
  tags: string[];
  isPersonal: boolean;
  createdAt: Date;
}

export interface PopulatedTeam extends Omit<Team, 'users'> {
  users: PopulatedUserAndPermissions[];
}

export type CreateTeamDTO = Pick<Team, 'name' | 'invitations'>;

export type AddRemoveDTO = {
  users?: string[];
  tags?: string[];
};

export type UpdateTeamDTO = Partial<
  Pick<Team, 'name' | 'users' | 'invitations'>
> & {
  add?: AddRemoveDTO;
  remove?: AddRemoveDTO;
};
export type AnswerInvitationDTO = {
  accept: boolean;
};

export type SendNewsletterDto = {
  title: string;
  intro: string;
  conclusion: string;
};
