import { useQuery } from '@tanstack/react-query';
import { fetchTags, fetchTagsByTeam } from '../api/tag.api';
import { ViewTags } from '../types/tag.types';

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

export const useAllTags = () => {
  return useQuery<ViewTags>(['Tags'], fetchTags, {
    initialData: {
      rich: [],
      raw: [],
    },
  });
};
