import packageJson from './package.json';

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icons/icon40.png',
  },
  icons: {
    '128': 'icons/icon128.png',
  },
  content_scripts: [
    {
      matches: ['https:/google.com/search*'],
      js: ['src/pages/content/index.js'],
      // KEY for cache invalidation
      css: [],
    },
  ],
  devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icons/*.png'],
      matches: ['*://*/*'],
    },
  ],
  permissions: ['activeTab', 'scripting', 'storage'],
  host_permissions: ['https://*/*'],
};

export default manifest;
