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
import { Masonry } from '@mui/lab';

const DocumentGridItem: React.FC<{
  document: Document;
  selectedDocumentId: string | null;
  setDocumentId: (id: string) => void;
  flatTags?: Tag[];
}> = ({ document, selectedDocumentId, setDocumentId, flatTags }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: selectedDocumentId ? 'row' : 'column',
        ...(selectedDocumentId
          ? {
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
            }
          : {}),
      }}
      variant={selectedDocumentId ? 'outlined' : 'elevation'}
      onClick={() => setDocumentId(document._id)}
    >
      {document.mainMedia?.src ? (
        <CardMedia
          sx={{
            flex: selectedDocumentId ? 1 : undefined,
            ...(selectedDocumentId
              ? {
                  backgroundSize: 'contain',
                  backgroundPosition: 'unset',
                }
              : {}),
            height: '100px',
          }}
          image={document.mainMedia?.src}
        />
      ) : null}
      <CardContent
        sx={{
          overflow: 'hidden',
          height: '100%',
          '&:last-child': {
            paddingBottom: 2,
          },
          flex: 3,
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
          padding={documentId ? 0 : 2}
          sx={{
            height: '100%',
            width: documentId ? '420px' : '100%',
            overflowY: 'auto',
            backgroundColor: 'additionalColors.sidebarBackground',
          }}
        >
          <Masonry
            columns={
              documentId
                ? 1
                : {
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                  }
            }
            spacing={documentId ? 0 : 2}
            sx={{ flex: 1 }}
          >
            {filteredDocuments.map((document, index) => (
              <DocumentGridItem
                key={index}
                document={document}
                selectedDocumentId={documentId}
                setDocumentId={setDocumentId}
                flatTags={flatTags}
              />
            ))}
          </Masonry>
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
