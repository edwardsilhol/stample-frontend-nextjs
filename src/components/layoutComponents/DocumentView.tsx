'use-client';

import React from 'react';
import { CircularProgress, Grid } from '@mui/material';
import Stack from '../muiOverrides/Stack';
import { useRawDocuments } from '../../stores/hooks/document.hooks';
import Typography from '../muiOverrides/Typography';
import { useRawTags } from '../../stores/hooks/tag.hooks';
import Box from '../muiOverrides/Box';

interface DocumentViewProps {
  selectedTag: string;
  searchValue: string;
}
export const DocumentView: React.FC<DocumentViewProps> = ({
  selectedTag,
  searchValue,
}) => {
  const { data: documents, isLoading: isDocumentsLoading } = useRawDocuments();
  const { data: tags, isLoading: isTagsLoading } = useRawTags();

  return !isDocumentsLoading && !isTagsLoading && documents && tags ? (
    <Box margin={2}>
      <Grid container spacing={2}>
        {documents
          .filter((document) => {
            searchValue = searchValue.toLowerCase();
            return searchValue == ''
              ? document.tags.includes(selectedTag)
              : selectedTag === ''
              ? document.title.toLowerCase().includes(searchValue)
              : document.tags.includes(selectedTag) &&
                document.title.toLowerCase().includes(searchValue);
          })
          .map((document) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={document._id}>
              <Stack
                direction={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                height={'100%'}
                spacing={1}
                sx={{
                  padding: '10px',
                  boxShadow: '0 0 5px rgba(200, 200, 200, 0.5)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <Typography fontSize={'13px'} fontWeight={500}>
                  {document.title}
                </Typography>
                <Typography
                  fontSize={'11px'}
                  fontWeight={400}
                  color={'rgba(0, 0, 255, 0.8)'}
                >
                  {document.tags
                    .map((tag) => tags?.find((t) => t._id === tag)?.name)
                    .map((tag) => `#${tag}`)
                    .join(' ')}
                </Typography>
                <Typography
                  fontSize={'11px'}
                  fontWeight={400}
                  sx={{ opacity: 0.8 }}
                >
                  {document.summary}
                </Typography>
              </Stack>
            </Grid>
          ))}
      </Grid>
    </Box>
  ) : (
    <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
      <CircularProgress />
    </Stack>
  );
};
