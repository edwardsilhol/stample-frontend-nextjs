import {
  CreateDocumentDTO,
  Document,
  PopulatedDocument,
  UpdateDocumentAsGuestDTO,
  SearchDocumentsDTO,
  SearchDocumentsReturnType,
  MinimalDocument,
  UrlAndId,
} from '../types/document.types';
import { apiRequest } from '../../utils/api';
import { SEARCH_DOCUMENT_PAGE_SIZE } from '@src/constants/document.constant';

export const fetchDocument = async (
  documentId: string,
): Promise<PopulatedDocument | null> => {
  try {
    return await apiRequest<PopulatedDocument>(
      'GET',
      '/document/' + documentId,
    );
  } catch (error) {
    return null;
  }
};

export const createDocument = async (
  teamId: string,
  createDocumentDto: CreateDocumentDTO,
): Promise<Document> => {
  return await apiRequest<Document>(
    'POST',
    `/team/${teamId}/document`,
    undefined,
    createDocumentDto,
  );
};

export const updateDocumentAsGuest = async (
  documentId: string,
  updateDocumentAsGuestDTO: UpdateDocumentAsGuestDTO,
): Promise<Document> => {
  return await apiRequest<Document>(
    'PATCH',
    `/document/${documentId}/guest`,
    undefined,
    updateDocumentAsGuestDTO,
  );
};
export const searchDocuments = async (
  searchDocumentsDTO: SearchDocumentsDTO,
): Promise<SearchDocumentsReturnType> => {
  return await apiRequest<SearchDocumentsReturnType>(
    'POST',
    '/document/search',
    undefined,
    {
      ...searchDocumentsDTO,
      page: searchDocumentsDTO.page || 0,
      pageSize: SEARCH_DOCUMENT_PAGE_SIZE,
    },
  );
};

export const searchDocumentsUrlsByUrls = async (
  urls: string[],
): Promise<UrlAndId[]> => {
  return await apiRequest<UrlAndId[]>(
    'POST',
    '/document/search/urls',
    undefined,
    {
      urls,
    },
  );
};

export const searchDocumentsByUrl = async (
  url: string,
): Promise<MinimalDocument[]> => {
  return await apiRequest<MinimalDocument[]>(
    'POST',
    '/document/search/url',
    undefined,
    {
      url,
    },
  );
};
export const summarizeText = async (
  text: string,
): Promise<{ summary: string[] }> => {
  return await apiRequest<{ summary: string[] }>(
    'POST',
    '/document/summary/text',
    undefined,
    {
      text,
    },
  );
};
