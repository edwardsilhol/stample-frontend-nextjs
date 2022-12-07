import { stringify } from 'query-string';
import { Mutex } from 'async-mutex';
import { fetchTimeout } from './fetchTimeout';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '../constants/tokenConfig';

const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;

export type HTTPMethod =
  | 'CONNECT'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'PUT'
  | 'POST'
  | 'TRACE';

type AccessTokenRefreshToken = {
  accessToken: string;

  refreshToken?: string;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(errorMessage: string, statusCode: number) {
    super(errorMessage);

    this.statusCode = statusCode;
  }
}

const refreshTokenMutex = new Mutex();

export const apiRequest = async <T>(
  method: HTTPMethod,
  endpoint: string,
  params?: Record<string, string>,
  body?: FormData | Record<string, unknown>,
  nextConfig?: RequestInit,
  isFile?: boolean,
) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  let query = API_URL + endpoint;

  if (params) {
    query += '?' + stringify(params);
  }

  const fetchConfig: any = {
    method,
    headers: {
      Accept: 'application/json',
    },
    ...nextConfig,
  };

  if (accessToken) {
    fetchConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (body && !isFile) {
    if (body instanceof FormData) {
      fetchConfig.body = body;
      fetchConfig.headers['Content-Type'] = 'multipart/form-data';
    } else {
      fetchConfig.body = JSON.stringify(body);
      fetchConfig.headers['Content-Type'] = 'application/json';
    }
  } else {
    fetchConfig.body = body;
  }

  let response = await fetchTimeout(query, fetchConfig);
  let bodyResult;
  if (response.status !== 204) {
    bodyResult = await response.json();
  }

  if (!response.ok) {
    /* Logs message if Bad request */
    if (response.status === 400) {
      console.log('ERROR Api bad request:', bodyResult?.message);
    }
    /* Try to use refresh token if exists */
    if (response.status === 401 && refreshToken) {
      const tokens = await (refreshTokenMutex.isLocked()
        ? refreshTokenMutex.waitForUnlock().then(() => ({
            accessToken: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY),
            refreshToken: localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY),
          }))
        : handleRefreshToken(refreshToken));

      if (tokens?.accessToken) {
        fetchConfig.headers.Authorization = `Bearer ${tokens.accessToken}`;
        response = await fetchTimeout(query, fetchConfig);
        if (response.status !== 204) {
          bodyResult = await response.json();
        }

        if (response.ok) {
          return bodyResult as T;
        }
      }
    }
    throw new ApiError(bodyResult.message, response.status);
  }
  return bodyResult as T;
};

const handleRefreshToken = async (
  refreshToken: string,
): Promise<AccessTokenRefreshToken | null> => {
  const release = await refreshTokenMutex.acquire();

  try {
    const response = await fetchTimeout(API_URL + '/auth/refresh', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    const bodyResult = await response.json();

    if (response.ok) {
      localStorage.setItem(
        LOCAL_STORAGE_ACCESS_TOKEN_KEY,
        bodyResult.accessToken,
      );

      if (bodyResult.refreshToken) {
        localStorage.setItem(
          LOCAL_STORAGE_REFRESH_TOKEN_KEY,
          bodyResult.refreshToken,
        );
      }
      return bodyResult;
    }
  } finally {
    release();
  }
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  return null;
};
