import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';
import { QueryClient } from '@tanstack/react-query';
import { Preview } from '@storybook/react';
import ThemeProvider from '../src/providers/ThemeProvider';
import ReactQueryProvider from '../src/providers/ReactQueryProvider';

export const withProviders = (Story: any, context: any) => {
  const { theme: themeKey } = context.globals;
  return (
    <ThemeProvider themeKey={themeKey}>
      <ReactQueryProvider>
        <Story />
      </ReactQueryProvider>
    </ThemeProvider>
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
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [withProviders],
};
export default preview;
