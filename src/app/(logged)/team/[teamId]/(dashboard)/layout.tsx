'use client';

import { ReactNode } from 'react';
import LoggedSidebar from '../../../../../components/bars/loggedSideBar';
import Stack from '@mui/material/Stack';
import { useParams } from 'next/navigation';
import { RouteParams } from '../../../../../stores/types/global.types';
import { useIsMobile } from '../../../../../utils/hooks/useIsMobile';
import Box from '@mui/material/Box';

interface Props {
  children: ReactNode;
}
function DashboardLayout({ children }: Props) {
  const { documentId } = useParams<RouteParams>();
  return (
    <Stack
      direction="row"
      bgcolor={!!documentId ? undefined : 'additionalColors.sidebarBackground'}
    >
      <LoggedSidebar />
      {children}
    </Stack>
  );
}

export default DashboardLayout;
