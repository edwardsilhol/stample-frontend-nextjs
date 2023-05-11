export enum CommentMentionType {
  USER = 'user',
  EVERYONE = 'everyone',
}

export interface CommentMention {
  user?: string;
  start: number;
  type: CommentMentionType;
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
