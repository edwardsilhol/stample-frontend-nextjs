'use client';

import { ReactNode } from 'react';
import LoggedSidebar from '../../../../../components/layoutComponents/sidebar/LoggedSidebar';
import Stack from '@mui/material/Stack';
import { useParams } from 'next/navigation';
import { RouteParams } from '../../../../../stores/types/global.types';
interface Props {
  children: ReactNode;
}
function LoggedLayout({ children }: Props) {
  const { documentId } = useParams<RouteParams>();
  return (
    <Stack
      direction="row"
      bgcolor={!!documentId ? undefined : 'additionalColors.sidebarBackground'}
      sx={{ height: '100%' }}
    >
      <LoggedSidebar />
      {children}
    </Stack>
  );
}

export default LoggedLayout;
