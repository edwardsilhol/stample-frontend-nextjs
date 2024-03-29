'use client';

import { ReactNode } from 'react';
import LoggedSidebar from '../../../../../components/bars/loggedSideBar';
import Stack from '@mui/material/Stack';
import { useParams } from 'next/navigation';
import { RouteParams } from '../../../../../stores/types/global.types';

interface Props {
  children: ReactNode;
}
function DashboardLayout({ children }: Props) {
  const { documentId } = useParams<RouteParams>();
  return (
    <Stack
      direction="row"
      bgcolor={!!documentId ? undefined : 'additionalColors.sidebarBackground'}
      height="100vh"
    >
      <LoggedSidebar />
      {children}
    </Stack>
  );
}

export default DashboardLayout;
