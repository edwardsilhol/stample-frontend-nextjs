import { ViewTags } from '../types/tag.types';
import { apiRequest } from '../../utils/api';

export const fetchTags = async (): Promise<ViewTags> => {
  try {
    return await apiRequest<ViewTags>('GET', '/tag/all');
  } catch (error) {
    return {
      rich: [],
      raw: [],
    };
  }
};

export const fetchTagsByTeam = async (teamId: string): Promise<ViewTags> => {
  try {
    return await apiRequest<ViewTags>('GET', '/team/' + teamId + '/tags');
  } catch (error) {
    return {
      rich: [],
      raw: [],
    };
  }
};
