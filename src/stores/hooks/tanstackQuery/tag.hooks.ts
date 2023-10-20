import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTag,
  fetchDocumentsCountPerTag,
  fetchTags,
  fetchTagsByTeam,
  updateTag,
} from '../../api/tag.api';
import { CreateTagDTO, HooksUpdateTagDTO } from '../../types/tag.types';
import { useSelectedTeamId } from 'stores/hooks/jotai/team.hooks';

export const useAllTags = () => {
  return useQuery({
    queryKey: ['Tags'],
    queryFn: fetchTags,
    initialData: { rich: [], raw: [] },
  });
};

export const useTagsByTeam = (teamId: string | null) => {
  return useQuery({
    queryKey: ['Tags', { teamId }],
    queryFn: () => (teamId ? fetchTagsByTeam(teamId) : { rich: [], raw: [] }),
    initialData: { rich: [], raw: [] },
  });
};

export const useSelectedTeamTags = () => {
  const [selectedTeamId] = useSelectedTeamId();
  return useTagsByTeam(selectedTeamId);
};

export const useDocumentsCountPerTag = () => {
  const [selectedTeamId] = useSelectedTeamId();
  return useQuery({
    queryKey: ['DocumentsCountPerTag', { teamId: selectedTeamId }],
    queryFn: () =>
      selectedTeamId ? fetchDocumentsCountPerTag(selectedTeamId) : {},
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
      await queryClient.invalidateQueries({ queryKey: ['Tags'] });
    },
  });
};
