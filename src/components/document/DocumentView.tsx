'use client';

import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbUpOffAlt from '@mui/icons-material/ThumbUpOffAlt';
import {
  useDocument,
  useSummarizeDocument,
  useUpdateDocumentAsGuest,
} from '../../stores/hooks/document.hooks';
import { UserForOtherClient } from 'stores/types/user.types';
import DocumentHeader from './DocumentHeader';
import DocumentTags from './DocumentTags';
import { useCreateComment } from 'stores/hooks/comment.hooks';
import { useLoggedInUser } from 'stores/data/user.data';
import { uniqBy } from 'lodash';
import { CommentMention, CommentMentionType } from 'stores/types/comment.types';
import { Editor, EditorState } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import DocumentComment from './DocumentComment';
import { useTeam } from 'stores/hooks/team.hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useTagsByTeam } from 'stores/hooks/tag.hooks';
import { decodeHTML } from 'entities';
import { useCurrentlyViewedDocumentId } from 'stores/data/document.data';
import DocumentViewHeader from './DocumentViewHeader';
import DocumentCreator from './DocumentCreator';
import Beenhere from '@mui/icons-material/Beenhere';

interface DocumentViewProps {
  documentId: string;
}

function DocumentView({ documentId }: DocumentViewProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCurrentlyViewedDocumentId] = useCurrentlyViewedDocumentId();
  const [loggedInUser] = useLoggedInUser();
  const { data: viewedDocument, isLoading } = useDocument(null, documentId);
  const { data: team } = useTeam(viewedDocument?.team ?? null);
  const { data: tags } = useTagsByTeam(viewedDocument?.team ?? null);
  const { mutate: createComment } = useCreateComment(documentId);
  const { mutate: updateDocumentAsGuest } = useUpdateDocumentAsGuest();
  const { mutate: summarizeDocument } = useSummarizeDocument();
  const [editedCommentText, setEditedCommentText] = useState<EditorState>();
  const commentAuthorsById: Record<string, UserForOtherClient> = useMemo(
    () =>
      [
        ...(viewedDocument?.guests || []),
        ...([viewedDocument?.creator] || []),
        ...(team?.users.map((user) => user.user) || []),
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
    [viewedDocument?.guests, viewedDocument?.creator, team?.users],
  );
  const isDocumentLiked = useMemo(
    () =>
      viewedDocument?.likes.some(
        (user) => user._id.toString() === loggedInUser?._id.toString(),
      ),
    [viewedDocument?.likes, loggedInUser],
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
          ...(viewedDocument?.guests || []),
          viewedDocument?.creator,
          ...(team?.users.map((user) => user.user) || []),
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
    [viewedDocument?.guests, viewedDocument?.creator, team?.users],
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
  const onClickBack = () => {
    if (pathname === '/me') {
      setCurrentlyViewedDocumentId(null);
    } else {
      router.push('/me');
    }
  };
  const onClickLike = (like: boolean) => {
    if (!viewedDocument?.team) {
      return;
    }
    updateDocumentAsGuest({
      documentId: documentId,
      teamId: viewedDocument?.team,
      updateDocumentAsGuestDTO: {
        isLiked: like,
      },
    });
  };
  return (
    <Stack
      direction="column"
      flex={1}
      sx={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: '100%',
      }}
      paddingX={2}
      paddingTop={isMobile ? 0 : 7}
    >
      {isMobile ? (
        <>
          <DocumentViewHeader onClickBack={onClickBack} />
          <Toolbar />
        </>
      ) : null}
      {isLoading ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Stack>
      ) : !viewedDocument ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <h1>Document not found</h1>
        </Stack>
      ) : (
        <Grid
          container
          width="100%"
          minHeight="100%"
          paddingX={{ xs: 1, md: 3, lg: 5 }}
          alignItems="start"
        >
          {!isMobile && (
            <Grid item xs={1} sm={1.5}>
              <Button
                variant="text"
                startIcon={<KeyboardArrowLeft />}
                onClick={onClickBack}
                sx={{ color: 'black', textTransform: 'none' }}
              >
                Back
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm={9}>
            <Stack maxWidth="md" width="100%" paddingBottom={2}>
              <Stack alignItems="center" width="100%">
                <Typography variant="h1" paddingBottom={3} textAlign="center">
                  {decodeHTML(viewedDocument.title ?? '')}
                </Typography>
                {viewedDocument?.mainMedia?.src ? (
                  <Box
                    component="img"
                    src={viewedDocument.mainMedia.src}
                    width="100%"
                    sx={{
                      borderBottomRightRadius: '20px',
                      borderTopLeftRadius: '20px',
                      boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                ) : viewedDocument?.mainMedia?.html ? (
                  <Box
                    sx={{ maxWidth: '100px' }}
                    dangerouslySetInnerHTML={{
                      __html: viewedDocument.mainMedia.html,
                    }}
                  />
                ) : null}
                <Grid container width="100%" marginTop={2}>
                  <Grid item xs={12}>
                    <DocumentCreator
                      creator={viewedDocument.creator}
                      insight={viewedDocument.summary}
                    />
                  </Grid>
                </Grid>
                <Grid container width="100%" marginTop={1}>
                  <Grid item xs={12}>
                    <DocumentHeader
                      {...viewedDocument}
                      likesCount={viewedDocument.likes?.length ?? 0}
                      readersCount={viewedDocument.readers?.length ?? 0}
                      typographyProps={{
                        variant: 'body2',
                        textAlign: 'center',
                      }}
                    />
                  </Grid>
                </Grid>
              </Stack>
              <DocumentTags
                tags={tags.raw}
                documentTagsIds={viewedDocument.tags.map((tag) =>
                  tag._id.toString(),
                )}
              />
              <Stack
                justifyContent="center"
                direction="row"
                width="100%"
                paddingTop={2}
                paddingBottom={3}
              >
                <IconButton
                  onClick={() => onClickLike(!isDocumentLiked)}
                  sx={{ padding: 0 }}
                >
                  {isDocumentLiked ? <ThumbUp /> : <ThumbUpOffAlt />}
                </IconButton>
              </Stack>
              {(!viewedDocument.aiSummary ||
                (Array.isArray(viewedDocument.aiSummary) &&
                  viewedDocument.aiSummary.length === 0)) && (
                <Button
                  sx={{ marginBottom: 2 }}
                  onClick={() => {
                    summarizeDocument({
                      documentId: viewedDocument._id,
                    });
                  }}
                  variant="outlined"
                >
                  {'Summarize this document'}
                </Button>
              )}
              {viewedDocument.aiSummary &&
                viewedDocument.aiSummary.length > 0 && (
                  <Box
                    sx={{
                      backgroundColor: 'rgb(255,251,191)',
                      padding: '20px 30px',
                      boxSizing: 'border-box',
                      marginBottom: '30px',
                      boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Beenhere
                        sx={{
                          width: '50px',
                          height: '50px',
                        }}
                      />
                      {/*<Typography*/}
                      {/*  variant="h5"*/}
                      {/*  sx={{ color: 'primary.main', marginBottom: '10px' }}*/}
                      {/*>*/}
                      {/*  {'Summary'}*/}
                      {/*</Typography>*/}
                    </Box>
                    <ul style={{ paddingLeft: '20px' }}>
                      {viewedDocument.aiSummary?.map((sentence, i) => (
                        <li key={i} style={{ marginBottom: '10px' }}>
                          <Typography
                            variant="body1"
                            whiteSpace="pre-line"
                            sx={{ fontStyle: 'italic' }}
                          >
                            {sentence}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}

              <div
                dangerouslySetInnerHTML={{ __html: viewedDocument.content }}
              />
              <Typography variant="h2" marginTop={3}>
                Comments
              </Typography>
              <Stack spacing={2} paddingY={2}>
                {viewedDocument.comments?.map((comment, index) => (
                  <DocumentComment
                    key={index}
                    index={index}
                    commentAuthorsById={commentAuthorsById}
                    comment={comment}
                  />
                ))}
              </Stack>
              <Editor
                editorState={editedCommentText}
                onEditorStateChange={(value) => setEditedCommentText(value)}
                mention={{
                  separator: ' ',
                  trigger: '@',
                  suggestions: userMentions,
                }}
                placeholder="Say something..."
                wrapperStyle={{
                  width: '100%',
                  overflowY: 'visible',
                }}
                editorStyle={{
                  overflowY: 'visible',
                  overflow: 'unset',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  paddingLeft: '10px',
                }}
                toolbarHidden
              />
              <Button
                onClick={onSubmitAddComment}
                variant="contained"
                sx={{ alignSelf: 'flex-end', marginTop: 2 }}
              >
                Send
              </Button>
            </Stack>
          </Grid>
          {!isMobile && <Grid item xs={1} sm={1.5} />}
        </Grid>
      )}
    </Stack>
  );
}

export default DocumentView;
