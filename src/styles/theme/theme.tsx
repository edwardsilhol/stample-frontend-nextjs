import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes';
import createTheme from '@mui/material/styles/createTheme';
import breakpoints from './breakpoints';
import typography from './typography';
import shape from './shape';
import card from './card';
import textField from './textField';
import button from './button';
import { shadows, shadowsExtended, ShadowsExtended } from './shadows';
import { ExtendedPalette, palette } from './palette';
import { TenantThemeConfig } from '../../stores/types/tenantConfig.types';

declare module '@mui/material/styles' {
  interface Theme {
    palette?: PaletteOptions;
    shadowsExtended: ShadowsExtended;
  }
  interface ThemeOptions {
    palette?: PaletteOptions;
    shadowsExtended?: ShadowsExtended;
  }

  interface Palette {
    additionalColors: ExtendedPalette['additionalColors'];
  }

  interface PaletteOptions {
    additionalColors: ExtendedPalette['additionalColors'];
  }
}

const theme = (tenantThemeConfig: TenantThemeConfig, mode?: 'light' | 'dark') =>
  responsiveFontSizes(
    createTheme({
      palette: palette(tenantThemeConfig, mode || 'light'),
      breakpoints,
      components: {
        MuiCard: card,
        MuiTextField: textField,
        MuiButton: button,
      },
      typography,
      shape,
      shadows,
      shadowsExtended,
    }),
  );

export default theme;
