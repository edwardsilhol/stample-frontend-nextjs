'use client';

import { useSearchedDocuments } from '../../stores/hooks/document.hooks';
import DocumentsView from '../document/DocumentsView';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams, useSearchParams } from 'next/navigation';
import { SEARCH_QUERY_PARAM } from '../../constants/queryParams.constant';

function AllDocuments() {
  const { teamId, tagId } = useParams();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get(SEARCH_QUERY_PARAM);
  const { allDocuments, isLoading, total, fetchNextPage } =
    useSearchedDocuments(
      teamId as string,
      tagId as string,
      searchQuery as string,
    );

  return isLoading ? (
    <Stack justifyContent="center" alignItems="center" flexGrow={1}>
      <CircularProgress />
    </Stack>
  ) : (
    <DocumentsView
      documents={allDocuments}
      fetchNextPage={fetchNextPage}
      totalDocumentsCount={total}
    />
  );
}

export default AllDocuments;
