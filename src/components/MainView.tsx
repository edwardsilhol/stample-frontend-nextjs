'use client';

import { useState } from 'react';
import AllDocuments from './view/AllDocuments';
import CreateDocumentForm from './forms/document/CreateDocumentForm';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from './document/DocumentsView';
import Stack from '@mui/material/Stack';
import LoggedHeader from './layoutComponents/header/LoggedHeader';

interface MainViewProps {
  isDisplayed?: boolean;
}
function MainView({ isDisplayed = true }: MainViewProps) {
  const [toggledAddButton, setToggledAddButton] = useState<boolean>(false);
  return (
    <Stack
      direction="column"
      flex={1}
      sx={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: '100%',
        backgroundColor: toggledAddButton
          ? 'white'
          : 'additionalColors.background',
        display: isDisplayed ? undefined : 'none',
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
}

export default MainView;
