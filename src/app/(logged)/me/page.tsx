import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
function DefaultPage({ children }: Props) {
  return <>{children}</>;
}

export default DefaultPage;
