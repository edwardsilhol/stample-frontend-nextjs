'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from '../../../stores/hooks/user.hooks';
import { useRouter } from 'next/navigation';

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

  return !isLoading && user ? <>{children}</> : <></>;
}

export default LoggedAuthProvider;
