import React, { ReactNode } from 'react';
import GuestAuthProvider from './providers/guestAuthProvider';
interface Props {
  children: ReactNode;
}

function GuestLayout({ children }: Props) {
  return <GuestAuthProvider>{children}</GuestAuthProvider>;
}
export default GuestLayout;
