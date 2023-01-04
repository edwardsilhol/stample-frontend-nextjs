import '../styles/globals.css';
import { ReactNode } from 'react';
import FontProvider from './providers/fontProvider';
import ReactQueryProvider from './providers/reactQueryProvider';
import ThemeProvider from './providers/ThemeProvider';
import { cookies } from 'next/headers';
import { TenantConfig } from '../stores/types/tenantConfig.types';

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
    <html>
      <head />
      <body>
        <FontProvider>
          <ThemeProvider tenantThemeConfig={tenantThemeConfig}>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeProvider>
        </FontProvider>
      </body>
    </html>
  );
}

export default RootLayout;
