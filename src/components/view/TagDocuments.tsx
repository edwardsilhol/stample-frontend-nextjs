'use client';

import React from 'react';
import { useDocumentByTag } from '../../stores/hooks/document.hooks';
import { DocumentsView } from '../layoutComponents/document/DocumentsView';
import Stack from '../muiOverrides/Stack';
import { CircularProgress } from '@mui/material';

interface Props {
  tagId: string;
  searchValue: string;
}
export const TagDocuments: React.FC<Props> = ({ tagId, searchValue }) => {
  const { data: documents, isLoading } = useDocumentByTag(tagId);

  return isLoading ? (
    <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
      <CircularProgress />
    </Stack>
  ) : (
    <DocumentsView
      searchValue={searchValue}
      documents={documents}
      tagId={tagId}
    />
  );
};
