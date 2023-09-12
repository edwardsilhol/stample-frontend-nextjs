import {
  CreateDocumentDTO,
  Document,
  MinimalDocument,
  PopulatedDocument,
  SearchDocumentsDTO,
  SearchDocumentsReturnType,
  UpdateDocumentAsGuestDTO,
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

export const updateDocumentAsGuest = async (
  teamId: string,
  documentId: string,
  updateDocumentAsGuestDTO: UpdateDocumentAsGuestDTO,
): Promise<Document> => {
  return await apiRequest<Document>(
    'PATCH',
    `/team/${teamId}/document/${documentId}/guest`,
    undefined,
    updateDocumentAsGuestDTO,
  );
};
export const fetchDocumentsByTeam = async (
  teamId: string,
): Promise<MinimalDocument[]> => {
  try {
    return await apiRequest<Document[]>('GET', `/team/${teamId}/document`);
  } catch (error) {
    console.log(error);
    return [];
  }
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
): Promise<string> => {
  return await apiRequest<string>('POST', `/document/${documentId}/summary`);
};
