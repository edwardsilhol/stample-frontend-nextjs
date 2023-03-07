import { CreateDocumentDTO, Document } from '../types/document.types';
import { apiRequest } from '../../utils/api';

export const fetchDocument = async (
  documentId: string,
): Promise<Document | null> => {
  try {
    return await apiRequest<Document>('GET', '/document/' + documentId);
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

<<<<<<< HEAD
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
=======
export const postDocument = async (document: Document): Promise<Document> => {
  try {
    const response = await apiRequest<Document>('POST', '/document', document);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
>>>>>>> 4f94aae (edit document part)
