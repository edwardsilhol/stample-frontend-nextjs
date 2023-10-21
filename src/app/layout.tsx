import { ReactNode } from 'react';
import FontProvider from '../providers/FontProvider';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import ThemeProvider from '../providers/ThemeProvider';
import JotaiProvider from '../providers/JotaiProvider';

interface Props {
  children: ReactNode;
}

async function RootLayout({ children }: Props) {
  return (
    <html style={{ height: '100%' }}>
      <head />
      <body style={{ height: '100%' }}>
        <FontProvider>
          <ThemeProvider>
            <JotaiProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </JotaiProvider>
          </ThemeProvider>
        </FontProvider>
      </body>
    </html>
  );
}

export default RootLayout;
