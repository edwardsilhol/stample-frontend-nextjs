import { Chip, Stack } from '@mui/material';
import { useMemo } from 'react';
import { Tag } from 'stores/types/tag.types';
const TAG_NAME_MAX_LENGTH = 20;
interface DocumentTagsProps {
  tags: Tag[] | undefined;
  documentTagsIds: string[];
  maxLines?: number;
}

function DocumentTags({ tags, documentTagsIds, maxLines }: DocumentTagsProps) {
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
      justifyContent="center"
      spacing={1}
      overflow="hidden"
      width="100%"
      flexWrap="wrap"
      paddingTop={2}
      paddingBottom={1}
      maxHeight={maxLines ? `${maxLines * 26}px` : undefined}
    >
      {displayedTags.map((tag) => (
        <Chip
          key={tag._id}
          label={`# ${
            tag.name && tag.name?.length
              ? tag.name.length > TAG_NAME_MAX_LENGTH
                ? tag.name.toLowerCase().slice(0, TAG_NAME_MAX_LENGTH) + '...'
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
}
export default DocumentTags;
