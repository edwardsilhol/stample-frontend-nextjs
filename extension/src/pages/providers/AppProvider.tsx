import React, { ReactNode } from 'react';
import ThemeProvider from './ThemeProvider';
import JotaiProvider from './JotaiProvider';
import ReactQueryProvider from './ReactQueryProvider';
interface Props {
  children: ReactNode;
}
export const AppProvider: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider tenantThemeConfig={{}}>
      <JotaiProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
};
