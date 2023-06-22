import { ReactNode } from 'react';
import { default as MuiThemeProvider } from '@mui/material/styles/ThemeProvider';
import theme from '../../styles/theme/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { TenantThemeConfig } from '../../stores/types/tenantConfig.types';

interface Props {
  children: ReactNode;
  tenantThemeConfig?: TenantThemeConfig;
}

function ThemeProvider({ children, tenantThemeConfig }: Props) {
  return (
    <MuiThemeProvider theme={theme(tenantThemeConfig)}>
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
