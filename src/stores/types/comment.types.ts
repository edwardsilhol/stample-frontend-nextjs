import { CommentMention } from '../../../extension/src/stores/types/comment.types';

export enum CommentMentionType {
  USER = 'user',
  EVERYONE = 'everyone',
}

export interface Comment {
  _id: string;
  content: string;
  mentions: CommentMention[];
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCommentDTO = Omit<
  Comment,
  '_id' | 'createdAt' | 'updatedAt' | 'creatorId'
>;

export type UpdateCommentDTO = Partial<Omit<Comment, '_id' | 'creatorId'>>;
