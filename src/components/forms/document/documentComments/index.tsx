import DocumentComment from '../../../document/DocumentComment';
import TextEditor from '../../fields/TextEditor';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { getMentionNodes } from '../../fields/TextEditor/utils/nodes';
import { CommentMentionType } from '../../../../stores/types/comment.types';
import { useEditor } from '../../fields/TextEditor/hooks/useEditor';
import { useMemo } from 'react';
import { Mention } from '../../../lists/mentionList';
import { uniqBy } from 'lodash';
import { UserForOtherClient } from '../../../../stores/types/user.types';
import { PopulatedDocument } from '../../../../stores/types/document.types';
import { PopulatedTeam } from '../../../../stores/types/team.types';
import { useCreateComment } from '../../../../stores/hooks/comment.hooks';

interface DocumentCommentsProps {
  documentId: string;
  isViewedDocumentLoading?: boolean;
  viewedDocument?: PopulatedDocument;
  team?: PopulatedTeam | null;
}

function DocumentComments({
  documentId,
  isViewedDocumentLoading,
  viewedDocument,
  team,
}: DocumentCommentsProps) {
  const createComment = useCreateComment(documentId);
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
  const userMentions = useMemo<Mention[]>(
    () => [
      {
        id: CommentMentionType.EVERYONE,
        label: 'Everyone',
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
          id: user._id,
          label: `${user.firstName} ${user.lastName}`,
          avatar: user.profilePictureUrl,
        })),
    ],
    [viewedDocument?.guests, viewedDocument?.creator, team?.users],
  );

  const commentEditor = useEditor(
    {
      placeholder: 'Say something...',
      editorStyle: {
        overflowY: 'visible',
        overflow: 'unset',
      },
      possibleMentions: userMentions,
    },
    [viewedDocument, isViewedDocumentLoading, userMentions],
  );
  const onSubmitAddComment = () => {
    if (!commentEditor) {
      return;
    }
    const mentionNodes = getMentionNodes(commentEditor?.state.doc);
    const mentions = mentionNodes.map((node) => {
      const mention = node.attrs.id;
      return {
        type:
          mention === CommentMentionType.EVERYONE
            ? CommentMentionType.EVERYONE
            : CommentMentionType.USER,
        user: mention === CommentMentionType.USER ? mention : undefined,
      };
    });

    if (!commentEditor.isEmpty && mentions) {
      createComment.mutate({
        content: commentEditor?.getHTML(),
        mentions,
      });
    }
    commentEditor.commands.clearContent();
  };
  return (
    <>
      <Stack spacing={2} paddingY={2}>
        {viewedDocument?.comments?.map((comment, index) => (
          <DocumentComment
            key={index}
            index={index}
            commentAuthorsById={commentAuthorsById}
            comment={comment}
          />
        ))}
      </Stack>
      <TextEditor editor={commentEditor} />
      <Button
        onClick={onSubmitAddComment}
        variant="contained"
        sx={{ alignSelf: 'flex-end', marginTop: 2 }}
      >
        Send
      </Button>
    </>
  );
}
export default DocumentComments;
