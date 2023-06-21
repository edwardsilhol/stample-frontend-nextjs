'use client';

import React, { ReactNode } from 'react';
import { LoggedSidebar } from '../../../components/layoutComponents/sidebar/LoggedSidebar';
import { useSession } from '../../../stores/hooks/user.hooks';
import Stack from '../../../components/muiOverrides/Stack';

interface Props {
  children: ReactNode;
}
function LoggedLayout({ children }: Props) {
  const { data: user, isLoading } = useSession();
  return (
    <Stack direction="row" sx={{ backgroundColor: 'white' }} height="100vh">
      <LoggedSidebar user={user} isLoading={isLoading} />
      {children}
    </Stack>
  );
}

export default LoggedLayout;
