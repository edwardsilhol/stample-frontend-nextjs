import { createDocument, searchDocuments } from '../api/document.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateDocumentDTO,
  Document,
  SearchDocumentsDTO,
} from '../types/document.types';

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (createDocumentDto: CreateDocumentDTO) => createDocument(createDocumentDto),
    {
      onSuccess: ({ team }) => {
        queryClient.invalidateQueries(['documents', { teamId: team }]);
      },
    },
  );
};

export const useSearchDocuments = (searchDocumentsDTO: SearchDocumentsDTO) =>
  useQuery<Document[]>(
    [
      'documents',
      {
        searchDocumentsDTO,
      },
    ],
    () => searchDocuments(searchDocumentsDTO),
  );
