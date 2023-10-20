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
import { Preview } from '@storybook/react';

const THEMES = {
  light: theme('light'),
  dark: theme('dark'),
};

export const withProviders = (Story: any, context: any) => {
  const { theme: themeKey } = context.globals;
  const queryClient = new QueryClient();

  const theme = useMemo(
    () => THEMES[themeKey as keyof typeof THEMES] || THEMES['light'],
    [themeKey],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </MuiThemeProvider>
    </QueryClientProvider>
  );
};

const preview: Preview = {
  globalTypes: {
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
  },
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withProviders],
};
export default preview;
