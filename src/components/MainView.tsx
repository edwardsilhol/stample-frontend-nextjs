'use client';

import React from 'react';
import Stack from './muiOverrides/Stack';
import { LoggedHeader } from './layoutComponents/header/LoggedHeader';
import { AllDocuments } from './view/AllDocuments';
import { CreateDocumentForm } from './forms/document/CreateDocumentForm';

type MainViewProps = Record<string, never>;
export const MainView: React.FC<MainViewProps> = () => {
  const [toggledAddButton, setToggledAddButton] =
    React.useState<boolean>(false);

  return (
    <Stack
      direction="column"
      flex={1}
      height="100vh"
      sx={{ overflowX: 'hidden' }}
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
