'use-client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';
import Typography from '../muiOverrides/Typography';
import Box from '../muiOverrides/Box';
import { MinimalDocument } from '../../stores/types/document.types';
import { useSelectedTeamTags } from '../../stores/hooks/tag.hooks';
import { Tag } from 'stores/types/tag.types';
import { DocumentHeader } from './DocumentHeader';
import { DocumentTags } from './DocumentTags';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useSelectedTagId } from 'stores/data/tag.data';

import {
  useContainerPosition,
  useInfiniteLoader,
  useMasonry,
  usePositioner,
  useResizeObserver,
} from 'masonic';
import { useSearchDocumentsQuery } from 'stores/data/document.data';
import { useSelectedTeamId } from 'stores/data/team.data';
import { useWindowHeight } from '@react-hook/window-size';
import { DocumentView } from 'components/document/DocumentView';
import { useScroller } from 'utils/hooks/useScroller';
const DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID = 'documents-view-scrollable';
const DocumentGridItem: React.FC<{
  document: MinimalDocument;
  selectedDocumentId: string | null;
  setDocumentId: (id: string) => void;
  flatTags?: Tag[];
}> = ({ document, selectedDocumentId, setDocumentId, flatTags }) => {
  if (!document) {
    return null;
  }
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
const DocumentsMasonry: React.FC<{
  documents: MinimalDocument[];
  total: number;
  selectedDocumentId: string | null;
  setDocumentId: (id: string) => void;
  flatTags?: Tag[];
  searchId: string;
  fetchNextPage: () => void;
}> = ({
  documents,
  total,
  selectedDocumentId,
  setDocumentId,
  flatTags,
  searchId,
  fetchNextPage,
}) => {
  const isMobile = useIsMobile();
  const containerRef = React.useRef(null);
  const { width } = useContainerPosition(containerRef, [!!selectedDocumentId]);
  const positioner = usePositioner(
    {
      width,
      columnCount: isMobile || selectedDocumentId ? 1 : 3,
      columnGutter: selectedDocumentId ? 0 : 16,
    },
    [searchId, !!selectedDocumentId],
  );
  const { scrollTop, isScrolling } = useScroller(
    DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID,
  );
  const height = useWindowHeight();
  const resizeObserver = useResizeObserver(positioner);
  const infiniteLoader = useInfiniteLoader(fetchNextPage, {
    totalItems: total,
    minimumBatchSize: 20,
  });
  const renderItem = useCallback(
    (props: { index: number; data: MinimalDocument }) => {
      return (
        <DocumentGridItem
          document={props.data}
          selectedDocumentId={selectedDocumentId}
          setDocumentId={setDocumentId}
          flatTags={flatTags}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [!!selectedDocumentId],
  );

  return useMasonry({
    id: searchId,
    itemKey: (data) => data?._id,
    positioner,
    scrollTop,
    isScrolling,
    height,
    containerRef,
    items: documents,
    overscanBy: 2,
    resizeObserver,
    role: 'grid',
    render: renderItem,
    onRender: infiniteLoader,
  });
};
const MemoizedDocumentsMasonry = React.memo(DocumentsMasonry, (prev, next) => {
  return (
    !!prev.selectedDocumentId === !!next.selectedDocumentId &&
    prev.documents === next.documents &&
    prev.flatTags === next.flatTags &&
    prev.searchId === next.searchId
  );
});
interface DocumentViewProps {
  documents: MinimalDocument[];
  fetchNextPage: () => void;
  totalDocumentsCount: number;
}

export const DocumentsView: React.FC<DocumentViewProps> = ({
  documents,
  totalDocumentsCount,
  fetchNextPage,
}) => {
  const {
    data: { raw: flatTags },
  } = useSelectedTeamTags();
  const isMobile = useIsMobile();
  const [documentId, setDocumentId] = React.useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [selectedTagId] = useSelectedTagId();
  const [searchDocumentsQuery] = useSearchDocumentsQuery();
  const [selectedTeamId] = useSelectedTeamId();
  const searchId = useMemo(
    () => `${selectedTeamId}-${selectedTagId}-${searchDocumentsQuery}`,
    [selectedTagId, searchDocumentsQuery, selectedTeamId],
  );
  useEffect(() => {
    if (documentId) {
      setDocumentId(null);
    }
    if (isFullScreen) {
      setIsFullScreen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId]);

  const onToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  return (
    <Box
      flex={1}
      sx={{
        overflowX: 'hidden',
        minHeight: '100vh',
        width: '100%',
        overflowY: 'hidden',
        display: documentId ? 'flex' : undefined,
      }}
    >
      {!isFullScreen && !(isMobile && documentId) && (
        <Box
          paddingBottom={6}
          paddingX={documentId ? 0 : { xs: 1, sm: 2 }}
          paddingTop={documentId ? 0 : { xs: 1, sm: 2 }}
          sx={{
            height: '100%',
            width: documentId ? undefined : '100%',
            flex: documentId ? { md: 1 } : undefined,
            backgroundColor: 'additionalColors.sidebarBackground',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}
          id={DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID}
        >
          <MemoizedDocumentsMasonry
            documents={documents}
            selectedDocumentId={documentId}
            setDocumentId={setDocumentId}
            flatTags={flatTags}
            searchId={searchId}
            fetchNextPage={fetchNextPage}
            total={totalDocumentsCount}
          />
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
    </Box>
  );
};
