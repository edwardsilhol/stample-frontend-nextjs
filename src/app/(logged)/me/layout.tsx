'use client';

import React, { ReactNode } from 'react';
import { LoggedSidebar } from '../../../components/layoutComponents/sidebar/LoggedSidebar';
import { useSession } from '../../../stores/hooks/user.hooks';
import Stack from '../../../components/muiOverrides/Stack';
import { useCurrentlyViewedDocumentId } from 'stores/data/document.data';

interface Props {
  children: ReactNode;
}
function LoggedLayout({ children }: Props) {
  const { data: user, isLoading } = useSession();
  const [documentId] = useCurrentlyViewedDocumentId();
  return (
    <Stack
      direction="row"
      bgcolor={!!documentId ? undefined : 'additionalColors.sidebarBackground'}
      sx={{ height: '100%' }}
    >
      <LoggedSidebar user={user} isLoading={isLoading} />
      {children}
    </Stack>
  );
}

export default LoggedLayout;
