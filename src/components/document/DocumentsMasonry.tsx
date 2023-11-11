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
import DocumentGridItem from '../grids/documentGridItem';
import { useWindowHeight } from '@react-hook/window-size';
import { DOCUMENT_ROUTE, TEAM_ROUTE } from '../../constants/routes.constant';
import { useRouter } from 'next/navigation';
import { useSession } from '../../stores/hooks/user.hooks';
import { useTeam } from '../../stores/hooks/team.hooks';
import { doesUserHaveTeamPrivilege } from '../../utils/team';

interface DocumentsMasonryProps {
  teamId: string;
  documents: MinimalDocument[];
  total: number;
  flatTags?: Tag[];
  searchId: string;
  containerWidth?: number;
  fetchNextPage: () => void;
  variant: 'grid' | 'list';
}

function DocumentsMasonryComponent({
  teamId,
  documents,
  total,
  flatTags,
  searchId,
  containerWidth,
  fetchNextPage,
  variant,
}: DocumentsMasonryProps) {
  const { data: user, isLoading: isUserLoading } = useSession();
  const { data: team, isLoading: isTeamLoading } = useTeam(teamId);
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

  const userHasTeamPrivilege = doesUserHaveTeamPrivilege(
    user?._id,
    team?.users,
  );

  const renderItem = useCallback(
    (props: { index: number; data: MinimalDocument }) => {
      const document = props.data;
      return !isUserLoading && !isTeamLoading && team && user ? (
        <DocumentGridItem
          isTeamPersonal={team.isPersonal}
          userHasTeamPrivilege={userHasTeamPrivilege}
          currentUserId={user?._id}
          document={document}
          flatTags={flatTags}
          onClick={() =>
            router.push(
              `${TEAM_ROUTE}/${document.team}${DOCUMENT_ROUTE}/${document._id}`,
            )
          }
        />
      ) : (
        <></>
      );
    },
    [isUserLoading, user, isTeamLoading, team],
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
