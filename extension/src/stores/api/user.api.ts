import { SignInDTO, SignUpDTO, Tokens, User } from '../types/user.types';
import { apiRequest } from '@src/utils/api';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@src/constants/tokenConfig';
import {
  getChromeStorageVariable,
  setChromeStorageVariable,
} from '@src/utils/chromeStorage';

const setAccessRefreshTokenAndGetUser = async (
  accessToken: string,
  refreshToken?: string,
) => {
  await setChromeStorageVariable(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    await setChromeStorageVariable(
      LOCAL_STORAGE_REFRESH_TOKEN_KEY,
      refreshToken,
    );
  }

  return fetchSession();
};

export const signIn = async (payload: SignInDTO): Promise<User | null> => {
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
  const accessToken = await getChromeStorageVariable(
    LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  );
  if (!accessToken) {
    return null;
  }

  try {
    return await apiRequest<User>('GET', '/auth/user');
  } catch (error) {
    return null;
  }
};
