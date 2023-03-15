import { CreateTagDTO, Tag, UpdateTagDTO, ViewTags } from '../types/tag.types';
import { apiRequest } from '../../utils/api';

export const createTag = async (tag: CreateTagDTO): Promise<Tag | null> => {
  try {
    return await apiRequest<Tag>('POST', '/tag', undefined, tag);
  } catch (error) {
    return null;
  }
};

export const updateTag = async (
  tagId: string,
  tag: UpdateTagDTO,
): Promise<Tag | null> => {
  try {
    return await apiRequest<Tag>('PATCH', '/tag/' + tagId, undefined, tag);
  } catch (error) {
    return null;
  }
};

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
