import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCommentDTO } from 'stores/types/comment.types';
import { createComment } from 'stores/api/comment.api';

export const useCreateComment = (documentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (createCommentDTO: CreateCommentDTO) =>
      createComment(documentId, createCommentDTO),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['document', { documentId }],
      });
    },
  });
};
