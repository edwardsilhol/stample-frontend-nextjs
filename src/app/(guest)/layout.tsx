import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function RootLayout({ children }: Props) {
  return <>{children}</>;
}

export default RootLayout;
