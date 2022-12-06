import { fetchSession, signIn, signUp } from '../api/user.api';

import { SignInDTO, SignUpDTO } from '../types/user.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '../../utils/api';

// Queries

export const useSession = () => {
  return useQuery(['session'], fetchSession, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchInterval: 1000 * 60 * 2,
  });
};

// Mutations

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation((signInDTO: SignInDTO) => signIn(signInDTO), {
    onSuccess: (user) => {
      queryClient.setQueryData(['session'], user);
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation((signUpDTO: SignUpDTO) => signUp(signUpDTO), {
    onSuccess: (user) => {
      queryClient.setQueryData(['session'], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  return useMutation(async () => {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    await queryClient.invalidateQueries(['session']);
    queryCache.clear();
  });
};
