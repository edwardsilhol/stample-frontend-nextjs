'use-client';

import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';
import Stack from '../muiOverrides/Stack';
import Typography from '../muiOverrides/Typography';
import Box from '../muiOverrides/Box';
import { MinimalDocument } from '../../stores/types/document.types';
import { DocumentView } from './DocumentView';
import { useSelectedTeamTags } from '../../stores/hooks/tag.hooks';
import { Tag } from 'stores/types/tag.types';
import { DocumentHeader } from './DocumentHeader';
import { DocumentTags } from './DocumentTags';
import { Masonry } from '@mui/lab';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { getDocumentsByTags } from 'helpers/document.helpers';
import { useSelectedTagId } from 'stores/data/tag.data';

const DocumentGridItem: React.FC<{
  document: MinimalDocument;
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
  documents: MinimalDocument[];
  tagId: string | null;
}
export const DocumentsView: React.FC<DocumentViewProps> = ({ documents }) => {
  const {
    data: { raw: flatTags },
  } = useSelectedTeamTags();
  const isMobile = useIsMobile();
  const [documentId, setDocumentId] = React.useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [selectedTagId] = useSelectedTagId();
  const documentsByTags = useMemo<Record<string, MinimalDocument[]>>(
    () => getDocumentsByTags(documents),
    [documents],
  );

  const filteredDocuments = useMemo<MinimalDocument[]>(() => {
    if (!selectedTagId) {
      return documents;
    }
    return documentsByTags[selectedTagId] ?? [];
  }, [documents, documentsByTags, selectedTagId]);
  useEffect(() => {
    if (
      documentId &&
      !documents.some((document) => document._id === documentId)
    ) {
      setDocumentId(null);
      setIsFullScreen(false);
    }
  }, [documentId, documents]);

  const onToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  return (
    <Stack
      direction="row"
      flex={1}
      sx={{
        overflowY: 'hidden',
        overflowX: 'hidden',
      }}
    >
      {!isFullScreen && !(isMobile && documentId) && (
        <Box
          padding={documentId ? 0 : { xs: 1, sm: 2 }}
          sx={{
            height: '100%',
            width: documentId ? undefined : '100%',
            flex: documentId ? { md: 1 } : undefined,
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
            sx={{
              flex: 1,
              marginRight: 0,
              '&.MuiMasonry-root': {
                margin: 0,
              },
            }}
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
