import React, { useMemo } from 'react';
import Stack from '../../muiOverrides/Stack';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import Typography from '../../muiOverrides/Typography';
import { Tag } from '../../../stores/types/tag.types';
import { useDocument } from '../../../stores/hooks/document.hooks';
import { format, formatDistanceToNow } from 'date-fns';
import { PopulatedDocument } from 'stores/types/document.types';
import { Comment } from 'stores/types/comment.types';
import { UserForOtherClient } from 'stores/types/user.types';

interface DocumentViewProps {
  documentId: string;
  setDocumentId: (id: string) => void;
  tags?: Tag[];
}
const DocumentHeader: React.FC<{
  document: PopulatedDocument;
}> = ({ document }) => {
  const getDocumentWebsiteTitle = (): string | null => {
    // TODO: get website title
    return null;
  };
  const websiteTitle = getDocumentWebsiteTitle();
  const documentDate = document?.createdAt
    ? formatDistanceToNow(new Date(document.createdAt), {
        addSuffix: true,
      })
    : null;

  const likeString =
    document?.likes?.length || document.likes?.length === 0
      ? `${document.likes.length} votes`
      : '';

  const openCountString: string | null =
    document.readers?.length || document.readers?.length === 0
      ? `${document.readers.length} opens`
      : null;
  return (
    <Typography
      variant="caption"
      color="primary.light"
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
    >
      {[
        ...(websiteTitle ? [<>{websiteTitle}</>] : []),
        ...(document?.author ? [<>{document.author}</>] : []),
        ...(documentDate ? [<>{documentDate}</>] : []),
        ...(likeString ? [<>{likeString}</>] : []),
        ...(openCountString ? [<>{openCountString}</>] : []),
      ]
        .filter(
          (component): component is React.ReactElement => component !== null,
        )
        .reduce(
          (accumulator, component, index) =>
            index === 0
              ? [component]
              : [
                  ...accumulator,
                  <Typography
                    color="black"
                    component="span"
                    key={`separator-${index}`}
                  >
                    {' • '}
                  </Typography>,
                  <React.Fragment key={index}>{component}</React.Fragment>,
                ],
          [] as React.ReactNode[],
        )}
    </Typography>
  );
};

const DocumentCreator: React.FC<{
  creator: UserForOtherClient;
}> = ({ creator }) => (
  <Stack direction="row" alignItems="center">
    <Avatar src={creator.profilePictureUrl}>
      {creator.profilePictureUrl
        ? null
        : `${creator.firstName[0]}${creator.lastName[0]}`}
    </Avatar>
    <Typography
      variant="body2"
      sx={{ opacity: '0.5' }}
      marginLeft={1}
      alignSelf="start"
    >
      {creator.firstName} {creator.lastName}
    </Typography>
  </Stack>
);

export const DocumentView: React.FC<DocumentViewProps> = ({
  documentId,
  setDocumentId,
  tags,
}) => {
  const { data: document, isLoading } = useDocument(documentId);
  const tagsString = useMemo(
    () =>
      document?.tags
        ?.map((tag) => tags?.find((t) => t._id === tag)?.name)
        ?.map((tag) => `#${tag}`)
        ?.join(' '),
    [document, tags],
  );

  const getCommentAuthor = (comment: Comment): UserForOtherClient | null =>
    document?.guests?.find((guest) => guest._id === comment.creatorId) || null;
  return (
    <Stack
      direction={'column'}
      width={'100%'}
      sx={{
        borderLeft: '1px solid #d3d4d5',
      }}
      padding={2}
    >
      <Stack direction="row" alignItems="center">
        <IconButton
          onClick={() => setDocumentId('')}
          sx={{ padding: '0 2px', borderRadius: '4px' }}
        >
          <Close />
        </IconButton>
      </Stack>
      {isLoading ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Stack>
      ) : !document ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <h1>Document not found</h1>
        </Stack>
      ) : (
        <Stack padding={1}>
          <Typography variant="h1">{document.title}</Typography>
          <Typography fontSize={'11px'} fontWeight={400} color="blue">
            {tagsString}
          </Typography>
          <DocumentHeader document={document} />
          {document.creator && (
            <>
              <Divider sx={{ marginY: 2 }} />
              <DocumentCreator creator={document.creator} />
            </>
          )}
          <Divider sx={{ marginY: 2 }} />
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="h2" marginBottom={2}>
            Comments
          </Typography>
          {document.comments?.map((comment, index) => {
            const author = getCommentAuthor(comment);
            return (
              <Card
                key={comment._id}
                sx={{
                  marginTop: index === 0 ? 0 : 1,
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar src={author?.profilePictureUrl}>
                      {author?.profilePictureUrl
                        ? null
                        : `${author?.firstName[0]}${author?.lastName[0]}`}
                    </Avatar>
                  }
                  title={`${author?.firstName} ${author?.lastName}`}
                  subheader={
                    comment.createdAt
                      ? format(new Date(comment.createdAt), 'dd/MM/yyyy')
                      : undefined
                  }
                />
                <CardContent>
                  <Typography variant="body1">{comment.content}</Typography>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};
