import {
  CreateDocumentDTO,
  Document,
  PopulatedDocument,
  UpdateDocumentAsGuestDTO,
  SearchDocumentsDTO,
} from '../types/document.types';
import { apiRequest } from '../../utils/api';

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
  createDocumentDto: CreateDocumentDTO,
): Promise<Document> => {
  return await apiRequest<Document>(
    'POST',
    '/document',
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
): Promise<Document[]> => {
  try {
    return await apiRequest<Document[]>(
      'POST',
      '/document/search',
      undefined,
      searchDocumentsDTO,
    );
  } catch (error) {
    return [];
  }
};
