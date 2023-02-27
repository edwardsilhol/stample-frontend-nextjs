'use client';

import React, { ReactNode } from 'react';
import LoggedAuthProvider from './providers/LoggedAuthProvider';
import Stack from '../../components/muiOverrides/Stack';
import { LoggedSidebar } from '../../components/layoutComponents/LoggedSidebar';
import { LoggedHeader } from '../../components/layoutComponents/header/LoggedHeader';
import { useSession } from '../../stores/hooks/user.hooks';

interface Props {
  children: ReactNode;
}

function LoggedLayout({ children }: Props) {
  const { data: user, isLoading } = useSession();

  return (
    <LoggedAuthProvider>
      <Stack direction={'row'} height={'100%'}>
        <LoggedSidebar user={user} isLoading={isLoading} />
        <Stack direction={'column'} width={'100%'}>
          <LoggedHeader />
          {children}
        </Stack>
      </Stack>
    </LoggedAuthProvider>
  );
}

export default LoggedLayout;
