'use client';

import { useSearchedDocuments } from '../../stores/hooks/tanstackQuery/document.hooks';
import DocumentsView from '../document/DocumentsView';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

function AllDocuments() {
  const { allDocuments, isLoading, total, fetchNextPage } =
    useSearchedDocuments();

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
