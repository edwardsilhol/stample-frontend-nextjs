import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTag,
  fetchTags,
  fetchTagsByTeam,
  updateTag,
} from '../api/tag.api';
import { CreateTagDTO, HooksUpdateTagDTO, ViewTags } from '../types/tag.types';
import { useSelectedTeamId } from 'stores/data/team.data';

export const useAllTags = () => {
  return useQuery<ViewTags>(['Tags'], fetchTags, {
    initialData: {
      rich: [],
      raw: [],
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      teamId,
      tagCreationDTO,
    }: {
      teamId: string;
      tagCreationDTO: CreateTagDTO;
    }) => {
      return createTag(teamId, tagCreationDTO);
    },
    {
      onSuccess: (_, { teamId }) => {
        queryClient.invalidateQueries([
          'Tags',
          {
            teamId,
          },
        ]);
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

export const useTagsByTeam = (teamId: string | null) => {
  return useQuery<ViewTags>(
    ['Tags', { teamId }],
    () =>
      teamId
        ? fetchTagsByTeam(teamId)
        : {
            rich: [],
            raw: [],
          },
    {
      initialData: {
        rich: [],
        raw: [],
      },
    },
  );
};

export const useSelectedTeamTags = () => {
  const [selectedTeamId] = useSelectedTeamId();
  return useTagsByTeam(selectedTeamId);
};
