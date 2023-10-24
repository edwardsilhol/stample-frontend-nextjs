'use client';

import { ReactNode } from 'react';
import LoggedAuthProvider from '../../providers/LoggedAuthProvider';

interface Props {
  children: ReactNode;
}
function LoggedLayout({ children }: Props) {
  return <LoggedAuthProvider>{children}</LoggedAuthProvider>;
}

export default LoggedLayout;
