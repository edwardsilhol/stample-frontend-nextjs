'use client';

import { useSearchDocuments } from '../../stores/hooks/document.hooks';
import DocumentsView from '../document/DocumentsView';
import { useParams, useSearchParams } from 'next/navigation';
import { SEARCH_QUERY_PARAM } from '../../constants/queryParams.constant';
import { useMemo } from 'react';
import CircularLoading from '../base/circularLoading';

function AllDocuments() {
  const { teamId, tagId } = useParams();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get(SEARCH_QUERY_PARAM);
  const { data, isLoading, isFetching, fetchNextPage } = useSearchDocuments({
    ...(searchQuery
      ? {
          text: searchQuery,
        }
      : {}),
    ...(tagId ? { tags: [tagId] as string[] } : {}),
    team: teamId ? (teamId as string) : undefined,
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
