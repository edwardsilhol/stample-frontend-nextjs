import browser from 'webextension-polyfill';
import { isManifestV2 } from './manifest';

export const getActiveBrowserTab =
  async (): Promise<browser.Tabs.Tab | null> => {
    return (
      await browser.tabs.query({ currentWindow: true, active: true })
    )?.[0];
  };

export const runScriptOnTab = async <T>(
  tab: browser.Tabs.Tab,
  script: () => T,
): Promise<T> => {
  const isV2 = isManifestV2();
  if (isV2) {
    const result = await browser.tabs.executeScript(tab.id, {
      code: `(${script})()`,
    });
    return result[0] as T;
  } else {
    const result = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: script,
    });
    return result[0].result as T;
  }
};
