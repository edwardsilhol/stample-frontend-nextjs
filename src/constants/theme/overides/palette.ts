import { PaletteOptions } from '@mui/material/styles/createPalette';

export interface ExtendedPalette {
  additionalColors: {
    additionalMain: string;
  };
}

export const paletteExtended: PaletteOptions & ExtendedPalette = {
  additionalColors: {
    additionalMain: '#FF0000',
  },
};

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#1976d2',
    light: '#4791dc',
    dark: '#115294',
    contrastText: '#fffffe',
  },
  secondary: {
    main: '#f50057',
    light: '#f73377',
    dark: '#ab003b',
    contrastText: '#fffffe',
  },
  text: {
    primary: 'rgba(0,0,0,0.88)',
    secondary: 'rgba(0,0,0,0.61)',
    disabled: 'rgba(0,0,0,0.39)',
  },
  error: {
    main: '#c10505',
    light: '#cd3736',
    dark: '#830303',
    contrastText: '#fdfafa',
  },
  warning: {
    main: '#f16d02',
    light: '#f18934',
    dark: '#a84d03',
    contrastText: '#f7f4f4',
  },
  success: {
    main: '#29732c',
    light: '#508a53',
    dark: '#1d541f',
    contrastText: '#f7f3f3',
  },
  divider: 'rgba(2,2,2,0.12)',
};
