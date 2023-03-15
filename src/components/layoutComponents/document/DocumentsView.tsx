'use-client';

import React, { useMemo } from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import Typography from '../../muiOverrides/Typography';
import Box from '../../muiOverrides/Box';
import { Document } from '../../../stores/types/document.types';
import { DocumentView } from './DocumentView';
import { useTags } from '../../../stores/hooks/tag.hooks';
import { Tag } from 'stores/types/tag.types';

const DocumentGridItem: React.FC<{
  document: Document;
  selectedDocumentId: string | null;
  setDocumentId: (id: string) => void;
  flatTags?: Tag[];
}> = ({ document, selectedDocumentId, setDocumentId, flatTags }) => {
  const tagsString = useMemo(
    () =>
      document.tags
        .map((tag) => flatTags?.find((t) => t._id === tag)?.name)
        .map((tag) => `#${tag}`)
        .join(' '),
    [document.tags, flatTags],
  );

  return (
    <Grid item xs={12} {...(selectedDocumentId ? {} : { md: 6, lg: 4, xl: 3 })}>
      <Card sx={{ height: '100%' }}>
        {/*TODO add image
          <CardMedia
            sx={{ height: 140 }}
            image={document.url}
            title="green iguana"
          />
  */}
        <CardContent
          sx={{
            overflow: 'hidden',
            height: '100%',
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
            {tagsString}
          </Typography>
          <Typography fontSize={'11px'} fontWeight={400} sx={{ opacity: 0.8 }}>
            {document.summary}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface DocumentViewProps {
  searchValue: string;
  documents: Document[];
  tagId?: string;
}
export const DocumentsView: React.FC<DocumentViewProps> = ({
  searchValue,
  documents,
  tagId,
}) => {
  const {
    data: { raw: flatTags },
    isLoading,
  } = useTags();
  const [documentId, setDocumentId] = React.useState<string | null>(null);
  const filteredDocuments = useMemo(
    () =>
      documents.filter((document) => {
        const searchValueLowerCase = searchValue.toLowerCase();
        if (
          (searchValueLowerCase === '' || !searchValueLowerCase) &&
          (tagId === '' || !tagId)
        ) {
          return true;
        } else if (searchValueLowerCase === '' || !searchValueLowerCase) {
          return document.tags.includes(tagId || '');
        } else if (tagId === '' || !tagId) {
          return document.title.toLowerCase().includes(searchValueLowerCase);
        } else {
          return (
            document.tags.includes(tagId || '') &&
            document.title.toLowerCase().includes(searchValueLowerCase)
          );
        }
      }),
    [documents, searchValue, tagId],
  );
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
          {filteredDocuments
            .map((document, index) => (
              <DocumentGridItem
                key={index}
                document={document}
                selectedDocumentId={documentId}
                setDocumentId={setDocumentId}
                flatTags={flatTags}
              />
            ))}
        </Grid>
      </Box>
      {documentId && (
        <DocumentView
          documentId={documentId}
          setDocumentId={setDocumentId}
          tags={flatTags}
        />
      )}
    </Stack>)
}