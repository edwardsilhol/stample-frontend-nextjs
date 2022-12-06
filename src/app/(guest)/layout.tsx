'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from '../../stores/hooks/user';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
}

function RootLayout({ children }: Props) {
  const { data: user, isLoading: isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  });

  return !isLoading && !user ? <>{children}</> : <></>;
}

export default RootLayout;
