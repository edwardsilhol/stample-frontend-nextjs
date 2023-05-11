import { Chip, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Tag } from '@src/stores/types/tag.types';

interface Props {
  tags: Tag[] | undefined;
  documentTagsIds: string[];
  maxLines?: number;
}

export const DocumentTags: React.FC<Props> = ({
  tags,
  documentTagsIds,
  maxLines,
}) => {
  const displayedTags = useMemo(
    () =>
      documentTagsIds
        ? documentTagsIds
            .map((tagId) => tags?.find((tag) => tag._id === tagId))
            .filter((tag): tag is Tag => !!tag)
        : [],
    [documentTagsIds, tags],
  );
  return (
    <Stack
      direction="row"
      spacing={1}
      overflow="hidden"
      width="100%"
      flexWrap="wrap"
      maxHeight={maxLines ? `${maxLines * 26}px` : undefined}
    >
      {displayedTags.map((tag) => (
        <Chip
          key={tag._id}
          label={
            <Typography
              fontFamily="Google Sans,arial,sans-serif;"
              sx={{
                fontSize: '14px',
              }}
            >
              {`#${tag.name}`}
            </Typography>
          }
          sx={{
            height: '26px',
            backgroundColor: 'additionalColors.chip',
          }}
        />
      ))}
    </Stack>
  );
};
