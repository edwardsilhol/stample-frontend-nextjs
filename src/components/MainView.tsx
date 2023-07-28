'use client';

import React from 'react';
import Stack from './muiOverrides/Stack';
import { LoggedHeader } from './layoutComponents/header/LoggedHeader';
import { AllDocuments } from './view/AllDocuments';
import { CreateDocumentForm } from './forms/document/CreateDocumentForm';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from './document/DocumentsView';

type MainViewProps = Record<string, never>;
export const MainView: React.FC<MainViewProps> = () => {
  const [toggledAddButton, setToggledAddButton] =
    React.useState<boolean>(false);
  return (
    <Stack
      direction="column"
      flex={1}
      sx={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: '100vh',
        backgroundColor: toggledAddButton
          ? 'white'
          : 'additionalColors.background',
      }}
      id={DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID}
    >
      {!toggledAddButton ? (
        <LoggedHeader
          addButtonToggled={toggledAddButton}
          setToggledAddButton={setToggledAddButton}
        />
      ) : null}
      {!toggledAddButton ? (
        <AllDocuments />
      ) : (
        <CreateDocumentForm onClose={() => setToggledAddButton(false)} />
      )}
    </Stack>
  );
};
