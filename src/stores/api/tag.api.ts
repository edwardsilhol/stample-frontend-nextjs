import { CreateTagDTO, Tag, TagRich, UpdateTagDTO } from '../types/tag.types';
import { apiRequest } from '../../utils/api';

export const fetchRawTags = async (): Promise<Tag[]> => {
  try {
    return await apiRequest<Tag[]>('GET', '/tag/all/raw');
  } catch (error) {
    return [];
  }
};

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

export const fetchRichTags = async (): Promise<TagRich[]> => {
  try {
    return await apiRequest<TagRich[]>('GET', '/tag/all/rich');
  } catch (error) {
    return [];
  }
};
