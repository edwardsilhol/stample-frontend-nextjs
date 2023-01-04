import { SignInDTO, SignUpDTO, Tokens, User } from '../types/user.types';
import { apiRequest } from '../../utils/api';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '../../constants/tokenConfig';

const setAccessRefreshTokenAndGetUser = (
  accessToken: string,
  refreshToken?: string,
) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
  }

  return fetchSession();
};

export const signIn = async (payload: SignInDTO): Promise<User | null> => {
  const { accessToken, refreshToken } = await apiRequest<Tokens>(
    'PUT',
    '/auth/signInLocal',
    undefined,
    payload,
  );

  return await setAccessRefreshTokenAndGetUser(accessToken, refreshToken);
};

export const signUp = async (payload: SignUpDTO) => {
  const { accessToken, refreshToken } = await apiRequest<Tokens>(
    'POST',
    '/auth/signUpLocal',
    undefined,
    payload,
  );
  return await setAccessRefreshTokenAndGetUser(accessToken, refreshToken);
};

export const fetchSession = async (): Promise<User | null> => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return null;
  }

  try {
    return await apiRequest<User>('GET', '/auth/session');
  } catch (error) {
    return null;
  }
};
