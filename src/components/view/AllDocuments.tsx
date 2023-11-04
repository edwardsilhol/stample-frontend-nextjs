'use client';

import { useSearchDocuments } from '../../stores/hooks/document.hooks';
import DocumentsView from '../document/DocumentsView';
import { useParams, useSearchParams } from 'next/navigation';
import { SEARCH_QUERY_PARAM } from '../../constants/queryParams.constant';
import { useMemo } from 'react';
import CircularLoading from '../base/circularLoading';
import { RouteParams } from '../../stores/types/global.types';

function AllDocuments() {
  const { teamId, tagId } = useParams<RouteParams>();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get(SEARCH_QUERY_PARAM);
  const { data, isLoading, isFetching, fetchNextPage } = useSearchDocuments({
    ...(searchQuery
      ? {
          text: searchQuery,
        }
      : {}),
    ...(tagId ? { tags: [tagId] } : {}),
    team: teamId ? teamId : undefined,
  });
  const allDocuments = useMemo(
    () => data?.pages.flatMap((page) => page.documents) || [],
    [data?.pages],
  );

  const total = useMemo(
    () => data?.pages[0]?.total || 0,
    [data?.pages[0]?.total],
  );

  return isLoading || isFetching ? (
    <CircularLoading />
  ) : (
    <DocumentsView
      documents={allDocuments}
      fetchNextPage={fetchNextPage}
      totalDocumentsCount={total}
    />
  );
}

export default AllDocuments;
