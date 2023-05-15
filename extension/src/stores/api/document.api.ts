import {
  CreateDocumentDTO,
  Document,
  PopulatedDocument,
  UpdateDocumentAsGuestDTO,
  SearchDocumentsDTO,
  SearchDocumentsReturnType,
  MinimalDocument,
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
): Promise<string[]> => {
  return await apiRequest<string[]>(
    'POST',
    '/document/search/urls',
    undefined,
    {
      urls,
    },
  );
};
