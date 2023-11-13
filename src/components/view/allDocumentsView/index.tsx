'use client';

import { useSearchDocuments } from '../../../stores/hooks/document.hooks';
import DocumentsView, {
  DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID,
} from '../../document/DocumentsView';
import { useParams, useSearchParams } from 'next/navigation';
import { SEARCH_QUERY_PARAM } from '../../../constants/queryParams.constant';
import { useMemo, useState } from 'react';
import CircularLoading from '../../base/circularLoading';
import { RouteParams } from '../../../stores/types/global.types';
import Stack from '@mui/material/Stack/Stack';
import LoggedHeader from '../../headers/loggedHeader';

interface AllDocumentsViewProps {
  isDisplayed?: boolean;
}
function AllDocumentsView({ isDisplayed = true }: AllDocumentsViewProps) {
  const [hideDocuments, setHideDocuments] = useState<boolean>(false);
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

  return (
    <Stack
      direction="column"
      flex={1}
      sx={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: '100%',
        backgroundColor: hideDocuments
          ? 'white'
          : 'additionalColors.background',
        display: isDisplayed ? undefined : 'none',
      }}
      id={DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID}
    >
      {isLoading || isFetching ? (
        <CircularLoading />
      ) : (
        <>
          <LoggedHeader setHideDocuments={setHideDocuments} />
          {!hideDocuments && (
            <DocumentsView
              documents={allDocuments}
              fetchNextPage={fetchNextPage}
              totalDocumentsCount={total}
            />
          )}
        </>
      )}
    </Stack>
  );
}

export default AllDocumentsView;
