import { SignInDTO, SignUpDTO, Tokens, User } from '../types/user';
import {
  apiRequest,
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '../../utils/api';

const setAccessRefreshTokenAndGetUser = (
  accessToken: string,
  refreshToken?: string,
) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
  }

  return apiRequest<User>('GET', '/auth/user');
};

export const signIn = async (payload: SignInDTO): Promise<User> => {
  const { accessToken, refreshToken } = await apiRequest<Tokens>(
    'PUT',
    '/auth/signIn',
    undefined,
    payload,
  );

  return await setAccessRefreshTokenAndGetUser(accessToken, refreshToken);
};

export const signUp = async (payload: SignUpDTO) => {
  const { accessToken, refreshToken } = await apiRequest<Tokens>(
    'POST',
    '/auth/signUp',
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
    return await apiRequest<User>('GET', '/auth/user');
  } catch (error) {
    return null;
  }
};
