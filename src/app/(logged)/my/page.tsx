'use client';

import React from 'react';
import Stack from '../../../components/muiOverrides/Stack';
import { LoggedSidebar } from '../../../components/layoutComponents/sidebar/LoggedSidebar';
import { LoggedHeader } from '../../../components/layoutComponents/header/LoggedHeader';
import { useSession } from '../../../stores/hooks/user.hooks';
import { DocumentView } from '../../../components/layoutComponents/DocumentView';
import { useRawDocuments } from '../../../stores/hooks/document.hooks';

const DefaultPage: React.FC = () => {
  const { data: user, isLoading } = useSession();
  const { data: documents, isLoading: isDocumentsLoading } = useRawDocuments();
  const [selectedTag, setSelectedTag] = React.useState<string>('');

  return (
    <Stack direction={'row'}>
      <LoggedSidebar
        user={user}
        isLoading={isLoading}
        setSelectedTag={setSelectedTag}
      />
      <Stack direction={'column'} width={'100%'}>
        <LoggedHeader documents={documents || []} />
        <DocumentView
          documents={documents}
          isDocumentsLoading={isDocumentsLoading}
          selectedTag={selectedTag}
        />
      </Stack>
    </Stack>
  );
};

export default DefaultPage;
