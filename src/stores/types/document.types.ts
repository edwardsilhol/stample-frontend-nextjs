import { UserForOtherClient } from './user.types';
import { Comment } from './comment.types';

export type CreateDocumentDTO = {
  title: string;
  content: string;
  summary: string;
  url: string;
  type: 'webpage' | 'note' | 'file';
  tags: string[];
};

export interface Document {
  _id: string;
  title: string;
  content: string;
  summary: string;
  keyInsight: string;
  url: string;
  team: string;
  type: 'webpage' | 'note' | 'file';
  readers: string[];
  likes: string[];
  comments: string[];
  tags: string[];
  author?: string;
  guests?: string[];
  creator: UserForOtherClient;
  createdAt: Date;
}

export interface PopulatedDocument
  extends Omit<
    Document,
    'creator' | 'readers' | 'likes' | 'comments' | 'guests'
  > {
  creator: UserForOtherClient;
  readers: UserForOtherClient[];
  likes: UserForOtherClient[];
  guests: UserForOtherClient[];
  comments: Comment[];
}
