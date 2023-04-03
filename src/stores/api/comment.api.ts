import { Comment, CreateCommentDTO } from 'stores/types/comment.types';
import { apiRequest } from 'utils/api';

export const createComment = async (
  documentId: string,
  createCommentDTO: CreateCommentDTO,
): Promise<Comment | null> =>
  apiRequest<Comment>(
    'POST',
    `/document/${documentId}/comment`,
    undefined,
    createCommentDTO,
  );
