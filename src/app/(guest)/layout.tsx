import React, { ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

function GuestLayout({ children }: Props) {
  return <>{children}</>;
}
export default GuestLayout;
