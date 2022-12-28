import '../styles/globals.css';
import { ReactNode } from 'react';
import FontProvider from './providers/fontProvider';
import ReactQueryProvider from './providers/reactQueryProvider';
import ThemeProvider from './providers/ThemeProvider';
import { cookies } from 'next/headers';

interface Props {
  children: ReactNode;
}

async function getCookies() {
  const theme = await cookies().get('theme');

  return { theme: theme?.value };
}

async function RootLayout({ children }: Props) {
  const { theme } = await getCookies();
  console.log('theme', theme);
  return (
    <html>
      <head />
      <body>
        <FontProvider>
          <ThemeProvider color={theme || '#000000'}>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeProvider>
        </FontProvider>
      </body>
    </html>
  );
}

export default RootLayout;
