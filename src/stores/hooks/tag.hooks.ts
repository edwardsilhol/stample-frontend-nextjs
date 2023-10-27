import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTag,
  fetchDocumentsCountPerTag,
  fetchTagsByTeam,
  updateTag,
} from '../api/tag.api';
import { CreateTagDTO, HooksUpdateTagDTO } from '../types/tag.types';

export const useTagsByTeam = (teamId: string | null) => {
  return useQuery({
    queryKey: ['tags', { teamId }],
    queryFn: () => (teamId ? fetchTagsByTeam(teamId) : { rich: [], raw: [] }),
    initialData: { rich: [], raw: [] },
  });
};

export const useDocumentsCountPerTagByTeam = (teamId: string | null) => {
  return useQuery({
    queryKey: ['documentsCountPerTag', { teamId: teamId }],
    queryFn: () => (teamId ? fetchDocumentsCountPerTag(teamId) : {}),
    initialData: {},
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      tagCreationDTO,
    }: {
      teamId: string;
      tagCreationDTO: CreateTagDTO;
    }) => {
      return createTag(teamId, tagCreationDTO);
    },
    onSuccess: async (_, { teamId }) => {
      await queryClient.invalidateQueries({ queryKey: ['Tags', { teamId }] });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, payload }: HooksUpdateTagDTO) =>
      updateTag(tagId, payload),
    onSuccess: async (tag) => {
      console.log('successfully updated:', tag);
      await queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
