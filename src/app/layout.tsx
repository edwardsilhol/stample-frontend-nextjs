import '../styles/globals.css';
import { ReactNode } from 'react';
import FontProvider from './providers/fontProvider';
import ReactQueryProvider from './providers/reactQueryProvider';
import ThemeProvider from './providers/ThemeProvider';

interface Props {
  children: ReactNode;
}

function RootLayout({ children }: Props) {
  return (
    <html>
      <head />
      <body>
        <FontProvider>
          <ThemeProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeProvider>
        </FontProvider>
      </body>
    </html>
  );
}

export default RootLayout;
