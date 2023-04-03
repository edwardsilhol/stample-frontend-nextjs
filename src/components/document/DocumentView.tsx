import React, { useEffect, useMemo, useState } from 'react';
import Stack from '../muiOverrides/Stack';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
} from '@mui/material';
import {
  Close,
  Fullscreen,
  FullscreenExit,
  ThumbUp,
  ThumbUpOffAlt,
} from '@mui/icons-material';
import Typography from '../muiOverrides/Typography';
import { Tag } from '../../stores/types/tag.types';
import {
  useDocument,
  useUpdateDocumentAsGuest,
} from '../../stores/hooks/document.hooks';
import { format } from 'date-fns';
import { UserForOtherClient } from 'stores/types/user.types';
import { DocumentHeader } from './DocumentHeader';
import { DocumentTags } from './DocumentTags';
import { useCreateComment } from 'stores/hooks/comment.hooks';
import { useLoggedInUser } from 'stores/data/user.data';
import { useIsMobile } from 'utils/hooks/useIsMobile';

interface DocumentViewProps {
  documentId: string;
  tags?: Tag[];
  isFullScreen: boolean;
  setDocumentId: (id: string) => void;
  onToggleFullScreen: () => void;
}
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
  tags,
  isFullScreen,
  setDocumentId,
  onToggleFullScreen,
}) => {
  const [loggedInUser] = useLoggedInUser();
  const isMobile = useIsMobile();
  const { data: document, isLoading } = useDocument(documentId);
  const { mutate: createComment } = useCreateComment(documentId);
  const { mutate: updateDocumentAsGuest } =
    useUpdateDocumentAsGuest(documentId);
  useEffect(() => {
    if (
      !document?.readers.some(
        (user) => loggedInUser?._id.toString() === user._id.toString(),
      )
    ) {
      updateDocumentAsGuest({
        isReader: true,
      });
    }
  }, [document?.readers, loggedInUser?._id, updateDocumentAsGuest]);
  const [editedCommentText, setEditedCommentText] = useState('');
  const commentAuthorsById: Record<string, UserForOtherClient> = useMemo(
    () =>
      [...(document?.guests || []), ...([document?.creator] || [])].reduce(
        (accumulator, user) => ({
          ...accumulator,
          ...(user
            ? {
                [user._id]: user,
              }
            : {}),
        }),
        {} as Record<string, UserForOtherClient>,
      ),
    [document?.guests, document?.creator],
  );
  const isDocumentLiked = useMemo(
    () =>
      document?.likes.some(
        (user) => user._id.toString() === loggedInUser?._id.toString(),
      ),
    [document?.likes, loggedInUser],
  );
  const onSubmitAddComment = () => {
    if (editedCommentText) {
      createComment({
        content: editedCommentText,
      });
      setEditedCommentText('');
    }
  };

  const onClickLike = (like: boolean) => {
    updateDocumentAsGuest({
      isLiked: like,
    });
  };
  return (
    <Stack
      direction={'column'}
      width="100%"
      sx={{
        borderLeft: '1px solid #d3d4d5',
      }}
      paddingX={2}
      height="100%"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        paddingTop={2}
        paddingBottom={1}
      >
        <IconButton
          onClick={() => {
            setDocumentId('');
            if (isFullScreen) {
              onToggleFullScreen();
            }
          }}
          sx={{ padding: 0, borderRadius: '4px' }}
        >
          <Close />
        </IconButton>
        {!isMobile && (
          <IconButton onClick={onToggleFullScreen}>
            {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        )}
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
        <Stack
          width="100%"
          sx={{ overflowY: 'auto' }}
          height="100%"
          paddingX={{ xs: 1, md: 3, lg: 5 }}
          alignItems="center"
        >
          <Box maxWidth="md" width="100%">
            <Stack alignItems="center" width="100%">
              <Typography variant="h1" paddingBottom={2}>
                {document.title}
              </Typography>
              <Box paddingBottom={1}>
                <DocumentTags tags={tags} documentTagsIds={document.tags} />
              </Box>
              <DocumentHeader
                {...document}
                likesCount={document.likes?.length ?? 0}
                readersCount={document.readers?.length ?? 0}
                typographyProps={{ variant: 'body2' }}
              />
            </Stack>
            <Stack alignItems="end">
              <IconButton
                onClick={() => onClickLike(isDocumentLiked ? false : true)}
              >
                {isDocumentLiked ? <ThumbUp /> : <ThumbUpOffAlt />}
              </IconButton>
            </Stack>
            {document.creator && (
              <>
                <Divider sx={{ marginY: 2 }} />
                <DocumentCreator creator={document.creator} />
              </>
            )}
            <Divider sx={{ marginY: 2 }} />
            {document?.mainMedia?.src ? (
              <Box
                component="img"
                src={document.mainMedia.src}
                width="100%"
                paddingX={8}
              />
            ) : document?.mainMedia?.html ? (
              <Box
                sx={{ maxWidth: '100px' }}
                dangerouslySetInnerHTML={{
                  __html: document.mainMedia.html,
                }}
              />
            ) : null}
            <div dangerouslySetInnerHTML={{ __html: document.content }} />
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h2" marginBottom={2}>
              Comments
            </Typography>
            {document.comments?.map((comment, index) => {
              const author = commentAuthorsById[comment.creatorId];
              return (
                <Card
                  key={comment._id}
                  sx={{
                    marginTop: index === 0 ? 0 : 1,
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                  }}
                  variant="outlined"
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
            <Divider sx={{ marginBottom: 2 }} />
            <InputBase
              value={editedCommentText}
              onChange={(e) => setEditedCommentText(e.target.value)}
              placeholder="Add a comment"
            />
            {editedCommentText && (
              <Stack direction="row">
                <Button onClick={() => setEditedCommentText('')}>Cancel</Button>
                <Button onClick={onSubmitAddComment} variant="contained">
                  Send
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
