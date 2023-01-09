import { ReactNode } from 'react';
import LoggedAuthProvider from './providers/loggedAuthProvider';

import WorspaceSidebar from '../../components/sidebars/workspaceSidebar/WorkspaceSidebar';
import Box from '../../components/muiOverrides/Box';
import GeneralTopbar from '../../components/topbars/GeneralTopbar';

interface Props {
  children: ReactNode;
}

function LoggedLayout({ children }: Props) {
  return (
    <LoggedAuthProvider>
      <Box>
        <Box m={0}>
          <WorspaceSidebar />
        </Box>
        <Box>
          <GeneralTopbar />
          {children}
        </Box>
      </Box>
    </LoggedAuthProvider>
  );
}

export default LoggedLayout;
