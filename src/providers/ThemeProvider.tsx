'use client';

import { ReactNode } from 'react';
import { default as MuiThemeProvider } from '@mui/material/styles/ThemeProvider';
import theme from '../styles/theme/theme';
import CssBaseline from '@mui/material/CssBaseline';

interface Props {
  children: ReactNode;
  themeKey?: 'light' | 'dark';
}

function ThemeProvider({ children, themeKey }: Props) {
  return (
    <MuiThemeProvider theme={theme(themeKey)}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
