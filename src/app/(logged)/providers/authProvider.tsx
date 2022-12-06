'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from '../../../stores/hooks/user';

interface Props {
  children: ReactNode;
}

function AuthProvider({ children }: Props) {
  const { data: user, isLoading } = useSession();
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/signIn';
    }
  });

  return !isLoading && user ? <>{children}</> : <></>;
}

export default AuthProvider;
