import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTag, fetchTags, updateTag } from '../api/tag.api';
import { CreateTagDTO, HooksUpdateTagDTO } from '../types/tag.types';

export const useTags = () => {
  return useQuery(['Tags'], fetchTags, {
    initialData: {
      richTags: [],
      flatTags: [],
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (tagCreationDTO: CreateTagDTO) => createTag(tagCreationDTO),
    {
      onSuccess: (tag) => {
        console.log('successfully created:', tag);
        queryClient.invalidateQueries(['Tags']);
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
        queryClient.invalidateQueries(['Tags']);
      },
    },
  );
};
