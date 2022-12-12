import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes';
import createTheme from '@mui/material/styles/createTheme';
import breakpoints from './breakpoints';
import typography from './typography';
import shape from './shape';
import { shadows, shadowsExtended, ShadowsExtended } from './shadows';
import { darkPalette, lightPalette } from './palette';

declare module '@mui/material/styles' {
  interface Theme {
    shadowsExtended: ShadowsExtended;
  }
  interface ThemeOptions {
    shadowsExtended?: ShadowsExtended;
  }
}

const theme = (mode: 'light' | 'dark') =>
  responsiveFontSizes(
    createTheme({
      palette: mode === 'light' ? lightPalette : darkPalette,
      breakpoints,
      typography,
      shape,
      shadows,
      shadowsExtended,
    }),
  );

export default theme;
