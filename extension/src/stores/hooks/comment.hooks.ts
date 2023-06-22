import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCommentDTO } from '../types/comment.types';
import { createComment } from '../api/comment.api';

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      documentId,
      createCommentDTO,
    }: {
      documentId: string;
      createCommentDTO: CreateCommentDTO;
    }) => createComment(documentId, createCommentDTO),
    {
      onSuccess: (_, { documentId }) => {
        queryClient.invalidateQueries(['document', { documentId }]);
      },
    },
  );
};
