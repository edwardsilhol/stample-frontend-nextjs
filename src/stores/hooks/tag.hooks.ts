import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTag,
  fetchDocumentsCountPerTag,
  fetchTagsByTeam,
  updateTag,
} from '../api/tag.api';
import { CreateTagDTO, HooksUpdateTagDTO } from '../types/tag.types';
import { useParams } from 'next/navigation';
import { RouteParams } from '../types/global.types';

const tagQueryKey = {
  base: ['tag'],
  all: ['tags'],
  byTeam: (teamId: string) => [...tagQueryKey.all, { teamId }],
  documentsCountPerTag: (teamId: string) => [
    ...tagQueryKey.all,
    'documentsCountPerTag',
    { teamId },
  ],
};

export const useTagsByTeam = (teamId: string) => {
  return useQuery({
    queryKey: tagQueryKey.byTeam(teamId),
    queryFn: () => fetchTagsByTeam(teamId),
    initialData: {
      raw: [],
      rich: [],
    },
  });
};

export const useDocumentsCountPerTagByTeam = (teamId: string) => {
  return useQuery({
    queryKey: tagQueryKey.documentsCountPerTag(teamId),
    queryFn: () => fetchDocumentsCountPerTag(teamId),
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
      await queryClient.invalidateQueries({
        queryKey: tagQueryKey.byTeam(teamId),
      });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  const { teamId } = useParams<RouteParams>();
  return useMutation({
    mutationFn: ({ tagId, payload }: HooksUpdateTagDTO) =>
      updateTag(tagId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: tagQueryKey.byTeam(teamId),
      });
    },
  });
};
