'use-client';

import React from 'react';
import { Grid } from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import Typography from '../../muiOverrides/Typography';
import Box from '../../muiOverrides/Box';
import { Document } from '../../../stores/types/document.types';
import { DocumentView } from './DocumentView';
import { useTags } from '../../../stores/hooks/tag.hooks';

interface DocumentViewProps {
  searchValue: string;
  documents: Document[];
}
export const DocumentsView: React.FC<DocumentViewProps> = ({
  searchValue,
  documents,
}) => {
  const {
    data: { flatTags },
    isLoading,
  } = useTags();
  const [documentId, setDocumentId] = React.useState<string | null>(null);
  const gridWidth = documentId
    ? { xs: 12, sm: 12, md: 12, lg: 12 }
    : { xs: 12, sm: 6, md: 4, lg: 3 };

  const getGridItem = (document: Document, index: number) => {
    return (
      <Grid item {...gridWidth} key={index}>
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
              .map((tag) => flatTags?.find((t) => t._id === tag)?.name)
              .map((tag) => `#${tag}`)
              .join(' ')}
          </Typography>
          <Typography fontSize={'11px'} fontWeight={400} sx={{ opacity: 0.8 }}>
            {document.summary}
          </Typography>
        </Stack>
      </Grid>
    );
  };

  return isLoading ? null : (
    <Stack direction={'row'} width={'100%'}>
      <Box
        padding={2}
        sx={{
          maxHeight: 'calc(100vh - 42px)',
          flexGrow: 1,
          overflowY: 'auto',
          width: documentId ? '420px' : '100%',
        }}
      >
        <Grid container spacing={2}>
          {documents
            .filter((document) => {
              if (searchValue !== '') {
                searchValue = searchValue.toLowerCase();
                return document.title.toLowerCase().includes(searchValue);
              }
              return true;
            })
            .map((document, index) => getGridItem(document, index))}
        </Grid>
      </Box>
      {documentId && (
        <DocumentView
          documentId={documentId}
          setDocumentId={setDocumentId}
          tags={flatTags}
        />
      )}
    </Stack>
  );
};
