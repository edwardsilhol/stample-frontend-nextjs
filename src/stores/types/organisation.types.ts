import { AddRemoveDto } from './other.types';
import { Team } from './team.types';
import { PopulatedUserAndPermissions, UserAndPermissions } from './user.types';

export type Organisation = {
  _id: string;
  name: string;
  active: boolean;
  teams: string[];
  users: UserAndPermissions[];
  createdAt: Date;
  updatedAt: Date;
};

export type PopulatedOrganisation = Omit<Organisation, 'users' | 'teams'> & {
  users: PopulatedUserAndPermissions[];
  teams: Team[];
};

export type CreateOrganisationDTO = Omit<
  Organisation,
  'teams' | 'users' | '_id' | 'createdAt' | 'updatedAt'
>;
export type UpdateOrganisationDTO = Partial<
  Pick<Organisation, 'name' | 'active'>
> &
  AddRemoveDto<Partial<Pick<Organisation, 'teams' | 'users'>>>;
