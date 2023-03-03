'use client';

import React from 'react';
import Stack from './muiOverrides/Stack';
import { LoggedHeader } from './layoutComponents/header/LoggedHeader';
import { TagDocuments } from './view/TagDocuments';
import { AllDocuments } from './view/AllDocuments';

interface MainViewProps {
  tagId?: string;
}
export const MainView: React.FC<MainViewProps> = ({ tagId }) => {
  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <Stack direction={'column'} width={'100%'}>
      <LoggedHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      {tagId ? (
        <TagDocuments tagId={tagId} searchValue={searchValue} />
      ) : (
        <AllDocuments searchValue={searchValue} />
      )}
    </Stack>
  );
};
