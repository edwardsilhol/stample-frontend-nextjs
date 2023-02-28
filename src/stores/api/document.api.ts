import { Document } from '../types/document.types';
import { apiRequest } from '../../utils/api';

export const fetchDocuments = async (): Promise<Document[]> => {
  try {
    return await apiRequest<Document[]>('GET', '/document/all/raw');
  } catch (error) {
    return [];
  }
};
