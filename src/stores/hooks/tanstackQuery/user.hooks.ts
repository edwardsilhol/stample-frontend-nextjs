'use client';

import { fetchSession, signIn, signUp } from '../../api/user.api';

import { SignInDTO, SignUpDTO } from '../../types/user.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '../../../constants/tokenConfig.constant';
import { QUERY_KEY_SESSION } from '../../../constants/reactQuery.constant';

export const useSession = () => {
  return useQuery({
    queryKey: [QUERY_KEY_SESSION],
    queryFn: fetchSession,
    gcTime: Infinity,
    staleTime: Infinity,
    refetchInterval: 1000 * 60 * 2,
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (signInDTO: SignInDTO) => signIn(signInDTO),
    onSuccess: (user) => {
      queryClient.setQueryData([QUERY_KEY_SESSION], user);
    },
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (signUpDTO: SignUpDTO) => signUp(signUpDTO),
    onSuccess: (user) => {
      queryClient.setQueryData([QUERY_KEY_SESSION], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
      await queryClient.invalidateQueries({ queryKey: ['session'] });
      queryCache.clear();
    },
  });
};
