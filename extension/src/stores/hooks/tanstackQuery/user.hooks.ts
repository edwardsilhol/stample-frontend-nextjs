import { fetchSession, signIn, signUp } from '../../api/user.api';

import { SignInDTO, SignUpDTO } from '../../types/user.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@src/constants/tokenConfig';
import { removeChromeStorageVariable } from '@src/utils/chromeStorage';

// Queries

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    gcTime: Infinity,
    staleTime: Infinity,
    refetchInterval: 1000 * 60 * 2,
  });
};

// Mutations

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (signInDTO: SignInDTO) => signIn(signInDTO),
    onSuccess: (user) => {
      queryClient.setQueryData(['session'], user);
    },
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (signUpDTO: SignUpDTO) => signUp(signUpDTO),
    onSuccess: (user) => {
      queryClient.setQueryData(['session'], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  return useMutation({
    mutationFn: async () => {
      await removeChromeStorageVariable(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      await removeChromeStorageVariable(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
      await queryClient.invalidateQueries({ queryKey: ['session'] });
      queryCache.clear();
    },
  });
};
