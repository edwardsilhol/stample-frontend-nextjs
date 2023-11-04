import { UserForOtherClient } from './user.types';
import { Comment } from './comment.types';
import { Tag } from './tag.types';
export const documentTypes = ['webpage', 'note', 'file'] as const;
export type DocumentType = (typeof documentTypes)[number];

export type CreateDocumentDTO = Pick<
  Document,
  | 'title'
  | 'content'
  | 'summary'
  | 'url'
  | 'type'
  | 'tags'
  | 'selectedForNewsletter'
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
  creator: string;
  urlWebsiteName?: string;
  mainMedia?: DocumentMedia;
  selectedForNewsletter: boolean;
  createdAt: Date;
  aiSummary?: string[];
}

export interface PopulatedDocument
  extends Omit<
    Document,
    'creator' | 'readers' | 'likes' | 'comments' | 'guests' | 'tags'
  > {
  creator: UserForOtherClient;
  readers: UserForOtherClient[];
  likes: UserForOtherClient[];
  guests: UserForOtherClient[];
  comments: Comment[];
  tags: Tag[];
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
  page?: number;
  pageSize?: number;
};

export type SearchDocumentsReturnType = {
  documents: MinimalDocument[];
  total: number;
  page: number;
  nextPage?: number;
};

export type UrlAndId = {
  url: string;
  id: string;
};

interface AddRemoveDto {
  readers: string[];
  likes: string[];
  guests: string[];
  comments: string[];
  tags: string[];
}

export type UpdateDocumentDto = Partial<
  Omit<
    Document,
    | '_id'
    | 'creator'
    | 'createdAt'
    | 'updatedAt'
    | 'comments'
    | 'likes'
    | 'readers'
    | 'guests'
    | 'tags'
    | 'team'
  > & {
    add?: AddRemoveDto;
    remove?: AddRemoveDto;
  }
>;
