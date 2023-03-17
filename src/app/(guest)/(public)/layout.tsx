'use client';

import React, { ReactNode } from 'react';
import GuestAuthProvider from '../(auth)/providers/guestAuthProvider';

interface Props {
  children: ReactNode;
}

function PublicLayout({ children }: Props) {
  return <GuestAuthProvider>{children}</GuestAuthProvider>;
}
export default PublicLayout;
