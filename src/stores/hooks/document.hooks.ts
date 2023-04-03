import {
  createDocument,
  fetchDocument,
  fetchDocumentsByTag,
  fetchDocuments,
  updateDocumentAsGuest,
} from '../api/document.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateDocumentDTO,
  UpdateDocumentAsGuestDTO,
} from '../types/document.types';

export const useDocument = (documentId: string) => {
  return useQuery(['document', { documentId }], () =>
    fetchDocument(documentId),
  );
};

export const useDocumentByTag = (tag: string) => {
  return useQuery(['documentByTag', { tag }], () => fetchDocumentsByTag(tag), {
    initialData: [],
  });
};

export const useAllDocuments = () => {
  return useQuery(['allDocuments'], fetchDocuments, {
    initialData: [],
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (createDocumentDto: CreateDocumentDTO) => createDocument(createDocumentDto),
    {
      onSuccess: (document) => {
        console.log('successfully created document:', document);
        queryClient.invalidateQueries(['rawDocuments']);
      },
    },
  );
};

export const useUpdateDocumentAsGuest = (documentId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (updateDocumentAsGuestDTO: UpdateDocumentAsGuestDTO) =>
      updateDocumentAsGuest(documentId, updateDocumentAsGuestDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['document', { documentId }]);
      },
    },
  );
};
