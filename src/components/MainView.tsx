'use client';

import React from 'react';
import Stack from './muiOverrides/Stack';
import { LoggedHeader } from './layoutComponents/header/LoggedHeader';
import { TagDocuments } from './view/TagDocuments';
import { AllDocuments } from './view/AllDocuments';
import { CreateDocumentForm } from './forms/document/CreateDocumentForm';

interface MainViewProps {
  tagId?: string;
}
export const MainView: React.FC<MainViewProps> = ({ tagId }) => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [toggledAddButton, setToggledAddButton] =
    React.useState<boolean>(false);

  return (
    <Stack direction={'column'} width={'100%'}>
      <LoggedHeader
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setToggledAddButton={() => setToggledAddButton(true)}
      />
      {!toggledAddButton ? (
        tagId ? (
          <TagDocuments tagId={tagId} searchValue={searchValue} />
        ) : (
          <AllDocuments searchValue={searchValue} />
        )
      ) : (
        <CreateDocumentForm />
      )}
    </Stack>
  );
};
