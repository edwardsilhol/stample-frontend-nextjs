'use client';

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
import { DOCUMENT_ROUTE, TEAM_ROUTE } from '../../constants/routes.constant';
import { useRouter } from 'next/navigation';

interface DocumentsMasonryProps {
  documents: MinimalDocument[];
  total: number;
  flatTags?: Tag[];
  searchId: string;
  containerWidth?: number;
  fetchNextPage: () => void;
  variant: 'grid' | 'list';
}

function DocumentsMasonryComponent({
  documents,
  total,
  flatTags,
  searchId,
  containerWidth,
  fetchNextPage,
  variant,
}: DocumentsMasonryProps) {
  const router = useRouter();
  const containerRef = useRef(null);
  const { width } = useContainerPosition(containerRef, [containerWidth]);
  const positioner = usePositioner(
    {
      width,
      ...(variant === 'list'
        ? { columnWidth: width, maxColumnCount: 1 } // TODO: ask Thibaut
        : {
            columnWidth: 300,
            columnGutter: 20,
          }),
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
      const document = props.data;
      return (
        <DocumentGridItem
          document={document}
          flatTags={flatTags}
          onClick={() =>
            router.push(
              `${TEAM_ROUTE}/${document.team}${DOCUMENT_ROUTE}/${document._id}`,
            )
          }
        />
      );
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
    role: variant,
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
