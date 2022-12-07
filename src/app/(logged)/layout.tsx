import { ReactNode } from 'react';
import AuthProvider from './providers/authProvider';

interface Props {
  children: ReactNode;
}

function LoggedLayout({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default LoggedLayout;
