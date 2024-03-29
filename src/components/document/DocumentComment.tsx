import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { formatDistance } from 'date-fns';
import { Comment } from 'stores/types/comment.types';
import { UserForOtherClient } from 'stores/types/user.types';
import { useEditor } from '../forms/fields/TextEditor/hooks/useEditor';
import TextEditor from '../forms/fields/TextEditor';
import ActionButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useUpdateComment } from '../../stores/hooks/comment.hooks';

interface DocumentCommentProps {
  documentId: string;
  comment: Comment;
  commentAuthorsById: Record<string, UserForOtherClient>;
  index: number;
  currentUserId: string;
}

function DocumentComment({
  documentId,
  comment,
  commentAuthorsById,
  index,
  currentUserId,
}: DocumentCommentProps) {
  const updateComment = useUpdateComment();
  const [isEditable, setIsEditable] = useState(false);
  const author = commentAuthorsById[comment.creatorId];
  const editor = useEditor(
    {
      content: comment.content,
      editable: isEditable,
      editorStyle: {
        backgroundColor: isEditable ? 'white' : 'transparent',
      },
    },
    [comment.content, isEditable],
  );

  const handleUpdateComment = async () => {
    const { _id, creatorId, __v, ...rest } = Object(comment);
    await updateComment.mutateAsync({
      documentId,
      commentId: comment._id,
      updateCommentDTO: {
        ...rest,
        content: editor?.getHTML() || '',
      },
    });
    setIsEditable(false);
  };

  return (
    <Card
      key={comment._id}
      sx={{
        marginTop: index === 0 ? 0 : 1,
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        backgroundColor: 'additionalColors.background',
      }}
      variant="elevation"
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
        titleTypographyProps={{
          variant: 'body1',
          fontWeight: 700,
        }}
        action={
          <>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ paddingRight: '10px' }}
            >
              {`${formatDistance(new Date(comment.createdAt), new Date())} ago`}
              {comment.updatedAt !== comment.createdAt && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ paddingLeft: '10px' }}
                >
                  {`(Updated ${formatDistance(
                    new Date(comment.updatedAt),
                    new Date(),
                  )} ago)`}
                </Typography>
              )}
            </Typography>
            {currentUserId === comment.creatorId && (
              <ActionButton
                sx={{
                  color: 'primary.main',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
                onClick={() => setIsEditable(!isEditable)}
              >
                {!isEditable ? <EditIcon /> : <CloseIcon />}
              </ActionButton>
            )}
          </>
        }
      />
      <CardContent>
        <Stack spacing={1}>
          <TextEditor editor={editor} showMenu={false} />
          {isEditable && (
            <Button
              onClick={handleUpdateComment}
              variant="contained"
              sx={{ alignSelf: 'flex-end' }}
            >
              Send
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DocumentComment;
