import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes';
import createTheme from '@mui/material/styles/createTheme';
import breakpoints from './breakpoints';
import typography from './typography';
import shape from './shape';
import card from './card';
import { shadows, shadowsExtended, ShadowsExtended } from './shadows';
import { palette } from './palette';
import { TenantThemeConfig } from '../../stores/types/tenantConfig.types';

declare module '@mui/material/styles' {
  interface Theme {
    shadowsExtended: ShadowsExtended;
  }
  interface ThemeOptions {
    shadowsExtended?: ShadowsExtended;
  }
}

const theme = (tenantThemeConfig: TenantThemeConfig, mode?: 'light' | 'dark') =>
  responsiveFontSizes(
    createTheme({
      palette: palette(tenantThemeConfig, mode || 'light'),
      breakpoints,
      components: {
        MuiCard: card,
      },
      typography,
      shape,
      shadows,
      shadowsExtended,
    }),
  );

export default theme;
