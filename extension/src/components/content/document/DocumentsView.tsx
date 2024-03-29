import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { MinimalDocument } from '@src/stores/types/document.types';
import { Tag } from '@src/stores/types/tag.types';
import DocumentTags from './DocumentTags';
import { useAllTags } from '@src/stores/hooks/tanstackQuery/tag.hooks';
import { useWindowHeight } from '@react-hook/window-size';
import {
  useContainerPosition,
  useInfiniteLoader,
  useMasonry,
  usePositioner,
  useResizeObserver,
  useScroller,
} from 'masonic';
import { useSearchDocumentsQuery } from '@src/stores/hooks/jotai/document.hooks';
import { useSearchedDocuments } from '@src/stores/hooks/tanstackQuery/document.hooks';
import { getGoogleSearchQuery } from '@src/helpers/content.helpers';
import SelectTeam from '../SelectTeam';
import { useSelectedTeamId } from '@src/stores/hooks/jotai/team.hooks';
import { decodeHTML } from 'entities';
import DocumentHeader from '@src/components/content/document/DocumentHeader';

interface DocumentGridItemProps {
  document: MinimalDocument;
  flatTags?: Tag[];
}

function DocumentGridItem({ document, flatTags }: DocumentGridItemProps) {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
      }}
    >
      {document.mainMedia?.src ? (
        <CardMedia
          sx={{
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
          backgroundColor: 'additionalColors.sidebarBackground',
        }}
      >
        <Box
          sx={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {document.urlWebsiteName || document.url || document.title ? (
            <Typography
              variant="body2"
              fontWeight={550}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontFamily: 'Google Sans,arial,sans-serif;',
              }}
            >
              {document.url ? (
                <a
                  style={{ color: 'grey', fontSize: '12px' }}
                  href={document.url}
                >
                  {document.urlWebsiteName ? (
                    <>{document.urlWebsiteName}&nbsp;&nbsp;</>
                  ) : (
                    document.url
                  )}
                </a>
              ) : null}
              {decodeHTML(document.title ?? '')}
            </Typography>
          ) : null}
          {document.summary ? (
            <Typography
              variant="caption"
              color="primary.dark"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                fontFamily: 'Google Sans,arial,sans-serif;',
              }}
            >
              {decodeHTML(document.summary ?? '')}
            </Typography>
          ) : null}
          {document.tags && document.tags.length > 0 ? (
            <Box paddingY={1}>
              <DocumentTags
                tags={flatTags}
                documentTagsIds={document.tags}
                maxLines={1}
              />
            </Box>
          ) : null}
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
                fontFamily: 'Google Sans,arial,sans-serif;',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

interface DocumentMasonryProps {
  documents: MinimalDocument[];
  total: number;
  flatTags?: Tag[];
  searchId: string;
  containerWidth?: number;
  fetchNextPage: () => void;
}

function DocumentsMasonry({
  documents,
  total,
  flatTags,
  searchId,
  containerWidth,
  fetchNextPage,
}: DocumentMasonryProps) {
  const containerRef = useRef(null);
  const { width } = useContainerPosition(containerRef, [containerWidth]);
  const positioner = usePositioner(
    {
      width,
      columnWidth: 200,
      columnGutter: 16,
    },
    [searchId, width],
  );
  const { scrollTop, isScrolling } = useScroller();
  const height = useWindowHeight();
  const resizeObserver = useResizeObserver(positioner);
  const infiniteLoader = useInfiniteLoader(fetchNextPage, {
    totalItems: total,
    minimumBatchSize: 20,
  });
  const renderItem = useCallback(
    (props: { index: number; data: MinimalDocument }) => {
      return <DocumentGridItem document={props.data} flatTags={flatTags} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return useMasonry<MinimalDocument>({
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
}
const MemoizedDocumentsMasonry = memo(DocumentsMasonry, (prev, next) => {
  return (
    prev.documents === next.documents &&
    prev.flatTags === next.flatTags &&
    prev.searchId === next.searchId
  );
});

function DocumentsView() {
  const {
    data: { raw: flatTags },
  } = useAllTags();

  const { allDocuments, fetchNextPage, total } = useSearchedDocuments();
  const [selectedTeamId] = useSelectedTeamId();
  const [searchDocumentsQuery, setSearchDocumentsQuery] =
    useSearchDocumentsQuery();
  useEffect(() => {
    (setSearchDocumentsQuery as any)(getGoogleSearchQuery(document));
  }, [document]);
  const searchId = useMemo(
    () => `${searchDocumentsQuery}-${selectedTeamId}-${allDocuments.length}`,
    [searchDocumentsQuery, selectedTeamId, allDocuments.length],
  );
  const ref = useRef(null);

  return (
    <Box
      paddingX={{ xs: 1, sm: 2 }}
      paddingBottom={2}
      sx={{
        minHeight: '100%',
      }}
    >
      <SelectTeam />
      <Box paddingTop={2} ref={ref}>
        <MemoizedDocumentsMasonry
          documents={allDocuments}
          flatTags={flatTags}
          searchId={searchId}
          fetchNextPage={fetchNextPage}
          total={total}
        />
      </Box>
    </Box>
  );
}
export default DocumentsView;
