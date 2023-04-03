import {
  CreateDocumentDTO,
  Document,
  PopulatedDocument,
  UpdateDocumentAsGuestDTO,
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

export const fetchDocuments = async (): Promise<Document[]> => {
  try {
    return await apiRequest<Document[]>('GET', '/document/all/raw');
  } catch (error) {
    return [];
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

export const fetchDocumentsByTag = async (tag: string): Promise<Document[]> => {
  try {
    return await apiRequest<Document[]>('GET', `/document/byTag/${tag}`);
  } catch (error) {
    return [];
  }
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
