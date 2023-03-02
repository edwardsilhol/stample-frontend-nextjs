'use-client';

import React from 'react';
import { Grid } from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import Typography from '../../muiOverrides/Typography';
import Box from '../../muiOverrides/Box';
import { Document } from '../../../stores/types/document.types';
import { Tag } from '../../../stores/types/tag.types';

interface DocumentViewProps {
  documents: Document[];
  tags: Tag[];
  tagId?: string;
  searchValue: string;
  setDocumentId: (id: string) => void;
  showDocument: boolean;
}
export const DocumentsView: React.FC<DocumentViewProps> = ({
  documents,
  tags,
  tagId,
  searchValue,
  setDocumentId,
  showDocument,
}) => {
  const gridWidth = showDocument
    ? { xs: 12, sm: 12, md: 12, lg: 6 }
    : { xs: 12, sm: 6, md: 4, lg: 3 };

  return (
    <Box margin={2}>
      <Grid container spacing={2}>
        {documents
          .filter((document) => {
            searchValue = searchValue.toLowerCase();
            return searchValue == ''
              ? document.tags.includes(tagId || '')
              : !tagId || tagId === ''
              ? document.title.toLowerCase().includes(searchValue)
              : document.tags.includes(tagId || '') &&
                document.title.toLowerCase().includes(searchValue);
          })
          .map((document) => (
            <Grid item {...gridWidth} key={document._id}>
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
                onClick={() => setDocumentId(document._id)}
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
  );
};
