'use client';

import React from 'react';
import { useDocumentsBySelectedTeam } from '../../stores/hooks/document.hooks';
import { DocumentsView } from '../document/DocumentsView';
import Stack from '../muiOverrides/Stack';
import { CircularProgress } from '@mui/material';
import { useSelectedTagId } from 'stores/data/tags.data';

interface Props {
  searchValue: string;
}
export const AllDocuments: React.FC<Props> = ({ searchValue }) => {
  const { data: documents, isLoading } = useDocumentsBySelectedTeam();
  const [selectedTagId] = useSelectedTagId();

  return isLoading ? (
    <Stack justifyContent="center" alignItems="center" flexGrow={1}>
      <CircularProgress />
    </Stack>
  ) : (
    <DocumentsView
      searchValue={searchValue}
      documents={documents}
      tagId={selectedTagId}
    />
  );
};
