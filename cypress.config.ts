import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  env: {
    NEXT_PUBLIC_NODE_ENV: 'development',
    NEXT_PUBLIC_API_URL: 'http://localhost:3000',
    NEXT_PUBLIC_APP_API_URL: 'http://localhost:9000/dev/',
  },
  chromeWebSecurity: false,
  video: false,
});
