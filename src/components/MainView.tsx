'use client';

import React from 'react';
import Stack from './muiOverrides/Stack';
import { LoggedHeader } from './layoutComponents/header/LoggedHeader';
import { AllDocuments } from './view/AllDocuments';
import { CreateDocumentForm } from './forms/document/CreateDocumentForm';

type MainViewProps = Record<string, never>;
export const MainView: React.FC<MainViewProps> = () => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [toggledAddButton, setToggledAddButton] =
    React.useState<boolean>(false);

  return (
    <Stack direction={'column'} width={'100%'}>
      <LoggedHeader
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        addButtonToggled={toggledAddButton}
        setToggledAddButton={setToggledAddButton}
      />
      {!toggledAddButton ? (
        <AllDocuments searchValue={searchValue} />
      ) : (
        <CreateDocumentForm />
      )}
    </Stack>
  );
};
