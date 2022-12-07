import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ExtendedPalette, palette, paletteExtended } from './overides/palette';
import breakpoints from './overides/breakpoints';
import typography from './overides/typography';

declare module '@mui/material/styles' {
  interface Theme {
    paletteExtended: ExtendedPalette;
  }
  interface ThemeOptions {
    paletteExtended: ExtendedPalette;
  }
}

const theme = responsiveFontSizes(
  createTheme({
    palette: palette,
    paletteExtended: paletteExtended,
    breakpoints,
    typography,
  }),
);

export default theme;
