import '../styles/globals.css';
import { ReactNode } from 'react';
import FontProvider from './providers/fontProvider';
import ReactQueryProvider from './providers/reactQueryProvider';

interface Props {
  children: ReactNode;
}

function RootLayout({ children }: Props) {
  return (
    <html>
      <head />
      <body>
        <FontProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </FontProvider>
      </body>
    </html>
  );
}

export default RootLayout;
