'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../stores/hooks/user.hooks';

interface Props {
  children: ReactNode;
}

function LoggedAuthProvider({ children }: Props) {
  const { data: user, isLoading } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signIn');
    }
  });

  return !isLoading && user ? <>{children}</> : <></>;
}

export default LoggedAuthProvider;
