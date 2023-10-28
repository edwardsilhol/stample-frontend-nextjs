import {
  CreateDocumentDTO,
  Document,
  MinimalDocument,
  PopulatedDocument,
  SearchDocumentsDTO,
  SearchDocumentsReturnType,
  UpdateDocumentAsGuestDTO,
  UpdateDocumentDto,
} from '../types/document.types';
import { apiRequest } from '../../utils/api';
import { SEARCH_DOCUMENT_PAGE_SIZE } from 'constants/document.constant';

export const fetchDocumentByTeam = async (
  teamId: string,
  documentId: string,
): Promise<PopulatedDocument | null> => {
  try {
    return await apiRequest<PopulatedDocument>(
      'GET',
      `/team/${teamId}/document/${documentId}`,
    );
  } catch (error) {
    return null;
  }
};

export const fetchDocument = async (
  documentId: string,
): Promise<PopulatedDocument | null> => {
  return await apiRequest<PopulatedDocument>('GET', `/document/${documentId}`);
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

export const updateDocument = async (
  documentId: string,
  updateDocumentDto: UpdateDocumentDto,
): Promise<Document> => {
  return await apiRequest<Document>(
    'PATCH',
    `/document/${documentId}`,
    undefined,
    updateDocumentDto,
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
export const summarizeDocument = async (
  documentId: string,
): Promise<Document> => {
  return await apiRequest<Document>('POST', `/document/${documentId}/summary`);
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  await apiRequest<void>('DELETE', `/document/${documentId}`);
};
