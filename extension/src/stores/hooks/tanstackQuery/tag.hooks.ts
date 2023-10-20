import { useQuery } from '@tanstack/react-query';
import { fetchTags, fetchTagsByTeam } from '../../api/tag.api';

export const useTagsByTeam = (teamId: string | null) => {
  return useQuery({
    queryKey: ['Tags', { teamId }],
    queryFn: () => (teamId ? fetchTagsByTeam(teamId) : { rich: [], raw: [] }),
    initialData: { rich: [], raw: [] },
  });
};

export const useAllTags = () => {
  return useQuery({
    queryKey: ['Tags'],
    queryFn: fetchTags,
    initialData: { rich: [], raw: [] },
  });
};
