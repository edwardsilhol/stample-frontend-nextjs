import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTag,
  fetchRawTags,
  fetchRichTags,
  updateTag,
} from '../api/tag.api';
import { CreateTagDTO, HooksUpdateTagDTO } from '../types/tag.types';

export const useRichTags = () => {
  return useQuery(['richTags'], fetchRichTags, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchInterval: 1000 * 60 * 2,
  });
};
export const useRawTags = () => {
  return useQuery(['rawTags'], fetchRawTags, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchInterval: 1000 * 60 * 2,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (tagCreationDTO: CreateTagDTO) => createTag(tagCreationDTO),
    {
      onSuccess: (tag) => {
        console.log('successfully created:', tag);
        queryClient.invalidateQueries(['rawTags']);
        queryClient.invalidateQueries(['richTags']);
      },
    },
  );
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ tagId, payload }: HooksUpdateTagDTO) => updateTag(tagId, payload),
    {
      onSuccess: (tag) => {
        console.log('successfully updated:', tag);
        queryClient.invalidateQueries(['rawTags']);
        queryClient.invalidateQueries(['richTags']);
      },
    },
  );
};
