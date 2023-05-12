'use client';

import React from 'react';
import Stack from './muiOverrides/Stack';
import { LoggedHeader } from './layoutComponents/header/LoggedHeader';
import { AllDocuments } from './view/AllDocuments';
import { CreateDocumentForm } from './forms/document/CreateDocumentForm';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from './document/DocumentsView';
import { useIsMobile } from 'utils/hooks/useIsMobile';

type MainViewProps = Record<string, never>;
export const MainView: React.FC<MainViewProps> = () => {
  const [toggledAddButton, setToggledAddButton] =
    React.useState<boolean>(false);
  const isMobile = useIsMobile();
  return (
    <Stack
      direction="column"
      flex={1}
      sx={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        ml: isMobile ? 0 : '199px',
        height: '100vh',
      }}
      id={DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID}
    >
      <LoggedHeader
        addButtonToggled={toggledAddButton}
        setToggledAddButton={setToggledAddButton}
      />
      {!toggledAddButton ? (
        <AllDocuments />
      ) : (
        <CreateDocumentForm onClose={() => setToggledAddButton(false)} />
      )}
    </Stack>
  );
};
