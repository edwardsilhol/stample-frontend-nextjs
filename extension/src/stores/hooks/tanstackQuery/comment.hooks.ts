import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCommentDTO } from '../../types/comment.types';
import { createComment } from '../../api/comment.api';

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      documentId,
      createCommentDTO,
    }: {
      documentId: string;
      createCommentDTO: CreateCommentDTO;
    }) => createComment(documentId, createCommentDTO),
    onSuccess: async (_, { documentId }) => {
      await queryClient.invalidateQueries({
        queryKey: ['document', { documentId }],
      });
    },
  });
};
