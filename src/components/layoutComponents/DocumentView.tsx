'use-client';

import React from 'react';
import { CircularProgress, Grid } from '@mui/material';
import Stack from '../muiOverrides/Stack';
import { Document } from '../../stores/types/document.types';

interface DocumentViewProps {
  documents: Document[] | undefined;
  isDocumentsLoading: boolean;
  selectedTag: string;
}
export const DocumentView: React.FC<DocumentViewProps> = ({
  documents,
  isDocumentsLoading,
  selectedTag,
}) => {
  return !isDocumentsLoading && documents ? (
    <Grid container spacing={2}>
      {documents
        .filter((document) => document.tags.includes(selectedTag))
        .map((document) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={document._id}>
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
            >
              <Stack
                sx={{
                  width: '100%',
                  height: '100%',
                  boxShadow: '0 0 5px rgba(200, 200, 200, 0.5)',
                  borderRadius: '8px',
                }}
              >
                {document.title}
              </Stack>
            </Stack>
          </Grid>
        ))}
    </Grid>
  ) : (
    <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
      <CircularProgress />
    </Stack>
  );
};
