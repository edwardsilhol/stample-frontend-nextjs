import {
  Comment,
  CreateCommentDTO,
  UpdateCommentDTO,
} from 'stores/types/comment.types';
import { apiRequest } from 'utils/api';

export const createComment = async ({
  documentId,
  createCommentDTO,
}: {
  documentId: string;
  createCommentDTO: CreateCommentDTO;
}): Promise<Comment | null> =>
  apiRequest<Comment>(
    'POST',
    `/document/${documentId}/comment`,
    undefined,
    createCommentDTO,
  );

export const updateComment = async ({
  documentId,
  commentId,
  updateCommentDTO,
}: {
  documentId: string;
  commentId: string;
  updateCommentDTO: UpdateCommentDTO;
}): Promise<Comment | null> =>
  apiRequest<Comment>(
    'PATCH',
    `/document/${documentId}/comment/${commentId}`,
    undefined,
    updateCommentDTO,
  );
