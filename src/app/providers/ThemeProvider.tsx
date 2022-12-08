'use client';

import { ReactNode } from 'react';
import { default as MuiThemeProvider } from '@mui/material/styles/ThemeProvider';
import theme from '../../constants/theme/theme';
import CssBaseline from '@mui/material/CssBaseline';

interface Props {
  children: ReactNode;
}

function ThemeProvider({ children }: Props) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
