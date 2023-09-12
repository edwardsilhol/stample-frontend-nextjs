import '../styles/globals.css';
import { ReactNode } from 'react';
import FontProvider from './providers/FontProvider';
import ReactQueryProvider from './providers/ReactQueryProvider';
import ThemeProvider from './providers/ThemeProvider';
import { cookies } from 'next/headers';
import { TenantConfig } from '../stores/types/tenantConfig.types';
import JotaiProvider from './providers/JotaiProvider';

interface Props {
  children: ReactNode;
}

async function getTenantConfig(): Promise<TenantConfig> {
  const primaryColor = await cookies().get('primaryColor');

  return {
    tenantThemeConfig: {
      primaryColor: primaryColor?.value,
    },
  };
}

async function RootLayout({ children }: Props) {
  const { tenantThemeConfig } = await getTenantConfig();
  return (
    <html style={{ height: '100%' }}>
      <head />
      <body style={{ height: '100%' }}>
        <FontProvider>
          <ThemeProvider tenantThemeConfig={tenantThemeConfig}>
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
