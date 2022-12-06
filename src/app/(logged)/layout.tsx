import { ReactNode } from 'react';
import AuthProvider from './providers/authProvider';

interface Props {
  children: ReactNode;
}

function RootLayout({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default RootLayout;
