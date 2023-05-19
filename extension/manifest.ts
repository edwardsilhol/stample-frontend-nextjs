import packageJson from './package.json';

const sharedManifest: Omit<
  chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3,
  'manifest_version' | 'name'
> = {
  content_scripts: [
    {
      matches: ['https://*.google.com/search?*'],
      js: ['src/pages/content/index.ts'],
    },
  ],
  icons: {
    '128': 'icons/icon128.png',
  },
  permissions: ['activeTab', 'storage'],
};

const browserAction = {
  default_popup: 'src/pages/popup/index.html',
  default_icon: 'icons/icon40.png',
};

const ManifestV2 = {
  ...sharedManifest,
  background: {
    scripts: ['src/pages/background/index.ts'],
    persistent: false,
  },
  browser_action: browserAction,
  permissions: [...sharedManifest.permissions, '*://*/*'],
  web_accessible_resources: [
    'assets/js/*.js',
    'assets/css/*.css',
    'icons/*.png',
  ],
};

const ManifestV3: Omit<chrome.runtime.ManifestV3, 'manifest_version'> = {
  ...sharedManifest,
  action: browserAction,
  background: {
    service_worker: 'src/pages/background/index.ts',
    type: 'module',
  },
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icons/*.png'],
      matches: ['*://*/*'],
    },
  ],
  permissions: [...sharedManifest.permissions, 'scripting'],
  host_permissions: ['*://*/*'],
};

export function getManifest(
  manifestVersion: number,
): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  const manifest = {
    description: packageJson.description,
    name: packageJson.name,
    version: packageJson.version,
  };

  if (manifestVersion === 2) {
    return {
      ...manifest,
      ...ManifestV2,
      manifest_version: manifestVersion,
    };
  }

  if (manifestVersion === 3) {
    return {
      ...manifest,
      ...ManifestV3,
      manifest_version: manifestVersion,
    };
  }

  throw new Error(
    `Missing manifest definition for manifestVersion ${manifestVersion}`,
  );
}

export default getManifest;
