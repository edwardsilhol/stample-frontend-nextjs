import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { formatDistance } from 'date-fns';
import { Comment } from 'stores/types/comment.types';
import { UserForOtherClient } from 'stores/types/user.types';
import RichTextEditor from '../forms/fields/richTextEditor';

interface DocumentCommentProps {
  comment: Comment;
  commentAuthorsById: Record<string, UserForOtherClient>;
  index: number;
}

function DocumentComment({
  comment,
  commentAuthorsById,
  index,
}: DocumentCommentProps) {
  const author = commentAuthorsById[comment.creatorId];

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
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ paddingRight: '10px' }}
          >
            {formatDistance(new Date(comment.createdAt), new Date())} ago
          </Typography>
        }
      />
      <CardContent>
        <RichTextEditor
          name={comment._id}
          editable={false}
          editorState={comment.content}
        />
      </CardContent>
    </Card>
  );
}

export default DocumentComment;
