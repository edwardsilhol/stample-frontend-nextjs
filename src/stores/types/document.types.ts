import { UserForOtherClient } from './user.types';
import { Comment } from './comment.types';
export const documentTypes = ['webpage', 'note', 'file'] as const;
export type DocumentType = (typeof documentTypes)[number];

export type CreateDocumentDTO = Pick<
  Document,
  'title' | 'content' | 'summary' | 'url' | 'type' | 'tags'
>;
const documentMediaTypes = ['image', 'video'] as const;
type DocumentMediaType = (typeof documentMediaTypes)[number];
interface DocumentMedia {
  html: string;
  mediaType: DocumentMediaType;
  src?: string;
}
export interface Document {
  _id: string;
  title: string;
  content: string;
  summary: string;
  keyInsight: string;
  url: string;
  authorUrl?: string;
  team: string;
  type: DocumentType;
  readers: string[];
  likes: string[];
  comments: string[];
  tags: string[];
  author?: string;
  guests?: string[];
  creator: UserForOtherClient;
  urlWebsiteName?: string;
  mainMedia?: DocumentMedia;
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

export type UpdateDocumentAsGuestDTO = {
  isLiked?: boolean;
  isReader?: boolean;
};

export type MinimalDocument = Omit<Document, 'content' | 'comments'>;
export type SearchDocumentsDTO = {
  text?: string;
  tags?: string[];
  team?: string;
};
