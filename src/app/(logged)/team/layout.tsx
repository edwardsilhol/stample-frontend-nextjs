'use client';

import { ReactNode } from 'react';
import LoggedSidebar from '../../../components/layoutComponents/sidebar/LoggedSidebar';
import { useSession } from '../../../stores/hooks/user.hooks';
import Stack from '@mui/material/Stack';
import { useParams } from 'next/navigation';
interface Props {
  children: ReactNode;
}
function LoggedLayout({ children }: Props) {
  const { documentId } = useParams();
  const { data: user, isLoading } = useSession();
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
