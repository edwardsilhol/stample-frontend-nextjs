'use client';

import React from 'react';
import Stack from './muiOverrides/Stack';
import { LoggedHeader } from './layoutComponents/header/LoggedHeader';
import { DocumentsView } from './layoutComponents/document/DocumentsView';
import { DocumentView } from './layoutComponents/document/DocumentView';

interface MainViewProps {
  tagId?: string;
}
export const MainView: React.FC<MainViewProps> = ({ tagId }) => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [documentId, setDocumentId] = React.useState<string>('');
  const showDocument = documentId && documentId !== '';

  return (
    <Stack direction={'row'} width={'100%'}>
      <Stack direction={'column'} width={showDocument ? '420px' : '100%'}>
        <LoggedHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <DocumentsView
          tagId={tagId}
          searchValue={searchValue}
          setDocumentId={setDocumentId}
        />
      </Stack>
      {showDocument && (
        <DocumentView documentId={documentId} setDocumentId={setDocumentId} />
      )}
    </Stack>
  );
};
