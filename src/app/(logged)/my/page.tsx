'use client';

import React from 'react';
import Stack from '../../../components/muiOverrides/Stack';
import { LoggedSidebar } from '../../../components/layoutComponents/sidebar/LoggedSidebar';
import { LoggedHeader } from '../../../components/layoutComponents/header/LoggedHeader';
import { useSession } from '../../../stores/hooks/user.hooks';
import { DocumentView } from '../../../components/layoutComponents/DocumentView';

const DefaultPage: React.FC = () => {
  const { data: user, isLoading } = useSession();
  const [selectedTag, setSelectedTag] = React.useState<string>('');
  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <Stack direction={'row'}>
      <LoggedSidebar
        user={user}
        isLoading={isLoading}
        setSelectedTag={setSelectedTag}
      />
      <Stack direction={'column'} width={'100%'}>
        <LoggedHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <DocumentView selectedTag={selectedTag} searchValue={searchValue} />
      </Stack>
    </Stack>
  );
};

export default DefaultPage;
