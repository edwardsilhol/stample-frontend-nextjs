import { Chip, Stack } from '@mui/material';
import { useMemo } from 'react';
import { Tag } from 'stores/types/tag.types';

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
      maxHeight={maxLines ? `${maxLines * 32}px` : undefined}
    >
      {displayedTags.map((tag) => (
        <Chip key={tag._id} label={`#${tag.name}`} />
      ))}
    </Stack>
  );
};
