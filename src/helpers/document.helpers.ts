import { formatDistanceToNow } from 'date-fns';
import { Document, MinimalDocument } from 'stores/types/document.types';
export const getDocumentsByTags = (documents: MinimalDocument[]) =>
  documents.reduce(
    (accumulator: Record<string, MinimalDocument[]>, document) => {
      document.tags.forEach((tag) => {
        if (accumulator[tag]) {
          accumulator[tag].push(document);
        } else {
          accumulator[tag] = [document];
        }
      });
      return accumulator;
    },
    {},
  );

export const getDocumentHeaderStrings = ({
  createdAt,
  likesCount,
  readersCount,
}: Pick<Document, 'createdAt'> & {
  likesCount: number;
  readersCount: number;
}): {
  documentDate: string | null;
  likeString: string;
  openCountString: string | null;
} => {
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

  return {
    documentDate,
    likeString,
    openCountString,
  };
};
