'use client';

import React from 'react';
import { useSearchDocuments } from '../../stores/hooks/document.hooks';
import { DocumentsView } from '../document/DocumentsView';
import Stack from '../muiOverrides/Stack';
import { CircularProgress } from '@mui/material';
import { useSelectedTagId } from 'stores/data/tag.data';
import { useSearchDocumentsQuery } from 'stores/data/document.data';
import { useSelectedTeamId } from 'stores/data/team.data';

export const AllDocuments: React.FC = () => {
  const [selectedTeamId] = useSelectedTeamId();
  const [selectedTagId] = useSelectedTagId();
  const [searchDocumentsQuery] = useSearchDocumentsQuery();
  const { data: documents, isLoading } = useSearchDocuments({
    ...(searchDocumentsQuery
      ? {
          text: searchDocumentsQuery,
        }
      : {}),
    tags: selectedTagId ? [selectedTagId] : undefined,
    team: selectedTeamId ? selectedTeamId : undefined,
  });

  return isLoading ? (
    <Stack justifyContent="center" alignItems="center" flexGrow={1}>
      <CircularProgress />
    </Stack>
  ) : (
    <DocumentsView documents={documents} tagId={selectedTagId} />
  );
};
