export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export type SignInDTO = {
  email: string;
  password: string;
};

export type SignUpDTO = {
  firstName: string;
  lastName: string;
  email: string;
  locale: string;
  password: string;
};

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  locale: string;
  isAdmin: boolean;
  profilePictureUrl?: string;
}

export type UserForOtherClient = Pick<
  User,
  '_id' | 'firstName' | 'lastName' | 'profilePictureUrl'
>;

export enum LocalRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export type UserAndPermissions = {
  user: string;
  role: LocalRole;
};

export type PopulatedUserAndPermissions = {
  user: UserForOtherClient;
  role: LocalRole;
};
