'use client';

import { ReactNode } from 'react';
import LoggedSidebar from '../../../components/layoutComponents/sidebar/LoggedSidebar';
import { useSession } from '../../../stores/hooks/tanstackQuery/user.hooks';
import Stack from '@mui/material/Stack';
import { useCurrentlyViewedDocumentId } from '../../../stores/hooks/jotai/document.hooks';
interface Props {
  children: ReactNode;
  main: ReactNode;
  document: ReactNode;
}
function LoggedLayout({ children, main, document }: Props) {
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
      {documentId ? document : main}
    </Stack>
  );
}

export default LoggedLayout;
