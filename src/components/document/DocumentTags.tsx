import { Chip, Stack } from '@mui/material';
import { useMemo } from 'react';
import { Tag } from 'stores/types/tag.types';
const TAG_NAME_MAX_LENGTH = 10;
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
          label={`#${
            tag.name && tag.name?.length
              ? tag.name.length > TAG_NAME_MAX_LENGTH
                ? tag.name.toLowerCase().slice(TAG_NAME_MAX_LENGTH) + '...'
                : tag.name.toLowerCase()
              : ''
          }`}
          sx={{
            height: '26px',
            fontSize: '14px',
            fontWeight: 700,
            backgroundColor: 'additionalColors.sidebarBackground',
            borderRadius: '4px',
          }}
        />
      ))}
    </Stack>
  );
};
