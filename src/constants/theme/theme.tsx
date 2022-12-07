import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { palette } from './overides/palette';
import breakpoints from './overides/breakpoints';
import typography from './overides/typography';
import shape from './overides/shape';
import { shadows, shadowsExtended, ShadowsExtended } from './overides/shadows';

declare module '@mui/material/styles' {
  interface Theme {
    shadowsExtended: ShadowsExtended;
  }
  interface ThemeOptions {
    shadowsExtended?: ShadowsExtended;
  }
}

const theme = responsiveFontSizes(
  createTheme({
    palette,
    breakpoints,
    typography,
    shape,
    shadows,
    shadowsExtended,
  }),
);

export default theme;
