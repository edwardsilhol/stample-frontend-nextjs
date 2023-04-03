export interface Comment {
  _id: string;
  content: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCommentDTO = Omit<
  Comment,
  '_id' | 'createdAt' | 'updatedAt' | 'creatorId'
>;
