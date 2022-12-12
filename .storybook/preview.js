import CssBaseline from '@mui/material/CssBaseline';
import { default as MuiThemeProvider } from '@mui/material/styles/ThemeProvider';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';
import { useMemo } from 'react';
import theme from '../src/styles/theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const globalTypes = {
  theme: {
    name: 'Theme',
    title: 'Theme',
    description: 'Theme for your components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      dynamicTitle: true,
      items: [
        { value: 'light', left: '☀️', title: 'Light mode' },
        { value: 'dark', left: '🌙', title: 'Dark mode' },
      ],
    },
  },
};
export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

/* snipped for brevity */

const THEMES = {
  light: theme('light'),
  dark: theme('dark'),
};

export const withProviders = (Story, context) => {
  // The theme global we just declared
  const { theme: themeKey } = context.globals;
  const queryClient = new QueryClient();

  // only recompute the theme if the themeKey changes
  const theme = useMemo(() => THEMES[themeKey] || THEMES['light'], [themeKey]);

  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </MuiThemeProvider>
    </QueryClientProvider>
  );
};

export const decorators = [withProviders];
