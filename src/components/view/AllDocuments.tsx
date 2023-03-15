'use client';

import React from 'react';
import { useAllDocuments } from '../../stores/hooks/document.hooks';
import { DocumentsView } from '../layoutComponents/document/DocumentsView';
import Stack from '../muiOverrides/Stack';
import { CircularProgress } from '@mui/material';

interface Props {
  searchValue: string;
}
export const AllDocuments: React.FC<Props> = ({ searchValue }) => {
  const { data: documents, isLoading } = useAllDocuments();

  return isLoading ? (
    <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
      <CircularProgress />
    </Stack>
  ) : (
    <DocumentsView searchValue={searchValue} documents={documents} />
  );
};