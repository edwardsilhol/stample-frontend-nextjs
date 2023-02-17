'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from '../../../stores/hooks/user.hooks';
import { useRouter } from 'next/navigation';
import Stack from '../../../components/muiOverrides/Stack';
import { LoggedSidebar } from '../../../components/layoutComponents/LoggedSidebar';
import { LoggedHeader } from '../../../components/layoutComponents/header/LoggedHeader';

interface Props {
  children: ReactNode;
}

function LoggedAuthProvider({ children }: Props) {
  const { data: user, isLoading } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  });

  return !isLoading && user ? (
    <Stack direction={'row'} height={'100%'}>
      <LoggedSidebar firstName={user.firstName} lastName={user.lastName} />
      <Stack direction={'column'} width={'100%'}>
        <LoggedHeader />
        {children}
      </Stack>
    </Stack>
  ) : (
    <></>
  );
}

export default LoggedAuthProvider;
