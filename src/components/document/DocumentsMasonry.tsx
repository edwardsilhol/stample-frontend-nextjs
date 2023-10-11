import { MinimalDocument } from '../../stores/types/document.types';
import { Tag } from '../../stores/types/tag.types';
import {
  useContainerPosition,
  useInfiniteLoader,
  useMasonry,
  usePositioner,
  useResizeObserver,
} from 'masonic';
import { useScroller } from '../../utils/hooks/useScroller';
import { memo, useCallback, useRef } from 'react';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from './DocumentsView';
import DocumentGridItem from './DocumentGridItem';
import { useWindowHeight } from '@react-hook/window-size';

interface DocumentsMasonryProps {
  documents: MinimalDocument[];
  total: number;
  flatTags?: Tag[];
  searchId: string;
  containerWidth?: number;
  fetchNextPage: () => void;
}

function DocumentsMasonryComponent({
  documents,
  total,
  flatTags,
  searchId,
  containerWidth,
  fetchNextPage,
}: DocumentsMasonryProps) {
  const containerRef = useRef(null);
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
}
const DocumentsMasonry = memo(DocumentsMasonryComponent, (prev, next) => {
  return (
    prev.documents === next.documents &&
    prev.flatTags === next.flatTags &&
    prev.searchId === next.searchId &&
    prev.containerWidth === next.containerWidth
  );
});

export default DocumentsMasonry;
