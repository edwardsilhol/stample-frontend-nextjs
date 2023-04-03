import {
  fetchDocument,
  fetchDocumentsByTag,
  fetchDocuments,
} from '../api/document.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateCommentDTO } from 'stores/types/comment.types';
import { createComment } from 'stores/api/comment.api';

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

export const useCreateComment = (documentId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (createCommentDTO: CreateCommentDTO) =>
      createComment(documentId, createCommentDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['document', { documentId }]);
      },
    },
  );
};
