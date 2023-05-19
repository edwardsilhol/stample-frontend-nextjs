import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { getManifest } from './manifest';
import webExtension from '@samrum/vite-plugin-web-extension';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');

export default defineConfig(() => {
  const manifestVersion = Number(process.env.MANIFEST_VERSION ?? 3);
  return {
    build: {
      outDir: `${process.env.OUT_DIR ?? 'dist'}/v${manifestVersion}`,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
      minify: false,
    },
    resolve: {
      alias: {
        '@src': root,
        '@assets': assetsDir,
        '@pages': pagesDir,
      },
    },
    define: {
      MANIFEST_VERSION: manifestVersion,
    },
    plugins: [
      react(),
      webExtension({
        manifest: getManifest(manifestVersion),
        useDynamicUrlWebAccessibleResources: true,
      }),
    ],
  };
});
