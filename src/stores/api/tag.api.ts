import {
  CreateTagDTO,
  Tag,
  TagRich,
  UpdateTagDTO,
  ViewTags,
} from '../types/tag.types';
import { apiRequest } from '../../utils/api';

export const fetchTag = async (tagId: string): Promise<Tag | null> => {
  try {
    return await apiRequest<Tag>('GET', '/tag/' + tagId);
  } catch (error) {
    return null;
  }
};

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
    return await apiRequest<ViewTags>('GET', '/tag/all/tags');
  } catch (error) {
    return {
      richTags: [],
      flatTags: [],
    };
  }
};
