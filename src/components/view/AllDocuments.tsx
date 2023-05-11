'use client';

import React from 'react';
import { useSearchedDocuments } from '../../stores/hooks/document.hooks';
import { DocumentsView } from '../document/DocumentsView';
import Stack from '../muiOverrides/Stack';
import { CircularProgress } from '@mui/material';

export const AllDocuments: React.FC = () => {
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
};
