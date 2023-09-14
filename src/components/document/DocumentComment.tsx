import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { formatDistance } from 'date-fns';
import React from 'react';
import { useMemo } from 'react';
import { Comment, CommentMentionType } from 'stores/types/comment.types';
import { UserForOtherClient } from 'stores/types/user.types';

interface Props {
  comment: Comment;
  commentAuthorsById: Record<string, UserForOtherClient>;
  index: number;
}

export const DocumentComment: React.FC<Props> = ({
  comment,
  commentAuthorsById,
  index,
}) => {
  const author = commentAuthorsById[comment.creatorId];
  const content: React.ReactNode[] = useMemo(
    () =>
      Array.isArray(comment.mentions) && comment.mentions.length > 0
        ? comment.mentions
            .reduce(
              (
                accumulator: {
                  text: string;
                  mentionTypeIfMention?: CommentMentionType;
                }[],
                mention,
                index,
              ) => {
                if (index === 0) {
                  accumulator.push({
                    text: comment.content.slice(0, mention.start),
                  });
                } else {
                  accumulator.push({
                    text: comment.content.slice(
                      comment.mentions[index - 1].start,
                      mention.start,
                    ),
                  });
                }
                if (
                  mention.type === CommentMentionType.USER &&
                  mention.user &&
                  commentAuthorsById[mention.user]
                ) {
                  const user = commentAuthorsById[mention.user];
                  accumulator.push({
                    text: `@${user.firstName} ${user.lastName}`,
                    mentionTypeIfMention: CommentMentionType.USER,
                  });
                } else if (mention.type === CommentMentionType.EVERYONE) {
                  accumulator.push({
                    text: '',
                    mentionTypeIfMention: CommentMentionType.EVERYONE,
                  });
                }
                if (index === comment.mentions.length - 1) {
                  accumulator.push({
                    text: comment.content.slice(mention.start),
                  });
                }
                return accumulator;
              },
              [],
            )
            .map((part, index) => {
              if (part.mentionTypeIfMention === CommentMentionType.USER) {
                return (
                  <Typography
                    key={index}
                    variant="body1"
                    component="span"
                    sx={{ color: 'primary.main' }}
                  >
                    {part.text}
                  </Typography>
                );
              } else if (
                part.mentionTypeIfMention === CommentMentionType.EVERYONE
              ) {
                return (
                  <Typography
                    key={index}
                    variant="body1"
                    component="span"
                    sx={{ color: 'primary.main' }}
                  >
                    @Everyone
                  </Typography>
                );
              }
              return (
                <Typography key={index} variant="body1" component="span">
                  {part.text}
                </Typography>
              );
            })
        : [<>{comment.content}</>],
    [comment, commentAuthorsById],
  );

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
        <Typography variant="body1">{content}</Typography>
      </CardContent>
    </Card>
  );
};
