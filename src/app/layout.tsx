import { ReactNode } from 'react';
import FontProvider from '../providers/FontProvider';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import ThemeProvider from '../providers/ThemeProvider';

export const metadata = {
  title: 'Stample',
  icons: { icon: '/favicon.ico' },
  viewport:
    'width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover',
};

interface Props {
  children: ReactNode;
}

async function RootLayout({ children }: Props) {
  return (
    <html style={{ height: '100%' }}>
      <body style={{ height: '100%' }}>
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
