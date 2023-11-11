import { CreateTagDTO, Tag, UpdateTagDTO, ViewTags } from '../types/tag.types';
import { apiRequest } from '../../utils/api';

export const createTag = async (tag: CreateTagDTO): Promise<Tag | null> => {
  try {
    return await apiRequest<Tag>('POST', `/tag`, undefined, tag);
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

export const fetchDocumentsCountPerTag = async (
  teamId: string,
): Promise<Record<string, number>> => {
  return await apiRequest<Record<string, number>>(
    'GET',
    `/team/${teamId}/documents-per-tag`,
  );
};

export const deleteTag = async ({
  teamId,
  tagId,
}: {
  tagId: string;
  teamId: string;
}): Promise<Tag | null> => {
  try {
    return await apiRequest<Tag>('DELETE', `/tag/${tagId}?teamId=${teamId}`);
  } catch (error) {
    return null;
  }
};
