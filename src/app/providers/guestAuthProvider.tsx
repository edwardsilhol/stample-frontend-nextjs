'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../stores/hooks/tanstackQuery/user.hooks';

interface Props {
  children: ReactNode;
}

function GuestAuthProvider({ children }: Props) {
  const { data: user, isLoading: isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/me');
    }
  });

  return !isLoading && !user ? <>{children}</> : <></>;
}

export default GuestAuthProvider;
