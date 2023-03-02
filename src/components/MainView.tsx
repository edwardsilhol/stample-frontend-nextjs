'use client';

import React from 'react';
import Stack from './muiOverrides/Stack';
import { LoggedHeader } from './layoutComponents/header/LoggedHeader';
import { DocumentsView } from './layoutComponents/document/DocumentsView';
import { DocumentView } from './layoutComponents/document/DocumentView';
import { useRawDocuments } from '../stores/hooks/document.hooks';
import { useRawTags } from '../stores/hooks/tag.hooks';
import { CircularProgress } from '@mui/material';

interface MainViewProps {
  tagId?: string;
}
export const MainView: React.FC<MainViewProps> = ({ tagId }) => {
  const { data: documents, isLoading: isDocumentsLoading } = useRawDocuments();
  const { data: tags, isLoading: isTagsLoading } = useRawTags();
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [documentId, setDocumentId] = React.useState<string>('');
  const showDocument = documentId ? documentId !== '' : false;
  const selectedDocument = documents?.find(
    (document) => document._id === documentId,
  );

  return (
    <Stack direction={'row'} width={'100%'}>
      <Stack direction={'column'} width={showDocument ? '420px' : '100%'}>
        <LoggedHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        {isDocumentsLoading || isTagsLoading ? (
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <DocumentsView
            documents={documents || []}
            tags={tags || []}
            tagId={tagId}
            searchValue={searchValue}
            setDocumentId={setDocumentId}
            showDocument={showDocument}
          />
        )}
      </Stack>
      {showDocument && (
        <DocumentView
          document={selectedDocument}
          setDocumentId={setDocumentId}
          tags={tags || []}
        />
      )}
    </Stack>
  );
};
