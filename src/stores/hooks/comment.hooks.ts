import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCommentDTO } from 'stores/types/comment.types';
import { createComment } from 'stores/api/comment.api';

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
