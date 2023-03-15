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
  creator: string;
  createdAt: Date;
}
