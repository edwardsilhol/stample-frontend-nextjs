import { ReactNode } from 'react';
import LoggedAuthProvider from './providers/loggedAuthProvider';
import WorspaceSidebar from '../../components/sidebars/workspaceSidebar/WorkspaceSidebar';

interface Props {
  children: ReactNode;
}

function LoggedLayout({ children }: Props) {
  return (
    <LoggedAuthProvider>
      <WorspaceSidebar open>{children}</WorspaceSidebar>
    </LoggedAuthProvider>
  );
}

export default LoggedLayout;
