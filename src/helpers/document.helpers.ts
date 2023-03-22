import { formatDistanceToNow } from 'date-fns';
import { Document } from 'stores/types/document.types';
import { Tag } from 'stores/types/tag.types';
export const getDocumentsByTags = (documents: Document[]) =>
  documents.reduce((accumulator: Record<string, Document[]>, document) => {
    document.tags.forEach((tag) => {
      if (accumulator[tag]) {
        accumulator[tag].push(document);
      } else {
        accumulator[tag] = [document];
      }
    });
    return accumulator;
  }, {});

export const getDocumentHeaderStrings = ({
  urlWebsiteName,
  createdAt,
  author,
  likesCount,
  readersCount,
}: Pick<Document, 'urlWebsiteName' | 'createdAt' | 'author'> & {
  likesCount: number;
  readersCount: number;
}): string[] => {
  const websiteTitle = urlWebsiteName;
  const documentDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
      })
    : null;

  const likeString =
    likesCount || likesCount === 0
      ? likesCount === 1
        ? '1 vote'
        : `${likesCount} votes`
      : '';

  const openCountString: string | null =
    readersCount || readersCount === 0
      ? readersCount === 1
        ? '1 open'
        : `${readersCount} opens`
      : null;

  return [
    websiteTitle,
    author,
    documentDate,
    likeString,
    openCountString,
  ].filter((header): header is string => !!header);
};

export const searchDocuments = ({
  documentsByTags,
  allDocuments,
  searchQuery,
  selectedTagId,
  allTags,
}: {
  documentsByTags: Record<string, Document[]>;
  allDocuments: Document[];
  searchQuery: string | null;
  selectedTagId: string | null;
  allTags: Tag[];
}): Document[] => {
  const selectedDocumentsByTags = selectedTagId
    ? documentsByTags[selectedTagId]
    : allDocuments;
  if (!searchQuery || searchQuery === '') {
    return selectedDocumentsByTags;
  } else {
    return selectedDocumentsByTags.filter((document) => {
      if (searchQuery.startsWith('#')) {
        const tag = allTags.find((tag) => tag.name === searchQuery.slice(1));
        if (tag) {
          return document.tags.includes(tag._id);
        } else {
          return false;
        }
      } else {
        return document.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
    });
  }
};
