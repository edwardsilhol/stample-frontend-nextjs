import React, { useMemo, useState } from 'react';
import Stack from '../muiOverrides/Stack';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
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
import { UserForOtherClient } from 'stores/types/user.types';
import { DocumentHeader } from './DocumentHeader';
import { DocumentTags } from './DocumentTags';
import { useCreateComment } from 'stores/hooks/comment.hooks';
import { useLoggedInUser } from 'stores/data/user.data';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { uniqBy } from 'lodash';
import { useSelectedTeam, useSelectedTeamId } from 'stores/data/team.data';
import { CommentMention, CommentMentionType } from 'stores/types/comment.types';
import { Editor, EditorState } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import { DocumentComment } from './DocumentComment';
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
  const [selectedTeamId] = useSelectedTeamId();
  const { data: document, isLoading } = useDocument(selectedTeamId, documentId);
  const { mutate: createComment } = useCreateComment(documentId);
  const { data: selectedTeam } = useSelectedTeam();
  const { mutate: updateDocumentAsGuest } = useUpdateDocumentAsGuest();
  const [editedCommentText, setEditedCommentText] = useState<EditorState>();
  const commentAuthorsById: Record<string, UserForOtherClient> = useMemo(
    () =>
      [
        ...(document?.guests || []),
        ...([document?.creator] || []),
        ...(selectedTeam?.users.map((user) => user.user) || []),
      ].reduce(
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
    [document?.guests, document?.creator, selectedTeam?.users],
  );
  const isDocumentLiked = useMemo(
    () =>
      document?.likes.some(
        (user) => user._id.toString() === loggedInUser?._id.toString(),
      ),
    [document?.likes, loggedInUser],
  );
  const userMentions = useMemo(
    () => [
      {
        text: 'Everyone',
        value: 'Everyone',
        url: CommentMentionType.EVERYONE,
      },
      ...uniqBy(
        [
          ...(document?.guests || []),
          document?.creator,
          ...(selectedTeam?.users.map((user) => user.user) || []),
        ],
        (user) => user?._id,
      )
        .filter((user): user is UserForOtherClient => !!user)
        .map((user) => ({
          text: `${user.firstName} ${user.lastName}`,
          value: `${user.firstName} ${user.lastName}`,
          url: user._id,
        })),
    ],
    [document?.guests, document?.creator, selectedTeam?.users],
  );
  const onSubmitAddComment = () => {
    if (!editedCommentText) {
      return;
    }
    let plainText = editedCommentText.getCurrentContent().getPlainText();
    const text = convertToRaw(editedCommentText.getCurrentContent());
    const entityMap = text.entityMap;

    let latestMentionStartIndex = 0;
    const mentions: CommentMention[] = Object.values(entityMap).map(
      (entity) => {
        const mentionStartIndex = plainText.indexOf(
          entity.data.text,
          latestMentionStartIndex,
        );
        latestMentionStartIndex = mentionStartIndex;
        plainText = plainText.replace(entity.data.text, '');
        return {
          type:
            entity.data.url === CommentMentionType.EVERYONE
              ? CommentMentionType.EVERYONE
              : CommentMentionType.USER,
          user:
            entity.data.url === CommentMentionType.USER
              ? entity.data.url
              : undefined,
          start: mentionStartIndex,
        };
      },
    );

    if (plainText && mentions) {
      createComment({
        content: plainText,
        mentions,
      });
      setEditedCommentText(undefined);
    }
  };
  const onClickLike = (like: boolean) => {
    if (!selectedTeamId) {
      return;
    }
    updateDocumentAsGuest({
      documentId: documentId,
      teamId: selectedTeamId,
      updateDocumentAsGuestDTO: {
        isLiked: like,
      },
    });
  };
  return (
    <Stack
      direction="column"
      flex={{ md: 2, lg: 3 }}
      sx={{
        borderLeft: isFullScreen ? undefined : '1px solid #d3d4d5',
        overflowX: 'hidden',
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
          <Box maxWidth="md" width="100%" paddingBottom={2}>
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
            {document.comments?.map((comment, index) => (
              <DocumentComment
                key={index}
                index={index}
                commentAuthorsById={commentAuthorsById}
                comment={comment}
              />
            ))}
            <Divider sx={{ marginBottom: 2 }} />
            <Editor
              editorState={editedCommentText}
              onEditorStateChange={(value) => setEditedCommentText(value)}
              mention={{
                separator: ' ',
                trigger: '@',
                suggestions: userMentions,
              }}
              placeholder="Add a comment"
              wrapperStyle={{
                width: '100%',
                overflowY: 'visible',
              }}
              editorStyle={{
                overflowY: 'visible',
                overflow: 'unset',
              }}
              toolbarHidden
            />
            {editedCommentText && (
              <Stack direction="row">
                <Button onClick={() => setEditedCommentText(undefined)}>
                  Cancel
                </Button>
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
