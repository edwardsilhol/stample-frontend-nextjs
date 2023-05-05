import {
  CreateDocumentDTO,
  Document,
  MinimalDocument,
  PopulatedDocument,
  SearchDocumentsDTO,
  UpdateDocumentAsGuestDTO,
} from '../types/document.types';
import { apiRequest } from '../../utils/api';

export const fetchDocument = async (
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
): Promise<MinimalDocument[]> => {
  return await apiRequest<MinimalDocument[]>(
    'POST',
    '/document/search',
    undefined,
    searchDocumentsDTO,
  );
};
