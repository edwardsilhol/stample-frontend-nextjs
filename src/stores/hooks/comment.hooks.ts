import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PopulatedDocument } from 'stores/types/document.types';
import { createComment, updateComment } from 'stores/api/comment.api';
import { documentQueryKey } from './document.hooks';

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: async (comment, { documentId }) => {
      await queryClient.setQueryData(
        documentQueryKey.one(documentId),
        (oldDocument?: PopulatedDocument) => {
          if (oldDocument && comment) {
            return {
              ...oldDocument,
              comments: [...oldDocument.comments, comment],
            };
          }
        },
      );
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateComment,
    onSuccess: async (comment, { documentId }) => {
      await queryClient.setQueryData(
        documentQueryKey.one(documentId),
        (oldDocument?: PopulatedDocument) => {
          if (oldDocument && comment) {
            return {
              ...oldDocument,
              comments: oldDocument.comments.map((oldComment) =>
                oldComment._id === comment._id ? comment : oldComment,
              ),
            };
          }
        },
      );
    },
  });
};
