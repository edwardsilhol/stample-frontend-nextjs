import React, { ReactNode } from 'react';
import GuestAuthProvider from '../../providers/guestAuthProvider';
interface Props {
  children: ReactNode;
}

function AuthLayout({ children }: Props) {
  return <GuestAuthProvider>{children}</GuestAuthProvider>;
}
export default AuthLayout;
