'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from '../../../stores/hooks/user';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
}

function AuthProvider({ children }: Props) {
  const { data: user, isLoading } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signIn');
    }
  });

  return !isLoading && user ? <>{children}</> : <></>;
}

export default AuthProvider;
