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
  profilePictureUrl?: string;
  email: string;
  phoneNumber?: string;
  locale: string;
  password: string;
};

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  email: string;
  phoneNumber?: string;
  locale: string;
  isAdmin: boolean;
  isActiveAccount?: boolean;
}
