'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../stores/hooks/user.hooks';
import { TEAM_ROUTE } from '../constants/routes.constant';

interface Props {
  children: ReactNode;
}

function GuestAuthProvider({ children }: Props) {
  const { data: user, isLoading: isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(TEAM_ROUTE);
    }
  });

  return !isLoading && !user ? <>{children}</> : <></>;
}

export default GuestAuthProvider;
