import { yellow } from '@mui/material/colors';
import { PaletteOptions } from '@mui/material/styles/createPalette';
import { TenantThemeConfig } from '../../stores/types/tenantConfig.types';

export interface ExtendedPalette {
  additionalColors: {
    additionalMain: string;
    link: string;
    sidebarBackground: string;
    chip: string;
  };
}

const lightPaletteExtended: ExtendedPalette = {
  additionalColors: {
    additionalMain: '#1976d2',
    link: '#1976d2',
    sidebarBackground: '#f6f5f4',
    chip: '#fff59d',
  },
};

const darkPaletteExtended: ExtendedPalette = {
  additionalColors: {
    additionalMain: '#00070e',
    link: '#1976d2',
    sidebarBackground: '#f6f5f4',
    chip: yellow[400],
  },
};

export function palette(
  mode: 'light' | 'dark',
  tenantThemeConfig?: TenantThemeConfig,
): PaletteOptions & ExtendedPalette {
  if (mode === 'light') {
    return {
      mode: 'light',
      primary: {
        main: tenantThemeConfig?.primaryColor || '#1976d2',
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
      action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
      },
      divider: 'rgba(2,2,2,0.12)',
      ...lightPaletteExtended,
    };
  } else {
    return {
      mode: 'light',
      primary: {
        main: tenantThemeConfig?.primaryColor || '#1976d2',
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
      action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
      },
      divider: 'rgba(2,2,2,0.12)',
      ...darkPaletteExtended,
    };
  }
}
