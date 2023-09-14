import { Beenhere } from '@mui/icons-material';

('use-client');

import React, { useCallback, useMemo } from 'react';
import { Avatar, Card, CardContent, CardMedia } from '@mui/material';
import Typography from '../muiOverrides/Typography';
import Box from '../muiOverrides/Box';
import { MinimalDocument } from '../../stores/types/document.types';
import { useSelectedTeamTags } from '../../stores/hooks/tag.hooks';
import { Tag } from 'stores/types/tag.types';
import { DocumentHeader } from './DocumentHeader';
import { useSelectedTagId } from 'stores/data/tag.data';

import {
  useContainerPosition,
  useInfiniteLoader,
  useMasonry,
  usePositioner,
  useResizeObserver,
} from 'masonic';
import {
  useCurrentlyViewedDocumentId,
  useSearchDocumentsQuery,
} from 'stores/data/document.data';
import { useSelectedTeamId } from 'stores/data/team.data';
import { useWindowHeight } from '@react-hook/window-size';
import useScreenResizeObserver from 'use-resize-observer';
import { useScroller } from 'utils/hooks/useScroller';
import { decodeHTML } from 'entities';
export const DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID =
  'documents-view-scrollable';

const DocumentGridItem: React.FC<{
  document: MinimalDocument;
  flatTags?: Tag[];
}> = ({ document }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCurrentlyViewedDocumentId] = useCurrentlyViewedDocumentId();

  if (!document) {
    return null;
  }
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        filter: 'drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.05));',
      }}
      variant="elevation"
    >
      {document.mainMedia?.src ? (
        <CardMedia
          sx={{
            height: '150px',
            backgroundPosition: '50% 20%',
          }}
          image={document.mainMedia?.src}
        />
      ) : null}
      <CardContent
        sx={{
          overflow: 'hidden',
          height: '100%',
          padding: 0,
          '&:last-child': {
            paddingBottom: 0,
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
          <Box
            sx={{ padding: 2, cursor: 'pointer' }}
            onClick={() => setCurrentlyViewedDocumentId(document._id)}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                marginBottom: '5px',
              }}
            >
              {decodeHTML(document.title ?? '')}
            </Typography>
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
            {/*<Avatar*/}
            {/*  sizes="large"*/}
            {/*  src={creator.profilePictureUrl}*/}
            {/*  sx={{*/}
            {/*    width: '50px',*/}
            {/*    height: '50px',*/}
            {/*    marginTop: '10px',*/}
            {/*    marginBottom: '10px',*/}
            {/*    border: '5px solid',*/}
            {/*    borderColor: 'primary.main',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {creator.profilePictureUrl*/}
            {/*    ? null*/}
            {/*    : `${creator.firstName[0]}${creator.lastName[0]}`}*/}
            {/*</Avatar>*/}
            {/*<Typography variant="h5" fontWeight={700} marginLeft={0}>*/}
            {/*  {creator.firstName} {creator.lastName}*/}
            {/*</Typography>*/}
            {document.summary && (
              <Box
                sx={{
                  position: 'relative',
                  background: '#f1f4fc',
                  textAlign: 'center',
                  width: '80%',
                  height: 'auto',
                  marginTop: '20px',
                  marginBottom: '10px',
                  marginLeft: '10%',
                  borderRadius: '10px',
                  padding: '10px',
                  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    display: 'block',
                    width: 0,
                    zIndex: 1,
                    borderStyle: 'solid',
                    borderColor: '#f1f4fc transparent',
                    borderWidth: '0 15px 15px',
                    top: '-15px',
                    left: '50%',
                    marginLeft: '-15px',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'primary.main', fontStyle: 'italic' }}
                >
                  {decodeHTML(document.summary)}
                </Typography>
              </Box>
            )}
          </Box>
          {document.aiSummary && document.aiSummary.length > 0 && (
            <Box sx={{ padding: 2, backgroundColor: '#f9f9f9' }}>
              <Box
                sx={{
                  textAlign: 'center',
                }}
              >
                <Box sx={{ marginTop: 0 }}>
                  <Beenhere
                    sx={{
                      width: '22px',
                      height: '22px',
                      color: 'primary.main',
                    }}
                  />
                </Box>
                <ul
                  style={{
                    paddingLeft: '14px',
                    marginBlockStart: 0,
                    marginBlockEnd: 0,
                    textAlign: 'left',
                  }}
                >
                  {document.aiSummary?.map((sentence, i) => (
                    <Typography
                      key={i}
                      variant="caption"
                      whiteSpace="pre-line"
                      sx={{
                        fontStyle: 'italic',
                        lineHeight: '18px',
                      }}
                    >
                      <li key={i} style={{ marginBottom: '5px' }}>
                        {sentence}
                      </li>
                    </Typography>
                  ))}
                </ul>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
const DocumentsMasonry: React.FC<{
  documents: MinimalDocument[];
  total: number;
  flatTags?: Tag[];
  searchId: string;
  containerWidth?: number;
  fetchNextPage: () => void;
}> = ({
  documents,
  total,
  flatTags,
  searchId,
  containerWidth,
  fetchNextPage,
}) => {
  const containerRef = React.useRef(null);
  const { width } = useContainerPosition(containerRef, [containerWidth]);
  const positioner = usePositioner(
    {
      width,
      columnWidth: 300,
      columnGutter: 20,
    },
    [searchId, width],
  );
  const { scrollTop, isScrolling } = useScroller(
    DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID,
  );
  const height = useWindowHeight();
  const resizeObserver = useResizeObserver(positioner);
  const infiniteLoader = useInfiniteLoader(fetchNextPage, {
    totalItems: total,
    minimumBatchSize: 70,
  });
  const renderItem = useCallback(
    (props: { index: number; data: MinimalDocument }) => {
      return <DocumentGridItem document={props.data} flatTags={flatTags} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
    prev.documents === next.documents &&
    prev.flatTags === next.flatTags &&
    prev.searchId === next.searchId &&
    prev.containerWidth === next.containerWidth
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
  const [selectedTagId] = useSelectedTagId();
  const [searchDocumentsQuery] = useSearchDocumentsQuery();
  const [selectedTeamId] = useSelectedTeamId();
  const searchId = useMemo(
    () => `${selectedTeamId}-${selectedTagId}-${searchDocumentsQuery}`,
    [selectedTagId, searchDocumentsQuery, selectedTeamId],
  );
  const ref = React.useRef<HTMLElement | null>(null);
  const { width } = useScreenResizeObserver({
    ref,
  });
  return (
    <Box paddingX={{ xs: 1, sm: 2 }} paddingY={{ xs: 1 }}>
      <Box
        sx={{
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'hidden',
          height: 'auto',
          minHeight: '100%',
        }}
        ref={ref}
      >
        <MemoizedDocumentsMasonry
          documents={documents}
          flatTags={flatTags}
          searchId={searchId}
          containerWidth={width}
          fetchNextPage={fetchNextPage}
          total={totalDocumentsCount}
        />
      </Box>
    </Box>
  );
};
