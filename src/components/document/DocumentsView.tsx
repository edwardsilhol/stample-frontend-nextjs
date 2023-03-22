'use-client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardMedia, Grid } from '@mui/material';
import Stack from '../muiOverrides/Stack';
import Typography from '../muiOverrides/Typography';
import Box from '../muiOverrides/Box';
import { Document } from '../../stores/types/document.types';
import { DocumentView } from './DocumentView';
import { useTags } from '../../stores/hooks/tag.hooks';
import { Tag } from 'stores/types/tag.types';
import { getDocumentsByTags, searchDocuments } from 'helpers/document.helpers';
import { DocumentHeader } from './DocumentHeader';
import { DocumentTags } from './DocumentTags';

const DocumentGridItem: React.FC<{
  document: Document;
  selectedDocumentId: string | null;
  setDocumentId: (id: string) => void;
  flatTags?: Tag[];
}> = ({ document, selectedDocumentId, setDocumentId, flatTags }) => {
  return (
    <Grid item xs={12} {...(selectedDocumentId ? {} : { md: 6, lg: 4, xl: 3 })}>
      <Card
        sx={{
          height: '300px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={() => setDocumentId(document._id)}
      >
        {document.mainMedia?.src ? (
          <CardMedia sx={{ height: 140 }} image={document.mainMedia?.src} />
        ) : null}
        <CardContent
          sx={{
            overflow: 'hidden',
            height: '100%',
            '&:last-child': {
              paddingBottom: 2,
            },
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="body2"
              fontWeight={550}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {document.title}
            </Typography>
            <Box paddingY={1}>
              <DocumentTags
                tags={flatTags}
                documentTagsIds={document.tags}
                maxLines={1}
              />
            </Box>
            <DocumentHeader
              {...document}
              likesCount={document.likes?.length ?? 0}
              readersCount={document.readers?.length ?? 0}
              typographyProps={{
                sx: {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
              }}
            >
              {document.summary}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface DocumentViewProps {
  searchValue: string;
  documents: Document[];
  tagId: string | null;
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
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const documentsByTags = useMemo<Record<string, Document[]>>(
    () => getDocumentsByTags(documents),
    [documents],
  );

  const filteredDocuments = useMemo(
    () =>
      searchDocuments({
        documentsByTags,
        allDocuments: documents,
        searchQuery: searchValue,
        selectedTagId: tagId,
        allTags: flatTags,
      }),
    [searchValue, documents, documentsByTags, tagId, flatTags],
  );
  const onToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  return isLoading ? null : (
    <Stack
      direction={'row'}
      width={'100%'}
      flex={1}
      sx={{
        overflowY: 'hidden',
      }}
    >
      {!isFullScreen && (
        <Box
          padding={2}
          sx={{
            height: '100%',
            width: documentId ? '420px' : '100%',
            overflowY: 'auto',
          }}
        >
          <Grid container spacing={2} height="100%" sx={{ flex: 1 }}>
            {filteredDocuments.map((document, index) => (
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
      )}
      {documentId && (
        <DocumentView
          documentId={documentId}
          tags={flatTags}
          isFullScreen={isFullScreen}
          setDocumentId={setDocumentId}
          onToggleFullScreen={onToggleFullScreen}
        />
      )}
    </Stack>
  );
};
