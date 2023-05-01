import { PluginOption } from 'vite';

export default (): PluginOption => ({
  name: 'remove-preloads',
  enforce: 'post',
  transformIndexHtml(html) {
    return html.replace(
      /\s*(<link rel="(?:module)?preload".*?>)\s*/gi,

      () => {
        return '';
      },
    );
  },
});
