'use client';

import React, { ReactNode } from 'react';
import LoggedAuthProvider from './providers/LoggedAuthProvider';
import { LoggedSidebar } from '../../components/layoutComponents/sidebar/LoggedSidebar';
import { useSession } from '../../stores/hooks/user.hooks';
import Stack from '../../components/muiOverrides/Stack';

interface Props {
  children: ReactNode;
}

function LoggedLayout({ children }: Props) {
  const { data: user, isLoading } = useSession();

  return (
    <LoggedAuthProvider>
      <Stack direction={'row'}>
        <LoggedSidebar user={user} isLoading={isLoading} />
        {children}
      </Stack>
    </LoggedAuthProvider>
  );
}

export default LoggedLayout;
