'use client';

import { ReactNode } from 'react';
import { default as MuiThemeProvider } from '@mui/material/styles/ThemeProvider';
import theme from '../../styles/theme/theme';
import CssBaseline from '@mui/material/CssBaseline';

interface Props {
  children: ReactNode;
  color: string;
}

function ThemeProvider({ children, color }: Props) {
  return (
    <MuiThemeProvider theme={theme(color)}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
