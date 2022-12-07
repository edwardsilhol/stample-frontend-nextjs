import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ExtendedPalette, palette, paletteExtended } from './overides/palette';
import breakpoints from './overides/breakpoints';
import typography from './overides/typography';
import shape from './overides/shape';
import { shadows, shadowsExtended, ShadowsExtended } from './overides/shadows';

declare module '@mui/material/styles' {
  interface Theme {
    paletteExtended: ExtendedPalette;
    shadowsExtended: ShadowsExtended;
  }
  interface ThemeOptions {
    paletteExtended: ExtendedPalette;
    shadowsExtended?: ShadowsExtended;
  }
}

const theme = responsiveFontSizes(
  createTheme({
    palette,
    paletteExtended,
    breakpoints,
    typography,
    shape,
    shadows,
    shadowsExtended,
  }),
);

export default theme;
